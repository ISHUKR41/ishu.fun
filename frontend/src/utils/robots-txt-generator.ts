/**
 * ADVANCED ROBOTS.TXT GENERATOR
 * Optimized crawler directives for all search engines
 * 
 * Covers:
 * - Google, Bing, Baidu, Yandex, DuckDuckGo
 * - Optimal crawl directive
 * - Crawl-delay optimization
 * - User-agent specific rules
 * - Disallow bad bots and scrapers
 */

export function generateAdvancedRobotsTxt(): string {
  return `# ═══════════════════════════════════════════════════════════════════════════════
# ISHU — Indian StudentHub University
# Advanced robots.txt — Optimized for Maximum SEO & Global Indexing
# Last Updated: 2026-03-19
# ═══════════════════════════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════════════════════════
# DEFAULT RULES (All bots)
# ═══════════════════════════════════════════════════════════════════════════════

User-agent: *

# Allow complete site crawling for SEO
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/private/
Disallow: /backend/
Disallow: /temp/
Disallow: /cache/
Disallow: /.env
Disallow: /config/
Disallow: /*.json$
Disallow: /auth/login/
Disallow: /auth/register/

# Disallow duplicate/session pages
Disallow: /*?*source=*
Disallow: /*?*utm_*
Disallow: /*?*gclid=*
Disallow: /*?*fbclid=*
Disallow: /*?*msclkid=*
Disallow: /*?*sort=*
Disallow: /*?*filter=*
Disallow: /*?*page=*
Disallow: /*&*

# Allow important parameters
Allow: /*?lang=*
Allow: /*?category=*
Allow: /*?state=*

# Crawl delay for bots (be respectful)
Crawl-delay: 2

# Request rate limit
Request-rate: 10/1m

# Sitemaps
Sitemap: https://ishu.fun/sitemap.xml
Sitemap: https://ishu.fun/sitemap-index.xml
Sitemap: https://ishu.fun/sitemap-core.xml
Sitemap: https://ishu.fun/sitemap-tools.xml
Sitemap: https://ishu.fun/sitemap-exams.xml
Sitemap: https://ishu.fun/sitemap-jobs.xml
Sitemap: https://ishu.fun/sitemap-news.xml
Sitemap: https://ishu.fun/sitemap-tv.xml
Sitemap: https://ishu.fun/sitemap-videos.xml

# ═══════════════════════════════════════════════════════════════════════════════
# GOOGLE BOT (Googlebot & variations)
# ═══════════════════════════════════════════════════════════════════════════════

User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/private/
Crawl-delay: 0
Request-rate: 33/1h

User-agent: Googlebot-Image
Allow: /
Crawl-delay: 1
Request-rate: 33/1h

User-agent: Googlebot-Video
Allow: /
Crawl-delay: 1
Request-rate: 33/1h

User-agent: Googlebot-News
Allow: /
Crawl-delay: 0
Request-rate: 50/1h

# ═══════════════════════════════════════════════════════════════════════════════
# BING BOT (Bingbot & variations)
# ═══════════════════════════════════════════════════════════════════════════════

User-agent: Bingbot
Allow: /
Disallow: /admin/
Crawl-delay: 1
Request-rate: 20/1h

User-agent: Bingbot-Image
Allow: /
Crawl-delay: 1

User-agent: Bingbot-Video
Allow: /
Crawl-delay: 1

# ═══════════════════════════════════════════════════════════════════════════════
# YANDEX BOT (Russia's major search engine)
# ═══════════════════════════════════════════════════════════════════════════════

User-agent: Yandex
Allow: /
Disallow: /admin/
Crawl-delay: 1
Request-rate: 15/1h

User-agent: YandexImages
Allow: /
Crawl-delay: 1

User-agent: YandexVideo
Allow: /
Crawl-delay: 1

User-agent: YandexBot
Allow: /
Crawl-delay: 1

# ═══════════════════════════════════════════════════════════════════════════════
# BAIDU BOT (China's major search engine)
# ═══════════════════════════════════════════════════════════════════════════════

User-agent: Baiduspider
Allow: /
Disallow: /admin/
Crawl-delay: 2

User-agent: Baiduspider-image
Allow: /
Crawl-delay: 1

User-agent: Baiduspider-video
Allow: /
Crawl-delay: 1

User-agent: Baiduspider-news
Allow: /
Crawl-delay: 1

# ═══════════════════════════════════════════════════════════════════════════════
# DUCKDUCKGO BOT (Privacy-focused search)
# ═══════════════════════════════════════════════════════════════════════════════

User-agent: DuckDuckBot
Allow: /
Disallow: /admin/
Crawl-delay: 1
Request-rate: 15/1h

User-agent: DuckDuckBot-Ads
Allow: /
Crawl-delay: 1

# ═══════════════════════════════════════════════════════════════════════════════
# OTHER MAJOR SEARCH ENGINES
# ═══════════════════════════════════════════════════════════════════════════════

User-agent: Yahoo! Slurp
Allow: /
Disallow: /admin/
Crawl-delay: 1
Request-rate: 10/1h

User-agent: Sogou web spider
Allow: /
Crawl-delay: 2

User-agent: QihooBot
Allow: /
Crawl-delay: 2

User-agent: Slurp
Allow: /
Crawl-delay: 1

# ═══════════════════════════════════════════════════════════════════════════════
# SOCIAL MEDIA CRAWLERS (Allowed for better sharing)
# ═══════════════════════════════════════════════════════════════════════════════

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: Telegram
Allow: /

User-agent: Slackbot
Allow: /

User-agent: Discordbot
Allow: /

User-agent: PinterestBot
Allow: /

# ═══════════════════════════════════════════════════════════════════════════════
# GOOD BOTS (Allow for better indexing & analytics)
# ═══════════════════════════════════════════════════════════════════════════════

User-agent: Mediapartners-Google
Allow: /

User-agent: AdsBot-Google
Allow: /

User-agent: AdsBot-Google-Mobile
Allow: /

User-agent: Googlebot-Mobile
Allow: /

User-agent: Applebot
Allow: /

User-agent: SemrushBot
Allow: /

User-agent: SemrushBot-SA
Allow: /

User-agent: AhrefsBot
Allow: /

User-agent: MJ12bot
Allow: /

User-agent: SEMrushBot
Allow: /

User-agent: DotBot
Allow: /

User-agent: Majestic
Allow: /

User-agent: BLEXBot
Allow: /

User-agent: Exabot
Allow: /

User-agent: Screaming Frog SEO Spider
Allow: /

User-agent: Moz-ProductionBot
Allow: /

# ═══════════════════════════════════════════════════════════════════════════════
# BAD BOTS & SCRAPERS (Block malicious crawlers)
# ═══════════════════════════════════════════════════════════════════════════════

User-agent: MJ12bot/v1.4.8
Disallow: /

User-agent: AhrefsBot/5.2
Disallow: /

User-agent: SemrushBot/3~bl
Disallow: /

User-agent: DotBot/1.1
Disallow: /

User-agent: MojeekBot/0.6
Disallow: /

User-agent: *bot*
Disallow: /admin/

User-agent: *crawler*
Disallow: /admin/

User-agent: *spider*
Disallow: /admin/

# Specific bad bots and scrapers
User-agent: BadBot
Disallow: /

User-agent: EvilBot
Disallow: /

User-agent: ScrapeBot
Disallow: /

User-agent: VelocityBot
Disallow: /

User-agent: Purebot
Disallow: /

User-agent: Curl
Disallow: /

User-agent: Wget
Disallow: /

User-agent: Python
Disallow: /

User-agent: Java
Disallow: /

User-agent: Ruby
Disallow: /

User-agent: Node-fetch
Disallow: /

User-agent: Axios
Disallow: /

# ═══════════════════════════════════════════════════════════════════════════════
# MOBILE OPTIMIZATION
# ═══════════════════════════════════════════════════════════════════════════════

User-agent: Googlebot-Mobile
Allow: /
Crawl-delay: 0

# ═══════════════════════════════════════════════════════════════════════════════
# API & RATE LIMITING
# ═══════════════════════════════════════════════════════════════════════════════

# Protect API endpoints
User-agent: *
Disallow: /api/
Allow: /api/public/

# Protect sensitive areas
Disallow: /.well-known/
Disallow: /.git/
Disallow: /.htaccess

# ═══════════════════════════════════════════════════════════════════════════════
# PERFORMANCE & OPTIMIZATION
# ═══════════════════════════════════════════════════════════════════════════════

# Cache crawl optimization
Request-rate: 25/1m

# Let search engines know about feeds
Allow: /feed/
Allow: /rss/
Allow: /atom/

# Allow static assets for rendering
Allow: /assets/
Allow: /images/
Allow: /css/
Allow: /js/
Allow: /public/

# ═══════════════════════════════════════════════════════════════════════════════
# SEARCH QUALITY GUIDELINES
# ═══════════════════════════════════════════════════════════════════════════════

# Allow quality assessment tools
User-agent: Google
Allow: /

User-agent: Bingbot
Allow: /

# Prevent indexing of test pages
Disallow: /test/
Disallow: /staging/
Disallow: /preview/
Disallow: /draft/

# ═══════════════════════════════════════════════════════════════════════════════
# END OF ROBOTS.TXT
# ═══════════════════════════════════════════════════════════════════════════════

# Additional notes:
# 1. This robots.txt is optimized for MAXIMUM INDEXING and SEO
# 2. All major search engines are allowed to crawl
# 3. Bad bots and scrapers are blocked
# 4. Core pages have optimal crawl rates
# 5. Protected areas are properly restricted
# 6. Sitemaps are provided for better discovery
# 7. Multi-language support is configured
# 8. Mobile optimization is included

# For questions or updates, contact: support@ishu.fun
`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT ROBOTS.TXT
// ═══════════════════════════════════════════════════════════════════════════════

export const ROBOTS_TXT = generateAdvancedRobotsTxt();

console.log('✅ Advanced Robots.txt Configuration Generated');
