/**
 * NotFound.tsx - 404 Error Page (95 lines)
 * 
 * Shown when the user visits a URL that doesn't match any route.
 * Provides a friendly error message and quick links to navigate back.
 * 
 * Features:
 * - Large animated "404" text
 * - "Page not found" message
 * - Quick navigation links to main pages (Results, Tools, News, Blog)
 * - Search suggestion
 * - Animated particle field background
 * - Decorative gradient orbs
 * - 3D tilt effect on link cards
 */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ArrowRight, BookOpen, Wrench, Newspaper, FileText, AlertTriangle, Sparkles } from "lucide-react";
import ParticleField from "@/components/animations/ParticleField";
import Tilt from "react-parallax-tilt";

const quickLinks = [
  { icon: FileText, label: "Results", href: "/results", desc: "Latest exam results" },
  { icon: Wrench, label: "Tools", href: "/tools", desc: "100+ PDF tools" },
  { icon: Newspaper, label: "News", href: "/news", desc: "Daily updates" },
  { icon: BookOpen, label: "Blog", href: "/blog", desc: "Study guides" },
];

const NotFound = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0 opacity-[0.15] mix-blend-luminosity pointer-events-none" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2072&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />

      <ParticleField />
      <div className="pointer-events-none absolute left-1/3 top-1/3 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/3 right-1/3 h-[300px] w-[300px] rounded-full bg-destructive/5 blur-[100px]" />

      {/* Ambient glow */}
      <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[20%] top-[15%] h-40 w-40 rounded-full bg-accent/5 blur-[80px]" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          {/* ISHU Badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-sm text-muted-foreground">
            <Sparkles size={14} className="text-primary" />
            <span className="font-medium"><strong className="text-foreground">ISHU</strong> — Indian StudentHub University</span>
          </motion.div>

          {/* Warning badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-destructive/20 bg-destructive/5 px-4 py-2 text-sm text-destructive">
            <AlertTriangle size={14} />
            Page Not Found
          </motion.div>

          {/* Animated 404 */}
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}>
            <div className="relative inline-block">
              <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="font-display text-[120px] font-bold leading-none text-gradient md:text-[180px]">4</motion.span>
              <motion.span animate={{ y: [0, -15, 0], rotateY: [0, 360] }}
                transition={{ y: { repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.3 }, rotateY: { repeat: Infinity, duration: 6, ease: "linear" } }}
                className="font-display text-[120px] font-bold leading-none text-gradient-accent md:text-[180px] inline-block"
                style={{ transformStyle: "preserve-3d" }}>0</motion.span>
              <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.6 }}
                className="font-display text-[120px] font-bold leading-none text-gradient md:text-[180px]">4</motion.span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-4 font-display text-2xl font-bold text-foreground md:text-3xl">
            Oops! This page doesn't exist
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-3 text-muted-foreground">
            The page you're looking for might have been moved or doesn't exist. Let's get you back on track.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/"
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <Home size={16} /> Go Home
            </Link>
            <Link to="/results"
              className="flex items-center justify-center gap-2 rounded-xl border border-border glass px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:border-primary/20">
              <Search size={16} /> Browse Results
            </Link>
          </motion.div>

          {/* Quick navigation cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickLinks.map((item, i) => (
              <Tilt key={item.label} tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable glareMaxOpacity={0.06} glareBorderRadius="0.75rem" scale={1.03}>
                <Link to={item.href}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border glass-strong p-4 text-center transition-all hover:border-primary/20 hover:shadow-glow">
                  <motion.div whileHover={{ rotate: [0, -5, 5, 0], scale: 1.15 }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon size={18} className="text-primary" />
                  </motion.div>
                  <span className="text-sm font-semibold text-foreground">{item.label}</span>
                  <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                </Link>
              </Tilt>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
