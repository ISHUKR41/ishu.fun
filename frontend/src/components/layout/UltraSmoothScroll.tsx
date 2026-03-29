/**
 * UltraSmoothScroll.tsx — Ultimate Smooth Scrolling System v2
 *
 * ULTRA PERFORMANCE OPTIMIZED: Single unified scroll system for ALL devices
 * - Enhanced Lenis configuration with advanced RAF management
 * - Adaptive FPS based on device capabilities
 * - Device-specific ultra-smooth configurations
 * - Lazy loading integration
 * - Real-time performance monitoring and auto-adjustment
 * - Prevents scroll jank and lag on all devices
 *
 * Devices: Mobile, Tablet, Desktop, TV - all optimized with smart detection
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export let globalLenis: Lenis | null = null;

// Device detection with enhanced logic and touch support detection
const getDeviceType = () => {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // TV/Large displays
  if (width >= 1920 || (width >= 1440 && height >= 900)) {
    return "tv";
  }
  // Tablet (with touch support)
  if ((width >= 641 && width <= 1024) || (isTouchDevice && width <= 1366)) {
    return "tablet";
  }
  // Mobile
  if (width <= 640 || (isTouchDevice && width <= 768)) {
    return "mobile";
  }
  // Desktop (default)
  return "desktop";
};

const DEVICE_TYPE = typeof window !== "undefined" ? getDeviceType() : "desktop";
const PREFER_REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const IS_TOUCH_DEVICE = typeof window !== "undefined" && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

// Performance monitoring with better FPS tracking
let lastScrollTime = 0;
let scrollFrameCount = 0;
let scrollFPS = 60;
let fpsHistory: number[] = [];
let isLowPerformance = false;

const monitorScrollPerformance = () => {
  if (typeof window === "undefined") return;

  const now = performance.now();
  const delta = now - lastScrollTime;

  if (delta > 0) {
    scrollFrameCount++;
    const currentFPS = Math.round(1000 / delta);

    if (scrollFrameCount >= 10) {
      fpsHistory.push(currentFPS);
      if (fpsHistory.length > 30) fpsHistory.shift();

      const avgFPS = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
      scrollFPS = Math.round(avgFPS);
      scrollFrameCount = 0;

      // Detect low performance
      isLowPerformance = scrollFPS < 45;

      // Log performance warnings in dev
      if (import.meta.env.DEV && scrollFPS < 30) {
        console.warn(`⚠️ Scroll performance degraded: ${scrollFPS}fps (avg of last ${fpsHistory.length} samples)`);
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

    // Ultra-optimized device-specific configurations (enhanced)
    const configs = {
      mobile: {
        lerp: isLowPerformance ? 0.2 : 0.15, // Adaptive based on performance
        duration: 0.8,
        smoothWheel: false,
        wheelMultiplier: 1.0,
        touchMultiplier: IS_TOUCH_DEVICE ? 1.4 : 1.5,
        syncTouch: true,
        syncTouchLerp: 0.2,
        touchInertiaMultiplier: 18,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
      tablet: {
        lerp: isLowPerformance ? 0.15 : 0.11,
        duration: 1.0,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: IS_TOUCH_DEVICE ? 1.6 : 1.8,
        syncTouch: true,
        syncTouchLerp: 0.15,
        touchInertiaMultiplier: 20,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
      desktop: {
        lerp: isLowPerformance ? 0.14 : 0.09, // Buttery smooth on desktop
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 2.0,
        syncTouch: IS_TOUCH_DEVICE,
        syncTouchLerp: 0.11,
        touchInertiaMultiplier: 22,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
      tv: {
        lerp: 0.07, // Ultra smooth for large screens
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 1.3,
        touchMultiplier: 2.5,
        syncTouch: false,
        touchInertiaMultiplier: 24,
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

    // Single optimized RAF loop with adaptive FPS
    let lastTime = 0;
    // Adaptive target FPS based on device and performance
    const getTargetFPS = () => {
      if (DEVICE_TYPE === "mobile" && isLowPerformance) return 30;
      if (DEVICE_TYPE === "mobile") return 45;
      if (isLowPerformance) return 45;
      return 60;
    };

    let targetFPS = getTargetFPS();
    let frameInterval = 1000 / targetFPS;

    // Dynamically adjust FPS if performance drops
    let performanceCheckCounter = 0;

    function raf(time: number) {
      const delta = time - lastTime;

      if (delta >= frameInterval) {
        lenis.raf(time);
        monitorScrollPerformance();
        lastTime = time - (delta % frameInterval);

        // Periodically adjust target FPS based on performance
        performanceCheckCounter++;
        if (performanceCheckCounter > 120) {
          const newTargetFPS = getTargetFPS();
          if (newTargetFPS !== targetFPS) {
            targetFPS = newTargetFPS;
            frameInterval = 1000 / targetFPS;
            if (import.meta.env.DEV) {
              console.log(`🎯 Adjusted target FPS to ${targetFPS} (current: ${scrollFPS}fps)`);
            }
          }
          performanceCheckCounter = 0;
        }
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
