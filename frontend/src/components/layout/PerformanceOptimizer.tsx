/**
 * PerformanceOptimizer.tsx — Lightweight performance hints
 *
 * Stripped down to only essential optimizations:
 * 1. Preconnect to critical font origins
 * 2. Lazy image optimization (native loading=lazy)
 * 
 * Removed: link prefetching (creates dozens of <link> elements),
 * heavy DOM scanning, scheduler API usage.
 */

import { useEffect } from "react";

const PerformanceOptimizer = () => {
  useEffect(() => {
    // 1. Preconnect to font origins (only if not already present)
    const origins = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];
    origins.forEach((href) => {
      if (!document.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "preconnect";
        link.href = href;
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      }
    });

    // 2. Add loading=lazy to below-fold images (deferred)
    const timeoutId = setTimeout(() => {
      const viewportH = window.innerHeight;
      document.querySelectorAll("img:not([loading])").forEach((img) => {
        const rect = img.getBoundingClientRect();
        if (rect.top > viewportH * 1.5) {
          img.setAttribute("loading", "lazy");
          img.setAttribute("decoding", "async");
        }
      });
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
};

export default PerformanceOptimizer;
