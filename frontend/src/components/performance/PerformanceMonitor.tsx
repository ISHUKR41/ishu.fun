/**
 * PerformanceMonitor.tsx — Real-time Performance Monitoring
 *
 * Monitors:
 * - Scroll FPS
 * - Frame drops
 * - Memory usage
 * - Long tasks
 * - Layout shifts
 *
 * Shows performance warnings in development mode
 */

import { useEffect, useState, useRef } from "react";
import { getScrollFPS } from "@/components/layout/EnhancedSmoothScroll";

interface PerformanceMetrics {
  scrollFPS: number;
  avgFPS: number;
  frameDrops: number;
  memoryUsage: number;
  longTasks: number;
  layoutShifts: number;
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    scrollFPS: 60,
    avgFPS: 60,
    frameDrops: 0,
    memoryUsage: 0,
    longTasks: 0,
    layoutShifts: 0,
  });

  const [showMonitor, setShowMonitor] = useState(false);
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(performance.now());
  const longTasksRef = useRef(0);
  const layoutShiftsRef = useRef(0);

  useEffect(() => {
    // Only show in development mode
    if (import.meta.env.PROD) return;

    // FPS monitoring
    let rafId: number;
    const measureFPS = () => {
      const now = performance.now();
      const delta = now - lastFrameTimeRef.current;
      const fps = 1000 / delta;

      frameTimesRef.current.push(fps);
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }

      lastFrameTimeRef.current = now;
      rafId = requestAnimationFrame(measureFPS);
    };
    rafId = requestAnimationFrame(measureFPS);

    // Long task observer
    if ("PerformanceObserver" in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              longTasksRef.current++;
              console.warn(`⚠️ Long task detected: ${entry.duration.toFixed(2)}ms`);
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ["longtask"] });

        // Layout shift observer
        const layoutShiftObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).hadRecentInput) continue;
            const value = (entry as any).value;
            if (value > 0.1) {
              layoutShiftsRef.current++;
              console.warn(`⚠️ Layout shift detected: ${value.toFixed(4)}`);
            }
          }
        });
        layoutShiftObserver.observe({ entryTypes: ["layout-shift"] });

        return () => {
          cancelAnimationFrame(rafId);
          longTaskObserver.disconnect();
          layoutShiftObserver.disconnect();
        };
      } catch (e) {
        console.warn("PerformanceObserver not supported");
      }
    }

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Update metrics every 2 seconds
  useEffect(() => {
    if (import.meta.env.PROD) return;

    const interval = setInterval(() => {
      const avgFPS =
        frameTimesRef.current.length > 0
          ? frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length
          : 60;

      const frameDrops = frameTimesRef.current.filter((fps) => fps < 30).length;

      // Memory usage (if available)
      let memoryUsage = 0;
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      }

      setMetrics({
        scrollFPS: getScrollFPS(),
        avgFPS: Math.round(avgFPS),
        frameDrops,
        memoryUsage: Math.round(memoryUsage),
        longTasks: longTasksRef.current,
        layoutShifts: layoutShiftsRef.current,
      });

      // Warn if performance is degraded
      if (avgFPS < 30) {
        console.warn(`⚠️ Low FPS detected: ${Math.round(avgFPS)}fps`);
      }
      if (memoryUsage > 80) {
        console.warn(`⚠️ High memory usage: ${Math.round(memoryUsage)}%`);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Toggle monitor with Ctrl+Shift+P
  useEffect(() => {
    if (import.meta.env.PROD) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        setShowMonitor((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  if (import.meta.env.PROD || !showMonitor) return null;

  const getPerformanceColor = (fps: number) => {
    if (fps >= 50) return "#22c55e"; // green
    if (fps >= 30) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "20px",
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        padding: "12px 16px",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "11px",
        lineHeight: "1.6",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        minWidth: "200px",
      }}
    >
      <div style={{ marginBottom: "8px", fontWeight: "bold", fontSize: "12px", color: "#3b82f6" }}>
        Performance Monitor
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span>Scroll FPS:</span>
        <span style={{ color: getPerformanceColor(metrics.scrollFPS), fontWeight: "bold" }}>
          {metrics.scrollFPS}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span>Avg FPS:</span>
        <span style={{ color: getPerformanceColor(metrics.avgFPS), fontWeight: "bold" }}>
          {metrics.avgFPS}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span>Frame Drops:</span>
        <span style={{ color: metrics.frameDrops > 10 ? "#ef4444" : "#22c55e" }}>
          {metrics.frameDrops}
        </span>
      </div>

      {metrics.memoryUsage > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
          <span>Memory:</span>
          <span style={{ color: metrics.memoryUsage > 80 ? "#ef4444" : "#22c55e" }}>
            {metrics.memoryUsage}%
          </span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span>Long Tasks:</span>
        <span style={{ color: metrics.longTasks > 5 ? "#ef4444" : "#22c55e" }}>
          {metrics.longTasks}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Layout Shifts:</span>
        <span style={{ color: metrics.layoutShifts > 5 ? "#ef4444" : "#22c55e" }}>
          {metrics.layoutShifts}
        </span>
      </div>

      <div
        style={{
          marginTop: "8px",
          paddingTop: "8px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          fontSize: "10px",
          color: "#9ca3af",
        }}
      >
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
};

export default PerformanceMonitor;
