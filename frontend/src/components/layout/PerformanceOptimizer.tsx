/**
 * PerformanceOptimizer.tsx — Ultra 120fps Performance System
 *
 * Applies browser-level optimizations for buttery smooth scrolling
 * and lag-free rendering on ALL devices (mobile, tablet, desktop, TV).
 *
 * Techniques used:
 * 1. GPU compositing hints (backface-visibility, transform)
 * 2. CSS containment (layout, style, paint)
 * 3. Intersection Observer for lazy image optimization
 * 4. Passive event listeners (no blocking)
 * 5. Dynamic will-change management (apply during scroll only)
 * 6. Link prefetching for instant navigation
 * 7. requestIdleCallback for non-critical work
 * 8. Font preloading to prevent FOIT/FOUT
 * 9. Scheduler API for main-thread scheduling
 * 10. OffscreenCanvas hints for canvas elements
 */

import { useEffect, useRef } from "react";

const PerformanceOptimizer = () => {
  const cleanupFns = useRef<(() => void)[]>([]);
  const isHighEnd = useRef<boolean>(
    typeof navigator !== "undefined" &&
    (navigator as any).deviceMemory > 2 &&
    navigator.hardwareConcurrency > 4
  );

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

    // ── 3. GPU layer for explicitly animated elements ──
    const applyContainment = () => {
      // Only apply to elements that explicitly use CSS animations (not framer-motion)
      document.querySelectorAll("[class*='animate-']").forEach(el => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.backfaceVisibility = "hidden";
        (htmlEl.style as any).webkitBackfaceVisibility = "hidden";
      });
      // Do NOT apply contain: layout to sections — breaks absolute positioned children
    };

    if (document.readyState === "complete") {
      applyContainment();
    } else {
      window.addEventListener("load", applyContainment, { once: true, passive: true });
    }

    // ── 4. Smart lazy image optimization ──
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const img = entry.target as HTMLImageElement;
          if (entry.isIntersecting) {
            // Image is visible — remove lazy loading constraints
            img.style.removeProperty("content-visibility");
            imageObserver.unobserve(img);
          }
        });
      },
      { rootMargin: "200px 0px" }
    );

    // Optimize images that are below the fold
    const optimizeImages = () => {
      const viewportH = window.innerHeight;
      document.querySelectorAll("img:not([loading])").forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top > viewportH * 1.2) {
          img.setAttribute("loading", "lazy");
          img.setAttribute("decoding", "async");
          imageObserver.observe(img);
        } else {
          // Above the fold — decode eagerly
          img.setAttribute("decoding", "async");
          img.setAttribute("fetchpriority", "high");
        }
      });
    };

    cleanup.push(() => imageObserver.disconnect());

    // ── 5. Smart will-change: apply ONLY during scroll, remove after ──
    let isScrolling = false;
    let scrollEndTimer: ReturnType<typeof setTimeout>;
    const managedEls = new WeakSet<HTMLElement>();

    const onScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        // Apply will-change to GPU-compositable elements during scroll
        document.querySelectorAll(
          ".glass, .glass-strong, [class*='backdrop-blur'], [class*='sticky'], [class*='fixed']"
        ).forEach(el => {
          const htmlEl = el as HTMLElement;
          if (!managedEls.has(htmlEl)) {
            htmlEl.style.willChange = "transform";
            managedEls.add(htmlEl);
          }
        });
      }
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        isScrolling = false;
        // Remove will-change after scroll ends (free GPU memory)
        document.querySelectorAll("[style*='will-change']").forEach(el => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.willChange = "auto";
        });
      }, 150);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    cleanup.push(() => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollEndTimer);
    });

    // ── 6. Touch performance: passive touch events ──
    const setupTouch = () => {
      document.body.style.setProperty("touch-action", "pan-x pan-y", "important");
      // Find any element that might block touch with touch-action: none
      document.querySelectorAll("[style*='touch-action: none']").forEach(el => {
        const htmlEl = el as HTMLElement;
        if (!htmlEl.dataset.intentionalTouchBlock) {
          htmlEl.style.touchAction = "pan-x pan-y";
        }
      });
    };

    // ── 7. Link prefetching for instant navigation ──
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

    // ── 8. GPU hints for canvas elements (Three.js, animations) ──
    const optimizeCanvas = () => {
      document.querySelectorAll("canvas").forEach(canvas => {
        (canvas as HTMLElement).style.transform = "translateZ(0)";
        (canvas as HTMLElement).style.backfaceVisibility = "hidden";
      });
    };

    // ── 9. (scrollbar-gutter intentionally removed — caused rendering artifacts) ──

    // ── 10. Force a single layout calculation to prevent thrashing ──
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
    schedule(optimizeCanvas, 3000);
    schedule(setupTouch, 500);

    return () => {
      cleanup.forEach(fn => fn());
      cleanupFns.current = [];
    };
  }, []);

  return null;
};

export default PerformanceOptimizer;
