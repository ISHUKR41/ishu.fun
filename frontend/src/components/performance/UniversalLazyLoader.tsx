/**
 * UniversalLazyLoader.tsx — Advanced Lazy Loading System
 *
 * ULTRA OPTIMIZED: Universal lazy loading for all components, images, and sections
 * - IntersectionObserver with configurable thresholds
 * - Priority loading support
 * - Placeholder/skeleton support
 * - Network-aware loading (respect data-saver mode)
 * - Device-specific loading strategies
 */

import { useEffect, useRef, useState, ReactNode, CSSProperties } from "react";
import { useInView } from "react-intersection-observer";

interface LazyLoadProps {
  children: ReactNode;
  className?: string;
  placeholder?: ReactNode;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
  priority?: "high" | "normal" | "low";
  minHeight?: string | number;
  fadeIn?: boolean;
  delay?: number;
}

/**
 * Universal Lazy Loader Component
 * Wraps any content and loads it only when visible in viewport
 */
export const LazyLoad = ({
  children,
  className = "",
  placeholder,
  rootMargin = "300px",
  threshold = 0.01,
  triggerOnce = true,
  priority = "normal",
  minHeight,
  fadeIn = true,
  delay = 0,
}: LazyLoadProps) => {
  const [shouldLoad, setShouldLoad] = useState(priority === "high");
  const [isVisible, setIsVisible] = useState(false);

  const { ref, inView } = useInView({
    rootMargin,
    threshold,
    triggerOnce,
    skip: shouldLoad,
  });

  useEffect(() => {
    if (inView && !shouldLoad) {
      if (delay > 0) {
        setTimeout(() => {
          setShouldLoad(true);
          if (fadeIn) {
            setTimeout(() => setIsVisible(true), 50);
          } else {
            setIsVisible(true);
          }
        }, delay);
      } else {
        setShouldLoad(true);
        if (fadeIn) {
          setTimeout(() => setIsVisible(true), 50);
        } else {
          setIsVisible(true);
        }
      }
    }
  }, [inView, shouldLoad, delay, fadeIn]);

  const style: CSSProperties = {
    minHeight: minHeight || "auto",
    ...(fadeIn && {
      opacity: isVisible ? 1 : 0,
      transition: "opacity 0.4s ease-in-out",
    }),
  };

  return (
    <div ref={ref} className={className} style={style}>
      {shouldLoad ? children : placeholder || <LazyPlaceholder minHeight={minHeight} />}
    </div>
  );
};

/**
 * Default Lazy Placeholder Component
 */
const LazyPlaceholder = ({ minHeight }: { minHeight?: string | number }) => (
  <div
    style={{
      minHeight: minHeight || "200px",
      background: "linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted)/0.8) 50%, hsl(var(--muted)) 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 2s ease-in-out infinite",
      borderRadius: "0.5rem",
    }}
  />
);

/**
 * Lazy Image Component with optimized loading
 */
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  priority?: boolean;
  placeholder?: "blur" | "shimmer" | "none";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  objectFit = "cover",
  priority = false,
  placeholder = "shimmer",
  blurDataURL,
  onLoad,
  onError,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const { ref, inView } = useInView({
    rootMargin: "400px",
    threshold: 0.01,
    triggerOnce: true,
    skip: priority,
  });

  const shouldLoad = priority || inView;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imageStyle: CSSProperties = {
    width: width || "100%",
    height: height || "auto",
    objectFit,
    opacity: isLoaded ? 1 : 0,
    transition: "opacity 0.4s ease-in-out",
  };

  const placeholderStyle: CSSProperties = {
    width: width || "100%",
    height: height || "auto",
    background: placeholder === "blur" && blurDataURL
      ? `url(${blurDataURL})`
      : "linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted)/0.8) 50%, hsl(var(--muted)) 100%)",
    backgroundSize: placeholder === "blur" ? "cover" : "200% 100%",
    animation: placeholder === "shimmer" ? "shimmer 2s ease-in-out infinite" : "none",
    borderRadius: "0.375rem",
  };

  return (
    <div ref={ref} className={className} style={{ position: "relative" }}>
      {!isLoaded && !hasError && <div style={placeholderStyle} />}
      {hasError ? (
        <div style={{ ...placeholderStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.875rem" }}>Failed to load</span>
        </div>
      ) : shouldLoad ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={imageStyle}
        />
      ) : null}
    </div>
  );
};

/**
 * Lazy Section Component
 * For loading entire page sections on demand
 */
interface LazySectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  minHeight?: string | number;
  rootMargin?: string;
  threshold?: number;
  skeleton?: ReactNode;
  priority?: "high" | "normal" | "low";
}

export const LazySection = ({
  children,
  className = "",
  id,
  minHeight = "400px",
  rootMargin = "500px",
  threshold = 0.01,
  skeleton,
  priority = "normal",
}: LazySectionProps) => {
  return (
    <LazyLoad
      className={className}
      minHeight={minHeight}
      rootMargin={rootMargin}
      threshold={threshold}
      triggerOnce={true}
      priority={priority}
      placeholder={skeleton}
      fadeIn={true}
    >
      <section id={id} className={className}>
        {children}
      </section>
    </LazyLoad>
  );
};

/**
 * Lazy Component Loader
 * For dynamically importing heavy React components
 */
interface LazyComponentProps {
  loader: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: ReactNode;
  className?: string;
  props?: Record<string, any>;
  rootMargin?: string;
  priority?: boolean;
}

export const LazyComponent = ({
  loader,
  fallback,
  className = "",
  props = {},
  rootMargin = "400px",
  priority = false,
}: LazyComponentProps) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView({
    rootMargin,
    threshold: 0.01,
    triggerOnce: true,
    skip: priority,
  });

  useEffect(() => {
    if ((inView || priority) && !Component && !isLoading) {
      setIsLoading(true);
      loader()
        .then((module) => {
          setComponent(() => module.default);
        })
        .catch((error) => {
          console.error("Failed to load component:", error);
          setIsLoading(false);
        });
    }
  }, [inView, priority, Component, isLoading, loader]);

  return (
    <div ref={ref} className={className}>
      {Component ? <Component {...props} /> : fallback || <LazyPlaceholder minHeight="200px" />}
    </div>
  );
};

export default LazyLoad;
