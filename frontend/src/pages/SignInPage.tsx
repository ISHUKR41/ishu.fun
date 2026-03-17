/**
 * SignInPage.tsx - Ultra-Modern Sign-In Page with Clerk Integration
 * 
 * Premium authentication page inspired by Vercel, Clerk, Linear, Stripe,
 * Apple, Tesla, GitHub, Canva, and Dora AI.
 * 
 * Design Philosophy:
 * - Deep dark background with animated gradient mesh
 * - Glassmorphism panels with frosted glass effects
 * - Animated geometric grid lines in background
 * - Floating gradient orbs with slow parallax movement
 * - GSAP-powered staggered entrance animations
 * - TypeAnimation for dynamic rotating hero text
 * - 3D tilt on feature cards via react-parallax-tilt
 * - Aggressive Clerk dark-mode overrides for full visibility
 * - Responsive layout with hidden left panel on mobile
 * - No emoji/stars — only Lucide React icons
 */
import Layout from "@/components/layout/Layout";
import { useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Shield, Zap, Globe, ArrowRight,
  CheckCircle, Users, TrendingUp, Lock, Fingerprint,
  Layers, Bell, BarChart3
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SignIn } from "@clerk/clerk-react";
import { TypeAnimation } from "react-type-animation";
import gsap from "gsap";
import Tilt from "react-parallax-tilt";

const SignInPage = () => {
  const { user, loading } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);

  // GSAP staggered entrance animations
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".signin-feature-card",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, delay: 0.5, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".signin-stat-item",
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.9, ease: "back.out(1.7)", clearProps: "all" }
      );
      gsap.fromTo(".signin-testimonial",
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, delay: 1.2, ease: "power3.out", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  return (
    <Layout>
      <section ref={sectionRef} className="relative flex min-h-[92vh] items-center overflow-hidden">
        {/* === ANIMATED BACKGROUND MESH === */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 120% 80% at 50% 0%, hsl(220 60% 8%) 0%, hsl(225 50% 4%) 60%, hsl(230 60% 2%) 100%)"
        }} />

        {/* Dynamic Background Image */}
        <motion.div className="fixed inset-0 opacity-[0.15] mix-blend-luminosity scale-[1.15] origin-center -z-10" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: bgY
        }} />

        {/* Animated grid pattern — like Vercel/Linear */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }} />

        {/* Radial gradient spotlight from top */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 40% at 50% -5%, hsl(217 100% 55% / 0.12), transparent 70%)"
        }} />

        {/* Floating orbs with smooth animation */}
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -35, 0], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[5%] top-[15%] h-[500px] w-[500px] rounded-full blur-[160px]"
          style={{ background: "radial-gradient(circle, hsl(217 100% 55% / 0.08), transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 45, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[8%] bottom-[10%] h-[450px] w-[450px] rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, hsl(260 100% 65% / 0.07), transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, 35, 0], y: [0, -25, 0] }}
          transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[35%] top-[5%] h-[350px] w-[350px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, hsl(170 100% 50% / 0.05), transparent 70%)" }}
        />
        {/* Subtle pink accent */}
        <motion.div
          animate={{ x: [0, 25, 0], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[30%] bottom-[20%] h-[280px] w-[280px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, hsl(330 100% 60% / 0.04), transparent 70%)" }}
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
                {/* Secure auth badge */}
                <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md px-5 py-2.5 text-sm text-white/60">
                  <Fingerprint size={15} className="text-blue-400" />
                  <span className="font-medium">Secure Authentication</span>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="h-2 w-2 rounded-full bg-emerald-400"
                  />
                </div>

                {/* Dynamic hero heading */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.15] tracking-tight text-white lg:text-5xl xl:text-[3.5rem]" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
                  Welcome back to{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    <TypeAnimation
                      sequence={['ISHU', 3000, 'Your Dashboard', 2500, 'Exam Updates', 2500, 'PDF Tools', 2500]}
                      wrapper="span" speed={25} repeat={Infinity}
                    />
                  </span>
                </h2>

                <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/50">
                  Access your personalized dashboard, saved exams, instant WhatsApp alerts, and 100+ PDF tools — all in one place.
                </p>

                {/* Gradient accent line */}
                <div className="mt-6 h-[3px] w-20 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500" />

                {/* Feature cards grid with 3D tilt */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: Bell, label: "Instant Alerts", desc: "WhatsApp notifications for exams", color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400" },
                    { icon: Globe, label: "36 States", desc: "Complete nationwide coverage", color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-400" },
                    { icon: Layers, label: "100+ PDF Tools", desc: "Free professional suite", color: "from-emerald-500/20 to-green-500/20", iconColor: "text-emerald-400" },
                    { icon: Shield, label: "Verified Data", desc: "Official government sources", color: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
                  ].map((f, i) => (
                    <Tilt key={f.label} tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.06} glareColor="#60a5fa" glareBorderRadius="0.75rem" scale={1.02}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                        className="signin-feature-card group rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]"
                      >
                        <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${f.color} p-2.5 transition-transform duration-300 group-hover:scale-110`}>
                          <f.icon size={20} className={f.iconColor} />
                        </div>
                        <p className="text-sm font-semibold text-white/90">{f.label}</p>
                        <p className="mt-1 text-xs text-white/40 leading-relaxed">{f.desc}</p>
                      </motion.div>
                    </Tilt>
                  ))}
                </div>

                {/* Testimonial card */}
                <div className="signin-testimonial mt-8 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <CheckCircle key={i} size={12} className="text-blue-400 fill-blue-400/20" />
                      ))}
                      <span className="ml-2 text-[10px] font-medium text-white/40 uppercase tracking-wider">Verified Review</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/50 italic">
                      "ISHU helped me get instant alerts for SSC CGL results. The PDF tools saved me hours of work. Never missed a single deadline!"
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white">RK</div>
                      <div>
                        <p className="text-xs font-semibold text-white/80">Rahul Kumar</p>
                        <p className="text-[10px] text-white/40">SSC CGL 2025 Aspirant</p>
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
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/10">
                        <s.icon size={14} className="text-blue-400" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white/90">{s.val}</span>
                        <p className="text-[10px] text-white/40">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT SIDE: Clerk Sign-In Form ── */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-[440px]">
                {/* Multi-layer glow effect behind card */}
                <div className="absolute -inset-6 rounded-3xl opacity-60 blur-3xl" style={{
                  background: "radial-gradient(ellipse at center, hsl(217 100% 55% / 0.15), transparent 70%)"
                }} />
                <div className="absolute -inset-3 rounded-3xl opacity-40 blur-xl" style={{
                  background: "radial-gradient(ellipse at center, hsl(260 100% 65% / 0.1), transparent 60%)"
                }} />
                
                <div className="relative">
                  {/* Clerk Sign-In with aggressive dark mode overrides */}
                  <SignIn 
                    routing="hash"
                    signUpUrl="/auth/signup"
                    appearance={{
                      variables: {
                        colorPrimary: "hsl(217, 91%, 60%)",
                        colorBackground: "hsl(225, 50%, 8%)",
                        colorText: "hsl(210, 40%, 96%)",
                        colorTextSecondary: "hsl(215, 20%, 65%)",
                        colorInputBackground: "hsl(220, 40%, 13%)",
                        colorInputText: "hsl(210, 40%, 96%)",
                        borderRadius: "0.75rem",
                        colorDanger: "hsl(0, 84%, 60%)",
                        colorSuccess: "hsl(142, 71%, 45%)",
                        colorWarning: "hsl(38, 92%, 50%)",
                        colorNeutral: "hsl(215, 20%, 65%)",
                        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                      },
                      elements: {
                        rootBox: "w-full",
                        card: "bg-[hsl(225,50%,8%)]/98 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.8)] rounded-2xl",
                        headerTitle: "text-white font-semibold text-xl",
                        headerSubtitle: "text-white/50",
                        formFieldLabel: "text-white/80 font-medium text-sm",
                        formFieldInput: "bg-white/[0.06] border-white/[0.1] text-white rounded-xl placeholder:text-white/30 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20",
                        formButtonPrimary: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-semibold shadow-[0_4px_16px_hsl(217,91%,60%,0.25)] transition-all duration-200",
                        footerActionLink: "text-blue-400 hover:text-blue-300 font-semibold",
                        socialButtonsBlockButton: "border-white/[0.08] bg-white/[0.04] text-white/90 rounded-xl hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200",
                        socialButtonsBlockButtonText: "text-white/80 font-medium",
                        dividerLine: "bg-white/[0.08]",
                        dividerText: "text-white/40",
                        formFieldInputShowPasswordButton: "text-white/40 hover:text-white/60",
                        identityPreviewEditButton: "text-blue-400",
                        identityPreviewText: "text-white/80",
                        formResendCodeLink: "text-blue-400",
                        otpCodeFieldInput: "border-white/[0.1] bg-white/[0.06] text-white rounded-lg",
                        alert: "rounded-xl bg-white/[0.04] border-white/[0.08]",
                        alertText: "text-sm text-white/70",
                        footer: "hidden",
                        formFieldAction: "text-blue-400 hover:text-blue-300",
                        phoneInputBox: "bg-white/[0.06] border-white/[0.1] rounded-xl",
                        selectButton: "bg-white/[0.06] border-white/[0.1] text-white/80",
                        selectSearchInput: "bg-white/[0.06] border-white/[0.1] text-white",
                        selectOption: "text-white/80 hover:bg-white/[0.08]",
                        formHeaderTitle: "text-white",
                        formHeaderSubtitle: "text-white/50",
                        card__main: "bg-transparent",
                        cardBox: "shadow-none",
                        logoBox: "hidden",
                        badge: "bg-blue-500/20 text-blue-300",
                        tagInputContainer: "bg-white/[0.06] border-white/[0.1]",
                      },
                      layout: {
                        socialButtonsPlacement: "bottom",
                        socialButtonsVariant: "blockButton",
                        showOptionalFields: true,
                      },
                    }}
                  />

                  {/* Bottom link for signup */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-white/50">
                      Don't have an account?{" "}
                      <Link 
                        to="/auth/signup" 
                        className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 transition-all group"
                      >
                        Create Account
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </p>
                  </div>

                  {/* Encryption badge */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/30">
                    <Lock size={11} />
                    <span>Protected with end-to-end encryption</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(230,60%,2%)] to-transparent" />
      </section>

      {/* === GLOBAL CLERK DARK MODE CSS OVERRIDES === */}
      <style>{`
        /* Force dark theme on ALL Clerk elements */
        .cl-card,
        .cl-rootBox .cl-card {
          background: hsl(225, 50%, 8%) !important;
          border-color: rgba(255,255,255,0.08) !important;
          color: white !important;
        }
        .cl-internal-b3fm6y,
        .cl-headerTitle {
          color: white !important;
        }
        .cl-headerSubtitle,
        .cl-internal-1hp5nqm {
          color: rgba(255,255,255,0.5) !important;
        }
        .cl-formFieldLabel,
        .cl-internal-2iusy0 {
          color: rgba(255,255,255,0.8) !important;
        }
        .cl-formFieldInput,
        .cl-input,
        .cl-phoneNumberInput,
        .cl-internal-71suz3 {
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        .cl-formFieldInput::placeholder,
        .cl-input::placeholder {
          color: rgba(255,255,255,0.3) !important;
        }
        .cl-formFieldInput:focus,
        .cl-input:focus {
          border-color: hsl(217, 91%, 60%) !important;
          box-shadow: 0 0 0 2px hsl(217, 91%, 60%, 0.15) !important;
        }
        .cl-socialButtonsBlockButton,
        .cl-socialButtonsBlockButton__github,
        .cl-socialButtonsBlockButton__google,
        .cl-socialButtonsBlockButton__microsoft {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(255,255,255,0.08) !important;
          color: rgba(255,255,255,0.9) !important;
        }
        .cl-socialButtonsBlockButton:hover {
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(255,255,255,0.15) !important;
        }
        .cl-socialButtonsBlockButtonText {
          color: rgba(255,255,255,0.8) !important;
        }
        .cl-dividerLine {
          background: rgba(255,255,255,0.08) !important;
        }
        .cl-dividerText {
          color: rgba(255,255,255,0.4) !important;
        }
        .cl-footerActionLink,
        .cl-footerActionText a {
          color: hsl(217, 91%, 65%) !important;
        }
        .cl-formButtonPrimary {
          background: linear-gradient(135deg, hsl(217, 91%, 55%), hsl(217, 91%, 50%)) !important;
          box-shadow: 0 4px 16px hsl(217, 91%, 60%, 0.25) !important;
        }
        .cl-formButtonPrimary:hover {
          background: linear-gradient(135deg, hsl(217, 91%, 60%), hsl(217, 91%, 55%)) !important;
        }
        .cl-footer {
          display: none !important;
        }
        .cl-internal-b3fm6y + div,
        .cl-otpCodeFieldInput {
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        .cl-formFieldInputShowPasswordButton {
          color: rgba(255,255,255,0.4) !important;
        }
        .cl-formFieldInputShowPasswordButton:hover {
          color: rgba(255,255,255,0.7) !important;
        }
        .cl-userButtonPopoverCard,
        .cl-modalContent {
          background: hsl(225, 50%, 8%) !important;
          border-color: rgba(255,255,255,0.08) !important;
        }
        .cl-selectButton__countryCode,
        .cl-selectButton {
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(255,255,255,0.1) !important;
          color: rgba(255,255,255,0.8) !important;
        }
        .cl-internal-s8gsto,
        .cl-formFieldHintText {
          color: rgba(255,255,255,0.4) !important;
        }
        .cl-identityPreview {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(255,255,255,0.08) !important;
        }
        .cl-identityPreviewText {
          color: rgba(255,255,255,0.8) !important;
        }
        .cl-identityPreviewEditButton {
          color: hsl(217, 91%, 65%) !important;
        }
        .cl-formResendCodeLink {
          color: hsl(217, 91%, 65%) !important;
        }
        .cl-alert {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(255,255,255,0.08) !important;
        }
        .cl-alertText {
          color: rgba(255,255,255,0.7) !important;
        }
        /* Powered by Clerk badge — style it or hide */
        .cl-internal-rnx3u3,
        [data-localization-key="footerPageLink__help"],
        [data-localization-key="footerPageLink__privacy"],
        [data-localization-key="footerPageLink__terms"] {
          color: rgba(255,255,255,0.25) !important;
        }
        .cl-footerPages {
          opacity: 0.5;
        }
        /* Hide phone number fields — Indian numbers not supported on Clerk free plan */
        .cl-formField__phoneNumber,
        .cl-phoneNumberInput,
        [data-field-name="phoneNumber"],
        .cl-formFieldRow__phoneNumber,
        .cl-alternativeMethodsBlockButton__phoneCode,
        .cl-socialButtonsBlockButton__phoneCode,
        button[data-localization-key*="phone"],
        .cl-formFieldLabel[for*="phone"],
        .cl-formFieldInput[name*="phone"] {
          display: none !important;
        }
      `}</style>
    </Layout>
  );
};

export default SignInPage;
