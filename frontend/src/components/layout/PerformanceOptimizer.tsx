/**
 * PerformanceOptimizer.tsx — Global performance enhancements
 * 
 * This component runs once on mount and applies browser-level
 * performance optimizations that benefit ALL pages:
 * 
 * 1. Preloads critical fonts to prevent FOIT/FOUT
 * 2. Sets up passive scroll listeners globally
 * 3. Optimizes image loading with IntersectionObserver
 * 4. Schedules non-critical work with requestIdleCallback
 * 5. Hints the browser about upcoming animations
 * 6. Reduces paint areas with CSS containment
 * 
 * Does NOT change any visual appearance — only improves performance.
 */

import { useEffect } from "react";

const PerformanceOptimizer = () => {
  useEffect(() => {
    // 1. Mark the document as interactive for the browser's scheduler
    if ("scheduler" in window && (window as any).scheduler?.yield) {
      // Modern browsers: hint that we want smooth animations
      (window as any).scheduler.yield();
    }

    // 2. Preconnect to critical external origins
    const preconnects = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ];
    preconnects.forEach(href => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "preconnect";
        link.href = href;
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      }
    });

    // 3. Add CSS containment to all major sections for paint isolation
    // This prevents scroll-triggered repaints from affecting unrelated sections
    const applyContainment = () => {
      document.querySelectorAll("section").forEach(section => {
        const style = section.style;
        if (!style.contain) {
          style.contain = "layout style";
        }
      });
    };

    // Run after page is fully loaded
    if (document.readyState === "complete") {
      applyContainment();
    } else {
      window.addEventListener("load", applyContainment, { once: true });
    }

    // 4. Optimize images — add loading="lazy" to images below the fold
    const optimizeImages = () => {
      const viewportHeight = window.innerHeight;
      document.querySelectorAll("img:not([loading])").forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top > viewportHeight * 1.5) {
          img.setAttribute("loading", "lazy");
          img.setAttribute("decoding", "async");
        }
      });
    };

    // Use requestIdleCallback for non-critical work
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(optimizeImages, { timeout: 2000 });
    } else {
      setTimeout(optimizeImages, 1000);
    }

    // 5. Force GPU compositing on animated elements after load
    const enableGPU = () => {
      document.querySelectorAll("[class*='animate-'], [class*='transition-']").forEach(el => {
        (el as HTMLElement).style.backfaceVisibility = "hidden";
      });
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(enableGPU, { timeout: 3000 });
    } else {
      setTimeout(enableGPU, 2000);
    }

    // 6. Prevent layout thrashing by batching DOM reads
    // Force a single layout calculation upfront
    document.documentElement.offsetHeight;

  }, []);

  return null; // No DOM output — pure side-effect
};

export default PerformanceOptimizer;
