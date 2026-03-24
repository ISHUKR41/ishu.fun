/**
 * HowItWorksSection.tsx — 4-Step Animated Guide
 *
 * How ISHU works in 4 simple steps.
 * Performance: CSS-only backgrounds, zero JS decorative animations.
 * GSAP used only for scroll-triggered card entrance.
 */

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import { Search, Bell, FileText, Trophy, ArrowRight, Sparkles } from "lucide-react";
import FadeInView from "../animations/FadeInView";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search & Discover",
    desc: "Find government exam results, vacancies, admit cards and answer keys from all 36 states and central boards instantly.",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.15)",
    glow: "rgba(59,130,246,0.12)",
  },
  {
    icon: Bell,
    step: "02",
    title: "Get Instant Alerts",
    desc: "Subscribe to WhatsApp notifications for your preferred exams. Never miss a vacancy, result or important deadline again.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.15)",
    glow: "rgba(16,185,129,0.12)",
  },
  {
    icon: FileText,
    step: "03",
    title: "Use Free PDF Tools",
    desc: "Access 100+ professional PDF tools — merge, split, compress, convert, OCR and more. Everything runs in your browser.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.15)",
    glow: "rgba(139,92,246,0.12)",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Achieve Your Goals",
    desc: "Stay ahead with 1000+ daily news articles, expert blogs and preparation guides. Crack your dream government exam!",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.15)",
    glow: "rgba(245,158,11,0.12)",
  },
];

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".how-step-card",
        { y: 55, opacity: 0, scale: 0.92 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
          y: 0, opacity: 1, scale: 1,
          stagger: 0.13, duration: 0.75, ease: "back.out(1.4)", clearProps: "all",
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
      {/* CSS-only backgrounds — no JS animations */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 50% 40% at 10% 50%, rgba(59,130,246,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 90% 50%, rgba(139,92,246,0.03) 0%, transparent 60%)
          `,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.1]" />

      <div className="container relative">
        {/* Section header */}
        <FadeInView>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm backdrop-blur-sm"
            >
              <Sparkles size={13} className="text-primary" />
              <span className="font-semibold text-white/70">How ISHU Works</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-display text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              Simple Steps to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Success
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-4 text-lg text-white/45"
            >
              From discovering results to cracking your exam — ISHU makes it effortless.
            </motion.p>

            <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
        </FadeInView>

        {/* Steps grid */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.step} className="relative">
              {/* Connector arrow (desktop only) */}
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute -right-3 top-14 z-10 hidden xl:flex items-center">
                  <ArrowRight size={18} className="text-white/15" />
                </div>
              )}

              <Tilt
                tiltMaxAngleX={7}
                tiltMaxAngleY={7}
                scale={1.02}
                glareEnable
                glareMaxOpacity={0.06}
                glareColor={step.color}
                glareBorderRadius="1rem"
              >
                <div
                  className="how-step-card group relative h-full overflow-hidden rounded-2xl border p-7 transition-all duration-300"
                  style={{
                    borderColor: step.border,
                    background: "rgba(8,8,16,0.85)",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${step.glow}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                  }}
                >
                  {/* Top accent */}
                  <div
                    className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${step.color}70, transparent)`,
                    }}
                  />

                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(ellipse 70% 60% at 20% 20%, ${step.bg}, transparent)`,
                    }}
                  />

                  {/* Step number + icon row */}
                  <div className="relative mb-5 flex items-start justify-between">
                    <div
                      className="flex h-13 w-13 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                      style={{ background: step.bg, width: 52, height: 52 }}
                    >
                      <step.icon size={24} style={{ color: step.color }} />
                    </div>
                    <span
                      className="font-display text-5xl font-black leading-none opacity-15 transition-opacity duration-300 group-hover:opacity-25"
                      style={{ color: step.color }}
                    >
                      {step.step}
                    </span>
                  </div>

                  <h3 className="relative font-display text-lg font-bold text-white/90">{step.title}</h3>
                  <p className="relative mt-2.5 text-sm leading-relaxed text-white/50">{step.desc}</p>
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
