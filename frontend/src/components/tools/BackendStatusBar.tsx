/**
 * BackendStatusBar.tsx — Backend Wake-up Status Indicator
 *
 * Pings the backend on mount, shows status, auto-retries until connected.
 * Fixes the "Could not connect to server" issue caused by Render free tier sleeping.
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, WifiOff, RefreshCw, Zap } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface BackendStatusBarProps {
  onReady?: () => void;
  compact?: boolean;
}

type Status = "checking" | "waking" | "ready" | "failed";

const BackendStatusBar = ({ onReady, compact = false }: BackendStatusBarProps) => {
  const [status, setStatus] = useState<Status>("checking");
  const [attempt, setAttempt] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const maxAttempts = 8;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const ping = async (attemptNum: number) => {
    if (!mountedRef.current) return;
    
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(`${API_URL}/api/wake`, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok && mountedRef.current) {
        setResponseTime(Date.now() - start);
        setStatus("ready");
        onReady?.();
        return;
      }
    } catch {
      // Failed - will retry
    }

    if (!mountedRef.current) return;

    if (attemptNum >= maxAttempts) {
      setStatus("failed");
      return;
    }

    setStatus("waking");
    setAttempt(attemptNum + 1);
    timerRef.current = setTimeout(() => ping(attemptNum + 1), 4000);
  };

  useEffect(() => {
    mountedRef.current = true;
    ping(0);
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleRetry = () => {
    setStatus("checking");
    setAttempt(0);
    ping(0);
  };

  if (status === "ready" && compact) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl border p-3 px-4 mb-4 flex items-center gap-3 text-sm ${
          status === "ready"
            ? "border-green-500/20 bg-green-500/5"
            : status === "failed"
            ? "border-red-500/20 bg-red-500/5"
            : "border-yellow-500/20 bg-yellow-500/5"
        }`}
      >
        {status === "checking" && (
          <>
            <Loader2 size={16} className="animate-spin text-yellow-400 shrink-0" />
            <span className="text-yellow-300 font-medium">Connecting to server...</span>
          </>
        )}

        {status === "waking" && (
          <>
            <Loader2 size={16} className="animate-spin text-yellow-400 shrink-0" />
            <div className="flex-1">
              <span className="text-yellow-300 font-medium">
                Server is waking up... 
              </span>
              <span className="text-yellow-300/60 text-xs ml-2">
                (attempt {attempt}/{maxAttempts} — free tier takes ~30s)
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: maxAttempts }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-3 rounded-full transition-all ${
                    i < attempt ? "bg-yellow-400" : "bg-yellow-400/20"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {status === "ready" && (
          <>
            <CheckCircle size={16} className="text-green-400 shrink-0" />
            <span className="text-green-300 font-medium">Server connected!</span>
            {responseTime > 0 && (
              <span className="text-green-300/50 text-xs flex items-center gap-1">
                <Zap size={10} /> {responseTime}ms
              </span>
            )}
          </>
        )}

        {status === "failed" && (
          <>
            <WifiOff size={16} className="text-red-400 shrink-0" />
            <span className="text-red-300 font-medium flex-1">
              Server unavailable. It may be deploying — try again in a minute.
            </span>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/30 transition-colors shrink-0"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BackendStatusBar;
