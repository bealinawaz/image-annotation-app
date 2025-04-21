'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import { format } from 'date-fns';
import DeleteCategoryModal from './DeleteCategoryModal';
import CategoryForm from './CategoryForm';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

export default function CategoryList({
  categories,
  onEdit,
  onDelete,
  isLoading,
}) {
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEdit = (category) => {
    setEditCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (category) => {
    setDeleteCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditCategory(null);
  };

  const handleConfirmDelete = () => {
    if (deleteCategory) {
      onDelete(deleteCategory.id);
      setIsDeleteModalOpen(false);
      setDeleteCategory(null);
    }
  };

  if (!categories.length) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          No categories found. Create one to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Paper sx={{ mt: 2 }}>
        <List>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(category)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={category.name}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {category.description || 'No description'}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Edit Category Dialog */}
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
              onSubmit={(formData) => {
                onEdit(editCategory.id, formData);
                handleCloseEditDialog();
              }}
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
