/**
 * ProductShowcase.tsx — Product Features Showcase
 *
 * A clean, horizontal-scrolling feature spotlight inspired by Apple, Stripe and Linear.
 * Shows 3 core platform pillars with animated stats and clean layout.
 * Zero JavaScript animations on mobile — CSS-only for performance.
 */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { FileText, Trophy, Tv, ArrowRight, Check } from "lucide-react";

const pillars = [
  {
    number: "100+",
    label: "PDF & Document Tools",
    icon: FileText,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.15)",
    glow: "rgba(59,130,246,0.12)",
    description:
      "The most complete free PDF toolkit in India. Merge, split, compress, convert, edit, sign, protect — all in your browser with zero uploads needed.",
    points: [
      "Merge multiple PDFs into one file",
      "Compress PDF without quality loss",
      "Convert Word, Excel, PPT to PDF",
      "OCR — extract text from scanned PDFs",
      "AI Chat with PDF — ask questions",
      "Sign, watermark and protect PDFs",
    ],
    cta: "Try PDF Tools",
    href: "/tools",
  },
  {
    number: "50K+",
    label: "Government Exam Results",
    icon: Trophy,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.15)",
    glow: "rgba(245,158,11,0.12)",
    description:
      "India's most comprehensive sarkari result platform. Track results for every central and state exam across all 36 states and union territories.",
    points: [
      "UPSC, SSC, Banking, Railways results",
      "All 36 states and union territories",
      "Admit cards and answer keys",
      "WhatsApp instant notifications",
      "Vacancy alerts and job notifications",
      "Real-time updates from official sources",
    ],
    cta: "Check Results",
    href: "/results",
  },
  {
    number: "700+",
    label: "Live Indian TV Channels",
    icon: Tv,
    color: "#ec4899",
    bg: "rgba(236,72,153,0.08)",
    border: "rgba(236,72,153,0.15)",
    glow: "rgba(236,72,153,0.12)",
    description:
      "Watch 700+ Indian TV channels live and free — news, entertainment, sports, movies, and regional channels. No app, no sign-up, no payment.",
    points: [
      "Aaj Tak, NDTV, Republic TV live",
      "Star Plus, Zee TV, Sony, Colors",
      "Star Sports, Sony Six live cricket",
      "Tamil, Telugu, Bangla, Marathi TV",
      "DD National and all Doordarshan",
      "No buffering, HD quality streaming",
    ],
    cta: "Watch Live TV",
    href: "/tv",
  },
];

const PillarCard = ({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[number];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border"
      style={{
        borderColor: pillar.border,
        background: "rgba(8,8,16,0.8)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Top gradient accent */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${pillar.color}60, transparent)`,
        }}
      />

      {/* Glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 60px ${pillar.glow}`,
        }}
      />

      <div className="flex flex-col gap-6 p-8 md:p-10">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: pillar.bg }}
            >
              <pillar.icon size={28} style={{ color: pillar.color }} />
            </div>
            <div className="mt-4">
              <span
                className="font-display text-4xl font-black md:text-5xl"
                style={{ color: pillar.color }}
              >
                {pillar.number}
              </span>
              <p className="mt-1 text-sm font-medium text-white/50">{pillar.label}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-base leading-relaxed text-white/60">{pillar.description}</p>

        {/* Feature list */}
        <ul className="flex flex-col gap-2.5">
          {pillar.points.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-sm text-white/55">
              <Check size={14} style={{ color: pillar.color }} className="shrink-0" />
              {point}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          to={pillar.href}
          className="group/btn mt-auto flex items-center gap-2 text-sm font-semibold transition-all"
          style={{ color: pillar.color }}
        >
          {pillar.cta}
          <ArrowRight
            size={15}
            className="transition-transform duration-300 group-hover/btn:translate-x-1"
          />
        </Link>
      </div>
    </motion.div>
  );
};

const ProductShowcase = () => {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)`,
        }}
      />

      <div className="container relative">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/50"
          >
            Everything in One Place
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-5 font-display text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            One platform.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Infinite value.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.14 }}
            className="mt-5 text-lg leading-relaxed text-white/45"
          >
            PDF tools, exam results, live TV, news, resume builder, video downloader —
            everything an Indian student needs, completely free.
          </motion.p>
        </div>

        {/* Pillar cards */}
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.label} pillar={pillar} index={i} />
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 border-t border-white/[0.06] pt-16"
        >
          {[
            { value: "1M+", label: "Monthly Users" },
            { value: "100%", label: "Free Forever" },
            { value: "0", label: "Sign-up Required" },
            { value: "36", label: "States Covered" },
            { value: "4.9/5", label: "User Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl font-black text-white md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/35">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
