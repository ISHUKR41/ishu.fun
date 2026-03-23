/**
 * HeroSection.tsx — Redesigned Hero (Apple / Tesla / Vercel / Framer Style)
 *
 * Ultra-modern landing hero:
 *  - Massive, impactful headline with gradient text
 *  - TypeAnimation cycling through exam names
 *  - CSS-only aurora orbs (zero JS overhead, no lag)
 *  - Smooth parallax on scroll (Framer Motion)
 *  - Magnetic CTA buttons
 *  - Live stats bar with animated counters
 *  - Responsive across all devices
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Sparkles, ChevronDown, Shield, Zap, Globe, Award,
  Users, FileText, Newspaper, Star, CheckCircle
} from "lucide-react";
import MagneticButton from "../animations/MagneticButton";
import { useRef, useEffect, useCallback, useState, useMemo } from "react";
import gsap from "gsap";
import { TypeAnimation } from "react-type-animation";

const quickFeatures = [
  { icon: Shield, label: "100% Free", desc: "No hidden charges ever" },
  { icon: Zap, label: "Real-time", desc: "Instant result updates" },
  { icon: Globe, label: "Pan-India", desc: "All 36 states covered" },
  { icon: Award, label: "Verified", desc: "Official sources only" },
];

const liveStats = [
  { icon: Users, value: "1M+", label: "Active Students" },
  { icon: FileText, value: "100+", label: "PDF Tools" },
  { icon: Globe, value: "36", label: "States & UTs" },
  { icon: Newspaper, value: "1K+", label: "Daily News" },
];

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsBarRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      if (statsBarRef.current) {
        gsap.fromTo(
          statsBarRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.5, ease: "power4.out", clearProps: "all" }
        );
        gsap.fromTo(
          statsBarRef.current.querySelectorAll(".stat-item"),
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.65, ease: "back.out(1.7)", clearProps: "all" }
        );
      }
      if (chipsRef.current) {
        gsap.fromTo(
          chipsRef.current.querySelectorAll(".feature-chip"),
          { y: 12, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.45, stagger: 0.07, delay: 0.35, ease: "power3.out", clearProps: "all" }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="hero-section relative flex min-h-[100svh] items-center overflow-hidden"
      style={{
        background: "linear-gradient(170deg, #020208 0%, #06080f 40%, #020208 100%)",
      }}
    >
      {/* ── Grid pattern ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Subtle vignette ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 60%)",
        }}
      />

      {/* ── CSS aurora orbs (zero JS) ── */}
      <div className="pointer-events-none absolute left-[15%] top-[20%] h-[700px] w-[700px] rounded-full bg-blue-500/[0.055] blur-[100px] css-orb" />
      <div className="pointer-events-none absolute bottom-[15%] right-[10%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.045] blur-[90px] css-orb" style={{ animationDelay: "-5s", animationDuration: "15s" }} />
      <div className="pointer-events-none absolute right-[30%] top-[40%] h-[400px] w-[400px] rounded-full bg-cyan-500/[0.03] blur-[80px] css-orb" style={{ animationDelay: "-9s", animationDuration: "18s" }} />

      {/* ── Bottom gradient fade ── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[5] h-48 bg-gradient-to-t from-background via-background/60 to-transparent" />

      {/* ── Main content ── */}
      <motion.div
        className="container relative z-10 px-4 pt-24 pb-16 md:pt-28 md:pb-20"
        style={{ y: textY, opacity, scale }}
      >
        <div className="mx-auto max-w-5xl text-center">

          {/* ── Badge ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-2.5 text-sm backdrop-blur-md"
          >
            <Sparkles size={13} className="text-blue-400" />
            <span className="font-medium text-white/65">ISHU — Indian StudentHub University</span>
            <motion.span
              animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="h-2 w-2 rounded-full bg-emerald-400"
            />
          </motion.div>

          {/* ── Main Headline ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-5xl font-black leading-[1.04] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px]">
              <span className="block text-white/90">Your Gateway</span>
              <span className="block mt-1 md:mt-2">
                <span
                  className="inline-block"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  <TypeAnimation
                    sequence={[
                      'UPSC', 2200,
                      'SSC CGL', 2000,
                      'Banking', 2000,
                      'Railways', 2000,
                      'JEE / NEET', 2000,
                      'Government', 2000,
                      'Defence', 2000,
                      'State PSC', 2000,
                    ]}
                    wrapper="span"
                    speed={42}
                    repeat={Infinity}
                    cursor={true}
                    style={{ display: "inline-block" }}
                  />
                </span>
              </span>
              <span className="block mt-1 md:mt-2 text-white/90">Exam Success</span>
            </h1>
          </motion.div>

          {/* ── Subtitle ── */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/50 md:text-xl"
          >
            Results, Vacancies, 100+ PDF Tools, Live News & More —{" "}
            <span className="text-white/70">Everything you need for UPSC, SSC, Banking, Railways & State exams.</span>{" "}
            All free, all in one place.
          </motion.p>

          {/* ── Feature chips ── */}
          <div ref={chipsRef} className="mt-7 flex flex-wrap justify-center gap-2.5">
            {quickFeatures.map((f) => (
              <div
                key={f.label}
                className="feature-chip flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.04] px-4 py-2 text-xs backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.07]"
              >
                <f.icon size={11} className="text-blue-400 shrink-0" />
                <span className="font-semibold text-white/80">{f.label}</span>
                <span className="hidden text-white/40 sm:inline">— {f.desc}</span>
              </div>
            ))}
          </div>

          {/* ── CTA Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <MagneticButton>
              <Link
                to="/results"
                className="group relative flex items-center gap-2.5 overflow-hidden rounded-xl px-8 py-4 text-sm font-semibold text-white transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  boxShadow: "0 0 0 0 rgba(99,102,241,0)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 32px rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 rgba(99,102,241,0)";
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative">Explore Results</span>
                <ArrowRight size={15} className="relative transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </MagneticButton>

            <MagneticButton>
              <Link
                to="/tools"
                className="group flex items-center gap-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-8 py-4 text-sm font-semibold text-white/85 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                Try PDF Tools — Free
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 opacity-60 group-hover:opacity-100" />
              </Link>
            </MagneticButton>
          </motion.div>

          {/* ── Stats bar ── */}
          <div ref={statsBarRef} className="mt-16 w-full">
            <div
              className="mx-auto grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] sm:flex sm:max-w-none sm:items-center sm:justify-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
              }}
            >
              {liveStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`stat-item flex items-center justify-center gap-3 px-6 py-5 sm:justify-start ${
                    i > 0 ? "sm:border-l sm:border-white/[0.06]" : ""
                  } border-white/[0.06] ${i >= 2 ? "border-t sm:border-t-0" : ""}`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                    <stat.icon size={16} className="text-blue-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-display text-lg font-bold text-white md:text-xl">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/40">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Social proof ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/30"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1.5">
                {["A", "B", "C", "D", "E"].map((l) => (
                  <div key={l} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#06080f] bg-gradient-to-br from-blue-500/30 to-violet-500/30 text-[8px] font-bold text-white/70">
                    {l}
                  </div>
                ))}
              </div>
              <span>Trusted by <strong className="text-white/60">1M+</strong> students</span>
            </div>
            <span className="hidden sm:block">·</span>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
              ))}
              <span>4.9/5 rated</span>
            </div>
            <span className="hidden sm:block">·</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle size={11} className="text-emerald-400" />
              <span>100% Free forever</span>
            </div>
          </motion.div>

          {/* ── Scroll indicator ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-12 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/20">Scroll</span>
              <ChevronDown size={14} className="text-white/25" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
