/**
 * Layout.tsx - Main Page Layout Wrapper
 * 
 * Every page is wrapped with this Layout component.
 * It provides:
 * - Consistent header (navigation bar) at the top
 * - Consistent footer at the bottom
 * - Global background effects (gradients, floating orbs)
 * - Cursor spotlight effect that follows mouse (desktop only)
 * - Scroll progress bar at the top
 * - "Scroll to top" button
 * - Page entry animation (fade in + slide up)
 * 
 * Performance:
 * - FloatingElements hidden on mobile (CSS class `hidden sm:block`)
 * - CursorSpotlight only loaded on non-touch desktop devices
 * - Main content uses CSS contain for layout isolation
 */

import { ReactNode, lazy, Suspense } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollProgress from "../animations/ScrollProgress";
import ScrollToTop from "../animations/ScrollToTop";
import FloatingElements from "../animations/FloatingElements";
import ScrollFixer from "./ScrollFixer";
import SmoothScroll from "./SmoothScroll";
import PerformanceOptimizer from "./PerformanceOptimizer";
import IshuBrandSEO from "../seo/IshuBrandSEO";

// Lazy load CursorSpotlight since it's only needed on desktop
const CursorSpotlight = lazy(() => import("../animations/CursorSpotlight"));

// Detect if user is on a touch/mobile device — skip heavy desktop-only effects
const IS_TOUCH_DEVICE = typeof window !== "undefined" && (
  navigator.maxTouchPoints > 0 || window.matchMedia("(max-width: 768px)").matches
);

interface LayoutProps {
  children: ReactNode;  // Page content goes here
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Global Ishu Brand SEO — Person schema injected on every page */}
      <IshuBrandSEO />
      {/* Nuclear JS-based scroll fix — forces scrolling to work regardless of CSS */}
      <ScrollFixer />
      {/* Lenis smooth scroll — 120fps butter-smooth scrolling on all devices */}
      <SmoothScroll />
      {/* Performance enhancements — CSS containment, lazy images, GPU hints */}
      <PerformanceOptimizer />
      {/* Fixed background layer - base gradient with GPU compositing to prevent scroll repaint */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-background via-background to-background z-0"
        style={{ transform: "translateZ(0)", willChange: "transform" }} />
      
      {/* Floating ambient orbs - decorative animated circles in background (hidden on mobile via CSS) */}
      <FloatingElements variant="default" />
      
      {/* Interactive effects — only load cursor spotlight on non-touch desktop */}
      {!IS_TOUCH_DEVICE && (
        <Suspense fallback={null}>
          <CursorSpotlight />
        </Suspense>
      )}
      <ScrollProgress />      {/* Colored progress bar at top of page */}
      <ScrollToTop />         {/* "Back to top" button appears on scroll */}
      <Header />              {/* Navigation bar */}
      
      {/* Main content area — no opacity animation to prevent blink/flicker on all devices */}
      <main className="relative flex-1 pt-16 z-10 layout-main-content">
        {/* Animated Info Ticker Bar */}
        <div className="overflow-hidden border-b border-border/40 bg-gradient-to-r from-primary/5 via-card/80 to-primary/5 backdrop-blur-sm">
          <div className="flex animate-marquee whitespace-nowrap py-1.5 items-center gap-0">
            {[
              "🎓 ISHU — Indian StudentHub University | ishu.fun",
              "🏆 Sarkari Result 2026 — All 36 States",
              "📋 100+ Free PDF Tools — Merge, Compress, Convert",
              "📺 700+ Live Indian TV Channels Free",
              "💼 Latest Sarkari Naukri 2026 — Government Jobs",
              "📄 Free CV / Resume / Biodata Maker — Download PDF",
              "🔍 UPSC, SSC, Banking, Railway, NTA Results",
              "⚡ Admit Card & Answer Key — Instant Download",
              "📰 1000+ Daily News — Hindi & English",
              "🎥 YouTube Downloader HD Free — ishu.fun",
              "☁️ Terabox Downloader Free — No Signup",
              "🎓 ISHU — India's #1 Free Education Platform",
              "🏛️ All 36 States Sarkari Result",
              "📺 Aaj Tak, NDTV, Star Plus Live Free",
              "💼 UPSC IAS, SSC CGL, IBPS, RRB Jobs 2026",
              "📄 Marriage Biodata Maker Free — ishu.fun",
              "🔒 100% Private — Files Never Uploaded to Server",
              "⚡ ishu.fun — No Signup, No Cost, Always Free",
            ].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-6 text-[10px] sm:text-xs font-medium text-muted-foreground/80">
                {item}
                <span className="h-1 w-1 rounded-full bg-primary/40 inline-block" />
              </span>
            ))}
          </div>
        </div>
        {children}
      </main>
      
      <Footer />              {/* Site footer with links and contact info */}
    </div>
  );
};

export default Layout;
