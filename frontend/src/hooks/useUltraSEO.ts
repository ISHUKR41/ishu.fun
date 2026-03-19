/**
 * ULTRA SEO HOOK v2.0
 * 
 * Complete React Hook for maximum SEO implementation
 * - Automatic meta tags
 * - Schema markup generation
 * - Breadcrumbs
 * - FAQs
 * - Performance monitoring
 * - Multi-browser support
 * - Internationalization
 */

import { useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  generateUltraAdvancedSchemas,
  generateUltraPowerfullTitle,
  generateAIPoweredDescription,
  generateSmartBreadcrumbs,
  generateSmartFAQs,
  expandKeywordsDynamically,
  getBrowserSpecificMetaTags,
  monitorCoreWebVitals,
  detectSearchEngineCrawler,
  generateAdvancedHreflangs,
  type UltraAdvancedSEOConfig
} from '@/utils/ultraAdvancedSEO';

export interface UseUltraSEOConfig extends UltraAdvancedSEOConfig {
  enableCoreWebVitals?: boolean;
  enableAnalytics?: boolean;
  enableCrawlerDetection?: boolean;
  autoExpandKeywords?: boolean;
  keywordExpansionCount?: number;
}

export const useUltraSEO = (config: UseUltraSEOConfig) => {
  const {
    pageType,
    title,
    description,
    keywords,
    canonical,
    image,
    breadcrumbs,
    faqs,
    enableCoreWebVitals = true,
    enableAnalytics = true,
    enableCrawlerDetection = true,
    autoExpandKeywords = true,
    keywordExpansionCount = 50,
  } = config;

  // ═══════════════════════════════════════════════════════════════════════════════
  // EXPANDED KEYWORDS
  // ═══════════════════════════════════════════════════════════════════════════════

  const expandedKeywords = useMemo(() => {
    if (!autoExpandKeywords || !keywords || keywords.length === 0) {
      return keywords || [];
    }

    const allKeywords = new Set([...keywords]);
    keywords.forEach((keyword) => {
      const expanded = expandKeywordsDynamically(keyword, keywordExpansionCount);
      expanded.forEach((kw) => allKeywords.add(kw));
    });

    return Array.from(allKeywords);
  }, [keywords, autoExpandKeywords, keywordExpansionCount]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // AUTO-BREADCRUMBS
  // ═══════════════════════════════════════════════════════════════════════════════

  const smartBreadcrumbs = useMemo(() => {
    if (breadcrumbs && breadcrumbs.length > 0) {
      return breadcrumbs;
    }

    // Auto-generate based on page type
    const mainKeyword = keywords?.[0] || title;
    return generateSmartBreadcrumbs(mainKeyword, pageType);
  }, [breadcrumbs, keywords, title, pageType]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // AUTO-FAQS
  // ═══════════════════════════════════════════════════════════════════════════════

  const smartFAQs = useMemo(() => {
    if (faqs && faqs.length > 0) {
      return faqs;
    }

    const mainKeyword = keywords?.[0] || title;
    const typeMap: Record<string, string> = {
      job: 'government_jobs',
      tool: 'pdf_tools',
      article: 'default',
      product: 'default',
      event: 'default',
      video: 'video_downloader',
      news: 'default'
    };

    return generateSmartFAQs(mainKeyword, typeMap[pageType] || 'default');
  }, [faqs, keywords, title, pageType]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // ULTRA ADVANCED SCHEMAS
  // ═══════════════════════════════════════════════════════════════════════════════

  const schemas = useMemo(() => {
    return generateUltraAdvancedSchemas({
      ...config,
      keywords: expandedKeywords,
      breadcrumbs: smartBreadcrumbs,
      faqs: smartFAQs,
    });
  }, [config, expandedKeywords, smartBreadcrumbs, smartFAQs]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // BROWSER-SPECIFIC META TAGS
  // ═══════════════════════════════════════════════════════════════════════════════

  const browserMetaTags = useMemo(() => {
    return getBrowserSpecificMetaTags();
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════════
  // HREFLANG TAGS FOR INTERNATIONALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════

  const hreflangs = useMemo(() => {
    return generateAdvancedHreflangs(title.toLowerCase().replace(/\s+/g, '-'));
  }, [title]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // CORE WEB VITALS MONITORING
  // ═══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!enableCoreWebVitals) return;

    const handleVitals = (vitals: any) => {
      // Log to analytics or monitoring service
      if (enableAnalytics && window.gtag) {
        window.gtag?.('event', 'page_view', {
          lcp: vitals.lcp,
          fid: vitals.fid,
          cls: vitals.cls,
          page_type: pageType,
        });
      }
    };

    try {
      monitorCoreWebVitals(handleVitals);
    } catch (error) {
      console.error('Error monitoring Core Web Vitals:', error);
    }
  }, [enableCoreWebVitals, enableAnalytics, pageType]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // CRAWLER DETECTION
  // ═══════════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (enableCrawlerDetection) {
      const crawler = detectSearchEngineCrawler();
      if (crawler) {
        console.log(`[SEO] ${crawler} crawler detected`);
        // Can be used for analytics or special rendering
      }
    }
  }, [enableCrawlerDetection]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // OPEN GRAPH & TWITTER CARDS
  // ═══════════════════════════════════════════════════════════════════════════════

  const ogTags = useMemo(() => {
    return {
      'og:title': title,
      'og:description': description,
      'og:image': image || '/og-image.png',
      'og:type': 'website',
      'og:url': canonical,
      'og:site_name': 'ISHU - Indian StudentHub University',
      'og:locale': 'en_IN',
      'og:locale:alternate': ['hi_IN', 'ta_IN', 'te_IN', 'bn_IN', 'mr_IN', 'gu_IN', 'kn_IN', 'ml_IN', 'pa_IN'],
    };
  }, [title, description, image, canonical]);

  const twitterCardTags = useMemo(() => {
    return {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image || '/og-image.png',
      'twitter:creator': '@ishufun',
      'twitter:site': '@ishufun',
      'twitter:domain': 'ishu.fun',
    };
  }, [title, description, image]);

  // ═══════════════════════════════════════════════════════════════════════════════
  // RETURN OPTIMIZED CONFIG
  // ═══════════════════════════════════════════════════════════════════════════════

  return useMemo(
    () => ({
      title,
      description,
      keywords: expandedKeywords,
      canonical,
      image,
      breadcrumbs: smartBreadcrumbs,
      faqs: smartFAQs,
      schemas,
      browserMetaTags,
      hreflangs,
      ogTags,
      twitterCardTags,
      // Helper methods
      renderSchemaScript: () => (
        <Helmet>
          {schemas.map((schema, idx) => (
            <script key={idx} type="application/ld+json">
              {JSON.stringify(schema)}
            </script>
          ))}
        </Helmet>
      ),
      renderMetaTags: () => (
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="keywords" content={expandedKeywords.join(', ')} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="canonical" href={canonical} />

          {/* Open Graph */}
          {Object.entries(ogTags).map(([key, value]) =>
            Array.isArray(value) ? (
              value.map((v) => (
                <meta key={`${key}-${v}`} property={key} content={v} />
              ))
            ) : (
              <meta key={key} property={key} content={String(value)} />
            )
          )}

          {/* Twitter Card */}
          {Object.entries(twitterCardTags).map(([key, value]) => (
            <meta key={key} name={key} content={String(value)} />
          ))}

          {/* Hreflangs */}
          {Object.entries(hreflangs).map(([lang, href]) => (
            <link key={lang} rel="alternate" hrefLang={lang} href={href} />
          ))}

          {/* Browser Specific */}
          {Object.entries(browserMetaTags).map(([key, value]) => (
            <meta key={key} name={key} content={value} />
          ))}
        </Helmet>
      )
    }),
    [title, description, expandedKeywords, canonical, image, smartBreadcrumbs, smartFAQs, schemas, browserMetaTags, hreflangs, ogTags, twitterCardTags]
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIALIZED SUB-HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Hook for Job Pages
 */
export const useJobPageSEO = (jobTitle: string, company: string, location: string) => {
  return useUltraSEO({
    pageType: 'job',
    title: generateUltraPowerfullTitle(jobTitle, 'job'),
    description: generateAIPoweredDescription(jobTitle, jobTitle, 'job'),
    keywords: expandKeywordsDynamically(jobTitle, 100),
    canonical: `https://ishu.fun/jobs/${jobTitle.toLowerCase().replace(/\s+/g, '-')}`,
  });
};

/**
 * Hook for Tool Pages
 */
export const useToolPageSEO = (toolName: string, category: string) => {
  return useUltraSEO({
    pageType: 'tool',
    title: generateUltraPowerfullTitle(toolName, 'tool'),
    description: generateAIPoweredDescription(toolName, toolName, 'tool'),
    keywords: expandKeywordsDynamically(toolName, 100),
    canonical: `https://ishu.fun/tools/${category}/${toolName.toLowerCase().replace(/\s+/g, '-')}`,
  });
};

/**
 * Hook for Article Pages
 */
export const useArticlePageSEO = (articleTitle: string, author: string, publishDate: string) => {
  return useUltraSEO({
    pageType: 'article',
    title: generateUltraPowerfullTitle(articleTitle, 'article'),
    description: generateAIPoweredDescription(articleTitle, articleTitle, 'article'),
    keywords: expandKeywordsDynamically(articleTitle, 100),
    canonical: `https://ishu.fun/articles/${articleTitle.toLowerCase().replace(/\s+/g, '-')}`,
    articles: [{
      headline: articleTitle,
      description: generateAIPoweredDescription(articleTitle, articleTitle, 'article'),
      image: '/og-image.png',
      author,
      datePublished: publishDate,
      dateModified: new Date().toISOString(),
    }],
  });
};

/**
 * Hook for News Pages
 */
export const useNewsPageSEO = (newsHeadline: string, category: string) => {
  return useUltraSEO({
    pageType: 'news',
    title: generateUltraPowerfullTitle(newsHeadline, 'news'),
    description: generateAIPoweredDescription(newsHeadline, category, 'news'),
    keywords: expandKeywordsDynamically(newsHeadline, 100),
    canonical: `https://ishu.fun/news/${newsHeadline.toLowerCase().replace(/\s+/g, '-')}`,
  });
};

/**
 * Hook for Home Page
 */
export const useHomePageSEO = () => {
  return useUltraSEO({
    pageType: 'organization',
    title: 'ISHU — India\'s #1 Free Platform for Government Jobs, Sarkari Naukri & 100+ Tools',
    description: 'India\'s #1 free platform for government exam results, sarkari naukri vacancies, admit cards for UPSC, SSC, Banking, Railways, NTA & all 36 states. 100+ free PDF tools, 700+ live Indian TV channels, YouTube video downloader & more.',
    keywords: expandKeywordsDynamically('government jobs India', 200),
    canonical: 'https://ishu.fun',
    breadcrumbs: [{ name: 'Home', url: 'https://ishu.fun', position: 1 }],
  });
};

/**
 * Hook for Search Results Page
 */
export const useSearchPageSEO = (searchQuery: string, resultCount: number) => {
  return useUltraSEO({
    pageType: 'article',
    title: `Search: ${searchQuery} | ISHU`,
    description: `Find ${resultCount} results for "${searchQuery}" on ISHU. Government jobs, exam results, PDF tools, video downloader & more.`,
    keywords: expandKeywordsDynamically(searchQuery, 50),
    canonical: `https://ishu.fun/search?q=${encodeURIComponent(searchQuery)}`,
  });
};

export default useUltraSEO;
