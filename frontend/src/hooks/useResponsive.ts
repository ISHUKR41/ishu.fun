/**
 * useResponsive.ts - Advanced Responsive Design Hook
 * 
 * Provides real-time device detection and responsive utilities
 * for optimal rendering across all screen sizes.
 */

import { useState, useEffect, useMemo } from 'react';
import { BREAKPOINTS, IS_MOBILE as INITIAL_IS_MOBILE } from '@/config/performance';

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isXLarge: boolean;
  is2XLarge: boolean;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  isTouch: boolean;
  pixelRatio: number;
}

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isSmall: false,
        isMedium: false,
        isLarge: true,
        isXLarge: false,
        is2XLarge: false,
        width: 1920,
        height: 1080,
        orientation: 'landscape',
        isTouch: false,
        pixelRatio: 1,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg,
      isSmall: width < BREAKPOINTS.sm,
      isMedium: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
      isLarge: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isXLarge: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
      is2XLarge: width >= BREAKPOINTS['2xl'],
      width,
      height,
      orientation: width > height ? 'landscape' : 'portrait',
      isTouch: navigator.maxTouchPoints > 0 || 'ontouchstart' in window,
      pixelRatio: window.devicePixelRatio || 1,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number | null = null;

    const handleResize = () => {
      // Use RAF to throttle resize events for better performance
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        setState({
          isMobile: width < BREAKPOINTS.md,
          isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
          isDesktop: width >= BREAKPOINTS.lg,
          isSmall: width < BREAKPOINTS.sm,
          isMedium: width >= BREAKPOINTS.sm && width < BREAKPOINTS.md,
          isLarge: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
          isXLarge: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
          is2XLarge: width >= BREAKPOINTS['2xl'],
          width,
          height,
          orientation: width > height ? 'landscape' : 'portrait',
          isTouch: navigator.maxTouchPoints > 0 || 'ontouchstart' in window,
          pixelRatio: window.devicePixelRatio || 1,
        });

        rafId = null;
      });
    };

    // Use passive listener for better scroll performance
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return state;
};

// Simpler hook for just checking if mobile
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(INITIAL_IS_MOBILE);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };

    let rafId: number | null = null;
    const handleResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        checkMobile();
        rafId = null;
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    checkMobile();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return isMobile;
};

// Hook for media query matching
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    // Legacy browsers
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
};

// Hook for container queries (element-based responsive)
export const useContainerQuery = (ref: React.RefObject<HTMLElement>, breakpoint: number): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setMatches(entry.contentRect.width >= breakpoint);
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, breakpoint]);

  return matches;
};

// Responsive value selector
export const useResponsiveValue = <T,>(values: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  default: T;
}): T => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return useMemo(() => {
    if (isMobile && values.mobile !== undefined) return values.mobile;
    if (isTablet && values.tablet !== undefined) return values.tablet;
    if (isDesktop && values.desktop !== undefined) return values.desktop;
    return values.default;
  }, [isMobile, isTablet, isDesktop, values]);
};

// Grid columns calculator
export const useResponsiveColumns = (config: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
  default: number;
}): number => {
  return useResponsiveValue(config);
};

// Font size calculator
export const useResponsiveFontSize = (baseSize: number): string => {
  const { isMobile, isTablet } = useResponsive();

  return useMemo(() => {
    if (isMobile) return `${baseSize * 0.875}rem`; // 87.5% on mobile
    if (isTablet) return `${baseSize * 0.9375}rem`; // 93.75% on tablet
    return `${baseSize}rem`; // 100% on desktop
  }, [isMobile, isTablet, baseSize]);
};

// Spacing calculator
export const useResponsiveSpacing = (baseSpacing: number): number => {
  const { isMobile, isTablet } = useResponsive();

  return useMemo(() => {
    if (isMobile) return baseSpacing * 0.75; // 75% on mobile
    if (isTablet) return baseSpacing * 0.875; // 87.5% on tablet
    return baseSpacing; // 100% on desktop
  }, [isMobile, isTablet, baseSpacing]);
};
