/**
 * ComprehensiveSEO.tsx - Complete SEO Component
 * 
 * Handles all SEO meta tags, structured data, and Open Graph tags
 * Use this component in the <head> of each page for complete SEO coverage
 */
import { Helmet } from "react-helmet-async";
import { SEOConfig, generateMetaTags, SITE_CONFIG } from "@/utils/seo";

interface ComprehensiveSEOProps extends SEOConfig {
  structuredData?: any[];
  noindex?: boolean;
  nofollow?: boolean;
}

const ComprehensiveSEO = ({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  ogType,
  twitterCard,
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
  structuredData = [],
  noindex = false,
  nofollow = false,
}: ComprehensiveSEOProps) => {
  const metaTags = generateMetaTags({
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType,
    twitterCard,
    author,
    publishedTime,
    modifiedTime,
    section,
    tags,
  });

  const robotsContent = noindex || nofollow
    ? `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`
    : metaTags.robots;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{metaTags.title}</title>
      <meta name="title" content={metaTags.title} />
      <meta name="description" content={metaTags.description} />
      {metaTags.keywords && <meta name="keywords" content={metaTags.keywords} />}
      {metaTags.author && <meta name="author" content={metaTags.author} />}
      <link rel="canonical" href={metaTags.canonical} />

      {/* Robots */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content={robotsContent} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={metaTags["og:type"]} />
      <meta property="og:url" content={metaTags["og:url"]} />
      <meta property="og:title" content={metaTags["og:title"]} />
      <meta property="og:description" content={metaTags["og:description"]} />
      <meta property="og:image" content={metaTags["og:image"]} />
      <meta property="og:image:width" content={metaTags["og:image:width"]} />
      <meta property="og:image:height" content={metaTags["og:image:height"]} />
      <meta property="og:site_name" content={metaTags["og:site_name"]} />
      <meta property="og:locale" content={metaTags["og:locale"]} />

      {/* Twitter */}
      <meta property="twitter:card" content={metaTags["twitter:card"]} />
      <meta property="twitter:url" content={metaTags["og:url"]} />
      <meta property="twitter:title" content={metaTags["twitter:title"]} />
      <meta property="twitter:description" content={metaTags["twitter:description"]} />
      <meta property="twitter:image" content={metaTags["twitter:image"]} />
      <meta property="twitter:site" content={metaTags["twitter:site"]} />
      <meta property="twitter:creator" content={metaTags["twitter:creator"]} />

      {/* Article Meta (if applicable) */}
      {metaTags["article:published_time"] && (
        <meta property="article:published_time" content={metaTags["article:published_time"]} />
      )}
      {metaTags["article:modified_time"] && (
        <meta property="article:modified_time" content={metaTags["article:modified_time"]} />
      )}
      {metaTags["article:section"] && (
        <meta property="article:section" content={metaTags["article:section"]} />
      )}
      {metaTags["article:tag"] && (
        <meta property="article:tag" content={metaTags["article:tag"]} />
      )}

      {/* Additional Meta */}
      <meta name="theme-color" content={metaTags["theme-color"]} />
      <meta name="mobile-web-app-capable" content={metaTags["mobile-web-app-capable"]} />
      <meta name="apple-mobile-web-app-capable" content={metaTags["apple-mobile-web-app-capable"]} />
      <meta name="apple-mobile-web-app-status-bar-style" content={metaTags["apple-mobile-web-app-status-bar-style"]} />

      {/* Geo Tags for India */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="geo.position" content="20.5937;78.9629" />
      <meta name="ICBM" content="20.5937, 78.9629" />

      {/* Language */}
      <meta httpEquiv="content-language" content="en-IN" />
      <meta name="language" content="English" />

      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default ComprehensiveSEO;
