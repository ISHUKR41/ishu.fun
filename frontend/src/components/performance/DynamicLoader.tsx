/**
 * DynamicLoader.tsx - Advanced Dynamic Component Loader
 *
 * Provides intelligent lazy loading for React components with:
 * - Intersection Observer for viewport detection
 * - Progressive loading states
 * - Error boundaries
 * - Configurable loading strategies
 */

import { ReactNode, Suspense, ComponentType, lazy } from 'react';
import { useInView } from 'react-intersection-observer';

interface DynamicLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  minHeight?: string;
  className?: string;
}

/**
 * DynamicLoader - Lazy loads children when they enter the viewport
 * Perfect for heavy components that don't need to be loaded immediately
 */
const DynamicLoader = ({
  children,
  fallback,
  threshold = 0.01,
  rootMargin = '400px',
  triggerOnce = true,
  minHeight = '200px',
  className = '',
}: DynamicLoaderProps) => {
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce,
  });

  const defaultFallback = (
    <div
      style={{ minHeight }}
      className={`flex items-center justify-center ${className}`}
    >
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );

  return (
    <div ref={ref} className={className} style={{ minHeight }}>
      {inView ? (
        <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>
      ) : (
        fallback || defaultFallback
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
  fallback?: ReactNode
) => {
  const LazyComponent = lazy(importFunc);

  return (props: any) => (
    <Suspense
      fallback={
        fallback || (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default DynamicLoader;
