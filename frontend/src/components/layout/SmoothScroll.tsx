/**
 * SmoothScroll.tsx — Lenis smooth scrolling (ALL devices)
 *
 * ULTRA SMOOTH SCROLLING: Lenis enabled on ALL devices (mobile, tablet, desktop, TV)
 * with optimized settings for each device type to ensure buttery-smooth scrolling
 * across all platforms without lag or jank.
 *
 * Device-specific optimizations:
 * - Mobile: Lighter lerp, optimized touch multiplier
 * - Tablet: Balanced settings for touch and scroll
 * - Desktop: Full smooth scrolling with trackpad/wheel
 * - TV: Optimized for remote/gamepad input
 */

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export let globalLenis: Lenis | null = null;

const PREFER_REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Detect device type for optimized settings
const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
const isTablet = typeof window !== "undefined" && window.matchMedia("(min-width: 641px) and (max-width: 1024px)").matches;
const isTV = typeof window !== "undefined" && window.matchMedia("(min-width: 1920px)").matches;

const SmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const location = useLocation();

  useEffect(() => {
    // Skip Lenis only for reduced-motion preference
    if (PREFER_REDUCED_MOTION) return;

    // Device-optimized Lenis configuration
    let lenisConfig: any = {
      // Default (Desktop) configuration
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
      infinite: false,
      orientation: "vertical",
      gestureOrientation: "vertical",
      autoResize: true,
      syncTouch: true,
      syncTouchLerp: 0.1,
      touchInertiaMultiplier: 20,
      prevent: (node: HTMLElement) => {
        return (
          node.nodeName === "TEXTAREA" ||
          node.nodeName === "INPUT" ||
          node.nodeName === "SELECT" ||
          node.contentEditable === "true" ||
          node.classList.contains("lenis-prevent") ||
          node.classList.contains("video-js") ||
          node.classList.contains("plyr") ||
          node.tagName === "VIDEO" ||
          node.closest(".no-smooth-scroll") !== null
        );
      },
    };

    // Mobile optimization - lighter, more responsive
    if (isMobile) {
      lenisConfig = {
        ...lenisConfig,
        lerp: 0.12,
        touchMultiplier: 1.8,
        syncTouchLerp: 0.15,
        touchInertiaMultiplier: 25,
        smoothWheel: false, // Disable wheel on mobile (not used)
      };
    }
    // Tablet optimization - balanced
    else if (isTablet) {
      lenisConfig = {
        ...lenisConfig,
        lerp: 0.1,
        touchMultiplier: 2.0,
        wheelMultiplier: 1.1,
        syncTouchLerp: 0.12,
        touchInertiaMultiplier: 22,
      };
    }
    // TV optimization - smooth but responsive
    else if (isTV) {
      lenisConfig = {
        ...lenisConfig,
        lerp: 0.06,
        wheelMultiplier: 1.2,
        touchMultiplier: 2.5,
      };
    }

    const lenis = new Lenis(lenisConfig);

    lenisRef.current = lenis;
    globalLenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Expose scroll events
    lenis.on("scroll", () => {
      window.dispatchEvent(new CustomEvent("lenis-scroll"));
    });

    // Ensure html/body don't have overflow constraints
    document.documentElement.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow");

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, []);

  // Scroll to top on route change with smooth animation
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        immediate: false,
        duration: 0.8,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  return null;
};

export default SmoothScroll;
