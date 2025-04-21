'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import { format, isValid } from 'date-fns';

export default function AnnotationList({ annotations, onDelete }) {
  if (!annotations.length) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          No annotations found. Create one to get started.
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMM d, yyyy HH:mm') : 'Invalid date';
  };

  return (
    <Paper sx={{ mt: 2 }}>
      <List>
        {annotations.map((annotation) => (
          <ListItem
            key={annotation.id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(annotation.id)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: 1,
                bgcolor: annotation.properties?.color || '#cccccc',
                mr: 2,
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            />
            <ListItemText
              primary={`Rectangle Annotation #${String(annotation.id).slice(0, 8)}`}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.secondary">
                    Position: ({(annotation.properties?.x || 0).toFixed(0)}, {(annotation.properties?.y || 0).toFixed(0)})
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="text.secondary">
                    Size: {(annotation.properties?.width || 0).toFixed(0)} x {(annotation.properties?.height || 0).toFixed(0)}
                  </Typography>
                  <br />
                  <Typography component="span" variant="caption" color="text.secondary">
                    Created: {formatDate(annotation.createdAt)}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
