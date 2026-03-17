/**
 * FloatingElements.tsx - Ambient Background Orbs
 * 
 * Renders large, blurred, slowly-moving gradient circles in the background.
 * These create a subtle ambient lighting effect across the entire page.
 * Used inside Layout.tsx as a global background decoration.
 * 
 * Props:
 * - variant: Color palette ("default", "warm", "cool")
 *   - default: Blue, violet, teal
 *   - warm: Orange, red
 *   - cool: Blue, cyan
 * 
 * Performance: Palette config is hoisted outside component to avoid
 * re-creation on every render. Uses will-change: transform for GPU compositing.
 * Blur reduced to 80px for lighter paint cost.
 *
 * Each orb gently drifts in alternating directions on a loop.
 * Non-interactive (pointer-events: none) and positioned absolutely.
 */

import { motion } from "framer-motion";

// Orb colors, sizes, and positions for each palette - defined outside component to avoid re-creation on every render
const PALETTES = {
  default: [
    { color: "bg-primary/[0.04]", size: "h-[400px] w-[400px]", pos: "left-[15%] top-[10%]", dur: 14 },
    { color: "bg-[hsl(260,100%,66%,0.03)]", size: "h-[350px] w-[350px]", pos: "right-[10%] bottom-[15%]", dur: 11 },
    { color: "bg-[hsl(170,100%,50%,0.02)]", size: "h-[300px] w-[300px]", pos: "right-[35%] top-[5%]", dur: 16 },
  ],
  warm: [
    { color: "bg-[hsl(38,92%,50%,0.03)]", size: "h-[350px] w-[350px]", pos: "left-[20%] top-[20%]", dur: 12 },
    { color: "bg-[hsl(0,84%,60%,0.02)]", size: "h-[300px] w-[300px]", pos: "right-[15%] bottom-[20%]", dur: 15 },
  ],
  cool: [
    { color: "bg-[hsl(210,100%,56%,0.04)]", size: "h-[500px] w-[500px]", pos: "left-[10%] top-[5%]", dur: 18 },
    { color: "bg-[hsl(190,100%,40%,0.03)]", size: "h-[400px] w-[400px]", pos: "right-[10%] bottom-[10%]", dur: 13 },
  ],
} as const;

const FloatingElements = ({ variant = "default" }: { variant?: "default" | "warm" | "cool" }) => {
  return (
    <>
      {PALETTES[variant].map((orb, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, 30 * (i % 2 === 0 ? 1 : -1), 0],  // Alternate drift direction
            y: [0, -20 * (i % 2 === 0 ? -1 : 1), 0],
          }}
          transition={{ repeat: Infinity, duration: orb.dur, ease: "easeInOut" }}
          className={`pointer-events-none absolute ${orb.pos} ${orb.size} rounded-full ${orb.color} blur-[80px]`}
          style={{ willChange: "transform" }}
        />
      ))}
    </>
  );
};

export default FloatingElements;
