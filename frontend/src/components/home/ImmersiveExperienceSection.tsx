import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import { Orbit, Sparkles, ShieldCheck, Radio, Globe2, Layers3 } from "lucide-react";
import FadeInView from "../animations/FadeInView";

gsap.registerPlugin(ScrollTrigger);

const layers = [
  {
    icon: Radio,
    title: "Realtime Intelligence",
    description: "Live updates for results, vacancies, and alerts with priority tracking.",
  },
  {
    icon: Globe2,
    title: "Pan-India Coverage",
    description: "Unified access for central + state exam ecosystem in one streamlined experience.",
  },
  {
    icon: Layers3,
    title: "Unified Stack",
    description: "Results, tools, news and preparation workflows connected in one place.",
  },
];

const ImmersiveExperienceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".immersive-card",
        { y: 40, opacity: 0, scale: 0.96 },
        {
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-border py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced opacity-50" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 40% 40% at 10% 30%, rgba(99,102,241,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 90% 70%, rgba(139,92,246,0.05) 0%, transparent 60%)
          `,
        }}
      />

      <div className="container relative">
        <FadeInView>
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border glass px-5 py-2 text-xs text-muted-foreground">
              <Sparkles size={12} className="text-primary" />
              <span><strong className="text-foreground">ISHU</strong> — Indian StudentHub University</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-5xl">
              Immersive <span className="text-gradient">Modern Experience</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Premium 3D motion, layered visuals and performance-first interactions — built to stay smooth on every page.
            </p>
          </div>
        </FadeInView>

        <div className="grid gap-5 md:grid-cols-3">
          {layers.map((item) => (
            <Tilt key={item.title} tiltMaxAngleX={7} tiltMaxAngleY={7} glareEnable glareMaxOpacity={0.07} glareBorderRadius="1rem" scale={1.02}>
              <div className="immersive-card h-full rounded-2xl border border-border glass-strong p-6 transition-all hover:border-primary/25 hover:shadow-glow">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon size={20} />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            </Tilt>
          ))}
        </div>

        <FadeInView delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-border glass px-5 py-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-primary" /> Zero-removal additive upgrades</span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1.5"><Orbit size={13} className="text-primary" /> 3D + animated professional visuals</span>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default ImmersiveExperienceSection;
