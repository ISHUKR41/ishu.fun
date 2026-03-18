/**
 * Header.tsx - Main Navigation Bar
 * 
 * Features:
 * - Fixed at top of screen with glassmorphism effect on scroll
 * - Auto-hides when scrolling down, reappears when scrolling up
 * - Desktop: horizontal nav links with animated active indicator
 * - Mobile: hamburger menu with slide-down navigation panel
 * - Shows user avatar + sign out if logged in
 * - Shows "Admin" button if user has admin role
 * - Shows Sign In / Get Started buttons if not logged in
 */

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// All navigation links shown in the header
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Results", href: "/results" },
  { label: "Tools", href: "/tools" },
  { label: "CV", href: "/cv" },
  { label: "TV", href: "/tv" },
  { label: "News", href: "/news" },
  { label: "Test", href: "/test" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);   // Mobile menu open/close state
  const [scrolled, setScrolled] = useState(false);        // True when page is scrolled (adds glass effect)
  const [hidden, setHidden] = useState(false);            // True when header should hide (scrolling down)
  const location = useLocation();                          // Current page URL
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();           // Auth state from context
  const { scrollY } = useScroll();                        // Track scroll position

  // Watch scroll position to show/hide header
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 20);                              // Add glass effect after 20px scroll
    setHidden(latest > 200 && latest > prev);              // Hide when scrolling down past 200px
  });

  // Sign out and redirect to home page
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.header
      animate={{ y: hidden ? -80 : 0 }}                   // Slide up to hide, slide down to show
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-[0_4px_30px_hsl(0_0%_0%/0.3)] border-b border-border/50" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo / Brand */}
        <Link to="/" className="group flex items-center gap-1.5 sm:gap-2 min-w-0" title="ISHU — Indian StudentHub University">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-110">
            <span className="text-[10px] sm:text-xs font-bold text-primary-foreground">ISHU</span>
          </div>
          <div className="flex flex-col leading-none min-w-0">
            <span className="font-display text-base sm:text-lg font-bold text-foreground truncate">
              <span className="text-gradient">ISHU</span>
            </span>
            <span className="text-[6px] sm:text-[7px] tracking-[0.14em] uppercase text-muted-foreground truncate">Indian StudentHub University</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link key={link.href} to={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {link.label}
                {/* Animated underline indicator for active page */}
                {isActive && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Auth buttons or user info */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Admin button - only visible to admin users */}
              {isAdmin && (
                <Link to="/admin" className="hidden rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-medium text-primary md:block">
                  Admin
                </Link>
              )}
              {/* Dashboard link */}
              <Link to="/dashboard" className="hidden rounded-lg border border-blue-500/30 bg-blue-500/5 px-3 py-2 text-xs font-medium text-blue-400 md:block hover:bg-blue-500/10 transition-all">
                Dashboard
              </Link>
              {/* User avatar and email */}
              <Link to="/profile" className="hidden items-center gap-2 md:flex hover:opacity-80 transition-opacity">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg shadow-blue-500/10">
                  <span className="text-[10px] font-bold text-white">{user?.email?.charAt(0)?.toUpperCase() || "U"}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{user.email?.split("@")[0]}</span>
              </Link>
              {/* Sign out button */}
              <button onClick={handleSignOut} className="hidden items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground md:flex">
                <LogOut size={14} /> Sign Out
              </button>
            </>
          ) : (
            <>
              {/* Sign In and Get Started buttons for guests */}
              <Link to="/auth/signin" className="hidden rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary md:block">
                Sign In
              </Link>
              <Link to="/auth/signup" className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 md:block">
                Get Started
              </Link>
            </>
          )}

          {/* Mobile hamburger menu toggle */}
          <button className="rounded-lg p-2 text-foreground md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-background md:hidden max-h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="container flex flex-col gap-1 py-4">
              {/* Navigation links */}
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${location.pathname === link.href ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                  {link.label}
                </Link>
              ))}
              {/* Mobile auth buttons */}
              {user ? (
                <div className="mt-2 flex gap-2">
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg border border-primary/30 bg-primary/5 py-3 text-center text-sm font-medium text-primary">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg border border-blue-500/30 bg-blue-500/5 py-3 text-center text-sm font-medium text-blue-400">
                    Dashboard
                  </Link>
                  <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="flex-1 rounded-lg border border-border py-3 text-center text-sm font-medium text-foreground">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex gap-2">
                  <Link to="/auth/signin" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg border border-border py-3 text-center text-sm font-medium text-foreground">
                    Sign In
                  </Link>
                  <Link to="/auth/signup" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg bg-primary py-3 text-center text-sm font-medium text-primary-foreground">
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
