/**
 * Layout.tsx - Main Page Layout Wrapper
 * 
 * Every page is wrapped with this Layout component.
 * It provides:
 * - Consistent header (navigation bar) at the top
 * - Consistent footer at the bottom
 * - Global background effects (gradients, floating orbs)
 * - Cursor spotlight effect that follows mouse
 * - Scroll progress bar at the top
 * - "Scroll to top" button
 * - Page entry animation (fade in + slide up)
 */

import { ReactNode, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import ScrollProgress from "../animations/ScrollProgress";
import ScrollToTop from "../animations/ScrollToTop";
import FloatingElements from "../animations/FloatingElements";

// Lazy load CursorSpotlight since it's only needed on desktop
const CursorSpotlight = lazy(() => import("../animations/CursorSpotlight"));

interface LayoutProps {
  children: ReactNode;  // Page content goes here
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Fixed background layers - creates depth effect */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-background via-background to-background z-0" />
      <div className="pointer-events-none fixed inset-0 mesh-gradient-advanced opacity-50 z-0" />
      
      {/* Floating ambient orbs - decorative animated circles in background */}
      <FloatingElements variant="default" />
      
      {/* Interactive effects */}
      <Suspense fallback={null}>
        <CursorSpotlight />
      </Suspense>
      <ScrollProgress />      {/* Colored progress bar at top of page */}
      <ScrollToTop />         {/* "Back to top" button appears on scroll */}
      <Header />              {/* Navigation bar */}
      
      {/* Main content area with entry animation */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative flex-1 pt-16 z-10"
      >
        <div className="border-b border-border/60 bg-card/40">
          <div className="container py-2 text-center text-[8px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:text-[10px] md:text-xs">
            ISHU — Indian StudentHub University
          </div>
        </div>
        {children}
      </motion.main>
      
      <Footer />              {/* Site footer with links and contact info */}
    </div>
  );
};

export default Layout;
