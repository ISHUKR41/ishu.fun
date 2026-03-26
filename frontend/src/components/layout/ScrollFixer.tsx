/**
 * ScrollFixer.tsx — Minimal scroll enabler
 *
 * Lightweight version: only fixes overflow on route change and
 * watches for modals that lock body scroll. Removed repeated
 * forceScrollable calls (3x + interval) that were causing layout thrashing.
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function fixOverflow() {
  const html = document.documentElement;
  const body = document.body;

  // Remove inline overflow constraints that block scrolling
  html.style.removeProperty("overflow");
  html.style.removeProperty("overflow-y");
  body.style.removeProperty("overflow");
  body.style.removeProperty("overflow-y");
}

const ScrollFixer = () => {
  const location = useLocation();

  // Fix overflow on mount and route change
  useEffect(() => {
    fixOverflow();
  }, [location.pathname]);

  // Watch for modals that add overflow:hidden to body
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const hasModal =
        document.querySelector("[aria-modal='true']") ||
        document.querySelector("[role='dialog']");
      if (!hasModal && document.body.style.overflow === "hidden") {
        setTimeout(() => {
          if (!document.querySelector("[aria-modal='true']")) {
            document.body.style.removeProperty("overflow");
          }
        }, 50);
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, []);

  return null;
};

export default ScrollFixer;
