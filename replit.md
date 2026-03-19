# ISHU.FUN — Indian StudentHub University

## Project Overview
A monorepo web application: React + Vite frontend with Node.js + Express backend offering 100+ PDF tools, 700+ Live Indian TV channels, video downloaders (YouTube, Terabox, Universal), government exam results, news, CV/Resume builder.

## Architecture
- **Frontend** (`/frontend`): React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion + GSAP
- **Backend** (`/backend`): Node.js + Express on Render free tier (`https://ishu-site.onrender.com`)

## Running the App

### Frontend (Web Preview)
- Workflow: **Start application**
- Command: `pnpm run dev` (from root)
- Port: **5000** (Replit web preview)

### Backend (API Server)
- Workflow: **Start Backend** (local dev only)
- Production backend: `https://ishu-site.onrender.com` (Render free tier — auto-sleep after 15 min)
- Port: **3001** local

## Package Manager
- Root & Backend: **pnpm**
- Frontend: **pnpm** (`pnpm install --ignore-scripts` to avoid interactive prompts)

## Required Environment Variables

### Frontend (VITE_ prefix — set in Replit Secrets)
| Variable | Description |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk authentication publishable key |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VITE_API_URL` | Backend API URL (defaults to https://ishu-site.onrender.com) |

### Backend (set in Replit Secrets)
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `OPENAI_API_KEY` | OpenAI API key (for AI features) |
| `GEMINI_API_KEY` | Google Gemini API key (for AI features) |
| `PORT` | Backend port (optional, defaults to 5000) |
| `FRONTEND_URL` | Frontend URL for CORS (optional) |
| `RENDER_EXTERNAL_URL` | Set by Render — used for self-ping keep-alive |

## Key Files
- `frontend/vite.config.ts` — Vite config, port 5000, `allowedHosts: true`
- `backend/server.js` — Express entry point with all 122+ API routes
- `frontend/src/pages/TVPage.tsx` — Live TV player (1900+ lines)
- `frontend/src/utils/serverHealth.ts` — Backend keep-alive health monitor (pings every 2 min)
- `frontend/src/utils/serverWakeup.ts` — Backend wake-up utility for Render cold starts
- `frontend/src/components/tools/BackendStatusBar.tsx` — UI widget for backend wake status
- `frontend/src/config/performance.ts` — Global performance settings (60-90fps target)

## Important Technical Notes

### CORS Rule (Critical)
**Never send custom headers** (like `Cache-Control: no-cache`) in fetch calls to the backend.
Custom headers trigger CORS preflight (OPTIONS) requests which fail when Render backend is sleeping.
Always use simple GET with no custom headers for wake/health pings.

### TV Page Stream Architecture
Attempt order per stream URL (to maximize channels working even when backend is asleep):
1. **Direct** — no proxy (works for CDN streams with CORS headers)
2. **allorigins** (`api.allorigins.win`) — fast public CORS proxy
3. **corsproxy.io** — backup public CORS proxy
4. **corsproxy.org** — backup
5. **cors.sh** — backup
6. **thingproxy.freeboard.io** — backup
7. **crossorigin.me** — backup
8. **cors-anywhere.herokuapp.com** — backup
9. **yacdn.org** — backup
10. **Backend proxy** (`/api/stream-proxy`) — last resort (may be sleeping)

M3U sources: 80+ Indian-specific playlists (countries, languages, subdivisions, curated repos).
Each M3U fetch has a 12s individual timeout via Promise.race to prevent slow sources blocking loading.
TV cache key: `ishu_tv_channels_v6` (30 min TTL in sessionStorage).
HLS timeouts: 8s direct, 14s proxied (fail fast, try next source quickly).
FragLoadPolicy: 8s TTFB, 20s max load.

### Backend Keep-Alive
- `serverHealth.ts` pings `/api/wake` every **2 minutes** to prevent Render sleep
- Backend also self-pings via `RENDER_EXTERNAL_URL` every 14 minutes
- No Cache-Control or custom headers on pings (CORS safe)

### Tool Pages (YouTube/Terabox/Universal)
- All show `BackendStatusBar` which auto-wakes backend on mount
- `fetchWithRetry` with 240s first-attempt timeout (Render cold start can take 60s)
- Graceful error messages on timeout/network failure
- YouTube: `@distube/ytdl-core` with enhanced browser-like request headers to bypass bot protection
- Universal: cobalt.tools API v10 with 4 fallback community instances tried in order

## Performance Architecture (120fps Layer)
All pages optimized for 120fps via global CSS rules at the end of `frontend/src/index.css`:
- Buttons/links/cards: `will-change: transform, opacity` + `backfaceVisibility: hidden` on hover/active
- Fixed/sticky elements: forced GPU layer via `translateZ(0)`
- Smooth scrolling with momentum + `overscroll-behavior-y: contain`
- Sections: `contain: layout style` for paint isolation
- Tablet (768–1024px): adjusted grid columns and container padding
- TV/4K (≥1920px): wider container + scaled font-size
- Touch targets: min 44px on mobile for all interactive elements
- Reduced-motion: all custom animations disabled respectfully
- Utility classes: `.animate-page-in`, `.animate-pop-in`, `.skeleton`, `.grid-auto-{xs/sm/md/lg/xl}`

## TV Streaming Architecture
- 23 CORS proxies (`BACKEND_PROXY_IDX = 22`) tried in order after 6 parallel direct probes
- 80+ M3U sources: Indian states, regions, languages, curated repos, South Asian neighbours
- TV cache key: `ishu_tv_channels_v10` (45 min TTL, localStorage)
- Stream success cache: 4h TTL per channel URL (avoids re-probing known-good sources)
- HLS timeouts: 900ms direct, 1500ms backend, 1000ms proxy, 1500ms stall detection

## SEO Implementation
- `frontend/index.html`: WebSite + Organization + WebApplication + BreadcrumbList + SiteNavigationElement structured data
- 11 hreflang tags: `en-in`, `hi-in`, `ta-in`, `te-in`, `bn-in`, `mr-in`, `gu-in`, `kn-in`, `ml-in`, `pa-in`, `ur-in` + `x-default`
- `frontend/public/sitemap.xml`: 60+ URLs covering all pages, tools, and state result pages
- `frontend/public/robots.txt`: Bot-specific rules for Google, Bing, Yandex, social crawlers
- `frontend/public/manifest.json`: PWA manifest with 6 shortcuts, `display_override`, `prefer_related_applications: false`
- SEOHead component on every page for per-route canonical/OG/Twitter meta

## Replit Migration Notes
- Frontend port changed from 3000 → 5000 (Replit webview requirement)
- `allowedHosts: true` added to Vite config for proxied preview
- Root `package.json` scripts updated to use pnpm
- Two workflows configured: "Start application" (frontend) and "Start Backend"
- Error screen updated to reference Replit Secrets (not Vercel)
