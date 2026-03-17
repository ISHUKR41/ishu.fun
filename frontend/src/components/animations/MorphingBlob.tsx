/**
 * MorphingBlob.tsx - Animated Shape-Shifting Blob
 * 
 * A decorative background element that continuously changes shape.
 * It rotates and scales with a static organic border-radius.
 * Highly blurred so it creates a soft ambient glow effect.
 *
 * Performance: Only animates GPU-accelerated transform properties
 * (scale, rotate). The 80px blur is composited by GPU since only
 * transform changes - no layout/repaint per frame.
 * 
 * Props:
 * - color: CSS color value (default: blue at 8% opacity)
 * - size: Width/height in pixels (default: 400)
 * - duration: Time for one full animation cycle (default: 20 seconds)
 * - className: CSS classes for positioning (e.g., "left-10 top-20")
 * 
 * Usage:
 *   <MorphingBlob color="hsl(260 100% 66% / 0.08)" size={500} className="right-0 top-0" />
 */

import { motion } from "framer-motion";

interface MorphingBlobProps {
  className?: string;
  color?: string;
  size?: number;
  duration?: number;
}

const MorphingBlob = ({
  className = "",
  color = "hsl(210 100% 56% / 0.08)",
  size = 400,
  duration = 20,
}: MorphingBlobProps) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 0.9, 1.1, 1],                    // Breathing effect
        rotate: [0, 90, 180, 270, 360],                    // Full rotation
      }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "easeInOut",
      }}
      className={`pointer-events-none absolute ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        filter: "blur(80px)",  // Heavy blur for soft glow
        borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%", // Static organic shape (blur hides the edges anyway)
        willChange: "transform", // GPU-accelerated compositing - only transform changes per frame
      }}
    />
  );
};

export default MorphingBlob;
