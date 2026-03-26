/**
 * LazySection — Viewport-triggered lazy loader for below-fold sections.
 *
 * Instead of loading ALL 21 below-fold chunks immediately on page mount,
 * each section only loads its JS chunk when it enters (or is about to enter)
 * the viewport. This cuts initial JS payload by ~200KB on homepage.
 *
 * Uses react-intersection-observer (already installed) to detect when the
 * placeholder div scrolls within `rootMargin` of the viewport.
 *
 * PERFORMANCE CHARACTERISTICS:
 * - Before visible: renders a single empty <div> (near-zero cost)
 * - After visible: mounts the <Suspense> boundary which triggers the lazy import
 * - The `triggerOnce: true` ensures we never unmount a section after it loads
 * - rootMargin: "300px" preloads sections 300px before they're visible
 */

import { Suspense, type ReactNode } from "react";
import { useInView } from "react-intersection-observer";

interface LazySectionProps {
  children: ReactNode;
  /** Minimum height for the placeholder to prevent layout shift */
  minHeight?: string;
  /** How far before viewport edge to trigger loading (default: 300px) */
  rootMargin?: string;
}

const LazySection = ({
  children,
  minHeight = "100px",
  rootMargin = "300px",
}: LazySectionProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: `${rootMargin} 0px`,
  });

  return (
    <div ref={ref} style={{ minHeight: inView ? undefined : minHeight }}>
      {inView ? (
        <Suspense fallback={<div aria-hidden="true" />}>
          {children}
        </Suspense>
      ) : null}
    </div>
  );
};

export default LazySection;
