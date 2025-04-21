'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function CategoryForm({ initialData, onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit Category' : 'Create New Category'}
      </Typography>
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Category Name"
        name="name"
        autoComplete="off"
        autoFocus
        value={formData.name}
        onChange={handleChange}
      />
      
      <TextField
        margin="normal"
        fullWidth
        id="description"
        label="Description"
        name="description"
        multiline
        rows={4}
        value={formData.description || ''}
        onChange={handleChange}
      />
      
      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || !formData.name.trim()}
        >
          {isLoading ? 'Submitting...' : initialData ? 'Update Category' : 'Create Category'}
        </Button>
      </Stack>
    </Box>
  );
}
