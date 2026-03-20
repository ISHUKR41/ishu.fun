/**
 * SmoothScroll.tsx — Lenis-powered 120fps+ ultra-smooth scrolling
 * 
 * Enhanced with native Lenis for buttery-smooth scrolling on all devices.
 * Optimized to prevent bounce-back on laptop trackpads.
 * 
 * Performance features:
 * - Higher lerp (0.1 standard, 0.08 high-refresh) → no lag, no bounce-back
 * - Shorter duration (0.9s) → responsive but smooth
 * - Passive event listeners (never blocks main thread)
 * - Auto scroll-to-top on route change
 * - Syncs with framer-motion scroll events
 * - Automatic debounce for resize events
 */

import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

// Export lenis instance for other components to use
let globalLenis: Lenis | null = null;
export const getLenis = () => globalLenis;

// Detect device capabilities for smart lerp tuning
const IS_HIGH_REFRESH = typeof window !== "undefined" &&
  window.matchMedia?.("(min-resolution: 2dppx)").matches;
const IS_MOBILE = typeof window !== "undefined" &&
  (navigator.maxTouchPoints > 0 || window.matchMedia("(max-width: 768px)").matches);
const PREFER_REDUCED_MOTION = typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Easing function: exponential out — smooth deceleration without overshoot
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

const SmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const location = useLocation();
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced resize handler to recalculate scroll dimensions
  const handleResize = useCallback(() => {
    if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    resizeTimerRef.current = setTimeout(() => {
      lenisRef.current?.resize();
    }, 150);
  }, []);

  useEffect(() => {
    // Skip Lenis if user prefers reduced motion
    if (PREFER_REDUCED_MOTION) return;

    // Lerp values: higher = snappier, less bounce-back
    // Lower lerp (0.04) caused the bounce-back issue — now using 0.1+ for responsiveness
    const lerp = IS_MOBILE ? 0.15 : IS_HIGH_REFRESH ? 0.08 : 0.1;

    // Initialize Lenis with tuned settings to prevent bounce-back
    const lenis = new Lenis({
      // lerp — controls smoothness. 0.1 = responsive & smooth, 0.04 = too laggy (causes bounce)
      lerp,
      // Enable smooth wheel scrolling (critical for laptop trackpads)
      smoothWheel: true,
      // Duration — shorter (0.9s) prevents momentum overshoot/bounce-back
      duration: IS_MOBILE ? 0.7 : 0.9,
      // easing — exponential out prevents overshoot at scroll end
      easing: easeOutExpo,
      // Mouse wheel multiplier
      wheelMultiplier: IS_MOBILE ? 1.0 : 0.9,
      // Touch scroll multiplier for mobile responsiveness
      touchMultiplier: 2.0,
      // Use window as scroll wrapper
      wrapper: window as any,
      content: document.documentElement,
      infinite: false,
      orientation: "vertical" as any,
      gestureOrientation: "vertical" as any,
      // Sync touch to prevent input lag on mobile
      syncTouch: IS_MOBILE,
      syncTouchLerp: 0.1,
      // Auto resize on dimension changes
      autoResize: true,
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    // High-precision RAF loop
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Sync Lenis scroll with framer-motion and other scroll listeners
    lenis.on("scroll", () => {
      window.dispatchEvent(new CustomEvent("scroll"));
    });

    // Listen for window resize to recalculate
    window.addEventListener("resize", handleResize, { passive: true });

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, [handleResize]);

  // Scroll to top on route change — instant, no animation
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname]);

  return null;
};

export default SmoothScroll;
