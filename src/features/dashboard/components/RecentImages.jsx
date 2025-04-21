'use client';

import { 
  Box, 
  Button, 
  Typography, 
  Divider, 
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageGallery from '@/components/images/ImageGallery';
import { useImages } from '@/hooks/useImages';

export default function RecentImages({ recentImages, getCategoryName }) {
  const router = useRouter();
  const { deleteImage, deleteImageLoading } = useImages();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Handle navigation for "View All Images" button
  const handleViewAllImages = () => {
    router.push('/images');
  };
  
  // Real delete handler that uses the deleteImage function from useImages hook
  const handleDelete = (image) => {
    // Call the API with the full image object
    deleteImage(image);
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Image deleted successfully!',
      severity: 'success'
    });
  };
  
  // Create a categories array with the necessary structure for ImageGallery
  const categoriesFromImages = [...new Set(recentImages.map(img => img.categoryId))]
    .filter(id => id) // Remove nulls/undefined
    .map(id => ({
      id,
      name: getCategoryName(id)
    }));
  
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" gutterBottom>
        Recent Images
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {recentImages.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No images yet
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Start by uploading your first image.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => router.push('/images')}
          >
            Upload Image
          </Button>
        </Paper>
      ) : (
        <Box>
          <ImageGallery 
            images={recentImages}
            categories={categoriesFromImages}
            onDelete={handleDelete}
            isLoading={deleteImageLoading}
            hideFilters={true}
          />
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              variant="outlined" 
              onClick={handleViewAllImages}
            >
              View All Images
            </Button>
          </Box>
        </Box>
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 