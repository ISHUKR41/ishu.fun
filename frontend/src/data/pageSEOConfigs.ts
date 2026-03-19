/**
 * PAGE SEO CONFIGS
 * Pre-configured SEO data for all main pages
 * Use these to quickly add SEO to any page
 */

import {
  TIER1_KEYWORDS,
  TIER2_PDF_TOOLS,
  TIER3_VIDEO_DOWNLOADERS,
  TIER4_LIVE_TV,
  TIER5_CAREER_EDUCATION,
} from "@/data/keywords-database";

export const PAGE_SEO_CONFIGS = {
  // ─────────────────────────────────────────────────────────────────
  // HOME PAGE
  // ─────────────────────────────────────────────────────────────────
  homepage: {
    title: "ISHU — India's #1 Government Jobs, PDF Tools & Video Downloader Platform",
    description:
      "ISHU (Indian StudentHub University) — Instant access to 10,000+ government job vacancies, exam results, admit cards for UPSC SSC Banking Railways. 100+ free PDF tools, YouTube/Terabox downloader, 700+ live TV channels & daily news. No signup required!",
    keyword: "government jobs India",
    contentType: "homepage" as const,
    tags: ["government jobs", "exam results", "PDF tools", "video downloader"],
    breadcrumbs: [{ name: "Home", url: "/" }],
  },

  // ─────────────────────────────────────────────────────────────────
  // JOBS & RECRUITMENT
  // ─────────────────────────────────────────────────────────────────
  jobs: {
    title: "Latest Government Jobs India 2026 — Apply Now | ISHU",
    description:
      "Find 10,000+ latest government job notifications in India 2026. UPSC, SSC, Banking, Railways, Police, Teaching — all exams with admit cards, answer keys & results. Apply free, no registration needed.",
    keyword: "government jobs India 2026",
    contentType: "job_listing" as const,
    category: "government_jobs",
    tags: ["jobs", "recruitment", "2026"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Jobs", url: "/jobs" },
    ],
  },

  upsc: {
    title: "UPSC Notification 2026 — Apply Online, Check Result & Admit Card | ISHU",
    description:
      "Official UPSC notification 2026 — Check UPSC exam dates, apply online, download admit card, view result & answer key. UPSC job notification for IAS, IFS, IPS exam preparation.",
    keyword: "UPSC notification 2026",
    contentType: "job_listing" as const,
    category: "government_jobs",
    tags: ["UPSC", "IAS", "IFS", "notification"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Jobs", url: "/jobs" },
      { name: "UPSC", url: "/jobs/upsc" },
    ],
  },

  ssc: {
    title: "SSC CGL Result 2026 — Notification, Admit Card & Answer Key | ISHU",
    description:
      "SSC CGL notification 2026 — Check SSC exam date, apply online, download admit cards, view results & answer keys for SSC CGL, CHSL, MTS, JE exams.",
    keyword: "SSC CGL result 2026",
    contentType: "job_listing" as const,
    category: "government_jobs",
    tags: ["SSC", "CGL", "CHSL", "MTS"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Jobs", url: "/jobs" },
      { name: "SSC", url: "/jobs/ssc" },
    ],
  },

  banking: {
    title: "Banking Jobs India 2026 — IBPS SBI Result & Notification | ISHU",
    description:
      "Latest banking job notifications for IBPS PO, Clerk, SBI PO, Clerk, RBI. Check exam dates, apply online, download admit cards, view results & answer keys.",
    keyword: "banking jobs India",
    contentType: "job_listing" as const,
    category: "government_jobs",
    tags: ["banking", "IBPS", "SBI", "jobs"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Jobs", url: "/jobs" },
      { name: "Banking", url: "/jobs/banking" },
    ],
  },

  railways: {
    title: "Railway Jobs India 2026 — RRB NTPC Result & Notification | ISHU",
    description:
      "RRB railway recruitment 2026 — Check RRB NTPC, Group D, JE notification, exam dates, apply online. Download admit cards, view results & answer keys.",
    keyword: "railway recruitment 2026",
    contentType: "job_listing" as const,
    category: "government_jobs",
    tags: ["railway", "RRB", "NTPC", "Group D"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Jobs", url: "/jobs" },
      { name: "Railways", url: "/jobs/railways" },
    ],
  },

  nta: {
    title: "NEET JEE Result 2026 — Notification & Admit Card Download | ISHU",
    description:
      "NTA JEE Main, NEET 2026 notification — Check exam dates, apply online, download admit cards, view results, answer keys & cutoff marks.",
    keyword: "NEET JEE result 2026",
    contentType: "job_listing" as const,
    category: "government_jobs",
    tags: ["NEET", "JEE", "NTA", "exam"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Exams", url: "/exams" },
      { name: "NTA", url: "/exams/nta" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // EXAM RESULTS
  // ─────────────────────────────────────────────────────────────────
  exam_results: {
    title: "Government Exam Results 2026 — Check Admit Card & Answer Key | ISHU",
    description:
      "Latest government exam results 2026 — Check UPSC, SSC, Banking, Railway, NTA, Police exam results. Download admit cards, answer keys & cutoff marks instantly.",
    keyword: "exam results India 2026",
    contentType: "news" as const,
    tags: ["results", "admit card", "answer key"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Results", url: "/exam-results" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // PDF TOOLS
  // ─────────────────────────────────────────────────────────────────
  pdf_tools: {
    title: "100+ Free PDF Tools Online — Merge, Compress, Convert | ISHU",
    description:
      "Free PDF tools online — merge PDF, compress PDF, convert PDF to Word/Image, split PDF, edit PDF, sign PDF & more. No registration, no watermark, fast processing.",
    keyword: "PDF tools free online",
    contentType: "tool" as const,
    category: "pdf_tools",
    tags: ["PDF", "merge", "compress", "convert"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: "PDF Tools", url: "/tools/pdf" },
    ],
  },

  pdf_merger: {
    title: "Merge PDF Online Free — Combine Multiple PDFs | ISHU",
    description:
      "Free PDF merger tool — Merge multiple PDF files online instantly. No registration needed, secure processing, supports all browsers. Combine PDFs in seconds!",
    keyword: "merge PDF free",
    contentType: "tool" as const,
    tags: ["merge", "PDF", "combine"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: "PDF Merger", url: "/tools/pdf-merger" },
    ],
  },

  pdf_compressor: {
    title: "Compress PDF Online — Reduce File Size Free | ISHU",
    description:
      "Compress PDF online free — Reduce PDF file size instantly without losing quality. No signup required, secure, works on all devices. Download compressed PDF in seconds.",
    keyword: "compress PDF online",
    contentType: "tool" as const,
    tags: ["compress", "PDF", "reduce size"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: "Compressor", url: "/tools/pdf-compressor" },
    ],
  },

  word_to_pdf: {
    title: "Word to PDF Converter Online Free — No Installation | ISHU",
    description:
      "Convert Word to PDF online free — Transform your DOC/DOCX files to PDF instantly. No software installation, secure processing, works on all devices.",
    keyword: "Word to PDF converter",
    contentType: "tool" as const,
    tags: ["convert", "Word", "PDF"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: "Word to PDF", url: "/tools/word-to-pdf" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // VIDEO DOWNLOADER
  // ─────────────────────────────────────────────────────────────────
  video_downloader: {
    title: "Download Videos Free — YouTube, Terabox, Instagram, TikTok | ISHU",
    description:
      "Free video downloader — Download videos from YouTube, Terabox, Instagram, TikTok, Facebook in HD/4K quality. No app required, no watermark, works on all browsers.",
    keyword: "video downloader free",
    contentType: "tool" as const,
    category: "video_downloader",
    tags: ["download", "video", "YouTube"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: "Video Downloader", url: "/tools/video-downloader" },
    ],
  },

  youtube_downloader: {
    title: "YouTube Downloader Online — Download Videos HD 1080p 4K Free | ISHU",
    description:
      "Free YouTube video downloader — Download from YouTube in HD 1080p, 4K quality. No app, no registration, no watermark, ultra-fast processing.",
    keyword: "YouTube downloader free",
    contentType: "tool" as const,
    tags: ["YouTube", "download", "HD"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: "YouTube Downloader", url: "/tools/youtube-downloader" },
    ],
  },

  terabox_downloader: {
    title: "Terabox Downloader Free — Download Files Online Instantly | ISHU",
    description:
      "Free Terabox downloader — Download files, videos from Terabox, teraboxapp.com instantly. Works on all devices, no app needed, ultra-fast download.",
    keyword: "Terabox downloader",
    contentType: "tool" as const,
    tags: ["Terabox", "download", "free"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: "Terabox Downloader", url: "/tools/terabox-downloader" },
    ],
  },

  instagram_downloader: {
    title: "Instagram Video Downloader — Download Reels, Stories Free | ISHU",
    description:
      "Download Instagram videos, reels, stories for free. No registration, no app, works on mobile & desktop. Download in seconds!",
    keyword: "Instagram video downloader",
    contentType: "tool" as const,
    tags: ["Instagram", "download", "reels"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: "Instagram Downloader", url: "/tools/instagram-downloader" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // LIVE TV
  // ─────────────────────────────────────────────────────────────────
  live_tv: {
    title: "Live TV India Free — Watch 700+ Indian TV Channels Online | ISHU",
    description:
      "Watch 700+ Indian TV channels live online free — Hindi news (Aaj Tak, NDTV, Republic), entertainment, sports, regional channels. No app download needed!",
    keyword: "live TV India free",
    contentType: "tool" as const,
    category: "live_tv",
    tags: ["live TV", "streaming", "channels"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Live TV", url: "/tv" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // CAREER & TOOLS
  // ─────────────────────────────────────────────────────────────────
  resume_maker: {
    title: "Free Resume Maker India — Create Professional CV Online | ISHU",
    description:
      "Free resume maker — Create professional resumes, CV, bio-data instantly. Indian format, download as PDF, no registration needed.",
    keyword: "free resume maker India",
    contentType: "tool" as const,
    tags: ["resume", "CV", "maker"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Tools", url: "/tools" },
      { name: "Resume Maker", url: "/tools/resume-maker" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // NEWS & ARTICLES
  // ─────────────────────────────────────────────────────────────────
  news: {
    title: "Latest News — Government Jobs, Exam Results, Daily Updates | ISHU",
    description:
      "Latest news on government jobs, exam results, notifications, current affairs. Daily updates on UPSC, SSC, Banking, Railways, NTA exams & Indian news.",
    keyword: "government jobs news India",
    contentType: "news" as const,
    tags: ["news", "updates", "notifications"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "News", url: "/news" },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // INFO PAGES
  // ─────────────────────────────────────────────────────────────────
  about: {
    title: "About ISHU — India's #1 Student Hub Platform",
    description:
      "Learn about ISHU (Indian StudentHub University) — platform for government jobs, exam results, PDF tools, video downloaders & live TV for Indian students.",
    keyword: "ISHU about",
    contentType: "article" as const,
    tags: ["about", "ISHU"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "About", url: "/about" },
    ],
  },

  contact: {
    title: "Contact ISHU — Get Help & Support",
    description: "Contact ISHU for support, feedback, partnerships & inquiries. Email, phone & social media contact available.",
    keyword: "ISHU contact",
    contentType: "article" as const,
    tags: ["contact", "support"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Contact", url: "/contact" },
    ],
  },

  privacy: {
    title: "Privacy Policy — ISHU",
    description: "Privacy policy for ISHU — How we collect, use & protect your data.",
    keyword: "privacy policy",
    contentType: "article" as const,
    tags: ["privacy", "policy"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Privacy", url: "/privacy" },
    ],
  },

  terms: {
    title: "Terms and Conditions — ISHU",
    description: "Terms and conditions for using ISHU services.",
    keyword: "terms and conditions",
    contentType: "article" as const,
    tags: ["terms", "conditions"],
    breadcrumbs: [
      { name: "Home", url: "/" },
      { name: "Terms", url: "/terms" },
    ],
  },
} as const;

/**
 * Get SEO config for a page by route
 */
export const getSEOConfig = (route: keyof typeof PAGE_SEO_CONFIGS) => {
  return PAGE_SEO_CONFIGS[route] || PAGE_SEO_CONFIGS.homepage;
};

/**
 * Helper to update SEO config with URL and date
 */
export const updateSEOConfig = (
  config: (typeof PAGE_SEO_CONFIGS)[keyof typeof PAGE_SEO_CONFIGS],
  overrides?: {
    url?: string;
    publishedDate?: string;
    modifiedDate?: string;
    ogImage?: string;
  }
) => ({
  ...config,
  url: overrides?.url || `https://ishu.fun${config.breadcrumbs[config.breadcrumbs.length - 1].url}`,
  publishedDate: overrides?.publishedDate,
  modifiedDate: overrides?.modifiedDate,
  ogImage: overrides?.ogImage,
});

export default PAGE_SEO_CONFIGS;
