/**
 * AnimatedCounter.tsx - Counting Number Animation
 * 
 * Displays a number that counts up from 0 to the target value
 * when the component scrolls into view. Only animates once.
 * 
 * Props:
 * - target: The final number to count to (e.g., 1000)
 * - suffix: Text after the number (e.g., "+", "%")
 * - prefix: Text before the number (e.g., "$", "₹")
 * - duration: How many seconds the counting takes (default 2)
 * 
 * Usage:
 *   <AnimatedCounter target={100} suffix="+" />  // Shows: 100+
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

const AnimatedCounter = ({ target, suffix = "", prefix = "", duration = 2 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });  // Only trigger once

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();
    const durationMs = duration * 1000;
    let animId: number;

    // Use requestAnimationFrame instead of setInterval for smoother animation
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (progress >= 1) {
        setCount(target);
      } else {
        setCount(current);
        animId = requestAnimationFrame(animate);
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
