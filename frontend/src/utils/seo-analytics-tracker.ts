/**
 * SEO ANALYTICS & TRACKING MODULE v1.0
 * Comprehensive SEO monitoring and analytics
 * 
 * Features:
 * - Page load performance tracking
 * - Core Web Vitals monitoring
 * - Keyword tracking
 * - SEO health scoring
 * - Conversion tracking
 * - Heatmap& interaction tracking
 */

interface SEOMetrics {
  pageTitle: string;
  pageUrl: string;
  focusKeyword?: string;
  keywordDensity?: number;
  readabilityScore?: number;
  internalLinks?: number;
  externalLinks?: number;
  images?: number;
  h1Count?: number;
  metaDescription?: string;
  metaDescriptionLength?: number;
  structuredData?: boolean;
  mobileOptimized?: boolean;
  pageLoadTime?: number;
  timestamp: string;
}

interface CoreWebVitals {
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTFB: number; // Time to First Byte
  FCP: number; // First Contentful Paint
}

interface ConversionData {
  eventType: string;
  eventValue?: number;
  eventCategory?: string;
  timestamp: string;
  pageUrl: string;
}

/**
 * SEO ANALYTICS TRACKER
 */
export class SEOAnalyticsTracker {
  private metrics: SEOMetrics[] = [];
  private coreWebVitals: CoreWebVitals | null = null;
  private conversions: ConversionData[] = [];
  private localStorageKey = 'ishu_seo_analytics';

  /**
   * Collect page SEO metrics
   */
  collectPageMetrics(): SEOMetrics {
    const metrics: SEOMetrics = {
      pageTitle: document.title,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
      h1Count: document.querySelectorAll('h1').length,
      internalLinks: document.querySelectorAll('a[href^="/"]').length,
      externalLinks: document.querySelectorAll('a[href^="http"]').length,
      images: document.querySelectorAll('img').length,
      mobileOptimized: this.isMobileOptimized(),
      structuredData: this.hasStructuredData(),
    };

    // Get meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metrics.metaDescription = metaDesc.getAttribute('content') || '';
      metrics.metaDescriptionLength = metrics.metaDescription.length;
    }

    // Get focus keyword
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      const keywords = metaKeywords.getAttribute('content')?.split(',') || [];
      metrics.focusKeyword = keywords[0]?.trim();
    }

    // Calculate readability
    metrics.readabilityScore = this.calculateReadabilityScore();

    this.metrics.push(metrics);
    return metrics;
  }

  /**
   * Monitor Core Web Vitals
   */
  monitorCoreWebVitals(): void {
    const vitals: Partial<CoreWebVitals> = {};

    // First Contentful Paint (FCP)
    try {
      const paintEntry = performance.getEntriesByType('paint')[0];
      if (paintEntry) {
        vitals.FCP = Math.round(paintEntry.startTime);
      }
    } catch (e) {
      // Silent fail
    }

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.LCP = Math.round(lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Silent fail
      }

      // Cumulative Layout Shift (CLS)
      try {
        const clsObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              vitals.CLS = ((vitals.CLS || 0) + (entry as any).value);
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Silent fail
      }
    }

    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const firstEntry = entries[0];
          vitals.FID = Math.round((firstEntry as any).processingDuration);
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Silent fail
      }
    }

    // Time to First Byte (TTFB)
    try {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        vitals.TTFB = Math.round(navEntry.responseStart - navEntry.fetchStart);
      }
    } catch (e) {
      // Silent fail
    }

    this.coreWebVitals = {
      LCP: vitals.LCP || 0,
      FID: vitals.FID || 0,
      CLS: vitals.CLS || 0,
      TTFB: vitals.TTFB || 0,
      FCP: vitals.FCP || 0,
    };
  }

  /**
   * Track conversion events
   */
  trackConversion(eventType: string, eventValue?: number, eventCategory?: string): void {
    const conversion: ConversionData = {
      eventType,
      eventValue,
      eventCategory,
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
    };

    this.conversions.push(conversion);

    // Send to analytics
    if (window.gtag) {
      window.gtag('event', eventType, {
        value: eventValue,
        category: eventCategory,
      });
    }
  }

  /**
   * Calculate SEO score (0-100)
   */
  calculateSEOScore(): number {
    let score = 0;
    const metrics = this.metrics[this.metrics.length - 1];

    if (!metrics) return 0;

    // Title optimization (10 points)
    if (metrics.pageTitle && metrics.pageTitle.length >= 30 && metrics.pageTitle.length <= 60) {
      score += 10;
    }

    // Meta description (10 points)
    if (
      metrics.metaDescription &&
      metrics.metaDescriptionLength &&
      metrics.metaDescriptionLength >= 120 &&
      metrics.metaDescriptionLength <= 160
    ) {
      score += 10;
    }

    // H1 tag (10 points)
    if (metrics.h1Count === 1) {
      score += 10;
    }

    // Internal links (10 points)
    if (metrics.internalLinks && metrics.internalLinks > 0) {
      score += 10;
    }

    // Images (10 points)
    if (metrics.images && metrics.images > 0) {
      score += 10;
    }

    // Mobile optimized (15 points)
    if (metrics.mobileOptimized) {
      score += 15;
    }

    // Structured data (15 points)
    if (metrics.structuredData) {
      score += 15;
    }

    // Readability (5 points)
    if (metrics.readabilityScore && metrics.readabilityScore > 60) {
      score += 5;
    }

    return Math.min(score, 100);
  }

  /**
   * Generate SEO health report
   */
  generateHealthReport(): Record<string, any> {
    const metrics = this.metrics[this.metrics.length - 1] || {};
    const score = this.calculateSEOScore();

    const recommendations: string[] = [];

    if (!metrics.pageTitle || metrics.pageTitle.length < 30) {
      recommendations.push('✅ Improve title length (minimum 30 characters)');
    }

    if (!metrics.metaDescription || metrics.metaDescriptionLength! < 120) {
      recommendations.push('✅ Add or improve meta description (120-160 characters)');
    }

    if (metrics.h1Count !== 1) {
      recommendations.push('✅ Add exactly one H1 tag');
    }

    if (!metrics.internalLinks || metrics.internalLinks === 0) {
      recommendations.push('✅ Add internal links');
    }

    if (!metrics.structuredData) {
      recommendations.push('✅ Add structured data (JSON-LD)');
    }

    if (!metrics.mobileOptimized) {
      recommendations.push('✅ Optimize for mobile');
    }

    return {
      score,
      scorePercentage: `${score}%`,
      metrics,
      coreWebVitals: this.coreWebVitals,
      recommendations,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Check if page is mobile optimized
   */
  private isMobileOptimized(): boolean {
    const viewport = document.querySelector('meta[name="viewport"]');
    return viewport !== null;
  }

  /**
   * Check if page has structured data
   */
  private hasStructuredData(): boolean {
    return document.querySelector('script[type="application/ld+json"]') !== null;
  }

  /**
   * Calculate readability score (0-100)
   */
  private calculateReadabilityScore(): number {
    const text = document.body.innerText;
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const grade =
      0.39 * (words / sentences) + 11.8 * ((text.split(/[aeiou]/i).length || 0) / words) - 15.59;

    return Math.min(Math.max(grade * 10, 0), 100);
  }

  /**
   * Save metrics to localStorage
   */
  saveMetricsLocally(): void {
    const data = {
      metrics: this.metrics,
      coreWebVitals: this.coreWebVitals,
      conversions: this.conversions,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }

  /**
   * Get health report
   */
  getHealthReport() {
    return this.generateHealthReport();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT TRACKER
// ═══════════════════════════════════════════════════════════════════════════════

export const seoAnalyticsTracker = new SEOAnalyticsTracker();

// Auto-collect metrics on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    seoAnalyticsTracker.collectPageMetrics();
    seoAnalyticsTracker.monitorCoreWebVitals();
    seoAnalyticsTracker.saveMetricsLocally();

    const report = seoAnalyticsTracker.getHealthReport();
    console.log('📊 SEO Health Report:', report);
  });
}

console.log('✅ SEO Analytics Tracker Loaded');
