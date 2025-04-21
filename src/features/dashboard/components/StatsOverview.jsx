'use client';

import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CategoryIcon from '@mui/icons-material/Category';
import { useRouter } from 'next/navigation';

export default function StatsOverview({ totalImages, totalCategories }) {
  const router = useRouter();
  
  return (
    <Grid container spacing={3} sx={{ mb: 6 }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%', backgroundColor: '#f5f5f5' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ImageIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Images</Typography>
          </Box>
          <Typography variant="h3" color="primary">
            {totalImages}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Total images in your collection
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => router.push('/images')}
          >
            Manage Images
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%', backgroundColor: '#f5f5f5' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CategoryIcon color="secondary" sx={{ mr: 1 }} />
            <Typography variant="h6">Categories</Typography>
          </Box>
          <Typography variant="h3" color="secondary">
            {totalCategories}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Categories to organize your images
          </Typography>
          <Button 
            variant="outlined" 
            color="secondary" 
            sx={{ mt: 2 }}
            onClick={() => router.push('/categories')}
          >
            Manage Categories
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
} 