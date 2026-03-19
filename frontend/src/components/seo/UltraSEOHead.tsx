/**
 * ULTRA SEO HEAD COMPONENT v3.0
 * 
 * Complete meta tag and schema markup component for maximum SEO
 * - 50+ meta tags
 * - 20+ schema markups
 * - Open Graph & Twitter cards
 * - Hreflang for 12 languages
 * - Core Web Vitals tracking
 * - Browser optimization
 * - Multi-crawler support
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  generateUltraAdvancedSchemas,
  getBrowserSpecificMetaTags,
  type UltraAdvancedSEOConfig
} from '@/utils/ultraAdvancedSEO';

interface UltraSEOHeadProps extends UltraAdvancedSEOConfig {
  locale?: string;
  robots?: string;
  charset?: string;
  enableSitemapNav?: boolean;
}

export const UltraSEOHeadComponent: React.FC<UltraSEOHeadProps> = ({
  pageType,
  title,
  description,
  keywords = [],
  canonical,
  image,
  breadcrumbs,
  faqs,
  events,
  products,
  videos,
  articles,
  rating,
  locale = 'en_IN',
  robots = 'index, follow',
  charset = 'UTF-8',
  enableSitemapNav = true
}) => {
  // Generate all schemas
  const schemas = generateUltraAdvancedSchemas({
    pageType,
    title,
    description,
    keywords,
    canonical,
    image,
    breadcrumbs,
    faqs,
    events,
    products,
    videos,
    articles,
    rating
  });

  // Browser-specific meta tags
  const browserMetas = getBrowserSpecificMetaTags();

  // All languages for hreflang
  const languages = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa', 'ur', 'or'];

  // Keywords string
  const keywordString = keywords.slice(0, 20).join(', ');

  return (
    <Helmet>
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* BASIC META TAGS */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <meta charSet={charset} />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordString} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="bingbot" content={robots} />
      <meta name="author" content="ISHU Team" />
      <meta name="creator" content="ISHU - Indian StudentHub University" />
      <meta name="publisher" content="ISHU" />
      <meta name="revisit-after" content="7 days" />
      <meta name="language" content="English" />
      <meta name="rating" content="general" />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* CANONICAL TAG - CRITICAL FOR SEO */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      {canonical && <link rel="canonical" href={canonical} />}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* HREFLANG - MULTI-LANGUAGE SUPPORT */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      {languages.map((lang) => (
        <link
          key={`hreflang-${lang}`}
          rel="alternate"
          hrefLang={lang}
          href={canonical ? `${canonical}?lang=${lang}` : `https://ishu.fun?lang=${lang}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonical || 'https://ishu.fun'} />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* OPEN GRAPH / FACEBOOK */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <meta property="og:type" content={pageType === 'article' ? 'article' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:width" content="1200" />}
      {image && <meta property="og:image:height" content="630" />}
      {image && <meta property="og:image:alt" content={title} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content="ISHU - Indian StudentHub University" />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content="hi_IN" />
      <meta property="og:locale:alternate" content="ta_IN" />
      <meta property="og:locale:alternate" content="te_IN" />
      <meta property="og:locale:alternate" content="bn_IN" />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* TWITTER CARD */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:site" content="@ishufun" />
      <meta name="twitter:creator" content="@ishufun" />
      <meta name="twitter:domain" content="ishu.fun" />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* VIEWPORT & MOBILE OPTIMIZATION */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="ISHU" />
      <meta name="format-detection" content="telephone=no" />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* BROWSER-SPECIFIC META TAGS */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      {Object.entries(browserMetas).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* CHROME / CHROMIUM OPTIMIZATION */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <meta name="chrome-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="chrome-mobile-web-app-capable" content="yes" />
      <link rel="manifest" href="/manifest.json" />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* EDGE & WINDOWS OPTIMIZATION */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#3f51b5" />
      <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
      <meta name="msapplication-navbutton-color" content="#3f51b5" />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* ICONS & BRANDING */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3f51b5" />
      <meta name="theme-color" content="#3f51b5" />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* SECURITY & PERFORMANCE */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <meta httpEquiv="x-ua-compatible" content="IE=edge" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      <meta name="color-scheme" content="light dark" />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* VERIFICATION TAGS */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <meta name="google-site-verification" content="verification-code-here" />
      <meta name="msvalidate.01" content="verification-code-here" />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* SEO MONITORING & ANALYTICS */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <meta name="google_analytics" id="GA_TRACKING_ID" />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* GEOGRAPHIC TARGETING */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <meta name="geo.position" content="20.5937;78.9629" /> {/* India coordinates */}
      <meta name="geo.placename" content="India" />
      <meta name="geo.region" content="IN" />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* STRUCTURED DATA / JSON-LD SCHEMAS */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      {schemas.map((schema, idx) => (
        <script key={`schema-${idx}`} type="application/ld+json">
          {JSON.stringify(schema, null, 2)}
        </script>
      ))}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* PRELOAD & PREFETCH OPTIMIZATION */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="preload" as="image" href={image || '/og-image.png'} />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* ALTERNATE VERSIONS */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      {canonical && <link rel="alternate" type="application/json+ld" href={`${canonical}.json`} />}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* ARTICLE-SPECIFIC TAGS (if applicable) */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      {articles && articles[0] && (
        <>
          <meta property="article:published_time" content={articles[0].datePublished} />
          <meta property="article:modified_time" content={articles[0].dateModified} />
          <meta property="article:author" content={articles[0].author} />
          <meta property="article:section" content={pageType} />
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* FACEBOOK CUSTOM AUDIENCE PIXEL */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <meta property="fb:app_id" content="YOUR_FB_APP_ID" />

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* SCHEMA.ORG RICH SNIPPETS */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': canonical,
          name: title,
          description: description,
          image: image || '/og-image.png',
          url: canonical,
          isPartOf: {
            '@id': 'https://ishu.fun'
          }
        })}
      </script>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* MICRODATA FOR ENHANCED SEARCH RESULTS */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}

      {enableSitemapNav && (
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      )}
    </Helmet>
  );
};

export default UltraSEOHeadComponent;
