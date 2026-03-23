# 🚀 ISHU PDF Tools — Complete Backend Master Guide
> **ISHU — Indian StudentHub University**  
> 103+ PDF Tools ka Poora Backend Setup — Libraries, Commands, Architecture, aur Tool-wise Details

---

## ⚠️ IMPORTANT NOTE (Pehle Padho)

> **Frontend already bana hua hai.** Yeh guide sirf **Backend** ke liye hai.  
> Sabse pehle `backend/` folder banao, phir sab kaam us folder ke andar hoga.  
> **Code khud likhna hai — yeh guide sirf roadmap, commands, aur architecture deti hai.**

---

## 📁 STEP 1 — Backend Folder Structure Banao

Terminal mein yeh commands run karo **project root** mein (jahan frontend folder hai):

```
mkdir backend
cd backend
mkdir routes controllers middlewares utils uploads outputs temp config
mkdir -p services/pdf services/convert services/edit services/security services/ai
```

Final folder structure aisi hogi:

```
project-root/
├── frontend/          ← Already bana hua hai, mat chhuo
└── backend/           ← Sab kaam yahan hoga
    ├── server.js
    ├── package.json
    ├── .env
    ├── config/
    │   └── constants.js
    ├── routes/
    │   ├── organizeRoutes.js
    │   ├── convertRoutes.js
    │   ├── editRoutes.js
    │   ├── securityRoutes.js
    │   └── aiRoutes.js
    ├── controllers/
    │   ├── organizeController.js
    │   ├── convertController.js
    │   ├── editController.js
    │   ├── securityController.js
    │   └── aiController.js
    ├── services/
    │   ├── pdf/
    │   ├── convert/
    │   ├── edit/
    │   ├── security/
    │   └── ai/
    ├── middlewares/
    │   ├── upload.js       ← multer file upload
    │   ├── errorHandler.js
    │   └── rateLimit.js
    ├── utils/
    │   ├── fileHelper.js
    │   └── cleanup.js
    ├── uploads/           ← temporary uploaded files
    ├── outputs/           ← processed files
    └── temp/              ← intermediate processing files
```

---

## 📦 STEP 2 — Backend Main Language & Framework

| Component | Technology |
|-----------|-----------|
| **Primary Backend Language** | **Node.js (JavaScript)** |
| **Framework** | **Express.js** |
| **File Upload** | Multer |
| **Secondary Processing** | **Python** (for heavy PDF tasks via child_process) |
| **Queue System** | Bull + Redis (for large file processing) |
| **API Type** | REST API |

### Node.js Project Initialize karo:

```bash
cd backend
npm init -y
```

---

## 📥 STEP 3 — Sabse Pehle System-Level Tools Install Karo

Yeh tools OS level par install honge (npm se nahi). Inke bina kuch kaam nahi karega.

### A) LibreOffice (Word/Excel/PPT to PDF ke liye MUST)
```bash
# Ubuntu/Debian (Server)
sudo apt-get update
sudo apt-get install -y libreoffice

# Test karo
libreoffice --version
```

### B) Ghostscript (PDF compression, merge, convert ke liye)
```bash
sudo apt-get install -y ghostscript

# Test karo
gs --version
```

### C) Poppler Utils (PDF to Image, PDF to Text ke liye)
```bash
sudo apt-get install -y poppler-utils

# Test karo
pdfinfo --version
pdftoppm -h
```

### D) Tesseract OCR (OCR PDF ke liye)
```bash
sudo apt-get install -y tesseract-ocr
sudo apt-get install -y tesseract-ocr-hin  # Hindi support
sudo apt-get install -y tesseract-ocr-eng  # English support

# Test karo
tesseract --version
```

### E) ImageMagick (Image processing ke liye)
```bash
sudo apt-get install -y imagemagick

# Policy file edit karo (PDF allow karne ke liye)
sudo nano /etc/ImageMagick-6/policy.xml
# Change: <policy domain="coder" rights="none" pattern="PDF" />
# To:     <policy domain="coder" rights="read|write" pattern="PDF" />

# Test karo
convert --version
```

### F) wkhtmltopdf (HTML/URL to PDF ke liye)
```bash
sudo apt-get install -y wkhtmltopdf

# Test karo
wkhtmltopdf --version
```

### G) Calibre (eBook conversions ke liye)
```bash
sudo apt-get install -y calibre

# Test karo
ebook-convert --version
```

### H) Python 3 + pip (Python libraries ke liye)
```bash
sudo apt-get install -y python3 python3-pip

# Test karo
python3 --version
pip3 --version
```

---

## 📥 STEP 4 — Python Libraries Install Karo

```bash
# Core PDF library
pip3 install PyMuPDF

# PDF manipulation
pip3 install pypdf

# PDF text extraction
pip3 install pdfplumber

# Word documents
pip3 install python-docx

# Excel processing
pip3 install openpyxl xlrd xlwt

# PowerPoint
pip3 install python-pptx

# Image processing
pip3 install Pillow

# EPUB handling
pip3 install ebooklib

# OCR
pip3 install pytesseract

# PDF table extraction
pip3 install camelot-py[cv]
pip3 install tabula-py

# HTML to PDF (Python side)
pip3 install weasyprint

# PDF/A conversion
pip3 install pikepdf

# RTF handling
pip3 install striprtf

# Markdown to PDF
pip3 install markdown2 reportlab

# DjVu handling (system level)
# sudo apt-get install -y djvulibre-bin

# AI/Translation
pip3 install googletrans==4.0.0rc1
pip3 install openai

# PDF comparison
pip3 install diffpdf

# Install sab ek saath bhi kar sakte ho:
pip3 install PyMuPDF pypdf pdfplumber python-docx openpyxl xlrd python-pptx Pillow ebooklib pytesseract camelot-py tabula-py weasyprint pikepdf striprtf markdown2 reportlab googletrans==4.0.0rc1 openai
```

---

## 📥 STEP 5 — Node.js (npm) Packages Install Karo

```bash
cd backend

# Core framework
npm install express

# File upload
npm install multer

# PDF libraries (JavaScript side)
npm install pdf-lib
npm install pdfkit
npm install pdf-parse
npm install pdftk-node  

# Office document handling
npm install libreoffice-convert
npm install officegen

# Image processing
npm install sharp
npm install jimp

# Archive/ZIP handling
npm install archiver
npm install unzipper

# EPUB
npm install epub-gen
npm install epub2

# HTML to PDF
npm install puppeteer
npm install html-pdf-node

# File system utilities
npm install fs-extra
npm install uuid
npm install path

# Security
npm install bcryptjs
npm install jsonwebtoken
npm install helmet
npm install cors
npm install express-rate-limit

# Queue (heavy processing ke liye)
npm install bull
npm install ioredis

# Environment variables
npm install dotenv

# Logging
npm install morgan
npm install winston

# Validation
npm install joi
npm install express-validator

# File type detection
npm install file-type
npm install mime-types

# Temporary file cleanup
npm install tmp
npm install node-schedule

# AI features ke liye
npm install openai
npm install @anthropic-ai/sdk

# Utilities
npm install axios
npm install cheerio
npm install node-fetch

# Install sab ek command mein:
npm install express multer pdf-lib pdfkit pdf-parse libreoffice-convert sharp jimp archiver unzipper epub-gen puppeteer html-pdf-node fs-extra uuid dotenv morgan winston joi express-rate-limit cors helmet bcryptjs jsonwebtoken bull ioredis file-type mime-types tmp node-schedule openai axios cheerio
```

---

## 📥 STEP 6 — Puppeteer (Chrome) Setup

```bash
# Puppeteer ke liye Chrome download hoga automatically
npx puppeteer browsers install chrome

# Ya manually:
npm install puppeteer --save
# Phir test karo:
node -e "const puppeteer = require('puppeteer'); puppeteer.launch().then(b => { console.log('Puppeteer OK'); b.close(); })"
```

---

## 🔧 STEP 7 — .env File Banao

`backend/.env` file mein yeh variables daalo:

```env
PORT=5000
NODE_ENV=development

# File paths
UPLOAD_DIR=./uploads
OUTPUT_DIR=./outputs
TEMP_DIR=./temp
MAX_FILE_SIZE=104857600

# Redis (Queue ke liye)
REDIS_HOST=localhost
REDIS_PORT=6379

# LibreOffice path
LIBREOFFICE_PATH=/usr/bin/libreoffice

# Tesseract path
TESSERACT_PATH=/usr/bin/tesseract

# Ghostscript path
GS_PATH=/usr/bin/gs

# wkhtmltopdf path
WKHTMLTOPDF_PATH=/usr/bin/wkhtmltopdf

# Puppeteer
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# AI keys (optional - AI tools ke liye)
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

# Frontend URL (CORS ke liye)
FRONTEND_URL=http://localhost:3000

# Cleanup schedule (auto delete files after X minutes)
FILE_CLEANUP_MINUTES=30
```

---

## 🗂️ STEP 8 — Tool-wise Detailed Breakdown (Sare 103 Tools)

---

### 📂 CATEGORY 1: ORGANIZE (7 Tools)

---

#### 🔧 Tool 1: Merge PDF
- **Kya karta hai:** Multiple PDFs ko ek mein combine karta hai
- **Language:** Node.js
- **Primary Library:** `pdf-lib`
- **Secondary:** Ghostscript (fallback)
- **API Endpoint:** `POST /api/organize/merge`
- **Input:** Multiple PDF files (multipart/form-data)
- **Output:** Single merged PDF
- **Process Flow:**
  1. Multer se files upload karo
  2. pdf-lib se `PDFDocument.create()` karo
  3. Har PDF ko load karo aur pages copy karo
  4. Merged document save karo
  5. Download URL return karo

**Antigravity Prompt:**
> "Create a Node.js Express route POST /api/organize/merge that accepts multiple PDF files via multer. Use pdf-lib library to merge all uploaded PDFs into one. Load each PDF with PDFDocument.load(), copy all pages using copyPages(), then save to output directory. Return JSON with download URL. Handle errors properly."

---

#### 🔧 Tool 2: Split PDF
- **Kya karta hai:** Ek PDF ko multiple PDFs mein split karta hai
- **Language:** Node.js
- **Primary Library:** `pdf-lib`
- **API Endpoint:** `POST /api/organize/split`
- **Input:** PDF file + split options (page ranges like "1-3,4-6")
- **Output:** Multiple PDFs as ZIP
- **Process Flow:**
  1. File upload + page range parse karo
  2. pdf-lib se original PDF load karo
  3. Har range ke liye new PDFDocument banao
  4. Pages copy karo respective documents mein
  5. ZIP mein pack karo, download URL return karo

**Antigravity Prompt:**
> "Create Express route POST /api/organize/split accepting one PDF and page range string like '1-3,4-7'. Use pdf-lib to load PDF, parse page ranges, create separate PDFDocument for each range, copy respective pages, save each as separate PDF. Zip all output PDFs using archiver and return download URL."

---

#### 🔧 Tool 3: Organize PDF (Sort/Reorder Pages)
- **Kya karta hai:** PDF pages ko reorder karta hai
- **Language:** Node.js
- **Primary Library:** `pdf-lib`
- **API Endpoint:** `POST /api/organize/organize`
- **Input:** PDF + new page order array (e.g., [3,1,2,4])
- **Output:** Reordered PDF

**Antigravity Prompt:**
> "Express route POST /api/organize/organize accepts PDF file and JSON array of new page order. Use pdf-lib to load PDF, create new document, add pages in the specified order using copyPages(). Save and return download URL."

---

#### 🔧 Tool 4: Rotate PDF
- **Kya karta hai:** Pages ko rotate karta hai (90, 180, 270 degrees)
- **Language:** Node.js
- **Primary Library:** `pdf-lib`
- **API Endpoint:** `POST /api/organize/rotate`
- **Input:** PDF + rotation degree + page selection
- **Output:** Rotated PDF

**Antigravity Prompt:**
> "Express route POST /api/organize/rotate accepts PDF, rotation angle (90/180/270), and page selection (all or specific pages array). Use pdf-lib, load PDF, call page.setRotation(degrees(angle)) for selected pages. Save and return download URL."

---

#### 🔧 Tool 5: Delete Pages
- **Kya karta hai:** Specific pages remove karta hai
- **Language:** Node.js
- **Primary Library:** `pdf-lib`
- **API Endpoint:** `POST /api/organize/delete-pages`
- **Input:** PDF + pages to delete array
- **Output:** PDF without deleted pages

**Antigravity Prompt:**
> "Express POST /api/organize/delete-pages. Accept PDF and array of page numbers to delete. Use pdf-lib to load PDF, create new document, copy all pages EXCEPT the ones in delete array. Save and return download URL."

---

#### 🔧 Tool 6: Rearrange Pages
- **Kya karta hai:** Drag-drop se pages reorder karna (same as Organize PDF)
- **Language:** Node.js
- **Primary Library:** `pdf-lib`
- **API Endpoint:** `POST /api/organize/rearrange`
- *(Same implementation as Organize PDF — different frontend UI)*

---

#### 🔧 Tool 7: Extract Pages
- **Kya karta hai:** Specific pages ko alag PDF mein extract karta hai
- **Language:** Node.js
- **Primary Library:** `pdf-lib`
- **API Endpoint:** `POST /api/organize/extract-pages`
- **Input:** PDF + page numbers to extract
- **Output:** New PDF with only extracted pages

**Antigravity Prompt:**
> "Express POST /api/organize/extract-pages. Accept PDF file and page numbers array. Use pdf-lib, create new PDFDocument, copy only specified pages from original. Save as new PDF and return download URL."

---

### 📂 CATEGORY 2: EDIT (13 Tools)

---

#### 🔧 Tool 8: Compress PDF
- **Kya karta hai:** PDF file size reduce karta hai
- **Language:** Node.js + Python (Ghostscript via child_process)
- **Primary Library:** Ghostscript (system command)
- **API Endpoint:** `POST /api/edit/compress`
- **Input:** PDF + quality level (screen/ebook/printer/prepress)
- **Output:** Compressed PDF
- **Ghostscript Command:**
  ```
  gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook 
     -dNOPAUSE -dQUIET -dBATCH -sOutputFile=output.pdf input.pdf
  ```
- **Quality Options:**
  - `/screen` = lowest quality, smallest size
  - `/ebook` = medium quality (recommended)
  - `/printer` = high quality
  - `/prepress` = highest quality

**Antigravity Prompt:**
> "Express POST /api/edit/compress. Accept PDF and quality option. Use Node.js child_process.execFile() to run Ghostscript command with appropriate -dPDFSETTINGS flag. Wait for process completion, then return compressed file download URL with original vs compressed size comparison."

---

#### 🔧 Tool 9: Crop PDF
- **Kya karta hai:** PDF pages ke margins crop karta hai
- **Language:** Python (PyMuPDF)
- **Primary Library:** `PyMuPDF (fitz)`
- **API Endpoint:** `POST /api/edit/crop`
- **Input:** PDF + crop box coordinates (x1, y1, x2, y2)
- **Output:** Cropped PDF

**Antigravity Prompt:**
> "Express POST /api/edit/crop. Accept PDF and crop coordinates JSON. Call Python script using child_process that uses PyMuPDF (fitz). In Python: open PDF with fitz.open(), for each page set page.set_cropbox(fitz.Rect(x1,y1,x2,y2)), save file. Return download URL."

---

#### 🔧 Tool 10: Edit PDF (General Annotations)
- **Kya karta hai:** PDF mein text, shapes, freehand drawing add karta hai
- **Language:** Node.js
- **Primary Library:** `pdf-lib`
- **API Endpoint:** `POST /api/edit/edit-pdf`
- **Input:** PDF + array of edit operations (text/shape/draw with coordinates)
- **Output:** Edited PDF

**Antigravity Prompt:**
> "Express POST /api/edit/edit-pdf. Accept PDF and JSON array of operations. Each operation has type (text/rectangle/ellipse), coordinates, content, color, font size. Use pdf-lib: load PDF, for each operation call page.drawText(), page.drawRectangle(), page.drawEllipse() at specified coordinates. Save and return download URL."

---

#### 🔧 Tool 11: Edit PDF Text
- **Kya karta hai:** Existing text ko directly edit karta hai
- **Language:** Python (PyMuPDF)
- **Primary Library:** `PyMuPDF (fitz)`
- **API Endpoint:** `POST /api/edit/edit-text`
- **Note:** True PDF text editing bahut complex hai. Approach: text ko whiteout karo + naya text overlay karo

**Antigravity Prompt:**
> "Express POST /api/edit/edit-text. Accept PDF, text to find, replacement text, and page number. Call Python script using PyMuPDF: find text location using page.search_for(old_text), draw white rectangle over it (redact), then add new text at same position using page.insert_text(). Save and return download URL."

---

#### 🔧 Tool 12: Add Text
- **Kya karta hai:** PDF ke specific position par text add karta hai
- **Language:** Node.js
- **Primary Library:** `pdf-lib`
- **API Endpoint:** `POST /api/edit/add-text`
- **Input:** PDF + text content + x,y coordinates + font + size + color + page number

**Antigravity Prompt:**
> "Express POST /api/edit/add-text. Accept PDF file and JSON: {text, x, y, pageNumber, fontSize, color, fontFamily}. Use pdf-lib: load PDF, get specified page, embed font using embedFont(), call page.drawText(text, {x, y, size, font, color}) after converting hex color to rgb(). Save and return download URL."

---

#### 🔧 Tool 13: Add Image to PDF
- **Kya karta hai:** PDF mein image insert karta hai
- **Language:** Node.js
- **Primary Library:** `pdf-lib`
- **API Endpoint:** `POST /api/edit/add-image`
- **Input:** PDF + image file + x,y position + width,height + page number

**Antigravity Prompt:**
> "Express POST /api/edit/add-image. Accept PDF and image (JPG/PNG). Use pdf-lib: embedJpg() or embedPng() depending on image type. Get target page, call page.drawImage(image, {x, y, width, height}). Save modified PDF and return download URL."

---

#### 🔧 Tool 14: Sign PDF
- **Kya karta hai:** Digital signature add karta hai (drawn or typed)
- **Language:** Node.js
- **Primary Library:** `pdf-lib` + `sharp` (image processing)
- **API Endpoint:** `POST /api/edit/sign`
- **Input:** PDF + signature image (PNG) + position + page number
- **Flow:** Frontend se canvas drawing as PNG receive karo, pdf-lib se embed karo

**Antigravity Prompt:**
> "Express POST /api/edit/sign. Accept PDF and signature PNG image data (base64 or file). Use pdf-lib: load PDF, embedPng(signatureBuffer), drawImage on specified page at given coordinates. Handle transparent PNG backgrounds. Save and return download URL."

---

#### 🔧 Tool 15: Watermark
- **Kya karta hai:** Text ya image watermark add karta hai
- **Language:** Node.js
- **Primary Library:** `pdf-lib`
- **API Endpoint:** `POST /api/edit/watermark`
- **Input:** PDF + watermark text/image + opacity + position + angle

**Antigravity Prompt:**
> "Express POST /api/edit/watermark. Accept PDF and watermark options {text, opacity, angle, position}. Use pdf-lib: for each page, draw rotated text using page.drawText() with opacity setting, centered on page. Use PDF page dimensions to calculate center. Save and return download URL."

---

#### 🔧 Tool 16: Page Numbers
- **Kya karta hai:** PDF pages par page numbers add karta hai
- **Language:** Node.js
- **Primary Library:** `pdf-lib`
- **API Endpoint:** `POST /api/edit/page-numbers`
- **Input:** PDF + position (bottom-center/top-right/etc) + start number + font style

**Antigravity Prompt:**
> "Express POST /api/edit/page-numbers. Accept PDF and options {startNumber, position, fontSize, fontFamily}. Use pdf-lib: iterate all pages, calculate position based on page dimensions and chosen position option, call page.drawText(String(pageNum), {x, y, size}) for each page. Save and return download URL."

---

#### 🔧 Tool 17: Header & Footer
- **Kya karta hai:** Custom header aur footer add karta hai
- **Language:** Node.js
- **Primary Library:** `pdf-lib`
- **API Endpoint:** `POST /api/edit/header-footer`
- **Input:** PDF + header text + footer text + styling options

**Antigravity Prompt:**
> "Express POST /api/edit/header-footer. Accept PDF, headerText, footerText, font size, color. Use pdf-lib: for each page, draw headerText near top of page (y = page.getHeight() - 30) and footerText near bottom (y = 15) centered using text width calculation. Save and return download URL."

---

#### 🔧 Tool 18: Annotate PDF
- **Kya karta hai:** Comments, notes, arrows add karta hai
- **Language:** Python (PyMuPDF)
- **Primary Library:** `PyMuPDF (fitz)`
- **API Endpoint:** `POST /api/edit/annotate`
- **Input:** PDF + annotation objects array

**Antigravity Prompt:**
> "Express POST /api/edit/annotate. Accept PDF and annotations array [{type, x, y, content, color}]. Call Python script with PyMuPDF: for each annotation, use page.add_text_annot(), page.add_highlight_annot(), page.add_arrow_annot() etc. based on type. Save and return download URL."

---

#### 🔧 Tool 19: Highlight PDF
- **Kya karta hai:** Text ko highlight karta hai
- **Language:** Python (PyMuPDF)
- **Primary Library:** `PyMuPDF (fitz)`
- **API Endpoint:** `POST /api/edit/highlight`
- **Input:** PDF + text to highlight + color + page number

**Antigravity Prompt:**
> "Express POST /api/edit/highlight. Accept PDF, searchText, highlightColor, pageNumbers. Call Python script: use fitz to open PDF, for each page call page.search_for(text) to get text rectangles, then page.add_highlight_annot(rect) with specified color. Save and return download URL."

---

#### 🔧 Tool 20: PDF Filler
- **Kya karta hai:** PDF forms fill karta hai digitally
- **Language:** Python (PyMuPDF or pypdf)
- **Primary Library:** `PyMuPDF (fitz)` + `pypdf`
- **API Endpoint:** `POST /api/edit/fill-form`
- **Input:** PDF (with form fields) + field values JSON

**Antigravity Prompt:**
> "Express POST /api/edit/fill-form. Accept PDF and JSON of field names and values. Call Python script using pypdf: open PDF with PdfReader, get AcroForm fields, fill each field value. Use PdfWriter to write filled form. Save and return download URL."

---

### 📂 CATEGORY 3: SECURITY (6 Tools)

---

#### 🔧 Tool 21: Protect PDF
- **Kya karta hai:** Password protection add karta hai
- **Language:** Python (`pikepdf` or `pypdf`)
- **Primary Library:** `pikepdf`
- **API Endpoint:** `POST /api/security/protect`
- **Input:** PDF + owner password + user password + permissions

**Antigravity Prompt:**
> "Express POST /api/security/protect. Accept PDF, userPassword, ownerPassword, permissions object. Call Python script using pikepdf: open PDF with pikepdf.open(), call pdf.save(output, encryption=pikepdf.Encryption(owner=ownerPassword, user=userPassword, R=4)). Return download URL."

---

#### 🔧 Tool 22: Unlock PDF
- **Kya karta hai:** Password remove karta hai (agar password pata ho)
- **Language:** Python (`pikepdf`)
- **Primary Library:** `pikepdf`
- **API Endpoint:** `POST /api/security/unlock`
- **Input:** PDF + current password

**Antigravity Prompt:**
> "Express POST /api/security/unlock. Accept encrypted PDF and password. Call Python script using pikepdf: pikepdf.open(inputPath, password=password), then save without encryption using pdf.save(outputPath). If wrong password, return 401 error. Return download URL on success."

---

#### 🔧 Tool 23: Redact PDF
- **Kya karta hai:** Sensitive information permanently remove karta hai
- **Language:** Python (`PyMuPDF`)
- **Primary Library:** `PyMuPDF (fitz)`
- **API Endpoint:** `POST /api/security/redact`
- **Input:** PDF + text/areas to redact

**Antigravity Prompt:**
> "Express POST /api/security/redact. Accept PDF and redaction areas [{x1,y1,x2,y2,pageNum} or {searchText}]. Python script with fitz: for text redaction, find text with page.search_for(), add redaction annotation page.add_redact_annot(rect), then page.apply_redactions(). This permanently removes underlying text. Save and return download URL."

---

#### 🔧 Tool 24: Flatten PDF
- **Kya karta hai:** Form fields aur annotations ko static content mein convert karta hai
- **Language:** Python (`PyMuPDF`)
- **Primary Library:** `PyMuPDF (fitz)` + Ghostscript
- **API Endpoint:** `POST /api/security/flatten`

**Antigravity Prompt:**
> "Express POST /api/security/flatten. Accept PDF. Use Ghostscript command via child_process: 'gs -dBATCH -dNOPAUSE -sDEVICE=pdfwrite -sOutputFile=output.pdf input.pdf' which flattens all interactive elements. Alternatively use PyMuPDF fitz to iterate pages and flatten annotations. Return download URL."

---

#### 🔧 Tool 25: Remove Metadata
- **Kya karta hai:** PDF se all metadata strip karta hai
- **Language:** Python (`pikepdf`)
- **Primary Library:** `pikepdf`
- **API Endpoint:** `POST /api/security/remove-metadata`

**Antigravity Prompt:**
> "Express POST /api/security/remove-metadata. Accept PDF. Python script using pikepdf: open PDF, access pdf.docinfo and clear all fields (title, author, subject, keywords, creator, producer, dates). Save clean PDF. Return download URL."

---

#### 🔧 Tool 26: Edit Metadata
- **Kya karta hai:** PDF metadata edit karta hai
- **Language:** Python (`pikepdf`)
- **Primary Library:** `pikepdf`
- **API Endpoint:** `POST /api/security/edit-metadata`
- **Input:** PDF + metadata JSON (title, author, subject, keywords)

**Antigravity Prompt:**
> "Express POST /api/security/edit-metadata. Accept PDF and metadata JSON. Python script with pikepdf: open PDF, set pdf.docinfo['/Title'] = title, pdf.docinfo['/Author'] = author etc. Save and return download URL. Also GET /api/security/get-metadata to read existing metadata."

---

### 📂 CATEGORY 4: CONVERT — TO PDF (42 Tools)

> **Sabse important rule:** Yahan majority conversions ke liye **LibreOffice** use hoga.  
> LibreOffice ek hi command se Word, Excel, PowerPoint, ODT, RTF sabko PDF mein convert kar sakta hai.

#### 🔧 LibreOffice Universal Command:
```bash
libreoffice --headless --convert-to pdf --outdir /path/to/output /path/to/input.docx
```

---

#### 🔧 Tool 27: Word to PDF (DOC/DOCX)
- **Language:** Node.js (child_process)
- **Library:** LibreOffice (system) OR `libreoffice-convert` (npm)
- **API Endpoint:** `POST /api/convert/word-to-pdf`

**Antigravity Prompt:**
> "Express POST /api/convert/word-to-pdf. Accept DOC or DOCX file. Use npm package libreoffice-convert: require libre = require('libreoffice-convert'), call libre.convert(fileBuffer, '.pdf', undefined, callback). Or use child_process to run LibreOffice headless command. Save output PDF and return download URL."

---

#### 🔧 Tool 28: PowerPoint to PDF (PPT/PPTX)
- **Library:** LibreOffice
- **API Endpoint:** `POST /api/convert/ppt-to-pdf`

**Antigravity Prompt:**
> "Express POST /api/convert/ppt-to-pdf. Accept PPT/PPTX. Run LibreOffice headless command via child_process.exec(): 'libreoffice --headless --convert-to pdf --outdir outputDir inputFile'. Wait for completion, serve output PDF."

---

#### 🔧 Tool 29: Excel to PDF (XLS/XLSX)
- **Library:** LibreOffice
- **API Endpoint:** `POST /api/convert/excel-to-pdf`

*(Same as Word to PDF — same LibreOffice command)*

---

#### 🔧 Tool 30: JPG to PDF
- **Language:** Node.js
- **Library:** `pdf-lib` + `sharp`
- **API Endpoint:** `POST /api/convert/jpg-to-pdf`

**Antigravity Prompt:**
> "Express POST /api/convert/jpg-to-pdf. Accept one or multiple JPG images. Use pdf-lib: create new PDFDocument, for each image read buffer, call doc.embedJpg(buffer), add new page with image dimensions, drawImage() to fill page. Save PDF and return download URL."

---

#### 🔧 Tool 31: PNG to PDF
- **Library:** `pdf-lib`
- **API Endpoint:** `POST /api/convert/png-to-pdf`

*(Same as JPG to PDF but use embedPng())*

---

#### 🔧 Tool 32: Image to PDF (Any format)
- **Language:** Node.js + `sharp` (for format conversion)
- **Library:** `sharp` + `pdf-lib`
- **API Endpoint:** `POST /api/convert/image-to-pdf`
- **Flow:** Sharp se image ko PNG/JPG mein convert karo, phir pdf-lib se PDF banao

**Antigravity Prompt:**
> "Express POST /api/convert/image-to-pdf. Accept any image format (WebP, BMP, TIFF, GIF, HEIC etc). Use sharp library to convert image to PNG buffer (sharp(input).png().toBuffer()), then use pdf-lib to embedPng and create PDF page with image. Handle multiple images in one PDF."

---

#### 🔧 Tool 33: HTML to PDF
- **Language:** Node.js
- **Library:** `puppeteer`
- **API Endpoint:** `POST /api/convert/html-to-pdf`
- **Input:** HTML string or HTML file

**Antigravity Prompt:**
> "Express POST /api/convert/html-to-pdf. Accept HTML string. Use puppeteer: launch browser headless, create page, call page.setContent(htmlString, {waitUntil: 'networkidle0'}), call page.pdf({format: 'A4', printBackground: true}). Save buffer as PDF, close browser, return download URL."

---

#### 🔧 Tool 34: URL to PDF
- **Language:** Node.js
- **Library:** `puppeteer`
- **API Endpoint:** `POST /api/convert/url-to-pdf`
- **Input:** URL string

**Antigravity Prompt:**
> "Express POST /api/convert/url-to-pdf. Accept URL string. Use puppeteer: launch browser, new page, page.goto(url, {waitUntil: 'networkidle2', timeout: 30000}), page.pdf({format: 'A4', printBackground: true}). Return PDF download URL. Add timeout and error handling for invalid URLs."

---

#### 🔧 Tool 35: EPUB to PDF
- **Language:** Python or System (Calibre)
- **Library:** Calibre (ebook-convert command)
- **API Endpoint:** `POST /api/convert/epub-to-pdf`
- **Command:** `ebook-convert input.epub output.pdf`

**Antigravity Prompt:**
> "Express POST /api/convert/epub-to-pdf. Accept EPUB file. Use child_process.execFile() to run Calibre command: ebook-convert inputPath outputPath. Wait for completion, return download URL. Handle errors if Calibre not installed."

---

#### 🔧 Tool 36: TXT to PDF
- **Language:** Node.js
- **Library:** `pdfkit`
- **API Endpoint:** `POST /api/convert/txt-to-pdf`

**Antigravity Prompt:**
> "Express POST /api/convert/txt-to-pdf. Accept TXT file. Use pdfkit: create new PDFDocument, read text file content, add pages with doc.text(content, {width: 450, align: 'left'}) with proper margins. Pipe to file stream. Return download URL."

---

#### 🔧 Tool 37: ODT to PDF
- **Library:** LibreOffice
- **API Endpoint:** `POST /api/convert/odt-to-pdf`
*(Same LibreOffice command)*

---

#### 🔧 Tool 38: RTF to PDF
- **Library:** LibreOffice
- **API Endpoint:** `POST /api/convert/rtf-to-pdf`
*(Same LibreOffice command)*

---

#### 🔧 Tool 39: CSV to PDF
- **Language:** Node.js
- **Library:** `pdfkit` + built-in CSV parsing
- **API Endpoint:** `POST /api/convert/csv-to-pdf`

**Antigravity Prompt:**
> "Express POST /api/convert/csv-to-pdf. Accept CSV file. Parse CSV rows. Use pdfkit to create table layout: draw header row with background color, then data rows. Calculate column widths based on content. Add page breaks when needed. Return download URL."

---

#### 🔧 Tool 40: SVG to PDF
- **Language:** Node.js
- **Library:** `sharp` + `pdf-lib` OR `svg2pdf.js`
- **API Endpoint:** `POST /api/convert/svg-to-pdf`

**Antigravity Prompt:**
> "Express POST /api/convert/svg-to-pdf. Accept SVG file. Use sharp: sharp(svgBuffer).png().toBuffer() to convert SVG to PNG raster, then use pdf-lib to embed PNG in PDF page. For vector preservation, use LibreOffice headless as fallback."

---

#### 🔧 Tool 41: HEIC/HEIF to PDF
- **Language:** Node.js
- **Library:** `sharp` (supports HEIC) + `pdf-lib`
- **API Endpoint:** `POST /api/convert/heic-to-pdf`
- **Note:** `sharp` needs `libvips` with HEIC support
- **Extra install:** `sudo apt-get install -y libheif-dev`

---

#### 🔧 Tool 42: WebP to PDF
- **Library:** `sharp` + `pdf-lib`
- **API Endpoint:** `POST /api/convert/webp-to-pdf`

*(Sharp WebP support built-in)*

---

#### 🔧 Tool 43: BMP to PDF
- **Library:** `sharp` + `pdf-lib`
- **API Endpoint:** `POST /api/convert/bmp-to-pdf`

---

#### 🔧 Tool 44: TIFF to PDF
- **Library:** `sharp` + `pdf-lib`
- **API Endpoint:** `POST /api/convert/tiff-to-pdf`

---

#### 🔧 Tool 45: GIF to PDF
- **Library:** `sharp` + `pdf-lib`
- **Note:** Animated GIF ke liye first frame use karo
- **API Endpoint:** `POST /api/convert/gif-to-pdf`

---

#### 🔧 Tool 46: JFIF to PDF
- **Library:** `sharp` + `pdf-lib`
- **API Endpoint:** `POST /api/convert/jfif-to-pdf`
*(JFIF = JPEG variant, treat as JPG)*

---

#### 🔧 Tool 47: DjVu to PDF
- **Language:** System command
- **Library:** `djvulibre` (system package)
- **Install:** `sudo apt-get install -y djvulibre-bin`
- **Command:** `ddjvu -format=pdf input.djvu output.pdf`
- **API Endpoint:** `POST /api/convert/djvu-to-pdf`

---

#### 🔧 Tool 48: PAGES to PDF (Apple Pages)
- **Library:** LibreOffice (partial support) OR convert to ZIP first
- **API Endpoint:** `POST /api/convert/pages-to-pdf`
- **Note:** Apple Pages files are ZIP archives. Extract, find index.pdf inside.

**Antigravity Prompt:**
> "Express POST /api/convert/pages-to-pdf. Accept .pages file. Use unzipper to extract the ZIP (pages files are ZIPs). Look for 'QuickLook/Preview.pdf' inside the extracted archive. If found, use it. Otherwise try LibreOffice conversion."

---

#### 🔧 Tool 49: MOBI to PDF
- **Library:** Calibre
- **Command:** `ebook-convert input.mobi output.pdf`
- **API Endpoint:** `POST /api/convert/mobi-to-pdf`

---

#### 🔧 Tool 50: XML to PDF
- **Language:** Node.js
- **Library:** `pdfkit` + XML parsing (`xml2js`)
- **Install:** `npm install xml2js`
- **API Endpoint:** `POST /api/convert/xml-to-pdf`

---

#### 🔧 Tool 51: MD (Markdown) to PDF
- **Language:** Node.js
- **Library:** `marked` (MD to HTML) + `puppeteer` (HTML to PDF)
- **Install:** `npm install marked`
- **API Endpoint:** `POST /api/convert/md-to-pdf`

**Antigravity Prompt:**
> "Express POST /api/convert/md-to-pdf. Accept Markdown file. Use marked library to convert MD string to HTML. Wrap in proper HTML template with styling. Use puppeteer to convert HTML to PDF with printBackground: true. Return download URL."

---

#### 🔧 Tool 52: eBook to PDF (Universal)
- **Library:** Calibre (handles EPUB, MOBI, AZW, LIT, etc.)
- **API Endpoint:** `POST /api/convert/ebook-to-pdf`

---

#### 🔧 Tool 53: DWG to PDF (AutoCAD)
- **Language:** System
- **Library:** LibreOffice (limited) OR `ODA File Converter` (free tool)
- **Install:** Download ODA File Converter from opendesign.com
- **API Endpoint:** `POST /api/convert/dwg-to-pdf`
- **Note:** This is complex. Use cloud API (ConvertAPI/CloudConvert) as fallback.

---

#### 🔧 Tool 54: DXF to PDF
- **Library:** LibreOffice OR Python `ezdxf` + matplotlib
- **Install:** `pip3 install ezdxf matplotlib`
- **API Endpoint:** `POST /api/convert/dxf-to-pdf`

---

#### 🔧 Tool 55: PUB to PDF (Microsoft Publisher)
- **Library:** LibreOffice (partial support)
- **API Endpoint:** `POST /api/convert/pub-to-pdf`

---

#### 🔧 Tool 56: XPS to PDF
- **Library:** Ghostscript
- **Command:** `gs -sDEVICE=pdfwrite -sOutputFile=output.pdf input.xps`
- **API Endpoint:** `POST /api/convert/xps-to-pdf`

---

#### 🔧 Tool 57: HWP to PDF (Hangul - Korean)
- **Library:** LibreOffice (with HWP plugin) OR `hwp2pdf` utility
- **API Endpoint:** `POST /api/convert/hwp-to-pdf`

---

#### 🔧 Tool 58: CHM to PDF
- **System:** `chm2pdf` utility
- **Install:** `sudo apt-get install chm2pdf`
- **API Endpoint:** `POST /api/convert/chm-to-pdf`

---

#### 🔧 Tool 59: FB2 to PDF (FictionBook)
- **Library:** Calibre
- **API Endpoint:** `POST /api/convert/fb2-to-pdf`

---

#### 🔧 Tool 60: WPS to PDF
- **Library:** LibreOffice (WPS Writer format supported)
- **API Endpoint:** `POST /api/convert/wps-to-pdf`

---

#### 🔧 Tool 61: EML to PDF (Email files)
- **Language:** Python
- **Library:** Python `email` module (built-in) + `pdfkit`
- **API Endpoint:** `POST /api/convert/eml-to-pdf`

**Antigravity Prompt:**
> "Express POST /api/convert/eml-to-pdf. Accept .eml file. Python script: parse email using Python's built-in email library. Extract headers (From, To, Subject, Date) and body. Convert HTML body or plain text to PDF using weasyprint or pdfkit. Return download URL."

---

#### 🔧 Tool 62: ZIP to PDF
- **Language:** Node.js
- **Library:** `unzipper` + appropriate converters
- **API Endpoint:** `POST /api/convert/zip-to-pdf`
- **Note:** Extract ZIP, detect file types, convert each to PDF, then merge

---

#### 🔧 Tool 63: CBZ to PDF (Comic Book ZIP)
- **Language:** Python
- **Library:** `Pillow` (images from ZIP)
- **API Endpoint:** `POST /api/convert/cbz-to-pdf`

**Antigravity Prompt:**
> "Express POST /api/convert/cbz-to-pdf. CBZ is a ZIP of images. Use Python: unzip CBZ, sort images alphabetically, use Pillow to open each image, use reportlab or PyMuPDF to create PDF with one image per page. Return download URL."

---

#### 🔧 Tool 64: CBR to PDF (Comic Book RAR)
- **Language:** Python
- **Library:** `rarfile` Python library + Pillow
- **Install:** `pip3 install rarfile` + `sudo apt-get install -y unrar`
- **API Endpoint:** `POST /api/convert/cbr-to-pdf`

---

#### 🔧 Tool 65: AI to PDF (Adobe Illustrator)
- **Library:** Ghostscript (AI files are PDF-based)
- **Command:** `gs -sDEVICE=pdfwrite -sOutputFile=output.pdf input.ai`
- **API Endpoint:** `POST /api/convert/ai-to-pdf`

---

### 📂 CATEGORY 5: CONVERT — FROM PDF (21 Tools)

---

#### 🔧 Tool 66: PDF to Word (DOC/DOCX)
- **Language:** Python
- **Primary Library:** `pdf2docx`
- **Install:** `pip3 install pdf2docx`
- **API Endpoint:** `POST /api/convert/pdf-to-word`

**Antigravity Prompt:**
> "Express POST /api/convert/pdf-to-word. Accept PDF. Call Python script using pdf2docx library: from pdf2docx import Converter, cv = Converter(pdfPath), cv.convert(docxPath, start=0, end=None), cv.close(). Return DOCX download URL."

---

#### 🔧 Tool 67: PDF to PowerPoint (PPT/PPTX)
- **Language:** Python
- **Library:** `pdf2pptx` OR `python-pptx` + `PyMuPDF`
- **Install:** `pip3 install pdf2pptx`
- **API Endpoint:** `POST /api/convert/pdf-to-ppt`
- **Flow:** PDF pages ko images mein convert karo, phir PPTX slide mein add karo

**Antigravity Prompt:**
> "Express POST /api/convert/pdf-to-ppt. Accept PDF. Python script: use PyMuPDF to render each page as high-res PNG image. Use python-pptx to create new presentation, add one slide per page with image filling entire slide area. Save as PPTX and return download URL."

---

#### 🔧 Tool 68: PDF to Excel (XLSX)
- **Language:** Python
- **Library:** `camelot-py` + `openpyxl` OR `tabula-py`
- **Install:** `pip3 install camelot-py[cv] tabula-py openpyxl`
- **API Endpoint:** `POST /api/convert/pdf-to-excel`

**Antigravity Prompt:**
> "Express POST /api/convert/pdf-to-excel. Accept PDF. Python script: use camelot.read_pdf(pdfPath, pages='all') to extract tables. Convert each table dataframe to Excel sheet using pandas and openpyxl. If multiple tables, create multiple sheets. Return XLSX download URL."

---

#### 🔧 Tool 69: PDF to JPG
- **Language:** Node.js + System (poppler)
- **Library:** `poppler-utils` (pdftoppm command)
- **Command:** `pdftoppm -jpeg -r 150 input.pdf output_prefix`
- **API Endpoint:** `POST /api/convert/pdf-to-jpg`

**Antigravity Prompt:**
> "Express POST /api/convert/pdf-to-jpg. Accept PDF and optional DPI (default 150). Use child_process to run: pdftoppm -jpeg -r {dpi} input.pdf outputDir/page. This creates page-1.jpg, page-2.jpg etc. Zip all images and return download URL."

---

#### 🔧 Tool 70: PDF to PNG
- **Library:** poppler-utils (pdftoppm)
- **Command:** `pdftoppm -png -r 150 input.pdf output_prefix`
- **API Endpoint:** `POST /api/convert/pdf-to-png`

---

#### 🔧 Tool 71: PDF to Image (Universal)
- **Library:** poppler-utils + `sharp` for format conversion
- **API Endpoint:** `POST /api/convert/pdf-to-image`
- **Input:** PDF + desired output format

---

#### 🔧 Tool 72: PDF to HTML
- **Language:** Python
- **Library:** `pdfminer.six` + custom HTML generation
- **Install:** `pip3 install pdfminer.six`
- **API Endpoint:** `POST /api/convert/pdf-to-html`

---

#### 🔧 Tool 73: PDF to EPUB
- **Language:** Python + Calibre
- **Library:** Calibre (ebook-convert)
- **Command:** `ebook-convert input.pdf output.epub`
- **API Endpoint:** `POST /api/convert/pdf-to-epub`

---

#### 🔧 Tool 74: PDF to TXT
- **Language:** Python
- **Library:** `pdfplumber` or `pdfminer.six`
- **API Endpoint:** `POST /api/convert/pdf-to-txt`

**Antigravity Prompt:**
> "Express POST /api/convert/pdf-to-txt. Accept PDF. Python script using pdfplumber: open PDF, for each page call page.extract_text(), join all text with newlines. Write to .txt file. Return download URL."

---

#### 🔧 Tool 75: PDF to ODT
- **Library:** LibreOffice (via PDF to DOCX then to ODT)
- **API Endpoint:** `POST /api/convert/pdf-to-odt`

---

#### 🔧 Tool 76: PDF to RTF
- **Library:** LibreOffice
- **API Endpoint:** `POST /api/convert/pdf-to-rtf`

---

#### 🔧 Tool 77: PDF to CSV
- **Language:** Python
- **Library:** `camelot-py` + `pandas`
- **API Endpoint:** `POST /api/convert/pdf-to-csv`

---

#### 🔧 Tool 78: PDF to SVG
- **Language:** System (pdf2svg)
- **Install:** `sudo apt-get install -y pdf2svg`
- **Command:** `pdf2svg input.pdf output_%d.svg all`
- **API Endpoint:** `POST /api/convert/pdf-to-svg`

---

#### 🔧 Tool 79: PDF to BMP/TIFF/GIF
- **Library:** poppler-utils + `sharp`
- **API Endpoint:** `POST /api/convert/pdf-to-bmp` etc.

---

#### 🔧 Tool 80: PDF to MOBI
- **Library:** Calibre
- **Command:** `ebook-convert input.pdf output.mobi`
- **API Endpoint:** `POST /api/convert/pdf-to-mobi`

---

#### 🔧 Tool 81: PDF to PDF/A
- **Language:** Python
- **Library:** `pikepdf` OR Ghostscript
- **Command:** `gs -dPDFA=2 -dBATCH -dNOPAUSE -sColorConversionStrategy=RGB -sDEVICE=pdfwrite -sOutputFile=output.pdf input.pdf`
- **API Endpoint:** `POST /api/convert/pdf-to-pdfa`

---

#### 🔧 Tool 82: PDF Converter (Universal)
- **Language:** Node.js (routes to appropriate handler)
- **API Endpoint:** `POST /api/convert/universal`
- **Logic:** Detect input format + output format → route to appropriate conversion function

---

### 📂 CATEGORY 6: AI & OTHERS (14 Tools)

---

#### 🔧 Tool 83: OCR PDF
- **Language:** Python
- **Library:** `pytesseract` + `Pillow` + `PyMuPDF`
- **System:** Tesseract OCR (installed earlier)
- **API Endpoint:** `POST /api/ai/ocr`

**Antigravity Prompt:**
> "Express POST /api/ai/ocr. Accept scanned PDF. Python script: use PyMuPDF to render each page as high-res image (mat = fitz.Matrix(2,2)), use pytesseract.image_to_string(image, lang='eng+hin') for OCR. Create new searchable PDF using PyMuPDF's text overlay feature. Return searchable PDF download URL."

---

#### 🔧 Tool 84: Compare PDF
- **Language:** Python
- **Library:** `PyMuPDF` + `difflib`
- **API Endpoint:** `POST /api/ai/compare`
- **Input:** Two PDF files
- **Output:** Comparison report (highlighted differences)

**Antigravity Prompt:**
> "Express POST /api/ai/compare. Accept two PDF files. Python script: extract text from both PDFs using pdfplumber, use difflib.unified_diff() or HtmlDiff to compare text. Generate HTML diff report and convert to PDF. Also create visual comparison using PyMuPDF by overlaying pages. Return comparison PDF download URL."

---

#### 🔧 Tool 85: Translate PDF
- **Language:** Python
- **Library:** `pdfplumber` + `googletrans` or `OpenAI API`
- **API Endpoint:** `POST /api/ai/translate`
- **Input:** PDF + target language

**Antigravity Prompt:**
> "Express POST /api/ai/translate. Accept PDF and target language code. Python script: extract text with pdfplumber, break into chunks (Google Translate has 5000 char limit), translate each chunk using googletrans or OpenAI. Create new PDF with translated text preserving basic layout using reportlab or PyMuPDF. Return download URL."

---

#### 🔧 Tool 86: Chat with PDF
- **Language:** Node.js
- **Library:** `pdf-parse` + `OpenAI API`
- **API Endpoint:** `POST /api/ai/chat` (upload) + `POST /api/ai/chat/ask` (question)
- **Flow:** Extract text → Store in memory/session → Answer questions using AI

**Antigravity Prompt:**
> "Express routes: POST /api/ai/chat/upload accepts PDF, extracts text using pdf-parse, stores in server memory/Redis with session ID. POST /api/ai/chat/ask accepts {sessionId, question}, retrieves stored text, calls OpenAI API with system prompt containing PDF text and user question. Return AI answer as JSON."

---

#### 🔧 Tool 87: Summarize PDF
- **Language:** Node.js
- **Library:** `pdf-parse` + `OpenAI API`
- **API Endpoint:** `POST /api/ai/summarize`

**Antigravity Prompt:**
> "Express POST /api/ai/summarize. Accept PDF. Extract text using pdf-parse. If text > 4000 tokens, chunk it and summarize each chunk. Call OpenAI API with prompt: 'Summarize this document in bullet points: {text}'. Return JSON with summary text."

---

#### 🔧 Tool 88: Repair PDF
- **Language:** Python + Ghostscript
- **Library:** `pikepdf` + Ghostscript
- **API Endpoint:** `POST /api/ai/repair`

**Antigravity Prompt:**
> "Express POST /api/ai/repair. Accept corrupted PDF. Try multiple repair strategies: 1) Try pikepdf.open() with attempt_recovery=True, 2) Run Ghostscript command to reconstruct PDF: gs -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -sOutputFile=fixed.pdf broken.pdf. Return repaired PDF or error message."

---

#### 🔧 Tool 89: Scan to PDF
- **Frontend only tool** — Camera access via browser MediaDevices API
- **Backend:** `POST /api/ai/scan-upload` accepts image array, converts to PDF using pdf-lib
- **Note:** Actual scanning happens on frontend (getUserMedia), backend just stitches images into PDF

---

#### 🔧 Tool 90: PDF Viewer
- **Frontend only** — Use PDF.js library on frontend
- **Backend:** Optional `GET /api/view/:fileId` to serve PDF file securely

---

#### 🔧 Tool 91: Create PDF
- **Language:** Node.js
- **Library:** `pdfkit`
- **API Endpoint:** `POST /api/ai/create`
- **Input:** Content (text, images) + formatting options

---

#### 🔧 Tool 92: Resize Pages
- **Language:** Python (PyMuPDF)
- **Library:** `PyMuPDF`
- **API Endpoint:** `POST /api/ai/resize-pages`
- **Input:** PDF + target page size (A4, A3, Letter, etc.)

**Antigravity Prompt:**
> "Express POST /api/ai/resize-pages. Accept PDF and target size (A4/Letter/A3). Python script using PyMuPDF: open PDF, create new document with target page dimensions, for each page create new page of target size, show original page content scaled to fit using page.show_pdf_page(). Save and return download URL."

---

#### 🔧 Tool 93: Extract Text
- **Language:** Python
- **Library:** `pdfplumber`
- **API Endpoint:** `POST /api/ai/extract-text`
- **Output:** TXT or JSON with text + page numbers

---

#### 🔧 Tool 94: Extract Images
- **Language:** Python
- **Library:** `PyMuPDF`
- **API Endpoint:** `POST /api/ai/extract-images`
- **Output:** ZIP of all extracted images

**Antigravity Prompt:**
> "Express POST /api/ai/extract-images. Accept PDF. Python script with PyMuPDF: open PDF, iterate pages, call page.get_images(full=True), for each image use doc.extract_image(xref) to get image bytes. Save each image to temp folder. Zip all images and return download URL."

---

#### 🔧 Tool 95: Whiteout PDF
- **Language:** Python (PyMuPDF)
- **Library:** `PyMuPDF`
- **API Endpoint:** `POST /api/ai/whiteout`
- **Input:** PDF + areas to whiteout (coordinates)

**Antigravity Prompt:**
> "Express POST /api/ai/whiteout. Accept PDF and whiteout areas [{x1,y1,x2,y2,page}]. Python script with fitz: for each area, draw filled white rectangle using page.draw_rect(fitz.Rect(x1,y1,x2,y2), color=(1,1,1), fill=(1,1,1)). This covers but doesn't remove underlying content. For permanent removal, also add redaction annotation. Save and return download URL."

---

#### 🔧 Tool 96: Grayscale PDF
- **Language:** Ghostscript
- **Command:** `gs -sOutputFile=output.pdf -sDEVICE=pdfwrite -sColorConversionStrategy=Gray -dProcessColorModel=/DeviceGray -dCompatibilityLevel=1.4 -dNOPAUSE -dBATCH input.pdf`
- **API Endpoint:** `POST /api/ai/grayscale`

---

### 📂 EXTRA — Remaining Tools from List

#### 🔧 Tool 97: Crop PDF
*(Already covered in Edit category — Tool 9)*

#### 🔧 Tool 98: DOCX to PDF
*(Same as Word to PDF — Tool 27)*

#### 🔧 Tool 99: PPTX to PDF
*(Same as PowerPoint to PDF — Tool 28)*

#### 🔧 Tool 100: PDF to DOCX
*(Same as PDF to Word — Tool 66)*

#### 🔧 Tool 101: PDF to PPT
*(Same as PDF to PowerPoint — Tool 67)*

#### 🔧 Tool 102: Annotate PDF
*(Already covered in Edit — Tool 18)*

#### 🔧 Tool 103: PDF Filler
*(Already covered in Edit — Tool 20)*

---

## 🔗 STEP 9 — Server.js Main File Structure

```
NOTE: Code khud likhna hai. Yahan sirf structure diya hai.

server.js mein:
- Express app initialize karo
- CORS enable karo (frontend URL ke liye)
- Helmet security middleware lagao
- Rate limiting lagao
- Body parser lagao (50MB limit)
- Multer configure karo
- Sare routes import karo aur mount karo:
  - /api/organize → organizeRoutes.js
  - /api/convert → convertRoutes.js
  - /api/edit → editRoutes.js
  - /api/security → securityRoutes.js
  - /api/ai → aiRoutes.js
- Static file serve karo outputs folder se
- Error handler middleware lagao
- Server listen karo on PORT
```

---

## 🔗 STEP 10 — Frontend se Backend Connect Karna

Frontend mein tool buttons ke `onClick` ya form `onSubmit` mein:

```
Pattern:
1. FormData object banao
2. File append karo: formData.append('file', selectedFile)
3. Options append karo: formData.append('quality', 'ebook')
4. fetch('/api/edit/compress', {method: 'POST', body: formData})
5. Response se downloadUrl lo
6. window.open(downloadUrl) se download karo

Base URL: Development mein http://localhost:5000
          Production mein apna actual domain
```

---

## 📋 STEP 11 — Complete NPM Install Command (Single Shot)

```bash
cd backend

npm install express multer cors helmet express-rate-limit dotenv morgan winston \
  pdf-lib pdfkit pdf-parse libreoffice-convert \
  sharp jimp \
  archiver unzipper \
  puppeteer html-pdf-node \
  epub-gen \
  fs-extra uuid path \
  bcryptjs jsonwebtoken \
  bull ioredis \
  file-type mime-types \
  tmp node-schedule \
  openai \
  axios cheerio \
  xml2js marked \
  joi express-validator \
  node-fetch
```

---

## 🐍 STEP 12 — Complete Python Install Command (Single Shot)

```bash
pip3 install \
  PyMuPDF \
  pypdf \
  pdfplumber \
  pdf2docx \
  python-docx \
  openpyxl xlrd \
  python-pptx \
  Pillow \
  ebooklib \
  pytesseract \
  camelot-py \
  tabula-py \
  weasyprint \
  pikepdf \
  striprtf \
  markdown2 \
  reportlab \
  pdfminer.six \
  rarfile \
  googletrans==4.0.0rc1 \
  pandas \
  pdf2pptx \
  openai
```

---

## 🐧 STEP 13 — Complete System Commands (Single Shot — Ubuntu/Debian)

```bash
sudo apt-get update && sudo apt-get install -y \
  libreoffice \
  ghostscript \
  poppler-utils \
  tesseract-ocr \
  tesseract-ocr-hin \
  tesseract-ocr-eng \
  imagemagick \
  wkhtmltopdf \
  calibre \
  python3 \
  python3-pip \
  djvulibre-bin \
  pdf2svg \
  unrar \
  chm2pdf \
  libheif-dev \
  libvips-dev
```

---

## ⚡ STEP 14 — Quick Start Commands (Sab Ek Saath)

```bash
# Step 1: Backend folder banao
mkdir backend && cd backend

# Step 2: Node project init
npm init -y

# Step 3: System tools install (Ubuntu)
sudo apt-get update && sudo apt-get install -y libreoffice ghostscript poppler-utils tesseract-ocr tesseract-ocr-hin imagemagick wkhtmltopdf calibre python3 python3-pip djvulibre-bin pdf2svg unrar libheif-dev

# Step 4: Node packages install
npm install express multer cors helmet express-rate-limit dotenv morgan pdf-lib pdfkit pdf-parse libreoffice-convert sharp jimp archiver unzipper puppeteer fs-extra uuid file-type mime-types openai axios xml2js marked bull ioredis bcryptjs jsonwebtoken

# Step 5: Python packages install
pip3 install PyMuPDF pypdf pdfplumber pdf2docx python-docx openpyxl python-pptx Pillow pytesseract camelot-py tabula-py weasyprint pikepdf reportlab pdfminer.six rarfile pandas

# Step 6: Puppeteer browser
npx puppeteer browsers install chrome

# Step 7: Folder structure
mkdir routes controllers middlewares utils uploads outputs temp config
mkdir -p services/pdf services/convert services/edit services/security services/ai

# Step 8: .env file banao (manually)
touch .env

# Step 9: Start coding!
```

---

## 🗺️ STEP 15 — Tool-to-Library Quick Reference Table

| Tool | Language | Primary Library | System Tool |
|------|----------|----------------|-------------|
| Merge PDF | Node.js | pdf-lib | — |
| Split PDF | Node.js | pdf-lib | — |
| Compress PDF | Node.js | child_process | Ghostscript |
| Word to PDF | Node.js | libreoffice-convert | LibreOffice |
| Excel to PDF | Node.js | libreoffice-convert | LibreOffice |
| PPT to PDF | Node.js | libreoffice-convert | LibreOffice |
| JPG/PNG to PDF | Node.js | pdf-lib | — |
| Image to PDF | Node.js | sharp + pdf-lib | — |
| HTML to PDF | Node.js | puppeteer | Chrome |
| URL to PDF | Node.js | puppeteer | Chrome |
| EPUB to PDF | Node.js | child_process | Calibre |
| MOBI to PDF | Node.js | child_process | Calibre |
| TXT to PDF | Node.js | pdfkit | — |
| MD to PDF | Node.js | marked + puppeteer | Chrome |
| SVG to PDF | Node.js | sharp + pdf-lib | — |
| DjVu to PDF | Node.js | child_process | djvulibre |
| XPS to PDF | Node.js | child_process | Ghostscript |
| AI to PDF | Node.js | child_process | Ghostscript |
| CBZ to PDF | Python | Pillow + reportlab | — |
| CBR to PDF | Python | rarfile + Pillow | unrar |
| PDF to Word | Python | pdf2docx | — |
| PDF to PPT | Python | python-pptx + PyMuPDF | — |
| PDF to Excel | Python | camelot-py + openpyxl | — |
| PDF to JPG/PNG | Node.js | child_process | poppler-utils |
| PDF to TXT | Python | pdfplumber | — |
| PDF to EPUB/MOBI | Node.js | child_process | Calibre |
| PDF to SVG | Node.js | child_process | pdf2svg |
| PDF/A | Node.js | child_process | Ghostscript |
| Edit PDF | Node.js | pdf-lib | — |
| Annotate PDF | Python | PyMuPDF | — |
| Highlight PDF | Python | PyMuPDF | — |
| Watermark | Node.js | pdf-lib | — |
| Sign PDF | Node.js | pdf-lib | — |
| Page Numbers | Node.js | pdf-lib | — |
| Header/Footer | Node.js | pdf-lib | — |
| Crop PDF | Python | PyMuPDF | — |
| Protect PDF | Python | pikepdf | — |
| Unlock PDF | Python | pikepdf | — |
| Redact PDF | Python | PyMuPDF | — |
| Remove Metadata | Python | pikepdf | — |
| Edit Metadata | Python | pikepdf | — |
| OCR PDF | Python | pytesseract + PyMuPDF | Tesseract |
| Translate PDF | Python | pdfplumber + googletrans | — |
| Chat with PDF | Node.js | pdf-parse + OpenAI | — |
| Summarize PDF | Node.js | pdf-parse + OpenAI | — |
| Repair PDF | Python | pikepdf | Ghostscript |
| Extract Text | Python | pdfplumber | — |
| Extract Images | Python | PyMuPDF | — |
| Grayscale PDF | Node.js | child_process | Ghostscript |
| Resize Pages | Python | PyMuPDF | — |
| Whiteout PDF | Python | PyMuPDF | — |
| Compare PDF | Python | PyMuPDF + difflib | — |
| Flatten PDF | Node.js | child_process | Ghostscript |
| Create PDF | Node.js | pdfkit | — |
| CSV to PDF | Node.js | pdfkit | — |

---

## ⚠️ IMPORTANT NOTES

1. **File Cleanup:** Processed files auto-delete karo after 30 minutes using `node-schedule`
2. **File Size Limit:** Multer mein 100MB limit set karo
3. **Error Handling:** Har route mein try-catch lagao
4. **Temp Files:** Sab temp files `temp/` folder mein rakho, kaam ke baad delete karo
5. **Python Scripts:** Backend ke `services/` folder mein `.py` files banao, Node.js se `child_process.execFile('python3', ['script.py', args])` se call karo
6. **CORS:** Frontend URL ko CORS mein allow karo
7. **Production:** PM2 use karo Node.js server run karne ke liye — `npm install -g pm2`

---

## 🚀 Production Deploy Commands

```bash
# PM2 install
npm install -g pm2

# Server start
pm2 start server.js --name "ishu-backend"

# Auto-restart on reboot
pm2 startup
pm2 save

# Logs dekhne ke liye
pm2 logs ishu-backend
```

---

*© 2026 ISHU — Indian StudentHub University Backend Guide*  
*Prepared for: 103+ PDF Tools Complete Backend Implementation*
