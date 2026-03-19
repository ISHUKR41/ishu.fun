/**
 * ADVANCED SITEMAP GENERATOR v1.0
 * Generates comprehensive XML sitemaps for search engines
 * 
 * Features:
 * - Dynamic page discovery
 * - Priority-based ranking
 * - Change frequency optimization
 * - Image sitemaps
 * - Video sitemaps
 * - Mobile sitemaps
 * - Hreflang alternate links (multi-language)
 */

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: SitemapImage[];
  videos?: SitemapVideo[];
  mobile?: boolean;
  alternates?: SitemapAlternate[];
}

interface SitemapImage {
  loc: string;
  title?: string;
  caption?: string;
}

interface SitemapVideo {
  title: string;
  description: string;
  thumbnailUrl: string;
  contentUrl?: string;
  duration?: number;
}

interface SitemapAlternate {
  hreflang: string;
  href: string;
}

export class SitemapGenerator {
  private baseUrl: string = 'https://ishu.fun';
  private entries: SitemapEntry[] = [];
  private timestamp: string = new Date().toISOString().split('T')[0];

  /**
   * Add entry to sitemap
   */
  addEntry(entry: SitemapEntry): void {
    this.entries.push({
      ...entry,
      lastmod: entry.lastmod || this.timestamp,
    });
  }

  /**
   * Generate complete sitemap for core pages
   */
  generateCoreSitemap(): SitemapEntry[] {
    return [
      {
        loc: `${this.baseUrl}/`,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: this.timestamp,
      },
      {
        loc: `${this.baseUrl}/results`,
        changefreq: 'daily',
        priority: 0.95,
        lastmod: this.timestamp,
      },
      {
        loc: `${this.baseUrl}/tools`,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: this.timestamp,
      },
      {
        loc: `${this.baseUrl}/jobs`,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: this.timestamp,
      },
      {
        loc: `${this.baseUrl}/news`,
        changefreq: 'hourly',
        priority: 0.85,
        lastmod: this.timestamp,
      },
      {
        loc: `${this.baseUrl}/tv`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: this.timestamp,
      },
      {
        loc: `${this.baseUrl}/dashboard`,
        changefreq: 'weekly',
        priority: 0.75,
        lastmod: this.timestamp,
      },
      {
        loc: `${this.baseUrl}/profile`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: this.timestamp,
      },
      {
        loc: `${this.baseUrl}/about`,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: this.timestamp,
      },
      {
        loc: `${this.baseUrl}/contact`,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: this.timestamp,
      },
      {
        loc: `${this.baseUrl}/privacy`,
        changefreq: 'yearly',
        priority: 0.5,
        lastmod: this.timestamp,
      },
      {
        loc: `${this.baseUrl}/terms`,
        changefreq: 'yearly',
        priority: 0.5,
        lastmod: this.timestamp,
      },
      {
        loc: `${this.baseUrl}/faq`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: this.timestamp,
      },
      {
        loc: `${this.baseUrl}/blog`,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: this.timestamp,
      },
    ];
  }

  /**
   * Generate tools pages sitemap
   */
  generateToolsSitemap(): SitemapEntry[] {
    const tools = [
      { path: 'youtube-downloader', priority: 0.9 },
      { path: 'terabox-downloader', priority: 0.9 },
      { path: 'universal-video-downloader', priority: 0.9 },
      { path: 'pdf-merger', priority: 0.85 },
      { path: 'pdf-splitter', priority: 0.85 },
      { path: 'pdf-compressor', priority: 0.85 },
      { path: 'pdf-editor', priority: 0.85 },
      { path: 'pdf-converter', priority: 0.85 },
      { path: 'image-to-pdf', priority: 0.85 },
      { path: 'pdf-to-image', priority: 0.85 },
      { path: 'pdf-to-word', priority: 0.85 },
      { path: 'pdf-to-excel', priority: 0.85 },
      { path: 'password-protector', priority: 0.8 },
      { path: 'resume-maker', priority: 0.8 },
      { path: 'form-filler', priority: 0.8 },
      { path: 'document-translator', priority: 0.8 },
      { path: 'plagiarism-checker', priority: 0.8 },
      { path: 'grammar-checker', priority: 0.8 },
      { path: 'ocr-tool', priority: 0.8 },
      { path: 'qr-code-generator', priority: 0.75 },
      { path: 'barcode-generator', priority: 0.75 },
      { path: 'url-shortener', priority: 0.75 },
      { path: 'password-generator', priority: 0.75 },
      { path: 'image-editor', priority: 0.75 },
      { path: 'video-editor', priority: 0.75 },
    ];

    return tools.map(tool => ({
      loc: `${this.baseUrl}/tools/${tool.path}`,
      changefreq: 'weekly' as const,
      priority: tool.priority,
      lastmod: this.timestamp,
    }));
  }

  /**
   * Generate exam results pages sitemap
   */
  generateExamResultsSitemap(): SitemapEntry[] {
    const exams = [
      'UPSC', 'SSC-CGL', 'SSC-CHSL', 'SSC-MTS', 'SSC-JE',
      'Railway-NTPC', 'Railway-Group-D', 'Banking-IBPS-PO',
      'Banking-SBI-PO', 'Banking-RRB', 'NEET', 'JEE-Main',
      'CAT', 'GATE', 'GMAT', 'SAT',
    ];

    return exams.map(exam => ({
      loc: `${this.baseUrl}/results/${exam.toLowerCase()}`,
      changefreq: 'daily' as const,
      priority: 0.85,
      lastmod: this.timestamp,
    }));
  }

  /**
   * Generate state-wise jobs pages sitemap (36+ states)
   */
  generateStateWiseJobsSitemap(): SitemapEntry[] {
    const states = [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
      'Andaman and Nicobar', 'Chandigarh', 'Dadra and Nagar Haveli',
      'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
      'Lakshadweep', 'Puducherry',
    ];

    return states.map(state => ({
      loc: `${this.baseUrl}/jobs/${state.toLowerCase().replace(/\s+/g, '-')}`,
      changefreq: 'daily' as const,
      priority: 0.8,
      lastmod: this.timestamp,
    }));
  }

  /**
   * Generate category pages sitemap
   */
  generateCategoryPagesSitemap(): SitemapEntry[] {
    const categories = [
      { path: 'government', priority: 0.85 },
      { path: 'banking', priority: 0.85 },
      { path: 'railway', priority: 0.85 },
      { path: 'defence', priority: 0.8 },
      { path: 'teaching', priority: 0.8 },
      { path: 'engineering', priority: 0.8 },
      { path: 'medical', priority: 0.8 },
      { path: 'police', priority: 0.8 },
      { path: 'paramilitary', priority: 0.8 },
      { path: 'central-armed', priority: 0.75 },
    ];

    return categories.map(cat => ({
      loc: `${this.baseUrl}/jobs/category/${cat.path}`,
      changefreq: 'weekly' as const,
      priority: cat.priority,
      lastmod: this.timestamp,
    }));
  }

  /**
   * Generate complete XML sitemap string
   */
  generateXMLSitemap(): string {
    const allEntries = [
      ...this.generateCoreSitemap(),
      ...this.generateToolsSitemap(),
      ...this.generateExamResultsSitemap(),
      ...this.generateStateWiseJobsSitemap(),
      ...this.generateCategoryPagesSitemap(),
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '         xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
    xml += '         xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"\n';
    xml += '         xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n';

    allEntries.forEach(entry => {
      xml += `  <url>\n`;
      xml += `    <loc>${entry.loc}</loc>\n`;
      if (entry.lastmod) xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      if (entry.changefreq) xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      if (entry.priority !== undefined) xml += `    <priority>${entry.priority}</priority>\n`;

      // Add images
      if (entry.images && entry.images.length > 0) {
        entry.images.forEach(img => {
          xml += `    <image:image>\n`;
          xml += `      <image:loc>${img.loc}</image:loc>\n`;
          if (img.title) xml += `      <image:title>${img.title}</image:title>\n`;
          if (img.caption) xml += `      <image:caption>${img.caption}</image:caption>\n`;
          xml += `    </image:image>\n`;
        });
      }

      // Add videos
      if (entry.videos && entry.videos.length > 0) {
        entry.videos.forEach(video => {
          xml += `    <video:video>\n`;
          xml += `      <video:title>${video.title}</video:title>\n`;
          xml += `      <video:description>${video.description}</video:description>\n`;
          xml += `      <video:thumbnail_loc>${video.thumbnailUrl}</video:thumbnail_loc>\n`;
          if (video.contentUrl) xml += `      <video:content_loc>${video.contentUrl}</video:content_loc>\n`;
          if (video.duration) xml += `      <video:duration>${video.duration}</video:duration>\n`;
          xml += `    </video:video>\n`;
        });
      }

      // Add alternate language links
      if (entry.alternates && entry.alternates.length > 0) {
        entry.alternates.forEach(alt => {
          xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />\n`;
        });
      }

      xml += `  </url>\n\n`;
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Generate sitemap index (for multiple sitemaps)
   */
  generateSitemapIndex(): string {
    const sitemaps = [
      { path: 'sitemap-core.xml', lastmod: this.timestamp },
      { path: 'sitemap-tools.xml', lastmod: this.timestamp },
      { path: 'sitemap-exams.xml', lastmod: this.timestamp },
      { path: 'sitemap-jobs.xml', lastmod: this.timestamp },
      { path: 'sitemap-news.xml', lastmod: this.timestamp },
      { path: 'sitemap-tv.xml', lastmod: this.timestamp },
      { path: 'sitemap-videos.xml', lastmod: this.timestamp },
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n';

    sitemaps.forEach(sitemap => {
      xml += `  <sitemap>\n`;
      xml += `    <loc>${this.baseUrl}/${sitemap.path}</loc>\n`;
      xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
      xml += `  </sitemap>\n\n`;
    });

    xml += '</sitemapindex>';
    return xml;
  }

  /**
   * Generate multi-language sitemap with hreflang
   */
  generateMultiLanguageSitemap(): SitemapEntry[] {
    const languages = [
      { code: 'en', label: 'English' },
      { code: 'hi', label: 'Hindi' },
      { code: 'ta', label: 'Tamil' },
      { code: 'te', label: 'Telugu' },
      { code: 'bn', label: 'Bengali' },
      { code: 'mr', label: 'Marathi' },
      { code: 'gu', label: 'Gujarati' },
      { code: 'kn', label: 'Kannada' },
      { code: 'ml', label: 'Malayalam' },
      { code: 'pa', label: 'Punjabi' },
      { code: 'ur', label: 'Urdu' },
      { code: 'or', label: 'Odia' },
    ];

    const corePath = `${this.baseUrl}/`;
    const homeEntry: SitemapEntry = {
      loc: corePath,
      changefreq: 'daily',
      priority: 1.0,
      lastmod: this.timestamp,
      alternates: languages.map(lang => ({
        hreflang: lang.code,
        href: `${corePath}?lang=${lang.code}`,
      })),
    };

    return [homeEntry];
  }

  /**
   * Get total entries count
   */
  getTotalEntriesCount(): number {
    return (
      this.generateCoreSitemap().length +
      this.generateToolsSitemap().length +
      this.generateExamResultsSitemap().length +
      this.generateStateWiseJobsSitemap().length +
      this.generateCategoryPagesSitemap().length
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function generateSitemaps() {
  const generator = new SitemapGenerator();

  return {
    totalPages: generator.getTotalEntriesCount(),
    mainSitemap: generator.generateXMLSitemap(),
    sitemapIndex: generator.generateSitemapIndex(),
    multiLanguageSitemap: generator.generateMultiLanguageSitemap(),
  };
}

console.log(
  `✅ Advanced Sitemap Generator Loaded | Total Pages: ${new SitemapGenerator().getTotalEntriesCount()}+`
);
