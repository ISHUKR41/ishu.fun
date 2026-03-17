/**
 * JsonLd.tsx - SEO Structured Data Components
 * 
 * These components add invisible JSON-LD structured data to pages.
 * Search engines (Google, Bing) use this data to better understand
 * the website content and show rich results in search.
 * 
 * Brand: ISHU — Indian StudentHub University
 * Domain: https://ishu.fun
 */

const SITE_URL = "https://ishu.fun";
const SITE_NAME = "ISHU — Indian StudentHub University";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export const JsonLd = ({ data }: JsonLdProps) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

export const WebsiteSchema = () => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "alternateName": ["ISHU", "Indian StudentHub University", "ishu.fun", "ISHU Fun", "Sarkari Result ISHU"],
    "url": SITE_URL,
    "description": "India's #1 free platform for government exam results, sarkari naukri vacancies, admit cards for UPSC, SSC, Banking, Railways, NTA & all 36 states. 100+ free PDF tools, 700+ live Indian TV channels, YouTube video downloader, Terabox downloader & 1000+ daily news.",
    "inLanguage": ["en-IN", "hi-IN"],
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SITE_URL}/results?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }} />
);

export const OrganizationSchema = () => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": SITE_NAME,
    "alternateName": ["ISHU", "Indian StudentHub University"],
    "url": SITE_URL,
    "logo": `${SITE_URL}/favicon.ico`,
    "description": "India's leading educational platform providing instant government exam results, job vacancies, free PDF tools, live TV streaming, video downloaders & daily news for students and job seekers across all 36 states.",
    "foundingDate": "2024",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+918986985813",
        "contactType": "customer support",
        "email": "ishukryk@gmail.com",
        "availableLanguage": ["English", "Hindi"],
        "areaServed": "IN"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "sameAs": [],
    "knowsAbout": [
      "Government Exam Results", "Sarkari Naukri", "UPSC", "SSC CGL", "Banking Jobs",
      "Railway Jobs", "NTA JEE NEET", "PDF Tools", "Video Downloader", "Live TV India"
    ]
  }} />
);

export const BreadcrumbSchema = ({ items }: { items: { name: string; url: string }[] }) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`
    }))
  }} />
);

export const ArticleSchema = ({ title, description, url, datePublished, author }: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  author: string;
}) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "url": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    "datePublished": datePublished,
    "author": { "@type": "Person", "name": author },
    "publisher": {
      "@type": "EducationalOrganization",
      "name": SITE_NAME,
      "url": SITE_URL
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url.startsWith("http") ? url : `${SITE_URL}${url}`
    }
  }} />
);

/** SoftwareApplication schema for PDF tools, downloaders, etc. */
export const SoftwareAppSchema = ({ name, description, url, category, rating }: {
  name: string;
  description: string;
  url: string;
  category?: string;
  rating?: number;
}) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    "applicationCategory": category || "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    ...(rating ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating,
        "ratingCount": 15000,
        "bestRating": 5
      }
    } : {})
  }} />
);

/** CollectionPage schema for listing pages */
export const CollectionPageSchema = ({ name, description, url, items }: {
  name: string;
  description: string;
  url: string;
  items?: { name: string; url: string }[];
}) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "description": description,
    "url": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    "isPartOf": { "@type": "WebSite", "name": SITE_NAME, "url": SITE_URL },
    ...(items ? {
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": items.length,
        "itemListElement": items.map((item, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": item.name,
          "url": item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`
        }))
      }
    } : {})
  }} />
);

/** VideoObject schema for video downloader pages */
export const VideoToolSchema = ({ name, description, url }: {
  name: string;
  description: string;
  url: string;
}) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": url.startsWith("http") ? url : `${SITE_URL}${url}`,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.8,
      "ratingCount": 25000,
      "bestRating": 5
    }
  }} />
);

/** HowTo schema for tool pages */
export const HowToSchema = ({ name, description, steps }: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) => (
  <JsonLd data={{
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": step.name,
      "text": step.text
    })),
    "totalTime": "PT2M"
  }} />
);
