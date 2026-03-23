/**
 * MarqueeSection.tsx — Infinite Scroll Marquee / Trust Bar
 *
 * A smooth infinite marquee between hero and stats.
 * Shows exam boards, platforms, tools, and trust signals.
 * Zero lag — pure CSS animation, no JS scroll needed.
 */

import { motion } from "framer-motion";

const items1 = [
  { emoji: "🏛️", label: "UPSC" },
  { emoji: "📋", label: "SSC CGL" },
  { emoji: "🏦", label: "Banking" },
  { emoji: "🚂", label: "Railways RRB" },
  { emoji: "🎓", label: "JEE Main" },
  { emoji: "🩺", label: "NEET UG" },
  { emoji: "🌐", label: "State PSC" },
  { emoji: "🛡️", label: "CAPF / NDA" },
  { emoji: "📚", label: "IBPS PO" },
  { emoji: "⚖️", label: "Judiciary" },
  { emoji: "🏫", label: "TET / CTET" },
  { emoji: "🔬", label: "GATE" },
  { emoji: "🏅", label: "CDS" },
  { emoji: "📝", label: "CLAT" },
];

const items2 = [
  { emoji: "📄", label: "Merge PDF" },
  { emoji: "✂️", label: "Split PDF" },
  { emoji: "🔒", label: "Protect PDF" },
  { emoji: "🖼️", label: "PDF to Image" },
  { emoji: "📊", label: "Excel to PDF" },
  { emoji: "📖", label: "Word to PDF" },
  { emoji: "🔍", label: "OCR PDF" },
  { emoji: "💬", label: "Chat with PDF" },
  { emoji: "🎥", label: "YouTube Downloader" },
  { emoji: "📰", label: "Live News" },
  { emoji: "🗺️", label: "All 36 States" },
  { emoji: "🔔", label: "WhatsApp Alerts" },
  { emoji: "🤖", label: "AI Translate" },
  { emoji: "📱", label: "Mobile Ready" },
];

const MarqueeRow = ({
  items,
  direction = "left",
  speed = 35,
}: {
  items: { emoji: string; label: string }[];
  direction?: "left" | "right";
  speed?: number;
}) => {
  const doubled = [...items, ...items];
  const duration = doubled.length * (speed / 10);

  return (
    <div className="relative flex overflow-hidden">
      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
        className="flex shrink-0 gap-3"
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.label}-${i}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/50 transition-all hover:border-white/15 hover:bg-white/[0.06] hover:text-white/75"
          >
            <span className="text-base leading-none">{item.emoji}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const MarqueeSection = () => {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.04] bg-background py-10">
      {/* Subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="flex flex-col gap-3">
        <MarqueeRow items={items1} direction="left" speed={40} />
        <MarqueeRow items={items2} direction="right" speed={35} />
      </div>
    </section>
  );
};

export default MarqueeSection;
