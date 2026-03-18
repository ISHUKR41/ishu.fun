/**
 * useBackendHealth.ts — Backend Health Monitor with Auto-Retry
 *
 * Pings the backend on mount and auto-retries with exponential backoff
 * if the server is slow to wake up (common with Render free tier).
 *
 * Returns:
 * - isHealthy: boolean — true once backend responds
 * - isChecking: boolean — true while pinging
 * - retryCount: number — how many retries so far
 * - error: string | null — last error message
 * - retry: () => void — manual retry function
 */

import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "";
const WAKE_URL = `${API_BASE}/api/wake`;
const MAX_RETRIES = 6;
// Exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s
const getDelay = (attempt: number) => Math.min(1000 * Math.pow(2, attempt), 32000);

interface BackendHealth {
  isHealthy: boolean;
  isChecking: boolean;
  retryCount: number;
  error: string | null;
  retry: () => void;
}

export function useBackendHealth(): BackendHealth {
  const [isHealthy, setIsHealthy] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const ping = useCallback(async (attempt: number = 0) => {
    if (!mountedRef.current) return;
    setIsChecking(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(WAKE_URL, {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeout);

      if (res.ok) {
        if (mountedRef.current) {
          setIsHealthy(true);
          setIsChecking(false);
          setRetryCount(attempt);
        }
        return;
      }
      throw new Error(`Server returned ${res.status}`);
    } catch (err: any) {
      if (!mountedRef.current) return;

      const msg = err?.name === "AbortError" ? "Timeout" : err?.message || "Connection failed";
      setError(msg);
      setRetryCount(attempt);

      if (attempt < MAX_RETRIES) {
        const delay = getDelay(attempt);
        timerRef.current = setTimeout(() => {
          if (mountedRef.current) ping(attempt + 1);
        }, delay);
      } else {
        setIsChecking(false);
      }
    }
  }, []);

  const retry = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsHealthy(false);
    setRetryCount(0);
    setIsChecking(true);
    ping(0);
  }, [ping]);

  useEffect(() => {
    mountedRef.current = true;
    ping(0);

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [ping]);

  return { isHealthy, isChecking, retryCount, error, retry };
}

export default useBackendHealth;
