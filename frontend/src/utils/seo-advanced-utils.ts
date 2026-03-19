/**
 * ADVANCED SEO UTILITIES & HELPERS
 * ═════════════════════════════════════════════════════════════════════════════
 * Comprehensive SEO optimization helpers for meta tags, schema generation,
 * and dynamic content optimization
 * ═════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// META TAG GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export interface MetaTagConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterCreator?: string;
  canonical?: string;
  robots?: string;
  author?: string;
  language?: string;
  alternates?: Array<{ lang: string; url: string }>;
}

export class MetaTagGenerator {
  public static generateMetaTags(config: MetaTagConfig): Record<string, any> {
    return {
      title: config.title || 'ISHU — Indian StudentHub University',
      description: config.description || 'India\'s #1 platform for government exams, PDF tools, and video downloading',
      keywords: config.keywords?.join(', ') || '',
      ogTitle: config.ogTitle || config.title || 'ISHU',
      ogDescription: config.ogDescription || config.description || '',
      ogImage: config.ogImage || 'https://ishu.fun/og-image.png',
      ogType: config.ogType || 'website',
      twitterCard: config.twitterCard || 'summary_large_image',
      twitterCreator: config.twitterCreator || '@ishu_fun',
      canonical: config.canonical || 'https://ishu.fun',
      robots: config.robots || 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
      author: config.author || 'ISHU Development Team',
      language: config.language || 'en-IN, hi-IN'
    };
  }

  public static generateHTMLMetaTags(config: MetaTagConfig): string {
    const tags = this.generateMetaTags(config);
    let html = '';

    // Primary Meta Tags
    html += `<title>${this.escapeHtml(tags.title)}</title>\n`;
    html += `<meta name="description" content="${this.escapeHtml(tags.description)}" />\n`;
    html += `<meta name="keywords" content="${this.escapeHtml(tags.keywords)}" />\n`;
    html += `<meta name="author" content="${this.escapeHtml(tags.author)}" />\n`;
    html += `<meta name="robots" content="${tags.robots}" />\n`;
    html += `<link rel="canonical" href="${tags.canonical}" />\n`;

    // Open Graph
    html += `<meta property="og:title" content="${this.escapeHtml(tags.ogTitle)}" />\n`;
    html += `<meta property="og:description" content="${this.escapeHtml(tags.ogDescription)}" />\n`;
    html += `<meta property="og:image" content="${tags.ogImage}" />\n`;
    html += `<meta property="og:type" content="${tags.ogType}" />\n`;
    html += `<meta property="og:url" content="${tags.canonical}" />\n`;

    // Twitter Card
    html += `<meta name="twitter:card" content="${tags.twitterCard}" />\n`;
    html += `<meta name="twitter:creator" content="${tags.twitterCreator}" />\n`;
    html += `<meta name="twitter:title" content="${this.escapeHtml(tags.ogTitle)}" />\n`;
    html += `<meta name="twitter:description" content="${this.escapeHtml(tags.ogDescription)}" />\n`;
    html += `<meta name="twitter:image" content="${tags.ogImage}" />\n`;

    // Alternates (Hreflang)
    if (config.alternates && config.alternates.length > 0) {
      config.alternates.forEach(alt => {
        html += `<link rel="alternate" hreflang="${alt.lang}" href="${alt.url}" />\n`;
      });
    }

    return html;
  }

  private static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA.ORG JSON-LD GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export class SchemaGenerator {
  public static generateOrganizationSchema(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ISHU — Indian StudentHub University',
      alternateName: ['ISHU', 'ishu.fun'],
      url: 'https://ishu.fun',
      logo: 'https://ishu.fun/favicon.ico',
      description: 'India\'s #1 platform for government exam results, sarkari naukri, free PDF tools, video downloaders, and live TV streaming',
      sameAs: [
        'https://facebook.com/ishu.fun',
        'https://twitter.com/ishu_fun',
        'https://youtube.com/ishu',
        'https://instagram.com/ishu_fun'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-8986985813',
        contactType: 'customer service',
        email: 'ishukryk@gmail.com'
      }
    };
  }

  public static generateArticleSchema(article: {
    headline: string;
    description: string;
    image?: string;
    author?: string;
    datePublished?: Date;
    dateModified?: Date;
    content?: string;
  }): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.headline,
      description: article.description,
      image: article.image || 'https://ishu.fun/og-image.png',
      author: {
        '@type': 'Person',
        name: article.author || 'ISHU Team'
      },
      datePublished: article.datePublished?.toISOString() || new Date().toISOString(),
      dateModified: article.dateModified?.toISOString() || new Date().toISOString(),
      articleBody: article.content || article.description,
      publication: {
        '@type': 'Organization',
        name: 'ISHU'
      }
    };
  }

  public static generateFAQSchema(faqs: Array<{ question: string; answer: string }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  public static generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    };
  }

  public static generateProductSchema(product: {
    name: string;
    description: string;
    image?: string;
    price?: number;
    currency?: string;
    rating?: number;
    reviewCount?: number;
  }): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image || 'https://ishu.fun/og-image.png',
      offers: {
        '@type': 'Offer',
        price: product.price || 0,
        priceCurrency: product.currency || 'INR',
        availability: 'https://schema.org/InStock'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating || 4.8,
        reviewCount: product.reviewCount || 12400
      }
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT OPTIMIZATION HELPER
// ─────────────────────────────────────────────────────────────────────────────

export class ContentOptimizer {
  /**
   * Calculate SEO score for content (0-100)
   */
  public static calculateSEOScore(content: {
    title: string;
    description: string;
    content: string;
    keywords: string[];
    titleLength?: number;
    descriptionLength?: number;
  }): number {
    let score = 0;

    // Title optimization (0-20 points)
    if (content.title && content.title.length > 0) {
      score += 5;
      if (content.title.length >= 30 && content.title.length <= 60) score += 15;
      else if (content.title.length >= 20 && content.title.length <= 70) score += 10;
    }

    // Description optimization (0-20 points)
    if (content.description && content.description.length > 0) {
      score += 5;
      if (content.description.length >= 120 && content.description.length <= 160) score += 15;
      else if (content.description.length >= 100 && content.description.length <= 180) score += 10;
    }

    // Content optimization (0-30 points)
    if (content.content && content.content.length > 300) score += 15;
    if (content.content && content.content.length > 1000) score += 15;

    // Keyword optimization (0-30 points)
    if (content.keywords && content.keywords.length > 0) {
      score += 10;
      if (content.keywords.length >= 5 && content.keywords.length <= 15) score += 10;
      if (content.keywords.length >= 3) score += 10;
    }

    return Math.min(score, 100);
  }

  /**
   * Get content optimization suggestions
   */
  public static getOptimizationSuggestions(content: {
    title?: string;
    description?: string;
    content?: string;
    keywords?: string[];
  }): string[] {
    const suggestions: string[] = [];

    if (!content.title || content.title.length === 0) {
      suggestions.push('Add a page title (50-60 characters recommended)');
    } else if (content.title.length < 30) {
      suggestions.push('Title is too short. Aim for 50-60 characters');
    } else if (content.title.length > 70) {
      suggestions.push('Title is too long. Keep it under 70 characters');
    }

    if (!content.description || content.description.length === 0) {
      suggestions.push('Add a meta description (120-160 characters recommended)');
    } else if (content.description.length < 100) {
      suggestions.push('Meta description is too short. Aim for 120-160 characters');
    } else if (content.description.length > 180) {
      suggestions.push('Meta description is too long. Keep it under 180 characters');
    }

    if (!content.content || content.content.length < 300) {
      suggestions.push('Add more content. Aim for at least 300+ words');
    }

    if (!content.keywords || content.keywords.length === 0) {
      suggestions.push('Add relevant keywords (5-15 recommended)');
    } else if (content.keywords.length < 5) {
      suggestions.push('Add more keywords for better coverage');
    }

    return suggestions;
  }

  /**
   * Extract keywords from text
   */
  public static extractKeywordsFromText(text: string, limit: number = 10): string[] {
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter((word: string) => word.length > 4);

    const frequency: Record<string, number> = {};
    words.forEach((word: string) => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([keyword]) => keyword);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ROBOTS.TXT GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export class RobotsGenerator {
  public static generateRobotsTxt(): string {
    return `# ISHU ROBOTS.TXT
# ═════════════════════════════════════════════════════════════════

# Allow all search engines
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/
Disallow: /temp/
Disallow: /cache/
Disallow: /api/internal/
Disallow: /.well-known/
Disallow: /api/auth/
Disallow: /settings/
Disallow: /dashboard/admin/

# Crawl delay (ms)
Crawl-delay: 1

# Request rate (requests per 10 seconds)
Request-rate: 10/10s

# ─────────────────────────────────────────────────────────
# Google Bot
# ─────────────────────────────────────────────────────────
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/
Crawl-delay: 0

# ─────────────────────────────────────────────────────────
# Bing Bot
# ─────────────────────────────────────────────────────────
User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /api/
Crawl-delay: 0.5

# ─────────────────────────────────────────────────────────
# Yandex Bot
# ─────────────────────────────────────────────────────────
User-agent: YandexBot
Allow: /
Disallow: /admin/
Disallow: /api/
Crawl-delay: 1

# ─────────────────────────────────────────────────────────
# Additional Rules
# ─────────────────────────────────────────────────────────
User-agent: MJ12bot
Allow: /
Crawl-delay: 2

User-agent: AhrefsBot
Allow: /
Crawl-delay: 1

User-agent: SemrushBot
Allow: /
Crawl-delay: 1

User-agent: DotBot
Allow: /
Crawl-delay: 1

# ─────────────────────────────────────────────────────────
# Sitemaps
# ─────────────────────────────────────────────────────────
Sitemap: https://ishu.fun/sitemap.xml
Sitemap: https://ishu.fun/sitemap-index.xml
Sitemap: https://ishu.fun/sitemap-html.html

# ─────────────────────────────────────────────────────────
# Block bad bots
# ─────────────────────────────────────────────────────────
User-agent: AltaVista
User-agent: Inktomi
User-agent: Teoma
User-agent: Gnutella
User-agent: WebCrawler
User-agent: Lycos
User-agent: WebAlta
User-agent: TurnitinBot
User-agent: SitemapGenerator
Disallow: /
`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PERFORMANCE METRICS HELPER
// ─────────────────────────────────────────────────────────────────────────────

export class SEOPerformanceTracker {
  public static trackPageView(page: string): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: page,
        page_title: document.title
      });
    }
  }

  public static getWebVitals(): Record<string, any> {
    if (typeof window === 'undefined') return {};

    return {
      // Core Web Vitals
      LCP: (window as any).performance?.measure?.('Largest Contentful Paint') || null,
      FID: (window as any).performance?.measure?.('First Input Delay') || null,
      CLS: (window as any).performance?.measure?.('Cumulative Layout Shift') || null,

      // Additional metrics
      TTFB: (window as any).performance?.timing?.responseStart - (window as any).performance?.timing?.navigationStart || null,
      FCP: (window as any).performance?.measure?.('First Contentful Paint') || null,
      DOMContentLoaded: (window as any).performance?.timing?.domContentLoadedEventEnd - (window as any).performance?.timing?.navigationStart || null,
      LoadComplete: (window as any).performance?.timing?.loadEventEnd - (window as any).performance?.timing?.navigationStart || null
    };
  }
}

// Export all utilities
export default {
  MetaTagGenerator,
  SchemaGenerator,
  ContentOptimizer,
  RobotsGenerator,
  SEOPerformanceTracker
};
