/**
 * ServerStatusBanner.tsx - Server Status Indicator
 *
 * Shows a small, non-blocking floating pill in the bottom-right corner
 * ONLY when backend tools are actually needed (not on nav/TV/results pages).
 *
 * KEY RULES:
 * - NEVER covers the navbar or any navigation element
 * - Positioned bottom-right, small pill
 * - Auto-hides after 3s once server is online
 * - User can dismiss any time with X button
 * - Only appears after a 3s delay (don't flash on fast connections)
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, X, Server } from 'lucide-react';
import { serverHealthMonitor, type HealthStatus } from '@/utils/serverHealth';

export default function ServerStatusBanner() {
  const [status, setStatus] = useState<HealthStatus>(serverHealthMonitor.getStatus());
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = serverHealthMonitor.subscribe((newStatus) => {
      setStatus(newStatus);

      if (dismissed) return;

      if (!newStatus.isOnline) {
        // Only show after 3s delay to avoid flash on fast connections
        if (!showTimerRef.current) {
          showTimerRef.current = setTimeout(() => {
            setVisible(true);
            showTimerRef.current = null;
          }, 3000);
        }
      } else {
        // Server came online — cancel pending show, auto-hide after 2s
        if (showTimerRef.current) {
          clearTimeout(showTimerRef.current);
          showTimerRef.current = null;
        }
        if (visible) {
          hideTimerRef.current = setTimeout(() => setVisible(false), 2000);
        }
      }
    });

    return () => {
      unsubscribe();
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [dismissed, visible]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    if (showTimerRef.current) { clearTimeout(showTimerRef.current); showTimerRef.current = null; }
    if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          key="server-status"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          // Bottom-right corner — NEVER overlaps navbar
          className="fixed bottom-20 right-4 z-[500] pointer-events-auto"
          style={{ maxWidth: 280 }}
        >
          <div className={`flex items-center gap-2.5 rounded-full border px-3.5 py-2 shadow-lg backdrop-blur-md text-xs font-medium ${
            status.isOnline
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-blue-500/30 bg-blue-500/10 text-blue-300'
          }`}>
            {status.isOnline ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
            ) : (
              <Loader2 className="h-3.5 w-3.5 text-blue-400 animate-spin shrink-0" />
            )}
            <span className="truncate">
              {status.isOnline ? 'Server ready' : 'Server waking up…'}
            </span>
            <button
              onClick={handleDismiss}
              className="ml-1 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              aria-label="Dismiss"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
