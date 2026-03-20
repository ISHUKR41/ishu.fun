/**
 * SmoothScroll.tsx — Lenis ultra-smooth scrolling (v6 - Zero Bounce Fix)
 *
 * FIXED bounce-back issue: The previous version had a frame-skip check
 * (time - lastTime < 2) that caused Lenis to miss RAF frames, resulting
 * in the scroll going down then snapping back slightly.
 *
 * FIX: Call lenis.raf(time) on EVERY frame — never skip. 
 * Lenis internally handles timing/delta so it's safe to call every frame.
 *
 * Also fixed: lerp increased to 0.1 (from 0.075) for faster target convergence,
 * meaning the animation reaches its destination position much sooner with less
 * visible overshoot or bounce.
 *
 * lerp = 1 means instant (native scroll), lerp = 0 means never arrives.
 * lerp = 0.1 is the sweet spot: butter-smooth with zero bounce at 60/120fps.
 */

import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export let globalLenis: Lenis | null = null;

const IS_MOBILE =
  typeof window !== "undefined" &&
  (navigator.maxTouchPoints > 0 ||
    window.matchMedia("(max-width: 768px)").matches);

const IS_TABLET =
  typeof window !== "undefined" &&
  window.matchMedia("(min-width: 769px) and (max-width: 1024px)").matches;

const PREFER_REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function getOptimalLerp(): number {
  if (IS_MOBILE) return 0.12;       // Mobile: faster convergence for snappy feel
  if (IS_TABLET) return 0.1;        // Tablet: balanced
  return 0.1;                        // Desktop: faster = less bounce on trackpads
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
    }, 100);
  }, []);

  useEffect(() => {
    if (PREFER_REDUCED_MOTION) return;

    const lenis = new Lenis({
      // ★ KEY: Use ONLY lerp (no duration) — pure per-frame interpolation
      lerp: getOptimalLerp(),
      // Smooth wheel for all pointer devices (trackpad + mouse wheel)
      smoothWheel: true,
      // Natural wheel multiplier — 1.0 = native feel, no overshoot
      wheelMultiplier: 1.0,
      // Touch momentum — tuned to feel native on trackpads and touch screens
      touchMultiplier: IS_MOBILE ? 1.8 : 1.5,
      // Vertical only
      infinite: false,
      orientation: "vertical" as any,
      gestureOrientation: "vertical" as any,
      // Native touch sync on mobile for best feel
      syncTouch: IS_MOBILE,
      syncTouchLerp: 0.12,
      // Let browser handle resize events
      autoResize: true,
      // Prevent Lenis from hijacking scrollable elements (textareas, select dropdowns)
      prevent: (node: HTMLElement) => {
        return (
          node.nodeName === "TEXTAREA" ||
          node.nodeName === "INPUT" ||
          node.nodeName === "SELECT" ||
          node.contentEditable === "true" ||
          node.classList.contains("lenis-prevent") ||
          // Video players need native scroll
          node.classList.contains("video-js") ||
          node.tagName === "VIDEO"
        );
      },
    } as any);

    lenisRef.current = lenis;
    globalLenis = lenis;

    // ★ CRITICAL FIX: Call lenis.raf(time) on EVERY RAF frame — no frame skipping.
    // The previous frame-skip check (time - lastTime < 2) caused Lenis to miss
    // interpolation steps, making scroll visually bounce back.
    // Lenis internally handles timing so calling every frame is correct and safe.
    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Expose Lenis scroll events for components that listen
    lenis.on("scroll", () => {
      window.dispatchEvent(new CustomEvent("lenis-scroll"));
    });

    window.addEventListener("resize", handleResize, { passive: true });

    // Ensure html/body don't have overflow constraints that block Lenis
    document.documentElement.style.removeProperty("overflow");
    document.documentElement.style.removeProperty("overflow-y");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow-y");

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, [handleResize]);

  // Scroll to top on route change — immediate (no animation) to avoid bounce
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
