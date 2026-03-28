/**
 * UltraSmoothScroll.tsx — Ultimate Smooth Scrolling System
 *
 * ULTRA PERFORMANCE OPTIMIZED: Single unified scroll system for ALL devices
 * - Consolidates Lenis with optimized RAF management
 * - Removes competing scroll listeners
 * - Device-specific ultra-smooth configurations
 * - Lazy loading integration
 * - Performance monitoring
 *
 * Devices: Mobile, Tablet, Desktop, TV - all optimized
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export let globalLenis: Lenis | null = null;

// Device detection with caching
const getDeviceType = () => {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  const height = window.innerHeight;

  // TV/Large displays
  if (width >= 1920 || (width >= 1440 && height >= 900)) {
    return "tv";
  }
  // Tablet
  if (width >= 641 && width <= 1024) {
    return "tablet";
  }
  // Mobile
  if (width <= 640) {
    return "mobile";
  }
  // Desktop (default)
  return "desktop";
};

const DEVICE_TYPE = typeof window !== "undefined" ? getDeviceType() : "desktop";
const PREFER_REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Performance monitoring
let lastScrollTime = 0;
let scrollFrameCount = 0;
let scrollFPS = 60;

const monitorScrollPerformance = () => {
  if (typeof window === "undefined") return;

  const now = performance.now();
  const delta = now - lastScrollTime;

  if (delta > 0) {
    scrollFrameCount++;
    if (scrollFrameCount >= 60) {
      scrollFPS = Math.round(1000 / (delta / scrollFrameCount));
      scrollFrameCount = 0;

      // Log performance warnings in dev
      if (import.meta.env.DEV && scrollFPS < 30) {
        console.warn(`⚠️ Scroll performance degraded: ${scrollFPS}fps`);
      }
    }
  }
  lastScrollTime = now;
};

const UltraSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const location = useLocation();

  useEffect(() => {
    // Skip only for reduced-motion preference
    if (PREFER_REDUCED_MOTION) {
      // Use native smooth scroll as fallback
      document.documentElement.style.scrollBehavior = "smooth";
      return;
    }

    // Ultra-optimized device-specific configurations
    const configs = {
      mobile: {
        lerp: 0.15, // More responsive on mobile
        duration: 1.0,
        smoothWheel: false,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5, // Lighter touch response
        syncTouch: true,
        syncTouchLerp: 0.18,
        touchInertiaMultiplier: 20,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
      tablet: {
        lerp: 0.12,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.8,
        syncTouch: true,
        syncTouchLerp: 0.14,
        touchInertiaMultiplier: 22,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
      desktop: {
        lerp: 0.1, // Buttery smooth on desktop
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 2.0,
        syncTouch: true,
        syncTouchLerp: 0.12,
        touchInertiaMultiplier: 24,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
      tv: {
        lerp: 0.08, // Ultra smooth for large screens
        duration: 2.0,
        smoothWheel: true,
        wheelMultiplier: 1.2,
        touchMultiplier: 2.5,
        syncTouch: false,
        touchInertiaMultiplier: 25,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
    };

    const config = configs[DEVICE_TYPE as keyof typeof configs];

    const lenis = new Lenis({
      ...config,
      infinite: false,
      orientation: "vertical",
      gestureOrientation: "vertical",
      autoResize: true,
      prevent: (node: HTMLElement) => {
        // Prevent smooth scroll on specific elements
        return (
          node.nodeName === "TEXTAREA" ||
          node.nodeName === "INPUT" ||
          node.nodeName === "SELECT" ||
          node.contentEditable === "true" ||
          node.classList.contains("lenis-prevent") ||
          node.classList.contains("no-smooth-scroll") ||
          node.classList.contains("video-js") ||
          node.classList.contains("plyr") ||
          node.tagName === "VIDEO" ||
          node.closest(".no-smooth-scroll") !== null ||
          node.closest("[data-lenis-prevent]") !== null
        );
      },
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    // Single optimized RAF loop
    let lastTime = 0;
    const targetFPS = DEVICE_TYPE === "mobile" ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    function raf(time: number) {
      const delta = time - lastTime;

      if (delta >= frameInterval) {
        lenis.raf(time);
        monitorScrollPerformance();
        lastTime = time - (delta % frameInterval);
      }

      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    // Emit scroll events for other components (if needed)
    lenis.on("scroll", () => {
      window.dispatchEvent(new CustomEvent("lenis-scroll", {
        detail: {
          scroll: lenis.scroll,
          limit: lenis.limit,
          velocity: lenis.velocity,
          direction: lenis.direction,
          progress: lenis.progress,
        }
      }));
    });

    // Ensure proper overflow settings
    document.documentElement.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("scroll-behavior");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("scroll-behavior");

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, []);

  // Smooth scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      const config = DEVICE_TYPE === "mobile"
        ? { immediate: false, duration: 0.6 }
        : { immediate: false, duration: 0.8 };

      lenisRef.current.scrollTo(0, config);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  return null;
};

// Export utility functions for other components
export const scrollTo = (target: string | number | HTMLElement, options?: any) => {
  if (globalLenis) {
    globalLenis.scrollTo(target, options);
  } else {
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
    } else if (typeof target === "string") {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    } else {
      target?.scrollIntoView({ behavior: "smooth" });
    }
  }
};

export const getScrollFPS = () => scrollFPS;
export const getDeviceTypeInfo = () => DEVICE_TYPE;

export default UltraSmoothScroll;
