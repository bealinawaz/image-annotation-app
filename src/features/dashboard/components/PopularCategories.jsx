'use client';

import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Paper,
  Chip,
  Button
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import { useRouter } from 'next/navigation';

export default function PopularCategories({ popularCategories, categoryImages = {} }) {
  const router = useRouter();
  
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" gutterBottom>
        Popular Categories
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {popularCategories.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No categories yet
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Create your first category to organize your images.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => router.push('/categories')}
          >
            Create Category
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          <List>
            {popularCategories.map((category) => (
              <ListItem 
                key={category.id}
                sx={{ 
                  borderBottom: '1px solid #eee',
                  '&:last-child': { borderBottom: 'none' }
                }}
                button={'true'}
                onClick={() => router.push(`/categories/${category.id}`)}
              >
                {categoryImages[category.id] ? (
                  <ListItemAvatar>
                    <Avatar 
                      src={categoryImages[category.id]} 
                      alt={category.name}
                      variant="rounded"
                      sx={{ width: 56, height: 56, mr: 1 }}
                    />
                  </ListItemAvatar>
                ) : (
                  <ListItemIcon>
                    <CategoryIcon sx={{ color: category.color || 'primary.main' }} />
                  </ListItemIcon>
                )}
                <ListItemText 
                  primary={category.name} 
                  secondary={`${category.count} ${category.count === 1 ? 'image' : 'images'}`}
                />
                <Chip 
                  label={`${category.count}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      
      {popularCategories.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={() => router.push('/categories')}
          >
            View All Categories
          </Button>
        </Box>
      )}
    </Box>
  );
} 