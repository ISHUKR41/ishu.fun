/**
 * videoRoutes.js — Video Downloader API Routes (FULLY WORKING)
 *
 * Multi-engine download approach:
 *   1. Cobalt API (updated working instances) — YouTube, Instagram, TikTok, Twitter, etc.
 *   2. yt-dlp (local binary) — 1000+ sites fallback
 *   3. @distube/ytdl-core — YouTube-specific last resort
 *   4. Third-party APIs — Terabox-specific
 *
 * Endpoints:
 *   POST /youtube-info       — Fetch YouTube video metadata + available qualities
 *   POST /youtube-download   — Download YouTube video in selected quality
 *   POST /terabox-info       — Fetch Terabox file info
 *   POST /terabox-download   — Download Terabox file
 *   POST /video-info         — Universal: fetch any video URL metadata
 *   POST /video-download     — Universal: download from any platform
 *   GET  /video-stream/:id   — Stream downloaded file to browser
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

// Cobalt instance health tracking — failed instances are tried last
const cobaltHealthMap = new Map(); // instance -> { failures: number, lastFail: timestamp }
// Clear stale health entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of cobaltHealthMap) {
    if (now - v.lastFail > 600000) cobaltHealthMap.delete(k);
  }
}, 600000);

// Temp downloads directory — use /tmp on Linux/Render (always writable at runtime)
const DOWNLOADS_DIR = process.platform === 'win32'
  ? path.resolve(__dirname, '../../temp/video-downloads')
  : (process.env.VIDEO_DOWNLOADS_DIR || '/tmp/video-downloads');
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

// ── yt-dlp-wrap setup ──────────────────────────────────────
let YTDlpWrap, ytDlpInstance;

// Determine yt-dlp binary path:
// 1. YTDLP_PATH env var (set in render.yaml or local .env)
// 2. /usr/local/bin/yt-dlp (installed at build time by render.yaml buildCommand)
// 3. /tmp/yt-dlp (runtime download fallback on Linux)
// 4. Windows dev path
function getYtDlpBinaryPath() {
  if (process.platform === 'win32') return path.resolve(__dirname, '../../yt-dlp.exe');
  if (process.env.YTDLP_PATH) return process.env.YTDLP_PATH;
  const systemPath = '/usr/local/bin/yt-dlp';
  if (fs.existsSync(systemPath)) return systemPath;
  return '/tmp/yt-dlp';
}
const YTDLP_BINARY_PATH = getYtDlpBinaryPath();
console.log('[Video] yt-dlp binary path:', YTDLP_BINARY_PATH);

let ytDlpInitPromise = null;

async function getYtDlp() {
  if (ytDlpInstance) return ytDlpInstance;
  if (ytDlpInitPromise) return ytDlpInitPromise;

  ytDlpInitPromise = (async () => {
    try {
      YTDlpWrap = require('yt-dlp-wrap').default || require('yt-dlp-wrap');

      // Resolve the effective binary path: prefer YTDLP_BINARY_PATH if it exists,
      // fall back to /tmp/yt-dlp for system paths (which may not be writable at runtime)
      const isSystemPath = YTDLP_BINARY_PATH.startsWith('/usr/');
      const effectivePath = isSystemPath ? '/tmp/yt-dlp' : YTDLP_BINARY_PATH;

      const needsDownload = !fs.existsSync(effectivePath) ||
        fs.statSync(effectivePath).size < 1024; // Corrupt/empty binary

      if (needsDownload && !isSystemPath) {
        // Only download if not a system path (system paths are set up by buildCommand)
        console.log('[Video] ⬇️ Downloading yt-dlp binary to:', effectivePath);
        try {
          await YTDlpWrap.downloadFromGithub(effectivePath);
          // Ensure executable permissions on Linux
          if (process.platform !== 'win32') {
            fs.chmodSync(effectivePath, 0o755);
          }
          console.log('[Video] ✅ yt-dlp binary downloaded to:', effectivePath);
        } catch (downloadErr) {
          console.warn('[Video] ⚠️ yt-dlp binary download failed:', downloadErr.message);
          ytDlpInitPromise = null;
          return null;
        }
      }

      ytDlpInstance = new YTDlpWrap(isSystemPath ? YTDLP_BINARY_PATH : effectivePath);

      try {
        const version = await ytDlpInstance.execPromise(['--version']);
        console.log('[Video] ✅ yt-dlp version:', version.trim());
      } catch (verifyErr) {
        console.warn('[Video] ⚠️ yt-dlp binary verification failed:', verifyErr.message);
        // Try re-downloading to /tmp as last resort
        const fallbackPath = '/tmp/yt-dlp';
        try {
          console.log('[Video] 🔄 Re-downloading yt-dlp binary to:', fallbackPath);
          if (fs.existsSync(fallbackPath)) fs.unlinkSync(fallbackPath);
          await YTDlpWrap.downloadFromGithub(fallbackPath);
          if (process.platform !== 'win32') fs.chmodSync(fallbackPath, 0o755);
          ytDlpInstance = new YTDlpWrap(fallbackPath);
          const ver2 = await ytDlpInstance.execPromise(['--version']);
          console.log('[Video] ✅ yt-dlp re-download successful, version:', ver2.trim());
        } catch (redownloadErr) {
          console.warn('[Video] ⚠️ yt-dlp re-download also failed:', redownloadErr.message);
          ytDlpInstance = null;
          ytDlpInitPromise = null;
          return null;
        }
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

// Initialize on module load (non-blocking, eager download to reduce first-request latency)
getYtDlp().catch(e => console.error('[Video] yt-dlp init error:', e.message));

// ── ytdl-core for YouTube (last resort) ────────────────────
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

/** Clean up old downloaded files (older than 15 min) */
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
      } catch { /* ignore */ }
    }
  } catch { /* ignore */ }
}
setInterval(cleanupOldFiles, 5 * 60 * 1000);

/** Detect platform from URL */
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

function isYouTubeUrl(url) { return /youtube\.com|youtu\.be/i.test(url); }
function isTeraboxUrl(url) { return /terabox\.com|teraboxapp\.com|1024tera\.com|freeterabox\.com|4funbox\.com|mirrobox\.com|nephobox\.com|terabox\.app/i.test(url); }

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
    .replace(/[^\w\s\-\u0900-\u097F]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 80) || 'video';
}


// ═══════════════════════════════════════════════════════════
// ── COBALT API (Primary Engine) ──────────────────────────
// ═══════════════════════════════════════════════════════════

/**
 * Try Cobalt API for download — updated working instances (2025-2026)
 * Cobalt API v10 format: POST / with JSON body
 */
async function tryCobaltDownload(url, options = {}) {
  // Working Cobalt instances — community-maintained, shuffled for load balancing (2026 updated)
  const ALL_INSTANCES = [
    'https://api.cobalt.tools',         // Official Cobalt API — most reliable
    'https://cobalt.imput.net',
    'https://cobalt-api.ayo.tf',
    'https://cobalt.canine.tools',
    'https://co.eepy.today',
    'https://cobalt-api.hyper.lol',
    'https://api.cobalt.best',
    'https://cobalt.tskau.team',
    'https://cobalt-backend.canine.tools',
    'https://cobalt.rainn.dev',
    'https://cobalt.nerdvpn.de',
    'https://cobalt.jemand.live',
  ];
  // Keep official instance first, shuffle the rest for load balancing
  const [first, ...rest] = ALL_INSTANCES;
  // Sort by health: instances with fewer recent failures come first
  const healthSorted = rest.sort((a, b) => {
    const aScore = cobaltHealthMap.get(a)?.failures || 0;
    const bScore = cobaltHealthMap.get(b)?.failures || 0;
    if (aScore !== bScore) return aScore - bScore;
    return Math.random() - 0.5;
  });
  const COBALT_INSTANCES = [first, ...healthSorted];

  // Cobalt API v10 format
  const bodyV10 = {
    url,
    videoQuality: options.quality || '1080',
    audioFormat: 'mp3',
    filenameStyle: 'pretty',
    downloadMode: options.audioOnly ? 'audio' : 'auto',
  };

  // Cobalt API v7 format (older instances)
  const bodyV7 = {
    url,
    vQuality: options.quality || '1080',
    aFormat: 'mp3',
    isAudioOnly: !!options.audioOnly,
  };

  for (const instance of COBALT_INSTANCES) {
    // Try v10 API format first
    for (const [bodyVersion, body] of [['v10', bodyV10], ['v7', bodyV7]]) {
      try {
        console.log(`[Cobalt] Trying ${instance} (${bodyVersion})...`);
        const response = await axios.post(instance, body, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          timeout: 12000,
          validateStatus: (s) => s < 500,
        });
        const data = response.data;

        if (data.status === 'tunnel' || data.status === 'redirect' || data.status === 'stream') {
          console.log(`[Cobalt] ✅ Success from ${instance} (${data.status})`);
          cobaltHealthMap.delete(instance);
          return {
            success: true,
            downloadUrl: data.url,
            filename: data.filename || 'video.mp4',
            status: data.status,
          };
        }
        if (data.status === 'picker') {
          console.log(`[Cobalt] ✅ Picker result from ${instance}`);
          cobaltHealthMap.delete(instance);
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
        // v7 success format
        if (data.url && !data.status) {
          console.log(`[Cobalt] ✅ Success from ${instance} (v7 direct)`);
          cobaltHealthMap.delete(instance);
          return {
            success: true,
            downloadUrl: data.url,
            filename: data.filename || 'video.mp4',
            status: 'redirect',
          };
        }
        if (data.status === 'error') {
          console.log(`[Cobalt] Error from ${instance}: ${data.error?.code || data.text || JSON.stringify(data.error)}`);
          cobaltHealthMap.set(instance, { failures: (cobaltHealthMap.get(instance)?.failures || 0) + 1, lastFail: Date.now() });
          break; // Don't retry same instance with v7 if v10 returned error
        }
      } catch (err) {
        console.log(`[Cobalt] Failed ${instance} (${bodyVersion}): ${err.response?.status || err.message}`);
        cobaltHealthMap.set(instance, { failures: (cobaltHealthMap.get(instance)?.failures || 0) + 1, lastFail: Date.now() });
        if (bodyVersion === 'v10') continue; // try v7 next
        break; // move to next instance
      }
    }
  }
  return { success: false, error: 'All Cobalt instances failed.' };
}


// ═══════════════════════════════════════════════════════════
// ── YT-DLP HELPERS ───────────────────────────────────────
// ═══════════════════════════════════════════════════════════

/** Get video info using yt-dlp --dump-json */
async function getVideoInfoWithYtDlp(url) {
  const ytDlp = await getYtDlp();
  if (!ytDlp) return null;

  try {
    const args = [
      '--dump-json',
      '--no-download',
      '--no-playlist',
      '--no-check-certificates',
      '--socket-timeout', '15',
    ];
    if (ffmpegPath) args.push('--ffmpeg-location', ffmpegPath);
    args.push(url);

    const stdout = await ytDlp.execPromise(args);
    const info = JSON.parse(stdout);

    const formats = (info.formats || [])
      .filter(f => f.height && f.vcodec !== 'none')
      .map(f => ({
        formatId: f.format_id,
        quality: `${f.height}p`,
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

/** Download video using yt-dlp */
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
    '--no-warnings',
  ];

  if (ffmpegPath) args.push('--ffmpeg-location', ffmpegPath);

  return new Promise((resolve, reject) => {
    const subprocess = ytDlp.exec(args);
    const timeout = setTimeout(() => {
      try { subprocess.kill(); } catch {}
      reject(new Error('Download timed out after 5 minutes'));
    }, 300000);

    subprocess.on('close', async () => {
      clearTimeout(timeout);
      // Add a small delay for filesystem sync on Windows
      await new Promise(r => setTimeout(r, 500));
      if (fs.existsSync(outputPath)) {
        const stat = fs.statSync(outputPath);
        if (stat.size > 500 * 1024 * 1024) {
          try { fs.unlinkSync(outputPath); } catch {}
          reject(new Error('File exceeds 500MB limit'));
          return;
        }
        return resolve({ success: true });
      }
      // yt-dlp may append different extension
      const dir = path.dirname(outputPath);
      const base = path.basename(outputPath, path.extname(outputPath));
      for (const ext of ['.mp4', '.mkv', '.webm', '.mp3', '.m4a']) {
        const alt = path.join(dir, base + ext);
        if (fs.existsSync(alt)) {
          if (alt !== outputPath) {
            try { fs.renameSync(alt, outputPath); } catch {}
          }
          const stat = fs.statSync(outputPath);
          if (stat.size > 500 * 1024 * 1024) {
            try { fs.unlinkSync(outputPath); } catch {}
            reject(new Error('File exceeds 500MB limit'));
            return;
          }
          return resolve({ success: true });
        }
      }
      // Check for .part files (incomplete downloads)
      const partFile = outputPath + '.part';
      if (fs.existsSync(partFile)) {
        try { fs.unlinkSync(partFile); } catch {}
      }
      reject(new Error('Download completed but file not found'));
    });

    subprocess.on('error', (err) => {
      clearTimeout(timeout);
      reject(new Error(`yt-dlp error: ${err.message}`));
    });
  });
}


/** Get YouTube video info using oembed (always works, no deps) */
async function getYouTubeInfoViaOembed(url) {
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  try {
    const oembedRes = await axios.get(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { timeout: 8000 }
    );
    return {
      title: oembedRes.data.title || 'YouTube Video',
      channel: oembedRes.data.author_name || 'Unknown',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      thumbnailHQ: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      videoId: videoId,
    };
  } catch {
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
// ── FILE STREAMING ENDPOINT ──────────────────────────────
// ═══════════════════════════════════════════════════════════

/**
 * GET /video-stream/:id — Stream a downloaded file directly to browser
 * This enables proper file download (Content-Disposition: attachment)
 * instead of opening in new window
 */
router.get('/video-stream/:id', (req, res) => {
  const { id } = req.params;
  const filename = req.query.filename || 'video.mp4';

  // Sanitize the id to prevent path traversal
  const safeId = id.replace(/[^a-zA-Z0-9._-]/g, '');
  const filePath = path.join(DOWNLOADS_DIR, safeId);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'File not found or expired.' });
  }

  const stat = fs.statSync(filePath);
  const ext = path.extname(safeId).toLowerCase();
  const mimeTypes = {
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.m4a': 'audio/mp4',
    '.webm': 'video/webm',
    '.mkv': 'video/x-matroska',
  };

  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on('error', () => res.status(500).end());
});


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

    const cacheKey = `yt_info_${url}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const videoId = extractVideoId(url);
    console.log(`[YouTube Info] Processing: ${url} (videoId: ${videoId})`);

    // FAST PATH: Get oembed info first (instant, always works)
    // This gives us title + thumbnail immediately
    const oembedInfo = await getYouTubeInfoViaOembed(url);

    // Then try yt-dlp for full format info (parallel attempt)
    let ytDlpInfo = null;
    try {
      ytDlpInfo = await getVideoInfoWithYtDlp(url);
    } catch (e) {
      console.log('[YouTube Info] yt-dlp info failed:', e.message);
    }

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

    // Fallback 2: Try Invidious/Piped for format info
    if (videoId) {
      const infoInstances = [
        { type: 'invidious', url: `https://inv.nadeko.net/api/v1/videos/${videoId}` },
        { type: 'invidious', url: `https://invidious.nerdvpn.de/api/v1/videos/${videoId}` },
        { type: 'piped', url: `https://pipedapi.kavin.rocks/streams/${videoId}` },
        { type: 'piped', url: `https://pipedapi.adminforge.de/streams/${videoId}` },
      ];
      for (const inst of infoInstances) {
        try {
          const resp = await axios.get(inst.url, { timeout: 10000 });
          const d = resp.data;
          if (inst.type === 'invidious' && d.title) {
            const formats = (d.formatStreams || [])
              .filter(f => f.type && f.type.includes('video'))
              .map(f => ({ quality: f.qualityLabel || f.quality, height: parseInt(f.qualityLabel) || 720, ext: 'mp4' }));
            const response = {
              success: true,
              video: {
                title: d.title,
                channel: d.author || 'Unknown',
                thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '',
                thumbnailHQ: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '',
                videoId,
                url,
                duration: d.lengthSeconds ? `${Math.floor(d.lengthSeconds / 60)}:${String(d.lengthSeconds % 60).padStart(2, '0')}` : null,
                views: d.viewCount ? parseInt(d.viewCount).toLocaleString() : null,
              },
              formats: formats.length > 0 ? formats : [
                { quality: '1080p', height: 1080, ext: 'mp4' },
                { quality: '720p', height: 720, ext: 'mp4' },
                { quality: '480p', height: 480, ext: 'mp4' },
                { quality: '360p', height: 360, ext: 'mp4' },
              ],
            };
            cache.set(cacheKey, response);
            console.log('[YouTube Info] ✅ Got info via Invidious');
            return res.json(response);
          }
          if (inst.type === 'piped' && d.title) {
            const formats = (d.videoStreams || [])
              .filter(s => !s.videoOnly)
              .map(s => ({ quality: s.quality || '720p', height: parseInt(s.quality) || 720, ext: 'mp4' }));
            const seen = new Set();
            const uniqueFormats = formats.filter(f => { if (seen.has(f.quality)) return false; seen.add(f.quality); return true; });
            const response = {
              success: true,
              video: {
                title: d.title,
                channel: d.uploader || 'Unknown',
                thumbnail: d.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                thumbnailHQ: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                videoId,
                url,
                duration: d.duration ? `${Math.floor(d.duration / 60)}:${String(d.duration % 60).padStart(2, '0')}` : null,
                views: d.views ? parseInt(d.views).toLocaleString() : null,
              },
              formats: uniqueFormats.length > 0 ? uniqueFormats : [
                { quality: '1080p', height: 1080, ext: 'mp4' },
                { quality: '720p', height: 720, ext: 'mp4' },
                { quality: '480p', height: 480, ext: 'mp4' },
                { quality: '360p', height: 360, ext: 'mp4' },
              ],
            };
            cache.set(cacheKey, response);
            console.log('[YouTube Info] ✅ Got info via Piped');
            return res.json(response);
          }
        } catch { continue; }
      }
    }

    // Fallback: oembed info (always works — metadata only, standard quality options)
    console.log('[YouTube Info] ✅ Using oembed info');
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
    } catch { /* use default */ }

    // Method 1: Cobalt API (FASTEST — returns direct download URL)
    console.log('[YouTube Download] Trying Cobalt API first...');
    const cobaltResult = await tryCobaltDownload(url, { quality: quality || '1080' });
    if (cobaltResult.success && cobaltResult.downloadUrl) {
      console.log('[YouTube Download] ✅ Success via Cobalt');
      return res.json({
        success: true,
        downloadUrl: cobaltResult.downloadUrl,
        filename: `${videoTitle}_${quality || '720'}p.mp4`,
        quality: `${quality || '720'}p`,
        source: 'cobalt',
        isDirect: true,
      });
    }

    // Method 2: yt-dlp (downloads to server, then serves file)
    const ytDlp = await getYtDlp();
    if (ytDlp) {
      try {
        console.log('[YouTube Download] Trying yt-dlp...');
        await downloadWithYtDlp(url, quality || '720', outputFile);
        if (fs.existsSync(outputFile)) {
          const stat = fs.statSync(outputFile);
          const streamFilename = `${videoTitle}_${quality || '720'}p.mp4`;
          console.log('[YouTube Download] ✅ Success via yt-dlp');
          return res.json({
            success: true,
            downloadUrl: `/api/tools/video-stream/${sessionId}.mp4?filename=${encodeURIComponent(streamFilename)}`,
            filename: streamFilename,
            filesize: formatBytes(stat.size),
            quality: `${quality || '720'}p`,
            source: 'yt-dlp',
          });
        }
      } catch (ytDlpErr) {
        console.error('[YouTube Download] yt-dlp error:', ytDlpErr.message);
        try { if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile); } catch {}
      }
    }

    // Method 3: Invidious/Piped API fallback (YouTube only — returns direct links)
    if (isYouTubeUrl(url)) {
      const videoId = extractVideoId(url);
      if (videoId) {
        const invidiousInstances = [
          'https://inv.nadeko.net',
          'https://invidious.nerdvpn.de',
          'https://vid.puffyan.us',
          'https://yt.artemislena.eu',
          'https://invidious.privacyredirect.com',
          'https://invidious.lunar.icu',
          'https://inv.tux.pizza',
          'https://invidious.protokolla.fi',
          'https://invidious.perennialte.ch',
          'https://inv.us.projectsegfau.lt',
          'https://invidious.einfachzocken.eu',
        ];
        // Also try Piped API instances
        const pipedInstances = [
          'https://pipedapi.kavin.rocks',
          'https://pipedapi.adminforge.de',
          'https://api.piped.projectsegfau.lt',
          'https://pipedapi.in.projectsegfau.lt',
          'https://api.piped.privacydev.net',
          'https://pipedapi.tokhmi.xyz',
        ];
        for (const instance of invidiousInstances) {
          try {
            console.log(`[YouTube Download] Trying Invidious (${instance})...`);
            const resp = await axios.get(`${instance}/api/v1/videos/${videoId}`, { timeout: 15000 });
            const videoData = resp.data;
            const requestedHeight = parseInt(quality) || 720;
            // Look for combined format (video+audio)
            const formats = (videoData.formatStreams || [])
              .filter(f => f.type && f.type.includes('video'))
              .sort((a, b) => (parseInt(b.qualityLabel) || 0) - (parseInt(a.qualityLabel) || 0));
            const chosen = formats.find(f => (parseInt(f.qualityLabel) || 0) <= requestedHeight) || formats[0];
            if (chosen && chosen.url) {
              console.log('[YouTube Download] ✅ Success via Invidious');
              return res.json({
                success: true,
                downloadUrl: chosen.url,
                filename: `${videoTitle}_${chosen.qualityLabel || quality + 'p'}.mp4`,
                quality: chosen.qualityLabel || `${quality}p`,
                source: 'invidious',
                isDirect: true,
              });
            }
          } catch (err) {
            console.log(`[YouTube Download] Invidious ${instance} failed: ${err.message}`);
            continue;
          }
        }

        // Also try Piped API
        for (const pipedBase of pipedInstances) {
          try {
            console.log(`[YouTube Download] Trying Piped (${pipedBase})...`);
            const resp = await axios.get(`${pipedBase}/streams/${videoId}`, { timeout: 15000 });
            const videoStreams = (resp.data.videoStreams || [])
              .filter(s => s.videoOnly === false)
              .sort((a, b) => (parseInt(b.quality) || 0) - (parseInt(a.quality) || 0));
            const requestedHeight = parseInt(quality) || 720;
            const chosen = videoStreams.find(s => (parseInt(s.quality) || 0) <= requestedHeight) || videoStreams[0];
            if (chosen && chosen.url) {
              console.log('[YouTube Download] ✅ Success via Piped');
              return res.json({
                success: true,
                downloadUrl: chosen.url,
                filename: `${videoTitle}_${chosen.quality || quality + 'p'}.mp4`,
                quality: chosen.quality || `${quality}p`,
                source: 'piped',
                isDirect: true,
              });
            }
          } catch (err) {
            console.log(`[YouTube Download] Piped ${pipedBase} failed: ${err.message}`);
            continue;
          }
        }
      }
    }

    // Method 4: ytdl-core fallback (YouTube only)
    if (ytdl) {
      try {
        console.log('[YouTube Download] Trying ytdl-core...');
        const info = await ytdl.getInfo(url);
        const requestedHeight = parseInt(quality) || 720;

        let chosenFormat;
        if (itag) chosenFormat = info.formats.find(f => f.itag === parseInt(itag));
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
        const streamFilename = `${videoTitle}_${chosenFormat.qualityLabel || quality + 'p'}.mp4`;
        console.log('[YouTube Download] ✅ Success via ytdl-core');
        return res.json({
          success: true,
          downloadUrl: `/api/tools/video-stream/${sessionId}.mp4?filename=${encodeURIComponent(streamFilename)}`,
          filename: streamFilename,
          filesize: formatBytes(stat.size),
          quality: chosenFormat.qualityLabel || `${quality}p`,
          source: 'ytdl-core',
        });
      } catch (ytdlErr) {
        console.error('[YouTube Download] ytdl-core error:', ytdlErr.message);
        try { if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile); } catch {}
      }
    }

    return res.status(422).json({
      success: false,
      error: 'All download methods failed. Possible causes: (1) Video is age-restricted or private, (2) Regional restrictions, (3) Temporary server issues. Please try again or try a different video.',
      engines_tried: ['cobalt', 'yt-dlp', 'invidious', 'piped', 'ytdl-core'],
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

    const cacheKey = `tb_${url}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    console.log(`[Terabox Info] Processing: ${url}`);

    // Method 1: yt-dlp (supports Terabox!)
    const ytDlpInfo = await getVideoInfoWithYtDlp(url);
    if (ytDlpInfo) {
      console.log('[Terabox Info] ✅ Got info via yt-dlp');
      const response = {
        success: true,
        file: {
          name: ytDlpInfo.title || 'Terabox File',
          size: ytDlpInfo.formats[0]?.filesizeStr || 'Unknown',
          thumbnail: ytDlpInfo.thumbnail || '',
          downloadLink: null,
          isVideo: true,
          duration: ytDlpInfo.duration,
          platform: 'Terabox',
          useBackendDownload: true,
        },
      };
      cache.set(cacheKey, response);
      return res.json(response);
    }

    // Method 2: Third-party Terabox APIs (run concurrently for speed)
    console.log('[Terabox Info] Trying third-party APIs concurrently...');
    const fileInfo = await getTeraboxInfoFromAPIs(url, false); // don't require download link for info
    if (fileInfo) {
      console.log('[Terabox Info] ✅ Got info via third-party APIs');
      const response = { success: true, file: fileInfo };
      cache.set(cacheKey, response);
      return res.json(response);
    }

    // Method 3: Puppeteer direct scraping (last resort)
    try {
      console.log('[Terabox Info] Trying Puppeteer scraping...');
      const puppeteer = require('puppeteer');
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        timeout: 30000,
      });
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });

      const puppeteerInfo = await page.evaluate(() => {
        const title = document.querySelector('.file-name, .name, h1, .video-title, [class*="file-name"]');
        const size = document.querySelector('.file-size, .size, [class*="file-size"]');
        const thumb = document.querySelector('video[poster], img.thumb, .thumbnail img, [class*="thumbnail"] img, video');
        const downloadBtn = document.querySelector('a[href*="download"], a[href*="d.terabox"], button[class*="download"]');

        if (title) {
          const name = title.textContent?.trim() || 'Terabox File';
          return {
            name,
            size: size?.textContent?.trim() || 'Unknown',
            thumbnail: thumb?.getAttribute('poster') || thumb?.getAttribute('src') || '',
            downloadLink: downloadBtn?.getAttribute('href') || '',
            isVideo: /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|3gp)$/i.test(name),
          };
        }
        return null;
      });

      await browser.close();
      if (puppeteerInfo) {
        console.log('[Terabox Info] ✅ Got info via Puppeteer');
        const response = { success: true, file: puppeteerInfo };
        cache.set(cacheKey, response);
        return res.json(response);
      }
    } catch (puppeteerErr) {
      console.log('[Terabox Info] Puppeteer failed:', puppeteerErr.message);
    }

    return res.status(422).json({
      success: false,
      error: 'Could not extract file info from Terabox. The link may be expired, invalid, or the file may be private.',
    });
  } catch (err) {
    console.error('[Terabox Info Error]', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch file info. Please try again.' });
  }
});


// ═══════════════════════════════════════════════════════════
// ── Terabox: Helper — fetch info from third-party APIs ───
// ═══════════════════════════════════════════════════════════
const TERABOX_APIS = [
  {
    name: 'TeraboxDL-AllDL',
    url: (url) => `https://alldl.xyz/api/terabox?url=${encodeURIComponent(url)}`,
    parse: (data) => {
      if (data && data.status === 'success' && data.data) {
        const d = data.data;
        return {
          name: d.file_name || d.title || 'Terabox File',
          size: d.size || 'Unknown',
          thumbnail: d.thumb || d.thumbnail || '',
          downloadLink: d.download_link || d.direct_link || d.dlink || '',
          isVideo: /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|3gp)$/i.test(d.file_name || ''),
        };
      }
      return null;
    },
  },
  {
    name: 'TeraboxDL-TeraDownloader',
    url: (url) => `https://teradownloader.com/api/download?url=${encodeURIComponent(url)}`,
    parse: (data) => {
      if (data && (data.file_name || data.name || data.title)) {
        const name = data.file_name || data.name || data.title || 'Terabox File';
        return {
          name,
          size: data.size || data.file_size || 'Unknown',
          thumbnail: data.thumb || data.thumbnail || data.image || '',
          downloadLink: data.direct_link || data.download_link || data.dlink || data.link || '',
          isVideo: /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|3gp)$/i.test(name),
        };
      }
      return null;
    },
  },
  {
    name: 'TeraboxDL-SaveBox',
    url: (url) => `https://api.savebox.app/api/terabox?url=${encodeURIComponent(url)}`,
    parse: (data) => {
      if (data && data.data) {
        const d = data.data;
        return {
          name: d.file_name || d.title || 'Terabox File',
          size: d.size || 'Unknown',
          thumbnail: d.thumb || d.thumbnail || '',
          downloadLink: d.direct_link || d.download_link || d.dlink || '',
          isVideo: /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|3gp)$/i.test(d.file_name || ''),
        };
      }
      return null;
    },
  },
  {
    name: 'TeraboxDL-DLPanda',
    url: (url) => `https://dlpanda.com/api/terabox?url=${encodeURIComponent(url)}`,
    parse: (data) => {
      if (data && (data.file_name || data.name)) {
        const name = data.file_name || data.name || 'Terabox File';
        return {
          name,
          size: data.size || data.file_size || 'Unknown',
          thumbnail: data.thumb || data.thumbnail || '',
          downloadLink: data.direct_link || data.download_link || data.dlink || '',
          isVideo: /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|3gp)$/i.test(name),
        };
      }
      return null;
    },
  },
  {
    name: 'TeraboxDL-SaveAll',
    url: (url) => `https://www.saveall.ai/api/terabox?url=${encodeURIComponent(url)}`,
    parse: (data) => {
      if (data && data.data) {
        const d = data.data;
        return {
          name: d.file_name || d.title || 'Terabox File',
          size: d.size || 'Unknown',
          thumbnail: d.thumb || '',
          downloadLink: d.direct_link || d.download_link || '',
          isVideo: true,
        };
      }
      return null;
    },
  },
  {
    name: 'TeraboxDL-MDTerabox',
    url: (url) => `https://mdterabox.vercel.app/api?url=${encodeURIComponent(url)}`,
    parse: (data) => {
      if (data && (data.file_name || data.title || data.name)) {
        const name = data.file_name || data.title || data.name || 'Terabox File';
        return {
          name,
          size: data.size || data.file_size || 'Unknown',
          thumbnail: data.thumb || data.thumbnail || '',
          downloadLink: data.download_link || data.direct_link || data.dlink || data.link || '',
          isVideo: /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|3gp)$/i.test(name),
        };
      }
      return null;
    },
  },
];

/**
 * Fetch Terabox file info from all third-party APIs concurrently.
 * Returns the first successful result (with or without downloadLink depending on requireLink).
 */
async function getTeraboxInfoFromAPIs(url, requireLink = true) {
  const makeRequest = async (api) => {
    try {
      const resp = await axios.get(api.url(url), {
        timeout: 10000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      });
      const result = api.parse(resp.data);
      if (!result) return null;
      if (requireLink && !result.downloadLink) return null;
      console.log(`[Terabox APIs] ✅ ${api.name} returned result`);
      return result;
    } catch (err) {
      console.log(`[Terabox APIs] ${api.name} failed: ${err.message}`);
      return null;
    }
  };

  // Run all API calls concurrently and return the first non-null result
  const results = await Promise.all(TERABOX_APIS.map(api => makeRequest(api)));
  return results.find(r => r !== null) || null;
}


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

    // Method 1: Cobalt API (supports some Terabox links)
    const cobaltResult = await tryCobaltDownload(url, { quality: quality || '720' });
    if (cobaltResult.success && cobaltResult.downloadUrl) {
      console.log('[Terabox Download] ✅ Success via Cobalt');
      return res.json({
        success: true,
        downloadUrl: cobaltResult.downloadUrl,
        filename: cobaltResult.filename || 'terabox_video.mp4',
        isDirect: true,
      });
    }

    // Method 2: yt-dlp
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
            downloadUrl: `/api/tools/video-stream/${sessionId}.mp4?filename=terabox_video.mp4`,
            filename: `terabox_${sessionId}.mp4`,
            filesize: formatBytes(stat.size),
          });
        }
      } catch (e) {
        console.error('[Terabox Download] yt-dlp error:', e.message);
        try { if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile); } catch {}
      }
    }

    // Method 3: Try third-party APIs for direct download links
    console.log('[Terabox Download] Trying third-party APIs...');
    const infoRes = await getTeraboxInfoFromAPIs(url);
    if (infoRes && infoRes.downloadLink) {
      console.log('[Terabox Download] ✅ Success via third-party API');
      return res.json({
        success: true,
        downloadUrl: infoRes.downloadLink,
        filename: infoRes.name || 'terabox_file',
        isDirect: true,
      });
    }

    return res.status(500).json({ success: false, error: 'Could not download from Terabox. The file may be private or the link may be expired.' });
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

    // Return minimal info so download can still be attempted via Cobalt
    console.log('[Video Info] ⚠️ Returning minimal info');
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

    // Method 1: Cobalt API (FASTEST — returns direct download URL)
    console.log('[Video Download] Trying Cobalt API first...');
    const cobaltResult = await tryCobaltDownload(url, { quality: quality || '1080', audioOnly });
    if (cobaltResult.success && cobaltResult.downloadUrl) {
      console.log('[Video Download] ✅ Success via Cobalt');
      const response = {
        success: true,
        downloadUrl: cobaltResult.downloadUrl,
        filename: cobaltResult.filename || `video.${ext}`,
        platform,
        items: cobaltResult.items,
        audioUrl: cobaltResult.audioUrl,
        isDirect: true,
      };
      cache.set(cacheKey, response);
      return res.json(response);
    }

    // Method 2: yt-dlp (downloads to server, then serves file)
    const ytDlp = await getYtDlp();
    if (ytDlp) {
      try {
        console.log('[Video Download] Trying yt-dlp...');
        await downloadWithYtDlp(url, quality || '720', outputFile, { audioOnly });
        if (fs.existsSync(outputFile)) {
          const stat = fs.statSync(outputFile);
          let videoTitle = 'video';
          try {
            const info = await getVideoInfoWithYtDlp(url);
            if (info) videoTitle = sanitizeFilename(info.title);
          } catch {}

          const streamFilename = `${videoTitle}.${ext}`;
          console.log('[Video Download] ✅ Success via yt-dlp');
          const response = {
            success: true,
            downloadUrl: `/api/tools/video-stream/${sessionId}.${ext}?filename=${encodeURIComponent(streamFilename)}`,
            filename: streamFilename,
            filesize: formatBytes(stat.size),
            platform,
          };
          // Do not cache server-side streaming responses (temp files are deleted after 15 min)
          return res.json(response);
        }
      } catch (e) {
        console.error('[Video Download] yt-dlp error:', e.message);
        try { if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile); } catch {}
      }
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
            downloadStream.destroy(); writeStream.destroy();
            reject(new Error('Download timed out'));
          }, 120000);
          downloadStream.pipe(writeStream);
          writeStream.on('finish', () => { clearTimeout(timeout); resolve(); });
          writeStream.on('error', (err) => { clearTimeout(timeout); reject(err); });
          downloadStream.on('error', (err) => { clearTimeout(timeout); reject(err); });
        });

        const streamFilename = `${videoTitle}.${ext}`;
        console.log('[Video Download] ✅ Success via ytdl-core');
        const response = {
          success: true,
          downloadUrl: `/api/tools/video-stream/${sessionId}.${ext}?filename=${encodeURIComponent(streamFilename)}`,
          filename: streamFilename,
          platform,
        };
        // Do not cache server-side streaming responses (temp files are deleted after 15 min)
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
