/**
 * SignInPage.tsx - Modern Sign-In Page with Clerk Integration
 * 
 * Ultra-modern, animated sign-in page inspired by Clerk, Vercel, Apple, and Tesla.
 * 
 * Features:
 * - Clerk's <SignIn /> component for seamless authentication
 * - Animated gradient mesh background with floating orbs
 * - Glassmorphism card with subtle 3D tilt effects
 * - GSAP scroll animations with staggered entrance
 * - TypeAnimation for dynamic hero text
 * - Floating particle effects in the background
 * - Trust badges, live stats, and testimonial section
 * - Fully responsive (mobile-optimized layout)
 * - No emoji stars, uses Lucide icons throughout
 * - Premium feel inspired by modern SaaS dashboards
 */
import Layout from "@/components/layout/Layout";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Shield, Zap, Globe, Award, Sparkles, ArrowRight,
  CheckCircle, Users, TrendingUp, Lock, Fingerprint,
  Layers, BookOpen, Bell, BarChart3
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SignIn } from "@clerk/clerk-react";
import { TypeAnimation } from "react-type-animation";
import gsap from "gsap";
import Tilt from "react-parallax-tilt";

const SignInPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  // GSAP staggered entrance animations
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Feature cards slide in from bottom
      gsap.fromTo(".signin-feature-card",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, delay: 0.5, ease: "power3.out", clearProps: "all" }
      );
      // Stats counter animation
      gsap.fromTo(".signin-stat-item",
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.9, ease: "back.out(1.7)", clearProps: "all" }
      );
      // Testimonial fades in
      gsap.fromTo(".signin-testimonial",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 1.2, ease: "power3.out", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (user) return null;

  return (
    <Layout>
      <section ref={sectionRef} className="relative flex min-h-[92vh] items-center overflow-hidden">
        {/* === BACKGROUND EFFECTS === */}
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-hero" />
        {/* Dot grid pattern overlay */}
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-10" />
        {/* Cross grid pattern */}
        <div className="pointer-events-none absolute inset-0 cross-grid opacity-8" />

        {/* Animated floating orbs - creates depth and movement */}
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -35, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[5%] top-[15%] h-[500px] w-[500px] rounded-full bg-primary/6 blur-[140px]"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 45, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[8%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-[hsl(260,100%,66%,0.06)] blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 35, 0], y: [0, -25, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[35%] top-[5%] h-[350px] w-[350px] rounded-full bg-[hsl(170,100%,50%,0.04)] blur-[110px]"
        />
        {/* Subtle accent orb */}
        <motion.div
          animate={{ x: [0, 25, 0], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[30%] bottom-[20%] h-[250px] w-[250px] rounded-full bg-[hsl(330,100%,60%,0.03)] blur-[100px]"
        />

        {/* === MAIN CONTENT === */}
        <div className="container relative z-10">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            
            {/* ── LEFT SIDE: Brand, Features & Social Proof ── */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Welcome badge with animated pulse */}
                <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-border/50 glass px-5 py-2.5 text-sm text-muted-foreground">
                  <Fingerprint size={15} className="text-primary" />
                  <span className="font-medium">Secure Authentication</span>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="h-2 w-2 rounded-full bg-[hsl(var(--success))]"
                  />
                </div>

                {/* Dynamic hero heading */}
                <h2 className="font-display text-4xl font-bold leading-tight text-foreground lg:text-5xl xl:text-[3.4rem]">
                  Welcome back to{" "}
                  <span className="text-shimmer">
                    <TypeAnimation
                      sequence={['ISHU', 3000, 'Your Dashboard', 2500, 'Exam Updates', 2500, 'PDF Tools', 2500]}
                      wrapper="span" speed={25} repeat={Infinity}
                    />
                  </span>
                </h2>

                <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                  Access your personalized dashboard, saved exams, instant WhatsApp alerts, and 100+ PDF tools — all in one place.
                </p>

                {/* Gradient accent line */}
                <div className="mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-primary via-[hsl(260,100%,66%)] to-[hsl(170,100%,50%)]" />

                {/* Feature cards grid with 3D tilt */}
                <div className="mt-10 grid grid-cols-2 gap-4">
                  {[
                    { icon: Bell, label: "Instant Alerts", desc: "WhatsApp notifications for exams", gradient: "from-amber-500/20 to-orange-500/20" },
                    { icon: Globe, label: "36 States", desc: "Complete nationwide coverage", gradient: "from-blue-500/20 to-cyan-500/20" },
                    { icon: Layers, label: "100+ PDF Tools", desc: "Free professional suite", gradient: "from-emerald-500/20 to-green-500/20" },
                    { icon: Shield, label: "Verified Data", desc: "Official government sources", gradient: "from-violet-500/20 to-purple-500/20" },
                  ].map((f, i) => (
                    <Tilt key={f.label} tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable glareMaxOpacity={0.06} glareColor="hsl(210 100% 56%)" glareBorderRadius="0.75rem" scale={1.03}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                        className="signin-feature-card group rounded-xl border border-border/50 glass-strong p-5 transition-all duration-300 hover:border-primary/25 hover:shadow-glow"
                      >
                        <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${f.gradient} p-2.5 transition-transform duration-300 group-hover:scale-110`}>
                          <f.icon size={20} className="text-foreground" />
                        </div>
                        <p className="font-display text-sm font-semibold text-foreground">{f.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                      </motion.div>
                    </Tilt>
                  ))}
                </div>

                {/* Testimonial card */}
                <div className="signin-testimonial mt-8 rounded-xl border border-border/40 glass overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <CheckCircle key={i} size={12} className="text-primary fill-primary/20" />
                      ))}
                      <span className="ml-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Verified Review</span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground italic">
                      "ISHU helped me get instant alerts for SSC CGL results. The PDF tools saved me hours of work. Never missed a single deadline!"
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-[hsl(260,100%,66%)] flex items-center justify-center text-xs font-bold text-primary-foreground">RK</div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Rahul Kumar</p>
                        <p className="text-[10px] text-muted-foreground">SSC CGL 2025 Aspirant</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live stats bar */}
                <div className="mt-7 flex items-center gap-8">
                  {[
                    { icon: Users, val: "1M+", label: "Active Users" },
                    { icon: TrendingUp, val: "99.9%", label: "Uptime" },
                    { icon: BarChart3, val: "50K+", label: "Results Tracked" },
                  ].map((s) => (
                    <div key={s.label} className="signin-stat-item flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8 border border-primary/10">
                        <s.icon size={14} className="text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-foreground">{s.val}</span>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT SIDE: Clerk Sign-In Form ── */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-[440px]">
                {/* Glow effect behind the card */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-[hsl(260,100%,66%,0.08)] blur-2xl" />
                
                <div className="relative">
                  {/* Clerk Sign-In Component with custom styling */}
                  <SignIn 
                    routing="hash"
                    signUpUrl="/auth/signup"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl",
                        headerTitle: "font-display text-foreground",
                        headerSubtitle: "text-muted-foreground",
                        formFieldLabel: "text-foreground font-medium",
                        formFieldInput: "bg-secondary/50 border-border text-foreground rounded-xl",
                        formButtonPrimary: "bg-primary hover:bg-primary/90 rounded-xl font-display font-semibold",
                        footerActionLink: "text-primary hover:text-primary/80 font-semibold",
                        socialButtonsBlockButton: "border-border bg-secondary/50 text-foreground rounded-xl hover:bg-secondary",
                        dividerLine: "bg-border",
                        dividerText: "text-muted-foreground",
                        formFieldInputShowPasswordButton: "text-muted-foreground",
                        identityPreviewEditButton: "text-primary",
                        formResendCodeLink: "text-primary",
                        otpCodeFieldInput: "border-border bg-secondary/50 text-foreground rounded-lg",
                        alert: "rounded-xl",
                        alertText: "text-sm",
                      },
                      layout: {
                        socialButtonsPlacement: "bottom",
                        socialButtonsVariant: "blockButton",
                      },
                    }}
                  />

                  {/* Bottom link for signup */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{" "}
                      <Link 
                        to="/auth/signup" 
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline transition-all group"
                      >
                        Create Account
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </p>
                  </div>

                  {/* Security badge */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground/70">
                    <Lock size={11} />
                    <span>Protected with end-to-end encryption</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>
    </Layout>
  );
};

export default SignInPage;
