/**
 * TestPage.tsx - Practice Tests "Coming Soon" Page (323 lines)
 * 
 * A landing page for the upcoming test series feature.
 * Shows a countdown timer to launch date and previews upcoming features.
 * 
 * Features:
 * - Countdown timer (days, hours, minutes, seconds to launch)
 * - Feature preview cards (Mock Tests, AI Analysis, Topic Practice, etc.)
 * - Upcoming features section
 * - Email notification signup for launch alerts
 * - Social media links
 * - Animated particle field background
 * - GSAP scroll-triggered animations
 * - 3D tilt effects on feature cards
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import ParticleField from "@/components/animations/ParticleField";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import { motion, useScroll, useTransform } from "framer-motion";
import { Rocket, Bell, Mail, Twitter, Youtube, Instagram, Linkedin, BookOpen, Brain, Target, Trophy, Sparkles, Zap, Shield, Clock, Users, Star, Award, BarChart3, CheckCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Tilt from "react-parallax-tilt";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const launchDate = new Date("2026-06-01T00:00:00");

const features = [
  { icon: BookOpen, title: "Mock Tests", desc: "Full-length mock tests for UPSC, SSC, Banking, Railways & more" },
  { icon: Brain, title: "AI-Powered Analysis", desc: "Smart performance analysis with personalized improvement tips" },
  { icon: Target, title: "Topic-wise Practice", desc: "Practice questions by topic, difficulty level, and exam pattern" },
  { icon: Trophy, title: "Leaderboards", desc: "Compete with lakhs of aspirants and track your national rank" },
];

const upcomingFeatures = [
  { icon: BarChart3, title: "Performance Dashboard", desc: "Track your progress with detailed analytics and insights" },
  { icon: Users, title: "Study Groups", desc: "Join study rooms with fellow aspirants for collaborative prep" },
  { icon: Shield, title: "Exam Simulator", desc: "Real exam environment with timer, negative marking & more" },
  { icon: Award, title: "Certificates", desc: "Get certified badges and achievement certificates" },
];

const socialLinks = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

const roadmap = [
  { phase: "Phase 1", title: "Foundation", items: ["User Registration", "Basic Mock Tests", "Score Tracking"], status: "done" },
  { phase: "Phase 2", title: "Intelligence", items: ["AI Analysis", "Personalized Tips", "Weak Area Detection"], status: "progress" },
  { phase: "Phase 3", title: "Community", items: ["Leaderboards", "Study Groups", "Discussion Forums"], status: "upcoming" },
  { phase: "Phase 4", title: "Advanced", items: ["Live Tests", "Video Solutions", "Mobile App"], status: "upcoming" },
];

const TestPage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const featRef = useRef<HTMLElement>(null);
  const roadmapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const diff = launchDate.getTime() - now;
      if (diff <= 0) return;
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".feat-card",
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: featRef.current, start: "top 80%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "back.out(1.7)", clearProps: "all" }
      );
      gsap.fromTo(".upcoming-card",
        { scale: 0.8, opacity: 0 },
        { scrollTrigger: { trigger: ".upcoming-grid", start: "top 80%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, ease: "back.out(2)", clearProps: "all" }
      );
      gsap.fromTo(".roadmap-card",
        { x: -40, opacity: 0 },
        { scrollTrigger: { trigger: roadmapRef.current, start: "top 80%", toggleActions: "play none none none" },
          x: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: "power3.out", clearProps: "all" }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <Layout>
      {/* Dynamic Background Image */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* Hero */}
      <section className="relative flex min-h-[100vh] items-center overflow-hidden bg-gradient-hero">
        <ParticleField />
        <div className="pointer-events-none absolute inset-0 holo-effect" />
        <div className="pointer-events-none absolute inset-0 grain" />
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-[500px] w-[500px] morph-blob rounded-full bg-primary/5 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />

        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-primary/10 shadow-glow"
            >
              <Rocket size={56} className="text-primary" />
            </motion.div>

            <FadeInView>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm"
              >
                <Sparkles size={14} className="text-primary" />
                <span className="font-semibold text-foreground">ISHU — Indian StudentHub University</span>
              </motion.div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground lg:text-7xl">
                Coming <span className="text-gradient">Soon</span>
              </h1>
              <p className="mt-6 text-xl text-muted-foreground md:text-2xl">
                India's Most Advanced Online Test Platform
              </p>
            </FadeInView>

            {/* Countdown Timer */}
            <FadeInView delay={0.2}>
              <div className="mt-12 inline-flex gap-4 md:gap-6">
                {[
                  { value: countdown.days, label: "Days" },
                  { value: countdown.hours, label: "Hours" },
                  { value: countdown.minutes, label: "Minutes" },
                  { value: countdown.seconds, label: "Seconds" },
                ].map((unit, i) => (
                  <motion.div key={unit.label} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                    className="flex flex-col items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-card md:h-24 md:w-24">
                      <motion.span key={unit.value} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        className="font-display text-3xl font-bold text-foreground md:text-4xl">
                        {String(unit.value).padStart(2, "0")}
                      </motion.span>
                    </div>
                    <span className="mt-2 text-xs font-medium text-muted-foreground">{unit.label}</span>
                  </motion.div>
                ))}
              </div>
            </FadeInView>

            {/* Email Subscription */}
            <FadeInView delay={0.4}>
              {!subscribed ? (
                <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
                    <Mail size={18} className="text-muted-foreground" />
                    <input type="email" required placeholder="Enter your email for early access" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:w-72" />
                  </div>
                  <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow">
                    <Bell size={16} /> Get Early Access
                  </button>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="mt-12 inline-flex items-center gap-2 rounded-xl bg-success/10 px-8 py-4 text-sm font-medium text-success">
                  ✅ You're on the early access list! We'll notify you at launch.
                </motion.div>
              )}
            </FadeInView>

            {/* Social Links */}
            <FadeInView delay={0.5}>
              <div className="mt-8 flex justify-center gap-3">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} title={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:border-primary/30 hover:text-primary hover:shadow-glow">
                    <s.icon size={18} />
                  </a>
                ))}
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card/50 py-10">
        <div className="container">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">            {[
              { value: 50, suffix: "+", label: "Mock Tests Planned", icon: BookOpen },
              { value: 10, suffix: "+", label: "Exam Categories", icon: Target },
              { value: 100000, suffix: "+", label: "Pre-registered", icon: Users },
              { value: 22, suffix: "", label: "Languages", icon: Star },
            ].map((s) => (
              <Tilt key={s.label} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.03}>
                <div className="rounded-xl border border-border glass-strong p-5 text-center transition-all hover:shadow-glow">
                  <s.icon size={20} className="mx-auto mb-2 text-primary" />
                  <div className="font-display text-2xl font-bold text-gradient">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section ref={featRef} className="py-24 aurora-bg">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Coming Features</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                What's <span className="text-shimmer">Coming</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                Everything you need to ace your government exams
              </p>
              <div className="mx-auto mt-4 gradient-line w-24" />
            </div>
          </FadeInView>

          <div className="mt-14 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feat) => (
              <Tilt key={feat.title} tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={true} glareMaxOpacity={0.08}
                glareColor="hsl(210 100% 56%)" glarePosition="all" glareBorderRadius="1rem" scale={1.03} transitionSpeed={400}>
                <motion.div whileTap={{ scale: 0.98 }}
                  className="feat-card group spotlight-card relative overflow-hidden rounded-2xl border border-border glass-strong p-8 text-center transition-all hover:border-primary/20 hover:shadow-card">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <motion.div whileHover={{ scale: 1.15, rotate: 5 }}
                      className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all group-hover:shadow-glow">
                      <feat.icon size={30} />
                    </motion.div>
                    <h3 className="font-display text-lg font-semibold text-foreground glow-text">{feat.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feat.desc}</p>
                  </div>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Features Grid */}
      <section className="border-t border-border bg-card/50 py-20">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-12">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">More Features</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                Also <span className="text-gradient">Planned</span>
              </h2>
            </div>
          </FadeInView>

          <div className="upcoming-grid grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {upcomingFeatures.map((f) => (
              <motion.div key={f.title} whileHover={{ y: -4, scale: 1.02 }}
                className="upcoming-card group flex gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-card">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                  <f.icon size={22} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section ref={roadmapRef} className="border-t border-border py-20 aurora-bg">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-12">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Development</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                Our <span className="text-shimmer">Roadmap</span>
              </h2>
            </div>
          </FadeInView>

          <div className="mx-auto max-w-4xl grid gap-4 sm:gap-6 md:grid-cols-2">
            {roadmap.map((r) => (
              <Tilt key={r.phase} tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02}>
                <div className={`roadmap-card rounded-2xl border p-6 transition-all hover:shadow-card ${
                  r.status === "done" ? "border-success/30 bg-success/5" :
                  r.status === "progress" ? "border-primary/30 bg-primary/5" :
                  "border-border bg-card"
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`rounded-lg px-3 py-1 text-xs font-bold ${
                      r.status === "done" ? "bg-success/20 text-success" :
                      r.status === "progress" ? "bg-primary/20 text-primary" :
                      "bg-secondary text-muted-foreground"
                    }`}>
                      {r.phase}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      r.status === "done" ? "bg-success/10 text-success" :
                      r.status === "progress" ? "bg-primary/10 text-primary animate-pulse" :
                      "bg-secondary text-muted-foreground"
                    }`}>
                      {r.status === "done" ? "✅ Complete" : r.status === "progress" ? "🔄 In Progress" : "📋 Planned"}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{r.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {r.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle size={12} className={r.status === "done" ? "text-success" : "text-muted-foreground/50"} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TestPage;
