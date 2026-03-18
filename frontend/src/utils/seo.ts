/**
 * seo.ts - Comprehensive SEO Utilities
 * 
 * Provides structured data, meta tags, and SEO helpers for all pages
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export const SITE_CONFIG = {
  name: "ISHU",
  fullName: "ISHU - Indian Student Hub",
  url: "https://ishu.fun",
  description: "Complete platform for Indian students - exam prep, live TV, video tools, CV builder, and more. Free tools for UPSC, SSC, Banking, and all competitive exams.",
  author: "ISHU Team",
  social: {
    twitter: "@ishufun",
    facebook: "ishufun",
    instagram: "ishu.fun",
  },
  contact: {
    email: "contact@ishu.fun",
  },
  logo: "https://ishu.fun/logo.png",
  defaultOgImage: "https://ishu.fun/og-image.jpg",
};

export const generateMetaTags = (config: SEOConfig) => {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage = SITE_CONFIG.defaultOgImage,
    ogType = "website",
    twitterCard = "summary_large_image",
    author = SITE_CONFIG.author,
    publishedTime,
    modifiedTime,
    section,
    tags = [],
  } = config;

  const fullTitle = title.includes(SITE_CONFIG.name) ? title : `${title} | ${SITE_CONFIG.name}`;
  const url = canonical || SITE_CONFIG.url;

  return {
    // Basic meta tags
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    author,
    canonical: url,

    // Open Graph
    "og:title": fullTitle,
    "og:description": description,
    "og:url": url,
    "og:type": ogType,
    "og:image": ogImage,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:site_name": SITE_CONFIG.fullName,
    "og:locale": "en_IN",

    // Twitter Card
    "twitter:card": twitterCard,
    "twitter:title": fullTitle,
    "twitter:description": description,
    "twitter:image": ogImage,
    "twitter:site": SITE_CONFIG.social.twitter,
    "twitter:creator": SITE_CONFIG.social.twitter,

    // Article-specific (for blog posts)
    ...(publishedTime && { "article:published_time": publishedTime }),
    ...(modifiedTime && { "article:modified_time": modifiedTime }),
    ...(section && { "article:section": section }),
    ...(tags.length > 0 && { "article:tag": tags.join(", ") }),

    // Additional SEO
    "robots": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    "googlebot": "index, follow",
    "bingbot": "index, follow",
    "theme-color": "#3b82f6",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  };
};

export const generateStructuredData = (type: string, data: any) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
  };

  return JSON.stringify({ ...baseData, ...data });
};

// Structured data generators
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.fullName,
  url: SITE_CONFIG.url,
  logo: SITE_CONFIG.logo,
  description: SITE_CONFIG.description,
  sameAs: [
    `https://twitter.com/${SITE_CONFIG.social.twitter.replace("@", "")}`,
    `https://facebook.com/${SITE_CONFIG.social.facebook}`,
    `https://instagram.com/${SITE_CONFIG.social.instagram}`,
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: SITE_CONFIG.contact.email,
    contactType: "Customer Service",
    areaServed: "IN",
    availableLanguage: ["en", "hi"],
  },
});

export const generateWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_CONFIG.fullName,
  url: SITE_CONFIG.url,
  description: SITE_CONFIG.description,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_CONFIG.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_CONFIG.url}${item.url}`,
  })),
});

export const generateVideoObjectSchema = (video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate?: string;
  duration?: string;
  contentUrl?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: video.name,
  description: video.description,
  thumbnailUrl: video.thumbnailUrl,
  uploadDate: video.uploadDate || new Date().toISOString(),
  duration: video.duration,
  contentUrl: video.contentUrl,
});

export const generateSoftwareApplicationSchema = (app: {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
}) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: app.name,
  description: app.description,
  url: `${SITE_CONFIG.url}${app.url}`,
  applicationCategory: app.applicationCategory,
  operatingSystem: app.operatingSystem || "Web",
  offers: {
    "@type": "Offer",
    price: app.offers?.price || "0",
    priceCurrency: app.offers?.priceCurrency || "INR",
  },
});

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

export const generateHowToSchema = (howTo: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: howTo.name,
  description: howTo.description,
  totalTime: howTo.totalTime,
  step: howTo.steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name,
    text: step.text,
    image: step.image,
  })),
});

// SEO-friendly URL slug generator
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Meta description generator (truncate to 160 chars)
export const truncateDescription = (text: string, maxLength = 160): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + "...";
};

// Keywords extractor from text
export const extractKeywords = (text: string, count = 10): string[] => {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
    "be", "have", "has", "had", "do", "does", "did", "will", "would", "should",
    "could", "may", "might", "must", "can", "this", "that", "these", "those",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
};
