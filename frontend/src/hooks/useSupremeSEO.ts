/**
 * SUPREME SEO HOOK v4.0
 * 
 * Complete React Hook for MAXIMUM global SEO optimization
 * - 20,000+ keywords database
 * - Advanced schema markup generation
 * - Multi-browser optimization
 * - All search engine compatibility
 * - Voice search optimization
 * - Dynamic meta tags
 * - Performance monitoring
 */

import { useEffect, useMemo, useCallback } from 'react';
import { SUPREME_KEYWORDS_DATABASE, ALL_SUPREME_KEYWORDS } from '@/data/supremeKeywordsDatabase';
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateArticleSchema,
  generateVideoSchema,
  generateLocalBusinessSchema,
  generateDynamicMetaTags,
  getBrowserSpecificMetaTags,
  generateAdvancedHreflangs,
  monitorSEOPerformance,
  getCanonicalUrl,
  generateImageSchema,
  analyzeKeywordDensity,
} from '@/utils/supremeSEO';

export interface SupremeSEOConfig {
  pageType: 'homepage' | 'jobs' | 'results' | 'tools' | 'tv' | 'news' | 'blog' | 'article' | 'job_listing' | 'video';
  title: string;
  description: string;
  keywords?: string[];
  url?: string;
  image?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  structuredData?: Record<string, any>;
  hreflangs?: string[];
  canonical?: string;
  enableBreadcrumbs?: boolean;
  enableFAQ?: boolean;
  enableVideoSchema?: boolean;
  enablePerformanceMonitoring?: boolean;
  autoKeywordExpansion?: boolean;
}

/**
 * Supreme SEO Hook - Integrates all SEO optimizations
 * 
 * Usage:
 * const seo = useSupremeSEO({
 *   pageType: 'jobs',
 *   title: 'Government Jobs 2026 - UPSC, SSC, Banking',
 *   description: 'Latest government job notifications for UPSC, SSC, Banking...',
 *   keywords: ['government jobs', 'sarkari naukri'],
 * });
 * 
 * Use in JSX:
 * <Helmet>
 *   {seo.metaTags?.map((tag, i) => <meta key={i} {...tag} />)}
 *   {seo.schemas?.map((schema, i) => (
 *     <script key={i} type="application/ld+json">
 *       {JSON.stringify(schema)}
 *     </script>
 *   ))}
 * </Helmet>
 */
export const useSupremeSEO = (config: SupremeSEOConfig) => {
  const {
    pageType,
    title,
    description,
    keywords = [],
    url = 'https://ishu.fun',
    image = 'https://ishu.fun/og-image.png',
    breadcrumbs = [],
    author = 'ISHU',
    publishedDate,
    modifiedDate,
    structuredData,
    hreflangs = [],
    canonical = url,
    enableBreadcrumbs = true,
    enableFAQ = false,
    enableVideoSchema = false,
    enablePerformanceMonitoring = true,
    autoKeywordExpansion = true,
  } = config;

  // ═══════════════════════════════════════════════════════════════════════════════════
  // KEYWORD EXPANSION
  // ═══════════════════════════════════════════════════════════════════════════════════
  
  const expandedKeywords = useMemo(() => {
    if (!autoKeywordExpansion || keywords.length === 0) {
      return keywords;
    }

    const expanded = new Set<string>();
    keywords.forEach(kw => {
      expanded.add(kw);
      
      // Add related keywords from database by category
      Object.values(SUPREME_KEYWORDS_DATABASE).forEach(categoryKeywords => {
        if (Array.isArray(categoryKeywords)) {
          categoryKeywords
            .filter(k => k.toLowerCase().includes(kw.toLowerCase()))
            .slice(0, 5)
            .forEach(k => expanded.add(k));
        }
      });
    });

    return Array.from(expanded);
  }, [keywords, autoKeywordExpansion]);

  // ═══════════════════════════════════════════════════════════════════════════════════
  // DYNAMIC META TAGS GENERATION
  // ═══════════════════════════════════════════════════════════════════════════════════
  
  const metaTags = useMemo(() => {
    const keywordString = expandedKeywords.join(', ');
    return generateDynamicMetaTags({
      title,
      description,
      keywords: keywordString,
      image,
      url,
      type: pageType === 'homepage' ? 'website' : 'article',
      author,
      publishedDate,
    });
  }, [title, description, expandedKeywords, image, url, author, publishedDate, pageType]);

  // ═══════════════════════════════════════════════════════════════════════════════════
  // SCHEMA MARKUP GENERATION
  // ═══════════════════════════════════════════════════════════════════════════════════
  
  const schemas = useMemo(() => {
    const schemas: Record<string, any>[] = [];

    // Organization schema (always include)
    schemas.push(generateOrganizationSchema());

    // Website schema (always include)
    schemas.push(generateWebsiteSchema());

    // Local Business schema
    schemas.push(generateLocalBusinessSchema());

    // Page-specific schemas
    if (enableBreadcrumbs && breadcrumbs.length > 0) {
      schemas.push(generateBreadcrumbSchema(breadcrumbs));
    }

    if (pageType === 'article' || pageType === 'blog') {
      schemas.push(
        generateArticleSchema({
          headline: title,
          description,
          image,
          datePublished: publishedDate || new Date().toISOString(),
          dateModified: modifiedDate,
          author,
        })
      );
    }

    if (enableVideoSchema && pageType === 'video') {
      schemas.push(
        generateVideoSchema({
          name: title,
          description,
          thumbnailUrl: image,
          uploadDate: publishedDate || new Date().toISOString(),
          duration: 'PT0S',
        })
      );
    }

    if (enableFAQ) {
      schemas.push(
        generateFAQSchema([
          {
            question: `What is the best resource for ${title}?`,
            answer: `ISHU (Indian StudentHub University) provides comprehensive resources for ${description}. Visit ishu.fun for more information.`,
          },
          {
            question: `How often is ${title} updated?`,
            answer: 'Content is updated daily to ensure latest and most accurate information.',
          },
          {
            question: `Is ${title} free to access?`,
            answer: 'Yes! All content on ISHU is completely free with no hidden charges or registration required.',
          },
        ])
      );
    }

    // Custom structured data
    if (structuredData) {
      schemas.push(structuredData);
    }

    return schemas;
  }, [
    title,
    description,
    image,
    breadcrumbs,
    pageType,
    publishedDate,
    modifiedDate,
    author,
    enableBreadcrumbs,
    enableVideoSchema,
    enableFAQ,
    structuredData,
  ]);

  // ═══════════════════════════════════════════════════════════════════════════════════
  // HREFLANGS GENERATION
  // ═══════════════════════════════════════════════════════════════════════════════════
  
  const hrefLangs = useMemo(() => {
    if (hreflangs.length > 0) return hreflangs;
    
    const languages = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur'];
    return languages.map(lang => ({
      rel: 'alternate',
      hreflang: `${lang}-IN`,
      href: `${url}?lang=${lang}`,
    }));
  }, [hreflangs, url]);

  // ═══════════════════════════════════════════════════════════════════════════════════
  // KEY SEO METRICS
  // ═══════════════════════════════════════════════════════════════════════════════════
  
  const seoMetrics = useMemo(
    () => ({
      titleLength: title.length,
      descriptionLength: description.length,
      keywordCount: expandedKeywords.length,
      keywordDensity: expandedKeywords.length > 0 
        ? analyzeKeywordDensity(title + ' ' + description, expandedKeywords[0]) 
        : 0,
      hasCanonical: !!canonical,
      hasMetaTags: metaTags.length > 0,
      hasSchemas: schemas.length > 0,
      hasHreflangs: hrefLangs.length > 0,
      urlOptimized: url.includes(pageType),
    }),
    [title, description, expandedKeywords, canonical, metaTags, schemas, hrefLangs, pageType, url]
  );

  // ═══════════════════════════════════════════════════════════════════════════════════
  // PERFORMANCE MONITORING
  // ═══════════════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (enablePerformanceMonitoring) {
      monitorSEOPerformance();
    }
  }, [enablePerformanceMonitoring]);

  // ═══════════════════════════════════════════════════════════════════════════════════
  // UPDATE DOCUMENT TITLE
  // ═══════════════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = title;
    }
  }, [title]);

  // ═══════════════════════════════════════════════════════════════════════════════════
  // RECOMMENDATIONS
  // ═══════════════════════════════════════════════════════════════════════════════════
  
  const recommendations = useMemo(() => {
    const recs: string[] = [];

    if (title.length < 30) recs.push('Title is too short (< 30 chars). Aim for 30-60 chars.');
    if (title.length > 60) recs.push('Title is too long (> 60 chars). Keep it under 60 chars.');
    if (description.length < 120) recs.push('Description is too short (< 120 chars). Aim for 120-160 chars.');
    if (description.length > 160) recs.push('Description is too long (> 160 chars). Keep it under 160 chars.');
    if (expandedKeywords.length < 3) recs.push('Add more keywords. Aim for at least 3-5 keywords.');
    if (!canonical) recs.push('Add a canonical URL to prevent duplicate content issues.');
    if (breadcrumbs.length === 0 && enableBreadcrumbs) recs.push('Add breadcrumbs for better navigation and SEO.');
    if (!publishedDate) recs.push('Add publication date for news and articles.');
    if (pageType === 'article' && !author) recs.push('Specify the author for better authorship credit.');
    if (seoMetrics.keywordDensity < 0.5 || seoMetrics.keywordDensity > 2.5) {
      recs.push('Keyword density is not optimal. Aim for 0.5-2.5%.');
    }

    return recs;
  }, [title, description, expandedKeywords, canonical, breadcrumbs, enableBreadcrumbs, publishedDate, author, pageType, seoMetrics.keywordDensity]);

  return {
    // Core SEO data
    title,
    description,
    keywords: expandedKeywords,
    canonical,
    
    // Generated content
    metaTags,
    schemas,
    hrefLangs,
    
    // Metrics
    seoMetrics,
    recommendations,
    
    // URLs
    canonicalUrl: getCanonicalUrl(canonical),
  };
};

export default useSupremeSEO;
