/**
 * teraboxRoutes.js - Terabox File Downloader API
 * 
 * Features:
 * - Extract direct download links from Terabox share URLs
 * - Preview file information
 * - Support for videos, images, documents
 * - Progress tracking
 * 
 * Terabox URL formats:
 * - https://terabox.com/s/xxxxx
 * - https://www.terabox.com/sharing/link?surl=xxxxx
 * - https://1024terabox.com/s/xxxxx
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TEMP_DIR = process.env.TEMP_DIR || path.join(__dirname, '../../../temp');

/**
 * Extract Terabox file information
 */
async function extractTeraboxInfo(url) {
    try {
        // Normalize URL
        let shareUrl = url;
        if (url.includes('surl=')) {
            const match = url.match(/surl=([^&]+)/);
            if (match) {
                shareUrl = `https://www.terabox.com/s/1${match[1]}`;
            }
        }

        console.log(`[Terabox] Fetching info from: ${shareUrl}`);

        // Fetch the share page
        const response = await axios.get(shareUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Referer': 'https://www.terabox.com/',
            },
            timeout: 15000,
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Extract file information from page data
        // Terabox embeds file info in JavaScript variables
        const scriptContent = $('script').text();
        
        // Try to extract file info from window.locals or similar
        let fileInfo = null;
        
        // Method 1: Extract from window.locals
        const localsMatch = scriptContent.match(/window\.locals\s*=\s*({[\s\S]*?});/);
        if (localsMatch) {
            try {
                const localsData = JSON.parse(localsMatch[1]);
                if (localsData.file_list && localsData.file_list.length > 0) {
                    const file = localsData.file_list[0];
                    fileInfo = {
                        filename: file.server_filename || file.filename,
                        size: file.size,
                        fileType: file.category,
                        thumbnail: file.thumbs?.url3 || file.thumbs?.url2 || file.thumbs?.url1,
                        downloadUrl: file.dlink,
                        fsId: file.fs_id,
                    };
                }
            } catch (e) {
                console.warn('[Terabox] Failed to parse locals data:', e.message);
            }
        }

        // Method 2: Extract from yunData
        if (!fileInfo) {
            const yunDataMatch = scriptContent.match(/yunData\.setData\(({[\s\S]*?})\)/);
            if (yunDataMatch) {
                try {
                    const yunData = JSON.parse(yunDataMatch[1]);
                    if (yunData.file_list && yunData.file_list.length > 0) {
                        const file = yunData.file_list[0];
                        fileInfo = {
                            filename: file.server_filename || file.filename,
                            size: file.size,
                            fileType: file.category,
                            thumbnail: file.thumbs?.url3 || file.thumbs?.url2 || file.thumbs?.url1,
                            downloadUrl: file.dlink,
                            fsId: file.fs_id,
                        };
                    }
                } catch (e) {
                    console.warn('[Terabox] Failed to parse yunData:', e.message);
                }
            }
        }

        // Method 3: Try API endpoint (if available)
        if (!fileInfo) {
            // Extract shorturl from the page
            const shorturlMatch = shareUrl.match(/\/s\/1([A-Za-z0-9_-]+)/);
            if (shorturlMatch) {
                const shorturl = shorturlMatch[1];
                try {
                    const apiUrl = `https://www.terabox.com/share/list?shorturl=${shorturl}&root=1`;
                    const apiResponse = await axios.get(apiUrl, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Referer': shareUrl,
                        },
                        timeout: 10000,
                    });

                    if (apiResponse.data && apiResponse.data.list && apiResponse.data.list.length > 0) {
                        const file = apiResponse.data.list[0];
                        fileInfo = {
                            filename: file.server_filename || file.filename,
                            size: file.size,
                            fileType: file.category,
                            thumbnail: file.thumbs?.url3 || file.thumbs?.url2 || file.thumbs?.url1,
                            downloadUrl: file.dlink,
                            fsId: file.fs_id,
                        };
                    }
                } catch (apiError) {
                    console.warn('[Terabox] API request failed:', apiError.message);
                }
            }
        }

        if (!fileInfo) {
            throw new Error('Could not extract file information from Terabox page');
        }

        return fileInfo;

    } catch (error) {
        console.error('[Terabox] Extraction error:', error.message);
        throw error;
    }
}

/**
 * GET /api/tools/terabox-info
 * Extract file information without downloading
 */
router.get('/terabox-info', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ success: false, error: 'URL is required' });
        }

        // Validate Terabox URL
        if (!url.includes('terabox.com') && !url.includes('1024terabox.com')) {
            return res.status(400).json({ success: false, error: 'Invalid Terabox URL' });
        }

        console.log(`[Terabox Info] Fetching info for: ${url}`);

        const fileInfo = await extractTeraboxInfo(url);

        res.json({ 
            success: true, 
            data: {
                filename: fileInfo.filename,
                size: fileInfo.size,
                sizeFormatted: formatBytes(fileInfo.size),
                fileType: fileInfo.fileType,
                thumbnail: fileInfo.thumbnail,
                canDownload: !!fileInfo.downloadUrl,
            }
        });

    } catch (error) {
        console.error('[Terabox Info] Error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch file information',
            details: error.message 
        });
    }
});

/**
 * POST /api/tools/terabox-download
 * Download file from Terabox
 */
router.post('/terabox-download', async (req, res) => {
    let outputPath = null;
    
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ success: false, error: 'URL is required' });
        }

        if (!url.includes('terabox.com') && !url.includes('1024terabox.com')) {
            return res.status(400).json({ success: false, error: 'Invalid Terabox URL' });
        }

        console.log(`[Terabox Download] Starting download: ${url}`);

        // Extract file info
        const fileInfo = await extractTeraboxInfo(url);

        if (!fileInfo.downloadUrl) {
            return res.status(400).json({ 
                success: false, 
                error: 'Direct download link not available. File may require authentication.' 
            });
        }

        // Ensure temp directory exists
        await fs.ensureDir(TEMP_DIR);

        // Generate output path
        const fileId = uuidv4();
        const ext = path.extname(fileInfo.filename) || '.bin';
        const safeFilename = `terabox_${fileId}${ext}`;
        outputPath = path.join(TEMP_DIR, safeFilename);

        // Download the file
        const downloadResponse = await axios({
            method: 'GET',
            url: fileInfo.downloadUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': url,
            },
            timeout: 120000, // 2 minutes
        });

        // Pipe to file
        const writer = fs.createWriteStream(outputPath);
        downloadResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
            downloadResponse.data.on('error', reject);
        });

        console.log(`[Terabox Download] Success: ${outputPath}`);

        // Get file stats
        const stats = await fs.stat(outputPath);

        res.json({
            success: true,
            data: {
                filename: safeFilename,
                originalFilename: fileInfo.filename,
                size: stats.size,
                downloadUrl: `/api/downloads/${safeFilename}`,
                message: 'File downloaded successfully',
            },
        });

    } catch (error) {
        console.error('[Terabox Download] Error:', error.message);
        
        // Cleanup on error
        if (outputPath && await fs.pathExists(outputPath)) {
            await fs.remove(outputPath).catch(() => {});
        }

        res.status(500).json({ 
            success: false, 
            error: 'Failed to download file',
            details: error.message 
        });
    }
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
