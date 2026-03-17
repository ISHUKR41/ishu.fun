/**
 * GradientMesh.tsx - Animated Gradient Background Orbs
 * 
 * Creates a set of large, blurry, slowly-moving colored circles
 * that overlap to create a beautiful gradient mesh effect.
 * Used as a background decoration in sections.
 * 
 * Props:
 * - variant: Color scheme ("default", "warm", "cool", "aurora")
 * - className: Extra CSS classes
 * 
 * Each variant has different color palettes:
 * - default: Blue, violet, teal
 * - warm: Orange, red, yellow
 * - cool: Cyan, blue
 * - aurora: Purple, green, cyan, pink (most colorful)
 * 
 * Usage:
 *   <GradientMesh variant="aurora" />
 */

import { motion } from "framer-motion";

interface GradientMeshProps {
  className?: string;
  variant?: "default" | "warm" | "cool" | "aurora";
}

// Color orbs configuration - defined outside component to avoid re-creation on every render
const GRADIENT_COLORS = {
  default: [
    { bg: "bg-primary/[0.06]", pos: "left-[10%] top-[20%]", size: 450, dur: 18 },
    { bg: "bg-[hsl(260,100%,66%,0.05)]", pos: "right-[15%] top-[10%]", size: 380, dur: 15 },
    { bg: "bg-[hsl(170,100%,50%,0.04)]", pos: "left-[40%] bottom-[15%]", size: 420, dur: 20 },
  ],
  warm: [
    { bg: "bg-[hsl(25,95%,53%,0.05)]", pos: "left-[15%] top-[25%]", size: 400, dur: 16 },
    { bg: "bg-[hsl(0,72%,51%,0.04)]", pos: "right-[20%] bottom-[20%]", size: 350, dur: 14 },
    { bg: "bg-[hsl(45,93%,47%,0.03)]", pos: "center top-[50%]", size: 300, dur: 18 },
  ],
  cool: [
    { bg: "bg-[hsl(199,89%,48%,0.06)]", pos: "left-[20%] top-[15%]", size: 500, dur: 20 },
    { bg: "bg-[hsl(217,91%,60%,0.05)]", pos: "right-[10%] bottom-[25%]", size: 420, dur: 17 },
  ],
  aurora: [
    { bg: "bg-[hsl(280,67%,50%,0.05)]", pos: "left-[5%] top-[10%]", size: 550, dur: 44 },
    { bg: "bg-[hsl(160,84%,39%,0.04)]", pos: "right-[10%] top-[30%]", size: 480, dur: 36 },
  ],
} as const;

const GradientMesh = ({ className = "", variant = "default" }: GradientMeshProps) => {
  const orbs = GRADIENT_COLORS[variant];

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, 40 * (i % 2 === 0 ? 1 : -1), 0],    // Drift left/right
            y: [0, 30 * (i % 2 === 0 ? -1 : 1), 0],     // Drift up/down
            scale: [1, 1.1, 1],                            // Gentle breathing
          }}
          transition={{
            repeat: Infinity,
            duration: orb.dur,
            ease: "easeInOut",
            delay: i * 0.5,  // Stagger orb animations
          }}
          className={`absolute ${orb.pos} ${orb.bg} rounded-full blur-[80px]`}
          style={{ width: orb.size, height: orb.size, willChange: "transform" }}
        />
      ))}
    </div>
  );
};

export default GradientMesh;
