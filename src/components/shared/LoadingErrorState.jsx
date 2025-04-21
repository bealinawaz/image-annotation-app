'use client';

import { Box, Alert, AlertTitle, Skeleton } from '@mui/material';

export default function LoadingErrorState({ 
  isLoading, 
  isError,
  errorMessage = 'An error occurred while loading data.',
  errorTitle = 'Error',
  height = 200,
  width = '100%'
}) {
  if (isLoading) {
    return (
      <Box sx={{ width: '100%', py: 3 }}>
        <Skeleton 
          variant="rectangular" 
          width={width} 
          height={height} 
          animation="wave"
        />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        <AlertTitle>{errorTitle}</AlertTitle>
        {errorMessage}
      </Alert>
    );
  }

  return null;
} 