/**
 * IshuBrandSEO.tsx — Global Ishu Personal Brand Schema
 *
 * Injected on EVERY page via Layout.tsx.
 * Purpose: Help Google rank "Ishu" personal name searches → ishu.fun #1
 *
 * Includes:
 * - Person schema (Ishu as a real person)
 * - Brand/Organization schema reinforcement
 * - Consistent Ishu brand signals across all pages
 */

import { Helmet } from "react-helmet-async";

const IshuBrandSEO = () => {
  return (
    <Helmet>
      {/* Global Ishu brand meta — reinforced on every page */}
      <meta name="ishu" content="ishu.fun — Indian StudentHub University by Ishu" />
      <meta name="brand" content="ISHU, Ishu, ishu.fun, Indian StudentHub University" />

      {/* Person Schema — "Ishu" ranks as a real person in Google */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Ishu",
        "alternateName": [
          "ISHU", "इशु", "Ishu India", "Ishu Fun", "Ishu Website",
          "Ishu Platform", "Ishu Student", "Ishu Education", "Ishu Developer",
          "Ishu Creator", "Ishu Founder", "Indian StudentHub University"
        ],
        "description": "Ishu is the founder and creator of ISHU — Indian StudentHub University (ishu.fun). India's #1 free platform for government exam results, sarkari naukri, PDF tools, YouTube downloader, Terabox downloader, and 700+ live Indian TV channels.",
        "url": "https://ishu.fun",
        "image": "https://ishu.fun/og-image-1200x630.png",
        "email": "ishukryk@gmail.com",
        "telephone": "+91-8986985813",
        "nationality": { "@type": "Country", "name": "India" },
        "sameAs": [
          "https://ishu.fun",
          "https://twitter.com/ishufun",
          "https://instagram.com/ishu.fun",
          "https://youtube.com/@ishufun",
          "https://facebook.com/ishufun"
        ],
        "knowsAbout": [
          "Government Jobs India", "Sarkari Result", "Sarkari Naukri",
          "PDF Tools Online", "YouTube Video Downloader", "Terabox Downloader",
          "Live TV Streaming India", "Education Technology", "Student Platform",
          "Web Development", "React JavaScript", "SEO Optimization",
          "Free CV Maker", "Free Resume Builder", "Biodata Maker",
          "UPSC Exam", "SSC CGL", "Banking Jobs", "Railway Jobs",
          "NTA JEE NEET", "Admit Card", "Answer Key", "Sarkari Vacancy",
          "Indian TV Channels", "Hindi News Live", "Government Exam Results"
        ],
        "jobTitle": "Founder & Full-Stack Developer",
        "worksFor": {
          "@type": "Organization",
          "name": "ISHU — Indian StudentHub University",
          "url": "https://ishu.fun"
        }
      })}</script>

      {/* WebPage Schema reinforcing "ishu.fun" as Ishu's website */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://ishu.fun/#website",
        "url": "https://ishu.fun",
        "name": "ISHU — Indian StudentHub University",
        "alternateName": ["ISHU", "ishu.fun", "Ishu Website", "Ishu Platform", "इशु वेबसाइट"],
        "description": "ISHU (ishu.fun) — Ishu's website. India's #1 free platform for government exam results, sarkari naukri, 100+ PDF tools, YouTube downloader, Terabox downloader, 700+ live Indian TV channels, news, CV builder and more.",
        "inLanguage": ["en-IN", "hi-IN"],
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://ishu.fun/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "creator": {
          "@type": "Person",
          "name": "Ishu",
          "url": "https://ishu.fun"
        },
        "publisher": {
          "@type": "Organization",
          "name": "ISHU — Indian StudentHub University",
          "url": "https://ishu.fun",
          "logo": {
            "@type": "ImageObject",
            "url": "https://ishu.fun/logo.png"
          }
        }
      })}</script>
    </Helmet>
  );
};

export default IshuBrandSEO;
