/**
 * IshuBrandSEO.tsx — Global Ishu Personal Brand Schema
 *
 * Injected on EVERY page via Layout.tsx.
 * Purpose:
 * 1. Help Google rank "Ishu" personal name searches → ishu.fun #1
 * 2. Reinforce ISHU brand signals on every page
 * 3. Add comprehensive service catalog for all features
 * 4. Boost sarkari result, CV/biodata, TV keyword authority
 */

import { Helmet } from "react-helmet-async";

const IshuBrandSEO = () => {
  return (
    <Helmet>
      {/* ═══ Global ISHU brand meta signals ═══ */}
      <meta name="ishu" content="ishu.fun — Indian StudentHub University by Ishu" />
      <meta name="brand" content="ISHU, Ishu, ishu.fun, Indian StudentHub University, Sarkari Result ISHU" />
      <meta name="application-name" content="ISHU — ishu.fun" />
      <meta name="subject" content="Sarkari Result, Government Jobs, Free PDF Tools, Live TV India, CV Resume Biodata Maker, Video Downloader" />
      <meta name="classification" content="Education, Government Jobs, Utilities, Entertainment, News" />
      <meta name="category" content="Education Portal, Sarkari Result, PDF Tools, Live TV, CV Maker, Video Downloader" />
      <meta name="identifier-URL" content="https://ishu.fun" />
      <meta name="pagename" content="ISHU — Indian StudentHub University | ishu.fun" />
      <meta name="topic" content="India's #1 free education platform for sarkari result, government jobs, PDF tools, live TV, resume builder" />

      {/* ═══ Person Schema — "Ishu" ranks as a real person in Google Search ═══ */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://ishu.fun/#person",
        "name": "Ishu",
        "alternateName": [
          "ISHU", "इशु", "Ishu India", "Ishu Fun", "Ishu Website",
          "Ishu Platform", "Ishu Student", "Ishu Education", "Ishu Developer",
          "Ishu Creator", "Ishu Founder", "Indian StudentHub University",
          "Ishu Sarkari Result", "Ishu Tools", "Ishu PDF Tools",
          "Ishu Live TV", "Ishu YouTube Downloader", "Ishu Terabox",
          "Ishu CV Maker", "Ishu Resume Builder", "Ishu Biodata"
        ],
        "description": "Ishu is the founder and creator of ISHU — Indian StudentHub University (ishu.fun). India's #1 free platform for government exam results, sarkari naukri, PDF tools, YouTube downloader, Terabox downloader, 700+ live Indian TV channels, free CV/Resume/Biodata maker, and daily news.",
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
          "https://facebook.com/ishufun",
          "https://linkedin.com/company/ishufun"
        ],
        "knowsAbout": [
          "Government Jobs India", "Sarkari Result 2026", "Sarkari Naukri 2026",
          "PDF Tools Online Free", "YouTube Video Downloader", "Terabox Downloader",
          "Live TV Streaming India", "Education Technology", "Student Platform India",
          "Web Development", "React TypeScript", "Node.js", "SEO Optimization",
          "Free CV Maker India", "Free Resume Builder", "Biodata Maker Free",
          "Marriage Biodata Format", "ATS Resume India", "Professional CV Templates",
          "UPSC Exam Results", "SSC CGL Exam", "Banking Jobs IBPS SBI",
          "Railway Jobs RRB NTPC", "NTA JEE NEET Results",
          "Admit Card Download", "Answer Key Download", "Sarkari Vacancy",
          "Indian TV Channels Online", "Hindi News Live TV", "Government Exam Results",
          "Current Affairs India", "Daily News Hindi English", "PDF Merge Free",
          "PDF Compress Online", "PDF to Word Converter"
        ],
        "jobTitle": "Founder & Full-Stack Developer",
        "worksFor": {
          "@type": "Organization",
          "@id": "https://ishu.fun/#organization",
          "name": "ISHU — Indian StudentHub University",
          "url": "https://ishu.fun"
        }
      })}</script>

      {/* ═══ WebSite Schema — reinforces ishu.fun as Ishu's brand website ═══ */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://ishu.fun/#website",
        "url": "https://ishu.fun",
        "name": "ISHU — Indian StudentHub University",
        "alternateName": [
          "ISHU", "ishu.fun", "Ishu Website", "Ishu Platform", "इशु वेबसाइट",
          "Ishu Sarkari Result", "ISHU Tools", "ISHU Live TV", "ISHU CV Maker",
          "Indian StudentHub University", "India #1 Free Student Platform"
        ],
        "description": "ISHU (ishu.fun) — Ishu ka website. India's #1 free platform: Sarkari Result 2026, Sarkari Naukri, Government Exam Results, 100+ Free PDF Tools, 700+ Live Indian TV Channels, YouTube Downloader, Terabox Downloader, Free CV/Resume/Biodata Maker, Daily News. No signup required!",
        "inLanguage": ["en-IN", "hi-IN", "ta-IN", "te-IN", "bn-IN", "mr-IN"],
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://ishu.fun/results?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          },
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://ishu.fun/tools?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "creator": {
          "@type": "Person",
          "@id": "https://ishu.fun/#person",
          "name": "Ishu",
          "url": "https://ishu.fun"
        },
        "publisher": {
          "@type": "Organization",
          "@id": "https://ishu.fun/#organization",
          "name": "ISHU — Indian StudentHub University",
          "url": "https://ishu.fun",
          "logo": {
            "@type": "ImageObject",
            "url": "https://ishu.fun/logo.png"
          }
        }
      })}</script>

      {/* ═══ Organization Schema — complete ISHU brand entity ═══ */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": ["Organization", "EducationalOrganization"],
        "@id": "https://ishu.fun/#organization",
        "name": "ISHU — Indian StudentHub University",
        "alternateName": [
          "ISHU", "ishu.fun", "Indian StudentHub", "ISHU Platform",
          "ISHU India", "ISHU Student Hub", "Ishu Education", "इशु",
          "ISHU Sarkari Result", "ISHU Tools", "ISHU Live TV"
        ],
        "description": "ISHU (ishu.fun) is India's #1 free educational platform for government exam results, sarkari naukri vacancies, admit cards, 100+ free PDF tools, 700+ live Indian TV channels, YouTube video downloader, Terabox downloader, free CV/Resume/Biodata maker, and 1000+ daily news articles.",
        "url": "https://ishu.fun",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ishu.fun/logo.png",
          "width": 200,
          "height": 200
        },
        "image": "https://ishu.fun/og-image-1200x630.png",
        "email": "support@ishu.fun",
        "telephone": "+91-8986985813",
        "foundingDate": "2024",
        "areaServed": { "@type": "Country", "name": "India" },
        "sameAs": [
          "https://twitter.com/ishufun",
          "https://facebook.com/ishufun",
          "https://instagram.com/ishu.fun",
          "https://youtube.com/@ishufun"
        ],
        "knowsAbout": [
          "Government Jobs India", "Sarkari Result", "Sarkari Naukri 2026",
          "UPSC", "SSC CGL", "IBPS PO", "SBI PO", "RRB NTPC", "NTA JEE NEET",
          "Admit Card", "Answer Key", "PDF Tools", "YouTube Downloader",
          "Terabox Downloader", "Live TV India", "CV Maker", "Resume Builder",
          "Biodata Maker", "Marriage Biodata", "Current Affairs"
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "ISHU — All Free Services",
          "itemListElement": [
            {
              "@type": "OfferCatalog",
              "name": "Government Exam Results & Sarkari Naukri",
              "url": "https://ishu.fun/results",
              "description": "Free sarkari result, government exam results, vacancies, admit cards for UPSC, SSC, Banking, Railways, NTA, all 36 states"
            },
            {
              "@type": "OfferCatalog",
              "name": "100+ Free PDF Tools",
              "url": "https://ishu.fun/tools",
              "description": "Merge PDF, compress PDF, convert PDF to Word/JPG, split PDF, edit PDF, sign PDF, OCR PDF, watermark — all free"
            },
            {
              "@type": "OfferCatalog",
              "name": "YouTube Video Downloader HD",
              "url": "https://ishu.fun/tools/youtube-downloader",
              "description": "Download YouTube videos free in HD 1080p, 4K quality. No signup."
            },
            {
              "@type": "OfferCatalog",
              "name": "Terabox Downloader Free",
              "url": "https://ishu.fun/tools/terabox-downloader",
              "description": "Download Terabox videos and files free. All Terabox domains supported."
            },
            {
              "@type": "OfferCatalog",
              "name": "700+ Live Indian TV Channels",
              "url": "https://ishu.fun/tv",
              "description": "Watch Aaj Tak, NDTV, Star Plus, Zee TV, DD News, regional channels live free"
            },
            {
              "@type": "OfferCatalog",
              "name": "Free CV / Resume / Biodata Maker",
              "url": "https://ishu.fun/cv",
              "description": "Create professional Resume, CV, and marriage Biodata free. Download PDF instantly."
            },
            {
              "@type": "OfferCatalog",
              "name": "Universal Video Downloader",
              "url": "https://ishu.fun/tools/universal-video-downloader",
              "description": "Download videos from Instagram, TikTok, Facebook, Twitter, Vimeo 1000+ sites free"
            },
            {
              "@type": "OfferCatalog",
              "name": "Daily News India",
              "url": "https://ishu.fun/news",
              "description": "1000+ daily news articles in Hindi and English — government jobs, education, politics, sports"
            }
          ]
        }
      })}</script>
    </Helmet>
  );
};

export default IshuBrandSEO;
