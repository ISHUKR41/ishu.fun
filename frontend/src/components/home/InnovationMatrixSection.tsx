import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Cpu, Orbit, Radar, Sparkles, Workflow, Gauge } from "lucide-react";
import FadeInView from "../animations/FadeInView";

const pillars = [
  {
    icon: Workflow,
    title: "Adaptive Workflow Grid",
    detail: "Results, tools, news and preparation signals connected with context-aware navigation.",
  },
  {
    icon: Radar,
    title: "Live Signal Layer",
    detail: "Real-time trend pulse across exams, deadlines and high-priority public updates.",
  },
  {
    icon: Gauge,
    title: "Performance First",
    detail: "Animation-rich presentation optimized for smooth interaction across mobile and desktop.",
  },
];

const InnovationMatrixSection = () => {
  return (
    <section className="relative overflow-hidden border-t border-border py-24 md:py-28">
      <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced opacity-40" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 40% 45% at 8% 20%, rgba(99,102,241,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 40% 45% at 92% 75%, rgba(139,92,246,0.05) 0%, transparent 65%)
          `,
        }}
      />

      <div className="container relative z-10">
        <FadeInView>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-2 text-xs text-muted-foreground">
              <Sparkles size={12} className="text-primary" />
              ISHU — Indian StudentHub University · Advanced Experience Layer
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-5xl">
              High-Fidelity <span className="text-gradient">Innovation Matrix</span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              A deeper visual + functional layer built to make discovery faster and information flow more immersive.
            </p>
          </div>
        </FadeInView>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <FadeInView key={pillar.title} delay={0.08 * index}>
              <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} glareEnable glareMaxOpacity={0.05} glareBorderRadius="1rem" scale={1.01}>
                <div className="h-full rounded-2xl border border-border glass-strong p-6 transition-all hover:border-primary/30 hover:shadow-glow">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <pillar.icon size={20} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.detail}</p>
                </div>
              </Tilt>
            </FadeInView>
          ))}
        </div>

        <FadeInView delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-border glass px-5 py-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Cpu size={13} className="text-primary" /> Additive architecture only</span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1.5"><Orbit size={13} className="text-primary" /> Motion + depth tuned for smoothness</span>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default InnovationMatrixSection;
