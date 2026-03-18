/**
 * ServerStatusBanner.tsx - Server Status Indicator
 * 
 * Shows a banner when the backend server is waking up from cold start
 * (Render free tier sleeps after 15 minutes of inactivity)
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';
import { serverHealthMonitor, type HealthStatus } from '@/utils/serverHealth';

export default function ServerStatusBanner() {
  const [status, setStatus] = useState<HealthStatus>(serverHealthMonitor.getStatus());
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Subscribe to health status changes
    const unsubscribe = serverHealthMonitor.subscribe((newStatus) => {
      setStatus(newStatus);
      // Show banner if server goes offline and not dismissed
      if (!newStatus.isOnline && !dismissed) {
        setShowBanner(true);
      } else if (newStatus.isOnline) {
        // Auto-hide banner 2 seconds after server comes online
        setTimeout(() => setShowBanner(false), 2000);
      }
    });

    return unsubscribe;
  }, [dismissed]);

  const handleRetry = async () => {
    await serverHealthMonitor.forceCheck();
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
  };

  // Don't show if server is online or user dismissed
  if (!showBanner || (status.isOnline && status.consecutiveFailures === 0)) {
    return null;
  }

  const isWaking = status.consecutiveFailures <= 2;
  const isCritical = status.consecutiveFailures > 3;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
      >
        <div className="container mx-auto px-4 pt-4">
          <div className="pointer-events-auto rounded-lg border shadow-lg backdrop-blur-sm overflow-hidden">
            {/* Waking up state */}
            {isWaking && !isCritical && (
              <div className="bg-blue-500/10 border-blue-500/20 px-4 py-3">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Server is waking up...
                    </p>
                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-0.5">
                      This may take 10-30 seconds (Render cold start)
                    </p>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="text-blue-600/50 hover:text-blue-600 dark:text-blue-400/50 dark:hover:text-blue-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Success state */}
            {status.isOnline && (
              <div className="bg-green-500/10 border-green-500/20 px-4 py-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Server is ready!
                    </p>
                    {status.responseTime > 0 && (
                      <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-0.5">
                        Response time: {status.responseTime}ms
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Critical error state */}
            {isCritical && (
              <div className="bg-red-500/10 border-red-500/20 px-4 py-3">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      Server connection failed
                    </p>
                    <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">
                      Unable to reach backend server. Please check your connection.
                    </p>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="text-red-600/50 hover:text-red-600 dark:text-red-400/50 dark:hover:text-red-400 transition-colors ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
