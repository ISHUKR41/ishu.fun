/**
 * useOptimizedScroll.ts — Single shared scroll listener for 120fps+ performance
 * 
 * Problem: Every page was calling framer-motion's useScroll() which adds
 * its own non-passive scroll event listener. With 30+ pages, this means
 * 30+ scroll listeners firing on every frame, causing lag.
 * 
 * Solution: This hook provides a single, shared, RAF-throttled passive
 * scroll listener. All pages can use this instead of useScroll().
 * 
 * Returns: { scrollY, scrollYProgress } as simple numbers (not MotionValues)
 * 
 * Performance:
 * - Single passive listener shared across all components
 * - requestAnimationFrame throttling (only updates on paint frame)
 * - Automatically cleans up when no components are subscribed
 */

import { useState, useEffect, useCallback, useRef } from "react";

// Shared state across all hook instances
let listenerCount = 0;
let currentScrollY = 0;
let currentScrollYProgress = 0;
let rafId: number | null = null;
const subscribers = new Set<() => void>();

function getScrollValues() {
  const scrollY = window.scrollY || window.pageYOffset;
  const docHeight = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    1
  );
  const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);
  return { scrollY, progress };
}

function handleScroll() {
  if (rafId !== null) return;
  
  rafId = requestAnimationFrame(() => {
    const { scrollY, progress } = getScrollValues();
    currentScrollY = scrollY;
    currentScrollYProgress = progress;
    
    // Notify all subscribers
    subscribers.forEach(fn => fn());
    rafId = null;
  });
}

function addListener() {
  listenerCount++;
  if (listenerCount === 1) {
    // First subscriber — add the single shared listener
    const { scrollY, progress } = getScrollValues();
    currentScrollY = scrollY;
    currentScrollYProgress = progress;
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
}

function removeListener() {
  listenerCount--;
  if (listenerCount <= 0) {
    listenerCount = 0;
    window.removeEventListener("scroll", handleScroll);
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
}

/**
 * Ultra-performant scroll hook.
 * Uses a single shared passive scroll listener with RAF throttling.
 * 
 * @returns {{ scrollY: number, scrollYProgress: number }}
 */
export function useOptimizedScroll() {
  const [scrollY, setScrollY] = useState(currentScrollY);
  const [scrollYProgress, setScrollYProgress] = useState(currentScrollYProgress);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    const update = () => {
      if (mountedRef.current) {
        setScrollY(currentScrollY);
        setScrollYProgress(currentScrollYProgress);
      }
    };

    subscribers.add(update);
    addListener();
    
    // Set initial values
    update();

    return () => {
      mountedRef.current = false;
      subscribers.delete(update);
      removeListener();
    };
  }, []);

  return { scrollY, scrollYProgress };
}

export default useOptimizedScroll;
