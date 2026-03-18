/**
 * universalDownloadRoutes.js - Universal Video Downloader API
 * 
 * Supports 1000+ websites including:
 * - YouTube, Facebook, Instagram, Twitter/X, TikTok
 * - Vimeo, Dailymotion, Twitch, Reddit
 * - LinkedIn, Pinterest, Tumblr
 * - And many more...
 * 
 * Uses yt-dlp as backend (most comprehensive video downloader)
 */

const express = require('express');
const router = express.Router();
const YTDlpWrap = require('yt-dlp-wrap').default;
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Use /tmp on Linux/Render for writable runtime storage
const TEMP_DIR = process.platform === 'win32'
  ? (process.env.TEMP_DIR || path.join(__dirname, '../../../temp'))
  : '/tmp';

// yt-dlp binary path: prefer system install (from render.yaml buildCommand), then /tmp
function getYtDlpPath() {
  if (process.platform === 'win32') return path.join(TEMP_DIR, 'yt-dlp.exe');
  if (process.env.YTDLP_PATH) return process.env.YTDLP_PATH;
  const systemPath = '/usr/local/bin/yt-dlp';
  if (fs.existsSync(systemPath)) return systemPath;
  return '/tmp/yt-dlp';
}
const YTDLP_UNIVERSAL_PATH = getYtDlpPath();

// Initialize yt-dlp
let ytDlpPath;
let ytDlpReady = false;

(async () => {
    try {
        // Check if binary already exists (shared with videoRoutes.js)
        if (fs.existsSync(YTDLP_UNIVERSAL_PATH) && fs.statSync(YTDLP_UNIVERSAL_PATH).size > 1024) {
            ytDlpPath = YTDLP_UNIVERSAL_PATH;
            ytDlpReady = true;
            console.log('[Universal Download] yt-dlp binary found at:', ytDlpPath);
        } else {
            console.log('[Universal Download] Downloading yt-dlp binary to:', YTDLP_UNIVERSAL_PATH);
            await YTDlpWrap.downloadFromGithub(YTDLP_UNIVERSAL_PATH);
            if (process.platform !== 'win32') fs.chmodSync(YTDLP_UNIVERSAL_PATH, 0o755);
            ytDlpPath = YTDLP_UNIVERSAL_PATH;
            ytDlpReady = true;
            console.log('[Universal Download] yt-dlp initialized successfully');
        }
    } catch (err) {
        console.error('[Universal Download] Failed to initialize yt-dlp:', err.message);
    }
})();

/**
 * Supported platforms (partial list - yt-dlp supports 1000+)
 */
const SUPPORTED_PLATFORMS = [
    { name: 'YouTube', domains: ['youtube.com', 'youtu.be'], icon: '🎥' },
    { name: 'Facebook', domains: ['facebook.com', 'fb.watch'], icon: '📘' },
    { name: 'Instagram', domains: ['instagram.com'], icon: '📷' },
    { name: 'Twitter/X', domains: ['twitter.com', 'x.com'], icon: '🐦' },
    { name: 'TikTok', domains: ['tiktok.com'], icon: '🎵' },
    { name: 'Vimeo', domains: ['vimeo.com'], icon: '🎬' },
    { name: 'Dailymotion', domains: ['dailymotion.com'], icon: '📹' },
    { name: 'Twitch', domains: ['twitch.tv'], icon: '🎮' },
    { name: 'Reddit', domains: ['reddit.com', 'redd.it'], icon: '🤖' },
    { name: 'LinkedIn', domains: ['linkedin.com'], icon: '💼' },
    { name: 'Pinterest', domains: ['pinterest.com'], icon: '📌' },
    { name: 'Tumblr', domains: ['tumblr.com'], icon: '📝' },
    { name: 'Soundcloud', domains: ['soundcloud.com'], icon: '🎧' },
    { name: 'Mixcloud', domains: ['mixcloud.com'], icon: '🎶' },
    { name: 'Bandcamp', domains: ['bandcamp.com'], icon: '🎸' },
    { name: 'Streamable', domains: ['streamable.com'], icon: '📺' },
    { name: 'Imgur', domains: ['imgur.com'], icon: '🖼️' },
    { name: 'Flickr', domains: ['flickr.com'], icon: '📸' },
    { name: 'Bilibili', domains: ['bilibili.com'], icon: '🎭' },
    { name: 'Niconico', domains: ['nicovideo.jp'], icon: '🎌' },
];

/**
 * Detect platform from URL
 */
function detectPlatform(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.replace('www.', '');
        
        for (const platform of SUPPORTED_PLATFORMS) {
            if (platform.domains.some(domain => hostname.includes(domain))) {
                return platform;
            }
        }
        
        return { name: 'Unknown', domains: [hostname], icon: '🌐' };
    } catch {
        return null;
    }
}

/**
 * GET /api/tools/universal-info
 * Extract video information from any supported platform
 */
router.get('/universal-info', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ success: false, error: 'URL is required' });
        }

        if (!ytDlpReady) {
            return res.status(503).json({ 
                success: false, 
                error: 'Video downloader is initializing. Please try again in a moment.' 
            });
        }

        const platform = detectPlatform(url);
        if (!platform) {
            return res.status(400).json({ success: false, error: 'Invalid URL' });
        }

        console.log(`[Universal Info] Fetching info from ${platform.name}: ${url}`);

        const ytDlp = new YTDlpWrap(ytDlpPath);

        // Extract video info using yt-dlp
        const info = await ytDlp.getVideoInfo(url);

        // Parse formats
        const formats = (info.formats || [])
            .filter(f => f.vcodec !== 'none' || f.acodec !== 'none') // Has video or audio
            .map(f => ({
                formatId: f.format_id,
                ext: f.ext,
                quality: f.format_note || f.quality || 'unknown',
                filesize: f.filesize || f.filesize_approx || null,
                hasVideo: f.vcodec !== 'none',
                hasAudio: f.acodec !== 'none',
                width: f.width,
                height: f.height,
                fps: f.fps,
                vcodec: f.vcodec,
                acodec: f.acodec,
                tbr: f.tbr, // Total bitrate
            }))
            .sort((a, b) => {
                // Prioritize combined video+audio formats
                if (a.hasVideo && a.hasAudio && !(b.hasVideo && b.hasAudio)) return -1;
                if (b.hasVideo && b.hasAudio && !(a.hasVideo && a.hasAudio)) return 1;
                // Then sort by quality (height)
                return (b.height || 0) - (a.height || 0);
            });

        const videoDetails = {
            platform: platform.name,
            platformIcon: platform.icon,
            title: info.title || 'Untitled',
            uploader: info.uploader || info.channel || 'Unknown',
            duration: info.duration || null,
            thumbnail: info.thumbnail || null,
            description: info.description || '',
            viewCount: info.view_count || null,
            uploadDate: info.upload_date || null,
            formats: formats.slice(0, 15), // Top 15 formats
            bestFormat: formats[0] || null,
        };

        res.json({ success: true, data: videoDetails });

    } catch (error) {
        console.error('[Universal Info] Error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch video information',
            details: error.message 
        });
    }
});

/**
 * POST /api/tools/universal-download
 * Download video from any supported platform
 */
router.post('/universal-download', async (req, res) => {
    let outputPath = null;
    
    try {
        const { url, formatId = 'best', audioOnly = false } = req.body;
        
        if (!url) {
            return res.status(400).json({ success: false, error: 'URL is required' });
        }

        if (!ytDlpReady) {
            return res.status(503).json({ 
                success: false, 
                error: 'Video downloader is initializing. Please try again in a moment.' 
            });
        }

        const platform = detectPlatform(url);
        if (!platform) {
            return res.status(400).json({ success: false, error: 'Invalid URL' });
        }

        console.log(`[Universal Download] Starting download from ${platform.name}: ${url}`);

        // Ensure temp directory exists
        await fs.ensureDir(TEMP_DIR);

        // Generate unique filename
        const fileId = uuidv4();
        const ext = audioOnly ? 'mp3' : 'mp4';
        outputPath = path.join(TEMP_DIR, `universal_${fileId}.${ext}`);

        const ytDlp = new YTDlpWrap(ytDlpPath);

        const options = [
            '--no-playlist',
            '--no-warnings',
            '--no-check-certificate',
            '--prefer-free-formats',
            '--add-metadata',
            '--embed-thumbnail',
        ];

        if (audioOnly) {
            options.push(
                '--extract-audio',
                '--audio-format', 'mp3',
                '--audio-quality', '0',
            );
        } else {
            if (formatId === 'best') {
                options.push('--format', 'bestvideo+bestaudio/best');
            } else {
                options.push('--format', formatId);
            }
            options.push('--merge-output-format', 'mp4');
        }

        options.push('--output', outputPath);

        // Download with progress tracking
        await ytDlp.execPromise([url, ...options]);

        console.log(`[Universal Download] Success: ${outputPath}`);

        // Get file stats
        const stats = await fs.stat(outputPath);
        const filename = path.basename(outputPath);

        res.json({
            success: true,
            data: {
                filename,
                size: stats.size,
                sizeFormatted: formatBytes(stats.size),
                downloadUrl: `/api/downloads/${filename}`,
                platform: platform.name,
                message: 'Video downloaded successfully',
            },
        });

    } catch (error) {
        console.error('[Universal Download] Error:', error.message);
        
        // Cleanup on error
        if (outputPath && await fs.pathExists(outputPath)) {
            await fs.remove(outputPath).catch(() => {});
        }

        res.status(500).json({ 
            success: false, 
            error: 'Failed to download video',
            details: error.message 
        });
    }
});

/**
 * GET /api/tools/universal-platforms
 * Get list of supported platforms
 */
router.get('/universal-platforms', (req, res) => {
    res.json({
        success: true,
        data: {
            platforms: SUPPORTED_PLATFORMS,
            total: SUPPORTED_PLATFORMS.length,
            note: 'yt-dlp supports 1000+ websites. This is a partial list of popular platforms.',
        },
    });
});

/**
 * Helper: Format bytes to human-readable string
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = router;
