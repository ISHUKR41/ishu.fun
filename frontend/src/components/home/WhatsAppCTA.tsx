/**
 * WhatsAppCTA.tsx - WhatsApp Subscription Call-to-Action
 * 
 * A large card section encouraging users to subscribe to WhatsApp alerts.
 * Left side: headline, benefits list, animated icon.
 * Right side: phone number input form with +91 prefix.
 * 
 * Features:
 * - Phone number validation (10 digits, numeric only)
 * - Success state with animated checkmark after submission
 * - GSAP staggered benefit items entrance
 * - Tilt card wrapper for subtle 3D effect
 * - Animated floating WhatsApp icon
 * - Mesh gradient background with ambient orbs
 */

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FadeInView from "../animations/FadeInView";
import { MessageCircle, Bell, ArrowRight, Check, Shield, Zap, Users, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  { icon: Zap, text: "Instant alerts within minutes" },
  { icon: Shield, text: "100% free, no spam ever" },
  { icon: Users, text: "Join 50K+ subscribers" },
];

const WhatsAppCTA = () => {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".benefit-item",
        { x: -20, opacity: 0 },
        { scrollTrigger: { trigger: ".benefits-list", start: "top 85%", toggleActions: "play none none none" },
          x: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "power3.out", clearProps: "all" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) setSubmitted(true);
  };

  return (
    <section ref={sectionRef} className="py-28 relative overflow-hidden bg-gradient-to-b from-background via-card/50 to-background">
      {/* Ambient backgrounds */}
      <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced opacity-50" />
      <div className="pointer-events-none absolute inset-0 grain" />
      
      {/* CSS-only background orbs — no JS */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 45% 40% at 15% 35%, rgba(16,185,129,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 45% 40% at 85% 65%, rgba(99,102,241,0.05) 0%, transparent 60%)
          `,
        }}
      />
      
      <div className="container relative z-10">
        <FadeInView>
          <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable glareMaxOpacity={0.04} glareBorderRadius="1.5rem" scale={1.01}>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-16">
              {/* Background effects */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-success/10 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
              <div className="bg-dots pointer-events-none absolute inset-0 opacity-10" />

              {/* Ambient light effect */}
              <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="pointer-events-none absolute right-[10%] top-[10%] h-32 w-32 rounded-full bg-success/8 blur-[60px]" />

              <div className="relative grid gap-10 lg:grid-cols-2 items-center">
                {/* Left - Content */}
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/5 px-3 py-1.5 text-xs text-success">
                    <Sparkles size={12} /> WhatsApp Alerts
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="h-1.5 w-1.5 rounded-full bg-success" />
                  </div>

                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
                    <MessageCircle size={32} className="text-success" />
                  </motion.div>

                  <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
                    Never Miss a <span className="text-gradient-accent">Deadline</span>
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Get instant WhatsApp notifications for new vacancies, results & admit cards. Subscribe once, stay updated forever.
                  </p>

                  {/* Benefits */}
                  <div className="benefits-list mt-6 space-y-3">
                    {benefits.map((b) => (
                      <div key={b.text} className="benefit-item flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10 text-success">
                          <b.icon size={14} />
                        </div>
                        <span className="text-sm text-foreground">{b.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right - Form */}
                <div className="rounded-2xl border border-border glass-strong p-8">
                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <h3 className="font-display text-lg font-bold text-foreground">Subscribe Now</h3>
                      <p className="text-sm text-muted-foreground">Enter your WhatsApp number to get started</p>

                      <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3">
                        <span className="text-sm font-medium text-muted-foreground">+91</span>
                        <input type="tel" placeholder="Enter WhatsApp number" value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                      </div>

                      <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-success px-6 py-3 font-display text-sm font-semibold text-success-foreground transition-all hover:opacity-90">
                        <Bell size={16} /> Subscribe Free <ArrowRight size={14} />
                      </motion.button>

                      <p className="text-center text-[10px] text-muted-foreground">We respect your privacy. Unsubscribe anytime.</p>
                    </form>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                        <Check size={32} className="text-success" />
                      </motion.div>
                      <h3 className="font-display text-xl font-bold text-foreground">Subscribed!</h3>
                      <p className="mt-2 text-sm text-muted-foreground">You'll receive updates on WhatsApp soon!</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </Tilt>
        </FadeInView>
      </div>
    </section>
  );
};

export default WhatsAppCTA;
