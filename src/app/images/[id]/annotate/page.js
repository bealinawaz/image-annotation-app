'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AnnotationEditor from '@/components/annotations/AnnotationEditor';
import { useImages } from '@/hooks/useImages';
import { useAnnotations } from '@/hooks/useAnnotations';
import LoadingErrorState from '@/components/shared/LoadingErrorState';

export default function ImageAnnotatePage() {
  const router = useRouter();
  const { id } = useParams();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Use the `useImages` hook to fetch image data
  const { useImage } = useImages();
  const { data: image, isLoading: isLoadingImage, isError: isErrorImage } = useImage(id);

  // Use the `useAnnotations` hook to fetch annotations for the image
  const {
    annotations,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
    isLoading: isLoadingAnnotations,
    isError: isErrorAnnotations,
    createAnnotationLoading,
    updateAnnotationLoading,
    deleteAnnotationLoading
  } = useAnnotations(id);

  const isLoading = isLoadingImage || isLoadingAnnotations;
  const isError = isErrorImage || isErrorAnnotations;
  const isMutating = createAnnotationLoading || updateAnnotationLoading || deleteAnnotationLoading;

  const handleCreateAnnotation = async (annotation) => {
    // For creating new annotations
    console.log('Creating new annotation:', annotation);
    
    await createAnnotation(annotation);
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'New annotation created successfully!',
      severity: 'success'
    });
  };
  
  const handleUpdateAnnotation = async (params) => {
    // For updating existing annotations
    console.log('Updating existing annotation:', params);
    
    await updateAnnotation(params);
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Annotation updated successfully!',
      severity: 'success'
    });
  };
  
  const handleDeleteAnnotation = async (annotationId) => {
    await deleteAnnotation(annotationId);
    
    // Show success message
    setSnackbar({
      open: true,
      message: 'Annotation deleted successfully!',
      severity: 'success'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
        <Link href="/images" style={{ textDecoration: 'none', color: 'inherit' }}>Images</Link>
        <Typography color="text.primary">Annotate</Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {image ? image.name : 'Annotate Image'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/images')}
        >
          Back to Images
        </Button>
      </Box>
      
      <LoadingErrorState 
        isLoading={isLoading}
        isError={isError}
        loadingMessage="Loading image and annotations..."
        errorMessage="Error loading image data. Please try again."
      />
      
      {!isLoading && !isError && image && (
        <>
          <AnnotationEditor
            image={image}
            annotations={annotations || []}
            onCreate={handleCreateAnnotation}
            onUpdate={handleUpdateAnnotation}
            onDelete={handleDeleteAnnotation}
            isLoading={isMutating}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push(`/images/${id}`)}
            >
              Back to Image
            </Button>
          </Box>
        </>
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}