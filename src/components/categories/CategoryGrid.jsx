'use client';

import { useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Typography, 
  IconButton, 
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import { useRouter } from 'next/navigation';
import DeleteCategoryModal from './DeleteCategoryModal';
import CategoryForm from './CategoryForm';
import { useImages } from '@/hooks/useImages';
import { format } from 'date-fns';

export default function CategoryGrid({ categories, onEdit, onDelete, isLoading }) {
  const router = useRouter();
  const { images } = useImages();
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const getCategoryImage = (categoryId) => {
    const categoryImages = images.filter(img => String(img.categoryId) === String(categoryId));
    if (categoryImages.length > 0) {
      const sortedImages = [...categoryImages].sort((a, b) => 
        new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime()
      );
      return sortedImages[0].url;
    }
    return null;
  };
  
  const getCategoryImageCount = (categoryId) => {
    return images.filter(img => String(img.categoryId) === String(categoryId)).length;
  };
  
  const handleViewCategory = (id) => {
    router.push(`/categories/${id}`);
  };
  
  const handleEditClick = (category) => {
    setEditCategory(category);
    setIsEditDialogOpen(true);
  };
  
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditCategory(null);
  };
  
  const handleSubmitEdit = (formData) => {
    if (editCategory && onEdit) {
      onEdit(editCategory.id, formData);
      handleCloseEditDialog();
    }
  };
  
  const handleDeleteClick = (category) => {
    setDeleteCategory(category);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (deleteCategory && onDelete) {
      onDelete(deleteCategory.id);
      setIsDeleteModalOpen(false);
      setDeleteCategory(null);
    }
  };
  
  if (!categories.length) {
    return null;
  }
  
  return (
    <>
      <Grid container spacing={3}>
        {categories.map((category) => {
          const categoryImage = getCategoryImage(category.id);
          const imageCount = getCategoryImageCount(category.id);
          
          return (
            <Grid item key={category.id} xs={12} sm={6} md={3}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 5
                }
              }}>
                <Box sx={{ position: 'relative', height: 180, bgcolor: 'grey.100' }}>
                  {categoryImage ? (
                    <CardMedia
                      component="img"
                      sx={{ height: 180, objectFit: 'cover' }}
                      image={categoryImage}
                      alt={category.name}
                    />
                  ) : (
                    <Box sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: category.color || '#f5f5f5'
                    }}>
                      <Avatar
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          bgcolor: 'rgba(255,255,255,0.2)'
                        }}
                      >
                        <CategoryIcon sx={{ fontSize: 40 }} />
                      </Avatar>
                    </Box>
                  )}
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    p: 1
                  }}>
                    <Typography variant="body2">
                      {imageCount} {imageCount === 1 ? 'image' : 'images'}
                    </Typography>
                  </Box>
                </Box>
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description || 'No description'}
                  </Typography>
                  {category.createdAt && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Created: {format(new Date(category.createdAt), 'MMM d, yyyy')}
                    </Typography>
                  )}
                </CardContent>
                
                <CardActions>
                  <IconButton 
                    onClick={() => handleViewCategory(category.id)} 
                    aria-label="view"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleEditClick(category)} 
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteClick(category)} 
                    aria-label="delete"
                    sx={{ marginLeft: 'auto' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      
      <Dialog 
        open={isEditDialogOpen} 
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Edit Category
          <IconButton
            aria-label="close"
            onClick={handleCloseEditDialog}
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
          {editCategory && (
            <CategoryForm
              initialData={editCategory}
              onSubmit={handleSubmitEdit}
              onCancel={handleCloseEditDialog}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
      
      <DeleteCategoryModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteCategory(null);
        }}
        onConfirm={handleConfirmDelete}
        category={deleteCategory}
        isLoading={isLoading}
      />
    </>
  );
} 