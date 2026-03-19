/**
 * serverWakeup.ts - Backend Server Wake-up Utility
 * 
 * Handles Render free tier cold starts by pinging the server
 * and showing appropriate loading states to users.
 */

import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://ishu-site.onrender.com');
const WAKE_ENDPOINT = `${API_URL}/api/wake`;
const STATUS_ENDPOINT = `${API_URL}/api/status`;

export interface ServerStatus {
  isAwake: boolean;
  isWaking: boolean;
  responseTime: number | null;
  error: string | null;
}

let wakeupPromise: Promise<ServerStatus> | null = null;
let lastCheckTime = 0;
const CHECK_INTERVAL = 60000;

/**
 * Ping the server to wake it up if sleeping (Render free tier)
 * IMPORTANT: No custom headers — they cause CORS preflight failures
 */
export async function wakeupServer(): Promise<ServerStatus> {
  if (wakeupPromise) return wakeupPromise;

  const now = Date.now();
  if (now - lastCheckTime < CHECK_INTERVAL) {
    return { isAwake: true, isWaking: false, responseTime: null, error: null };
  }

  wakeupPromise = (async () => {
    const startTime = Date.now();
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        // No custom headers - avoid CORS preflight issues
        const response = await fetch(WAKE_ENDPOINT, {
          method: 'GET',
          signal: controller.signal,
          mode: 'cors',
        });

        clearTimeout(timeout);

        if (response.ok) {
          const responseTime = Date.now() - startTime;
          lastCheckTime = Date.now();
          wakeupPromise = null;
          return { isAwake: true, isWaking: false, responseTime, error: null };
        }
      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
        }
      }
    }

    wakeupPromise = null;
    return {
      isAwake: false,
      isWaking: false,
      responseTime: null,
      error: 'Server is starting up. Please try again in a moment.',
    };
  })();

  return wakeupPromise;
}

export async function checkServerStatus(): Promise<ServerStatus> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const startTime = Date.now();

    // No custom headers to avoid CORS preflight
    const response = await fetch(STATUS_ENDPOINT, {
      method: 'GET',
      signal: controller.signal,
      mode: 'cors',
    });

    clearTimeout(timeout);

    if (response.ok) {
      return { isAwake: true, isWaking: false, responseTime: Date.now() - startTime, error: null };
    }

    return { isAwake: false, isWaking: false, responseTime: null, error: 'Server check failed' };
  } catch (error) {
    return {
      isAwake: false,
      isWaking: false,
      responseTime: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function useServerWakeup() {
  const [status, setStatus] = useState<ServerStatus>({
    isAwake: false,
    isWaking: true,
    responseTime: null,
    error: null,
  });

  useEffect(() => {
    let mounted = true;
    async function wake() {
      const result = await wakeupServer();
      if (mounted) setStatus(result);
    }
    wake();
    return () => { mounted = false; };
  }, []);

  return status;
}

if (typeof window !== 'undefined') {
  wakeupServer().catch(() => {});
}
