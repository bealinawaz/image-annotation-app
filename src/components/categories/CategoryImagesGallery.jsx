'use client';

import { useState } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from '@mui/material';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteImageModal from '@/components/images/DeleteImageModal';

export default function CategoryImagesGallery({ images, categories, onDelete }) {
  const [deleteImage, setDeleteImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (image) => {
    setDeleteImage(image);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteImage && onDelete) {
      onDelete(deleteImage);
      setIsModalOpen(false);
      setDeleteImage(null);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  if (!images.length) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No images found. Upload one to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {images.map((image) => (
          <Grid item key={image.id} xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                sx={{ 
                  height: 200, 
                  objectFit: 'cover'
                }}
                image={image.url}
                alt={image.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {image.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {getCategoryName(image.categoryId)}
                </Typography>
              </CardContent>
              <CardActions>
                <Link href={`/images/${image.id}`}>
                  <IconButton aria-label="view">
                    <VisibilityIcon />
                  </IconButton>
                </Link>
                <Link href={`/images/${image.id}/annotate`}>
                  <IconButton aria-label="annotate">
                    <EditIcon />
                  </IconButton>
                </Link>
                <IconButton 
                  onClick={() => handleDelete(image)}
                  aria-label="delete"
                  sx={{ marginLeft: 'auto' }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <DeleteImageModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDeleteImage(null);
        }}
        onConfirm={handleConfirmDelete}
        image={deleteImage}
      />
    </>
  );
} 