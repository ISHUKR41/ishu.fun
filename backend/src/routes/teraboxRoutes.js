/**
 * teraboxRoutes.js - Terabox File Downloader API
 *
 * Uses Terabox unofficial API + scraping as fallback.
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const TERABOX_DOMAINS = ['terabox.com', '1024terabox.com', 'teraboxapp.com', 'terasharelink.com', 'terafileshare.com'];

function isTeraboxUrl(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return TERABOX_DOMAINS.some(d => hostname.includes(d));
  } catch { return false; }
}

function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(Math.max(0, decimals))) + ' ' + sizes[i];
}

function normalizeTeraboxUrl(url) {
  try {
    const u = new URL(url);
    // Convert different domain formats to main terabox.com
    const pathname = u.pathname;
    const search = u.search;
    return `https://www.terabox.com${pathname}${search}`;
  } catch {
    return url;
  }
}

function extractShortUrl(url) {
  // Handle /s/XXXXX pattern
  const match = url.match(/\/s\/([A-Za-z0-9_-]+)/);
  if (match) return match[1];
  // Handle surl= pattern
  const surlMatch = url.match(/[?&]surl=([^&]+)/);
  if (surlMatch) return surlMatch[1];
  return null;
}

/**
 * Try multiple methods to extract Terabox file info
 */
async function extractTeraboxInfo(url) {
  const shortUrl = extractShortUrl(url);

  // Method 1: Use terabox API endpoint directly
  if (shortUrl) {
    try {
      const apiUrl = `https://www.terabox.com/api/shorturlinfo?shorturl=${shortUrl}`;
      const r = await axios.get(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Referer': 'https://www.terabox.com/',
          'Accept': 'application/json',
        },
        timeout: 15000,
      });

      const data = r.data;
      if (data && data.errno === 0 && data.info) {
        const files = data.info.files || data.info.file_list || [];
        if (files.length > 0) {
          const file = files[0];
          return {
            filename: file.server_filename || file.filename || 'file',
            size: parseInt(file.size || 0),
            sizeFormatted: formatBytes(parseInt(file.size || 0)),
            fileType: file.category || 1,
            thumbnail: file.thumbs?.url3 || file.thumbs?.url2 || file.thumbs?.url1 || null,
            downloadUrl: file.dlink || null,
            isVideo: file.category === 1,
            isImage: file.category === 3,
          };
        }
      }
    } catch (e) {
      console.warn('[Terabox] API method 1 failed:', e.message);
    }
  }

  // Method 2: Use terabox.fun unofficial API (no login required)
  if (shortUrl) {
    try {
      const apiUrl = `https://terabox.fun/api/get-info?url=https://www.terabox.com/s/${shortUrl}`;
      const r = await axios.get(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Origin': 'https://terabox.fun',
          'Referer': 'https://terabox.fun/',
        },
        timeout: 15000,
      });
      const data = r.data;
      if (data && (data.ok || data.success) && data.data) {
        const file = Array.isArray(data.data) ? data.data[0] : data.data;
        if (file) {
          return {
            filename: file.filename || file.name || 'file',
            size: parseInt(file.size || 0),
            sizeFormatted: formatBytes(parseInt(file.size || 0)),
            fileType: file.category || 0,
            thumbnail: file.thumbs?.url3 || file.thumbs?.url2 || file.thumb || null,
            downloadUrl: file.dlink || file.download_url || null,
            isVideo: (file.category === 1) || (file.filename || '').match(/\.(mp4|mkv|avi|mov|webm)$/i) !== null,
            isImage: (file.category === 3) || (file.filename || '').match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null,
          };
        }
      }
    } catch (e) {
      console.warn('[Terabox] API method 2 (terabox.fun) failed:', e.message);
    }
  }

  // Method 3: Scrape the share page
  try {
    const shareUrl = shortUrl
      ? `https://www.terabox.com/s/${shortUrl}`
      : normalizeTeraboxUrl(url);

    console.log(`[Terabox] Scraping: ${shareUrl}`);

    const response = await axios.get(shareUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.google.com/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
      },
      timeout: 20000,
      maxRedirects: 10,
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const scriptContent = $('script').text();

    // Try window.locals
    const localsMatch = scriptContent.match(/window\.locals\s*=\s*({[\s\S]*?});/);
    if (localsMatch) {
      try {
        const locals = JSON.parse(localsMatch[1]);
        const files = locals.file_list || locals.fileList || [];
        if (files.length > 0) {
          const file = files[0];
          return {
            filename: file.server_filename || file.filename || 'file',
            size: parseInt(file.size || 0),
            sizeFormatted: formatBytes(parseInt(file.size || 0)),
            fileType: file.category,
            thumbnail: file.thumbs?.url3 || file.thumbs?.url2 || null,
            downloadUrl: file.dlink || null,
            isVideo: file.category === 1,
            isImage: file.category === 3,
          };
        }
      } catch (e) { console.warn('[Terabox] locals parse fail:', e.message); }
    }

    // Try yunData.setData
    const yunMatch = scriptContent.match(/yunData\.setData\(({[\s\S]*?})\)/);
    if (yunMatch) {
      try {
        const yun = JSON.parse(yunMatch[1]);
        const files = yun.file_list || [];
        if (files.length > 0) {
          const file = files[0];
          return {
            filename: file.server_filename || file.filename || 'file',
            size: parseInt(file.size || 0),
            sizeFormatted: formatBytes(parseInt(file.size || 0)),
            fileType: file.category,
            thumbnail: file.thumbs?.url3 || file.thumbs?.url2 || null,
            downloadUrl: file.dlink || null,
            isVideo: file.category === 1,
            isImage: file.category === 3,
          };
        }
      } catch (e) { console.warn('[Terabox] yunData parse fail:', e.message); }
    }

    // Try to find any JSON with file data
    const jsonMatches = scriptContent.matchAll(/\{[^{}]*"filename"[^{}]*\}/g);
    for (const match of jsonMatches) {
      try {
        const obj = JSON.parse(match[0]);
        if (obj.filename || obj.server_filename) {
          return {
            filename: obj.server_filename || obj.filename || 'file',
            size: parseInt(obj.size || 0),
            sizeFormatted: formatBytes(parseInt(obj.size || 0)),
            fileType: obj.category || 0,
            thumbnail: obj.thumbs?.url3 || null,
            downloadUrl: obj.dlink || null,
            isVideo: obj.category === 1,
            isImage: obj.category === 3,
          };
        }
      } catch { }
    }

    // Extract title from page
    const pageTitle = $('title').text() || '';
    const h1 = $('h1, .file-name, .filename').first().text() || '';
    const filename = h1 || pageTitle.replace(' - Terabox', '').trim() || 'Unknown file';

    return {
      filename,
      size: 0,
      sizeFormatted: 'Unknown size',
      fileType: 0,
      thumbnail: null,
      downloadUrl: null,
      isVideo: false,
      isImage: false,
      requiresLogin: html.includes('login') || html.includes('sign in'),
    };

  } catch (error) {
    console.error('[Terabox] Scraping error:', error.message);
    throw new Error(`Could not access Terabox file: ${error.message}`);
  }
}

/**
 * GET /api/tools/terabox-info
 */
router.get('/terabox-info', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ success: false, error: 'URL is required' });
    if (!isTeraboxUrl(url)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid Terabox share URL' });
    }

    console.log(`[Terabox Info] Fetching: ${url}`);
    const info = await extractTeraboxInfo(url);

    res.json({
      success: true,
      data: {
        filename: info.filename,
        size: info.size,
        sizeFormatted: info.sizeFormatted || formatBytes(info.size),
        fileType: info.fileType,
        thumbnail: info.thumbnail,
        canDownload: !!info.downloadUrl,
        isVideo: info.isVideo,
        isImage: info.isImage,
        requiresLogin: info.requiresLogin || false,
      },
    });
  } catch (error) {
    console.error('[Terabox Info] Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Could not fetch file info. The link may be expired, private, or require login.',
      details: error.message,
    });
  }
});

/**
 * POST /api/tools/terabox-download
 * Redirects to direct download URL (can't proxy large files on free tier)
 */
router.post('/terabox-download', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'URL is required' });
    if (!isTeraboxUrl(url)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid Terabox share URL' });
    }

    console.log(`[Terabox Download] ${url}`);
    const info = await extractTeraboxInfo(url);

    if (!info.downloadUrl) {
      return res.status(400).json({
        success: false,
        error: 'Direct download link not available. The file may require Terabox login or is not publicly shared.',
        requiresLogin: info.requiresLogin || false,
      });
    }

    // For large files, redirect to the direct link rather than proxying
    // This is more reliable and doesn't strain the server
    res.json({
      success: true,
      data: {
        filename: info.filename,
        size: info.size,
        sizeFormatted: info.sizeFormatted,
        downloadUrl: info.downloadUrl,
        directLink: info.downloadUrl,
        message: 'Use the direct download link to download the file.',
      },
    });
  } catch (error) {
    console.error('[Terabox Download] Error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Download failed. The Terabox link may be expired or invalid.',
      details: error.message,
    });
  }
});

module.exports = router;
