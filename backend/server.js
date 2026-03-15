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

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, error: 'Too many requests, please try again later.' },
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
    });
};

startServer();

module.exports = app;
