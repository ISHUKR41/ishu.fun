/**
 * StatesMapSection.tsx - Pan-India State Coverage Section
 * 
 * Displays all 36 Indian states and union territories in a grid.
 * Active states show post count; inactive states show "Soon".
 * Left side: stats, coverage progress bar, 3D globe visualization.
 * Right side: Interactive 3D globe (GlobeScene3D, lazy-loaded).
 * 
 * Features:
 * - 36 clickable state cards linking to state-specific result pages
 * - Animated coverage progress bar showing active/total states
 * - GSAP staggered card entrance animation
 * - 3D rotating globe with state dots (Three.js)
 * - Aurora gradient background effects
 */

import FadeInView from "../animations/FadeInView";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Globe, TrendingUp, Users, ArrowRight, Sparkles } from "lucide-react";
import { lazy, Suspense, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";

gsap.registerPlugin(ScrollTrigger);

// Lazy load 3D globe with error fallback to prevent blank screen on import failure
const GlobeScene3D = lazy(() => import("../3d/GlobeScene3D").catch(() => ({ default: () => null })));

const statesData = [
  { name: "Uttar Pradesh", code: "UP", active: true, posts: 45 },
  { name: "Bihar", code: "BR", active: true, posts: 32 },
  { name: "Rajasthan", code: "RJ", active: true, posts: 38 },
  { name: "Madhya Pradesh", code: "MP", active: true, posts: 28 },
  { name: "Maharashtra", code: "MH", active: true, posts: 52 },
  { name: "Gujarat", code: "GJ", active: true, posts: 25 },
  { name: "Karnataka", code: "KA", active: true, posts: 30 },
  { name: "Tamil Nadu", code: "TN", active: true, posts: 35 },
  { name: "West Bengal", code: "WB", active: true, posts: 22 },
  { name: "Jharkhand", code: "JH", active: true, posts: 18 },
  { name: "Haryana", code: "HR", active: true, posts: 20 },
  { name: "Punjab", code: "PB", active: true, posts: 15 },
  { name: "Delhi", code: "DL", active: true, posts: 40 },
  { name: "Uttarakhand", code: "UK", active: true, posts: 12 },
  { name: "Himachal Pradesh", code: "HP", active: false, posts: 0 },
  { name: "Chhattisgarh", code: "CG", active: true, posts: 14 },
  { name: "Odisha", code: "OD", active: true, posts: 16 },
  { name: "Kerala", code: "KL", active: true, posts: 24 },
  { name: "Telangana", code: "TS", active: true, posts: 20 },
  { name: "Andhra Pradesh", code: "AP", active: true, posts: 18 },
  { name: "Assam", code: "AS", active: false, posts: 0 },
  { name: "Goa", code: "GA", active: false, posts: 0 },
  { name: "Manipur", code: "MN", active: false, posts: 0 },
  { name: "Meghalaya", code: "ML", active: false, posts: 0 },
  { name: "Mizoram", code: "MZ", active: false, posts: 0 },
  { name: "Nagaland", code: "NL", active: false, posts: 0 },
  { name: "Sikkim", code: "SK", active: false, posts: 0 },
  { name: "Tripura", code: "TR", active: false, posts: 0 },
  { name: "Arunachal Pradesh", code: "AR", active: false, posts: 0 },
  { name: "J&K", code: "JK", active: false, posts: 0 },
  { name: "Ladakh", code: "LA", active: false, posts: 0 },
  { name: "Chandigarh", code: "CH", active: false, posts: 0 },
  { name: "Puducherry", code: "PY", active: false, posts: 0 },
  { name: "A&N Islands", code: "AN", active: false, posts: 0 },
  { name: "D&N Haveli", code: "DN", active: false, posts: 0 },
  { name: "Lakshadweep", code: "LD", active: false, posts: 0 },
];

const mapStats = [
  { icon: Globe, value: "36", label: "States & UTs" },
  { icon: TrendingUp, value: "500+", label: "Active Posts" },
  { icon: Users, value: "1M+", label: "Users Served" },
];

const StatesMapSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".state-card",
        { y: 20, opacity: 0, scale: 0.9 },
        { scrollTrigger: { trigger: ".states-grid", start: "top 90%", toggleActions: "play none none none" },
          y: 0, opacity: 1, scale: 1, stagger: 0.02, duration: 0.4, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".map-stat",
        { y: 20, opacity: 0 },
        { scrollTrigger: { trigger: ".map-stats-row", start: "top 90%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power3.out", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const activeCount = statesData.filter(s => s.active).length;
  const totalPosts = statesData.reduce((a, s) => a + s.posts, 0);

  return (
    <section ref={sectionRef} className="relative py-28 overflow-hidden bg-gradient-to-b from-background via-card/60 to-background">
      {/* Enhanced backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 aurora-bg opacity-50" />
      <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced" />
      <div className="pointer-events-none absolute inset-0 grain" />

      {/* Animated ambient orbs */}
      <motion.div 
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[8%] top-[12%] h-[450px] w-[450px] rounded-full bg-primary/10 blur-[160px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.25, 0.5, 0.25], y: [0, 40, 0] }} 
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[10%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-[hsl(170,100%,50%,0.06)] blur-[140px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.2, 0.4, 0.2] }} 
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[180px]" 
      />

      <div className="container relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <FadeInView>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border glass px-3 py-1.5 text-xs text-muted-foreground">
                <MapPin size={12} className="text-primary" />
                State-wise Coverage
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
              </div>
              <span className="block font-display text-sm font-semibold uppercase tracking-widest text-primary">Pan-India Platform</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                All <span className="text-gradient-accent">36 States & UTs</span>
              </h2>
              <p className="mt-4 text-muted-foreground">Click on any state to view its latest vacancies & results</p>

              {/* Stats chips */}
              <div className="map-stats-row mt-6 flex flex-wrap gap-3">
                {mapStats.map((s) => (
                  <div key={s.label} className="map-stat flex items-center gap-2 rounded-xl border border-border glass px-3 py-2 text-xs">
                    <s.icon size={14} className="text-primary" />
                    <span className="font-bold text-foreground">{s.value}</span>
                    <span className="text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-6 rounded-xl border border-border bg-card p-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground">Coverage Progress</span>
                  <span className="font-bold text-primary">{activeCount}/36 Active</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${(activeCount / 36) * 100}%` }} viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(var(--accent))]" />
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground">{totalPosts} total active posts across all states</p>
              </div>
            </FadeInView>
          </div>
          <Suspense fallback={<div className="h-[400px] w-full animate-pulse rounded-2xl bg-card" />}>
            <GlobeScene3D />
          </Suspense>
        </div>

        <div className="states-grid mt-12 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9">
          {statesData.map((state) => (
            <Link to={`/results/state/${state.code.toLowerCase()}`} key={state.code}>
              <motion.div
                whileHover={{ y: -4, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`state-card group cursor-pointer rounded-xl border p-3 text-center transition-all ${
                  state.active
                    ? "border-border bg-card hover:border-primary/30 hover:shadow-glow"
                    : "border-border/50 bg-card/50 opacity-60"
                }`}
              >
                <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                  state.active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  {state.code}
                </div>
                <p className="text-[10px] font-medium leading-tight text-foreground">{state.name}</p>
                {state.active ? (
                  <span className="mt-1 inline-block rounded bg-success/10 px-1.5 py-0.5 text-[9px] font-medium text-success">
                    {state.posts} posts
                  </span>
                ) : (
                  <span className="mt-1 inline-block rounded bg-secondary px-1.5 py-0.5 text-[9px] text-muted-foreground">Soon</span>
                )}
              </motion.div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <FadeInView delay={0.2}>
          <div className="mt-10 text-center">
            <Link to="/results"
              className="group inline-flex items-center gap-2 rounded-xl border border-border glass px-6 py-3 text-sm font-medium text-primary transition-all hover:border-primary/30 hover:shadow-glow">
              View All State Results <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default StatesMapSection;
