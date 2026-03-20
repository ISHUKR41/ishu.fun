/**
 * FadeInView.tsx - Scroll-Triggered Fade In Animation (120fps Optimized)
 *
 * Wraps any content to make it fade in when it scrolls into view.
 * Only animates once (won't re-animate when scrolling back up).
 *
 * Performance: Uses ONLY transform + opacity (GPU composited).
 * No layout-causing properties are animated.
 *
 * Props:
 * - delay: Seconds to wait before starting animation (default 0)
 * - direction: Which direction the content slides from ("up", "down", "left", "right")
 * - className: Extra CSS classes
 * - amount: How much of the element must be visible to trigger (0-1, default 0.1)
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  amount?: number;
}

const directionMap = {
  up:    { y: 24 },
  down:  { y: -24 },
  left:  { x: 24 },
  right: { x: -24 },
};

const FadeInView = ({ children, delay = 0, direction = "up", className = "", amount }: FadeInViewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-30px", amount: amount ?? 0.1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      style={{ willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeInView;
