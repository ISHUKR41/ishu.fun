/**
 * ADVANCED SEO HEAD COMPONENT
 * 
 * Complete SEO integration with:
 * - Helmet for meta tags
 * - Structured data (schema markup)
 * - Open Graph & Twitter cards
 * - Canonical URLs
 * - Language alternates (hreflang)
 * - Preload/Prefetch for performance
 * - Mobile optimization
 */

import { Helmet } from "react-helmet-async";
import { seoOptimizer, OptimizedSEOData, SEOScore } from "@/utils/seoOptimizer";
import { COMPLETE_KEYWORDS } from "@/data/keywords-database";

interface AdvancedSEOHeadProps {
  // Required
  title: string;
  description: string;
  keyword?: string;
  contentType?: 
    | "job_listing"
    | "tool"
    | "news"
    | "article"
    | "faq"
    | "homepage"
    | "product"
    | "service";

  // Optional
  url?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  category?: string;
  tags?: string[];
  imageAlt?: string;
  twitterHandle?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  structuredData?: Record<string, unknown>;
  noindex?: boolean;
  nofollow?: boolean;
  isMobileOptimized?: boolean;
  isVoiceSearchOptimized?: boolean;
}

/**
 * Advanced SEO Head Component
 * Manages all SEO, social, and performance meta tags
 */
export const AdvancedSEOHead = ({
  title,
  description,
  keyword = "",
  contentType = "webpage",
  url,
  ogImage,
  ogType = "website",
  canonicalUrl,
  author = "ISHU - Indian StudentHub University",
  publishedDate,
  modifiedDate,
  category,
  tags = [],
  imageAlt = "ISHU - Indian StudentHub University",
  twitterHandle = "@ishufun",
  breadcrumbs = [],
  structuredData,
  noindex = false,
  nofollow = false,
  isMobileOptimized = true,
  isVoiceSearchOptimized = true,
}: AdvancedSEOHeadProps) => {
  const siteUrl = "https://ishu.fun";
  const finalUrl = url || canonicalUrl || siteUrl;
  const finalOgImage = ogImage || `${siteUrl}/og-image.png`;

  // Optimize SEO data if keyword is provided
  let optimizedData: OptimizedSEOData | null = null;
  if (keyword) {
    optimizedData = seoOptimizer.generateOptimizedSEOData(
      contentType,
      keyword,
      title,
      description,
      finalUrl,
      ogImage
    );
  }

  const finalTitle = optimizedData?.title || title;
  const finalDescription = optimizedData?.description || description;
  const finalKeywords = optimizedData?.keywords
    ? optimizedData.keywords.slice(0, 20)
    : [keyword].filter(Boolean);

  // Generate schema
  const finalStructuredData =
    structuredData || optimizedData?.structuredData || { "@type": "WebPage" };

  // Generate breadcrumb schema if provided
  const breadcrumbSchema =
    breadcrumbs.length > 0
      ? seoOptimizer.generateBreadcrumbs(breadcrumbs.map((b) => b.name))
      : null;

  // Robots meta
  const robotsContent = `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}, max-image-preview:large, max-snippet:-1, max-video-preview:-1`;

  // Voice search keywords
  const voiceKeywords = isVoiceSearchOptimized && keyword ? seoOptimizer.getVoiceSearchKeywords(keyword) : [];

  return (
    <Helmet>
      {/* ─── Core SEO Meta Tags ─── */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords.join(", ")} />
      <meta name="author" content={author} />
      <meta name="rating" content="general" />
      <meta name="coverage" content="India" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />

      {/* ─── Robots & Crawlers ─── */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content="index, follow" />
      <meta name="slurp" content="index, follow" />
      <meta name="msnbot" content="index, follow" />
      <meta name="yandexbot" content="index, follow" />

      {/* ─── Canonical URL ─── */}
      <link rel="canonical" href={canonicalUrl || finalUrl} />

      {/* ─── Mobile & Viewport ─── */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#1e293b" media="(prefers-color-scheme: dark)" />
      <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />

      {/* ─── Language & Region ─── */}
      <meta name="language" content="English, Hindi" />
      <html lang="en" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="geo.position" content="20.5937;78.9629" />
      <meta name="ICBM" content="20.5937, 78.9629" />

      {/* ─── Alternate Language Links (hreflang) ─── */}
      <link rel="alternate" hrefLang="en-IN" href={finalUrl} />
      <link rel="alternate" hrefLang="en" href={finalUrl} />
      <link rel="alternate" hrefLang="hi-IN" href={finalUrl} />
      <link rel="alternate" hrefLang="ta-IN" href={finalUrl} />
      <link rel="alternate" hrefLang="te-IN" href={finalUrl} />
      <link rel="alternate" hrefLang="bn-IN" href={finalUrl} />
      <link rel="alternate" hrefLang="mr-IN" href={finalUrl} />
      <link rel="alternate" hrefLang="gu-IN" href={finalUrl} />
      <link rel="alternate" hrefLang="kn-IN" href={finalUrl} />
      <link rel="alternate" hrefLang="ml-IN" href={finalUrl} />
      <link rel="alternate" hrefLang="pa-IN" href={finalUrl} />
      <link rel="alternate" hrefLang="ur-IN" href={finalUrl} />
      <link rel="alternate" hrefLang="x-default" href={finalUrl} />

      {/* ─── Open Graph (Facebook, LinkedIn) ─── */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:secure_url" content={finalOgImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:site_name" content="ISHU - Indian StudentHub University" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="hi_IN" />
      <meta property="og:locale:alternate" content="ta_IN" />
      <meta property="og:locale:alternate" content="te_IN" />
      <meta property="og:locale:alternate" content="bn_IN" />

      {/* ─── Article / News Tags (for blog posts) ─── */}
      {publishedDate && <meta property="article:published_time" content={publishedDate} />}
      {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
      {category && <meta property="article:section" content={category} />}
      {tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* ─── Twitter Card ─── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:image:alt" content={imageAlt} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:domain" content="ishu.fun" />

      {/* ─── Structured Data (JSON-LD) ─── */}
      <script type="application/ld+json">{JSON.stringify(finalStructuredData)}</script>

      {/* ─── Breadcrumb Schema ─── */}
      {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}

      {/* ─── Organization Schema ─── */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ISHU - Indian StudentHub University",
          alternateName: ["ISHU", "ishu.fun", "Indian StudentHub"],
          url: siteUrl,
          logo: `${siteUrl}/logo.png`,
          description:
            "India's #1 free platform for government exam results, sarkari naukri vacancies, admit cards. 100+ free PDF tools, 700+ live TV channels, video downloaders & daily news.",
          sameAs: [
            "https://twitter.com/ishufun",
            "https://facebook.com/ishufun",
            "https://instagram.com/ishu.fun",
          ],
          contactPoint: [
            {
              "@type": "ContactPoint",
              telephone: "+91-8986985813",
              contactType: "customer support",
              email: "ishukryk@gmail.com",
              availableLanguage: ["English", "Hindi"],
              areaServed: "IN",
            },
          ],
          address: {
            "@type": "PostalAddress",
            addressCountry: "IN",
            addressLocality: "India",
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
        })}
      </script>

      {/* ─── WebSite Schema with Sitelinks Search Box ─── */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ISHU",
          url: siteUrl,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${siteUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        })}
      </script>

      {/* ─── Voice Search Optimization ─── */}
      {isVoiceSearchOptimized && voiceKeywords.length > 0 && (
        <meta name="voice-search-keywords" content={voiceKeywords.slice(0, 5).join(", ")} />
      )}

      {/* ─── Performance Optimization ─── */}
      <link rel="preload" as="image" href={finalOgImage} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://ishu.fun" />
      <link rel="prerender" href={`${siteUrl}/`} />

      {/* ─── AMP Link (if applicable) ─── */}
      <link rel="amphtml" href={`${finalUrl}?amp=1`} />

      {/* ─── App Links ─── */}
      <meta name="apple-itunes-app" content="app-id=YOUR_APP_ID, app-argument=ishu://home" />
      <meta name="google-play-app" content="app-id=YOUR_PACKAGE_NAME" />

      {/* ─── Verification Tags ─── */}
      <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
      <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />

      {/* ─── Additional SEO Meta ─── */}
      <meta httpEquiv="content-language" content="en-IN, hi-IN" />
      <meta name="creator" content="ISHU Team" />
      <meta name="publisher" content="ISHU - Indian StudentHub University" />
      <meta name="audience" content="Students, Job Seekers, India" />
      <meta name="googlebot-news" content="index, follow" />
      <meta name="copyright" content="© 2026 ISHU - Indian StudentHub University. All rights reserved." />
      <meta name="robots-index" content="true" />
      <meta name="robots-follow" content="true" />

      {/* ─── Referrer Policy ─── */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      {/* ─── Security & CSP ─── */}
      <meta
        httpEquiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:;"
      />

      {/* ─── Additional Icons & Favicons ─── */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      {/* ─── Social Proof (Reviews, Ratings) ─── */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "ISHU - Indian StudentHub University",
          url: siteUrl,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "50000+",
            bestRating: "5",
            worstRating: "1",
          },
        })}
      </script>
    </Helmet>
  );
};

export default AdvancedSEOHead;
