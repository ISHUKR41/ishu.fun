/**
 * COMPREHENSIVE META TAGS & SEO HEADERS GENERATOR v2.0
 * Generates optimal meta tags for every page type
 * 
 * Includes:
 * - Dynamic meta tags generation
 * - Open Graph tags (Facebook, LinkedIn, etc.)
 * - Twitter Card tags (Twitter, X)
 * - Structured data (Schema.org JSON-LD)
 * - HTTP headers optimization
 * - Security headers
 * - Performance headers
 */

export interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterSite?: string;
  twitterCreator?: string;
  robots?: string;
  language?: string;
  publishedTime?: string;
  modifiedTime?: string;
  expirationTime?: string;
  section?: string;
  tags?: string[];
}

/**
 * MASTER META TAGS GENERATOR
 */
export class MetaTagsGenerator {
  private baseUrl = 'https://ishu.fun';
  private siteName = 'ISHU';
  private defaultImage = '/og-image.png';
  private defaultAuthor = 'ISHU Team';

  /**
   * Generate complete meta tags as HTML strings
   */
  generateMetaTags(metadata: PageMetadata): string[] {
    const tags: string[] = [];

    // ═══════════════════════════════════════════════════════════════════════
    // BASIC META TAGS
    // ═══════════════════════════════════════════════════════════════════════
    tags.push('<meta charset="UTF-8" />');
    tags.push(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />'
    );

    if (metadata.title) {
      tags.push(`<title>${this.escapeHtml(metadata.title)}</title>`);
    }

    if (metadata.description) {
      tags.push(`<meta name="description" content="${this.escapeHtml(metadata.description)}" />`);
    }

    if (metadata.keywords && metadata.keywords.length > 0) {
      tags.push(`<meta name="keywords" content="${this.escapeHtml(metadata.keywords.join(', '))}" />`);
    }

    if (metadata.author) {
      tags.push(`<meta name="author" content="${this.escapeHtml(metadata.author)}" />`);
    }

    if (metadata.robots) {
      tags.push(`<meta name="robots" content="${metadata.robots}" />`);
    } else {
      tags.push('<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />');
    }

    // ═══════════════════════════════════════════════════════════════════════
    // LANGUAGE & LOCALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    tags.push(`<meta http-equiv="Content-Language" content="${metadata.language || 'en-IN'}" />`);
    tags.push('<meta name="language" content="en-IN" />');

    // ═══════════════════════════════════════════════════════════════════════
    // ARTICLE/CONTENT METADATA
    // ═══════════════════════════════════════════════════════════════════════
    if (metadata.publishedTime) {
      tags.push(`<meta property="article:published_time" content="${metadata.publishedTime}" />`);
    }

    if (metadata.modifiedTime) {
      tags.push(`<meta property="article:modified_time" content="${metadata.modifiedTime}" />`);
    }

    if (metadata.expirationTime) {
      tags.push(`<meta http-equiv="expires" content="${metadata.expirationTime}" />`);
    }

    if (metadata.section) {
      tags.push(`<meta property="article:section" content="${metadata.section}" />`);
    }

    if (metadata.tags && metadata.tags.length > 0) {
      metadata.tags.forEach(tag => {
        tags.push(`<meta property="article:tag" content="${this.escapeHtml(tag)}" />`);
      });
    }

    // ═══════════════════════════════════════════════════════════════════════
    // OPEN GRAPH TAGS (Facebook, LinkedIn, etc.)
    // ═══════════════════════════════════════════════════════════════════════
    tags.push('<meta property="og:site_name" content="ISHU" />');
    tags.push(`<meta property="og:url" content="${metadata.canonicalUrl || this.baseUrl}" />`);
    tags.push(`<meta property="og:title" content="${this.escapeHtml(metadata.ogTitle || metadata.title || this.siteName)}" />`);
    tags.push(
      `<meta property="og:description" content="${this.escapeHtml(metadata.ogDescription || metadata.description || 'Free government jobs, exam results & tools')}" />`
    );
    tags.push(`<meta property="og:type" content="${metadata.ogType || 'website'}" />`);
    tags.push(`<meta property="og:image" content="${metadata.ogImage || this.defaultImage}" />`);
    tags.push('<meta property="og:image:width" content="1200" />');
    tags.push('<meta property="og:image:height" content="630" />');
    tags.push('<meta property="og:image:type" content="image/png" />');
    tags.push('<meta property="og:locale" content="en_IN" />');
    tags.push('<meta property="og:locale:alternate" content="hi_IN" />');
    tags.push('<meta property="og:locale:alternate" content="ta_IN" />');
    tags.push('<meta property="og:locale:alternate" content="te_IN" />');

    // ═══════════════════════════════════════════════════════════════════════
    // TWITTER CARD TAGS
    // ═══════════════════════════════════════════════════════════════════════
    tags.push(`<meta name="twitter:card" content="${metadata.twitterCard || 'summary_large_image'}" />`);
    tags.push(
      `<meta name="twitter:title" content="${this.escapeHtml(metadata.twitterTitle || metadata.title || this.siteName)}" />`
    );
    tags.push(
      `<meta name="twitter:description" content="${this.escapeHtml(metadata.twitterDescription || metadata.description || 'Free tools & resources')}" />`
    );
    tags.push(`<meta name="twitter:image" content="${metadata.twitterImage || metadata.ogImage || this.defaultImage}" />`);
    tags.push('<meta name="twitter:creator" content="@ishufun" />');
    tags.push('<meta name="twitter:site" content="@ishufun" />');

    // ═══════════════════════════════════════════════════════════════════════
    // CANONICAL URL (Prevent duplicate content)
    // ═══════════════════════════════════════════════════════════════════════
    if (metadata.canonicalUrl) {
      tags.push(`<link rel="canonical" href="${metadata.canonicalUrl}" />`);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // THEME & APPEARANCE
    // ═══════════════════════════════════════════════════════════════════════
    tags.push('<meta name="theme-color" content="#1e293b" />');
    tags.push('<meta name="color-scheme" content="light dark" />');
    tags.push('<meta name="apple-mobile-web-app-capable" content="yes" />');
    tags.push('<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />');
    tags.push('<meta name="apple-mobile-web-app-title" content="ISHU" />');
    tags.push('<meta name="msapplication-TileColor" content="#1e293b" />');
    tags.push('<meta name="msapplication-config" content="/browserconfig.xml" />');

    // ═══════════════════════════════════════════════════════════════════════
    // MOBILE OPTIMIZATION
    // ═══════════════════════════════════════════════════════════════════════
    tags.push('<meta name="HandheldFriendly" content="true" />');
    tags.push('<meta name="MobileOptimized" content="width" />');
    tags.push('<meta name="format-detection" content="telephone=no" />');

    // ═══════════════════════════════════════════════════════════════════════
    // SECURITY & PRIVACY
    // ═══════════════════════════════════════════════════════════════════════
    tags.push('<meta http-equiv="X-UA-Compatible" content="IE=edge" />');
    tags.push('<meta http-equiv="X-Content-Type-Options" content="nosniff" />');
    tags.push('<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />');
    tags.push('<meta http-equiv="X-XSS-Protection" content="1; mode=block" />');
    tags.push('<meta name="referrer" content="strict-origin-when-cross-origin" />');

    // ═══════════════════════════════════════════════════════════════════════
    // SEARCH ENGINE VERIFICATION
    // ═══════════════════════════════════════════════════════════════════════
    tags.push('<meta name="google-site-verification" content="verification-code-here" />');
    tags.push('<meta name="msvalidate.01" content="bing-verification-code-here" />');
    tags.push('<meta name="yandex-verification" content="yandex-verification-code-here" />');

    // ═══════════════════════════════════════════════════════════════════════
    // PERFORMANCE & OPTIMIZATION
    // ═══════════════════════════════════════════════════════════════════════
    tags.push('<link rel="preconnect" href="https://cdn.jsdelivr.net" />');
    tags.push('<link rel="preconnect" href="https://fonts.googleapis.com" />');
    tags.push('<link rel="dns-prefetch" href="https://www.google-analytics.com" />');

    return tags;
  }

  /**
   * Generate HTTP security headers
   */
  generateSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:;",
    };
  }

  /**
   * Generate caching headers
   */
  generateCachingHeaders(): Record<string, string> {
    return {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      Pragma: 'cache',
      Expires: new Date(Date.now() + 3600000).toUTCString(),
      'Last-Modified': new Date().toUTCString(),
      ETag: `"${Date.now()}"`,
    };
  }

  /**
   * Generate performance headers
   */
  generatePerformanceHeaders(): Record<string, string> {
    return {
      'Vary': 'Accept-Encoding, Accept-Language',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Connection': 'keep-alive',
      'Server': 'ISHU/1.0',
      'X-Powered-By': 'ISHU Platform',
    };
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, char => map[char]);
  }

  /**
   * Generate all meta tags combined
   */
  generateComplete(metadata: PageMetadata): {
    metaTags: string[];
    securityHeaders: Record<string, string>;
    cachingHeaders: Record<string, string>;
    performanceHeaders: Record<string, string>;
  } {
    return {
      metaTags: this.generateMetaTags(metadata),
      securityHeaders: this.generateSecurityHeaders(),
      cachingHeaders: this.generateCachingHeaders(),
      performanceHeaders: this.generatePerformanceHeaders(),
    };
  }
}

/**
 * PREDEFINED META TAGS FOR COMMON PAGES
 */
export const pageMetadataPresets = {
  home: {
    title: 'ISHU — Free Government Jobs, Exam Results & PDF Tools 2026',
    description:
      'India\'s #1 free platform for government jobs, sarkari naukri, exam results, PDF tools, YouTube downloader & 700+ live TV channels',
    keywords: [
      'government jobs India',
      'sarkari naukri',
      'sarkari result',
      'free PDF tools',
      'YouTube downloader',
      'live TV India',
    ],
    ogType: 'website' as const,
  },

  tools: {
    title: 'Free Online Tools — PDF Editor, Video Downloader & More',
    description:
      '100+ free online tools including PDF editor, merger, splitter, YouTube downloader, resume maker, and more',
    keywords: [
      'free PDF tools',
      'online PDF editor',
      'video downloader',
      'resume maker',
      'form filler',
    ],
    ogType: 'website' as const,
  },

  results: {
    title: 'Government Exam Results 2026 — Online Check & Download',
    description:
      'Check latest government exam results, admit cards, answer keys & merit lists for UPSC, SSC, Banking, Railway & all exams',
    keywords: [
      'exam result',
      'sarkari result',
      'admit card',
      'UPSC result',
      'SSC result',
    ],
    ogType: 'website' as const,
  },

  jobs: {
    title: 'Latest Government Jobs 2026 — Sarkari Naukri India',
    description:
      'Find latest government job notifications for UPSC, SSC, Banking, Railway, Teaching, Police & apply for free',
    keywords: [
      'government jobs',
      'sarkari naukri',
      'job notification',
      'job alert',
    ],
    ogType: 'website' as const,
  },

  article: {
    title: 'ISHU Article',
    description: 'Read latest articles and guides',
    ogType: 'article' as const,
    robots: 'index, follow',
  },
};

// Export main generator
export const metaTagsGenerator = new MetaTagsGenerator();

console.log('✅ Comprehensive Meta Tags Generator Loaded');
