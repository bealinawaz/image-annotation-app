'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Container } from '@mui/material';
import { useImages } from '@/hooks/useImages';
import { useCategories } from '@/hooks/useCategories';
import HeroSection from './HeroSection';
import StatsOverview from './StatsOverview';
import RecentImages from './RecentImages';
import PopularCategories from './PopularCategories';
import LoadingErrorState from '@/components/shared/LoadingErrorState';

export default function DashboardContent() {
  const { images, isLoading: imagesLoading, isError: imagesError } = useImages();
  const { categories, isLoading: categoriesLoading, isError: categoriesError } = useCategories();
  
  const [stats, setStats] = useState({
    totalImages: 0,
    totalCategories: 0,
    recentImages: [],
    popularCategories: [],
    categoryImages: {}
  });

  // Memoize the category lookup function to avoid recreating it on each render
  const getCategoryName = useCallback((categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }, [categories]);

  useEffect(() => {
    // Only process data when loading is complete and there are no errors
    if (!imagesLoading && !categoriesLoading && !imagesError && !categoriesError) {
      const totalImages = images.length;
      const totalCategories = categories.length;
      
      // Create a new sorted array instead of mutating the original
      const sortedImages = [...images].sort((a, b) => 
        new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime()
      );
      const recentImages = sortedImages.slice(0, 8);
      
      // Find category counts and representative images
      const categoryImagesMap = {};
      const categoryCounts = categories.map(category => {
        const categoryImages = images.filter(img => img.categoryId === category.id);
        const count = categoryImages.length;
        
        // Store a representative image URL for the category (the most recent one)
        if (count > 0) {
          const sortedCategoryImages = [...categoryImages].sort((a, b) => 
            new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime()
          );
          categoryImagesMap[category.id] = sortedCategoryImages[0]?.url;
        }
        
        return { ...category, count };
      }).sort((a, b) => b.count - a.count);
      
      const popularCategories = categoryCounts.slice(0, 5);
      
      setStats({
        totalImages,
        totalCategories,
        recentImages,
        popularCategories,
        categoryImages: categoryImagesMap
      });
    }
  }, [images, categories, imagesLoading, categoriesLoading, imagesError, categoriesError]);

  // Memoize these derived values to avoid recalculating them on each render
  const isLoading = useMemo(() => imagesLoading || categoriesLoading, 
    [imagesLoading, categoriesLoading]);
    
  const isError = useMemo(() => imagesError || categoriesError, 
    [imagesError, categoriesError]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <HeroSection />
      
      <LoadingErrorState 
        isLoading={isLoading} 
        isError={isError}
        loadingMessage="Loading dashboard data..."
        errorMessage="Error loading dashboard data. Please try refreshing the page."
      />
      
      {!isLoading && !isError && (
        <>
          <StatsOverview 
            totalImages={stats.totalImages} 
            totalCategories={stats.totalCategories} 
          />
          
          <RecentImages 
            recentImages={stats.recentImages} 
            getCategoryName={getCategoryName}
            key={`recent-images-${stats.totalImages}`} 
          />
          
          <PopularCategories 
            popularCategories={stats.popularCategories} 
            categoryImages={stats.categoryImages} 
          />
        </>
      )}
    </Container>
  );
} 