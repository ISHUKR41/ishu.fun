/**
 * LazyImage.tsx - Lazy Loading Image Component
 *
 * Optimized image component with lazy loading for better performance
 * Uses Intersection Observer API to load images only when they're near the viewport
 * This reduces initial page load time and improves scrolling performance
 */

import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  wrapperClassName?: string;
  effect?: 'blur' | 'opacity' | 'none';
}

const LazyImage = ({
  src,
  alt,
  placeholderSrc,
  threshold = 0.01,
  rootMargin = '200px',
  className = '',
  wrapperClassName = '',
  effect = 'opacity',
  ...props
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholderSrc || '');
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && src) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImageSrc(src);
        setImageLoaded(true);
      };
    }
  }, [inView, src]);

  const effectClass =
    effect === 'blur' && !imageLoaded
      ? 'filter blur-lg scale-110'
      : effect === 'opacity' && !imageLoaded
      ? 'opacity-0'
      : '';

  const transitionClass = imageLoaded
    ? effect === 'blur'
      ? 'filter-none scale-100 transition-all duration-700'
      : effect === 'opacity'
      ? 'opacity-100 transition-opacity duration-500'
      : ''
    : '';

  return (
    <div ref={ref} className={`overflow-hidden ${wrapperClassName}`}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`${className} ${effectClass} ${transitionClass}`}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
