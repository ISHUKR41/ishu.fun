/**
 * FadeInView.tsx - Scroll-Triggered Fade In Animation (120fps Optimized)
 *
 * Wraps any content to make it fade in when it scrolls into view.
 * Only animates once (won't re-animate when scrolling back up).
 *
 * Performance: Uses ONLY transform + opacity (GPU composited).
 * willChange is set only RIGHT BEFORE animation starts and cleared after.
 * This prevents GPU layer promotion on all FadeInView elements simultaneously.
 *
 * Props:
 * - delay: Seconds to wait before starting animation (default 0)
 * - direction: Which direction the content slides from ("up", "down", "left", "right")
 * - className: Extra CSS classes
 * - amount: How much of the element must be visible to trigger (0-1, default 0.1)
 */

import { motion, useAnimation, useInView } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  amount?: number;
}

const directionMap = {
  up:    { y: 20 },
  down:  { y: -20 },
  left:  { x: 20 },
  right: { x: -20 },
};

const FadeInView = ({ children, delay = 0, direction = "up", className = "", amount }: FadeInViewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, margin: "-30px", amount: amount ?? 0.1 });

  useEffect(() => {
    if (inView) {
      if (ref.current) {
        ref.current.style.willChange = "transform, opacity";
      }
      controls.start({
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.5,
          delay,
          ease: [0.22, 0.61, 0.36, 1],
        },
      }).then(() => {
        if (ref.current) {
          ref.current.style.willChange = "auto";
        }
      });
    }
  }, [inView, controls, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeInView;
