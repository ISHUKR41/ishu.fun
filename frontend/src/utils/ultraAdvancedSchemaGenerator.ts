/**
 * ULTRA ADVANCED SCHEMA MARKUP GENERATOR v2.0
 * Generate comprehensive structured data for maximum SEO
 * 
 * Supports:
 * - Organization schema
 * - Website schema with search action  
 * - Breadcrumb schema
 * - NewsArticle & BlogPosting schemas
 * - Product & AggregateRating schemas
 * - FAQPage schema
 * - VideoObject schema
 * - Event schema
 * - JobPosting schema
 * - Educational program schema
 * - LocalBusiness schema
 * - Special announcement schema
 * - Rich results markup
 */

interface SchemaConfig {
  pageType: 'homepage' | 'article' | 'news' | 'product' | 'faq' | 'video' | 'job' | 'event' | 'educational' | 'local_business';
  title: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  video?: { url: string; thumbnail: string; duration: string };
  rating?: { ratingValue: number; reviewCount: number };
  keywords?: string[];
  category?: string;
  tags?: string[];
}

/**
 * Generate Organization schema
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://ishu.fun/#organization',
    name: 'ISHU — Indian StudentHub University',
    alternateName: ['ISHU', 'ishu.fun', 'ishufun'],
    url: 'https://ishu.fun',
    logo: 'https://ishu.fun/logo.png',
    description: 'India\'s #1 free platform for government exam results, sarkari naukri vacancies, admit cards for UPSC, SSC, Banking, Railways, NTA & all 36 states. 100+ free PDF tools, 700+ live Indian TV channels, YouTube video downloader, Terabox downloader, universal video downloader & 1000+ daily news.',
    sameAs: [
      'https://www.facebook.com/ishufun',
      'https://www.instagram.com/ishu.fun',
      'https://twitter.com/ishufun',
      'https://www.youtube.com/@ishufun',
    ],
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-8986985813',
      email: 'support@ishu.fun',
      contactType: 'Customer Support',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'India',
    },
  };
};

/**
 * Generate Website schema with SearchAction
 */
export const generateWebsiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://ishu.fun/#website',
    url: 'https://ishu.fun',
    name: 'ISHU',
    description: 'Free Government Jobs, Exam Results, PDF Tools & Video Downloader Platform',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://ishu.fun/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

/**
 * Generate Breadcrumb schema
 */
export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://ishu.fun${item.url}`,
    })),
  };
};

/**
 * Generate NewsArticle schema
 */
export const generateNewsArticleSchema = (config: SchemaConfig) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${config.url}#article`,
    headline: config.title,
    description: config.description,
    image: config.image || 'https://ishu.fun/og-image.png',
    datePublished: config.datePublished || new Date().toISOString(),
    dateModified: config.dateModified || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: config.author || 'ISHU Team',
      url: 'https://ishu.fun',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ISHU',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ishu.fun/logo.png',
      },
    },
    thumbnail: {
      '@type': 'ImageObject',
      url: config.image || 'https://ishu.fun/og-image.png',
      width: 1200,
      height: 627,
    },
    articleSection: config.category || 'Education',
    keywords: config.keywords?.join(', ') || '',
    articleBody: config.description,
    url: config.url,
    mainEntityOfPage: config.url,
  };
};

/**
 * Generate BlogPosting schema
 */
export const generateBlogPostingSchema = (config: SchemaConfig) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${config.url}#blogpost`,
    headline: config.title,
    alternativeHeadline: config.description,
    description: config.description,
    image: config.image || 'https://ishu.fun/og-image.png',
    datePublished: config.datePublished || new Date().toISOString(),
    dateModified: config.dateModified || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: config.author || 'ISHU Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ISHU',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ishu.fun/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': config.url,
    },
    articleSection: config.category || 'Blog',
    keywords: config.keywords?.join(', ') || '',
    potentialAction: {
      '@type': 'ShareAction',
      target: ['https://www.facebook.com', 'https://twitter.com'],
    },
    commentCount: 0,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', 'h3', 'p'],
    },
  };
};

/**
 * Generate Product schema
 */
export const generateProductSchema = (config: SchemaConfig) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: config.title,
    description: config.description,
    image: config.image || 'https://ishu.fun/og-image.png',
    brand: {
      '@type': 'Brand',
      name: 'ISHU',
    },
    offers: {
      '@type': 'Offer',
      url: config.url,
      priceCurrency: 'INR',
      price: '0',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'ISHU',
      },
    },
    aggregateRating: config.rating ? {
      '@type': 'AggregateRating',
      ratingValue: config.rating.ratingValue,
      reviewCount: config.rating.reviewCount,
      bestRating: '5',
      worstRating: '1',
    } : undefined,
    review: config.rating ? [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: config.rating.ratingValue,
        },
        author: {
          '@type': 'Person',
          name: 'ISHU User',
        },
        reviewBody: 'Excellent service and free tools!',
      },
    ] : undefined,
  };
};

/**
 * Generate FAQPage schema
 */
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq, index) => ({
      '@type': 'Question',
      '@id': `#faq-${index}`,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * Generate VideoObject schema
 */
export const generateVideoSchema = (config: SchemaConfig) => {
  const video = config.video;
  if (!video) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: config.title,
    description: config.description,
    thumbnailUrl: [video.thumbnail],
    uploadDate: config.datePublished || new Date().toISOString(),
    duration: video.duration,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      telephone: '+91-8986985813',
    },
    author: {
      '@type': 'Organization',
      name: config.author || 'ISHU',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ISHU',
    },
    url: video.url,
    contentUrl: video.url,
  };
};

/**
 * Generate Event schema
 */
export const generateEventSchema = (config: SchemaConfig) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: config.title,
    description: config.description,
    image: config.image,
    startDate: config.datePublished,
    endDate: new Date(new Date(config.datePublished || '').getTime() + 2 * 60 * 60 * 1000).toISOString(),
    location: {
      '@type': 'VirtualLocation',
      url: config.url,
    },
    organizer: {
      '@type': 'Organization',
      name: 'ISHU',
      url: 'https://ishu.fun',
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
  };
};

/**
 * Generate JobPosting schema
 */
export const generateJobPostingSchema = (config: SchemaConfig) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: config.title,
    description: config.description,
    datePosted: config.datePublished || new Date().toISOString(),
    validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: ['FULL_TIME', 'CONTRACT'],
    hiringOrganization: {
      '@type': 'Organization',
      name: config.author || 'ISHU',
      sameAs: 'https://ishu.fun',
      logo: 'https://ishu.fun/logo.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        addressLocality: 'India',
      },
    },
    baseSalary: {
      '@type': 'PriceSpecification',
      priceCurrency: 'INR',
      price: '0',
    },
    url: config.url,
  };
};

/**
 * Generate EducationalOccupationalProgram schema
 */
export const generateEducationalProgramSchema = (config: SchemaConfig) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    name: config.title,
    description: config.description,
    provider: {
      '@type': 'Organization',
      name: 'ISHU',
      url: 'https://ishu.fun',
    },
    hasCourse: {
      '@type': 'Course',
      name: config.title,
      description: config.description,
      provider: {
        '@type': 'Organization',
        name: 'ISHU',
      },
    },
    url: config.url,
    potentialAction: {
      '@type': 'EnrollAction',
      target: config.url,
    },
  };
};

/**
 * Generate LocalBusiness schema
 */
export const generateLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ISHU — Indian StudentHub University',
    url: 'https://ishu.fun',
    logo: 'https://ishu.fun/logo.png',
    description: 'Education platform for government jobs and exams',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressLocality: 'India',
    },
    sameAs: [
      'https://www.facebook.com/ishufun',
      'https://www.instagram.com/ishu.fun',
      'https://twitter.com/ishufun',
      'https://www.youtube.com/@ishufun',
    ],
    telephone: '+91-8986985813',
    email: 'support@ishu.fun',
  };
};

/**
 * Generate SpecialAnnouncement schema (for news/alerts)
 */
export const generateSpecialAnnouncementSchema = (config: SchemaConfig) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SpecialAnnouncement',
    name: config.title,
    text: config.description,
    datePosted: config.datePublished || new Date().toISOString(),
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    announcementLocation: {
      '@type': 'Country',
      name: 'IN',
    },
    category: config.category || 'Education',
    url: config.url,
  };
};

/**
 * Generate comprehensive schema based on page type
 */
export const generateComprehensiveSchema = (config: SchemaConfig): any[] => {
  const schemas = [];

  // Always include Organization and Website
  schemas.push(generateOrganizationSchema());
  schemas.push(generateWebsiteSchema());

  // Add breadcrumbs if provided
  if (config.breadcrumbs) {
    schemas.push(generateBreadcrumbSchema(config.breadcrumbs));
  }

  // Add page-specific schema
  switch (config.pageType) {
    case 'news':
      schemas.push(generateNewsArticleSchema(config));
      schemas.push(generateSpecialAnnouncementSchema(config));
      break;
    case 'article':
      schemas.push(generateBlogPostingSchema(config));
      break;
    case 'product':
      schemas.push(generateProductSchema(config));
      break;
    case 'faq':
      if (config.faqs) {
        schemas.push(generateFAQSchema(config.faqs));
      }
      break;
    case 'video':
      if (config.video) {
        schemas.push(generateVideoSchema(config));
      }
      break;
    case 'job':
      schemas.push(generateJobPostingSchema(config));
      break;
    case 'event':
      schemas.push(generateEventSchema(config));
      break;
    case 'educational':
      schemas.push(generateEducationalProgramSchema(config));
      break;
    case 'local_business':
      schemas.push(generateLocalBusinessSchema());
      break;
  }

  return schemas;
};

/**
 * Generate all schemas as JSON-LD for head
 */
export const generateJSONLDScripts = (config: SchemaConfig): string => {
  const schemas = generateComprehensiveSchema(config);
  return schemas
    .map(schema => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join('\n');
};

/**
 * Generate Rich Snippet markup
 */
export const generateRichSnippet = (config: SchemaConfig) => {
  const snippet = {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    name: config.title,
    description: config.description,
    image: config.image,
    url: config.url,
    keywords: config.keywords,
    category: config.category,
    tags: config.tags,
  };

  if (config.rating) {
    (snippet as any).aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: config.rating.ratingValue,
      reviewCount: config.rating.reviewCount,
    };
  }

  return snippet;
};
