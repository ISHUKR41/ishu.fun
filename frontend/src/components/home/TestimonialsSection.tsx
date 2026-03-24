/**
 * TestimonialsSection.tsx — Student Success Stories
 *
 * Auto-scrolling carousel with 6 student testimonials.
 * Performance: CSS-only backgrounds — zero JS decorative animations.
 * Uses Embla carousel for accessible, smooth auto-advance.
 */

import { motion } from "framer-motion";
import FadeInView from "../animations/FadeInView";
import { Star, Quote, ChevronLeft, ChevronRight, MessageCircle, Users, TrendingUp } from "lucide-react";
import Tilt from "react-parallax-tilt";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useEmblaCarousel from "embla-carousel-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Priya Sharma", role: "UPSC CSE 2025 — AIR 42",
    text: "ISHU kept me updated with every notification. The WhatsApp alerts were a game-changer during my preparation. I never missed a single deadline or vacancy.",
    rating: 5, color: "#3b82f6", bg: "rgba(59,130,246,0.07)", avatar: "PS",
  },
  {
    name: "Rahul Verma", role: "SSC CGL Selected",
    text: "The PDF tools saved me so much time. I merged all my NCERT notes and compressed study materials in seconds. Best free tool suite available for students in India.",
    rating: 5, color: "#10b981", bg: "rgba(16,185,129,0.07)", avatar: "RV",
  },
  {
    name: "Anita Kumari", role: "IBPS PO 2025",
    text: "Best platform for government job updates. The state-wise filtering helped me find Bihar-specific vacancies instantly. The UI is very smooth and fast on mobile too.",
    rating: 5, color: "#8b5cf6", bg: "rgba(139,92,246,0.07)", avatar: "AK",
  },
  {
    name: "Vikash Singh", role: "RRB NTPC Selected",
    text: "I used to check 10 different websites daily. Now ISHU gives me everything in one place — results, news, and tools. Clean design, no ads, totally free!",
    rating: 5, color: "#f59e0b", bg: "rgba(245,158,11,0.07)", avatar: "VS",
  },
  {
    name: "Sneha Patel", role: "NEET UG 2025 Qualified",
    text: "The news section with Gujarati language support helped me stay informed in my mother tongue. The expert blog preparation tips were incredibly useful for NEET.",
    rating: 5, color: "#f43f5e", bg: "rgba(244,63,94,0.07)", avatar: "SP",
  },
  {
    name: "Amit Yadav", role: "UP Police Constable Selected",
    text: "State-wise pages are amazing! Found all UP Police vacancies in one place. The WhatsApp notification came within minutes — I applied the same day. Thank you ISHU!",
    rating: 5, color: "#06b6d4", bg: "rgba(6,182,212,0.07)", avatar: "AY",
  },
];

const socialProof = [
  { icon: Users, value: "1M+", label: "Happy Students" },
  { icon: Star, value: "4.9/5", label: "Average Rating" },
  { icon: TrendingUp, value: "50K+", label: "Success Stories" },
  { icon: MessageCircle, value: "10K+", label: "WhatsApp Users" },
];

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) emblaApi.scrollNext();
      else emblaApi.scrollTo(0);
    }, 5000);
    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(interval);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".social-proof-item",
        { scale: 0.82, opacity: 0 },
        {
          scrollTrigger: { trigger: ".social-proof-bar", start: "top 85%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.09, duration: 0.45, ease: "back.out(1.7)", clearProps: "all",
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/[0.05] py-28"
    >
      {/* CSS-only background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/70 to-background" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 50% 50% at 20% 40%, rgba(99,102,241,0.04) 0%, transparent 65%),
            radial-gradient(ellipse 50% 50% at 80% 60%, rgba(139,92,246,0.03) 0%, transparent 65%)
          `,
        }}
      />
      <div className="pointer-events-none absolute inset-0 grain" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="testimonial-heading mx-auto mb-10 max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-sm font-semibold uppercase tracking-widest text-primary"
          >
            Success Stories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-4 font-display text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Trusted by{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Lakhs
            </span>{" "}
            of Students
          </motion.h2>
          <p className="mt-3 text-white/40">Real stories from real aspirants who achieved their dreams with ISHU.</p>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>

        {/* Social proof bar */}
        <div className="social-proof-bar mb-12 flex flex-wrap items-center justify-center gap-3 md:gap-6">
          {socialProof.map((s) => (
            <div
              key={s.label}
              className="social-proof-item flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5"
            >
              <s.icon size={15} className="text-primary" />
              <div>
                <p className="font-display text-base font-bold text-white">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/35">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel */}
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-5">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="min-w-0 flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-1"
                >
                  <Tilt
                    tiltMaxAngleX={5}
                    tiltMaxAngleY={5}
                    glareEnable
                    glareMaxOpacity={0.05}
                    glareColor={t.color}
                    glarePosition="all"
                    glareBorderRadius="1rem"
                    scale={1.02}
                    transitionSpeed={400}
                  >
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#080810]/85 p-7 transition-all duration-300 hover:border-white/[0.14]"
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px ${t.bg}`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.boxShadow = "";
                      }}
                    >
                      <div
                        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                        style={{ background: `radial-gradient(ellipse 80% 60% at 20% 20%, ${t.bg}, transparent)` }}
                      />

                      <div className="relative">
                        <Quote size={26} className="mb-4 opacity-20" style={{ color: t.color }} />
                        <div className="mb-3 flex gap-0.5">
                          {Array.from({ length: t.rating }).map((_, j) => (
                            <Star key={j} size={13} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="min-h-[72px] text-sm leading-relaxed text-white/55">{t.text}</p>
                        <div className="mt-5 flex items-center gap-3 border-t border-white/[0.06] pt-4">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full font-display text-xs font-bold text-white"
                            style={{ background: `linear-gradient(135deg, ${t.color}40, ${t.color}20)`, border: `1px solid ${t.color}30` }}
                          >
                            {t.avatar}
                          </div>
                          <div>
                            <p className="font-display text-sm font-semibold text-white/90">{t.name}</p>
                            <p className="text-xs" style={{ color: t.color }}>{t.role}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Tilt>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={scrollPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/60 transition-all hover:border-primary/30 hover:text-white disabled:opacity-30"
              disabled={!canScrollPrev}
            >
              <ChevronLeft size={17} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={scrollNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/60 transition-all hover:border-primary/30 hover:text-white disabled:opacity-30"
              disabled={!canScrollNext}
            >
              <ChevronRight size={17} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
