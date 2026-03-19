/**
 * PageTransition.tsx - Animated Page Wrapper
 * 
 * Wraps page content with a fade-in/slide-up animation on enter
 * and fade-out/slide-up animation on exit. Used for smooth
 * transitions between pages.
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";

// GPU-only animation states — only animates transform + opacity (compositor thread)
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    style={{ willChange: "transform, opacity", backfaceVisibility: "hidden" }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
