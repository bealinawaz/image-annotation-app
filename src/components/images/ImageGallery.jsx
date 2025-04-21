'use client';

import { useState, useEffect, memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';
import DeleteImageModal from './DeleteImageModal';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import useImagePreload from '@/hooks/useImagePreload';

const ImageCard = memo(({ image, onView, onAnnotate, onDelete, getCategoryName }) => {
  const imageLoaded = useImagePreload(image.url);
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(image);
  };
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative', height: 200, bgcolor: 'grey.100' }}>
        {!imageLoaded && (
          <Skeleton 
            variant="rectangular" 
            animation="wave"
            width="100%" 
            height="100%" 
          />
        )}
        {imageLoaded && (
          <CardMedia
            component="img"
            sx={{ 
              height: 200, 
              objectFit: 'cover'
            }}
            image={image.url}
            alt={image.name}
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {image.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          Category: {getCategoryName(image.categoryId)}
        </Typography>
        {image.metadata?.resolution && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Resolution: {image.metadata.resolution}
          </Typography>
        )}
        {image.metadata?.size && (
          <Typography variant="body2" color="text.secondary">
            Size: {image.metadata.size}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <IconButton onClick={() => onView(image.id)} aria-label="view">
          <VisibilityIcon />
        </IconButton>
        <IconButton onClick={() => onAnnotate(image.id)} aria-label="annotate">
          <EditIcon />
        </IconButton>
        <IconButton 
          onClick={handleDelete}
          aria-label="delete"
          sx={{ marginLeft: 'auto' }}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
});

ImageCard.displayName = 'ImageCard';

export default function ImageGallery({ 
  images, 
  categories = [], 
  onDelete, 
  isLoading,
  hideFilters = false
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteImage, setDeleteImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewImage = (id) => {
    router.push(`/images/${id}`);
  };

  const handleAnnotateImage = (id) => {
    router.push(`/images/${id}/annotate`);
  };

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  useEffect(() => {
    if (images && images.length >= 0) {
    }
  }, [images]);
  
  const filteredImages = images.filter(image => {
    const matchesSearchTerm = !searchTerm || image.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || image.categoryId === selectedCategory;
    return matchesSearchTerm && matchesCategory;
  });

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
      {!hideFilters && (
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search images..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl fullWidth sx={{ minWidth: '300px' }}>
                <InputLabel id="category-filter-label">Filter by Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  id="category-filter"
                  value={selectedCategory}
                  label="Filter by Category"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {categories?.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      <Grid container spacing={3}>
        {filteredImages.map((image) => (
          <Grid item key={image.id} xs={12} sm={6} md={3}>
            <ImageCard 
              image={image}
              onView={handleViewImage}
              onAnnotate={handleAnnotateImage}
              onDelete={handleDelete}
              getCategoryName={getCategoryName}
            />
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
        isLoading={isLoading}
      />
    </>
  );
}
