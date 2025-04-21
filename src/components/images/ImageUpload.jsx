'use client';

import { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function ImageUpload({ open, onClose, onUpload, categories, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    metadata: {
      resolution: '',
    },
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [name]: value },
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({ ...prev, categoryId: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create a preview URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      
      // Update metadata
      setFormData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          size: selectedFile.size,
          format: selectedFile.type,
        },
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload({ ...formData, file });
    resetForm();
  };
  
  const resetForm = () => {
    // Reset form
    setFormData({
      name: '',
      categoryId: '',
      metadata: {
        resolution: '',
      },
    });
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Upload New Image
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Image Name"
            name="name"
            autoComplete="off"
            value={formData.name}
            onChange={handleChange}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              label="Category"
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            fullWidth
            id="resolution"
            label="Resolution (e.g., 1920x1080)"
            name="resolution"
            autoComplete="off"
            value={formData.metadata?.resolution || ''}
            onChange={handleMetadataChange}
          />
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Select Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </Button>
            
            {previewUrl && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Preview:
                </Typography>
                <Box
                  component="img"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    objectFit: 'contain',
                  }}
                  src={previewUrl}
                  alt="Preview"
                />
                <Typography variant="caption" display="block">
                  Size: {file ? `${(file.size / 1024).toFixed(2)} KB` : 'N/A'}
                </Typography>
                <Typography variant="caption" display="block">
                  Type: {file?.type || 'N/A'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading || !formData.name || !formData.categoryId || !file}
        >
          {isLoading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
