/**
 * PrivacyPage.tsx - Privacy Policy Page (137 lines)
 * 
 * Legal page explaining how user data is collected, used, and protected.
 * 
 * Sections covered:
 * - Information We Collect (name, email, phone, usage data)
 * - How We Use Your Information
 * - WhatsApp Notifications consent
 * - Data Security measures
 * - Cookies & Tracking
 * - Third-Party Services
 * - Data Retention policy
 * - User Rights (access, correct, delete data)
 * - Contact information for privacy inquiries
 * 
 * Features:
 * - Quick facts strip at top
 * - Animated section cards with icons
 * - GSAP scroll-triggered animations
 * - 3D tilt effects on cards
 */
import Layout from "@/components/layout/Layout";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";
import FadeInView from "@/components/animations/FadeInView";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, Database, Bell, Lock, Cookie, Globe, Clock, UserCheck, Mail, Eye, Server, FileCheck, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { icon: Database, title: "Information We Collect", content: "We collect information you provide directly: name, email, phone number, WhatsApp number, state, and exam category preferences. We also collect usage data including pages visited, tools used, and device information to improve our services.", color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-400" },
  { icon: Eye, title: "How We Use Your Information", content: "Your information is used to: provide exam result notifications via WhatsApp, personalize your experience based on state and exam preferences, improve our PDF tools and services, send important updates about vacancies and admit cards, and communicate with you regarding support requests.", color: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
  { icon: Bell, title: "WhatsApp Notifications", content: "By providing your WhatsApp number and subscribing to notifications, you consent to receive automated messages about new vacancies, results, and admit cards matching your selected categories. You can unsubscribe at any time through your account settings or by sending 'STOP' to our WhatsApp number.", color: "from-green-500/20 to-emerald-500/20", iconColor: "text-green-400" },
  { icon: Lock, title: "Data Security", content: "We implement industry-standard security measures to protect your personal information. Passwords are hashed using bcrypt, data is encrypted in transit via TLS, and we perform regular security audits. We never store your actual passwords.", color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400" },
  { icon: Cookie, title: "Cookies & Tracking", content: "We use essential cookies for authentication and session management. Analytics cookies help us understand how users interact with our platform. You can manage cookie preferences through your browser settings.", color: "from-rose-500/20 to-pink-500/20", iconColor: "text-rose-400" },
  { icon: Globe, title: "Third-Party Services", content: "We may use Google OAuth for authentication, Google Analytics for usage tracking, and WhatsApp Business API for notifications. These services have their own privacy policies that govern their use of your data.", color: "from-teal-500/20 to-cyan-500/20", iconColor: "text-teal-400" },
  { icon: Clock, title: "Data Retention", content: "We retain your personal data for as long as your account is active. Temporary files uploaded to our PDF tools are automatically deleted within 1 hour of processing. You can request account deletion at any time.", color: "from-indigo-500/20 to-blue-500/20", iconColor: "text-indigo-400" },
  { icon: UserCheck, title: "Your Rights", content: "You have the right to: access your personal data, correct inaccurate data, delete your account, opt out of notifications, and export your data. Contact us at ishukryk@gmail.com for any data-related requests.", color: "from-emerald-500/20 to-green-500/20", iconColor: "text-emerald-400" },
  { icon: Mail, title: "Contact Us", content: "For privacy-related inquiries, contact us at: Email: ishukryk@gmail.com | Phone: +91 8986985813 | WhatsApp: +91 8986985813", color: "from-purple-500/20 to-pink-500/20", iconColor: "text-purple-400" },
];

const quickFacts = [
  { icon: Shield, label: "End-to-End Encrypted", desc: "Your data is always secure" },
  { icon: Server, label: "No Data Selling", desc: "We never sell your info" },
  { icon: FileCheck, label: "GDPR Compliant", desc: "International standards" },
  { icon: Clock, label: "1 Hour Auto-Delete", desc: "PDF files removed fast" },
];

const PrivacyPage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".privacy-card",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: ".privacy-grid", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".quick-fact",
        { scale: 0.8, opacity: 0 },
        { scrollTrigger: { trigger: ".quick-facts-row", start: "top 85%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, ease: "back.out(1.7)", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <Layout>
      <SEOHead {...SEO_DATA.privacy} />

      {/* Dynamic Background Image */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1555561122-421712a2aa6a?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* Hero */}
      <section className="relative bg-gradient-hero py-28 overflow-hidden">
        <div className="bg-dots pointer-events-none absolute inset-0 opacity-20" />
        <motion.div animate={{ x: [0, 40, 0], y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[15%] top-[20%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />

        <div className="container relative">
          <FadeInView>
            <div className="mx-auto max-w-3xl text-center">
              <motion.div animate={{ y: [0, -8, 0], rotateY: [0, 360] }}
                transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" }, rotateY: { repeat: Infinity, duration: 8, ease: "linear" } }}
                className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                style={{ transformStyle: "preserve-3d" }}>
                <Shield size={32} className="text-primary" />
              </motion.div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm">
                <Lock size={12} className="text-primary" />
                <span className="font-semibold text-foreground">ISHU — Indian StudentHub University</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
                Privacy <span className="text-shimmer">Policy</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">Last updated: March 8, 2026</p>
              <p className="mt-2 text-muted-foreground">
                At ISHU (Indian StudentHub University), we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.
              </p>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="border-b border-border bg-card py-12">
        <div className="container">
          <div className="quick-facts-row grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">
            {quickFacts.map((f) => (
              <div key={f.label} className="quick-fact flex items-center gap-3 rounded-xl border border-border glass p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section ref={sectionRef} className="relative py-20 overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
        <div className="container relative">
          <div className="privacy-grid mx-auto max-w-4xl space-y-6">
            {sections.map((s, i) => (
              <Tilt key={s.title} tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable glareMaxOpacity={0.04} glareBorderRadius="1rem" scale={1.01}>
                <div className={`privacy-card group relative overflow-hidden rounded-2xl border border-border glass-strong p-6 transition-all hover:border-primary/20 hover:shadow-card`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                  <div className="relative flex gap-5">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <s.icon size={22} className={s.iconColor} />
                      </div>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                        {s.title}
                        <ChevronRight size={14} className="text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.content}</p>
                    </div>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPage;
