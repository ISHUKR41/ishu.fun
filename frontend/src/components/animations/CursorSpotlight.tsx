/**
 * CursorSpotlight.tsx - Mouse-Following Glow Effect
 *
 * Creates a subtle glowing circle that follows the cursor around the page.
 * Hidden on mobile devices (only shows on screens with mouse/trackpad).
 *
 * Performance: Uses GPU-accelerated transform instead of left/top to avoid
 * layout thrashing on every mouse move. Single parent container positioned
 * via transform with both glows as children.
 */

import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CursorSpotlight = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const opacity = useMotionValue(0);
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 20 });
  const rafId = useRef<number>(0);
  const latestPos = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    // Throttle mousemove to requestAnimationFrame (~60fps max) for smooth performance
    const move = (e: MouseEvent) => {
      latestPos.current.x = e.clientX;
      latestPos.current.y = e.clientY;
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.style.transform = `translate3d(${latestPos.current.x}px, ${latestPos.current.y}px, 0)`;
          }
          rafId.current = 0;
        });
      }
      opacity.set(1);
    };
    const leave = () => opacity.set(0);
    const enter = () => opacity.set(1);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [opacity]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[50] hidden md:block"
      style={{ opacity: springOpacity }}
    >
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: "translate3d(-9999px, -9999px, 0)",
          willChange: "transform",
        }}
      >
        {/* Large outer glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            left: -300,
            top: -300,
            background: "radial-gradient(circle, hsl(210 100% 56% / 0.04) 0%, transparent 70%)",
          }}
        />
        {/* Small inner glow - brighter center point */}
        <div
          className="absolute rounded-full"
          style={{
            width: 100,
            height: 100,
            left: -50,
            top: -50,
            background: "radial-gradient(circle, hsl(210 100% 70% / 0.08) 0%, transparent 70%)",
          }}
        />
      </div>
    </motion.div>
  );
};

export default CursorSpotlight;
