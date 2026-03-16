/**
 * CVPage.tsx - CV Hub Landing Page (Enhanced)
 * 
 * Main CV page with two sections:
 * 1. Resume - Professional resume builder
 * 2. Bio-Data - Personal bio-data creator
 * 
 * Features: Particles, 3D tilt, typing animation, countup stats,
 * shimmer text, morphing blobs, staggered reveals, glowing borders,
 * parallax effects, animated icons, and a "How it works" section.
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import ParticleField from "@/components/animations/ParticleField";
import ScrollProgress from "@/components/animations/ScrollProgress";
import SpotlightCard from "@/components/animations/SpotlightCard";
import ShimmerText from "@/components/animations/ShimmerText";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import StaggerChildren from "@/components/animations/StaggerChildren";
import GlowingBorder from "@/components/animations/GlowingBorder";
import TextReveal from "@/components/animations/TextReveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useRef } from "react";
import Tilt from "react-parallax-tilt";
import {
  FileText, UserCircle, ArrowRight, Sparkles, Download, Shield, Zap,
  CheckCircle, Star, Award, Clock, Globe, Palette, Layout as LayoutIcon,
  Eye, PenTool, Layers, MousePointerClick, TrendingUp, Rocket, Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

const cvSections = [
  {
    title: "Resume",
    subtitle: "Professional Resume Builder",
    description: "Create a professional resume that stands out. Choose from modern templates, add your experience, skills, and education — download as PDF instantly.",
    icon: FileText,
    href: "/cv/resume",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/10 to-cyan-500/10",
    glowColor: "hsl(210 100% 56% / 0.15)",
    features: [
      { text: "Professional Templates", icon: Palette },
      { text: "ATS-Friendly Format", icon: CheckCircle },
      { text: "Instant PDF Download", icon: Download },
      { text: "Live Preview", icon: Eye },
      { text: "Easy Section Editing", icon: PenTool },
      { text: "Multiple Layouts", icon: Layers },
    ],
  },
  {
    title: "Bio-Data",
    subtitle: "Personal Bio-Data Generator",
    description: "Generate a clean and well-formatted bio-data for personal, matrimonial, or official purposes. Fill in your details and get a polished document ready to share.",
    icon: UserCircle,
    href: "/cv/bio-data",
    color: "from-violet-500 to-purple-500",
    bgColor: "from-violet-500/10 to-purple-500/10",
    glowColor: "hsl(260 100% 56% / 0.15)",
    features: [
      { text: "Personal Details", icon: Heart },
      { text: "Family Information", icon: UserCircle },
      { text: "Photo Upload", icon: Eye },
      { text: "Print Ready PDF", icon: Download },
      { text: "Multiple Formats", icon: Palette },
      { text: "Clean Layouts", icon: Star },
    ],
  },
];

const stats = [
  { label: "Templates", value: 10, suffix: "+", icon: Sparkles },
  { label: "Users", value: 5000, suffix: "+", icon: TrendingUp },
  { label: "Privacy", value: 100, suffix: "%", icon: Shield },
  { label: "Speed", value: 3, suffix: "s", icon: Zap },
];

const floatingIcons = [
  { Icon: FileText, x: "10%", y: "20%", delay: 0, size: 24, color: "text-blue-500/20" },
  { Icon: UserCircle, x: "85%", y: "15%", delay: 0.5, size: 28, color: "text-violet-500/20" },
  { Icon: Award, x: "5%", y: "70%", delay: 1, size: 20, color: "text-cyan-500/20" },
  { Icon: Star, x: "90%", y: "65%", delay: 1.5, size: 22, color: "text-purple-500/20" },
  { Icon: Globe, x: "70%", y: "80%", delay: 2, size: 18, color: "text-blue-400/20" },
  { Icon: Rocket, x: "20%", y: "85%", delay: 2.5, size: 20, color: "text-emerald-500/20" },
];

const processSteps = [
  { step: "1", title: "Choose Section", desc: "Select Resume or Bio-Data to get started", icon: MousePointerClick, color: "from-blue-500 to-cyan-500" },
  { step: "2", title: "Fill Your Details", desc: "Enter your information in the easy form", icon: PenTool, color: "from-violet-500 to-purple-500" },
  { step: "3", title: "Preview & Download", desc: "Review your document and download as PDF", icon: Download, color: "from-emerald-500 to-teal-500" },
];

const CVPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <Layout>
      <ScrollProgress />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://ishu.dev/" },
        { name: "CV", url: "https://ishu.dev/cv" },
      ]} />

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative overflow-hidden py-24 md:py-36">
        <ParticleField />
        <GradientMesh className="opacity-40" />
        <MorphingBlob className="absolute -top-40 -right-40 h-[600px] w-[600px] opacity-25" color="blue" />
        <MorphingBlob className="absolute -bottom-40 -left-40 h-[500px] w-[500px] opacity-20" color="violet" />
        <MorphingBlob className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] opacity-10" color="cyan" />

        {/* Floating Icons */}
        {floatingIcons.map(({ Icon, x, y, delay, size, color }, i) => (
          <motion.div
            key={i}
            className={`absolute pointer-events-none ${color}`}
            style={{ left: x, top: y }}
            animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4 + i, delay, ease: "easeInOut" }}
          >
            <Icon size={size} />
          </motion.div>
        ))}

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container relative z-10">
          <FadeInView>
            <div className="mx-auto max-w-4xl text-center">
              {/* Animated Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm"
              >
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                  <Sparkles className="h-3.5 w-3.5" />
                </motion.div>
                Free CV Builder — No Sign-up Required
              </motion.div>

              {/* Hero Icon with Pulse */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="mx-auto mb-8 relative inline-block"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-2xl shadow-blue-500/30">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500"
                />
              </motion.div>

              {/* Heading */}
              <h1 className="font-display text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
                <ShimmerText>CV</ShimmerText>{" "}
                <span className="text-foreground">Builder</span>
              </h1>
              <div className="mt-4 h-8 text-lg text-muted-foreground md:text-xl">
                <TypeAnimation
                  sequence={[
                    "Create professional Resumes in minutes ✨",
                    2000,
                    "Generate polished Bio-Data instantly 📄",
                    2000,
                    "Download as PDF — completely free 🚀",
                    2000,
                    "No sign-up required — start now! 💯",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </div>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground/80">
                Choose from professional templates, fill in your details, and download your document in seconds.
                Perfect for job applications, personal use, and official purposes.
              </p>
            </div>
          </FadeInView>

          {/* Stats Row */}
          <FadeInView delay={0.3}>
            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.08, y: -4 }}
                  className="group rounded-xl border border-border/50 bg-card/40 p-4 text-center backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card/60"
                >
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: i * 0.5 }}
                  >
                    <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                  </motion.div>
                  <div className="text-2xl font-bold text-foreground">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </FadeInView>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="relative py-16 md:py-24">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-12">
              <TextReveal text="How It Works" className="text-3xl font-bold text-foreground md:text-4xl" />
              <p className="mt-3 text-muted-foreground">Three simple steps to your perfect document</p>
            </div>
          </FadeInView>

          <StaggerChildren className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3" direction="up" staggerDelay={0.15}>
            {processSteps.map((step, i) => (
              <motion.div
                key={step.step}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group relative rounded-2xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm transition-all hover:border-primary/30"
              >
                <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white font-bold text-lg shadow-lg`}>
                  {step.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
                {i < processSteps.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 md:block">
                    <ArrowRight className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CV Section Cards */}
      <section className="relative pb-24">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-12">
              <TextReveal text="Choose Your Document" className="text-3xl font-bold text-foreground md:text-4xl" />
              <p className="mt-3 text-muted-foreground">Select the type of document you want to create</p>
            </div>
          </FadeInView>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {cvSections.map((section, index) => (
              <FadeInView key={section.title} delay={index * 0.2}>
                <Link to={section.href} className="group block">
                  <Tilt
                    tiltMaxAngleX={8}
                    tiltMaxAngleY={8}
                    glareEnable={true}
                    glareMaxOpacity={0.15}
                    glareColor="#ffffff"
                    glarePosition="all"
                    glareBorderRadius="16px"
                    scale={1.02}
                    transitionSpeed={400}
                  >
                    <GlowingBorder
                      glowColor={index === 0 ? "hsl(210 100% 56%)" : "hsl(260 100% 56%)"}
                      animationDuration={4}
                    >
                      <SpotlightCard spotlightColor={section.glowColor}>
                        <div className="relative overflow-hidden rounded-2xl p-8 md:p-10">
                          <div className={`absolute inset-0 bg-gradient-to-br ${section.bgColor} opacity-40`} />

                          <div className="relative z-10">
                            <motion.div
                              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                              transition={{ duration: 0.5 }}
                              className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${section.color} shadow-xl`}
                            >
                              <section.icon className="h-8 w-8 text-white" />
                            </motion.div>

                            <div className={`mb-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${section.bgColor} px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70`}>
                              <Star className="h-3 w-3" />
                              {section.subtitle}
                            </div>

                            <h2 className="mb-3 text-3xl font-bold text-foreground">{section.title}</h2>
                            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{section.description}</p>

                            <div className="mb-8 grid grid-cols-2 gap-3">
                              {section.features.map((feature, fi) => (
                                <motion.div
                                  key={feature.text}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.5 + fi * 0.08 }}
                                  className="flex items-center gap-2 text-xs text-muted-foreground"
                                >
                                  <feature.icon className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                  {feature.text}
                                </motion.div>
                              ))}
                            </div>

                            <motion.div
                              whileHover={{ x: 5 }}
                              className={`inline-flex items-center gap-3 rounded-xl bg-gradient-to-r ${section.color} px-6 py-3 text-sm font-semibold text-white shadow-lg transition-shadow hover:shadow-xl`}
                            >
                              Get Started
                              <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                <ArrowRight className="h-4 w-4" />
                              </motion.div>
                            </motion.div>
                          </div>
                        </div>
                      </SpotlightCard>
                    </GlowingBorder>
                  </Tilt>
                </Link>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-16 md:py-20 border-t border-border/30">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-12">
              <TextReveal text="Why Choose Our CV Builder?" className="text-3xl font-bold text-foreground md:text-4xl" />
              <p className="mt-3 text-muted-foreground">Built with love for students and professionals</p>
            </div>
          </FadeInView>

          <StaggerChildren className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4" direction="up" staggerDelay={0.1}>
            {[
              { icon: Shield, title: "100% Private", desc: "Your data never leaves your browser", color: "text-emerald-500" },
              { icon: Zap, title: "Lightning Fast", desc: "Generate documents in under 3 seconds", color: "text-amber-500" },
              { icon: Download, title: "Free Forever", desc: "No hidden charges, no premium plans", color: "text-blue-500" },
              { icon: Clock, title: "Save Time", desc: "Pre-built templates ready to customize", color: "text-violet-500" },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-xl border border-border/50 bg-card/40 p-5 text-center backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-card/60"
              >
                <feature.icon className={`mx-auto mb-3 h-8 w-8 ${feature.color}`} />
                <h3 className="mb-1.5 text-sm font-semibold text-foreground">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </Layout>
  );
};

export default CVPage;
