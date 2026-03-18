/**
 * performance.ts - Global Performance Configuration
 * 
 * Centralized performance settings for 90fps+ smooth scrolling
 * and optimal rendering across all devices.
 */

// Device detection
export const IS_MOBILE = typeof window !== 'undefined' && (
  window.innerWidth < 768 || 
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  navigator.maxTouchPoints > 0
);

export const IS_TABLET = typeof window !== 'undefined' && (
  window.innerWidth >= 768 && window.innerWidth < 1024
);

export const IS_LOW_END = typeof window !== 'undefined' && (
  navigator.hardwareConcurrency <= 4 || // 4 or fewer CPU cores
  (navigator as any).deviceMemory <= 4 // 4GB or less RAM
);

export const PREFERS_REDUCED_MOTION = typeof window !== 'undefined' && 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Animation settings - GPU-accelerated only
export const ANIMATION_CONFIG = {
  // Only animate transform and opacity for 60fps+ performance
  allowedProperties: ['transform', 'opacity'],
  
  // Limit simultaneous animations
  maxSimultaneousAnimations: IS_MOBILE ? 3 : IS_LOW_END ? 5 : 8,
  
  // Disable heavy animations on mobile
  disableOnMobile: {
    particles: true,
    morphingBlob: true,
    cursorSpotlight: true,
    tilt3D: true,
    parallax: IS_LOW_END,
  },
  
  // Reduced motion settings
  reducedMotion: {
    duration: 0.2, // Faster animations
    disableParallax: true,
    disableFloating: true,
    disableRotation: true,
  },
};

// Scroll performance
export const SCROLL_CONFIG = {
  // Use passive event listeners for better scroll performance
  passive: true,
  
  // Debounce scroll events
  debounceMs: IS_MOBILE ? 100 : 50,
  
  // Intersection Observer settings
  intersectionThreshold: IS_MOBILE ? 0.1 : 0.2,
  intersectionRootMargin: '50px',
  
  // Virtual scrolling
  overscan: IS_MOBILE ? 2 : 5, // Number of items to render outside viewport
};

// Image optimization
export const IMAGE_CONFIG = {
  // Lazy loading
  loading: 'lazy' as const,
  decoding: 'async' as const,
  
  // Responsive images
  sizes: {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw',
  },
  
  // Placeholder strategy
  usePlaceholder: true,
  placeholderBlur: 10,
};

// 3D Scene optimization
export const SCENE_3D_CONFIG = {
  // Disable on mobile/low-end
  enabled: !IS_MOBILE && !IS_LOW_END && !PREFERS_REDUCED_MOTION,
  
  // Render settings
  antialias: !IS_MOBILE,
  pixelRatio: IS_MOBILE ? 1 : Math.min(window.devicePixelRatio, 2),
  
  // Performance mode
  frameloop: 'demand' as const, // Only render when needed
  
  // Particle counts
  particleCount: IS_MOBILE ? 50 : IS_LOW_END ? 100 : 200,
};

// Bundle optimization
export const BUNDLE_CONFIG = {
  // Lazy load heavy components
  lazyComponents: [
    'ParticleField',
    'MorphingBlob',
    'CursorSpotlight',
    'GlobeScene3D',
    'CVScene3D',
    'ToolsScene3D',
  ],
  
  // Preload critical resources
  preloadFonts: ['Inter', 'Space Grotesk'],
  preloadImages: ['/logo-icon.png'],
};

// React Query optimization
export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

// Framer Motion optimization
export const MOTION_CONFIG = {
  // Reduce motion complexity
  transition: {
    type: 'tween',
    ease: 'easeOut',
    duration: IS_MOBILE ? 0.2 : 0.3,
  },
  
  // Viewport detection for scroll animations
  viewport: {
    once: true, // Only animate once
    margin: '0px 0px -100px 0px',
  },
  
  // Disable layout animations on mobile (expensive)
  layoutTransition: !IS_MOBILE,
};

// GSAP optimization
export const GSAP_CONFIG = {
  // Use will-change sparingly
  autoKillThreshold: 0.1,
  
  // ScrollTrigger settings
  scrollTrigger: {
    scrub: IS_MOBILE ? false : 0.5, // Disable scrub on mobile
    toggleActions: 'play none none reverse',
    start: 'top 80%',
    end: 'bottom 20%',
  },
};

// Video/TV streaming optimization
export const STREAM_CONFIG = {
  // HLS.js settings - optimized for fast initial playback + reliability
  maxBufferLength: IS_MOBILE ? 12 : 20,
  maxMaxBufferLength: IS_MOBILE ? 35 : 60,
  fragLoadingMaxRetry: IS_MOBILE ? 4 : 6,
  fragLoadingRetryDelay: 300,
  manifestLoadingMaxRetry: 6,
  manifestLoadingRetryDelay: 300,
  
  // Preload next channel
  preloadNextChannel: !IS_MOBILE,
};

// Responsive breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1400,
} as const;

// Performance monitoring
export const PERF_CONFIG = {
  // Enable performance monitoring in dev
  enableMonitoring: process.env.NODE_ENV === 'development',
  
  // Log slow renders (> 16ms = < 60fps)
  slowRenderThreshold: 16,
  
  // Log large bundles
  largeBundleThreshold: 500 * 1024, // 500KB
};

// Helper functions
export const shouldEnableAnimation = (animationType: string): boolean => {
  if (PREFERS_REDUCED_MOTION) return false;
  if (IS_MOBILE && ANIMATION_CONFIG.disableOnMobile[animationType as keyof typeof ANIMATION_CONFIG.disableOnMobile]) {
    return false;
  }
  return true;
};

export const getOptimalImageSize = (): string => {
  if (IS_MOBILE) return IMAGE_CONFIG.sizes.mobile;
  if (IS_TABLET) return IMAGE_CONFIG.sizes.tablet;
  return IMAGE_CONFIG.sizes.desktop;
};

export const shouldUse3D = (): boolean => {
  return SCENE_3D_CONFIG.enabled;
};

// CSS will-change helper (use sparingly!)
export const getWillChange = (properties: string[]): string => {
  // Only use will-change for actively animating elements
  return properties.filter(p => 
    ANIMATION_CONFIG.allowedProperties.includes(p)
  ).join(', ');
};

// Debounce helper for scroll events
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle helper for high-frequency events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// RequestAnimationFrame helper for smooth animations
export const rafThrottle = <T extends (...args: any[]) => any>(
  func: T
): ((...args: Parameters<T>) => void) => {
  let rafId: number | null = null;
  return (...args: Parameters<T>) => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
};
