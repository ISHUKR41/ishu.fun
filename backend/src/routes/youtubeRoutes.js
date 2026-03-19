/**
 * youtubeRoutes.js - YouTube Video Downloader API
 *
 * Uses @distube/ytdl-core (pure JS, no Python3 needed).
 * Streams video directly to client — no temp file needed.
 */

const express = require('express');
const router = express.Router();
const ytdl = require('@distube/ytdl-core');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TEMP_DIR = process.env.TEMP_DIR || path.join(__dirname, '../../../temp');

const QUALITY_ORDER = { '2160p': 6, '1440p': 5, '1080p': 4, '720p': 3, '480p': 2, '360p': 1, '240p': 0 };

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

/**
 * GET /api/tools/youtube-info
 */
router.get('/youtube-info', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ success: false, error: 'URL is required' });

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });
    }

    console.log(`[YouTube Info] Fetching: ${url}`);

    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        },
      },
    });

    const details = info.videoDetails;
    const thumbnails = details.thumbnails || [];
    const bestThumb = thumbnails[thumbnails.length - 1]?.url || '';
    const hqThumb = thumbnails.find(t => t.width >= 480)?.url || bestThumb;

    // Combined (video+audio) formats
    const combined = info.formats
      .filter(f => f.hasVideo && f.hasAudio)
      .map(f => ({
        itag: f.itag,
        quality: f.qualityLabel || f.quality,
        container: f.container,
        filesize: f.contentLength ? parseInt(f.contentLength) : null,
        fps: f.fps,
        ext: f.container,
      }))
      .sort((a, b) => (QUALITY_ORDER[b.quality] || -1) - (QUALITY_ORDER[a.quality] || -1));

    // Best video+audio only formats (for high quality merge)
    const videoOnly = info.formats
      .filter(f => f.hasVideo && !f.hasAudio)
      .map(f => ({
        itag: f.itag,
        quality: f.qualityLabel || f.quality,
        container: f.container,
        filesize: f.contentLength ? parseInt(f.contentLength) : null,
        fps: f.fps,
      }))
      .sort((a, b) => (QUALITY_ORDER[b.quality] || -1) - (QUALITY_ORDER[a.quality] || -1));

    // Audio formats
    const audio = info.formats
      .filter(f => f.hasAudio && !f.hasVideo)
      .map(f => ({
        itag: f.itag,
        quality: f.audioBitrate ? `${f.audioBitrate}kbps` : 'audio',
        container: f.container,
        bitrate: f.audioBitrate,
      }))
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

    // Build quality options (prefer combined, fill in from video-only)
    const seen = new Set();
    const qualityOptions = [];
    const allFormats = [...combined, ...videoOnly];
    for (const f of allFormats) {
      if (f.quality && !seen.has(f.quality)) {
        seen.add(f.quality);
        qualityOptions.push({ quality: f.quality, itag: f.itag, hasCombined: combined.some(c => c.itag === f.itag) });
      }
    }

    res.json({
      success: true,
      data: {
        title: details.title,
        channel: details.author?.name || 'Unknown',
        thumbnail: bestThumb,
        thumbnailHQ: hqThumb,
        videoId: details.videoId,
        url: `https://www.youtube.com/watch?v=${details.videoId}`,
        duration: formatDuration(parseInt(details.lengthSeconds || 0)),
        durationSeconds: parseInt(details.lengthSeconds || 0),
        views: formatViews(parseInt(details.viewCount || 0)),
        qualityOptions,
        formats: combined.slice(0, 8),
        audioFormats: audio.slice(0, 3),
        isLive: details.isLiveContent,
      },
    });
  } catch (err) {
    console.error('[YouTube Info] Error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch video info. The video may be private, age-restricted, or unavailable.',
      details: err.message,
    });
  }
});

/**
 * POST /api/tools/youtube-download
 * Streams video/audio directly to client.
 */
router.post('/youtube-download', async (req, res) => {
  try {
    const { url, quality = '720p', audioOnly = false } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'URL is required' });
    if (!ytdl.validateURL(url)) return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });

    console.log(`[YouTube Download] ${url} q=${quality} audio=${audioOnly}`);

    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      },
    });

    const safeTitle = info.videoDetails.title
      .replace(/[^a-z0-9\s\-_]/gi, '')
      .trim()
      .substring(0, 80) || 'video';

    let format, ext, mimeType;

    if (audioOnly) {
      format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
      ext = 'mp3';
      mimeType = 'audio/mpeg';
    } else {
      // Try to find combined format for requested quality
      const targetHeight = parseInt(quality) || 720;
      const combined = info.formats
        .filter(f => f.hasVideo && f.hasAudio)
        .sort((a, b) => {
          const aH = a.height || 0;
          const bH = b.height || 0;
          const aDiff = Math.abs(aH - targetHeight);
          const bDiff = Math.abs(bH - targetHeight);
          return aDiff - bDiff;
        });

      if (combined.length > 0) {
        format = combined[0];
      } else {
        // Fallback: highest quality combined
        format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoandaudio' });
      }
      ext = format?.container || 'mp4';
      mimeType = 'video/mp4';
    }

    const filename = `${safeTitle}.${ext}`;
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Type', mimeType);
    if (format?.contentLength) {
      res.setHeader('Content-Length', format.contentLength);
    }

    const stream = ytdl.downloadFromInfo(info, { format });
    stream.pipe(res);

    stream.on('error', (err) => {
      console.error('[YouTube Download] Stream error:', err.message);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Download stream failed', details: err.message });
      }
    });

    req.on('close', () => {
      stream.destroy();
    });

  } catch (err) {
    console.error('[YouTube Download] Error:', err.message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Download failed. The video may be restricted or unavailable.',
        details: err.message,
      });
    }
  }
});

/**
 * GET /api/tools/youtube-formats
 * Get all available formats for a URL
 */
router.get('/youtube-formats', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ success: false, error: 'URL is required' });
    if (!ytdl.validateURL(url)) return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });

    const info = await ytdl.getInfo(url);
    const formats = info.formats
      .filter(f => f.hasVideo && f.hasAudio)
      .map(f => ({
        itag: f.itag,
        quality: f.qualityLabel || f.quality,
        container: f.container,
        filesize: f.contentLength,
        fps: f.fps,
      }))
      .sort((a, b) => (QUALITY_ORDER[b.quality] || -1) - (QUALITY_ORDER[a.quality] || -1));

    res.json({ success: true, data: { formats } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
