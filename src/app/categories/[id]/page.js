'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  CircularProgress, 
  Alert,
  Paper,
  Breadcrumbs,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import { useImages } from '@/hooks/useImages';
import CategoryForm from '@/components/categories/CategoryForm';
import DeleteCategoryModal from '@/components/categories/DeleteCategoryModal';
import CategoryImagesGallery from '@/components/categories/CategoryImagesGallery';

export default function CategoryDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { useCategory, updateCategory, deleteCategory } = useCategories();
  const { data: category, isLoading: isCategoryLoading, isError: isCategoryError } = useCategory(id);
  const { images, isLoading: isImagesLoading, deleteImage } = useImages();
  
  const [localCategory, setLocalCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (category) {
      setLocalCategory(category);
    }
  }, [category]);

  const handleEditClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEditSubmit = async (data) => {
    if (!localCategory) return;
    
    try {
      await updateCategory({ id: localCategory.id, data });
      setLocalCategory({ ...localCategory, ...data });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: 'Category updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error updating category',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (!localCategory) return;
    
    try {
      await deleteCategory(localCategory.id);
      setSnackbar({
        open: true,
        message: 'Category deleted successfully!',
        severity: 'success'
      });
      router.push('/categories');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting category',
        severity: 'error'
      });
    }
    setOpenDeleteModal(false);
  };

  const filteredImages = useMemo(() => {
    return images.filter(image => 
      String(image.categoryId) === String(id)
    );
  }, [images, id]);

  if (isCategoryLoading || isImagesLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isCategoryError || !localCategory) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Error loading category. The category might not exist or there was a problem with the server.
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.push('/categories')}
          >
            Back to Categories
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link href="/" passHref>
          <Typography color="inherit">Home</Typography>
        </Link>
        <Link href="/categories" passHref>
          <Typography color="inherit">Categories</Typography>
        </Link>
        <Typography color="text.primary">{localCategory.name}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {localCategory.name}
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={handleEditClick}
            sx={{ mr: 1 }}
          >
            Edit
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

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Images in this Category
      </Typography>

      <Paper sx={{ p: 3 }}>
        {isImagesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredImages.length === 0 ? (
          <Typography variant="body1" sx={{ py: 4, textAlign: 'center' }}>
            No images found in this category.
            <Link href="/images" passHref>
              <Button color="primary">Upload new images</Button>
            </Link>
          </Typography>
        ) : (
          <CategoryImagesGallery 
            images={filteredImages}
            onDelete={deleteImage}
            categories={[localCategory]}
          />
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Edit Category
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <CategoryForm 
            initialData={{ name: localCategory.name, description: localCategory.description || '' }}
            onSubmit={handleEditSubmit}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      <DeleteCategoryModal
        open={openDeleteModal}
        category={localCategory}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
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
