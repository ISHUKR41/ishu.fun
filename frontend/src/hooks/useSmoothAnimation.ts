/**
 * useSmoothAnimation.ts — Reusable hook for buttery-smooth animations
 * 
 * Provides optimized animation utilities that work across all pages:
 * - Intersection Observer based reveal animations
 * - Smooth parallax scrolling
 * - Staggered entrance animations
 * - GPU-accelerated transforms
 * 
 * Uses requestAnimationFrame for 120fps+ performance and
 * passive event listeners to never block the main thread.
 */

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

// ─── Intersection Observer for smooth reveal ─────────────────────────────────
export function useSmoothReveal(options?: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", once = true } = options || {};

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

// ─── Smooth parallax scroll effect ──────────────────────────────────────────
export function useSmoothParallax(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null);
  const translateY = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let isInView = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
      },
      { rootMargin: "100px" }
    );
    observer.observe(element);

    const onScroll = () => {
      if (!isInView) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distance = elementCenter - viewportCenter;
      
      translateY.current = distance * speed * -0.1;
      element.style.transform = `translate3d(0, ${translateY.current}px, 0)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      cancelAnimationFrame(rafId.current);
    };
  }, [speed]);

  return ref;
}

// ─── Staggered entrance animation controller ─────────────────────────────────
export function useStaggeredEntrance(itemCount: number, baseDelay: number = 60) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger reveal each item
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => new Set(prev).add(i));
            }, i * baseDelay);
          }
          observer.unobserve(container);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [itemCount, baseDelay]);

  const getItemStyle = useCallback((index: number) => ({
    opacity: visibleItems.has(index) ? 1 : 0,
    transform: visibleItems.has(index)
      ? "translate3d(0, 0, 0)"
      : "translate3d(0, 20px, 0)",
    transition: `opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    willChange: visibleItems.has(index) ? "auto" : "transform, opacity",
  }), [visibleItems]);

  return { containerRef, getItemStyle, visibleItems };
}

// ─── Smooth number counter ───────────────────────────────────────────────────
export function useSmoothCounter(target: number, duration: number = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.unobserve(element);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, value };
}

// ─── Smooth hover tilt effect ────────────────────────────────────────────────
export function useSmoothTilt(intensity: number = 10) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        element.style.transform = `perspective(1000px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale3d(1.02, 1.02, 1)`;
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(rafId);
      element.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    };

    element.style.transition = "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    element.addEventListener("mousemove", handleMouseMove, { passive: true });
    element.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [intensity]);

  return ref;
}

// ─── Debounced scroll position ───────────────────────────────────────────────
export function useSmoothScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        setScrollY(y);
        setScrollProgress(maxScroll > 0 ? y / maxScroll : 0);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return { scrollY, scrollProgress };
}
