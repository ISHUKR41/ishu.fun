/**
 * ADVANCED SECURITY & CANONICALIZATION HEADERS v2.0
 * Maximum SEO + Security for all search engines and browsers
 */

interface SecurityHeaders {
  [key: string]: string;
}

export class SecurityAndCanonicalManager {
  /**
   * Generate all security headers for maximum SEO
   */
  static generateSecurityHeaders(): SecurityHeaders {
    return {
      // ═══════════════════════════════════════════════════════════════════════════
      // SECURITY HEADERS
      // ═══════════════════════════════════════════════════════════════════════════

      'X-Content-Type-Options': 'nosniff', // Prevent MIME type sniffing
      'X-Frame-Options': 'SAMEORIGIN', // Prevent clickjacking
      'X-XSS-Protection': '1; mode=block', // Enable XSS protection
      'Referrer-Policy': 'strict-origin-when-cross-origin', // Control referrer info
      'Permissions-Policy':
        'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com; media-src 'self' https:; object-src 'none'; frame-src 'self' https://www.youtube.com; form-action 'self'; base-uri 'self'; upgrade-insecure-requests;",

      // ═══════════════════════════════════════════════════════════════════════════
      // SEO HEADERS
      // ═══════════════════════════════════════════════════════════════════════════

      'Link': '</sitemap.xml>; rel="sitemap", <https://ishu.fun>; rel="canonical", <https://www.ishu.fun>; rel="alternate"',

      // ═══════════════════════════════════════════════════════════════════════════
      // PERFORMANCE HEADERS
      // ═══════════════════════════════════════════════════════════════════════════

      'Cache-Control': 'public, max-age=31536000, immutable', // Cache strategy
      'ETag': 'W/"123456789"', // Entity tag for caching
      'Vary': 'Accept-Encoding, Accept-Language', // Vary for different encodings
      'Accept-Ranges': 'bytes', // Support for range requests

      // ═══════════════════════════════════════════════════════════════════════════
      // COMPRESSION HEADERS
      // ═══════════════════════════════════════════════════════════════════════════

      'Content-Encoding': 'gzip, br', // Enable compression
      'Transfer-Encoding': 'chunked', // Support chunked encoding

      // ═══════════════════════════════════════════════════════════════════════════
      // HTTP/2 & HTTP/3 HEADERS
      // ═══════════════════════════════════════════════════════════════════════════

      'Alt-Svc': 'h3=":443"; ma=86400, h2=":443"; ma=86400',

      // ═══════════════════════════════════════════════════════════════════════════
      // CORS & PROTOCOL HEADERS
      // ═══════════════════════════════════════════════════════════════════════════

      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',

      // ═══════════════════════════════════════════════════════════════════════════
      // INTERNET STANDARDS
      // ═══════════════════════════════════════════════════════════════════════════

      'Server': 'ishu-cdn/1.0', // Custom server identifier
      'X-Powered-By': 'React + Vite + Node.js', // Framework identification
      'X-UA-Compatible': 'IE=edge', // IE compatibility mode
    };
  }

  /**
   * Generate HTTP/2 Push directives
   */
  static generateHTTP2PushHeaders(): string[] {
    return [
      '</fonts/inter.woff2>; rel=preload; as=font; crossorigin',
      '</js/critical.js>; rel=preload; as=script',
      '</css/critical.css>; rel=preload; as=style',
      '</og-image.png>; rel=preload; as=image',
    ];
  }

  /**
   * Generate canonical tags for all pages
   */
  static generateCanonicalTags(pageUrl: string, alternateUrls?: string[]): {
    canonical: string;
    alternates: string[];
  } {
    const cleanUrl = pageUrl.split('?')[0].split('#')[0]; // Remove query/hash

    const alternates = [
      cleanUrl, // Primary from HTTPS
      `https://www.ishu.fun${cleanUrl.replace('https://ishu.fun', '')}`, // WWW version
      `https://ishu.fun${cleanUrl.replace('https://www.ishu.fun', '')}`, // Non-WWW version
      ...(alternateUrls || []),
    ];

    return {
      canonical: cleanUrl,
      alternates: [...new Set(alternates)], // Remove duplicates
    };
  }

  /**
   * Generate hreflang tags for multilingual pages
   */
  static generateHreflangTags(baseUrl: string): Record<string, string[]> {
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'ta', name: 'Tamil' },
      { code: 'te', name: 'Telugu' },
      { code: 'bn', name: 'Bengali' },
      { code: 'mr', name: 'Marathi' },
      { code: 'gu', name: 'Gujarati' },
      { code: 'kn', name: 'Kannada' },
      { code: 'ml', name: 'Malayalam' },
      { code: 'pa', name: 'Punjabi' },
      { code: 'ur', name: 'Urdu' },
      { code: 'or', name: 'Odia' },
    ];

    const hreflangTags: Record<string, string[]> = {};

    languages.forEach((lang) => {
      hreflangTags[lang.code] = [
        `<link rel="alternate" hreflang="${lang.code}" href="${baseUrl}/${lang.code}/">`,
        `<link rel="alternate" hreflang="${lang.code}-IN" href="${baseUrl}/${lang.code}/">`,
      ];
    });

    // Add x-default
    hreflangTags['x-default'] = [`<link rel="alternate" hreflang="x-default" href="${baseUrl}/">`];

    return hreflangTags;
  }

  /**
   * Generate DNS optimization headers
   */
  static generateDNSOptimization(): Record<string, string> {
    return {
      'DNS-Prefetch':
        'https://www.google-analytics.com, https://www.googletagmanager.com, https://fonts.googleapis.com, https://cdn.jsdelivr.net',
      'Preconnect':
        'https://www.google-analytics.com, https://fonts.gstatic.com, https://www.google.com',
    };
  }

  /**
   * Generate robots meta tags
   */
  static generateRobotsMeta(): Record<string, string> {
    return {
      robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      googlebot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1, archive',
      bingbot: 'index, follow',
      slurp: 'index, follow',
      duckduckbot: 'index, follow',
      yandexbot: 'index, follow',
      'Baidu-Spider': 'index, follow',
    };
  }

  /**
   * Generate verification tags for search engines
   */
  static generateVerificationTags(): Record<string, string> {
    return {
      'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE',
      'msvalidate.01': 'YOUR_BING_VERIFICATION_CODE',
      'yandex-verification': 'YOUR_YANDEX_VERIFICATION_CODE',
      'baidu-site-verification': 'YOUR_BAIDU_VERIFICATION_CODE',
      'p:domain_verify': 'YOUR_PINTEREST_VERIFICATION_CODE',
    };
  }

  /**
   * Generate all SEO-critical headers
   */
  static generateCompleteSEOHeaders(): string {
    return `
# Complete SEO Headers Configuration

# ═══════════════════════════════════════════════════════════════════════════
# SECURITY & SEO HEADERS
# ═══════════════════════════════════════════════════════════════════════════

X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Alt-Svc: h3=":443"; ma=86400, h2=":443"; ma=86400

# ═══════════════════════════════════════════════════════════════════════════
# CACHING HEADERS
# ═══════════════════════════════════════════════════════════════════════════

Cache-Control: public, max-age=31536000, immutable
ETag: W/"12345"
Vary: Accept-Encoding, Accept-Language

# ═══════════════════════════════════════════════════════════════════════════
# COMPRESSION
# ═══════════════════════════════════════════════════════════════════════════

Content-Encoding: gzip, br

# ═══════════════════════════════════════════════════════════════════════════
# SEO LINKS
# ═══════════════════════════════════════════════════════════════════════════

Link: </sitemap.xml>; rel="sitemap"
Link: <https://ishu.fun>; rel="canonical"
Link: <https://www.ishu.fun>; rel="alternate"
    `;
  }

  /**
   * Generate next.js headers configuration
   */
  static generateNextJSConfig(): string {
    return `
// next.config.js - SEO Headers Configuration

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net"
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding, Accept-Language'
          }
        ],
      },
    ];
  },
  
  async redirects() {
    return [
      {
        source: '/ishu',
        destination: 'https://ishu.fun',
        permanent: true, // 301 redirect for SEO
      },
    ];
  },
  
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/sitemap.xml',
          destination: '/api/sitemap',
        },
        {
          source: '/robots.txt',
          destination: '/api/robots',
        },
      ],
    };
  },
};

module.exports = nextConfig;
    `;
  }

  /**
   * Generate Vercel deployment configuration
   */
  static generateVercelConfig(): string {
    return `
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": [
    {
      "key": "NEXT_PUBLIC_SITE_URL",
      "value": "https://ishu.fun"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
    `;
  }

  /**
   * Generate Nginx configuration for SEO
   */
  static generateNginxConfig(): string {
    return `
# Nginx Configuration for Maximum SEO

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ishu.fun www.ishu.fun;
    
    ssl_certificate /etc/ssl/ishu.fun.crt;
    ssl_certificate_key /etc/ssl/ishu.fun.key;
    
    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # SEO Headers
    add_header Link "</sitemap.xml>; rel=\\"sitemap\\", <https://ishu.fun>; rel=\\"canonical\\"" always;
    
    # Caching
    add_header Cache-Control "public, max-age=31536000, immutable" always;
    
    # Compression
    gzip on;
    gzip_comp_level 9;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    
    # Root location
    root /var/www/ishu;
    index index.html;
    
    # Sitemap and robots
    location ~ ^/(sitemap\\.xml|robots\\.txt)$ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=86400";
    }
    
    # Static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Canonical redirect
    if ($host = www.ishu.fun) {
        rewrite ^/(.*)$ https://ishu.fun/$1 permanent;
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name ishu.fun www.ishu.fun;
    return 301 https://$server_name$request_uri;
}
    `;
  }
}

export const securityAndCanonicalManager = new SecurityAndCanonicalManager();
