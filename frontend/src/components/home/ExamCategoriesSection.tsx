/**
 * ExamCategoriesSection.tsx - Exam Categories Grid
 * 
 * Displays 8 major exam categories (UPSC, SSC, Banking, etc.) with animated cards.
 * Each card shows exam count, applicant numbers, and links to results.
 * Features GSAP scroll animations and 3D tilt effects on hover.
 */
import FadeInView from "../animations/FadeInView";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Building2, Train, Shield, GraduationCap, Landmark, Briefcase, Award, Users, TrendingUp, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { name: "UPSC", exams: "IAS, IPS, IFS, CDS, NDA, CAPF", count: 120, color: "from-blue-500 to-blue-700", icon: Landmark, iconBg: "bg-blue-500/10", iconColor: "text-blue-400", applicants: "12L+", hoverGrad: "from-blue-500/10 to-blue-700/5" },
  { name: "SSC", exams: "CGL, CHSL, MTS, GD, CPO", count: 95, color: "from-emerald-500 to-emerald-700", icon: Building2, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400", applicants: "25L+", hoverGrad: "from-emerald-500/10 to-emerald-700/5" },
  { name: "Banking", exams: "IBPS PO, SBI, RBI, Clerk, RRB", count: 80, color: "from-amber-500 to-amber-700", icon: Briefcase, iconBg: "bg-amber-500/10", iconColor: "text-amber-400", applicants: "18L+", hoverGrad: "from-amber-500/10 to-amber-700/5" },
  { name: "Railways", exams: "RRB NTPC, Group D, ALP, JE", count: 70, color: "from-rose-500 to-rose-700", icon: Train, iconBg: "bg-rose-500/10", iconColor: "text-rose-400", applicants: "30L+", hoverGrad: "from-rose-500/10 to-rose-700/5" },
  { name: "NTA", exams: "JEE Main, NEET UG, CUET, NET", count: 110, color: "from-violet-500 to-violet-700", icon: GraduationCap, iconBg: "bg-violet-500/10", iconColor: "text-violet-400", applicants: "40L+", hoverGrad: "from-violet-500/10 to-violet-700/5" },
  { name: "Defence", exams: "Army, Navy, Air Force, Agniveer", count: 55, color: "from-cyan-500 to-cyan-700", icon: Shield, iconBg: "bg-cyan-500/10", iconColor: "text-cyan-400", applicants: "15L+", hoverGrad: "from-cyan-500/10 to-cyan-700/5" },
  { name: "Teaching", exams: "CTET, KVS, NVS, State TET", count: 45, color: "from-pink-500 to-pink-700", icon: BookOpen, iconBg: "bg-pink-500/10", iconColor: "text-pink-400", applicants: "20L+", hoverGrad: "from-pink-500/10 to-pink-700/5" },
  { name: "PSU", exams: "ONGC, BHEL, SAIL, NTPC, IOCL", count: 40, color: "from-teal-500 to-teal-700", icon: Award, iconBg: "bg-teal-500/10", iconColor: "text-teal-400", applicants: "8L+", hoverGrad: "from-teal-500/10 to-teal-700/5" },
];

const ExamCategoriesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".exam-card",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: ".exam-grid", start: "top 85%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".exam-stat-chip",
        { scale: 0.8, opacity: 0 },
        { scrollTrigger: { trigger: ".exam-stats-row", start: "top 85%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.1, duration: 0.4, ease: "back.out(1.7)", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative border-t border-border bg-gradient-to-b from-background via-card/70 to-background py-28 overflow-hidden">
      {/* Enhanced background */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" />
      <div className="pointer-events-none absolute inset-0 aurora-bg" />
      
      {/* Animated floating orbs */}
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3], x: [0, 40, 0], y: [0, -20, 0] }} 
        transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[5%] top-[8%] h-[450px] w-[450px] rounded-full bg-primary/10 blur-[150px] morph-blob" 
      />
      <motion.div 
        animate={{ opacity: [0.2, 0.4, 0.2], y: [0, 30, 0] }} 
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[10%] bottom-[15%] h-[350px] w-[350px] rounded-full bg-[hsl(142,76%,46%,0.06)] blur-[120px]" 
      />
      <motion.div 
        animate={{ opacity: [0.15, 0.3, 0.15] }} 
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[160px]" 
      />
      
      {/* Grain texture */}
      <div className="pointer-events-none absolute inset-0 grain" />
      
      <div className="container relative z-10">
        <FadeInView>
          <div className="mx-auto max-w-2xl text-center">
            {/* Section badge */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-sm text-muted-foreground">
              <Sparkles size={14} className="text-primary" />
              <span className="font-medium">Exam Categories</span>
            </motion.div>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Every Major Exam, <span className="text-shimmer">One Place</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Central & state-level coverage for all major competitive exams in India.</p>
            <div className="mx-auto mt-4 gradient-line w-24" />
          </div>
        </FadeInView>

        {/* Stats row */}
        <div className="exam-stats-row mt-10 flex flex-wrap items-center justify-center gap-4">
          {[
            { icon: Users, val: "1Cr+", label: "Aspirants" },
            { icon: TrendingUp, val: "500+", label: "Exams Covered" },
            { icon: Award, val: "8", label: "Categories" },
          ].map((s) => (
            <div key={s.label} className="exam-stat-chip flex items-center gap-2 rounded-xl border border-border glass px-4 py-2">
              <s.icon size={14} className="text-primary" />
              <span className="text-sm font-bold text-foreground">{s.val}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="exam-grid mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Tilt key={cat.name} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.06} glareColor="hsl(210 100% 56%)" glarePosition="all" glareBorderRadius="1rem" scale={1.03} transitionSpeed={400}>
              <motion.div whileTap={{ scale: 0.97 }}
                className="exam-card group spotlight-card cursor-pointer overflow-hidden rounded-2xl border border-border glass-strong transition-all hover:border-primary/20 hover:shadow-card">
                <div className={`h-1.5 bg-gradient-to-r ${cat.color}`} />
                <div className="p-5 relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.hoverGrad} opacity-0 transition-opacity group-hover:opacity-100`} />
                  <div className="relative">
                    <motion.div whileHover={{ scale: 1.15, rotate: 5 }}
                      className={`mb-3 inline-flex rounded-xl ${cat.iconBg} p-2.5 ${cat.iconColor}`}>
                      <cat.icon size={22} />
                    </motion.div>
                    <h3 className="font-display text-xl font-bold text-foreground glow-text">{cat.name}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{cat.exams}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-secondary px-2 py-1 text-[10px] font-medium text-muted-foreground">
                          {cat.count}+ Posts
                        </span>
                        <span className="rounded-md bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary">
                          {cat.applicants}
                        </span>
                      </div>
                      <motion.span className="text-primary opacity-0 transition-opacity group-hover:opacity-100" whileHover={{ x: 4 }}>
                        <ArrowRight size={14} />
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>

        <FadeInView delay={0.4}>
          <div className="mt-10 text-center">
            <Link to="/results"
              className="group inline-flex items-center gap-2 rounded-xl border border-border glass px-6 py-3 font-display text-sm font-semibold text-primary transition-all hover:border-primary/30 hover:shadow-glow hover:gap-3">
              View All Exam Categories <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default ExamCategoriesSection;
