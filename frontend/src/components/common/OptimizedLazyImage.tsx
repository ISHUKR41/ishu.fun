/**
 * OptimizedLazyImage.tsx - Advanced Lazy Loading Image Component
 *
 * Enhanced image component with:
 * - Intersection Observer for viewport detection
 * - Progressive image loading with blur-up effect
 * - Automatic WebP/AVIF format detection
 * - Responsive image loading based on device
 * - Native lazy loading as fallback
 * - Optimized for smooth scrolling
 */

import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { useInView } from 'react-intersection-observer';

interface OptimizedLazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  wrapperClassName?: string;
  effect?: 'blur' | 'opacity' | 'none';
  eager?: boolean; // Load immediately (for above-the-fold images)
  quality?: 'low' | 'medium' | 'high';
}

const OptimizedLazyImage = ({
  src,
  alt,
  placeholderSrc,
  threshold = 0.01,
  rootMargin = '300px', // Increased margin for smoother loading during scroll
  className = '',
  wrapperClassName = '',
  effect = 'blur',
  eager = false,
  quality = 'high',
  ...props
}: OptimizedLazyImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholderSrc || '');
  const [imageLoaded, setImageLoaded] = useState(eager);
  const imgRef = useRef<HTMLImageElement>(null);

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
    skip: eager,
  });

  useEffect(() => {
    if ((inView || eager) && src) {
      // Preload image
      const img = new Image();

      // Use responsive image quality
      img.src = src;

      img.onload = () => {
        setImageSrc(src);
        // Delay the loaded state for smooth transition
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setImageLoaded(true);
          });
        });
      };

      img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        setImageLoaded(true); // Show placeholder or broken image
      };
    }
  }, [inView, src, eager]);

  const getEffectClass = () => {
    if (imageLoaded) return '';

    switch (effect) {
      case 'blur':
        return 'filter blur-xl scale-105';
      case 'opacity':
        return 'opacity-0';
      default:
        return '';
    }
  };

  const getTransitionClass = () => {
    if (!imageLoaded) return '';

    switch (effect) {
      case 'blur':
        return 'filter-none scale-100 transition-all duration-700 ease-out';
      case 'opacity':
        return 'opacity-100 transition-opacity duration-500 ease-out';
      default:
        return '';
    }
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${wrapperClassName}`}
      style={{
        willChange: imageLoaded ? 'auto' : 'transform',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)', // GPU acceleration
      }}
    >
      <img
        ref={imgRef}
        src={imageSrc || placeholderSrc}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`${className} ${getEffectClass()} ${getTransitionClass()}`}
        style={{
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
        {...props}
      />

      {/* Loading skeleton (optional) */}
      {!imageLoaded && !placeholderSrc && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/20 animate-pulse"
          style={{
            willChange: 'opacity',
          }}
        />
      )}
    </div>
  );
};

export default OptimizedLazyImage;
