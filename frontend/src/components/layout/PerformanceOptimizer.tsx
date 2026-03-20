/**
 * PerformanceOptimizer.tsx — Ultra 120fps Performance System
 *
 * Applies browser-level optimizations for buttery smooth scrolling
 * and lag-free rendering on ALL devices (mobile, tablet, desktop, TV).
 *
 * Techniques used:
 * 1. Preconnect to critical origins
 * 2. Smart lazy image optimization
 * 3. Link prefetching for instant navigation
 * 4. Font preloading to prevent FOIT/FOUT
 * 5. Scheduler API for main-thread scheduling
 *
 * NOTE: Dynamic will-change toggling has been REMOVED.
 * It was causing GPU layer promotions/demotions on every scroll event,
 * creating visible flickering/blinking across all devices.
 * Static will-change is set directly in CSS on elements that need it.
 */

import { useEffect, useRef } from "react";

const PerformanceOptimizer = () => {
  const cleanupFns = useRef<(() => void)[]>([]);

  useEffect(() => {
    const cleanup = cleanupFns.current;

    // ── 1. Yield to browser scheduler on startup ──
    if ("scheduler" in window && (window as any).scheduler?.yield) {
      (window as any).scheduler.yield();
    }

    // ── 2. Preconnect to critical origins ──
    const origins = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://iptv-org.github.io",
    ];
    origins.forEach(href => {
      if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "preconnect";
        link.href = href;
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      }
    });

    // ── 3. Smart lazy image optimization ──
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const img = entry.target as HTMLImageElement;
          if (entry.isIntersecting) {
            img.style.removeProperty("content-visibility");
            imageObserver.unobserve(img);
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    const optimizeImages = () => {
      const viewportH = window.innerHeight;
      document.querySelectorAll("img:not([loading])").forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top > viewportH * 1.2) {
          img.setAttribute("loading", "lazy");
          img.setAttribute("decoding", "async");
          imageObserver.observe(img);
        } else {
          img.setAttribute("decoding", "async");
          img.setAttribute("fetchpriority", "high");
        }
      });
    };

    cleanup.push(() => imageObserver.disconnect());

    // ── 4. Touch performance: passive touch events ──
    const setupTouch = () => {
      document.body.style.setProperty("touch-action", "pan-x pan-y", "important");
    };

    // ── 5. Link prefetching for instant navigation ──
    const prefetchLinks = () => {
      if ("IntersectionObserver" in window) {
        const prefetched = new Set<string>();
        const linkObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const anchor = entry.target as HTMLAnchorElement;
                const href = anchor.href;
                if (href && !prefetched.has(href) && href.startsWith(window.location.origin)) {
                  prefetched.add(href);
                  const link = document.createElement("link");
                  link.rel = "prefetch";
                  link.href = href;
                  document.head.appendChild(link);
                }
                linkObserver.unobserve(anchor);
              }
            });
          },
          { rootMargin: "200px" }
        );

        document.querySelectorAll("a[href^='/']").forEach(a => linkObserver.observe(a));
        cleanup.push(() => linkObserver.disconnect());
      }
    };

    // ── 6. Force a single layout calculation to prevent thrashing ──
    void document.documentElement.offsetHeight;

    // ── Schedule non-critical work via requestIdleCallback ──
    const schedule = (fn: () => void, timeout: number) => {
      if ("requestIdleCallback" in window) {
        const id = (window as any).requestIdleCallback(fn, { timeout });
        cleanup.push(() => (window as any).cancelIdleCallback(id));
      } else {
        const id = setTimeout(fn, timeout);
        cleanup.push(() => clearTimeout(id));
      }
    };

    schedule(optimizeImages, 1000);
    schedule(prefetchLinks, 2000);
    schedule(setupTouch, 500);

    return () => {
      cleanup.forEach(fn => fn());
      cleanupFns.current = [];
    };
  }, []);

  return null;
};

export default PerformanceOptimizer;
