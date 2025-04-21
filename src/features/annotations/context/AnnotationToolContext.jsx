'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AnnotationToolContext = createContext(null);

export function AnnotationToolProvider({ children, initialAnnotations = [], onCreate, onUpdate, onDelete, imageId }) {
  const [rectangles, setRectangles] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#F44336');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [modifiedRectangles, setModifiedRectangles] = useState(new Set());
  
  useEffect(() => {
    if (initialAnnotations.length > 0) {
      const loadedRectangles = initialAnnotations.map((annotation) => {
        const coordinates = annotation.coordinates || {};
        
        const rect = {
          id: annotation.id,
          x: coordinates.x || 0,
          y: coordinates.y || 0,
          width: coordinates.width || 100,
          height: coordinates.height || 100,
          color: annotation.color || '#F44336',
        };
        
        rect.original = { ...rect };
        delete rect.original.original;
        
        return rect;
      });
      
      setRectangles(loadedRectangles);
      setModifiedRectangles(new Set());
    }
  }, [initialAnnotations]);
  
  const handleImageLoad = useCallback((img) => {
    setImgDimensions({
      width: img.width,
      height: img.height,
    });
    
    const stageWidth = 1200;
    const stageHeight = 700;
    
    const scaleX = stageWidth / img.width;
    const scaleY = stageHeight / img.height;
    
    const fitScale = Math.min(scaleX, scaleY) * 0.9;
    
    const centerX = (stageWidth / 2 - (img.width * fitScale) / 2) / fitScale;
    const centerY = (stageHeight / 2 - (img.height * fitScale) / 2) / fitScale;
    
    setScale(fitScale);
    setPosition({ x: centerX, y: centerY });
  }, []);
  
  const handleColorChange = useCallback((color) => {
    setSelectedColor(color.hex);
    
    if (selectedId) {
      setRectangles(prev => 
        prev.map(r => {
          if (r.id === selectedId) {
            if (!r.isNew) {
              setModifiedRectangles(current => {
                const updated = new Set(current);
                updated.add(selectedId);
                return updated;
              });
            }
            
            return { ...r, color: color.hex };
          }
          return r;
        })
      );
    }
  }, [selectedId, setModifiedRectangles, setRectangles]);
  
  const handleRectangleSelect = useCallback((id) => {
    setSelectedId(id);
  }, []);
  
  const getNextId = useCallback(() => {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    return timestamp * 10000 + randomSuffix;
  }, []);
  
  const handleAddRectangle = useCallback((stageRef) => {
    if (!stageRef.current) return;

    const stage = stageRef.current;
    const pointerPos = stage.getPointerPosition();
    
    const x = (pointerPos ? pointerPos.x - 50 : stage.width() / 2 - 50) / scale - position.x;
    const y = (pointerPos ? pointerPos.y - 50 : stage.height() / 2 - 50) / scale - position.y;
    
    setRectangles(prev => {
      const nextId = getNextId();
      const newRect = {
        id: nextId,
        x: Math.max(0, x),
        y: Math.max(0, y),
        width: 100,
        height: 100,
        color: selectedColor,
        isNew: true,
      };
      
      const updated = [...prev, newRect];
      setSelectedId(nextId);
      return updated;
    });
  }, [scale, position, selectedColor, getNextId]);
  
  const handleDeleteSelected = useCallback(() => {
    if (!selectedId) return;
    
    const rect = rectangles.find(r => r.id === selectedId);
    if (rect && !rect.isNew) {
      onDelete(selectedId);
    }
    
    setRectangles(prev => prev.filter(r => r.id !== selectedId));
    setSelectedId(null);
    
    setModifiedRectangles(prev => {
      if (!prev.has(selectedId)) return prev;
      const newModified = new Set(prev);
      newModified.delete(selectedId);
      return newModified;
    });
  }, [selectedId, rectangles, onDelete]);
  
  const handleSaveAnnotations = useCallback(() => {
    const newRects = rectangles.filter(rect => rect.isNew);
    
    for (const rect of newRects) {
      console.log('New rectangle being saved:', rect);
      
      const annotation = {
        imageId: imageId,
        type: 'rectangle',
        coordinates: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        },
        color: rect.color,
        createdAt: new Date().toISOString(),
      };
      
      console.log('Creating new annotation:', annotation);
      onCreate(annotation);
    }

    const modifiedRects = rectangles.filter(rect => !rect.isNew && modifiedRectangles.has(rect.id));
    
    for (const rect of modifiedRects) {
      console.log('Modified rectangle being saved:', rect);
      
      const annotation = {
        id: rect.id,
        imageId: imageId,
        type: 'rectangle',
        coordinates: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        },
        color: rect.color,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Updating existing annotation:', annotation);
      onUpdate({id: rect.id, data: annotation});
    }

    setRectangles(prev => 
      prev.map(r => {
        if (r.isNew) {
          return { 
            ...r, 
            isNew: false,
            original: {
              x: r.x,
              y: r.y,
              width: r.width,
              height: r.height,
              color: r.color
            }
          };
        }
        if (modifiedRectangles.has(r.id)) {
          return { 
            ...r, 
            original: {
              x: r.x,
              y: r.y,
              width: r.width,
              height: r.height,
              color: r.color
            }
          };
        }
        return r;
      })
    );
    
    setModifiedRectangles(new Set());
  }, [rectangles, imageId, onCreate, onUpdate, modifiedRectangles]);
  
  const handleRectangleChange = useCallback((id, newAttrs) => {
    setRectangles(prev => 
      prev.map(r => {
        if (r.id === id) {
          if (!r.isNew) {
            setModifiedRectangles(current => {
              const updated = new Set(current);
              updated.add(id);
              return updated;
            });
          }
          
          return { ...r, ...newAttrs };
        }
        return r;
      })
    );
  }, [modifiedRectangles]);
  
  const hasUnsavedChanges = useCallback(() => {
    return rectangles.some(r => r.isNew) || modifiedRectangles.size > 0;
  }, [rectangles, modifiedRectangles]);
  
  const value = {
    rectangles,
    selectedId,
    selectedColor,
    scale,
    position,
    imgDimensions,
    modifiedRectangles,
    
    setScale,
    setPosition,
    setSelectedId,
    
    handleImageLoad,
    handleColorChange,
    handleRectangleSelect,
    handleAddRectangle,
    handleDeleteSelected,
    handleSaveAnnotations,
    handleRectangleChange,
    hasUnsavedChanges,
  };
  
  return (
    <AnnotationToolContext.Provider value={value}>
      {children}
    </AnnotationToolContext.Provider>
  );
}

export function useAnnotationTool() {
  const context = useContext(AnnotationToolContext);
  if (!context) {
    throw new Error('useAnnotationTool must be used within AnnotationToolProvider');
  }
  return context;
} 