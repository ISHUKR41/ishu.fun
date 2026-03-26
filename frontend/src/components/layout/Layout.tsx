/**
 * Layout.tsx - Main Page Layout Wrapper
 * 
 * Every page is wrapped with this Layout component.
 * Provides: Header, Footer, Smooth Scroll, and minimal performance hints.
 * 
 * PERFORMANCE FIX:
 * - Removed FloatingElements (background orbs) — HeroSection has its own
 * - Removed CursorSpotlight lazy load — unnecessary JS overhead
 * - Removed ScrollProgress (adds scroll listener on every page)
 * - Simplified info banner
 */

import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "../animations/ScrollToTop";
import ScrollFixer from "./ScrollFixer";
import SmoothScroll from "./SmoothScroll";
import PerformanceOptimizer from "./PerformanceOptimizer";
import IshuBrandSEO from "../seo/IshuBrandSEO";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Global SEO schema */}
      <IshuBrandSEO />
      {/* Scroll fix for modal/dialog overflow issues */}
      <ScrollFixer />
      {/* Lenis smooth scroll (desktop only — skipped on mobile for perf) */}
      <SmoothScroll />
      {/* Lightweight performance hints (font preconnect, lazy images) */}
      <PerformanceOptimizer />
      
      {/* Fixed background */}
      <div className="pointer-events-none fixed inset-0 bg-background z-0" />
      
      {/* Scroll-to-top button */}
      <ScrollToTop />
      {/* Navigation */}
      <Header />
      
      {/* Main content — always visible, no opacity animation */}
      <main className="relative flex-1 pt-16 z-10 layout-main-content">
        <div className="border-b border-border/30 bg-gradient-to-r from-primary/5 via-card/80 to-primary/5 py-1.5 px-4 text-center">
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground/70 truncate">
            🎓 ISHU — Indian StudentHub University | 100+ Free PDF Tools | Sarkari Result 2026 | ishu.fun
          </p>
        </div>
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
