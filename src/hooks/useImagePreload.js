import { useState, useEffect } from 'react';

/**
 * Custom hook to preload an image and track its loading state
 * @param {string} url - The URL of the image to preload
 * @returns {boolean} - Whether the image has loaded
 */
export default function useImagePreload(url) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // Reset the loading state when URL changes
    setImageLoaded(false);
    
    // Skip if the image URL is not valid
    if (!url) return;
    
    const img = new Image();
    img.src = url;
    
    const handleLoad = () => setImageLoaded(true);
    img.addEventListener('load', handleLoad);
    
    // Check if the image is already cached
    if (img.complete) {
      setImageLoaded(true);
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      img.removeEventListener('load', handleLoad);
    };
  }, [url]); // Only rerun if the image URL changes
  
  return imageLoaded;
} 