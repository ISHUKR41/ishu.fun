/**
 * ContactPage.tsx - Contact Us Page (Professional Modern v4 - Ultra Premium)
 * 
 * FULLY professional, modern, animated, smooth contact page.
 * All existing functionality preserved: form, Supabase, Formspree, SEO.
 * 
 * Features:
 * - Contact form with name, email, phone, subject, message fields
 * - Form validation and loading state
 * - Success/error toast notifications
 * - Contact info cards (email, phone, WhatsApp, address)
 * - Real Google Maps embed with dark theme
 * - Social media links
 * - FAQ section with smooth accordion
 * - Testimonials section
 * - Professional premium design with glassmorphism + aurora effects
 * - Framer Motion & GSAP animations (smooth, not over-the-top)
 * - CSS-only background effects for ZERO lag
 * - SEO: BreadcrumbSchema + ContactPage schema
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Mail, Phone, MessageCircle, MapPin, Send, Check, Clock,
  Upload, Twitter, Youtube, Instagram, Linkedin, Globe, ArrowRight, Loader2,
  Sparkles, Users, Headphones, Shield, ChevronDown, HelpCircle, Star, Zap,
  ExternalLink, Rocket, ChevronRight, Heart, Award, MessageSquare
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
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

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "General", message: "" });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleHeroMouse = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const heroSpotlightX = useSpring(useTransform(mouseX, [0, 1], [20, 80]), { stiffness: 80, damping: 30 });
  const heroSpotlightY = useSpring(useTransform(mouseY, [0, 1], [20, 80]), { stiffness: 80, damping: 30 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-stat-item",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: { trigger: ".stats-row", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out",
        }
      );
      gsap.fromTo(".faq-item",
        { y: 20, opacity: 0, x: -10 },
        {
          scrollTrigger: { trigger: ".faq-section", start: "top 80%", toggleActions: "play none none none" },
          y: 0, opacity: 1, x: 0, stagger: 0.08, duration: 0.5, ease: "power3.out",
        }
      );
      gsap.fromTo(".contact-card-animate",
        { y: 40, opacity: 0, scale: 0.95 },
        {
          scrollTrigger: { trigger: ".contact-cards-section", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: "power3.out",
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
    } catch { }

    const { error: dbError } = await supabase.from("contacts").insert({
      name: form.name, email: form.email, phone: form.phone || null, subject: form.subject, message: form.message,
    });

    setLoading(false);

    if (!formspreeOk && dbError) {
      toast({ title: "Failed to send", description: "Please try again or contact us via WhatsApp.", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "Message sent successfully!" });
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors: ['#3b82f6', '#6366f1', '#8b5cf6', '#06b6d4'] });
      setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.2 }, colors: ['#3b82f6', '#6366f1'] }), 400);
      setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5, x: 0.8 }, colors: ['#8b5cf6', '#06b6d4'] }), 700);
    }
  };

  return (
    <Layout>
      <SEOHead {...SEO_DATA.contact} />
      <BreadcrumbSchema items={[{ name: "Contact", url: "/contact" }]} />

      {/* ═══════════════ HERO ═══════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouse}
        className="relative overflow-hidden pt-20 pb-32 md:pt-28 md:pb-40"
        style={{ background: "linear-gradient(135deg, hsl(225 50% 4%) 0%, hsl(230 45% 8%) 40%, hsl(260 40% 10%) 70%, hsl(225 50% 4%) 100%)" }}
      >
        {/* Animated aurora gradient orbs */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px]"
          style={{ background: "radial-gradient(circle, hsl(210 100% 56% / 0.4), transparent 70%)" }} />
        <div className="pointer-events-none absolute -right-32 top-1/4 h-[400px] w-[400px] rounded-full opacity-25 blur-[100px]"
          style={{ background: "radial-gradient(circle, hsl(280 80% 60% / 0.35), transparent 70%)" }} />
        <div className="pointer-events-none absolute left-1/3 -bottom-32 h-[350px] w-[350px] rounded-full opacity-20 blur-[90px]"
          style={{ background: "radial-gradient(circle, hsl(170 80% 50% / 0.3), transparent 70%)" }} />

        {/* Fine grid pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }} />

        {/* Floating geometric shapes */}
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[12%] top-[18%] hidden md:block"
        >
          <div className="h-16 w-16 rounded-2xl border border-primary/10 bg-primary/5 backdrop-blur-sm" style={{ transform: "rotate(15deg)" }} />
        </motion.div>
        <motion.div
          animate={{ y: [6, -10, 6], rotate: [0, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="pointer-events-none absolute left-[8%] bottom-[22%] hidden md:block"
        >
          <div className="h-12 w-12 rounded-xl border border-violet-500/10 bg-violet-500/5 backdrop-blur-sm" style={{ transform: "rotate(-10deg)" }} />
        </motion.div>
        <motion.div
          animate={{ y: [-5, 12, -5], x: [-3, 5, -3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="pointer-events-none absolute right-[25%] bottom-[15%] hidden lg:block"
        >
          <div className="h-10 w-10 rounded-full border border-cyan-500/10 bg-cyan-500/5 backdrop-blur-sm" />
        </motion.div>

        {/* Mouse-tracking spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background: useTransform(
              [heroSpotlightX, heroSpotlightY],
              ([x, y]) => `radial-gradient(600px circle at ${x}% ${y}%, hsl(210 100% 56% / 0.06), transparent 60%)`
            ),
          }}
        />

        <div className="container relative z-10">
          <FadeInView>
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm backdrop-blur-md"
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <MessageSquare size={14} className="text-primary" />
                </motion.div>
                <span className="font-semibold text-primary">Contact ISHU — Indian StudentHub University</span>
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="h-2 w-2 rounded-full bg-green-500"
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display text-4xl font-bold text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]"
              >
                Get in{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                    Touch
                  </span>
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-primary via-violet-500 to-cyan-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed"
              >
                Have a question, feedback, or collaboration idea? Our team is here to help you — reach out via the form below, WhatsApp, or email.
              </motion.p>

              {/* Quick action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-10 flex flex-wrap items-center justify-center gap-3"
              >
                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href="https://wa.me/918986985813?text=Hello%2C%20I%20have%20a%20question%20about%20ISHU"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-600/25 transition-all hover:bg-green-700 hover:shadow-green-600/35"
                >
                  <MessageCircle size={16} />
                  WhatsApp Chat
                  <ArrowRight size={14} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href="mailto:ishukryk@gmail.com"
                  className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/50 backdrop-blur-md px-7 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <Mail size={16} />
                  Send Email
                </motion.a>
              </motion.div>
            </div>
          </FadeInView>
        </div>

        {/* Bottom gradient fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════════════ CONTACT CARDS ═══════════════ */}
      <section className="contact-cards-section relative -mt-16 pb-16 z-10">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Phone, label: "Phone", value: "+91 8986985813", href: "tel:8986985813", color: "text-blue-400", bg: "bg-blue-500/10", borderHover: "hover:border-blue-500/30", ring: "ring-blue-500/10" },
              { icon: Mail, label: "Email", value: "ishukryk@gmail.com", href: "mailto:ishukryk@gmail.com", color: "text-violet-400", bg: "bg-violet-500/10", borderHover: "hover:border-violet-500/30", ring: "ring-violet-500/10" },
              { icon: MessageCircle, label: "WhatsApp", value: "Chat instantly", href: "https://wa.me/918986985813", color: "text-green-400", bg: "bg-green-500/10", borderHover: "hover:border-green-500/30", ring: "ring-green-500/10" },
              { icon: Clock, label: "Response", value: "Within 24 hours", href: null, color: "text-amber-400", bg: "bg-amber-500/10", borderHover: "hover:border-amber-500/30", ring: "ring-amber-500/10" },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                className="contact-card-animate"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} glareEnable glareMaxOpacity={0.06} glareBorderRadius="1rem" scale={1.02} transitionSpeed={2000}>
                  {card.href ? (
                    <a
                      href={card.href}
                      target={card.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-4 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-md p-5 shadow-sm transition-all ${card.borderHover} hover:shadow-lg hover:-translate-y-1`}
                    >
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bg} ring-1 ${card.ring} transition-transform group-hover:scale-110`}>
                        <card.icon size={22} className={card.color} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{card.label}</p>
                        <p className="mt-0.5 text-sm font-semibold text-foreground truncate">{card.value}</p>
                      </div>
                      <ExternalLink size={14} className="ml-auto shrink-0 text-muted-foreground/20 group-hover:text-primary/60 transition-colors" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-md p-5 shadow-sm">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.bg} ring-1 ${card.ring}`}>
                        <card.icon size={22} className={card.color} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{card.label}</p>
                        <p className="mt-0.5 text-sm font-semibold text-foreground">{card.value}</p>
                      </div>
                    </div>
                  )}
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="stats-row border-y border-border/50 py-14" style={{ background: "linear-gradient(180deg, hsl(225 50% 5%) 0%, hsl(225 50% 4%) 100%)" }}>
        <div className="container">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { icon: Users, label: "Users Served", value: "1M+", color: "text-blue-400", bg: "bg-blue-500/10", gradient: "from-blue-500/20 to-blue-500/0" },
              { icon: Headphones, label: "Queries Resolved", value: "50K+", color: "text-violet-400", bg: "bg-violet-500/10", gradient: "from-violet-500/20 to-violet-500/0" },
              { icon: Shield, label: "Uptime", value: "99.9%", color: "text-green-400", bg: "bg-green-500/10", gradient: "from-green-500/20 to-green-500/0" },
              { icon: Clock, label: "Avg Response", value: "<2 hrs", color: "text-amber-400", bg: "bg-amber-500/10", gradient: "from-amber-500/20 to-amber-500/0" },
            ].map((stat) => (
              <motion.div key={stat.label} whileHover={{ y: -4, scale: 1.02 }} className="contact-stat-item text-center group">
                <div className={`relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg} ring-1 ring-white/5 transition-all group-hover:ring-primary/20`}>
                  <stat.icon size={24} className={stat.color} />
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MAIN CONTENT — FORM + MAP ═══════════════ */}
      <section className="py-20 relative">
        {/* Subtle background aurora */}
        <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full opacity-[0.03] blur-[120px]"
          style={{ background: "radial-gradient(circle, hsl(210 100% 56%), transparent 70%)" }} />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full opacity-[0.03] blur-[100px]"
          style={{ background: "radial-gradient(circle, hsl(280 80% 60%), transparent 70%)" }} />
        
        <div className="container relative">
          <div className="grid gap-10 lg:grid-cols-5">

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <FadeInView delay={0.05}>
                {!submitted ? (
                  <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-8 shadow-xl shadow-black/5 md:p-10 relative overflow-hidden">
                    {/* Decorative corner gradient */}
                    <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/5 blur-[60px]" />

                    <div className="mb-8 flex items-center gap-3 relative">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/10 ring-1 ring-primary/10">
                        <Send size={18} className="text-primary" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-bold text-foreground">Send us a Message</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">We'll respond within 24 hours</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="group">
                          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <Users size={13} className="text-muted-foreground" /> Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            required type="text" value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all duration-300"
                            placeholder="Your full name"
                          />
                        </div>
                        <div className="group">
                          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <Mail size={13} className="text-muted-foreground" /> Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            required type="email" value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all duration-300"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <Phone size={13} className="text-muted-foreground" /> Phone Number
                          </label>
                          <input
                            type="tel" value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all duration-300"
                            placeholder="+91 (optional)"
                          />
                        </div>
                        <div>
                          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <Sparkles size={13} className="text-muted-foreground" /> Subject
                          </label>
                          <select
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            className="w-full rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all duration-300"
                          >
                            {["General", "Technical Issue", "Collaboration", "Complaint", "Suggestion"].map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
                          <MessageCircle size={13} className="text-muted-foreground" /> Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          rows={5}
                          className="w-full rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all duration-300 resize-none"
                          placeholder="Tell us how we can help you..."
                        />
                      </div>

                      <div>
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border/60 bg-secondary/20 backdrop-blur-sm px-4 py-3.5 transition-all hover:border-primary/30 hover:bg-secondary/40 group">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/10 transition-all group-hover:ring-primary/20">
                            <Upload size={14} className="text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {attachment ? attachment.name : "Attach a file (PDF, DOC, image — max 5MB)"}
                          </span>
                          <input
                            type="file" className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-primary to-violet-600 px-8 py-4 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
                      >
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        {loading ? (
                          <><Loader2 size={18} className="animate-spin" /> Sending your message...</>
                        ) : (
                          <><Send size={16} /> Send Message <ArrowRight size={16} /></>
                        )}
                      </motion.button>
                    </form>
                  </div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="rounded-2xl border border-green-500/20 bg-green-500/5 backdrop-blur-md p-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 250, damping: 15, delay: 0.15 }}
                      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border-2 border-green-500/20"
                    >
                      <Check size={40} className="text-green-500" />
                    </motion.div>
                    <h2 className="font-display text-3xl font-bold text-foreground">Thank You!</h2>
                    <p className="mt-3 text-muted-foreground max-w-sm mx-auto">
                      Your message has been received. We'll get back to you within 24 hours.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "General", message: "" }); setAttachment(null); }}
                        className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                      >
                        Send Another Message
                      </button>
                      <a href="https://wa.me/918986985813" target="_blank" rel="noopener noreferrer"
                        className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                      >
                        Chat on WhatsApp
                      </a>
                    </div>
                    <p className="mt-5 text-xs text-muted-foreground">
                      Reference ID: {Date.now().toString(36).toUpperCase()}
                    </p>
                  </motion.div>
                )}
              </FadeInView>
            </div>

            {/* Right Column — Map + Quick Contact + Socials */}
            <div className="space-y-5 lg:col-span-2">
              <FadeInView delay={0.1}>
                {/* Google Maps Embed with dark overlay */}
                <div className="overflow-hidden rounded-2xl border border-border/50 shadow-lg relative group">
                  <div className="relative">
                    <iframe
                      title="ISHU India Location Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14852583.397624!2d68.17664!3d20.593684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                      width="100%"
                      height="260"
                      style={{ border: 0, display: "block", filter: "brightness(0.85) contrast(1.1) saturate(0.8)" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/20">
                          <MapPin size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">India — Available Nationwide</p>
                          <p className="text-[10px] text-muted-foreground">28 States + 8 Union Territories</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInView>

              {/* Quick Contact Details */}
              <FadeInView delay={0.15}>
                <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                      <Phone size={13} className="text-primary" />
                    </div>
                    Quick Contact
                  </h3>
                  <div className="space-y-2">
                    {[
                      { icon: Phone, label: "+91 8986985813", href: "tel:8986985813", iconColor: "text-blue-400", iconBg: "bg-blue-500/10" },
                      { icon: Mail, label: "ishukryk@gmail.com", href: "mailto:ishukryk@gmail.com", iconColor: "text-violet-400", iconBg: "bg-violet-500/10" },
                      { icon: MessageCircle, label: "WhatsApp: 8986985813", href: "https://wa.me/918986985813", iconColor: "text-green-400", iconBg: "bg-green-500/10" },
                    ].map((item) => (
                      <a key={item.label} href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl p-2.5 text-sm text-muted-foreground transition-all hover:bg-secondary/50 hover:text-foreground hover:translate-x-1 group"
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}>
                          <item.icon size={13} className={item.iconColor} />
                        </div>
                        <span className="font-medium">{item.label}</span>
                        <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-all text-muted-foreground" />
                      </a>
                    ))}
                    <div className="flex items-center gap-3 rounded-xl p-2.5 text-sm text-muted-foreground">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                        <Clock size={13} className="text-amber-400" />
                      </div>
                      <span className="font-medium">Mon–Sat, 9AM – 8PM IST</span>
                    </div>
                  </div>
                </div>
              </FadeInView>

              {/* WhatsApp CTA */}
              <FadeInView delay={0.2}>
                <motion.a
                  whileHover={{ y: -2 }}
                  href="https://wa.me/918986985813?text=Hello%2C%20I%20have%20a%20question%20about%20ISHU"
                  target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-green-500/15 bg-gradient-to-br from-green-500/5 to-green-500/10 p-5 transition-all hover:border-green-500/25 hover:shadow-lg shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/15 ring-1 ring-green-500/10">
                    <MessageCircle size={22} className="text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Prefer instant chat?</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Reply within minutes on WhatsApp</p>
                  </div>
                  <ArrowRight size={16} className="ml-auto text-green-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                </motion.a>
              </FadeInView>

              {/* Social Media Links */}
              <FadeInView delay={0.25}>
                <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                      <Globe size={13} className="text-primary" />
                    </div>
                    Follow Us
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { icon: Twitter, label: "Twitter", href: "#", color: "hover:text-sky-400 hover:border-sky-400/30 hover:bg-sky-400/5 hover:ring-sky-400/10" },
                      { icon: Youtube, label: "YouTube", href: "#", color: "hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 hover:ring-red-400/10" },
                      { icon: Instagram, label: "Instagram", href: "#", color: "hover:text-pink-400 hover:border-pink-400/30 hover:bg-pink-400/5 hover:ring-pink-400/10" },
                      { icon: Linkedin, label: "LinkedIn", href: "#", color: "hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-400/5 hover:ring-blue-400/10" },
                      { icon: Globe, label: "Website", href: "/", color: "hover:text-primary hover:border-primary/30 hover:bg-primary/5 hover:ring-primary/10" },
                    ].map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        whileHover={{ y: -3, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={social.label}
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border border-border/50 bg-secondary/30 text-muted-foreground ring-1 ring-transparent transition-all ${social.color}`}
                      >
                        <social.icon size={16} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </FadeInView>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="border-t border-border/50 py-20" style={{ background: "linear-gradient(180deg, hsl(225 50% 5%) 0%, hsl(225 50% 4%) 100%)" }}>
        <div className="container">
          <FadeInView>
            <div className="mb-12 text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <Heart size={12} className="text-red-400" /> Testimonials
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
                What Our <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Users Say</span>
              </h2>
            </div>
          </FadeInView>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <FadeInView key={t.name} delay={idx * 0.1}>
                <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable glareMaxOpacity={0.04} glareBorderRadius="1rem" scale={1.01}>
                  <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-6 shadow-sm transition-all hover:shadow-lg hover:border-primary/15 h-full relative overflow-hidden group">
                    {/* Subtle hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-violet-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="flex gap-0.5 mb-4">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground italic">"{t.text}"</p>
                      <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border/30">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-violet-500/10 text-sm font-bold text-primary ring-2 ring-primary/10">
                          {t.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="faq-section border-t border-border/50 py-20">
        <div className="container">
          <FadeInView>
            <div className="mb-12 text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                <HelpCircle size={12} /> FAQ
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
                Frequently Asked <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Questions</span>
              </h2>
            </div>
          </FadeInView>

          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-md transition-all hover:border-primary/15">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4.5 text-left"
                >
                  <span className="flex items-center gap-3 text-sm font-semibold text-foreground pr-4">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${openFaq === i ? 'bg-primary/15 ring-1 ring-primary/20' : 'bg-primary/10'}`}>
                      <HelpCircle size={14} className="text-primary" />
                    </div>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${openFaq === i ? 'bg-primary/10' : 'bg-secondary/50'}`}
                  >
                    <ChevronDown size={14} className="text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="border-t border-border/30 px-6 pb-5 pt-4 pl-16">
                        <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
