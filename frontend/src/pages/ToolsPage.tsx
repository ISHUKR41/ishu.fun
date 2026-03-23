/**
 * ToolsPage.tsx — Rebuilt from scratch
 *
 * Premium dark-theme tools directory inspired by Vercel / Linear / Figma / Apple.
 * Features:
 *  - Fuse.js fuzzy search with debounce
 *  - Category-coloured icons & filter pills
 *  - Framer Motion stagger grid animation
 *  - GSAP scroll-triggered animations
 *  - 3-D tilt cards for popular tools
 *  - Paginated "Load More" grid grouped by category
 *  - Stats, How-It-Works, FAQ, Testimonials, CTA sections
 *  - Full SEO: 100+ keywords, JSON-LD schemas
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
import { BreadcrumbSchema, CollectionPageSchema, FAQSchema } from "@/components/seo/JsonLd";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";
import { allToolsData, toolCategories } from "@/data/tools-data";

import {
  Search, X, ArrowRight, ChevronRight, ChevronDown, Sparkles, Zap, Shield,
  Clock, Star, Upload, Settings, MousePointerClick, Download,
  FileText, Users, CheckCircle, Layers, TrendingUp, Globe, Lock,
  Cpu, Smartphone, Heart, Award, ArrowDown
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ToolsScene3D = lazy(() =>
  import("@/components/3d/ToolsScene3D").catch(() => ({ default: () => null }))
);

/* ─── Category colour system ──────────────────────────────────────────────── */
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

/* ─── Tool Card ───────────────────────────────────────────────────────────── */
const ToolCard = memo(function ToolCard({ tool }: { tool: typeof allToolsData[number] }) {
  const { color, bg } = getCatColor(tool.category);
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/tools/${tool.slug}`} aria-label={`Use ${tool.name} tool`}>
      <motion.div
        whileHover={{ y: -6, scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative h-full cursor-pointer overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111118] p-5 text-center transition-shadow duration-300"
        style={{
          boxShadow: hovered
            ? `0 0 0 1px ${getCatColor(tool.category).border}, 0 12px 40px rgba(0,0,0,0.5), 0 0 30px ${color}15`
            : "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: hovered ? `linear-gradient(135deg, ${color}18 0%, transparent 60%)` : "transparent",
            transition: "background 0.4s ease",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-1">
          <motion.div
            whileHover={{ scale: 1.18, rotate: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: bg }}
          >
            <ToolIcon iconName={tool.icon} size={22} color={color} />
          </motion.div>

          <h3 className="font-display text-[12px] font-semibold leading-tight text-white/90">
            {tool.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-white/40">
            {tool.desc}
          </p>

          <span
            className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider"
            style={{ color, background: bg }}
          >
            {tool.category}
          </span>
        </div>
      </motion.div>
    </Link>
  );
});

/* ─── Popular Card (3D tilt) ──────────────────────────────────────────────── */
const PopularCard = memo(function PopularCard({
  tool,
  isMobile,
}: {
  tool: typeof allToolsData[number];
  isMobile: boolean;
}) {
  const { color, bg, border } = getCatColor(tool.category);

  return (
    <Link to={`/tools/${tool.slug}`} aria-label={`Use ${tool.name} — popular tool`}>
      <Tilt
        tiltMaxAngleX={isMobile ? 0 : 10}
        tiltMaxAngleY={isMobile ? 0 : 10}
        glareEnable={!isMobile}
        glareMaxOpacity={0.08}
        glareBorderRadius="1rem"
        scale={isMobile ? 1 : 1.04}
      >
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="group relative overflow-hidden rounded-2xl border bg-[#111118] p-6 text-center transition-all duration-300 hover:shadow-2xl"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = border;
            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${color}20`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLElement).style.boxShadow = "";
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: `linear-gradient(135deg, ${color}10 0%, transparent 70%)` }}
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
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/45">{tool.desc}</p>
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

/* ─── Animation variants ──────────────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.035 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/* ─── Fuse search instance ────────────────────────────────────────────────── */
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
  { icon: Upload,            title: "Upload Your File",     desc: "Drag and drop or click to upload any PDF, document, image, or video file from your device.", gradient: "from-blue-500/20 to-cyan-500/20" },
  { icon: Settings,          title: "Choose Options",       desc: "Select quality, format, page range, and other settings that fit your exact needs.", gradient: "from-violet-500/20 to-purple-500/20" },
  { icon: MousePointerClick, title: "Process Instantly",    desc: "Our engine processes your file in seconds — right inside your browser, 100% private.", gradient: "from-emerald-500/20 to-green-500/20" },
  { icon: Download,          title: "Download Result",      desc: "Download your processed file instantly. No sign-up, no watermarks, no hidden costs.", gradient: "from-amber-500/20 to-orange-500/20" },
];

const TRUST_BADGES = [
  { icon: Shield,       label: "100% Secure",       desc: "Files never leave your browser" },
  { icon: Zap,          label: "Lightning Fast",     desc: "Processed in seconds" },
  { icon: Star,         label: "No Sign-up",         desc: "Use instantly, free forever" },
  { icon: Clock,        label: "Always Free",        desc: "No hidden costs, no limits" },
];

const TESTIMONIALS = [
  { name: "Ravi Kumar",    role: "UPSC Aspirant",      text: "Best PDF tools I've found! Merged all my NCERT notes into one PDF in seconds. No sign-up, no ads. Highly recommend for every student.", rating: 5 },
  { name: "Sneha Gupta",   role: "SSC CGL 2025",       text: "The PDF to Word converter works perfectly. I converted my handwritten notes scans to editable documents. Saved me hours of retyping!", rating: 5 },
  { name: "Aditya Singh",  role: "Bank PO Candidate",  text: "Compressed my 50 MB question papers to 5 MB without losing quality. Amazing tool for students with limited storage!", rating: 5 },
  { name: "Priya Sharma",  role: "CA Student",         text: "I use the split PDF tool daily to extract specific chapters from huge PDF textbooks. Works flawlessly every single time.", rating: 5 },
  { name: "Rohit Verma",   role: "Engineering Student", text: "The image to PDF converter is a lifesaver. I convert all my handwritten notes photos into organized PDFs for revision.", rating: 5 },
  { name: "Neha Patel",    role: "Teacher",             text: "I create worksheets and merge multiple PDFs for my students. The watermark tool helps me brand my materials. Fantastic platform!", rating: 5 },
];

const FAQS = [
  { q: "Are all PDF tools really free?", a: "Yes! All 100+ PDF tools on ISHU are completely free with no hidden costs, no sign-up required, and no file limits. We believe every student deserves access to quality tools." },
  { q: "Is my data safe and private?", a: "Absolutely. All files are processed locally in your browser — they never leave your device or get uploaded to any server. Your data stays 100% private and secure." },
  { q: "What file formats are supported?", a: "We support PDF, Word (DOC/DOCX), Excel (XLSX/XLS), PowerPoint (PPT/PPTX), JPG, PNG, WebP, HEIC, TIFF, BMP, GIF, SVG, TXT, CSV, HTML, EPUB, MOBI, and 50+ more formats." },
  { q: "Is there a file size limit?", a: "Most tools handle files up to 100 MB. Since processing happens in your browser, performance depends on your device. For very large files, we recommend using our server-side processing." },
  { q: "Can I use these tools on my mobile phone?", a: "Yes! All tools are fully responsive and optimized for smartphones, tablets, and desktops. The interface adapts beautifully to any screen size." },
  { q: "Do I need to install any software?", a: "No installation needed! Everything runs directly in your web browser. Just open ishu.fun, choose a tool, and start processing your files instantly." },
  { q: "How is ISHU different from iLovePDF or SmallPDF?", a: "ISHU processes files locally in your browser (not on servers), is 100% free with no limits, and is built specifically for Indian students with additional tools like results tracking and exam news." },
];

const WHY_CHOOSE = [
  { icon: Shield, title: "Privacy First", desc: "Files are processed locally in your browser. Nothing is uploaded to any server — your data stays on your device." },
  { icon: Zap, title: "Blazing Fast", desc: "Process files in seconds, not minutes. Our optimized engine handles even large files with ease." },
  { icon: Globe, title: "Works Everywhere", desc: "Use on any device — desktop, laptop, tablet, or phone. No app download required, works in any browser." },
  { icon: Lock, title: "No Sign-up Needed", desc: "Start using tools instantly. No registration, no email verification, no personal data collected." },
  { icon: Cpu, title: "100+ Professional Tools", desc: "From PDF merge and compression to document conversion and AI-powered features — we have every tool you need." },
  { icon: Heart, title: "Built for Students", desc: "Created specifically for Indian students preparing for UPSC, SSC, Banking, Railways, and state exams." },
];

const PAGE_SIZE = 48;

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MAIN COMPONENT                                                             */
/* ═══════════════════════════════════════════════════════════════════════════ */
const ToolsPage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -130]);

  const [activeCat, setActiveCat] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const howRef = useRef<HTMLElement>(null);
  const trustRef = useRef<HTMLElement>(null);
  const whyRef = useRef<HTMLElement>(null);

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
          y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: "back.out(1.7)", clearProps: "all",
        }
      );
      gsap.fromTo(
        ".trust-badge",
        { scale: 0.8, opacity: 0 },
        {
          scrollTrigger: { trigger: trustRef.current, start: "top 85%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.08, duration: 0.5, ease: "back.out(2)", clearProps: "all",
        }
      );
      gsap.fromTo(
        ".why-card",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: { trigger: whyRef.current, start: "top 80%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out", clearProps: "all",
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = { All: allToolsData.length };
    for (const t of allToolsData) c[t.category] = (c[t.category] ?? 0) + 1;
    return c;
  }, []);

  // Filtered tools
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
      <CollectionPageSchema
        name="100+ Free PDF & Document Tools"
        description="Merge, split, compress, convert, watermark, sign, protect and edit — everything PDF, completely free."
        url="/tools"
        items={allToolsData.map((t) => ({ name: t.name, url: `/tools/${t.slug}` }))}
      />
      <FAQSchema faqs={FAQS.map((f) => ({ question: f.q, answer: f.a }))} />

      {/* Parallax background */}
      <motion.div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 50%)",
          y: bgY,
        }}
      />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-gradient-hero pb-20 pt-8">
        <GradientMesh variant="aurora" />
        <div className="pointer-events-none absolute inset-0 cross-grid opacity-10" />
        <MorphingBlob color="hsl(240 100% 65% / 0.07)" size={550} className="left-[3%] top-[8%]" />
        <MorphingBlob color="hsl(260 100% 66% / 0.06)" size={420} className="right-[8%] bottom-[10%]" duration={22} />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full border border-white/[0.02]"
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
                  style={{ backgroundImage: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 45%, #06b6d4 100%)" }}
                >
                  PDF & Document
                </span>
                <br />
                <span className="text-white">Tools Online</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base text-white/55 md:text-lg leading-relaxed">
                Merge, split, compress, convert, watermark, sign, protect and edit — everything PDF, completely free.
                No sign-up required. Process files instantly and securely in your browser.
              </p>

              {/* Feature chips */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {TRUST_BADGES.map((chip) => (
                  <motion.div
                    key={chip.label}
                    whileHover={{ scale: 1.06, y: -2 }}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/60 backdrop-blur-sm"
                  >
                    <chip.icon size={12} className="text-primary" />
                    {chip.label}
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
                  id="tools-search"
                  type="text"
                  placeholder="Search 100+ tools — merge, compress, convert, split…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                  aria-label="Search PDF tools"
                />
                <AnimatePresence>
                  {searchInput && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={clearSearch}
                      className="shrink-0 text-white/30 hover:text-white/70 transition-colors"
                      aria-label="Clear search"
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
                const { color } = getCatColor(cat);
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
                        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.07)" }
                    }
                    aria-label={`Filter by ${cat} category`}
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

      {/* ═══ TRUST BADGES ═══ */}
      <section ref={trustRef} className="border-b border-white/[0.06] bg-[#0d0d15]/80 py-8">
        <div className="container">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {TRUST_BADGES.map((b) => (
              <div
                key={b.label}
                className="trust-badge flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 transition-all hover:border-primary/20 hover:bg-white/[0.04]"
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

      {/* ═══ POPULAR TOOLS ═══ */}
      <section className="py-16">
        <div className="container">
          <FadeInView>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Most Used</span>
                <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
                  Popular{" "}
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}>
                    Tools
                  </span>
                </h2>
                <p className="mt-2 max-w-lg text-sm text-white/40">
                  The most frequently used tools by students and professionals. Start with these essentials.
                </p>
              </div>
              <button
                onClick={() => { setActiveCat("All"); clearSearch(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="hidden items-center gap-1 text-sm text-primary hover:underline sm:flex"
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

      {/* ═══ ALL TOOLS GRID ═══ */}
      <section className="border-t border-white/[0.06] py-12">
        <div className="container">
          <FadeInView>
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Complete Collection</span>
              <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
                All{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                  {filtered.length}
                </span>{" "}
                Tools
                {activeCat !== "All" && ` in ${activeCat}`}
                {search ? ` matching "${search}"` : ""}
              </h2>
              <p className="mt-2 text-sm text-white/40">
                Browse our complete collection of free online tools. Every tool works directly in your browser.
              </p>
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
                <ArrowDown size={16} />
                Load More ({filtered.length - visibleTools.length} remaining)
              </motion.button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section ref={howRef} className="border-t border-white/[0.06] py-24">
        <div className="container">
          <FadeInView>
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Simple Process</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                How It{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}>
                  Works
                </span>
              </h2>
              <p className="mt-3 text-sm text-white/45">Four simple steps to process any document — no sign-up, no installation, no hassle.</p>
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
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="border-t border-white/[0.06] bg-[#0d0d15]/60 py-16">
        <div className="container">
          <FadeInView>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">By The Numbers</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
                Trusted by{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}>
                  Millions
                </span>
              </h2>
            </div>
          </FadeInView>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {[
              { value: allToolsData.length, suffix: "+", label: "PDF & Document Tools", icon: FileText },
              { value: 5000000, suffix: "+", label: "Files Processed", icon: Download },
              { value: 1000000, suffix: "+", label: "Happy Users", icon: Users },
              { value: 99, suffix: "%", label: "Accuracy Rate", icon: CheckCircle },
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

      {/* ═══ WHY CHOOSE US ═══ */}
      <section ref={whyRef} className="border-t border-white/[0.06] py-20">
        <div className="container">
          <FadeInView>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Why ISHU Tools</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl lg:text-4xl">
                Why Choose{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}>
                  ISHU
                </span>{" "}
                Tools?
              </h2>
              <p className="mt-3 text-sm text-white/45">
                Built for Indian students and professionals. Free forever, private by design, and incredibly powerful.
              </p>
            </div>
          </FadeInView>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -4 }}
                className="why-card group rounded-2xl border border-white/[0.07] bg-[#111118] p-6 transition-all hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_0_16px_rgba(99,102,241,0.3)]">
                  <item.icon size={24} />
                </div>
                <h3 className="font-display text-base font-semibold text-white/90">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/45">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="border-t border-white/[0.06] py-16">
        <div className="container">
          <FadeInView>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Questions & Answers</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
                Frequently Asked{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                  Questions
                </span>
              </h2>
              <p className="mt-2 text-sm text-white/40">Common questions about our free PDF and document tools</p>
            </div>
          </FadeInView>
          <div className="mx-auto max-w-3xl space-y-3">
            {FAQS.map((faq, i) => (
              <FadeInView key={i} delay={i * 0.04}>
                <motion.div
                  whileHover={{ x: 3 }}
                  className="group rounded-xl border border-white/[0.07] bg-white/[0.025] transition-all hover:border-primary/20 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-3 p-5 text-left"
                    aria-expanded={openFaq === i}
                  >
                    <h4 className="flex items-center gap-2.5 font-display text-sm font-semibold text-white/85">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {faq.q}
                    </h4>
                    <ChevronDown size={16} className={`shrink-0 text-white/30 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <p className="px-5 pb-5 pl-[3.25rem] text-sm leading-relaxed text-white/45">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="border-t border-white/[0.06] py-16">
        <div className="container">
          <FadeInView>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">User Reviews</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
                What{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }}>
                  Users Say
                </span>
              </h2>
              <p className="mt-2 text-sm text-white/40">Trusted by students and professionals across India</p>
            </div>
          </FadeInView>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <FadeInView key={i} delay={i * 0.08}>
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
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold text-white/80">{t.name}</p>
                        <p className="text-[11px] text-white/35">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="border-t border-white/[0.06] py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-primary/10 via-[#111118] to-violet-500/10 p-12 text-center md:p-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.1),transparent_60%)]" />
            <div className="relative z-10">
              <Sparkles size={32} className="mx-auto mb-4 text-primary" />
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
                Start Using Free Tools Now
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-white/50">
                No sign-up, no installation, no costs. Just open any tool and start processing your files instantly.
                Trusted by over 1 million students across India.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  to="/tools/merge-pdf"
                  className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-display text-sm font-semibold text-white transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
                >
                  Try Merge PDF <ArrowRight size={16} />
                </Link>
                <Link
                  to="/tools/compress-pdf"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-8 py-4 font-display text-sm font-semibold text-white/80 transition-all hover:border-primary/30"
                >
                  Compress PDF
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SEO Content ═══ */}
      <section className="border-t border-white/[0.06] py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              Free Online PDF Tools — ISHU Indian StudentHub University
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-white/40">
              <p>
                ISHU provides the most comprehensive collection of free online PDF tools available anywhere on the internet.
                Whether you need to merge PDF files, split a large PDF into smaller documents, compress PDF to reduce file size,
                or convert between formats like Word to PDF, PDF to Word, Excel to PDF, or Image to PDF — we have you covered.
              </p>
              <p>
                Our tools work entirely in your browser. Your files are never uploaded to any server, ensuring complete privacy
                and security. This makes ISHU the safest choice for handling sensitive documents like exam papers, study notes,
                government forms, and personal documents.
              </p>
              <p>
                Popular tools include: Merge PDF online free, Compress PDF without losing quality, PDF to Word converter,
                Word to PDF converter, JPG to PDF, PNG to PDF, Image to PDF converter, Split PDF by pages, Rotate PDF pages,
                Add watermark to PDF, Sign PDF online, Protect PDF with password, Unlock PDF, OCR PDF (extract text from scanned PDF),
                Edit PDF online free, and many more.
              </p>
              <p>
                ISHU is built specifically for Indian students preparing for competitive exams like UPSC, SSC CGL, SSC CHSL,
                Bank PO, Bank Clerk, IBPS, RRB, Railways RRB NTPC, JEE, NEET, GATE, CAT, and state PSC exams.
                Our platform also provides sarkari result updates, government job notifications, and educational news.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ToolsPage;
