/**
 * ParticleField.tsx - Canvas-Based Particle Animation
 *
 * Renders a transparent canvas overlay with floating particles
 * that drift slowly and connect with lines when close together.
 *
 * Performance improvements:
 * - Uses IntersectionObserver to pause when offscreen
 * - Uses squared distance to avoid Math.sqrt in connection loop
 * - Pre-caches color strings to avoid per-frame string allocation
 */

import { useEffect, useRef } from "react";

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    let frameCount = 0;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; fillColor: string }[] = [];

    const resize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      particles.forEach((p) => {
        if (p.x > w) p.x = w - 1;
        if (p.y > h) p.y = h - 1;
      });
    };

    const init = () => {
      resize();
      const count = Math.min(25, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 18000));
      for (let i = 0; i < count; i++) {
        const alpha = Math.random() * 0.5 + 0.1;
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          alpha,
          fillColor: `hsla(210, 100%, 70%, ${alpha})`,
        });
      }
    };

    const connectionDist = 100;
    const connectionDistSq = connectionDist * connectionDist;

    const connectionSteps = 20;
    const connectionColors: string[] = [];
    for (let s = 0; s <= connectionSteps; s++) {
      const t = s / connectionSteps;
      connectionColors.push(`hsla(210, 100%, 70%, ${(0.06 * (1 - t)).toFixed(4)})`);
    }

    const draw = () => {
      frameCount++;
      // Draw every 2nd frame (30fps is visually identical for slow-moving particles)
      if (!isVisible || frameCount % 2 !== 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.fillColor;
        ctx.fill();
      }

      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x;
          if (dx > connectionDist || dx < -connectionDist) continue;
          const dy = pi.y - pj.y;
          if (dy > connectionDist || dy < -connectionDist) continue;
          const distSq = dx * dx + dy * dy;
          if (distSq < connectionDistSq) {
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            // Use squared ratio to avoid sqrt entirely
            const ratioSq = distSq / connectionDistSq;
            const idx = (ratioSq * connectionSteps) | 0;
            ctx.strokeStyle = connectionColors[idx];
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    // IntersectionObserver to pause when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    init();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0.6 }}
    />
  );
};

export default ParticleField;
