/**
 * FloatingElements.tsx - Ambient Background Orbs (CSS-only for Performance)
 *
 * Renders large, blurred, slowly-moving gradient circles in the background.
 * Uses pure CSS @keyframes instead of framer-motion JS for 90fps performance.
 * 
 * Performance optimizations:
 * - CSS keyframes instead of JS-driven animation (no React re-renders)
 * - IntersectionObserver to pause when offscreen
 * - Reduced blur on mobile via CSS media query
 * - contain: layout for compositor-only animation
 * - Hidden on very small mobile devices to save GPU
 */

import { useEffect, useRef, useState } from "react";

// Orb colors, sizes, and positions for each palette
const PALETTES = {
  default: [
    { color: "bg-primary/[0.04]", size: "h-[400px] w-[400px]", pos: "left-[15%] top-[10%]" },
    { color: "bg-[hsl(260,100%,66%,0.03)]", size: "h-[350px] w-[350px]", pos: "right-[10%] bottom-[15%]" },
    { color: "bg-[hsl(170,100%,50%,0.02)]", size: "h-[300px] w-[300px]", pos: "right-[35%] top-[5%]" },
  ],
  warm: [
    { color: "bg-[hsl(38,92%,50%,0.03)]", size: "h-[350px] w-[350px]", pos: "left-[20%] top-[20%]" },
    { color: "bg-[hsl(0,84%,60%,0.02)]", size: "h-[300px] w-[300px]", pos: "right-[15%] bottom-[20%]" },
  ],
  cool: [
    { color: "bg-[hsl(210,100%,56%,0.04)]", size: "h-[500px] w-[500px]", pos: "left-[10%] top-[5%]" },
    { color: "bg-[hsl(190,100%,40%,0.03)]", size: "h-[400px] w-[400px]", pos: "right-[10%] bottom-[10%]" },
  ],
} as const;

const FloatingElements = ({ variant = "default" }: { variant?: "default" | "warm" | "cool" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Pause animations when offscreen for better performance
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "200px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 hidden sm:block"
      style={{
        contain: "layout style",
        animationPlayState: isVisible ? "running" : "paused",
      }}
    >
      {PALETTES[variant].map((orb, i) => (
        <div
          key={i}
          className={`pointer-events-none absolute ${orb.pos} ${orb.size} rounded-full ${orb.color} blur-[40px] sm:blur-[60px] css-orb`}
          style={{
            animationPlayState: isVisible ? "running" : "paused",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;
