/**
 * ScrollFixer.tsx — Comprehensive scroll enabler for all devices
 *
 * Fixes ALL known scroll blocking issues:
 * - Inline overflow:hidden on html/body (from third-party libs)
 * - height:100% that prevents scrolling
 * - Lenis + browser overscroll conflicts on laptop trackpads
 * - Touch-action restrictions blocking touch scroll
 * - React modal portals that add overflow:hidden to body
 */

import { useEffect } from "react";

function forceScrollable() {
  const html = document.documentElement;
  const body = document.body;
  const root = document.getElementById("root");

  // Remove ALL overflow constraints from html (Lenis needs this)
  html.style.removeProperty("overflow");
  html.style.removeProperty("overflow-y");
  html.style.removeProperty("overflow-x");
  html.style.removeProperty("height");
  html.style.removeProperty("max-height");
  html.style.removeProperty("position");

  // Remove overflow constraints from body
  body.style.removeProperty("overflow");
  body.style.removeProperty("overflow-y");
  body.style.removeProperty("height");
  body.style.removeProperty("max-height");

  // Root should not create a scroll context
  if (root) {
    root.style.removeProperty("overflow");
    root.style.removeProperty("overflow-y");
    root.style.removeProperty("height");
    root.style.removeProperty("max-height");
  }

  // Set touch-action to allow scrolling in all directions
  html.style.setProperty("touch-action", "pan-x pan-y", "important");
  body.style.setProperty("touch-action", "pan-x pan-y", "important");

  // Prevent overscroll bounce (browser-level, not Lenis)
  html.style.setProperty("overscroll-behavior", "none", "important");
  body.style.setProperty("overscroll-behavior", "none", "important");
}

/**
 * Watch for any library (Radix dialogs, Clerk overlays, etc.) that
 * adds overflow:hidden to body when opening modals. Restore scroll
 * when they close.
 */
function setupOverflowWatcher() {
  const body = document.body;
  let observer: MutationObserver | null = null;

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.attributeName === "style") {
        // Only restore if no modal is open (check for dialog/modal markers)
        const hasOpenModal =
          document.querySelector("[role='dialog']") ||
          document.querySelector("[data-overlay-container='true']") ||
          document.querySelector("[aria-modal='true']");

        if (!hasOpenModal && body.style.overflow === "hidden") {
          // Small delay to let modal close animation finish
          setTimeout(() => {
            if (!document.querySelector("[aria-modal='true']")) {
              body.style.removeProperty("overflow");
              body.style.removeProperty("overflow-y");
            }
          }, 50);
        }
      }
    }
  });

  observer.observe(body, { attributes: true, attributeFilter: ["style", "class"] });
  return () => observer?.disconnect();
}

const ScrollFixer = () => {
  useEffect(() => {
    // Run immediately
    forceScrollable();

    // Run again after a small delay to catch any late-loading CSS
    const t1 = setTimeout(forceScrollable, 100);
    const t2 = setTimeout(forceScrollable, 500);
    const t3 = setTimeout(forceScrollable, 1500);

    // Watch for modals/dialogs that lock body scroll
    const cleanupWatcher = setupOverflowWatcher();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      cleanupWatcher();
    };
  }, []);

  return null;
};

export default ScrollFixer;
