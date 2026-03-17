/**
 * SpotlightCard.tsx - Mouse-Tracking Spotlight Card
 * 
 * A premium card component that shows a radial gradient spotlight
 * that follows the mouse cursor. Creates an elegant "flashlight"
 * effect on hover.
 * 
 * How it works:
 * 1. Tracks mouse position relative to the card
 * 2. Uses framer-motion springs for smooth cursor following
 * 3. Renders a radial gradient at the cursor position
 * 4. Gradient is only visible when card is hovered
 * 
 * Usage:
 *   <SpotlightCard><YourContent /></SpotlightCard>
 */

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef, useState } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}
const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "hsl(210 100% 56% / 0.15)",
}: SpotlightCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const spotlightX = useSpring(mouseX, springConfig);
  const spotlightY = useSpring(mouseY, springConfig);

  // Hoisted from JSX to respect rules of hooks
  const spotlightBg = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) =>
      `radial-gradient(400px circle at ${x}px ${y}px, ${spotlightColor}, transparent 60%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      {/* Spotlight gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500"
        style={{
          background: spotlightBg,
          opacity: hovered ? 1 : 0,
        }}
      />
      {children}
    </motion.div>
  );
};

export default SpotlightCard;
