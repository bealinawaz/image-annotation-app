import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { imagesApi } from '@/services/api';
import { validateApiItem } from '@/utils/validation';
import { ImageSchema } from '@/models/schemas';

// 30 seconds stale time for better data caching
const STALE_TIME = 30 * 1000; 

export function useImages() {
  const queryClient = useQueryClient();

  const imagesQuery = useQuery({
    queryKey: ['images'],
    queryFn: async () => {
      const response = await imagesApi.getAll();
      return response.data.map((image) => validateApiItem(image, ImageSchema));
    },
    staleTime: STALE_TIME,
  });

  const useImage = (id) => useQuery({
    queryKey: ['image', id],
    queryFn: async () => {
      const response = await imagesApi.getById(id);
      return validateApiItem(response.data, ImageSchema);
    },
    enabled: !!id,
    staleTime: STALE_TIME,
  });

  const createImageMutation = useMutation({
    mutationFn: async (data) => {
      const imageData = {
        ...data,
        url: data.file ? URL.createObjectURL(data.file) : 'https://placehold.co/600x400',
        uploadDate: new Date().toISOString(),
        metadata: data.metadata || {},
      };
      
      const response = await imagesApi.create(imageData);
      return validateApiItem(response.data, ImageSchema);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });

  const updateImageMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await imagesApi.update(id, data);
      return validateApiItem(response.data, ImageSchema);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (id) => {
     const response =  await imagesApi.delete(id);
      return response.data;
    },
  });


  return {
    images: imagesQuery.data || [],
    isLoading: imagesQuery.isPending,
    isError: imagesQuery.isError,
    error: imagesQuery.error,
    useImage,
    createImage: createImageMutation.mutate,
    updateImage: updateImageMutation.mutate,
    deleteImage: deleteImageMutation.mutate,
    createImageLoading: createImageMutation.isPending,
    updateImageLoading: updateImageMutation.isPending,
    deleteImageLoading: deleteImageMutation.isPending,
  };
}
