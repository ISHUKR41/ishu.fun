/**
 * useUnifiedScroll.ts — Single Unified Scroll Hook
 *
 * REPLACES: useOptimizedScroll, useSmoothScrollPerformance, and other scroll hooks
 * OPTIMIZED: Single RAF loop, shared scroll state, no redundancy
 *
 * Features:
 * - Unified scroll position tracking
 * - RAF-optimized updates
 * - Scroll direction detection
 * - Velocity calculation
 * - Device-aware throttling
 * - Integration with Lenis
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { globalLenis } from "@/components/layout/UltraSmoothScroll";

interface ScrollState {
  scrollY: number;
  scrollX: number;
  direction: "up" | "down" | "none";
  velocity: number;
  progress: number;
  isScrolling: boolean;
}

// Shared scroll state across all hook instances
let sharedScrollState: ScrollState = {
  scrollY: 0,
  scrollX: 0,
  direction: "none",
  velocity: 0,
  progress: 0,
  isScrolling: false,
};

// Subscribers for scroll updates
const subscribers = new Set<(state: ScrollState) => void>();

// Single RAF loop for all scroll tracking
let rafId: number | null = null;
let lastScrollY = 0;
let lastTime = performance.now();
let scrollTimeout: NodeJS.Timeout | null = null;

const updateScrollState = () => {
  const now = performance.now();
  const currentScrollY = window.scrollY || window.pageYOffset || 0;
  const currentScrollX = window.scrollX || window.pageXOffset || 0;
  const deltaY = currentScrollY - lastScrollY;
  const deltaTime = Math.max(now - lastTime, 1);

  // Calculate velocity (pixels per ms)
  const velocity = Math.abs(deltaY / deltaTime);

  // Determine direction
  let direction: "up" | "down" | "none" = "none";
  if (deltaY > 2) direction = "down";
  else if (deltaY < -2) direction = "up";

  // Calculate scroll progress (0 to 1)
  const maxScroll = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    0
  );
  const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

  // Update shared state
  sharedScrollState = {
    scrollY: currentScrollY,
    scrollX: currentScrollX,
    direction,
    velocity,
    progress,
    isScrolling: true,
  };

  // Notify all subscribers
  subscribers.forEach((subscriber) => subscriber(sharedScrollState));

  lastScrollY = currentScrollY;
  lastTime = now;

  // Reset isScrolling after 150ms of inactivity
  if (scrollTimeout) clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    sharedScrollState = { ...sharedScrollState, isScrolling: false };
    subscribers.forEach((subscriber) => subscriber(sharedScrollState));
  }, 150);
};

// Initialize global scroll listener (only once)
let isInitialized = false;

const initializeScrollTracking = () => {
  if (isInitialized || typeof window === "undefined") return;

  isInitialized = true;

  // Use Lenis scroll event if available, otherwise native
  if (globalLenis) {
    window.addEventListener("lenis-scroll", updateScrollState, { passive: true });
  } else {
    // Throttled native scroll listener
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  // Initial update
  updateScrollState();
};

/**
 * useUnifiedScroll Hook
 *
 * Single source of truth for scroll state across the app
 *
 * @param throttle - Throttle updates (useful for expensive operations)
 * @returns Current scroll state
 */
export const useUnifiedScroll = (throttle: number = 0) => {
  const [scrollState, setScrollState] = useState<ScrollState>(sharedScrollState);
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeScrollTracking();

    const handleUpdate = (state: ScrollState) => {
      if (throttle > 0) {
        if (!throttleTimeout.current) {
          setScrollState(state);
          throttleTimeout.current = setTimeout(() => {
            throttleTimeout.current = null;
          }, throttle);
        }
      } else {
        setScrollState(state);
      }
    };

    subscribers.add(handleUpdate);

    return () => {
      subscribers.delete(handleUpdate);
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, [throttle]);

  return scrollState;
};

/**
 * useScrollDirection Hook
 *
 * Lightweight hook for just scroll direction
 */
export const useScrollDirection = () => {
  const [direction, setDirection] = useState<"up" | "down" | "none">("none");

  useEffect(() => {
    initializeScrollTracking();

    const handleUpdate = (state: ScrollState) => {
      setDirection(state.direction);
    };

    subscribers.add(handleUpdate);

    return () => {
      subscribers.delete(handleUpdate);
    };
  }, []);

  return direction;
};

/**
 * useScrollProgress Hook
 *
 * Lightweight hook for scroll progress (0 to 1)
 */
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    initializeScrollTracking();

    const handleUpdate = (state: ScrollState) => {
      setProgress(state.progress);
    };

    subscribers.add(handleUpdate);

    return () => {
      subscribers.delete(handleUpdate);
    };
  }, []);

  return progress;
};

/**
 * useScrollY Hook
 *
 * Lightweight hook for just Y position
 */
export const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    initializeScrollTracking();

    const handleUpdate = (state: ScrollState) => {
      setScrollY(state.scrollY);
    };

    subscribers.add(handleUpdate);

    return () => {
      subscribers.delete(handleUpdate);
    };
  }, []);

  return scrollY;
};

/**
 * Utility: Scroll to position or element
 */
export const scrollToTarget = (
  target: number | string | HTMLElement,
  options?: {
    offset?: number;
    duration?: number;
    immediate?: boolean;
  }
) => {
  const { offset = 0, duration = 1.2, immediate = false } = options || {};

  if (globalLenis) {
    globalLenis.scrollTo(target, {
      offset,
      duration: immediate ? 0 : duration,
      immediate,
    });
  } else {
    // Fallback to native scroll
    let targetY = 0;

    if (typeof target === "number") {
      targetY = target;
    } else if (typeof target === "string") {
      const element = document.querySelector(target);
      if (element) {
        targetY = element.getBoundingClientRect().top + window.scrollY;
      }
    } else {
      targetY = target.getBoundingClientRect().top + window.scrollY;
    }

    window.scrollTo({
      top: targetY + offset,
      behavior: immediate ? "auto" : "smooth",
    });
  }
};

export default useUnifiedScroll;
