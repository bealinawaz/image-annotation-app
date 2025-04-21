'use client';

import { memo, useRef, useEffect, useState } from 'react';
import { Rect, Transformer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

// Memoized Rectangle component to prevent unnecessary rerenders
export const Rectangle = memo(({ shapeProps, isSelected, isModified, isNew, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // Attach transformer to the selected rectangle
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  
  // Helper function to convert color to fill with opacity
  const getFillColor = (color) => {
    // Check if the color is a valid hex color
    const isHex = /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
    
    // If it's a hex color, add 80 (50% opacity in hex) to the end
    if (isHex) {
      return `${color}80`;
    }
    
    // If it's a named color like 'red', 'blue', etc., convert to RGBA with 0.5 opacity
    return color.startsWith('rgb') 
      ? color.replace(')', ', 0.5)').replace('rgb', 'rgba')
      : `rgba(0, 0, 0, 0.5)`; // Fallback to semi-transparent black
  };

  return (
    <>
      <Rect
        onClick={() => onSelect(shapeProps.id)}
        onTap={() => onSelect(shapeProps.id)}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer changes scale, we need to adjust width and height
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // reset scale to 1 - the dimensions will be updated in width/height properties
          node.scaleX(1);
          node.scaleY(1);
          
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
        stroke={isSelected ? 'black' : shapeProps.color}
        strokeWidth={isModified || isNew ? 3 : 2}
        dash={isModified ? [5, 2] : undefined}
        fill={getFillColor(shapeProps.color)} // Use color with 50% opacity
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
});

Rectangle.displayName = 'Rectangle';

// Memoized KonvaImage component with improved loading
export const CanvasImage = memo(({ url, onLoad }) => {
  const [image, status] = useImage(url, 'anonymous');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Pre-load image before rendering to avoid flickering in Konva
  useEffect(() => {
    if (!url) return;
    
    const img = new Image();
    img.src = url;
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setDimensions({
        width: img.width,
        height: img.height
      });
      setIsLoading(false);
      
      // Notify parent that image is loaded with dimensions
      onLoad(img);
    };
    
    return () => {
      img.onload = null;
    };
  }, [url, onLoad]);
  
  // If still loading, return nothing (parent will show skeleton)
  if (isLoading) {
    return null;
  }
  
  // Return the actual image once it's ready
  if (image) {
    return (
      <KonvaImage 
        image={image}
        x={0}
        y={0}
        width={dimensions.width}
        height={dimensions.height}
        perfectDrawEnabled={false}
      />
    );
  }
  
  return null;
});

CanvasImage.displayName = 'CanvasImage'; 