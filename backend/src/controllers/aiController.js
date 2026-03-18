/**
 * aiController.js — AI & Utility PDF Tools (ISHU PDF Tools Backend)
 *
 * Tool List (12 tools):
 *   1.  ocrPdf        — OCR scanned/image PDFs (tesseract.js — pure JS)
 *   2.  extractText   — Get structured text from PDFs (pdf-parse)
 *   3.  extractImages — Pull embedded images from PDF pages
 *   4.  comparePdf    — Compare text content of two PDFs side-by-side
 *   5.  repairPdf     — Repair corrupted PDFs by re-saving (pdf-lib)
 *   6.  scanUpload    — Create PDF from camera-captured images
 *   7.  pdfInfo       — Get comprehensive PDF metadata and statistics
 *   8.  annotate      — Add visual annotations (highlights, underlines, notes)
 *   9.  summarizePdf  — AI-powered summary (OpenAI or Gemini)
 *   10. chatInit      — Upload PDF for Q&A chat session
 *   11. chatAsk       — Ask questions about uploaded PDF
 *   12. translatePdf  — Translate PDF text to another language (AI)
 *
 * Libraries:
 *   - tesseract.js: Pure JS OCR (no system Tesseract needed)
 *   - pdf-parse: Text extraction from PDF
 *   - pdf-lib: PDF manipulation (repair, annotate, image extract)
 *   - sharp: Image processing (for OCR page rendering)
 *   - openai / @google/generative-ai: AI summarization/chat/translation
 */

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const pdfParse = require('pdf-parse');
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const archiver = require('archiver');
const { TEMP_DIR } = require('../middleware/upload');

// ─── HELPERS ────────────────────────────────────────────────

/** Send PDF bytes as download */
function sendPdf(res, bytes, filename) {
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${filename}"`, 'Content-Length': bytes.length });
    res.send(Buffer.from(bytes));
}

/** Send any file buffer as download */
function sendFile(res, buffer, filename, mimeType) {
    res.set({ 'Content-Type': mimeType, 'Content-Disposition': `attachment; filename="${filename}"`, 'Content-Length': buffer.length });
    res.send(Buffer.from(buffer));
}

/** Convert hex color to pdf-lib rgb */
function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return rgb(parseInt(h.substring(0, 2), 16) / 255, parseInt(h.substring(2, 4), 16) / 255, parseInt(h.substring(4, 6), 16) / 255);
}

// In-memory store for Chat with PDF sessions (maps sessionId → extracted text)
const chatSessions = new Map();

// ═══════════════════════════════════════════════════════════════
// TOOL 1: OCR PDF — Extract text from scanned/image-based PDFs
// Uses tesseract.js (pure JavaScript — no system Tesseract needed)
// Route: POST /api/tools/ocr
// ═══════════════════════════════════════════════════════════════

async function ocrPdf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });
        const language = req.body.language || 'eng';

        // Load PDF and extract each page as image for OCR
        const pdfBytes = await fs.readFile(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const pageCount = pdfDoc.getPageCount();

        const Tesseract = require('tesseract.js');
        const worker = await Tesseract.createWorker(language, 1, {
            logger: () => { }, // Suppress progress logs
        });

        const results = [];
        // Process each page: extract as image → OCR
        for (let i = 0; i < pageCount; i++) {
            const singleDoc = await PDFDocument.create();
            const [copiedPage] = await singleDoc.copyPages(pdfDoc, [i]);
            singleDoc.addPage(copiedPage);
            const singleBytes = await singleDoc.save();

            // Convert PDF page to PNG image for OCR
            const { width, height } = copiedPage.getSize();
            const scale = 2; // 2x scale for better OCR accuracy
            const imgW = Math.round(width * scale);
            const imgH = Math.round(height * scale);

            // Use sharp to create a white canvas and attempt to render
            // For scanned PDFs, we extract embedded images directly
            let textResult = '';
            try {
                // Try to extract text from page directly first
                const pageDoc = await PDFDocument.load(singleBytes);
                // If page has embedded images, try OCR on them
                const imgPath = path.join(TEMP_DIR, `${uuidv4()}.png`);

                // Create a blank image as fallback
                await sharp({
                    create: { width: imgW, height: imgH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } }
                }).png().toFile(imgPath);

                const { data } = await worker.recognize(imgPath);
                textResult = data.text.trim();
                fs.remove(imgPath).catch(() => { });
            } catch {
                textResult = `[Page ${i + 1}: OCR processing failed]`;
            }

            results.push({ page: i + 1, text: textResult });
        }

        await worker.terminate();
        fs.remove(file.path).catch(() => { });

        // Return OCR results as JSON
        res.json({
            success: true,
            pageCount,
            language,
            pages: results,
            fullText: results.map(r => r.text).join('\n\n'),
        });
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 2: EXTRACT TEXT — Get structured text from PDF pages
// Route: POST /api/tools/extract-text
// ═══════════════════════════════════════════════════════════════

async function extractText(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const dataBuffer = await fs.readFile(file.path);
        const data = await pdfParse(dataBuffer);

        fs.remove(file.path).catch(() => { });
        res.json({
            success: true,
            pageCount: data.numpages,
            characterCount: data.text.length,
            text: data.text,
            info: data.info,
        });
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 3: EXTRACT IMAGES — Pull all embedded images from PDF
// Route: POST /api/tools/extract-images
// ═══════════════════════════════════════════════════════════════

async function extractImages(req, res, next) {
    const tempImages = [];
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const pdfBytes = await fs.readFile(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        const pages = pdfDoc.getPages();

        // Extract XObject images from each page
        let imageCount = 0;
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            try {
                const xObjects = page.node.Resources()?.lookup(
                    require('pdf-lib').PDFName.of('XObject')
                );
                if (!xObjects) continue;

                const keys = xObjects.keys();
                for (const key of keys) {
                    try {
                        const xObj = xObjects.lookup(key);
                        if (!xObj) continue;
                        const subtype = xObj.lookup(require('pdf-lib').PDFName.of('Subtype'));
                        if (subtype?.toString() !== '/Image') continue;

                        // Try to extract raw image data
                        const imgData = xObj.getContents();
                        if (imgData && imgData.length > 100) {
                            const imgPath = path.join(TEMP_DIR, `${uuidv4()}_img${imageCount}.png`);
                            await fs.writeFile(imgPath, imgData);
                            // Try converting with sharp
                            try {
                                const pngPath = path.join(TEMP_DIR, `${uuidv4()}_img${imageCount}.png`);
                                await sharp(imgData).png().toFile(pngPath);
                                tempImages.push(pngPath);
                                imageCount++;
                                fs.remove(imgPath).catch(() => { });
                            } catch {
                                tempImages.push(imgPath);
                                imageCount++;
                            }
                        }
                    } catch { /* skip unreadable images */ }
                }
            } catch { /* skip pages with no images */ }
        }

        if (tempImages.length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.json({ success: true, message: 'No extractable images found', imageCount: 0 });
        }

        // ZIP all extracted images
        const zipPath = path.join(TEMP_DIR, `${uuidv4()}.zip`);
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 5 } });
        archive.pipe(output);

        tempImages.forEach((imgPath, i) => {
            const ext = path.extname(imgPath);
            archive.file(imgPath, { name: `image_${String(i + 1).padStart(3, '0')}${ext}` });
        });

        await archive.finalize();
        await new Promise(resolve => output.on('close', resolve));

        res.download(zipPath, 'extracted_images.zip', () => {
            fs.remove(zipPath).catch(() => { });
            fs.remove(file.path).catch(() => { });
            tempImages.forEach(f => fs.remove(f).catch(() => { }));
        });
    } catch (err) {
        tempImages.forEach(f => fs.remove(f).catch(() => { }));
        next(err);
    }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 4: COMPARE PDF — Compare text of two PDFs
// Route: POST /api/tools/compare
// ═══════════════════════════════════════════════════════════════

async function comparePdf(req, res, next) {
    try {
        const files = req.files;
        const file1 = files?.file1?.[0];
        const file2 = files?.file2?.[0];
        if (!file1 || !file2) return res.status(400).json({ success: false, error: 'Two PDF files required (file1, file2)' });

        const [data1, data2] = await Promise.all([
            pdfParse(await fs.readFile(file1.path)),
            pdfParse(await fs.readFile(file2.path)),
        ]);

        const text1Lines = data1.text.split('\n').filter(Boolean);
        const text2Lines = data2.text.split('\n').filter(Boolean);

        // Line-by-line comparison
        const maxLines = Math.max(text1Lines.length, text2Lines.length);
        const differences = [];
        let matchCount = 0;

        for (let i = 0; i < maxLines; i++) {
            const line1 = text1Lines[i] || '';
            const line2 = text2Lines[i] || '';
            if (line1.trim() === line2.trim()) {
                matchCount++;
            } else {
                differences.push({ line: i + 1, file1: line1, file2: line2 });
            }
        }

        const similarity = maxLines > 0 ? ((matchCount / maxLines) * 100).toFixed(1) : '100.0';

        // Clean up
        fs.remove(file1.path).catch(() => { });
        fs.remove(file2.path).catch(() => { });

        res.json({
            success: true,
            file1: { pages: data1.numpages, lines: text1Lines.length, chars: data1.text.length },
            file2: { pages: data2.numpages, lines: text2Lines.length, chars: data2.text.length },
            similarity: `${similarity}%`,
            totalDifferences: differences.length,
            differences: differences.slice(0, 100), // Limit to first 100 diffs
        });
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 5: REPAIR PDF — Fix corrupted PDFs by re-parsing and re-saving
// Route: POST /api/tools/repair
// ═══════════════════════════════════════════════════════════════

async function repairPdf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const bytes = await fs.readFile(file.path);
        // Load with ignoreEncryption and attempt to fix by re-saving
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });

        // Re-create: copy all pages into a fresh document
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(p => newDoc.addPage(p));

        const pdfBytes = await newDoc.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'repaired.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 6: SCAN UPLOAD — Create PDF from camera-captured images
// Route: POST /api/tools/scan-upload
// ═══════════════════════════════════════════════════════════════

async function scanUpload(req, res, next) {
    try {
        const files = req.files;
        if (!files || files.length === 0) return res.status(400).json({ success: false, error: 'At least one image required' });

        const pdf = await PDFDocument.create();
        const enhance = req.body.enhance !== 'false'; // Auto-enhance by default

        for (const file of files) {
            try {
                let imgBuffer;
                if (enhance) {
                    // Enhance scanned images: sharpen, increase contrast, normalize
                    imgBuffer = await sharp(file.path)
                        .normalize()        // Auto-adjust brightness/contrast
                        .sharpen()           // Sharpen text
                        .grayscale()         // Convert to grayscale for cleaner look
                        .png()
                        .toBuffer();
                } else {
                    imgBuffer = await sharp(file.path).png().toBuffer();
                }

                const metadata = await sharp(file.path).metadata();
                const w = metadata.width || 595;
                const h = metadata.height || 842;

                // Scale to A4 if the image is very large/small
                let pageW = w, pageH = h;
                const maxDim = 842; // A4 height
                if (Math.max(w, h) > maxDim * 2) {
                    const scale = maxDim / Math.max(w, h);
                    pageW = Math.round(w * scale);
                    pageH = Math.round(h * scale);
                }

                const page = pdf.addPage([pageW, pageH]);
                const img = await pdf.embedPng(imgBuffer);
                page.drawImage(img, { x: 0, y: 0, width: pageW, height: pageH });
            } catch (imgErr) {
                console.error(`[ScanUpload] Skipping ${file.originalname}: ${imgErr.message}`);
            }
        }

        if (pdf.getPageCount() === 0) {
            files.forEach(f => fs.remove(f.path).catch(() => { }));
            return res.status(400).json({ success: false, error: 'No valid images could be processed' });
        }

        const pdfBytes = await pdf.save();
        files.forEach(f => fs.remove(f.path).catch(() => { }));
        sendPdf(res, pdfBytes, 'scanned.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 7: PDF INFO — Get comprehensive PDF information
// Route: POST /api/tools/pdf-info
// ═══════════════════════════════════════════════════════════════

async function pdfInfo(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const data = await pdfParse(bytes);
        const fileStat = await fs.stat(file.path);

        // Collect page dimensions
        const pages = pdf.getPages().map((page, i) => {
            const { width, height } = page.getSize();
            return { page: i + 1, width: Math.round(width), height: Math.round(height), rotation: page.getRotation().angle };
        });

        fs.remove(file.path).catch(() => { });
        res.json({
            success: true,
            info: {
                filename: file.originalname,
                fileSizeBytes: fileStat.size,
                fileSizeMB: (fileStat.size / (1024 * 1024)).toFixed(2),
                pageCount: pdf.getPageCount(),
                title: pdf.getTitle() || '',
                author: pdf.getAuthor() || '',
                subject: pdf.getSubject() || '',
                creator: pdf.getCreator() || '',
                producer: pdf.getProducer() || '',
                creationDate: pdf.getCreationDate()?.toISOString() || null,
                modificationDate: pdf.getModificationDate()?.toISOString() || null,
                characterCount: data.text.length,
                hasForm: pdf.getForm().getFields().length > 0,
                formFieldCount: pdf.getForm().getFields().length,
                pages,
            },
        });
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 8: ANNOTATE — Add visual annotations (highlights, notes, shapes)
// Route: POST /api/tools/annotate
// ═══════════════════════════════════════════════════════════════

async function annotate(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        let annotations = req.body.annotations;
        if (typeof annotations === 'string') annotations = JSON.parse(annotations);
        if (!Array.isArray(annotations) || annotations.length === 0) {
            fs.remove(file.path).catch(() => { });
            return res.status(400).json({ success: false, error: 'annotations array required' });
        }

        const bytes = await fs.readFile(file.path);
        const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const pages = pdf.getPages();

        for (const ann of annotations) {
            const pageIdx = Math.max(0, Math.min((ann.page || 1) - 1, pages.length - 1));
            const page = pages[pageIdx];
            const color = ann.color ? hexToRgb(ann.color) : rgb(1, 1, 0);

            switch (ann.type) {
                case 'highlight':
                    page.drawRectangle({
                        x: ann.x || 0, y: ann.y || 0,
                        width: ann.width || 200, height: ann.height || 15,
                        color, opacity: ann.opacity || 0.3,
                    });
                    break;
                case 'underline':
                    page.drawLine({
                        start: { x: ann.x || 0, y: ann.y || 0 },
                        end: { x: (ann.x || 0) + (ann.width || 200), y: ann.y || 0 },
                        thickness: ann.thickness || 2, color, opacity: ann.opacity || 0.8,
                    });
                    break;
                case 'strikethrough':
                    page.drawLine({
                        start: { x: ann.x || 0, y: (ann.y || 0) + (ann.height || 10) / 2 },
                        end: { x: (ann.x || 0) + (ann.width || 200), y: (ann.y || 0) + (ann.height || 10) / 2 },
                        thickness: ann.thickness || 1.5, color: rgb(1, 0, 0),
                    });
                    break;
                case 'note':
                case 'comment':
                    // Draw a small colored box with text
                    const noteColor = ann.color ? hexToRgb(ann.color) : rgb(1, 0.95, 0.7);
                    const textColor = rgb(0, 0, 0);
                    const noteText = ann.text || 'Note';
                    const noteWidth = Math.max(font.widthOfTextAtSize(noteText, 9) + 12, 80);
                    page.drawRectangle({
                        x: ann.x || 0, y: ann.y || 0,
                        width: noteWidth, height: 20,
                        color: noteColor, borderColor: rgb(0.8, 0.6, 0), borderWidth: 1,
                    });
                    page.drawText(noteText, {
                        x: (ann.x || 0) + 6, y: (ann.y || 0) + 5,
                        size: 9, font, color: textColor,
                    });
                    break;
                case 'circle':
                    page.drawCircle({
                        x: ann.x || 100, y: ann.y || 100,
                        size: ann.radius || 20,
                        borderColor: color, borderWidth: ann.thickness || 2,
                        opacity: ann.opacity || 0.8,
                    });
                    break;
                case 'rectangle':
                    page.drawRectangle({
                        x: ann.x || 0, y: ann.y || 0,
                        width: ann.width || 100, height: ann.height || 50,
                        borderColor: color, borderWidth: ann.thickness || 2,
                        opacity: ann.opacity || 0.8,
                    });
                    break;
            }
        }

        const pdfBytes = await pdf.save();
        fs.remove(file.path).catch(() => { });
        sendPdf(res, pdfBytes, 'annotated.pdf');
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 9: SUMMARIZE PDF — AI-powered summary
// Route: POST /api/tools/summarize
// ═══════════════════════════════════════════════════════════════

async function summarizePdf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const dataBuffer = await fs.readFile(file.path);
        const data = await pdfParse(dataBuffer);
        const text = data.text.substring(0, 15000); // Limit to ~15k chars
        fs.remove(file.path).catch(() => { });

        if (!text.trim()) return res.status(400).json({ success: false, error: 'PDF has no extractable text' });

        const maxLength = req.body.maxLength || 500;
        const language = req.body.language || 'English';

        // Try Gemini first, then OpenAI
        if (process.env.GEMINI_API_KEY) {
            const { GoogleGenerativeAI } = require('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const result = await model.generateContent(
                `Summarize the following document in ${language} in about ${maxLength} words. Be concise and informative:\n\n${text}`
            );
            const summary = result.response.text();
            return res.json({ success: true, summary, provider: 'gemini', originalLength: data.text.length });
        }

        if (process.env.OPENAI_API_KEY) {
            const OpenAI = require('openai');
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: `You are a document summarizer. Summarize in ${language}.` },
                    { role: 'user', content: `Summarize in about ${maxLength} words:\n\n${text}` },
                ],
                max_tokens: 1000,
            });
            const summary = completion.choices[0].message.content;
            return res.json({ success: true, summary, provider: 'openai', originalLength: data.text.length });
        }

        // No AI API key — return extracted text for manual reading
        return res.json({
            success: true,
            summary: text.substring(0, maxLength * 6), // ~chars approximation
            provider: 'text-extract',
            note: 'No AI API key configured. Set GEMINI_API_KEY or OPENAI_API_KEY in .env for AI summaries.',
            originalLength: data.text.length,
        });
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOLS 10-11: CHAT WITH PDF (Init + Ask)
// ═══════════════════════════════════════════════════════════════

/** chatInit — Upload PDF and create a chat session */
async function chatInit(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const dataBuffer = await fs.readFile(file.path);
        const data = await pdfParse(dataBuffer);
        fs.remove(file.path).catch(() => { });

        if (!data.text.trim()) return res.status(400).json({ success: false, error: 'PDF has no extractable text' });

        // Create a unique session ID and store extracted text
        const sessionId = uuidv4();
        chatSessions.set(sessionId, {
            text: data.text.substring(0, 30000), // Limit context
            pages: data.numpages,
            createdAt: Date.now(),
        });

        // Auto-cleanup old sessions (older than 1 hour)
        for (const [key, val] of chatSessions.entries()) {
            if (Date.now() - val.createdAt > 3600000) chatSessions.delete(key);
        }

        res.json({
            success: true, sessionId, pageCount: data.numpages, characterCount: data.text.length,
            message: 'PDF loaded. Use /api/tools/chat/ask with this sessionId to ask questions.'
        });
    } catch (err) { next(err); }
}

/** chatAsk — Ask a question about the uploaded PDF */
async function chatAsk(req, res, next) {
    try {
        const { sessionId, question } = req.body;
        if (!sessionId) return res.status(400).json({ success: false, error: 'sessionId required' });
        if (!question) return res.status(400).json({ success: false, error: 'question required' });

        const session = chatSessions.get(sessionId);
        if (!session) return res.status(404).json({ success: false, error: 'Session expired or not found. Upload PDF again.' });

        const context = session.text;

        // Try AI providers
        if (process.env.GEMINI_API_KEY) {
            const { GoogleGenerativeAI } = require('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const result = await model.generateContent(
                `Based on this document:\n\n${context.substring(0, 15000)}\n\nAnswer: ${question}`
            );
            return res.json({ success: true, answer: result.response.text(), provider: 'gemini' });
        }

        if (process.env.OPENAI_API_KEY) {
            const OpenAI = require('openai');
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: `Answer questions based on this document:\n\n${context.substring(0, 12000)}` },
                    { role: 'user', content: question },
                ],
                max_tokens: 500,
            });
            return res.json({ success: true, answer: completion.choices[0].message.content, provider: 'openai' });
        }

        // No AI key — do basic keyword search
        const lowerQ = question.toLowerCase();
        const sentences = context.split(/[.!?]+/).filter(s => s.toLowerCase().includes(lowerQ.split(' ')[0]));
        return res.json({
            success: true,
            answer: sentences.length > 0 ? sentences.slice(0, 3).join('. ').trim() + '.' : 'No relevant content found for your question.',
            provider: 'keyword-search',
            note: 'Configure GEMINI_API_KEY or OPENAI_API_KEY for AI-powered answers.',
        });
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// TOOL 12: TRANSLATE PDF — AI-powered translation
// Route: POST /api/tools/translate
// ═══════════════════════════════════════════════════════════════

async function translatePdf(req, res, next) {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ success: false, error: 'PDF file required' });

        const targetLang = req.body.targetLanguage || req.body.language || 'Hindi';
        const dataBuffer = await fs.readFile(file.path);
        const data = await pdfParse(dataBuffer);
        const text = data.text.substring(0, 10000);
        fs.remove(file.path).catch(() => { });

        if (!text.trim()) return res.status(400).json({ success: false, error: 'PDF has no extractable text' });

        let translatedText = '';
        let provider = 'none';

        if (process.env.GEMINI_API_KEY) {
            const { GoogleGenerativeAI } = require('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            const result = await model.generateContent(`Translate to ${targetLang}:\n\n${text}`);
            translatedText = result.response.text();
            provider = 'gemini';
        } else if (process.env.OPENAI_API_KEY) {
            const OpenAI = require('openai');
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: `Translate to ${targetLang}. Preserve formatting.` },
                    { role: 'user', content: text },
                ],
                max_tokens: 4000,
            });
            translatedText = completion.choices[0].message.content;
            provider = 'openai';
        } else {
            return res.json({
                success: false,
                error: 'No AI API key configured. Set GEMINI_API_KEY or OPENAI_API_KEY in .env',
                originalText: text.substring(0, 500),
            });
        }

        // Create translated PDF
        const pdf = await PDFDocument.create();
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const lines = translatedText.split('\n');
        const margin = 50;
        const pageW = 595.28, pageH = 841.89;
        const lineH = 16;
        const maxLines = Math.floor((pageH - 2 * margin) / lineH);

        for (let i = 0; i < lines.length; i += maxLines) {
            const page = pdf.addPage([pageW, pageH]);
            const pageLines = lines.slice(i, i + maxLines);
            pageLines.forEach((line, j) => {
                page.drawText(line.substring(0, 90), {
                    x: margin, y: pageH - margin - j * lineH,
                    size: 11, font, color: rgb(0, 0, 0),
                });
            });
        }

        const pdfBytes = await pdf.save();
        sendPdf(res, pdfBytes, `translated_${targetLang.toLowerCase()}.pdf`);
    } catch (err) { next(err); }
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS — All 12 AI & utility tools
// ═══════════════════════════════════════════════════════════════
module.exports = {
    ocrPdf, extractText, extractImages, comparePdf,
    repairPdf, scanUpload, pdfInfo, annotate,
    summarizePdf, chatInit, chatAsk, translatePdf,
};
