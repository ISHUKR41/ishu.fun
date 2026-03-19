/**
 * ContactPage.tsx - Contact Us Page (Ultra Funky V2)
 * 
 * Contact form and support information page.
 * Form submissions are saved to the database via Supabase.
 * 
 * Features:
 * - Contact form with name, email, phone, subject, message fields
 * - Form validation and loading state
 * - Success/error toast notifications
 * - Contact info cards (email, phone, WhatsApp, address)
 * - Social media links
 * - FAQ section specific to contact queries
 * - TypeAnimation for dynamic text effects
 * - GSAP scroll animations
 * - 3D tilt effects and glassmorphism
 * - Interactive particle field background
 * - Spotlight cards, magnetic buttons, stagger animations
 * - Holographic & aurora effects, animated counters
 * - SEO: BreadcrumbSchema
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import ParticleField from "@/components/animations/ParticleField";
import SpotlightCard from "@/components/animations/SpotlightCard";
import MagneticButton from "@/components/animations/MagneticButton";
import StaggerChildren from "@/components/animations/StaggerChildren";
import WaveSection from "@/components/animations/WaveSection";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Mail, Phone, MessageCircle, MapPin, Send, Check, Clock,
  Upload, Twitter, Youtube, Instagram, Linkedin, Globe, ArrowRight, Loader2,
  Sparkles, Users, Headphones, Shield, ChevronDown, HelpCircle, Star, Zap, Heart,
  ExternalLink, Rocket, Flame, Target, Gem, Trophy, Award
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TypeAnimation } from "react-type-animation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";
import confetti from "canvas-confetti";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  { q: "Is ISHU completely free?", a: "Yes! All features including PDF tools, news, results, and WhatsApp alerts are 100% free forever. No hidden charges." },
  { q: "How quickly do you update new results?", a: "We update results within minutes of official announcements. Our team monitors all government portals 24/7." },
  { q: "Are the PDF tools safe to use?", a: "Absolutely. All files are processed in your browser — they never leave your device. We don't store any uploaded files." },
  { q: "How do WhatsApp notifications work?", a: "After signing up, select your preferred exam categories. You'll receive instant WhatsApp alerts when new vacancies, results, or admit cards are published." },
  { q: "Can I contribute content to the blog?", a: "Yes! We welcome guest posts from educators and exam experts. Contact us through this form or WhatsApp." },
  { q: "Which states are currently covered?", a: "We cover all 28 states and 8 union territories. Active states have exam data, others show 'Coming Soon' and will be activated soon." },
];

const testimonials = [
  { name: "Rahul Sharma", role: "UPSC Aspirant", text: "ISHU saved me hours of searching. WhatsApp alerts ensured I never missed a deadline!", rating: 5 },
  { name: "Priya Patel", role: "SSC CGL Qualified", text: "The PDF tools are amazing — I organized all my study materials without paying for any premium software.", rating: 5 },
  { name: "Amit Kumar", role: "Bank PO", text: "Best platform for government exam updates. The interface is so clean and fast compared to other sites.", rating: 5 },
];

/* Geometric floating shapes for hero */
const FloatingShape = ({ className, delay = 0, children }: { className: string; delay?: number; children: React.ReactNode }) => (
  <motion.div
    className={`pointer-events-none absolute ${className}`}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.8, ease: "backOut" }}
  >
    {children}
  </motion.div>
);

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General", message: "" });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleHeroMouse = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const heroSpotlightX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), { stiffness: 100, damping: 30 });
  const heroSpotlightY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), { stiffness: 100, damping: 30 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const statsRow = document.querySelector(".contact-stats-row");
      if (statsRow) {
        gsap.fromTo(".contact-stat",
          { y: 40, opacity: 0, scale: 0.8, rotateX: 15 },
          { scrollTrigger: { trigger: statsRow, start: "top 85%", toggleActions: "play none none none" },
            y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.7, stagger: 0.12, ease: "back.out(1.7)", clearProps: "all" }
        );
      }
      const faqItems = document.querySelectorAll(".faq-item");
      if (faqItems.length > 0 && faqRef.current) {
        gsap.fromTo(faqItems,
          { y: 30, opacity: 0, x: -20 },
          { scrollTrigger: { trigger: faqRef.current, start: "top 80%", toggleActions: "play none none none" },
            y: 0, opacity: 1, x: 0, stagger: 0.1, duration: 0.6, ease: "power3.out", clearProps: "all" }
        );
      }
      const testimonialsGrid = document.querySelector(".testimonials-grid");
      const testimonialCards = document.querySelectorAll(".testimonial-card");
      if (testimonialsGrid && testimonialCards.length > 0) {
        gsap.fromTo(testimonialCards,
          { scale: 0.85, opacity: 0, rotateY: 10 },
          { scrollTrigger: { trigger: testimonialsGrid, start: "top 80%", toggleActions: "play none none none" },
            scale: 1, opacity: 1, rotateY: 0, stagger: 0.12, duration: 0.7, ease: "back.out(1.7)", clearProps: "all" }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Submit to Formspree (primary — sends email notification)
    let formspreeOk = false;
    try {
      const res = await fetch("https://formspree.io/f/mreypoyw", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || "N/A",
          subject: form.subject,
          message: form.message,
        }),
      });
      formspreeOk = res.ok;
    } catch { /* Formspree failed, will try Supabase */ }

    // 2. Also save to Supabase database (backup)
    const { error: dbError } = await supabase.from("contacts").insert({
      name: form.name, email: form.email, phone: form.phone || null, subject: form.subject, message: form.message,
    });

    setLoading(false);

    if (!formspreeOk && dbError) {
      toast({ title: "Failed to send", description: "Please try again or contact us via WhatsApp.", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "Message sent successfully!" });
      // Funky confetti celebration!
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#ff0080', '#ff8c00', '#40e0d0', '#7b68ee', '#ff6b9d', '#00d2ff'] });
      setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5, x: 0.2 }, colors: ['#ff0080', '#7b68ee', '#40e0d0'] }), 300);
      setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.5, x: 0.8 }, colors: ['#ff8c00', '#ff6b9d', '#2ed573'] }), 600);
      setTimeout(() => confetti({ particleCount: 60, spread: 160, origin: { y: 0.4, x: 0.5 }, colors: ['#00d2ff', '#a855f7', '#ff0080'] }), 900);
    }
  };

  return (
    <Layout>
      <SEOHead {...SEO_DATA.contact} />
      <BreadcrumbSchema items={[{ name: "Contact", url: "/contact" }]} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section ref={heroRef} onMouseMove={handleHeroMouse} className="relative bg-gradient-hero py-36 md:py-44 overflow-hidden funky-hero-pattern">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 opacity-[0.10] mix-blend-luminosity pointer-events-none" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <GradientMesh variant="aurora" />
        <ParticleField />
        <div className="pointer-events-none absolute inset-0 funky-animated-grid" />
        <div className="funky-noise-overlay" />
        
        {/* Aurora sweep bands */}
        <div className="funky-aurora-band top-[20%]" />
        <div className="funky-aurora-band bottom-[10%]" style={{ animationDelay: '-6s', animationDirection: 'reverse' }} />
        
        {/* Scanner line effect */}
        <div className="pointer-events-none absolute inset-0 funky-scan-line" />
        
        <MorphingBlob color="hsl(210 100% 56% / 0.12)" size={600} className="left-[10%] top-[5%]" />
        <MorphingBlob color="hsl(280 100% 66% / 0.1)" size={500} className="right-[5%] bottom-[10%]" duration={20} />
        <MorphingBlob color="hsl(330 100% 60% / 0.08)" size={350} className="left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2" duration={25} />
        
        {/* Liquid morph blobs */}
        <div className="pointer-events-none absolute left-[3%] top-[15%] h-48 w-48 rounded-full bg-gradient-to-br from-[#ff0080]/12 to-[#7b68ee]/8 blur-[80px] funky-liquid-blob" />
        <div className="pointer-events-none absolute right-[5%] top-[25%] h-40 w-40 rounded-full bg-gradient-to-br from-[#40e0d0]/10 to-[#00d2ff]/8 blur-[70px] funky-liquid-blob" style={{ animationDelay: '-5s' }} />
        <div className="pointer-events-none absolute left-[35%] bottom-[15%] h-44 w-44 rounded-full bg-gradient-to-br from-[#ff8c00]/10 to-[#ff6b9d]/8 blur-[75px] funky-liquid-blob" style={{ animationDelay: '-10s' }} />
        
        {/* Neon orbs */}
        <div className="pointer-events-none absolute left-[5%] top-[20%] h-40 w-40 rounded-full bg-[#ff0080]/10 blur-[60px] funky-orb-1" />
        <div className="pointer-events-none absolute right-[8%] top-[30%] h-32 w-32 rounded-full bg-[#7b68ee]/10 blur-[50px] funky-orb-2" />
        <div className="pointer-events-none absolute left-[40%] bottom-[20%] h-36 w-36 rounded-full bg-[#40e0d0]/8 blur-[55px] funky-orb-1" style={{ animationDelay: '2s' }} />
        <div className="pointer-events-none absolute right-[30%] top-[10%] h-28 w-28 rounded-full bg-[#00d2ff]/8 blur-[45px] funky-orb-2" style={{ animationDelay: '4s' }} />
        
        {/* Floating emojis + geometric shapes */}
        <FloatingShape className="left-[10%] top-[15%] funky-float-1" delay={0.2}>
          <div className="funky-icon-orb funky-icon-orb--blue"><Rocket size={20} /></div>
        </FloatingShape>
        <FloatingShape className="right-[12%] top-[20%] funky-float-2" delay={0.4}>
          <div className="funky-icon-orb funky-icon-orb--violet"><Sparkles size={18} /></div>
        </FloatingShape>
        <FloatingShape className="left-[20%] bottom-[25%] funky-float-3" delay={0.6}>
          <div className="funky-icon-orb funky-icon-orb--cyan"><Zap size={18} /></div>
        </FloatingShape>
        <FloatingShape className="right-[20%] bottom-[30%] funky-float-1" delay={0.8}>
          <div className="funky-icon-orb funky-icon-orb--pink"><Heart size={18} /></div>
        </FloatingShape>
        <FloatingShape className="left-[50%] top-[10%] funky-float-2" delay={1}>
          <div className="funky-icon-orb funky-icon-orb--amber"><Target size={18} /></div>
        </FloatingShape>
        <FloatingShape className="right-[35%] top-[12%] funky-float-3" delay={1.2}>
          <div className="funky-icon-orb funky-icon-orb--emerald"><Gem size={16} /></div>
        </FloatingShape>
        <FloatingShape className="left-[7%] bottom-[35%] funky-float-2" delay={1.4}>
          <div className="funky-icon-orb funky-icon-orb--orange"><Flame size={16} /></div>
        </FloatingShape>

        {/* Geometric SVG shapes */}
        <div className="pointer-events-none absolute left-[15%] top-[60%] funky-drift-slow opacity-10">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none"><rect x="10" y="10" width="40" height="40" rx="8" stroke="url(#grad1)" strokeWidth="2" transform="rotate(45 30 30)"/><defs><linearGradient id="grad1"><stop stopColor="#ff0080"/><stop offset="1" stopColor="#7b68ee"/></linearGradient></defs></svg>
        </div>
        <div className="pointer-events-none absolute right-[18%] bottom-[40%] funky-drift-medium opacity-10">
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none"><circle cx="25" cy="25" r="20" stroke="url(#grad2)" strokeWidth="2"/><defs><linearGradient id="grad2"><stop stopColor="#40e0d0"/><stop offset="1" stopColor="#00d2ff"/></linearGradient></defs></svg>
        </div>
        <div className="pointer-events-none absolute left-[60%] top-[70%] funky-drift-slow opacity-10" style={{ animationDelay: '-8s' }}>
          <svg width="45" height="45" viewBox="0 0 45 45" fill="none"><polygon points="22.5,2 43,35 2,35" stroke="url(#grad3)" strokeWidth="2" fill="none"/><defs><linearGradient id="grad3"><stop stopColor="#ff8c00"/><stop offset="1" stopColor="#ff6b9d"/></linearGradient></defs></svg>
        </div>

        {/* Mouse-tracking spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-30 hidden md:block"
          style={{
            background: useTransform(
              [heroSpotlightX, heroSpotlightY],
              ([x, y]) => `radial-gradient(600px circle at ${x}% ${y}%, hsl(210 100% 56% / 0.08), transparent 60%)`
            ),
          }}
        />
        
        <div className="container relative z-10">
          <FadeInView>
            <div className="mx-auto max-w-3xl text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-6 py-3 text-sm funky-border funky-breathe backdrop-blur-sm"
              >
                <Heart size={14} className="text-primary funky-text-cycle" />
                <span className="font-semibold text-foreground">ISHU — Indian StudentHub University</span>
                <Sparkles size={14} className="funky-text-cycle" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-4xl font-bold text-foreground sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
              >
                Let's{" "}
                <span className="funky-gradient-text">
                  <TypeAnimation
                    sequence={['Connect', 2000, 'Talk', 2000, 'Collaborate', 2000, 'Build', 2000]}
                    wrapper="span"
                    speed={30}
                    repeat={Infinity}
                  />
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 text-lg text-muted-foreground md:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed"
              >
                Have a question, feedback, or collaboration idea?{" "}
                <span className="funky-flowing-underline text-foreground font-medium">We're here to help 24/7</span>
              </motion.p>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mx-auto mt-8 funky-wave-divider w-40"
              />
              
              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 8, 0] }}
                transition={{ opacity: { delay: 1.2 }, y: { repeat: Infinity, duration: 2 } }}
                className="mt-12 flex flex-col items-center gap-2"
              >
                <span className="text-xs text-muted-foreground/60 uppercase tracking-widest">Scroll Down</span>
                <ChevronDown size={16} className="text-muted-foreground/40" />
              </motion.div>
            </div>
          </FadeInView>
        </div>
        
        {/* Bottom wave transition */}
        <WaveSection position="bottom" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <section ref={sectionRef} className="py-20 relative">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-luminosity" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=2029&q=80')",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div className="pointer-events-none absolute inset-0 funky-dot-grid opacity-30" />
        <div className="container relative">

          {/* Contact Cards with Tilt + Spotlight */}
          <StaggerChildren direction="up" staggerDelay={0.1} className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: Phone, label: "Phone", value: "8986985813", href: "tel:8986985813", color: "bg-primary/10 text-primary", gradient: "from-blue-500/10 to-indigo-500/5" },
              { icon: Mail, label: "Email", value: "ishukryk@gmail.com", href: "mailto:ishukryk@gmail.com", color: "bg-primary/10 text-primary", gradient: "from-violet-500/10 to-purple-500/5" },
              { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: "https://wa.me/918986985813", color: "bg-success/10 text-success", gradient: "from-emerald-500/10 to-green-500/5" },
              { icon: Clock, label: "Response", value: "Within 24 hours", href: null, color: "bg-warning/10 text-warning", gradient: "from-amber-500/10 to-orange-500/5" },
            ].map((card) => (
              <SpotlightCard key={card.label} className="h-full" spotlightColor={card.label === "WhatsApp" ? "hsl(142 76% 36% / 0.15)" : undefined}>
                <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable glareMaxOpacity={0.1} glareBorderRadius="1rem" scale={1.03} transitionSpeed={1500}>
                  {card.href ? (
                    <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      className={`funky-card funky-border funky-corner-accents group flex items-center gap-4 rounded-xl border border-border bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-6 transition-all hover:border-primary/30 hover:shadow-glow h-full`}>
                      <div className={`relative flex h-14 w-14 items-center justify-center rounded-xl ${card.color} transition-all group-hover:scale-110 group-hover:shadow-lg funky-wiggle`}>
                        <card.icon size={26} />
                        <div className="absolute inset-0 rounded-xl bg-current opacity-0 group-hover:opacity-5 transition-opacity" />
                      </div>
                      <div>
                        <p className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">{card.label}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{card.value}</p>
                      </div>
                      <ExternalLink size={14} className="ml-auto text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                    </a>
                  ) : (
                    <div className={`funky-card funky-border funky-corner-accents flex items-center gap-4 rounded-xl border border-border bg-gradient-to-br ${card.gradient} backdrop-blur-sm p-6 h-full`}>
                      <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.color} funky-wiggle`}>
                        <card.icon size={26} />
                      </div>
                      <div>
                        <p className="font-display text-sm font-bold text-foreground">{card.label}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{card.value}</p>
                      </div>
                    </div>
                  )}
                </Tilt>
              </SpotlightCard>
            ))}
          </StaggerChildren>

          {/* Stats Row with Animated Counters */}
          <div className="contact-stats-row mt-14 grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-4">
            {[
              { icon: Users, label: "Users Served", value: "1M+", numValue: 1000000, suffix: "+", color: "from-blue-500/5 to-indigo-500/10" },
              { icon: Headphones, label: "Queries Resolved", value: "50K+", numValue: 50000, suffix: "+", color: "from-violet-500/5 to-purple-500/10" },
              { icon: Shield, label: "Uptime", value: "99.9%", numValue: 99.9, suffix: "%", color: "from-emerald-500/5 to-green-500/10" },
              { icon: Clock, label: "Avg Response", value: "<2 hrs", numValue: 2, suffix: " hrs", prefix: "<", color: "from-amber-500/5 to-orange-500/10" },
            ].map((stat) => (
              <SpotlightCard key={stat.label}>
                <div className={`contact-stat funky-card funky-breathe rounded-2xl border border-border bg-gradient-to-br ${stat.color} backdrop-blur-sm p-6 text-center relative overflow-hidden`}>
                  <div className="relative z-10">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <stat.icon size={20} className="funky-text-cycle" />
                    </div>
                    <p className="font-display text-3xl font-bold text-foreground funky-stat-value">
                      <AnimatedCounter target={stat.numValue} suffix={stat.suffix} prefix={stat.prefix || ""} duration={2.5} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.label}</p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* WhatsApp Direct Chat CTA */}
          <FadeInView delay={0.05}>
            <div className="mt-12 overflow-hidden rounded-2xl border border-success/20 bg-gradient-to-br from-success/5 via-success/10 to-success/5 p-10 text-center relative funky-border funky-neon">
              <div className="funky-noise-overlay rounded-2xl" />
              <motion.div animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-success/10 blur-[50px]" />
              <div className="absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-[#7b68ee]/10 blur-[45px] funky-orb-2" />
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-success/30 to-transparent" />
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-bold text-foreground">
                  <MessageCircle size={22} className="inline text-success funky-bounce" /> Prefer instant messaging?
                </h3>
                <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                  Chat with us directly on WhatsApp for the fastest response — we reply within minutes!
                </p>
                <MagneticButton strength={0.15} className="inline-block mt-6">
                  <motion.a whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(142 76% 36% / 0.3)" }} whileTap={{ scale: 0.95 }}
                    href="https://wa.me/918986985813?text=Hello%2C%20I%20have%20a%20question%20about%20ISHU"
                    target="_blank" rel="noopener noreferrer"
                    className="relative inline-flex items-center gap-2.5 rounded-xl bg-success px-10 py-4 font-display text-sm font-bold text-success-foreground transition-all hover:opacity-90 funky-pulse-ring"
                  >
                    <MessageCircle size={20} /> Open WhatsApp Chat <ArrowRight size={16} />
                  </motion.a>
                </MagneticButton>
              </div>
            </div>
          </FadeInView>

          {/* Form + Map Grid */}
          <div className="mt-14 grid gap-8 lg:grid-cols-5">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <FadeInView delay={0.1}>
                {!submitted ? (
                  <SpotlightCard spotlightColor="hsl(280 100% 60% / 0.1)">
                    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border glass-strong p-8 md:p-10 funky-border funky-form-container funky-holographic relative overflow-hidden">
                      <div className="funky-noise-overlay rounded-2xl" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <Send size={18} className="text-primary" />
                          </div>
                          <div>
                            <h2 className="font-display text-xl font-bold text-foreground">Send us a Message</h2>
                            <p className="text-xs text-muted-foreground">We'll respond within 24 hours</p>
                          </div>
                          <div className="funky-bounce ml-auto flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20"><Mail size={16} className="text-primary" /></div>
                        </div>
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="group">
                            <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                              <Users size={13} className="text-primary/60" /> Name *
                            </label>
                            <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                              className="funky-input w-full rounded-xl border border-border bg-secondary/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all backdrop-blur-sm" placeholder="Your name" />
                          </div>
                          <div className="group">
                            <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                              <Mail size={13} className="text-primary/60" /> Email *
                            </label>
                            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                              className="funky-input w-full rounded-xl border border-border bg-secondary/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all backdrop-blur-sm" placeholder="your@email.com" />
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="group">
                            <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                              <Phone size={13} className="text-primary/60" /> Phone
                            </label>
                            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              className="funky-input w-full rounded-xl border border-border bg-secondary/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all backdrop-blur-sm" placeholder="Optional" />
                          </div>
                          <div className="group">
                            <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                              <Sparkles size={13} className="text-primary/60" /> Subject
                            </label>
                            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                              className="funky-input w-full rounded-xl border border-border bg-secondary/50 px-4 py-3.5 text-sm text-foreground focus:border-primary focus:outline-none transition-all backdrop-blur-sm">
                              <option>General</option>
                              <option>Technical</option>
                              <option>Collaboration</option>
                              <option>Complaint</option>
                              <option>Suggestion</option>
                            </select>
                          </div>
                        </div>
                        <div className="group">
                          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <MessageCircle size={13} className="text-primary/60" /> Message *
                          </label>
                          <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                            className="funky-input w-full rounded-xl border border-border bg-secondary/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none transition-all backdrop-blur-sm" placeholder="Write your message..." />
                        </div>

                        <div>
                          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <Upload size={13} className="text-primary/60" /> Attachment (optional)
                          </label>
                          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-3.5 transition-all hover:border-primary/30 hover:bg-secondary/50 backdrop-blur-sm group">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                              <Upload size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {attachment ? attachment.name : "Click to attach a file (max 5MB)"}
                            </span>
                            <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
                          </label>
                        </div>

                        <MagneticButton strength={0.1}>
                          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.03, boxShadow: "0 0 40px hsl(210 100% 56% / 0.3), 0 0 80px hsl(280 100% 60% / 0.15)" }} whileTap={{ scale: 0.97 }}
                            className="funky-send-btn flex items-center gap-2.5 rounded-xl px-10 py-4 font-display text-sm font-bold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-50 relative">
                            {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <><Rocket size={16} /> Send Message <Zap size={14} /></>}
                          </motion.button>
                        </MagneticButton>
                      </div>
                    </form>
                  </SpotlightCard>
                ) : (
                  <motion.div initial={{ scale: 0.85, opacity: 0, rotateX: 10 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                    transition={{ type: "spring", stiffness: 180, damping: 20 }}
                    className="rounded-2xl border border-border glass-strong p-12 text-center relative overflow-hidden funky-border funky-holographic">
                    <div className="funky-noise-overlay rounded-2xl" />
                    {/* Decorative animated glow */}
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-[hsl(var(--success))]/15 blur-3xl"
                    />
                    {/* Success icon with ripple */}
                    <div className="relative z-10">
                      <motion.div
                        animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                        className="absolute inset-0 mx-auto h-20 w-20 rounded-full bg-[hsl(var(--success))]/20"
                      />
                      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 250, damping: 15, delay: 0.2 }}
                        className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--success))]/10 border-2 border-[hsl(var(--success))]/20">
                        <Check size={40} className="text-[hsl(var(--success))]" />
                      </motion.div>
                      <motion.h2 initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                        className="font-display text-3xl font-bold text-foreground">Thank You! <Sparkles size={24} className="inline text-primary funky-bounce" /></motion.h2>
                      <motion.p initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                        className="mt-4 text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        Your message has been received. We'll get back to you within 24 hours.
                      </motion.p>
                      <motion.div initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <MagneticButton strength={0.1}>
                          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "General", message: "" }); setAttachment(null); }}
                            className="funky-send-btn rounded-xl px-8 py-3 font-display text-sm font-bold text-primary-foreground transition-all hover:shadow-glow">
                            Send Another Message
                          </motion.button>
                        </MagneticButton>
                        <a href="https://wa.me/918986985813" target="_blank" rel="noopener noreferrer"
                          className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                          Chat on WhatsApp
                        </a>
                      </motion.div>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                        className="mt-5 text-xs text-muted-foreground">Reference ID: {Date.now().toString(36).toUpperCase()}</motion.p>
                    </div>
                  </motion.div>
                )}
              </FadeInView>
            </div>

            {/* Right Side — Map & Social */}
            <div className="space-y-6 lg:col-span-2">
              <FadeInView delay={0.15}>
                <SpotlightCard>
                  <div className="overflow-hidden rounded-2xl border border-border bg-card funky-border relative">
                    <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 funky-holographic overflow-hidden">
                      <div className="funky-noise-overlay" />
                      <div className="pointer-events-none absolute inset-0 funky-dot-grid opacity-20" />
                      {/* Animated concentric rings */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0, 0.15] }} transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
                          className="absolute h-40 w-40 rounded-full border border-primary/20" />
                        <motion.div animate={{ scale: [1, 2, 1], opacity: [0.1, 0, 0.1] }} transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: "easeOut" }}
                          className="absolute h-40 w-40 rounded-full border border-primary/15" />
                      </div>
                      <motion.div animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}>
                        <div className="relative">
                          <MapPin size={48} className="text-primary drop-shadow-lg" />
                          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute -inset-2 rounded-full bg-primary/10 blur-md" />
                        </div>
                      </motion.div>
                      <div className="absolute bottom-4 left-4 right-4 rounded-xl glass px-4 py-3 text-center backdrop-blur-md border border-white/10">
                        <p className="font-display text-sm font-bold text-foreground">🇮🇳 India</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Available Nationwide — 28 States + 8 UTs</p>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </FadeInView>

              <FadeInView delay={0.2}>
                <SpotlightCard>
                  <div className="rounded-2xl border border-border bg-card p-6 funky-card funky-holographic relative overflow-hidden">
                    <div className="funky-noise-overlay rounded-2xl" />
                    <div className="relative z-10">
                      <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                        <Flame size={14} className="text-primary" /> Quick Contact <Phone size={16} className="text-primary funky-bounce" />
                      </h3>
                      <div className="mt-4 space-y-3.5 text-sm text-muted-foreground">
                        <a href="tel:8986985813" className="flex items-center gap-3 hover:text-foreground transition-all hover:translate-x-1 group">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Phone size={14} className="text-primary" />
                          </div>
                          <span className="font-medium">+91 8986985813</span>
                        </a>
                        <a href="mailto:ishukryk@gmail.com" className="flex items-center gap-3 hover:text-foreground transition-all hover:translate-x-1 group">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Mail size={14} className="text-primary" />
                          </div>
                          <span className="font-medium">ishukryk@gmail.com</span>
                        </a>
                        <a href="https://wa.me/918986985813" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-foreground transition-all hover:translate-x-1 group">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                            <MessageCircle size={14} className="text-success" />
                          </div>
                          <span className="font-medium">WhatsApp: 8986985813</span>
                        </a>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
                            <Clock size={14} className="text-warning" />
                          </div>
                          <span className="font-medium">Mon-Sat, 9AM - 8PM IST</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </FadeInView>

              <FadeInView delay={0.25}>
                <SpotlightCard>
                  <div className="rounded-2xl border border-border bg-card p-6 funky-card funky-holographic relative overflow-hidden">
                    <div className="funky-noise-overlay rounded-2xl" />
                    <div className="relative z-10">
                      <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                        <Globe size={14} className="text-primary" /> Follow Us <Sparkles size={16} className="text-primary funky-bounce" />
                      </h3>
                      <div className="mt-4 flex gap-3">
                        {[
                          { icon: Twitter, label: "Twitter", href: "#" },
                          { icon: Youtube, label: "YouTube", href: "#" },
                          { icon: Instagram, label: "Instagram", href: "#" },
                          { icon: Linkedin, label: "LinkedIn", href: "#" },
                          { icon: Globe, label: "Website", href: "/" },
                        ].map((social) => (
                          <MagneticButton key={social.label} strength={0.2}>
                            <motion.a href={social.href} whileHover={{ y: -4, scale: 1.15 }} whileTap={{ scale: 0.9 }}
                              className="funky-wiggle flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-secondary/80 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary hover:bg-primary/5 hover:shadow-lg"
                              title={social.label}>
                              <social.icon size={18} />
                            </motion.a>
                          </MagneticButton>
                        ))}
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </FadeInView>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="border-t border-border bg-card/50 py-24 aurora-bg relative overflow-hidden">
        {/* Professional background image */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-luminosity" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=2071&q=80')",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div className="pointer-events-none absolute inset-0 funky-dot-grid opacity-20" />
        <div className="funky-aurora-band top-[30%]" style={{ animationDuration: '15s' }} />
        <div className="funky-noise-overlay" />
        
        {/* Decorative floating icons */}
        <FloatingShape className="left-[5%] top-[10%] funky-float-2" delay={0}>
          <div className="funky-icon-orb funky-icon-orb--amber"><Star size={22} /></div>
        </FloatingShape>
        <FloatingShape className="right-[8%] bottom-[15%] funky-float-1" delay={0.3}>
          <div className="funky-icon-orb funky-icon-orb--violet"><Gem size={20} /></div>
        </FloatingShape>
        <FloatingShape className="left-[50%] top-[5%] funky-float-3" delay={0.6}>
          <div className="funky-icon-orb funky-icon-orb--cyan"><Trophy size={18} /></div>
        </FloatingShape>
        
        <div className="container relative z-10">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block font-display text-sm font-bold uppercase tracking-widest funky-gradient-text"
              >
                <Award size={14} className="inline" /> Testimonials <Award size={14} className="inline" />
              </motion.span>
              <h2 className="mt-5 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                What Our <span className="funky-gradient-text">Users Say</span>
              </h2>
              <div className="mx-auto mt-5 funky-wave-divider w-28" />
            </div>
          </FadeInView>

          <div className="testimonials-grid grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, idx) => (
              <SpotlightCard key={t.name} spotlightColor={["hsl(210 100% 56% / 0.12)", "hsl(280 100% 60% / 0.12)", "hsl(330 100% 60% / 0.12)"][idx]}>
                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.08} glareBorderRadius="1rem" scale={1.02}>
                  <div className="testimonial-card funky-testimonial rounded-2xl border border-border glass-strong p-7 transition-all hover:border-primary/20 hover:shadow-card funky-card relative overflow-hidden h-full">
                    <div className="funky-noise-overlay rounded-2xl" />
                    <div className="relative z-10">
                      {/* Decorative quote mark */}
                      <div className="absolute -top-1 -right-1 text-6xl font-serif text-primary/5 select-none">"</div>
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <motion.div key={i} initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}>
                            <Star size={16} className="fill-warning text-warning" />
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground italic">"{t.text}"</p>
                      <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border/50">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 font-display text-sm font-bold text-primary ring-2 ring-primary/10">
                          {t.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-display text-sm font-bold text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section ref={faqRef} className="border-t border-border py-24 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-luminosity" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&w=2032&q=80')",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div className="pointer-events-none absolute inset-0 funky-animated-grid opacity-20" />
        <div className="funky-noise-overlay" />
        
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/5 blur-[100px] funky-liquid-blob" />
        <div className="pointer-events-none absolute -right-32 top-1/3 h-48 w-48 rounded-full bg-[#7b68ee]/5 blur-[80px] funky-liquid-blob" style={{ animationDelay: '-7s' }} />
        
        <div className="container relative z-10">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-14">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block font-display text-sm font-bold uppercase tracking-widest funky-gradient-text"
              >
                <HelpCircle size={14} className="inline" /> FAQ
              </motion.span>
              <h2 className="mt-5 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                Frequently Asked <span className="funky-gradient-text">Questions</span>
              </h2>
              <div className="mx-auto mt-5 funky-wave-divider w-32" />
            </div>
          </FadeInView>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} className="faq-item overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm transition-all hover:border-primary/20 funky-card relative">
                <SpotlightCard className="rounded-2xl">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between p-6 text-left group"
                  >
                    <span className="flex items-center gap-3 font-display text-sm font-bold text-foreground">
                      <motion.div
                        animate={{ rotate: openFaq === i ? 360 : 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0"
                      >
                        <HelpCircle size={16} className="funky-text-cycle" />
                      </motion.div>
                      <span className="group-hover:text-primary transition-colors">{faq.q}</span>
                    </span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                      className="ml-4 flex h-8 w-8 items-center justify-center rounded-lg bg-secondary shrink-0"
                    >
                      <ChevronDown size={16} className="text-muted-foreground" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="border-t border-border px-6 pb-6 pt-4">
                          <p className="text-sm leading-relaxed text-muted-foreground pl-11">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact — ISHU",
          "description": "Contact ISHU (Indian StudentHub University) team for any queries, feedback, or collaboration.",
          "url": "https://ishu.fun/contact",
          "mainEntity": {
            "@type": "EducationalOrganization",
            "name": "ISHU — Indian StudentHub University",
            "email": "ishukryk@gmail.com",
            "telephone": "+918986985813",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+918986985813",
              "contactType": "customer support",
              "availableLanguage": ["English", "Hindi"]
            }
          }
        })
      }} />
    </Layout>
  );
};

export default ContactPage;
