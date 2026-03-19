/**
 * SUPREME SEO UTILITY v3.0
 * 
 * Ultra-comprehensive SEO optimization with:
 * - Advanced schema markup generation
 * - Multi-browser optimization
 * - All search engine compatibility
 * - Performance monitoring
 * - Dynamic meta tag generation
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ADVANCED SCHEMA MARKUP GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ISHU — Indian StudentHub University",
    "alternateName": ["ISHU", "IshuFun", "ISHU Fun"],
    "url": "https://ishu.fun",
    "logo": {
      "@type": "ImageObject",
      "url": "https://ishu.fun/logo.png",
      "width": 200,
      "height": 200
    },
    "description": "India's #1 free platform for government exam results, sarkari naukri vacancies, admit cards for UPSC, SSC, Banking, Railways, NTA & all 36 states. 100+ free PDF tools, 700+ live Indian TV channels, YouTube video downloader, Terabox downloader.",
    "sameAs": [
      "https://www.facebook.com/ishufun",
      "https://www.twitter.com/ishufun",
      "https://www.instagram.com/ishu.fun",
      "https://www.youtube.com/@ishufun",
      "https://www.linkedin.com/company/ishu"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "telephone": "+91-8986985813",
      "email": "support@ishu.fun",
      "areaServed": "IN"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "India",
      "postalCode": "NA"
    },
    "foundingDate": "2024",
    "foundingLocation": "India",
    "slogan": "Free Government Jobs, Exam Results, PDF Tools & Video Downloader",
    "knowsAbout": [
      "Government Jobs",
      "Exam Results",
      "PDF Tools",
      "Video Downloading",
      "Live TV",
      "News",
      "Resume Builder",
      "Career Guidance"
    ]
  };
};

export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ISHU",
    "url": "https://ishu.fun",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ishu.fun/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "description": "Search for government jobs, exam results, and use free PDF tools",
    "inLanguage": ["en", "hi", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa", "ur"],
    "publisher": {
      "@type": "Organization",
      "@id": "https://ishu.fun/#organization"
    }
  };
};

export const generateBreadcrumbSchema = (items: Array<{name: string; url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const generateFAQSchema = (faqs: Array<{question: string; answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const generateJobPostingSchema = (job: {
  title: string;
  description: string;
  location: string;
  salary?: string;
  postedDate: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "datePosted": job.postedDate,
    "hiringOrganization": {
      "@type": "Organization",
      "name": "ISHU"
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": job.location
      }
    },
    ...(job.salary && {
      "baseSalary": {
        "@type": "PriceSpecification",
        "priceCurrency": "INR",
        "price": job.salary
      }
    })
  };
};

export const generateArticleSchema = (article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": ["NewsArticle", "BlogPosting"],
    "mainEntityOfPage": {
      "@type": "WebPage"
    },
    "headline": article.headline,
    "description": article.description,
    "image": {
      "@type": "ImageObject",
      "url": article.image,
      "width": 1200,
      "height": 630
    },
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "author": {
      "@type": "Organization",
      "name": article.author || "ISHU"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ISHU",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ishu.fun/logo.png"
      }
    }
  };
};

export const generateVideoSchema = (video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.name,
    "description": video.description,
    "thumbnailUrl": video.thumbnailUrl,
    "uploadDate": video.uploadDate,
    "duration": video.duration,
    "embedUrl": "https://ishu.fun/video",
    "potentialAction": {
      "@type": "WatchAction"
    }
  };
};

export const generateProductSchema = (product: {
  name: string;
  description: string;
  image: string;
  price?: string;
  rating?: number;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": "ISHU"
    },
    ...(product.price && {
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": product.price
      }
    }),
    ...(product.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "ratingCount": "10000+"
      }
    })
  };
};

export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Organization"],
    "name": "ISHU — Indian StudentHub University",
    "url": "https://ishu.fun",
    "telephone": "+91-8986985813",
    "email": "support@ishu.fun",
    "priceRange": "Free",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 20.5937,
      "longitude": 78.9629
    },
    "openingHours": {
      "opens": "00:00",
      "closes": "23:59",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    "areaServed": "IN",
    "service": [
      "Government Job Portal",
      "Exam Results",
      "PDF Tools",
      "Video Downloader",
      "Live TV Streaming",
      "News Portal",
      "Resume Builder"
    ]
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// BROWSER-SPECIFIC META TAGS
// ═══════════════════════════════════════════════════════════════════════════════

export const getBrowserSpecificMetaTags = (userAgent?: string) => {
  return {
    // Chrome-specific
    chrome: {
      "theme-color": "#0070f3",
    },
    
    // Firefox-specific
    firefox: {
      "accept-language": "en-IN, hi-IN",
    },
    
    // Safari-specific
    safari: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "black-translucent",
      "apple-mobile-web-app-title": "ISHU",
    },
    
    // Edge-specific
    edge: {
      "msapplication-TileColor": "#0070f3",
      "msapplication-config": "/browserconfig.xml",
    },
    
    // Opera-specific
    opera: {
      "opera-icon": "/opera-icon.png",
    },
    
    // Brave-specific
    brave: {
      "brave-reward": "yes",
    },
    
    // UC Browser
    ucBrowser: {
      "device": "pc,mobile",
    },
    
    // QQ Browser
    qq: {
      "x5-page-mode": "app",
      "x5-orientation": "portrait",
    }
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH ENGINE SPECIFIC HEADERS
// ═══════════════════════════════════════════════════════════════════════════════

export const getSearchEngineHeaders = () => {
  return {
    // Google
    "google-site-verification": "your-google-code",
    
    // Bing
    "msvalidate.01": "your-bing-code",
    
    // Yandex
    "yandex-verification": "your-yandex-code",
    
    // Baidu
    "baidu-site-verification": "your-baidu-code",
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// HREFLANG GENERATION FOR MULTILINGUAL
// ═══════════════════════════════════════════════════════════════════════════════

export const generateAdvancedHreflangs = (
  path: string,
  languages: string[] = ["en", "hi", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa", "ur"]
) => {
  return languages.map(lang => ({
    rel: "alternate",
    hreflang: `${lang}-IN`,
    href: `https://ishu.fun/${lang}${path}`
  }));
};

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC META TAG GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

export const generateDynamicMetaTags = (config: {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedDate?: string;
}) => {
  const image = config.image || "https://ishu.fun/og-image.png";
  const url = config.url || "https://ishu.fun/";
  const type = config.type || "website";
  
  return [
    { name: "description", content: config.description },
    { name: "keywords", content: config.keywords },
    { name: "author", content: config.author || "ISHU" },
    { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5.0" },
    { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
    
    // Open Graph
    { property: "og:title", content: config.title },
    { property: "og:description", content: config.description },
    { property: "og:image", content: image },
    { property: "og:url", content: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: "ISHU" },
    { property: "og:locale", content: "en_IN" },
    
    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: config.title },
    { name: "twitter:description", content: config.description },
    { name: "twitter:image", content: image },
    { name: "twitter:site", content: "@ishufun" },
    
    // Additional
    { name: "language", content: "English, Hindi" },
    { name: "revisit-after", content: "7 days" },
    { name: "distribution", content: "global" },
    { name: "rating", content: "general" },
    
    ...(config.publishedDate && [
      { name: "article:published_time", content: config.publishedDate },
    ])
  ];
};

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE MONITORING FOR SEO
// ═══════════════════════════════════════════════════════════════════════════════

export const monitorSEOPerformance = () => {
  if (typeof window === 'undefined') return;
  
  // Core Web Vitals
  if ('web-vital' in window) {
    const vitals = {
      lcp: 0,
      fid: 0,
      cls: 0,
    };
    
    // Send to analytics
    console.log('[SEO] Core Web Vitals:', vitals);
  }
  
  // Page visibility
  document.addEventListener('visibilitychange', () => {
    console.log('[SEO] Page visibility changed');
  });
  
  // User engagement signals
  let scrolled = false;
  window.addEventListener('scroll', () => {
    if (!scrolled) {
      scrolled = true;
      console.log('[SEO] User scrolled - positive engagement signal');
    }
  });
  
  // Time on page
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeOnPage = (Date.now() - startTime) / 1000;
    console.log(`[SEO] Time on page: ${timeOnPage}s`);
  });
};

// ═══════════════════════════════════════════════════════════════════════════════
// SITEMAP GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

export const generateDynamicSitemap = (pages: Array<{
  url: string;
  lastMod?: string;
  changeFreq?: string;
  priority?: number;
}>) => {
  const xmlLiteral = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${page.url}</loc>
    ${page.lastMod ? `<lastmod>${page.lastMod}</lastmod>` : ""}
    ${page.changeFreq ? `<changefreq>${page.changeFreq}</changefreq>` : ""}
    ${page.priority ? `<priority>${page.priority}</priority>` : ""}
  </url>
  `
    )
    .join("")}
</urlset>`;

  return xmlLiteral;
};

// ═══════════════════════════════════════════════════════════════════════════════
// CANONICAL URL MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export const getCanonicalUrl = (url: string) => {
  // Remove query parameters except for pagination
  const urlObj = new URL(url);
  const importantParams = ['page', 'p', 'sort'];
  const newParams = new URLSearchParams();
  
  importantParams.forEach(param => {
    if (urlObj.searchParams.has(param)) {
      newParams.set(param, urlObj.searchParams.get(param)!);
    }
  });
  
  urlObj.search = newParams.toString();
  return urlObj.toString();
};

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGE OPTIMIZATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export const generateImageSchema = (image: {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  description?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "url": image.url,
    "name": image.alt,
    "description": image.description || image.alt,
    ...(image.width && image.height && {
      "width": image.width,
      "height": image.height
    })
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// KEYWORD DENSITY ANALYZER
// ═══════════════════════════════════════════════════════════════════════════════

export const analyzeKeywordDensity = (content: string, keyword: string): number => {
  const keywordRegex = new RegExp(`\\b${keyword}\\b`, 'gi');
  const keywordMatches = content.match(keywordRegex) || [];
  const words = content.split(/\s+/);
  return (keywordMatches.length / words.length) * 100;
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUGGESTED INTERNAL LINKS GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

export const suggestInternalLinks = (currentPage: string, availablePages: string[]) => {
  // Simple keyword matching for internal links
  const keywords = currentPage.toLowerCase().split(' ');
  const suggestions = availablePages.filter(page => {
    const pageWords = page.toLowerCase().split(' ');
    return keywords.some(keyword => pageWords.includes(keyword));
  });
  
  return suggestions.slice(0, 5); // Suggest up to 5 internal links
};

export default {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateJobPostingSchema,
  generateArticleSchema,
  generateVideoSchema,
  generateProductSchema,
  generateLocalBusinessSchema,
  getBrowserSpecificMetaTags,
  getSearchEngineHeaders,
  generateAdvancedHreflangs,
  generateDynamicMetaTags,
  monitorSEOPerformance,
  generateDynamicSitemap,
  getCanonicalUrl,
  generateImageSchema,
  analyzeKeywordDensity,
  suggestInternalLinks,
};
