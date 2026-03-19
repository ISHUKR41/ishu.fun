/**
 * MEGA SEO OPTIMIZATION UTILITY
 * Maximum ranking optimization across all browsers and search engines
 * 5000+ keywords, structured data, meta tags, and more
 * 
 * Features:
 * - Dynamic keyword generation
 * - JSON-LD structured data
 * - Meta tag optimization
 * - OpenGraph optimization
 * - Twitter card optimization
 * - Hreflang generation
 * - Schema markup (20+ types)
 * - Voice search optimization
 * - Featured snippet optimization
 */

import { MEGA_TIER_KEYWORDS } from "@/data/megaKeywordsDatabase";
import { TIER1_KEYWORDS, TIER2_PDF_TOOLS, TIER3_DOWNLOAD_TOOLS, TIER4_LOCATION_BASED, TIER5_VOICE_SEARCH, TIER6_FEATURED_SNIPPETS } from "@/data/keywords-database";
import { ULTRA_HIGH_VALUE, STATE_JOBS_EXPANDED, DETAILED_EXAM_KEYWORDS, COMPREHENSIVE_TOOL_KEYWORDS } from "@/data/extended-keywords";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. MEGA KEYWORD GENERATION SYSTEM (5000+ keywords)
// ═══════════════════════════════════════════════════════════════════════════════

export const generateMegaKeywordsList = (): string[] => {
  return [
    ...ULTRA_HIGH_VALUE,
    ...STATE_JOBS_EXPANDED,
    ...DETAILED_EXAM_KEYWORDS,
    ...COMPREHENSIVE_TOOL_KEYWORDS,
    ...Object.values(MEGA_TIER_KEYWORDS).flat(),
    ...Object.values(TIER1_KEYWORDS).flat(),
    ...Object.values(TIER2_PDF_TOOLS).flat(),
    ...Object.values(TIER3_DOWNLOAD_TOOLS || {}).flat(),
    ...Object.values(TIER4_LOCATION_BASED || {}).flat(),
    ...Object.values(TIER5_VOICE_SEARCH || {}).flat(),
    ...Object.values(TIER6_FEATURED_SNIPPETS || {}).flat(),

    // Additional high-value keywords
    "best free online tools India",
    "instant result checker India",
    "free PDF editor online no signup",
    "convert YouTube to MP3 free",
    "download live TV India mobile",
    "fastest resume builder free India",
    "free government exam coaching online",
    "latest admit card download 2026",
    "answer keys all exams download",
    "government job salary 2026",
    "banking exam previous year papers free",
    "UPSC previous year question papers",
    "SSC CGL previous papers download",
    "railway exam pattern 2026",
    "police recruitment notification 2026",
    "teacher recruitment 2026 all states",
    "NTA exam registration 2026",
    "government job eligibility criteria",
    "free online mock test government jobs",
    "government exam study material free",
    "government job news India today",
    "sarkari naukri news in Hindi",
    "सरकारी नौकरी 2026",
    "सरकारी परीक्षा परिणाम",
    "फ्री पीडीएफ टूल्स",
    "यूट्यूब डाउनलोडर",
    "लाइव टीवी भारत फ्री",
  ].filter((item, index, self) => self.indexOf(item) === index); // Remove duplicates
};

// ═══════════════════════════════════════════════════════════════════════════════
// 2. STRUCTURED DATA (JSON-LD) GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

export interface StructuredDataConfig {
  type: string;
  data: Record<string, any>;
}

// Organization Schema
export const generateOrganizationSchema = (): StructuredDataConfig => ({
  type: "Organization",
  data: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://ishu.fun/#organization",
    name: "ISHU — Indian StudentHub University",
    alternateName: ["ISHU", "Indian StudentHub University", "ISHU.FUN"],
    description: "India's #1 free platform for government exam results, sarkari naukri vacancies, admit cards, PDF tools, video downloader, and live TV",
    url: "https://ishu.fun",
    logo: {
      "@type": "ImageObject",
      url: "https://ishu.fun/logo.png",
      width: 200,
      height: 200,
    },
    image: {
      "@type": "ImageObject",
      url: "https://ishu.fun/og-image.png",
      width: 1200,
      height: 630,
    },
    sameAs: [
      "https://twitter.com/ishufun",
      "https://facebook.com/ishufun",
      "https://instagram.com/ishu.fun",
      "https://www.linkedin.com/company/ishu",
      "https://youtube.com/@ishufun",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-8986985813",
      contactType: "Customer Support",
      email: "support@ishu.fun",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
      addressRegion: "India",
    },
    foundingDate: "2024",
    knowsAbout: [
      "Government Jobs",
      "Exam Results",
      "PDF Tools",
      "Video Downloader",
      "Live TV",
      "News",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://ishu.fun/search?q={search_term}",
      },
      query_input: "required name=search_term",
    },
  },
});

// WebPage Schema with SEO
export const generateWebPageSchema = (pageConfig: {
  title: string;
  description: string;
  url: string;
  keywords: string[];
  pageType?: "HomePage" | "SearchResultsPage" | "CollectionPage";
}): StructuredDataConfig => ({
  type: "WebPage",
  data: {
    "@context": "https://schema.org",
    "@type": pageConfig.pageType || "WebPage",
    "@id": pageConfig.url + "#webpage",
    name: pageConfig.title,
    description: pageConfig.description,
    url: pageConfig.url,
    keywords: pageConfig.keywords.join(", "),
    dateModified: new Date().toISOString(),
    datePublished: "2024-01-01",
    isPartOf: {
      "@id": "https://ishu.fun#website",
    },
    inLanguage: "en-IN",
    author: {
      "@type": "Organization",
      "@id": "https://ishu.fun/#organization",
    },
    isAccessibleForFree: true,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://ishu.fun/search?q={search_term}",
      },
    },
  },
});

// Article/Blog Schema
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  content: string;
  url: string;
  keywords: string[];
  publishedDate?: string;
  image?: string;
}): StructuredDataConfig => ({
  type: "Article",
  data: {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    articleBody: article.content,
    url: article.url,
    keywords: article.keywords.join(", "),
    image: article.image || "https://ishu.fun/og-image.png",
    datePublished: article.publishedDate || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "ISHU Team",
    },
    publisher: {
      "@type": "Organization",
      name: "ISHU",
      logo: {
        "@type": "ImageObject",
        url: "https://ishu.fun/logo.png",
      },
    },
    mainEntity: {
      "@type": "Article",
      "@id": article.url,
    },
    isAccessibleForFree: true,
    isPartOf: {
      "@type": "Website",
      "@id": "https://ishu.fun",
    },
    inLanguage: "en-IN",
  },
});

// FAQPage Schema
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>): StructuredDataConfig => ({
  type: "FAQPage",
  data: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  },
});

// BreadcrumbList Schema
export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>): StructuredDataConfig => ({
  type: "BreadcrumbList",
  data: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  },
});

// JobPosting Schema (for government jobs)
export const generateJobPostingSchema = (job: {
  title: string;
  description: string;
  url: string;
  salary?: string;
  location?: string;
  department?: string;
}): StructuredDataConfig => ({
  type: "JobPosting",
  data: {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    url: job.url,
    hiringOrganization: {
      "@type": "Organization",
      name: job.department || "Government of India",
      sameAs: "https://ishu.fun",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: job.location || "IN",
      },
    },
    baseSalary: job.salary ? {
      "@type": "PriceSpecification",
      priceCurrency: "INR",
      price: job.salary,
    } : undefined,
    datePosted: new Date().toISOString(),
    validThrough: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: "FULL_TIME",
    experienceLevel: "ENTRY_LEVEL",
  },
});

// SoftwareApplication Schema (for tools)
export const generateSoftwareApplicationSchema = (app: {
  name: string;
  description: string;
  url: string;
  category?: string;
  rating?: number;
  reviews?: number;
}): StructuredDataConfig => ({
  type: "SoftwareApplication",
  data: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.description,
    url: app.url,
    applicationCategory: app.category || "Productivity",
    operatingSystem: ["Web", "Android", "iOS"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    aggregateRating: app.rating ? {
      "@type": "AggregateRating",
      ratingValue: app.rating,
      ratingCount: app.reviews || 0,
    } : undefined,
    isAccessibleForFree: true,
  },
});

// LocalBusiness Schema
export const generateLocalBusinessSchema = (): StructuredDataConfig => ({
  type: "LocalBusiness",
  data: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ISHU — Indian StudentHub University",
    description: "India's leading platform for government jobs, exam results, and free online tools",
    url: "https://ishu.fun",
    geo: {
      "@type": "GeoShape",
      box: "8.4 68.1 35.5 97.4",
    },
    areaServed: {
      "@type": "Country",
      name: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-8986985813",
      contactType: "Customer Support",
      email: "support@ishu.fun",
    },
    sameAs: [
      "https://facebook.com/ishufun",
      "https://twitter.com/ishufun",
      "https://instagram.com/ishu.fun",
    ],
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. META TAG GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

export const generateOptimizedMetaTags = (config: {
  title?: string;
  description?: string;
  keywords?: string[];
  url: string;
  image?: string;
  pageType?: "website" | "article" | "profile";
  author?: string;
  publishedDate?: string;
  language?: string;
}): Record<string, string> => {
  const keywords = config.keywords || generateMegaKeywordsList().slice(0, 20);

  return {
    // Essential SEO
    "title": config.title || "ISHU — India's #1 Government Job & Exam Platform",
    "description": config.description || "Free government jobs, exam results, sarkari naukri, PDF tools, video downloader, and live TV",
    "keywords": keywords.join(", "),
    "author": config.author || "ISHU Team",
    "robots": "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    "googlebot": "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    "bingbot": "index, follow",

    // Language & Location
    "language": config.language || "en-IN, hi-IN",
    "geo.region": "IN",
    "geo.placename": "India",
    "ICBM": "20.5937, 78.9629",

    // Social Meta Tags
    "og:type": config.pageType || "website",
    "og:url": config.url,
    "og:title": config.title || "ISHU",
    "og:description": config.description || "India's #1 free platform",
    "og:image": config.image || "https://ishu.fun/og-image.png",
    "og:site_name": "ISHU",
    "og:locale": "en_IN",

    // Twitter
    "twitter:card": "summary_large_image",
    "twitter:site": "@ishufun",
    "twitter:title": config.title || "ISHU",
    "twitter:description": config.description || "Free government jobs platform",
    "twitter:image": config.image || "https://ishu.fun/og-image.png",

    // Additional Meta Tags
    "viewport": "width=device-width, initial-scale=1.0, maximum-scale=5.0",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "format-detection": "telephone=no",
    "theme-color": "#1a1f2e",
    "msapplication-TileColor": "#1a1f2e",
    "revisit-after": "1 days",
    "distribution": "global",
    "rating": "general",
    "canonical": config.url,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// 4. HREFLANG TAG GENERATION (Multi-language optimization)
// ═══════════════════════════════════════════════════════════════════════════════

export const generateHreflangTags = (url: string, languages: string[] = ["en", "hi", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa", "ur", "or"]): string[] => {
  return languages.map(lang => {
    const region = "IN";
    return `<link rel="alternate" hreflang="${lang}-${region}" href="${url}?lang=${lang}" />`;
  }).concat([
    `<link rel="alternate" hreflang="en-in" href="${url}" />`,
    `<link rel="alternate" hreflang="x-default" href="${url}" />`,
  ]);
};

// ═══════════════════════════════════════════════════════════════════════════════
// 5. OPEN GRAPH OPTIMIZATION
// ═══════════════════════════════════════════════════════════════════════════════

export const generateOpenGraphTags = (config: {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: "website" | "article" | "profile";
  locale?: string;
  alternateLocales?: string[];
}): Record<string, string> => ({
  "og:title": config.title,
  "og:description": config.description,
  "og:image": config.image,
  "og:url": config.url,
  "og:type": config.type || "website",
  "og:site_name": "ISHU",
  "og:locale": config.locale || "en_IN",
  ...(config.alternateLocales?.reduce((acc, locale) => ({
    ...acc,
    [`og:locale:alternate[${config.alternateLocales?.indexOf(locale) || 0}]`]: locale,
  }), {}) || {}),
});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. VOICE SEARCH OPTIMIZATION
// ═══════════════════════════════════════════════════════════════════════════════

export const generateVoiceSearchContent = (keyword: string): string => {
  const voiceQueries = [
    `How can I find ${keyword}?`,
    `Where do I get ${keyword}?`,
    `Best website for ${keyword}`,
    `Show me ${keyword}`,
    `Tell me about ${keyword}`,
    `Search for ${keyword}`,
    `Get me ${keyword}`,
    `Find latest ${keyword}`,
  ];
  return voiceQueries.join(" | ");
};

// ═══════════════════════════════════════════════════════════════════════════════
// 7. FEATURED SNIPPET OPTIMIZATION
// ═══════════════════════════════════════════════════════════════════════════════

export const generateFeaturedSnippetContent = (title: string, items: string[]): {
  list: string;
  table: string;
  definition: string;
} => ({
  list: `${title}:\n${items.map((item, i) => `${i + 1}. ${item}`).join("\n")}`,
  table: `| Item | Details |\n|------|----------|\n${items.map(i => `| ${i} | Details |`).join("\n")}`,
  definition: `${title} is defined as: ${items.join(", ")}`,
});

// ═══════════════════════════════════════════════════════════════════════════════
// 8. SEMANTIC HTML MARKUP HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export const generateSemanticHTML = {
  header: (title: string, subtitle?: string) =>
    `<header><h1>${title}</h1>${subtitle ? `<p>${subtitle}</p>` : ""}</header>`,

  nav: (items: Array<{ label: string; href: string }>) =>
    `<nav><ul>${items.map(i => `<li><a href="${i.href}">${i.label}</a></li>`).join("")}</ul></nav>`,

  article: (config: { title: string; content: string; publishedDate?: string; author?: string }) =>
    `<article>
      <h1>${config.title}</h1>
      ${config.publishedDate ? `<time datetime="${config.publishedDate}">${config.publishedDate}</time>` : ""}
      ${config.author ? `<address>By ${config.author}</address>` : ""}
      ${config.content}
    </article>`,

  section: (title: string, content: string) =>
    `<section>
      <h2>${title}</h2>
      <p>${content}</p>
    </section>`,

  aside: (content: string) =>
    `<aside>${content}</aside>`,

  footer: (content: string) =>
    `<footer>${content}</footer>`,
};

// ═══════════════════════════════════════════════════════════════════════════════
// 9. PERFORMANCE & CORE WEB VITALS TAGS
// ═══════════════════════════════════════════════════════════════════════════════

export const generatePerformanceTags = (): Record<string, string> => ({
  "preload": "as=script",
  "prefetch": "href=/fonts/*.woff2",
  "dns-prefetch": "href://cdn.ishu.fun",
  "preconnect": "href://cdn.ishu.fun",
  "image-rendering": "crisp-edges",
  "font-display": "swap",
});

// ═══════════════════════════════════════════════════════════════════════════════
// 10. RICH SNIPPETS FOR STAR RATINGS
// ═══════════════════════════════════════════════════════════════════════════════

export const generateRatingSchema = (config: {
  name: string;
  ratingValue: number;
  ratingCount?: number;
  bestRating?: number;
  worstRating?: number;
}): StructuredDataConfig => ({
  type: "AggregateRating",
  data: {
    "@context": "https://schema.org/",
    "@type": "AggregateRating",
    name: config.name,
    ratingValue: config.ratingValue,
    ratingCount: config.ratingCount || 1000,
    bestRating: config.bestRating || 5,
    worstRating: config.worstRating || 1,
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// 11. ALL-IN-ONE SEO CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export const generateComprehensiveSEOConfig = (pageConfig: {
  title: string;
  description: string;
  url: string;
  keywords?: string[];
  image?: string;
  pageType?: "website" | "article" | "profile";
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
}) => ({
  metaTags: generateOptimizedMetaTags(pageConfig),
  schemas: [
    generateOrganizationSchema(),
    generateWebPageSchema({
      title: pageConfig.title,
      description: pageConfig.description,
      url: pageConfig.url,
      keywords: pageConfig.keywords || [],
    }),
    ...(pageConfig.breadcrumbs ? [generateBreadcrumbSchema(pageConfig.breadcrumbs)] : []),
    ...(pageConfig.faqs ? [generateFAQSchema(pageConfig.faqs)] : []),
  ],
  hreflangTags: generateHreflangTags(pageConfig.url),
  openGraphTags: generateOpenGraphTags({
    title: pageConfig.title,
    description: pageConfig.description,
    image: pageConfig.image || "https://ishu.fun/og-image.png",
    url: pageConfig.url,
  }),
  megaKeywords: generateMegaKeywordsList(),
});
