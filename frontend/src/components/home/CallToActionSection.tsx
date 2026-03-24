/**
 * CallToActionSection.tsx — Final CTA Section
 *
 * Premium call to action with gradient background, trust signals, and stats.
 * Performance: CSS-only background effects — zero JS decorative animations.
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Sparkles, Rocket, Star, Zap, Shield, Globe, Users, FileText, Check,
} from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import MagneticButton from "../animations/MagneticButton";
import FadeInView from "../animations/FadeInView";

gsap.registerPlugin(ScrollTrigger);

const quickStats = [
  { icon: Users, value: "1M+", label: "Students" },
  { icon: FileText, value: "100+", label: "PDF Tools" },
  { icon: Globe, value: "36", label: "States Covered" },
  { icon: Star, value: "4.9", label: "User Rating" },
];

const benefits = [
  "No sign-up or registration required",
  "100% free — no hidden costs ever",
  "Works on all devices and browsers",
  "Updated 24/7 from official sources",
  "WhatsApp alerts within minutes",
  "Privacy-first — files stay on your device",
];

const CallToActionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cta-stat-item",
        { y: 28, opacity: 0, scale: 0.85 },
        {
          scrollTrigger: { trigger: ".cta-stats-row", start: "top 88%", toggleActions: "play none none none" },
          y: 0, opacity: 1, scale: 1,
          stagger: 0.08, duration: 0.55, ease: "back.out(1.7)", clearProps: "all",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28 md:py-36">
      {/* CSS-only multi-layer background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-[#06080f] to-background" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 15% 30%, rgba(59,130,246,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 85% 70%, rgba(139,92,246,0.05) 0%, transparent 60%)
          `,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.08]" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)" }}
      />

      <div className="container relative z-10">
        <FadeInView>
          <div className="mx-auto max-w-4xl">
            {/* Main card */}
            <div
              className="relative overflow-hidden rounded-3xl border border-white/[0.08] px-8 py-14 text-center md:px-16"
              style={{
                background: "rgba(10,10,22,0.9)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 0 80px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Corner glow accents */}
              <div
                className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full blur-[60px]"
                style={{ background: "rgba(99,102,241,0.2)" }}
              />
              <div
                className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full blur-[60px]"
                style={{ background: "rgba(139,92,246,0.15)" }}
              />

              <div className="relative">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-5 py-2 text-sm"
                >
                  <Rocket size={13} className="text-primary" />
                  <span className="font-semibold text-white/75">Start Your Journey Today — It is Free</span>
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1], scale: [1, 1.25, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="h-2 w-2 rounded-full bg-emerald-400"
                  />
                </motion.div>

                {/* Headline */}
                <motion.h2
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: 0.08 }}
                  className="font-display text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  Ready to Ace Your{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Next Exam?
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.16 }}
                  className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/45"
                >
                  Join 1M+ students using ISHU — Indian StudentHub University for exam results, PDF tools, live news, and expert preparation guides. 100% free, forever.
                </motion.p>

                {/* Benefits list */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 grid grid-cols-2 gap-2 text-left sm:grid-cols-3"
                >
                  {benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-sm text-white/50">
                      <Check size={13} className="shrink-0 text-emerald-400" />
                      {b}
                    </div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <MagneticButton>
                    <Link
                      to="/results"
                      className="group relative flex items-center gap-2.5 overflow-hidden rounded-xl px-9 py-4 text-sm font-semibold text-white transition-all duration-300"
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        boxShadow: "0 0 0 0 rgba(99,102,241,0)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow =
                          "0 4px 32px rgba(99,102,241,0.45), 0 0 0 1px rgba(99,102,241,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 rgba(99,102,241,0)";
                      }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                      <Sparkles size={15} className="relative" />
                      <span className="relative">Explore Results</span>
                      <ArrowRight size={14} className="relative transition-transform group-hover:translate-x-1" />
                    </Link>
                  </MagneticButton>

                  <MagneticButton>
                    <Link
                      to="/tools"
                      className="group flex items-center gap-2.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-9 py-4 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                    >
                      <Zap size={14} className="text-primary" />
                      Try PDF Tools — Free
                    </Link>
                  </MagneticButton>
                </div>

                {/* Trust signals */}
                <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/30">
                  <div className="flex items-center gap-1.5">
                    <Shield size={11} className="text-emerald-400" />
                    100% Free
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap size={11} className="text-blue-400" />
                    No Login Required
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe size={11} className="text-violet-400" />
                    All India Coverage
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row below card */}
            <div className="cta-stats-row mt-10 flex flex-wrap items-center justify-center gap-4">
              {quickStats.map((s) => (
                <Tilt
                  key={s.label}
                  tiltMaxAngleX={7}
                  tiltMaxAngleY={7}
                  scale={1.03}
                  glareEnable
                  glareMaxOpacity={0.05}
                  glareBorderRadius="0.75rem"
                >
                  <div className="cta-stat-item flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-4 backdrop-blur-sm transition-all hover:border-primary/25">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <s.icon size={17} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-display text-xl font-black text-white">{s.value}</p>
                      <p className="text-[10px] uppercase tracking-wider text-white/35">{s.label}</p>
                    </div>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default CallToActionSection;
