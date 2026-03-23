/**
 * ToolsPage.tsx — Rebuilt from scratch per Engineering Blueprint
 *
 * Premium dark-theme tools directory inspired by Vercel / Linear / Figma.
 * Key features:
 *  - Category-coloured icons (convert=blue, edit=green, organize=amber,
 *    security=red, ai=purple, video=pink)
 *  - Animated gradient-border hover on every card
 *  - Fuse.js fuzzy search with debounce
 *  - Framer Motion stagger animation on the tool grid
 *  - GSAP scroll-triggered animations on How-It-Works & Trust badges
 *  - Popular tools section with 3-D tilt cards
 *  - Paginated "Load More" all-tools grid grouped by category
 *  - Stats, FAQ, Testimonials, CTA sections
 */

import { useState, useMemo, useEffect, useRef, useCallback, memo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";

import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import ToolIcon from "@/components/tools/ToolIcon";
import { BreadcrumbSchema, CollectionPageSchema, ToolFAQSchema } from "@/components/seo/JsonLd";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";
import { allToolsData, toolCategories } from "@/data/tools-data";

import {
  Search, X, ArrowRight, ChevronRight, Sparkles, Zap, Shield,
  Clock, Star, Upload, Settings, MousePointerClick, Download,
  FileText, Users, CheckCircle, Layers, TrendingUp
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ToolsScene3D = lazy(() =>
  import("@/components/3d/ToolsScene3D").catch(() => ({ default: () => null }))
);

// ─── Category colour system (from blueprint) ───────────────────────────────
const CAT_COLORS: Record<string, { color: string; bg: string; border: string; gradient: string }> = {
  "Convert":     { color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.3)",  gradient: "from-blue-500/20 to-blue-600/10" },
  "Edit":        { color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)",  gradient: "from-emerald-500/20 to-emerald-600/10" },
  "Organize":    { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  gradient: "from-amber-500/20 to-amber-600/10" },
  "Security":    { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   gradient: "from-red-500/20 to-red-600/10" },
  "AI & Others": { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.3)",  gradient: "from-violet-500/20 to-violet-600/10" },
  "Video Tools": { color: "#ec4899", bg: "rgba(236,72,153,0.12)",  border: "rgba(236,72,153,0.3)",  gradient: "from-pink-500/20 to-pink-600/10" },
};

function getCatColor(cat: string) {
  return CAT_COLORS[cat] ?? { color: "#6366f1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)", gradient: "from-indigo-500/20 to-indigo-600/10" };
}

// ─── Individual tool card with gradient-border hover ───────────────────────
const ToolCard = memo(function ToolCard({ tool }: { tool: typeof allToolsData[number] }) {
  const { color, bg } = getCatColor(tool.category);
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/tools/${tool.slug}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative h-full cursor-pointer overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111118] p-4 text-center transition-shadow duration-300"
        style={{
          boxShadow: hovered
            ? `0 0 0 1px ${getCatColor(tool.category).border}, 0 8px 32px rgba(0,0,0,0.4), 0 0 24px ${color}22`
            : "0 1px 4px rgba(0,0,0,0.3)",
        }}
      >
        {/* Gradient border overlay on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: hovered
              ? `linear-gradient(135deg, ${color}22 0%, transparent 60%)`
              : "transparent",
            transition: "background 0.3s",
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 6 }}
            className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl transition-all"
            style={{ background: bg }}
          >
            <ToolIcon iconName={tool.icon} size={20} color={color} />
          </motion.div>

          <h3 className="font-display text-[11px] font-semibold leading-tight text-white/90">
            {tool.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-[9.5px] leading-relaxed text-white/40">
            {tool.desc}
          </p>

          <span
            className="mt-2 inline-block rounded-full px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-wide"
            style={{ color, background: bg }}
          >
            {tool.category}
          </span>
        </div>
      </motion.div>
    </Link>
  );
});

// ─── Popular tool card (larger, 3-D tilt) ─────────────────────────────────
const PopularCard = memo(function PopularCard({
  tool,
  isMobile,
}: {
  tool: typeof allToolsData[number];
  isMobile: boolean;
}) {
  const { color, bg, border } = getCatColor(tool.category);

  return (
    <Link to={`/tools/${tool.slug}`}>
      <Tilt
        tiltMaxAngleX={isMobile ? 0 : 9}
        tiltMaxAngleY={isMobile ? 0 : 9}
        glareEnable={!isMobile}
        glareMaxOpacity={0.07}
        glareBorderRadius="1rem"
        scale={isMobile ? 1 : 1.04}
      >
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="group relative overflow-hidden rounded-2xl border bg-[#111118] p-6 text-center transition-all duration-300 hover:shadow-xl"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = border;
            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${color}22`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLElement).style.boxShadow = "";
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: `linear-gradient(135deg, ${color}12 0%, transparent 70%)` }}
          />
          <div className="relative z-10">
            <motion.div
              whileHover={{ scale: 1.2, rotate: 8 }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300"
              style={{ background: bg }}
            >
              <ToolIcon iconName={tool.icon} size={28} color={color} />
            </motion.div>
            <h3 className="font-display text-sm font-semibold text-white/90">{tool.name}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-white/45">{tool.desc}</p>
            <motion.span
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100"
              style={{ color }}
            >
              Use Tool <ArrowRight size={12} />
            </motion.span>
          </div>
        </motion.div>
      </Tilt>
    </Link>
  );
});

// ─── Grid stagger variants ─────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// ─── Fuse instance ─────────────────────────────────────────────────────────
const fuse = new Fuse(allToolsData, {
  keys: ["name", "desc", "category"],
  threshold: 0.35,
  includeScore: true,
});

const POPULAR_NAMES = [
  "Merge PDF", "Compress PDF", "PDF to Word", "Word to PDF",
  "PDF to JPG", "Split PDF", "Sign PDF", "YouTube Downloader",
];

const HOW_IT_WORKS = [
  { icon: Upload,            title: "Upload File",     desc: "Drag & drop or click to upload your PDF, document, or image file.",     gradient: "from-blue-500/20 to-cyan-500/20" },
  { icon: Settings,          title: "Choose Options",  desc: "Select quality, pages, format & other settings suited to your needs.",   gradient: "from-violet-500/20 to-purple-500/20" },
  { icon: MousePointerClick, title: "Process",         desc: "Our engine processes your file instantly — right inside your browser.",  gradient: "from-emerald-500/20 to-green-500/20" },
  { icon: Download,          title: "Download",        desc: "Download your processed file — fast, secure, no sign-up ever needed.", gradient: "from-amber-500/20 to-orange-500/20" },
];

const TRUST_BADGES = [
  { icon: Shield,       label: "100% Secure",     desc: "Files never leave your browser" },
  { icon: Zap,          label: "Lightning Fast",   desc: "Processed in seconds" },
  { icon: Star,         label: "No Sign-up",       desc: "Use instantly, no registration" },
  { icon: Clock,        label: "Always Free",      desc: "No hidden costs ever" },
];

const TESTIMONIALS = [
  { name: "Ravi Kumar",    role: "UPSC Aspirant",      text: "Best PDF tools I've found! Merged all my NCERT notes into one PDF in seconds. No sign-up, no ads.", rating: 5 },
  { name: "Sneha Gupta",   role: "SSC CGL 2025",       text: "The PDF to Word converter works perfectly. I converted my handwritten notes scans to editable documents.", rating: 5 },
  { name: "Aditya Singh",  role: "Bank PO Candidate",  text: "Compressed my 50 MB question papers to 5 MB without losing quality. Amazing tool for students!", rating: 5 },
];

const FAQS = [
  { q: "Are PDF tools really free?",          a: "Yes! All 100+ PDF tools are completely free with no hidden costs, no sign-up required, and no file limits." },
  { q: "Is my data safe?",                    a: "Absolutely. All files are processed locally in your browser — they never leave your device or get uploaded to any server." },
  { q: "What file formats are supported?",    a: "We support PDF, Word (DOCX), Excel (XLSX), PowerPoint (PPTX), JPG, PNG, WebP, HEIC, and many more formats." },
  { q: "Is there a file size limit?",         a: "Most tools work with files up to 100 MB. Since processing happens in your browser, performance depends on your device." },
  { q: "Can I use these tools on mobile?",    a: "Yes! All tools are fully responsive and work perfectly on smartphones, tablets, and desktops." },
];

const PAGE_SIZE = 48;

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const ToolsPage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -130]);

  const [activeCat, setActiveCat] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const howRef  = useRef<HTMLElement>(null);
  const trustRef = useRef<HTMLElement>(null);

  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches,
    []
  );

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 200);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset page on filter change
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [activeCat, search]);

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".how-step",
        { y: 50, opacity: 0 },
        {
          scrollTrigger: { trigger: howRef.current, start: "top 80%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: "back.out(1.7)", clearProps: "all",
        }
      );
      gsap.fromTo(
        ".trust-badge",
        { scale: 0.8, opacity: 0 },
        {
          scrollTrigger: { trigger: trustRef.current, start: "top 85%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, ease: "back.out(2)", clearProps: "all",
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // Pre-compute category counts
  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = { All: allToolsData.length };
    for (const t of allToolsData) c[t.category] = (c[t.category] ?? 0) + 1;
    return c;
  }, []);

  // Filtered tool list
  const filtered = useMemo(() => {
    let items = allToolsData;
    if (activeCat !== "All") items = items.filter((t) => t.category === activeCat);
    if (search.trim()) {
      const hits = fuse.search(search.trim()).map((r) => r.item);
      items = activeCat !== "All" ? hits.filter((t) => t.category === activeCat) : hits;
    }
    return items;
  }, [activeCat, search]);

  const visibleTools = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  const popularTools = useMemo(
    () => allToolsData.filter((t) => POPULAR_NAMES.includes(t.name)),
    []
  );

  const clearSearch = useCallback(() => { setSearchInput(""); setSearch(""); }, []);

  return (
    <Layout>
      <SEOHead {...SEO_DATA.tools} />
      <BreadcrumbSchema items={[{ name: "PDF Tools", url: "/tools" }]} />

      {/* Parallax background */}
      <motion.div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=2074&q=60')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.04,
          mixBlendMode: "luminosity",
          y: bgY,
        }}
      />

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-hero pb-24 pt-10">
        <GradientMesh variant="aurora" />
        <div className="pointer-events-none absolute inset-0 cross-grid opacity-10" />
        <MorphingBlob color="hsl(240 100% 65% / 0.08)" size={600} className="left-[3%] top-[8%]" />
        <MorphingBlob color="hsl(260 100% 66% / 0.07)" size={480} className="right-[8%] bottom-[10%]" duration={22} />

        {/* Slow-rotating orbit ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 70, ease: "linear" }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[900px] w-[900px] rounded-full border border-white/[0.03]"
        />

        <Suspense fallback={null}>
          <ToolsScene3D />
        </Suspense>

        <div className="container relative">
          <FadeInView>
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm backdrop-blur-sm"
              >
                <Layers size={15} className="text-primary" />
                <span className="font-semibold text-white/80">
                  ISHU — Indian StudentHub University ·{" "}
                  <AnimatedCounter target={allToolsData.length} suffix="+ Free Tools" />
                </span>
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="h-2 w-2 rounded-full bg-emerald-400"
                />
              </motion.div>

              {/* Headline */}
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Free{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 45%, #06b6d4 100%)",
                  }}
                >
                  PDF Tools
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base text-white/55 md:text-lg">
                Merge, split, compress, convert — everything PDF, completely free.
                <br className="hidden sm:block" />
                No sign-up required. Process files instantly in your browser.
              </p>

              {/* Feature chips */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {[
                  { icon: Shield, text: "100% Secure" },
                  { icon: Zap,    text: "Lightning Fast" },
                  { icon: Star,   text: "No Sign-up" },
                  { icon: Clock,  text: "Always Free" },
                ].map((chip) => (
                  <motion.div
                    key={chip.text}
                    whileHover={{ scale: 1.06, y: -2 }}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/60 backdrop-blur-sm"
                  >
                    <chip.icon size={12} className="text-primary" />
                    {chip.text}
                  </motion.div>
                ))}
              </div>

              <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            </div>
          </FadeInView>

          {/* Search bar */}
          <FadeInView delay={0.1}>
            <div className="mx-auto mt-10 max-w-xl">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-sm transition-all focus-within:border-primary/40 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.12)]">
                <Search size={18} className="shrink-0 text-white/30" />
                <input
                  type="text"
                  placeholder="Search 100+ tools — merge, compress, convert…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
                <AnimatePresence>
                  {searchInput && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={clearSearch}
                      className="shrink-0 text-white/30 hover:text-white/70 transition-colors"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </FadeInView>

          {/* Category tabs */}
          <FadeInView delay={0.15}>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {toolCategories.map((cat) => {
                const { color, bg, border } = getCatColor(cat);
                const isActive = activeCat === cat;
                return (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCat(cat)}
                    className="rounded-xl px-5 py-2.5 text-sm font-medium transition-all"
                    style={
                      isActive
                        ? { background: cat === "All" ? "#6366f1" : color, color: "#fff", boxShadow: `0 0 16px ${cat === "All" ? "#6366f140" : color + "40"}` }
                        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.55)", border: `1px solid rgba(255,255,255,0.07)` }
                    }
                  >
                    {cat}
                    <span className="ml-1.5 text-[11px] opacity-60">({categoryCounts[cat] ?? 0})</span>
                  </motion.button>
                );
              })}
            </div>
          </FadeInView>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════
          TRUST BADGES
      ═══════════════════════════════════════════════ */}
      <section ref={trustRef} className="border-b border-white/[0.06] bg-[#0d0d15]/80 py-8">
        <div className="container">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {TRUST_BADGES.map((b) => (
              <div
                key={b.label}
                className="trust-badge flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 transition-all hover:border-primary/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <b.icon size={18} />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-white/85">{b.label}</p>
                  <p className="text-[11px] text-white/40">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          POPULAR TOOLS
      ═══════════════════════════════════════════════ */}
      <section className="py-16">
        <div className="container">
          <FadeInView>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Most Used</span>
                <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
                  Popular{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}
                  >
                    Tools
                  </span>
                </h2>
              </div>
              <button
                onClick={() => { setActiveCat("All"); clearSearch(); }}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
          </FadeInView>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
            {popularTools.slice(0, 8).map((tool, i) => (
              <FadeInView key={tool.slug} delay={Math.min(i * 0.05, 0.3)}>
                <PopularCard tool={tool} isMobile={isMobile} />
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          ALL TOOLS GRID
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06] py-12">
        <div className="container">
          <FadeInView>
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Complete Collection</span>
              <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
                All{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                >
                  {filtered.length}
                </span>{" "}
                Tools
                {activeCat !== "All" && ` in ${activeCat}`}
                {search ? ` matching "${search}"` : ""}
              </h2>
            </div>
          </FadeInView>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCat}-${search}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
            >
              {visibleTools.map((tool) => (
                <motion.div key={tool.slug} variants={cardVariants}>
                  <ToolCard tool={tool} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-base text-white/40">No tools found matching your search.</p>
              <button
                onClick={() => { clearSearch(); setActiveCat("All"); }}
                className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Reset Filters
              </button>
            </div>
          )}

          {hasMore && (
            <div className="mt-10 flex flex-col items-center gap-2">
              <p className="text-xs text-white/35">
                Showing {visibleTools.length} of {filtered.length} tools
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-8 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              >
                <ArrowRight size={16} />
                Load More ({filtered.length - visibleTools.length} remaining)
              </motion.button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section ref={howRef} className="border-t border-white/[0.06] py-24">
        <div className="container">
          <FadeInView>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Simple Process</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                How It{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}
                >
                  Works
                </span>
              </h2>
              <p className="mt-3 text-sm text-white/45">Four simple steps to process any document</p>
              <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            </div>
          </FadeInView>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <Tilt
                key={step.title}
                tiltMaxAngleX={isMobile ? 0 : 10}
                tiltMaxAngleY={isMobile ? 0 : 10}
                glareEnable={!isMobile}
                glareMaxOpacity={0.06}
                glareBorderRadius="1rem"
                scale={isMobile ? 1 : 1.03}
              >
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className={`how-step group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111118] p-8 text-center transition-all hover:border-primary/25 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                  <div className="relative z-10">
                    <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                      {i + 1}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 6 }}
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    >
                      <step.icon size={30} />
                    </motion.div>
                    <h3 className="font-display text-base font-semibold text-white/90">{step.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/45">{step.desc}</p>
                  </div>
                </motion.div>
              </Tilt>
            ))}
          </div>

          <div className="mt-8 hidden items-center justify-center gap-16 lg:flex">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.35 }}
                className="text-primary/30"
              >
                <ArrowRight size={22} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06] bg-[#0d0d15]/60 py-16">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {[
              { value: allToolsData.length, suffix: "+", label: "PDF Tools",       icon: FileText   },
              { value: 5000000,             suffix: "+", label: "Files Processed", icon: Download   },
              { value: 1000000,             suffix: "+", label: "Happy Users",     icon: Users      },
              { value: 99,                  suffix: "%", label: "Accuracy Rate",   icon: CheckCircle },
            ].map((s) => (
              <Tilt
                key={s.label}
                tiltMaxAngleX={isMobile ? 0 : 12}
                tiltMaxAngleY={isMobile ? 0 : 12}
                glareEnable={!isMobile}
                glareMaxOpacity={0.06}
                glareBorderRadius="1rem"
                scale={isMobile ? 1 : 1.02}
              >
                <div className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 text-center transition-all hover:shadow-[0_0_24px_rgba(99,102,241,0.15)]">
                  <s.icon size={22} className="mx-auto mb-3 text-primary" />
                  <div
                    className="font-display text-3xl font-extrabold md:text-4xl bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}
                  >
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </div>
                  <p className="mt-1 text-xs font-medium text-white/45">{s.label}</p>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06] py-16">
        <div className="container">
          <FadeInView>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                Frequently Asked{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                >
                  Questions
                </span>
              </h2>
              <p className="mt-2 text-sm text-white/40">Common questions about our PDF tools</p>
            </div>
          </FadeInView>
          <div className="mx-auto max-w-3xl space-y-3">
            {FAQS.map((faq, i) => (
              <FadeInView key={i} delay={i * 0.05}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="group rounded-xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all hover:border-primary/20"
                >
                  <h4 className="flex items-center gap-2.5 font-display text-sm font-semibold text-white/85">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {faq.q}
                  </h4>
                  <p className="mt-2 pl-8 text-sm leading-relaxed text-white/45">{faq.a}</p>
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06] py-16">
        <div className="container">
          <FadeInView>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">User Reviews</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
                What{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}
                >
                  Users Say
                </span>
              </h2>
            </div>
          </FadeInView>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <Tilt
                  tiltMaxAngleX={isMobile ? 0 : 6}
                  tiltMaxAngleY={isMobile ? 0 : 6}
                  glareEnable={!isMobile}
                  glareMaxOpacity={0.05}
                  glareBorderRadius="1rem"
                  scale={isMobile ? 1 : 1.02}
                >
                  <div className="rounded-2xl border border-white/[0.07] bg-[#111118] p-6 transition-all hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    <div className="mb-3 flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} size={13} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm italic leading-relaxed text-white/50">"{t.text}"</p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                        {t.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold text-white/85">{t.name}</p>
                        <p className="text-xs text-white/40">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.06] py-24">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-xl text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 shadow-[0_0_30px_rgba(99,102,241,0.25)]"
              >
                <Zap size={38} className="text-primary" />
              </motion.div>

              <h2 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                Ready to{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}
                >
                  Get Started?
                </span>
              </h2>
              <p className="mt-4 text-base text-white/45">
                No registration needed. Pick a tool and start processing your files instantly.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-display text-sm font-semibold text-white shadow-[0_0_24px_rgba(99,102,241,0.3)] transition-all hover:opacity-90"
                >
                  <Sparkles size={16} />
                  Browse All Tools
                  <ArrowRight size={14} />
                </motion.button>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* SEO Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Free PDF Tools — ISHU",
            description: "100+ free PDF tools: merge, split, compress, convert, edit, sign, protect & more.",
            url: "https://ishu.fun/tools",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home",      item: "https://ishu.fun/" },
                { "@type": "ListItem", position: 2, name: "PDF Tools", item: "https://ishu.fun/tools" },
              ],
            },
          }),
        }}
      />
      <CollectionPageSchema
        name="100+ Free PDF & Document Tools — ISHU"
        description="India's largest collection of free online PDF tools."
        url="https://ishu.fun/tools"
        items={allToolsData.slice(0, 20).map((t) => ({ name: t.name, url: `https://ishu.fun/tools/${t.slug}` }))}
      />
      <ToolFAQSchema toolName="PDF Tools Collection" toolType="pdf" />
    </Layout>
  );
};

export default ToolsPage;
