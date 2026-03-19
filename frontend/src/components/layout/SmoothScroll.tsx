/**
 * SmoothScroll.tsx — Lenis-powered 120fps+ butter-smooth scrolling
 * 
 * Initializes Lenis for silky-smooth scroll interpolation on ALL devices.
 * Lenis intercepts wheel/touch events and applies lerp-based easing,
 * giving a premium scrolling feel at 120fps+ on high-refresh displays.
 * 
 * Features:
 * - Lerp-based smooth scrolling (0.07 = butter smooth, responsive)
 * - Works on laptop trackpad, mouse wheel, touch screens
 * - Scroll-to-top on route change
 * - Syncs with framer-motion's useScroll via scroll event
 * - Auto-cleanup on unmount
 * 
 * DOES NOT: block scroll, set overflow:hidden, or fight ScrollFixer
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

const SmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis with optimized settings for 120fps+
    const lenis = new Lenis({
      // Lower lerp = smoother but slower; 0.07 is the sweet spot for 120fps
      lerp: 0.07,
      // Enable smooth wheel scrolling (this is the main fix for laptop trackpads)
      smoothWheel: true,
      // Duration for wheel-triggered scrolls (in seconds)
      duration: 1.0,
      // Touch multiplier for mobile responsiveness
      touchMultiplier: 1.5,
      // Use the window as the scroll wrapper
      wrapper: window as any,
      content: document.documentElement,
      // Infinite scroll support
      infinite: false,
    });

    lenisRef.current = lenis;

    // RAF loop — Lenis needs to be called on every frame for smooth interpolation
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname]);

  return null; // No DOM output — pure side-effect
};

export default SmoothScroll;
