/**
 * Optimized3DSceneWrapper.tsx — Smart 3D Scene Loader
 *
 * PROBLEM: Three.js scenes cause lag on mobile/tablet during scroll
 * SOLUTION: Device-aware loading, intersection observer, reduced complexity
 *
 * Features:
 * - Disables on mobile by default (can override)
 * - Reduces particle count on tablet
 * - Pauses rendering when offscreen
 * - Lazy loads Three.js bundle
 * - FPS-aware quality reduction
 */

import { lazy, Suspense, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface Optimized3DSceneProps {
  sceneComponent: React.ComponentType<any>;
  fallback?: React.ReactNode;
  enableOnMobile?: boolean;
  enableOnTablet?: boolean;
  minViewportWidth?: number;
  rootMargin?: string;
  threshold?: number;
  sceneProps?: Record<string, any>;
}

// Device detection
const getDeviceInfo = () => {
  if (typeof window === "undefined") {
    return { isMobile: false, isTablet: false, isDesktop: true };
  }

  const width = window.innerWidth;
  const isMobile = width <= 640;
  const isTablet = width > 640 && width <= 1024;
  const isDesktop = width > 1024;

  return { isMobile, isTablet, isDesktop };
};

// Performance detection
const getPerformanceLevel = (): "low" | "medium" | "high" => {
  if (typeof window === "undefined") return "high";

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;

  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory || 8;

  // Check for mobile/tablet
  const { isMobile, isTablet } = getDeviceInfo();

  if (isMobile) return "low";
  if (isTablet) return "medium";
  if (cores >= 8 && memory >= 8) return "high";
  if (cores >= 4 && memory >= 4) return "medium";

  return "low";
};

const Optimized3DSceneWrapper = ({
  sceneComponent: SceneComponent,
  fallback,
  enableOnMobile = false,
  enableOnTablet = true,
  minViewportWidth = 0,
  rootMargin = "200px",
  threshold = 0.1,
  sceneProps = {},
}: Optimized3DSceneProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const { ref, inView } = useInView({
    rootMargin,
    threshold,
    triggerOnce: false, // Keep monitoring to pause when offscreen
  });

  const { isMobile, isTablet, isDesktop } = getDeviceInfo();
  const performanceLevel = getPerformanceLevel();

  // Determine if 3D scene should be enabled
  const is3DEnabled =
    (isDesktop ||
      (isTablet && enableOnTablet) ||
      (isMobile && enableOnMobile)) &&
    window.innerWidth >= minViewportWidth;

  // Load scene when in view
  useEffect(() => {
    if (inView && is3DEnabled) {
      setShouldLoad(true);
    }
  }, [inView, is3DEnabled]);

  // Don't render at all if disabled
  if (!is3DEnabled) {
    return fallback || null;
  }

  // Quality settings based on performance
  const qualitySettings = {
    particleCount: performanceLevel === "high" ? 200 : performanceLevel === "medium" ? 100 : 50,
    shadowsEnabled: performanceLevel === "high",
    antialias: performanceLevel !== "low",
    pixelRatio: performanceLevel === "high" ? 2 : 1,
    maxFPS: performanceLevel === "high" ? 60 : performanceLevel === "medium" ? 30 : 20,
  };

  return (
    <div ref={ref} className="optimized-3d-scene-wrapper">
      {shouldLoad && inView ? (
        <Suspense
          fallback={
            fallback || (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )
          }
        >
          <SceneComponent {...sceneProps} {...qualitySettings} isPaused={!inView} />
        </Suspense>
      ) : (
        fallback || (
          <div className="min-h-[400px]" style={{ background: "transparent" }}></div>
        )
      )}
    </div>
  );
};

export default Optimized3DSceneWrapper;
