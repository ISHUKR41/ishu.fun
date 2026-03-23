# 🎬 Universal Video Downloader Tool — Complete Build Guide

> Ek powerful tool jo kisi bhi platform (YouTube, Instagram, Twitter/X, Facebook, TikTok, Vimeo, Dailymotion, Reddit, aur 1000+ sites) se video download kare — quality selection, preview, aur no restrictions ke saath.

---

## 📌 Table of Contents

1. [Tool Overview](#tool-overview)
2. [Core Libraries & Tools](#core-libraries--tools)
3. [Tech Stack](#tech-stack)
4. [Folder Structure](#folder-structure)
5. [Backend Setup (Node.js + Express)](#backend-setup)
6. [Frontend Setup (React/Next.js)](#frontend-setup)
7. [MCP Integration](#mcp-integration)
8. [API Endpoints](#api-endpoints)
9. [Installation Commands](#installation-commands)
10. [Environment Variables](#environment-variables)
11. [Feature Checklist](#feature-checklist)
12. [Supported Platforms](#supported-platforms)
13. [Deployment Guide](#deployment-guide)
14. [System Prompt (AI-powered variant)](#system-prompt)

---

## 🎯 Tool Overview

```
User pastes URL → Tool detects platform → Fetches available qualities →
User selects quality (480p/720p/1080p/2160p) → Preview option → Download
```

**Key Features:**
- ✅ Any URL from any website/platform
- ✅ Quality selection: 144p → 2160p (4K)
- ✅ Video preview before download
- ✅ Audio-only download option (MP3/M4A)
- ✅ Batch download (multiple URLs)
- ✅ Download progress bar (real-time)
- ✅ No platform restrictions
- ✅ Cookie-based authentication support (private/age-restricted videos)
- ✅ Subtitle/caption download
- ✅ Thumbnail extraction
- ✅ MCP server integration

---

## 🔧 Core Libraries & Tools

### 🟢 Primary Downloader Engine

| Library | Description | Install |
|---------|-------------|---------|
| **yt-dlp** | Most powerful video downloader — 1000+ sites support. Successor to youtube-dl | `pip install yt-dlp` |
| **ffmpeg** | Video/audio merging, conversion, re-encoding | System package |
| **ffprobe** | Video metadata extraction | Included with ffmpeg |

> ⚠️ **yt-dlp is the CORE ENGINE** — ye akela 1000+ platforms handle karta hai including YouTube, Instagram, TikTok, Twitter, Facebook, Vimeo, Twitch, etc.

---

### 🟡 Node.js Backend Libraries

```
npm install:
```

| Package | Purpose |
|---------|---------|
| `express` | Web server / REST API |
| `yt-dlp-wrap` | Node.js wrapper for yt-dlp |
| `fluent-ffmpeg` | Node.js wrapper for ffmpeg |
| `socket.io` | Real-time download progress |
| `cors` | Cross-origin requests |
| `multer` | File handling |
| `axios` | HTTP requests |
| `uuid` | Unique download session IDs |
| `dotenv` | Environment variables |
| `node-cache` | Caching video info |
| `p-limit` | Concurrent download limiting |
| `archiver` | ZIP multiple files for batch download |
| `express-rate-limit` | Rate limiting |
| `helmet` | Security headers |
| `morgan` | Request logging |
| `winston` | Advanced logging |
| `bull` | Download queue management (Redis-based) |
| `ioredis` | Redis client (for queue) |

---

### 🔵 Frontend Libraries (React/Next.js)

```
npm install:
```

| Package | Purpose |
|---------|---------|
| `next` | Full-stack React framework |
| `react` + `react-dom` | UI framework |
| `tailwindcss` | Utility-first styling |
| `framer-motion` | Animations |
| `socket.io-client` | Real-time progress updates |
| `react-player` | Video preview player |
| `@radix-ui/react-select` | Quality selector dropdown |
| `@radix-ui/react-progress` | Progress bar component |
| `@radix-ui/react-dialog` | Preview modal |
| `lucide-react` | Icons |
| `react-hot-toast` | Notifications/alerts |
| `react-hook-form` | URL input form handling |
| `zod` | URL validation schema |
| `clsx` | Conditional classNames |
| `copy-to-clipboard` | Copy download link |

---

### 🟣 Additional Tools / Repos

| Tool/Repo | Purpose | Link |
|-----------|---------|------|
| **yt-dlp** (Python) | Main extractor engine | `github.com/yt-dlp/yt-dlp` |
| **ffmpeg** | Media processing | `ffmpeg.org` |
| **cobalt** (open-source) | Reference architecture for web-based downloader | `github.com/imputnet/cobalt` |
| **Puppeteer** | Headless Chrome — for JS-heavy sites | `npm i puppeteer` |
| **Playwright** | Alternative to Puppeteer | `npm i playwright` |
| **cheerio** | HTML parsing / scraping | `npm i cheerio` |
| **node-fetch** | Fetch API for Node | `npm i node-fetch` |

---

## 🏗️ Tech Stack

```
┌─────────────────────────────────────────────┐
│              FRONTEND (Next.js)              │
│   React + TailwindCSS + Socket.io Client     │
│   react-player (preview) + framer-motion    │
└────────────────┬────────────────────────────┘
                 │ REST API + WebSocket
┌────────────────▼────────────────────────────┐
│             BACKEND (Node.js/Express)        │
│   yt-dlp-wrap + fluent-ffmpeg + Bull Queue   │
│   Socket.io Server + Redis                  │
└────────────────┬────────────────────────────┘
                 │ Spawns process
┌────────────────▼────────────────────────────┐
│         yt-dlp (Python binary)              │
│    + ffmpeg (media processing)              │
│    Supports 1000+ platforms                 │
└─────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
video-downloader/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── download.js        # Download endpoints
│   │   │   ├── info.js            # Video info fetch
│   │   │   └── stream.js          # Preview streaming
│   │   ├── services/
│   │   │   ├── ytdlp.service.js   # yt-dlp wrapper logic
│   │   │   ├── ffmpeg.service.js  # FFmpeg processing
│   │   │   ├── queue.service.js   # Bull queue
│   │   │   └── cache.service.js   # Node-cache
│   │   ├── middleware/
│   │   │   ├── rateLimit.js
│   │   │   └── validate.js
│   │   ├── utils/
│   │   │   ├── platform.js        # Platform detection
│   │   │   └── fileCleanup.js     # Temp file cleanup
│   │   └── index.js               # Express entry point
│   ├── downloads/                 # Temp download folder
│   ├── cookies/                   # Platform cookies (optional)
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── page.jsx               # Main UI
│   │   ├── layout.jsx
│   │   └── api/                   # Next.js API routes (optional)
│   ├── components/
│   │   ├── URLInput.jsx           # Paste URL input
│   │   ├── QualitySelector.jsx    # 480p/720p/1080p/4K
│   │   ├── VideoPreview.jsx       # Preview player
│   │   ├── DownloadProgress.jsx   # Real-time progress bar
│   │   ├── VideoMetadata.jsx      # Title, thumbnail, duration
│   │   └── BatchDownload.jsx      # Multiple URLs
│   ├── hooks/
│   │   ├── useVideoInfo.js
│   │   └── useDownload.js
│   └── package.json
│
├── mcp-server/
│   ├── index.js                   # MCP Server entry
│   ├── tools/
│   │   ├── fetchVideoInfo.js
│   │   ├── downloadVideo.js
│   │   └── getQualities.js
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## ⚙️ Backend Setup

### `backend/src/index.js`

```javascript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import downloadRoutes from './routes/download.js';
import infoRoutes from './routes/info.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/info', infoRoutes);
app.use('/api/download', downloadRoutes);

// Attach socket.io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

httpServer.listen(5000, () => console.log('Server running on :5000'));
```

---

### `backend/src/services/ytdlp.service.js`

```javascript
import YTDlpWrap from 'yt-dlp-wrap';
const ytDlp = new YTDlpWrap();

// Fetch video metadata + available qualities
export async function getVideoInfo(url) {
  const info = await ytDlp.getVideoInfo(url);
  
  const formats = info.formats
    .filter(f => f.vcodec !== 'none') // video only
    .map(f => ({
      formatId: f.format_id,
      quality: f.height ? `${f.height}p` : 'unknown',
      ext: f.ext,
      filesize: f.filesize,
      fps: f.fps,
      vcodec: f.vcodec,
      acodec: f.acodec,
    }))
    .sort((a, b) => (parseInt(b.quality) || 0) - (parseInt(a.quality) || 0));

  return {
    title: info.title,
    thumbnail: info.thumbnail,
    duration: info.duration,
    platform: info.extractor,
    uploader: info.uploader,
    description: info.description,
    formats: [...new Map(formats.map(f => [f.quality, f])).values()], // dedupe
  };
}

// Download video with selected quality
export async function downloadVideo(url, formatId, outputPath, onProgress) {
  return new Promise((resolve, reject) => {
    ytDlp.exec([
      url,
      '-f', `${formatId}+bestaudio/best`,  // merge video+audio
      '--merge-output-format', 'mp4',
      '-o', outputPath,
      '--no-playlist',
      '--cookies', './cookies/cookies.txt', // optional: for auth
    ])
    .on('ytDlpEvent', (eventType, data) => {
      if (eventType === 'download') {
        const match = data.match(/(\d+\.?\d*)%/);
        if (match) onProgress(parseFloat(match[1]));
      }
    })
    .on('close', resolve)
    .on('error', reject);
  });
}
```

---

### `backend/src/routes/info.js`

```javascript
import express from 'express';
import { getVideoInfo } from '../services/ytdlp.service.js';
const router = express.Router();

// POST /api/info
router.post('/', async (req, res) => {
  const { url } = req.body;
  
  if (!url) return res.status(400).json({ error: 'URL required' });
  
  try {
    const info = await getVideoInfo(url);
    res.json({ success: true, data: info });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
```

---

### `backend/src/routes/download.js`

```javascript
import express from 'express';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { downloadVideo } from '../services/ytdlp.service.js';
const router = express.Router();

// POST /api/download
router.post('/', async (req, res) => {
  const { url, formatId, quality } = req.body;
  const sessionId = uuid();
  const outputPath = `./downloads/${sessionId}.mp4`;

  // Start download, emit progress via socket
  res.json({ success: true, sessionId });

  try {
    await downloadVideo(url, formatId, outputPath, (progress) => {
      req.io.emit(`progress:${sessionId}`, { progress });
    });
    req.io.emit(`progress:${sessionId}`, {
      progress: 100,
      done: true,
      downloadUrl: `/files/${sessionId}.mp4`
    });
  } catch (err) {
    req.io.emit(`progress:${sessionId}`, { error: err.message });
  }
});

// Serve downloaded files
router.use('/files', express.static('./downloads'));

export default router;
```

---

## 🎨 Frontend Setup

### `frontend/components/URLInput.jsx`

```jsx
import { useState } from 'react';
import axios from 'axios';

export default function URLInput({ onVideoLoaded }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/info', { url });
      onVideoLoaded(data.data);
    } catch (err) {
      alert('Error: ' + err.response?.data?.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      <input
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Paste any video URL here..."
        className="flex-1 px-4 py-3 rounded-xl border text-lg"
      />
      <button
        onClick={handleFetch}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl"
      >
        {loading ? 'Fetching...' : 'Fetch Video'}
      </button>
    </div>
  );
}
```

---

### `frontend/components/QualitySelector.jsx`

```jsx
export default function QualitySelector({ formats, selected, onSelect }) {
  const qualityOrder = ['2160p', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];
  
  const sorted = formats.sort((a, b) => {
    return qualityOrder.indexOf(a.quality) - qualityOrder.indexOf(b.quality);
  });

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {sorted.map(f => (
        <button
          key={f.formatId}
          onClick={() => onSelect(f)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition
            ${selected?.formatId === f.formatId
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
            }`}
        >
          {f.quality} · {f.ext}
          {f.filesize && <span className="text-xs ml-1 opacity-60">
            ({(f.filesize / 1024 / 1024).toFixed(1)}MB)
          </span>}
        </button>
      ))}
    </div>
  );
}
```

---

### `frontend/components/VideoPreview.jsx`

```jsx
import ReactPlayer from 'react-player';

export default function VideoPreview({ url, thumbnail, title }) {
  return (
    <div className="mt-6 rounded-2xl overflow-hidden shadow-lg">
      <ReactPlayer
        url={url}
        light={thumbnail}    // Show thumbnail first
        controls={true}
        width="100%"
        height="400px"
        playing={false}
        config={{
          youtube: { playerVars: { showinfo: 1 } },
          file: { attributes: { controlsList: 'nodownload' } }
        }}
      />
      <div className="p-4 bg-gray-900 text-white">
        <h3 className="font-semibold text-lg truncate">{title}</h3>
      </div>
    </div>
  );
}
```

---

### `frontend/components/DownloadProgress.jsx`

```jsx
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function DownloadProgress({ sessionId, downloadUrl: initialUrl }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(initialUrl);

  useEffect(() => {
    if (!sessionId) return;
    const socket = io('http://localhost:5000');
    socket.on(`progress:${sessionId}`, (data) => {
      setProgress(data.progress);
      if (data.done) {
        setDone(true);
        setDownloadUrl(data.downloadUrl);
      }
    });
    return () => socket.disconnect();
  }, [sessionId]);

  return (
    <div className="mt-6">
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="h-4 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-center mt-2 text-sm text-gray-600">{progress.toFixed(1)}%</p>
      {done && downloadUrl && (
        <a
          href={`http://localhost:5000${downloadUrl}`}
          download
          className="block mt-4 text-center py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
        >
          ⬇️ Download Ready — Click to Save
        </a>
      )}
    </div>
  );
}
```

---

## 🤖 MCP Integration

### `mcp-server/index.js`

```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getVideoInfo, downloadVideo } from '../backend/src/services/ytdlp.service.js';

const server = new Server(
  { name: "video-downloader", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// TOOL 1: Fetch video info + available qualities
server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: "fetch_video_info",
      description: "Get video metadata and available download qualities from any URL",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "Video URL from any platform" }
        },
        required: ["url"]
      }
    },
    {
      name: "download_video",
      description: "Download video in specified quality",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string" },
          quality: { type: "string", enum: ["144p","240p","360p","480p","720p","1080p","1440p","2160p"] },
          format: { type: "string", enum: ["mp4", "mkv", "webm", "mp3", "m4a"] }
        },
        required: ["url", "quality"]
      }
    },
    {
      name: "get_thumbnail",
      description: "Extract video thumbnail URL",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string" }
        },
        required: ["url"]
      }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler('tools/call', async (req) => {
  const { name, arguments: args } = req.params;
  
  if (name === 'fetch_video_info') {
    const info = await getVideoInfo(args.url);
    return { content: [{ type: 'text', text: JSON.stringify(info, null, 2) }] };
  }
  
  if (name === 'download_video') {
    const outputPath = `./downloads/${Date.now()}.mp4`;
    await downloadVideo(args.url, args.quality, outputPath, () => {});
    return { content: [{ type: 'text', text: `Downloaded to: ${outputPath}` }] };
  }
  
  if (name === 'get_thumbnail') {
    const info = await getVideoInfo(args.url);
    return { content: [{ type: 'text', text: info.thumbnail }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

### MCP Config (`claude_desktop_config.json` / `.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "video-downloader": {
      "command": "node",
      "args": ["./mcp-server/index.js"],
      "env": {
        "YTDLP_PATH": "/usr/local/bin/yt-dlp",
        "FFMPEG_PATH": "/usr/bin/ffmpeg",
        "DOWNLOAD_DIR": "./downloads"
      }
    }
  }
}
```

---

## 📡 API Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| `POST` | `/api/info` | `{ url }` | Video metadata + formats array |
| `POST` | `/api/download` | `{ url, formatId, quality }` | `{ sessionId }` |
| `GET` | `/files/:sessionId.mp4` | — | File stream |
| `GET` | `/api/status/:sessionId` | — | Progress % |
| `POST` | `/api/batch` | `{ urls[], quality }` | `{ batchId }` |
| `GET` | `/api/platforms` | — | List of 1000+ supported sites |
| `WS` | `progress:{sessionId}` | Socket event | `{ progress, done, downloadUrl }` |

---

## 💻 Installation Commands

### Step 1 — System Dependencies

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y python3 python3-pip ffmpeg

# macOS
brew install python ffmpeg

# Windows (via Chocolatey)
choco install python ffmpeg
```

### Step 2 — Install yt-dlp

```bash
pip install yt-dlp

# OR direct binary (recommended for server)
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
  -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

### Step 3 — Backend

```bash
cd backend
npm install express yt-dlp-wrap fluent-ffmpeg socket.io cors multer axios \
  uuid dotenv node-cache p-limit archiver express-rate-limit \
  helmet morgan winston bull ioredis
```

### Step 4 — Frontend

```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --app
npm install react-player socket.io-client framer-motion axios \
  @radix-ui/react-select @radix-ui/react-progress @radix-ui/react-dialog \
  lucide-react react-hot-toast react-hook-form zod clsx
```

### Step 5 — MCP Server

```bash
cd mcp-server
npm install @modelcontextprotocol/sdk
```

### Step 6 — Redis (for queue)

```bash
# Docker
docker run -d -p 6379:6379 redis:alpine

# OR local install
sudo apt install redis-server
```

### Step 7 — Run Everything

```bash
# Backend
cd backend && node src/index.js

# Frontend
cd frontend && npm run dev

# MCP Server
cd mcp-server && node index.js
```

### Docker Compose (Recommended)

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    volumes:
      - ./downloads:/app/downloads
      - ./cookies:/app/cookies
    environment:
      - REDIS_URL=redis://redis:6379

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
```

```bash
docker-compose up --build
```

---

## 🔐 Environment Variables

### `backend/.env`

```env
PORT=5000
REDIS_URL=redis://localhost:6379
YTDLP_PATH=/usr/local/bin/yt-dlp
FFMPEG_PATH=/usr/bin/ffmpeg
DOWNLOAD_DIR=./downloads
MAX_FILE_SIZE_MB=2000
DOWNLOAD_EXPIRY_MINUTES=30
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=10
CORS_ORIGIN=http://localhost:3000
# Optional: for authenticated downloads
COOKIES_FILE=./cookies/cookies.txt
```

### `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## ✅ Feature Checklist

### Core
- [x] Any URL → auto platform detection
- [x] Fetch all available qualities
- [x] Quality selection UI (144p → 4K)
- [x] Video + audio merge (via ffmpeg)
- [x] Real-time download progress (WebSocket)
- [x] Preview before download (react-player)
- [x] File download after processing

### Advanced
- [x] Audio-only download (MP3/M4A)
- [x] Batch download (multiple URLs)
- [x] Download queue (Bull)
- [x] Subtitle/caption download
- [x] Thumbnail extraction
- [x] Cookie support (private videos)
- [x] Rate limiting
- [x] Temp file auto-cleanup
- [x] MCP server integration

### UI
- [x] Paste URL → instant metadata preview
- [x] Thumbnail display
- [x] Video title, duration, platform badge
- [x] Format/extension selection
- [x] Estimated file size per quality
- [x] Copy download link button
- [x] Mobile responsive design

---

## 🌐 Supported Platforms (1000+)

yt-dlp natively support karta hai:

| Category | Platforms |
|----------|-----------|
| **Video** | YouTube, Vimeo, Dailymotion, Twitch, Rumble |
| **Social** | Instagram, TikTok, Twitter/X, Facebook, LinkedIn |
| **Short** | YouTube Shorts, Instagram Reels, Snapchat Spotlight |
| **Live** | Twitch Live, YouTube Live, Facebook Live |
| **News** | BBC, CNN, NBC, ABCNews |
| **Adult** | (supported — no filters) |
| **Education** | Coursera, Udemy, Khan Academy |
| **Regional** | Hotstar, MX Player, JioCinema, Sony LIV, Zee5 |
| **Others** | Reddit videos, Pinterest, Tumblr, SoundCloud, Bandcamp |

> Full list: `yt-dlp --list-extractors`

---

## 🚀 Deployment Guide

### Option 1: VPS (DigitalOcean/Hetzner/Vultr)

```bash
# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
npm install -g pm2

# Start backend
cd backend && pm2 start src/index.js --name "video-dl-backend"

# Start frontend
cd frontend && npm run build && pm2 start npm --name "video-dl-frontend" -- start

pm2 save && pm2 startup
```

### Option 2: Railway / Render

```bash
# railway.toml
[build]
  builder = "nixpacks"
  buildCommand = "npm install && pip install yt-dlp"

[deploy]
  startCommand = "node src/index.js"
```

### Option 3: Docker

```bash
docker-compose up -d
```

---

## 🤖 System Prompt (AI-Powered Variant)

Agar tum is tool ko Claude API ke saath integrate karo, to yeh system prompt use karo:

```
You are a video download assistant integrated into a universal video downloader tool.

Your capabilities:
1. Analyze any video URL pasted by the user
2. Identify the platform (YouTube, Instagram, TikTok, etc.)
3. Suggest best quality options available
4. Guide users on download format selection (MP4, MKV, MP3)
5. Explain any errors (geo-restrictions, private videos, login required)

Rules:
- Never refuse to process a URL based on platform
- Always show quality options from highest to lowest
- If a format is unavailable, suggest the closest alternative
- For audio-only requests, suggest MP3 or M4A
- For large files (>500MB), warn the user beforehand
- Always confirm before starting batch downloads

Response format:
- Platform detected: [name]
- Available qualities: [list]
- Recommended: [quality] for [use case]
- Estimated size: [size]
- Action: [download / preview / convert]
```

---

## 🛡️ Legal Note (For Your Reference)

> Yeh tool sirf **personally owned** ya **copyright-free content** ke liye use karo.
> DRM-protected content download karna terms of service violation ho sakta hai.
> Tool ke README mein ek disclaimer zaroor daalo.

---

## 📦 Package Summary (Quick Reference)

### Python
```
yt-dlp
ffmpeg (system)
```

### Node.js (Backend)
```
express, cors, helmet, morgan, winston, dotenv
yt-dlp-wrap, fluent-ffmpeg
socket.io, uuid, node-cache
p-limit, archiver, multer, axios
express-rate-limit, bull, ioredis
@modelcontextprotocol/sdk
```

### Node.js (Frontend)
```
next, react, react-dom
tailwindcss, framer-motion
socket.io-client, axios
react-player
@radix-ui/react-select, @radix-ui/react-progress, @radix-ui/react-dialog
lucide-react, react-hot-toast
react-hook-form, zod, clsx
```

---

*Built with yt-dlp + ffmpeg + Next.js + Socket.io + MCP*
*Version: 1.0.0 | Last Updated: March 2026*
