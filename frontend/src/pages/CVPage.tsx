/**
 * CVPage.tsx - Ultra Modern CV Hub with Three.js 3D Scene
 *
 * Features: Three.js floating 3D docs + neon orbs, aurora gradient bands,
 * holographic grid, neon glowing borders, 3D tilt cards, typing animation,
 * particle field, morphing blobs, animated counters, staggered reveals.
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import ParticleField from "@/components/animations/ParticleField";
import ScrollProgress from "@/components/animations/ScrollProgress";
import SpotlightCard from "@/components/animations/SpotlightCard";
import ShimmerText from "@/components/animations/ShimmerText";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import StaggerChildren from "@/components/animations/StaggerChildren";
import GlowingBorder from "@/components/animations/GlowingBorder";
import TextReveal from "@/components/animations/TextReveal";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Sphere } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useRef, Suspense, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Tilt from "react-parallax-tilt";
import * as THREE from "three";
import {
  FileText, UserCircle, ArrowRight, Sparkles, Download, Shield, Zap,
  CheckCircle, Star, Award, Clock, Globe, Palette,
  Eye, PenTool, Layers, MousePointerClick, TrendingUp, Rocket, Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

// ─── Three.js 3D Scene ────────────────────────────────────────────────────────
function FloatingDoc({ position, color, delay = 0 }: { position: [number, number, number]; color: string; delay?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + delay;
    ref.current.rotation.y = Math.sin(t * 0.4) * 0.55;
    ref.current.rotation.z = Math.sin(t * 0.25) * 0.1;
    ref.current.position.y = position[1] + Math.sin(t * 0.45) * 0.28;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.5, 0.68, 0.04]} />
      <meshPhysicalMaterial
        color={color} emissive={color} emissiveIntensity={0.6}
        roughness={0.1} metalness={0.9} transparent opacity={0.85}
      />
    </mesh>
  );
}

function NeonOrb({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <Sphere args={[0.18, 20, 20]} position={position}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </Sphere>
    </Float>
  );
}

function CVScene3D() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      gl={{ alpha: true, antialias: true, powerPreference: "default" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={4} color="#60a5fa" />
        <pointLight position={[-5, -5, 5]} intensity={3} color="#a855f7" />
        <Stars radius={80} depth={50} count={250} factor={2.5} saturation={0} fade speed={0.4} />
        <FloatingDoc position={[-3.2, 0.8, -1]} color="#3b82f6" delay={0} />
        <FloatingDoc position={[3.2, -0.4, -1.5]} color="#8b5cf6" delay={1.5} />
        <FloatingDoc position={[-2.4, -1.8, 0.3]} color="#06b6d4" delay={0.8} />
        <FloatingDoc position={[2.1, 1.9, -0.5]} color="#10b981" delay={2.2} />
        <FloatingDoc position={[0.6, -0.9, 1]} color="#f59e0b" delay={3} />
        <NeonOrb position={[4.5, 2.5, -3]} color="#6366f1" />
        <NeonOrb position={[-4.5, -2.2, -3]} color="#ec4899" />
        <NeonOrb position={[1.5, 3.5, -4]} color="#14b8a6" />
        <NeonOrb position={[-2, -3, -2.5]} color="#f97316" />
      </Suspense>
    </Canvas>
  );
}

const cvSections = [
  {
    title: "Resume",
    subtitle: "Professional Resume Builder",
    description: "Create a professional resume that stands out. Choose from modern templates, add your experience, skills, and education — download as PDF instantly.",
    icon: FileText,
    href: "/cv/resume",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/10 to-cyan-500/10",
    glowColor: "hsl(210 100% 56% / 0.15)",
    features: [
      { text: "Professional Templates", icon: Palette },
      { text: "ATS-Friendly Format", icon: CheckCircle },
      { text: "Instant PDF Download", icon: Download },
      { text: "Live Preview", icon: Eye },
      { text: "Easy Section Editing", icon: PenTool },
      { text: "Multiple Layouts", icon: Layers },
    ],
  },
  {
    title: "Bio-Data",
    subtitle: "Personal Bio-Data Generator",
    description: "Generate a clean and well-formatted bio-data for personal, matrimonial, or official purposes. Fill in your details and get a polished document ready to share.",
    icon: UserCircle,
    href: "/cv/bio-data",
    color: "from-violet-500 to-purple-500",
    bgColor: "from-violet-500/10 to-purple-500/10",
    glowColor: "hsl(260 100% 56% / 0.15)",
    features: [
      { text: "Personal Details", icon: Heart },
      { text: "Family Information", icon: UserCircle },
      { text: "Photo Upload", icon: Eye },
      { text: "Print Ready PDF", icon: Download },
      { text: "Multiple Formats", icon: Palette },
      { text: "Clean Layouts", icon: Star },
    ],
  },
];

const stats = [
  { label: "Templates", value: 10, suffix: "+", icon: Sparkles },
  { label: "Users", value: 5000, suffix: "+", icon: TrendingUp },
  { label: "Privacy", value: 100, suffix: "%", icon: Shield },
  { label: "Speed", value: 3, suffix: "s", icon: Zap },
];

const floatingIcons = [
  { Icon: FileText, x: "10%", y: "20%", delay: 0, size: 24, color: "text-blue-500/20" },
  { Icon: UserCircle, x: "85%", y: "15%", delay: 0.5, size: 28, color: "text-violet-500/20" },
  { Icon: Award, x: "5%", y: "70%", delay: 1, size: 20, color: "text-cyan-500/20" },
  { Icon: Star, x: "90%", y: "65%", delay: 1.5, size: 22, color: "text-purple-500/20" },
  { Icon: Globe, x: "70%", y: "80%", delay: 2, size: 18, color: "text-blue-400/20" },
  { Icon: Rocket, x: "20%", y: "85%", delay: 2.5, size: 20, color: "text-emerald-500/20" },
];

const processSteps = [
  { step: "1", title: "Choose Section", desc: "Select Resume or Bio-Data to get started", icon: MousePointerClick, color: "from-blue-500 to-cyan-500" },
  { step: "2", title: "Fill Your Details", desc: "Enter your information in the easy form", icon: PenTool, color: "from-violet-500 to-purple-500" },
  { step: "3", title: "Preview & Download", desc: "Review your document and download as PDF", icon: Download, color: "from-emerald-500 to-teal-500" },
];

// ─── Neon Grid Overlay ────────────────────────────────────────────────────────
const NeonGrid = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.04]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(99,102,241,1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
    }}
  />
);

// ─── Aurora Bands ─────────────────────────────────────────────────────────────
const AuroraBands = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {[
      { color: "from-blue-600/20 via-violet-600/10 to-transparent", top: "5%", delay: 0 },
      { color: "from-violet-600/15 via-purple-600/8 to-transparent", top: "25%", delay: 1.5 },
      { color: "from-cyan-600/12 via-blue-600/8 to-transparent", top: "55%", delay: 3 },
      { color: "from-emerald-600/10 via-teal-600/6 to-transparent", top: "75%", delay: 4.5 },
    ].map((band, i) => (
      <motion.div
        key={i}
        className={`absolute left-0 right-0 h-24 bg-gradient-to-r ${band.color} blur-2xl`}
        style={{ top: band.top, willChange: "transform, opacity" }}
        animate={{ opacity: [0.4, 0.9, 0.4], scaleX: [0.9, 1.05, 0.9], x: [-20, 20, -20] }}
        transition={{ repeat: Infinity, duration: 8 + i * 2, delay: band.delay, ease: "easeInOut" }}
      />
    ))}
  </div>
);

const CVPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    // GSAP ScrollTrigger: staggered card reveals
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".cv-card");
      gsap.fromTo(cards,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 80%", toggleActions: "play none none reverse" }
        }
      );
    }
    // GSAP ScrollTrigger: process steps
    if (stepsRef.current) {
      const steps = stepsRef.current.querySelectorAll(".process-step");
      gsap.fromTo(steps,
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.7, stagger: 0.18, ease: "power2.out",
          scrollTrigger: { trigger: stepsRef.current, start: "top 85%", toggleActions: "play none none reverse" }
        }
      );
    }
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <Layout>
      <ScrollProgress />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://ishu.dev/" },
        { name: "CV", url: "https://ishu.dev/cv" },
      ]} />

      {/* Hero Section with Parallax + Three.js */}
      <section ref={heroRef} className="relative overflow-hidden py-16 sm:py-24 md:py-36 min-h-[70vh] sm:min-h-[85vh] flex items-center">
        {/* Three.js 3D Scene */}
        <CVScene3D />
        {/* Aurora + Grid Overlays */}
        <AuroraBands />
        <NeonGrid />
        <ParticleField />
        <GradientMesh className="opacity-30" />
        <MorphingBlob className="absolute -top-40 -right-40 h-[600px] w-[600px] opacity-20" color="blue" />
        <MorphingBlob className="absolute -bottom-40 -left-40 h-[500px] w-[500px] opacity-15" color="violet" />
        <MorphingBlob className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] opacity-8" color="cyan" />

        {/* Floating Icons */}
        {floatingIcons.map(({ Icon, x, y, delay, size, color }, i) => (
          <motion.div
            key={i}
            className={`absolute pointer-events-none ${color}`}
            style={{ left: x, top: y, willChange: "transform" }}
            animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4 + i, delay, ease: "easeInOut" }}
          >
            <Icon size={size} />
          </motion.div>
        ))}

        <motion.div style={{ y: heroY, opacity: heroOpacity, willChange: "transform, opacity" }} className="container relative z-10">
          <FadeInView>
            <div className="mx-auto max-w-4xl text-center">
              {/* Animated Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                  <Sparkles className="h-3.5 w-3.5" />
                </motion.div>
                Free CV Builder — No Sign-up Required
              </motion.div>

              {/* Hero Icon with Pulse + Neon Rings */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="mx-auto mb-8 relative inline-block"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 shadow-2xl shadow-blue-500/40">
                  <FileText className="h-12 w-12 text-white drop-shadow-lg" />
                </div>
                {/* Neon ring pulses */}
                {[1, 2, 3].map((ring) => (
                  <motion.div
                    key={ring}
                    animate={{ scale: [1, 1.4 + ring * 0.2, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2, delay: ring * 0.4 }}
                    className="absolute inset-0 h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-500"
                  />
                ))}
              </motion.div>

              {/* Heading */}
              <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
                <ShimmerText>CV</ShimmerText>{" "}
                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text">Builder</span>
              </h1>
              <div className="mt-5 h-8 text-base text-muted-foreground sm:text-lg md:text-xl">
                <TypeAnimation
                  sequence={[
                    "Create professional Resumes in minutes ✨",
                    2000,
                    "Generate polished Bio-Data instantly 📄",
                    2000,
                    "Download as PDF — completely free 🚀",
                    2000,
                    "No sign-up required — start now! 💯",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </div>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground/80 leading-relaxed">
                Choose from professional templates, fill in your details, and download your document in seconds.
                Perfect for job applications, personal use, and official purposes.
              </p>
            </div>
          </FadeInView>

          {/* Stats Row */}
          <FadeInView delay={0.3}>
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:mt-16 sm:gap-6 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.1, y: -6 }}
                  className="group relative rounded-2xl border border-border/50 bg-card/40 p-4 sm:p-5 text-center backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card/70 overflow-hidden"
                  style={{ willChange: "transform" }}
                >
                  {/* Neon glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <motion.div
                    animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 4 + i, delay: i * 0.5 }}
                  >
                    <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary transition-transform group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))]" />
                  </motion.div>
                  <div className="text-3xl font-black text-foreground">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mt-0.5">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeInView>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />
        <div className="container relative z-10">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary"
              >
                <Sparkles className="h-3.5 w-3.5" /> Simple Process
              </motion.div>
              <TextReveal text="How It Works" className="text-3xl font-black text-foreground sm:text-4xl md:text-5xl" />
              <p className="mt-3 text-muted-foreground">Three simple steps to your perfect document</p>
            </div>
          </FadeInView>

          <div ref={stepsRef}>
          <StaggerChildren className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3" direction="up" staggerDelay={0.15}>
            {processSteps.map((step, i) => (
              <motion.div
                key={step.step}
                whileHover={{ y: -10, scale: 1.04 }}
                className="process-step group relative rounded-3xl border border-border/50 bg-card/60 p-7 text-center backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden"
                style={{ willChange: "transform" }}
              >
                {/* Inner glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white font-black text-xl shadow-xl`}
                >
                  {step.step}
                </motion.div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < processSteps.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 md:block z-10">
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <ArrowRight className="h-6 w-6 text-primary/40" />
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </StaggerChildren>
          </div>
        </div>
      </section>

      {/* CV Section Cards */}
      <section className="relative pb-28 overflow-hidden">
        <AuroraBands />
        <div className="container relative z-10">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <TextReveal text="Choose Your Document" className="text-3xl font-black text-foreground sm:text-4xl md:text-5xl" />
              <p className="mt-3 text-muted-foreground">Select the type of document you want to create</p>
            </div>
          </FadeInView>

          <div ref={cardsRef} className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {cvSections.map((section, index) => (
              <FadeInView key={section.title} delay={index * 0.2}>
                <Link to={section.href} className="group block cv-card" style={{ willChange: "transform" }}>
                  <Tilt
                    tiltMaxAngleX={10}
                    tiltMaxAngleY={10}
                    glareEnable={true}
                    glareMaxOpacity={0.2}
                    glareColor="#ffffff"
                    glarePosition="all"
                    glareBorderRadius="24px"
                    scale={1.03}
                    transitionSpeed={350}
                    perspective={1000}
                  >
                    <GlowingBorder
                      glowColor={index === 0 ? "hsl(210 100% 56%)" : "hsl(260 100% 56%)"}
                      animationDuration={3}
                    >
                      <SpotlightCard spotlightColor={section.glowColor}>
                        <div className="relative overflow-hidden rounded-2xl p-8 md:p-10">
                          <div className={`absolute inset-0 bg-gradient-to-br ${section.bgColor} opacity-40`} />
                          {/* Rainbow shimmer overlay on hover */}
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                            style={{
                              background: "linear-gradient(135deg, rgba(255,0,128,0.06) 0%, rgba(99,102,241,0.08) 25%, rgba(6,182,212,0.06) 50%, rgba(16,185,129,0.08) 75%, rgba(245,158,11,0.06) 100%)",
                            }}
                          />
                          {/* Animated shimmer sweep */}
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            style={{
                              background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.08) 50%, transparent 80%)",
                              width: "60%",
                            }}
                          />

                          <div className="relative z-10">
                            {/* Large animated gradient icon area */}
                            <motion.div
                              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.12 }}
                              transition={{ duration: 0.5 }}
                              className={`mb-6 relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${section.color} shadow-2xl`}
                              style={{ boxShadow: `0 8px 32px ${section.glowColor}, 0 0 0 1px rgba(255,255,255,0.1)` }}
                            >
                              <section.icon className="h-10 w-10 text-white drop-shadow-lg" />
                              {/* Icon ring pulse */}
                              <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2.5, ease: "easeOut" }}
                                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${section.color}`}
                              />
                            </motion.div>

                            <div className={`mb-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${section.bgColor} px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70`}>
                              <Star className="h-3 w-3" />
                              {section.subtitle}
                            </div>

                            <h2 className="mb-3 text-3xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{section.title}</h2>
                            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{section.description}</p>

                            <div className="mb-8 grid grid-cols-2 gap-3">
                              {section.features.map((feature, fi) => (
                                <motion.div
                                  key={feature.text}
                                  initial={{ opacity: 0, x: -10 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: fi * 0.06 }}
                                  className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors"
                                >
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 + fi * 0.3, delay: fi * 0.1 }}
                                  >
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                  </motion.div>
                                  {feature.text}
                                </motion.div>
                              ))}
                            </div>

                            <motion.div
                              whileHover={{ x: 6, scale: 1.04, boxShadow: `0 0 30px ${section.glowColor}` }}
                              className={`inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r ${section.color} px-7 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:shadow-2xl`}
                            >
                              Get Started
                              <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                                <ArrowRight className="h-4 w-4" />
                              </motion.div>
                            </motion.div>
                          </div>
                        </div>
                      </SpotlightCard>
                    </GlowingBorder>
                  </Tilt>
                </Link>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-20 md:py-24 border-t border-border/30 overflow-hidden">
        <NeonGrid />
        <div className="container relative z-10">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <TextReveal text="Why Choose Our CV Builder?" className="text-3xl font-black text-foreground sm:text-4xl md:text-5xl" />
              <p className="mt-3 text-muted-foreground">Built with love for students and professionals</p>
            </div>
          </FadeInView>

          <StaggerChildren className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4" direction="up" staggerDelay={0.1}>
            {[
              { icon: Shield, title: "100% Private", desc: "Your data never leaves your browser", color: "text-emerald-500" },
              { icon: Zap, title: "Lightning Fast", desc: "Generate documents in under 3 seconds", color: "text-amber-500" },
              { icon: Download, title: "Free Forever", desc: "No hidden charges, no premium plans", color: "text-blue-500" },
              { icon: Clock, title: "Save Time", desc: "Pre-built templates ready to customize", color: "text-violet-500" },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -8, scale: 1.04 }}
                className="group relative rounded-3xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/70 hover:shadow-xl overflow-hidden"
                style={{ willChange: "transform" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 3 }}>
                  <feature.icon className={`mx-auto mb-3 h-10 w-10 ${feature.color} transition-all`} />
                </motion.div>
                <h3 className="mb-1.5 text-sm font-bold text-foreground">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </Layout>
  );
};

export default CVPage;


