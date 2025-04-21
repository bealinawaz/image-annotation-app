import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '@/services/api';
import { validateApiItem } from '@/utils/validation';
import { CategorySchema } from '@/models/schemas';
import { v4 as uuidv4 } from 'uuid';

// 30 seconds stale time for better data caching
const STALE_TIME = 30 * 1000;

export function useCategories() {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await categoriesApi.getAll();
        return response.data.map((category) => validateApiItem(category, CategorySchema));
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Return empty array or cached data if API fails
        return queryClient.getQueryData(['categories']) || [];
      }
    },
    staleTime: STALE_TIME,
  });

  const useCategory = (id) => useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await categoriesApi.getById(id);
      return validateApiItem(response.data, CategorySchema);
    },
    enabled: !!id,
    staleTime: STALE_TIME,
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await categoriesApi.create(data);
        return validateApiItem(response.data, CategorySchema);
      } catch (error) {
        // Create a temporary local category with UUID if API fails
        return {
          id: uuidv4(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          _isLocal: true // Flag to indicate this is local data
        };
      }
    },
    // Optimistic update - add immediately to UI
    onMutate: async (newCategory) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      
      // Get current categories
      const previousCategories = queryClient.getQueryData(['categories']) || [];
      
      // Create temp category with temporary ID
      const tempCategory = {
        id: 'temp-' + Date.now(),
        ...newCategory,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Optimistically update the cache
      queryClient.setQueryData(['categories'], [...previousCategories, tempCategory]);
      
      return { previousCategories };
    },
    onSuccess: (newCategory, variables, context) => {
      // Replace temp category with real one from API (or keep local one)
      const currentCategories = queryClient.getQueryData(['categories']) || [];
      const updatedCategories = currentCategories.map(cat => 
        cat.id.toString().startsWith('temp-') ? newCategory : cat
      );
      
      queryClient.setQueryData(['categories'], updatedCategories);
    },
    onError: (error, variables, context) => {
      console.error('Error creating category:', error);
      // Don't rollback - keep the optimistic update even if API fails
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const response = await categoriesApi.update(id, data);
        return validateApiItem(response.data, CategorySchema);
      } catch (error) {
        // Return the updated data even if API fails
        return {
          id,
          ...data,
          updatedAt: new Date().toISOString(),
          _isLocal: true // Flag to indicate this is local data
        };
      }
    },
    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      
      // Get current categories
      const previousCategories = queryClient.getQueryData(['categories']) || [];
      
      // Find category to update
      const updatedCategories = previousCategories.map(category => {
        if (category.id === id) {
          return {
            ...category,
            ...data,
            updatedAt: new Date().toISOString()
          };
        }
        return category;
      });
      
      // Optimistically update the cache
      queryClient.setQueryData(['categories'], updatedCategories);
      
      return { previousCategories };
    },
    onSuccess: (updatedCategory, variables, context) => {
      // Update with real data from API (or keep local update)
      const currentCategories = queryClient.getQueryData(['categories']) || [];
      const finalCategories = currentCategories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      );
      
      queryClient.setQueryData(['categories'], finalCategories);
    },
    onError: (error, variables, context) => {
      console.error('Error updating category:', error);
      // Don't rollback - keep the optimistic update even if API fails
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      try {
        await categoriesApi.delete(id);
        return id;
      } catch (error) {
        console.error('Error deleting category:', error);
        return id; // Return the ID even if the API call fails
      }
    },
    // Optimistic update
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['categories'] });
      
      // Get current categories
      const previousCategories = queryClient.getQueryData(['categories']) || [];
      
      // Remove the category from cache
      const updatedCategories = previousCategories.filter(category => category.id !== id);
      
      // Optimistically update the cache
      queryClient.setQueryData(['categories'], updatedCategories);
      
      return { previousCategories };
    },
    onError: (error, variables, context) => {
      console.error('Error deleting category:', error);
      // Don't rollback - keep the optimistic update even if API fails
    },
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isPending,
    isError: categoriesQuery.isError,
    error: categoriesQuery.error,
    useCategory,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    createCategoryLoading: createCategoryMutation.isPending,
    updateCategoryLoading: updateCategoryMutation.isPending,
    deleteCategoryLoading: deleteCategoryMutation.isPending,
  };
}
