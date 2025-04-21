'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DeleteCategoryModal({
  open,
  onClose,
  onConfirm,
  category,
  isLoading,
}) {
  if (!category) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-category-dialog-title"
      aria-describedby="delete-category-dialog-description"
    >
      <DialogTitle id="delete-category-dialog-title">Delete Category</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-category-dialog-description">
          Are you sure you want to delete the category &quot;{category.name}&quot;? This action
          cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" disabled={isLoading} autoFocus>
          {isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
