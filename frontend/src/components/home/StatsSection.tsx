/**
 * StatsSection.tsx - Platform Statistics Display
 * 
 * Shows key platform numbers with animated counters:
 * - 1M+ Active Users, 100+ PDF Tools, 50K+ Results Posted, 1K+ Daily News
 * 
 * Features:
 * - AnimatedCounter: Numbers count up from 0 when scrolled into view
 * - Tilt cards: 3D parallax tilt effect on hover
 * - GSAP ScrollTrigger: Staggered entrance animations
 * - Gradient mesh background with animated accent lines
 * - Additional mini stats row (36 States, 99.9% Uptime, etc.)
 * - Highlight chips (Real-time, Secure, Free, Verified)
 */

import { motion } from "framer-motion";
import AnimatedCounter from "../animations/AnimatedCounter";
import FadeInView from "../animations/FadeInView";
import GradientMesh from "../animations/GradientMesh";
import { Users, Wrench, FileText, Newspaper, TrendingUp, Globe, Award, Clock, Zap, Star, Shield, CheckCircle } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Users, value: 1000000, suffix: "+", label: "Active Users", prefix: "", gradient: "from-blue-500 to-cyan-500", glow: "shadow-[0_0_30px_hsl(210,100%,56%,0.15)]" },
  { icon: Wrench, value: 100, suffix: "+", label: "PDF Tools", prefix: "", gradient: "from-violet-500 to-purple-500", glow: "shadow-[0_0_30px_hsl(260,100%,66%,0.15)]" },
  { icon: FileText, value: 50000, suffix: "+", label: "Results Posted", prefix: "", gradient: "from-emerald-500 to-green-500", glow: "shadow-[0_0_30px_hsl(142,76%,46%,0.15)]" },
  { icon: Newspaper, value: 1000, suffix: "+", label: "Daily News", prefix: "", gradient: "from-amber-500 to-orange-500", glow: "shadow-[0_0_30px_hsl(38,92%,50%,0.15)]" },
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
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".stats-title",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: sectionRef.current, start: "top 88%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".stat-card",
        { y: 50, opacity: 0, scale: 0.9 },
        { scrollTrigger: { trigger: ".stats-grid", start: "top 88%", toggleActions: "play none none none" },
          y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.7, ease: "back.out(1.5)", clearProps: "all" }
      );
      gsap.fromTo(".extra-stat",
        { y: 20, opacity: 0 },
        { scrollTrigger: { trigger: ".extra-stats-row", start: "top 90%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".highlight-chip",
        { scale: 0, opacity: 0 },
        { scrollTrigger: { trigger: ".highlights-row", start: "top 90%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.08, duration: 0.4, ease: "back.out(2)", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative border-y border-border bg-card py-28 overflow-hidden">
      {/* Background effects */}
      <GradientMesh variant="default" />
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-20" />
      <div className="pointer-events-none absolute inset-0 cross-grid opacity-30" />
      
      {/* Animated accent lines */}
      <motion.div 
        animate={{ x: ["-100%", "100%"] }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      <motion.div 
        animate={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <div className="container relative">
        {/* Header */}
        <div className="stats-title mx-auto mb-16 max-w-2xl text-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary"
          >
            <TrendingUp size={12} />
            Trusted by Millions
          </motion.span>
          <h2 className="mt-5 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Numbers that <span className="text-shimmer">speak</span>
          </h2>
          <p className="mt-4 text-muted-foreground">India's most trusted exam results & tools platform</p>
          <div className="mx-auto mt-5 gradient-line w-32" />
        </div>

        {/* Main stats grid */}
        <div className="stats-grid grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Tilt key={stat.label} tiltMaxAngleX={12} tiltMaxAngleY={12} glareEnable glareMaxOpacity={0.1} glareColor="hsl(210 100% 56%)" glarePosition="all" glareBorderRadius="1.5rem" scale={1.03} transitionSpeed={400}>
              <motion.div 
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.97 }}
                className={`stat-card group relative rounded-3xl border border-border glass-ultra p-8 text-center transition-all hover:border-primary/30 ${stat.glow}`}
              >
                {/* Gradient overlay on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                
                {/* Animated border */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 animated-border" style={{ padding: '1px' }}>
                  <div className="h-full w-full rounded-3xl bg-card" />
                </div>
                
                <div className="relative">
                  {/* Icon with 3D effect */}
                  <motion.div 
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }} 
                    transition={{ duration: 0.5 }}
                    className={`mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
                    style={{ width: 72, height: 72 }}
                  >
                    <stat.icon size={32} />
                  </motion.div>
                  
                  {/* Counter */}
                  <div className="font-display text-4xl font-bold text-foreground md:text-5xl">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-muted-foreground">{stat.label}</p>
                  
                  {/* Decorative gradient line */}
                  <div className={`mx-auto mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>

        {/* Additional mini stats */}
        <div className="extra-stats-row mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {additionalStats.map((s) => (
            <motion.div 
              key={s.label} 
              className="extra-stat flex items-center gap-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground">
                <s.icon size={20} />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlight chips */}
        <div className="highlights-row mt-12 flex flex-wrap items-center justify-center gap-3">
          {highlights.map((h) => (
            <motion.div
              key={h.text}
              whileHover={{ scale: 1.05, y: -2 }}
              className="highlight-chip flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
            >
              <h.icon size={12} className="text-primary" />
              {h.text}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
