/**
 * GradientMesh.tsx - Animated Gradient Background Orbs (CSS-only for Performance)
 *
 * Creates large, blurry, slowly-moving colored circles using pure CSS @keyframes.
 * No framer-motion JS — 100% GPU-composited for smooth 90fps scrolling.
 *
 * Props:
 * - variant: Color scheme ("default", "warm", "cool", "aurora")
 * - className: Extra CSS classes
 */

interface GradientMeshProps {
  className?: string;
  variant?: "default" | "warm" | "cool" | "aurora";
}

// Color orbs configuration
const GRADIENT_COLORS = {
  default: [
    { bg: "bg-primary/[0.06]", pos: "left-[10%] top-[20%]", size: 450 },
    { bg: "bg-[hsl(260,100%,66%,0.05)]", pos: "right-[15%] top-[10%]", size: 380 },
    { bg: "bg-[hsl(170,100%,50%,0.04)]", pos: "left-[40%] bottom-[15%]", size: 420 },
  ],
  warm: [
    { bg: "bg-[hsl(25,95%,53%,0.05)]", pos: "left-[15%] top-[25%]", size: 400 },
    { bg: "bg-[hsl(0,72%,51%,0.04)]", pos: "right-[20%] bottom-[20%]", size: 350 },
    { bg: "bg-[hsl(45,93%,47%,0.03)]", pos: "center top-[50%]", size: 300 },
  ],
  cool: [
    { bg: "bg-[hsl(199,89%,48%,0.06)]", pos: "left-[20%] top-[15%]", size: 500 },
    { bg: "bg-[hsl(217,91%,60%,0.05)]", pos: "right-[10%] bottom-[25%]", size: 420 },
  ],
  aurora: [
    { bg: "bg-[hsl(280,67%,50%,0.05)]", pos: "left-[5%] top-[10%]", size: 550 },
    { bg: "bg-[hsl(160,84%,39%,0.04)]", pos: "right-[10%] top-[30%]", size: 480 },
  ],
} as const;

const GradientMesh = ({ className = "", variant = "default" }: GradientMeshProps) => {
  const orbs = GRADIENT_COLORS[variant];

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {orbs.map((orb, i) => (
        <div
          key={i}
          className={`absolute ${orb.pos} ${orb.bg} rounded-full blur-[60px] sm:blur-[80px] css-mesh-orb`}
          style={{ width: orb.size, height: orb.size }}
        />
      ))}
    </div>
  );
};

export default GradientMesh;
