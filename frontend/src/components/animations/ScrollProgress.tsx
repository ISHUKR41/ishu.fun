/**
 * ScrollProgress.tsx - Page Scroll Progress Bar
 * 
 * Shows a thin colored gradient bar at the very top of the page
 * that fills from left to right as the user scrolls down.
 * At 0% scroll it's empty, at 100% scroll it's fully filled.
 * 
 * Uses the shared useOptimizedScroll hook instead of framer-motion's
 * useScroll to avoid adding yet another scroll listener.
 */

import { useOptimizedScroll } from "@/hooks/useOptimizedScroll";

const ScrollProgress = () => {
  const { scrollYProgress } = useOptimizedScroll();

  return (
    <div
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left"
      style={{
        transform: `scaleX(${scrollYProgress})`,
        background: "linear-gradient(90deg, hsl(210 100% 56%), hsl(260 100% 66%), hsl(170 100% 50%))",
        transition: "transform 0.1s linear",
        willChange: "transform",
      }}
    />
  );
};

export default ScrollProgress;
