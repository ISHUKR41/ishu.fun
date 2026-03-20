/**
 * ISHU Backend SEO & Security Configuration
 * Enhanced Helmet headers for maximum SEO and security optimization
 * Serves sitemaps, robots.txt, and SEO-related endpoints
 * 
 * Includes:
 * - Security headers (CSP, X-Frame-Options, etc.)
 * - SEO headers
 * - Preload/prefetch hints
 * - Dynamic sitemap serving
 * - Robots.txt serving with all search engines
 * - Breadcrumbs, schema markup, etc.
 */

const helmet = require('helmet');

/**
 * ENHANCED HELMET CONFIGURATION FOR MAXIMUM SEO + SECURITY
 */
const getHelmetConfig = () => {
  return {
    // Content Security Policy - allows CDNs and external resources
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://cdn.ishu.fun",
          "https://fonts.googleapis.com",
          "https://analytics.google.com",
          "https://www.googletagmanager.com",
          "https://pagead2.googlesyndication.com",
          "https://adservice.google.com",
          "https://www.google-analytics.com",
          "https://connect.facebook.net",
          "https://platform.twitter.com",
          "https://platform.instagram.net",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://cdn.ishu.fun",
        ],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "blob:",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdn.jsdelivr.net",
          "data:",
        ],
        connectSrc: [
          "'self'",
          "https:",
          "wss:",
        ],
        frameSrc: [
          "https://www.youtube.com",
          "https://www.facebook.com",
          "https://platform.twitter.com",
          "https://instagram.com",
        ],
        mediaSrc: [
          "'self'",
          "https:",
          "blob:",
        ],
      },
      reportOnly: false,
    },

    // Cross-Origin Policy
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },

    // X-Frame-Options for clickjacking protection
    frameguard: {
      action: "sameorigin",
    },

    // X-Content-Type-Options
    noSniff: true,

    // Referrer-Policy for better privacy and SEO
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },

    // X-XSS-Protection (older browsers)
    xssFilter: true,

    // HSTS for HTTPS enforcement
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },

    // DNS Prefetch Control (enable for performance)
    dnsPrefetchControl: { allow: true },

    // Permissions Policy (formerly Feature-Policy)
    permissionsPolicy: {
      features: {
        geolocation: ["'self'"],
        microphone: ["'none'"],
        camera: ["'none'"],
        payment: ["'self'"],
        usb: ["'none'"],
        accelerometer: ["'self'"],
        gyroscope: ["'self'"],
      },
    },
  };
};

/**
 * ENHANCED SEO HEADER MIDDLEWARE
 * Adds SEO-specific headers to all responses
 */
const seoHeadersMiddleware = (req, res, next) => {
  // Link preload/prefetch headers for performance
  const linkHeaders = [
    // Preload critical resources
    '</fonts/inter.woff2>; rel=preload; as=font; crossorigin',
    '</css/styles.css>; rel=preload; as=style',
    '</js/app.js>; rel=preload; as=script',

    // Prefetch likely navigation targets
    '</tools>; rel=prefetch',
    '</results>; rel=prefetch',
    '</news>; rel=prefetch',

    // DNS prefetch for external services
    '<https://cdn.ishu.fun>; rel=dns-prefetch',
    '<https://analytics.google.com>; rel=dns-prefetch',

    // Preconnect for critical external resources
    '<https://cdn.ishu.fun>; rel=preconnect; crossorigin',
    '<https://fonts.googleapis.com>; rel=preconnect; crossorigin',
  ];

  res.setHeader("Link", linkHeaders.join(","));

  // SEO Headers
  res.setHeader("X-UA-Compatible", "IE=edge");
  res.setHeader("X-Content-Language", "en-IN");
  res.setHeader("Content-Language", "en-IN");

  // Performance Headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Accept-CH", "DPR, Viewport-Width, Width");

  // Optimization hints
  res.setHeader("Accept-CH-Lifetime", "86400");

  next();
};

/**
 * ROBOTS.TXT CONFIGURATION
 * Optimized for all search engines globally
 */
const getRobotsTxt = () => {
  return `# ISHU.FUN - robots.txt
# Last updated: ${new Date().toISOString()}
# Global optimization for all crawlers and all search engines

# ═══════════════════════════════════════════════════════════════
# DEFAULT RULES - MAXIMUM GLOBAL COVERAGE
# ═══════════════════════════════════════════════════════════════
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /auth/
Disallow: /dashboard/
Disallow: /profile/
Disallow: /settings/
Disallow: /notifications/
Disallow: /activity/
Disallow: /saved/
Disallow: /tracker/
Disallow: /*.json$
Disallow: /api/
Disallow: /temp/
Disallow: /cache/
Crawl-delay: 0.5
Request-rate: 10/1s
Visit-after: 2026-03-20

# ═══════════════════════════════════════════════════════════════
# GOOGLE - PRIMARY (Googlebot, Googlebot Image, Googlebot Mobile)
# ═══════════════════════════════════════════════════════════════
User-agent: Googlebot
User-agent: Googlebot-Image
User-agent: Googlebot-Mobile
Allow: /
Crawl-delay: 0
Request-rate: 100/1s

# ═══════════════════════════════════════════════════════════════
# BING - SECONDARY (Bingbot, MSNBot, BingPreview)
# ═══════════════════════════════════════════════════════════════
User-agent: Bingbot
User-agent: MSNBot
User-agent: BingPreview
Allow: /
Crawl-delay: 1
Request-rate: 30/1s

# ═══════════════════════════════════════════════════════════════
# YANDEX - RUSSIAN SEARCH ENGINE
# ═══════════════════════════════════════════════════════════════
User-agent: YandexBot
User-agent: YandexImages
User-agent: YandexVideoBot
Allow: /
Crawl-delay: 0.5
Request-rate: 20/1s

# ═══════════════════════════════════════════════════════════════
# BAIDU - CHINA'S SEARCH ENGINE (Global coverage)
# ═══════════════════════════════════════════════════════════════
User-agent: Baiduspider
User-agent: Baiduspider-image
User-agent: Baiduspider-mobile
Allow: /
Crawl-delay: 1
Request-rate: 20/1s

# ═══════════════════════════════════════════════════════════════
# DUCKDUCKGO - PRIVACY-FOCUSED SEARCH ENGINE
# ═══════════════════════════════════════════════════════════════
User-agent: DuckDuckBot
User-agent: DuckDuckBot-Https
Allow: /
Crawl-delay: 0

# ═══════════════════════════════════════════════════════════════
# OTHER MAJOR SEARCH ENGINES
# ═══════════════════════════════════════════════════════════════
User-agent: facebookexternalhit
User-agent: Twitterbot
User-agent: LinkedInBot
User-agent: WhatsApp
User-agent: Slurp
User-agent: Ask Jeeves
Allow: /

# ═══════════════════════════════════════════════════════════════
# ARCHIVE & MONITORING
# ═══════════════════════════════════════════════════════════════
User-agent: ia_archiver
User-agent: Archive.org_bot
Allow: /

User-agent: MJ12bot
Allow: /

# ═══════════════════════════════════════════════════════════════
# BLOCK KNOWN BAD BOTS
# ═══════════════════════════════════════════════════════════════
User-agent: AhrefsBot
User-agent: SemrushBot
User-agent: DotBot
User-agent: MJ12bot
Disallow: /

# ═══════════════════════════════════════════════════════════════
# SITEMAP DECLARATIONS
# ═══════════════════════════════════════════════════════════════
Sitemap: https://ishu.fun/sitemap.xml
Sitemap: https://ishu.fun/sitemap-main.xml
Sitemap: https://ishu.fun/sitemap-jobs.xml
Sitemap: https://ishu.fun/sitemap-exams.xml
Sitemap: https://ishu.fun/sitemap-tv.xml
Sitemap: https://ishu.fun/sitemap-tools.xml
Sitemap: https://ishu.fun/sitemap-mobile.xml
Sitemap: https://ishu.fun/sitemap-news.xml

# ═══════════════════════════════════════════════════════════════
# HOST PREFERENCE (for Google)
# ═══════════════════════════════════════════════════════════════
Host: https://ishu.fun

# Performance optimization allowed
Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term
`;
};

/**
 * SECURITY HEADERS FOR ALL RESPONSES
 */
const securityHeadersMiddleware = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS protection (for older browsers)
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Clickjacking protection
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // DNS prefetch control (allow for performance)
  res.setHeader("X-DNS-Prefetch-Control", "on");

  // Permissions Policy
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(self), microphone=(), camera=(), payment=(self), usb=()"
  );

  // Content Language
  res.setHeader("Content-Language", "en-IN");

  next();
};

/**
 * CACHE CONTROL FOR DIFFERENT RESOURCE TYPES
 */
const cacheControlMiddleware = (req, res, next) => {
  const url = req.url;

  // Static assets - long cache
  if (url.match(/\.(js|css|woff|woff2|ttf|eot|otf|svg)$/)) {
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }
  // HTML pages - moderate cache, revalidate
  else if (url.match(/\.html$/)) {
    res.setHeader("Cache-Control", "public, max-age=3600, must-revalidate");
  }
  // Images - medium cache
  else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    res.setHeader("Cache-Control", "public, max-age=86400");
  }
  // API responses - no cache
  else if (url.includes("/api/")) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  }
  // Default - short cache
  else {
    res.setHeader("Cache-Control", "public, max-age=300");
  }

  next();
};

/**
 * COMPRESSION HINTS FOR BETTER PERFORMANCE
 */
const compressionHintsMiddleware = (req, res, next) => {
  // Accept-Encoding header support
  res.setHeader("Vary", "Accept-Encoding");

  next();
};

module.exports = {
  getHelmetConfig,
  seoHeadersMiddleware,
  securityHeadersMiddleware,
  cacheControlMiddleware,
  compressionHintsMiddleware,
  getRobotsTxt,
};
