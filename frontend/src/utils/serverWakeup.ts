/**
 * serverWakeup.ts - Backend Server Wake-up Utility
 * 
 * Handles Render free tier cold starts by pinging the server
 * and showing appropriate loading states to users.
 */

import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://ishu-site.onrender.com';
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
const CHECK_INTERVAL = 60000; // Check every minute

/**
 * Ping the server to wake it up if it's sleeping (Render free tier)
 * Returns immediately if server is already awake
 */
export async function wakeupServer(): Promise<ServerStatus> {
  // Return cached promise if wake-up is in progress
  if (wakeupPromise) {
    return wakeupPromise;
  }

  // Skip if we checked recently and server was awake
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
        const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch(WAKE_ENDPOINT, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        clearTimeout(timeout);

        if (response.ok) {
          const responseTime = Date.now() - startTime;
          lastCheckTime = Date.now();
          wakeupPromise = null;

          console.log(`[Server Wake-up] ✅ Server awake (${responseTime}ms)`);

          return {
            isAwake: true,
            isWaking: false,
            responseTime,
            error: null,
          };
        }
      } catch (error) {
        attempts++;
        console.log(`[Server Wake-up] Attempt ${attempts}/${maxAttempts} failed`);

        if (attempts < maxAttempts) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
        }
      }
    }

    // All attempts failed
    wakeupPromise = null;
    return {
      isAwake: false,
      isWaking: false,
      responseTime: null,
      error: 'Server is not responding. Please try again in a moment.',
    };
  })();

  return wakeupPromise;
}

/**
 * Check server status without waking it up
 */
export async function checkServerStatus(): Promise<ServerStatus> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const startTime = Date.now();
    const response = await fetch(STATUS_ENDPOINT, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeout);

    if (response.ok) {
      const responseTime = Date.now() - startTime;
      return {
        isAwake: true,
        isWaking: false,
        responseTime,
        error: null,
      };
    }

    return {
      isAwake: false,
      isWaking: false,
      responseTime: null,
      error: 'Server check failed',
    };
  } catch (error) {
    return {
      isAwake: false,
      isWaking: false,
      responseTime: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Hook for React components to use server wake-up
 */
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
      if (mounted) {
        setStatus(result);
      }
    }

    wake();

    return () => {
      mounted = false;
    };
  }, []);

  return status;
}

// Auto-wake on module load (non-blocking)
if (typeof window !== 'undefined') {
  wakeupServer().catch(console.error);
}
