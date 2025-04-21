import React from 'react';
import { TextField, InputAdornment, Box, IconButton, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({ searchTerm, onSearchChange, placeholder = "Search..." }) => {
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>Search</Typography>
      <TextField
        fullWidth
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
                size="small"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
};

export default SearchBar;
