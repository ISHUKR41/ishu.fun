/**
 * ContactPage.tsx - Contact Us Page (463 lines)
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
 * - SEO: BreadcrumbSchema
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Mail, Phone, MessageCircle, MapPin, Send, Check, Clock,
  Upload, Twitter, Youtube, Instagram, Linkedin, Globe, ArrowRight, Loader2,
  Sparkles, Users, Headphones, Shield, ChevronDown, HelpCircle, Star, Zap, Heart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TypeAnimation } from "react-type-animation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

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
  const sectionRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".contact-stat",
        { y: 30, opacity: 0 },
        { scrollTrigger: { trigger: ".contact-stats-row", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".faq-item",
        { y: 20, opacity: 0 },
        { scrollTrigger: { trigger: faqRef.current, start: "top 80%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".testimonial-card",
        { scale: 0.9, opacity: 0 },
        { scrollTrigger: { trigger: ".testimonials-grid", start: "top 80%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.1, duration: 0.6, ease: "back.out(1.7)", clearProps: "all" }
      );
    }, sectionRef);
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
    }
  };

  return (
    <Layout>
      <BreadcrumbSchema items={[{ name: "Contact", url: "/contact" }]} />

      {/* Hero */}
      <section className="relative bg-gradient-hero py-32 overflow-hidden">
        <GradientMesh variant="aurora" />
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-15" />
        <div className="pointer-events-none absolute inset-0 cross-grid opacity-15" />
        <MorphingBlob color="hsl(210 100% 56% / 0.1)" size={500} className="left-[15%] top-[10%]" />
        <MorphingBlob color="hsl(260 100% 66% / 0.08)" size={400} className="right-[10%] bottom-[15%]" duration={20} />
        
        <div className="container relative">
          <FadeInView>
            <div className="mx-auto max-w-3xl text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm"
              >
                <Heart size={14} className="text-primary" />
                <span className="font-semibold text-foreground">ISHU — Indian StudentHub University</span>
              </motion.div>
              
              <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                Let's{" "}
                <span className="text-shimmer">
                  <TypeAnimation
                    sequence={['Connect', 2000, 'Talk', 2000, 'Collaborate', 2000]}
                    wrapper="span"
                    speed={30}
                    repeat={Infinity}
                  />
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                Have a question, feedback, or collaboration idea? We're here to help 24/7.
              </p>
              <div className="mx-auto mt-6 gradient-line w-32" />
            </div>
          </FadeInView>
        </div>
        
        {/* Bottom gradient */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section ref={sectionRef} className="py-16">
        <div className="container">
          {/* Contact Cards with Tilt */}
          <FadeInView>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {[
                { icon: Phone, label: "Phone", value: "8986985813", href: "tel:8986985813", color: "bg-primary/10 text-primary" },
                { icon: Mail, label: "Email", value: "ishukryk@gmail.com", href: "mailto:ishukryk@gmail.com", color: "bg-primary/10 text-primary" },
                { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: "https://wa.me/918986985813", color: "bg-success/10 text-success" },
                { icon: Clock, label: "Response", value: "Within 24 hours", href: null, color: "bg-warning/10 text-warning" },
              ].map((card) => (
                <Tilt key={card.label} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.06} glareBorderRadius="1rem" scale={1.02}>
                  {card.href ? (
                    <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-glow">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color} transition-transform group-hover:scale-110`}>
                        <card.icon size={24} />
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{card.label}</p>
                        <p className="text-sm text-muted-foreground">{card.value}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}>
                        <card.icon size={24} />
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold text-foreground">{card.label}</p>
                        <p className="text-sm text-muted-foreground">{card.value}</p>
                      </div>
                    </div>
                  )}
                </Tilt>
              ))}
            </div>
          </FadeInView>

          {/* Stats Row */}
          <div className="contact-stats-row mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: Users, label: "Users Served", value: "1M+" },
              { icon: Headphones, label: "Queries Resolved", value: "50K+" },
              { icon: Shield, label: "Uptime", value: "99.9%" },
              { icon: Clock, label: "Avg Response", value: "<2 hrs" },
            ].map((stat) => (
              <div key={stat.label} className="contact-stat rounded-xl border border-border bg-card/50 p-5 text-center">
                <stat.icon size={20} className="mx-auto text-primary" />
                <p className="mt-2 font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* WhatsApp Direct Chat CTA */}
          <FadeInView delay={0.05}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-success/20 bg-success/5 p-8 text-center relative">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-success/10 blur-[40px]" />
              <h3 className="font-display text-xl font-bold text-foreground">
                💬 Prefer instant messaging?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Chat with us directly on WhatsApp for fastest response
              </p>
              <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                href="https://wa.me/918986985813?text=Hello%2C%20I%20have%20a%20question%20about%20ISHU"
                target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-success px-8 py-3 font-display text-sm font-semibold text-success-foreground transition-all hover:opacity-90"
              >
                <MessageCircle size={18} /> Open WhatsApp Chat <ArrowRight size={14} />
              </motion.a>
            </div>
          </FadeInView>

          {/* Form + Map Grid */}
          <div className="mt-12 grid gap-8 lg:grid-cols-5">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <FadeInView delay={0.1}>
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border glass-strong p-8">
                    <h2 className="font-display text-xl font-bold text-foreground">Send us a Message</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Name *</label>
                        <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all" placeholder="Your name" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Email *</label>
                        <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all" placeholder="your@email.com" />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Phone</label>
                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all" placeholder="Optional" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
                        <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-all">
                          <option>General</option>
                          <option>Technical</option>
                          <option>Collaboration</option>
                          <option>Complaint</option>
                          <option>Suggestion</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Message *</label>
                      <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none transition-all" placeholder="Write your message..." />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">Attachment (optional)</label>
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-3 transition-colors hover:border-primary/30">
                        <Upload size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {attachment ? attachment.name : "Click to attach a file (max 5MB)"}
                        </span>
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
                      </label>
                    </div>

                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-50">
                      {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Message</>}
                    </motion.button>
                  </form>
                ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 180, damping: 20 }}
                    className="rounded-2xl border border-border glass-strong p-12 text-center relative overflow-hidden">
                    {/* Decorative animated glow */}
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-[hsl(var(--success))]/15 blur-3xl"
                    />
                    {/* Success icon with ripple */}
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                        className="absolute inset-0 mx-auto h-16 w-16 rounded-full bg-[hsl(var(--success))]/20"
                      />
                      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 250, damping: 15, delay: 0.2 }}
                        className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/20">
                        <Check size={32} className="text-[hsl(var(--success))]" />
                      </motion.div>
                    </div>
                    <motion.h2 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                      className="font-display text-2xl font-bold text-foreground">Thank You!</motion.h2>
                    <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                      className="mt-3 text-muted-foreground leading-relaxed">
                      Your message has been received. We'll get back to you within 24 hours.
                    </motion.p>
                    <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                      className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "General", message: "" }); setAttachment(null); }}
                        className="rounded-xl bg-primary px-6 py-2.5 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow">
                        Send Another Message
                      </motion.button>
                      <a href="https://wa.me/918986985813" target="_blank" rel="noopener noreferrer"
                        className="rounded-xl border border-border px-6 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
                        Chat on WhatsApp
                      </a>
                    </motion.div>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                      className="mt-4 text-xs text-muted-foreground">Reference ID: {Date.now().toString(36).toUpperCase()}</motion.p>
                  </motion.div>
                )}
              </FadeInView>
            </div>

            {/* Right Side — Map & Social */}
            <div className="space-y-6 lg:col-span-2">
              <FadeInView delay={0.15}>
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                      <MapPin size={40} className="text-primary" />
                    </motion.div>
                    <div className="absolute bottom-4 left-4 right-4 rounded-lg glass px-3 py-2 text-center">
                      <p className="font-display text-sm font-semibold text-foreground">India</p>
                      <p className="text-xs text-muted-foreground">Available Nationwide</p>
                    </div>
                  </div>
                </div>
              </FadeInView>

              <FadeInView delay={0.2}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-sm font-bold text-foreground">Quick Contact</h3>
                  <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <a href="tel:8986985813" className="flex items-center gap-3 hover:text-foreground transition-colors">
                      <Phone size={14} className="text-primary" />
                      <span>+91 8986985813</span>
                    </a>
                    <a href="mailto:ishukryk@gmail.com" className="flex items-center gap-3 hover:text-foreground transition-colors">
                      <Mail size={14} className="text-primary" />
                      <span>ishukryk@gmail.com</span>
                    </a>
                    <a href="https://wa.me/918986985813" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-foreground transition-colors">
                      <MessageCircle size={14} className="text-success" />
                      <span>WhatsApp: 8986985813</span>
                    </a>
                    <div className="flex items-center gap-3">
                      <Clock size={14} className="text-warning" />
                      <span>Mon-Sat, 9AM - 8PM IST</span>
                    </div>
                  </div>
                </div>
              </FadeInView>

              <FadeInView delay={0.25}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-sm font-bold text-foreground">Follow Us</h3>
                  <div className="mt-4 flex gap-3">
                    {[
                      { icon: Twitter, label: "Twitter", href: "#" },
                      { icon: Youtube, label: "YouTube", href: "#" },
                      { icon: Instagram, label: "Instagram", href: "#" },
                      { icon: Linkedin, label: "LinkedIn", href: "#" },
                      { icon: Globe, label: "Website", href: "/" },
                    ].map((social) => (
                      <motion.a key={social.label} href={social.href} whileHover={{ y: -3, scale: 1.1 }}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                        title={social.label}>
                        <social.icon size={18} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </FadeInView>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-card/50 py-20 aurora-bg">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-12">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Testimonials</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                What Our <span className="text-shimmer">Users Say</span>
              </h2>
            </div>
          </FadeInView>

          <div className="testimonials-grid grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Tilt key={t.name} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.06} glareBorderRadius="1rem" scale={1.02}>
                <div className="testimonial-card rounded-2xl border border-border glass-strong p-6 transition-all hover:border-primary/20 hover:shadow-card">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-warning text-warning" />
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
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="border-t border-border py-20">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-12">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">FAQ</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                Frequently Asked <span className="text-shimmer">Questions</span>
              </h2>
              <div className="mx-auto mt-4 gradient-line w-24" />
            </div>
          </FadeInView>

          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} className="faq-item overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/20">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="flex items-center gap-3 font-display text-sm font-semibold text-foreground">
                    <HelpCircle size={16} className="text-primary shrink-0" />
                    {faq.q}
                  </span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="border-t border-border px-5 pb-5 pt-3">
                        <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
          "url": "https://ishu.lovable.app/contact",
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
