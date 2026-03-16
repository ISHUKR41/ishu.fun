/**
 * SignUpPage.tsx - Ultra-Modern Sign-Up Page with Clerk Integration
 * 
 * Premium registration page inspired by Vercel, Clerk, Linear, Stripe,
 * Apple, Tesla, GitHub, Canva, and Dora AI.
 * 
 * Design Philosophy:
 * - Deep dark background with animated gradient mesh
 * - Glassmorphism panels with frosted glass effects
 * - Animated geometric grid lines in background
 * - Floating gradient orbs with slow parallax movement
 * - GSAP-powered staggered entrance animations
 * - TypeAnimation for dynamic rotating hero text
 * - Benefits list with hover micro-animations
 * - Aggressive Clerk dark-mode overrides for full visibility
 * - Responsive layout with hidden left panel on mobile
 * - No emoji/stars — only Lucide React icons
 */
import Layout from "@/components/layout/Layout";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BookOpen, Sparkles, MessageCircle, ArrowRight, Shield,
  TrendingUp, Users, Zap, Lock, Fingerprint,
  Bell, FileText, Globe, BarChart3, CheckCircle, Layers
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SignUp } from "@clerk/clerk-react";
import { TypeAnimation } from "react-type-animation";
import gsap from "gsap";

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
      gsap.fromTo(".signup-benefit",
        { x: -35, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.09, delay: 0.4, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".signup-stat",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.9, ease: "back.out(1.7)", clearProps: "all" }
      );
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
        {/* === ANIMATED BACKGROUND MESH === */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 120% 80% at 50% 0%, hsl(220 60% 8%) 0%, hsl(225 50% 4%) 60%, hsl(230 60% 2%) 100%)"
        }} />

        {/* Animated grid pattern */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }} />

        {/* Radial gradient spotlight */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 40% at 50% -5%, hsl(260 100% 60% / 0.1), transparent 70%)"
        }} />

        {/* Floating orbs */}
        <motion.div
          animate={{ x: [0, 70, 0], y: [0, -45, 0], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[3%] top-[10%] h-[550px] w-[550px] rounded-full blur-[160px]"
          style={{ background: "radial-gradient(circle, hsl(260 100% 60% / 0.08), transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -55, 0], y: [0, 35, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[3%] bottom-[10%] h-[450px] w-[450px] rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, hsl(217 100% 55% / 0.07), transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[35%] top-[3%] h-[380px] w-[380px] rounded-full blur-[120px]"
          style={{ background: "radial-gradient(circle, hsl(170 100% 50% / 0.05), transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[25%] bottom-[5%] h-[300px] w-[300px] rounded-full blur-[100px]"
          style={{ background: "radial-gradient(circle, hsl(330 100% 60% / 0.04), transparent 70%)" }}
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
                <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md px-5 py-2.5 text-sm text-white/60">
                  <Sparkles size={15} className="text-violet-400" />
                  <span className="font-medium">Join Free — No Credit Card</span>
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="h-2 w-2 rounded-full bg-emerald-400"
                  />
                </div>

                {/* Dynamic hero heading */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.15] tracking-tight text-white lg:text-5xl xl:text-[3.5rem]" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
                  Join India's{" "}
                  <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    <TypeAnimation
                      sequence={['#1 Platform', 3000, 'Largest Network', 2500, 'Best PDF Tools', 2500, 'Smartest Hub', 2500]}
                      wrapper="span" speed={25} repeat={Infinity}
                    />
                  </span>
                </h2>

                <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/50">
                  Get instant WhatsApp alerts for new vacancies, results & admit cards. Access 100+ PDF tools. Everything free, forever.
                </p>

                {/* Gradient accent line */}
                <div className="mt-6 h-[3px] w-20 rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500" />

                {/* Quick stats */}
                <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-7">
                  {[
                    { icon: Users, val: "1M+", label: "Students", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/10" },
                    { icon: Layers, val: "100+", label: "PDF Tools", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/10" },
                    { icon: Globe, val: "36", label: "States", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/10" },
                  ].map((s) => (
                    <div key={s.label} className="signup-stat flex items-center gap-2.5">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.bg} border`}>
                        <s.icon size={15} className={s.color} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white/90">{s.val}</span>
                        <p className="text-[10px] text-white/40">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Benefits list */}
                <div className="mt-8 space-y-3">
                  {[
                    { icon: Bell, text: "Instant WhatsApp Notifications", desc: "Never miss a deadline again", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/10" },
                    { icon: FileText, text: "100+ Free PDF Tools", desc: "Merge, compress, convert & more", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/10" },
                    { icon: Globe, text: "All 36 States Covered", desc: "Central + every state & UT", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/10" },
                    { icon: MessageCircle, text: "Multi-language News", desc: "1000+ daily articles in 22 languages", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/10" },
                    { icon: BookOpen, text: "Expert Blog & Guides", desc: "Preparation tips from toppers", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/10" },
                  ].map((f) => (
                    <motion.div
                      key={f.text}
                      whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.04)" }}
                      className="signup-benefit flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 transition-all duration-300 cursor-default"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${f.bg} border`}>
                        <f.icon size={18} className={f.color} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white/90">{f.text}</p>
                        <p className="text-xs text-white/40">{f.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="signup-testimonial mt-7 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <CheckCircle key={i} size={12} className="text-violet-400 fill-violet-400/20" />
                      ))}
                      <span className="ml-2 text-[10px] font-medium text-white/40 uppercase tracking-wider">Verified Review</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/50 italic">
                      "Joined a month ago and the WhatsApp alerts are a game-changer for UPSC preparation! The PDF tools are amazing too."
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">PS</div>
                      <div>
                        <p className="text-xs font-semibold text-white/80">Priya Singh</p>
                        <p className="text-[10px] text-white/40">UPSC 2025 Aspirant</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT SIDE: Clerk Sign-Up Form ── */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-[440px]">
                {/* Multi-layer glow */}
                <div className="absolute -inset-6 rounded-3xl opacity-60 blur-3xl" style={{
                  background: "radial-gradient(ellipse at center, hsl(260 100% 60% / 0.12), transparent 70%)"
                }} />
                <div className="absolute -inset-3 rounded-3xl opacity-40 blur-xl" style={{
                  background: "radial-gradient(ellipse at center, hsl(217 100% 55% / 0.08), transparent 60%)"
                }} />
                
                <div className="relative">
                  {/* Clerk Sign-Up with aggressive dark mode overrides */}
                  <SignUp
                    routing="hash"
                    signInUrl="/auth/signin"
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
                        badge: "bg-violet-500/20 text-violet-300",
                        tagInputContainer: "bg-white/[0.06] border-white/[0.1]",
                      },
                      layout: {
                        socialButtonsPlacement: "bottom",
                        socialButtonsVariant: "blockButton",
                        showOptionalFields: true,
                      },
                    }}
                  />

                  {/* Bottom link for signin */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-white/50">
                      Already have an account?{" "}
                      <Link 
                        to="/auth/signin" 
                        className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 transition-all group"
                      >
                        Sign In
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

export default SignUpPage;
