/**
 * OptimizedLayout.tsx - Performance-Optimized Layout Wrapper
 * 
 * Automatically applies performance optimizations to all pages:
 * - GPU acceleration
 * - Smooth scrolling
 * - Responsive background images
 * - Content visibility
 * - Intersection Observer for lazy loading
 */

import { useEffect, useRef, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { IS_MOBILE, PREFERS_REDUCED_MOTION, shouldEnableAnimation } from '@/config/performance';

interface OptimizedLayoutProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundGradient?: string;
  enableParallax?: boolean;
  className?: string;
}

export const OptimizedLayout = ({
  children,
  backgroundImage,
  backgroundGradient,
  enableParallax = false,
  className = '',
}: OptimizedLayoutProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  // Apply GPU acceleration and performance optimizations
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Force GPU compositing
    container.style.transform = 'translateZ(0)';
    container.style.webkitTransform = 'translateZ(0)';

    // Enable hardware acceleration for children
    const children = container.querySelectorAll('[data-animate]');
    children.forEach((child) => {
      if (child instanceof HTMLElement) {
        child.style.transform = 'translateZ(0)';
        child.style.webkitTransform = 'translateZ(0)';
      }
    });

    // Parallax effect (desktop only)
    if (enableParallax && !IS_MOBILE && !PREFERS_REDUCED_MOTION && shouldEnableAnimation('parallax')) {
      let rafId: number | null = null;

      const handleScroll = () => {
        if (rafId !== null) return;

        rafId = requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const parallaxElements = container.querySelectorAll('[data-parallax]');

          parallaxElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              const speed = parseFloat(el.dataset.parallaxSpeed || '0.5');
              const yPos = -(scrollY * speed);
              el.style.transform = `translate3d(0, ${yPos}px, 0)`;
            }
          });

          rafId = null;
        });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }
  }, [enableParallax]);

  // Intersection Observer for lazy loading sections
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Remove will-change after animation
            setTimeout(() => {
              if (entry.target instanceof HTMLElement) {
                entry.target.style.willChange = 'auto';
              }
            }, 1000);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    const lazyElements = containerRef.current.querySelectorAll('[data-lazy]');
    lazyElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const backgroundStyle: React.CSSProperties = {
    ...(backgroundImage && {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: IS_MOBILE ? 'scroll' : 'fixed', // Fixed on desktop for parallax
    }),
    ...(backgroundGradient && {
      background: backgroundGradient,
    }),
    ...(backgroundImage && backgroundGradient && {
      background: `${backgroundGradient}, url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundBlendMode: 'overlay',
    }),
  };

  return (
    <div
      ref={containerRef}
      className={`optimized-layout ${className}`}
      style={backgroundStyle}
    >
      {children}
    </div>
  );
};

// Optimized Section Component
interface OptimizedSectionProps {
  children: ReactNode;
  className?: string;
  lazy?: boolean;
  parallax?: boolean;
  parallaxSpeed?: number;
  animate?: boolean;
}

export const OptimizedSection = ({
  children,
  className = '',
  lazy = true,
  parallax = false,
  parallaxSpeed = 0.5,
  animate = true,
}: OptimizedSectionProps) => {
  return (
    <section
      className={`optimized-section ${className}`}
      data-lazy={lazy ? 'true' : undefined}
      data-parallax={parallax ? 'true' : undefined}
      data-parallax-speed={parallax ? parallaxSpeed : undefined}
      data-animate={animate ? 'true' : undefined}
      style={{
        contain: 'layout style paint',
        contentVisibility: lazy ? 'auto' : 'visible',
      }}
    >
      {children}
    </section>
  );
};

// Optimized Image Component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  objectFit = 'cover',
}: OptimizedImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      style={{
        objectFit,
        maxWidth: '100%',
        height: 'auto',
        contentVisibility: priority ? 'visible' : 'auto',
      }}
    />
  );
};

// Optimized Video Component
interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
}

export const OptimizedVideo = ({
  src,
  poster,
  className = '',
  autoPlay = false,
  loop = false,
  muted = true,
  playsInline = true,
}: OptimizedVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !autoPlay) return;

    // Lazy load video on mobile
    if (IS_MOBILE) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && videoRef.current) {
              videoRef.current.play().catch(() => {});
              observer.disconnect();
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(videoRef.current);

      return () => observer.disconnect();
    } else {
      videoRef.current.play().catch(() => {});
    }
  }, [autoPlay]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      className={className}
      autoPlay={!IS_MOBILE && autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      preload={IS_MOBILE ? 'none' : 'metadata'}
      style={{
        maxWidth: '100%',
        height: 'auto',
        contentVisibility: 'auto',
      }}
    />
  );
};

export default OptimizedLayout;
