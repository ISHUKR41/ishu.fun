/**
 * DashboardLayout.tsx — Main Layout for All Dashboard Pages
 * 
 * Wraps all protected pages (/dashboard, /profile, /settings, etc.)
 * Provides:
 * - Collapsible sidebar (DashboardSidebar)
 * - Top header bar (DashboardHeader)
 * - Responsive: sidebar hidden on mobile, shown via hamburger
 * - Animated page transitions
 * - Premium dark background with subtle effects
 * 
 * Performance: Uses CSS transition (not framer-motion marginLeft) to avoid
 * JS-driven layout repaints on sidebar collapse/expand.
 */

import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[hsl(225,50%,3%)]">
      {/* ──── Sidebar ──── */}
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* ──── Main Content Area ──── */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-[margin-left] duration-300 ease-in-out"
        style={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
      >
        {/* Top Header */}
        <DashboardHeader onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Subtle static background effects — no GPU promotion needed */}
          <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
            <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full blur-[180px] opacity-30" 
              style={{ background: "radial-gradient(circle, hsl(217 100% 55% / 0.06), transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full blur-[140px] opacity-20"
              style={{ background: "radial-gradient(circle, hsl(260 100% 65% / 0.05), transparent 70%)" }} />
          </div>

          {/* Animated content entrance — opacity+transform only (GPU composited) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
