/**
 * useSEO Hook
 * 
 * Easy-to-use hook for integrating comprehensive SEO across all pages
 * Automatically generates optimized titles, descriptions, and schema markup
 */

import { useEffect } from "react";
import {
  seoOptimizer,
  OptimizedSEOData,
  SEOScore,
} from "@/utils/seoOptimizer";
import {
  KEYWORDS_BY_CATEGORY,
  PRIMARY_KEYWORDS_BY_PAGE,
  COMPLETE_KEYWORDS,
} from "@/data/keywords-database";

interface UseSEOOptions {
  title: string;
  description: string;
  keyword?: string;
  category?: string;
  contentType?:
    | "job_listing"
    | "tool"
    | "news"
    | "article"
    | "faq"
    | "homepage"
    | "product"
    | "service";
  url?: string;
  ogImage?: string;
  tags?: string[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  isVoiceSearchOptimized?: boolean;
  isMobileOptimized?: boolean;
}

interface UseSEOReturn {
  optimized: OptimizedSEOData | null;
  keywords: string[];
  score: SEOScore | null;
  voiceSearchKeywords: string[];
  recommendations: string[];
  generateTitle: (keyword: string) => string;
  generateDescription: (keyword: string) => string;
}

/**
 * Custom Hook for SEO Management
 * 
 * Usage:
 * const { optimized, keywords, score } = useSEO({
 *   title: "UPSC Recruitment 2026",
 *   description: "Official UPSC notification and apply now",
 *   keyword: "UPSC jobs",
 *   category: "government_jobs",
 *   contentType: "job_listing"
 * });
 */
export const useSEO = (options: UseSEOOptions): UseSEOReturn => {
  const {
    title,
    description,
    keyword = COMPLETE_KEYWORDS[0],
    category = "government_jobs",
    contentType = "homepage",
    url = "https://ishu.fun",
    ogImage = "https://ishu.fun/og-image.png",
    tags = [],
    author = "ISHU",
    publishedDate,
    modifiedDate,
    isVoiceSearchOptimized = true,
    isMobileOptimized = true,
  } = options;

  // Get keywords for the page
  const keywords = seoOptimizer.generateKeywords(
    keyword,
    category,
    20
  );

  // Generate optimized SEO data
  const optimized = seoOptimizer.generateOptimizedSEOData(
    contentType,
    keyword,
    title,
    description,
    url,
    ogImage
  );

  // Mobile optimization
  const finalOptimized = isMobileOptimized
    ? seoOptimizer.optimizeForMobile(optimized)
    : optimized;

  // Voice search keywords
  const voiceSearchKeywords = isVoiceSearchOptimized
    ? seoOptimizer.getVoiceSearchKeywords(keyword)
    : [];

  // Log SEO data to console in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 SEO Optimization Report", {
        keyword,
        contentType,
        score: finalOptimized.score,
        keywords: finalOptimized.keywords.slice(0, 10),
        title: finalOptimized.title,
        description: finalOptimized.description,
        recommendations: finalOptimized.score.recommendations,
      });
    }
  }, [keyword, contentType]);

  return {
    optimized: finalOptimized,
    keywords: finalOptimized.keywords,
    score: finalOptimized.score,
    voiceSearchKeywords,
    recommendations: finalOptimized.score.recommendations,
    generateTitle: (kw: string) => seoOptimizer.optimizeTitle(title, kw, contentType),
    generateDescription: (kw: string) =>
      seoOptimizer.optimizeDescription(description, kw, contentType),
  };
};

/**
 * Hook for getting keywords by category
 */
export const useKeywordsByCategory = (
  category: keyof typeof KEYWORDS_BY_CATEGORY
): string[] => {
  return KEYWORDS_BY_CATEGORY[category] || COMPLETE_KEYWORDS;
};

/**
 * Hook for getting keywords by page
 */
export const useKeywordsByPage = (
  page: keyof typeof PRIMARY_KEYWORDS_BY_PAGE
): string[] => {
  return PRIMARY_KEYWORDS_BY_PAGE[page] || PRIMARY_KEYWORDS_BY_PAGE.homepage;
};

/**
 * Hook for SEO scoring
 */
export const useSEOScore = (
  title: string,
  description: string,
  keyword: string
): SEOScore => {
  return seoOptimizer.calculateSEOScore(title, description, keyword);
};

/**
 * Hook for generating schema markup
 */
export const useSchemaMarkup = (
  contentType: string,
  data: {
    title: string;
    description: string;
    keyword: string;
    url: string;
    image?: string;
    author?: string;
    datePublished?: string;
    category?: string;
  }
) => {
  return seoOptimizer.generateSchemaMarkup(contentType, data);
};

/**
 * Hook for voice search optimization
 */
export const useVoiceSearchOptimization = (keyword: string): string[] => {
  return seoOptimizer.getVoiceSearchKeywords(keyword);
};

/**
 * Hook for trending keywords
 */
export const useTrendingKeywords = (): string[] => {
  return seoOptimizer.getTrendingKeywords();
};

/**
 * Hook for breadcrumb schema
 */
export const useBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>
) => {
  return seoOptimizer.generateBreadcrumbs(breadcrumbs.map((b) => b.name));
};

export default useSEO;
