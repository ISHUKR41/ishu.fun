/**
 * WhyChooseUs.tsx — Trust Signals & Value Proposition Section
 *
 * Shows why ISHU beats all alternatives with:
 *  - 6 value-prop cards (CSS-only backgrounds, no JS orbs)
 *  - Comparison table (ISHU vs iLovePDF vs Jagran Josh vs SarkariResult)
 *  - Trust stats row
 *
 * Performance: CSS-only backgrounds — zero JS for decorative elements.
 */

import { motion } from "framer-motion";
import FadeInView from "../animations/FadeInView";
import GlowingText from "../animations/GlowingText";
import {
  Globe, Award, Zap, Shield, Smartphone, Clock,
  CheckCircle, TrendingUp, Star, Users, Sparkles, X,
} from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  {
    icon: Globe, title: "Pan-India Coverage",
    desc: "All 28 States + 8 Union Territories covered with dedicated pages for each region.",
    color: "#3b82f6", bg: "rgba(59,130,246,0.08)",
  },
  {
    icon: Award, title: "Verified Information",
    desc: "Every result and vacancy is verified directly from official government sources.",
    color: "#f59e0b", bg: "rgba(245,158,11,0.08)",
  },
  {
    icon: Zap, title: "Instant Updates",
    desc: "Get notified within minutes of any new vacancy or exam result announcement.",
    color: "#10b981", bg: "rgba(16,185,129,0.08)",
  },
  {
    icon: Shield, title: "100% Free & Secure",
    desc: "All tools and features are completely free. No sign-up, no hidden costs, ever.",
    color: "#8b5cf6", bg: "rgba(139,92,246,0.08)",
  },
  {
    icon: Smartphone, title: "Mobile Optimized",
    desc: "Perfect experience on every device — phone, tablet or desktop. Any browser.",
    color: "#f43f5e", bg: "rgba(244,63,94,0.08)",
  },
  {
    icon: Clock, title: "24/7 Availability",
    desc: "Access results, tools and news anytime, anywhere — 99.9% uptime guaranteed.",
    color: "#06b6d4", bg: "rgba(6,182,212,0.08)",
  },
];

const trustStats = [
  { icon: Users, value: "1M+", label: "Students Trust Us" },
  { icon: Star, value: "4.9/5", label: "User Rating" },
  { icon: TrendingUp, value: "99.9%", label: "Uptime Record" },
  { icon: CheckCircle, value: "50K+", label: "Results Delivered" },
];

const comparison = {
  features: [
    "100% Free — No limits",
    "No sign-up required",
    "Exam results & sarkari naukri",
    "100+ PDF tools",
    "Live TV (700+ channels)",
    "Video downloader",
    "Resume & Biodata maker",
    "Daily news (1000+/day)",
    "WhatsApp instant alerts",
    "Works on all devices",
  ],
  platforms: [
    { name: "ISHU", highlight: true },
    { name: "iLovePDF", highlight: false },
    { name: "Jagran Josh", highlight: false },
    { name: "SarkariResult", highlight: false },
  ],
  matrix: [
    [true, false, false, false],
    [true, false, false, false],
    [true, false, true, true],
    [true, true, false, false],
    [true, false, false, false],
    [true, false, false, false],
    [true, false, false, false],
    [true, false, true, false],
    [true, false, false, false],
    [true, true, true, true],
  ],
};

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".why-card",
        { y: 50, opacity: 0 },
        {
          scrollTrigger: { trigger: ".why-grid", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.07, duration: 0.6, ease: "power3.out", clearProps: "all",
        }
      );
      gsap.fromTo(
        ".trust-stat",
        { scale: 0.8, opacity: 0 },
        {
          scrollTrigger: { trigger: ".trust-row", start: "top 85%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.09, duration: 0.45, ease: "back.out(1.7)", clearProps: "all",
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/60 to-background" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 50% 50% at 15% 50%, rgba(99,102,241,0.06) 0%, transparent 65%),
                            radial-gradient(ellipse 45% 45% at 85% 50%, rgba(139,92,246,0.05) 0%, transparent 65%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-floating-dots opacity-20" />

      <div className="container relative z-10">

        {/* ── Section header ── */}
        <FadeInView>
          <div className="mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-white/50"
            >
              <Sparkles size={13} className="text-primary" />
              <span className="font-medium">Why ISHU?</span>
            </motion.div>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl" style={{ letterSpacing: "-0.025em" }}>
              Built for India's{" "}
              <GlowingText text="Aspirants" className="text-gradient" />
            </h2>
            <p className="mt-4 text-lg text-white/45">
              Trusted by millions of students across India for accurate, timely updates.
            </p>
            <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
        </FadeInView>

        {/* ── Trust stats bar ── */}
        <div className="trust-row mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {trustStats.map((s) => (
            <div
              key={s.label}
              className="trust-stat flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-3 backdrop-blur-sm"
            >
              <s.icon size={17} className="text-primary" />
              <div>
                <p className="font-display text-lg font-bold text-white">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/40">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Cards grid ── */}
        <div className="why-grid mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <Tilt
              key={item.title}
              tiltMaxAngleX={7}
              tiltMaxAngleY={7}
              glareEnable
              glareMaxOpacity={0.05}
              glareColor={item.color}
              glarePosition="all"
              glareBorderRadius="1rem"
              scale={1.02}
              transitionSpeed={400}
            >
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="why-card group relative flex gap-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080810]/80 p-6 transition-all duration-300 hover:border-white/[0.14]"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${item.color}20`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "";
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                  style={{ background: `radial-gradient(ellipse 70% 60% at 10% 10%, ${item.bg}, transparent)` }}
                />
                <div
                  className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                  style={{ background: item.bg }}
                >
                  <item.icon size={22} style={{ color: item.color }} />
                </div>
                <div className="relative">
                  <h3 className="font-display text-base font-bold text-white/90">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/50">{item.desc}</p>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>

        {/* ── Comparison table ── */}
        <FadeInView delay={0.1}>
          <div className="mt-24">
            <div className="mx-auto max-w-xl text-center">
              <h3 className="font-display text-2xl font-black text-white md:text-3xl" style={{ letterSpacing: "-0.02em" }}>
                How we compare
              </h3>
              <p className="mt-3 text-white/40">ISHU vs other platforms Indian students use</p>
            </div>

            <div className="mt-10 overflow-x-auto">
              <table className="mx-auto w-full max-w-4xl border-collapse">
                <thead>
                  <tr>
                    <th className="py-4 pr-4 text-left text-sm font-semibold text-white/40 w-56" />
                    {comparison.platforms.map((p) => (
                      <th
                        key={p.name}
                        className="px-4 py-4 text-center text-sm font-bold"
                        style={{ color: p.highlight ? "#6366f1" : "rgba(255,255,255,0.5)" }}
                      >
                        {p.highlight ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1 text-primary">
                            {p.name}
                            <Star size={10} className="fill-primary text-primary" />
                          </span>
                        ) : (
                          p.name
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.features.map((feat, fi) => (
                    <tr
                      key={feat}
                      className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="py-3.5 pr-4 text-sm text-white/55 font-medium">{feat}</td>
                      {comparison.matrix[fi].map((has, pi) => (
                        <td key={pi} className="px-4 py-3.5 text-center">
                          {has ? (
                            <CheckCircle
                              size={17}
                              style={{ color: comparison.platforms[pi].highlight ? "#6366f1" : "#10b981" }}
                              className="mx-auto"
                            />
                          ) : (
                            <X size={15} className="mx-auto text-white/15" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default WhyChooseUs;
