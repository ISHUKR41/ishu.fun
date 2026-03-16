/**
 * AboutPage.tsx - About Us Page
 * 
 * Tells the story of ISHU (Indian StudentHub University) and the team behind it.
 *
 * Sections:
 * 1. Hero - Parallax background image with mission statement
 * 2. Mission, Vision, Values cards
 * 3. Stats section - animated counters for key metrics
 * 4. Team section - founder and team member profiles
 * 5. Timeline - company milestones from 2024 to future
 * 6. Tech stack badges
 * 7. Contact CTA with WhatsApp and email links
 * 
 * Features:
 * - Parallax scroll on hero image
 * - GSAP scroll-triggered animations
 * - AnimatedCounter for statistics
 * - 3D tilt effects on cards
 * - SEO: BreadcrumbSchema
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import { motion, useScroll, useTransform } from "framer-motion";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import { Target, Eye, Heart, Users, Award, Globe, Zap, Shield, Mail, Phone, MessageCircle, ArrowRight, CheckCircle, Sparkles, Star, Code, Rocket, GraduationCap, TrendingUp, Building } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import Tilt from "react-parallax-tilt";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

gsap.registerPlugin(ScrollTrigger);

const team = [
  { name: "Ishu Kumar", role: "Founder & Developer", initial: "IK", desc: "Full-stack developer passionate about making education accessible to every Indian student." },
  { name: "Content Team", role: "Result & News Updates", initial: "CT", desc: "Dedicated team verifying and publishing government exam results from official sources." },
  { name: "Design Team", role: "UI/UX & Animations", initial: "DT", desc: "Creating world-class user experiences with cutting-edge 3D animations and interactions." },
  { name: "Support Team", role: "24/7 User Support", initial: "ST", desc: "Always available to help students with their queries via WhatsApp and email." },
];

const milestones = [
  { year: "2024", event: "Platform conceptualized & development started", icon: Sparkles, detail: "Initial research on Indian education landscape and student pain points." },
  { year: "2025", event: "Beta launch with Results & PDF Tools", icon: Rocket, detail: "Launched with 50+ tools and coverage of 10 major exam boards." },
  { year: "2026", event: "Full launch with 100+ tools, news, blog & WhatsApp alerts", icon: Zap, detail: "Complete platform with all 36 states, 100+ tools, and real-time WhatsApp notifications." },
  { year: "Future", event: "AI-powered test series, mobile app & multi-language expansion", icon: Star, detail: "AI-driven personalized test preparation and native mobile applications." },
];

const techStack = [
  { name: "React 18", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Framer Motion", category: "Animation" },
  { name: "GSAP", category: "Animation" },
  { name: "Three.js", category: "3D" },
  { name: "tsParticles", category: "Effects" },
  { name: "Lovable Cloud", category: "Backend" },
  { name: "Recharts", category: "Charts" },
  { name: "PDF-lib", category: "PDF" },
  { name: "Tesseract.js", category: "OCR" },
  { name: "Fuse.js", category: "Search" },
];

const coreValues = [
  { icon: CheckCircle, title: "Accuracy First", desc: "Every result verified from official government sources before publishing." },
  { icon: Shield, title: "100% Free Forever", desc: "No hidden costs, no subscriptions. Every tool and feature is completely free." },
  { icon: Users, title: "Student-Centric", desc: "Every feature built based on actual feedback from millions of aspirants." },
  { icon: Globe, title: "Pan-India Coverage", desc: "All 28 states, 8 UTs, and every major central exam body covered." },
  { icon: Zap, title: "Instant Updates", desc: "Real-time notifications within minutes of any official announcement." },
  { icon: GraduationCap, title: "Career Guidance", desc: "Expert blogs, preparation tips, and success stories to guide your journey." },
];

const AboutPage = () => {
  const heroRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item, i) => {
        gsap.fromTo(item,
          { x: i % 2 === 0 ? -60 : 60, opacity: 0 },
          { scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none none" },
            x: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "all" }
        );
      });

      gsap.fromTo(".about-stat",
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: statsRef.current, start: "top 80%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power3.out", clearProps: "all" }
      );

      gsap.fromTo(".team-card",
        { scale: 0.8, opacity: 0 },
        { scrollTrigger: { trigger: ".team-grid", start: "top 80%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.12, duration: 0.6, ease: "back.out(1.7)", clearProps: "all" }
      );

      gsap.fromTo(".tech-badge",
        { scale: 0, opacity: 0 },
        { scrollTrigger: { trigger: ".tech-grid", start: "top 85%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.05, duration: 0.4, ease: "back.out(2)", clearProps: "all" }
      );

      gsap.fromTo(".value-card",
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: ".values-grid", start: "top 80%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: "power3.out", clearProps: "all" }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <Layout>
      <BreadcrumbSchema items={[{ name: "About", url: "/about" }]} />

      {/* Hero with parallax */}
      <section ref={heroRef} className="relative min-h-[75vh] flex items-center bg-gradient-hero overflow-hidden">
        <motion.img
          src={aboutHero}
          alt="Indian students studying"
          className="pointer-events-none absolute inset-0 h-[120%] w-full object-cover opacity-12"
          loading="eager"
          style={{ y: heroY }}
        />
        <GradientMesh variant="aurora" />
        <div className="pointer-events-none absolute inset-0 cross-grid opacity-15" />
        <MorphingBlob color="hsl(210 100% 56% / 0.1)" size={600} className="left-[10%] top-[10%]" />
        <MorphingBlob color="hsl(260 100% 66% / 0.08)" size={500} className="right-[15%] bottom-[15%]" duration={25} />

        <motion.div className="container relative z-10" style={{ opacity: heroOpacity }}>
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5 text-sm"
            >
              <Building size={14} className="text-primary" />
              <span className="font-semibold text-foreground">ISHU — Indian StudentHub University</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
            >
              Empowering India's{" "}
              <span className="text-shimmer">Aspirants</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl max-w-2xl mx-auto"
            >
              India's most comprehensive platform for government exam results, vacancies,
              100+ PDF tools, and educational news. Built by students, for students.
            </motion.p>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 flex flex-wrap justify-center gap-8"
            >
              {[
                { icon: Users, value: "1M+", label: "Users" },
                { icon: Globe, value: "36", label: "States" },
                { icon: Zap, value: "100+", label: "Tools" },
                { icon: TrendingUp, value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <motion.div 
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <stat.icon size={18} />
                  </div>
                  <div className="text-left">
                    <p className="font-display text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <a href="#our-story" className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow">
                Our Story <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a href="https://wa.me/918986985813" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-border glass px-8 py-4 font-display text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:shadow-glow">
                <MessageCircle size={16} /> Contact Us
              </a>
            </motion.div>
          </div>
        </motion.div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Mission, Vision, Values - with Tilt */}
      <section className="py-24">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Who We Are</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                Our <span className="text-gradient">Purpose</span>
              </h2>
            </div>
          </FadeInView>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {[
              { icon: Target, title: "Our Mission", desc: "To provide every Indian student with instant, accurate, and free access to government exam information, powerful tools, and career guidance — eliminating the information gap that holds millions back.", gradient: "from-blue-500/20 to-cyan-500/20" },
              { icon: Eye, title: "Our Vision", desc: "To become India's most trusted and technologically advanced education platform — where every aspirant, regardless of location or background, can access world-class resources.", gradient: "from-violet-500/20 to-purple-500/20" },
              { icon: Heart, title: "Our Values", desc: "Accuracy first. Every result verified from official sources. Free forever. No hidden costs. Student-centric. Every feature built based on what aspirants actually need.", gradient: "from-emerald-500/20 to-green-500/20" },
            ].map((item, i) => (
              <FadeInView key={item.title} delay={i * 0.1}>
                <Tilt
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  glareEnable={true}
                  glareMaxOpacity={0.08}
                  glareColor="hsl(210 100% 56%)"
                  glarePosition="all"
                  glareBorderRadius="1rem"
                  scale={1.02}
                  transitionSpeed={400}
                >
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="group spotlight-card relative h-full overflow-hidden rounded-2xl border border-border glass-strong p-8 transition-all hover:border-primary/20 hover:shadow-card"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        className="mb-5 inline-flex rounded-xl bg-primary/10 p-4 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow"
                      >
                        <item.icon size={28} />
                      </motion.div>
                      <h3 className="font-display text-xl font-bold text-foreground glow-text">{item.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.div>
                </Tilt>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="border-y border-border bg-card/50 py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 mesh-gradient" />
        <div className="container relative">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Core Values</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                What Drives <span className="text-shimmer">Everything We Do</span>
              </h2>
            </div>
          </FadeInView>

          <div className="values-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((v, i) => (
              <motion.div
                key={v.title}
                className="value-card group flex gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-card"
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                  <v.icon size={22} />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats with GSAP */}
      <section ref={statsRef} className="py-20 aurora-bg">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {[
              { value: 1000000, suffix: "+", label: "Active Users", gradient: "from-blue-500 to-cyan-500" },
              { value: 100, suffix: "+", label: "PDF Tools", gradient: "from-violet-500 to-purple-500" },
              { value: 36, suffix: "", label: "States & UTs", gradient: "from-emerald-500 to-green-500" },
              { value: 1000, suffix: "+", label: "Daily News", gradient: "from-amber-500 to-orange-500" },
            ].map((s) => (
              <Tilt
                key={s.label}
                tiltMaxAngleX={12}
                tiltMaxAngleY={12}
                glareEnable={true}
                glareMaxOpacity={0.06}
                glareColor="hsl(210 100% 56%)"
                glarePosition="all"
                glareBorderRadius="1rem"
                scale={1.02}
              >
                <div className="about-stat rounded-2xl border border-border glass-strong p-6 text-center">
                  <div className="font-display text-4xl font-bold text-gradient md:text-5xl">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </div>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</p>
                  <div className={`mx-auto mt-3 h-1 w-12 rounded-full bg-gradient-to-r ${s.gradient}`} />
                </div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Enhanced with GSAP */}
      <section ref={timelineRef} id="our-story" className="py-24">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Our Journey</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                The <span className="text-gradient">Story</span> So Far
              </h2>
            </div>
          </FadeInView>

          <div className="mx-auto max-w-3xl relative">
            {/* Central line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent md:left-1/2" />

            {milestones.map((m, i) => (
              <div key={m.year} className={`timeline-item relative flex gap-8 pb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Dot */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    whileHover={{ scale: 1.3 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow"
                  >
                    <m.icon size={18} />
                  </motion.div>
                </div>

                {/* Content */}
                <div className={`ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02} transitionSpeed={400}>
                    <div className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-card">
                      <span className="font-display text-lg font-bold text-primary">{m.year}</span>
                      <h3 className="mt-2 font-display text-base font-semibold text-foreground">{m.event}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{m.detail}</p>
                    </div>
                  </Tilt>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="border-y border-border bg-card/50 py-24">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-12">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Technology</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                Built with <span className="text-gradient">Modern Stack</span>
              </h2>
              <p className="mt-4 text-muted-foreground">Powered by cutting-edge technologies for the best experience.</p>
            </div>
          </FadeInView>

          <div className="tech-grid mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
            {techStack.map((t) => (
              <motion.div
                key={t.name}
                whileHover={{ scale: 1.1, y: -4 }}
                className="tech-badge flex items-center gap-2 rounded-full border border-border glass px-5 py-2.5 transition-all hover:border-primary/30 hover:shadow-glow"
              >
                <Code size={14} className="text-primary" />
                <span className="font-display text-sm font-medium text-foreground">{t.name}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{t.category}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team with Tilt */}
      <section className="py-24">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Our Team</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                Meet the <span className="text-shimmer">People</span> Behind It
              </h2>
            </div>
          </FadeInView>

          <div className="team-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((t) => (
              <Tilt
                key={t.name}
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                glareEnable={true}
                glareMaxOpacity={0.08}
                glareColor="hsl(210 100% 56%)"
                glarePosition="all"
                glareBorderRadius="1rem"
                scale={1.03}
                transitionSpeed={400}
              >
                <motion.div
                  className="team-card group rounded-2xl border border-border glass-strong p-8 text-center transition-all hover:border-primary/20 hover:shadow-card"
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 font-display text-2xl font-bold text-primary ring-2 ring-primary/20"
                  >
                    {t.initial}
                  </motion.div>
                  <h3 className="font-display text-base font-semibold text-foreground">{t.name}</h3>
                  <p className="mt-1 text-xs font-medium text-primary">{t.role}</p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t.desc}</p>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA - Enhanced */}
      <section className="border-t border-border bg-card/50 py-20 aurora-bg">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Get in Touch</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                Let's <span className="text-gradient">Connect</span>
              </h2>
              <p className="mt-4 text-muted-foreground">Have a question, suggestion, or collaboration idea? Reach out anytime.</p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.05}>
                  <a href="tel:8986985813" className="group flex items-center gap-3 rounded-xl border border-border glass-strong px-6 py-4 transition-all hover:border-primary/30 hover:shadow-glow">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Phone size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-display text-sm font-semibold text-foreground">8986985813</p>
                    </div>
                  </a>
                </Tilt>

                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.05}>
                  <a href="mailto:ishukryk@gmail.com" className="group flex items-center gap-3 rounded-xl border border-border glass-strong px-6 py-4 transition-all hover:border-primary/30 hover:shadow-glow">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Mail size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-display text-sm font-semibold text-foreground">ishukryk@gmail.com</p>
                    </div>
                  </a>
                </Tilt>

                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.05}>
                  <a href="https://wa.me/918986985813" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-xl border border-border glass-strong px-6 py-4 transition-all hover:border-primary/30 hover:shadow-glow">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] group-hover:bg-[hsl(var(--success))] group-hover:text-primary-foreground transition-all">
                      <MessageCircle size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground">WhatsApp</p>
                      <p className="font-display text-sm font-semibold text-foreground">Chat Now</p>
                    </div>
                  </a>
                </Tilt>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* About JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About ISHU — Indian StudentHub University",
          "description": "India's most comprehensive platform for government exam results, vacancies, PDF tools, and educational news.",
          "url": window.location.href,
        })
      }} />
    </Layout>
  );
};

export default AboutPage;
