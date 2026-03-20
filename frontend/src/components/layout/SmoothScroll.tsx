/**
 * SmoothScroll.tsx — Lenis ultra-smooth scrolling (Fixed bounce-back)
 *
 * ROOT CAUSE of bounce-back: Using both `lerp` + `duration` simultaneously.
 * In Lenis v1, `duration` overrides `lerp`. The fixed-time easing on trackpads
 * causes multiple queued animations that appear to bounce/spring back.
 *
 * FIX: Use ONLY `lerp` mode (no `duration`). Lerp does continuous per-frame
 * interpolation — no queued animations, no bounce, perfectly smooth.
 *
 * lerp = 1 means instant (native scroll), lerp = 0 means never arrives.
 * lerp = 0.08 is the sweet spot: butter-smooth with zero bounce.
 */

import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

let globalLenis: Lenis | null = null;

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

// Detect if user has a high-refresh-rate display
const IS_HIGH_REFRESH =
  typeof window !== "undefined" && window.screen &&
  ("refreshRate" in window.screen || window.devicePixelRatio >= 2);

function getOptimalLerp(): number {
  if (IS_MOBILE) return 0.1;        // Mobile: slightly faster for touch feel
  if (IS_TABLET) return 0.085;      // Tablet: middle ground
  return 0.075;                      // Desktop: smooth, zero bounce
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
      // ★ KEY FIX: Use ONLY lerp (no duration) → no bounce, pure interpolation
      lerp: getOptimalLerp(),
      // ★ Do NOT set `duration` — it overrides lerp and causes bounce on trackpads
      smoothWheel: true,
      // Wheel sensitivity — 1.0 is natural, <1 is slower, >1 is faster
      wheelMultiplier: IS_MOBILE ? 1.0 : 1.0,
      // Touch momentum sensitivity
      touchMultiplier: IS_MOBILE ? 2.0 : 1.8,
      // Do not create infinite scroll
      infinite: false,
      // Vertical scrolling only
      orientation: "vertical" as any,
      gestureOrientation: "vertical" as any,
      // Sync touch on mobile for native-feel
      syncTouch: IS_MOBILE,
      syncTouchLerp: 0.1,
      // Auto resize on window resize
      autoResize: true,
      // Prevent over-scroll bounce
      prevent: (node: HTMLElement) => {
        return node.nodeName === "TEXTAREA" ||
               node.nodeName === "INPUT" ||
               node.contentEditable === "true";
      },
    } as any);

    lenisRef.current = lenis;
    globalLenis = lenis;

    // Use a high-precision RAF loop — runs at display refresh rate (60/120fps)
    let lastTime = 0;
    function raf(time: number) {
      // Skip frames only if too many piled up (prevents lag spikes)
      if (time - lastTime < 2) {
        rafRef.current = requestAnimationFrame(raf);
        return;
      }
      lastTime = time;
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    // Dispatch scroll events for components that listen to them
    lenis.on("scroll", () => {
      window.dispatchEvent(new CustomEvent("lenis-scroll"));
    });

    window.addEventListener("resize", handleResize, { passive: true });

    // Fix: ensure html/body don't block Lenis
    document.documentElement.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow");

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, [handleResize]);

  // Scroll to top on route change — use immediate to avoid bounce on navigation
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
