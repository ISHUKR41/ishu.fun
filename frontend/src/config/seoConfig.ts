/**
 * GLOBAL SEO CONFIGURATION
 * Central configuration for maximum SEO optimization across ISHU
 * Single source of truth for all SEO settings
 */

export const GlobalSEOConfig = {
  // ═══════════════════════════════════════════════════════════════════════════
  // SITE INFORMATION
  // ═══════════════════════════════════════════════════════════════════════════
  site: {
    name: "ISHU — Indian StudentHub University",
    shortName: "ISHU",
    domain: "https://ishu.fun",
    domain_alternate: ["https://www.ishu.fun", "https://ishufun.com"],
    description: "India's #1 free platform for government exam results, sarkari naukri vacancies, admit cards for UPSC, SSC, Banking, Railways, NTA & all 36 states. 100+ free PDF tools, 700+ live Indian TV channels, YouTube video downloader, Terabox downloader, universal video downloader & 1000+ daily news.",
    tagline: "Free Government Jobs, Exam Results, PDF Tools & Video Downloader",
    logo: "/logo.png",
    favicon: "/favicon.ico",
    ogImage: "/og-image.png",
    mobileIcon: "/apple-touch-icon.png",
    author: "ISHU Team",
    contact: {
      email: "support@ishu.fun",
      phone: "+91-8986985813",
      twitter: "@ishufun",
      facebook: "ishufun",
      instagram: "ishu.fun",
      linkedin: "company/ishu",
      youtube: "@ishufun",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SEO KEYWORDS - ALL TIERS
  // ═══════════════════════════════════════════════════════════════════════════
  keywords: {
    primary: [
      "government jobs India",
      "sarkari naukri",
      "sarkari result",
      "exam results India",
      "free PDF tools",
      "YouTube video downloader",
      "live TV India",
      "resume maker",
    ],
    targetCount: 2500,
    updateFrequency: "monthly",
    sources: [
      "extended-keywords.ts",
      "keywords-database.ts",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LANGUAGES & LOCALIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  languages: {
    default: "en",
    supported: [
      { code: "en", label: "English", name: "English" },
      { code: "hi", label: "हिन्दी", name: "Hindi" },
      { code: "ta", label: "தமிழ்", name: "Tamil" },
      { code: "te", label: "తెలుగు", name: "Telugu" },
      { code: "bn", label: "বাংলা", name: "Bengali" },
      { code: "mr", label: "मराठी", name: "Marathi" },
      { code: "gu", label: "ગુજરાતી", name: "Gujarati" },
      { code: "kn", label: "ಕನ್ನಡ", name: "Kannada" },
      { code: "ml", label: "മലയാളം", name: "Malayalam" },
      { code: "pa", label: "ਪੰਜਾਬੀ", name: "Punjabi" },
      { code: "ur", label: "اردو", name: "Urdu" },
      { code: "or", label: "ଓଡ଼ିଆ", name: "Odia" },
    ],
    hreflang: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // META TAGS TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════════
  metaTags: {
    title: {
      minLength: 30,
      maxLength: 60,
      format: "[Keyword] | [Benefit] | ISHU",
      powerWords: ["Best", "Free", "Top", "Latest", "Complete", "Guide", "2026"],
    },
    description: {
      minLength: 120,
      maxLength: 160,
      format: "[Keyword]: [Benefit] + CTA",
      callToAction: ["Free", "Instant", "Download", "Check", "Apply", "Learn More"],
    },
    keywords: {
      minCount: 5,
      maxCount: 20,
      format: "comma-separated, no duplicates",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ROBOTS & CRAWLING
  // ═══════════════════════════════════════════════════════════════════════════
  robots: {
    indexing: "allow",
    follow: true,
    maxSnippet: -1,
    maxImagePreview: "large",
    maxVideoPreview: -1,
    userAgent: "*",
    crawlDelay: 0.5,
    requestRate: "10/1s",
    crawlers: {
      google: {
        allow: true,
        crawlDelay: 0,
        requestRate: "50/1s",
      },
      bing: {
        allow: true,
        crawlDelay: 1,
        requestRate: "20/1s",
      },
      yandex: {
        allow: true,
        crawlDelay: 0.5,
        requestRate: "15/1s",
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SCHEMA MARKUP
  // ═══════════════════════════════════════════════════════════════════════════
  schema: {
    enabled: true,
    types: [
      "WebPage",
      "Organization",
      "LocalBusiness",
      "Article",
      "NewsArticle",
      "JobPosting",
      "SoftwareApplication",
      "FAQPage",
      "BreadcrumbList",
      "Review",
      "AggregateRating",
      "Person",
      "Event",
      "Course",
      "LearningResource",
      "HowTo",
      "Product",
      "VideoObject",
      "CollectionPage",
      "DatasetSchema",
    ],
    validation: "enabled",
    tools: [
      "Google Rich Result Test",
      "Schema.org Validator",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RANKINGS & PERFORMANCE
  // ═══════════════════════════════════════════════════════════════════════════
  performance: {
    coreWebVitals: {
      LCP: { target: 2.5, unit: "seconds" },
      FID: { target: 100, unit: "milliseconds" },
      CLS: { target: 0.1, unit: "score" },
      FCP: { target: 1.8, unit: "seconds" },
      TTFB: { target: 0.6, unit: "seconds" },
    },
    mobile: {
      speedScore: 75,
      viewportOptimized: true,
      touchFriendly: true,
    },
    imageOptimization: {
      formats: ["WebP", "JPEG", "PNG"],
      lazyLoad: true,
      compression: "aggressive",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BROWSER COMPATIBILITY
  // ═══════════════════════════════════════════════════════════════════════════
  browsers: {
    supported: [
      { name: "Chrome", priority: "very-high" },
      { name: "Firefox", priority: "high" },
      { name: "Safari", priority: "high" },
      { name: "Edge", priority: "high" },
      { name: "Opera", priority: "medium" },
      { name: "Brave", priority: "medium" },
      { name: "UC Browser", priority: "medium" },
      { name: "Samsung Internet", priority: "medium" },
    ],
    optimization: true,
    fallbacks: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SITEMAPS & INDEXING
  // ═══════════════════════════════════════════════════════════════════════════
  sitemaps: {
    enabled: true,
    types: [
      "standard",
      "image",
      "video",
      "news",
      "mobile",
    ],
    updateFrequency: "weekly",
    urls: {
      homepage: { priority: 1.0, changefreq: "daily" },
      category: { priority: 0.9, changefreq: "daily" },
      tool: { priority: 0.8, changefreq: "weekly" },
      article: { priority: 0.7, changefreq: "monthly" },
      legal: { priority: 0.5, changefreq: "yearly" },
    },
    indexing: {
      google: true,
      bing: true,
      yandex: true,
      baidu: true,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CONTENT GUIDELINES
  // ═══════════════════════════════════════════════════════════════════════════
  content: {
    minimumWords: 2000,
    recommendedWords: 3000,
    maximumWords: 5000,
    sections: {
      minimum: 5,
      recommended: 8,
    },
    links: {
      internal: { minimum: 5, recommended: 10 },
      external: { minimum: 2, recommended: 5 },
    },
    images: {
      minimum: 3,
      recommended: 5,
    },
    keywordDensity: {
      minimum: 0.5,
      recommended: 1.0,
      maximum: 1.5,
    },
    readability: {
      gradeLevel: "8-10",
      flesch: 50,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SOCIAL MEDIA & OPEN GRAPH
  // ═══════════════════════════════════════════════════════════════════════════
  social: {
    ogTypes: ["website", "article", "business.business", "place.place", "product.product"],
    ogImage: {
      width: 1200,
      height: 630,
      type: "image/png",
      url: "https://ishu.fun/og-image.png",
    },
    twitter: {
      card: "summary_large_image",
      site: "@ishufun",
      creator: "@ishufun",
    },
    facebook: {
      appId: "facebook-app-id",
      domain: "ishu.fun",
    },
    platforms: [
      { name: "Twitter", url: "https://twitter.com/ishufun", priority: "high" },
      { name: "Facebook", url: "https://facebook.com/ishufun", priority: "high" },
      { name: "Instagram", url: "https://instagram.com/ishu.fun", priority: "high" },
      { name: "LinkedIn", url: "https://linkedin.com/company/ishu", priority: "medium" },
      { name: "YouTube", url: "https://youtube.com/@ishufun", priority: "medium" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECURITY & PRIVACY
  // ═══════════════════════════════════════════════════════════════════════════
  security: {
    https: true,
    headers: {
      "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    csp: true,
    privacyPolicy: "/privacy",
    termsOfService: "/terms",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ANALYTICS & TRACKING
  // ═══════════════════════════════════════════════════════════════════════════
  analytics: {
    googleAnalytics: {
      trackingId: "UA-XXXXX",
      enabled: true,
    },
    googleSearchConsole: {
      enabled: true,
    },
    rankTracking: {
      enabled: true,
      tools: ["Google Search Console", "SEMrush", "Ahrefs"],
    },
    events: [
      "pageview",
      "scroll_depth",
      "time_on_page",
      "internal_link_click",
      "external_link_click",
      "file_download",
      "form_submission",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OPTIMIZATION TARGETS
  // ═══════════════════════════════════════════════════════════════════════════
  targets: {
    keywordsRanking: {
      position1: 100,
      position1to3: 300,
      position1to10: 800,
      position1to50: 1500,
    },
    traffic: {
      monthlyOrganic: 100000,
      yearlyOrganic: 1200000,
    },
    authority: {
      domainAuthority: 65,
      backlinks: 500,
      citedDomains: 300,
    },
    engagement: {
      bounceRate: 0.4,
      sessionDuration: 180,
      pagesPerSession: 2.5,
      ctr: 0.05,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TOOLS & SERVICES
  // ═══════════════════════════════════════════════════════════════════════════
  tools: {
    seoTools: [
      "Google Search Console",
      "Google Analytics",
      "Google PageSpeed Insights",
      "SEMrush",
      "Ahrefs",
      "Moz",
      "Rank Math",
      "SurferSEO",
    ],
    validation: [
      "Google Rich Result Test",
      "Schema.org Validator",
      "W3C HTML Validator",
      "Mobile-Friendly Test",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE SCHEDULE
  // ═══════════════════════════════════════════════════════════════════════════
  updates: {
    keywords: "weekly",
    metadata: "as-needed",
    content: "daily",
    backlinks: "ongoing",
    rankings: "daily",
    analytics: "daily",
    schema: "monthly",
    sitemaps: "weekly",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  getFullURL: (path: string) => {
    return path.startsWith("http") ? path : `${GlobalSEOConfig.site.domain}${path}`;
  },

  getMetaTitle: (keyword: string, benefit: string) => {
    return `${keyword} | ${benefit} | ISHU`;
  },

  getMetaDescription: (keyword: string, benefit: string, cta: string) => {
    return `${keyword}: ${benefit}. ${cta}. Join millions of users. No signup needed!`.substring(0, 160);
  },

  getPageSchema: (pageType: string, data: any) => {
    return {
      "@context": "https://schema.org",
      "@type": pageType,
      ...data,
    };
  },
};

export default GlobalSEOConfig;
