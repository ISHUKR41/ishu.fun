/**
 * SmoothScroll.tsx — Lenis smooth scrolling (Desktop only)
 *
 * PERFORMANCE FIX: Lenis is disabled on mobile devices.
 * Mobile browsers already have native smooth momentum scrolling.
 * Running Lenis on mobile adds RAF overhead with zero visual benefit
 * and can interfere with native touch gestures.
 *
 * On desktop, Lenis provides butter-smooth trackpad/wheel scrolling.
 */

import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export let globalLenis: Lenis | null = null;

const IS_MOBILE =
  typeof window !== "undefined" &&
  (navigator.maxTouchPoints > 0 ||
    window.matchMedia("(max-width: 768px)").matches);

const PREFER_REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const SmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const location = useLocation();

  useEffect(() => {
    // Skip Lenis entirely on mobile and reduced-motion
    if (IS_MOBILE || PREFER_REDUCED_MOTION) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
      orientation: "vertical" as any,
      gestureOrientation: "vertical" as any,
      autoResize: true,
      prevent: (node: HTMLElement) => {
        return (
          node.nodeName === "TEXTAREA" ||
          node.nodeName === "INPUT" ||
          node.nodeName === "SELECT" ||
          node.contentEditable === "true" ||
          node.classList.contains("lenis-prevent") ||
          node.classList.contains("video-js") ||
          node.tagName === "VIDEO"
        );
      },
    } as any);

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

  // Scroll to top on route change
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
