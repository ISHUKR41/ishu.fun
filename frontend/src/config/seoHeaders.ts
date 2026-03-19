/**
 * SEO HEADERS & MIDDLEWARE CONFIGURATION
 * 
 * Optimizes all HTTP headers for:
 * ✓ Search engine crawling
 * ✓ Performance SEO (Core Web Vitals)
 * ✓ Browser compatibility
 * ✓ Security
 * ✓ Caching strategy
 * ✓ Mobile optimization
 */

// ═══════════════════════════════════════════════════════════════════════════════
// NEXT.JS HEADERS CONFIGURATION (next.config.js)
// ═══════════════════════════════════════════════════════════════════════════════

export const getSEOHeaders = () => [
  // ═══════════════════════════════════════════════════════════════════════════
  // SEARCH ENGINE CRAWLING OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: 'X-Robots-Tag',
    value: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CORE WEB VITALS & PERFORMANCE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: 'Accept-CH',
    value: 'DPR, Viewport-Width, Width',
  },
  {
    key: 'Timing-Allow-Origin',
    value: '*',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // BROWSER COMPATIBILITY & MOBILE OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: 'X-UA-Compatible',
    value: 'IE=edge',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CACHING STRATEGY FOR SEO
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: 'Cache-Control',
    value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CONTENT ENCODING FOR FASTER LOAD (Performance SEO)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: 'Content-Encoding',
    value: 'gzip, deflate, br',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // GOOGLE SEARCH CONSOLE VERIFICATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    key: 'google-site-verification',
    value: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// NEXT.JS next.config.js CONFIGURATION TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════

export const getNextConfigSEO = () => (`
/** @type {import('next').NextConfig} */

const sitemapIndex = require('./public/sitemap.xml');

const nextConfig = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUCTION OPTIMIZATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  swcMinify: true,
  optimization: {
    minimize: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // IMAGE OPTIMIZATION FOR SEO
  // ═══════════════════════════════════════════════════════════════════════════
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HEADERS FOR ALL SEARCH ENGINES
  // ═══════════════════════════════════════════════════════════════════════════
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000'
          },
          {
            key: 'Accept-CH',
            value: 'Sec-CH-Prefers-Reduced-Motion, Sec-CH-Prefers-Color-Scheme'
          },
        ]
      },
      // ═══════════════════════════════════════════════════════════════════════
      // XML SITEMAP CACHING
      // ═══════════════════════════════════════════════════════════════════════
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=604800'
          }
        ]
      },
      // ═══════════════════════════════════════════════════════════════════════
      // STATIC ASSETS CACHING
      // ═══════════════════════════════════════════════════════════════════════
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REDIRECTS FOR OLD PAGES (301 redirects for SEO)
  // ═══════════════════════════════════════════════════════════════════════════
  async redirects() {
    return [
      // Redirect old URLs to maintain SEO
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true, // 301 redirect
      },
    ];
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // REWRITE RULES (Keep URL clean while serving different content)
  // ═══════════════════════════════════════════════════════════════════════════
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.ishu.fun/:path*',
      },
    ];
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ENVIRONMENT VARIABLES FOR SEO
  // ═══════════════════════════════════════════════════════════════════════════
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://ishu.fun',
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERIMENTAL FEATURES FOR BETTER SEO
  // ═══════════════════════════════════════════════════════════════════════════
  experimental: {
    optimizePackageImports: ['@/components', '@/utils'],
  },
};

module.exports = nextConfig;
`);

// ═══════════════════════════════════════════════════════════════════════════════
// VERCEL.JSON SEO CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const getVercelSEOConfig = () => ({
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
        },
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        }
      ]
    }
  ],
  cleanUrls: true,
  trailingSlash: false,
});

// ═══════════════════════════════════════════════════════════════════════════════
// HTTP/2 SERVER PUSH FOR CRITICAL RESOURCES
// ═══════════════════════════════════════════════════════════════════════════════

export const getCriticalResources = () => [
  '/fonts/system.woff2',
  '/css/critical.css',
  '/js/polyfills.js',
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRELOAD DIRECTIVES FOR PERFORMANCE SEO
// ═══════════════════════════════════════════════════════════════════════════════

export const getPreloadDirectives = () => [
  '<link rel="preload" as="font" href="/fonts/system.woff2" type="font/woff2" crossorigin>',
  '<link rel="preload" as="style" href="/css/critical.css">',
  '<link rel="preload" as="script" href="/js/critical.js">',
  '<link rel="prefetch" href="/news/">',
  '<link rel="prefetch" href="/jobs/">',
];

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE OPTIMIZATION FOR EACH BROWSER
// ═══════════════════════════════════════════════════════════════════════════════

export const getBrowserOptimizations = () => ({
  chrome: {
    'preconnect': ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
    'dns-prefetch': ['https://www.google-analytics.com'],
  },
  firefox: {
    'preconnect': ['https://fonts.googleapis.com'],
    'dns-prefetch': ['https://www.google-analytics.com'],
  },
  safari: {
    'preconnect': ['https://fonts.googleapis.com'],
    'dns-prefetch': ['https://www.google-analytics.com'],
  },
  edge: {
    'preconnect': ['https://fonts.googleapis.com'],
    'dns-prefetch': ['https://www.google-analytics.com'],
  },
});
