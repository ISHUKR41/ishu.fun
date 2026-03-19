/**
 * ADVANCED META TAGS GENERATOR
 * 
 * Generates optimized meta tags for:
 * ✓ Google, Bing, Yahoo, Yandex, Baidu, DuckDuckGo
 * ✓ Chrome, Firefox, Safari, Edge, Opera, Brave, Vivaldi
 * ✓ Desktop, Mobile, Tablet
 * ✓ Open Graph (Facebook, LinkedIn)
 * ✓ Twitter Card
 * ✓ WhatsApp, Telegram, Discord preview
 * ✓ Pinterest rich pins
 * ✓ Instagram preview
 * ✓ Apple devices
 * ✓ Windows/Android
 * ✓ AMP pages
 */

export interface MetaTagsConfig {
  // Basic SEO
  title: string;
  description: string;
  keywords: string[];
  author?: string;
  
  // URL & Canonical
  url?: string;
  canonical?: string;
  
  // Images
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageType?: string;
  
  // Date
  datePublished?: string;
  dateModified?: string;
  
  // Language & Locale
  language?: string;
  locale?: string;
  localeAlternate?: string[];
  
  // Content type
  contentType?: string;
  charset?: string;
  
  // Robots
  robots?: string;
  
  // Additional metadata
  viewport?: string;
  themeColor?: string;
  appleStatusBar?: string;
  
  // Structured data
  structuredData?: any;
}

/**
 * Generate all meta tags as string
 */
export const generateMetaTags = (config: MetaTagsConfig): string => {
  const tags: string[] = [];

  // HTML Meta Tags - Basic
  tags.push(`<meta charset="${config.charset || 'UTF-8'}">`);
  tags.push(`<meta name="viewport" content="${config.viewport || 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes'}">`);
  tags.push(`<meta http-equiv="X-UA-Compatible" content="ie=edge">`);
  
  // Basic SEO
  tags.push(`<title>${escapeHtml(config.title)}</title>`);
  tags.push(`<meta name="description" content="${escapeHtml(config.description)}">`);
  tags.push(`<meta name="keywords" content="${escapeHtml(config.keywords.join(', '))}">`);
  tags.push(`<meta name="author" content="${escapeHtml(config.author || 'ISHU Team')}">`);
  
  // Canonical
  if (config.canonical || config.url) {
    tags.push(`<link rel="canonical" href="${config.canonical || config.url}">`);
  }

  // Language & Locale
  if (config.language) {
    tags.push(`<meta http-equiv="content-language" content="${config.language}">`);
  }

  // Robots
  tags.push(`<meta name="robots" content="${config.robots || 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'}">`);
  tags.push(`<meta name="googlebot" content="${config.robots || 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'}">`);
  tags.push(`<meta name="bingbot" content="${config.robots || 'index, follow'}">`);
  tags.push(`<meta name="slurp" content="index, follow">`);
  tags.push(`<meta name="twitter:bot" content="noodp, noydir">`);

  // Images
  if (config.image) {
    tags.push(`<meta property="og:image" content="${config.image}">`);
    tags.push(`<meta property="twitter:image" content="${config.image}">`);
    if (config.imageWidth && config.imageHeight) {
      tags.push(`<meta property="og:image:width" content="${config.imageWidth}">`);
      tags.push(`<meta property="og:image:height" content="${config.imageHeight}">`);
    }
    if (config.imageType) {
      tags.push(`<meta property="og:image:type" content="${config.imageType}">`);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // OPEN GRAPH TAGS (Facebook, LinkedIn, Discord, Telegram)
  // ═══════════════════════════════════════════════════════════════════════════════
  tags.push(`<meta property="og:title" content="${escapeHtml(config.title)}">`);
  tags.push(`<meta property="og:description" content="${escapeHtml(config.description)}">`);
  if (config.url) {
    tags.push(`<meta property="og:url" content="${config.url}">`);
  }
  tags.push(`<meta property="og:type" content="website">`);
  if (config.locale) {
    tags.push(`<meta property="og:locale" content="${config.locale}">`);
  }
  if (config.localeAlternate && config.localeAlternate.length > 0) {
    config.localeAlternate.forEach(locale => {
      tags.push(`<meta property="og:locale:alternate" content="${locale}">`);
    });
  }
  tags.push(`<meta property="og:site_name" content="ISHU — Indian StudentHub University">`);

  // ═══════════════════════════════════════════════════════════════════════════════
  // TWITTER CARD TAGS
  // ═══════════════════════════════════════════════════════════════════════════════
  tags.push(`<meta name="twitter:card" content="summary_large_image">`);
  tags.push(`<meta name="twitter:title" content="${escapeHtml(config.title)}">`);
  tags.push(`<meta name="twitter:description" content="${escapeHtml(config.description)}">`);
  tags.push(`<meta name="twitter:site" content="@ishufun">`);
  tags.push(`<meta name="twitter:creator" content="@ishufun">`);
  if (config.image) {
    tags.push(`<meta name="twitter:image:src" content="${config.image}">`);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // WHATSAPP / TELEGRAM / DISCORD PREVIEW (Uses OG tags)
  // ═══════════════════════════════════════════════════════════════════════════════
  // Already handled by OG tags above

  // ═══════════════════════════════════════════════════════════════════════════════
  // PINTEREST RICH PINS
  // ═══════════════════════════════════════════════════════════════════════════════
  tags.push(`<meta property="pinterest:description" content="${escapeHtml(config.description)}">`);
  if (config.image) {
    tags.push(`<meta name="pinterest:media" content="${config.image}">`);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // INSTAGRAM OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════════════
  tags.push(`<meta property="instagram:media" content="@ishufun">`);

  // ═══════════════════════════════════════════════════════════════════════════════
  // APPLE DEVICES
  // ═══════════════════════════════════════════════════════════════════════════════
  tags.push(`<meta name="apple-mobile-web-app-capable" content="yes">`);
  tags.push(`<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`);
  tags.push(`<meta name="apple-mobile-web-app-title" content="ISHU">`);
  tags.push(`<link rel="apple-touch-icon" href="/apple-touch-icon.png">`);
  tags.push(`<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3b82f6">`);

  // ═══════════════════════════════════════════════════════════════════════════════
  // WINDOWS / ANDROID
  // ═══════════════════════════════════════════════════════════════════════════════
  tags.push(`<meta name="msapplication-config" content="/browserconfig.xml">`);
  tags.push(`<meta name="msapplication-TileColor" content="#3b82f6">`);
  tags.push(`<meta name="theme-color" content="${config.themeColor || '#3b82f6'}">`);

  // ═══════════════════════════════════════════════════════════════════════════════
  // FAVICON & MANIFEST
  // ═══════════════════════════════════════════════════════════════════════════════
  tags.push(`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">`);
  tags.push(`<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">`);
  tags.push(`<link rel="manifest" href="/manifest.json">`);

  // ═══════════════════════════════════════════════════════════════════════════════
  // SEARCH ENGINE VERIFICATION
  // ═══════════════════════════════════════════════════════════════════════════════
  tags.push(`<meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE">`);
  tags.push(`<meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE">`);
  tags.push(`<meta name="yandex-verification" content="YOUR_YANDEX_VERIFICATION_CODE">`);

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECURITY & PERFORMANCE
  // ═══════════════════════════════════════════════════════════════════════════════
  tags.push(`<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' *.analytics.google.com;">`);
  tags.push(`<meta http-equiv="X-Content-Type-Options" content="nosniff">`);
  tags.push(`<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">`);
  tags.push(`<meta http-equiv="X-XSS-Protection" content="1; mode=block">`);
  tags.push(`<meta name="referrer" content="strict-origin-when-cross-origin">`);

  // ═══════════════════════════════════════════════════════════════════════════════
  // PRELOAD & PREFETCH OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════════════
  tags.push(`<link rel="dns-prefetch" href="//www.google-analytics.com">`);
  tags.push(`<link rel="dns-prefetch" href="//fonts.googleapis.com">`);
  tags.push(`<link rel="preconnect" href="https://fonts.googleapis.com">`);
  tags.push(`<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`);

  // ═══════════════════════════════════════════════════════════════════════════════
  // AMP TAG
  // ═══════════════════════════════════════════════════════════════════════════════
  if (config.url) {
    tags.push(`<link rel="amphtml" href="${config.url.replace(/\/$/, '')}/amp/">`);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // STRUCTURED DATA
  // ═══════════════════════════════════════════════════════════════════════════════
  if (config.structuredData) {
    tags.push(`<script type="application/ld+json">\n${JSON.stringify(config.structuredData, null, 2)}\n</script>`);
  }

  return tags.join('\n');
};

/**
 * Escape HTML special characters
 */
const escapeHtml = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Generate meta tags object for React Helmet
 */
export const generateHelmetConfig = (config: MetaTagsConfig) => {
  return {
    title: config.title,
    htmlAttributes: {
      lang: config.language || 'en',
    },
    meta: [
      { charset: config.charset || 'UTF-8' },
      {
        name: 'viewport',
        content: config.viewport || 'width=device-width, initial-scale=1',
      },
      {
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=edge',
      },
      {
        name: 'description',
        content: config.description,
      },
      {
        name: 'keywords',
        content: config.keywords.join(', '),
      },
      {
        name: 'author',
        content: config.author || 'ISHU Team',
      },
      {
        name: 'robots',
        content: config.robots || 'index, follow',
      },
      {
        property: 'og:title',
        content: config.title,
      },
      {
        property: 'og:description',
        content: config.description,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      config.image ? { property: 'og:image', content: config.image } : null,
      config.url ? { property: 'og:url', content: config.url } : null,
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: config.title,
      },
      {
        name: 'twitter:description',
        content: config.description,
      },
      config.image ? { name: 'twitter:image', content: config.image } : null,
    ].filter(Boolean),
    link: [
      config.canonical ? { rel: 'canonical', href: config.canonical || config.url } : null,
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ].filter(Boolean),
  };
};

/**
 * Get Browser-specific meta tag
 */
export const getBrowserSpecificMeta = (browser: string): MetaTagsConfig => {
  const browserConfigs: Record<string, Partial<MetaTagsConfig>> = {
    chrome: {
      themeColor: '#3b82f6',
    },
    firefox: {
      themeColor: '#3b82f6',
    },
    safari: {
      appleStatusBar: 'black-translucent',
    },
    edge: {
      themeColor: '#3b82f6',
    },
    opera: {
      themeColor: '#3b82f6',
    },
    brave: {
      themeColor: '#3b82f6',
    },
  };

  return browserConfigs[browser.toLowerCase()] || {};
};
