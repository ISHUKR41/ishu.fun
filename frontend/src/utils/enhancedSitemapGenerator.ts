/**
 * ENHANCED SITEMAP GENERATOR
 * Support for: XML Sitemap, Image Sitemap, Video Sitemap, News Sitemap, Mobile Sitemap
 */

interface BaseUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

interface ImageUrl extends BaseUrl {
  images: Array<{
    loc: string;
    caption?: string;
    title?: string;
    license?: string;
  }>;
}

interface VideoUrl extends BaseUrl {
  videos: Array<{
    thumbnailLoc: string;
    title: string;
    description: string;
    contentLoc?: string;
    playerLoc?: string;
    duration?: number;
    expirationDate?: string;
    rating?: number;
    viewCount?: number;
    publicationDate?: string;
    familyFriendly?: boolean;
    tags?: string[];
    categories?: string[];
    restrictions?: Array<{
      relationship: "allow" | "deny";
      countries: string[];
    }>;
  }>;
}

export class EnhancedSitemapGenerator {
  /**
   * Generate standard XML sitemap
   */
  static generateStandardSitemap(urls: BaseUrl[]): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    const entries = urls
      .map((url) => {
        let entry = `  <url>\n    <loc>${this.escapeXml(url.loc)}</loc>\n`;
        if (url.lastmod) entry += `    <lastmod>${url.lastmod}</lastmod>\n`;
        if (url.changefreq) entry += `    <changefreq>${url.changefreq}</changefreq>\n`;
        if (url.priority !== undefined) entry += `    <priority>${url.priority}</priority>\n`;
        entry += `  </url>\n`;
        return entry;
      })
      .join("");

    return header + "\n" + entries + "</urlset>";
  }

  /**
   * Generate image sitemap
   */
  static generateImageSitemap(urls: ImageUrl[]): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    const entries = urls
      .map((url) => {
        let entry = `  <url>\n    <loc>${this.escapeXml(url.loc)}</loc>\n`;
        
        url.images.forEach((img) => {
          entry += `    <image:image>\n`;
          entry += `      <image:loc>${this.escapeXml(img.loc)}</image:loc>\n`;
          if (img.caption) entry += `      <image:caption>${this.escapeXml(img.caption)}</image:caption>\n`;
          if (img.title) entry += `      <image:title>${this.escapeXml(img.title)}</image:title>\n`;
          if (img.license) entry += `      <image:license>${this.escapeXml(img.license)}</image:license>\n`;
          entry += `    </image:image>\n`;
        });

        if (url.lastmod) entry += `    <lastmod>${url.lastmod}</lastmod>\n`;
        if (url.changefreq) entry += `    <changefreq>${url.changefreq}</changefreq>\n`;
        if (url.priority !== undefined) entry += `    <priority>${url.priority}</priority>\n`;
        
        entry += `  </url>\n`;
        return entry;
      })
      .join("");

    return header + "\n" + entries + "</urlset>";
  }

  /**
   * Generate video sitemap
   */
  static generateVideoSitemap(urls: VideoUrl[]): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

    const entries = urls
      .map((url) => {
        let entry = `  <url>\n    <loc>${this.escapeXml(url.loc)}</loc>\n`;

        url.videos.forEach((video) => {
          entry += `    <video:video>\n`;
          entry += `      <video:thumbnail_loc>${this.escapeXml(video.thumbnailLoc)}</video:thumbnail_loc>\n`;
          entry += `      <video:title>${this.escapeXml(video.title)}</video:title>\n`;
          entry += `      <video:description>${this.escapeXml(video.description)}</video:description>\n`;
          
          if (video.contentLoc) entry += `      <video:content_loc>${this.escapeXml(video.contentLoc)}</video:content_loc>\n`;
          if (video.playerLoc) entry += `      <video:player_loc>${this.escapeXml(video.playerLoc)}</video:player_loc>\n`;
          if (video.duration) entry += `      <video:duration>${video.duration}</video:duration>\n`;
          if (video.expirationDate) entry += `      <video:expiration_date>${video.expirationDate}</video:expiration_date>\n`;
          if (video.rating) entry += `      <video:rating>${video.rating}</video:rating>\n`;
          if (video.viewCount) entry += `      <video:view_count>${video.viewCount}</video:view_count>\n`;
          if (video.publicationDate) entry += `      <video:publication_date>${video.publicationDate}</video:publication_date>\n`;
          if (video.familyFriendly !== undefined) entry += `      <video:family_friendly>${video.familyFriendly ? "yes" : "no"}</video:family_friendly>\n`;
          
          if (video.tags) {
            video.tags.forEach((tag) => {
              entry += `      <video:tag>${this.escapeXml(tag)}</video:tag>\n`;
            });
          }

          if (video.categories) {
            video.categories.forEach((cat) => {
              entry += `      <video:category>${this.escapeXml(cat)}</video:category>\n`;
            });
          }

          entry += `    </video:video>\n`;
        });

        if (url.lastmod) entry += `    <lastmod>${url.lastmod}</lastmod>\n`;
        if (url.changefreq) entry += `    <changefreq>${url.changefreq}</changefreq>\n`;
        if (url.priority !== undefined) entry += `    <priority>${url.priority}</priority>\n`;
        
        entry += `  </url>\n`;
        return entry;
      })
      .join("");

    return header + "\n" + entries + "</urlset>";
  }

  /**
   * Generate news sitemap (Google News)
   */
  static generateNewsSitemap(articles: Array<{
    loc: string;
    title: string;
    pubDate: string;
    language?: string;
    keywords?: string[];
    genres?: string[];
    stockTickers?: string[];
  }>): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

    const entries = articles
      .map((article) => {
        let entry = `  <url>\n    <loc>${this.escapeXml(article.loc)}</loc>\n`;
        entry += `    <news:news>\n`;
        entry += `      <news:publication>\n`;
        entry += `        <news:name>ISHU - Indian StudentHub University</news:name>\n`;
        entry += `        <news:language>${article.language || "en"}</news:language>\n`;
        entry += `      </news:publication>\n`;
        entry += `      <news:publication_date>${article.pubDate}</news:publication_date>\n`;
        entry += `      <news:title>${this.escapeXml(article.title)}</news:title>\n`;
        
        if (article.keywords) {
          entry += `      <news:keywords>${article.keywords.map(k => this.escapeXml(k)).join(", ")}</news:keywords>\n`;
        }

        if (article.genres) {
          entry += `      <news:genres>${article.genres.join(", ")}</news:genres>\n`;
        }

        if (article.stockTickers) {
          article.stockTickers.forEach((ticker) => {
            entry += `      <news:stock_tickers>\n`;
            entry += `        <news:stock_ticker>${this.escapeXml(ticker)}</news:stock_ticker>\n`;
            entry += `      </news:stock_tickers>\n`;
          });
        }

        entry += `    </news:news>\n`;
        entry += `  </url>\n`;
        return entry;
      })
      .join("");

    return header + "\n" + entries + "</urlset>";
  }

  /**
   * Generate mobile sitemap
   */
  static generateMobileSitemap(urls: BaseUrl[]): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">`;

    const entries = urls
      .map((url) => {
        let entry = `  <url>\n    <loc>${this.escapeXml(url.loc)}</loc>\n`;
        entry += `    <mobile:mobile/>\n`;
        if (url.lastmod) entry += `    <lastmod>${url.lastmod}</lastmod>\n`;
        if (url.changefreq) entry += `    <changefreq>${url.changefreq}</changefreq>\n`;
        if (url.priority !== undefined) entry += `    <priority>${url.priority}</priority>\n`;
        entry += `  </url>\n`;
        return entry;
      })
      .join("");

    return header + "\n" + entries + "</urlset>";
  }

  /**
   * Generate sitemap index
   */
  static generateSitemapIndex(sitemaps: Array<{ loc: string; lastmod?: string }>): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    const entries = sitemaps
      .map((sitemap) => {
        let entry = `  <sitemap>\n    <loc>${this.escapeXml(sitemap.loc)}</loc>\n`;
        if (sitemap.lastmod) entry += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
        entry += `  </sitemap>\n`;
        return entry;
      })
      .join("");

    return header + "\n" + entries + "</sitemapindex>";
  }

  /**
   * Generate complete sitemap suite
   */
  static generateCompleteSitemapSuite(config: {
    standardUrls: BaseUrl[];
    imageUrls?: ImageUrl[];
    videoUrls?: VideoUrl[];
    newsArticles?: any[];
    mobileUrls?: BaseUrl[];
  }) {
    const today = new Date().toISOString().split("T")[0];
    
    const sitemaps = [
      { loc: "https://ishu.fun/sitemap-main.xml", lastmod: today },
    ];

    const output: Record<string, string> = {
      "sitemap-main.xml": this.generateStandardSitemap(config.standardUrls),
    };

    if (config.imageUrls && config.imageUrls.length > 0) {
      output["sitemap-images.xml"] = this.generateImageSitemap(config.imageUrls);
      sitemaps.push({ loc: "https://ishu.fun/sitemap-images.xml", lastmod: today });
    }

    if (config.videoUrls && config.videoUrls.length > 0) {
      output["sitemap-videos.xml"] = this.generateVideoSitemap(config.videoUrls);
      sitemaps.push({ loc: "https://ishu.fun/sitemap-videos.xml", lastmod: today });
    }

    if (config.newsArticles && config.newsArticles.length > 0) {
      output["sitemap-news.xml"] = this.generateNewsSitemap(config.newsArticles);
      sitemaps.push({ loc: "https://ishu.fun/sitemap-news.xml", lastmod: today });
    }

    if (config.mobileUrls && config.mobileUrls.length > 0) {
      output["sitemap-mobile.xml"] = this.generateMobileSitemap(config.mobileUrls);
      sitemaps.push({ loc: "https://ishu.fun/sitemap-mobile.xml", lastmod: today });
    }

    output["sitemap-index.xml"] = this.generateSitemapIndex(sitemaps);

    return output;
  }

  /**
   * Escape XML special characters
   */
  private static escapeXml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  /**
   * Get complete URL list for ISHU
   */
  static getCompleteURLList() {
    const today = new Date().toISOString().split("T")[0];

    const standardUrls: BaseUrl[] = [
      { loc: "https://ishu.fun", lastmod: today, changefreq: "daily", priority: 1.0 },
      { loc: "https://ishu.fun/jobs", lastmod: today, changefreq: "daily", priority: 0.95 },
      { loc: "https://ishu.fun/results", lastmod: today, changefreq: "hourly", priority: 0.95 },
      { loc: "https://ishu.fun/tools", lastmod: today, changefreq: "weekly", priority: 0.90 },
      { loc: "https://ishu.fun/tv", lastmod: today, changefreq: "daily", priority: 0.90 },
      { loc: "https://ishu.fun/news", lastmod: today, changefreq: "hourly", priority: 0.85 },
      { loc: "https://ishu.fun/about", lastmod: today, changefreq: "monthly", priority: 0.70 },
      { loc: "https://ishu.fun/contact", lastmod: today, changefreq: "monthly", priority: 0.70 },
      { loc: "https://ishu.fun/privacy", lastmod: today, changefreq: "yearly", priority: 0.50 },
      { loc: "https://ishu.fun/terms", lastmod: today, changefreq: "yearly", priority: 0.50 },
    ];

    // Add exam-specific pages
    const exams = ["upsc", "ssc", "banking", "railways", "nta"];
    exams.forEach((exam) => {
      standardUrls.push({
        loc: `https://ishu.fun/exams/${exam}`,
        lastmod: today,
        changefreq: "daily",
        priority: 0.85,
      });
    });

    // Add tool pages
    const tools = [
      "pdf-merger", "pdf-compressor", "word-to-pdf",
      "youtube-downloader", "terabox-downloader", "Instagram-downloader",
      "resume-maker", "cv-builder", "bio-data-maker",
    ];
    tools.forEach((tool) => {
      standardUrls.push({
        loc: `https://ishu.fun/tools/${tool}`,
        lastmod: today,
        changefreq: "weekly",
        priority: 0.80,
      });
    });

    return standardUrls;
  }
}

export default EnhancedSitemapGenerator;
