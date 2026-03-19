/**
 * BROWSER SEO OPTIMIZER
 * Complete browser compatibility optimization for all browsers worldwide
 * Supports: Chrome, Firefox, Safari, Edge, Opera, Brave, Vivaldi, UC Browser, etc.
 */

export interface BrowserSEOConfig {
  browserName: string;
  metaTags: Record<string, string>;
  linkTags: Array<{ rel: string; href: string; [key: string]: string }>;
  scripts?: Array<{ type: string; content: string }>;
}

export class BrowserSEOOptimizer {
  /**
   * Get Chrome-specific SEO optimizations
   */
  static getChromeOptimizations(): BrowserSEOConfig {
    return {
      browserName: "Chrome",
      metaTags: {
        "chrome-extension": "ISHU-SEO-Chrome",
        "google-site-verification": "google-site-verification-code",
        "google-analytics": "UA-tracking-id",
        "chrome-mobile-web-app-capable": "yes",
        "theme-color": "#1e293b",
      },
      linkTags: [
        { rel: "canonical", href: "https://ishu.fun" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "dns-prefetch", href: "https://www.google-analytics.com" },
        { rel: "prefetch", href: "https://ishu.fun/api/jobs" },
        { rel: "preload", as: "style", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
      ],
    };
  }

  /**
   * Get Firefox-specific SEO optimizations
   */
  static getFirefoxOptimizations(): BrowserSEOConfig {
    return {
      browserName: "Firefox",
      metaTags: {
        "firefox-mobile-supported": "yes",
        "firefox-theme-color": "#1e293b",
        "firefox-app-id": "ishu-firefox-app",
        "og:type": "website",
        "og:locale": "en_US",
      },
      linkTags: [
        { rel: "canonical", href: "https://ishu.fun" },
        { rel: "OpenSearchDescription", href: "/opensearch.xml" },
        { rel: "alternate", type: "application/rss+xml", href: "/rss.xml" },
        { rel: "preconnect", href: "https://ishu-site.onrender.com" },
        { rel: "preload", as: "script", href: "/analytics.js" },
      ],
    };
  }

  /**
   * Get Safari-specific SEO optimizations
   */
  static getSafariOptimizations(): BrowserSEOConfig {
    return {
      browserName: "Safari",
      metaTags: {
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "black-translucent",
        "apple-mobile-web-app-title": "ISHU",
        "apple-itunes-app": "app-id=YOUR_APP_ID",
        "format-detection": "telephone=no",
        "apple-app-id": "ishu-app-id-safari",
      },
      linkTags: [
        { rel: "canonical", href: "https://ishu.fun" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "apple-touch-icon", sizes: "152x152", href: "/apple-touch-icon-152x152.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon-180x180.png" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#1e293b" },
      ],
    };
  }

  /**
   * Get Edge-specific SEO optimizations
   */
  static getEdgeOptimizations(): BrowserSEOConfig {
    return {
      browserName: "Edge",
      metaTags: {
        "msapplication-config": "/browserconfig.xml",
        "msapplication-TileColor": "#1e293b",
        "msapplication-TileImage": "/mstile-144x144.png",
        "msapplication-tap-highlight": "no",
        "windows-phone-app-id": "ishu-windows-app",
      },
      linkTags: [
        { rel: "canonical", href: "https://ishu.fun" },
        { rel: "preconnect", href: "https://www.microsoft.com" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      ],
    };
  }

  /**
   * Get Opera-specific SEO optimizations
   */
  static getOperaOptimizations(): BrowserSEOConfig {
    return {
      browserName: "Opera",
      metaTags: {
        "opera-extensions": "ishu-opera-extension",
        "opera-theme": "dark",
        "opera-app-id": "ishu-opera",
      },
      linkTags: [
        { rel: "canonical", href: "https://ishu.fun" },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "preconnect", href: "https://opera.com/cdn" },
      ],
    };
  }

  /**
   * Get Mobile Browser optimizations (UC Browser, Opera Mini, etc.)
   */
  static getMobileBrowserOptimizations(): BrowserSEOConfig {
    return {
      browserName: "Mobile Browsers",
      metaTags: {
        "mobile-web-app-capable": "yes",
        "viewport": "width=device-width, initial-scale=1.0, maximum-scale=5.0",
        "HandheldFriendly": "true",
        "MobileOptimized": "width",
        "format-detection": "telephone=no",
        "app-mobile-web-app-status-bar-style": "black-translucent",
      },
      linkTags: [
        { rel: "canonical", href: "https://ishu.fun" },
        { rel: "alternate", media: "only screen and (max-width: 640px)", href: "https://m.ishu.fun" },
        { rel: "icon", sizes: "192x192", href: "/android-chrome-192x192.png" },
        { rel: "icon", sizes: "512x512", href: "/android-chrome-512x512.png" },
      ],
    };
  }

  /**
   * Get all browser-specific optimizations
   */
  static getAllBrowserOptimizations(): BrowserSEOConfig[] {
    return [
      this.getChromeOptimizations(),
      this.getFirefoxOptimizations(),
      this.getSafariOptimizations(),
      this.getEdgeOptimizations(),
      this.getOperaOptimizations(),
      this.getMobileBrowserOptimizations(),
    ];
  }

  /**
   * Get manifest.json configuration for web app
   */
  static getWebAppManifest() {
    return {
      name: "ISHU — Indian StudentHub University",
      short_name: "ISHU",
      description: "India's #1 free platform for government jobs, exam results, PDF tools & video downloader",
      start_url: "/",
      scope: "/",
      display: "standalone",
      orientation: "portrait-primary",
      background_color: "#ffffff",
      theme_color: "#1e293b",
      categories: ["education", "productivity", "utilities"],
      prefer_related_applications: true,
      related_applications: [
        {
          platform: "play",
          url: "https://play.google.com/store/apps/details?id=com.ishu",
          id: "com.ishu",
        },
        {
          platform: "itunes",
          url: "https://apps.apple.com/app/ishu/id123456789",
        },
      ],
      icons: [
        { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/favicon-192x192-maskable.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
        { src: "/favicon-512x512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
      screenshots: [
        {
          src: "/screenshot-540x720.png",
          sizes: "540x720",
          type: "image/png",
          form_factor: "narrow",
        },
        {
          src: "/screenshot-1280x720.png",
          sizes: "1280x720",
          type: "image/png",
          form_factor: "wide",
        },
      ],
      shortcuts: [
        {
          name: "Government Jobs",
          short_name: "Jobs",
          description: "Find latest government jobs",
          url: "/jobs?utm_source=pwa",
          icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
        },
        {
          name: "Exam Results",
          short_name: "Results",
          description: "Check exam results",
          url: "/results?utm_source=pwa",
          icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
        },
        {
          name: "PDF Tools",
          short_name: "PDF",
          description: "Free PDF tools",
          url: "/tools/pdf?utm_source=pwa",
          icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
        },
      ],
      share_target: {
        action: "/share",
        method: "POST",
        enctype: "application/x-www-form-urlencoded",
        params: {
          title: "title",
          text: "text",
          url: "url",
        },
      },
    };
  }

  /**
   * Get security headers
   */
  static getSecurityHeaders() {
    return {
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=()",
      "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.ishu.fun;",
    };
  }

  /**
   * Get performance optimization headers
   */
  static getPerformanceHeaders() {
    return {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Content-Type-Options": "nosniff",
      "Accept-CH": "DPR, Viewport-Width, Width, Device-Memory, Downlink, Save-Data",
      "Critical-CH": "Viewport-Width, DPR",
      "Link": '<https://fonts.googleapis.com>; rel=preconnect, <https://fonts.gstatic.com>; rel=preconnect; crossorigin',
    };
  }

  /**
   * Get Rich Results schema for different types
   */
  static getRichResultsSchema(type: string) {
    const schemas: Record<string, object> = {
      organization: {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ISHU - Indian StudentHub University",
        url: "https://ishu.fun",
        logo: "https://ishu.fun/logo.png",
        description: "India's #1 platform for government jobs, exam results, PDF tools & video downloader",
        sameAs: [
          "https://twitter.com/ishufun",
          "https://facebook.com/ishufun",
          "https://instagram.com/ishu.fun",
          "https://youtube.com/@ishufun",
          "https://linkedin.com/company/ishu",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "Customer Support",
            telephone: "+91-8986985813",
            email: "support@ishu.fun",
          },
        ],
        foundingDate: "2024",
        areaServed: "IN",
        knowsAbout: ["Government Jobs", "Exam Results", "PDF Tools", "Video Downloader"],
      },
      
      website: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "ISHU",
        url: "https://ishu.fun",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://ishu.fun/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      
      localBusiness: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "ISHU - Indian StudentHub University",
        image: "https://ishu.fun/logo.png",
        description: "Platform for government jobs and educational tools",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
          addressLocality: "India",
        },
        geo: {
          "@type": "GeoShape",
          box: "8.4° N 68.2° E 35.5° N 97.4° E",
        },
        url: "https://ishu.fun",
        telephone: "+91-8986985813",
        priceRange: "Free",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "50000",
          bestRating: "5",
          worstRating: "1",
        },
      },
      
      faqPage: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is ISHU free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, ISHU is completely free. All tools, exam results, and features are available without any signup.",
            },
          },
          {
            "@type": "Question",
            name: "How to download YouTube videos?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Visit ishu.fun/tools/youtube-downloader, paste the YouTube video URL, select quality, and click download.",
            },
          },
          {
            "@type": "Question",
            name: "How to check exam results?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Go to ishu.fun/results, search for your exam, and view your result instantly.",
            },
          },
        ],
      },
    };
    
    return schemas[type] || schemas.organization;
  }

  /**
   * Get responsive image optimization
   */
  static getImageOptimization(imagePath: string, altText: string) {
    return {
      src: imagePath,
      srcset: `${imagePath}?w=320 320w, ${imagePath}?w=640 640w, ${imagePath}?w=1280 1280w, ${imagePath}?w=1920 1920w`,
      sizes: "(max-width: 640px) 100vw, (max-width: 1280px) 640px, 1280px",
      alt: altText,
      loading: "lazy",
      decoding: "async",
    };
  }

  /**
   * Get viewport configuration for all devices
   */
  static getViewportConfig() {
    return {
      mobile: "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes",
      tablet: "width=768px, initial-scale=1.0, maximum-scale=5.0",
      desktop: "width=device-width, initial-scale=1.0, maximum-scale=3.0",
    };
  }
}

export default BrowserSEOOptimizer;
