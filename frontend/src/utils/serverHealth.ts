/**
 * Server Health Monitoring System
 * 
 * Proactively wakes up the backend server and monitors its health
 * Prevents Render cold starts by keeping the server warm
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://ishu-site.onrender.com';

interface HealthStatus {
  isOnline: boolean;
  lastCheck: number;
  responseTime: number;
  consecutiveFailures: number;
}

class ServerHealthMonitor {
  private status: HealthStatus = {
    isOnline: false,
    lastCheck: 0,
    responseTime: 0,
    consecutiveFailures: 0,
  };

  private checkInterval: ReturnType<typeof setInterval> | null = null;
  private wakeInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<(status: HealthStatus) => void> = new Set();

  constructor() {
    // Initial wake-up call
    this.wakeServer();
    
    // Check health every 30 seconds
    this.checkInterval = setInterval(() => this.checkHealth(), 30000);
    
    // Wake server every 3 minutes (Render sleeps after 15 min of inactivity)
    this.wakeInterval = setInterval(() => this.wakeServer(), 3 * 60 * 1000);
  }

  /**
   * Wake up the server (lightweight ping)
   */
  async wakeServer(): Promise<boolean> {
    try {
      const start = Date.now();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_URL}/api/wake`, {
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' },
      });

      clearTimeout(timeout);
      const responseTime = Date.now() - start;

      if (response.ok) {
        this.updateStatus(true, responseTime);
        console.log(`[Server Health] ✅ Server awake (${responseTime}ms)`);
        return true;
      } else {
        this.updateStatus(false, responseTime);
        console.warn(`[Server Health] ⚠️ Server returned ${response.status}`);
        return false;
      }
    } catch (error) {
      this.updateStatus(false, 0);
      console.error('[Server Health] ❌ Wake failed:', error);
      
      // Retry immediately on first failure
      if (this.status.consecutiveFailures === 1) {
        console.log('[Server Health] 🔄 Retrying wake...');
        setTimeout(() => this.wakeServer(), 2000);
      }
      
      return false;
    }
  }

  /**
   * Check server health (detailed status)
   */
  async checkHealth(): Promise<boolean> {
    try {
      const start = Date.now();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_URL}/api/status`, {
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' },
      });

      clearTimeout(timeout);
      const responseTime = Date.now() - start;

      if (response.ok) {
        const data = await response.json();
        this.updateStatus(true, responseTime);
        console.log(`[Server Health] ✅ Healthy (${responseTime}ms, uptime: ${data.uptime}s)`);
        return true;
      } else {
        this.updateStatus(false, responseTime);
        console.warn(`[Server Health] ⚠️ Unhealthy: ${response.status}`);
        return false;
      }
    } catch (error) {
      this.updateStatus(false, 0);
      console.error('[Server Health] ❌ Health check failed:', error);
      
      // Try to wake server if health check fails
      if (this.status.consecutiveFailures >= 2) {
        console.log('[Server Health] 🔄 Attempting to wake server...');
        this.wakeServer();
      }
      
      return false;
    }
  }

  /**
   * Update status and notify listeners
   */
  private updateStatus(isOnline: boolean, responseTime: number) {
    const wasOnline = this.status.isOnline;
    
    this.status = {
      isOnline,
      lastCheck: Date.now(),
      responseTime,
      consecutiveFailures: isOnline ? 0 : this.status.consecutiveFailures + 1,
    };

    // Notify listeners if status changed
    if (wasOnline !== isOnline) {
      this.notifyListeners();
    }
  }

  /**
   * Subscribe to status changes
   */
  subscribe(callback: (status: HealthStatus) => void): () => void {
    this.listeners.add(callback);
    // Immediately call with current status
    callback(this.status);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.status));
  }

  /**
   * Get current status
   */
  getStatus(): HealthStatus {
    return { ...this.status };
  }

  /**
   * Force immediate health check
   */
  async forceCheck(): Promise<boolean> {
    return this.checkHealth();
  }

  /**
   * Cleanup intervals
   */
  destroy() {
    if (this.checkInterval) clearInterval(this.checkInterval);
    if (this.wakeInterval) clearInterval(this.wakeInterval);
    this.listeners.clear();
  }
}

// Singleton instance
export const serverHealthMonitor = new ServerHealthMonitor();

// Export for use in components
export type { HealthStatus };
