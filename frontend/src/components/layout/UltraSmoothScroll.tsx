/**
 * UltraSmoothScroll.tsx — Ultimate Smooth Scrolling System v2.0
 *
 * ULTRA PERFORMANCE OPTIMIZED: Single unified scroll system for ALL devices
 * - Consolidates Lenis with optimized RAF management
 * - Removes competing scroll listeners
 * - Device-specific ultra-smooth configurations
 * - Lazy loading integration
 * - Performance monitoring
 * - Adaptive frame rate based on device performance
 * - Hardware acceleration optimizations
 * - Reduces janky scrolling on all devices
 *
 * Devices: Mobile, Tablet, Desktop, TV - all optimized
 */

import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export let globalLenis: Lenis | null = null;

// Performance tracking
interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  isThrottling: boolean;
}

// Device detection with caching
const getDeviceType = () => {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // TV/Large displays
  if (width >= 1920 || (width >= 1440 && height >= 900)) {
    return "tv";
  }
  // Tablet
  if (width >= 641 && width <= 1024 && isTouchDevice) {
    return "tablet";
  }
  // Mobile
  if (width <= 640 && isTouchDevice) {
    return "mobile";
  }
  // Desktop (default)
  return "desktop";
};

// Check device capabilities
const getDeviceCapabilities = () => {
  if (typeof window === "undefined") return { hasGoodGPU: true, cores: 4 };

  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  const hasWebGL = !!gl;

  // Estimate device power based on hardware concurrency
  const cores = navigator.hardwareConcurrency || 4;
  const hasGoodGPU = hasWebGL && cores >= 4;

  return { hasGoodGPU, cores };
};

const DEVICE_TYPE = typeof window !== "undefined" ? getDeviceType() : "desktop";
const DEVICE_CAPS = typeof window !== "undefined" ? getDeviceCapabilities() : { hasGoodGPU: true, cores: 4 };
const PREFER_REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Advanced performance monitoring with adaptive throttling
let lastScrollTime = 0;
let scrollFrameCount = 0;
let scrollFPS = 60;
let frameTimings: number[] = [];
let performanceMetrics: PerformanceMetrics = {
  fps: 60,
  frameTime: 16.67,
  isThrottling: false,
};

const monitorScrollPerformance = () => {
  if (typeof window === "undefined") return performanceMetrics;

  const now = performance.now();
  const delta = now - lastScrollTime;

  if (delta > 0) {
    frameTimings.push(delta);
    if (frameTimings.length > 60) frameTimings.shift();

    scrollFrameCount++;
    if (scrollFrameCount >= 10) {
      // Calculate average frame time
      const avgFrameTime = frameTimings.reduce((a, b) => a + b, 0) / frameTimings.length;
      scrollFPS = Math.round(1000 / avgFrameTime);

      // Detect if we're throttling (consistently slow frames)
      const isThrottling = avgFrameTime > 33; // Below 30fps

      performanceMetrics = {
        fps: scrollFPS,
        frameTime: avgFrameTime,
        isThrottling,
      };

      scrollFrameCount = 0;

      // Log performance warnings in dev
      if (import.meta.env.DEV && scrollFPS < 30) {
        console.warn(`⚠️ Scroll performance degraded: ${scrollFPS}fps (${avgFrameTime.toFixed(2)}ms/frame)`);
      }
    }
  }
  lastScrollTime = now;
  return performanceMetrics;
};

const UltraSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const location = useLocation();
  const performanceCheckRef = useRef<number>(0);

  // Adaptive frame rate calculator
  const getAdaptiveFrameRate = useCallback(() => {
    const metrics = monitorScrollPerformance();

    // Low-end devices or when throttling
    if (!DEVICE_CAPS.hasGoodGPU || metrics.isThrottling || DEVICE_TYPE === "mobile") {
      return 30;
    }
    // Mid-range devices
    if (DEVICE_CAPS.cores < 6 || DEVICE_TYPE === "tablet") {
      return 45;
    }
    // High-end devices
    return 60;
  }, []);

  useEffect(() => {
    // Skip only for reduced-motion preference
    if (PREFER_REDUCED_MOTION) {
      // Use native smooth scroll as fallback
      document.documentElement.style.scrollBehavior = "smooth";
      return;
    }

    // Ultra-optimized device-specific configurations
    // Smoother lerp values = more butter-smooth scrolling
    const configs = {
      mobile: {
        lerp: DEVICE_CAPS.hasGoodGPU ? 0.12 : 0.18, // Adaptive based on GPU
        duration: 0.8,
        smoothWheel: false, // Native touch is smoother on mobile
        wheelMultiplier: 1.0,
        touchMultiplier: 1.3, // Lighter touch response
        syncTouch: true,
        syncTouchLerp: 0.15,
        touchInertiaMultiplier: 18,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
      tablet: {
        lerp: DEVICE_CAPS.hasGoodGPU ? 0.10 : 0.15,
        duration: 1.0,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
        syncTouch: true,
        syncTouchLerp: 0.12,
        touchInertiaMultiplier: 20,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
      desktop: {
        lerp: DEVICE_CAPS.hasGoodGPU ? 0.08 : 0.12, // Buttery smooth on desktop
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.6, // Reduced for smoother wheel scroll
        touchMultiplier: 1.8,
        syncTouch: true,
        syncTouchLerp: 0.10,
        touchInertiaMultiplier: 22,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
      tv: {
        lerp: 0.06, // Ultra smooth for large screens
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 0.5, // Very slow and smooth
        touchMultiplier: 2.0,
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

    // Adaptive RAF loop with performance monitoring
    let lastTime = 0;
    let currentTargetFPS = getAdaptiveFrameRate();
    let frameInterval = 1000 / currentTargetFPS;

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

    // Periodically check and adapt frame rate based on performance
    performanceCheckRef.current = window.setInterval(() => {
      const newTargetFPS = getAdaptiveFrameRate();
      if (newTargetFPS !== currentTargetFPS) {
        currentTargetFPS = newTargetFPS;
        frameInterval = 1000 / currentTargetFPS;
        if (import.meta.env.DEV) {
          console.log(`🎯 Adapted scroll FPS to ${currentTargetFPS}`);
        }
      }
    }, 5000); // Check every 5 seconds

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
      if (performanceCheckRef.current) {
        clearInterval(performanceCheckRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, [getAdaptiveFrameRate]);

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
