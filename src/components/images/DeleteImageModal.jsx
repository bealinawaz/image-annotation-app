'use client';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DeleteImageModal({
  open,
  onClose,
  onConfirm,
  image,
  isLoading,
}) {
  if (!image) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-image-dialog-title"
      aria-describedby="delete-image-dialog-description"
    >
      <DialogTitle id="delete-image-dialog-title">Delete Image</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-image-dialog-description">
          Are you sure you want to delete the image &quot;{image.name}&quot;? This action
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
