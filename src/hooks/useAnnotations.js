import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { annotationsApi } from '@/services/api';
import { validateApiItem } from '@/utils/validation';
import { AnnotationSchema } from '@/models/schemas';

// 30 seconds stale time for better data caching
const STALE_TIME = 30 * 1000;

export function useAnnotations(imageId) {
  const queryClient = useQueryClient();

  const annotationsQuery = useQuery({
    queryKey: ['annotations', imageId],
    queryFn: async () => {
      let response;
      
      if (!imageId) {
        response = await annotationsApi.getAll();
      } else {
        response = await annotationsApi.getByImageId(imageId);
      }
      
      // Log the raw response to see what format we're getting
      console.log('Raw annotations from API:', response.data);
      
      // Instead of transforming coordinates to properties,
      // we should process the data to maintain the correct format
      return response.data.map(item => {
        // Ensure coordinates exist
        if (!item.coordinates) {
          item.coordinates = {};
        }
        
        // Make sure we return properly validated items
        return validateApiItem(item, AnnotationSchema);
      });
    },
    enabled: !!imageId,
    staleTime: STALE_TIME,
  });

  const createAnnotationMutation = useMutation({
    mutationFn: async (data) => {
      // Log the data being sent to the API
      console.log('Creating annotation with data:', data);
      
      // Ensure it has the correct format for the API
      const apiData = {
        ...data,
        coordinates: {
          x: Math.round(Number(data.coordinates?.x || data.x || 0)),
          y: Math.round(Number(data.coordinates?.y || data.y || 0)),
          width: Math.round(Number(data.coordinates?.width || data.width || 100)),
          height: Math.round(Number(data.coordinates?.height || data.height || 100))
        }
      };
      
      console.log('Final create API payload:', apiData);
      
      // Send to API
      const response = await annotationsApi.create(apiData);
      
      // Transform response back to our consistent format if needed
      return validateApiItem(response.data, AnnotationSchema);
    },
    onSuccess: () => {
      if (imageId) {
        queryClient.invalidateQueries({ queryKey: ['annotations', imageId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['annotations'] });
      }
    },
  });

  const updateAnnotationMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      // Log the data being sent to the API
      console.log('Updating annotation with id:', id, 'data:', data);
      
      // Ensure it has the correct format for the API
      const apiData = {
        ...data,
        // imageId should already be a number according to schema
        coordinates: {
          x: Math.round(Number(data.coordinates?.x || data.x || 0)),
          y: Math.round(Number(data.coordinates?.y || data.y || 0)),
          width: Math.round(Number(data.coordinates?.width || data.width || 100)),
          height: Math.round(Number(data.coordinates?.height || data.height || 100))
        }
      };
      
      console.log('Final update API payload:', apiData);
      
      // Send to API
      const response = await annotationsApi.update(id, apiData);
      
      // Transform response back to our consistent format if needed
      return validateApiItem(response.data, AnnotationSchema);
    },
    onSuccess: (data) => {
      if (imageId) {
        queryClient.invalidateQueries({ queryKey: ['annotations', imageId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['annotations'] });
      }
    },
    onError: (error) => {
      console.error('Error updating annotation:', error);
    }
  });

  const deleteAnnotationMutation = useMutation({
    mutationFn: async (id) => {
      await annotationsApi.delete(id);
      return id;
    },
    onSuccess: () => {
      if (imageId) {
        queryClient.invalidateQueries({ queryKey: ['annotations', imageId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['annotations'] });
      }
    },
  });

  return {
    annotations: annotationsQuery.data || [],
    isLoading: annotationsQuery.isPending,
    isError: annotationsQuery.isError,
    error: annotationsQuery.error,
    createAnnotation: createAnnotationMutation.mutate,
    updateAnnotation: updateAnnotationMutation.mutate,
    deleteAnnotation: deleteAnnotationMutation.mutate,
    createAnnotationLoading: createAnnotationMutation.isPending,
    updateAnnotationLoading: updateAnnotationMutation.isPending,
    deleteAnnotationLoading: deleteAnnotationMutation.isPending,
  };
}
