/**
 * PlatformOverview.tsx — Platform Capabilities Showcase
 *
 * Highlights ISHU's 4 core pillars with animated stat tickers and hover cards.
 * Performance: CSS-only backgrounds, no JS decorative animations.
 */

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import { FileText, Newspaper, GraduationCap, Wrench, ArrowRight, Sparkles, Shield, Globe, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import FadeInView from "../animations/FadeInView";
import NumberTicker from "../animations/NumberTicker";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: GraduationCap,
    title: "Exam Results",
    desc: "Central and state-level government exam results, vacancies, admit cards and answer keys — updated in real-time from official sources.",
    stat: 500, statSuffix: "+", statLabel: "Active Posts",
    href: "/results",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.12)",
    glow: "rgba(59,130,246,0.15)",
  },
  {
    icon: Wrench,
    title: "PDF Tools",
    desc: "Merge, split, compress, convert, OCR and more — 100+ tools that run entirely in your browser. No uploads, no sign-up, 100% free.",
    stat: 100, statSuffix: "+", statLabel: "Free Tools",
    href: "/tools",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.12)",
    glow: "rgba(16,185,129,0.15)",
  },
  {
    icon: Newspaper,
    title: "Live News",
    desc: "1000+ daily articles across 30 categories in 22 Indian languages — government job notifications to education policy updates.",
    stat: 1000, statSuffix: "+", statLabel: "Daily Articles",
    href: "/news",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.12)",
    glow: "rgba(245,158,11,0.15)",
  },
  {
    icon: FileText,
    title: "Expert Blog",
    desc: "Topper strategies, subject-wise guides and success stories — curated by experts who have cracked UPSC, SSC, Banking and more.",
    stat: 50, statSuffix: "+", statLabel: "Expert Guides",
    href: "/blog",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.12)",
    glow: "rgba(139,92,246,0.15)",
  },
];

const PlatformOverview = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pillar-card",
        { y: 55, opacity: 0, scale: 0.93 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" },
          y: 0, opacity: 1, scale: 1,
          stagger: 0.11, duration: 0.75, ease: "back.out(1.4)", clearProps: "all",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 md:py-32">
      {/* CSS-only backgrounds */}
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-[0.08]" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 45% 50% at 80% 30%, rgba(59,130,246,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 45% 50% at 20% 70%, rgba(139,92,246,0.03) 0%, transparent 60%)
          `,
        }}
      />

      <div className="container relative">
        <FadeInView>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm backdrop-blur-sm"
            >
              <Sparkles size={13} className="text-primary" />
              <span className="font-semibold text-white/70">ISHU — Indian StudentHub University</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.07 }}
              className="font-display text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              Everything You Need,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                One Platform
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="mt-4 text-lg text-white/45"
            >
              From exam results to PDF tools to daily news — ISHU is India's most comprehensive platform for government exam aspirants.
            </motion.p>

            <div className="mt-5 flex flex-wrap justify-center gap-4">
              {[
                { icon: Shield, text: "Verified Sources" },
                { icon: Globe, text: "All 36 States" },
                { icon: Zap, text: "Real-time Updates" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-1.5 text-xs text-white/40">
                  <badge.icon size={11} className="text-primary" />
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
        </FadeInView>

        {/* Pillar cards grid */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar) => (
            <Tilt
              key={pillar.title}
              tiltMaxAngleX={7}
              tiltMaxAngleY={7}
              scale={1.02}
              glareEnable
              glareMaxOpacity={0.06}
              glareColor={pillar.color}
              glareBorderRadius="1rem"
            >
              <Link to={pillar.href} className="pillar-card group block h-full">
                <div
                  className="relative h-full overflow-hidden rounded-2xl border p-7 transition-all duration-300"
                  style={{
                    borderColor: pillar.border,
                    background: "rgba(8,8,18,0.85)",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${pillar.glow}`;
                    (e.currentTarget as HTMLElement).style.borderColor = pillar.color + "30";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "";
                    (e.currentTarget as HTMLElement).style.borderColor = pillar.border;
                  }}
                >
                  {/* Top accent on hover */}
                  <div
                    className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, transparent, ${pillar.color}80, transparent)` }}
                  />

                  {/* Hover gradient */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                    style={{ background: `radial-gradient(ellipse 70% 60% at 20% 20%, ${pillar.bg}, transparent)` }}
                  />

                  {/* Icon */}
                  <div
                    className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: pillar.bg }}
                  >
                    <pillar.icon size={22} style={{ color: pillar.color }} />
                  </div>

                  {/* Stat ticker */}
                  <div className="relative mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-black text-white">
                        <NumberTicker value={pillar.stat} />
                      </span>
                      <span className="text-lg font-bold" style={{ color: pillar.color }}>
                        {pillar.statSuffix}
                      </span>
                    </div>
                    <p className="text-xs uppercase tracking-wider text-white/35">{pillar.statLabel}</p>
                  </div>

                  <h3 className="relative font-display text-lg font-bold text-white/90">{pillar.title}</h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-white/50">{pillar.desc}</p>

                  <div
                    className="relative mt-5 flex items-center gap-1 text-sm font-semibold opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:gap-2"
                    style={{ color: pillar.color }}
                  >
                    Explore <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformOverview;
