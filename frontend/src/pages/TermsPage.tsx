/**
 * TermsPage.tsx - Terms of Service Page (110 lines)
 * 
 * Legal page defining the rules and conditions for using the platform.
 * 
 * Sections covered:
 * - Acceptance of Terms
 * - Description of Services
 * - User Accounts rules
 * - PDF Tools Usage policy (files auto-deleted in 1 hour)
 * - WhatsApp Notifications terms
 * - Content Accuracy disclaimer
 * - Intellectual Property rights
 * - Prohibited Activities
 * - Limitation of Liability
 * - Changes to Terms
 * - Contact information
 * 
 * Features: Animated section cards, GSAP animations, 3D tilt effects
 */
import Layout from "@/components/layout/Layout";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";
import FadeInView from "@/components/animations/FadeInView";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, CheckCircle, Globe, User, Wrench, Bell, AlertTriangle, Scale, Ban, RefreshCw, Mail, ChevronRight, Shield, Gavel } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { icon: CheckCircle, title: "Acceptance of Terms", content: "By accessing and using ISHU (Indian StudentHub University), you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our services.", color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-400" },
  { icon: Globe, title: "Description of Services", content: "ISHU provides: government exam results and vacancy information for central and all 36 state/UT exams, 100+ free PDF tools for document processing, daily news feed across 30+ categories in multiple languages, blog content for exam preparation, and WhatsApp notification service for new vacancies and results.", color: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
  { icon: User, title: "User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information during registration including your name, email, phone number, and WhatsApp number. You must be at least 13 years old to create an account.", color: "from-emerald-500/20 to-green-500/20", iconColor: "text-emerald-400" },
  { icon: Wrench, title: "PDF Tools Usage", content: "Our PDF tools are provided free of charge for personal and educational use. Files uploaded for processing are automatically deleted within 1 hour. We do not access, read, or store the content of your uploaded files beyond the processing period. Maximum file size limits apply as specified on each tool page.", color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400" },
  { icon: Bell, title: "WhatsApp Notifications", content: "By subscribing to WhatsApp notifications, you consent to receive automated messages. You can unsubscribe at any time. We are not responsible for WhatsApp delivery failures or delays. Message frequency depends on your subscribed categories.", color: "from-green-500/20 to-emerald-500/20", iconColor: "text-green-400" },
  { icon: AlertTriangle, title: "Content Accuracy", content: "While we strive for accuracy, all exam results, vacancy details, and dates should be verified from official sources before making decisions. We aggregate information from official government websites but are not an official government body.", color: "from-rose-500/20 to-pink-500/20", iconColor: "text-rose-400" },
  { icon: Scale, title: "Intellectual Property", content: "All content, design, code, and branding on ISHU are our intellectual property. News articles are sourced with proper attribution. You may not reproduce, distribute, or create derivative works without permission.", color: "from-indigo-500/20 to-blue-500/20", iconColor: "text-indigo-400" },
  { icon: Ban, title: "Prohibited Activities", content: "You may not: use automated bots to scrape our content, attempt to breach our security systems, upload malicious files to our tools, impersonate others, or use our platform for any illegal purpose.", color: "from-red-500/20 to-orange-500/20", iconColor: "text-red-400" },
  { icon: Shield, title: "Limitation of Liability", content: "ISHU is provided 'as is' without warranties. We are not liable for any damages arising from the use of our services, including but not limited to missed deadlines, incorrect information, or service interruptions.", color: "from-teal-500/20 to-cyan-500/20", iconColor: "text-teal-400" },
  { icon: RefreshCw, title: "Changes to Terms", content: "We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms.", color: "from-purple-500/20 to-pink-500/20", iconColor: "text-purple-400" },
  { icon: Mail, title: "Contact", content: "For questions about these terms, contact us at: Email: ishukryk@gmail.com | Phone: +91 8986985813 | WhatsApp: +91 8986985813", color: "from-blue-500/20 to-indigo-500/20", iconColor: "text-blue-400" },
];

const TermsPage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".terms-card",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: ".terms-grid", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power3.out", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <Layout>
      <SEOHead {...SEO_DATA.terms} />

      {/* Dynamic Background Image */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* Hero */}
      <section className="relative bg-gradient-hero pt-8 pb-16 overflow-hidden">
        <div className="bg-dots pointer-events-none absolute inset-0 opacity-20" />
        <motion.div animate={{ x: [0, -30, 0], y: [0, 25, 0] }} transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[15%] top-[20%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />
        <motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[8%] bottom-[25%] h-40 w-40 rounded-full bg-accent/5 blur-[80px]" />

        <div className="container relative">
          <FadeInView>
            <div className="mx-auto max-w-3xl text-center">
              <motion.div animate={{ y: [0, -8, 0], rotateY: [0, 360] }}
                transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" }, rotateY: { repeat: Infinity, duration: 8, ease: "linear" } }}
                className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                style={{ transformStyle: "preserve-3d" }}>
                <Gavel size={32} className="text-primary" />
              </motion.div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm">
                <FileText size={12} className="text-primary" />
                <span className="font-semibold text-foreground">ISHU — Indian StudentHub University</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
                Terms of <span className="text-shimmer">Service</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">Last updated: March 8, 2026</p>
              <p className="mt-2 text-muted-foreground">
                Please read these Terms of Service carefully before using the ISHU platform.
              </p>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Content */}
      <section ref={sectionRef} className="relative py-20 overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
        <div className="container relative">
          <div className="terms-grid mx-auto max-w-4xl space-y-6">
            {sections.map((s, i) => (
              <Tilt key={s.title} tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable glareMaxOpacity={0.04} glareBorderRadius="1rem" scale={1.01}>
                <div className={`terms-card group relative overflow-hidden rounded-2xl border border-border glass-strong p-6 transition-all hover:border-primary/20 hover:shadow-card`}>
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

export default TermsPage;
