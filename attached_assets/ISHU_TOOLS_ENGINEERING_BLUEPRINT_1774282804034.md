# 🚀 ISHU Tools Page — Complete Engineering Blueprint
> **ISHU — Indian StudentHub University | ishu.fun**
> Full Architecture, Workflow, Libraries, Installation & Tool-by-Tool Guide

---

## 📋 TABLE OF CONTENTS

1. [Project Overview & Goals](#1-project-overview--goals)
2. [Tech Stack — Full Decision](#2-tech-stack--full-decision)
3. [Design System & UI Philosophy](#3-design-system--ui-philosophy)
4. [Full Project Architecture](#4-full-project-architecture)
5. [Installation — Every Library & Tool](#5-installation--every-library--tool)
6. [Tool-by-Tool Engineering Guide (All 106 Tools)](#6-tool-by-tool-engineering-guide-all-106-tools)
7. [Page Routing — New Page (Not New Tab)](#7-page-routing--new-page-not-new-tab)
8. [Animation & 3D Effects System](#8-animation--3d-effects-system)
9. [Smooth Scrolling & Performance](#9-smooth-scrolling--performance)
10. [Icons System — Professional Grade](#10-icons-system--professional-grade)
11. [Modern Design Inspiration Sources](#11-modern-design-inspiration-sources)
12. [Complete File Structure](#12-complete-file-structure)
13. [API Routes Architecture (Backend)](#13-api-routes-architecture-backend)
14. [Deployment Guide](#14-deployment-guide)
15. [Troubleshooting Common Issues](#15-troubleshooting-common-issues)

---

## 1. PROJECT OVERVIEW & GOALS

### Problem
Tumhara current tools page mein koi bhi tool kaam nahi kar raha. Reason yeh hain:
- Tools ke peeche koi actual processing library nahi hai
- Sirf UI banaya gaya, logic nahi
- File upload ke baad koi action nahi hota
- Server-side processing missing hai

### Solution — Hybrid Architecture
```
USER FILE UPLOAD
      ↓
BROWSER (Client-Side) ← Small/Simple operations (merge, compress, images)
      ↓
NEXT.JS API ROUTE    ← Complex operations (Office→PDF, OCR, Video)
      ↓
DOWNLOAD PROCESSED FILE
```

### Core Principles
- **100% tools working** — har ek tool real output dega
- **Browser-first** — jahan possible ho, sab kuch browser mein process ho (privacy)
- **Server fallback** — complex conversions ke liye API routes
- **SPA routing** — tool click karne pe new PAGE (same window), new tab NAHI
- **Modern UI** — Figma/Vercel/Linear level design quality

---

## 2. TECH STACK — FULL DECISION

### Frontend Framework
```
Next.js 14 (App Router)
```
**Kyun Next.js?**
- Vercel ne banaya hai — world's best developer experience
- App Router = file-based routing → `/tools/merge-pdf` = ek page
- Server Components + Client Components dono
- Built-in API routes → backend bhi yahi
- Used by: Notion, TikTok, Twitch, GitHub (partial), thousands of startups

### Styling
```
Tailwind CSS v3 + CSS Variables + PostCSS
```

### Animation Libraries
```
Framer Motion      ← React animations (Figma jaisi smooth)
GSAP (GreenSock)   ← Advanced scroll-based animations
Lenis              ← Butter-smooth scrolling
Three.js           ← 3D hero section
@react-three/fiber ← React wrapper for Three.js
@react-three/drei  ← Three.js helpers
```

### Icons (Professional Grade)
```
Lucide React       ← Primary icons (used by Vercel, Linear, Raycast)
@heroicons/react   ← Secondary (used by Tailwind team, GitHub)
@phosphor-icons/react ← Tertiary (used by many modern products)
```

### Fonts (Modern)
```
Inter          ← Primary UI font (Google, Linear, Vercel use this)
Geist          ← Code/mono font (Vercel's own font)
Geist Sans     ← Alternative to Inter
```
Load via `next/font/google` and `next/font/local`.

### PDF Processing (Browser-Side)
```
pdf-lib          ← Create, merge, split, compress, edit PDFs
pdfjs-dist       ← Render PDF pages, extract text (Mozilla's library)
@pdf-lib/fontkit ← Custom fonts in PDFs
```

### PDF Processing (Server-Side via API)
```
pdf2pic          ← PDF pages to images (server)
pdf-parse        ← Extract text server-side
sharp            ← Image processing/resize
```

### Office Document Conversion
```
mammoth          ← DOCX to HTML/text (browser-safe)
xlsx             ← Excel read/write (SheetJS)
docx             ← Create/edit DOCX files
pptxgenjs        ← Create PPTX files
libreoffice-convert ← Node.js wrapper for LibreOffice (server-side)
```

### Image Tools
```
browser-image-compression ← Compress images client-side
jimp                      ← Image manipulation (server)
sharp                     ← Fast image processing (server)
heic-convert              ← HEIC/HEIF to JPEG conversion
```

### OCR
```
tesseract.js     ← OCR in browser AND Node.js (190+ languages)
```

### Video Downloaders
```
ytdl-core        ← YouTube download (server-side)
yt-dlp-wrap      ← yt-dlp wrapper for Node.js (more platforms)
fluent-ffmpeg    ← Video processing with FFmpeg
```

### File Utilities
```
jszip            ← ZIP file creation/extraction
file-saver       ← Browser file download trigger
archiver         ← ZIP/TAR creation (server)
mime             ← MIME type detection
```

### Markdown/Text/Ebook Conversion
```
marked           ← Markdown to HTML
turndown         ← HTML to Markdown
epub              ← EPUB creation/reading
calibre-web      ← Ebook conversion (external tool)
```

### AI Tools (Chat with PDF, Summarize, Translate)
```
@google/generative-ai  ← Gemini API for AI features
openai                 ← OpenAI API (GPT-4) alternative
langchain              ← AI orchestration
```

### Security/Password
```
crypto-js        ← Client-side encryption
qpdf             ← PDF encryption/decryption (server, via CLI)
```

### UI Components
```
@radix-ui/react-* ← Accessible headless components (used by shadcn)
cmdk              ← Command palette (used by Linear, Vercel)
sonner            ← Toast notifications (used by shadcn/ui)
react-dropzone    ← File upload drag-and-drop
react-pdf         ← PDF viewer in React
```

---

## 3. DESIGN SYSTEM & UI PHILOSOPHY

### Inspiration Sources
| Website | What to Steal |
|---------|--------------|
| **Vercel.com** | Dark theme, card hover effects, gradient borders |
| **Linear.app** | Typography, spacing, keyboard shortcuts UI |
| **Figma.com** | Tool card layout, category filters |
| **GitHub.com** | File upload UX, progress bars |
| **Raycast.com** | Command palette, search |
| **Stripe.com** | Clean white sections, gradient text |
| **Tailwindcss.com** | Code previews, smooth transitions |
| **Framer.com** | 3D animations, perspective cards |
| **Arc Browser** | Sidebar navigation, beautiful gradients |
| **Notion.so** | Clean minimalist tool layout |
| **ilovepdf.com** | Tool card grid (but make it 10x better) |

### Color Palette
```css
/* CSS Variables — globals.css mein add karo */
:root {
  /* Brand */
  --brand-primary: #6366f1;    /* Indigo - professional */
  --brand-secondary: #8b5cf6;  /* Purple */
  --brand-accent: #06b6d4;     /* Cyan */
  
  /* Background */
  --bg-primary: #0a0a0f;       /* Near black */
  --bg-secondary: #111118;     /* Card background */
  --bg-tertiary: #1a1a24;      /* Elevated cards */
  --bg-glass: rgba(255,255,255,0.03); /* Glass morphism */
  
  /* Text */
  --text-primary: #f8fafc;     /* Pure white */
  --text-secondary: #94a3b8;   /* Muted */
  --text-tertiary: #64748b;    /* Very muted */
  
  /* Borders */
  --border-subtle: rgba(255,255,255,0.06);
  --border-default: rgba(255,255,255,0.10);
  --border-strong: rgba(255,255,255,0.18);
  
  /* Gradients */
  --gradient-brand: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
  --gradient-card: linear-gradient(145deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05));
  
  /* Category Colors */
  --cat-convert: #3b82f6;   /* Blue */
  --cat-edit: #10b981;      /* Green */
  --cat-organize: #f59e0b;  /* Amber */
  --cat-security: #ef4444;  /* Red */
  --cat-ai: #8b5cf6;        /* Purple */
  --cat-video: #ec4899;     /* Pink */
}
```

### Typography Scale
```css
/* Use Inter font */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* OR use next/font for better performance */
```

```
Hero Title:    72px, weight 800, letter-spacing -2px
Section Title: 48px, weight 700, letter-spacing -1px  
Card Title:    18px, weight 600
Card Body:     14px, weight 400
Label/Badge:   11px, weight 600, uppercase, letter-spacing 1px
```

### Tool Card Design (Glass Morphism + 3D Tilt)
```
┌─────────────────────────────┐
│  [Icon]  Tool Name          │  ← Icon: 40x40, colored bg
│                             │
│  Short description here     │  ← 2 lines max
│  max 60 characters          │
│                             │
│  [Category Badge]    →      │  ← Arrow appears on hover
└─────────────────────────────┘

States:
- Default: dark bg, subtle border
- Hover: border glows (brand color), card tilts 3-5°, shadow deepens
- Active: scale(0.98)
```

---

## 4. FULL PROJECT ARCHITECTURE

```
ishu-tools/
├── app/                          ← Next.js App Router
│   ├── layout.tsx                ← Root layout (fonts, providers)
│   ├── page.tsx                  ← Homepage
│   ├── tools/
│   │   ├── page.tsx              ← Tools listing page (YOUR MAIN PAGE)
│   │   ├── layout.tsx            ← Tools layout (shared sidebar/header)
│   │   │
│   │   ├── merge-pdf/page.tsx    ← Each tool = its own page
│   │   ├── split-pdf/page.tsx
│   │   ├── compress-pdf/page.tsx
│   │   ├── word-to-pdf/page.tsx
│   │   ├── [toolSlug]/page.tsx   ← Dynamic route for all tools
│   │   └── ...106 tool pages
│   │
│   └── api/                      ← Backend API routes
│       ├── convert/
│       │   ├── word-to-pdf/route.ts
│       │   ├── pdf-to-word/route.ts
│       │   ├── excel-to-pdf/route.ts
│       │   └── ...
│       ├── pdf/
│       │   ├── merge/route.ts
│       │   ├── split/route.ts
│       │   ├── compress/route.ts
│       │   ├── ocr/route.ts
│       │   └── ...
│       ├── video/
│       │   ├── youtube/route.ts
│       │   ├── terabox/route.ts
│       │   └── universal/route.ts
│       └── ai/
│           ├── chat-pdf/route.ts
│           ├── summarize/route.ts
│           └── translate/route.ts
│
├── components/
│   ├── ui/                       ← Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Progress.tsx
│   │   ├── FileUpload.tsx        ← Drag & Drop zone
│   │   ├── ToolCard.tsx          ← Individual tool card
│   │   ├── SearchBar.tsx
│   │   └── CategoryFilter.tsx
│   │
│   ├── tools/                    ← Tool-specific components
│   │   ├── ToolLayout.tsx        ← Shared tool page wrapper
│   │   ├── FileProcessor.tsx     ← Upload → Process → Download flow
│   │   ├── PDFViewer.tsx         ← PDF preview
│   │   └── ProgressTracker.tsx
│   │
│   ├── home/
│   │   ├── HeroSection.tsx       ← 3D animated hero
│   │   ├── ToolsGrid.tsx         ← Grid of all tools
│   │   ├── StatsSection.tsx
│   │   └── HowItWorks.tsx
│   │
│   └── layout/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
│
├── lib/                          ← Core processing logic
│   ├── pdf/
│   │   ├── merge.ts              ← pdf-lib merge logic
│   │   ├── split.ts
│   │   ├── compress.ts
│   │   ├── rotate.ts
│   │   ├── protect.ts
│   │   ├── unlock.ts
│   │   ├── watermark.ts
│   │   ├── extract-text.ts       ← pdfjs-dist
│   │   ├── extract-images.ts
│   │   ├── edit-metadata.ts
│   │   └── page-numbers.ts
│   │
│   ├── convert/
│   │   ├── image-to-pdf.ts       ← jsPDF + canvas
│   │   ├── pdf-to-image.ts       ← pdfjs-dist canvas render
│   │   ├── txt-to-pdf.ts
│   │   ├── csv-to-pdf.ts
│   │   ├── html-to-pdf.ts
│   │   └── markdown-to-pdf.ts
│   │
│   ├── image/
│   │   ├── compress.ts
│   │   ├── heic-convert.ts
│   │   └── resize.ts
│   │
│   ├── video/
│   │   ├── youtube.ts
│   │   └── universal.ts
│   │
│   └── ai/
│       ├── gemini.ts
│       └── chat-pdf.ts
│
├── config/
│   └── tools.ts                  ← ALL 106 tools config (name, slug, icon, category, description)
│
├── hooks/
│   ├── useFileProcessor.ts       ← Upload/process/download state machine
│   ├── useToolSearch.ts
│   └── useSmoothScroll.ts
│
├── public/
│   └── icons/                    ← Any custom SVG icons
│
├── styles/
│   └── globals.css               ← CSS variables, animations
│
├── next.config.js
├── tailwind.config.js
├── package.json
└── .env.local                    ← API keys
```

---

## 5. INSTALLATION — EVERY LIBRARY & TOOL

### Step 1: System Requirements

```bash
# Node.js install karo (v18.17.0 ya usse upar)
# https://nodejs.org se download karo

node --version   # v18+ hona chahiye
npm --version    # v9+ hona chahiye

# IMPORTANT: LibreOffice install karo (Office → PDF ke liye)
# Windows:
# https://www.libreoffice.org/download/download/ se download karo

# Ubuntu/Debian (VPS/Server pe):
sudo apt-get update
sudo apt-get install -y libreoffice

# macOS:
brew install libreoffice

# Verify
libreoffice --version
```

```bash
# FFmpeg install karo (video tools ke liye)
# Windows: https://ffmpeg.org/download.html

# Ubuntu:
sudo apt-get install -y ffmpeg

# macOS:
brew install ffmpeg

# Verify
ffmpeg -version
```

```bash
# Tesseract OCR install karo
# Ubuntu:
sudo apt-get install -y tesseract-ocr tesseract-ocr-hin tesseract-ocr-eng

# macOS:
brew install tesseract

# Windows: https://github.com/UB-Mannheim/tesseract/wiki
```

```bash
# yt-dlp install karo (video downloader)
# Ubuntu/macOS:
pip3 install yt-dlp
# OR
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Windows: https://github.com/yt-dlp/yt-dlp/releases se .exe download karo

# Verify
yt-dlp --version
```

---

### Step 2: Next.js Project Create Karo

```bash
# New project create karo
npx create-next-app@latest ishu-tools --typescript --tailwind --eslint --app --src-dir=false

cd ishu-tools
```

---

### Step 3: ALL npm Packages Install Karo

```bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CORE PDF LIBRARIES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install pdf-lib
# Kya karta hai: PDF create, merge, split, add pages, watermark,
#                protect, edit metadata, add images, add text
# Version: latest (1.17.1+)

npm install pdfjs-dist
# Kya karta hai: PDF render karna (preview), text extract karna,
#                images extract karna, PDF viewer
# Version: 3.x ya 4.x

npm install @pdf-lib/fontkit
# Kya karta hai: Custom fonts PDF mein embed karna
# pdf-lib ke saath use hota hai

npm install jspdf
# Kya karta hai: Scratch se PDF banana (text, images, tables)
# Image-to-PDF ke liye zaroori

npm install jspdf-autotable
# Kya karta hai: jsPDF mein proper tables banana
# CSV-to-PDF ke liye

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PDF SERVER-SIDE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install pdf2pic
# Kya karta hai: PDF pages ko images mein convert karna (server)
# Needs GraphicsMagick or ImageMagick

npm install pdf-parse
# Kya karta hai: PDF se text extract karna (server-side)

npm install hummus-recipe
# Kya karta hai: Advanced PDF manipulation (server)

npm install pdfreader
# Kya karta hai: PDF tables/text structured reading

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# OFFICE DOCUMENT CONVERSION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install mammoth
# Kya karta hai: DOCX → HTML/text conversion (browser + server)
# Word to PDF ka pehla step

npm install docx
# Kya karta hai: DOCX files banana aur edit karna

npm install xlsx
# Kya karta hai: Excel files (XLSX/XLS/CSV) read/write karna
# Excel to PDF ka pehla step (SheetJS)
# Also known as: SheetJS CE

npm install pptxgenjs
# Kya karta hai: PPTX files banana aur edit karna

npm install libreoffice-convert
# Kya karta hai: Node.js se LibreOffice ko call karna
# Word/Excel/PPT → PDF ke liye (most reliable method)
# Requires: LibreOffice installed on system

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# IMAGE PROCESSING
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install browser-image-compression
# Kya karta hai: Browser mein images compress karna
# Supports: JPG, PNG, WebP, HEIC

npm install heic-convert
# Kya karta hai: HEIC/HEIF (Apple format) → JPEG/PNG
# Required for iPhone photos

npm install sharp
# Kya karta hai: Server-side image resize, compress, convert
# Supports: JPEG, PNG, WebP, AVIF, TIFF, GIF, SVG

npm install jimp
# Kya karta hai: Pure JS image processing
# Works in browser too

npm install canvas
# Kya karta hai: Node.js canvas (image manipulation server-side)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# OCR
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install tesseract.js
# Kya karta hai: OCR — images/scanned PDFs se text nikalna
# 100+ languages support karta hai (Hindi bhi)
# Works: browser + Node.js

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# VIDEO DOWNLOADERS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install ytdl-core
# Kya karta hai: YouTube videos download karna (Node.js server)
# Note: Use latest version, YouTube API changes hoti rehti hai

npm install yt-dlp-wrap
# Kya karta hai: yt-dlp CLI tool ka Node.js wrapper
# Supports 1000+ platforms (Instagram, TikTok, Facebook, etc.)
# Best option for universal downloader

npm install fluent-ffmpeg
# Kya karta hai: FFmpeg ko Node.js se control karna
# Video format conversion, quality selection ke liye

npm install @ffmpeg/ffmpeg @ffmpeg/util
# Kya karta hai: FFmpeg browser mein run karna (WebAssembly)
# Client-side video processing ke liye

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TEXT / EBOOK / MARKDOWN
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install marked
# Kya karta hai: Markdown → HTML convert karna

npm install turndown
# Kya karta hai: HTML → Markdown convert karna

npm install @types/turndown

npm install epub-gen
# Kya karta hai: EPUB files banana

npm install epubjs
# Kya karta hai: EPUB files read karna browser mein

npm install jsdom
# Kya karta hai: HTML parsing (HTML to PDF ke liye)

npm install html-to-text
# Kya karta hai: HTML → Plain text

npm install cheerio
# Kya karta hai: HTML scraping/parsing (jQuery-style)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FILE UTILITIES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install jszip
# Kya karta hai: ZIP files banana/extract karna (browser + server)

npm install file-saver
# Kya karta hai: Browser mein file download trigger karna

npm install @types/file-saver

npm install mime
# Kya karta hai: File extension se MIME type detect karna

npm install archiver
# Kya karta hai: ZIP/TAR files banana (server-side)

npm install multer
# Kya karta hai: File upload handling in API routes

npm install formidable
# Kya karta hai: Multipart form data parsing

npm install @types/multer

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# AI / LLM
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install @google/generative-ai
# Kya karta hai: Google Gemini API (Chat with PDF, Summarize, Translate)
# FREE tier available - best choice

npm install openai
# Kya karta hai: OpenAI GPT API (alternative)

npm install langchain
# Kya karta hai: AI chains banana (PDF Q&A ke liye)

npm install @langchain/google-genai
# Kya karta hai: LangChain + Gemini integration

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SECURITY / ENCRYPTION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install crypto-js
# Kya karta hai: AES encryption/decryption client-side
# PDF protect/unlock ke liye (simple password)

npm install @types/crypto-js

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# UI COMPONENT LIBRARIES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install framer-motion
# Kya karta hai: THE animation library for React
# Card animations, page transitions, hover effects

npm install gsap
# Kya karta hai: Advanced animations (scroll-based, timelines)
# Used by: Apple.com, Awwwards winners

npm install @gsap/react
# Kya karta hai: GSAP React integration

npm install lenis
# Kya karta hai: Butter-smooth scrolling
# Used by: studio.razorfish.com, many award-winning sites

npm install three
# Kya karta hai: 3D graphics in browser (WebGL)

npm install @react-three/fiber
# Kya karta hai: Three.js React renderer

npm install @react-three/drei
# Kya karta hai: Three.js helpers (OrbitControls, Text3D, etc.)

npm install @react-spring/three
# Kya karta hai: Spring animations for Three.js

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ICONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install lucide-react
# THE icon library - used by Vercel, Linear, shadcn/ui
# 1000+ professional SVG icons

npm install @heroicons/react
# Tailwind team ka icon library
# Outline + Solid variants

npm install @phosphor-icons/react
# Modern, consistent icon set
# 6000+ icons, multiple weights

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# UI COMPONENTS (HEADLESS)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-progress
npm install @radix-ui/react-tabs
npm install @radix-ui/react-tooltip
npm install @radix-ui/react-slider
# Kya karta hai: Accessible UI components (modal, dropdown, progress, etc.)
# Used by: shadcn/ui, many production apps

npm install cmdk
# Kya karta hai: Command palette (Ctrl+K search)
# Used by: Linear, Vercel, Raycast

npm install sonner
# Kya karta hai: Beautiful toast notifications
# Used by: shadcn/ui

npm install react-dropzone
# Kya karta hai: Drag-and-drop file upload
# Supports: multiple files, file type validation, size limit

npm install react-pdf
# Kya karta hai: PDF viewer component for React

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FONTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Next.js mein font import hota hai, npm package nahi chahiye
# app/layout.tsx mein:
# import { Inter, JetBrains_Mono } from 'next/font/google'

# Geist font (Vercel ka):
npm install geist
# Kya karta hai: Vercel ka official font family

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DRAG AND DROP (PDF page rearrange)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
# Kya karta hai: Drag-and-drop with touch support
# Organize PDF, Rearrange Pages ke liye

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MISC UTILITIES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install clsx tailwind-merge
# Kya karta hai: Conditional CSS classes

npm install react-hot-toast
# Kya karta hai: Notifications (sonner alternative)

npm install axios
# Kya karta hai: HTTP requests (API calls)

npm install swr
# Kya karta hai: Data fetching + caching

npm install zustand
# Kya karta hai: State management (file processing state)

npm install numeral
# Kya karta hai: File size formatting (1.2 MB, etc.)

npm install date-fns
# Kya karta hai: Date utilities

npm install nanoid
# Kya karta hai: Unique ID generation

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DEVELOPMENT TOOLS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

npm install -D @types/node @types/react @types/react-dom typescript
npm install -D prettier prettier-plugin-tailwindcss
npm install -D eslint-config-next
npm install -D @types/jszip
npm install -D @types/three
```

### Step 4: One-Line Install Command (Sab ek baar mein)

```bash
npm install pdf-lib pdfjs-dist @pdf-lib/fontkit jspdf jspdf-autotable pdf2pic pdf-parse mammoth docx xlsx pptxgenjs libreoffice-convert browser-image-compression heic-convert sharp jimp canvas tesseract.js ytdl-core yt-dlp-wrap fluent-ffmpeg @ffmpeg/ffmpeg @ffmpeg/util marked turndown epub-gen epubjs jsdom html-to-text cheerio jszip file-saver mime archiver multer formidable @google/generative-ai langchain @langchain/google-genai crypto-js framer-motion gsap @gsap/react lenis three @react-three/fiber @react-three/drei lucide-react @heroicons/react @phosphor-icons/react @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-progress @radix-ui/react-tabs @radix-ui/react-tooltip @radix-ui/react-slider cmdk sonner react-dropzone react-pdf @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities clsx tailwind-merge zustand axios swr geist nanoid numeral
```

```bash
# Dev dependencies
npm install -D @types/file-saver @types/crypto-js @types/multer @types/three @types/jszip prettier prettier-plugin-tailwindcss
```

---

## 6. TOOL-BY-TOOL ENGINEERING GUIDE (ALL 106 TOOLS)

### 📂 CATEGORY: ORGANIZE (7 Tools)

---

#### 1. MERGE PDF
**Kya karta hai:** Multiple PDF files ek PDF mein combine karna. Page order user decide karta hai.

**Library:** `pdf-lib` (client-side — no server needed)

**Processing Location:** Browser (100% private)

**Workflow:**
```
User uploads multiple PDFs
  → Each file ArrayBuffer mein load karo
  → PDFDocument.load() for each
  → new PDFDocument create karo
  → forEach: copyPages() karke add karo
  → saveAsBase64() → download
```

**Code (lib/pdf/merge.ts):**
```typescript
import { PDFDocument } from 'pdf-lib';

export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }
  
  return await mergedPdf.save();
}
```

---

#### 2. SPLIT PDF
**Kya karta hai:** Ek PDF ko multiple files mein todna. User specify karta hai kaunse pages kahan jayenge.

**Library:** `pdf-lib` (client-side)

**Processing Location:** Browser

**Workflow:**
```
User uploads 1 PDF + specifies split points (e.g., "1-3", "4-7", "8-end")
  → Parse split ranges
  → For each range: new PDFDocument create karo
  → copyPages for that range
  → Save each → zip mein pack karo (jszip)
  → Download ZIP
```

**Code:**
```typescript
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export async function splitPDF(
  file: File, 
  ranges: Array<{start: number, end: number, name: string}>
): Promise<Blob> {
  const zip = new JSZip();
  const sourceBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(sourceBuffer);
  
  for (const range of ranges) {
    const newPdf = await PDFDocument.create();
    const pageIndices = Array.from(
      { length: range.end - range.start + 1 }, 
      (_, i) => range.start + i - 1
    );
    const pages = await newPdf.copyPages(sourcePdf, pageIndices);
    pages.forEach(p => newPdf.addPage(p));
    const bytes = await newPdf.save();
    zip.file(range.name || `split_${range.start}-${range.end}.pdf`, bytes);
  }
  
  return await zip.generateAsync({ type: 'blob' });
}
```

---

#### 3. COMPRESS PDF
**Kya karta hai:** PDF file size kam karna, quality maintain karte hue.

**Library:** `pdf-lib` + image compression tricks

**Processing Location:** Browser (basic) / Server (advanced)

**Workflow:**
```
Method 1 (Browser - pdf-lib):
  PDF load karo → embedded images ko downsample karo → re-save with compression options

Method 2 (Server - ghostscript via API):
  POST /api/pdf/compress
  → file receive karo
  → ghostscript command run karo with quality settings
  → compressed file return karo
```

**Server API (app/api/pdf/compress/route.ts):**
```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const quality = formData.get('quality') as string || 'screen'; 
  // quality options: screen(72dpi), ebook(150dpi), printer(300dpi), prepress
  
  const inputPath = `/tmp/input_${Date.now()}.pdf`;
  const outputPath = `/tmp/output_${Date.now()}.pdf`;
  
  const buffer = Buffer.from(await file.arrayBuffer());
  require('fs').writeFileSync(inputPath, buffer);
  
  await execAsync(
    `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/${quality} -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputPath} ${inputPath}`
  );
  
  const compressed = require('fs').readFileSync(outputPath);
  // cleanup temp files
  require('fs').unlinkSync(inputPath);
  require('fs').unlinkSync(outputPath);
  
  return new Response(compressed, {
    headers: { 'Content-Type': 'application/pdf' }
  });
}
```

*Note: Ghostscript install karna hoga: `sudo apt-get install ghostscript`*

---

#### 4. ORGANIZE PDF
**Kya karta hai:** PDF pages ko drag-and-drop se reorder karna.

**Library:** `pdf-lib` + `@dnd-kit/sortable` + `pdfjs-dist` (preview)

**Processing Location:** Browser

**Workflow:**
```
PDF upload → pdfjs se har page ka thumbnail render karo
  → Grid mein show karo (dnd-kit se sortable)
  → User drag kare → reorder
  → "Save" click → pdf-lib se new PDF banao reordered pages se
```

---

#### 5. ROTATE PDF
**Kya karta hai:** PDF pages rotate karna (90°, 180°, 270°).

**Library:** `pdf-lib` (client-side)

**Key Code:**
```typescript
const page = pdfDoc.getPage(pageIndex);
page.setRotation(degrees(90)); // ya 180, 270, 0
```

---

#### 6. DELETE PAGES
**Kya karta hai:** Specific pages PDF se remove karna.

**Library:** `pdf-lib`

**Logic:** Pages ko removePage() se delete karo, baaki pages se new PDF banao.

---

#### 7. EXTRACT PAGES
**Kya karta hai:** PDF mein se sirf specific pages nikalke new PDF banana.

**Library:** `pdf-lib`

**Logic:** Sirf selected page indices ke liye copyPages() karo new PDF mein.

---

### 📂 CATEGORY: EDIT (13 Tools)

---

#### 8. EDIT PDF (Canvas-based editor)
**Kya karta hai:** PDF pe text/images/shapes draw karna.

**Library:** `pdfjs-dist` (render) + `fabric.js` ya custom canvas

**Processing Location:** Browser

**Workflow:**
```
PDF render with pdfjs → canvas overlay banao → fabric.js se editing tools
  → Undo/Redo support → Save: canvas annotations ko pdf-lib se PDF mein embed karo
```

**Extra Library:**
```bash
npm install fabric
# Kya karta hai: Canvas-based drawing library
```

---

#### 9. EDIT PDF TEXT
**Kya karta hai:** Existing PDF text directly edit karna.

**Library:** `pdf-lib` (text replacement limited hai) — Server approach better

**Note:** Yeh technically mushkil hai kyunki PDFs ka text fixed position pe hota hai. Approach:
- pdfjs se text locations extract karo
- White rectangle se existing text cover karo (whiteout)
- Naya text usi position pe likho

---

#### 10. ADD TEXT
**Kya karta hai:** PDF pe new text add karna (position user choose kare).

**Library:** `pdf-lib`

```typescript
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const page = pdfDoc.getPage(0);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
page.drawText('Your text here', {
  x: 50, y: 700,
  size: 12,
  font,
  color: rgb(0, 0, 0),
});
```

---

#### 11. ADD IMAGE TO PDF
**Kya karta hai:** PDF page pe image insert karna.

**Library:** `pdf-lib`

```typescript
const imageBytes = await imageFile.arrayBuffer();
const image = await pdfDoc.embedJpg(imageBytes); // ya embedPng()
const page = pdfDoc.getPage(0);
page.drawImage(image, {
  x: 50, y: 400,
  width: 200, height: 150,
});
```

---

#### 12. SIGN PDF
**Kya karta hai:** PDF pe digital signature add karna (drawn/typed/uploaded).

**Library:** `pdf-lib` + custom canvas signature pad

**Extra Library:**
```bash
npm install signature_pad
# Kya karta hai: Touch/mouse signature drawing canvas
```

**Workflow:**
```
User draws signature on canvas → export as PNG
  → pdf-lib: embedPng → drawImage at user-chosen position
```

---

#### 13. WATERMARK PDF
**Kya karta hai:** PDF pe text ya image watermark lagana.

**Library:** `pdf-lib`

**Key Code:**
```typescript
// Text watermark with diagonal/opacity
page.drawText('CONFIDENTIAL', {
  x: page.getWidth() / 2 - 100,
  y: page.getHeight() / 2,
  size: 50,
  color: rgb(0.8, 0.8, 0.8),
  opacity: 0.3,
  rotate: degrees(45),
});
```

---

#### 14. PAGE NUMBERS
**Kya karta hai:** PDF pages pe page numbers add karna.

**Library:** `pdf-lib`

---

#### 15. HEADER & FOOTER
**Kya karta hai:** Har page pe custom header/footer add karna.

**Library:** `pdf-lib`

---

#### 16. ANNOTATE PDF
**Kya karta hai:** Comments, notes, sticky notes add karna.

**Library:** `pdf-lib` + custom annotation layer

---

#### 17. HIGHLIGHT PDF
**Kya karta hai:** Text select karke highlight karna.

**Library:** `pdfjs-dist` (text selection) + `pdf-lib` (highlight rectangle draw)

---

#### 18. PDF FILLER
**Kya karta hai:** PDF forms fill karna (form fields detect karke).

**Library:** `pdf-lib`

```typescript
const form = pdfDoc.getForm();
const nameField = form.getTextField('full_name');
nameField.setText('Ravi Kumar');
form.flatten(); // Form ko finalize karo
```

---

#### 19. CROP PDF
**Kya karta hai:** PDF pages ke margins crop karna ya specific area select karna.

**Library:** `pdf-lib`

```typescript
page.setCropBox(x, y, width, height);
// ya MediaBox change karo
```

---

#### 20. REARRANGE PAGES
**Library:** Same as Organize PDF — `pdf-lib` + `@dnd-kit`

---

### 📂 CATEGORY: SECURITY (6 Tools)

---

#### 21. PROTECT PDF
**Kya karta hai:** PDF pe password lock karna.

**Library:** `pdf-lib` (basic) / Server: `qpdf` CLI

**Note:** pdf-lib mein AES-256 encryption ka support limited hai. Server-side approach better:

```bash
# Server mein qpdf install karo
sudo apt-get install qpdf

# Command:
qpdf --encrypt user_pass owner_pass 256 -- input.pdf output.pdf
```

---

#### 22. UNLOCK PDF
**Kya karta hai:** Known password se PDF unlock karna.

**Library:** `pdf-lib`

```typescript
const pdfDoc = await PDFDocument.load(arrayBuffer, {
  password: userPassword,
  ignoreEncryption: false
});
// Decrypt karke re-save karo without password
```

---

#### 23. REDACT PDF
**Kya karta hai:** Sensitive information permanently hide/remove karna.

**Library:** `pdf-lib` (white/black rectangle draw karo over text)

**Important:** True redaction = text bhi remove karna chahiye. Approach:
1. User select kare area
2. White rectangle draw karo
3. Flatten/save karo (text layer bhi remove)

---

#### 24. FLATTEN PDF
**Kya karta hai:** Form fields aur annotations ko permanent content mein convert karna.

**Library:** `pdf-lib`

```typescript
const form = pdfDoc.getForm();
form.flatten();
```

---

#### 25. REMOVE METADATA
**Kya karta hai:** PDF se author, creation date, etc. remove karna.

**Library:** `pdf-lib`

```typescript
pdfDoc.setTitle('');
pdfDoc.setAuthor('');
pdfDoc.setSubject('');
pdfDoc.setKeywords([]);
pdfDoc.setProducer('');
pdfDoc.setCreator('');
pdfDoc.setCreationDate(new Date(0));
pdfDoc.setModificationDate(new Date(0));
```

---

#### 26. EDIT METADATA
**Kya karta hai:** PDF properties edit karna (title, author, etc.).

**Library:** `pdf-lib` (same setters above)

---

### 📂 CATEGORY: CONVERT — To PDF (35+ Tools)

**UNIVERSAL PATTERN for "X to PDF":**

---

#### 27. WORD TO PDF (DOCX/DOC)
**Library:** `libreoffice-convert` (server-side — most accurate)

**Server API:**
```typescript
// app/api/convert/word-to-pdf/route.ts
import libre from 'libreoffice-convert';
import { promisify } from 'util';

const libreConvert = promisify(libre.convert);

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const buffer = Buffer.from(await file.arrayBuffer());
  
  const pdfBuffer = await libreConvert(buffer, '.pdf', undefined);
  
  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="converted.pdf"'
    }
  });
}
```

---

#### 28. EXCEL TO PDF
**Library:** `libreoffice-convert` (same as above, just .xlsx file)

---

#### 29. POWERPOINT TO PDF
**Library:** `libreoffice-convert` (same pattern, .pptx file)

---

#### 30. JPG TO PDF
**Library:** `jsPDF` (client-side — no server needed!)

```typescript
import { jsPDF } from 'jspdf';

export async function jpgToPDF(files: File[]): Promise<Blob> {
  const pdf = new jsPDF();
  
  for (let i = 0; i < files.length; i++) {
    const url = URL.createObjectURL(files[i]);
    const img = new Image();
    img.src = url;
    await new Promise(resolve => img.onload = resolve);
    
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d')!.drawImage(img, 0, 0);
    
    const imgData = canvas.toDataURL('image/jpeg');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (img.height * pdfWidth) / img.width;
    
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    URL.revokeObjectURL(url);
  }
  
  return pdf.output('blob');
}
```

---

#### 31. PNG TO PDF
**Library:** Same as JPG — `jsPDF`

---

#### 32. IMAGE TO PDF (Universal)
**Library:** `jsPDF` — handles JPG, PNG, WebP, GIF, BMP

---

#### 33. HTML TO PDF
**Library:** Server-side with Puppeteer (best quality)

```bash
npm install puppeteer
# Kya karta hai: Headless Chrome — HTML/URL ko PDF mein print karna
```

```typescript
// app/api/convert/html-to-pdf/route.ts
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
  const { html } = await req.json();
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  return new Response(pdf, { headers: { 'Content-Type': 'application/pdf' } });
}
```

---

#### 34. URL TO PDF
**Library:** `puppeteer` (same as HTML to PDF, but `page.goto(url)` use karo)

---

#### 35. TXT TO PDF
**Library:** `jsPDF` (client-side)

```typescript
const pdf = new jsPDF();
const text = await file.text();
const lines = pdf.splitTextToSize(text, 180);
pdf.setFontSize(12);
// Auto page break logic
let y = 20;
lines.forEach((line: string) => {
  if (y > 280) { pdf.addPage(); y = 20; }
  pdf.text(line, 15, y);
  y += 7;
});
```

---

#### 36. CSV TO PDF
**Library:** `jsPDF` + `jspdf-autotable` + `xlsx` (parse CSV)

```typescript
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export async function csvToPDF(file: File): Promise<Blob> {
  const text = await file.text();
  const workbook = XLSX.read(text, { type: 'string' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
  
  const pdf = new jsPDF();
  autoTable(pdf, {
    head: [data[0]],
    body: data.slice(1),
  });
  return pdf.output('blob');
}
```

---

#### 37. SVG TO PDF
**Library:** `pdf-lib` (SVG embed) + `canvg` (SVG to canvas)

```bash
npm install canvg
```

---

#### 38. HEIC TO PDF
**Library:** `heic-convert` (Node.js server) → then `jsPDF`

```typescript
// Server: Convert HEIC to JPEG first, then JPEG to PDF
import heicConvert from 'heic-convert';

const jpegBuffer = await heicConvert({
  buffer: heicBuffer,
  format: 'JPEG',
  quality: 0.9
});
// Then use jsPDF to make PDF from JPEG
```

---

#### 39. WEBP TO PDF
**Library:** `jsPDF` directly supports WebP in modern browsers

---

#### 40. BMP/TIFF/GIF/JFIF TO PDF
**Library:** `sharp` (server: convert to JPEG first) → then `jsPDF`

---

#### 41. EPUB TO PDF
**Library:** Server-side: `calibre` CLI ya `pandoc`

```bash
# Install calibre
sudo apt-get install calibre

# Convert command
ebook-convert input.epub output.pdf

# OR pandoc:
sudo apt-get install pandoc
pandoc input.epub -o output.pdf
```

---

#### 42. MARKDOWN TO PDF
**Library:** `marked` (MD → HTML) → `puppeteer` (HTML → PDF)

---

#### 43. XML TO PDF
**Library:** Parse XML → render as HTML → `puppeteer` to PDF

---

#### 44. DWG/DXF TO PDF
**Library:** Server: `LibreCAD` ya `FreeCAD` CLI

```bash
# LibreCAD install
sudo apt-get install librecad
```

---

#### 45. MOBI/FB2/CHM TO PDF
**Library:** `calibre` CLI ebook-convert

---

#### 46. RTF TO PDF
**Library:** `libreoffice-convert`

---

#### 47. ODT TO PDF
**Library:** `libreoffice-convert`

---

#### 48. WPS TO PDF
**Library:** `libreoffice-convert`

---

#### 49. EML TO PDF
**Library:** `mailparser` (parse email) + `jsPDF`

```bash
npm install mailparser
npm install @types/mailparser
```

---

#### 50. CBZ/CBR TO PDF
**Library:** `jszip` (CBZ = ZIP) / `unrar` (CBR) → images → `jsPDF`

```bash
npm install node-unrar-js
```

---

#### 51. DJVU TO PDF
**Library:** Server: `djvulibre` CLI

```bash
sudo apt-get install djvulibre-bin
# ddjvu -format=pdf input.djvu output.pdf
```

---

#### 52. AI (Adobe Illustrator) TO PDF
**Library:** `ghostscript` server-side (AI files are PostScript based)

---

### 📂 CATEGORY: CONVERT — From PDF (30+ Tools)

---

#### 53. PDF TO WORD (DOCX)
**Library:** Server: `pdf2docx` (Python) ya `libreoffice`

**Best Approach — Python microservice:**
```bash
pip install pdf2docx

# Python script:
# from pdf2docx import Converter
# cv = Converter('input.pdf')
# cv.convert('output.docx')
# cv.close()
```

**OR Node.js:**
```bash
npm install pdf-to-docx
# (wrapper around LibreOffice)
```

---

#### 54. PDF TO EXCEL
**Library:** `pdf-parse` (text extract) + `xlsx` (create Excel)

**Better:** `tabula-py` (Python) ya `camelot-py` for table extraction

```bash
pip install tabula-py
# tabula.convert_into("input.pdf", "output.xlsx", output_format="xlsx", pages='all')
```

---

#### 55. PDF TO POWERPOINT
**Library:** `libreoffice-convert` (server)

---

#### 56. PDF TO JPG/PNG/IMAGE
**Library:** `pdfjs-dist` (browser) ya `pdf2pic` (server)

**Browser approach:**
```typescript
import * as pdfjsLib from 'pdfjs-dist';

export async function pdfToImages(file: File): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const images: Blob[] = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // High res
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    await page.render({
      canvasContext: canvas.getContext('2d')!,
      viewport,
    }).promise;
    
    const blob = await new Promise<Blob>(resolve => 
      canvas.toBlob(b => resolve(b!), 'image/jpeg', 0.95)
    );
    images.push(blob);
  }
  return images;
}
```

---

#### 57. PDF TO HTML
**Library:** `pdfjs-dist` text extraction + manual HTML reconstruction

**Better server option:** `pdf2htmlEX` tool

```bash
# Install pdf2htmlEX
sudo apt-get install pdf2htmlex
```

---

#### 58. PDF TO TXT
**Library:** `pdfjs-dist` (browser text extraction)

```typescript
const page = await pdf.getPage(i);
const textContent = await page.getTextContent();
const text = textContent.items.map((item: any) => item.str).join(' ');
```

---

#### 59. PDF TO EPUB
**Library:** `epub-gen` + text extraction

---

#### 60. PDF TO CSV
**Library:** Table extraction + CSV generation

---

#### 61. PDF TO MOBI
**Library:** `calibre` CLI

---

#### 62. PDF TO PDF/A
**Library:** `ghostscript` server

```bash
gs -dPDFA=2 -dBATCH -dNOPAUSE -sProcessColorModel=DeviceRGB \
   -sDEVICE=pdfwrite -sPDFACompatibilityPolicy=1 \
   -sOutputFile=output.pdf input.pdf
```

---

#### 63. PDF CONVERTER (Universal)
**Library:** Detect format → use appropriate converter above

---

### 📂 CATEGORY: AI & OTHERS (14 Tools)

---

#### 64. OCR PDF
**Kya karta hai:** Scanned PDF (image-based) ko searchable text PDF mein convert karna.

**Library:** `tesseract.js` (browser ya server)

**Workflow:**
```
PDF upload → pdfjs se har page canvas render karo
  → canvas imageData → tesseract.js recognize()
  → Extracted text → pdf-lib se new PDF banao with text layer
```

```typescript
import Tesseract from 'tesseract.js';

const { data: { text } } = await Tesseract.recognize(
  canvasElement,  // ya image URL/blob
  'eng+hin',      // English + Hindi
  {
    logger: m => console.log(m), // Progress callback
  }
);
```

---

#### 65. COMPARE PDF
**Kya karta hai:** Do PDFs ka side-by-side comparison.

**Library:** `pdfjs-dist` (render both) + diff algorithm

**Simple approach:** 
- Both PDFs render karo as canvas
- pixel-diff ya text-diff karo
- Differences highlight karo

```bash
npm install pixelmatch pngjs
# Kya karta hai: Pixel-level image comparison
```

---

#### 66. TRANSLATE PDF
**Kya karta hai:** PDF text translate karna, layout intact rakhna.

**Library:** Google Translate API ya Gemini

**Workflow:**
```
pdfjs se text extract karo (with positions)
  → Batch translate via Google Translate API / Gemini
  → pdf-lib: whiteout original text → naya text same position pe likho
```

```bash
npm install @google-cloud/translate
# OR: Free option — use Gemini API
```

---

#### 67. CHAT WITH PDF
**Kya karta hai:** PDF ke baare mein questions poochho, AI answer de.

**Library:** `@google/generative-ai` (Gemini) + `pdfjs-dist`

**Workflow:**
```
PDF upload → pdfjs text extract → context window mein daal
  → User question → Gemini API call with PDF context + question
  → Response display
```

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function chatWithPDF(pdfText: string, question: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `
    You are a helpful assistant. Answer questions based on this PDF content:
    
    PDF Content:
    ${pdfText.substring(0, 30000)} // Context limit
    
    Question: ${question}
    
    Answer in the same language as the question.
  `;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

---

#### 68. SUMMARIZE PDF
**Library:** `@google/generative-ai` + PDF text extraction

**Prompt:**
```typescript
const prompt = `Summarize this PDF in bullet points: ${pdfText}`;
```

---

#### 69. REPAIR PDF
**Library:** `pdf-lib` (reload with ignoreEncryption flag) / `ghostscript` server

```typescript
// Try to repair by reloading with lenient parsing
const repaired = await PDFDocument.load(corruptBuffer, {
  ignoreEncryption: true,
  throwOnInvalidObject: false,
});
```

---

#### 70. SCAN TO PDF
**Kya karta hai:** Camera/webcam se document scan karke PDF banana.

**Library:** Browser: `getUserMedia` API + canvas capture + `jsPDF`

```bash
npm install react-webcam
# Kya karta hai: Webcam access in React
```

---

#### 71. PDF VIEWER
**Library:** `react-pdf` ya `pdfjs-dist` directly

---

#### 72. CREATE PDF
**Library:** `pdf-lib` (blank PDF create karo with user content)

---

#### 73. RESIZE PAGES
**Library:** `pdf-lib`

```typescript
page.setSize(595, 842); // A4 in points
// ya: PageSizes.A4, PageSizes.Letter, etc.
```

---

#### 74. EXTRACT TEXT
**Library:** `pdfjs-dist` text extraction → download as .txt

---

#### 75. EXTRACT IMAGES
**Library:** `pdfjs-dist` (image objects extract karo)

**Server approach (more reliable):**
```bash
npm install pdfimages  # CLI wrapper
# pdfimages input.pdf output
```

---

#### 76. WHITEOUT PDF
**Library:** `pdf-lib` (white rectangles draw karo over selected areas)

---

#### 77. GRAYSCALE PDF
**Library:** `ghostscript` server

```bash
gs -sOutputFile=output.pdf -sDEVICE=pdfwrite -sColorConversionStrategy=Gray \
   -dProcessColorModel=/DeviceGray -dCompatibilityLevel=1.4 input.pdf
```

---

### 📂 CATEGORY: VIDEO TOOLS (3 Tools)

---

#### 78. YOUTUBE DOWNLOADER
**Processing Location:** Server (API route)

**Library:** `yt-dlp-wrap` (most reliable)

```typescript
// app/api/video/youtube/route.ts
import YTDlpWrap from 'yt-dlp-wrap';

export async function POST(req: Request) {
  const { url, quality } = await req.json();
  const ytDlp = new YTDlpWrap('/usr/local/bin/yt-dlp');
  
  // Get video info first
  const metadata = await ytDlp.getVideoInfo(url);
  
  // For download, stream the video
  const ytDlpEventEmitter = ytDlp.exec([
    url,
    '-f', quality || 'best[height<=720]',
    '-o', '-',  // Output to stdout
  ]);
  
  // Stream response back to client
  const stream = new ReadableStream({...});
  return new Response(stream);
}
```

---

#### 79. TERABOX DOWNLOADER
**Library:** Custom fetch + yt-dlp (supports Terabox)

```bash
yt-dlp "https://terabox.com/s/xxxxx" -o output.mp4
```

---

#### 80. UNIVERSAL VIDEO DOWNLOADER
**Library:** `yt-dlp-wrap` (1000+ platforms support karta hai)

---

## 7. PAGE ROUTING — NEW PAGE (NOT NEW TAB)

### Critical Requirement
User ne clearly kaha hai: **Tool click hone pe same window mein new page open ho, new TAB NAHI.**

### Next.js App Router Solution

```typescript
// config/tools.ts — Har tool ka config
export const tools = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine PDFs in the order you want',
    slug: 'merge-pdf',  // URL: /tools/merge-pdf
    category: 'organize',
    icon: 'FilePlus2',  // Lucide icon name
    color: '#3b82f6',
  },
  // ... 105 more tools
];
```

```tsx
// components/ui/ToolCard.tsx
import Link from 'next/link';  // Next.js Link — same window navigation!
import { motion } from 'framer-motion';

export function ToolCard({ tool }) {
  return (
    <Link href={`/tools/${tool.slug}`}>  {/* NO target="_blank" */}
      <motion.div
        className="tool-card"
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        <ToolIcon name={tool.icon} color={tool.color} />
        <h3>{tool.name}</h3>
        <p>{tool.description}</p>
      </motion.div>
    </Link>
  );
}
```

**IMPORTANT:** `<Link>` component automatically same-window navigation karta hai. `<a target="_blank">` KABHI use mat karo tool cards pe.

### Dynamic Route for All Tools

```
app/tools/[slug]/page.tsx  ← Yeh ek file 106 tools handle karta hai
```

```tsx
// app/tools/[slug]/page.tsx
import { tools } from '@/config/tools';
import { notFound } from 'next/navigation';

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = tools.find(t => t.slug === params.slug);
  if (!tool) notFound();
  
  return <ToolPageLayout tool={tool} />;
}

// Static generation for all 106 pages
export async function generateStaticParams() {
  return tools.map(tool => ({ slug: tool.slug }));
}
```

---

## 8. ANIMATION & 3D EFFECTS SYSTEM

### Framer Motion — Card Animations

```tsx
// Stagger animation for tool grid
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,  // Har card 50ms delay se appear ho
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

// Usage:
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {tools.map(tool => (
    <motion.div key={tool.id} variants={cardVariants}>
      <ToolCard tool={tool} />
    </motion.div>
  ))}
</motion.div>
```

### 3D Tilt Effect on Cards (CSS + JS)

```tsx
// Magnetic tilt effect on hover
function TiltCard({ children }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = ref.current!;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    card.style.transform = `
      perspective(1000px)
      rotateX(${-y / 20}deg)
      rotateY(${x / 20}deg)
      translateZ(10px)
    `;
  };
  
  const handleMouseLeave = () => {
    ref.current!.style.transform = '';
    ref.current!.style.transition = 'transform 0.5s ease';
  };
  
  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.1s ease' }}
    >
      {children}
    </div>
  );
}
```

### Three.js Hero Section

```tsx
// components/home/HeroScene.tsx
'use client';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';

function FloatingOrb() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 100, 200]} scale={2}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <FloatingOrb />
    </Canvas>
  );
}
```

### GSAP Scroll Animations

```tsx
// Scroll-triggered counter animation (Stats section)
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

useEffect(() => {
  gsap.from('.stat-number', {
    textContent: 0,
    duration: 2,
    ease: 'power2.out',
    snap: { textContent: 1 },
    scrollTrigger: {
      trigger: '.stats-section',
      start: 'top center',
    }
  });
}, []);
```

### Gradient Border Effect (Animated)

```css
/* Animated gradient border on hover */
.tool-card {
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  transition: border-color 0.3s;
}

.tool-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}

.tool-card:hover::before {
  opacity: 1;
}
```

---

## 9. SMOOTH SCROLLING & PERFORMANCE

### Lenis Setup (Smooth Scroll)

```tsx
// app/layout.tsx
'use client';
import Lenis from 'lenis';
import { useEffect } from 'react';

export function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    return () => lenis.destroy();
  }, []);
  
  return <>{children}</>;
}
```

### Performance Tips

```typescript
// 1. Lazy load PDF libraries (heavy files)
const pdfLib = await import('pdf-lib');
const pdfjsLib = await import('pdfjs-dist');

// 2. Web Worker for heavy processing (UI freeze nahi hoga)
const worker = new Worker(new URL('./workers/pdf-processor.worker.ts', import.meta.url));

// 3. Virtual list for 106 tool cards
npm install @tanstack/react-virtual
// Render sirf visible cards

// 4. Image lazy loading (all thumbnails)
<Image loading="lazy" ... />

// 5. Code splitting (har tool page alag chunk)
// Next.js App Router automatically karta hai yeh
```

### next.config.js — Performance Config

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Large file upload support
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
  
  // Webpack config for heavy libs
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  
  // Headers for file upload
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## 10. ICONS SYSTEM — PROFESSIONAL GRADE

### Icon Usage Guide

```tsx
// Lucide React — Primary (Vercel style)
import { 
  FilePlus2,    // Merge PDF
  Scissors,     // Split PDF
  Minimize2,    // Compress PDF
  FileText,     // Word to PDF
  Image,        // JPG to PDF
  Lock,         // Protect PDF
  Unlock,       // Unlock PDF
  Eye,          // PDF Viewer
  Search,       // OCR PDF
  Languages,    // Translate PDF
  MessageSquare,// Chat with PDF
  Sparkles,     // AI tools
  Download,     // Download
  Upload,       // Upload
  Shield,       // Security
  Zap,          // Lightning fast
  Globe,        // HTML/URL to PDF
  Video,        // Video tools
  Youtube,      // YouTube downloader
  FileCode,     // Code/XML
  Table,        // Excel/CSV
  Presentation, // PowerPoint
  BookOpen,     // EPUB/eBook
  Pen,          // Edit/Sign
  Type,         // Add Text
  ImagePlus,    // Add Image
  Stamp,        // Watermark
  Hash,         // Page Numbers
  AlignCenter,  // Header Footer
  MessageCircle,// Annotate
  Highlighter,  // Highlight
  FormInput,    // PDF Filler
  Eraser,       // Redact/Whiteout
  RotateCcw,    // Rotate
  Crop,         // Crop
  Trash2,       // Delete Pages
  GripVertical, // Rearrange
  Copy,         // Extract Pages
  ScanLine,     // Scan/OCR
  Loader2,      // Loading spinner
  CheckCircle2, // Success
  AlertCircle,  // Error
} from 'lucide-react';

// Tool ke category se icon aur color assign karo
const categoryConfig = {
  organize: { color: '#f59e0b', bgColor: 'rgba(245,158,11,0.1)' },
  edit: { color: '#10b981', bgColor: 'rgba(16,185,129,0.1)' },
  convert: { color: '#3b82f6', bgColor: 'rgba(59,130,246,0.1)' },
  security: { color: '#ef4444', bgColor: 'rgba(239,68,68,0.1)' },
  ai: { color: '#8b5cf6', bgColor: 'rgba(139,92,246,0.1)' },
  video: { color: '#ec4899', bgColor: 'rgba(236,72,153,0.1)' },
};
```

### Tool Icon Component

```tsx
function ToolIcon({ name, category }: { name: string; category: string }) {
  const { color, bgColor } = categoryConfig[category];
  const Icon = icons[name]; // Dynamic import from lucide
  
  return (
    <div 
      className="icon-wrapper"
      style={{ 
        background: bgColor, 
        borderRadius: '10px',
        padding: '10px',
        display: 'inline-flex',
      }}
    >
      <Icon size={24} color={color} strokeWidth={1.5} />
    </div>
  );
}
```

---

## 11. MODERN DESIGN INSPIRATION SOURCES

### Study These Carefully

| Source | URL | Kya seekhna hai |
|--------|-----|-----------------|
| Vercel.com | vercel.com | Dark theme, card grid, gradient accents |
| Linear.app | linear.app | Typography system, keyboard-first UX |
| Figma.com | figma.com | Tool filtering, category tabs |
| Raycast.com | raycast.com | Command palette, search UX |
| Stripe.com | stripe.com | Clean sections, trust signals |
| GitHub.com | github.com | File upload UX, progress indicators |
| Framer.com | framer.com | 3D animations, perspective cards |
| Tailwindcss.com | tailwindcss.com | Documentation layout, smooth transitions |
| ILovePDF.com | ilovepdf.com | Tool cards (but make them way better) |
| Smallpdf.com | smallpdf.com | Tool page layout, drag-drop UX |
| Notion.so | notion.so | Minimal, clean design |
| Arc Browser | arc.net | Gradient usage, sidebar |
| Lottiefiles.com | lottiefiles.com | Micro-animations |

### CSS Techniques to Steal

```css
/* 1. Vercel-style gradient text */
.gradient-text {
  background: linear-gradient(135deg, #fff 0%, #888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 2. Glass morphism cards */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* 3. Noise texture overlay (gives depth) */
.noise-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  opacity: 0.03;
  pointer-events: none;
}

/* 4. Glow effect on hover */
.glow-card:hover {
  box-shadow: 
    0 0 0 1px rgba(99,102,241,0.3),
    0 0 20px rgba(99,102,241,0.15),
    0 0 60px rgba(99,102,241,0.05);
}

/* 5. Shimmer loading skeleton */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
.skeleton {
  background: linear-gradient(90deg, #1a1a24 25%, #2a2a34 50%, #1a1a24 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

---

## 12. COMPLETE FILE STRUCTURE

```
ishu-tools/
├── app/
│   ├── globals.css              ← CSS variables, base styles
│   ├── layout.tsx               ← Root layout
│   ├── page.tsx                 ← Redirect to /tools
│   └── tools/
│       ├── page.tsx             ← Main tools listing page
│       ├── layout.tsx           ← Tools layout wrapper
│       └── [slug]/
│           └── page.tsx         ← Dynamic tool page
│
├── app/api/
│   ├── convert/
│   │   ├── office-to-pdf/route.ts    ← Word/Excel/PPT to PDF
│   │   ├── pdf-to-word/route.ts
│   │   ├── pdf-to-excel/route.ts
│   │   ├── html-to-pdf/route.ts      ← Puppeteer
│   │   └── url-to-pdf/route.ts
│   ├── pdf/
│   │   ├── compress/route.ts         ← Ghostscript
│   │   ├── ocr/route.ts             ← Tesseract
│   │   ├── protect/route.ts         ← qpdf
│   │   ├── unlock/route.ts
│   │   ├── grayscale/route.ts
│   │   └── repair/route.ts
│   ├── video/
│   │   ├── info/route.ts            ← Get video metadata
│   │   └── download/route.ts        ← yt-dlp stream
│   └── ai/
│       ├── chat/route.ts            ← Gemini chat
│       ├── summarize/route.ts
│       └── translate/route.ts
│
├── components/
│   ├── ui/
│   │   ├── ToolCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── FileUpload.tsx           ← react-dropzone
│   │   ├── ProgressBar.tsx
│   │   ├── Button.tsx
│   │   └── Badge.tsx
│   ├── tools/
│   │   ├── ToolPageLayout.tsx       ← Shared wrapper
│   │   ├── FileProcessor.tsx        ← Upload → Process → Download
│   │   └── PDFPreview.tsx
│   └── home/
│       ├── HeroSection.tsx
│       ├── ToolsGrid.tsx
│       └── StatsSection.tsx
│
├── lib/
│   ├── pdf/
│   │   ├── merge.ts
│   │   ├── split.ts
│   │   ├── compress.ts
│   │   ├── rotate.ts
│   │   ├── protect.ts
│   │   ├── watermark.ts
│   │   ├── extract-text.ts
│   │   └── page-numbers.ts
│   ├── convert/
│   │   ├── image-to-pdf.ts
│   │   ├── pdf-to-image.ts
│   │   ├── txt-to-pdf.ts
│   │   └── csv-to-pdf.ts
│   └── ai/
│       └── gemini.ts
│
├── config/
│   └── tools.ts                 ← Master tool registry
│
├── hooks/
│   ├── useFileProcessor.ts
│   ├── useToolSearch.ts
│   └── useLenis.ts
│
├── public/
│   └── workers/
│       └── pdf.worker.js        ← pdfjs worker file
│
├── .env.local                   ← Environment variables
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 13. API ROUTES ARCHITECTURE (BACKEND)

### File Upload Pattern (Sabhi API routes ke liye)

```typescript
// app/api/pdf/compress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const config = {
  api: { bodyParser: false }
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Validate file type
    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files allowed' }, { status: 400 });
    }
    
    // Save to temp
    const inputId = `input_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const inputPath = join('/tmp', `${inputId}.pdf`);
    const outputPath = join('/tmp', `output_${inputId}.pdf`);
    
    const bytes = await file.arrayBuffer();
    await writeFile(inputPath, Buffer.from(bytes));
    
    // Process (example: ghostscript compress)
    await execAsync(
      `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`
    );
    
    // Read result
    const resultBuffer = require('fs').readFileSync(outputPath);
    
    // Cleanup
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
    
    return new NextResponse(resultBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="compressed_${file.name}"`,
      },
    });
    
  } catch (error) {
    console.error('Compress error:', error);
    return NextResponse.json(
      { error: 'Processing failed. Please try again.' }, 
      { status: 500 }
    );
  }
}
```

### Client-Side File Processor Hook

```typescript
// hooks/useFileProcessor.ts
import { useState, useCallback } from 'react';

type ProcessingState = 'idle' | 'uploading' | 'processing' | 'done' | 'error';

export function useFileProcessor() {
  const [state, setState] = useState<ProcessingState>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const processFile = useCallback(async (
    files: File[],
    endpoint: string,
    extraData?: Record<string, string>
  ) => {
    setState('uploading');
    setProgress(0);
    setError(null);
    
    try {
      const formData = new FormData();
      files.forEach((f, i) => formData.append(i === 0 ? 'file' : `file_${i}`, f));
      if (extraData) {
        Object.entries(extraData).forEach(([k, v]) => formData.append(k, v));
      }
      
      setState('processing');
      setProgress(30);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Processing failed');
      }
      
      setProgress(90);
      const blob = await response.blob();
      setResult(blob);
      setState('done');
      setProgress(100);
      
    } catch (err: any) {
      setError(err.message);
      setState('error');
    }
  }, []);
  
  const downloadResult = useCallback((filename: string) => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);
  
  return { state, progress, result, error, processFile, downloadResult };
}
```

---

## 14. DEPLOYMENT GUIDE

### Environment Variables (.env.local)

```env
# AI APIs
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_key_here  # optional

# File size limits
MAX_FILE_SIZE=52428800  # 50MB in bytes

# Server tools paths (production server pe)
LIBREOFFICE_PATH=/usr/bin/libreoffice
GHOSTSCRIPT_PATH=/usr/bin/gs
TESSERACT_PATH=/usr/bin/tesseract
YTDLP_PATH=/usr/local/bin/yt-dlp
FFMPEG_PATH=/usr/bin/ffmpeg
```

### Vercel Deployment

```bash
# Vercel pe deploy karo
npm install -g vercel
vercel

# Note: Vercel ke serverless functions mein kuch limitations hain:
# - Binary tools (LibreOffice, Ghostscript) directly install nahi ho sakte
# - Solution: Use Vercel Edge Config ya custom Docker container
```

### Self-Hosted VPS (Recommended for Full Functionality)

```bash
# Ubuntu 22.04 VPS pe deploy karo

# 1. Node.js install
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. All system tools install
sudo apt-get update && sudo apt-get install -y \
  libreoffice \
  ghostscript \
  tesseract-ocr \
  tesseract-ocr-hin \
  tesseract-ocr-eng \
  ffmpeg \
  imagemagick \
  graphicsmagick \
  qpdf \
  djvulibre-bin \
  calibre \
  pandoc \
  poppler-utils

# 3. yt-dlp install
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
  -o /usr/local/bin/yt-dlp && sudo chmod a+rx /usr/local/bin/yt-dlp

# 4. Python tools
pip3 install pdf2docx tabula-py

# 5. PM2 install (process manager)
npm install -g pm2

# 6. Project clone aur build
git clone your-repo
cd ishu-tools
npm install
npm run build

# 7. Start with PM2
pm2 start npm --name "ishu-tools" -- start
pm2 save
pm2 startup
```

### Nginx Configuration (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name ishu.fun www.ishu.fun;
    
    # File upload size
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout for large file processing
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
```

---

## 15. TROUBLESHOOTING COMMON ISSUES

### Issue 1: LibreOffice not found
```bash
# Check path
which libreoffice
# Add to env: LIBREOFFICE_PATH=/usr/bin/soffice
```

### Issue 2: PDF processing freezes browser
```
Solution: Use Web Worker for heavy operations
const worker = new Worker('/workers/pdf-worker.js');
```

### Issue 3: pdfjs-dist worker error
```javascript
// next.config.js mein add karo:
config.copy = [
  { from: 'node_modules/pdfjs-dist/build/pdf.worker.js', to: 'public/pdf.worker.js' }
];

// Usage:
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
```

### Issue 4: File too large error
```javascript
// next.config.js
experimental: {
  serverActions: {
    bodySizeLimit: '50mb',
  },
},
```

### Issue 5: HEIC conversion fails
```bash
npm install heic-convert
# Also needs: sudo apt-get install libvips-dev
```

### Issue 6: YouTube download blocked
```bash
# Update yt-dlp regularly
yt-dlp -U
# YouTube anti-bot measures ke karan regular updates zaroori hain
```

---

## 📊 COMPLETE TOOL CATEGORY SUMMARY

| Category | Count | Processing | Main Libraries |
|----------|-------|-----------|----------------|
| Organize | 7 | Browser | pdf-lib, @dnd-kit |
| Edit | 13 | Browser | pdf-lib, pdfjs-dist, fabric.js |
| Convert (to PDF) | 35 | Browser + Server | jsPDF, libreoffice-convert, puppeteer |
| Convert (from PDF) | 28 | Browser + Server | pdfjs-dist, pdf-parse, libreoffice |
| Security | 6 | Browser + Server | pdf-lib, qpdf, crypto-js |
| AI & Others | 14 | Browser + Server | tesseract.js, Gemini API, puppeteer |
| Video | 3 | Server | yt-dlp-wrap, ytdl-core, fluent-ffmpeg |
| **TOTAL** | **106** | | |

---

## 🎯 QUICK START CHECKLIST

```
□ Node.js 20+ install karo
□ System tools install karo (LibreOffice, Ghostscript, FFmpeg, Tesseract, yt-dlp)
□ npx create-next-app@latest ishu-tools --typescript --tailwind --app
□ npm install [sab packages upar listed hain]
□ .env.local file banao aur GEMINI_API_KEY add karo
□ config/tools.ts mein sare 106 tools ka config add karo
□ lib/ folder mein processing logic implement karo
□ API routes banao app/api/ mein
□ UI components banao
□ Test karo locally: npm run dev
□ VPS pe deploy karo
□ Nginx configure karo
□ SSL certificate lagao (Let's Encrypt)
```

---

*Yeh blueprint follow karo aur ishu.fun ke sare 106 tools perfectly kaam karenge. Koi bhi specific tool ke baare mein zyada detail chahiye to batao!*

**Built for ISHU — Indian StudentHub University | ishu.fun**
*India's #1 Free Education Platform*
