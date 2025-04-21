'use client';

import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function ImageDetail({ image, categories, annotations }) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Memoize the category to avoid finding it on every render
  const category = useMemo(() => 
    categories.find(cat => cat.id === image.categoryId) || { name: 'Uncategorized' }, 
    [categories, image.categoryId]
  );
  
  // Pre-load the image to avoid flickering
  useEffect(() => {
    // Skip if the image URL is not valid
    if (!image?.url) return;
    
    const img = new Image();
    img.src = image.url;
    
    const handleLoad = () => setImageLoaded(true);
    img.addEventListener('load', handleLoad);
    
    // Cleanup function to prevent memory leaks
    return () => {
      img.removeEventListener('load', handleLoad);
    };
  }, [image?.url]); // Only rerun if the image URL changes
  
  const handleAnnotate = () => {
    router.push(`/images/${image.id}/annotate`);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 500,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 1,
              overflow: 'hidden',
              backgroundColor: 'grey.100',
            }}
          >
            {!imageLoaded && (
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height="100%" 
                animation="wave"
              />
            )}
            {imageLoaded && (
              <Box
                component="img"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
                src={image.url}
                alt={image.name}
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {image.name}
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>
            Category: {category?.name || 'Unknown'}
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>
            Uploaded: {format(new Date(image.uploadDate), 'PPP')}
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 2 }}>
            Metadata
          </Typography>
          <List dense>
            {image.metadata?.resolution && (
              <ListItem>
                <ListItemText primary={`Resolution: ${image.metadata.resolution}`} />
              </ListItem>
            )}
            {image.metadata?.size && (
              <ListItem>
                <ListItemText primary={`Size: ${(image.metadata.size / 1024).toFixed(2)} KB`} />
              </ListItem>
            )}
            {image.metadata?.format && (
              <ListItem>
                <ListItemText primary={`Format: ${image.metadata.format}`} />
              </ListItem>
            )}
          </List>
          
          <Typography variant="h6" sx={{ mt: 2 }}>
            Annotations
          </Typography>
          {annotations.length > 0 ? (
            <List dense>
              {annotations.map((annotation) => (
                <ListItem key={annotation.id}>
                  <ListItemText 
                    primary={`Annotation #${annotation.id}`} 
                    secondary={`Created: ${format(new Date(annotation.createdAt), 'PPP')}`} 
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No annotations yet.
            </Typography>
          )}
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleAnnotate}
            sx={{ mt: 2 }}
          >
            {annotations.length > 0 ? 'Edit Annotations' : 'Add Annotations'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
