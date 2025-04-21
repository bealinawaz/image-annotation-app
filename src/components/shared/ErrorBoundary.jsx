'use client';

import React from 'react';
import { Alert, AlertTitle, Button, Box, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // In production, you would log to a monitoring service like Sentry
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo);
    } else {
      console.error('UI Error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      const { title = 'Something went wrong', message = 'An unexpected error has occurred.' } = this.props;
      
      return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            <AlertTitle>{title}</AlertTitle>
            {message}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => this.setState({ hasError: false })}
            sx={{ mt: 2 }}
          >
            Try again
          </Button>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, width: '100%' }}>
              <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {this.state.error.toString()}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {this.state.errorInfo?.componentStack}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 