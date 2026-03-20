/**
 * SmoothScroll.tsx — Lenis-powered ultra-smooth scrolling
 *
 * Fixes:
 * - Scroll bounce-back on laptop trackpads (was caused by long duration + easeOutExpo)
 * - Scroll lag (tuned lerp per device type)
 * - Trackpad vs mouse detection for optimal feel
 */

import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

let globalLenis: Lenis | null = null;
export const getLenis = () => globalLenis;

const IS_MOBILE =
  typeof window !== "undefined" &&
  (navigator.maxTouchPoints > 0 ||
    window.matchMedia("(max-width: 768px)").matches);

const PREFER_REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const SmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const location = useLocation();
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleResize = useCallback(() => {
    if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    resizeTimerRef.current = setTimeout(() => {
      lenisRef.current?.resize();
    }, 150);
  }, []);

  useEffect(() => {
    if (PREFER_REDUCED_MOTION) return;

    const lerp = IS_MOBILE ? 0.18 : 0.12;

    const lenis = new Lenis({
      lerp,
      smoothWheel: true,
      duration: IS_MOBILE ? 0.55 : 0.65,
      easing: easeOutCubic,
      wheelMultiplier: IS_MOBILE ? 1.0 : 0.85,
      touchMultiplier: 1.8,
      infinite: false,
      orientation: "vertical" as any,
      gestureOrientation: "vertical" as any,
      syncTouch: IS_MOBILE,
      syncTouchLerp: 0.15,
      autoResize: true,
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    lenis.on("scroll", () => {
      window.dispatchEvent(new CustomEvent("scroll"));
    });

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, [handleResize]);

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
