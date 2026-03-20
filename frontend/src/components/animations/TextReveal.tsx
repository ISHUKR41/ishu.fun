/**
 * TextReveal.tsx - Word-by-Word Text Reveal Animation
 * 
 * Splits text into individual words and animates each one
 * sliding up from below when the text scrolls into view.
 * Creates a "typewriter" or "unveiling" effect.
 * 
 * Props:
 * - text: The text string to animate
 * - delay: Seconds before animation starts (default 0)
 * - staggerDelay: Seconds between each word appearing (default 0.03)
 * - className: CSS classes for styling the text
 * 
 * Usage:
 *   <TextReveal text="Welcome to ISHU" className="text-4xl font-bold" />
 */

import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

const TextReveal = ({ text, className = "", delay = 0, staggerDelay = 0.03 }: TextRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "15%", opacity: 0.85 }}
            animate={isInView ? { y: "0%", opacity: 1 } : {}}
            transition={{
              duration: 0.3,
              delay: delay + i * staggerDelay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
};

export default TextReveal;
