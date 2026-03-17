/**
 * ToolsPage.tsx - 100+ Free PDF Tools Directory (512 lines)
 * 
 * Displays all available PDF tools organized by category.
 * Users can search, filter, and navigate to individual tool pages.
 * 
 * Features:
 * - Hero section with 3D ToolsScene background (lazy loaded)
 * - Fuzzy search with Fuse.js for finding tools
 * - Category tabs (Convert, Edit, Organize, Security, OCR, AI)
 * - Popular tools carousel
 * - Tool cards with icons and descriptions
 * - Animated counters for stats (100+ tools, 1M+ users)
 * - GSAP scroll-triggered animations
 * - 3D tilt effects on tool cards
 * - SEO: BreadcrumbSchema
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import { motion } from "framer-motion";
import { useState, useMemo, lazy, Suspense, useEffect, useRef } from "react";
import { Search, ArrowRight, Sparkles, X, Zap, Shield, Clock, Download, Star, CheckCircle, Users, FileText, Upload, MousePointerClick, Settings, ChevronRight, Award, TrendingUp, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { allToolsData, toolCategories } from "@/data/tools-data";
import ToolIcon from "@/components/tools/ToolIcon";
import toolsHero from "@/assets/tools-hero.jpg";
import Fuse from "fuse.js";

import Tilt from "react-parallax-tilt";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

gsap.registerPlugin(ScrollTrigger);

// Lazy load 3D scene with error fallback to prevent blank screen on import failure
const ToolsScene3D = lazy(() => import("@/components/3d/ToolsScene3D").catch(() => ({ default: () => null })));

// Fuse instance is created at module level using the static allToolsData (never changes)
const fuse = new Fuse(allToolsData, {
  keys: ["name", "desc", "category"],
  threshold: 0.35,
  includeScore: true,
});

const popularTools = ["Merge PDF", "Compress PDF", "PDF to Word", "Word to PDF", "PDF to JPG", "Split PDF", "Edit PDF", "Sign PDF"];

const howItWorks = [
  { icon: Upload, title: "Upload File", desc: "Drag & drop or click to upload your PDF or document file.", color: "from-blue-500/20 to-cyan-500/20" },
  { icon: Settings, title: "Choose Options", desc: "Select your preferred settings — quality, pages, format & more.", color: "from-violet-500/20 to-purple-500/20" },
  { icon: MousePointerClick, title: "Process", desc: "Our engine processes your file instantly, right in the browser.", color: "from-emerald-500/20 to-green-500/20" },
  { icon: Download, title: "Download", desc: "Download your processed file — fast, secure, no sign-up needed.", color: "from-amber-500/20 to-orange-500/20" },
];

const trustBadges = [
  { icon: Shield, label: "100% Secure", desc: "Files never leave your browser" },
  { icon: Zap, label: "Lightning Fast", desc: "Processed in seconds" },
  { icon: Star, label: "No Sign-up", desc: "Use instantly, no registration" },
  { icon: Clock, label: "Always Free", desc: "No hidden costs ever" },
];

const ToolsPage = () => {
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const howRef = useRef<HTMLElement>(null);
  const trustRef = useRef<HTMLElement>(null);
  // Disable tilt on touch/mobile devices for better performance
  const isMobile = useMemo(() => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".how-step",
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: howRef.current, start: "top 80%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.15, duration: 0.7, ease: "back.out(1.7)", clearProps: "all" }
      );
      gsap.fromTo(".trust-badge",
        { scale: 0.8, opacity: 0 },
        { scrollTrigger: { trigger: trustRef.current, start: "top 85%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, ease: "back.out(2)", clearProps: "all" }
      );
    });
    return () => ctx.revert();
  }, []);

  const filtered = useMemo(() => {
    let items = allToolsData;
    if (activeCat !== "All") {
      items = items.filter(t => t.category === activeCat);
    }
    if (search.trim()) {
      // Use the module-level fuse for full search, then filter by category if needed
      const results = fuse.search(search.trim());
      const matchedItems = results.map(r => r.item);
      items = activeCat !== "All" ? matchedItems.filter(t => t.category === activeCat) : matchedItems;
    }
    return items;
  }, [activeCat, search]);

  const popularFiltered = allToolsData.filter(t => popularTools.includes(t.name));

  return (
    <Layout>
      <BreadcrumbSchema items={[{ name: "PDF Tools", url: "/tools" }]} />

      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-28 overflow-hidden">
        <img src={toolsHero} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15" loading="eager" />
        <GradientMesh variant="aurora" />
        <div className="pointer-events-none absolute inset-0 cross-grid opacity-15" />
        <MorphingBlob color="hsl(210 100% 56% / 0.1)" size={550} className="left-[5%] top-[10%]" />
        <MorphingBlob color="hsl(260 100% 66% / 0.08)" size={450} className="right-[10%] bottom-[15%]" duration={22} />
        
        {/* Animated accent */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/5"
        />
        
        <Suspense fallback={null}>
          <ToolsScene3D />
        </Suspense>
        
        <div className="container relative">
          <FadeInView>
            <div className="mx-auto max-w-3xl text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm"
              >
                <Layers size={16} className="text-primary" />
                <span className="font-semibold text-foreground">
                  <strong>ISHU</strong> — Indian StudentHub University · <AnimatedCounter target={allToolsData.length} suffix="+ Tools" /> Available
                </span>
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="h-2 w-2 rounded-full bg-success"
                />
              </motion.div>
              
              <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                Free <span className="text-shimmer">PDF Tools</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                Merge, split, compress, convert — everything PDF, completely free. 
                <br className="hidden sm:block" />
                No sign-up required. Process files instantly in your browser.
              </p>
              
              {/* Feature chips */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {[
                  { icon: Shield, text: "100% Secure" },
                  { icon: Zap, text: "Lightning Fast" },
                  { icon: Star, text: "No Sign-up" },
                  { icon: Clock, text: "Always Free" },
                ].map((chip) => (
                  <motion.div 
                    key={chip.text}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-xs font-medium text-muted-foreground"
                  >
                    <chip.icon size={12} className="text-primary" />
                    {chip.text}
                  </motion.div>
                ))}
              </div>
              
              <div className="mx-auto mt-6 gradient-line w-32" />
            </div>
          </FadeInView>

          <FadeInView delay={0.1}>
            <div className="mx-auto mt-10 max-w-xl">
              <div className="flex items-center gap-3 rounded-2xl border border-border glass-ultra px-5 py-4 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
                <Search size={20} className="text-muted-foreground" />
                <input type="text" placeholder="Search tools... (e.g., merge, compress, convert)" value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none" />
                {search && (
                  <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </FadeInView>

          <FadeInView delay={0.15}>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {toolCategories.map((cat) => (
                <motion.button key={cat} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCat(cat)}
                  className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
                    activeCat === cat ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary/80 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}>
                  {cat}
                  <span className="ml-2 text-xs opacity-60">
                    ({cat === "All" ? allToolsData.length : allToolsData.filter(t => t.category === cat).length})
                  </span>
                </motion.button>
              ))}
            </div>
          </FadeInView>
        </div>
        
        {/* Bottom gradient */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Trust Badges */}
      <section ref={trustRef} className="border-b border-border bg-card/50 py-8">
        <div className="container">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">
            {trustBadges.map((b) => (
              <div key={b.label} className="trust-badge flex items-center gap-2 sm:gap-3 rounded-xl border border-border bg-card p-3 sm:p-4 transition-all hover:border-primary/20">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <b.icon size={20} />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">{b.label}</p>
                  <p className="text-[11px] text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-14 aurora-bg">
        <div className="container">
          <FadeInView>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Most Used</span>
                <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
                  Popular <span className="text-gradient">Tools</span>
                </h2>
              </div>
              <button onClick={() => { setActiveCat("All"); setSearch(""); }} className="flex items-center gap-1 text-sm text-primary hover:underline">
                View All <ChevronRight size={14} />
              </button>
            </div>
          </FadeInView>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">
            {popularFiltered.slice(0, 8).map((tool, i) => (
              <FadeInView key={tool.slug} delay={Math.min(i * 0.05, 0.3)}>
                <Link to={`/tools/${tool.slug}`}>
                  <Tilt tiltMaxAngleX={isMobile ? 0 : 8} tiltMaxAngleY={isMobile ? 0 : 8} glareEnable={!isMobile} glareMaxOpacity={0.06} glareBorderRadius="1rem" scale={isMobile ? 1 : 1.03}>
                    <motion.div whileTap={{ scale: 0.97 }}
                      className="group spotlight-card relative overflow-hidden rounded-2xl border border-border glass-strong p-6 text-center transition-all hover:border-primary/20 hover:shadow-card">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="relative">
                        <motion.div whileHover={{ scale: 1.15, rotate: 5 }}
                          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                          <ToolIcon iconName={tool.icon} size={26} />
                        </motion.div>
                        <h3 className="font-display text-sm font-semibold text-foreground">{tool.name}</h3>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{tool.desc}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          Use Tool <ArrowRight size={12} />
                        </span>
                      </div>
                    </motion.div>
                  </Tilt>
                </Link>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* All Tools Grid */}
      <section className="py-12 mesh-gradient">
        <div className="container">
          <FadeInView>
            <div className="mb-8">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Complete Collection</span>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
                All <span className="text-shimmer">{filtered.length}</span> Tools
                {activeCat !== "All" ? ` in ${activeCat}` : ""}
                {search ? ` matching "${search}"` : ""}
              </h2>
            </div>
          </FadeInView>
          <div ref={gridRef} className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((tool) => (
              <Link key={tool.slug} to={`/tools/${tool.slug}`}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 text-center transition-all hover:border-primary/30 hover:shadow-glow"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:scale-110 group-hover:bg-primary/20">
                      <ToolIcon iconName={tool.icon} size={20} />
                    </div>
                    <h3 className="font-display text-xs font-semibold text-foreground">{tool.name}</h3>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">{tool.desc}</p>
                    <span className="mt-2 inline-block rounded bg-secondary px-2 py-0.5 text-[9px] font-medium text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      {tool.category}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">No tools found matching your search.</p>
              <button onClick={() => { setSearch(""); setActiveCat("All"); }}
                className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section ref={howRef} className="border-t border-border py-24 aurora-bg">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Simple Process</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                How It <span className="text-shimmer">Works</span>
              </h2>
              <p className="mt-4 text-muted-foreground">Four simple steps to process any document</p>
              <div className="mx-auto mt-4 gradient-line w-24" />
            </div>
          </FadeInView>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, i) => (
              <Tilt key={step.title} tiltMaxAngleX={isMobile ? 0 : 10} tiltMaxAngleY={isMobile ? 0 : 10} glareEnable={!isMobile} glareMaxOpacity={0.08} glareBorderRadius="1rem" scale={isMobile ? 1 : 1.03}>
                <motion.div whileTap={{ scale: 0.98 }}
                  className="how-step group spotlight-card relative overflow-hidden rounded-2xl border border-border glass-strong p-8 text-center transition-all hover:border-primary/20 hover:shadow-card">
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 transition-opacity group-hover:opacity-100`} />
                  <div className="relative">
                    {/* Step number */}
                    <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                      {i + 1}
                    </div>
                    <motion.div whileHover={{ scale: 1.15, rotate: 5 }}
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                      <step.icon size={30} />
                    </motion.div>
                    <h3 className="font-display text-lg font-semibold text-foreground glow-text">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </motion.div>
              </Tilt>
            ))}
          </div>

          {/* Connecting arrows on desktop */}
          <div className="mt-6 hidden lg:flex items-center justify-center gap-4">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                className="text-primary/40">
                <ArrowRight size={24} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border bg-card/50 py-16">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 md:grid-cols-4">
            {[
              { value: allToolsData.length, suffix: "+", label: "PDF Tools", icon: FileText },
              { value: 5000000, suffix: "+", label: "Files Processed", icon: Download },
              { value: 1000000, suffix: "+", label: "Happy Users", icon: Users },
              { value: 99, suffix: "%", label: "Accuracy Rate", icon: CheckCircle },
            ].map((s) => (
              <Tilt key={s.label} tiltMaxAngleX={isMobile ? 0 : 12} tiltMaxAngleY={isMobile ? 0 : 12} glareEnable={!isMobile} glareMaxOpacity={0.06} glareBorderRadius="1rem" scale={isMobile ? 1 : 1.02}>
                <div className="rounded-2xl border border-border glass-strong p-6 text-center transition-all hover:shadow-glow">
                  <s.icon size={24} className="mx-auto mb-3 text-primary" />
                  <div className="font-display text-3xl font-bold text-gradient md:text-4xl">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </div>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</p>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TOOLS FAQ ═══ */}
      <section className="border-t border-border py-16">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-10">
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Frequently Asked <span className="text-shimmer">Questions</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">Common questions about our PDF tools</p>
            </div>
          </FadeInView>
          <div className="mx-auto max-w-3xl space-y-3">
            {[
              { q: "Are PDF tools really free?", a: "Yes! All 100+ PDF tools are completely free with no hidden costs, no sign-up required, and no file limits." },
              { q: "Is my data safe?", a: "Absolutely. All files are processed locally in your browser — they never leave your device or get uploaded to any server." },
              { q: "What file formats are supported?", a: "We support PDF, Word (DOCX), Excel (XLSX), PowerPoint (PPTX), JPG, PNG, and many more formats." },
              { q: "Is there a file size limit?", a: "Most tools work with files up to 100MB. Since processing happens in your browser, performance depends on your device." },
              { q: "Can I use these tools on mobile?", a: "Yes! All tools are fully responsive and work perfectly on smartphones, tablets, and desktops." },
            ].map((faq, i) => (
              <FadeInView key={i} delay={i * 0.05}>
                <motion.div whileHover={{ x: 3 }}
                  className="group rounded-xl border border-border glass p-5 transition-all hover:border-primary/20">
                  <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">{String(i+1).padStart(2,'0')}</span>
                    {faq.q}
                  </h4>
                  <p className="mt-2 pl-8 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ USER TESTIMONIALS ═══ */}
      <section className="border-t border-border py-16 aurora-bg">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-10">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">User Reviews</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
                What <span className="text-gradient">Users Say</span>
              </h2>
            </div>
          </FadeInView>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Ravi Kumar", role: "UPSC Aspirant", text: "Best PDF tools I've found! Merged all my NCERT notes into one PDF in seconds. No sign-up, no ads.", rating: 5 },
              { name: "Sneha Gupta", role: "SSC CGL 2025", text: "The PDF to Word converter works perfectly. I converted my handwritten notes scans to editable documents.", rating: 5 },
              { name: "Aditya Singh", role: "Bank PO Candidate", text: "Compressed my 50MB question papers to 5MB without losing quality. Amazing tool for students!", rating: 5 },
            ].map((t, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <Tilt tiltMaxAngleX={isMobile ? 0 : 6} tiltMaxAngleY={isMobile ? 0 : 6} glareEnable={!isMobile} glareMaxOpacity={0.06} glareBorderRadius="1rem" scale={isMobile ? 1 : 1.02}>
                  <div className="rounded-2xl border border-border glass-strong p-6 transition-all hover:border-primary/20 hover:shadow-card">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} size={14} className="fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground italic">"{t.text}"</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                        {t.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-20 aurora-bg">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 shadow-glow">
                <Zap size={40} className="text-primary" />
              </motion.div>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                Ready to <span className="text-shimmer">Get Started</span>?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                No registration needed. Pick a tool and start processing your files instantly.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow">
                  <Sparkles size={16} /> Browse All Tools <ArrowRight size={14} />
                </motion.button>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* SEO Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Free PDF Tools — ISHU",
          "description": "100+ free PDF tools: merge, split, compress, convert, edit, sign, protect & more.",
          "url": "https://ishu.fun/tools",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ishu.fun/" },
              { "@type": "ListItem", "position": 2, "name": "PDF Tools", "item": "https://ishu.fun/tools" }
            ]
          }
        })
      }} />
    </Layout>
  );
};

export default ToolsPage;
