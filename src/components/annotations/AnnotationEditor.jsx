'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Stage, Layer } from 'react-konva';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import { SketchPicker } from 'react-color';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import LoadingErrorState from '@/components/shared/LoadingErrorState';
import Skeleton from '@mui/material/Skeleton';
import { AnnotationToolProvider, useAnnotationTool } from '@/features/annotations/context/AnnotationToolContext';
import { Rectangle, CanvasImage } from './AnnotationComponents';

// Main annotation editor component that uses the context
function AnnotationEditorContent({ image }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const stageRef = useRef(null);
  
  const {
    rectangles,
    selectedId, 
    selectedColor,
    scale,
    position,
    imgDimensions,
    handleImageLoad,
    handleColorChange,
    handleRectangleSelect,
    handleAddRectangle,
    handleDeleteSelected,
    handleSaveAnnotations,
    handleRectangleChange,
    hasUnsavedChanges,
    setPosition,
    setScale,
  } = useAnnotationTool();

  // Pre-load image to check dimensions and avoid flickering
  useEffect(() => {
    if (!image?.url) return;
    
    const img = new Image();
    img.src = image.url;
    img.crossOrigin = 'anonymous';
    
    const handleLoadEvent = () => {
      handleImageLoad(img);
      setImageLoading(false);
    };
    
    img.addEventListener('load', handleLoadEvent);
    
    return () => {
      img.removeEventListener('load', handleLoadEvent);
    };
  }, [image?.url, handleImageLoad]);

  const handleColorClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleColorClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleStageClick = useCallback((e) => {
    // Deselect when clicking on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      handleRectangleSelect(null);
    }
  }, [handleRectangleSelect]);
  
  const handleAddRectangleClick = useCallback(() => {
    handleAddRectangle(stageRef);
  }, [handleAddRectangle, stageRef]);
  
  // Function to check if a rectangle has been modified
  const hasBeenModified = useCallback((rect) => {
    if (!rect.original) return false;
    
    return (
      rect.x !== rect.original.x ||
      rect.y !== rect.original.y ||
      rect.width !== rect.original.width ||
      rect.height !== rect.original.height ||
      rect.color !== rect.original.color
    );
  }, []);
  
  // Memoize the counts for new/modified rectangles to avoid recalculating on each render
  const annotationCounts = useMemo(() => {
    return {
      newCount: rectangles.filter(r => r.isNew).length,
      modifiedCount: rectangles.filter(r => !r.isNew && hasBeenModified(r)).length,
      hasNew: rectangles.some(r => r.isNew),
      hasModified: rectangles.some(r => !r.isNew && hasBeenModified(r))
    };
  }, [rectangles, hasBeenModified]);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Annotate Image: {image.name}
      </Typography>
      
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddRectangleClick}
          disabled={imageLoading}
        >
          Add Rectangle
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteSelected}
          disabled={!selectedId || imageLoading}
        >
          Delete Selected
        </Button>
        <IconButton
          color="primary"
          aria-label="select color"
          onClick={handleColorClick}
          disabled={imageLoading}
        >
          <ColorLensIcon sx={{ color: selectedColor }} />
        </IconButton>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleColorClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <SketchPicker 
            color={selectedColor} 
            onChange={(color) => {
              handleColorChange(color);
              // Optionally close the popover after selecting a color
              // setAnchorEl(null);
            }} 
          />
        </Popover>
        <Button
          variant="contained"
          color="success"
          startIcon={<SaveIcon />}
          onClick={handleSaveAnnotations}
          disabled={!hasUnsavedChanges() || imageLoading}
        >
          Save Changes
        </Button>
      </Stack>
      
      {/* Status indicators */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="body2">
          Total annotations: {rectangles.length}
        </Typography>
        {annotationCounts.hasNew && (
          <Typography variant="body2" color="success.main">
            New: {annotationCounts.newCount}
          </Typography>
        )}
        {annotationCounts.hasModified && (
          <Typography variant="body2" color="warning.main">
            Modified: {annotationCounts.modifiedCount}
          </Typography>
        )}
      </Stack>
      
      <Box 
        sx={{ 
          position: 'relative', 
          overflow: 'hidden',
          border: '1px solid #ccc', 
          borderRadius: 1,
          backgroundColor: '#f5f5f5',
          height: 700,
          width: '100%'
        }}
      >
        {imageLoading && (
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 10
          }}>
            <Skeleton 
              variant="rectangular" 
              width="80%" 
              height="80%" 
              animation="wave" 
            />
          </Box>
        )}
        
        {!imageLoading && (
          <Stage
            ref={stageRef}
            width={1200}
            height={700}
            onClick={handleStageClick}
            onTap={handleStageClick}
            draggable={false}
          >
            <Layer
              scaleX={scale}
              scaleY={scale}
              x={position.x * scale}
              y={position.y * scale}
            >
              <CanvasImage 
                url={image.url} 
                onLoad={(img) => {
                  // This is now just a backup in case the preload didn't work
                  if (imageLoading) {
                    handleImageLoad(img);
                    setImageLoading(false);
                  }
                }}
              />
              
              {rectangles.map((rect) => (
                <Rectangle
                  key={rect.id}
                  shapeProps={rect}
                  isSelected={rect.id === selectedId}
                  isModified={!rect.isNew && hasBeenModified(rect)}
                  isNew={rect.isNew}
                  onSelect={handleRectangleSelect}
                  onChange={(newAttrs) => handleRectangleChange(rect.id, newAttrs)}
                />
              ))}
            </Layer>
          </Stage>
        )}
      </Box>
      
      {/* Info about selected annotation */}
      {selectedId && (
        <Box sx={{ mt: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
          <Typography variant="subtitle2">Selected Annotation</Typography>
          {rectangles.filter(r => r.id === selectedId).map(rect => (
            <Box key={rect.id}>
              <Typography variant="body2">
                Position: ({Math.round(rect.x)}, {Math.round(rect.y)}) | 
                Size: {Math.round(rect.width)} × {Math.round(rect.height)}
              </Typography>
              {rect.isNew ? (
                <Typography variant="body2" color="success.main">New annotation</Typography>
              ) : hasBeenModified(rect) ? (
                <Typography variant="body2" color="warning.main">Modified (unsaved changes)</Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">No changes</Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}

// Wrapper component that provides the context
export default function AnnotationEditor({ 
  image, 
  annotations, 
  onCreate, 
  onUpdate, 
  onDelete, 
  isLoading 
}) {
  return (
    <AnnotationToolProvider
      initialAnnotations={annotations}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
      imageId={Number(image.id)} // Ensure imageId is a number
    >
      <AnnotationEditorContent 
        image={image}
        isLoading={isLoading}
      />
    </AnnotationToolProvider>
  );
} 