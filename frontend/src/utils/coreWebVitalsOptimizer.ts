/**
 * CORE WEB VITALS OPTIMIZER v2.0
 * Optimize Largest Contentful Paint (LCP), First Input Delay (FID), Cumulative Layout Shift (CLS)
 * All search engines and browsers supported
 */

interface CoreWebVitalsMetrics {
  lcp: number; // Largest Contentful Paint (ms) - Target: < 2.5s
  fid: number; // First Input Delay (ms) - Target: < 100ms
  cls: number; // Cumulative Layout Shift - Target: < 0.1
  ttfb?: number; // Time to First Byte (ms)
  fcp?: number; // First Contentful Paint (ms)
  dcl?: number; // DOM Content Loaded (ms)
}

interface PerformanceRecommendation {
  metric: string;
  status: 'good' | 'warning' | 'poor';
  currentValue: number;
  targetValue: number;
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
}

export class CoreWebVitalsOptimizer {
  private metrics: CoreWebVitalsMetrics = {
    lcp: 2000,
    fid: 50,
    cls: 0.05,
  };

  /**
   * Optimize LCP (Largest Contentful Paint)
   */
  optimizeLCP(): PerformanceRecommendation {
    return {
      metric: 'LCP',
      status: this.metrics.lcp < 2500 ? 'good' : this.metrics.lcp < 4000 ? 'warning' : 'poor',
      currentValue: this.metrics.lcp,
      targetValue: 2500,
      recommendations: [
        'Implement image lazy loading for below-the-fold content',
        'Use modern image formats (WebP, AVIF)',
        'Optimize image sizes and use responsive images',
        'Reduce server response time (TTFB)',
        'Minimize CSS and JavaScript',
        'Remove unused CSS/JS',
        'Use a CDN to serve content',
        'Implement browser caching',
        'Use preload for critical resources',
        'Compress images without quality loss',
        'Remove unused fonts',
        'Minify CSS, JavaScript, and HTML',
        'Enable GZIP compression on server',
        'Use critical CSS inlining',
        'Defer non-critical JavaScript',
        'Remove render-blocking resources',
        'Preconnect to required origins',
      ],
      priority: 'high',
    };
  }

  /**
   * Optimize FID (First Input Delay)
   */
  optimizeFID(): PerformanceRecommendation {
    return {
      metric: 'FID',
      status: this.metrics.fid < 100 ? 'good' : this.metrics.fid < 300 ? 'warning' : 'poor',
      currentValue: this.metrics.fid,
      targetValue: 100,
      recommendations: [
        'Break up long JavaScript tasks (> 50ms)',
        'Use requestIdleCallback for non-critical work',
        'Implement web workers for heavy computation',
        'Schedule long tasks with setTimeout',
        'Use requestAnimationFrame for animations',
        'Reduce JavaScript bundle size',
        'Defer non-critical JavaScript',
        'Remove unused JavaScript',
        'Use code splitting',
        'Implement progressive loading',
        'Use native JavaScript instead of polyfills when possible',
        'Optimize Third-party scripts',
        'Enable compression (Brotli/GZIP)',
        'Use async/defer attributes on scripts',
        'Implement facade pattern for heavy libraries',
      ],
      priority: 'high',
    };
  }

  /**
   * Optimize CLS (Cumulative Layout Shift)
   */
  optimizeCLS(): PerformanceRecommendation {
    return {
      metric: 'CLS',
      status: this.metrics.cls < 0.1 ? 'good' : this.metrics.cls < 0.25 ? 'warning' : 'poor',
      currentValue: this.metrics.cls,
      targetValue: 0.1,
      recommendations: [
        'Reserve space for images using width/height attributes',
        'Add explicit size attributes to ads, embeds, iframes',
        'Use CSS transforms instead of properties that trigger layout',
        'Avoid large layout shifts from injected content',
        'Use font-display: swap for web fonts',
        'Avoid DOM manipulations that cause layout thrashing',
        'Use CSS Containment to prevent layout recalculation',
        'Stable layout by using flex/grid properly',
        'Preload fonts and images',
        'Use CSS Grid for stable layouts',
        'Avoid unexpected CSS changes',
        'Load Google Fonts with preconnect',
        'Use font-display: optional for non-critical fonts',
        'Debounce window resize listeners',
        'Avoid inserting content above existing content',
        'Use transform: translateZ(0) for GPU acceleration',
      ],
      priority: 'high',
    };
  }

  /**
   * Optimize TTFB (Time to First Byte)
   */
  optimizeTTFB(): PerformanceRecommendation {
    return {
      metric: 'TTFB',
      status: this.metrics.ttfb! < 600 ? 'good' : this.metrics.ttfb! < 1800 ? 'warning' : 'poor',
      currentValue: this.metrics.ttfb || 450,
      targetValue: 600,
      recommendations: [
        'Upgrade hosting/server infrastructure',
        'Use a CDN to serve content geographically closer',
        'Implement database query optimization',
        'Use caching strategies (Redis, Memcached)',
        'Enable HTTP/2 or HTTP/3',
        'Minimize server-side rendering time',
        'Use edge workers/serverless functions',
        'Implement connection keep-alive',
        'Use HTTP compression (Brotli)',
        'Optimize backend code',
        'Use DNS prefetching',
        'Implement preconnect to external resources',
        'Monitor and optimize database queries',
        'Use streaming HTML for faster start',
      ],
      priority: 'medium',
    };
  }

  /**
   * Optimization strategies for different content types
   */
  optimizeByContentType(contentType: 'images' | 'video' | 'interactive' | 'text' | 'heavy-js'): {
    type: string;
    recommendations: string[];
    tools: string[];
  } {
    const strategies: Record<string, { recommendations: string[]; tools: string[] }> = {
      images: {
        recommendations: [
          'Use modern formats: WebP, AVIF',
          'Implement responsive images with srcset',
          'Lazy load images below the fold',
          'Use image CDN like Cloudinary, ImageKit',
          'Compress images with TinyPNG, ImageOptim',
          'Generate multiple sizes/resolutions',
          'Use CSS Grid/Flexbox for image layouts',
          'Implement blur-up/skeleton loading',
        ],
        tools: ['ImageOptim', 'TinyPNG', 'Squoosh', 'Cloudinary', 'Imgix'],
      },
      video: {
        recommendations: [
          'Use HLS/DASH for adaptive bitrate streaming',
          'Pre-generate multiple quality versions',
          'Use video thumbnails for initial loading',
          'Lazy load video embeds',
          'Use poster attribute on video tags',
          'Preload only metadata, not full video',
          'Use muted autoplay for better performance',
          'Implement progressive download',
        ],
        tools: ['FFmpeg', 'HandBrake', 'Bitmovin', 'Mux', 'CloudFlare Stream'],
      },
      interactive: {
        recommendations: [
          'Break JavaScript into smaller chunks',
          'Implement interaction to next paint (INP) metrics',
          'Use event delegation for faster events',
          'Debounce scroll and resize events',
          'Use requestAnimationFrame for animations',
          'Implement virtual scrolling for large lists',
          'Use IntersectionObserver for visibility detection',
          'Minimize DOM nodes',
        ],
        tools: ['React Virtual', 'Windowed React', 'Web Workers API'],
      },
      text: {
        recommendations: [
          'Use system fonts when possible',
          'Limit web fonts to 2-3 typefaces',
          'Use font-display: swap to prevent FOUT',
          'Use variable fonts to reduce file size',
          'Preload critical fonts',
          'Use text-shadow carefully',
          'Minimize font weights loaded',
          'Use font subsetting',
        ],
        tools: ['Font squirrel', 'Google Fonts', 'Typekit'],
      },
      'heavy-js': {
        recommendations: [
          'Split code into chunks',
          'Use dynamic imports/code splitting',
          'Implement tree shaking',
          'Use terser for minification',
          'Implement service workers for caching',
          'Use Web Workers for heavy computations',
          'Lazy load heavy libraries',
          'Replace heavy libraries with lighter alternatives',
        ],
        tools: ['Webpack', 'Rollup', 'Parcel', 'Vite', 'esbuild'],
      },
    };

    return {
      type: contentType,
      ...strategies[contentType as keyof typeof strategies],
    };
  }

  /**
   * Get comprehensive performance report
   */
  getComprehensiveReport(): {
    overall_score: number;
    metrics: PerformanceRecommendation[];
    strategy: string;
    priority_items: PerformanceRecommendation[];
  } {
    const metrics = [this.optimizeLCP(), this.optimizeFID(), this.optimizeCLS(), this.optimizeTTFB()];

    const scores = {
      good: 100,
      warning: 60,
      poor: 30,
    };

    const overall_score = Math.round(metrics.reduce((acc, m) => acc + scores[m.status], 0) / metrics.length);

    const strategy =
      overall_score > 80
        ? 'Excellent - Maintain current optimizations'
        : overall_score > 60
        ? 'Good - Implement recommended optimizations'
        : 'Poor - Implement all critical optimizations immediately';

    return {
      overall_score,
      metrics,
      strategy,
      priority_items: metrics.filter((m) => m.priority === 'high'),
    };
  }

  /**
   * Generate CSS optimizations
   */
  generateCSSOptimizations(): string {
    return `
/* CSS Optimizations for Core Web Vitals */

/* 1. Prevent Layout Shift */
* { box-sizing: border-box; }
img { display: block; }
img, iframe { max-width: 100%; }

/* 2. Reserve space for embeds */
[data-src] { min-height: 300px; }

/* 3. Web Font Optimization */
@font-face {
  font-display: swap; /* Prevent invisible text */
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
}

/* 4. Performance-friendly animations */
@media (prefers-reduced-motion: no-preference) {
  .animate {
    animation: fadeIn 0.3s ease-in;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 5. Use GPU acceleration for smooth animations */
.gpu-accelerated {
  will-change: transform;
  transform: translateZ(0);
}

/* 6. CSS containment for layout optimization */
.component { contain: layout style paint; }

/* 7. Reduce repaints with efficient selectors */
.button { /* specific class instead of div.button.primary */ }

/* 8. Avoid expensive properties */
body { filter: none; /* avoid drop-shadow, blur */ }

/* 9. Lazy-load images placeholder */
img[loading="lazy"] {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
    `;
  }

  /**
   * Generate JavaScript optimizations
   */
  generateJSOptimizations(): string {
    return `
// JavaScript Optimizations for Core Web Vitals

// 1. Break up long tasks
function breakUp(fn, delay = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, delay);
  });
}

// 2. Intersection Observer for lazy loading
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadContent(entry.target);
      observer.unobserve(entry.target);
    }
  });
});

// 3. Debounce resize events
function debounce(fn, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      fn(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 4. Use requestIdleCallback
requestIdleCallback(() => {
  // Non-critical work here
}, { timeout: 2000 });

// 5. Use requestAnimationFrame for animations
function animate() {
  requestAnimationFrame(() => {
    // Animation code
  });
}

// 6. Virtual scrolling for large lists
class VirtualScroller {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.init();
  }
  
  init() {
    this.container.addEventListener('scroll', () => this.render());
    this.render();
  }
  
  render() {
    const scrollTop = this.container.scrollTop;
    const start = Math.floor(scrollTop / this.itemHeight);
    const end = start + Math.ceil(this.container.clientHeight / this.itemHeight);
    // Render only visible items
  }
}

// 7. Web Workers for heavy computation
const worker = new Worker('worker.js');
worker.postMessage({ data: largeDataSet });
worker.onmessage = (e) => {
  console.log('Result from worker:', e.data);
};
    `;
  }

  /**
   * Generate HTML optimizations
   */
  generateHTMLOptimizations(): string {
    return `
<!-- HTML Optimizations for Core Web Vitals -->

<!-- 1. Critical CSS Inlined -->
<style>
  /* Above-the-fold critical styles */
  .hero { background: url('hero.jpg'); }
</style>

<!-- 2. Preload Critical Resources -->
<link rel="preload" as="image" href="hero.jpg">
<link rel="preload" as="font" href="font.woff2" type="font/woff2" crossorigin>
<link rel="preload" as="script" href="critical.js">

<!-- 3. Prefetch Non-critical Resources -->
<link rel="prefetch" href="next-page.js">

<!-- 4. Set Dimensions for Images to Prevent Layout Shift -->
<img src="image.jpg" width="800" height="600" alt="Description">

<!-- 5. Lazy Load Images -->
<img src="placeholder.jpg" data-src="real-image.jpg" loading="lazy" alt="Lazy loaded">

<!-- 6. Async/Defer for Scripts -->
<script async src="analytics.js"></script>
<script defer src="non-critical.js"></script>

<!-- 7. Preconnect to External Resources -->
<link rel="preconnect" href="https://cdn.example.com">
<link rel="dns-prefetch" href="https://analytics.example.com">

<!-- 8. Use Native Loading Attributes -->
<img loading="lazy" src="image.jpg" alt="Lazy loaded">

<!-- 9. Set Dimensions for Videos -->
<video width="640" height="360" controls>
  <source src="video.mp4" type="video/mp4">
</video>

<!-- 10. Use srcset for Responsive Images -->
<img
  srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
  sizes="(max-width: 480px) 100vw, 50vw"
  src="medium.jpg"
  alt="Responsive image"
>
    `;
  }
}

export const coreWebVitalsOptimizer = new CoreWebVitalsOptimizer();
