/**
 * SITEMAP GENERATOR
 * 
 * Generates XML sitemaps for SEO optimization
 * - Main sitemap
 * - Dynamic page sitemap
 * - News/Articles sitemap
 * - Jobs sitemap
 * - Tools sitemap  
 * - TV Channels sitemap
 */

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

interface NewsArticle {
  loc: string;
  title: string;
  keywords?: string[];
  pubDate: string;
}

/**
 * Generate XML sitemap from URL array
 */
export const generateXMLSitemap = (urls: SitemapUrl[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

  const urlEntries = urls
    .map((url) => {
      const lastmod = url.lastmod ? `  <lastmod>${url.lastmod}</lastmod>\n` : "";
      const changefreq = url.changefreq ? `  <changefreq>${url.changefreq}</changefreq>\n` : "";
      const priority = url.priority !== undefined ? `  <priority>${url.priority}</priority>\n` : "";

      return `<url>\n  <loc>${url.loc}</loc>\n${lastmod}${changefreq}${priority}</url>\n`;
    })
    .join("");

  const urlsetClose = "</urlset>";

  return xmlHeader + urlsetOpen + urlEntries + urlsetClose;
};

/**
 * Generate news sitemap (for Google News)
 */
export const generateNewsSitemap = (articles: NewsArticle[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

  const urlEntries = articles
    .map(
      (article) =>
        `<url>
  <loc>${article.loc}</loc>
  <news:news>
    <news:publication>
      <news:name>ISHU - Indian StudentHub University</news:name>
      <news:language>en</news:language>
    </news:publication>
    <news:publication_date>${article.pubDate}</news:publication_date>
    <news:title>${escapeXml(article.title)}</news:title>
    ${article.keywords ? `<news:keywords>${article.keywords.join(",")}</news:keywords>` : ""}
  </news:news>
</url>\n`
    )
    .join("");

  const urlsetClose = "</urlset>";

  return xmlHeader + urlsetOpen + urlEntries + urlsetClose;
};

/**
 * Generate sitemap index (references all sitemaps)
 */
export const generateSitemapIndex = (sitemaps: string[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const sitemapindexOpen =
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const sitemapEntries = sitemaps
    .map(
      (sitemapUrl) =>
        `  <sitemap>
    <loc>${sitemapUrl}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>\n`
    )
    .join("");

  const sitemapindexClose = "</sitemapindex>";

  return xmlHeader + sitemapindexOpen + sitemapEntries + sitemapindexClose;
};

/**
 * Escape XML special characters
 */
export const escapeXml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

/**
 * Generate main sitemap with all critical pages
 */
export const generateMainSitemap = (): SitemapUrl[] => {
  const today = new Date().toISOString().split("T")[0];

  return [
    // Homepage
    {
      loc: "https://ishu.fun",
      lastmod: today,
      changefreq: "daily",
      priority: 1.0,
    },
    // Main sections
    {
      loc: "https://ishu.fun/government-jobs",
      lastmod: today,
      changefreq: "daily",
      priority: 0.9,
    },
    {
      loc: "https://ishu.fun/exam-results",
      lastmod: today,
      changefreq: "hourly",
      priority: 0.9,
    },
    {
      loc: "https://ishu.fun/pdf-tools",
      lastmod: today,
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      loc: "https://ishu.fun/video-downloader",
      lastmod: today,
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      loc: "https://ishu.fun/live-tv",
      lastmod: today,
      changefreq: "daily",
      priority: 0.9,
    },
    {
      loc: "https://ishu.fun/news",
      lastmod: today,
      changefreq: "hourly",
      priority: 0.8,
    },
    // Category pages
    {
      loc: "https://ishu.fun/jobs/upsc",
      lastmod: today,
      changefreq: "daily",
      priority: 0.85,
    },
    {
      loc: "https://ishu.fun/jobs/ssc",
      lastmod: today,
      changefreq: "daily",
      priority: 0.85,
    },
    {
      loc: "https://ishu.fun/jobs/banking",
      lastmod: today,
      changefreq: "daily",
      priority: 0.85,
    },
    {
      loc: "https://ishu.fun/jobs/railways",
      lastmod: today,
      changefreq: "daily",
      priority: 0.85,
    },
    {
      loc: "https://ishu.fun/jobs/nta",
      lastmod: today,
      changefreq: "daily",
      priority: 0.85,
    },
    // PDF Tools
    {
      loc: "https://ishu.fun/tools/pdf-merger",
      lastmod: today,
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      loc: "https://ishu.fun/tools/pdf-compressor",
      lastmod: today,
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      loc: "https://ishu.fun/tools/pdf-converter",
      lastmod: today,
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      loc: "https://ishu.fun/tools/word-to-pdf",
      lastmod: today,
      changefreq: "monthly",
      priority: 0.8,
    },
    // Download tools
    {
      loc: "https://ishu.fun/tools/youtube-downloader",
      lastmod: today,
      changefreq: "weekly",
      priority: 0.85,
    },
    {
      loc: "https://ishu.fun/tools/terabox-downloader",
      lastmod: today,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: "https://ishu.fun/tools/instagram-downloader",
      lastmod: today,
      changefreq: "weekly",
      priority: 0.75,
    },
    // Other tools
    {
      loc: "https://ishu.fun/tools/resume-maker",
      lastmod: today,
      changefreq: "weekly",
      priority: 0.8,
    },
    {
      loc: "https://ishu.fun/tools/cv-builder",
      lastmod: today,
      changefreq: "weekly",
      priority: 0.75,
    },
    // Info pages
    {
      loc: "https://ishu.fun/about",
      lastmod: today,
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: "https://ishu.fun/contact",
      lastmod: today,
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      loc: "https://ishu.fun/privacy-policy",
      lastmod: today,
      changefreq: "yearly",
      priority: 0.5,
    },
    {
      loc: "https://ishu.fun/terms-and-conditions",
      lastmod: today,
      changefreq: "yearly",
      priority: 0.5,
    },
    {
      loc: "https://ishu.fun/disclaimer",
      lastmod: today,
      changefreq: "yearly",
      priority: 0.5,
    },
  ];
};

/**
 * Generate dynamic pages sitemap for different states/locations
 */
export const generateLocationSitemap = (): SitemapUrl[] => {
  const states = [
    "delhi",
    "uttar-pradesh",
    "maharashtra",
    "karnataka",
    "tamil-nadu",
    "rajasthan",
    "west-bengal",
    "bihar",
    "andhra-pradesh",
    "telangana",
    "kerala",
    "punjab",
    "haryana",
    "madhya-pradesh",
    "gujarat",
    "assam",
    "jharkhand",
    "odisha",
    "chhattisgarh",
    "himachal-pradesh",
  ];

  const today = new Date().toISOString().split("T")[0];

  return states.map((state) => ({
    loc: `https://ishu.fun/jobs/${state}`,
    lastmod: today,
    changefreq: "daily",
    priority: 0.75,
  }));
};

/**
 * Generate jobs sitemap with exam-specific pages
 */
export const generateJobsSitemap = (): SitemapUrl[] => {
  const today = new Date().toISOString().split("T")[0];

  const exams = [
    "upsc",
    "ssc-cgl",
    "ssc-chsl",
    "ssc-mts",
    "ssc-jee",
    "ibps-po",
    "ibps-clerk",
    "sbi-po",
    "sbi-clerk",
    "rrb-ntpc",
    "rrb-group-d",
    "rrb-je",
    "neet",
    "jee-main",
    "jee-advanced",
    "nta-ugc-net",
    "defence-exams",
    "police-recruitment",
    "teaching-exams",
  ];

  return exams.map((exam) => ({
    loc: `https://ishu.fun/exams/${exam}`,
    lastmod: today,
    changefreq: "daily",
    priority: 0.8,
  }));
};

/**
 * Generate tools sitemap
 */
export const generateToolsSitemap = (): SitemapUrl[] => {
  const today = new Date().toISOString().split("T")[0];

  const tools = [
    "pdf-merger",
    "pdf-splitter",
    "pdf-compressor",
    "pdf-converter",
    "word-to-pdf",
    "excel-to-pdf",
    "ppt-to-pdf",
    "image-to-pdf",
    "pdf-to-image",
    "pdf-to-word",
    "pdf-editor",
    "pdf-watermark",
    "youtube-downloader",
    "terabox-downloader",
    "instagram-downloader",
    "tiktok-downloader",
    "facebook-downloader",
    "twitter-downloader",
    "resume-maker",
    "cv-builder",
    "bio-data-maker",
  ];

  return tools.map((tool) => ({
    loc: `https://ishu.fun/tools/${tool}`,
    lastmod: today,
    changefreq: "weekly",
    priority: 0.75,
  }));
};

/**
 * Generate TV/News sitemap
 */
export const generateTVSitemap = (): SitemapUrl[] => {
  const today = new Date().toISOString().split("T")[0];

  const channels = [
    "aaj-tak",
    "ndtv",
    "republic-tv",
    "times-now",
    "india-today",
    "zee-news",
    "abp-news",
    "news18",
    "dd-news",
    "sansad-tv",
    "hindi-news",
    "english-news",
    "marathi-news",
    "tamil-news",
    "telugu-news",
  ];

  return channels.map((channel) => ({
    loc: `https://ishu.fun/tv/${channel}`,
    lastmod: today,
    changefreq: "daily",
    priority: 0.7,
  }));
};

/**
 * Generate example news articles for news sitemap
 */
export const generateNewsArticles = (): NewsArticle[] => {
  const today = new Date();
  return [
    {
      loc: "https://ishu.fun/news/upsc-notification-2026",
      title: "UPSC Notification 2026 - Apply Now",
      keywords: ["UPSC", "notification", "jobs", "2026"],
      pubDate: today.toISOString(),
    },
    {
      loc: "https://ishu.fun/news/ssc-result-released",
      title: "SSC CGL Result 2026 Released - Check Now",
      keywords: ["SSC", "result", "CGL", "2026"],
      pubDate: today.toISOString(),
    },
    {
      loc: "https://ishu.fun/news/railway-recruitment-2026",
      title: "Railway Recruitment 2026 - Apply Before Deadline",
      keywords: ["Railway", "recruitment", "RRB", "2026"],
      pubDate: today.toISOString(),
    },
  ];
};

/**
 * Helper to get today's date in ISO format
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export default {
  generateXMLSitemap,
  generateNewsSitemap,
  generateSitemapIndex,
  generateMainSitemap,
  generateLocationSitemap,
  generateJobsSitemap,
  generateToolsSitemap,
  generateTVSitemap,
  generateNewsArticles,
};
