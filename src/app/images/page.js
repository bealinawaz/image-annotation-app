'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  CircularProgress, 
  Alert,
  Paper,
  Snackbar,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useImages } from '@/hooks/useImages';
import { useCategories } from '@/hooks/useCategories';
import ImageGallery from '@/components/images/ImageGallery';
import ImageUpload from '@/components/images/ImageUpload';
import SearchBar from '@/components/shared/SearchBar';
import FilterPanel from '@/components/shared/FilterPanel';

// Helper function to convert size string to number (MB)
const extractSizeValue = (sizeStr) => {
  if (!sizeStr) return null;
  
  const match = sizeStr.match(/^([\d.]+)\s*([KMG]?B)$/i);
  if (!match) return null;
  
  const [, value, unit] = match;
  const numValue = parseFloat(value);
  
  switch (unit.toUpperCase()) {
    case 'KB':
      return numValue / 1024; // Convert KB to MB
    case 'MB':
      return numValue;
    case 'GB':
      return numValue * 1024; // Convert GB to MB
    default:
      return numValue;
  }
};

export default function ImagesPage() {
  const router = useRouter();
  const { 
    images, 
    isLoading, 
    isError, 
    createImage, 
    deleteImage, 
    createImageLoading,
    deleteImageLoading 
  } = useImages();
  const { categories } = useCategories();
  
  // Add local state to track images with locally deleted ones removed
  const [localImages, setLocalImages] = useState([]);
  
  // Update local images when API images change
  useEffect(() => {
    if (images && images.length > 0) {
      setLocalImages(images);
    }
  }, [images]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [metadataFilters, setMetadataFilters] = useState({
    minSize: undefined,
    maxSize: undefined,
    minWidth: undefined,
    maxWidth: undefined,
    minHeight: undefined,
    maxHeight: undefined,
    format: undefined
  });
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Function to show snackbar messages
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleMetadataFilterChange = (key, value) => {
    setMetadataFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setMetadataFilters({
      minSize: undefined,
      maxSize: undefined,
      minWidth: undefined,
      maxWidth: undefined,
      minHeight: undefined,
      maxHeight: undefined,
      format: undefined
    });
  };

  const handleUpload = (formData) => {
    // Generate a temporary ID
    const tempId = `temp-${Date.now()}`;
    
    // Create a temporary image object with the uploaded data
    const newImage = {
      id: tempId,
      name: formData.name,
      url: formData.file ? URL.createObjectURL(formData.file) : 'https://placehold.co/600x400',
      categoryId: formData.categoryId || null,
      uploadDate: new Date().toISOString(),
      metadata: formData.metadata || {},
    };
    
    // Add to local state immediately
    setLocalImages(prev => [...prev, newImage]);
    
    // Close dialog and show success message
    setOpenUploadDialog(false);
    showSnackbar('Image uploaded successfully!');
    
    // Send to API
    createImage(formData);
  };

  const handleDeleteImage = (image) => {    
    // Update the UI by removing the image from local state
    setLocalImages((currentImages) => {
      const updatedImages = currentImages.filter(img => img.id !== image.id);
      return updatedImages;
    });
    
    // Show success message
    showSnackbar('Image deleted successfully!');
    
    // Call the API with the full image object
    deleteImage(image);
  };

  const filteredImages = localImages.filter(image => {
    // Text search filter
    if (searchTerm && !image.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (selectedCategory && image.categoryId !== selectedCategory) {
      return false;
    }

    // Metadata filters
    const { metadata } = image;
    if (metadata) {
      // Size filters
      if (metadataFilters.minSize !== undefined) {
        // Extract size value from string format (e.g., "2MB")
        const sizeInMB = typeof metadata.size === 'string' 
          ? extractSizeValue(metadata.size)
          : metadata.size;
        
        if (sizeInMB === null || sizeInMB < metadataFilters.minSize) {
          return false;
        }
      }
      
      if (metadataFilters.maxSize !== undefined) {
        // Extract size value from string format (e.g., "2MB")
        const sizeInMB = typeof metadata.size === 'string'
          ? extractSizeValue(metadata.size)
          : metadata.size;
        
        if (sizeInMB === null || sizeInMB > metadataFilters.maxSize) {
          return false;
        }
      }
      
      // Get width and height from resolution if needed
      let width = metadata.width;
      let height = metadata.height;
      
      // If resolution is in format "1024x768", extract width and height
      if (!width && !height && metadata.resolution) {
        const parts = metadata.resolution.split('x');
        if (parts.length === 2) {
          width = parseInt(parts[0], 10);
          height = parseInt(parts[1], 10);
        }
      }
      
      // Width filters
      if (metadataFilters.minWidth !== undefined) {
        if (!width || width < metadataFilters.minWidth) {
          return false;
        }
      }
      
      if (metadataFilters.maxWidth !== undefined) {
        if (!width || width > metadataFilters.maxWidth) {
          return false;
        }
      }
      
      // Height filters
      if (metadataFilters.minHeight !== undefined) {
        if (!height || height < metadataFilters.minHeight) {
          return false;
        }
      }
      
      if (metadataFilters.maxHeight !== undefined) {
        if (!height || height > metadataFilters.maxHeight) {
          return false;
        }
      }
      
      // Format filter
      if (metadataFilters.format && (!metadata.format || metadata.format.toLowerCase() !== metadataFilters.format.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  });
  
  const totalFilterCount = (
    (searchTerm ? 1 : 0) + 
    (selectedCategory ? 1 : 0) + 
    Object.values(metadataFilters).filter(v => v !== undefined).length
  );

  if(isLoading && localImages.length === 0){
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError && localImages.length === 0){
    return (
      <Alert severity="error">Error loading images. Please try again later.</Alert>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Image Gallery
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<UploadIcon />}
          onClick={() => setOpenUploadDialog(true)}
        >
          Upload Image
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ display: 'flex', flexWrap: 'nowrap'}}>
        {/* Left sidebar with filters */}
        <Grid item xs={12} md={2} lg={2} sx={{ maxWidth: '300px' }}>
          <Card elevation={1} sx={{ position: 'sticky', top: 16 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FilterListIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Search & Filters</Typography>
                {totalFilterCount > 0 && (
                  <Box 
                    sx={{ 
                      ml: 2, 
                      bgcolor: 'primary.main', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: 24, 
                      height: 24, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '0.75rem'
                    }}
                  >
                    {totalFilterCount}
                  </Box>
                )}
              </Box>
              
              <SearchBar 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm} 
                placeholder="Search by image name..."
              />
              
              <Divider sx={{ my: 2 }} />
              
              <FilterPanel 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                metadataFilters={metadataFilters}
                onMetadataFilterChange={handleMetadataFilterChange}
                onResetFilters={resetFilters}
              />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right content area with images */}
        <Grid item xs={12} md={10} lg={10} sx={{ flex: 1 }}>
          {filteredImages.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                No images found
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {localImages.length > 0 
                  ? 'No images match your current filters. Try adjusting your search criteria.'
                  : 'Upload your first image to get started.'}
              </Typography>
              {localImages.length === 0 ? (
                <Button 
                  variant="contained" 
                  onClick={() => setOpenUploadDialog(true)}
                >
                  Upload Image
                </Button>
              ) : (
                <Button 
                  variant="outlined" 
                  onClick={resetFilters}
                >
                  Clear Filters
                </Button>
              )}
            </Paper>
          ) : (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredImages.length} of {localImages.length} images
                  {totalFilterCount > 0 && ` (${totalFilterCount} ${totalFilterCount === 1 ? 'filter' : 'filters'} active)`}
                </Typography>
              </Box>
              <ImageGallery 
                images={filteredImages} 
                onDelete={handleDeleteImage}
                isLoading={deleteImageLoading}
                categories={categories}
                hideFilters={true}
              />
            </>
          )}
        </Grid>
      </Grid>

      {/* Upload Dialog */}
      <ImageUpload 
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        onUpload={handleUpload}
        categories={categories}
        isLoading={createImageLoading}
      />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
