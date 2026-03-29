/**
 * lazyLoadConfig.ts - Global Lazy Loading Configuration
 *
 * Centralized configuration for lazy loading across the application
 * Ensures consistent lazy loading behavior for images, components, and sections
 */

export const LAZY_LOAD_CONFIG = {
  // Image lazy loading settings
  images: {
    rootMargin: '300px', // Load images 300px before they enter viewport
    threshold: 0.01,     // Trigger when even 1% is visible
    effect: 'opacity' as const, // Default transition effect
    placeholderQuality: 20, // Quality for placeholder images (1-100)
  },

  // Component lazy loading settings
  components: {
    rootMargin: '400px', // Load components 400px before viewport
    threshold: 0.01,
    minHeight: '200px', // Minimum height to prevent layout shift
  },

  // Section lazy loading settings (for heavy sections)
  sections: {
    rootMargin: '500px', // Preload sections 500px before viewport
    threshold: 0,
    minHeight: '300px',
  },

  // Virtual scrolling settings (for large lists)
  virtualScroll: {
    overscan: 5,        // Number of items to render outside viewport
    estimateSize: 100,  // Estimated item height in pixels
    enabled: true,
  },

  // Performance settings
  performance: {
    enableNativeLazyLoading: true, // Use native loading="lazy" attribute
    enableAsyncDecoding: true,     // Use decoding="async" for images
    enableContentVisibility: true, // Use CSS content-visibility
    enableIntersectionObserver: true, // Use Intersection Observer API
  },
};

/**
 * Get lazy load settings for images
 */
export const getImageLazyLoadSettings = () => ({
  loading: LAZY_LOAD_CONFIG.performance.enableNativeLazyLoading ? 'lazy' as const : undefined,
  decoding: LAZY_LOAD_CONFIG.performance.enableAsyncDecoding ? 'async' as const : undefined,
  rootMargin: LAZY_LOAD_CONFIG.images.rootMargin,
  threshold: LAZY_LOAD_CONFIG.images.threshold,
});

/**
 * Get lazy load settings for components
 */
export const getComponentLazyLoadSettings = () => ({
  rootMargin: LAZY_LOAD_CONFIG.components.rootMargin,
  threshold: LAZY_LOAD_CONFIG.components.threshold,
  triggerOnce: true,
});

/**
 * Get lazy load settings for sections
 */
export const getSectionLazyLoadSettings = () => ({
  rootMargin: LAZY_LOAD_CONFIG.sections.rootMargin,
  threshold: LAZY_LOAD_CONFIG.sections.threshold,
  minHeight: LAZY_LOAD_CONFIG.sections.minHeight,
});

/**
 * Check if browser supports native lazy loading
 */
export const supportsNativeLazyLoading = () => {
  return 'loading' in HTMLImageElement.prototype;
};

/**
 * Check if browser supports Intersection Observer
 */
export const supportsIntersectionObserver = () => {
  return 'IntersectionObserver' in window;
};

/**
 * Get optimal lazy loading strategy based on browser capabilities
 */
export const getOptimalLazyLoadStrategy = () => {
  const hasIntersectionObserver = supportsIntersectionObserver();
  const hasNativeLazyLoading = supportsNativeLazyLoading();

  return {
    useIntersectionObserver: hasIntersectionObserver,
    useNativeLazyLoading: hasNativeLazyLoading,
    strategy: hasIntersectionObserver && hasNativeLazyLoading
      ? 'hybrid'
      : hasIntersectionObserver
      ? 'intersection-observer'
      : hasNativeLazyLoading
      ? 'native'
      : 'eager',
  };
};
