/**
 * MASTER SEO CONFIGURATION v2.0
 * COMPLETE SEO OPTIMIZATION FOR GLOBAL RANKING
 * 
 * Covers:
 * - All search engines (Google, Bing, Yahoo, Yandex, Baidu, DuckDuckGo)
 * - All browsers (Chrome, Firefox, Safari, Edge, Opera, Brave)
 * - All devices (Desktop, Mobile, Tablet, TV, Wearables)
 * - All regions (Global + India focus)
 * - Core Web Vitals optimization
 * - Mobile-first indexing
 * - Voice search optimization
 * - Schema markup for 20+ types
 * - Social media optimization
 * - Performance optimization
 * - Security optimization
 */

export const MASTER_SEO_CONFIG = {
  // ═══════════════════════════════════════════════════════════════════════════════
  // SITE IDENTITY
  // ═══════════════════════════════════════════════════════════════════════════════
  site: {
    name: "ISHU — Indian StudentHub University",
    shortName: "ISHU",
    domain: "https://ishu.fun",
    domains: [
      "https://ishu.fun",
      "https://www.ishu.fun",
      "https://ishufun.com",
      "https://www.ishufun.com",
    ],
    description: "India's #1 free platform for government exam results, sarkari naukri vacancies, admit cards for UPSC, SSC, Banking, Railways, NTA & all 36 states. 100+ free PDF tools, 700+ live Indian TV channels, YouTube video downloader, Terabox downloader, universal video downloader & 1000+ daily news.",
    tagline: "Free Government Jobs, Exam Results, PDF Tools & Video Downloader",
    language: "en-IN",
    locale: "en_IN",
    region: "IN",
    country: "India",
    establishedDate: "2024",
    author: "ISHU Team",
    creator: "ISHU Team",
    publisher: "ISHU",
    copyright: "© 2024-2026 ISHU Team. All rights reserved.",
    contact: {
      email: "support@ishu.fun",
      phone: "+91-8986985813",
      address: "India",
    },
    social: {
      twitter: "@ishufun",
      facebook: "ishufun",
      instagram: "ishu.fun",
      linkedin: "company/ishu",
      youtube: "@ishufun",
      tiktok: "@ishufun",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SEARCH ENGINE OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════════════
  searchEngines: {
    google: {
      enabled: true,
      verification: "your-google-verification-code",
      sitemapUrl: "https://ishu.fun/sitemap.xml",
      robotsUrl: "https://ishu.fun/robots.txt",
      canonicalStrategy: "always",
      crawlRate: "normal",
      preferredDomain: "https://ishu.fun",
      features: {
        enhancedSitelinks: true,
        mobileApp: true,
        ampPages: false,
        paidSearch: true,
      },
    },
    bing: {
      enabled: true,
      verification: "your-bing-verification-code",
      enableMobileApp: true,
    },
    yahoo: {
      enabled: true,
      crawlRate: "normal",
    },
    yandex: {
      enabled: true,
      verification: "your-yandex-verification-code",
      region: "IN",
    },
    baidu: {
      enabled: true,
      verification: "your-baidu-verification-code",
      region: "IN",
    },
    duckduckgo: {
      enabled: true,
      privacyFriendly: true,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // CONTENT OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════════════
  content: {
    titles: {
      minLength: 30,
      maxLength: 60,
      format: "{Primary Keyword} | {Benefit/Descriptor} | {Brand}",
      powerWords: [
        "Best", "Free", "Top", "Latest", "Complete", "Guide", "Ultimate",
        "Comprehensive", "Proven", "Award-Winning", "Trusted", "Official",
        "Instant", "Fast", "Quick", "Easy", "Simple", "Perfect",
      ],
      includeYear: true,
      includeLocation: "India",
    },
    descriptions: {
      minLength: 120,
      maxLength: 160,
      format: "{Main Keyword}: {Benefit 1} + {Benefit 2} + {CTA}",
      callToAction: [
        "Free", "Instant", "Download", "Check", "Apply", "Learn More",
        "Get Started", "Join Now", "Sign Up", "Start Now", "Explore",
      ],
      includeUniqueValue: true,
    },
    keywords: {
      minCount: 5,
      maxCount: 20,
      format: "comma-separated",
      noDuplicates: true,
      relatedKeywords: true,
    },
    headings: {
      h1: {
        maxPerPage: 1,
        includeKeyword: true,
      },
      h2: {
        distribute: true,
        keywords: true,
      },
      h3: {
        useForSections: true,
        keywords: false,
      },
    },
    structure: {
      paragraphLength: "100-200 words optimal",
      useSubheadings: true,
      bulletPoints: "use frequently",
      listsPreferred: true,
      images: "1 per 300 words",
      videos: "1 per 1000 words",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // TECHNICAL SEO
  // ═══════════════════════════════════════════════════════════════════════════════
  technical: {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "X-UA-Compatible": "IE=edge",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
      "Content-Security-Policy": "upgrade-insecure-requests",
    },
    ssl: {
      enforced: true,
      redirectHttp: true,
      certificate: "Let's Encrypt",
    },
    siteSpeed: {
      target: "< 2 seconds",
      coreWebVitals: {
        lcp: "< 2.5s", // Largest Contentful Paint
        fid: "< 100ms", // First Input Delay
        cls: "< 0.1", // Cumulative Layout Shift
      },
      imageOptimization: true,
      lazyLoading: true,
      caching: true,
      compression: "gzip, brotli",
    },
    robots: {
      userAgent: "*",
      allow: ["/", "/tools/", "/results/", "/tv/", "/news/"],
      disallow: ["/admin/", "/private/", "/temp/", "/api/"],
      crawlDelay: 0,
      requestRate: "unlimited",
      sitemapUrl: "https://ishu.fun/sitemap.xml",
    },
    structuredData: {
      formats: ["JSON-LD", "Schema.org"],
      types: [
        "Organization", "LocalBusiness", "WebSite", "SearchAction",
        "NewsArticle", "BlogPosting", "Product", "Rating",
        "BreadcrumbList", "FAQPage", "VideoObject", "ImageObject",
        "Event", "JobPosting", "EducationalOccupationalProgram",
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // MOBILE OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════════════
  mobile: {
    responsive: true,
    viewportMeta: "width=device-width, initial-scale=1, viewport-fit=cover",
    mobileFirstIndexing: true,
    acceleratedMobilePages: {
      enabled: false,
      alternative: "responsive design",
    },
    touchOptimization: {
      buttonSize: "44x44 pixels minimum",
      spacing: "10px minimum between interactive elements",
      tapTargets: "properly sized",
    },
    mobileApps: {
      androidApp: "ISHU Government Jobs App",
      iosApp: "ISHU Government Jobs App",
      appSchema: true,
    },
    devices: {
      supportedDevices: [
        "iPhone", "iPad", "Android phones", "Android tablets",
        "Windows phones", "Kindle", "Smart watches", "Smart TVs",
      ],
      breakpoints: [320, 375, 425, 768, 1024, 1440, 2560],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // LINK OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════════════
  links: {
    internal: {
      strategy: "hub-and-spoke",
      orphanPages: false,
      brokenLinks: false,
      redirectChains: false,
      maximumDepth: 3,
      anchors: {
        descriptive: true,
        keywordRich: true,
        avoidGeneric: ["click here", "read more"],
      },
    },
    external: {
      authorityLinks: true,
      relevantLinks: true,
      doFollowPercentage: "90%",
      noFollowPercentage: "10%",
      linkText: "descriptive and keyword-rich",
    },
    canonicals: {
      implementation: true,
      strategy: "self-referential primary URLs",
      duplicateHandling: true,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // META TAGS COMPREHENSIVE
  // ═══════════════════════════════════════════════════════════════════════════════
  metaTags: {
    primary: {
      charset: "UTF-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=5.0",
      robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      googlebot: "index, follow",
      bingbot: "index, follow",
      yandexbot: "index, follow",
    },
    geoTargeting: {
      region: "IN",
      placename: "India",
      position: "20.5937,78.9629",
      icbm: "20.5937, 78.9629",
    },
    social: {
      ogType: "website",
      ogSiteName: "ISHU",
      ogLocale: "en_IN",
      twitterCard: "summary_large_image",
      twitterSite: "@ishufun",
      twitterCreator: "@ishufun",
    },
    application: {
      appleMobileWebApp: true,
      mobileWebApp: true,
      applicationName: "ISHU",
      themeColor: "#0070f3",
      msapplicationTileColor: "#0070f3",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // LANGUAGE & INTERNATIONALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════
  languages: {
    primary: "en",
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
    hreflangStrategy: true,
    langAlternateLinks: true,
    translationSupport: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SCHEMA MARKUP TYPES
  // ═══════════════════════════════════════════════════════════════════════════════
  schemaMarkup: {
    organization: true,
    localBusiness: true,
    website: true,
    searchAction: true,
    newsArticle: true,
    blogPosting: true,
    product: true,
    aggregate: true,
    breadcrumb: true,
    faqPage: true,
    videoObject: true,
    event: true,
    jobPosting: true,
    educationalProgram: true,
    specialAnnouncement: true,
    richResults: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // PERFORMANCE METRICS
  // ═══════════════════════════════════════════════════════════════════════════════
  performance: {
    pageLoadTime: "< 2 seconds",
    firstContentfulPaint: "< 1.8 seconds",
    largestContentfulPaint: "< 2.5 seconds",
    firstInputDelay: "< 100 milliseconds",
    cumulativeLayoutShift: "< 0.1",
    imageOptimization: {
      format: ["WebP", "AVIF"],
      compression: true,
      responsiveImages: true,
      lazyLoading: true,
    },
    caching: {
      browserCache: "30 days",
      cdnCache: "1 year",
      apiCache: "1 hour",
    },
    compression: ["gzip", "brotli"],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SEO BEST PRACTICES
  // ═══════════════════════════════════════════════════════════════════════════════
  bestPractices: {
    uniqueContent: {
      duplicateContent: false,
      contentFreshness: "monthly updates",
      originalContent: "100%",
    },
    keyword: {
      research: true,
      targeting: true,
      density: "0.5-2.5%",
      naturalUsage: true,
      semanticVariations: true,
    },
    userExperience: {
      navigationClear: true,
      readabilityHigh: true,
      engagementContent: true,
      callToActionClear: true,
      formOptimized: true,
    },
    security: {
      https: true,
      trust: "SSL certificate",
      privacy: "privacy policy",
      dataProtection: "GDPR compliant",
    },
    accessibility: {
      wcag: "AAA",
      altText: "all images",
      headingStructure: "proper",
      formLabels: "all fields",
      keyboardNavigation: true,
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // RANKING FACTORS OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════════════
  rankingFactors: {
    onPage: {
      titleTag: "optimized",
      metaDescription: "optimized",
      hTags: "optimized",
      keywordPlacement: "strategic",
      contentQuality: "high",
      contentLength: "2000+ words optimal",
      readability: "high",
      freshness: "regularly updated",
    },
    technical: {
      mobileResponsive: true,
      pageSpeed: "fast",
      indexability: "full",
      structuredData: "comprehensive",
      crawlability: "optimal",
      coreWebVitals: "passed",
    },
    offPage: {
      backlinks: "quality & quantity",
      socialSignals: "strong",
      brandMentions: "frequent",
      citations: "consistent",
      reviews: "positive",
    },
    userBehavior: {
      clickThroughRate: "high",
      timeOnPage: "long",
      bounceRate: "low",
      returnVisitors: "many",
      conversionRate: "high",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // MONITORING & REPORTING
  // ═══════════════════════════════════════════════════════════════════════════════
  monitoring: {
    googleSearchConsole: true,
    googleAnalytics: true,
    rankTracking: "daily",
    competitorAnalysis: "weekly",
    keywordTracking: "daily",
    backlineTracking: "weekly",
    technicalAudits: "monthly",
    contentAudits: "quarterly",
    reportGeneration: "monthly",
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // CONTENT CALENDAR
  // ═══════════════════════════════════════════════════════════════════════════════
  contentStrategy: {
    updateFrequency: "daily",
    contentTypes: [
      "news articles",
      "guides",
      "tutorials",
      "case studies",
      "videos",
      "infographics",
      "webinars",
      "podcasts",
    ],
    keywordTargeting: "long-tail focus",
    topicClusters: true,
    cornerstone: true,
    internalLinking: "frequent",
    externalLinking: "relevant authority",
  },
};

/**
 * Get complete SEO config for specific page type
 */
export const getPageSEOConfig = (pageType: string) => {
  return MASTER_SEO_CONFIG;
};

/**
 * Validate SEO implementation
 */
export const validateSEOMetaTags = () => {
  return {
    requirements: [
      "Unique title tag (30-60 chars)",
      "Unique meta description (120-160 chars)",
      "Primary keyword in title",
      "Primary keyword in description",
      "Keyword variations in content",
      "Proper heading structure",
      "Alt text for all images",
      "Internal linking",
      "Mobile responsive",
      "Page fast loading",
      "SSL certificate",
      "Structured data",
      "Open Graph tags",
      "Twitter Card tags",
      "Canonical URL",
    ],
    recommendations: [
      "Add FAQ schema",
      "Add video schema",
      "Add breadcrumb schema",
      "Increase content length",
      "Add more internal links",
      "Optimize images further",
      "Improve page speed",
      "Build more backlinks",
      "Improve CTR",
      "Increase time on page",
    ],
  };
};
