import React from 'react';
import { 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField,
  Box, 
  Divider,
  Button,
  Chip,
  Stack
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const IMAGE_FORMATS = ['PNG', 'JPEG', 'JPG', 'GIF', 'WEBP', 'SVG', 'BMP', 'TIFF'];

// Helper function to convert size string to number (MB)
const extractSizeValue = (sizeStr) => {
  if (!sizeStr) return null;
  
  const match = sizeStr.match(/^([\d.]+)\s*([KMG]?B)$/i);
  if (!match) return null;
  
  const [, value, unit] = match;
  const numValue = parseFloat(value);
  
  switch (unit.toUpperCase()) {
    case 'KB':
      return numValue / 1024; // Convert KB to MB
    case 'MB':
      return numValue;
    case 'GB':
      return numValue * 1024; // Convert GB to MB
    default:
      return numValue;
  }
};

const FilterPanel = ({
  categories,
  selectedCategory,
  onCategoryChange,
  metadataFilters,
  onMetadataFilterChange,
  onResetFilters
}) => {
  const handleCategoryChange = (event) => {
    const value = event.target.value;
    onCategoryChange(value === "all" ? null : value);
  };

  // Count active filters
  const activeFilterCount = Object.values(metadataFilters).filter(v => v !== undefined).length + 
                         (selectedCategory ? 1 : 0);

  return (
    <Stack spacing={2.5}>
      {/* Category Filter */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>Category</Typography>
        <FormControl fullWidth size="small">
          <Select
            id="category-filter"
            value={selectedCategory?.toString() || "all"}
            onChange={handleCategoryChange}
            displayEmpty
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id.toString()}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider />

      {/* Dimension Filters */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Dimensions</Typography>
        
        {/* Width Filter */}
        <Typography variant="body2" color="text.secondary" gutterBottom>Width (px)</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
          <TextField
            placeholder="Min"
            type="number"
            size="small"
            fullWidth
            value={metadataFilters.minWidth || ''}
            onChange={(e) => onMetadataFilterChange('minWidth', e.target.value ? Number(e.target.value) : undefined)}
          />
          <TextField
            placeholder="Max"
            type="number"
            size="small"
            fullWidth
            value={metadataFilters.maxWidth || ''}
            onChange={(e) => onMetadataFilterChange('maxWidth', e.target.value ? Number(e.target.value) : undefined)}
          />
        </Box>

        {/* Height Filter */}
        <Typography variant="body2" color="text.secondary" gutterBottom>Height (px)</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder="Min"
            type="number"
            size="small"
            fullWidth
            value={metadataFilters.minHeight || ''}
            onChange={(e) => onMetadataFilterChange('minHeight', e.target.value ? Number(e.target.value) : undefined)}
          />
          <TextField
            placeholder="Max"
            type="number"
            size="small"
            fullWidth
            value={metadataFilters.maxHeight || ''}
            onChange={(e) => onMetadataFilterChange('maxHeight', e.target.value ? Number(e.target.value) : undefined)}
          />
        </Box>
      </Box>

      <Divider />

      {/* Size Filter */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>File Size</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>Size (MB)</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            placeholder="Min"
            type="number"
            size="small"
            fullWidth
            inputProps={{ step: "0.1" }}
            value={metadataFilters.minSize || ''}
            onChange={(e) => onMetadataFilterChange('minSize', e.target.value ? Number(e.target.value) : undefined)}
          />
          <TextField
            placeholder="Max"
            type="number"
            size="small"
            fullWidth
            inputProps={{ step: "0.1" }}
            value={metadataFilters.maxSize || ''}
            onChange={(e) => onMetadataFilterChange('maxSize', e.target.value ? Number(e.target.value) : undefined)}
          />
        </Box>
      </Box>

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>Active Filters</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {selectedCategory && (
              <Chip 
                label={`${categories.find(c => c.id.toString() === selectedCategory.toString())?.name || 'Unknown'}`}
                onDelete={() => onCategoryChange(null)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {metadataFilters.format && (
              <Chip 
                label={`${metadataFilters.format}`}
                onDelete={() => onMetadataFilterChange('format', undefined)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {metadataFilters.minWidth && (
              <Chip 
                label={`Min W: ${metadataFilters.minWidth}px`}
                onDelete={() => onMetadataFilterChange('minWidth', undefined)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {metadataFilters.maxWidth && (
              <Chip 
                label={`Max W: ${metadataFilters.maxWidth}px`}
                onDelete={() => onMetadataFilterChange('maxWidth', undefined)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {metadataFilters.minHeight && (
              <Chip 
                label={`Min H: ${metadataFilters.minHeight}px`}
                onDelete={() => onMetadataFilterChange('minHeight', undefined)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {metadataFilters.maxHeight && (
              <Chip 
                label={`Max H: ${metadataFilters.maxHeight}px`}
                onDelete={() => onMetadataFilterChange('maxHeight', undefined)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {metadataFilters.minSize && (
              <Chip 
                label={`Min: ${metadataFilters.minSize}MB`}
                onDelete={() => onMetadataFilterChange('minSize', undefined)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {metadataFilters.maxSize && (
              <Chip 
                label={`Max: ${metadataFilters.maxSize}MB`}
                onDelete={() => onMetadataFilterChange('maxSize', undefined)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}

      {/* Clear All Filters Button */}
      <Box sx={{ mt: 1.5 }}>
        <Button 
          variant="outlined"
          startIcon={<ClearIcon />} 
          onClick={onResetFilters}
          disabled={activeFilterCount === 0}
          size="small"
          fullWidth
        >
          Clear All Filters
        </Button>
      </Box>
    </Stack>
  );
};

export default FilterPanel;
