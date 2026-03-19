/**
 * DYNAMIC SEO META TAGS COMPONENT
 * ═════════════════════════════════════════════════════════════════════════════
 * React hook for dynamically managing SEO meta tags per page/component
 * Automatically updates document head with optimized meta information
 * ═════════════════════════════════════════════════════════════════════════════
 */

import { useEffect } from 'react';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  author?: string;
  canonical?: string;
  robots?: string;
  language?: string;
  alternates?: Array<{ lang: string; href: string }>;
  jsonLd?: Record<string, any>;
}

const DEFAULT_CONFIG: SEOConfig = {
  title: 'ISHU — India\'s #1 Government Exam Results, PDF Tools & Video Downloader',
  description: 'ISHU (Indian StudentHub University) — Government exam results, sarkari naukri, 100+ free PDF tools, YouTube downloader, 700+ live TV, daily news. No signup!',
  keywords: [
    'government jobs', 'sarkari result', 'government exam', 'UPSC', 'SSC',
    'PDF tools', 'YouTube downloader', 'live TV India', 'free resume maker'
  ],
  ogType: 'website',
  twitterCard: 'summary_large_image',
  author: 'ISHU Development Team',
  canonical: typeof window !== 'undefined' ? window.location.href : 'https://ishu.fun',
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  language: 'en-IN'
};

/**
 * Custom React Hook: useSEO
 * Updates document head with SEO information
 */
export const useSEO = (config: SEOConfig = {}): void => {
  useEffect(() => {
    const merged = { ...DEFAULT_CONFIG, ...config };

    // Update Title
    document.title = merged.title || DEFAULT_CONFIG.title!;

    // Update Meta Tags
    updateOrCreateMetaTag('name', 'description', merged.description!);
    updateOrCreateMetaTag('name', 'keywords', merged.keywords?.join(', ') || '');
    updateOrCreateMetaTag('name', 'author', merged.author!);
    updateOrCreateMetaTag('name', 'robots', merged.robots!);
    updateOrCreateMetaTag('name', 'language', merged.language!);
    updateOrCreateMetaTag('name', 'twitter:card', merged.twitterCard!);
    updateOrCreateMetaTag('name', 'twitter:creator', '@ishu_fun');

    // Open Graph Tags
    updateOrCreateMetaTag('property', 'og:title', merged.ogTitle || merged.title!);
    updateOrCreateMetaTag('property', 'og:description', merged.ogDescription || merged.description!);
    updateOrCreateMetaTag('property', 'og:type', merged.ogType!);
    updateOrCreateMetaTag('property', 'og:url', merged.canonical!);
    updateOrCreateMetaTag('property', 'og:image', merged.ogImage || 'https://ishu.fun/og-image.png');
    updateOrCreateMetaTag('property', 'og:site_name', 'ISHU');

    // Canonical URL
    updateOrCreateLink('canonical', merged.canonical!);

    // Alternate Language Links (Hreflang)
    if (merged.alternates && merged.alternates.length > 0) {
      merged.alternates.forEach(alt => {
        updateOrCreateLink('alternate', alt.href, alt.lang);
      });
    }

    // JSON-LD Structured Data
    if (merged.jsonLd) {
      updateOrCreateJSONLD(merged.jsonLd);
    }

    // Log for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 SEO Meta Tags Updated:', {
        title: merged.title,
        keywords: merged.keywords?.length,
        description: merged.description?.substring(0, 50) + '...'
      });
    }
  }, [config]);
};

/**
 * Update or create meta tag in document head
 */
function updateOrCreateMetaTag(attribute: string, name: string, content: string): void {
  if (!content) return;

  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.content = content;
}

/**
 * Update or create link tag in document head
 */
function updateOrCreateLink(rel: string, href: string, hreflang?: string): void {
  let element = document.querySelector(`link[rel="${rel}"]${hreflang ? `[hreflang="${hreflang}"]` : ''}`) as HTMLLinkElement;

  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    if (hreflang) element.hreflang = hreflang;
    document.head.appendChild(element);
  }

  element.href = href;
}

/**
 * Update or create JSON-LD structured data
 */
function updateOrCreateJSONLD(data: Record<string, any>): void {
  let script = document.querySelector('script[type="application/ld+json"][data-qa="seo-jsonld"]') as HTMLScriptElement;

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-qa', 'seo-jsonld');
    document.head.appendChild(script);
  }

  script.innerHTML = JSON.stringify(data);
}

/**
 * REACT COMPONENT: SEO Meta Tags Provider
 * Wrapper component for easy SEO management
 */
export const SEOMetaTags: React.FC<{ config: SEOConfig }> = ({ config }) => {
  useSEO(config);
  return null; // This component doesn't render anything
};

/**
 * Helper function: Generate SEO config for different page types
 */
export const createSEOConfig = (type: string, data?: Record<string, any>): SEOConfig => {
  const baseConfig = DEFAULT_CONFIG;

  switch (type) {
    // Government Exam Results Page
    case 'exam-results':
      return {
        ...baseConfig,
        title: `${data?.examName || 'Exam'} Results 2025 | Latest Notification | ISHU`,
        description: `Check latest ${data?.examName} exam results, admit cards, answer keys, and notifications on ISHU.fun. Updated daily.`,
        keywords: [
          `${data?.examName} result`,
          `${data?.examName} notification`,
          `${data?.examName} admit card`,
          'exam result 2025',
          'government result'
        ],
        ogTitle: `Check ${data?.examName} Results Here | ISHU`,
        ogDescription: `Latest ${data?.examName} exam results, notification, and materials`
      };

    // PDF Tool Page
    case 'pdf-tool':
      return {
        ...baseConfig,
        title: `${data?.toolName || 'PDF'} Online - Free ${data?.toolName || 'Tool'} | ISHU`,
        description: `Use our free online ${data?.toolName} tool instantly. No signup required. ${data?.toolName} files online with maximum quality.`,
        keywords: [
          `${data?.toolName}`,
          `${data?.toolName} online`,
          `free ${data?.toolName}`,
          `${data?.toolName} online free`
        ],
        ogTitle: `Free ${data?.toolName} Online Tool | ISHU`
      };

    // Video Downloader Page
    case 'video-downloader':
      return {
        ...baseConfig,
        title: `${data?.platform} Video Downloader | Download ${data?.format || 'Videos'} Instantly | ISHU`,
        description: `Download ${data?.platform} videos instantly with ISHU's free ${data?.platform} downloader. ${data?.quality || 'HD'} quality. No watermark. No signup.`,
        keywords: [
          `${data?.platform} downloader`,
          `download ${data?.platform}`,
          `${data?.platform} video downloader`,
          `${data?.platform} saver`
        ]
      };

    // Blog Post
    case 'blog-post':
      return {
        ...baseConfig,
        title: `${data?.title || 'Article'} | ISHU Blog`,
        description: data?.excerpt || baseConfig.description,
        keywords: data?.keywords || baseConfig.keywords,
        ogTitle: data?.title,
        ogDescription: data?.excerpt,
        ogImage: data?.image,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: data?.title,
          description: data?.excerpt,
          image: data?.image,
          author: data?.author || 'ISHU Team',
          datePublished: data?.publishedDate,
          dateModified: data?.modifiedDate
        }
      };

    // Product/Tool Page
    case 'tool-page':
      return {
        ...baseConfig,
        title: `${data?.toolName} | Free Online Tool | ISHU.fun`,
        description: `${data?.description}. Try our free online ${data?.toolName} tool instantly. No registration needed.`,
        keywords: [data?.toolName, ...((data?.categories) || [])],
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data?.toolName,
          description: data?.description,
          brand: 'ISHU',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR'
          }
        }
      };

    // News Page
    case 'news':
      return {
        ...baseConfig,
        title: `${data?.heading} | Latest News | ISHU`,
        description: data?.summary,
        keywords: ['news', 'latest updates', ...(data?.tags || [])],
        ogTitle: data?.heading,
        ogDescription: data?.summary,
        ogImage: data?.image,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: data?.heading,
          description: data?.summary,
          image: data?.image,
          author: data?.author || 'ISHU News',
          datePublished: data?.publishedDate
        }
      };

    default:
      return baseConfig;
  }
};

/**
 * PERFORMANCE MONITORING
 * Track SEO performance metrics
 */
export const trackSEOMetrics = (): Record<string, any> => {
  if (typeof window === 'undefined') return {};

  return {
    pageTitle: document.title,
    metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content'),
    keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content')?.split(',').length || 0,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    jsonLdScripts: document.querySelectorAll('script[type="application/ld+json"]').length,
    headings: {
      h1: document.querySelectorAll('h1').length,
      h2: document.querySelectorAll('h2').length,
      h3: document.querySelectorAll('h3').length
    },
    images: {
      total: document.querySelectorAll('img').length,
      withAlt: document.querySelectorAll('img[alt]').length,
      withoutAlt: document.querySelectorAll('img:not([alt])').length
    },
    internalLinks: document.querySelectorAll('a[href*="ishu.fun"]').length,
    externalLinks: document.querySelectorAll('a[href*="http"]:not([href*="ishu.fun"])').length,
    loadTime: performance?.timing?.loadEventEnd - performance?.timing?.navigationStart || null
  };
};

export default {
  useSEO,
  SEOMetaTags,
  createSEOConfig,
  trackSEOMetrics
};
