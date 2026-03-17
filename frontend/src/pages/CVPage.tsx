import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import ParallaxSection from "@/components/animations/ParallaxSection";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  FileText, UserCircle, ArrowRight, Download, Shield, Zap,
  CheckCircle, PenTool, Eye, Layers, Heart, Palette,
  Lock, Cpu, Globe, Clock, ChevronRight, ArrowUpRight,
  Sparkles, Monitor, Printer
} from "lucide-react";
import { Link } from "react-router-dom";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";

const processSteps = [
  { num: "01", title: "Choose format", desc: "Select between a professional resume or a detailed bio-data document based on your needs.", icon: Layers },
  { num: "02", title: "Enter details", desc: "Fill in your information section by section through a guided, intuitive form interface.", icon: PenTool },
  { num: "03", title: "Export PDF", desc: "Preview your formatted document and download a print-ready PDF with a single click.", icon: Download },
];

const features = [
  { icon: Lock, title: "Privacy First", desc: "Everything runs in your browser. No data is uploaded, stored, or shared with any server." },
  { icon: Zap, title: "Instant Export", desc: "PDF generated locally in under 3 seconds. No server processing, no queues, no delays." },
  { icon: Globe, title: "Free Forever", desc: "No signup, no hidden charges, no paywalls. Unlimited documents at zero cost." },
  { icon: Cpu, title: "ATS Optimized", desc: "Layouts engineered to pass automated screening systems used by top recruiters." },
  { icon: Eye, title: "Live Preview", desc: "Real-time document preview updates as you type. What you see is exactly what you get." },
  { icon: Clock, title: "Quick Setup", desc: "Smart defaults and structured sections get your document ready in under 5 minutes." },
];

const stats = [
  { value: "100%", label: "Private", icon: Lock },
  { value: "<3s", label: "PDF Export", icon: Zap },
  { value: "Free", label: "No Limits", icon: Globe },
  { value: "ATS", label: "Optimized", icon: CheckCircle },
];

const CVPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <Layout>
      <SEOHead {...SEO_DATA.cv} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://ishu.fun/" },
        { name: "CV", url: "https://ishu.fun/cv" },
      ]} />

      {/* Hero with Parallax Background */}
      <section ref={heroRef} className="relative overflow-hidden min-h-[92vh] flex items-center">
        {/* Parallax background image */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{ y: heroImgY }}
        >
          <div
            className="absolute inset-0 scale-110"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2069&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-background/90" />
        </motion.div>

        <motion.div className="container relative z-10 py-20" style={{ opacity: heroOpacity }}>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left content */}
            <div>
              <FadeInView>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-primary mb-6">
                  <Shield className="h-3.5 w-3.5" />
                  Free &middot; Private &middot; No signup needed
                </div>
              </FadeInView>

              <FadeInView delay={0.05}>
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] leading-[1.1]">
                  Build documents
                  <br />
                  that get you
                  <span className="relative ml-3">
                    <span className="relative z-10 text-primary">noticed</span>
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-3 bg-primary/15 rounded-sm -z-0"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                      style={{ transformOrigin: "left" }}
                    />
                  </span>
                </h1>
              </FadeInView>

              <FadeInView delay={0.1}>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Craft polished resumes and bio-data documents with our intuitive builder. 
                  Fill in your details, preview in real-time, and export a clean PDF — 
                  entirely in your browser.
                </p>
              </FadeInView>

              <FadeInView delay={0.15}>
                <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
                  <Link to="/cv/resume">
                    <motion.button
                      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(59,130,246,0.25)" }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all"
                    >
                      <FileText className="h-4 w-4" />
                      Create Resume
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </Link>
                  <Link to="/cv/bio-data">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-card/80 backdrop-blur-sm px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-card hover:border-border/80"
                    >
                      <UserCircle className="h-4 w-4 text-muted-foreground" />
                      Create Bio-Data
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </motion.button>
                  </Link>
                </div>
              </FadeInView>

              <FadeInView delay={0.2}>
                <div className="mt-10 grid grid-cols-4 gap-4">
                  {stats.map((s) => (
                    <div key={s.label} className="text-center">
                      <s.icon className="h-4 w-4 text-primary/60 mx-auto mb-1.5" />
                      <div className="text-lg font-bold text-foreground leading-none">{s.value}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>
              </FadeInView>
            </div>

            {/* Right side - Document preview mockup */}
            <FadeInView delay={0.15} direction="right">
              <div className="relative hidden lg:block">
                <ParallaxSection speed={0.15}>
                  {/* Resume mockup card */}
                  <motion.div
                    className="relative rounded-2xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-400 to-cyan-400" />
                    <div className="p-8">
                      {/* Mockup header */}
                      <div className="flex items-center gap-4 mb-6 pb-5 border-b border-border/40">
                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <FileText className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <div className="h-4 w-40 bg-foreground/90 rounded-sm mb-2" />
                          <div className="flex gap-3">
                            <div className="h-2.5 w-24 bg-muted-foreground/20 rounded-sm" />
                            <div className="h-2.5 w-20 bg-muted-foreground/20 rounded-sm" />
                          </div>
                        </div>
                      </div>
                      {/* Mockup body lines */}
                      <div className="space-y-5">
                        <div>
                          <div className="h-2.5 w-28 bg-primary/30 rounded-sm mb-3" />
                          <div className="space-y-2">
                            <div className="h-2 w-full bg-muted/60 rounded-sm" />
                            <div className="h-2 w-4/5 bg-muted/60 rounded-sm" />
                            <div className="h-2 w-3/5 bg-muted/60 rounded-sm" />
                          </div>
                        </div>
                        <div>
                          <div className="h-2.5 w-24 bg-primary/30 rounded-sm mb-3" />
                          <div className="flex gap-2 flex-wrap">
                            {["React", "Node.js", "Python", "SQL"].map((s) => (
                              <div key={s} className="px-3 py-1.5 rounded-md bg-primary/8 border border-primary/15">
                                <span className="text-[10px] font-medium text-primary/70">{s}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="h-2.5 w-32 bg-primary/30 rounded-sm mb-3" />
                          <div className="space-y-2">
                            <div className="h-2 w-full bg-muted/60 rounded-sm" />
                            <div className="h-2 w-3/4 bg-muted/60 rounded-sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Floating badge */}
                    <motion.div
                      className="absolute -right-3 top-16 rounded-lg bg-emerald-500/90 backdrop-blur px-3 py-1.5 shadow-lg"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    >
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="h-3 w-3 text-white" />
                        <span className="text-[10px] font-semibold text-white">ATS Ready</span>
                      </div>
                    </motion.div>
                  </motion.div>
                </ParallaxSection>

                {/* Floating bio-data card offset behind */}
                <motion.div
                  className="absolute -bottom-8 -left-8 w-48 rounded-xl border border-border/40 bg-card/80 backdrop-blur-lg shadow-xl p-4"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
                      <UserCircle className="h-4 w-4 text-violet-500" />
                    </div>
                    <div>
                      <div className="h-2.5 w-16 bg-foreground/60 rounded-sm mb-1" />
                      <div className="h-1.5 w-12 bg-muted-foreground/30 rounded-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-muted/50 rounded-sm" />
                    <div className="h-1.5 w-3/4 bg-muted/50 rounded-sm" />
                    <div className="h-1.5 w-2/3 bg-muted/50 rounded-sm" />
                  </div>
                </motion.div>
              </div>
            </FadeInView>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="h-10 w-6 rounded-full border-2 border-muted-foreground/20 flex justify-center pt-2">
            <motion.div
              className="h-2 w-1 rounded-full bg-muted-foreground/40"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* Document Cards */}
      <section className="py-24 md:py-32 relative">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-3 block">Choose your format</span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Two document types, one workflow
              </h2>
              <p className="mt-3 text-muted-foreground">Select the format that fits your purpose and have it ready in minutes.</p>
            </div>
          </FadeInView>

          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            <FadeInView delay={0.05}>
              <Link to="/cv/resume" className="group block h-full">
                <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_8px_40px_rgba(59,130,246,0.08)]">
                  {/* Card top image strip */}
                  <div className="relative h-44 overflow-hidden">
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                    <div className="absolute bottom-4 left-6 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/90 shadow-lg">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Professional Resume</h3>
                        <p className="text-xs text-muted-foreground">Modern & ATS-friendly</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      Build a polished resume with sections for experience, education, skills, and projects. 
                      Choose from 5 color themes and preview changes in real-time.
                    </p>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { icon: Palette, text: "5 Themes" },
                        { icon: Monitor, text: "Live Preview" },
                        { icon: Printer, text: "PDF Export" },
                        { icon: Cpu, text: "ATS Friendly" },
                        { icon: PenTool, text: "Easy Editing" },
                        { icon: Layers, text: "6 Sections" },
                      ].map((f) => (
                        <div key={f.text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <f.icon className="h-3.5 w-3.5 text-primary/50 shrink-0" />
                          {f.text}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                        Start building
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Free</span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeInView>

            <FadeInView delay={0.1}>
              <Link to="/cv/bio-data" className="group block h-full">
                <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_8px_40px_rgba(139,92,246,0.08)]">
                  {/* Card top image strip */}
                  <div className="relative h-44 overflow-hidden">
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848e968838?auto=format&fit=crop&w=1200&q=80')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                    <div className="absolute bottom-4 left-6 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/90 shadow-lg">
                        <UserCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">Personal Bio-Data</h3>
                        <p className="text-xs text-muted-foreground">Structured & print-ready</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      Create a structured bio-data for matrimonial, personal, or official use. 
                      Upload your photo, add family details, and get a formatted PDF output.
                    </p>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { icon: Heart, text: "Personal Info" },
                        { icon: UserCircle, text: "Family Details" },
                        { icon: Eye, text: "Photo Upload" },
                        { icon: Download, text: "PDF Export" },
                        { icon: Layers, text: "Clean Layout" },
                        { icon: Printer, text: "Print Ready" },
                      ].map((f) => (
                        <div key={f.text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <f.icon className="h-3.5 w-3.5 text-violet-500/50 shrink-0" />
                          {f.text}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-500 transition-all group-hover:gap-2.5">
                        Start building
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">Free</span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* How It Works - with parallax */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background image for this section */}
        <div
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute inset-0 -z-10 border-y border-border/30" />

        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-3 block">How it works</span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Three steps to your document
              </h2>
              <p className="mt-3 text-muted-foreground">From blank page to polished PDF in under five minutes.</p>
            </div>
          </FadeInView>

          <div className="mx-auto max-w-5xl">
            {/* Timeline connector */}
            <div className="relative grid gap-8 md:grid-cols-3">
              <div className="hidden md:block absolute top-12 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              {processSteps.map((step, i) => (
                <FadeInView key={step.num} delay={i * 0.1}>
                  <ParallaxSection speed={0.05 + i * 0.03}>
                    <div className="relative text-center">
                      <motion.div
                        className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-border/60 bg-card shadow-lg"
                        whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative">
                          <step.icon className="h-8 w-8 text-primary" />
                          <span className="absolute -top-2 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-md">
                            {step.num.replace("0", "")}
                          </span>
                        </div>
                      </motion.div>
                      <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                    </div>
                  </ParallaxSection>
                </FadeInView>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-3 block">Why use this</span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built for real-world use
              </h2>
              <p className="mt-3 text-muted-foreground">
                Designed for students, freshers, and working professionals across India.
              </p>
            </div>
          </FadeInView>

          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <FadeInView key={f.title} delay={i * 0.06}>
                <motion.div
                  className="group rounded-2xl border border-border/50 bg-card/60 p-6 transition-all duration-300 hover:border-border hover:bg-card hover:shadow-lg"
                  whileHover={{ y: -3 }}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 border border-primary/10 group-hover:bg-primary/12 transition-colors">
                    <f.icon className="h-5 w-5 text-primary/70 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA with background */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=2072&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute inset-0 -z-10 border-t border-border/30" />

        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center">
              <Sparkles className="h-8 w-8 text-primary/40 mx-auto mb-5" />
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg mx-auto">
                Pick a format below and have your document ready in minutes. 
                No signup, no payment — completely free and private.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/cv/resume">
                  <motion.button
                    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(59,130,246,0.25)" }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all"
                  >
                    <FileText className="h-4 w-4" />
                    Build Resume
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </Link>
                <Link to="/cv/bio-data">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-card/80 backdrop-blur-sm px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-card"
                  >
                    <UserCircle className="h-4 w-4 text-muted-foreground" />
                    Build Bio-Data
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>
    </Layout>
  );
};

export default CVPage;
