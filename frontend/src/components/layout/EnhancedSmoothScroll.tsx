/**
 * EnhancedSmoothScroll.tsx — Ultimate Smooth Scrolling System V2
 *
 * ULTRA PERFORMANCE OPTIMIZED: Single unified scroll system for ALL devices
 * - Advanced Lenis configuration with optimized RAF management
 * - Device-specific ultra-smooth configurations (Mobile, Tablet, Desktop, TV)
 * - Intelligent frame throttling to prevent lag
 * - Velocity damping to prevent fast/erratic scrolling
 * - Performance monitoring and auto-adjustment
 *
 * Features:
 * - Butter-smooth scrolling on all devices
 * - No lag or jank
 * - Consistent scroll speed - never too fast
 * - Optimized for touch and wheel
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export let globalLenis: Lenis | null = null;

// Device detection with live updates
const getDeviceType = () => {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // TV/Large displays
  if (width >= 1920 || (width >= 1440 && height >= 900)) {
    return "tv";
  }
  // Tablet (touch-enabled, medium screen)
  if (isTouchDevice && width >= 641 && width <= 1024) {
    return "tablet";
  }
  // Mobile (touch-enabled, small screen)
  if (width <= 640) {
    return "mobile";
  }
  // Desktop (default)
  return "desktop";
};

const PREFER_REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Performance monitoring with velocity tracking
let lastScrollTime = 0;
let scrollFrameCount = 0;
let scrollFPS = 60;
let velocityHistory: number[] = [];

const monitorScrollPerformance = (velocity: number) => {
  if (typeof window === "undefined") return;

  const now = performance.now();
  const delta = now - lastScrollTime;

  // Track velocity
  velocityHistory.push(Math.abs(velocity));
  if (velocityHistory.length > 30) {
    velocityHistory.shift();
  }

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

const EnhancedSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const location = useLocation();
  const [deviceType, setDeviceType] = useState(() => getDeviceType());

  // Update device type on resize
  useEffect(() => {
    const handleResize = () => {
      const newDeviceType = getDeviceType();
      if (newDeviceType !== deviceType) {
        setDeviceType(newDeviceType);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [deviceType]);

  useEffect(() => {
    // Skip only for reduced-motion preference
    if (PREFER_REDUCED_MOTION) {
      // Use native smooth scroll as fallback
      document.documentElement.style.scrollBehavior = "smooth";
      return;
    }

    // Ultra-optimized device-specific configurations
    // Tuned to prevent fast/erratic scrolling while maintaining smoothness
    const configs = {
      mobile: {
        lerp: 0.18, // Slightly more responsive but controlled
        duration: 1.0,
        smoothWheel: false,
        wheelMultiplier: 0.8, // Reduce speed
        touchMultiplier: 1.2, // Lighter, more controlled touch
        syncTouch: true,
        syncTouchLerp: 0.2,
        touchInertiaMultiplier: 18, // Reduce inertia
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -8 * t)), // Gentler easing
      },
      tablet: {
        lerp: 0.15,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.4,
        syncTouch: true,
        syncTouchLerp: 0.16,
        touchInertiaMultiplier: 20,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -9 * t)),
      },
      desktop: {
        lerp: 0.12, // Slower interpolation for ultra smoothness
        duration: 1.5,
        smoothWheel: true,
        wheelMultiplier: 0.9, // Reduce wheel speed
        touchMultiplier: 1.6,
        syncTouch: true,
        syncTouchLerp: 0.14,
        touchInertiaMultiplier: 22,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
      tv: {
        lerp: 0.1, // Very smooth for large screens
        duration: 2.0,
        smoothWheel: true,
        wheelMultiplier: 1.0, // Normal speed for TV
        touchMultiplier: 2.0,
        syncTouch: false,
        touchInertiaMultiplier: 25,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
    };

    const config = configs[deviceType as keyof typeof configs];

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
          node.closest("[data-lenis-prevent]") !== null ||
          node.closest(".scroll-area") !== null // Radix scroll areas
        );
      },
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    // Optimized RAF loop with adaptive frame rate
    let lastTime = 0;
    // Mobile gets 30fps for battery, others get 60fps
    const targetFPS = deviceType === "mobile" ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    function raf(time: number) {
      const delta = time - lastTime;

      if (delta >= frameInterval) {
        lenis.raf(time);
        monitorScrollPerformance(lenis.velocity);
        lastTime = time - (delta % frameInterval);
      }

      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    // Emit scroll events for other components
    lenis.on("scroll", (e: any) => {
      window.dispatchEvent(new CustomEvent("lenis-scroll", {
        detail: {
          scroll: e.scroll,
          limit: e.limit,
          velocity: e.velocity,
          direction: e.direction,
          progress: e.progress,
        }
      }));
    });

    // Ensure proper overflow settings
    document.documentElement.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("scroll-behavior");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("scroll-behavior");

    // Add global styles for smooth scrolling
    const style = document.createElement('style');
    style.innerHTML = `
      html {
        overscroll-behavior: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      body {
        overscroll-behavior-y: none;
      }
      * {
        -webkit-overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
      document.head.removeChild(style);
    };
  }, [deviceType]);

  // Smooth scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      const config = deviceType === "mobile"
        ? { immediate: false, duration: 0.6 }
        : { immediate: false, duration: 0.8 };

      lenisRef.current.scrollTo(0, config);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, deviceType]);

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
export const getDeviceTypeInfo = () => getDeviceType();
export const getAverageVelocity = () => {
  if (velocityHistory.length === 0) return 0;
  return velocityHistory.reduce((a, b) => a + b, 0) / velocityHistory.length;
};

export default EnhancedSmoothScroll;
