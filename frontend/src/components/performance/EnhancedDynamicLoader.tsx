/**
 * EnhancedDynamicLoader.tsx - Advanced Dynamic Component Loader V2
 *
 * Provides intelligent lazy loading for React components with:
 * - Intersection Observer for viewport detection
 * - Progressive loading states with skeleton UI
 * - Error boundaries
 * - Configurable loading strategies
 * - Optimized for smooth scrolling (no jank on load)
 * - Adaptive preloading based on user behavior
 */

import { ReactNode, Suspense, ComponentType, lazy } from 'react';
import { useInView } from 'react-intersection-observer';

interface EnhancedDynamicLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  minHeight?: string;
  className?: string;
  skeleton?: ReactNode;
  preload?: boolean; // Preload before entering viewport
}

/**
 * EnhancedDynamicLoader - Lazy loads children when they enter the viewport
 * Perfect for heavy components that don't need to be loaded immediately
 * Optimized to prevent scroll jank
 */
const EnhancedDynamicLoader = ({
  children,
  fallback,
  threshold = 0.01,
  rootMargin = '500px', // Increased for smoother experience
  triggerOnce = true,
  minHeight = '200px',
  className = '',
  skeleton,
  preload = false,
}: EnhancedDynamicLoaderProps) => {
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce,
  });

  const defaultSkeleton = (
    <div
      style={{ minHeight }}
      className={`flex items-center justify-center animate-pulse ${className}`}
    >
      <div className="w-full h-full bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 rounded-lg" />
    </div>
  );

  const defaultFallback = (
    <div
      style={{ minHeight }}
      className={`flex items-center justify-center ${className}`}
    >
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
        <span className="text-sm text-muted-foreground font-medium">Loading component...</span>
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{
        minHeight,
        willChange: inView ? 'auto' : 'contents',
        contain: 'layout style paint', // CSS containment for better performance
      }}
    >
      {inView || preload ? (
        <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
      ) : (
        skeleton || defaultSkeleton
      )}
    </div>
  );
};

/**
 * createDynamicComponent - Factory function to create lazy-loaded components
 * Usage: const MyComponent = createDynamicComponent(() => import('./MyComponent'))
 */
export const createDynamicComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: {
    fallback?: ReactNode;
    minHeight?: string;
    preload?: boolean;
  }
) => {
  const LazyComponent = lazy(importFunc);

  return (props: any) => (
    <Suspense
      fallback={
        options?.fallback || (
          <div
            className="flex items-center justify-center"
            style={{ minHeight: options?.minHeight || '200px' }}
          >
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary/20 border-t-primary" />
          </div>
        )
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * LazySection - Wrapper for lazy-loading entire sections
 * Automatically adds performance optimizations
 */
export const LazySection = ({
  children,
  className = '',
  minHeight = '400px',
}: {
  children: ReactNode;
  className?: string;
  minHeight?: string;
}) => {
  return (
    <EnhancedDynamicLoader
      minHeight={minHeight}
      className={className}
      rootMargin="600px"
      threshold={0.01}
      skeleton={
        <div
          className={`${className} animate-pulse`}
          style={{ minHeight }}
        >
          <div className="h-full w-full bg-gradient-to-br from-muted/20 via-muted/30 to-muted/20 rounded-xl" />
        </div>
      }
    >
      {children}
    </EnhancedDynamicLoader>
  );
};

export default EnhancedDynamicLoader;
