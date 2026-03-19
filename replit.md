# ISHU.FUN — PDF Tools App

## Project Overview
A monorepo web application with a React + Vite frontend and a Node.js + Express backend offering 100+ PDF processing, conversion, and AI tools.

## Architecture
- **Frontend** (`/frontend`): React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend** (`/backend`): Node.js + Express with 100+ PDF API endpoints

## Running the App

### Frontend (Web Preview)
- Workflow: **Start application**
- Command: `pnpm run dev` (from root)
- Port: **5000** (Replit web preview)

### Backend (API Server)
- Workflow: **Start Backend**
- Command: `pnpm run dev:backend` (from root, runs `node server.js` in `/backend`)
- Port: **3001** (default, can be configured via `PORT` env var)

## Package Manager
- Root & Backend: **pnpm** (pnpm-lock.yaml at root)
- Frontend: **pnpm** (pnpm-lock.yaml in frontend/)

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
| `LIBREOFFICE_PATH` | Path to LibreOffice binary (optional) |
| `GHOSTSCRIPT_PATH` | Path to Ghostscript binary (optional) |
| `TEMP_DIR` | Temp directory for file processing (optional) |
| `MAX_FILE_SIZE_MB` | Max upload file size in MB (optional) |
| `TEMP_FILE_EXPIRY_MINUTES` | Temp file cleanup interval (optional) |

## Key Files
- `frontend/vite.config.ts` — Vite config, port 5000, allowedHosts: true
- `backend/server.js` — Express entry point
- `package.json` — Root scripts for running frontend/backend
- `.replit` — Replit environment config (nodejs-20, web)

## Replit Migration Notes
- Frontend port changed from 3000 → 5000 (Replit webview requirement)
- `allowedHosts: true` added to Vite config for proxied preview
- Root `package.json` scripts updated to use pnpm
- Two workflows configured: "Start application" (frontend) and "Start Backend"
