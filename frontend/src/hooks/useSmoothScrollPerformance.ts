/**
 * useSmoothScrollPerformance.ts - Advanced Scroll Performance Hook
 *
 * Provides utilities for optimizing scroll performance:
 * - Throttled scroll events
 * - Scroll direction detection
 * - Scroll position tracking
 * - Performance monitoring
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { globalLenis } from '@/components/layout/SmoothScroll';

interface ScrollState {
  y: number;
  direction: 'up' | 'down' | null;
  velocity: number;
  isScrolling: boolean;
  progress: number;
}

export const useSmoothScrollPerformance = (throttleMs: number = 16) => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    y: 0,
    direction: null,
    velocity: 0,
    isScrolling: false,
    progress: 0,
  });

  const lastY = useRef(0);
  const lastTime = useRef(Date.now());
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const handleScroll = useCallback(() => {
    const currentY = globalLenis?.scroll || window.scrollY;
    const currentTime = Date.now();
    const deltaY = currentY - lastY.current;
    const deltaTime = currentTime - lastTime.current;

    const velocity = deltaTime > 0 ? deltaY / deltaTime : 0;
    const direction = deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : null;

    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? (currentY / documentHeight) * 100 : 0;

    setScrollState({
      y: currentY,
      direction,
      velocity: Math.abs(velocity),
      isScrolling: true,
      progress: Math.min(100, Math.max(0, progress)),
    });

    lastY.current = currentY;
    lastTime.current = currentTime;

    // Clear previous timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    // Set scrolling to false after scroll stops
    scrollTimeout.current = setTimeout(() => {
      setScrollState((prev) => ({ ...prev, isScrolling: false }));
    }, 150);
  }, []);

  useEffect(() => {
    let rafId: number;
    let lastCallTime = 0;

    const throttledScroll = () => {
      const now = Date.now();
      if (now - lastCallTime >= throttleMs) {
        handleScroll();
        lastCallTime = now;
      }
      rafId = requestAnimationFrame(throttledScroll);
    };

    rafId = requestAnimationFrame(throttledScroll);

    // Listen to Lenis scroll events if available
    if (globalLenis) {
      globalLenis.on('scroll', handleScroll);
    }

    // Fallback to window scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      if (globalLenis) {
        globalLenis.off('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll, throttleMs]);

  const scrollTo = useCallback((target: number | string, options?: any) => {
    if (globalLenis) {
      globalLenis.scrollTo(target, options);
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const scrollToTop = useCallback(() => {
    scrollTo(0, { duration: 1.2, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
  }, [scrollTo]);

  return {
    ...scrollState,
    scrollTo,
    scrollToTop,
    hasScrolled: scrollState.y > 50,
  };
};

export default useSmoothScrollPerformance;
