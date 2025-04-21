'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Grid, 
  CircularProgress, 
  Alert,
  Breadcrumbs,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Dialog,
  Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Link from 'next/link';
import { useImages } from '@/hooks/useImages';
import { useCategories } from '@/hooks/useCategories';
import { useAnnotations } from '@/hooks/useAnnotations';
import DeleteImageModal from '@/components/images/DeleteImageModal';
import AnnotationList from '@/components/annotations/AnnotationList';

export default function ImageDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { useImage, deleteImage, updateImage } = useImages();
  const { categories } = useCategories();
  // Use the imageId parameter to get annotations specific to this image
  const { data: image, isLoading, isError } = useImage(id);
  const { annotations, isLoading: isAnnotationsLoading, isError: isAnnotationsError, deleteAnnotation } = useAnnotations(id);
  
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });


  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError || !image) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading image. The image might not exist or there was a problem with the server.
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.push('/images')}
          >
            Back to Images
          </Button>
        </Box>
      </Container>
    );
  }


  const handleDelete = async () => {
    if (!image) return;
    
    try {
      await deleteImage(image);
      setSnackbar({
        open: true,
        message: 'Image deleted successfully!',
        severity: 'success'
      });
      router.push('/images');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting image',
        severity: 'error'
      });
    }
    setOpenDeleteModal(false);
  };

  const handleDeleteAnnotation = async (annotationId) => {
    try {
      await deleteAnnotation(String(annotationId));
      // No need to update state manually as React Query will refresh the data
      setSnackbar({
        open: true,
        message: 'Annotation deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting annotation',
        severity: 'error'
      });
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href="/" passHref>
          <Typography color="inherit">Home</Typography>
        </Link>
        <Link href="/images" passHref>
          <Typography color="inherit">Images</Typography>
        </Link>
        <Typography color="text.primary">{image.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {image.name}
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<EditNoteIcon />} 
            onClick={() => router.push(`/images/${id}/annotate`)}
            sx={{ mr: 1 }}
          >
            Annotate
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={() => setOpenDeleteModal(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} size={8}>
          <Paper sx={{ p: 2, mb: 3, border: '2px solid #f1f1f1', boxShadow: 'none', borderRadius: '8px' }}>
            <Card elevation={0} sx={{ borderRadius: '0px' }}>
              <CardMedia
                component="img"
                image={image.url}
                alt={image.name}
                sx={{ maxHeight: 550, objectFit: 'contain' }}
              />
            </Card>
          </Paper>
        </Grid>
        
        <Grid item xs={12} size={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Image Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1" paragraph>
              {image.name}
            </Typography>
            
            <Typography variant="subtitle2" color="text.secondary">
              Category
            </Typography>
            <Typography component="span" variant="body1">
              <Chip 
                label={getCategoryName(image.categoryId)} 
                color="primary" 
                size="small" 
                onClick={() => router.push(`/categories/${image.categoryId}`)}
              />
            </Typography>
            
            <Typography variant="subtitle2" color="text.secondary">
              Upload Date
            </Typography>
            <Typography variant="body1" paragraph>
              {new Date(image.uploadDate).toLocaleDateString()}
            </Typography>
            
            {image.metadata && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Metadata
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {image.metadata.size && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary">
                      File Size
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {image.metadata.size}
                    </Typography>
                  </>
                )}
                
                {image.metadata.width && image.metadata.height && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary">
                      Dimensions
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {image.metadata.width} × {image.metadata.height} px
                    </Typography>
                  </>
                )}
                
                {image.metadata.format && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary">
                      Format
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {image.metadata.format}
                    </Typography>
                  </>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Annotations
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {isAnnotationsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : annotations && annotations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" paragraph>
              No annotations found for this image.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => router.push(`/images/${id}/annotate`)}
            >
              Add Annotations
            </Button>
          </Box>
        ) : (
          <AnnotationList 
            annotations={annotations} 
            onDelete={handleDeleteAnnotation}
          />
        )}
      </Paper>

      <DeleteImageModal
        open={openDeleteModal}
        image={image.name}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}