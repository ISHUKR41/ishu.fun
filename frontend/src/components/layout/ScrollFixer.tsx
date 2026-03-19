/**
 * ScrollFixer.tsx — One-time scroll safety net
 * 
 * Runs ONCE on mount to ensure nothing blocks native scrolling.
 * Does NOT use MutationObserver or intervals — those cause jank.
 * 
 * Lenis handles smooth scrolling. This component just ensures
 * the initial DOM state allows scrolling to work.
 */

import { useEffect } from "react";

/** One-time cleanup of any scroll-blocking styles */
function ensureScrollable() {
  const html = document.documentElement;
  const body = document.body;
  const root = document.getElementById("root");

  // Clear any stale inline styles that might block scroll
  html.style.removeProperty("overflow");
  html.style.removeProperty("overflow-y");
  html.style.removeProperty("overflow-x");
  html.style.removeProperty("height");
  html.style.removeProperty("max-height");
  html.style.removeProperty("position");

  body.style.removeProperty("overflow");
  body.style.removeProperty("overflow-y");
  body.style.removeProperty("overflow-x");
  body.style.removeProperty("height");
  body.style.removeProperty("max-height");

  if (root) {
    root.style.removeProperty("overflow");
    root.style.removeProperty("height");
    root.style.removeProperty("max-height");
  }

  // Ensure touch-action allows scrolling
  html.style.setProperty("touch-action", "auto");
  body.style.setProperty("touch-action", "pan-x pan-y");
}

const ScrollFixer = () => {
  useEffect(() => {
    // Run cleanup immediately + with small delay for late-loading styles
    ensureScrollable();
    const t1 = setTimeout(ensureScrollable, 150);
    const t2 = setTimeout(ensureScrollable, 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return null;
};

export default ScrollFixer;
