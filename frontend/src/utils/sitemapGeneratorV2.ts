/**
 * ADVANCED SITEMAP GENERATOR v2.0
 * 
 * Generates:
 * ✓ Main XML Sitemap
 * ✓ News Sitemap (Google News)
 * ✓ Video Sitemap (YouTube)
 * ✓ Image Sitemap (Google Images)
 * ✓ Mobile Sitemap
 * ✓ Sitemap Index
 * ✓ HTML Sitemap (for users)
 * 
 * Optimization for:
 * - All search engines (Google, Bing, Yahoo, Yandex, Baidu, DuckDuckGo)
 * - All dimensions (Desktop, Mobile, Tablet)
 * - Schema markup with namespace
 */

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

export interface NewsArticle {
  loc: string;
  title: string;
  keywords?: string[];
  pubDate: string;
  language?: string;
}

export interface VideoItem {
  loc: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  duration?: number;
  uploadDate?: string;
  viewCount?: number;
  rating?: number;
}

export interface ImageItem {
  loc: string;
  imageUrl: string;
  title?: string;
  caption?: string;
  license?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// XML SITEMAP GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Escape XML special characters
 */
const escapeXml = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

/**
 * Generate main XML sitemap
 */
export const generateXMLSitemap = (urls: SitemapUrl[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
    'xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" ' +
    'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" ' +
    'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" ' +
    'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

  const urlEntries = urls
    .map((url) => {
      const lastmod = url.lastmod ? `  <lastmod>${url.lastmod}</lastmod>\n` : '';
      const changefreq = url.changefreq ? `  <changefreq>${url.changefreq}</changefreq>\n` : '';
      const priority = url.priority !== undefined ? `  <priority>${url.priority}</priority>\n` : '';

      return `<url>\n  <loc>${escapeXml(url.loc)}</loc>\n${lastmod}${changefreq}${priority}</url>\n`;
    })
    .join('');

  const urlsetClose = '</urlset>';

  return xmlHeader + urlsetOpen + urlEntries + urlsetClose;
};

/**
 * Generate Google News sitemap
 */
export const generateNewsSitemap = (articles: NewsArticle[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
    'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

  const urlEntries = articles
    .map(
      (article) =>
        `<url>\n` +
        `  <loc>${escapeXml(article.loc)}</loc>\n` +
        `  <news:news>\n` +
        `    <news:publication>\n` +
        `      <news:name>ISHU — Indian StudentHub University</news:name>\n` +
        `      <news:language>${article.language || 'en'}</news:language>\n` +
        `    </news:publication>\n` +
        `    <news:publication_date>${article.pubDate}</news:publication_date>\n` +
        `    <news:title>${escapeXml(article.title)}</news:title>\n` +
        (article.keywords ? `    <news:keywords>${article.keywords.map(escapeXml).join(',')}</news:keywords>\n` : '') +
        `  </news:news>\n` +
        `</url>\n`
    )
    .join('');

  const urlsetClose = '</urlset>';

  return xmlHeader + urlsetOpen + urlEntries + urlsetClose;
};

/**
 * Generate Video sitemap
 */
export const generateVideoSitemap = (videos: VideoItem[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
    'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

  const urlEntries = videos
    .map(
      (video) =>
        `<url>\n` +
        `  <loc>${escapeXml(video.loc)}</loc>\n` +
        `  <video:video>\n` +
        `    <video:thumbnail_loc>${escapeXml(video.thumbnailUrl)}</video:thumbnail_loc>\n` +
        `    <video:title>${escapeXml(video.title)}</video:title>\n` +
        `    <video:description>${escapeXml(video.description)}</video:description>\n` +
        (video.uploadDate ? `    <video:upload_date>${video.uploadDate}</video:upload_date>\n` : '') +
        (video.duration ? `    <video:duration>${video.duration}</video:duration>\n` : '') +
        (video.viewCount ? `    <video:view_count>${video.viewCount}</video:view_count>\n` : '') +
        (video.rating ? `    <video:rating>${video.rating}</video:rating>\n` : '') +
        `    <video:content_loc>${escapeXml(video.videoUrl)}</video:content_loc>\n` +
        `    <video:player_loc>${escapeXml(video.videoUrl)}</video:player_loc>\n` +
        `  </video:video>\n` +
        `</url>\n`
    )
    .join('');

  const urlsetClose = '</urlset>';

  return xmlHeader + urlsetOpen + urlEntries + urlsetClose;
};

/**
 * Generate Image sitemap
 */
export const generateImageSitemap = (images: ImageItem[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
    'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  const urlEntries = images
    .map(
      (image) =>
        `<url>\n` +
        `  <loc>${escapeXml(image.loc)}</loc>\n` +
        `  <image:image>\n` +
        `    <image:loc>${escapeXml(image.imageUrl)}</image:loc>\n` +
        (image.title ? `    <image:title>${escapeXml(image.title)}</image:title>\n` : '') +
        (image.caption ? `    <image:caption>${escapeXml(image.caption)}</image:caption>\n` : '') +
        (image.license ? `    <image:license>${escapeXml(image.license)}</image:license>\n` : '') +
        `  </image:image>\n` +
        `</url>\n`
    )
    .join('');

  const urlsetClose = '</urlset>';

  return xmlHeader + urlsetOpen + urlEntries + urlsetClose;
};

/**
 * Generate Mobile sitemap
 */
export const generateMobileSitemap = (urls: SitemapUrl[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
    'xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">\n';

  const urlEntries = urls
    .map((url) => {
      const lastmod = url.lastmod ? `  <lastmod>${url.lastmod}</lastmod>\n` : '';
      const changefreq = url.changefreq ? `  <changefreq>${url.changefreq}</changefreq>\n` : '';
      const priority = url.priority !== undefined ? `  <priority>${url.priority}</priority>\n` : '';

      return (
        `<url>\n` +
        `  <loc>${escapeXml(url.loc)}</loc>\n` +
        `  <mobile:mobile/>\n` +
        `${lastmod}${changefreq}${priority}` +
        `</url>\n`
      );
    })
    .join('');

  const urlsetClose = '</urlset>';

  return xmlHeader + urlsetOpen + urlEntries + urlsetClose;
};

/**
 * Generate Sitemap Index
 */
export const generateSitemapIndex = (sitemaps: Array<{
  url: string;
  lastmod?: string;
}>): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const sitemapindexOpen =
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const sitemapEntries = sitemaps
    .map(
      (sitemap) =>
        `  <sitemap>\n` +
        `    <loc>${escapeXml(sitemap.url)}</loc>\n` +
        (sitemap.lastmod ? `    <lastmod>${sitemap.lastmod}</lastmod>\n` : '') +
        `  </sitemap>\n`
    )
    .join('');

  const sitemapindexClose = '</sitemapindex>';

  return xmlHeader + sitemapindexOpen + sitemapEntries + sitemapindexClose;
};

// ═══════════════════════════════════════════════════════════════════════════════
// HTML SITEMAP FOR USERS
// ═══════════════════════════════════════════════════════════════════════════════

export const generateHTMLSitemap = (categories: Array<{
  title: string;
  links: Array<{ name: string; url: string }>;
}>): string => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sitemap | ISHU — Indian StudentHub University</title>
  <meta name="description" content="Site map showing all pages, tools, and resources on ISHU.fun">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="https://ishu.fun/sitemap">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0e27; color: #fff; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
    h1 { font-size: 2.5rem; margin-bottom: 10px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { color: #94a3b8; margin-bottom: 40px; }
    .section { margin-bottom: 40px; }
    .section-title { font-size: 1.5rem; margin: 30px 0 15px; color: #60a5fa; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
    .links-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .link-item { background: rgba(59, 130, 246, 0.1); padding: 15px; border-radius: 8px; border-left: 3px solid #3b82f6; }
    .link-item a { color: #60a5fa; text-decoration: none; word-break: break-word; }
    .link-item a:hover { color: #93c5fd; text-decoration: underline; }
    .footer { text-align: center; color: #64748b; margin-top: 60px; padding-top: 20px; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🗺️ ISHU Sitemap</h1>
    <p class="subtitle">Complete site map with all pages, tools, and resources</p>
    
    ${categories
      .map(
        (category) => `
    <div class="section">
      <h2 class="section-title">${escapeXml(category.title)}</h2>
      <div class="links-grid">
        ${category.links
          .map(
            (link) => `
        <div class="link-item">
          <a href="${escapeXml(link.url)}" title="${escapeXml(link.name)}">${escapeXml(link.name)}</a>
        </div>
        `
          )
          .join('')}
      </div>
    </div>
    `
      )
      .join('')}

    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ISHU — Indian StudentHub University. All rights reserved.</p>
      <p>Last Updated: ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
</body>
</html>`;

  return htmlContent;
};

export class AdvancedSitemapGenerator {
  private baseUrl: string;
  private urls: SitemapUrl[] = [];
  private articles: NewsArticle[] = [];
  private videos: VideoItem[] = [];
  private images: ImageItem[] = [];

  constructor(baseUrl: string = 'https://ishu.fun') {
    this.baseUrl = baseUrl;
  }

  addUrl(url: SitemapUrl): SitemapUrl {
    this.urls.push(url);
    return url;
  }

  addUrls(urls: SitemapUrl[]): SitemapUrl[] {
    this.urls.push(...urls);
    return urls;
  }

  addArticle(article: NewsArticle): NewsArticle {
    this.articles.push(article);
    return article;
  }

  addArticles(articles: NewsArticle[]): NewsArticle[] {
    this.articles.push(...articles);
    return articles;
  }

  addVideo(video: VideoItem): VideoItem {
    this.videos.push(video);
    return video;
  }

  addVideos(videos: VideoItem[]): VideoItem[] {
    this.videos.push(...videos);
    return videos;
  }

  addImage(image: ImageItem): ImageItem {
    this.images.push(image);
    return image;
  }

  addImages(images: ImageItem[]): ImageItem[] {
    this.images.push(...images);
    return images;
  }

  generateMainSitemap(): string {
    return generateXMLSitemap(this.urls);
  }

  generateNewsSitemap(): string {
    return generateNewsSitemap(this.articles);
  }

  generateVideoSitemap(): string {
    return generateVideoSitemap(this.videos);
  }

  generateImageSitemap(): string {
    return generateImageSitemap(this.images);
  }

  generateMobileSitemap(): string {
    return generateMobileSitemap(this.urls);
  }

  generateSitemapIndex(): string {
    const sitemaps = [];
    if (this.urls.length > 0) sitemaps.push({ url: `${this.baseUrl}/sitemap-main.xml` });
    if (this.articles.length > 0) sitemaps.push({ url: `${this.baseUrl}/sitemap-news.xml` });
    if (this.videos.length > 0) sitemaps.push({ url: `${this.baseUrl}/sitemap-video.xml` });
    if (this.images.length > 0) sitemaps.push({ url: `${this.baseUrl}/sitemap-image.xml` });
    if (this.urls.length > 0) sitemaps.push({ url: `${this.baseUrl}/sitemap-mobile.xml` });

    return generateSitemapIndex(sitemaps);
  }

  generateHTMLSitemap(): string {
    const categories = [
      {
        title: '🏠 Main Pages',
        links: this.urls.slice(0, 10).map(url => ({
          name: url.loc.replace(this.baseUrl, '').replace(/\//g, ' ').trim() || 'Home',
          url: url.loc,
        })),
      },
      {
        title: '📰 Latest News',
        links: this.articles.slice(0, 10).map(article => ({
          name: article.title,
          url: article.loc,
        })),
      },
      {
        title: '🎬 Video Content',
        links: this.videos.slice(0, 10).map(video => ({
          name: video.title,
          url: video.loc,
        })),
      },
    ];

    return generateHTMLSitemap(categories.filter(cat => cat.links.length > 0));
  }

  getAllSitemaps() {
    return {
      main: this.generateMainSitemap(),
      news: this.generateNewsSitemap(),
      video: this.generateVideoSitemap(),
      image: this.generateImageSitemap(),
      mobile: this.generateMobileSitemap(),
      index: this.generateSitemapIndex(),
      html: this.generateHTMLSitemap(),
    };
  }
}
