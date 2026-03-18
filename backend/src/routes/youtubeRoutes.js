/**
 * youtubeRoutes.js - YouTube Video Downloader API
 * 
 * Features:
 * - Extract video info (title, thumbnail, duration, formats)
 * - Download videos in multiple qualities (360p, 720p, 1080p, 4K)
 * - Audio-only download (MP3)
 * - Preview support
 * - Progress tracking
 * 
 * Uses: yt-dlp-wrap (most reliable), @distube/ytdl-core (fallback)
 */

const express = require('express');
const router = express.Router();
const YTDlpWrap = require('yt-dlp-wrap').default;
const ytdl = require('@distube/ytdl-core');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TEMP_DIR = process.env.TEMP_DIR || path.join(__dirname, '../../../temp');

// Initialize yt-dlp (will auto-download binary if needed)
let ytDlpPath;
try {
    ytDlpPath = require('yt-dlp-wrap').default.downloadFromGithub();
} catch (err) {
    console.warn('[YouTube] yt-dlp binary not found, will use ytdl-core fallback');
}

/**
 * GET /api/tools/youtube-info
 * Extract video information without downloading
 */
router.get('/youtube-info', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ success: false, error: 'URL is required' });
        }

        // Validate YouTube URL
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });
        }

        console.log(`[YouTube Info] Fetching info for: ${url}`);

        // Get video info using ytdl-core (faster for info extraction)
        const info = await ytdl.getInfo(url);
        
        // Extract available formats
        const formats = info.formats
            .filter(f => f.hasVideo && f.hasAudio) // Combined video+audio
            .map(f => ({
                itag: f.itag,
                quality: f.qualityLabel || f.quality,
                container: f.container,
                filesize: f.contentLength ? parseInt(f.contentLength) : null,
                fps: f.fps,
                videoCodec: f.videoCodec,
                audioCodec: f.audioCodec,
                bitrate: f.bitrate,
            }))
            .sort((a, b) => {
                // Sort by quality (highest first)
                const qualityOrder = { '2160p': 5, '1440p': 4, '1080p': 3, '720p': 2, '480p': 1, '360p': 0 };
                const aQ = qualityOrder[a.quality] || -1;
                const bQ = qualityOrder[b.quality] || -1;
                return bQ - aQ;
            });

        // Audio-only formats
        const audioFormats = info.formats
            .filter(f => f.hasAudio && !f.hasVideo)
            .map(f => ({
                itag: f.itag,
                quality: f.audioBitrate ? `${f.audioBitrate}kbps` : 'audio',
                container: f.container,
                filesize: f.contentLength ? parseInt(f.contentLength) : null,
                audioCodec: f.audioCodec,
                bitrate: f.bitrate,
            }))
            .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

        const videoDetails = {
            title: info.videoDetails.title,
            author: info.videoDetails.author.name,
            duration: parseInt(info.videoDetails.lengthSeconds),
            thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
            description: info.videoDetails.description,
            viewCount: parseInt(info.videoDetails.viewCount),
            uploadDate: info.videoDetails.uploadDate,
            formats: formats.slice(0, 10), // Top 10 video formats
            audioFormats: audioFormats.slice(0, 5), // Top 5 audio formats
        };

        res.json({ success: true, data: videoDetails });

    } catch (error) {
        console.error('[YouTube Info] Error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch video information',
            details: error.message 
        });
    }
});

/**
 * POST /api/tools/youtube-download
 * Download YouTube video in specified quality
 */
router.post('/youtube-download', async (req, res) => {
    let outputPath = null;
    
    try {
        const { url, quality = '720p', format = 'mp4', audioOnly = false } = req.body;
        
        if (!url) {
            return res.status(400).json({ success: false, error: 'URL is required' });
        }

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ success: false, error: 'Invalid YouTube URL' });
        }

        console.log(`[YouTube Download] Starting download: ${url} (${quality})`);

        // Ensure temp directory exists
        await fs.ensureDir(TEMP_DIR);

        // Generate unique filename
        const fileId = uuidv4();
        const ext = audioOnly ? 'mp3' : format;
        outputPath = path.join(TEMP_DIR, `youtube_${fileId}.${ext}`);

        // Try yt-dlp first (more reliable for high quality)
        if (ytDlpPath) {
            try {
                const ytDlp = new YTDlpWrap(await ytDlpPath);
                
                const options = [
                    '--no-playlist',
                    '--no-warnings',
                    '--no-check-certificate',
                    '--prefer-free-formats',
                    '--add-metadata',
                ];

                if (audioOnly) {
                    options.push(
                        '--extract-audio',
                        '--audio-format', 'mp3',
                        '--audio-quality', '0', // Best quality
                    );
                } else {
                    // Video download with specific quality
                    const formatString = quality === '4K' ? 'bestvideo[height<=2160]+bestaudio/best[height<=2160]'
                        : quality === '1080p' ? 'bestvideo[height<=1080]+bestaudio/best[height<=1080]'
                        : quality === '720p' ? 'bestvideo[height<=720]+bestaudio/best[height<=720]'
                        : quality === '480p' ? 'bestvideo[height<=480]+bestaudio/best[height<=480]'
                        : 'bestvideo[height<=360]+bestaudio/best[height<=360]';
                    
                    options.push(
                        '--format', formatString,
                        '--merge-output-format', format,
                    );
                }

                options.push('--output', outputPath);

                await ytDlp.execPromise([url, ...options]);

                console.log(`[YouTube Download] Success: ${outputPath}`);

            } catch (ytDlpError) {
                console.warn('[YouTube Download] yt-dlp failed, trying ytdl-core:', ytDlpError.message);
                
                // Fallback to ytdl-core
                const info = await ytdl.getInfo(url);
                let selectedFormat;

                if (audioOnly) {
                    selectedFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
                } else {
                    const qualityMap = {
                        '4K': 'highestvideo',
                        '1080p': 'highestvideo',
                        '720p': 'highestvideo',
                        '480p': 'highestvideo',
                        '360p': 'lowestvideo',
                    };
                    selectedFormat = ytdl.chooseFormat(info.formats, { quality: qualityMap[quality] || 'highestvideo' });
                }

                await new Promise((resolve, reject) => {
                    const stream = ytdl.downloadFromInfo(info, { format: selectedFormat });
                    const writeStream = fs.createWriteStream(outputPath);
                    
                    stream.pipe(writeStream);
                    
                    stream.on('error', reject);
                    writeStream.on('error', reject);
                    writeStream.on('finish', resolve);
                });

                console.log(`[YouTube Download] Success (ytdl-core): ${outputPath}`);
            }
        } else {
            // Only ytdl-core available
            const info = await ytdl.getInfo(url);
            let selectedFormat;

            if (audioOnly) {
                selectedFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
            } else {
                selectedFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
            }

            await new Promise((resolve, reject) => {
                const stream = ytdl.downloadFromInfo(info, { format: selectedFormat });
                const writeStream = fs.createWriteStream(outputPath);
                
                stream.pipe(writeStream);
                
                stream.on('error', reject);
                writeStream.on('error', reject);
                writeStream.on('finish', resolve);
            });

            console.log(`[YouTube Download] Success (ytdl-core): ${outputPath}`);
        }

        // Get file stats
        const stats = await fs.stat(outputPath);
        const filename = path.basename(outputPath);

        res.json({
            success: true,
            data: {
                filename,
                size: stats.size,
                downloadUrl: `/api/downloads/${filename}`,
                message: 'Video downloaded successfully',
            },
        });

    } catch (error) {
        console.error('[YouTube Download] Error:', error.message);
        
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

module.exports = router;
