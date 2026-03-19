/**
 * Server Health Monitoring System
 * 
 * Proactively wakes up the backend server and monitors its health.
 * Prevents Render cold starts by keeping the server warm with pings every 2 minutes.
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
    this.wakeServer();
    this.checkInterval = setInterval(() => this.checkHealth(), 30000);
    // Ping every 2 minutes to prevent Render free-tier sleep (sleeps after 15 min)
    this.wakeInterval = setInterval(() => this.wakeServer(), 2 * 60 * 1000);
  }

  async wakeServer(): Promise<boolean> {
    try {
      const start = Date.now();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      // NOTE: Do NOT send custom headers like Cache-Control — causes CORS preflight failure
      const response = await fetch(`${API_URL}/api/wake`, {
        signal: controller.signal,
        mode: 'cors',
      });

      clearTimeout(timeout);
      const responseTime = Date.now() - start;

      if (response.ok) {
        this.updateStatus(true, responseTime);
        return true;
      } else {
        this.updateStatus(false, responseTime);
        return false;
      }
    } catch (error) {
      this.updateStatus(false, 0);

      // Also try /api/health as fallback
      try {
        const r = await fetch(`${API_URL}/api/health`, { mode: 'cors' });
        if (r.ok) {
          this.updateStatus(true, 0);
          return true;
        }
      } catch { /* ignore */ }

      // Retry after 3s on first failure
      if (this.status.consecutiveFailures === 1) {
        setTimeout(() => this.wakeServer(), 3000);
      }
      return false;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const start = Date.now();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_URL}/api/status`, {
        signal: controller.signal,
        mode: 'cors',
      });

      clearTimeout(timeout);
      const responseTime = Date.now() - start;

      if (response.ok) {
        this.updateStatus(true, responseTime);
        return true;
      } else {
        this.updateStatus(false, responseTime);
        return false;
      }
    } catch (error) {
      this.updateStatus(false, 0);
      if (this.status.consecutiveFailures >= 2) {
        this.wakeServer();
      }
      return false;
    }
  }

  private updateStatus(isOnline: boolean, responseTime: number) {
    const wasOnline = this.status.isOnline;
    this.status = {
      isOnline,
      lastCheck: Date.now(),
      responseTime,
      consecutiveFailures: isOnline ? 0 : this.status.consecutiveFailures + 1,
    };
    if (wasOnline !== isOnline) {
      this.notifyListeners();
    }
  }

  subscribe(callback: (status: HealthStatus) => void): () => void {
    this.listeners.add(callback);
    callback(this.status);
    return () => { this.listeners.delete(callback); };
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.status));
  }

  getStatus(): HealthStatus {
    return { ...this.status };
  }

  async forceCheck(): Promise<boolean> {
    return this.checkHealth();
  }

  destroy() {
    if (this.checkInterval) clearInterval(this.checkInterval);
    if (this.wakeInterval) clearInterval(this.wakeInterval);
    this.listeners.clear();
  }
}

export const serverHealthMonitor = new ServerHealthMonitor();
export type { HealthStatus };
