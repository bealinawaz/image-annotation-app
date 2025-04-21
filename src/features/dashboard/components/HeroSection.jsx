'use client';

import { Typography, Box, Button, Paper } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CategoryIcon from '@mui/icons-material/Category';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const router = useRouter();
  
  return (
    <Paper 
      sx={{ 
        p: { xs: 3, md: 6 }, 
        mb: 4, 
        borderRadius: 2,
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        color: 'white'
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        Image Annotation App
      </Typography>
      <Typography variant="h6" paragraph>
        Upload, manage, organize, and annotate your images with our powerful and intuitive tools.
      </Typography>
      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large"
          onClick={() => router.push('/images')}
          startIcon={<ImageIcon />}
        >
          Browse Images
        </Button>
        <Button 
          variant="outlined" 
          color="inherit" 
          size="large"
          onClick={() => router.push('/categories')}
          startIcon={<CategoryIcon />}
        >
          View Categories
        </Button>
      </Box>
    </Paper>
  );
} 