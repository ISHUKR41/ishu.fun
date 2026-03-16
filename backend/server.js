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
    max: 2000,
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

    let redirectCount = 0;
    const MAX_REDIRECTS = 5;

    function doProxy(url) {
        const client = url.startsWith('https') ? https : http;
        const proxyReq = client.get(url, {
            headers: {
                'User-Agent': req.query.ua || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                ...(req.query.referer ? { 'Referer': req.query.referer } : {}),
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
                'Connection': 'keep-alive',
            },
            timeout: 15000,
        }, (proxyRes) => {
            // Follow redirects internally (up to MAX_REDIRECTS)
            if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
                redirectCount++;
                if (redirectCount > MAX_REDIRECTS) {
                    if (!res.headersSent) res.status(502).json({ error: 'Too many redirects' });
                    return;
                }
                const redirectUrl = new URL(proxyRes.headers.location, url).toString();
                proxyRes.resume(); // consume the body
                return doProxy(redirectUrl);
            }
            // For HLS .m3u8 manifests, rewrite internal URLs to go through proxy
            const contentType = proxyRes.headers['content-type'] || '';
            const isM3U = contentType.includes('mpegurl') || contentType.includes('x-mpegurl') ||
                          url.endsWith('.m3u8') || url.endsWith('.m3u');

            res.writeHead(proxyRes.statusCode || 200, {
                'Content-Type': isM3U ? 'application/vnd.apple.mpegurl' : (contentType || 'application/octet-stream'),
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Expose-Headers': 'Content-Length, Content-Type',
                'Cache-Control': 'no-cache, no-store',
                'X-Proxy-Status': 'ok',
            });
            proxyRes.pipe(res);
        });
        proxyReq.on('error', (err) => {
            console.error('[Stream Proxy] Error:', err.message, 'URL:', url.substring(0, 80));
            if (!res.headersSent) res.status(502).json({ error: 'Stream proxy error' });
        });
        proxyReq.on('timeout', () => {
            proxyReq.destroy();
            if (!res.headersSent) res.status(504).json({ error: 'Stream timeout' });
        });
        req.on('close', () => { proxyReq.destroy(); });
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
        }, 13 * 60 * 1000); // Every 13 minutes (Render sleeps after 15 min)
        console.log(`🔄 Keep-Alive: Self-ping every 13 minutes to prevent sleep`);
    });
};

startServer();

module.exports = app;
