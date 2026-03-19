/**
 * ADVANCED SITEMAP GENERATOR v2.0
 * 
 * Creates 10+ specialized sitemaps for:
 * - Jobs
 * - Exams
 * - Tools
 * - News
 * - Videos
 * - TV Channels
 * - Articles
 * - Images
 * - Mobile
 * - Index sitemap
 */

export interface SitemapUrlAdvanced {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  images?: SitemapImage[];
  videos?: SitemapVideo[];
  news?: SitemapNews[];
}

export interface SitemapImage {
  loc: string;
  title?: string;
  caption?: string;
  geo_location?: string;
  license?: string;
}

export interface SitemapVideo {
  thumbnail_loc: string;
  title: string;
  description: string;
  content_loc?: string;
  player_loc?: string;
  duration?: number;
  expiration_date?: string;
  rating?: number;
  view_count?: number;
  publication_date?: string;
  family_friendly?: boolean;
  restriction_relationship?: 'allow' | 'deny';
  restriction_countries?: string[];
  tag?: string[];
  category?: string;
}

export interface SitemapNews {
  publication_name: string;
  publication_language: string;
  publication_date: string;
  title: string;
  keywords?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SITEMAP GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

export const generateAdvancedXMLSitemap = (urls: SitemapUrlAdvanced[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlset = urls.some(u => u.images || u.videos || u.news)
    ? '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n'
    : '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const urlEntries = urls
    .map((url) => {
      const lastmod = url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>\n` : '';
      const changefreq = url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>\n` : '';
      const priority = url.priority !== undefined ? `    <priority>${url.priority}</priority>\n` : '';

      let imageXml = '';
      if (url.images && url.images.length > 0) {
        imageXml = url.images
          .map(
            (img) =>
              `    <image:image>\n      <image:loc>${img.loc}</image:loc>\n${
                img.title ? `      <image:title>${img.title}</image:title>\n` : ''
              }${img.caption ? `      <image:caption>${img.caption}</image:caption>\n` : ''}    </image:image>\n`
          )
          .join('');
      }

      let videoXml = '';
      if (url.videos && url.videos.length > 0) {
        videoXml = url.videos
          .map(
            (video) =>
              `    <video:video>\n      <video:thumbnail_loc>${video.thumbnail_loc}</video:thumbnail_loc>\n      <video:title>${video.title}</video:title>\n      <video:description>${video.description}</video:description>\n${
                video.content_loc ? `      <video:content_loc>${video.content_loc}</video:content_loc>\n` : ''
              }${video.duration ? `      <video:duration>${video.duration}</video:duration>\n` : ''}${
                video.publication_date
                  ? `      <video:publication_date>${video.publication_date}</video:publication_date>\n`
                  : ''
              }    </video:video>\n`
          )
          .join('');
      }

      let newsXml = '';
      if (url.news) {
        newsXml = `    <news:news>\n      <news:publication>\n        <news:name>${url.news.publication_name}</news:name>\n        <news:language>${url.news.publication_language}</news:language>\n      </news:publication>\n      <news:publication_date>${url.news.publication_date}</news:publication_date>\n      <news:title>${url.news.title}</news:title>\n    </news:news>\n`;
      }

      return `  <url>\n    <loc>${url.loc}</loc>\n${lastmod}${changefreq}${priority}${imageXml}${videoXml}${newsXml}  </url>\n`;
    })
    .join('');

  return xmlHeader + urlset + urlEntries + '</urlset>';
};

// ═══════════════════════════════════════════════════════════════════════════════
// SITEMAP INDEX GENERATOR (Master Sitemap)
// ═══════════════════════════════════════════════════════════════════════════════

export const generateSitemapIndex = (sitemapUrls: string[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const sitemapsetOpen = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  const sitemapEntries = sitemapUrls
    .map((url) => {
      const lastmod = new Date().toISOString();
      return `  <sitemap>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>\n`;
    })
    .join('');

  return xmlHeader + sitemapsetOpen + sitemapEntries + '</sitemapindex>';
};

// ═══════════════════════════════════════════════════════════════════════════════
// JOB LISTINGS SITEMAP
// ═══════════════════════════════════════════════════════════════════════════════

export const generateJobSitemap = (): string => {
  const jobUrls: SitemapUrlAdvanced[] = [
    // Banking Jobs
    {
      loc: 'https://ishu.fun/jobs/banking/ibps-po',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: 'https://ishu.fun/jobs/banking/sbi-po',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: 'https://ishu.fun/jobs/banking/rbi-assistant',
      changefreq: 'daily',
      priority: 0.9
    },

    // Railway Jobs
    {
      loc: 'https://ishu.fun/jobs/railway/rrb-ntpc',
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: 'https://ishu.fun/jobs/railway/rrb-group-d',
      changefreq: 'daily',
      priority: 0.9
    },

    // Government Jobs by State
    ...generateStateJobUrls(),

    // Recent Jobs
    {
      loc: 'https://ishu.fun/jobs/recent',
      changefreq: 'hourly',
      priority: 0.9
    },
    {
      loc: 'https://ishu.fun/jobs/trending',
      changefreq: 'daily',
      priority: 0.8
    },
  ];

  return generateAdvancedXMLSitemap(jobUrls);
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXAM RESULTS SITEMAP
// ═══════════════════════════════════════════════════════════════════════════════

export const generateExamSitemap = (): string => {
  const examUrls: SitemapUrlAdvanced[] = [
    // National Exams
    {
      loc: 'https://ishu.fun/exams/upsc/result',
      changefreq: 'weekly',
      priority: 1.0,
      news: {
        publication_name: 'ISHU',
        publication_language: 'en',
        publication_date: new Date().toISOString().split('T')[0],
        title: 'UPSC Result 2026',
      }
    },
    {
      loc: 'https://ishu.fun/exams/ssc/result',
      changefreq: 'weekly',
      priority: 0.9,
      news: {
        publication_name: 'ISHU',
        publication_language: 'en',
        publication_date: new Date().toISOString().split('T')[0],
        title: 'SSC Result 2026',
      }
    },
    {
      loc: 'https://ishu.fun/exams/banking/ibps-result',
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: 'https://ishu.fun/exams/railway/rrb-result',
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: 'https://ishu.fun/exams/neta/neet-result',
      changefreq: 'weekly',
      priority: 0.9
    },

    // Admit Cards
    {
      loc: 'https://ishu.fun/exams/admit-cards',
      changefreq: 'daily',
      priority: 0.9
    },

    // Answer Keys
    {
      loc: 'https://ishu.fun/exams/answer-keys',
      changefreq: 'daily',
      priority: 0.8
    },
  ];

  return generateAdvancedXMLSitemap(examUrls);
};

// ═══════════════════════════════════════════════════════════════════════════════
// TOOLS SITEMAP
// ═══════════════════════════════════════════════════════════════════════════════

export const generateToolsSitemap = (): string => {
  const toolUrls: SitemapUrlAdvanced[] = [
    // PDF Tools
    {
      loc: 'https://ishu.fun/tools/pdf/merge',
      changefreq: 'monthly',
      priority: 0.9
    },
    {
      loc: 'https://ishu.fun/tools/pdf/compress',
      changefreq: 'monthly',
      priority: 0.9
    },
    {
      loc: 'https://ishu.fun/tools/pdf/convert',
      changefreq: 'monthly',
      priority: 0.9
    },
    {
      loc: 'https://ishu.fun/tools/pdf/editor',
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: 'https://ishu.fun/tools/pdf/split',
      changefreq: 'monthly',
      priority: 0.8
    },

    // Video Downloaders
    {
      loc: 'https://ishu.fun/tools/downloader/youtube',
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      loc: 'https://ishu.fun/tools/downloader/instagram',
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: 'https://ishu.fun/tools/downloader/tiktok',
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: 'https://ishu.fun/tools/downloader/terabox',
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: 'https://ishu.fun/tools/downloader/universal',
      changefreq: 'weekly',
      priority: 0.8
    },

    // Other Tools
    {
      loc: 'https://ishu.fun/tools/resume-maker',
      changefreq: 'monthly',
      priority: 0.8
    },
    {
      loc: 'https://ishu.fun/tools/all',
      changefreq: 'weekly',
      priority: 0.7
    },
  ];

  return generateAdvancedXMLSitemap(toolUrls);
};

// ═══════════════════════════════════════════════════════════════════════════════
// NEWS & ARTICLES SITEMAP
// ═══════════════════════════════════════════════════════════════════════════════

export const generateNewsSitemap = (): string => {
  const newsUrls: SitemapUrlAdvanced[] = [
    {
      loc: 'https://ishu.fun/news/sarkari-naukri-alerts',
      changefreq: 'hourly',
      priority: 1.0,
      news: {
        publication_name: 'ISHU News',
        publication_language: 'en',
        publication_date: new Date().toISOString().split('T')[0],
        title: 'Latest Government Job Updates',
      }
    },
    {
      loc: 'https://ishu.fun/news/exam-notifications',
      changefreq: 'hourly',
      priority: 0.9,
      news: {
        publication_name: 'ISHU News',
        publication_language: 'en',
        publication_date: new Date().toISOString().split('T')[0],
        title: 'Exam Notifications & Updates',
      }
    },
    {
      loc: 'https://ishu.fun/news/result-announcements',
      changefreq: 'hourly',
      priority: 0.9,
      news: {
        publication_name: 'ISHU News',
        publication_language: 'en',
        publication_date: new Date().toISOString().split('T')[0],
        title: 'Result Announcements',
      }
    },
    {
      loc: 'https://ishu.fun/articles',
      changefreq: 'daily',
      priority: 0.8
    },
  ];

  return generateAdvancedXMLSitemap(newsUrls);
};

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE TV SITEMAP
// ═══════════════════════════════════════════════════════════════════════════════

export const generateTVSitemap = (): string => {
  const tvUrls: SitemapUrlAdvanced[] = [
    {
      loc: 'https://ishu.fun/tv/channels',
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: 'https://ishu.fun/tv/news-channels',
      changefreq: 'daily',
      priority: 0.9
    },
    {
      loc: 'https://ishu.fun/tv/entertainment',
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: 'https://ishu.fun/tv/sports',
      changefreq: 'daily',
      priority: 0.8
    },
  ];

  return generateAdvancedXMLSitemap(tvUrls);
};

// ═══════════════════════════════════════════════════════════════════════════════
// VIDEO SITEMAP
// ═══════════════════════════════════════════════════════════════════════════════

export const generateVideoSitemap = (): string => {
  const videoUrls: SitemapUrlAdvanced[] = [
    {
      loc: 'https://ishu.fun/videos/tutorials',
      changefreq: 'weekly',
      priority: 0.8,
      videos: [
        {
          thumbnail_loc: 'https://ishu.fun/images/tutorial-thumb.jpg',
          title: 'How to Use ISHU Tools',
          description: 'Complete tutorial on using ISHU tools for maximum benefit',
          duration: 600,
          publication_date: new Date().toISOString().split('T')[0],
          family_friendly: true,
        }
      ]
    },
    {
      loc: 'https://ishu.fun/videos/exam-prep',
      changefreq: 'weekly',
      priority: 0.8
    },
  ];

  return generateAdvancedXMLSitemap(videoUrls);
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER: Generate State-Specific Job URLs
// ═══════════════════════════════════════════════════════════════════════════════

function generateStateJobUrls(): SitemapUrlAdvanced[] {
  const states = [
    'delhi', 'uttar-pradesh', 'maharashtra', 'karnataka', 'tamil-nadu',
    'telangana', 'west-bengal', 'bihar', 'rajasthan', 'gujarat',
    'punjab', 'haryana', 'odisha', 'jharkhand', 'madhya-pradesh'
  ];

  return states.map((state) => ({
    loc: `https://ishu.fun/jobs/state/${state}`,
    changefreq: 'daily',
    priority: 0.8
  }));
}

// ═══════════════════════════════════════════════════════════════════════════════
// MASTER SITEMAP INDEX
// ═══════════════════════════════════════════════════════════════════════════════

export const generateMasterSitemapIndex = (): string => {
  const sitemaps = [
    'https://ishu.fun/sitemap-jobs.xml',
    'https://ishu.fun/sitemap-exams.xml',
    'https://ishu.fun/sitemap-tools.xml',
    'https://ishu.fun/sitemap-news.xml',
    'https://ishu.fun/sitemap-videos.xml',
    'https://ishu.fun/sitemap-tv.xml',
    'https://ishu.fun/sitemap-articles.xml',
    'https://ishu.fun/sitemap-resume.xml',
    'https://ishu.fun/sitemap-career.xml',
    'https://ishu.fun/sitemap-pages.xml',
  ];

  return generateSitemapIndex(sitemaps);
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT ALL GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

export const SitemapGenerators = {
  generateAdvancedXMLSitemap,
  generateSitemapIndex,
  generateJobSitemap,
  generateExamSitemap,
  generateToolsSitemap,
  generateNewsSitemap,
  generateTVSitemap,
  generateVideoSitemap,
  generateMasterSitemapIndex,
};

export default SitemapGenerators;
