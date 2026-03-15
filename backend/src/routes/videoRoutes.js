/**
 * videoRoutes.js — Video Downloader API Routes (WORKING Engine)
 *
 * Multi-engine approach (automatically tries each until one works):
 *   1. yt-dlp (auto-downloaded binary) — 1000+ sites
 *   2. Cobalt API (multiple instances) — YouTube, Instagram, TikTok, Twitter, etc.
 *   3. @distube/ytdl-core — YouTube-specific fallback
 *   4. Third-party APIs — Terabox-specific fallback
 *
 * Endpoints:
 *   POST /youtube-info      — Fetch YouTube video metadata + available qualities
 *   POST /youtube-download  — Download YouTube video in selected quality
 *   POST /terabox-info      — Fetch Terabox file info
 *   POST /terabox-download  — Download Terabox file
 *   POST /video-info        — Universal: fetch any video URL metadata
 *   POST /video-download    — Universal: download from any platform
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const NodeCache = require('node-cache');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Cache video info for 10 minutes
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Temp downloads directory
const DOWNLOADS_DIR = path.resolve(__dirname, '../../temp/video-downloads');
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// ── ffmpeg-static path ─────────────────────────────────────
let ffmpegPath;
try {
  ffmpegPath = require('ffmpeg-static');
  console.log('[Video] ✅ ffmpeg-static found at:', ffmpegPath);
} catch (e) {
  console.warn('[Video] ⚠️ ffmpeg-static not available:', e.message);
  ffmpegPath = null;
}

// ── yt-dlp-wrap setup (auto-downloads binary) ──────────────
let YTDlpWrap, ytDlpInstance;
const YTDLP_BINARY_PATH = path.resolve(__dirname, '../../yt-dlp' + (process.platform === 'win32' ? '.exe' : ''));

let ytDlpInitPromise = null;

async function getYtDlp() {
  if (ytDlpInstance) return ytDlpInstance;
  
  // Prevent multiple simultaneous init attempts
  if (ytDlpInitPromise) return ytDlpInitPromise;

  ytDlpInitPromise = (async () => {
    try {
      YTDlpWrap = require('yt-dlp-wrap').default || require('yt-dlp-wrap');

      // Check if binary exists, if not download it
      if (!fs.existsSync(YTDLP_BINARY_PATH)) {
        console.log('[Video] ⬇️ Downloading yt-dlp binary...');
        try {
          await YTDlpWrap.downloadFromGithub(YTDLP_BINARY_PATH);
          console.log('[Video] ✅ yt-dlp binary downloaded to:', YTDLP_BINARY_PATH);
        } catch (downloadErr) {
          console.warn('[Video] ⚠️ yt-dlp binary download failed:', downloadErr.message);
          console.log('[Video] ℹ️ Will use Cobalt API and other fallbacks instead.');
          ytDlpInitPromise = null;
          return null;
        }
      }

      ytDlpInstance = new YTDlpWrap(YTDLP_BINARY_PATH);
      
      // Quick test to verify binary works
      try {
        await ytDlpInstance.execPromise(['--version']);
        console.log('[Video] ✅ yt-dlp-wrap initialized and verified');
      } catch (verifyErr) {
        console.warn('[Video] ⚠️ yt-dlp binary exists but failed to run:', verifyErr.message);
        ytDlpInstance = null;
        ytDlpInitPromise = null;
        return null;
      }
      
      return ytDlpInstance;
    } catch (e) {
      console.error('[Video] ❌ yt-dlp-wrap init failed:', e.message);
      ytDlpInitPromise = null;
      return null;
    }
  })();

  return ytDlpInitPromise;
}

// Initialize on module load (non-blocking)
getYtDlp().catch(e => console.error('[Video] yt-dlp init error:', e.message));

// ── ytdl-core for YouTube (fallback) ───────────────────────
let ytdl;
try {
  ytdl = require('@distube/ytdl-core');
  console.log('[Video] ✅ @distube/ytdl-core loaded (fallback)');
} catch (e) {
  console.warn('[Video] ⚠️ @distube/ytdl-core not available:', e.message);
  ytdl = null;
}


// ═══════════════════════════════════════════════════════════
// ── HELPERS ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════

/**
 * Clean up old downloaded files (older than 15 min)
 */
function cleanupOldFiles() {
  try {
    if (!fs.existsSync(DOWNLOADS_DIR)) return;
    const files = fs.readdirSync(DOWNLOADS_DIR);
    const now = Date.now();
    for (const file of files) {
      const filePath = path.join(DOWNLOADS_DIR, file);
      try {
        const stat = fs.statSync(filePath);
        if (now - stat.mtimeMs > 15 * 60 * 1000) {
          fs.unlinkSync(filePath);
        }
      } catch { /* ignore per-file errors */ }
    }
  } catch (e) { /* ignore cleanup errors */ }
}
setInterval(cleanupOldFiles, 5 * 60 * 1000);

/**
 * Detect platform from URL
 */
function detectPlatform(url) {
  const platforms = [
    { name: 'YouTube', patterns: [/youtube\.com/i, /youtu\.be/i], icon: '🔴' },
    { name: 'Instagram', patterns: [/instagram\.com/i], icon: '📸' },
    { name: 'TikTok', patterns: [/tiktok\.com/i], icon: '🎵' },
    { name: 'Twitter/X', patterns: [/twitter\.com/i, /x\.com/i], icon: '🐦' },
    { name: 'Facebook', patterns: [/facebook\.com/i, /fb\.watch/i], icon: '📘' },
    { name: 'Reddit', patterns: [/reddit\.com/i, /redd\.it/i], icon: '🟠' },
    { name: 'Vimeo', patterns: [/vimeo\.com/i], icon: '🎬' },
    { name: 'Twitch', patterns: [/twitch\.tv/i, /clips\.twitch\.tv/i], icon: '💜' },
    { name: 'Dailymotion', patterns: [/dailymotion\.com/i], icon: '📺' },
    { name: 'SoundCloud', patterns: [/soundcloud\.com/i], icon: '🟧' },
    { name: 'Pinterest', patterns: [/pinterest\.com/i], icon: '📌' },
    { name: 'Bilibili', patterns: [/bilibili\.com/i], icon: '📺' },
    { name: 'Terabox', patterns: [/terabox\.com/i, /teraboxapp\.com/i, /1024tera\.com/i, /freeterabox\.com/i], icon: '📦' },
  ];
  for (const p of platforms) {
    if (p.patterns.some(pattern => pattern.test(url))) {
      return { name: p.name, icon: p.icon };
    }
  }
  return { name: 'Other', icon: '🌐' };
}

function isYouTubeUrl(url) {
  return /youtube\.com|youtu\.be/i.test(url);
}

function isTeraboxUrl(url) {
  return /terabox\.com|teraboxapp\.com|1024tera\.com|freeterabox\.com|4funbox\.com|mirrobox\.com|nephobox\.com|terabox\.app/i.test(url);
}

function extractVideoId(url) {
  const match = url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return 'Unknown';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function sanitizeFilename(name) {
  return (name || 'video')
    .replace(/[^\w\s\-\u0900-\u097F]/g, '') // Keep letters, numbers, spaces, hyphens, Hindi chars
    .replace(/\s+/g, '_')
    .substring(0, 80) || 'video';
}

/**
 * Try Cobalt API for download
 * Cobalt API v10 format: POST with JSON body
 */
async function tryCobaltDownload(url, options = {}) {
  // List of working Cobalt API instances (2025-2026)
  // The official api.cobalt.tools now has bot protection, so we use community instances
  const COBALT_INSTANCES = [
    'https://cobalt-api.hyper.lol',
    'https://cobalt.api.timelessnesses.me',
    'https://api.cobalt.tools',
  ];

  const body = {
    url,
    videoQuality: options.quality || '1080',
    audioFormat: 'mp3',
    filenameStyle: 'pretty',
    downloadMode: options.audioOnly ? 'audio' : 'auto',
  };

  for (const instance of COBALT_INSTANCES) {
    try {
      console.log(`[Cobalt] Trying ${instance}...`);
      const response = await axios.post(instance, body, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 25000,
      });
      const data = response.data;
      
      if (data.status === 'tunnel' || data.status === 'redirect') {
        console.log(`[Cobalt] ✅ Success from ${instance} (${data.status})`);
        return {
          success: true,
          downloadUrl: data.url,
          filename: data.filename || 'video.mp4',
          status: data.status,
        };
      }
      if (data.status === 'picker') {
        console.log(`[Cobalt] ✅ Picker result from ${instance}`);
        const items = data.picker || [];
        return {
          success: true,
          downloadUrl: items[0]?.url || data.audio,
          filename: data.filename || 'video.mp4',
          status: 'picker',
          items: items.map(item => ({ url: item.url, thumb: item.thumb, type: item.type || 'video' })),
          audioUrl: data.audio,
        };
      }
      if (data.status === 'error') {
        console.log(`[Cobalt] Error from ${instance}: ${data.error?.code || data.text}`);
        continue;
      }
    } catch (err) {
      console.log(`[Cobalt] Failed ${instance}: ${err.message}`);
      continue;
    }
  }
  return { success: false, error: 'All Cobalt instances failed.' };
}


/**
 * Get video info using yt-dlp --dump-json
 */
async function getVideoInfoWithYtDlp(url) {
  const ytDlp = await getYtDlp();
  if (!ytDlp) return null;

  try {
    const args = ['--dump-json', '--no-download', '--no-playlist'];
    if (ffmpegPath) {
      args.push('--ffmpeg-location', ffmpegPath);
    }
    args.push(url);

    const stdout = await ytDlp.execPromise(args);
    const info = JSON.parse(stdout);

    // Extract unique quality formats
    const formats = (info.formats || [])
      .filter(f => f.height && f.vcodec !== 'none')
      .map(f => ({
        formatId: f.format_id,
        quality: f.height ? `${f.height}p` : 'unknown',
        height: f.height || 0,
        ext: f.ext || 'mp4',
        filesize: f.filesize || f.filesize_approx || null,
        filesizeStr: formatBytes(f.filesize || f.filesize_approx || 0),
        fps: f.fps,
        vcodec: f.vcodec,
        acodec: f.acodec,
        hasAudio: f.acodec !== 'none',
      }))
      .sort((a, b) => b.height - a.height);

    // Deduplicate by quality
    const seen = new Set();
    const uniqueFormats = formats.filter(f => {
      if (seen.has(f.quality)) return false;
      seen.add(f.quality);
      return true;
    });

    return {
      title: info.title || 'Unknown Video',
      channel: info.uploader || info.channel || info.creator || 'Unknown',
      thumbnail: info.thumbnail || '',
      thumbnails: info.thumbnails || [],
      duration: info.duration ? `${Math.floor(info.duration / 60)}:${String(Math.floor(info.duration % 60)).padStart(2, '0')}` : null,
      durationSeconds: info.duration || null,
      views: info.view_count ? parseInt(info.view_count).toLocaleString() : null,
      videoId: info.id || null,
      platform: info.extractor || info.extractor_key || detectPlatform(url).name,
      platformIcon: detectPlatform(url).icon,
      url: info.webpage_url || url,
      description: (info.description || '').substring(0, 200),
      formats: uniqueFormats.length > 0 ? uniqueFormats : [
        { quality: '1080p', height: 1080, ext: 'mp4' },
        { quality: '720p', height: 720, ext: 'mp4' },
        { quality: '480p', height: 480, ext: 'mp4' },
        { quality: '360p', height: 360, ext: 'mp4' },
      ],
    };
  } catch (e) {
    console.error('[yt-dlp info] Error:', e.message);
    return null;
  }
}

/**
 * Download video using yt-dlp
 */
async function downloadWithYtDlp(url, quality, outputPath, options = {}) {
  const ytDlp = await getYtDlp();
  if (!ytDlp) throw new Error('yt-dlp not available');

  const height = parseInt(quality) || 720;
  const args = [
    url,
    '-f', options.audioOnly
      ? 'bestaudio[ext=m4a]/bestaudio'
      : `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]/best`,
    '--merge-output-format', options.audioOnly ? 'mp3' : 'mp4',
    '-o', outputPath,
    '--no-playlist',
    '--no-check-certificates',
    '--socket-timeout', '30',
    '--retries', '3',
  ];

  if (ffmpegPath) {
    args.push('--ffmpeg-location', ffmpegPath);
  }

  return new Promise((resolve, reject) => {
    let lastProgress = 0;
    const subprocess = ytDlp.exec(args);

    // Set a timeout of 2 minutes
    const timeout = setTimeout(() => {
      try { subprocess.kill(); } catch {}
      reject(new Error('Download timed out after 2 minutes'));
    }, 120000);

    subprocess.on('ytDlpEvent', (eventType, data) => {
      if (eventType === 'download') {
        const match = String(data).match(/(\d+\.?\d*)%/);
        if (match) lastProgress = parseFloat(match[1]);
      }
    });

    subprocess.on('close', () => {
      clearTimeout(timeout);
      if (fs.existsSync(outputPath)) {
        resolve({ success: true, progress: 100 });
      } else {
        // yt-dlp may append extension - check for variations
        const dir = path.dirname(outputPath);
        const base = path.basename(outputPath, path.extname(outputPath));
        const variants = ['.mp4', '.mkv', '.webm', '.mp3', '.m4a'];
        for (const ext of variants) {
          const alt = path.join(dir, base + ext);
          if (fs.existsSync(alt)) {
            if (alt !== outputPath) {
              try { fs.renameSync(alt, outputPath); } catch {}
            }
            return resolve({ success: true, progress: 100 });
          }
        }
        reject(new Error('Download completed but file not found'));
      }
    });

    subprocess.on('error', (err) => {
      clearTimeout(timeout);
      reject(new Error(`yt-dlp error: ${err.message}`));
    });
  });
}


/**
 * Get YouTube video info using oembed (always works, no dependencies)
 */
async function getYouTubeInfoViaOembed(url) {
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  try {
    const oembedRes = await axios.get(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { timeout: 10000 }
    );
    return {
      title: oembedRes.data.title || 'YouTube Video',
      channel: oembedRes.data.author_name || 'Unknown',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnailHQ: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      videoId: videoId,
    };
  } catch {
    // Even if oembed fails, we can still provide basic info from videoId
    return {
      title: 'YouTube Video',
      channel: 'Unknown',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnailHQ: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      videoId: videoId,
    };
  }
}


// ═══════════════════════════════════════════════════════════
// ─── YouTube: Get Video Info ──────────────────────────────
// ═══════════════════════════════════════════════════════════
router.post('/youtube-info', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide a valid YouTube URL.' });
    }

    const ytPatterns = [/youtube\.com\/watch/i, /youtu\.be\//i, /youtube\.com\/shorts/i, /youtube\.com\/embed/i];
    if (!ytPatterns.some(p => p.test(url))) {
      return res.status(400).json({ success: false, error: 'Invalid YouTube URL. Please enter a valid YouTube video link.' });
    }

    // Check cache
    const cacheKey = `yt_info_${url}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const videoId = extractVideoId(url);
    console.log(`[YouTube Info] Processing: ${url} (videoId: ${videoId})`);

    // Method 1: yt-dlp (MOST RELIABLE — gives formats + metadata)
    const ytDlpInfo = await getVideoInfoWithYtDlp(url);
    if (ytDlpInfo) {
      console.log('[YouTube Info] ✅ Got info via yt-dlp');
      const response = {
        success: true,
        video: {
          title: ytDlpInfo.title,
          channel: ytDlpInfo.channel,
          thumbnail: ytDlpInfo.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''),
          thumbnailHQ: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : ytDlpInfo.thumbnail,
          videoId: videoId || ytDlpInfo.videoId,
          url: url,
          duration: ytDlpInfo.duration,
          views: ytDlpInfo.views,
        },
        formats: ytDlpInfo.formats.map(f => ({
          quality: f.quality,
          height: f.height,
          filesize: f.filesizeStr,
          ext: f.ext,
          formatId: f.formatId,
        })),
      };
      cache.set(cacheKey, response);
      return res.json(response);
    }

    // Method 2: ytdl-core fallback
    if (ytdl) {
      try {
        console.log('[YouTube Info] Trying ytdl-core...');
        const info = await ytdl.getInfo(url);
        const videoDetails = info.videoDetails;

        const formats = info.formats
          .filter(f => f.hasVideo && f.hasAudio)
          .map(f => ({
            quality: f.qualityLabel || `${f.height}p`,
            itag: f.itag,
            height: f.height || 0,
            filesize: f.contentLength ? formatBytes(parseInt(f.contentLength)) : null,
            ext: f.container || 'mp4',
          }))
          .filter(f => f.height)
          .sort((a, b) => b.height - a.height);

        const seen = new Set();
        const uniqueFormats = formats.filter(f => {
          if (seen.has(f.quality)) return false;
          seen.add(f.quality);
          return true;
        });

        console.log('[YouTube Info] ✅ Got info via ytdl-core');
        const response = {
          success: true,
          video: {
            title: videoDetails.title,
            channel: videoDetails.author?.name || videoDetails.ownerChannelName || 'Unknown',
            thumbnail: videoDetails.thumbnails?.slice(-1)?.[0]?.url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            thumbnailHQ: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            videoId: videoId || videoDetails.videoId,
            url: url,
            duration: videoDetails.lengthSeconds ? `${Math.floor(videoDetails.lengthSeconds / 60)}:${String(videoDetails.lengthSeconds % 60).padStart(2, '0')}` : null,
            views: videoDetails.viewCount ? parseInt(videoDetails.viewCount).toLocaleString() : null,
          },
          formats: uniqueFormats.length > 0 ? uniqueFormats : [
            { quality: '1080p', height: 1080, ext: 'mp4' },
            { quality: '720p', height: 720, ext: 'mp4' },
            { quality: '480p', height: 480, ext: 'mp4' },
            { quality: '360p', height: 360, ext: 'mp4' },
          ],
        };
        cache.set(cacheKey, response);
        return res.json(response);
      } catch (ytdlErr) {
        console.error('[YouTube Info] ytdl-core fallback error:', ytdlErr.message);
      }
    }

    // Method 3: oembed fallback (always works — metadata only, no formats)
    console.log('[YouTube Info] Using oembed fallback...');
    const oembedInfo = await getYouTubeInfoViaOembed(url);
    const response = {
      success: true,
      video: {
        title: oembedInfo?.title || 'YouTube Video',
        channel: oembedInfo?.channel || 'Unknown',
        thumbnail: oembedInfo?.thumbnail || '',
        thumbnailHQ: oembedInfo?.thumbnailHQ || '',
        videoId: videoId,
        url: url,
      },
      formats: [
        { quality: '1080p', height: 1080, ext: 'mp4' },
        { quality: '720p', height: 720, ext: 'mp4' },
        { quality: '480p', height: 480, ext: 'mp4' },
        { quality: '360p', height: 360, ext: 'mp4' },
      ],
    };
    cache.set(cacheKey, response);
    console.log('[YouTube Info] ✅ Got info via oembed');
    return res.json(response);
  } catch (err) {
    console.error('[YouTube Info Error]', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch video info. Please try another URL.' });
  }
});


// ═══════════════════════════════════════════════════════════
// ─── YouTube: Download Video ─────────────────────────────
// ═══════════════════════════════════════════════════════════
router.post('/youtube-download', async (req, res) => {
  try {
    const { url, quality, itag } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'URL required.' });
    if (!isYouTubeUrl(url)) return res.status(400).json({ success: false, error: 'Invalid YouTube URL.' });

    console.log(`[YouTube Download] Processing: ${url} (quality: ${quality || '720'})`);

    const sessionId = uuidv4();
    const outputFile = path.join(DOWNLOADS_DIR, `${sessionId}.mp4`);

    // Get video title for filename
    let videoTitle = 'youtube_video';
    try {
      const oembedInfo = await getYouTubeInfoViaOembed(url);
      if (oembedInfo?.title) videoTitle = sanitizeFilename(oembedInfo.title);
    } catch { /* ignore, use default filename */ }

    // Method 1: yt-dlp (BEST)
    const ytDlp = await getYtDlp();
    if (ytDlp) {
      try {
        console.log('[YouTube Download] Trying yt-dlp...');
        await downloadWithYtDlp(url, quality || '720', outputFile);
        if (fs.existsSync(outputFile)) {
          const stat = fs.statSync(outputFile);
          const downloadUrl = `/api/downloads/video-downloads/${sessionId}.mp4`;
          console.log('[YouTube Download] ✅ Success via yt-dlp');
          return res.json({
            success: true,
            downloadUrl,
            filename: `${videoTitle}_${quality || '720'}p.mp4`,
            filesize: formatBytes(stat.size),
            quality: `${quality || '720'}p`,
          });
        }
      } catch (ytDlpErr) {
        console.error('[YouTube Download] yt-dlp error:', ytDlpErr.message);
        try { if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile); } catch {}
      }
    }

    // Method 2: Cobalt API fallback
    console.log('[YouTube Download] Trying Cobalt API...');
    const cobaltResult = await tryCobaltDownload(url, { quality: quality || '1080' });
    if (cobaltResult.success) {
      console.log('[YouTube Download] ✅ Success via Cobalt');
      return res.json({
        success: true,
        downloadUrl: cobaltResult.downloadUrl,
        filename: cobaltResult.filename || `${videoTitle}.mp4`,
        quality: `${quality || '720'}p`,
        source: 'cobalt',
      });
    }

    // Method 3: ytdl-core fallback
    if (ytdl) {
      try {
        console.log('[YouTube Download] Trying ytdl-core...');
        const info = await ytdl.getInfo(url);
        const requestedHeight = parseInt(quality) || 720;

        let chosenFormat;
        if (itag) {
          chosenFormat = info.formats.find(f => f.itag === parseInt(itag));
        }
        if (!chosenFormat) {
          const combinedFormats = info.formats
            .filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4')
            .sort((a, b) => (b.height || 0) - (a.height || 0));
          chosenFormat = combinedFormats.find(f => (f.height || 0) <= requestedHeight) || combinedFormats[0];
        }
        if (!chosenFormat) {
          chosenFormat = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
        }
        if (!chosenFormat) {
          return res.status(422).json({ success: false, error: 'No suitable format found.' });
        }

        await new Promise((resolve, reject) => {
          const writeStream = fs.createWriteStream(outputFile);
          const downloadStream = ytdl(url, { format: chosenFormat });
          
          // Timeout after 2 minutes
          const timeout = setTimeout(() => {
            downloadStream.destroy();
            writeStream.destroy();
            reject(new Error('Download timed out'));
          }, 120000);
          
          downloadStream.pipe(writeStream);
          writeStream.on('finish', () => { clearTimeout(timeout); resolve(); });
          writeStream.on('error', (err) => { clearTimeout(timeout); reject(err); });
          downloadStream.on('error', (err) => { clearTimeout(timeout); reject(err); });
        });

        const stat = fs.statSync(outputFile);
        console.log('[YouTube Download] ✅ Success via ytdl-core');
        return res.json({
          success: true,
          downloadUrl: `/api/downloads/video-downloads/${sessionId}.mp4`,
          filename: `${videoTitle}_${chosenFormat.qualityLabel || quality + 'p'}.mp4`,
          filesize: formatBytes(stat.size),
          quality: chosenFormat.qualityLabel || `${quality}p`,
        });
      } catch (ytdlErr) {
        console.error('[YouTube Download] ytdl-core error:', ytdlErr.message);
        // Clean up partial file
        try { if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile); } catch {}
      }
    }

    return res.status(500).json({
      success: false,
      error: 'All download engines failed. This might be due to the video being restricted or a temporary issue. Please try again.',
    });
  } catch (err) {
    console.error('[YouTube Download Error]', err.message);
    return res.status(500).json({ success: false, error: 'Download failed: ' + err.message });
  }
});


// ═══════════════════════════════════════════════════════════
// ─── Terabox: Get File Info ───────────────────────────────
// ═══════════════════════════════════════════════════════════
router.post('/terabox-info', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide a valid Terabox URL.' });
    }

    if (!isTeraboxUrl(url)) {
      return res.status(400).json({ success: false, error: 'Invalid Terabox URL. Supported: terabox.com, 1024tera.com, freeterabox.com, etc.' });
    }

    // Check cache
    const cacheKey = `tb_${url}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    console.log(`[Terabox Info] Processing: ${url}`);

    // Method 1: yt-dlp (supports Terabox!)
    const ytDlpInfo = await getVideoInfoWithYtDlp(url);
    if (ytDlpInfo) {
      console.log('[Terabox Info] ✅ Got info via yt-dlp');
      const name = ytDlpInfo.title || 'Terabox File';
      const response = {
        success: true,
        file: {
          name: name,
          size: ytDlpInfo.formats[0]?.filesizeStr || 'Unknown',
          thumbnail: ytDlpInfo.thumbnail || '',
          downloadLink: null, // Will use /terabox-download endpoint
          isVideo: true,
          duration: ytDlpInfo.duration,
          platform: 'Terabox',
          useBackendDownload: true,
        },
      };
      cache.set(cacheKey, response);
      return res.json(response);
    }

    // Method 2: Third-party Terabox APIs
    const apis = [
      {
        url: `https://terabox-dl-arridha.vercel.app/api?url=${encodeURIComponent(url)}`,
        parse: (data) => {
          if (data && (data.file_name || data.name)) {
            const name = data.file_name || data.name || 'Unknown File';
            return {
              name, size: data.size || data.file_size || 'Unknown',
              thumbnail: data.thumb || data.thumbnail || '',
              downloadLink: data.direct_link || data.download_link || data.dlink || '',
              isVideo: /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|3gp)$/i.test(name),
            };
          }
          return null;
        },
      },
      {
        url: `https://teraboxdownloader.online/api?url=${encodeURIComponent(url)}`,
        parse: (data) => {
          if (data && (data.file_name || data.name)) {
            const name = data.file_name || data.name || 'Unknown File';
            return {
              name, size: data.size || data.file_size || 'Unknown',
              thumbnail: data.thumb || data.thumbnail || '',
              downloadLink: data.direct_link || data.download_link || data.dlink || '',
              isVideo: /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|3gp)$/i.test(name),
            };
          }
          return null;
        },
      },
    ];

    let fileInfo = null;
    for (const api of apis) {
      try {
        console.log(`[Terabox Info] Trying API: ${api.url.split('?')[0]}...`);
        const resp = await axios.get(api.url, {
          timeout: 25000,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        });
        fileInfo = api.parse(resp.data);
        if (fileInfo) {
          console.log('[Terabox Info] ✅ Got info via third-party API');
          break;
        }
      } catch (err) {
        console.log(`[Terabox Info] API failed: ${err.message}`);
        continue;
      }
    }

    if (!fileInfo) {
      return res.status(422).json({
        success: false,
        error: 'Could not extract file info from Terabox. The link may be expired, invalid, or the file may be private.',
      });
    }

    const response = { success: true, file: fileInfo };
    cache.set(cacheKey, response);
    return res.json(response);
  } catch (err) {
    console.error('[Terabox Info Error]', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch file info. Please try again.' });
  }
});


// ═══════════════════════════════════════════════════════════
// ─── Terabox: Download File ──────────────────────────────
// ═══════════════════════════════════════════════════════════
router.post('/terabox-download', async (req, res) => {
  try {
    const { url, quality } = req.body;
    if (!url) return res.status(400).json({ success: false, error: 'URL required.' });

    console.log(`[Terabox Download] Processing: ${url}`);
    const sessionId = uuidv4();
    const outputFile = path.join(DOWNLOADS_DIR, `${sessionId}.mp4`);

    // Method 1: yt-dlp
    const ytDlp = await getYtDlp();
    if (ytDlp) {
      try {
        console.log('[Terabox Download] Trying yt-dlp...');
        await downloadWithYtDlp(url, quality || '720', outputFile);
        if (fs.existsSync(outputFile)) {
          const stat = fs.statSync(outputFile);
          console.log('[Terabox Download] ✅ Success via yt-dlp');
          return res.json({
            success: true,
            downloadUrl: `/api/downloads/video-downloads/${sessionId}.mp4`,
            filename: `terabox_${sessionId}.mp4`,
            filesize: formatBytes(stat.size),
          });
        }
      } catch (e) {
        console.error('[Terabox Download] yt-dlp error:', e.message);
        try { if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile); } catch {}
      }
    }

    // Method 2: Cobalt API fallback
    console.log('[Terabox Download] Trying Cobalt API...');
    const cobaltResult = await tryCobaltDownload(url, { quality: quality || '720' });
    if (cobaltResult.success) {
      console.log('[Terabox Download] ✅ Success via Cobalt');
      return res.json({
        success: true,
        downloadUrl: cobaltResult.downloadUrl,
        filename: cobaltResult.filename || 'terabox_video.mp4',
      });
    }

    return res.status(500).json({ success: false, error: 'Could not download from Terabox. Please try again.' });
  } catch (err) {
    console.error('[Terabox Download Error]', err.message);
    return res.status(500).json({ success: false, error: 'Download failed: ' + err.message });
  }
});


// ═══════════════════════════════════════════════════════════
// ─── Universal: Get Video Info ────────────────────────────
// ═══════════════════════════════════════════════════════════
router.post('/video-info', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide a valid URL.' });
    }

    const cacheKey = `vid_info_${url}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const platform = detectPlatform(url);
    console.log(`[Video Info] Processing: ${url} (platform: ${platform.name})`);

    // Use yt-dlp for info extraction
    const info = await getVideoInfoWithYtDlp(url);
    if (info) {
      console.log('[Video Info] ✅ Got info via yt-dlp');
      const response = {
        success: true,
        video: {
          title: info.title,
          channel: info.channel,
          thumbnail: info.thumbnail,
          duration: info.duration,
          views: info.views,
          platform: platform,
          url: url,
        },
        formats: info.formats,
      };
      cache.set(cacheKey, response);
      return res.json(response);
    }

    // For YouTube specifically, try oembed
    if (isYouTubeUrl(url)) {
      const oembedInfo = await getYouTubeInfoViaOembed(url);
      if (oembedInfo) {
        console.log('[Video Info] ✅ Got YouTube info via oembed');
        const response = {
          success: true,
          video: {
            title: oembedInfo.title,
            channel: oembedInfo.channel,
            thumbnail: oembedInfo.thumbnail,
            platform: platform,
            url: url,
          },
          formats: [
            { quality: '1080p', height: 1080, ext: 'mp4' },
            { quality: '720p', height: 720, ext: 'mp4' },
            { quality: '480p', height: 480, ext: 'mp4' },
            { quality: '360p', height: 360, ext: 'mp4' },
          ],
        };
        cache.set(cacheKey, response);
        return res.json(response);
      }
    }

    // If yt-dlp not available, still return a basic response so the download can be attempted
    console.log('[Video Info] ⚠️ No info engine available, returning minimal info');
    const response = {
      success: true,
      video: {
        title: 'Video',
        channel: 'Unknown',
        thumbnail: '',
        platform: platform,
        url: url,
      },
      formats: [
        { quality: '1080p', height: 1080, ext: 'mp4' },
        { quality: '720p', height: 720, ext: 'mp4' },
        { quality: '480p', height: 480, ext: 'mp4' },
        { quality: '360p', height: 360, ext: 'mp4' },
      ],
    };
    cache.set(cacheKey, response);
    return res.json(response);
  } catch (err) {
    console.error('[Video Info Error]', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch video info.' });
  }
});


// ═══════════════════════════════════════════════════════════
// ─── Universal: Download Video ────────────────────────────
// ═══════════════════════════════════════════════════════════
router.post('/video-download', async (req, res) => {
  try {
    const { url, quality, audioOnly } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide a valid URL.' });
    }

    const cacheKey = `dl_${url}_${quality || '1080'}_${audioOnly ? 'a' : 'v'}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const platform = detectPlatform(url);
    const sessionId = uuidv4();
    const ext = audioOnly ? 'mp3' : 'mp4';
    const outputFile = path.join(DOWNLOADS_DIR, `${sessionId}.${ext}`);

    console.log(`[Video Download] Processing: ${url} (platform: ${platform.name}, quality: ${quality || '1080'})`);

    // Method 1: yt-dlp (handles 1000+ sites)
    const ytDlp = await getYtDlp();
    if (ytDlp) {
      try {
        console.log('[Video Download] Trying yt-dlp...');
        await downloadWithYtDlp(url, quality || '720', outputFile, { audioOnly });
        if (fs.existsSync(outputFile)) {
          const stat = fs.statSync(outputFile);
          const downloadUrl = `/api/downloads/video-downloads/${sessionId}.${ext}`;

          let videoTitle = 'video';
          try {
            const info = await getVideoInfoWithYtDlp(url);
            if (info) videoTitle = sanitizeFilename(info.title);
          } catch {}

          console.log('[Video Download] ✅ Success via yt-dlp');
          const response = {
            success: true,
            downloadUrl,
            filename: `${videoTitle}.${ext}`,
            filesize: formatBytes(stat.size),
            platform,
          };
          cache.set(cacheKey, response);
          return res.json(response);
        }
      } catch (e) {
        console.error('[Video Download] yt-dlp error:', e.message);
        try { if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile); } catch {}
      }
    }

    // Method 2: Cobalt API fallback
    console.log('[Video Download] Trying Cobalt API...');
    const cobaltResult = await tryCobaltDownload(url, { quality: quality || '1080', audioOnly });
    if (cobaltResult.success) {
      console.log('[Video Download] ✅ Success via Cobalt');
      const response = {
        success: true,
        downloadUrl: cobaltResult.downloadUrl,
        filename: cobaltResult.filename,
        platform,
        items: cobaltResult.items,
        audioUrl: cobaltResult.audioUrl,
      };
      cache.set(cacheKey, response);
      return res.json(response);
    }

    // Method 3: For YouTube specifically, try ytdl-core
    if (isYouTubeUrl(url) && ytdl) {
      try {
        console.log('[Video Download] Trying ytdl-core (YouTube fallback)...');
        const info = await ytdl.getInfo(url);
        const requestedHeight = parseInt(quality) || 720;
        const videoTitle = sanitizeFilename(info.videoDetails.title);

        let chosenFormat;
        if (audioOnly) {
          chosenFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
        } else {
          const combinedFormats = info.formats
            .filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4')
            .sort((a, b) => (b.height || 0) - (a.height || 0));
          chosenFormat = combinedFormats.find(f => (f.height || 0) <= requestedHeight) || combinedFormats[0];
        }
        if (!chosenFormat) {
          chosenFormat = ytdl.chooseFormat(info.formats, { quality: 'highest' });
        }

        await new Promise((resolve, reject) => {
          const writeStream = fs.createWriteStream(outputFile);
          const downloadStream = ytdl(url, { format: chosenFormat });
          
          const timeout = setTimeout(() => {
            downloadStream.destroy();
            writeStream.destroy();
            reject(new Error('Download timed out'));
          }, 120000);

          downloadStream.pipe(writeStream);
          writeStream.on('finish', () => { clearTimeout(timeout); resolve(); });
          writeStream.on('error', (err) => { clearTimeout(timeout); reject(err); });
          downloadStream.on('error', (err) => { clearTimeout(timeout); reject(err); });
        });

        const downloadUrl = `/api/downloads/video-downloads/${sessionId}.${ext}`;
        console.log('[Video Download] ✅ Success via ytdl-core');
        const response = {
          success: true,
          downloadUrl,
          filename: `${videoTitle}.${ext}`,
          platform,
        };
        cache.set(cacheKey, response);
        return res.json(response);
      } catch (e) {
        console.error('[Video Download] ytdl-core error:', e.message);
        try { if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile); } catch {}
      }
    }

    return res.status(422).json({
      success: false,
      error: `Could not download from ${platform.name}. This platform may not be supported or the URL may be invalid. Please try again.`,
      platform,
    });
  } catch (err) {
    console.error('[Video Download Error]', err.message);
    return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});


module.exports = router;
