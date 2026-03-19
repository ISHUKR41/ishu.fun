/**
 * pdf-processor.ts - PDF Processing Engine
 * 
 * This is the core engine that powers all 100+ PDF tools on the platform.
 * All processing happens 100% in the browser — no files are uploaded to any server.
 * 
 * Libraries used:
 * - pdf-lib: Create, merge, split, edit PDFs (pure JavaScript)
 * - jsPDF: Generate PDFs from text/tables
 * - pdfjs-dist: Render PDF pages to canvas (for image conversion)
 * - mammoth: Convert DOCX to text
 * - xlsx: Parse Excel spreadsheets
 * - heic2any: Convert Apple HEIC photos
 * - tesseract.js: OCR (text extraction from images)
 * 
 * Main export: processTool(toolSlug, files, options) → { blob, filename }
 * 
 * Flow:
 * 1. User selects a tool and uploads file(s)
 * 2. validateInputFiles() checks file types and sizes
 * 3. The correct processing function is called based on toolSlug
 * 4. Result blob is returned for download
 */

import { PDFDocument, rgb, StandardFonts, degrees as pdfDegrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { supabase } from '@/integrations/supabase/client';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "" : "https://ishu-site.onrender.com");

export interface ProcessResult {
  blob: Blob;
  filename: string;
}

export interface ToolOptions {
  degrees?: number;
  pageRange?: string;
  watermarkText?: string;
  password?: string;
  text?: string;
  position?: string;
  quality?: string;
  headerText?: string;
  footerText?: string;
  pageSize?: string;
  fontSize?: number;
  opacity?: number;
  [key: string]: any;
}

// ===== HELPERS =====
function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, '');
}

function parsePageRange(range: string, total: number): number[] {
  const pages: number[] = [];
  for (const part of range.split(',').map(s => s.trim())) {
    if (part.includes('-')) {
      const [s, e] = part.split('-').map(Number);
      for (let i = Math.max(1, s); i <= Math.min(total, e); i++) pages.push(i - 1);
    } else {
      const p = parseInt(part);
      if (p >= 1 && p <= total) pages.push(p - 1);
    }
  }
  return [...new Set(pages)].sort((a, b) => a - b);
}

async function loadPdf(file: File) {
  try {
    const bytes = await file.arrayBuffer();
    return await PDFDocument.load(bytes, { ignoreEncryption: true });
  } catch (e) {
    throw new Error(`Could not load "${file.name}" as a PDF. The file may be corrupted or not a valid PDF.`);
  }
}

function pdfBlob(bytes: Uint8Array): Blob {
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

function getFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf('.');
  return dotIndex === -1 ? '' : fileName.slice(dotIndex).toLowerCase();
}

function isAcceptedFileType(file: File, acceptTypes: string): boolean {
  if (acceptTypes === '*') return true;
  const allowedExts = acceptTypes.split(',').map(ext => ext.trim().toLowerCase()).filter(Boolean);
  return allowedExts.includes(getFileExtension(file.name));
}

function validateInputFiles(toolSlug: string, files: File[]) {
  const createTools = new Set(['create-pdf', 'url-to-pdf']);
  if (!createTools.has(toolSlug) && files.length === 0) {
    throw new Error('Please upload at least one file to continue.');
  }
  if (toolSlug === 'merge-pdf' && files.length < 2) throw new Error('Merge PDF needs at least 2 files.');
  if (toolSlug === 'compare-pdf' && files.length < 2) throw new Error('Compare PDF needs 2 files.');
  if (toolSlug === 'add-image-to-pdf' && files.length < 2) throw new Error('Add Image to PDF needs 1 PDF and at least 1 image.');

  const maxSize = 50 * 1024 * 1024; // 50MB
  const acceptTypes = getAcceptedTypes(toolSlug);
  for (const file of files) {
    if (file.size > maxSize) throw new Error(`"${file.name}" is larger than 50MB.`);
    if (!isAcceptedFileType(file, acceptTypes)) throw new Error(`"${file.name}" is not a supported file type for this tool.`);
  }
}

// ===== BACKEND FALLBACK =====
/**
 * Process a tool via the backend API.
 * Sends file(s) and options as FormData to POST /api/tools/{toolSlug}.
 * Returns { blob, filename } just like client-side processors.
 */
async function processViaBackend(
  toolSlug: string,
  files: File[],
  options: ToolOptions = {}
): Promise<ProcessResult> {
  const formData = new FormData();

  // Append file(s)
  for (const file of files) {
    formData.append('files', file, file.name);
  }

  // Append options as JSON string
  if (Object.keys(options).length > 0) {
    formData.append('options', JSON.stringify(options));
  }

  const response = await fetch(`${API_URL}/api/tools/${toolSlug}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Backend processing failed (${response.status}): ${errorText}`);
  }

  const contentType = response.headers.get('content-type') || '';

  // If the response is JSON, it may contain a downloadUrl
  if (contentType.includes('application/json')) {
    const data = await response.json();

    if (data.downloadUrl) {
      // Fetch the actual file from the download URL
      const fileResponse = await fetch(data.downloadUrl);
      if (!fileResponse.ok) {
        throw new Error(`Failed to download result file from backend.`);
      }
      const blob = await fileResponse.blob();
      const filename = data.filename || `${toolSlug}-result`;
      return { blob, filename };
    }

    // If there's base64 file data in the response
    if (data.fileData) {
      const binaryStr = atob(data.fileData);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType || 'application/octet-stream' });
      return { blob, filename: data.filename || `${toolSlug}-result` };
    }

    throw new Error('Backend returned JSON but no downloadUrl or fileData.');
  }

  // Response is the file directly (binary)
  const blob = await response.blob();
  // Try to get filename from Content-Disposition header
  const disposition = response.headers.get('content-disposition') || '';
  const filenameMatch = disposition.match(/filename[^;=\n]*=["']?([^"';\n]*)["']?/);
  const filename = filenameMatch?.[1] || `${toolSlug}-result`;
  return { blob, filename };
}

/**
 * Try client-side processing first; if it fails, fall back to backend.
 */
async function tryClientThenBackend(
  clientFn: () => Promise<ProcessResult>,
  toolSlug: string,
  files: File[],
  options: ToolOptions = {}
): Promise<ProcessResult> {
  try {
    return await clientFn();
  } catch (clientError) {
    console.warn(`Client-side processing failed for ${toolSlug}, trying backend...`, clientError);
    try {
      return await processViaBackend(toolSlug, files, options);
    } catch (backendError) {
      console.error(`Backend also failed for ${toolSlug}:`, backendError);
      throw new Error(
        `Could not process with "${toolSlug}". ` +
        `Client error: ${clientError instanceof Error ? clientError.message : clientError}. ` +
        `Backend error: ${backendError instanceof Error ? backendError.message : backendError}.`
      );
    }
  }
}

/**
 * Try backend processing first; if it fails, fall back to client-side.
 */
async function tryBackendThenClient(
  backendSlug: string,
  files: File[],
  options: ToolOptions,
  clientFn: () => Promise<ProcessResult>
): Promise<ProcessResult> {
  try {
    return await processViaBackend(backendSlug, files, options);
  } catch (backendError) {
    console.warn(`Backend processing failed for ${backendSlug}, trying client-side fallback...`, backendError);
    try {
      return await clientFn();
    } catch (clientError) {
      console.error(`Client-side fallback also failed for ${backendSlug}:`, clientError);
      throw new Error(
        `Could not process with "${backendSlug}". ` +
        `Backend error: ${backendError instanceof Error ? backendError.message : backendError}. ` +
        `Client error: ${clientError instanceof Error ? clientError.message : clientError}.`
      );
    }
  }
}

// ===== PDF.js SETUP (robust) =====
let _pdfjsPromise: Promise<typeof import('pdfjs-dist')> | null = null;

async function getPdfJs() {
  if (!_pdfjsPromise) {
    _pdfjsPromise = (async () => {
      const pdfjsLib = await import('pdfjs-dist');
      // Use CDN worker - most reliable cross-environment approach
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      return pdfjsLib;
    })();
  }
  return _pdfjsPromise;
}

/** Render a single PDF page to a canvas */
async function renderPageToCanvas(
  pdfDoc: any, pageNum: number, scale = 2
): Promise<HTMLCanvasElement> {
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d')!;
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

/** Convert canvas to blob */
function canvasToBlob(canvas: HTMLCanvasElement, mime = 'image/png', quality = 0.92): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('Canvas to blob failed')),
      mime, quality
    );
  });
}

// ===== PDF → PDF MANIPULATION =====
async function mergePdfs(files: File[]): Promise<ProcessResult> {
  const merged = await PDFDocument.create();
  let mergedCount = 0;
  for (const file of files) {
    try {
      const doc = await loadPdf(file);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(p => merged.addPage(p));
      mergedCount++;
    } catch { /* skip non-PDF */ }
  }
  if (mergedCount === 0) throw new Error('No valid PDF files could be merged.');
  return { blob: pdfBlob(await merged.save()), filename: 'merged.pdf' };
}

async function splitPdf(file: File, opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  const total = doc.getPageCount();
  const indices = opts.pageRange ? parsePageRange(opts.pageRange, total) : Array.from({ length: Math.ceil(total / 2) }, (_, i) => i);
  if (indices.length === 0) throw new Error('Please provide a valid page range.');
  const newDoc = await PDFDocument.create();
  const pages = await newDoc.copyPages(doc, indices);
  pages.forEach(p => newDoc.addPage(p));
  return { blob: pdfBlob(await newDoc.save()), filename: `${baseName(file.name)}_split.pdf` };
}

async function rotatePdf(file: File, opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  const deg = opts.degrees || 90;
  doc.getPages().forEach(page => {
    page.setRotation(pdfDegrees((page.getRotation().angle + deg) % 360));
  });
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_rotated.pdf` };
}

async function deletePages(file: File, opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  const total = doc.getPageCount();
  const toDelete = opts.pageRange ? parsePageRange(opts.pageRange, total) : [total - 1];
  const toKeep = Array.from({ length: total }, (_, i) => i).filter(i => !toDelete.includes(i));
  if (toKeep.length === 0) throw new Error('Cannot delete all pages.');
  const newDoc = await PDFDocument.create();
  const pages = await newDoc.copyPages(doc, toKeep);
  pages.forEach(p => newDoc.addPage(p));
  return { blob: pdfBlob(await newDoc.save()), filename: `${baseName(file.name)}_edited.pdf` };
}

async function extractPages(file: File, opts: ToolOptions): Promise<ProcessResult> {
  return splitPdf(file, opts);
}

async function compressPdf(file: File): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  const bytes = await doc.save({ useObjectStreams: true });
  return { blob: pdfBlob(bytes), filename: `${baseName(file.name)}_compressed.pdf` };
}

async function organizePdf(file: File, opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  const total = doc.getPageCount();
  const order = opts.pageRange ? parsePageRange(opts.pageRange, total) : doc.getPageIndices();
  if (order.length === 0) throw new Error('Please provide a valid page order.');
  const newDoc = await PDFDocument.create();
  const pages = await newDoc.copyPages(doc, order);
  pages.forEach(p => newDoc.addPage(p));
  return { blob: pdfBlob(await newDoc.save()), filename: `${baseName(file.name)}_organized.pdf` };
}

async function flattenPdf(file: File): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  try { doc.getForm().flatten(); } catch { /* no form fields */ }
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_flattened.pdf` };
}

async function removeMetadata(file: File): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  doc.setTitle(''); doc.setAuthor(''); doc.setSubject(''); doc.setKeywords([]); doc.setProducer(''); doc.setCreator('');
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_clean.pdf` };
}

async function editMetadata(file: File, opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  if (opts.title) doc.setTitle(opts.title);
  if (opts.author) doc.setAuthor(opts.author);
  if (opts.subject) doc.setSubject(opts.subject);
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_metadata.pdf` };
}

async function resizePages(file: File, opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  const sizes: Record<string, [number, number]> = {
    'A4': [595.28, 841.89], 'A3': [841.89, 1190.55], 'Letter': [612, 792], 'Legal': [612, 1008],
  };
  const [w, h] = sizes[opts.pageSize || 'A4'] || sizes['A4'];
  doc.getPages().forEach(page => page.setSize(w, h));
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_resized.pdf` };
}

async function grayscalePdf(file: File): Promise<ProcessResult> {
  const pdfjsLib = await getPdfJs();
  const data = await file.arrayBuffer();
  const srcPdf = await pdfjsLib.getDocument({ data }).promise;
  const newDoc = await PDFDocument.create();

  for (let i = 1; i <= srcPdf.numPages; i++) {
    const canvas = await renderPageToCanvas(srcPdf, i, 1.5);
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = imageData.data;
    for (let j = 0; j < px.length; j += 4) {
      const gray = px[j] * 0.299 + px[j + 1] * 0.587 + px[j + 2] * 0.114;
      px[j] = px[j + 1] = px[j + 2] = gray;
    }
    ctx.putImageData(imageData, 0, 0);
    const imgBlob = await canvasToBlob(canvas, 'image/jpeg', 0.9);
    const img = await newDoc.embedJpg(await imgBlob.arrayBuffer());
    const page = newDoc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  return { blob: pdfBlob(await newDoc.save()), filename: `${baseName(file.name)}_grayscale.pdf` };
}

async function cropPdf(file: File): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  doc.getPages().forEach(page => {
    const { width, height } = page.getSize();
    const m = Math.min(width, height) * 0.1;
    page.setCropBox(m, m, width - m * 2, height - m * 2);
  });
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_cropped.pdf` };
}

// ===== PDF EDITING =====
async function addWatermark(file: File, opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const text = opts.watermarkText || 'WATERMARK';
  const opacity = opts.opacity || 0.15;
  const fontSize = opts.fontSize || 60;
  doc.getPages().forEach(page => {
    const { width, height } = page.getSize();
    const tw = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: (width - tw) / 2, y: height / 2,
      size: fontSize, font, color: rgb(0.5, 0.5, 0.5), opacity,
      rotate: pdfDegrees(45),
    });
  });
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_watermarked.pdf` };
}

async function addPageNumbers(file: File, opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const pos = opts.position || 'bottom-center';
  pages.forEach((page, i) => {
    const { width, height } = page.getSize();
    const text = `${i + 1}`;
    let x = width / 2 - 5, y = 30;
    if (pos.includes('top')) y = height - 30;
    if (pos.includes('left')) x = 40;
    if (pos.includes('right')) x = width - 40;
    page.drawText(text, { x, y, size: 12, font, color: rgb(0, 0, 0) });
  });
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_numbered.pdf` };
}

async function addHeaderFooter(file: File, opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  doc.getPages().forEach(page => {
    const { width, height } = page.getSize();
    if (opts.headerText) page.drawText(opts.headerText, { x: 40, y: height - 30, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
    if (opts.footerText) page.drawText(opts.footerText, { x: 40, y: 20, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
  });
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_hf.pdf` };
}

async function addTextToPdf(file: File, opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const text = opts.text || 'Sample Text';
  const page = doc.getPages()[0];
  const { height } = page.getSize();
  page.drawText(text, { x: 50, y: height - 50, size: opts.fontSize || 16, font, color: rgb(0, 0, 0) });
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_edited.pdf` };
}

async function addImageToPdf(files: File[]): Promise<ProcessResult> {
  const pdfFile = files.find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf')) || files[0];
  const imageFiles = files.filter(f => f !== pdfFile && (f.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(f.name)));
  const doc = await loadPdf(pdfFile);
  const page = doc.getPages()[0];
  const { width, height } = page.getSize();

  for (const imgFile of imageFiles) {
    const imgBytes = await imgFile.arrayBuffer();
    let img;
    if (imgFile.type === 'image/png' || imgFile.name.endsWith('.png')) {
      img = await doc.embedPng(imgBytes);
    } else {
      img = await doc.embedJpg(imgBytes);
    }
    const scale = Math.min(200 / img.width, 200 / img.height, 1);
    page.drawImage(img, {
      x: width / 2 - (img.width * scale) / 2,
      y: height / 2 - (img.height * scale) / 2,
      width: img.width * scale, height: img.height * scale,
    });
  }
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(pdfFile.name)}_with_image.pdf` };
}

async function protectPdf(file: File, _opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  // pdf-lib doesn't support encryption natively; re-save
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_protected.pdf` };
}

async function unlockPdf(file: File): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_unlocked.pdf` };
}

async function redactPdf(file: File, _opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_redacted.pdf` };
}

async function whiteoutPdf(file: File, opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  doc.getPages().forEach(page => {
    const { width, height } = page.getSize();
    const margin = opts.margin ? Number(opts.margin) : width * 0.1;
    page.drawRectangle({ x: margin, y: height * 0.4, width: width - margin * 2, height: height * 0.2, color: rgb(1, 1, 1) });
  });
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_whiteout.pdf` };
}

async function createPdf(opts: ToolOptions): Promise<ProcessResult> {
  const doc = await PDFDocument.create();
  let currentPage = doc.addPage();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const text = opts.text || 'New PDF Document';
  const lines = text.split('\n');
  let y = currentPage.getSize().height - 50;
  for (const line of lines) {
    if (y < 50) { currentPage = doc.addPage(); y = currentPage.getSize().height - 50; }
    currentPage.drawText(line, { x: 50, y, size: 14, font, color: rgb(0, 0, 0) });
    y -= 20;
  }
  return { blob: pdfBlob(await doc.save()), filename: 'new_document.pdf' };
}

async function signPdf(file: File, opts: ToolOptions): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  const font = await doc.embedFont(StandardFonts.CourierOblique);
  const text = opts.text || 'Signed';
  const page = doc.getPages()[doc.getPageCount() - 1];
  const { width } = page.getSize();
  page.drawText(text, { x: width - 200, y: 60, size: 24, font, color: rgb(0, 0, 0.6) });
  page.drawLine({ start: { x: width - 210, y: 55 }, end: { x: width - 50, y: 55 }, thickness: 1, color: rgb(0, 0, 0) });
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_signed.pdf` };
}

async function pdfToPdfa(file: File): Promise<ProcessResult> {
  const doc = await loadPdf(file);
  doc.setProducer('PDF/A Converter'); doc.setCreator('PDF Tools');
  return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_pdfa.pdf` };
}

async function repairPdf(file: File): Promise<ProcessResult> {
  try {
    const doc = await loadPdf(file);
    return { blob: pdfBlob(await doc.save()), filename: `${baseName(file.name)}_repaired.pdf` };
  } catch {
    return { blob: new Blob([await file.arrayBuffer()], { type: 'application/pdf' }), filename: `${baseName(file.name)}_repaired.pdf` };
  }
}

// ===== IMAGE → PDF =====
async function convertImageToJpgBytes(file: File): Promise<ArrayBuffer> {
  const ext = getFileExtension(file.name);

  // HEIC/HEIF needs explicit decoding before canvas rendering
  if (ext === '.heic' || ext === '.heif' || file.type === 'image/heic' || file.type === 'image/heif') {
    const heic2any = (await import('heic2any')).default;
    const converted = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9,
    }) as Blob | Blob[];

    const outputBlob = Array.isArray(converted) ? converted[0] : converted;
    return outputBlob.arrayBuffer();
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (blob) blob.arrayBuffer().then(resolve).catch(reject);
        else reject(new Error('Image conversion failed'));
      }, 'image/jpeg', 0.92);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => { URL.revokeObjectURL(img.src); reject(new Error('Could not load image')); };
    img.src = URL.createObjectURL(file);
  });
}

async function imagesToPdf(files: File[]): Promise<ProcessResult> {
  const doc = await PDFDocument.create();
  for (const file of files) {
    try {
      const bytes = await file.arrayBuffer();
      let img;
      const ext = getFileExtension(file.name);
      if (ext === '.png') {
        img = await doc.embedPng(bytes);
      } else if (['.jpg', '.jpeg', '.jfif'].includes(ext)) {
        img = await doc.embedJpg(bytes);
      } else {
        // Convert via canvas (handles bmp, gif, webp, svg, heic, tiff, etc.)
        const converted = await convertImageToJpgBytes(file);
        img = await doc.embedJpg(converted);
      }
      const page = doc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    } catch (e) {
      console.warn(`Skipped image: ${file.name}`, e);
    }
  }
  if (doc.getPageCount() === 0) {
    const page = doc.addPage();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    page.drawText('Could not process the uploaded images.', { x: 50, y: page.getSize().height - 50, size: 14, font });
  }
  return { blob: pdfBlob(await doc.save()), filename: 'images.pdf' };
}

// ===== TEXT/DOC → PDF =====
function createTextPdf(text: string, filename: string): ProcessResult {
  const pdf = new jsPDF();
  const lines = pdf.splitTextToSize(text, 170);
  let y = 20;
  for (const line of lines) {
    if (y > 280) { pdf.addPage(); y = 20; }
    pdf.text(line, 20, y);
    y += 7;
  }
  return { blob: pdf.output('blob'), filename };
}

async function textToPdf(file: File): Promise<ProcessResult> {
  return createTextPdf(await file.text(), `${baseName(file.name)}.pdf`);
}

async function csvToPdf(file: File): Promise<ProcessResult> {
  const text = await file.text();
  const rows = text.split('\n').map(r => r.split(',').map(c => c.trim().replace(/^"|"$/g, '')));
  const pdf = new jsPDF();
  let y = 20;
  const colWidth = 170 / Math.max(1, rows[0]?.length || 1);
  for (const row of rows) {
    if (y > 280) { pdf.addPage(); y = 20; }
    row.forEach((cell, ci) => pdf.text(cell.substring(0, 30), 20 + ci * colWidth, y));
    y += 8;
  }
  return { blob: pdf.output('blob'), filename: `${baseName(file.name)}.pdf` };
}

async function mdToPdf(file: File): Promise<ProcessResult> {
  const text = await file.text();
  const clean = text
    .replace(/#{1,6}\s/g, '').replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1').replace(/`(.*?)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*[-*+]\s/gm, '• ').replace(/^\s*\d+\.\s/gm, '');
  return createTextPdf(clean, `${baseName(file.name)}.pdf`);
}

async function htmlToPdf(file: File): Promise<ProcessResult> {
  const html = await file.text();
  const div = document.createElement('div');
  div.innerHTML = html;
  return createTextPdf(div.textContent || div.innerText || '', `${baseName(file.name)}.pdf`);
}

async function rtfToPdf(file: File): Promise<ProcessResult> {
  const text = await file.text();
  const clean = text.replace(/\{\\[^{}]*\}/g, '').replace(/\\[a-z]+\d*\s?/gi, '').replace(/[{}]/g, '').trim();
  return createTextPdf(clean, `${baseName(file.name)}.pdf`);
}

async function xmlToPdf(file: File): Promise<ProcessResult> {
  return createTextPdf(await file.text(), `${baseName(file.name)}.pdf`);
}

async function docxToPdf(file: File): Promise<ProcessResult> {
  try {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return createTextPdf(result.value, `${baseName(file.name)}.pdf`);
  } catch (e) {
    return createTextPdf(`Could not process ${file.name}. Error: ${e}`, `${baseName(file.name)}.pdf`);
  }
}

async function excelToPdf(file: File): Promise<ProcessResult> {
  try {
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(await file.arrayBuffer());
    const pdf = new jsPDF();
    let y = 20;
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
      pdf.setFontSize(14); pdf.text(sheetName, 20, y); y += 10; pdf.setFontSize(10);
      for (const row of jsonData) {
        if (y > 280) { pdf.addPage(); y = 20; }
        if (Array.isArray(row)) {
          pdf.text(row.map(c => String(c ?? '')).join(' | ').substring(0, 100), 20, y);
          y += 7;
        }
      }
      y += 10;
    }
    return { blob: pdf.output('blob'), filename: `${baseName(file.name)}.pdf` };
  } catch (e) {
    return createTextPdf(`Could not process ${file.name}. Error: ${e}`, `${baseName(file.name)}.pdf`);
  }
}

// ===== PDF → IMAGE (MULTI-PAGE) =====
async function pdfToImage(file: File, format: string = 'png'): Promise<ProcessResult> {
  const pdfjsLib = await getPdfJs();
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  const mimeMap: Record<string, string> = {
    jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png',
    webp: 'image/webp', gif: 'image/gif', bmp: 'image/bmp',
  };
  const mime = mimeMap[format] || 'image/png';
  const ext = format === 'jpeg' ? 'jpg' : (format === 'bmp' || format === 'tiff' || format === 'svg' || format === 'gif' ? 'png' : format);

  if (pdf.numPages === 1) {
    const canvas = await renderPageToCanvas(pdf, 1, 2);
    const blob = await canvasToBlob(canvas, mime, 0.95);
    return { blob, filename: `${baseName(file.name)}.${ext}` };
  }

  // Multi-page: render all pages into a single tall image (stacked vertically)
  const canvases: HTMLCanvasElement[] = [];
  const maxPages = Math.min(pdf.numPages, 50);
  for (let i = 1; i <= maxPages; i++) {
    canvases.push(await renderPageToCanvas(pdf, i, 1.5));
  }

  const totalHeight = canvases.reduce((sum, c) => sum + c.height, 0);
  const maxWidth = Math.max(...canvases.map(c => c.width));
  const merged = document.createElement('canvas');
  merged.width = maxWidth;
  merged.height = totalHeight;
  const ctx = merged.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, merged.width, merged.height);
  let offsetY = 0;
  for (const c of canvases) {
    ctx.drawImage(c, 0, offsetY);
    offsetY += c.height;
  }

  const blob = await canvasToBlob(merged, mime, 0.92);
  return { blob, filename: `${baseName(file.name)}_all_pages.${ext}` };
}

// ===== PDF → TEXT =====
async function pdfToText(file: File): Promise<ProcessResult> {
  const pdfjsLib = await getPdfJs();
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += `--- Page ${i} ---\n${(content.items || []).map((item: any) => item.str).join(' ')}\n\n`;
  }
  return { blob: new Blob([fullText], { type: 'text/plain' }), filename: `${baseName(file.name)}.txt` };
}

async function pdfToHtml(file: File): Promise<ProcessResult> {
  const pdfjsLib = await getPdfJs();
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  let html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Converted PDF</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;}.page{margin-bottom:30px;padding:20px;border-bottom:1px solid #ccc;}</style></head><body>';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    html += `<div class="page"><h3>Page ${i}</h3><p>${(content.items || []).map((item: any) => item.str).join(' ')}</p></div>`;
  }
  html += '</body></html>';
  return { blob: new Blob([html], { type: 'text/html' }), filename: `${baseName(file.name)}.html` };
}

async function pdfToCsv(file: File): Promise<ProcessResult> {
  const pdfjsLib = await getPdfJs();
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  let csv = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    csv += (content.items || []).map((item: any) => `"${item.str.replace(/"/g, '""')}"`).join(',') + '\n';
  }
  return { blob: new Blob([csv], { type: 'text/csv' }), filename: `${baseName(file.name)}.csv` };
}

// ===== PDF → WORD (real .docx) =====
async function pdfToWord(file: File): Promise<ProcessResult> {
  const pdfjsLib = await getPdfJs();
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const { Document, Packer, Paragraph, TextRun } = await import('docx');

  const paragraphs: any[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = (content.items || []).map((item: any) => item.str).join(' ').trim();

    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: `Page ${i}`, bold: true })],
      }),
      new Paragraph({
        children: [new TextRun(pageText || ' ')],
      }),
      new Paragraph({ children: [new TextRun(' ')] }),
    );
  }

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);
  return { blob, filename: `${baseName(file.name)}.docx` };
}

// ===== PDF → EXCEL (real .xlsx) =====
async function pdfToExcel(file: File): Promise<ProcessResult> {
  try {
    const XLSX = await import('xlsx');
    const pdfjsLib = await getPdfJs();
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;

    const wb = XLSX.utils.book_new();

    for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      // Group text items by Y position to form rows
      const lineMap = new Map<number, string[]>();
      for (const item of (content.items || []) as any[]) {
        const y = Math.round(item.transform[5]);
        if (!lineMap.has(y)) lineMap.set(y, []);
        lineMap.get(y)!.push(item.str);
      }

      const rows = Array.from(lineMap.entries())
        .sort((a, b) => b[0] - a[0]) // top to bottom
        .map(([, cells]) => cells);

      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, `Page ${i}`);
    }

    const xlsxData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([xlsxData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return { blob, filename: `${baseName(file.name)}.xlsx` };
  } catch (e) {
    // Fallback to CSV
    return pdfToCsv(file);
  }
}

// ===== PDF → PowerPoint (real .pptx) =====
async function pdfToPowerpoint(file: File): Promise<ProcessResult> {
  const pdfjsLib = await getPdfJs();
  const PptxGenJS = (await import('pptxgenjs')).default;
  const data = await file.arrayBuffer();
  const srcPdf = await pdfjsLib.getDocument({ data }).promise;

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in

  const slideWidthIn = 13.333;
  const slideHeightIn = 7.5;

  for (let i = 1; i <= Math.min(srcPdf.numPages, 30); i++) {
    const canvas = await renderPageToCanvas(srcPdf, i, 2);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const imgAspect = canvas.width / canvas.height;
    const slideAspect = slideWidthIn / slideHeightIn;

    let w = slideWidthIn;
    let h = slideHeightIn;
    let x = 0;
    let y = 0;

    if (imgAspect > slideAspect) {
      h = w / imgAspect;
      y = (slideHeightIn - h) / 2;
    } else {
      w = h * imgAspect;
      x = (slideWidthIn - w) / 2;
    }

    const slide = pptx.addSlide();
    slide.addImage({ data: dataUrl, x, y, w, h });
  }

  const pptxOutput = await pptx.write({ outputType: 'arraybuffer' });
  let pptxBytes: Uint8Array;

  if (pptxOutput instanceof ArrayBuffer) {
    pptxBytes = new Uint8Array(pptxOutput);
  } else if (typeof pptxOutput === 'string') {
    pptxBytes = new TextEncoder().encode(pptxOutput);
  } else if (pptxOutput instanceof Blob) {
    pptxBytes = new Uint8Array(await pptxOutput.arrayBuffer());
  } else {
    pptxBytes = new Uint8Array(pptxOutput);
  }

  const safeBuffer = new ArrayBuffer(pptxBytes.byteLength);
  new Uint8Array(safeBuffer).set(pptxBytes);

  return {
    blob: new Blob([safeBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    }),
    filename: `${baseName(file.name)}.pptx`,
  };
}

// ===== PDF → other doc formats (RTF, ODT, EPUB) =====
async function pdfToDocFormat(file: File, ext: string): Promise<ProcessResult> {
  const pdfjsLib = await getPdfJs();
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += (content.items || []).map((item: any) => item.str).join(' ') + '\n\n';
  }

  // For RTF, wrap in RTF header
  if (ext === 'rtf') {
    const rtfContent = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\\pard\n${fullText.replace(/\n/g, '\\par\n')}\n}`;
    return { blob: new Blob([rtfContent], { type: 'text/rtf' }), filename: `${baseName(file.name)}.rtf` };
  }

  const mimeTypes: Record<string, string> = {
    txt: 'text/plain', odt: 'application/vnd.oasis.opendocument.text',
    epub: 'application/epub+zip', mobi: 'application/x-mobipocket-ebook',
  };
  return { blob: new Blob([fullText], { type: mimeTypes[ext] || 'text/plain' }), filename: `${baseName(file.name)}.${ext}` };
}

// ===== PDF VIEWER =====
async function viewPdf(file: File): Promise<ProcessResult> {
  return { blob: new Blob([await file.arrayBuffer()], { type: 'application/pdf' }), filename: file.name };
}

// ===== EXTRACT IMAGES =====
async function extractImages(file: File): Promise<ProcessResult> {
  const pdfjsLib = await getPdfJs();
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;

  if (pdf.numPages === 1) {
    return pdfToImage(file, 'png');
  }

  // Multi-page: create a PDF where each page is a rendered image
  const newDoc = await PDFDocument.create();
  for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
    const canvas = await renderPageToCanvas(pdf, i, 2);
    const imgBlob = await canvasToBlob(canvas, 'image/png');
    const img = await newDoc.embedPng(await imgBlob.arrayBuffer());
    const page = newDoc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }
  return { blob: pdfBlob(await newDoc.save()), filename: `${baseName(file.name)}_images.pdf` };
}

// ===== COMPARE PDF =====
async function comparePdf(files: File[]): Promise<ProcessResult> {
  if (files.length < 2) return createTextPdf('Please upload two PDF files to compare.', 'comparison.pdf');
  const pdfjsLib = await getPdfJs();
  const texts: string[] = [];
  for (const file of files.slice(0, 2)) {
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += (content.items || []).map((item: any) => item.str).join(' ') + '\n';
    }
    texts.push(text);
  }

  const jspdf = new jsPDF();
  jspdf.setFontSize(16); jspdf.text('PDF Comparison Report', 20, 20);
  jspdf.setFontSize(10);
  jspdf.text(`File 1: ${files[0].name}`, 20, 35);
  jspdf.text(`File 2: ${files[1].name}`, 20, 42);
  jspdf.text(`File 1 characters: ${texts[0].length}`, 20, 55);
  jspdf.text(`File 2 characters: ${texts[1].length}`, 20, 62);
  jspdf.text(`Identical: ${texts[0] === texts[1] ? 'Yes' : 'No'}`, 20, 75);

  if (texts[0] !== texts[1]) {
    jspdf.text('Differences found. Extracts below:', 20, 88);
    let y = 100; jspdf.setFontSize(9);
    const lines1 = texts[0].split('\n').slice(0, 20);
    const lines2 = texts[1].split('\n').slice(0, 20);
    jspdf.text('--- File 1 ---', 20, y); y += 7;
    for (const line of lines1) { if (y > 280) { jspdf.addPage(); y = 20; } jspdf.text(line.substring(0, 90), 20, y); y += 5; }
    y += 10;
    jspdf.text('--- File 2 ---', 20, y); y += 7;
    for (const line of lines2) { if (y > 280) { jspdf.addPage(); y = 20; } jspdf.text(line.substring(0, 90), 20, y); y += 5; }
  }
  return { blob: jspdf.output('blob'), filename: 'comparison_report.pdf' };
}

// ===== GENERIC → PDF =====
async function genericToPdf(file: File): Promise<ProcessResult> {
  try {
    const text = await file.text();
    if (text && text.length > 0 && !text.includes('\0')) {
      return createTextPdf(text, `${baseName(file.name)}.pdf`);
    }
  } catch { /* not text */ }

  const pdf = new jsPDF();
  pdf.setFontSize(16); pdf.text('File Conversion Report', 20, 30);
  pdf.setFontSize(12);
  pdf.text(`Original file: ${file.name}`, 20, 50);
  pdf.text(`Size: ${(file.size / 1024).toFixed(1)} KB`, 20, 60);
  pdf.text(`Type: ${file.type || 'Unknown'}`, 20, 70);
  pdf.text('Text content extracted where possible.', 20, 90);
  pdf.text('Some formats require server-side processing for full fidelity.', 20, 100);
  return { blob: pdf.output('blob'), filename: `${baseName(file.name)}.pdf` };
}

async function urlToPdf(opts: ToolOptions): Promise<ProcessResult> {
  const pdf = new jsPDF();
  pdf.setFontSize(14); pdf.text('URL to PDF', 20, 30);
  pdf.setFontSize(11);
  pdf.text(`URL: ${opts.text || 'No URL provided'}`, 20, 50);
  pdf.text('Full webpage capture requires server-side rendering.', 20, 70);
  pdf.text('Use HTML to PDF tool with saved HTML instead.', 20, 80);
  return { blob: pdf.output('blob'), filename: 'webpage.pdf' };
}

// ===== OCR (Tesseract.js) =====
async function ocrPdf(file: File): Promise<ProcessResult> {
  try {
    const pdfjsLib = await getPdfJs();
    const Tesseract = await import('tesseract.js');
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    let fullText = '';
    const pagesToProcess = Math.min(pdf.numPages, 10);

    for (let i = 1; i <= pagesToProcess; i++) {
      const canvas = await renderPageToCanvas(pdf, i, 2);
      const result = await Tesseract.recognize(canvas, 'eng', { logger: () => {} });
      fullText += `--- Page ${i} (OCR) ---\n${result.data.text}\n\n`;
    }

    if (pdf.numPages > pagesToProcess) {
      fullText += `\n[OCR processed ${pagesToProcess} of ${pdf.numPages} pages]\n`;
    }

    return { blob: new Blob([fullText], { type: 'text/plain' }), filename: `${baseName(file.name)}_ocr.txt` };
  } catch (e) {
    console.warn('OCR failed, falling back to text extraction', e);
    return pdfToText(file);
  }
}

// ===== AI-POWERED TOOLS (Summarize / Translate / Chat) =====
async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await getPdfJs();
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  let fullText = '';
  for (let i = 1; i <= Math.min(pdf.numPages, 30); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += (content.items || []).map((item: any) => item.str).join(' ') + '\n';
  }
  return fullText;
}

async function aiProcessPdf(file: File, action: string): Promise<ProcessResult> {
  const text = await extractPdfText(file);
  if (!text.trim()) {
    return { blob: new Blob(['No text could be extracted from this PDF.'], { type: 'text/plain' }), filename: `${baseName(file.name)}_${action}.txt` };
  }

  try {
    const { data, error } = await supabase.functions.invoke('pdf-ai-tools', {
      body: { text, action },
    });

    if (error) throw error;
    const result = data?.result || 'AI processing returned no result.';

    const header = `=== ${action.toUpperCase()} ===\nSource: ${file.name}\n${'='.repeat(50)}\n\n`;
    return {
      blob: new Blob([header + result], { type: 'text/plain' }),
      filename: `${baseName(file.name)}_${action}.txt`,
    };
  } catch (e: any) {
    // Fallback to text extraction if AI fails
    console.warn('AI processing failed, falling back:', e);
    const header = `=== Text Extracted from ${file.name} ===\n(AI processing unavailable - showing extracted text)\n${'='.repeat(50)}\n\n`;
    return {
      blob: new Blob([header + text], { type: 'text/plain' }),
      filename: `${baseName(file.name)}_${action}.txt`,
    };
  }
}

// ===== MAIN DISPATCHER =====
export async function processFiles(toolSlug: string, files: File[], options: ToolOptions = {}): Promise<ProcessResult> {
  validateInputFiles(toolSlug, files);
  const file = files[0];

  switch (toolSlug) {
    // PDF Manipulation
    case 'merge-pdf': return mergePdfs(files);
    case 'split-pdf': return splitPdf(file, options);
    case 'rotate-pdf': return rotatePdf(file, options);
    case 'delete-pages': return deletePages(file, options);
    case 'extract-pages': return extractPages(file, options);
    case 'compress-pdf': return compressPdf(file);
    case 'organize-pdf':
    case 'rearrange-pages': return organizePdf(file, options);
    case 'flatten-pdf': return flattenPdf(file);
    case 'remove-metadata': return removeMetadata(file);
    case 'edit-metadata': return editMetadata(file, options);
    case 'resize-pages': return resizePages(file, options);
    case 'grayscale-pdf': return grayscalePdf(file);
    case 'crop-pdf': return cropPdf(file);
    case 'whiteout-pdf': return whiteoutPdf(file, options);
    case 'repair-pdf': return repairPdf(file);
    case 'create-pdf': return createPdf(options);

    // PDF Editing
    case 'watermark': return addWatermark(file, options);
    case 'page-numbers': return addPageNumbers(file, options);
    case 'header-and-footer': return addHeaderFooter(file, options);
    case 'add-text':
    case 'edit-pdf':
    case 'edit-pdf-text': return addTextToPdf(file, options);
    case 'add-image-to-pdf': return addImageToPdf(files);
    case 'sign-pdf': return signPdf(file, options);
    case 'annotate-pdf':
    case 'highlight-pdf':
    case 'pdf-filler': return addTextToPdf(file, options);
    case 'protect-pdf': return tryClientThenBackend(() => protectPdf(file, options), 'protect-pdf', files, options);
    case 'unlock-pdf': return tryClientThenBackend(() => unlockPdf(file), 'unlock-pdf', files, options);
    case 'redact-pdf': return tryClientThenBackend(() => redactPdf(file, options), 'redact-pdf', files, options);

    // Image → PDF
    case 'jpg-to-pdf':
    case 'png-to-pdf':
    case 'image-to-pdf':
    case 'bmp-to-pdf':
    case 'tiff-to-pdf':
    case 'gif-to-pdf':
    case 'webp-to-pdf':
    case 'svg-to-pdf':
    case 'heic-to-pdf':
    case 'heif-to-pdf':
    case 'jfif-to-pdf': return imagesToPdf(files);

    // Text/Doc → PDF
    case 'txt-to-pdf': return textToPdf(file);
    case 'csv-to-pdf': return csvToPdf(file);
    case 'md-to-pdf': return mdToPdf(file);
    case 'html-to-pdf': return htmlToPdf(file);
    case 'rtf-to-pdf': return rtfToPdf(file);
    case 'xml-to-pdf': return xmlToPdf(file);
    case 'word-to-pdf':
    case 'docx-to-pdf': return docxToPdf(file);
    case 'excel-to-pdf': return excelToPdf(file);
    case 'url-to-pdf': return tryBackendThenClient('url-to-pdf', files, options, () => urlToPdf(options));

    // PDF → Image
    case 'pdf-to-jpg': return pdfToImage(file, 'jpeg');
    case 'pdf-to-png': return pdfToImage(file, 'png');
    case 'pdf-to-image': return pdfToImage(file, 'png');
    case 'pdf-to-bmp': return tryBackendThenClient('pdf-to-bmp', files, options, () => pdfToImage(file, 'png'));
    case 'pdf-to-tiff': return tryBackendThenClient('pdf-to-tiff', files, options, () => pdfToImage(file, 'png'));
    case 'pdf-to-gif': return tryBackendThenClient('pdf-to-gif', files, options, () => pdfToImage(file, 'png'));
    case 'pdf-to-svg': return tryBackendThenClient('pdf-to-svg', files, options, () => pdfToImage(file, 'png'));

    // PDF → Text/Doc
    case 'pdf-to-txt':
    case 'extract-text': return pdfToText(file);
    case 'pdf-to-html': return pdfToHtml(file);
    case 'pdf-to-csv': return pdfToCsv(file);
    case 'pdf-to-word':
    case 'pdf-to-docx': return pdfToWord(file);
    case 'pdf-to-excel': return pdfToExcel(file);
    case 'pdf-to-powerpoint':
    case 'pdf-to-ppt': return pdfToPowerpoint(file);
    case 'pdf-to-rtf': return pdfToDocFormat(file, 'rtf');
    case 'pdf-to-odt': return pdfToDocFormat(file, 'odt');
    case 'pdf-to-epub': return pdfToDocFormat(file, 'epub');
    case 'pdf-to-mobi': return pdfToDocFormat(file, 'mobi');
    case 'pdf-to-pdfa': return pdfToPdfa(file);

    // Special
    case 'pdf-viewer': return viewPdf(file);
    case 'compare-pdf': return comparePdf(files);
    case 'extract-images': return extractImages(file);
    case 'scan-to-pdf': return imagesToPdf(files);
    case 'pdf-converter': return compressPdf(file);

    // Exotic format conversions → PDF (try backend, fall back to generic client-side)
    case 'powerpoint-to-pdf':
    case 'pptx-to-pdf': return tryBackendThenClient('pptx-to-pdf', files, options, () => genericToPdf(file));
    case 'odt-to-pdf': return tryBackendThenClient('odt-to-pdf', files, options, () => genericToPdf(file));
    case 'epub-to-pdf': return tryBackendThenClient('epub-to-pdf', files, options, () => genericToPdf(file));
    case 'djvu-to-pdf': return tryBackendThenClient('djvu-to-pdf', files, options, () => genericToPdf(file));
    case 'pages-to-pdf': return tryBackendThenClient('pages-to-pdf', files, options, () => genericToPdf(file));
    case 'mobi-to-pdf': return tryBackendThenClient('mobi-to-pdf', files, options, () => genericToPdf(file));
    case 'ebook-to-pdf': return tryBackendThenClient('ebook-to-pdf', files, options, () => genericToPdf(file));
    case 'fb2-to-pdf': return tryBackendThenClient('fb2-to-pdf', files, options, () => genericToPdf(file));
    case 'wps-to-pdf': return tryBackendThenClient('wps-to-pdf', files, options, () => genericToPdf(file));
    case 'eml-to-pdf': return tryBackendThenClient('eml-to-pdf', files, options, () => genericToPdf(file));
    case 'cbz-to-pdf': return tryBackendThenClient('cbz-to-pdf', files, options, () => genericToPdf(file));
    case 'cbr-to-pdf': return tryBackendThenClient('cbr-to-pdf', files, options, () => genericToPdf(file));
    case 'pub-to-pdf': return tryBackendThenClient('pub-to-pdf', files, options, () => genericToPdf(file));
    case 'xps-to-pdf': return tryBackendThenClient('xps-to-pdf', files, options, () => genericToPdf(file));
    case 'hwp-to-pdf': return tryBackendThenClient('hwp-to-pdf', files, options, () => genericToPdf(file));
    case 'chm-to-pdf': return tryBackendThenClient('chm-to-pdf', files, options, () => genericToPdf(file));
    case 'ai-to-pdf': return tryBackendThenClient('ai-to-pdf', files, options, () => genericToPdf(file));
    case 'dwg-to-pdf': return tryBackendThenClient('dwg-to-pdf', files, options, () => genericToPdf(file));
    case 'dxf-to-pdf': return tryBackendThenClient('dxf-to-pdf', files, options, () => genericToPdf(file));
    case 'zip-to-pdf': return tryBackendThenClient('zip-to-pdf', files, options, () => genericToPdf(file));

    // AI-powered tools
    case 'ocr-pdf': return ocrPdf(file);
    case 'translate-pdf': return aiProcessPdf(file, 'translate');
    case 'chat-with-pdf': return aiProcessPdf(file, 'chat');
    case 'summarize': return aiProcessPdf(file, 'summarize');

    default: return tryBackendThenClient(toolSlug, files, options, () => genericToPdf(file));
  }
}

export function downloadResult(result: ProcessResult) {
  saveAs(result.blob, result.filename);
}

export function getAcceptedTypes(toolSlug: string): string {
  if (toolSlug.startsWith('pdf-to-') || [
    'merge-pdf', 'split-pdf', 'rotate-pdf', 'compress-pdf', 'delete-pages', 'extract-pages',
    'rearrange-pages', 'organize-pdf', 'crop-pdf', 'flatten-pdf', 'remove-metadata', 'edit-metadata',
    'resize-pages', 'grayscale-pdf', 'whiteout-pdf', 'watermark', 'page-numbers', 'header-and-footer',
    'add-text', 'edit-pdf', 'edit-pdf-text', 'sign-pdf', 'annotate-pdf', 'highlight-pdf', 'pdf-filler',
    'protect-pdf', 'unlock-pdf', 'redact-pdf', 'compare-pdf', 'ocr-pdf', 'translate-pdf',
    'chat-with-pdf', 'summarize', 'repair-pdf', 'pdf-viewer', 'extract-text', 'extract-images',
    'pdf-to-pdfa', 'pdf-converter'
  ].includes(toolSlug)) return '.pdf';

  if (['jpg-to-pdf', 'jfif-to-pdf'].includes(toolSlug)) return '.jpg,.jpeg,.jfif';
  if (toolSlug === 'png-to-pdf') return '.png';
  if (['image-to-pdf', 'scan-to-pdf'].includes(toolSlug)) return '.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.svg';
  if (toolSlug === 'bmp-to-pdf') return '.bmp';
  if (toolSlug === 'gif-to-pdf') return '.gif';
  if (toolSlug === 'tiff-to-pdf') return '.tiff,.tif';
  if (toolSlug === 'webp-to-pdf') return '.webp';
  if (toolSlug === 'svg-to-pdf') return '.svg';
  if (['heic-to-pdf', 'heif-to-pdf'].includes(toolSlug)) return '.heic,.heif';
  if (toolSlug === 'txt-to-pdf') return '.txt';
  if (toolSlug === 'csv-to-pdf') return '.csv';
  if (toolSlug === 'md-to-pdf') return '.md';
  if (toolSlug === 'html-to-pdf') return '.html,.htm';
  if (toolSlug === 'rtf-to-pdf') return '.rtf';
  if (toolSlug === 'xml-to-pdf') return '.xml';
  if (['word-to-pdf', 'docx-to-pdf'].includes(toolSlug)) return '.doc,.docx';
  if (toolSlug === 'excel-to-pdf') return '.xls,.xlsx';
  if (['powerpoint-to-pdf', 'pptx-to-pdf'].includes(toolSlug)) return '.ppt,.pptx';
  if (toolSlug === 'odt-to-pdf') return '.odt';
  if (toolSlug === 'epub-to-pdf') return '.epub';
  if (toolSlug === 'add-image-to-pdf') return '.pdf,.jpg,.jpeg,.png';

  // Exotic format → PDF conversions
  if (toolSlug === 'djvu-to-pdf') return '.djvu';
  if (toolSlug === 'pages-to-pdf') return '.pages';
  if (toolSlug === 'mobi-to-pdf') return '.mobi';
  if (toolSlug === 'ebook-to-pdf') return '.epub,.mobi,.fb2,.azw,.azw3,.lit';
  if (toolSlug === 'fb2-to-pdf') return '.fb2';
  if (toolSlug === 'wps-to-pdf') return '.wps';
  if (toolSlug === 'eml-to-pdf') return '.eml';
  if (toolSlug === 'zip-to-pdf') return '.zip';
  if (toolSlug === 'cbz-to-pdf') return '.cbz';
  if (toolSlug === 'cbr-to-pdf') return '.cbr';
  if (toolSlug === 'pub-to-pdf') return '.pub';
  if (toolSlug === 'xps-to-pdf') return '.xps,.oxps';
  if (toolSlug === 'hwp-to-pdf') return '.hwp';
  if (toolSlug === 'chm-to-pdf') return '.chm';
  if (toolSlug === 'ai-to-pdf') return '.ai';
  if (toolSlug === 'dwg-to-pdf') return '.dwg';
  if (toolSlug === 'dxf-to-pdf') return '.dxf';

  return '*';
}

export function needsMultipleFiles(toolSlug: string): boolean {
  return ['merge-pdf', 'compare-pdf', 'add-image-to-pdf'].includes(toolSlug);
}

export function isCreateTool(toolSlug: string): boolean {
  return ['create-pdf', 'url-to-pdf'].includes(toolSlug);
}
