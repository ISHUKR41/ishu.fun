/**
 * server.js — ISHU PDF Tools Backend (Main Entry Point)
 *
 * Express server with:
 *   - CORS (configured for frontend URL)
 *   - Helmet (security headers)
 *   - Rate limiting (100 req/15min per IP)
 *   - Compression (gzip responses)
 *   - Morgan (request logging)
 *   - Multer file upload (in routes via middleware)
 *   - 5 route groups: Organize / Edit / Convert / Security / AI
 *   - Global error handler (catches multer errors, cleans temp files)
 *   - Automatic temp file cleanup (every 15 minutes)
 *   - Static file serving for temp downloads
 *
 * Total Tools: 106+
 *   Organize (9):   merge, split, organize, rearrange, rearrange-pages, rotate, delete-pages, extract-pages, crop
 *   Edit (11):      edit-pdf, add-text, add-image, watermark, page-numbers,
 *                   header-footer, sign-pdf, whiteout, fill-form, highlight, edit-text
 *   Convert (75+):  image/jpg/png/webp/bmp/gif/tiff/heic/djvu/ai/cad/dxf/dwg/chm → PDF,
 *                   txt/csv/md/xml/html/url/svg/eml/zip → PDF,
 *                   word/docx/doc/pptx/ppt/excel/xlsx/xls/odt/rtf/wps/hwp/xps → PDF,
 *                   epub/mobi/fb2/cbz/cbr/azw/azw3 → PDF,
 *                   PDF → txt/image/jpg/jpeg/png/tiff/bmp/html/svg → output,
 *                   PDF → word/docx/excel/xlsx/pptx/odt/rtf/epub/mobi/csv,
 *                   compress, grayscale, pdf-to-pdfa, create-pdf, resize-pages, universal
 *   Security (7):   remove-metadata, edit-metadata, get-metadata, flatten, protect, unlock, redact
 *   AI & Utils (12): ocr, extract-text, extract-images, compare, repair, scan-upload,
 *                    pdf-info, annotate, summarize, chat-init, chat-ask, translate
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const errorHandler = require('./src/middleware/errorHandler');
const { startCleanupSchedule } = require('./src/utils/cleanup');
const { connectDB } = require('./src/config/mongodb');

// ─── Route imports ──────────────────────────────────────────
const organizeRoutes = require('./src/routes/organizeRoutes');
const editRoutes = require('./src/routes/editRoutes');
const convertRoutes = require('./src/routes/convertRoutes');
const securityRoutes = require('./src/routes/securityRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const videoRoutes = require('./src/routes/videoRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ──────────────────────────────────────────────

// CORS — Allow requests from multiple local dev origins + production
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    'http://localhost:8080',
    'https://ishu.fun',
    'https://www.ishu.fun',
];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(null, true); // Allow all in dev — tighten for production
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Clerk-Auth', 'User-Agent'],
    exposedHeaders: ['X-Original-Size', 'X-Compressed-Size'],
    credentials: true,
}));

// Security headers (Helmet)
app.use(helmet());

// Gzip compression for all responses
app.use(compression());

// HTTP request logging
app.use(morgan('dev'));

// Body parser — 50 MB limit for JSON body (base64 signatures, large form data)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ─── STREAM PROXY (registered BEFORE global rate limiter) ───
// This must come before the general rate limiter so it uses its own limit
const http = require('http');
const https = require('https');

const streamLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10000,
    message: { success: false, error: 'Stream rate limit exceeded' },
});

app.options('/api/stream-proxy', (req, res) => {
    res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
    });
    res.end();
});

// Stream health check — quick HEAD/GET to verify a stream is alive
app.get('/api/stream-check', streamLimiter, (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).json({ ok: false, error: 'Missing url' });
    try {
        const parsed = new URL(targetUrl);
        if (!['http:', 'https:'].includes(parsed.protocol))
            return res.status(400).json({ ok: false, error: 'Invalid protocol' });
    } catch { return res.status(400).json({ ok: false, error: 'Invalid URL' }); }

    const client = targetUrl.startsWith('https') ? https : http;
    const startMs = Date.now();
    let redirects = 0;

    function checkUrl(url) {
        const proxyReq = client.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': '*/*',
            },
            timeout: 8000,
        }, (proxyRes) => {
            proxyRes.destroy(); // Don't download body
            if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
                if (++redirects > 5) return res.json({ ok: false, error: 'Too many redirects', ms: Date.now() - startMs });
                return checkUrl(new URL(proxyRes.headers.location, url).toString());
            }
            const ok = proxyRes.statusCode >= 200 && proxyRes.statusCode < 400;
            res.json({ ok, status: proxyRes.statusCode, ms: Date.now() - startMs, contentType: proxyRes.headers['content-type'] || '' });
        });
        proxyReq.on('error', () => res.json({ ok: false, error: 'Connection failed', ms: Date.now() - startMs }));
        proxyReq.on('timeout', () => { proxyReq.destroy(); res.json({ ok: false, error: 'Timeout', ms: Date.now() - startMs }); });
    }
    checkUrl(targetUrl);
});

app.get('/api/stream-proxy', streamLimiter, (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }
    try {
        const parsed = new URL(targetUrl);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return res.status(400).json({ error: 'Invalid protocol' });
        }
    } catch {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    function resolveUrl(ref, base) {
        if (/^https?:\/\//i.test(ref)) return ref;
        try { return new URL(ref, base).toString(); } catch { return ref; }
    }

    function getBaseUrl(fullUrl) {
        const idx = fullUrl.lastIndexOf('/');
        return idx > 8 ? fullUrl.substring(0, idx + 1) : fullUrl;
    }

    function rewriteM3U8(body, originalUrl) {
        const base = getBaseUrl(originalUrl);
        return body.split('\n').map(line => {
            const trimmed = line.trim();
            if (!trimmed) return line;
            if (trimmed.startsWith('#')) {
                // Rewrite URI= attributes (key files, map segments, etc.)
                let rewritten = line.replace(/URI="([^"]+)"/gi, (match, uri) => {
                    return `URI="${resolveUrl(uri, base)}"`;
                });
                // Rewrite EXT-X-MAP URI
                rewritten = rewritten.replace(/EXT-X-MAP:URI="([^"]+)"/gi, (match, uri) => {
                    return `EXT-X-MAP:URI="${resolveUrl(uri, base)}"`;
                });
                return rewritten;
            }
            // Non-comment, non-empty lines are segment/playlist URLs
            return resolveUrl(trimmed, base);
        }).join('\n');
    }

    let redirectCount = 0;
    const MAX_REDIRECTS = 8;
    let finished = false;

    function doProxy(url, retryCount = 0) {
        if (finished) return;
        const isHttps = url.startsWith('https');
        const client = isHttps ? https : http;

        // Determine referer from URL domain
        let referer = req.query.referer || '';
        if (!referer) {
            try { referer = new URL(url).origin; } catch {}
        }

        const proxyReq = client.get(url, {
            headers: {
                'User-Agent': req.query.ua || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Referer': referer,
                'Origin': referer,
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
            },
            timeout: 30000,
            ...(isHttps ? { rejectUnauthorized: false } : {}),
        }, (proxyRes) => {
            if (finished) { proxyRes.destroy(); return; }

            if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
                redirectCount++;
                if (redirectCount > MAX_REDIRECTS) {
                    if (!res.headersSent) res.status(502).json({ error: 'Too many redirects' });
                    finished = true;
                    return;
                }
                const redirectUrl = new URL(proxyRes.headers.location, url).toString();
                proxyRes.resume();
                return doProxy(redirectUrl, retryCount);
            }

            // Handle server errors with retry
            if (proxyRes.statusCode >= 500 && retryCount < 2) {
                proxyRes.resume();
                setTimeout(() => doProxy(url, retryCount + 1), 500);
                return;
            }

            const contentType = proxyRes.headers['content-type'] || '';
            const isM3U = contentType.includes('mpegurl') || contentType.includes('x-mpegurl') ||
                          url.endsWith('.m3u8') || url.endsWith('.m3u');

            const corsHeaders = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Expose-Headers': 'Content-Length, Content-Type',
                'Cache-Control': 'no-cache, no-store',
                'X-Proxy-Status': 'ok',
            };

            if (isM3U) {
                const chunks = [];
                proxyRes.on('data', chunk => chunks.push(chunk));
                proxyRes.on('end', () => {
                    if (finished) return;
                    const body = Buffer.concat(chunks).toString('utf8');
                    const rewritten = rewriteM3U8(body, url);
                    if (!res.headersSent) {
                        res.writeHead(proxyRes.statusCode || 200, {
                            'Content-Type': 'application/vnd.apple.mpegurl',
                            ...corsHeaders,
                        });
                        res.end(rewritten);
                    }
                    finished = true;
                });
                proxyRes.on('error', () => {
                    if (!finished && !res.headersSent) res.status(502).json({ error: 'Stream read error' });
                    finished = true;
                });
            } else {
                if (!res.headersSent) {
                    res.writeHead(proxyRes.statusCode || 200, {
                        'Content-Type': contentType || 'application/octet-stream',
                        ...(proxyRes.headers['content-length'] ? { 'Content-Length': proxyRes.headers['content-length'] } : {}),
                        ...corsHeaders,
                    });
                }
                proxyRes.pipe(res);
                proxyRes.on('error', () => { if (!res.writableEnded) res.end(); finished = true; });
                res.on('finish', () => { finished = true; });
            }
        });
        proxyReq.on('error', (err) => {
            if (finished) return;
            console.error('[Stream Proxy] Error:', err.code || err.message, 'URL:', url.substring(0, 100));
            if (retryCount < 3 && ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'ENOTFOUND', 'EHOSTUNREACH', 'EPIPE', 'ERR_TLS_CERT_ALTNAME_INVALID', 'EAI_AGAIN', 'ECONNABORTED'].includes(err.code)) {
                setTimeout(() => doProxy(url, retryCount + 1), 300 * (retryCount + 1));
                return;
            }
            if (!res.headersSent) res.status(502).json({ error: 'Stream proxy error' });
            finished = true;
        });
        proxyReq.on('timeout', () => {
            proxyReq.destroy();
            if (finished) return;
            if (retryCount < 2) {
                setTimeout(() => doProxy(url, retryCount + 1), 200);
                return;
            }
            if (!res.headersSent) res.status(504).json({ error: 'Stream timeout' });
            finished = true;
        });
        req.on('close', () => { finished = true; proxyReq.destroy(); });
    }

    doProxy(targetUrl);
});

// Rate limiting — 500 requests per 15 minutes per IP (increased for TV streaming)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: { success: false, error: 'Too many requests, please try again later.' },
    skip: (req) => req.path === '/api/stream-proxy' || req.path === '/api/wake',
});
app.use('/api/', limiter);

// ─── STATIC FILES ───────────────────────────────────────────

// Serve temp directory for file downloads
app.use('/api/downloads', express.static(path.resolve(process.env.TEMP_DIR || './temp')));

// ─── ROUTES ─────────────────────────────────────────────────

// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        toolGroups: {
            organize: 9,
            edit: 11,
            convert: 77,
            security: 7,
            ai: 12,
            total: 116,
        },
    });
});

// Lightweight wake endpoint (frontend pings this on load)
app.get('/api/wake', (_req, res) => {
    res.json({ ok: true, ts: Date.now() });
});

// Mount all tool route groups under /api/tools
app.use('/api/tools', organizeRoutes);
app.use('/api/tools', editRoutes);
app.use('/api/tools', convertRoutes);
app.use('/api/tools', securityRoutes);
app.use('/api/tools', aiRoutes);
app.use('/api/tools', videoRoutes);

// User profile & settings routes (requires MongoDB)
app.use('/api/user', userRoutes);

// ─── ERROR HANDLER ──────────────────────────────────────────
app.use(errorHandler);

// ─── START ──────────────────────────────────────────────────
const startServer = async () => {
    // Connect to MongoDB (non-blocking — PDF tools work without it)
    await connectDB();

    app.listen(PORT, () => {
        console.log(`\n🚀 ISHU Backend running on http://localhost:${PORT}`);
        console.log(`📋 Health: http://localhost:${PORT}/api/health`);
        console.log(`🔧 Tools:  http://localhost:${PORT}/api/tools/*`);
        console.log(`👤 User:   http://localhost:${PORT}/api/user/*`);
        console.log(`🖥️  Frontend: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
        console.log(`\n📊 Tool Groups:`);
        console.log(`   Organize:  9 tools  (merge, split, rotate, crop, rearrange, etc.)`);
        console.log(`   Edit:      11 tools (watermark, sign, highlight, edit-text, etc.)`);
        console.log(`   Convert:   77 tools (77+ format conversions with full aliases)`);
        console.log(`   Security:  7 tools  (protect, unlock, redact, metadata, etc.)`);
        console.log(`   AI/Utils:  12 tools (ocr, summarize, chat, compare, etc.)`);
        console.log(`   User API:  6 routes (profile, stats, preferences, sync)`);
        console.log(`   TOTAL:     122+ endpoints\n`);

        // Start automatic temp file cleanup scheduler
        startCleanupSchedule();

        // ── Self-ping keep-alive (prevents Render free tier from sleeping) ──
        const SELF_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
        setInterval(async () => {
            try {
                const https = require('https');
                const http = require('http');
                const client = SELF_URL.startsWith('https') ? https : http;
                client.get(`${SELF_URL}/api/wake`, (res) => {
                    res.resume();
                    console.log(`[Keep-Alive] ✅ Pinged ${SELF_URL}/api/wake at ${new Date().toISOString()}`);
                }).on('error', (e) => {
                    console.log(`[Keep-Alive] ⚠️ Ping failed: ${e.message}`);
                });
            } catch (e) {
                console.log(`[Keep-Alive] ⚠️ Error: ${e.message}`);
            }
        }, 10 * 60 * 1000); // Every 10 minutes (Render sleeps after 15 min)
        console.log(`🔄 Keep-Alive: Self-ping every 10 minutes to prevent sleep`);
    });
};

startServer();

module.exports = app;
