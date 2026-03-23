# 🚀 ISHU PDF Tools — Complete Backend Implementation Guide
## (Frontend Already Built — Sirf Backend Setup Karna Hai)
> **103+ Tools Fully Working Backend** | Hinglish Guide | ISHU Dev Team

---

## ⚠️ IMPORTANT NOTE PEHLE PADHO
```
✅ Frontend: ALREADY BUILT HAI — chhedna mat
❌ Backend: YEH ABHI BANANA HAI — is guide ko follow karo
📁 Structure: Ek alag "backend" folder banao project root mein
```

---

## 📁 STEP 1 — PROJECT STRUCTURE BANAO

```
ishu-project/
├── frontend/          ← (Already built hai, mat chhedna)
├── backend/           ← (YEH NAYA BANAO — sab kuch yahan hoga)
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── config/
│   ├── temp/          ← (Auto-create hoga, file processing yahan)
│   ├── package.json
│   ├── .env
│   └── server.js
└── README.md
```

### Backend Folder Banao — Yeh Command Run Karo:
```bash
# Project root mein jao (jahan frontend folder hai)
mkdir backend
cd backend
mkdir -p src/routes src/controllers src/middleware src/utils src/config temp
npm init -y
```

---

## 📦 STEP 2 — SYSTEM DEPENDENCIES INSTALL (Linux/Ubuntu Server)

> **Yeh commands server pe run karo (NOT local machine pe)**

```bash
# 1. System Update
sudo apt-get update && sudo apt-get upgrade -y

# 2. LibreOffice — Word/Excel/PPT/ODT/RTF/WPS/HWP conversion ke liye
sudo apt-get install -y libreoffice \
  libreoffice-writer \
  libreoffice-calc \
  libreoffice-impress \
  libreoffice-draw

# 3. Ghostscript — PDF compression, optimization, PDF/A ke liye
sudo apt-get install -y ghostscript

# 4. Poppler Utils — PDF to image, PDF info, text extract ke liye
sudo apt-get install -y poppler-utils

# 5. ImageMagick — Image processing, TIFF/BMP/GIF ke liye
sudo apt-get install -y imagemagick

# 6. Tesseract OCR — Scanned PDF text recognition ke liye
sudo apt-get install -y tesseract-ocr \
  tesseract-ocr-hin \
  tesseract-ocr-eng \
  tesseract-ocr-ben \
  tesseract-ocr-tam \
  tesseract-ocr-tel

# 7. Pandoc — Markdown, EPUB, HTML, ODT conversion ke liye
sudo apt-get install -y pandoc

# 8. wkhtmltopdf — HTML/URL to PDF ke liye (backup option)
sudo apt-get install -y wkhtmltopdf

# 9. Calibre — EPUB/MOBI/FB2/CBZ/CBR eBook conversion ke liye
sudo apt-get install -y calibre

# 10. Inkscape — SVG/AI/DXF to PDF ke liye
sudo apt-get install -y inkscape

# 11. pdf2htmlEX — PDF to HTML conversion ke liye
sudo apt-get install -y pdf2htmlex

# 12. DjVuLibre — DjVu to PDF ke liye
sudo apt-get install -y djvulibre-bin

# 13. Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 14. Python 3.11
sudo apt-get install -y python3.11 python3-pip python3.11-venv

# 15. Redis — Job queue ke liye (heavy file processing)
sudo apt-get install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# 16. Chromium — Puppeteer ke liye (URL/HTML to PDF)
sudo apt-get install -y chromium-browser

# 17. FFmpeg — Media processing
sudo apt-get install -y ffmpeg

# 18. Unrar — CBR files ke liye
sudo apt-get install -y unrar

# Version verify karo
libreoffice --version
gs --version
tesseract --version
pandoc --version
node --version
python3 --version
```

---

## 🔧 STEP 3 — IMAGEMAGICK POLICY FIX (IMPORTANT!)

```bash
# ImageMagick by default PDF allow nahi karta — fix karo
sudo sed -i 's/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/' \
  /etc/ImageMagick-6/policy.xml

# Verify karo
cat /etc/ImageMagick-6/policy.xml | grep PDF
# Output mein "read|write" dikhna chahiye
```

---

## 📦 STEP 4 — NODE.JS PACKAGES INSTALL

```bash
# backend/ folder mein jao
cd backend

# ═══════════════════════════════════════
# CORE SERVER
# ═══════════════════════════════════════
npm install express                  # Web server
npm install cors                     # Frontend se connect karne ke liye
npm install dotenv                   # .env file support
npm install multer                   # File upload handling
npm install express-rate-limit       # Rate limiting (abuse prevent)
npm install helmet                   # Security headers
npm install compression              # Response compression
npm install morgan                   # Request logging

# ═══════════════════════════════════════
# PDF MANIPULATION (BROWSER-LIKE OPERATIONS)
# ═══════════════════════════════════════
npm install pdf-lib                  # Merge, Split, Rotate, Watermark, Crop
npm install @pdf-lib/fontkit         # Font embedding in PDFs
npm install pdfjs-dist               # PDF parsing and rendering

# ═══════════════════════════════════════
# FILE CONVERSION — OFFICE FORMATS
# ═══════════════════════════════════════
npm install libreoffice-convert      # Word/Excel/PPT to PDF (LibreOffice wrapper)
npm install mammoth                  # DOCX to HTML/Text (fast)
npm install xlsx                     # Excel read/write (SheetJS)

# ═══════════════════════════════════════
# IMAGE PROCESSING
# ═══════════════════════════════════════
npm install sharp                    # HEIC, WebP, TIFF, BMP, image processing
npm install jimp                     # Pure JS image manipulation

# ═══════════════════════════════════════
# HTML/URL TO PDF
# ═══════════════════════════════════════
npm install puppeteer                # Headless Chrome (HTML/URL to PDF)

# ═══════════════════════════════════════
# OCR
# ═══════════════════════════════════════
npm install tesseract.js             # OCR (JS wrapper for Tesseract)
npm install node-poppler             # Poppler utilities wrapper

# ═══════════════════════════════════════
# TEXT/DATA PROCESSING
# ═══════════════════════════════════════
npm install papaparse                # CSV parsing
npm install marked                   # Markdown to HTML
npm install fast-xml-parser          # XML parsing
npm install mailparser               # EML email file parsing

# ═══════════════════════════════════════
# AI TOOLS
# ═══════════════════════════════════════
npm install openai                   # OpenAI API (Chat with PDF, Summarize, Translate)
npm install @google/generative-ai    # Gemini API (alternative/free option)

# ═══════════════════════════════════════
# JOB QUEUE (Heavy processing ke liye)
# ═══════════════════════════════════════
npm install bull                     # Redis-based job queue
npm install bullmq                   # Modern Bull (v2)

# ═══════════════════════════════════════
# FILE HANDLING
# ═══════════════════════════════════════
npm install fs-extra                 # Enhanced file system operations
npm install uuid                     # Unique file IDs
npm install archiver                 # ZIP file creation
npm install unzipper                 # ZIP extraction
npm install node-cron                # Cleanup scheduler (temp files delete)
npm install mime-types               # File type detection

# ═══════════════════════════════════════
# SECURITY
# ═══════════════════════════════════════
npm install bcryptjs                 # Password hashing
npm install crypto-js                # AES encryption

# ═══════════════════════════════════════
# UTILITIES
# ═══════════════════════════════════════
npm install axios                    # HTTP requests (CloudConvert API fallback)
npm install winston                  # Professional logging
npm install joi                      # Request validation
```

---

## 🐍 STEP 5 — PYTHON PACKAGES INSTALL

```bash
# backend/ folder mein python environment banao
python3 -m venv venv
source venv/bin/activate

# ═══════════════════════════════════════
# PDF CORE
# ═══════════════════════════════════════
pip install pypdf                    # PDF read/write/merge
pip install pikepdf                  # Advanced PDF (repair, flatten, metadata)
pip install reportlab                # PDF create from scratch
pip install pdfplumber               # PDF text + table extraction
pip install pdfminer.six             # Deep text extraction

# ═══════════════════════════════════════
# PDF CONVERSION
# ═══════════════════════════════════════
pip install pdf2image                # PDF pages to PIL images
pip install pdf2docx                 # PDF to Word DOCX (best library)
pip install img2pdf                  # Images to PDF

# ═══════════════════════════════════════
# OFFICE FORMATS
# ═══════════════════════════════════════
pip install python-docx              # DOCX read/write
pip install openpyxl                 # XLSX read/write
pip install python-pptx              # PPTX read/write

# ═══════════════════════════════════════
# IMAGE PROCESSING
# ═══════════════════════════════════════
pip install Pillow                   # Image manipulation
pip install camelot-py[cv]           # PDF table extraction (OpenCV needed)
pip install opencv-python-headless   # OpenCV (camelot ke liye)

# ═══════════════════════════════════════
# EBOOK FORMATS
# ═══════════════════════════════════════
pip install ebooklib                 # EPUB read/write
pip install mobi                     # MOBI handling

# ═══════════════════════════════════════
# WEB SERVER
# ═══════════════════════════════════════
pip install fastapi                  # Python API server
pip install uvicorn[standard]        # ASGI server
pip install python-multipart         # File upload
pip install aiofiles                 # Async file handling

# ═══════════════════════════════════════
# AI / NLP (AI Tools ke liye)
# ═══════════════════════════════════════
pip install openai                   # OpenAI (Chat PDF, Summarize)
pip install google-generativeai      # Gemini API
pip install langchain                # LangChain framework
pip install langchain-community      # LangChain integrations
pip install faiss-cpu                # Vector search (PDF Chat)
pip install sentence-transformers    # Text embeddings
pip install deep-translator          # PDF Translation (free, no API key)

# ═══════════════════════════════════════
# MISC CONVERSIONS
# ═══════════════════════════════════════
pip install markdown                 # Markdown processing
pip install weasyprint               # HTML to PDF (Python)
pip install svglib                   # SVG to PDF
pip install rlPyCairo                # Cairo graphics
pip install chardet                  # File encoding detection
pip install python-magic             # File type detection
```

---

## ⚙️ STEP 6 — .ENV FILE SETUP

```bash
# backend/.env file banao
cat > backend/.env << 'EOF'
# Server Config
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://yourishuwebsite.com

# Paths
TEMP_DIR=./temp
LIBREOFFICE_PATH=/usr/bin/libreoffice
GHOSTSCRIPT_PATH=/usr/bin/gs
TESSERACT_PATH=/usr/bin/tesseract
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# AI APIs (Optional — AI tools ke liye chahiye)
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here

# Redis (Job queue ke liye)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# File Limits
MAX_FILE_SIZE_MB=100
TEMP_FILE_EXPIRY_MINUTES=30

# CloudConvert API (DWG/DXF fallback ke liye — optional)
CLOUDCONVERT_API_KEY=your_cloudconvert_key_here
EOF
```

---

## 🗂️ STEP 7 — HAR TOOL KA DETAILED BREAKDOWN

---

### ═══════════════════════════════════
### 📁 CATEGORY 1: ORGANIZE (7 Tools)
### ═══════════════════════════════════

---

#### 🔧 TOOL 1: MERGE PDF
```
Language    : JavaScript (Node.js)
Library     : pdf-lib
Processing  : Server-side (multiple file upload)
Route       : POST /api/tools/merge
```
**Kya karta hai**: Multiple PDFs ko ek mein merge karta hai  
**Prompt for Claude/AI to write code**:
> "Write a Node.js Express route `POST /api/tools/merge` that: (1) Uses multer to accept multiple PDF files (field name: 'files', max 20 files, max 100MB each). (2) Uses pdf-lib PDFDocument.load() to load each file buffer. (3) Creates a new PDFDocument. (4) Copies all pages from each uploaded PDF into the new document using copyPages() in upload order. (5) Saves and sends the merged PDF as response with header Content-Disposition: attachment; filename=merged.pdf. (6) Deletes all temp files in finally block."

---

#### 🔧 TOOL 2: SPLIT PDF
```
Language    : JavaScript (Node.js)
Library     : pdf-lib
Processing  : Server-side
Route       : POST /api/tools/split
Body        : file (PDF), ranges (string like "1-3,5,7-10")
```
**Prompt for Claude/AI to write code**:
> "Write a Node.js Express route `POST /api/tools/split` that: (1) Accepts PDF upload and a 'ranges' string like '1-3,5,7-10'. (2) Parses the range string into array of page number arrays. (3) For each range, creates a new PDFDocument using pdf-lib and copies those pages. (4) If single range: return PDF directly. If multiple ranges: zip them using archiver and return ZIP. (5) Pages are 1-indexed in input but 0-indexed in pdf-lib. Handle this conversion."

---

#### 🔧 TOOL 3: COMPRESS PDF
```
Language    : Node.js (Ghostscript via child_process)
Library     : Ghostscript (system) + child_process (Node built-in)
Processing  : Server-side
Route       : POST /api/tools/compress
Body        : file (PDF), quality (screen|ebook|printer|prepress)
```
**Exact Ghostscript Command**:
```bash
gs -sDEVICE=pdfwrite \
   -dCompatibilityLevel=1.4 \
   -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=/tmp/output_uuid.pdf \
   /tmp/input_uuid.pdf
```
**Prompt for Claude/AI to write code**:
> "Write a Node.js Express route `POST /api/tools/compress` using multer and child_process.spawn. Accept PDF upload and quality setting ('screen', 'ebook', 'printer', 'prepress'). Save uploaded file to temp folder with UUID filename. Run Ghostscript command with the selected quality setting using spawn(). Wait for process to exit. Read output file. Send as PDF response. Show original vs compressed size in response headers X-Original-Size and X-Compressed-Size. Clean up both temp files."

---

#### 🔧 TOOL 4: ORGANIZE PDF (Reorder Pages)
```
Language    : JavaScript (Node.js)
Library     : pdf-lib
Processing  : Server-side
Route       : POST /api/tools/organize
Body        : file (PDF), pageOrder (JSON array like [2,0,1,4,3])
```
**Prompt for Claude/AI to write code**:
> "Write a Node.js route `POST /api/tools/organize` that accepts a PDF and a JSON array 'pageOrder' representing new page order (0-indexed). Load the PDF with pdf-lib. Create new PDF. Copy pages in the specified new order using copyPages(). Return the reordered PDF."

---

#### 🔧 TOOL 5: ROTATE PDF
```
Language    : JavaScript (Node.js)
Library     : pdf-lib
Route       : POST /api/tools/rotate
Body        : file (PDF), rotation (90|180|270), pages (all|specific page numbers)
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/rotate` that: accepts PDF, rotation degrees (90/180/270), and pages parameter ('all' or comma-separated page numbers like '1,3,5'). Load with pdf-lib. Get existing page rotation and add new rotation. Apply to specified pages only or all pages. Return modified PDF."

---

#### 🔧 TOOL 6: CROP PDF
```
Language    : JavaScript (Node.js)
Library     : pdf-lib
Route       : POST /api/tools/crop
Body        : file (PDF), top, right, bottom, left (margins in points), pages
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/crop` using pdf-lib. Accept margins (top, right, bottom, left in points or mm — convert mm to points: 1mm = 2.835pts). For each specified page, get current page size, calculate new crop box coordinates, call page.setCropBox(x, y, width, height). Return modified PDF."

---

#### 🔧 TOOL 7: DELETE PAGES / EXTRACT PAGES / REARRANGE
```
Language    : JavaScript (Node.js)
Library     : pdf-lib
Routes      :
  DELETE  → POST /api/tools/delete-pages
  EXTRACT → POST /api/tools/extract-pages
```
**Prompt for Claude/AI to write code**:
> "Write two Node.js routes using pdf-lib: (1) POST /api/tools/delete-pages — accepts PDF and comma-separated page numbers to delete (1-indexed), creates new PDF with remaining pages. (2) POST /api/tools/extract-pages — accepts PDF and page numbers, creates new PDF with only those pages. Both return the resulting PDF file."

---

### ═══════════════════════════════════
### 📄 CATEGORY 2: CONVERT TO PDF (40+ Tools)
### ═══════════════════════════════════

---

#### 🔧 TOOL 8: WORD TO PDF (.doc / .docx)
```
Language    : Node.js
Library     : libreoffice-convert (npm) — LibreOffice system tool use karta hai
Route       : POST /api/tools/word-to-pdf
Body        : file (.doc or .docx)
```
**Install Check**:
```bash
npm install libreoffice-convert
which libreoffice    # Should show path
```
**Prompt for Claude/AI to write code**:
> "Write Node.js Express route `POST /api/tools/word-to-pdf` using multer and libreoffice-convert npm package. Accept .doc or .docx file. Validate file extension. Use libreOfficeConvert.convert(fileBuffer, '.pdf', undefined) to get PDF buffer. Send PDF as response with filename same as original but .pdf extension. Handle errors if LibreOffice not found."

---

#### 🔧 TOOL 9: POWERPOINT TO PDF (.ppt / .pptx)
```
Language    : Node.js
Library     : libreoffice-convert
Route       : POST /api/tools/pptx-to-pdf
```
**Prompt for Claude/AI to write code**:
> "Same as Word to PDF route but accept .ppt and .pptx files. Validate MIME type as application/vnd.ms-powerpoint or application/vnd.openxmlformats-officedocument.presentationml.presentation."

---

#### 🔧 TOOL 10: EXCEL TO PDF (.xls / .xlsx)
```
Language    : Node.js
Library     : libreoffice-convert
Route       : POST /api/tools/excel-to-pdf
```
**Prompt for Claude/AI to write code**:
> "Same as Word to PDF but accept .xls and .xlsx files. MIME types: application/vnd.ms-excel or application/vnd.openxmlformats-officedocument.spreadsheetml.sheet."

---

#### 🔧 TOOL 11: JPG / PNG / WebP / BMP / GIF / JFIF / TIFF / HEIC / HEIF → PDF
```
Language    : Node.js
Library     : sharp (image normalize) + pdf-lib (embed in PDF)
Route       : POST /api/tools/image-to-pdf
Body        : files[] (multiple images), orientation (portrait|landscape), margin (mm)
```
**Exact System Commands** (alternative):
```bash
# img2pdf se bhi ho sakta hai (Python)
img2pdf image1.jpg image2.png -o output.pdf
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/image-to-pdf` that: (1) Accepts multiple image uploads (JPG, PNG, WebP, BMP, GIF, HEIC, TIFF) using multer. (2) Uses sharp to: convert HEIC/TIFF/BMP/GIF/WebP to PNG buffer, get image dimensions. (3) Creates new pdf-lib PDFDocument. (4) For each image: adds a new page sized to the image dimensions (respecting orientation and margin settings), embeds image, draws it full-page with margins. (5) Saves and returns PDF."

---

#### 🔧 TOOL 12: HTML TO PDF
```
Language    : Node.js
Library     : Puppeteer (headless Chromium)
Route       : POST /api/tools/html-to-pdf
Body        : htmlContent (string), format (A4|Letter|A3), orientation (portrait|landscape), margins
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/html-to-pdf` using Puppeteer. Accept HTML string in body. Launch Puppeteer with args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']. Set executablePath to process.env.PUPPETEER_EXECUTABLE_PATH. Set page content using page.setContent(html, {waitUntil: 'networkidle0'}). Generate PDF with options: format, landscape, printBackground: true, margin. Return PDF buffer. Close browser in finally block."

---

#### 🔧 TOOL 13: URL TO PDF
```
Language    : Node.js
Library     : Puppeteer
Route       : POST /api/tools/url-to-pdf
Body        : url (string), format, orientation
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/url-to-pdf` using Puppeteer. Validate URL with new URL(inputUrl). Block domains: localhost, 127.0.0.1, 192.168.x.x (prevent SSRF). Use page.goto(url, {waitUntil: 'networkidle2', timeout: 30000}). Generate PDF. Return buffer. Add rate limiting middleware: max 5 requests per IP per minute."

---

#### 🔧 TOOL 14: EPUB TO PDF
```
Language    : Python (FastAPI)
Library     : Calibre (ebook-convert CLI)
Route       : POST /api/tools/epub-to-pdf
```
**Exact Command**:
```bash
ebook-convert input.epub output.pdf \
  --paper-size a4 \
  --pdf-serif-family "Liberation Serif" \
  --pdf-sans-family "Liberation Sans"
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/epub-to-pdf` using python-multipart for file upload. Save EPUB to temp file with UUID. Run subprocess.run(['ebook-convert', input_path, output_path]). Read output PDF bytes. Return as StreamingResponse with media_type='application/pdf'. Delete both temp files in finally block."

---

#### 🔧 TOOL 15: MARKDOWN TO PDF
```
Language    : Node.js
Library     : marked (md→html) + Puppeteer (html→pdf)
Route       : POST /api/tools/md-to-pdf
Body        : file (.md)
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/md-to-pdf`. Read .md file content. Convert to HTML using marked library. Wrap in styled HTML template with CSS: font-family sans-serif, max-width 800px, syntax highlighting for code blocks using a CSS class. Use Puppeteer to convert the styled HTML to PDF. Return PDF."

---

#### 🔧 TOOL 16: TXT TO PDF
```
Language    : Node.js
Library     : pdf-lib + @pdf-lib/fontkit
Route       : POST /api/tools/txt-to-pdf
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/txt-to-pdf`. Read .txt file buffer. Decode as UTF-8. Embed Helvetica font using pdf-lib. Split text into lines of max 90 chars using word wrap. Add new pages when lines exceed 50 per page. Draw text with 50pt top margin, 50pt left margin, 14pt font size, 20pt line height. Return PDF."

---

#### 🔧 TOOL 17: CSV TO PDF
```
Language    : Node.js
Library     : papaparse + jspdf + jspdf-autotable
Route       : POST /api/tools/csv-to-pdf
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/csv-to-pdf`. Parse CSV using PapaParse. Use jsPDF with autoTable plugin to create a formatted PDF table. Style: header row with dark blue background and white text, alternating light gray rows, auto column width calculation. Handle pagination for large datasets. Return PDF buffer."

---

#### 🔧 TOOL 18: SVG TO PDF
```
Language    : Node.js (Inkscape CLI)
Library     : Inkscape (system) via child_process
Route       : POST /api/tools/svg-to-pdf
```
**Exact Command**:
```bash
inkscape input.svg --export-type=pdf --export-filename=output.pdf
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/svg-to-pdf`. Save SVG to temp file. Run Inkscape CLI command using child_process.execFile(['inkscape', inputPath, '--export-type=pdf', '--export-filename', outputPath]). Read output PDF. Return as response. Clean up temp files."

---

#### 🔧 TOOL 19: HEIC / HEIF TO PDF
```
Language    : Node.js
Library     : sharp (HEIC decode) + pdf-lib (embed)
Route       : POST /api/tools/heic-to-pdf
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/heic-to-pdf`. Use sharp to convert HEIC/HEIF buffer to JPEG buffer and get metadata (width, height). Create pdf-lib PDFDocument, add page sized to image, embed JPEG using embedJpg(), draw full-page. Return PDF."

---

#### 🔧 TOOL 20: DjVu TO PDF
```
Language    : Node.js (djvups CLI)
Library     : DjVuLibre (system)
Route       : POST /api/tools/djvu-to-pdf
```
**Exact Command**:
```bash
ddjvu -format=pdf input.djvu output.pdf
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/djvu-to-pdf`. Save DjVu file to temp. Run ddjvu command: ['ddjvu', '-format=pdf', inputPath, outputPath]. Check exit code. Return output PDF. Handle error if ddjvu not found."

---

#### 🔧 TOOL 21: MOBI / FB2 / CBZ / CBR / eBook TO PDF
```
Language    : Python (FastAPI)
Library     : Calibre (ebook-convert — handles ALL ebook formats)
Route       : POST /api/tools/ebook-to-pdf
Body        : file (any ebook format)
```
**Commands**:
```bash
ebook-convert input.mobi output.pdf
ebook-convert input.fb2 output.pdf
ebook-convert input.cbz output.pdf
ebook-convert input.cbr output.pdf
ebook-convert input.azw output.pdf
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/ebook-to-pdf`. Detect file extension from uploaded filename. Map to supported formats: ['mobi','fb2','cbz','cbr','azw','azw3','lit','lrf']. Run ebook-convert subprocess command. Return PDF. If format not supported, return 400 error."

---

#### 🔧 TOOL 22: ODT / RTF / WPS / ODS / HWP TO PDF
```
Language    : Node.js
Library     : libreoffice-convert (LibreOffice handles all these)
Route       : POST /api/tools/document-to-pdf
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/document-to-pdf`. Accept files with extensions: odt, rtf, wps, ods, hwp, pub, xps. Use libreoffice-convert package to convert any of these to PDF. LibreOffice internally handles all these formats. Return PDF."

---

#### 🔧 TOOL 23: DWG / DXF TO PDF (AutoCAD)
```
Language    : Node.js (primary: LibreOffice, fallback: CloudConvert API)
Library     : LibreOffice Draw (for DXF) + CloudConvert API (for DWG)
Route       : POST /api/tools/cad-to-pdf
```
**LibreOffice Command** (works for DXF):
```bash
libreoffice --headless --convert-to pdf input.dxf
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/cad-to-pdf`. (1) Try LibreOffice conversion using child_process for DXF files. (2) If DWG or if LibreOffice fails, call CloudConvert API v2 (process.env.CLOUDCONVERT_API_KEY). Use axios to POST to https://api.cloudconvert.com/v2/jobs, create import/convert/export tasks. Poll job status. Download result. Return PDF. Show error if both fail."

---

#### 🔧 TOOL 24: XML TO PDF
```
Language    : Node.js
Library     : fast-xml-parser + Puppeteer
Route       : POST /api/tools/xml-to-pdf
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/xml-to-pdf`. Parse XML using fast-xml-parser. Convert parsed JSON to styled HTML table/tree view using a recursive function. Add CSS styling (monospace font, color-coded tags like an IDE). Use Puppeteer to convert HTML to PDF. Return PDF."

---

#### 🔧 TOOL 25: EML TO PDF (Email)
```
Language    : Node.js
Library     : mailparser + Puppeteer
Route       : POST /api/tools/eml-to-pdf
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/eml-to-pdf`. Use simpleParser from mailparser to parse .eml file buffer. Extract: from, to, cc, subject, date, text body, HTML body. Create professional email HTML template with header (From/To/Subject/Date in table), then body. If HTML body exists use it, else format text body. Use Puppeteer to convert to PDF."

---

#### 🔧 TOOL 26: ZIP TO PDF
```
Language    : Node.js
Library     : unzipper + pdf-lib + libreoffice-convert
Route       : POST /api/tools/zip-to-pdf
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/zip-to-pdf`. Extract ZIP using unzipper. For each extracted file: if image (.jpg/.png/.webp) — use pdf-lib to embed. If document (.docx/.xlsx/.pptx) — use libreoffice-convert. If PDF already — use pdf-lib to load. Merge all resulting PDFs into one final PDF using pdf-lib. Return merged PDF."

---

#### 🔧 TOOL 27: AI (Adobe Illustrator) TO PDF
```
Language    : Node.js (Inkscape or Ghostscript)
Library     : Inkscape or Ghostscript CLI
Route       : POST /api/tools/ai-to-pdf
```
**Commands**:
```bash
# Inkscape method
inkscape input.ai --export-type=pdf --export-filename=output.pdf

# Ghostscript method (if Inkscape fails)
gs -dBATCH -dNOPAUSE -sDEVICE=pdfwrite -sOutputFile=output.pdf input.ai
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/ai-to-pdf`. Save .ai file to temp. Try Inkscape conversion first. If Inkscape exit code non-zero, try Ghostscript as fallback. Return whichever succeeds. Return 500 if both fail."

---

### ═══════════════════════════════════
### 📤 CATEGORY 3: CONVERT FROM PDF (20+ Tools)
### ═══════════════════════════════════

---

#### 🔧 TOOL 28: PDF TO WORD (.docx)
```
Language    : Python (FastAPI)
Library     : pdf2docx (BEST library for this task)
Route       : POST /api/tools/pdf-to-word
```
**Install**:
```bash
pip install pdf2docx
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/pdf-to-word`. Save uploaded PDF to temp file. Use pdf2docx.Converter: cv = Converter(pdf_path), cv.convert(docx_path, start=0, end=None), cv.close(). Return DOCX as StreamingResponse with media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'. Delete temp files in finally."

---

#### 🔧 TOOL 29: PDF TO POWERPOINT (.pptx)
```
Language    : Python (FastAPI)
Library     : pdf2image + python-pptx
Route       : POST /api/tools/pdf-to-pptx
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/pdf-to-pptx`. Convert each PDF page to high-res image (300 DPI) using pdf2image.convert_from_path(). Create python-pptx Presentation with slide size matching PDF page size. For each page image: add new slide with blank layout, add picture filling the entire slide. Save PPTX. Return as StreamingResponse."

---

#### 🔧 TOOL 30: PDF TO EXCEL (.xlsx)
```
Language    : Python (FastAPI)
Library     : camelot-py (table extraction) + openpyxl
Route       : POST /api/tools/pdf-to-excel
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/pdf-to-excel`. Use camelot.read_pdf(path, pages='all', flavor='lattice') to extract tables. If lattice fails, try flavor='stream'. Create openpyxl workbook. For each extracted table: create new sheet named 'Table_N'. Write headers and data rows. Apply basic styling (bold headers, auto column width). Save and return XLSX."

---

#### 🔧 TOOL 31: PDF TO JPG / PNG / BMP / TIFF / GIF
```
Language    : Python (FastAPI)
Library     : pdf2image (Poppler wrapper)
Route       : POST /api/tools/pdf-to-image
Body        : file (PDF), format (jpg|png|bmp|tiff|gif), dpi (72|150|200|300)
```
**Exact Python Usage**:
```python
from pdf2image import convert_from_path
images = convert_from_path(pdf_path, dpi=200, fmt='jpeg')
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/pdf-to-image`. Accept PDF and parameters: format (jpg/png/bmp/tiff/gif), dpi (72-300). Convert using pdf2image.convert_from_path() with specified DPI and format. If single page: return image directly. If multiple pages: create ZIP using zipfile module, add all images named page_001.jpg etc, return ZIP as StreamingResponse."

---

#### 🔧 TOOL 32: PDF TO HTML
```
Language    : Node.js (pdf2htmlEX CLI)
Library     : pdf2htmlEX (system tool)
Route       : POST /api/tools/pdf-to-html
```
**Exact Command**:
```bash
pdf2htmlEX --zoom 1.5 --embed-css 1 --embed-font 1 \
  input.pdf output.html
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/pdf-to-html`. Save PDF to temp. Run pdf2htmlEX command using child_process.execFile. The tool creates HTML + CSS + font files. Collect all output files. If single HTML with embedded assets (use --embed flags): return HTML directly. Otherwise: zip all files and return ZIP."

---

#### 🔧 TOOL 33: PDF TO EPUB
```
Language    : Python (FastAPI)
Library     : Calibre (ebook-convert)
Route       : POST /api/tools/pdf-to-epub
```
**Command**:
```bash
ebook-convert input.pdf output.epub
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/pdf-to-epub`. Save PDF to temp. Run ebook-convert subprocess. Return EPUB as StreamingResponse with media_type='application/epub+zip'."

---

#### 🔧 TOOL 34: PDF TO TXT
```
Language    : Python (FastAPI) — best text extraction
Library     : pdfplumber
Route       : POST /api/tools/pdf-to-txt
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/pdf-to-txt`. Use pdfplumber to open PDF. Extract text from each page using page.extract_text(). Join with '\n\n--- Page N ---\n\n' separators. Encode as UTF-8. Return as StreamingResponse with media_type='text/plain'. Handle scanned PDFs (None text) by returning message 'Page N: [Scanned page - no extractable text]'."

---

#### 🔧 TOOL 35: PDF TO CSV
```
Language    : Python (FastAPI)
Library     : camelot-py + csv module
Route       : POST /api/tools/pdf-to-csv
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/pdf-to-csv`. Use camelot to extract all tables. If single table: export directly as CSV. If multiple tables: create ZIP with table_1.csv, table_2.csv etc. Use pandas df.to_csv() or camelot table.to_csv() for export. Return file."

---

#### 🔧 TOOL 36: PDF TO SVG
```
Language    : Node.js (Inkscape or pdf2svg CLI)
Library     : pdf2svg (system) or Inkscape
Route       : POST /api/tools/pdf-to-svg
```
**Install**:
```bash
sudo apt-get install pdf2svg
```
**Command**:
```bash
pdf2svg input.pdf output_%d.svg all   # %d for page numbers
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/pdf-to-svg`. Run pdf2svg command. For single-page PDF: return SVG directly. For multi-page: zip all SVG files and return ZIP."

---

#### 🔧 TOOL 37: PDF TO MOBI
```
Language    : Python (FastAPI)
Library     : Calibre
Route       : POST /api/tools/pdf-to-mobi
Command     : ebook-convert input.pdf output.mobi
```

---

#### 🔧 TOOL 38: PDF TO PDF/A (Archival Format)
```
Language    : Node.js (Ghostscript)
Library     : Ghostscript
Route       : POST /api/tools/pdf-to-pdfa
```
**Exact Command**:
```bash
gs -dBATCH -dNOPAUSE -dCompatibilityLevel=1.4 \
   -dPDFA=2 -dPDFACompatibilityPolicy=1 \
   -sDEVICE=pdfwrite \
   -sOutputFile=output_pdfa.pdf \
   -dNOOUTERSAVE /usr/share/ghostscript/PDFA_def.ps \
   input.pdf
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/pdf-to-pdfa`. Run Ghostscript with PDF/A-2b compliance settings. Include PDFA_def.ps file path. Handle Ghostscript version differences. Return compliant PDF/A file."

---

#### 🔧 TOOL 39: PDF TO ODT / RTF
```
Language    : Python (FastAPI)
Library     : LibreOffice (headless)
Route       : POST /api/tools/pdf-to-odt
```
**Command**:
```bash
libreoffice --headless --convert-to odt input.pdf
libreoffice --headless --convert-to rtf input.pdf
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint for PDF to ODT/RTF. Use subprocess to run LibreOffice headless conversion. Accept 'format' parameter (odt or rtf). Run appropriate libreoffice command. Return converted file."

---

### ═══════════════════════════════════
### ✏️ CATEGORY 4: EDIT PDF (13 Tools)
### ═══════════════════════════════════

---

#### 🔧 TOOL 40: EDIT PDF (Add Text, Images, Shapes)
```
Language    : Node.js
Library     : pdf-lib + @pdf-lib/fontkit
Route       : POST /api/tools/edit-pdf
Body        : file (PDF), operations (JSON array of edit operations)
```
**Operations JSON Format**:
```json
[
  {"type": "text", "page": 1, "x": 100, "y": 200, "text": "Hello", "size": 14, "color": "#000000"},
  {"type": "image", "page": 1, "x": 50, "y": 100, "width": 200, "height": 150, "imageData": "base64..."},
  {"type": "rectangle", "page": 1, "x": 10, "y": 10, "width": 100, "height": 50, "color": "#FF0000"},
  {"type": "line", "page": 1, "x1": 0, "y1": 0, "x2": 100, "y2": 100, "color": "#000000"}
]
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/edit-pdf`. Accept PDF and JSON array of operations. Load PDF with pdf-lib. For each operation: (1) text — embed font, drawText with x,y,size,color; (2) image — embedJpg/Png, drawImage; (3) rectangle — drawRectangle; (4) line — drawLine; (5) circle — drawEllipse. PDF coordinates are bottom-left origin — convert from top-left if needed (y = pageHeight - y - elementHeight). Return modified PDF."

---

#### 🔧 TOOL 41: WATERMARK PDF
```
Language    : Node.js
Library     : pdf-lib + @pdf-lib/fontkit
Route       : POST /api/tools/watermark
Body        : file (PDF), type (text|image), text/imageData, opacity, rotation, position
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/watermark`. For text watermark: embed font, calculate center of each page, rotate text using pdf-lib's rotation option, set opacity using drawText with opacity parameter, apply to all pages. For image watermark: embedPng/Jpg, calculate position (center/corner based on 'position' param), draw with opacity. Apply to every page. Return watermarked PDF."

---

#### 🔧 TOOL 42: PAGE NUMBERS
```
Language    : Node.js
Library     : pdf-lib
Route       : POST /api/tools/page-numbers
Body        : file (PDF), position (bottom-center|bottom-right|top-center etc), startNumber, format (Page N|N|N of M)
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/page-numbers`. Load PDF with pdf-lib. For each page: embed Helvetica font, determine x,y position based on 'position' parameter (bottom-center = pageWidth/2, 20), draw page number text formatted as specified (e.g. 'Page 1 of 10'). Return PDF."

---

#### 🔧 TOOL 43: HEADER & FOOTER
```
Language    : Node.js
Library     : pdf-lib
Route       : POST /api/tools/header-footer
Body        : file, headerText, footerText, headerLeft/Center/Right, footerLeft/Center/Right, fontSize
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/header-footer`. Load PDF with pdf-lib. For each page: draw header text at top (y = pageHeight - 30) and footer text at bottom (y = 20). Support three-column layout: left, center, right aligned text. Draw a thin horizontal line separating header/footer from content. Return PDF."

---

#### 🔧 TOOL 44: SIGN PDF
```
Language    : Node.js
Library     : pdf-lib (for visual signature) + Fabric.js (frontend canvas)
Route       : POST /api/tools/sign-pdf
Body        : file (PDF), signatureImage (base64 PNG from canvas), page, x, y, width, height
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/sign-pdf`. Accept PDF and signature image as base64 PNG (drawn on canvas in frontend). Decode base64 to buffer. Load PDF with pdf-lib. Embed PNG image. Draw on specified page at x,y with given width,height. Note: PDF coordinates are bottom-left — convert y from top-left (y_pdf = pageHeight - y_top - height). Return signed PDF."

---

#### 🔧 TOOL 45: ANNOTATE PDF / HIGHLIGHT PDF
```
Language    : Node.js
Library     : pdf-lib (basic) + hummus-recipe (advanced annotations)
Route       : POST /api/tools/annotate
Body        : file, annotations (JSON array with type, page, coordinates, color, text)
```
**Install**:
```bash
npm install hummus-recipe
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/annotate`. Accept annotations array with types: highlight (yellow rectangle overlay with opacity 0.3), underline (line below text), comment (yellow sticky note icon), strikethrough (line through text). Use hummus-recipe or pdf-lib to add visual overlays for each annotation. Return annotated PDF."

---

#### 🔧 TOOL 46: PDF FILLER (Fill Forms)
```
Language    : Node.js
Library     : pdf-lib (AcroForm support)
Route       : POST /api/tools/fill-form
Body        : file (PDF with form fields), formData (JSON key-value pairs)
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/fill-form`. Load PDF using pdf-lib. Get form: const form = pdfDoc.getForm(). Get all fields: form.getFields(). For each field name in formData: getTextField(name).setText(value) for text fields, getCheckBox(name).check()/uncheck() for checkboxes, getDropdown(name).select(value) for dropdowns. Flatten form after filling: form.flatten(). Return filled PDF."

---

#### 🔧 TOOL 47: ADD IMAGE TO PDF
```
Language    : Node.js
Library     : pdf-lib
Route       : POST /api/tools/add-image
Body        : pdfFile, imageFile, page, x, y, width, height
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/add-image`. Accept PDF and image file upload. Detect image type using mime-types. Load PDF with pdf-lib. Embed image using embedJpg() or embedPng() based on type. Draw on specified page at given coordinates and dimensions. Return modified PDF."

---

### ═══════════════════════════════════
### 🔒 CATEGORY 5: SECURITY (6 Tools)
### ═══════════════════════════════════

---

#### 🔧 TOOL 48: PROTECT PDF (Add Password)
```
Language    : Node.js
Library     : pdf-lib (encryption support) OR pikepdf (Python — better)
Route       : POST /api/tools/protect
Body        : file (PDF), userPassword, ownerPassword, permissions
```
**Python with pikepdf** (recommended — better encryption):
```bash
pip install pikepdf
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/protect-pdf`. Use pikepdf: pdf = pikepdf.open(input_path). Set encryption: pikepdf.Encryption(owner=ownerPassword, user=userPassword, R=6, allow=pikepdf.Permissions(extract=False, modify_annotation=False, print_lowres=True)). pdf.save(output_path, encryption=enc_settings). Return protected PDF."

---

#### 🔧 TOOL 49: UNLOCK PDF (Remove Password)
```
Language    : Python (FastAPI)
Library     : pikepdf
Route       : POST /api/tools/unlock
Body        : file (PDF), password
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/unlock-pdf`. Try: pikepdf.open(input_path, password=password). If PasswordError: return 401 with message 'Wrong password'. If opened successfully: save without encryption: pdf.save(output_path). Return unlocked PDF."

---

#### 🔧 TOOL 50: REDACT PDF
```
Language    : Python (FastAPI)
Library     : pikepdf + Pillow (for image-based redaction)
Route       : POST /api/tools/redact
Body        : file (PDF), redactions (JSON: [{page, x, y, width, height}])
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/redact-pdf`. Accept PDF and array of redaction rectangles with page numbers. For each redaction: convert PDF page to image, draw solid black rectangle over specified area, convert back. OR use pikepdf to add black rectangle annotation and flatten. Ensure text underneath is actually removed (not just covered). Flatten all annotations. Return redacted PDF."

---

#### 🔧 TOOL 51: FLATTEN PDF
```
Language    : Python (FastAPI)
Library     : pikepdf
Route       : POST /api/tools/flatten
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/flatten-pdf`. Open PDF with pikepdf. Iterate through all pages and annotations. Flatten all form fields and annotations using pikepdf's annotation removal. Alternatively use Ghostscript: ['gs', '-dBATCH', '-dNOPAUSE', '-sDEVICE=pdfwrite', '-dFastWebView=false', '-sOutputFile=output.pdf', 'input.pdf']. Return flattened PDF."

---

#### 🔧 TOOL 52: REMOVE METADATA
```
Language    : Python (FastAPI)
Library     : pikepdf
Route       : POST /api/tools/remove-metadata
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/remove-metadata`. Open with pikepdf. Access pdf.docinfo and delete all entries: del pdf.docinfo['/Author'], del pdf.docinfo['/Creator'] etc. Also clear XMP metadata: pdf.Root.Metadata = pikepdf.Dictionary(). Save and return clean PDF."

---

#### 🔧 TOOL 53: EDIT METADATA
```
Language    : Python (FastAPI)
Library     : pikepdf
Route       : POST /api/tools/edit-metadata
Body        : file, title, author, subject, keywords, creator, producer
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/edit-metadata`. Open with pikepdf. Set docinfo fields: pdf.docinfo['/Title'] = title, pdf.docinfo['/Author'] = author, pdf.docinfo['/Subject'] = subject, pdf.docinfo['/Keywords'] = keywords. Set creation date. Save and return PDF."

---

### ═══════════════════════════════════
### 🤖 CATEGORY 6: AI & OTHERS (14 Tools)
### ═══════════════════════════════════

---

#### 🔧 TOOL 54: OCR PDF
```
Language    : Python (FastAPI)
Library     : pytesseract + pdf2image + pikepdf (to embed searchable text)
Route       : POST /api/tools/ocr
Body        : file (PDF), language (eng|hin|ben|tam|tel)
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/ocr-pdf`. Convert each PDF page to high-res image (300 DPI) using pdf2image. Run pytesseract.image_to_pdf_or_hocr() on each page image to get searchable PDF layer. Merge all pages using pypdf. Return searchable PDF where text is selectable/copyable. Support language selection mapped to Tesseract lang codes (hin, eng, ben, tam, tel)."

---

#### 🔧 TOOL 55: COMPARE PDF
```
Language    : Python (FastAPI)
Library     : pdf2image + Pillow (pixel diff) + pikepdf (text diff)
Route       : POST /api/tools/compare
Body        : file1 (PDF), file2 (PDF)
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/compare-pdf`. Accept two PDFs. For each page pair: convert to images, use Pillow ImageChops.difference() to find pixel differences, highlight differences in red. Also extract text from both and find text differences using difflib. Return: (1) a comparison PDF with highlighted differences, (2) JSON summary with number of different pages, changed text summary."

---

#### 🔧 TOOL 56: TRANSLATE PDF
```
Language    : Python (FastAPI)
Library     : pdfplumber (text extract) + deep-translator (free) + reportlab (rebuild PDF)
Route       : POST /api/tools/translate
Body        : file (PDF), sourceLang, targetLang (hi, en, bn, ta, te, mr, gu etc)
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/translate-pdf`. (1) Extract text from each page using pdfplumber preserving paragraph structure. (2) Translate using GoogleTranslator from deep-translator: GoogleTranslator(source=sourceLang, target=targetLang).translate(text). Translate in chunks max 4000 chars. (3) Rebuild PDF using reportlab with translated text and similar layout. Use appropriate Unicode fonts for Hindi/Bengali/Tamil. Return translated PDF."

---

#### 🔧 TOOL 57: CHAT WITH PDF
```
Language    : Python (FastAPI)
Library     : langchain + OpenAI/Gemini + faiss-cpu (vector search)
Route       : POST /api/tools/chat (init) + POST /api/tools/chat/ask
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoints for PDF chat: (1) POST /api/tools/chat/init — accept PDF, extract text using pdfplumber, split into chunks using RecursiveCharacterTextSplitter(chunk_size=1000), create embeddings using OpenAIEmbeddings or HuggingFace embeddings (free), store in FAISS vector store, save to session/cache with UUID, return session_id. (2) POST /api/tools/chat/ask — accept session_id and question, load FAISS from cache, find relevant chunks using similarity_search(), send chunks + question to OpenAI/Gemini API, return answer with source page references."

---

#### 🔧 TOOL 58: SUMMARIZE PDF
```
Language    : Python (FastAPI)
Library     : pdfplumber + OpenAI / Gemini API
Route       : POST /api/tools/summarize
Body        : file (PDF), length (brief|detailed), language (en|hi)
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/summarize-pdf`. Extract full text using pdfplumber. If text > 12000 chars, extract key portions (first, middle, last sections). Send to OpenAI/Gemini API with system prompt: 'You are a document summarizer. Create a {length} summary of the document in {language}. Include: key topics, main points, conclusions. Format with bullet points.' Return summary as JSON with keys: summary, keyPoints[], wordCount, pageCount."

---

#### 🔧 TOOL 59: REPAIR PDF
```
Language    : Python (FastAPI)
Library     : pikepdf (best for repair) + Ghostscript (alternative)
Route       : POST /api/tools/repair
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/repair-pdf`. Try: pikepdf.open(path, suppress_warnings=True). If successful: save to new file (this reconstructs the PDF structure). If pikepdf fails: try Ghostscript: ['gs', '-dBATCH', '-dNOPAUSE', '-sDEVICE=pdfwrite', '-sOutputFile=output.pdf', 'input.pdf']. Return repaired PDF or error message with what was found."

---

#### 🔧 TOOL 60: SCAN TO PDF
```
Language    : JavaScript (Frontend-only — camera API)
Library     : MediaDevices API + Tesseract.js + pdf-lib
Note        : Yeh mostly frontend tool hai — backend sirf enhance karta hai
Route       : POST /api/tools/scan-enhance (optional)
```
**Prompt for Claude/AI to write code**:
> "This tool is primarily frontend. Write a frontend JavaScript module that: (1) Opens camera using navigator.mediaDevices.getUserMedia(). (2) Captures photo using canvas. (3) Applies image enhancement: increase contrast, deskew if tilted. (4) Uses pdf-lib to embed image in A4 PDF. (5) Optionally sends to backend /api/tools/scan-enhance for server-side enhancement using sharp."

---

#### 🔧 TOOL 61: PDF VIEWER
```
Language    : JavaScript (Frontend-only)
Library     : PDF.js (Mozilla)
Route       : No backend needed — pure frontend
```
**Prompt for Claude/AI to write code**:
> "Integrate PDF.js viewer in frontend: (1) Load pdfjs-dist. (2) Set workerSrc to CDN URL. (3) Create canvas element. (4) Use pdfjsLib.getDocument({data: arrayBuffer}) to load PDF. (5) Render each page on canvas. (6) Add navigation controls (previous/next page), zoom in/out (scale parameter in page.render()), fullscreen mode. (7) Support text layer for selection using pdfjsLib TextLayer."

---

#### 🔧 TOOL 62: CREATE PDF (FROM SCRATCH)
```
Language    : Node.js
Library     : pdf-lib
Route       : POST /api/tools/create-pdf
Body        : pages (array of content: text, images), pageSize, font, color
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/create-pdf`. Accept JSON body with pages array, each page having: title, body text, images (base64). Create new PDFDocument with pdf-lib. For each page: add page with specified size (A4 default), draw title with larger font, draw body text with word wrap, embed and draw images. Add page numbers at bottom. Return new PDF."

---

#### 🔧 TOOL 63: RESIZE PAGES
```
Language    : Node.js
Library     : pdf-lib
Route       : POST /api/tools/resize-pages
Body        : file (PDF), size (A4|A3|Letter|Custom), width, height (for custom)
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/resize-pages`. Load PDF with pdf-lib. For each page: get current page size, set new size using page.setSize(width, height). Scale content to fit using page.scaleContent(scaleX, scaleY) if needed. Map preset sizes to points: A4=595x842, A3=842x1191, Letter=612x792. Return resized PDF."

---

#### 🔧 TOOL 64: EXTRACT TEXT
```
Language    : Python (FastAPI)
Library     : pdfplumber
Route       : POST /api/tools/extract-text
Body        : file (PDF), pages (all|specific), format (plain|json|markdown)
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/extract-text`. Use pdfplumber.open(). For each page: extract_text() for plain, extract_words() for word positions, extract_tables() for table data. Format output as: plain text with page breaks, or JSON with page-by-page structure including text, words with positions, table data. Return as downloadable .txt or .json file."

---

#### 🔧 TOOL 65: EXTRACT IMAGES
```
Language    : Python (FastAPI)
Library     : pikepdf + Pillow
Route       : POST /api/tools/extract-images
```
**Prompt for Claude/AI to write code**:
> "Write Python FastAPI endpoint `POST /api/tools/extract-images`. Open PDF with pikepdf. Iterate pages: page.images — get each image resource. Access image data using pikepdf.PdfImage(image_obj). Export using pdfimage.as_pil_image(). Save as PNG/JPG to temp folder. Create ZIP of all extracted images. Return ZIP. Include image info (page number, dimensions, format) in a manifest.json inside ZIP."

---

#### 🔧 TOOL 66: WHITEOUT PDF
```
Language    : Node.js
Library     : pdf-lib
Route       : POST /api/tools/whiteout
Body        : file (PDF), areas (JSON: [{page, x, y, width, height}])
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/whiteout`. Load PDF with pdf-lib. For each whiteout area: drawRectangle with white fill color (rgb(1,1,1)) and no border, at specified coordinates. Flatten document. Return modified PDF. Note: this only visually covers — for permanent redaction use the Redact tool which uses image-based approach."

---

#### 🔧 TOOL 67: GRAYSCALE PDF
```
Language    : Python (FastAPI) or Node.js (Ghostscript)
Library     : Ghostscript
Route       : POST /api/tools/grayscale
```
**Exact Ghostscript Command**:
```bash
gs -sOutputFile=output_gray.pdf \
   -sDEVICE=pdfwrite \
   -sColorConversionStrategy=Gray \
   -dProcessColorModel=/DeviceGray \
   -dCompatibilityLevel=1.4 \
   -dNOPAUSE -dBATCH \
   input.pdf
```
**Prompt for Claude/AI to write code**:
> "Write Node.js route `POST /api/tools/grayscale`. Run Ghostscript command with Gray color conversion strategy. This converts all colors to grayscale. Spawn process, wait for completion. Return grayscale PDF."

---

## 🌐 STEP 8 — BACKEND SERVER MAIN FILE SETUP

**Prompt for Claude/AI to write main server.js**:
> "Write a Node.js Express server.js file for ishu-pdf-backend that: (1) Loads dotenv. (2) Imports express, cors, helmet, compression, morgan. (3) Sets up CORS to allow requests from process.env.FRONTEND_URL. (4) Sets up multer storage in temp/ folder with UUID filenames. (5) Sets file size limit to 100MB. (6) Mounts all routers: require('./src/routes/organize'), require('./src/routes/convert'), require('./src/routes/edit'), require('./src/routes/security'), require('./src/routes/ai-tools'). (7) Sets up global error handler middleware. (8) Sets up node-cron job that runs every 30 minutes to delete files older than 30 minutes from temp/ folder. (9) Starts server on process.env.PORT."

---

## 🐍 STEP 9 — PYTHON FASTAPI SERVER SETUP

**Prompt for Claude/AI to write Python main.py**:
> "Write a Python FastAPI main.py that: (1) Creates FastAPI app with CORS middleware allowing frontend URL. (2) Includes routers: pdf_to_word, pdf_to_image, epub_to_pdf, ebook_to_pdf, ocr, compare, translate, chat, summarize, repair, protect, unlock, redact, extract_text, extract_images, pdf_to_excel, pdf_to_pptx. (3) Has /health endpoint returning {'status': 'ok'}. (4) Runs with uvicorn on port 5001. (5) Has background task to clean temp files every 30 minutes."

---

## 🔗 STEP 10 — FRONTEND INTEGRATION

### API Base URLs to set in Frontend:
```javascript
// frontend mein yeh add karo (already built frontend ko update karo sirf API URLs ke liye)
const NODE_API = 'https://your-server.com:5000/api/tools';
const PYTHON_API = 'https://your-server.com:5001/api/tools';

// Tool routing:
// Node.js server → Organize, Edit, Security, basic conversions
// Python server → AI tools, PDF-to-Word, OCR, Translate, Excel extraction
```

### CORS Headers Fix (if needed):
```bash
# backend .env mein update karo
FRONTEND_URL=https://ishu.yourdomain.com

# Development ke liye
FRONTEND_URL=http://localhost:3000
```

---

## 🚀 STEP 11 — DEPLOYMENT COMMANDS

```bash
# ══════════════════════════════
# NODE.JS BACKEND START
# ══════════════════════════════
cd backend
npm install
node server.js

# Production (PM2 use karo)
npm install -g pm2
pm2 start server.js --name "ishu-node-backend"
pm2 startup
pm2 save

# ══════════════════════════════
# PYTHON BACKEND START
# ══════════════════════════════
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 5001 --workers 4

# Production (PM2 with Python)
pm2 start "uvicorn main:app --host 0.0.0.0 --port 5001" \
  --name "ishu-python-backend" \
  --interpreter ./venv/bin/python

# ══════════════════════════════
# NGINX REVERSE PROXY (Optional)
# ══════════════════════════════
# /etc/nginx/sites-available/ishu
# server {
#   location /api/node/ { proxy_pass http://localhost:5000/; }
#   location /api/python/ { proxy_pass http://localhost:5001/; }
# }
```

---

## ⚡ STEP 12 — QUICK TOOL REFERENCE TABLE

| # | Tool Name | Language | Primary Library | Route |
|---|-----------|----------|-----------------|-------|
| 1 | Merge PDF | Node.js | pdf-lib | POST /api/tools/merge |
| 2 | Split PDF | Node.js | pdf-lib | POST /api/tools/split |
| 3 | Compress PDF | Node.js | Ghostscript CLI | POST /api/tools/compress |
| 4 | Organize PDF | Node.js | pdf-lib + SortableJS | POST /api/tools/organize |
| 5 | Rotate PDF | Node.js | pdf-lib | POST /api/tools/rotate |
| 6 | Crop PDF | Node.js | pdf-lib | POST /api/tools/crop |
| 7 | Delete Pages | Node.js | pdf-lib | POST /api/tools/delete-pages |
| 8 | Extract Pages | Node.js | pdf-lib | POST /api/tools/extract-pages |
| 9 | Word to PDF | Node.js | libreoffice-convert | POST /api/tools/word-to-pdf |
| 10 | PPT to PDF | Node.js | libreoffice-convert | POST /api/tools/pptx-to-pdf |
| 11 | Excel to PDF | Node.js | libreoffice-convert | POST /api/tools/excel-to-pdf |
| 12 | JPG/PNG to PDF | Node.js | sharp + pdf-lib | POST /api/tools/image-to-pdf |
| 13 | HTML to PDF | Node.js | Puppeteer | POST /api/tools/html-to-pdf |
| 14 | URL to PDF | Node.js | Puppeteer | POST /api/tools/url-to-pdf |
| 15 | EPUB to PDF | Python | Calibre CLI | POST /api/tools/epub-to-pdf |
| 16 | Markdown to PDF | Node.js | marked + Puppeteer | POST /api/tools/md-to-pdf |
| 17 | TXT to PDF | Node.js | pdf-lib | POST /api/tools/txt-to-pdf |
| 18 | CSV to PDF | Node.js | papaparse + jspdf | POST /api/tools/csv-to-pdf |
| 19 | SVG to PDF | Node.js | Inkscape CLI | POST /api/tools/svg-to-pdf |
| 20 | HEIC/HEIF to PDF | Node.js | sharp + pdf-lib | POST /api/tools/heic-to-pdf |
| 21 | WebP/BMP/GIF to PDF | Node.js | sharp + pdf-lib | POST /api/tools/image-to-pdf |
| 22 | TIFF to PDF | Node.js | sharp + pdf-lib | POST /api/tools/tiff-to-pdf |
| 23 | DjVu to PDF | Node.js | ddjvu CLI | POST /api/tools/djvu-to-pdf |
| 24 | MOBI/FB2/CBZ/CBR to PDF | Python | Calibre CLI | POST /api/tools/ebook-to-pdf |
| 25 | ODT/RTF/WPS to PDF | Node.js | libreoffice-convert | POST /api/tools/document-to-pdf |
| 26 | DWG/DXF to PDF | Node.js | Inkscape + CloudConvert | POST /api/tools/cad-to-pdf |
| 27 | XML to PDF | Node.js | fast-xml-parser + Puppeteer | POST /api/tools/xml-to-pdf |
| 28 | EML to PDF | Node.js | mailparser + Puppeteer | POST /api/tools/eml-to-pdf |
| 29 | ZIP to PDF | Node.js | unzipper + pdf-lib | POST /api/tools/zip-to-pdf |
| 30 | AI to PDF | Node.js | Inkscape/Ghostscript | POST /api/tools/ai-to-pdf |
| 31 | PDF to Word | Python | pdf2docx | POST /api/tools/pdf-to-word |
| 32 | PDF to PPT | Python | pdf2image + python-pptx | POST /api/tools/pdf-to-pptx |
| 33 | PDF to Excel | Python | camelot-py + openpyxl | POST /api/tools/pdf-to-excel |
| 34 | PDF to JPG/PNG | Python | pdf2image | POST /api/tools/pdf-to-image |
| 35 | PDF to HTML | Node.js | pdf2htmlEX CLI | POST /api/tools/pdf-to-html |
| 36 | PDF to EPUB | Python | Calibre CLI | POST /api/tools/pdf-to-epub |
| 37 | PDF to TXT | Python | pdfplumber | POST /api/tools/pdf-to-txt |
| 38 | PDF to CSV | Python | camelot-py | POST /api/tools/pdf-to-csv |
| 39 | PDF to SVG | Node.js | pdf2svg CLI | POST /api/tools/pdf-to-svg |
| 40 | PDF to MOBI | Python | Calibre CLI | POST /api/tools/pdf-to-mobi |
| 41 | PDF to PDF/A | Node.js | Ghostscript CLI | POST /api/tools/pdf-to-pdfa |
| 42 | PDF to ODT/RTF | Python | LibreOffice CLI | POST /api/tools/pdf-to-odt |
| 43 | Edit PDF | Node.js | pdf-lib | POST /api/tools/edit-pdf |
| 44 | Watermark | Node.js | pdf-lib | POST /api/tools/watermark |
| 45 | Page Numbers | Node.js | pdf-lib | POST /api/tools/page-numbers |
| 46 | Header & Footer | Node.js | pdf-lib | POST /api/tools/header-footer |
| 47 | Sign PDF | Node.js | pdf-lib | POST /api/tools/sign-pdf |
| 48 | Annotate PDF | Node.js | pdf-lib | POST /api/tools/annotate |
| 49 | PDF Filler | Node.js | pdf-lib | POST /api/tools/fill-form |
| 50 | Add Image to PDF | Node.js | pdf-lib | POST /api/tools/add-image |
| 51 | Protect PDF | Python | pikepdf | POST /api/tools/protect |
| 52 | Unlock PDF | Python | pikepdf | POST /api/tools/unlock |
| 53 | Redact PDF | Python | pikepdf + Pillow | POST /api/tools/redact |
| 54 | Flatten PDF | Python | pikepdf | POST /api/tools/flatten |
| 55 | Remove Metadata | Python | pikepdf | POST /api/tools/remove-metadata |
| 56 | Edit Metadata | Python | pikepdf | POST /api/tools/edit-metadata |
| 57 | OCR PDF | Python | pytesseract + pdf2image | POST /api/tools/ocr |
| 58 | Compare PDF | Python | pdf2image + Pillow | POST /api/tools/compare |
| 59 | Translate PDF | Python | pdfplumber + deep-translator | POST /api/tools/translate |
| 60 | Chat with PDF | Python | LangChain + OpenAI/Gemini | POST /api/tools/chat |
| 61 | Summarize PDF | Python | pdfplumber + OpenAI/Gemini | POST /api/tools/summarize |
| 62 | Repair PDF | Python | pikepdf | POST /api/tools/repair |
| 63 | Scan to PDF | Frontend | camera API + pdf-lib | (Frontend only) |
| 64 | PDF Viewer | Frontend | PDF.js | (Frontend only) |
| 65 | Create PDF | Node.js | pdf-lib | POST /api/tools/create-pdf |
| 66 | Resize Pages | Node.js | pdf-lib | POST /api/tools/resize-pages |
| 67 | Extract Text | Python | pdfplumber | POST /api/tools/extract-text |
| 68 | Extract Images | Python | pikepdf + Pillow | POST /api/tools/extract-images |
| 69 | Whiteout PDF | Node.js | pdf-lib | POST /api/tools/whiteout |
| 70 | Grayscale PDF | Node.js | Ghostscript CLI | POST /api/tools/grayscale |

---

## 🛡️ STEP 13 — ERROR HANDLING STRATEGY

**Prompt for Claude/AI to write error middleware**:
> "Write Express.js global error handler middleware for ishu-pdf-backend that: (1) Catches multer errors (file too large → 413, wrong file type → 415). (2) Catches conversion errors (LibreOffice/Ghostscript failed → 500 with message). (3) Catches file not found errors → 404. (4) For all errors: delete any temp files that were created. (5) Return JSON: {success: false, error: message, code: statusCode}. (6) Log errors to winston logger with file path and timestamp."

---

## 🧹 STEP 14 — TEMP FILE CLEANUP

**Prompt for Claude/AI to write cleanup utility**:
> "Write a Node.js utility cleanupTempFiles() using node-cron that: (1) Runs every 15 minutes using cron schedule '*/15 * * * *'. (2) Reads all files in ./temp/ folder using fs.readdirSync(). (3) Checks file creation time using fs.statSync(file).birthtimeMs. (4) Deletes files older than 30 minutes using fs.unlinkSync(). (5) Logs how many files were deleted. Import and call this in server.js startup."

---

## 📊 FINAL SUMMARY

```
Total Tools  : 103+
Node.js Tools: ~55 tools
Python Tools : ~35 tools
Frontend-only: ~5 tools (Scan, Viewer)
Shared/Both  : ~8 tools

System Tools needed:
  ✅ LibreOffice  → Word/PPT/Excel/ODT/RTF conversions
  ✅ Ghostscript  → Compress/Grayscale/PDF-A
  ✅ Poppler      → PDF info, PDF to image
  ✅ Tesseract    → OCR
  ✅ Inkscape     → SVG/AI/DXF to PDF
  ✅ Calibre      → All eBook formats
  ✅ Puppeteer    → HTML/URL to PDF
  ✅ pdf2svg      → PDF to SVG
  ✅ pdf2htmlEX   → PDF to HTML
  ✅ ddjvu        → DjVu to PDF
  ✅ Redis        → Job queue

AI APIs (Optional but recommended):
  🔑 OpenAI API Key  → Chat, Summarize, Translate
  🔑 Gemini API Key  → Free alternative
  🔑 CloudConvert    → DWG/DXF fallback
```

---

> **Made for ISHU — Indian StudentHub University**  
> **All 103+ tools fully working implementation guide**  
> **Frontend already built → Sirf backend banana hai → Follow this guide**
