/**
 * SITEMAP GENERATOR FOR NODEJS BACKEND
 * Generates XML sitemaps for all pages and content types
 * Optimized for maximum SEO across all search engines
 */

class SitemapGenerator {
  constructor(domain = 'https://ishu.fun') {
    this.domain = domain;
  }

  /**
   * Generate main pages sitemap
   */
  generateMainPagesSitemap() {
    return [
      {
        loc: `${this.domain}/`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: 1.0,
      },
      {
        loc: `${this.domain}/results`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: 0.95,
      },
      {
        loc: `${this.domain}/tools`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        loc: `${this.domain}/news`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: 0.85,
      },
      {
        loc: `${this.domain}/tv`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.85,
      },
      // PDF Tools
      {
        loc: `${this.domain}/tools/pdf-tools`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.9,
      },
      {
        loc: `${this.domain}/tools/merge-pdf`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.85,
      },
      {
        loc: `${this.domain}/tools/compress-pdf`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.85,
      },
      {
        loc: `${this.domain}/tools/pdf-to-word`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.85,
      },
      {
        loc: `${this.domain}/tools/pdf-to-image`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.85,
      },
      {
        loc: `${this.domain}/tools/word-to-pdf`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.85,
      },
      // Video Downloaders
      {
        loc: `${this.domain}/tools/youtube-downloader`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.9,
      },
      {
        loc: `${this.domain}/tools/terabox-downloader`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.9,
      },
      {
        loc: `${this.domain}/tools/universal-video-downloader`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 0.9,
      },
      // Utility Pages
      {
        loc: `${this.domain}/about`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        loc: `${this.domain}/contact`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        loc: `${this.domain}/privacy`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'yearly',
        priority: 0.5,
      },
      {
        loc: `${this.domain}/terms`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'yearly',
        priority: 0.5,
      },
    ];
  }

  /**
   * Generate state-wise government job pages
   */
  generateStateJobSitemap() {
    const states = [
      'delhi', 'uttar-pradesh', 'maharashtra', 'karnataka', 'tamil-nadu',
      'telangana', 'west-bengal', 'bihar', 'rajasthan', 'madhya-pradesh',
      'gujarat', 'punjab', 'haryana', 'kerala', 'jharkhand',
      'odisha', 'assam', 'himachal-pradesh', 'uttarakhand', 'goa',
    ];

    return states.map(state => ({
      loc: `${this.domain}/jobs/${state}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 0.85,
    }));
  }

  /**
   * Generate exam-specific pages
   */
  generateExamSitemap() {
    const exams = [
      'upsc-ias', 'upsc-ifs', 'ssc-cgl', 'ssc-chsl', 'ssc-mts',
      'ibps-po', 'ibps-clerk', 'sbi-po', 'sbi-clerk',
      'rrb-ntpc', 'rrb-group-d', 'neet', 'jee-main', 'cds', 'nda',
    ];

    return exams.map(exam => ({
      loc: `${this.domain}/exams/${exam}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 0.88,
    }));
  }

  /**
   * Generate TV channel pages
   */
  generateTVChannelSitemap() {
    const channels = [
      'aaj-tak', 'ndtv', 'republic-tv', 'times-now', 'zee-news',
      'news-18', 'abp-news', 'star-sports', 'colors-tv', 'star-plus',
    ];

    return channels.map(channel => ({
      loc: `${this.domain}/tv/${channel}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 0.8,
    }));
  }

  /**
   * Generate full sitemap
   */
  generateFullSitemap() {
    return [
      ...this.generateMainPagesSitemap(),
      ...this.generateStateJobSitemap(),
      ...this.generateExamSitemap(),
      ...this.generateTVChannelSitemap(),
    ];
  }

  /**
   * Convert to XML format
   */
  toXML(entries = this.generateFullSitemap()) {
    const xmlEntries = entries
      .map(
        entry => `
  <url>
    <loc>${entry.loc}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${xmlEntries}
</urlset>`;
  }

  /**
   * Generate sitemap index
   */
  generateSitemapIndex(sitemapUrls = [
    'https://ishu.fun/sitemap.xml',
    'https://ishu.fun/sitemap-jobs.xml',
    'https://ishu.fun/sitemap-exams.xml',
    'https://ishu.fun/sitemap-tv.xml',
  ]) {
    const sitemaps = sitemapUrls
      .map(
        url => `
  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;
  }

  /**
   * Generate mobile sitemap
   */
  generateMobileSitemap() {
    const mobileEntries = this.generateFullSitemap()
      .map(entry => ({
        ...entry,
        loc: entry.loc.replace('https://ishu.fun', 'https://ishu.fun?mobile=1'),
      }))
      .map(
        entry => `
  <url>
    <loc>${entry.loc}</loc>
    <mobile:mobile/>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    <priority>${entry.priority || 0.5}</priority>
  </url>`
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${mobileEntries}
</urlset>`;
  }

  /**
   * Generate hreflang sitemap
   */
  generateHreflangSitemap() {
    const languages = ['en-IN', 'hi-IN', 'ta-IN', 'te-IN', 'bn-IN'];
    const mainPages = ['/', '/results', '/tools', '/news'];

    const entries = mainPages
      .map(
        page => `
  <url>
    <loc>${this.domain}${page}</loc>
    ${languages
      .map(
        lang => `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${this.domain}${page}?lang=${lang.split('-')[0]}" />`
      )
      .join('')}
  </url>`
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries}
</urlset>`;
  }
}

module.exports = SitemapGenerator;
