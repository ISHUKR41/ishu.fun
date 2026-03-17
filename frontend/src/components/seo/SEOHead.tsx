/**
 * SEOHead.tsx - Dynamic Per-Page SEO Meta Tags
 * 
 * Uses react-helmet-async to dynamically inject <head> tags for each page.
 * Handles: title, description, keywords, canonical, OG, Twitter, hreflang.
 * 
 * Domain: https://ishu.fun
 * Brand: ISHU — Indian StudentHub University
 */

import { Helmet } from "react-helmet-async";

const SITE_URL = "https://ishu.fun";
const SITE_NAME = "ISHU — Indian StudentHub University";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  noindex?: boolean;
}

const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
}: SEOHeadProps) => {
  const fullTitle = title.includes("ISHU") ? title : `${title} | ISHU — Indian StudentHub University`;
  const canonicalUrl = canonical
    ? canonical.startsWith("http") ? canonical : `${SITE_URL}${canonical}`
    : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      <meta name="author" content={SITE_NAME} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="hi_IN" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* hreflang for Indian audience */}
      {canonicalUrl && <link rel="alternate" hrefLang="en-in" href={canonicalUrl} />}
      {canonicalUrl && <link rel="alternate" hrefLang="hi-in" href={canonicalUrl} />}
      {canonicalUrl && <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />}

      {/* Mobile & App */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="ISHU" />
      <meta name="application-name" content="ISHU" />

      {/* Geo targeting for India */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="ICBM" content="20.5937, 78.9629" />
      <meta name="language" content="English, Hindi" />
      <meta name="revisit-after" content="1 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
    </Helmet>
  );
};

export default SEOHead;

/**
 * SEO_DATA - Comprehensive per-page SEO configuration
 * Each page gets unique title, description, and massive keywords
 */
export const SEO_DATA = {
  home: {
    title: "ISHU — Indian StudentHub University | #1 Government Exam Results, Free PDF Tools, Live TV & Video Downloader",
    description: "ISHU (ishu.fun) — India's #1 free platform for government exam results, sarkari naukri vacancies, admit cards for UPSC, SSC, Banking, Railways, NTA & all 36 states. 100+ free PDF tools, 700+ live Indian TV channels, YouTube video downloader, Terabox downloader, universal video downloader & 1000+ daily news. No signup needed!",
    keywords: "ISHU, ishu.fun, Indian StudentHub University, government jobs India, sarkari result, sarkari naukri, government exam results 2025 2026, UPSC result, SSC CGL result, banking jobs India, railway recruitment, NTA JEE NEET result, admit card download, exam results India, free PDF tools online, merge PDF free, compress PDF online, PDF to Word converter free, YouTube video downloader HD, Terabox downloader free, live TV India free, Indian TV channels online free, hindi news live TV, sarkari exam, government vacancies 2026, central government jobs, state government jobs, latest government jobs, exam notification, answer key download, syllabus download, free online tools India, PDF converter free, video downloader online free, live streaming Indian channels, education platform India, student hub, exam preparation, current affairs India, daily news hindi english, free resume maker, CV builder free online",
    canonical: "/",
  },
  results: {
    title: "Government Exam Results 2025-2026 | Sarkari Result, Vacancies, Admit Cards — ISHU",
    description: "Check latest government exam results, sarkari naukri vacancies, admit cards & answer keys for UPSC, SSC CGL, Banking (IBPS, SBI), Railways (RRB), NTA (JEE, NEET), Defence (CDS, NDA), Teaching, PSU & all 36 state exams. Updated daily on ishu.fun with instant notifications.",
    keywords: "sarkari result, sarkari naukri, government exam results, UPSC result 2026, SSC CGL result, SSC CHSL result, IBPS PO result, SBI PO result, SBI Clerk result, RRB NTPC result, RRB Group D result, NTA JEE Main result, NEET result 2026, admit card 2026, answer key 2026, government jobs India, central government vacancy, state government vacancy, latest sarkari result, exam notification 2026, railway recruitment 2026, bank recruitment 2026, defence jobs India, CDS result, NDA result, CTET result, UPTET result, Bihar police result, UP police result, Rajasthan police result, government exam calendar 2026, freejobalert, rojgar result, employment news, vacancy 2026",
    canonical: "/results",
  },
  tools: {
    title: "100+ Free PDF Tools Online — Merge, Compress, Convert PDF | ISHU Tools",
    description: "Use 100+ free online PDF tools on ishu.fun — merge PDF, compress PDF, convert PDF to Word/JPG/PNG, split PDF, edit PDF, sign PDF, rotate, protect, unlock, OCR & more. No signup, no watermark, files processed in your browser. India's most trusted free PDF toolkit.",
    keywords: "free PDF tools online, merge PDF free, compress PDF online, PDF to Word converter, Word to PDF converter, PDF to JPG converter, JPG to PDF converter, PNG to PDF, split PDF free, edit PDF online free, sign PDF online, rotate PDF, protect PDF password, unlock PDF free, OCR PDF free, watermark PDF, PDF editor online free, convert PDF free, PDF converter online, smallpdf alternative free, ilovepdf alternative, PDF tools no signup, free online PDF editor, compress PDF without quality loss, merge PDF files online, best free PDF tools India, PDF toolkit online, document converter free",
    canonical: "/tools",
  },
  youtubeDownloader: {
    title: "YouTube Video Downloader HD Free — Download YouTube Videos Online | ISHU",
    description: "Download YouTube videos in HD 1080p, 4K quality for free on ishu.fun. No signup required. Paste URL, preview video, select quality (360p to 4K) and download. Fast, safe & 100% free YouTube video downloader online.",
    keywords: "YouTube video downloader, download YouTube video free, YouTube downloader HD, YouTube video download online, YouTube to MP4, YouTube downloader 1080p, YouTube downloader 4K, free YouTube downloader, YouTube video save, download YouTube video HD free, best YouTube downloader, YouTube download without app, YouTube video downloader online free, yt downloader, YouTube se video download, YouTube video download kaise kare, YouTube downloader no signup, fast YouTube downloader, safe YouTube downloader, YouTube to MP4 converter free",
    canonical: "/tools/youtube-downloader",
  },
  teraboxDownloader: {
    title: "Terabox Video Downloader Free — Download Terabox Files Online | ISHU",
    description: "Download Terabox videos and files for free on ishu.fun. Paste share link, preview file, and download instantly. Works with all Terabox domains (terabox.com, teraboxapp.com, 1024tera.com). No signup, 100% free Terabox downloader.",
    keywords: "Terabox downloader, Terabox video downloader, download Terabox files free, Terabox link downloader, Terabox direct download, free Terabox downloader, Terabox video download online, Terabox downloader without app, teraboxapp downloader, 1024tera downloader, Terabox se download kaise kare, Terabox file downloader free, Terabox video player online, best Terabox downloader, Terabox download link generator, Terabox free download 2026",
    canonical: "/tools/terabox-downloader",
  },
  universalVideoDownloader: {
    title: "Universal Video Downloader Free — Download Videos from Any Site | ISHU",
    description: "Download videos from Instagram, TikTok, Facebook, Twitter, Vimeo & 1000+ sites for free on ishu.fun. Paste any video URL and download in best quality. No signup, free universal video downloader online.",
    keywords: "universal video downloader, download video from any website, Instagram video downloader, TikTok downloader, Facebook video downloader, Twitter video downloader, Vimeo downloader, free video downloader online, video downloader all sites, online video downloader free, social media video downloader, Instagram reels downloader, TikTok video download without watermark, video download free HD, best video downloader online, multi site video downloader, all in one video downloader free",
    canonical: "/tools/universal-video-downloader",
  },
  tv: {
    title: "700+ Live Indian TV Channels Free — Watch Hindi, English, Regional TV Online | ISHU",
    description: "Watch 700+ live Indian TV channels free on ishu.fun. Hindi news, entertainment, sports, movies, kids, devotional, regional & more. Aaj Tak, NDTV, Republic, Star Plus, Zee TV, Sony & all channels live streaming online free. No app needed!",
    keywords: "live TV India free, free live TV online, Indian TV channels live, watch live TV free, Hindi news live, Aaj Tak live, NDTV live, Republic TV live, ABP News live, India Today live, Star Plus live, Zee TV live, Sony TV live, Colors TV live, live streaming Indian channels, free live TV Hindi, regional TV live, Tamil TV live, Telugu TV live, Bengali TV live, Marathi TV live, live cricket streaming, live TV no app, free internet TV India, online TV channels India, live news Hindi, entertainment TV live free",
    canonical: "/tv",
  },
  news: {
    title: "Latest News India 2026 — Breaking News Hindi English, Daily News Updates | ISHU",
    description: "Read 1000+ daily news articles on ishu.fun — breaking news India, government exam news, sarkari naukri updates, education news, politics, sports, technology, entertainment, state news in Hindi & English. Real-time updates with trending topics.",
    keywords: "latest news India, breaking news today, news in Hindi, news in English, daily news India 2026, education news India, government exam news, sarkari result news, exam notification news, current affairs 2026, India news today, trending news, politics news India, sports news, technology news, entertainment news India, state news, Bihar news, UP news, Rajasthan news, MP news, Maharashtra news, current affairs daily, GK current affairs, exam current affairs",
    canonical: "/news",
  },
  blog: {
    title: "ISHU Blog — Exam Preparation Tips, Study Guides, Success Stories | ISHU",
    description: "Read expert exam preparation tips, study guides, UPSC strategy, SSC preparation, banking exam tips & success stories on ISHU blog. Free study material, previous year papers analysis, and exam pattern guides.",
    keywords: "exam preparation tips, UPSC preparation strategy, SSC CGL preparation, banking exam tips, study guide India, government exam preparation, NEET preparation tips, JEE preparation, exam success stories, study material free, previous year papers, exam pattern, syllabus download, preparation plan, topper strategy, exam tips Hindi, best study tips, how to crack government exams, competitive exam preparation India",
    canonical: "/blog",
  },
  about: {
    title: "About ISHU — India's #1 Educational Platform for Students & Job Seekers",
    description: "Learn about ISHU (Indian StudentHub University) — India's leading free educational platform. Our mission is to provide instant access to government exam results, free tools, and news for millions of students across all 36 states.",
    keywords: "about ISHU, Indian StudentHub University, ishu.fun about, ISHU platform, educational platform India, student platform India, free education tools India, ISHU team, ISHU mission, who created ISHU",
    canonical: "/about",
  },
  contact: {
    title: "Contact ISHU — Get Help, Report Issues, Partnerships | ISHU",
    description: "Contact ISHU team for support, feedback, partnerships, or to report issues. Reach us via email, phone, or WhatsApp. We respond within 24 hours.",
    keywords: "contact ISHU, ISHU support, ISHU help, ISHU email, ISHU phone number, ISHU WhatsApp, report issue ISHU, ISHU feedback, ISHU partnership",
    canonical: "/contact",
  },
  cv: {
    title: "Free CV Maker Online — Create Professional CV, Resume, Bio-Data | ISHU",
    description: "Create professional CV, resume & bio-data for free on ishu.fun. Choose from modern templates, fill your details, and download PDF instantly. Best free CV maker for Indian students and job seekers. No signup required!",
    keywords: "free CV maker online, CV builder free, resume maker free, bio-data maker online, free resume builder, professional CV template, resume template free download, CV format India, resume format for freshers, biodata format, CV maker PDF, resume maker PDF, free resume builder India, best CV maker online, job resume maker, professional resume free",
    canonical: "/cv",
  },
  resume: {
    title: "Free Resume Builder — Professional Resume Templates PDF Download | ISHU",
    description: "Build your professional resume for free on ishu.fun. Choose modern templates, enter details & download high-quality PDF. Best free resume builder for freshers and experienced job seekers in India.",
    keywords: "free resume builder, resume maker online free, resume template PDF, professional resume builder, resume format for job, resume for freshers, resume maker India, resume download PDF free, best resume builder free, online resume creator, resume format 2026, modern resume template, resume builder no signup",
    canonical: "/cv/resume",
  },
  biodata: {
    title: "Free Bio-Data Maker Online — Marriage & Job Bio-Data Templates | ISHU",
    description: "Create beautiful bio-data for marriage or job applications free on ishu.fun. Choose from professional templates, fill details, add photo & download PDF. Best free bio-data maker in India.",
    keywords: "bio-data maker free, biodata format, marriage biodata maker, biodata for job, biodata template, biodata format PDF, biodata maker online, shaadi biodata, marriage biodata format, biodata format for marriage, free biodata maker, biodata download PDF, biodata format India, biodata format Hindi",
    canonical: "/cv/bio-data",
  },
  privacy: {
    title: "Privacy Policy — ISHU (ishu.fun)",
    description: "Read ISHU's privacy policy. Learn how we collect, use, and protect your data on ishu.fun.",
    keywords: "ISHU privacy policy, ishu.fun privacy, data protection ISHU",
    canonical: "/privacy",
    noindex: false,
  },
  terms: {
    title: "Terms of Service — ISHU (ishu.fun)",
    description: "Read ISHU's terms of service. Understand the rules and guidelines for using ishu.fun platform.",
    keywords: "ISHU terms of service, ishu.fun terms, ISHU rules",
    canonical: "/terms",
    noindex: false,
  },
} as const;
