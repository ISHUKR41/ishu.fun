/**
 * SignUpPage.tsx - Modern Sign-Up Page with Clerk Integration
 * 
 * Ultra-modern, animated registration page inspired by Clerk, Vercel, Apple, and Canva.
 * 
 * Features:
 * - Clerk's <SignUp /> component for seamless registration
 * - Animated gradient mesh background with floating orbs
 * - Glassmorphism card with subtle 3D tilt effects
 * - GSAP scroll animations with staggered entrance
 * - TypeAnimation for dynamic hero text
 * - Benefits list with hover micro-animations
 * - Trust badges, live stats, and testimonial
 * - Fully responsive mobile layout
 * - Premium SaaS-quality design language
 */
import Layout from "@/components/layout/Layout";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BookOpen, Sparkles, MessageCircle, ArrowRight, Shield,
  TrendingUp, Users, Zap, Check, Lock, Fingerprint,
  Bell, FileText, Globe, BarChart3, CheckCircle, Layers
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SignUp } from "@clerk/clerk-react";
import { TypeAnimation } from "react-type-animation";
import gsap from "gsap";
import Tilt from "react-parallax-tilt";

const SignUpPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLElement>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  // GSAP staggered entrance animations
  useEffect(() => {
    if (!panelRef.current) return;
    const ctx = gsap.context(() => {
      // Benefits list slides in from left
      gsap.fromTo(".signup-benefit",
        { x: -35, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.09, delay: 0.4, ease: "power3.out", clearProps: "all" }
      );
      // Stats pop in with spring
      gsap.fromTo(".signup-stat",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.9, ease: "back.out(1.7)", clearProps: "all" }
      );
      // Testimonial fades in
      gsap.fromTo(".signup-testimonial",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 1.2, ease: "power3.out", clearProps: "all" }
      );
    }, panelRef);
    return () => ctx.revert();
  }, []);

  if (user) return null;

  return (
    <Layout>
      <section ref={panelRef} className="relative flex min-h-screen items-center overflow-hidden py-24">
        {/* === BACKGROUND EFFECTS === */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-10" />
        <div className="pointer-events-none absolute inset-0 cross-grid opacity-8" />

        {/* Animated floating orbs */}
        <motion.div
          animate={{ x: [0, 70, 0], y: [0, -45, 0], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[3%] top-[10%] h-[550px] w-[550px] rounded-full bg-primary/5 blur-[150px]"
        />
        <motion.div
          animate={{ x: [0, -55, 0], y: [0, 35, 0] }}
          transition={{ repeat: Infinity, duration: 13, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[3%] bottom-[10%] h-[450px] w-[450px] rounded-full bg-[hsl(260,100%,66%,0.05)] blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[35%] top-[3%] h-[380px] w-[380px] rounded-full bg-[hsl(170,100%,50%,0.04)] blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[25%] bottom-[5%] h-[300px] w-[300px] rounded-full bg-[hsl(330,100%,60%,0.03)] blur-[100px]"
        />

        {/* === MAIN CONTENT === */}
        <div className="container relative z-10">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            
            {/* ── LEFT SIDE: Brand, Benefits & Social Proof ── */}
            <div className="hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {/* Join badge */}
                <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-border/50 glass px-5 py-2.5 text-sm text-muted-foreground">
                  <Sparkles size={15} className="text-primary" />
                  <span className="font-medium">Join Free — No Credit Card</span>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="h-2 w-2 rounded-full bg-[hsl(var(--success))]"
                  />
                </div>

                {/* Dynamic hero heading */}
                <h2 className="font-display text-4xl font-bold leading-tight text-foreground lg:text-5xl xl:text-[3.4rem]">
                  Join India's{" "}
                  <span className="text-shimmer">
                    <TypeAnimation
                      sequence={['#1 Platform', 3000, 'Largest Network', 2500, 'Best PDF Tools', 2500, 'Smartest Hub', 2500]}
                      wrapper="span" speed={25} repeat={Infinity}
                    />
                  </span>
                </h2>

                <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                  Get instant WhatsApp alerts for new vacancies, results & admit cards. Access 100+ PDF tools. Everything free, forever.
                </p>

                {/* Gradient accent line */}
                <div className="mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-primary via-[hsl(260,100%,66%)] to-[hsl(170,100%,50%)]" />

                {/* Quick stats */}
                <div className="mt-8 flex items-center gap-7">
                  {[
                    { icon: Users, val: "1M+", label: "Students" },
                    { icon: Layers, val: "100+", label: "PDF Tools" },
                    { icon: Globe, val: "36", label: "States" },
                  ].map((s) => (
                    <div key={s.label} className="signup-stat flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/8 border border-primary/10">
                        <s.icon size={15} className="text-primary" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-foreground">{s.val}</span>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Benefits list */}
                <div className="mt-8 space-y-3">
                  {[
                    { icon: Bell, text: "Instant WhatsApp Notifications", desc: "Never miss a deadline again" },
                    { icon: FileText, text: "100+ Free PDF Tools", desc: "Merge, compress, convert & more" },
                    { icon: Globe, text: "All 36 States Covered", desc: "Central + every state & UT" },
                    { icon: MessageCircle, text: "Multi-language News", desc: "1000+ daily articles in 22 languages" },
                    { icon: BookOpen, text: "Expert Blog & Guides", desc: "Preparation tips from toppers" },
                  ].map((f) => (
                    <motion.div
                      key={f.text}
                      whileHover={{ x: 5, borderColor: "hsl(var(--primary) / 0.3)" }}
                      className="signup-benefit flex items-center gap-4 rounded-xl border border-border/40 glass p-4 transition-all duration-300 hover:shadow-glow cursor-default"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--success))]/10 border border-[hsl(var(--success))]/10">
                        <f.icon size={18} className="text-[hsl(var(--success))]" />
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold text-foreground">{f.text}</p>
                        <p className="text-xs text-muted-foreground">{f.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="signup-testimonial mt-7 rounded-xl border border-border/40 glass overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <CheckCircle key={i} size={12} className="text-primary fill-primary/20" />
                      ))}
                      <span className="ml-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Verified Review</span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground italic">
                      "Joined a month ago and the WhatsApp alerts are a game-changer for UPSC preparation! The PDF tools are amazing too."
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-[hsl(260,100%,66%)] flex items-center justify-center text-xs font-bold text-primary-foreground">PS</div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">Priya Singh</p>
                        <p className="text-[10px] text-muted-foreground">UPSC 2025 Aspirant</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT SIDE: Clerk Sign-Up Form ── */}
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
                  {/* Clerk Sign-Up Component */}
                  <SignUp
                    routing="hash"
                    signInUrl="/auth/signin"
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

                  {/* Bottom link for signin */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link 
                        to="/auth/signin" 
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline transition-all group"
                      >
                        Sign In
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

export default SignUpPage;
