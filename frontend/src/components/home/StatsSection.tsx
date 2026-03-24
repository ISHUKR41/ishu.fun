/**
 * StatsSection.tsx — Platform Statistics
 *
 * Key platform numbers with animated counters and tilt cards.
 * Performance: CSS-only backgrounds — no JS decorative animations.
 * Replaces motion.div x-animated accent lines with pure CSS keyframe animations.
 */

import { motion } from "framer-motion";
import AnimatedCounter from "../animations/AnimatedCounter";
import FadeInView from "../animations/FadeInView";
import { Users, Wrench, FileText, Newspaper, TrendingUp, Globe, Award, Clock, Zap, Star, Shield, CheckCircle } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Users, value: 1000000, suffix: "+", label: "Active Students", color: "#3b82f6", glow: "rgba(59,130,246,0.12)" },
  { icon: Wrench, value: 145, suffix: "+", label: "Free PDF Tools", color: "#8b5cf6", glow: "rgba(139,92,246,0.12)" },
  { icon: FileText, value: 50000, suffix: "+", label: "Results Posted", color: "#10b981", glow: "rgba(16,185,129,0.12)" },
  { icon: Newspaper, value: 1000, suffix: "+", label: "Daily News", color: "#f59e0b", glow: "rgba(245,158,11,0.12)" },
];

const additionalStats = [
  { icon: Globe, value: "36", label: "States & UTs" },
  { icon: TrendingUp, value: "99.9%", label: "Uptime" },
  { icon: Award, value: "#1", label: "Rated Platform" },
  { icon: Clock, value: "24/7", label: "Availability" },
];

const highlights = [
  { icon: Zap, text: "Real-time Updates" },
  { icon: Shield, text: "100% Secure" },
  { icon: Star, text: "Free Forever" },
  { icon: CheckCircle, text: "Verified Data" },
];

const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".stat-card",
        { y: 45, opacity: 0, scale: 0.92 },
        {
          scrollTrigger: { trigger: ".stats-grid", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, scale: 1, stagger: 0.09, duration: 0.65, ease: "back.out(1.4)", clearProps: "all",
        }
      );
      gsap.fromTo(".extra-stat",
        { y: 18, opacity: 0 },
        {
          scrollTrigger: { trigger: ".extra-stats-row", start: "top 88%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.08, duration: 0.45, ease: "power3.out", clearProps: "all",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-y border-white/[0.05] py-28">
      {/* CSS-only backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-card" />
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-[0.15]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%)`,
        }}
      />
      {/* CSS-animated accent lines (no JS) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
        <div
          className="h-full w-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)",
            animation: "marquee-ltr 8s linear infinite",
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden">
        <div
          className="h-full w-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)",
            animation: "marquee-rtl 8s linear infinite",
          }}
        />
      </div>

      <div className="container relative">
        {/* Header */}
        <FadeInView>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary"
            >
              <TrendingUp size={11} />
              Trusted by Millions
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.07 }}
              className="mt-5 font-display text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              Numbers that{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                speak
              </span>
            </motion.h2>
            <p className="mt-3 text-white/40">India's most trusted exam results and PDF tools platform</p>
            <div className="mx-auto mt-4 h-px w-28 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
        </FadeInView>

        {/* Main stats grid */}
        <div className="stats-grid grid grid-cols-2 gap-4 md:gap-5 md:grid-cols-4">
          {stats.map((stat) => (
            <Tilt
              key={stat.label}
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              glareEnable
              glareMaxOpacity={0.08}
              glareColor={stat.color}
              glarePosition="all"
              glareBorderRadius="1.5rem"
              scale={1.03}
              transitionSpeed={400}
            >
              <motion.div
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                className="stat-card group relative rounded-3xl border border-white/[0.07] bg-[#0a0a14]/85 p-7 text-center backdrop-blur-sm transition-all duration-300"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 36px ${stat.glow}, 0 0 0 1px ${stat.color}20`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                {/* Top accent on hover */}
                <div
                  className="absolute inset-x-0 top-0 h-px rounded-t-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.color}80, transparent)` }}
                />

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                  className="mx-auto mb-5 flex items-center justify-center rounded-2xl transition-all"
                  style={{
                    width: 64, height: 64,
                    background: `linear-gradient(135deg, ${stat.color}25, ${stat.color}10)`,
                    border: `1px solid ${stat.color}25`,
                  }}
                >
                  <stat.icon size={28} style={{ color: stat.color }} />
                </motion.div>

                {/* Counter */}
                <div className="font-display text-4xl font-black text-white md:text-5xl" style={{ letterSpacing: "-0.02em" }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix="" />
                </div>
                <p className="mt-3 text-sm font-medium text-white/45">{stat.label}</p>

                {/* Decorative line */}
                <div
                  className="mx-auto mt-4 h-px w-10 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
                />
              </motion.div>
            </Tilt>
          ))}
        </div>

        {/* Additional mini stats */}
        <div className="extra-stats-row mt-14 flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {additionalStats.map((s) => (
            <motion.div
              key={s.label}
              className="extra-stat flex items-center gap-3.5"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/8 text-primary transition-all hover:bg-primary hover:text-white">
                <s.icon size={18} />
              </div>
              <div>
                <p className="font-display text-xl font-black text-white">{s.value}</p>
                <p className="text-xs text-white/35">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlight chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
          {highlights.map((h) => (
            <motion.div
              key={h.text}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/45 transition-all hover:border-primary/25 hover:text-white/70"
            >
              <h.icon size={11} className="text-primary" />
              {h.text}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
