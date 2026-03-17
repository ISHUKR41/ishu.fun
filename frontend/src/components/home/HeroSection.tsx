/**
 * HeroSection.tsx - Main Landing Page Hero Banner
 * 
 * The first thing users see on the homepage. Features:
 * - Parallax background image that moves on scroll
 * - tsParticles: Interactive floating particles with connecting lines
 * - 3D scene: Lazy-loaded Three.js hero animation (HeroScene3D)
 * - TypeAnimation: Rotating exam names (UPSC, SSC, Banking, etc.)
 * - TextReveal: Words animate in letter by letter
 * - GSAP: Scroll-triggered animations for stats bar and feature chips
 * - Magnetic CTA buttons that respond to mouse proximity
 * - Tilt card for the stats bar (reacts to mouse angle)
 * 
 * Brand: ISHU — Indian StudentHub University
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ChevronDown, Shield, Zap, Globe, Award, Users, FileText, Newspaper } from "lucide-react";
import MagneticButton from "../animations/MagneticButton";
import TextReveal from "../animations/TextReveal";
import heroBg from "@/assets/hero-bg.jpg";
import { useRef, lazy, Suspense, useEffect, useCallback, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import gsap from "gsap";
import { TypeAnimation } from "react-type-animation";
import Tilt from "react-parallax-tilt";

// Lazy load 3D scene with error fallback to prevent blank screen on import failure
const HeroScene3D = lazy(() => import("../3d/HeroScene3D").catch(() => ({ default: () => null })));

const quickFeatures = [
{ icon: Shield, label: "100% Free", desc: "No hidden charges ever" },
{ icon: Zap, label: "Real-time", desc: "Instant result updates" },
{ icon: Globe, label: "Pan-India", desc: "All 36 states covered" },
{ icon: Award, label: "Verified", desc: "Official sources only" }];


const liveStats = [
{ icon: Users, value: "1M+", label: "Active Students" },
{ icon: FileText, value: "100+", label: "PDF Tools" },
{ icon: Globe, value: "36", label: "States & UTs" },
{ icon: Newspaper, value: "1K+", label: "Daily News" }];


const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const statsBarRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [particlesReady, setParticlesReady] = useState(false);
  const prefersReducedMotion = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesReady(true));
  }, []);

  useEffect(() => {
    if (!headlineRef.current) return;
    const ctx = gsap.context(() => {
      if (statsBarRef.current) {
        gsap.fromTo(statsBarRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 2, ease: "power4.out", clearProps: "all" });
        gsap.fromTo(statsBarRef.current.querySelectorAll(".stat-item"),
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.12, delay: 2.3, ease: "back.out(1.7)", clearProps: "all" }
        );
      }
      if (featuresRef.current) {
        gsap.fromTo(featuresRef.current.querySelectorAll(".feature-chip"),
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, delay: 1.8, ease: "power3.out", clearProps: "all" }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const particlesLoaded = useCallback(async () => {}, []);

  const particlesOptions = useMemo(() => ({
    fullScreen: false,
    fpsLimit: 60,
    particles: {
      number: { value: 30, density: { enable: true } },
      color: { value: ["#3b82f6", "#8b5cf6", "#06b6d4"] },
      shape: { type: "circle" },
      opacity: { value: { min: 0.1, max: 0.4 }, animation: { enable: true, speed: 0.8, sync: false } },
      size: { value: { min: 1, max: 3 }, animation: { enable: true, speed: 2, sync: false } },
      move: { enable: true, speed: 0.6, direction: "none" as const, outModes: { default: "out" as const } },
      links: { enable: true, distance: 150, color: "#3b82f6", opacity: 0.08, width: 1 }
    },
    interactivity: {
      events: { onHover: { enable: true, mode: "grab" as const }, onClick: { enable: true, mode: "push" as const } },
      modes: { grab: { distance: 200, links: { opacity: 0.2 } }, push: { quantity: 3 } }
    },
    detectRetina: true
  }), []);

  return (
    <section ref={containerRef} className="relative flex min-h-[100vh] items-center overflow-hidden bg-gradient-hero">
      {/* Parallax background */}
      <motion.img src={heroBg} alt="" className="pointer-events-none absolute inset-0 h-[120%] w-full object-cover opacity-25" loading="eager" style={{ y: bgY }} />

      {/* Enhanced overlays */}
      <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced" />
      <div className="pointer-events-none absolute inset-0 holo-effect opacity-60" />
      <div className="pointer-events-none absolute inset-0 grain" />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />

      {/* tsParticles */}
      {particlesReady && !prefersReducedMotion &&
      <Particles id="hero-particles" className="pointer-events-none absolute inset-0 z-[1]" particlesLoaded={particlesLoaded} options={particlesOptions} />
      }

      <Suspense fallback={null}><HeroScene3D /></Suspense>

      {/* Aurora gradient orbs — reduced to 4 key ones for 60fps performance */}
      <motion.div animate={prefersReducedMotion ? {} : { x: [0, 100, 0], y: [0, -80, 0], scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      className="pointer-events-none absolute left-1/4 top-1/4 h-[700px] w-[700px] rounded-full bg-primary/12 blur-[100px] morph-blob" style={{ willChange: "transform" }} />
      <motion.div animate={prefersReducedMotion ? {} : { x: [0, -80, 0], y: [0, 60, 0], scale: [1, 0.8, 1] }} transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
      className="pointer-events-none absolute bottom-1/4 right-1/4 h-[600px] w-[600px] rounded-full bg-[hsl(260,100%,66%,0.10)] blur-[90px] morph-blob" style={{ willChange: "transform" }} />
      <motion.div animate={prefersReducedMotion ? {} : { x: [0, 50, 0], y: [0, -40, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      className="pointer-events-none absolute right-1/3 top-1/3 h-[500px] w-[500px] rounded-full bg-[hsl(170,100%,50%,0.06)] blur-[80px]" style={{ willChange: "transform" }} />
      <motion.div animate={prefersReducedMotion ? {} : { scale: [1, 1.3, 1], rotate: [0, 120, 0] }} transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
      className="pointer-events-none absolute left-[60%] top-[10%] h-[400px] w-[400px] morph-blob bg-primary/[0.06] blur-[80px]" style={{ willChange: "transform" }} />

      <motion.div className="container relative z-10" style={{ y: textY, opacity, scale }}>
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          





          

          {/* Headline */}
          <h1 ref={headlineRef} className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            <TextReveal text="Your Gateway to" delay={0.2} />
            <br />
            <span className="text-shimmer">
              <TypeAnimation
                sequence={['UPSC', 2000, 'SSC CGL', 2000, 'Banking', 2000, 'Railways', 2000, 'JEE / NEET', 2000, 'Government', 2000, 'Defence', 2000, 'State PSC', 2000]}
                wrapper="span" speed={40} repeat={Infinity} cursor={true} style={{ display: 'inline-block' }} />
              
            </span>
            <br />
            <TextReveal text="Exam Success" delay={0.8} />
          </h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Results, Vacancies, 100+ PDF Tools, Live News & More — Everything you need for UPSC, SSC, Banking, Railways, NTA & State exams.
          </motion.p>

          {/* Quick Feature Chips */}
          <div ref={featuresRef} className="mt-6 flex flex-wrap justify-center gap-3">
            {quickFeatures.map((f) =>
            <div key={f.label} className="feature-chip flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-xs">
                <f.icon size={12} className="text-primary" />
                <span className="font-semibold text-foreground">{f.label}</span>
                <span className="text-muted-foreground hidden sm:inline">— {f.desc}</span>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton>
              <Link to="/results"
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-4 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative">Explore Results</span>
                <ArrowRight size={16} className="relative transition-transform group-hover:translate-x-1" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link to="/tools"
              className="group flex items-center gap-2 rounded-xl border border-border glass px-8 py-4 font-display text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:shadow-glow">
                Try PDF Tools — Free
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Stats bar with Tilt */}
          <div ref={statsBarRef} className="mt-16 inline-block">
            <Tilt tiltMaxAngleX={prefersReducedMotion ? 0 : 5} tiltMaxAngleY={prefersReducedMotion ? 0 : 5} glareEnable={!prefersReducedMotion} glareMaxOpacity={0.06} glareBorderRadius="1rem" scale={prefersReducedMotion ? 1 : 1.01}>
              <div className="inline-flex items-center gap-6 rounded-2xl glass-strong px-8 py-5 animate-breathe border border-border">
                {liveStats.map((stat, i) =>
                <div key={stat.label} className={`stat-item flex items-center gap-3 text-center ${i > 0 ? "border-l border-border pl-6" : ""}`}>
                    <stat.icon size={16} className="text-primary hidden sm:block" />
                    <div>
                      <p className="font-display text-lg font-bold text-foreground md:text-xl">{stat.value}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                )}
              </div>
            </Tilt>
          </div>

          {/* Trusted by badge */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) =>
              <div key={i} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-primary/20 text-[8px] font-bold text-primary">
                  {String.fromCharCode(65 + i)}
                </div>
              )}
            </div>
            <span>Trusted by <strong className="text-foreground">1M+</strong> students across India</span>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="mt-10 flex justify-center">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} className="flex flex-col items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Scroll</span>
              <ChevronDown size={16} className="text-primary/60" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>);

};

export default HeroSection;