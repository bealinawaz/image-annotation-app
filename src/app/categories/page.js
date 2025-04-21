'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Grid,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CategoryGrid from '@/components/categories/CategoryGrid';
import CategoryForm from '@/components/categories/CategoryForm';
import SearchBar from '@/components/shared/SearchBar';
import { useCategories } from '@/hooks/useCategories';
import CloseIcon from '@mui/icons-material/Close';

export default function CategoriesPage() {
  const { 
    categories, 
    isLoading, 
    isError, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    createCategoryLoading,
    updateCategoryLoading,
    deleteCategoryLoading
  } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleOpenDialog = () => {
    setEditingCategory(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
  };

  const handleCreateCategory = async (formData) => {
    try {
      await createCategory(formData);
      setSnackbar({
        open: true,
        message: 'Category created successfully!',
        severity: 'success'
      });
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error creating category',
        severity: 'error'
      });
    }
  };

  const handleEditCategory = async (id, data) => {
    try {
      await updateCategory({ id, data });
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

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setSnackbar({
        open: true,
        message: 'Category deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error deleting category',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Categories
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add New Category
        </Button>
      </Box>

      <SearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        placeholder="Search categories..."
      />

      <Paper sx={{ p: 3 }}>
        {isLoading && !categories.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : isError && !categories.length ? (
          <Alert severity="error">Error loading categories. Please try again later.</Alert>
        ) : filteredCategories.length === 0 ? (
          <Typography variant="body1" sx={{ py: 4, textAlign: 'center' }}>
            No categories found. {searchTerm && 'Try a different search term or '} 
            <Button color="primary" onClick={handleOpenDialog}>create a new category</Button>.
          </Typography>
        ) : (
          <CategoryGrid 
            categories={filteredCategories} 
            onEdit={handleEditCategory} 
            onDelete={handleDeleteCategory}
            isLoading={updateCategoryLoading || deleteCategoryLoading}
          />
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Add New Category
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
            initialData={{ name: '', description: '' }}
            onSubmit={handleCreateCategory}
            onCancel={handleCloseDialog}
            isLoading={createCategoryLoading}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
