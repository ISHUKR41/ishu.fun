/**
 * BackendStatusBar.tsx — Backend Wake-up Status Indicator
 *
 * Pings the backend on mount, shows status, auto-retries until connected.
 * Fixes the "Could not connect to server" issue caused by Render free tier sleeping.
 * 
 * - 15 retries max (enough for Render cold start ~60s)
 * - Shows estimated wait time
 * - Exports wakeBackend() for other components to use
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, WifiOff, RefreshCw, Zap, Clock } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "https://ishu-site.onrender.com";

// Shared wake state — so multiple components can await the same wake
let _wakePromise: Promise<boolean> | null = null;
let _isBackendReady = false;

export async function wakeBackend(): Promise<boolean> {
  if (_isBackendReady) return true;
  if (_wakePromise) return _wakePromise;
  
  _wakePromise = (async () => {
    for (let i = 0; i < 20; i++) {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(`${API_URL}/api/wake`, { signal: controller.signal });
        clearTimeout(tid);
        if (res.ok) { _isBackendReady = true; return true; }
      } catch { /* retry */ }
      await new Promise(r => setTimeout(r, 3000));
    }
    _wakePromise = null;
    return false;
  })();
  return _wakePromise;
}

interface BackendStatusBarProps {
  onReady?: () => void;
  compact?: boolean;
}

type Status = "checking" | "waking" | "ready" | "failed";

const BackendStatusBar = ({ onReady, compact = false }: BackendStatusBarProps) => {
  const [status, setStatus] = useState<Status>("checking");
  const [attempt, setAttempt] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const maxAttempts = 15;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);
  const startTimeRef = useRef(Date.now());

  const ping = async (attemptNum: number) => {
    if (!mountedRef.current) return;
    
    const start = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`${API_URL}/api/wake`, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok && mountedRef.current) {
        _isBackendReady = true;
        setResponseTime(Date.now() - start);
        setStatus("ready");
        if (elapsedRef.current) { clearInterval(elapsedRef.current); elapsedRef.current = null; }
        onReady?.();
        return;
      }
    } catch {
      // Failed - will retry
    }

    if (!mountedRef.current) return;

    if (attemptNum >= maxAttempts) {
      setStatus("failed");
      if (elapsedRef.current) { clearInterval(elapsedRef.current); elapsedRef.current = null; }
      return;
    }

    setStatus("waking");
    setAttempt(attemptNum + 1);
    timerRef.current = setTimeout(() => ping(attemptNum + 1), 4000);
  };

  useEffect(() => {
    mountedRef.current = true;
    startTimeRef.current = Date.now();
    
    // If already ready from a previous component, skip
    if (_isBackendReady) {
      setStatus("ready");
      onReady?.();
      return;
    }
    
    ping(0);
    elapsedRef.current = setInterval(() => {
      if (mountedRef.current) setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, []);

  const handleRetry = () => {
    _isBackendReady = false;
    _wakePromise = null;
    setStatus("checking");
    setAttempt(0);
    setElapsed(0);
    startTimeRef.current = Date.now();
    elapsedRef.current = setInterval(() => {
      if (mountedRef.current) setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    ping(0);
  };

  if (status === "ready" && compact) return null;

  const progressPct = Math.min((attempt / maxAttempts) * 100, 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`rounded-xl border p-3 px-4 mb-4 text-sm ${
          status === "ready"
            ? "border-green-500/20 bg-green-500/5"
            : status === "failed"
            ? "border-red-500/20 bg-red-500/5"
            : "border-yellow-500/20 bg-yellow-500/5"
        }`}
      >
        <div className="flex items-center gap-3">
          {status === "checking" && (
            <>
              <Loader2 size={16} className="animate-spin text-yellow-400 shrink-0" />
              <span className="text-yellow-300 font-medium">Connecting to server...</span>
            </>
          )}

          {status === "waking" && (
            <>
              <Loader2 size={16} className="animate-spin text-yellow-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-yellow-300 font-medium">
                  Server is waking up...
                </span>
                <span className="text-yellow-300/60 text-xs ml-2">
                  ({elapsed}s elapsed — usually takes 30-60s)
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Clock size={12} className="text-yellow-400/60" />
                <span className="text-yellow-300/50 text-[10px] font-mono">{attempt}/{maxAttempts}</span>
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
                Could not connect to server. It may be deploying or temporarily down.
              </span>
              <button
                onClick={handleRetry}
                className="flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/30 transition-colors shrink-0"
              >
                <RefreshCw size={12} /> Retry
              </button>
            </>
          )}
        </div>

        {/* Progress bar for waking state */}
        {status === "waking" && (
          <div className="mt-2 h-1 rounded-full bg-yellow-400/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BackendStatusBar;
