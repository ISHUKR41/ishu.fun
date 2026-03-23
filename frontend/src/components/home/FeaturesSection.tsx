/**
 * FeaturesSection.tsx — Platform Features Showcase
 *
 * 6 core features displayed in a responsive grid.
 * CSS-only background effects for performance (no JS orbs).
 * GSAP scroll entrance only on heading (minimal JS).
 */

import { motion } from "framer-motion";
import FadeInView from "../animations/FadeInView";
import { FileText, Wrench, Newspaper, BookOpen, Bell, Shield, ArrowRight, Check } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: FileText, title: "Government Results",
    description: "Central & State exam results, admit cards, answer keys for UPSC, SSC, Banking, Railways, NTA & all state exams.",
    highlights: ["Real-time updates", "All 36 states", "Official sources only"],
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.12)",
    glow: "rgba(59,130,246,0.15)",
    link: "/results",
  },
  {
    icon: Wrench, title: "100+ PDF Tools",
    description: "Merge, split, compress, convert — the most complete free PDF toolkit in India. Works entirely in your browser.",
    highlights: ["No uploads needed", "100% browser-based", "Completely free"],
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.12)",
    glow: "rgba(16,185,129,0.15)",
    link: "/tools",
  },
  {
    icon: Newspaper, title: "Live News Feed",
    description: "1000+ news articles daily across government jobs, education, politics and more. Multi-language with auto-translation.",
    highlights: ["30+ categories", "22+ languages", "Real-time updates"],
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.12)",
    glow: "rgba(245,158,11,0.15)",
    link: "/news",
  },
  {
    icon: BookOpen, title: "Expert Blog",
    description: "In-depth exam guides, preparation tips, syllabus analysis and success stories from UPSC, SSC & banking toppers.",
    highlights: ["Topper strategies", "Free study plans", "Verified guides"],
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.12)",
    glow: "rgba(139,92,246,0.15)",
    link: "/blog",
  },
  {
    icon: Bell, title: "WhatsApp Alerts",
    description: "Get instant WhatsApp notifications for new vacancies, results and admit cards. Never miss a deadline again.",
    highlights: ["Instant delivery", "Fully customizable", "Free forever"],
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.12)",
    glow: "rgba(34,197,94,0.15)",
    link: "/contact",
  },
  {
    icon: Shield, title: "All 36 States & UTs",
    description: "Complete coverage of every Indian state and union territory — state PSC, police, teacher and district-level exams.",
    highlights: ["State-wise pages", "Local exam alerts", "UT coverage"],
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.08)",
    border: "rgba(244,63,94,0.12)",
    glow: "rgba(244,63,94,0.15)",
    link: "/results",
  },
];

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) => (
  <FadeInView delay={index * 0.07}>
    <Tilt
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      glareEnable
      glareMaxOpacity={0.05}
      glareColor={feature.color}
      glarePosition="all"
      glareBorderRadius="1rem"
      scale={1.02}
      transitionSpeed={400}
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 transition-all duration-400"
        style={{
          borderColor: feature.border,
          background: "rgba(8,8,16,0.85)",
          backdropFilter: "blur(8px)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${feature.glow}`;
          (e.currentTarget as HTMLElement).style.borderColor = feature.color + "30";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "";
          (e.currentTarget as HTMLElement).style.borderColor = feature.border;
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, transparent, ${feature.color}80, transparent)` }}
        />

        {/* Hover gradient fill */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
          style={{ background: `radial-gradient(ellipse 80% 60% at 20% 20%, ${feature.bg}, transparent)` }}
        />

        <div className="relative flex flex-col gap-4">
          {/* Icon */}
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
            style={{ background: feature.bg }}
          >
            <feature.icon size={24} style={{ color: feature.color }} />
          </div>

          {/* Title & description */}
          <div>
            <h3 className="font-display text-lg font-bold text-white/90">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/50">{feature.description}</p>
          </div>

          {/* Highlights */}
          <ul className="flex flex-col gap-1.5">
            {feature.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-xs text-white/45">
                <Check size={11} style={{ color: feature.color }} className="shrink-0" />
                {h}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            to={feature.link}
            className="mt-auto flex items-center gap-1.5 text-xs font-semibold opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:gap-2"
            style={{ color: feature.color }}
          >
            Explore <ArrowRight size={12} />
          </Link>
        </div>
      </motion.div>
    </Tilt>
  </FadeInView>
);

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".features-heading",
        { y: 50, opacity: 0 },
        {
          scrollTrigger: { trigger: ".features-heading", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 0.9, ease: "power4.out", clearProps: "all",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-28 md:py-36"
    >
      {/* CSS-only background — no JS motion */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/40 to-background" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 55% 40% at 20% 30%, rgba(99,102,241,0.05) 0%, transparent 60%),
                            radial-gradient(ellipse 45% 35% at 80% 70%, rgba(139,92,246,0.04) 0%, transparent 60%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" />

      <div className="container relative z-10">
        {/* Heading */}
        <div className="features-heading mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/50"
          >
            Everything You Need
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-5 font-display text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            One Platform.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Infinite Possibilities.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-5 text-lg leading-relaxed text-white/45"
          >
            From exam results to PDF tools — we have got every Indian student covered.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-5 h-px w-24 origin-left"
            style={{ background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }}
          />
        </div>

        {/* Cards grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
