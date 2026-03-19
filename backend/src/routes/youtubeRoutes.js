/**
 * youtubeRoutes.js - YouTube Video Downloader API
 *
 * Strategy (multi-tier fallback for maximum reliability):
 * 1. @distube/ytdl-core — fast, streams directly
 * 2. YouTube oEmbed API + cobalt.tools — works when ytdl-core is blocked
 * 3. cobalt.tools standalone — reliable multi-instance fallback
 */

const express = require('express');
const router = express.Router();
const ytdl = require('@distube/ytdl-core');
const axios = require('axios');

const QUALITY_ORDER = { '2160p': 6, '1440p': 5, '1080p': 4, '720p': 3, '480p': 2, '360p': 1, '240p': 0 };

const COBALT_INSTANCES = [
  'https://api.cobalt.tools/',
  'https://cbl.tnix.dev/',
  'https://cobalt.api.timelessnesses.me/',
  'https://cobalt-api.rlhf.fun/',
  'https://cobalt.drgns.space/',
  'https://co.wuk.sh/',
];

const COBALT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
};

const YTDL_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-Dest': 'document',
  'Upgrade-Insecure-Requests': '1',
};

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatViews(n) {
  if (!n) return '0';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

function extractVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    return u.searchParams.get('v') || '';
  } catch { return ''; }
}

/**
 * Get basic video info from YouTube oEmbed API (no API key, no bot detection)
 */
async function getOEmbedInfo(url) {
  try {
    const r = await axios.get(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    return r.data;
  } catch { return null; }
}

/**
 * Call cobalt.tools API for download links — tries multiple instances
 */
async function callCobalt(url, quality = '1080') {
  const payload = {
    url,
    downloadMode: 'auto',
    videoQuality: quality,
    audioFormat: 'mp3',
    filenameStyle: 'pretty',
  };

  for (const instance of COBALT_INSTANCES) {
    try {
      const res = await axios.post(instance, payload, {
        headers: COBALT_HEADERS,
        timeout: 15000,
      });
      if (res.data && res.data.status !== 'error' && (res.data.url || res.data.status === 'stream')) {
        return res.data;
      }
    } catch (e) {
      console.warn(`[Cobalt] ${instance} failed: ${e.message}`);
    }
  }
  throw new Error('All cobalt instances failed');
}

/**
 * GET /api/tools/youtube-info
 * Multi-tier: ytdl-core → oEmbed + cobalt.tools fallback
 */
router.get('/youtube-info', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, error: 'URL is required' });

  const isYT = ytdl.validateURL(url);
  if (!isYT) return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });

  console.log(`[YouTube Info] Fetching: ${url}`);

  // === Method 1: @distube/ytdl-core ===
  try {
    const info = await ytdl.getInfo(url, { requestOptions: { headers: YTDL_HEADERS } });
    const details = info.videoDetails;
    const thumbnails = details.thumbnails || [];
    const bestThumb = thumbnails[thumbnails.length - 1]?.url || '';
    const hqThumb = thumbnails.find(t => t.width >= 480)?.url || bestThumb;
    const videoId = details.videoId;
    const hqFromId = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : hqThumb;

    const combined = info.formats.filter(f => f.hasVideo && f.hasAudio)
      .map(f => ({ itag: f.itag, quality: f.qualityLabel || f.quality, container: f.container, filesize: f.contentLength ? parseInt(f.contentLength) : null, fps: f.fps }))
      .sort((a, b) => (QUALITY_ORDER[b.quality] || -1) - (QUALITY_ORDER[a.quality] || -1));

    const videoOnly = info.formats.filter(f => f.hasVideo && !f.hasAudio)
      .map(f => ({ itag: f.itag, quality: f.qualityLabel || f.quality, container: f.container, fps: f.fps }))
      .sort((a, b) => (QUALITY_ORDER[b.quality] || -1) - (QUALITY_ORDER[a.quality] || -1));

    const audio = info.formats.filter(f => f.hasAudio && !f.hasVideo)
      .map(f => ({ itag: f.itag, quality: f.audioBitrate ? `${f.audioBitrate}kbps` : 'audio', container: f.container, bitrate: f.audioBitrate }))
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

    const seen = new Set();
    const qualityOptions = [];
    for (const f of [...combined, ...videoOnly]) {
      if (f.quality && !seen.has(f.quality)) {
        seen.add(f.quality);
        qualityOptions.push({ quality: f.quality, itag: f.itag, hasCombined: combined.some(c => c.itag === f.itag) });
      }
    }

    console.log('[YouTube Info] ytdl-core success');
    return res.json({
      success: true,
      source: 'ytdl',
      data: {
        title: details.title,
        channel: details.author?.name || 'Unknown',
        thumbnail: bestThumb,
        thumbnailHQ: hqFromId,
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        duration: formatDuration(parseInt(details.lengthSeconds || 0)),
        durationSeconds: parseInt(details.lengthSeconds || 0),
        views: formatViews(parseInt(details.viewCount || 0)),
        qualityOptions,
        formats: combined.slice(0, 8),
        audioFormats: audio.slice(0, 3),
        isLive: details.isLiveContent,
      },
    });
  } catch (ytdlErr) {
    console.warn(`[YouTube Info] ytdl-core failed: ${ytdlErr.message} — trying oEmbed fallback`);
  }

  // === Method 2: YouTube oEmbed + standard quality options ===
  try {
    const videoId = extractVideoId(url);
    const [oEmbed, cobaltData] = await Promise.allSettled([
      getOEmbedInfo(url),
      callCobalt(url, '1080'),
    ]);

    const oe = oEmbed.status === 'fulfilled' ? oEmbed.value : null;
    const title = oe?.title || `YouTube Video`;
    const channel = oe?.author_name || 'YouTube Channel';
    const thumbBase = videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : (oe?.thumbnail_url || '');

    const standardQualities = [
      { quality: '1080p', itag: 137, hasCombined: false },
      { quality: '720p', itag: 22, hasCombined: true },
      { quality: '480p', itag: 135, hasCombined: false },
      { quality: '360p', itag: 18, hasCombined: true },
    ];

    const downloadUrl = cobaltData.status === 'fulfilled' ? cobaltData.value?.url : null;

    console.log('[YouTube Info] oEmbed fallback success');
    return res.json({
      success: true,
      source: 'oembed',
      data: {
        title,
        channel,
        thumbnail: thumbBase,
        thumbnailHQ: thumbBase,
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        duration: null,
        views: null,
        qualityOptions: standardQualities,
        formats: [],
        audioFormats: [],
        isLive: false,
        cobaltUrl: downloadUrl,
      },
    });
  } catch (fallbackErr) {
    console.error('[YouTube Info] All methods failed:', fallbackErr.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch video info. The video may be private, age-restricted, or unavailable.',
      details: fallbackErr.message,
    });
  }
});

/**
 * POST /api/tools/youtube-download
 * Multi-tier: ytdl-core streaming → cobalt.tools redirect
 */
router.post('/youtube-download', async (req, res) => {
  const { url, quality = '720p', audioOnly = false, cobaltUrl } = req.body;
  if (!url) return res.status(400).json({ success: false, error: 'URL is required' });
  if (!ytdl.validateURL(url)) return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });

  console.log(`[YouTube Download] ${url} q=${quality} audio=${audioOnly}`);

  // === Method 1: cobaltUrl passed from frontend (when ytdl-core failed for info) ===
  if (cobaltUrl) {
    return res.json({ success: true, source: 'cobalt', redirectUrl: cobaltUrl });
  }

  // === Method 2: ytdl-core streaming ===
  try {
    const info = await ytdl.getInfo(url, { requestOptions: { headers: YTDL_HEADERS } });
    const safeTitle = info.videoDetails.title.replace(/[^a-z0-9\s\-_]/gi, '').trim().substring(0, 80) || 'video';

    let format, ext, mimeType;
    if (audioOnly) {
      format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
      ext = 'mp3';
      mimeType = 'audio/mpeg';
    } else {
      const targetHeight = parseInt(quality) || 720;
      const combined = info.formats.filter(f => f.hasVideo && f.hasAudio).sort((a, b) => {
        const aDiff = Math.abs((a.height || 0) - targetHeight);
        const bDiff = Math.abs((b.height || 0) - targetHeight);
        return aDiff - bDiff;
      });
      format = combined.length > 0 ? combined[0] : ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoandaudio' });
      ext = format?.container || 'mp4';
      mimeType = 'video/mp4';
    }

    const filename = `${safeTitle}.${ext}`;
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Type', mimeType);
    if (format?.contentLength) res.setHeader('Content-Length', format.contentLength);

    const stream = ytdl.downloadFromInfo(info, { format });
    stream.pipe(res);
    stream.on('error', err => {
      console.error('[YouTube Download] Stream error:', err.message);
      if (!res.headersSent) res.status(500).json({ success: false, error: 'Stream failed' });
    });
    req.on('close', () => stream.destroy());
    return;
  } catch (ytdlErr) {
    console.warn(`[YouTube Download] ytdl-core failed: ${ytdlErr.message} — trying cobalt fallback`);
  }

  // === Method 3: cobalt.tools redirect ===
  try {
    const qualityNum = parseInt(quality) || 720;
    const cobalt = await callCobalt(url, String(qualityNum));
    if (cobalt?.url) {
      return res.json({ success: true, source: 'cobalt', redirectUrl: cobalt.url });
    }
    throw new Error('No download URL from cobalt');
  } catch (cobaltErr) {
    console.error('[YouTube Download] All methods failed:', cobaltErr.message);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: 'Download failed. YouTube may have restricted this video. Try a different quality or use the direct YouTube link.',
        details: cobaltErr.message,
      });
    }
  }
});

/**
 * GET /api/tools/youtube-formats
 */
router.get('/youtube-formats', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, error: 'URL is required' });
  if (!ytdl.validateURL(url)) return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });

  try {
    const info = await ytdl.getInfo(url, { requestOptions: { headers: YTDL_HEADERS } });
    const formats = info.formats.filter(f => f.hasVideo && f.hasAudio)
      .map(f => ({ itag: f.itag, quality: f.qualityLabel || f.quality, container: f.container, filesize: f.contentLength, fps: f.fps }))
      .sort((a, b) => (QUALITY_ORDER[b.quality] || -1) - (QUALITY_ORDER[a.quality] || -1));
    res.json({ success: true, data: { formats } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
