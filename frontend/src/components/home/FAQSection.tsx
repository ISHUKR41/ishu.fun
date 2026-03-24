/**
 * FAQSection.tsx — Frequently Asked Questions
 *
 * Accordion FAQ with 10 rich questions about ISHU.
 * Performance: CSS-only backgrounds (zero JS decorative animations).
 * SEO: FAQPage schema markup injected inline.
 */

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, MessageCircle, HelpCircle, Shield, Zap, Star, Phone } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "What is ISHU — Indian StudentHub University?",
    a: "ISHU (ishu.fun) is India's #1 free platform for government exam results, vacancies, admit cards, answer keys, 100+ PDF tools, 700+ live TV channels, YouTube/Terabox video downloader, free resume and CV maker, and 1000+ daily news articles. Everything is completely free — no registration, no hidden charges.",
    icon: HelpCircle,
  },
  {
    q: "Is everything on ISHU completely free?",
    a: "Yes! Every feature on ISHU is 100% free forever — PDF tools, sarkari results, live TV channels, video downloaders, news, blog, and CV maker. No subscription, no hidden fees, no credit card needed. We believe quality education tools should be accessible to every student.",
    icon: Shield,
  },
  {
    q: "How do WhatsApp job alerts work?",
    a: "Enter your WhatsApp number and select the exam categories you follow (UPSC, SSC, Banking, Railways, State exams, etc.). Whenever a new vacancy, result, or admit card is published, you get an instant WhatsApp message with full details and direct official links — within minutes of the announcement.",
    icon: MessageCircle,
  },
  {
    q: "Which government exams does ISHU cover?",
    a: "ISHU covers ALL major exams: UPSC CSE/IAS/IPS, SSC CGL/CHSL/MTS, IBPS PO/Clerk, SBI PO/Clerk, RRB NTPC/Group D, NTA JEE Main/NEET, CDS/NDA, CTET/TET, and all 36 state PSC exams including UPPSC, BPSC, RPSC, MPPSC, HPSC, KPSC, TNPSC, MPSC and more. Total coverage: 500+ exams.",
    icon: Zap,
  },
  {
    q: "Are the PDF tools safe? Do you store my files?",
    a: "Your files are 100% secure. All PDF tools process files locally in your browser — your documents never leave your device. No files are uploaded to any server. For tools that need server processing, files are automatically deleted within 1 hour. We never access, read, or store your file content.",
    icon: Shield,
  },
  {
    q: "How many PDF tools does ISHU have?",
    a: "ISHU has 100+ free professional PDF tools including: Merge PDF, Split PDF, Compress PDF, PDF to Word, Word to PDF, PDF to JPG, JPG to PDF, OCR (text extraction), PDF Editor, Sign PDF, Watermark PDF, Protect/Unlock PDF, Rotate PDF, AI Chat with PDF, PDF Translator, and 85+ more document conversion tools.",
    icon: Star,
  },
  {
    q: "How do I watch live TV on ISHU?",
    a: "Go to ishu.fun/tv to watch 700+ live Indian TV channels for free. No app download, no sign-up, no payment. Channels include Aaj Tak, NDTV, Republic, Star Plus, Zee TV, Sony, Colors, Sun TV, Star Sports, Sony Six, Gemini TV, Asianet and all major Hindi, regional and sports channels.",
    icon: Zap,
  },
  {
    q: "Does ISHU work on mobile phones?",
    a: "Yes! ISHU is fully responsive and optimized for all devices — Android, iPhone, tablets, and desktops. Every feature works perfectly on mobile browsers. The PDF tools, TV player, video downloader and results pages are all mobile-first. No app download required — just open ishu.fun in your browser.",
    icon: HelpCircle,
  },
  {
    q: "How often are exam results and job notifications updated?",
    a: "ISHU updates results, vacancies and admit cards in real-time — usually within 5-15 minutes of official publication. Our team monitors all 36 state websites and central government portals 24/7. You also get instant WhatsApp alerts so you never miss anything.",
    icon: Zap,
  },
  {
    q: "How can I contact ISHU for help?",
    a: "Contact us on WhatsApp at 8986985813 — we typically reply within 2 hours. You can also use our Contact page at ishu.fun/contact. We welcome feedback, corrections, and feature requests. If you notice incorrect information or a broken tool, please report it and we'll fix it within hours.",
    icon: Phone,
  },
];

const FAQItem = ({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqs)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div
    className="faq-item overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.025] transition-all duration-300"
    style={isOpen ? { borderColor: "rgba(99,102,241,0.2)" } : {}}
  >
    <button
      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-3">
        <faq.icon
          size={16}
          className="shrink-0 transition-colors duration-300"
          style={{ color: isOpen ? "#6366f1" : "rgba(255,255,255,0.35)" }}
        />
        <span
          className="font-display text-sm font-semibold transition-colors duration-300 md:text-base"
          style={{ color: isOpen ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.75)" }}
        >
          {faq.q}
        </span>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.25 }}
        className="shrink-0"
      >
        <ChevronDown size={16} style={{ color: isOpen ? "#6366f1" : "rgba(255,255,255,0.3)" }} />
      </motion.div>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="answer"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="px-6 pb-5 text-sm leading-relaxed text-white/50 md:text-base">
            {faq.a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-item",
        { y: 24, opacity: 0 },
        {
          scrollTrigger: { trigger: ".faq-list", start: "top 92%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.05, duration: 0.45, ease: "power3.out", clearProps: "all",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/[0.05] py-28 md:py-36"
    >
      {/* CSS-only background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/80 to-background" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.04) 0%, transparent 70%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />

      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="faq-heading mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-white/50"
            >
              <Sparkles size={13} className="text-primary" />
              <span className="font-medium">Got Questions?</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.06 }}
              className="font-display text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              Frequently Asked{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Questions
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.14 }}
              className="mt-4 text-white/40"
            >
              Everything you need to know about ISHU — India's #1 free student platform.
            </motion.p>
            <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>

          {/* FAQ list */}
          <div className="faq-list flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-center"
          >
            <p className="text-sm text-white/45">
              Still have questions? We are here to help.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/918986985813"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-5 py-2.5 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20"
              >
                <MessageCircle size={15} />
                WhatsApp Us
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white/60 transition-all hover:border-primary/30 hover:text-white/80"
              >
                Contact Page
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Inline JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </section>
  );
};

export default FAQSection;
