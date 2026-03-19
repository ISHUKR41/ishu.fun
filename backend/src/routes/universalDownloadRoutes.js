/**
 * universalDownloadRoutes.js - Universal Video Downloader API
 *
 * Strategy:
 * - YouTube/YoutubeShort: uses @distube/ytdl-core (pure JS, reliable)
 *   - Returns direct URL (redirect) instead of streaming to avoid memory issues
 *   - Falls back to cobalt.tools if ytdl-core fails
 * - Other platforms: uses cobalt.tools API (free, no API key needed, supports 1000+ sites)
 */

const express = require('express');
const router = express.Router();
const ytdl = require('@distube/ytdl-core');
const axios = require('axios');

// cobalt.tools API v10+ endpoint - with fallback instances
const COBALT_API_URL = 'https://api.cobalt.tools/';
const COBALT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

// List of cobalt.tools community instances to try as fallback
const COBALT_FALLBACK_INSTANCES = [
  'https://api.cobalt.tools/',
  'https://cbl.tnix.dev/',
  'https://cobalt.api.timelessnesses.me/',
  'https://cobalt-api.rlhf.fun/',
];

const SUPPORTED_PLATFORMS = [
  { name: 'YouTube', domains: ['youtube.com', 'youtu.be'], icon: '🎥' },
  { name: 'Instagram', domains: ['instagram.com'], icon: '📷' },
  { name: 'Twitter/X', domains: ['twitter.com', 'x.com'], icon: '🐦' },
  { name: 'TikTok', domains: ['tiktok.com'], icon: '🎵' },
  { name: 'Facebook', domains: ['facebook.com', 'fb.watch'], icon: '📘' },
  { name: 'Vimeo', domains: ['vimeo.com'], icon: '🎬' },
  { name: 'Dailymotion', domains: ['dailymotion.com'], icon: '📹' },
  { name: 'Twitch', domains: ['twitch.tv'], icon: '🎮' },
  { name: 'Reddit', domains: ['reddit.com', 'redd.it'], icon: '🤖' },
  { name: 'Soundcloud', domains: ['soundcloud.com'], icon: '🎧' },
  { name: 'Pinterest', domains: ['pinterest.com'], icon: '📌' },
  { name: 'Tumblr', domains: ['tumblr.com'], icon: '📝' },
  { name: 'Streamable', domains: ['streamable.com'], icon: '📺' },
  { name: 'Bilibili', domains: ['bilibili.com'], icon: '🎭' },
  { name: 'Bandcamp', domains: ['bandcamp.com'], icon: '🎸' },
  { name: 'Rutube', domains: ['rutube.ru'], icon: '📡' },
  { name: 'VK', domains: ['vk.com', 'vkvideo.ru'], icon: '🇷🇺' },
  { name: 'Niconico', domains: ['nicovideo.jp'], icon: '🎌' },
  { name: 'Bluesky', domains: ['bsky.app'], icon: '🦋' },
  { name: 'Loom', domains: ['loom.com'], icon: '🎥' },
];

function detectPlatform(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    for (const p of SUPPORTED_PLATFORMS) {
      if (p.domains.some(d => hostname.includes(d))) return p;
    }
    return { name: hostname, domains: [hostname], icon: '🌐' };
  } catch { return null; }
}

function isYouTubeUrl(url) {
  try {
    const h = new URL(url).hostname.replace('www.', '');
    return h === 'youtube.com' || h === 'youtu.be';
  } catch { return false; }
}

function formatDuration(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatViews(n) {
  if (!n || n === 0) return '0';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

/**
 * Call cobalt.tools API (v10) — works for YouTube + 1000+ platforms
 * Tries multiple fallback instances to maximize success rate
 */
async function callCobalt(url, audioOnly = false, quality = 'max') {
  const payload = {
    url,
    downloadMode: audioOnly ? 'audio' : 'auto',
    videoQuality: quality === 'best' || quality === 'max' ? '1080' : String(parseInt(quality) || '1080'),
    audioFormat: 'mp3',
    filenameStyle: 'pretty',
  };

  let lastError = null;

  // Try each cobalt instance in order
  for (const instance of COBALT_FALLBACK_INSTANCES) {
    try {
      const res = await axios.post(instance, payload, {
        headers: COBALT_HEADERS,
        timeout: 20000,
      });
      if (res.data && res.data.status !== 'error') {
        return res.data;
      }
      // If it returned an error, keep trying other instances
      lastError = new Error(res.data?.error?.code || res.data?.text || 'Instance returned error');
    } catch (e) {
      lastError = e;
      console.warn(`[Cobalt] Instance ${instance} failed: ${e.message}`);
      continue;
    }
  }

  // All v10 instances failed — try legacy cobalt.tools endpoint
  try {
    const res2 = await axios.post('https://cobalt.tools/api/json', {
      url,
      isNoTTWatermark: true,
      isAudioOnly: audioOnly,
      vQuality: quality === 'best' ? 'max' : String(parseInt(quality) || 'max'),
    }, {
      headers: COBALT_HEADERS,
      timeout: 20000,
    });
    return res2.data;
  } catch (e2) {
    throw lastError || e2;
  }
}

/**
 * GET /api/tools/supported-platforms
 */
router.get('/supported-platforms', (req, res) => {
  res.json({ success: true, data: { platforms: SUPPORTED_PLATFORMS } });
});

/**
 * GET /api/tools/universal-info
 */
router.get('/universal-info', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ success: false, error: 'URL is required' });

    const platform = detectPlatform(url);
    if (!platform) return res.status(400).json({ success: false, error: 'Invalid URL' });

    console.log(`[Universal Info] ${platform.name}: ${url}`);

    // YouTube: use ytdl-core for rich metadata
    if (isYouTubeUrl(url) && ytdl.validateURL(url)) {
      try {
        const info = await ytdl.getInfo(url, {
          requestOptions: { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' } },
        });
        const d = info.videoDetails;
        const thumbs = d.thumbnails || [];
        const thumb = thumbs[thumbs.length - 1]?.url || '';
        const combined = info.formats.filter(f => f.hasVideo && f.hasAudio);
        const qualities = [...new Set(combined.map(f => f.qualityLabel).filter(Boolean))];

        return res.json({
          success: true,
          data: {
            platform: 'YouTube',
            platformIcon: '🎥',
            title: d.title,
            author: d.author?.name || 'Unknown',
            thumbnail: thumb,
            duration: formatDuration(parseInt(d.lengthSeconds || 0)),
            durationSeconds: parseInt(d.lengthSeconds || 0),
            views: formatViews(parseInt(d.viewCount || 0)),
            qualities: qualities.length > 0 ? qualities : ['720p', '480p', '360p'],
            isLive: d.isLiveContent || false,
            formats: combined.slice(0, 6).map(f => ({
              quality: f.qualityLabel,
              container: f.container,
              itag: f.itag,
            })),
          },
        });
      } catch (ytErr) {
        console.warn('[Universal Info] ytdl-core failed, trying cobalt:', ytErr.message);
        // Fall through to cobalt
      }
    }

    // Other platforms (or YouTube fallback): use cobalt.tools
    try {
      const cobalt = await callCobalt(url);

      if (cobalt.status === 'error') {
        return res.status(400).json({ success: false, error: cobalt.text || cobalt.error?.code || 'Platform not supported' });
      }

      return res.json({
        success: true,
        data: {
          platform: platform.name,
          platformIcon: platform.icon,
          title: cobalt.filename || cobalt.text || 'Video from ' + platform.name,
          author: platform.name,
          thumbnail: null,
          duration: null,
          qualities: ['Best Quality'],
          directUrl: cobalt.url || null,
          cobaltStatus: cobalt.status,
        },
      });
    } catch (cobaltErr) {
      console.warn('[Universal Info] Cobalt failed:', cobaltErr.message);
      return res.json({
        success: true,
        data: {
          platform: platform.name,
          platformIcon: platform.icon,
          title: 'Video from ' + platform.name,
          author: platform.name,
          thumbnail: null,
          duration: null,
          qualities: ['Best'],
          canDownload: true,
          message: 'Click download to fetch the video',
        },
      });
    }

  } catch (err) {
    console.error('[Universal Info] Error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch video information. The URL may be invalid or unsupported.',
      details: err.message,
    });
  }
});

/**
 * POST /api/tools/universal-download
 * Returns a direct download URL (redirect) — avoids streaming through backend
 */
router.post('/universal-download', async (req, res) => {
  try {
    const { url, quality = '720p', audioOnly = false } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'URL is required' });

    const platform = detectPlatform(url);
    console.log(`[Universal Download] ${platform?.name || 'Unknown'}: ${url}`);

    // YouTube: try ytdl-core first (get direct URL), fallback to cobalt
    if (isYouTubeUrl(url) && ytdl.validateURL(url)) {
      try {
        const info = await ytdl.getInfo(url, {
          requestOptions: { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' } },
        });

        let format;
        if (audioOnly) {
          format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
        } else {
          const targetH = parseInt(quality) || 720;
          const combined = info.formats
            .filter(f => f.hasVideo && f.hasAudio && f.url)
            .sort((a, b) => Math.abs((a.height || 0) - targetH) - Math.abs((b.height || 0) - targetH));
          format = combined[0];
          if (!format) {
            format = info.formats.filter(f => f.url).find(f => f.hasVideo && f.hasAudio);
          }
        }

        if (format && format.url) {
          const safeTitle = info.videoDetails.title.replace(/[^a-z0-9\s\-_]/gi, '').trim().substring(0, 60) || 'video';
          const ext = audioOnly ? 'mp3' : (format.container || 'mp4');
          return res.json({
            success: true,
            data: {
              directUrl: format.url,
              filename: `${safeTitle}.${ext}`,
              quality: format.qualityLabel || quality,
              platform: 'YouTube',
              message: 'Click to download',
            },
          });
        }
      } catch (ytErr) {
        console.warn('[Universal Download] ytdl-core failed, trying cobalt:', ytErr.message);
      }
      // Fall through to cobalt for YouTube
    }

    // All other platforms + YouTube fallback: use cobalt.tools
    try {
      const cobalt = await callCobalt(url, audioOnly, quality);

      if (cobalt.status === 'error') {
        return res.status(400).json({
          success: false,
          error: cobalt.text || cobalt.error?.code || 'Could not process this URL',
          details: 'The platform may not be fully supported or the content is restricted.',
        });
      }

      if (cobalt.url) {
        return res.json({
          success: true,
          data: {
            directUrl: cobalt.url,
            audioUrl: cobalt.audio || null,
            filename: cobalt.filename || 'download.mp4',
            message: 'Download ready',
          },
        });
      }

      if (cobalt.status === 'picker' && cobalt.picker?.length > 0) {
        return res.json({
          success: true,
          data: {
            picker: cobalt.picker,
            directUrl: cobalt.picker[0]?.url,
            filename: cobalt.filename || 'download.mp4',
            message: 'Multiple streams available',
          },
        });
      }

      return res.status(400).json({
        success: false,
        error: 'Could not get download link for this URL',
        cobaltStatus: cobalt.status,
        details: cobalt.text || cobalt.error?.code || '',
      });

    } catch (cobaltErr) {
      console.error('[Universal] Cobalt error:', cobaltErr.message);
      return res.status(503).json({
        success: false,
        error: 'Video download service is temporarily unavailable. Please try again in a moment.',
        platform: platform?.name,
      });
    }

  } catch (err) {
    console.error('[Universal Download] Error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Download failed. Please check the URL and try again.',
        details: err.message,
      });
    }
  }
});

module.exports = router;
