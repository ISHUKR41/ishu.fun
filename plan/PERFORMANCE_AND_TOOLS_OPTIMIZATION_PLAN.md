# ISHU Website — Performance & Tools Fix Plan

> **Status:** Ready to implement  
> **Scope:** Phase 1 (Performance) + Phase 2 (Fix Tools)  
> **Constraints:** Add/enhance only — no deletions of existing features, libs, effects, or pages

---

## Quick Reference

| Phase | Item | File(s) | Priority | npm? |
|---|---|---|---|---|
| 1 | ToolsPage virtualization | `ToolsPage.tsx` | 🔴 P0 | `@tanstack/react-virtual` |
| 1 | Remove duplicate Toaster render | `App.tsx` | 🟡 P1 | No |
| 1 | useReducedMotion hook | new `hooks/useReducedMotion.ts` + 2 files | 🟡 P1 | No |
| 1 | Fix wrong `will-change` on `.animate-breathe` | `index.css` | 🟢 P2 | No |
| 1 | Memoize popularFiltered | `ToolsPage.tsx` | 🟢 P2 | No |
| 1 | Extract `ToolCard` as React.memo | `ToolsPage.tsx` | 🟢 P2 | No |
| 2 | yt-dlp PATH fallback chain | `videoRoutes.js` + `render.yaml` | 🔴 P0 | No |
| 2 | Render wake-up: UptimeRobot setup | `server.js` comment | 🔴 P0 | No |
| 2 | BackendStatusBar: sleeping state + countdown | `BackendStatusBar.tsx` | 🔴 P0 | No |
| 2 | Terabox: errorType + Retry button | `TeraboxDownloaderPage.tsx` | 🟡 P1 | No |
| 2 | PDF tools: enrich client-side errors | `ToolPage.tsx` | 🟡 P1 | No |
| 2 | Video Downloader: platform detection + msg | `UniversalVideoDownloaderPage.tsx` | 🟡 P1 | No |
| 2 | BackendStatusBar compact pill | `BackendStatusBar.tsx` | 🟢 P2 | No |

---

## PHASE 1 — Performance Optimization

### Findings / Corrections from Exploration

> ⚠️ **Three.js memory leaks: NOT PRESENT.** Both `HeroScene3D.tsx` and `CVScene3D.tsx` use `@react-three/fiber` (R3F) which handles `geometry.dispose()` / `material.dispose()` automatically. Both scenes also have `{isVisible && <Canvas>}` unmount-on-hide + `frameloop="demand"` + proper `IntersectionObserver.disconnect()`. No changes needed here.

> ✅ **GSAP: NOT PRESENT.** Zero GSAP usage found across all 24 animation components. All use Framer Motion. GSAP audit is N/A.

> ✅ **Animation cleanups: All correct.** `ParticleField`, `CursorSpotlight`, `AnimatedCounter`, `FloatingElements`, `NumberTicker`, `ScrollToTop` all have proper `cancelAnimationFrame`, `removeEventListener`, `observer.disconnect()` in their cleanup returns.

---

### 1.1 ToolsPage Virtualization

**File:** `frontend/src/pages/ToolsPage.tsx`  
**Problem:** 100+ tool cards rendered simultaneously (each = `motion.div` + `Tilt` + `ToolIcon` lookup = ~321 DOM elements at once).  
**Fix:** `@tanstack/react-virtual` with `lanes` (multi-column) support — better for CSS Grid than `react-window`.

**Install:**
```bash
cd frontend
npm install @tanstack/react-virtual
```

#### Step A — Add `useColumnCount` hook (insert after line 48, after the `fuse` module-level instance)

```tsx
// Maps Tailwind breakpoints → CSS Grid column count (mirrors grid-cols-* classes)
const useColumnCount = (): number => {
  const [cols, setCols] = useState(2);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setCols(6);       // xl:grid-cols-6
      else if (w >= 1024) setCols(5);  // lg:grid-cols-5
      else if (w >= 768)  setCols(4);  // md:grid-cols-4
      else if (w >= 640)  setCols(3);  // sm:grid-cols-3
      else setCols(2);                  // grid-cols-2
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
};
```

#### Step B — Update imports (around line 24)

```tsx
// BEFORE:
import { useState, useMemo, lazy, Suspense, useEffect, useRef } from "react";

// AFTER:
import React, { useState, useMemo, lazy, Suspense, useEffect, useRef, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
```

#### Step C — Add virtualizer inside `ToolsPage` component (after `isMobile`, ~line 73)

```tsx
const columnCount = useColumnCount();
const scrollRef = useRef<HTMLDivElement>(null);

const virtualizer = useVirtualizer({
  count: filtered.length,
  getScrollElement: () => document.documentElement,   // window scroll, not a fixed container
  estimateSize: () => 148,          // px — card height estimate
  overscan: columnCount * 2,        // pre-render 2 extra rows above/below viewport
  lanes: columnCount,               // multi-column grid support
});
```

#### Step D — Extract `ToolCard` as `React.memo` (add ABOVE the `ToolsPage` component)

```tsx
const ToolCard = React.memo(({ tool }: { tool: (typeof allToolsData)[number] }) => (
  <Link to={`/tools/${tool.slug}`}>
    <motion.div
      whileHover={{ y: -6, scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 text-center transition-all hover:border-primary/30 hover:shadow-glow"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:scale-110 group-hover:bg-primary/20">
          <ToolIcon iconName={tool.icon} size={20} />
        </div>
        <h3 className="font-display text-xs font-semibold text-foreground">{tool.name}</h3>
        <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">{tool.desc}</p>
        <span className="mt-2 inline-block rounded bg-secondary px-2 py-0.5 text-[9px] font-medium text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          {tool.category}
        </span>
      </div>
    </motion.div>
  </Link>
));
ToolCard.displayName = "ToolCard";
```

#### Step E — Replace grid render (lines ~295–316)

```tsx
// ─── BEFORE (lines ~295–316) ──────────────────────────────────────────────
<div ref={gridRef} className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
  {filtered.map((tool) => (
    <Link key={tool.slug} to={`/tools/${tool.slug}`}>
      <motion.div ...>...</motion.div>
    </Link>
  ))}
</div>

// ─── AFTER ────────────────────────────────────────────────────────────────
<div
  ref={scrollRef}
  style={{ position: "relative", height: `${virtualizer.getTotalSize()}px` }}
>
  {virtualizer.getVirtualItems().map((vItem) => {
    const tool = filtered[vItem.index];
    const laneWidth = 100 / columnCount;
    const gapPx = 12; // gap-3 = 0.75rem = 12px
    return (
      <div
        key={vItem.key}
        data-index={vItem.index}
        ref={virtualizer.measureElement}
        style={{
          position: "absolute",
          top: `${vItem.start}px`,
          left: `calc(${vItem.lane * laneWidth}% + ${vItem.lane > 0 ? gapPx : 0}px)`,
          width: `calc(${laneWidth}% - ${gapPx * (columnCount - 1) / columnCount}px)`,
          padding: `${gapPx / 2}px 0`,
        }}
      >
        <ToolCard tool={tool} />
      </div>
    );
  })}
</div>
```

**Why it helps:** Reduces ~321 mounted DOM elements to ~18–30 (only visible viewport). Biggest Time-to-Interactive win.

---

### 1.2 Remove Duplicate Toaster Render

**File:** `frontend/src/App.tsx`  
**Problem:** Both shadcn `<Toaster />` (Radix UI) and `<Sonner />` are rendered, creating two React context trees registering listeners simultaneously.  
**Fix:** Remove the JSX render of `<Toaster />` only. **Keep the import line** (line 17) intact — `use-toast.ts` may reference it.

```tsx
// ─── BEFORE (~lines 285–286) ──────────────────────────────────────────────
<Toaster />
<Sonner />

// ─── AFTER ────────────────────────────────────────────────────────────────
{/* Sonner handles all toast notifications */}
<Sonner />
```

> Import on line 17 (`import { Toaster } from "@/components/ui/toaster"`) stays untouched.

---

### 1.3 useReducedMotion Hook

**Problem:** `prefers-reduced-motion` not respected in Framer Motion animations or canvas `requestAnimationFrame` loops.

#### Step A — Create shared hook

**File:** `frontend/src/hooks/useReducedMotion.ts` *(new file)*

```ts
import { useReducedMotion as useFramerReducedMotion } from "framer-motion";

/**
 * Returns true when the OS/browser "prefers-reduced-motion" setting is active.
 * Wraps Framer Motion's built-in hook so it works outside motion components too.
 */
export const useReducedMotion = (): boolean => {
  return useFramerReducedMotion() ?? false;
};
```

#### Step B — Apply to ToolsPage.tsx

Add import:
```tsx
import { useReducedMotion } from "@/hooks/useReducedMotion";
```

Inside component (after `columnCount`):
```tsx
const prefersReducedMotion = useReducedMotion();
```

Update `ToolCard` (Step D above) to accept and use the prop, or hoist the hook into `ToolCard`:
```tsx
// Inside ToolCard component:
const prefersReducedMotion = useReducedMotion();
// ...
<motion.div
  whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.05 }}
  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
  ...
>
```

Also guard the rotating ring (~line 119) and pulsing dot (~line 142) in `ToolsPage`:
```tsx
// Rotating ring:
animate={prefersReducedMotion ? undefined : { rotate: 360 }}

// Pulsing dot:
animate={prefersReducedMotion ? undefined : { scale: [1, 1.2, 1] }}
```

#### Step C — Apply to ParticleField.tsx

**File:** `frontend/src/components/animations/ParticleField.tsx`

```tsx
// Add import:
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Inside component, before the canvas useEffect:
const prefersReducedMotion = useReducedMotion();

// Early return before canvas mount:
if (prefersReducedMotion) return null;

// Add to useEffect dependency array:
}, [prefersReducedMotion]);
```

**Why it helps:** Zero animation/canvas cost for ~15–20% of users with this setting. Framer Motion also auto-disables its own animations when this hook returns true.

---

### 1.4 Fix Wrong `will-change` on `.animate-breathe`

**File:** `frontend/src/index.css`  
**Problem:** `.animate-breathe` animates `box-shadow` but declares `will-change: transform` — promotes a GPU layer for a property that never changes via that animation.

```css
/* BEFORE (~line 294): */
.animate-breathe {
  animation: breathe 4s ease-in-out infinite;
  will-change: transform;
  transform: translateZ(0);
}

/* AFTER: */
.animate-breathe {
  animation: breathe 4s ease-in-out infinite;
  will-change: box-shadow;     /* matches the actual breathe keyframe */
  transform: translateZ(0);    /* layer promotion still valid */
}
```

> All other `will-change` declarations (`.gpu-accelerated`, `.pulse-ring::before`, `.morph-blob`, `.holo-effect`) are **correct** — no changes needed. The global `prefers-reduced-motion` guard at ~line 87–91 is also already correct.

---

### 1.5 Quick Win — Memoize `popularFiltered`

**File:** `frontend/src/pages/ToolsPage.tsx` (~line 104)

```tsx
// BEFORE — re-runs filter on every search keystroke:
const popularFiltered = allToolsData.filter(t => popularTools.includes(t.name));

// AFTER — computed once (both arrays are module-level constants):
const popularFiltered = useMemo(
  () => allToolsData.filter(t => popularTools.includes(t.name)),
  []
);
```

---

## PHASE 2 — Fix Tools

### Findings / Corrections from Exploration

> ✅ **yt-dlp binary path detection is already correct** in `videoRoutes.js` line 49:  
> `path.resolve(__dirname, '../../yt-dlp' + (process.platform === 'win32' ? '.exe' : ''))`  
> The actual bug is that this path points to the project-relative binary which does NOT exist on Render.com. The `/usr/local/bin/yt-dlp` installed by `render.yaml` is never tried. Fix: add a candidate path fallback chain.

> ✅ **PDF tools are 100% client-side.** `pdf-processor.ts` uses `pdf-lib`, `jsPDF`, `pdfjs-dist`, `mammoth`, `xlsx`, `tesseract.js`, `file-saver` — zero backend calls. The backend PDF routes (`/api/tools/...`) are separate LibreOffice-based routes; the frontend tool pages use `pdf-processor.ts` directly.

> ✅ **BackendStatusBar already exists** (`frontend/src/components/tools/BackendStatusBar.tsx`) with 15 retries, 4s delay, progress bar, elapsed timer, exported `wakeBackend()` function.

---

### 2.1 yt-dlp Linux Binary — PATH Fallback Chain (P0)

**File:** `backend/src/routes/videoRoutes.js` (~lines 57–93)

Replace the existing `ytDlpInitPromise` IIFE body with a candidate-path resolution chain:

```javascript
ytDlpInitPromise = (async () => {
  try {
    YTDlpWrap = require('yt-dlp-wrap').default || require('yt-dlp-wrap');

    // Resolution order:
    //   1. Project-relative binary (local dev / Windows .exe)
    //   2. /usr/local/bin/yt-dlp  (Render.com — installed by render.yaml buildCommand)
    //   3. yt-dlp from PATH       (any env where it is globally installed)
    //   4. Auto-download from GitHub (last resort)
    const CANDIDATE_PATHS = [
      YTDLP_BINARY_PATH,
      '/usr/local/bin/yt-dlp',
      'yt-dlp',
    ];

    for (const candidate of CANDIDATE_PATHS) {
      try {
        const testInstance = new YTDlpWrap(candidate);
        const version = await testInstance.execPromise(['--version']);
        console.log(`[Video] ✅ yt-dlp found at "${candidate}", version: ${version.trim()}`);
        ytDlpInstance = testInstance;
        break;
      } catch {
        // not at this path — try next
      }
    }

    if (!ytDlpInstance) {
      console.log('[Video] ⬇️ Downloading yt-dlp binary from GitHub...');
      try {
        await YTDlpWrap.downloadFromGithub(YTDLP_BINARY_PATH);
        ytDlpInstance = new YTDlpWrap(YTDLP_BINARY_PATH);
        const version = await ytDlpInstance.execPromise(['--version']);
        console.log('[Video] ✅ yt-dlp version (downloaded):', version.trim());
      } catch (downloadErr) {
        console.warn('[Video] ⚠️ All yt-dlp resolution strategies failed:', downloadErr.message);
        ytDlpInitPromise = null;
        return null;
      }
    }

    return ytDlpInstance;
  } catch (e) {
    console.error('[Video] ❌ yt-dlp-wrap init failed:', e.message);
    ytDlpInitPromise = null;
    return null;
  }
})();
```

**File:** `render.yaml`  
Add `--version` canary to buildCommand to catch wrong-binary deployments at build time:

```yaml
buildCommand: >-
  apt-get install -y libreoffice ghostscript &&
  curl -fL https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp
    -o /usr/local/bin/yt-dlp &&
  chmod a+rx /usr/local/bin/yt-dlp &&
  /usr/local/bin/yt-dlp --version &&
  npm install
```

---

### 2.2 Render Free Tier Wake-Up (P0)

#### Part A — External Pinger (UptimeRobot — Free, No Code)

Self-ping (`server.js` lines 393–410) **cannot prevent Render free tier sleep** — Render explicitly ignores self-requests when counting inactivity.

**One-time setup (no code changes):**
1. Sign up at https://uptimerobot.com (free: 50 monitors, 5-min interval)
2. New monitor → **HTTP(S)**
   - URL: `https://YOUR-APP.onrender.com/api/wake`
   - Interval: **5 minutes**
   - Alert contact: your email
3. Server stays awake indefinitely at zero cost.

**Document this in `backend/server.js`** (update comment at lines 393–395):
```javascript
// ── Self-ping keep-alive ──────────────────────────────────────────────────
// NOTE: On Render free tier, self-pings do NOT prevent sleep.
// External pinger REQUIRED: https://uptimerobot.com → monitor /api/wake every 5 min
// This self-ping is kept as a heartbeat/health log only.
const SELF_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
```

#### Part B — BackendStatusBar: Add `sleeping` State + Countdown

**File:** `frontend/src/components/tools/BackendStatusBar.tsx`

**Change 1** — Add `sleeping` to Status type and add `WAKE_ESTIMATE_SECS` constant (~lines 47–57):
```typescript
// BEFORE:
type Status = "checking" | "waking" | "ready" | "failed";

// AFTER:
type Status = "checking" | "sleeping" | "waking" | "ready" | "failed";
const WAKE_ESTIMATE_SECS = 35; // Render free tier cold-start ~30-40s
```

**Change 2** — After first ping failure, set `sleeping` instead of `waking` (~lines 85–95):
```typescript
// BEFORE:
setStatus("waking");

// AFTER:
setStatus(attemptNum === 0 ? "sleeping" : "waking");
```

**Change 3** — Add `sleeping` JSX block and update `waking` to show countdown (in the status JSX section ~lines 153–177):
```tsx
{status === "sleeping" && (
  <>
    <Loader2 size={16} className="animate-spin text-orange-400 shrink-0" />
    <div className="flex-1 min-w-0">
      <span className="text-orange-300 font-medium">Server is sleeping — waking it up...</span>
      <span className="text-orange-300/60 text-xs ml-2">
        Free tier needs ~{WAKE_ESTIMATE_SECS}s to start. Hang tight!
      </span>
    </div>
  </>
)}

{status === "waking" && (
  <>
    <Loader2 size={16} className="animate-spin text-yellow-400 shrink-0" />
    <div className="flex-1 min-w-0">
      <span className="text-yellow-300 font-medium">Server is warming up...</span>
      <span className="text-yellow-300/60 text-xs ml-2">
        {elapsed}s elapsed
        {elapsed < WAKE_ESTIMATE_SECS
          ? ` — ~${WAKE_ESTIMATE_SECS - elapsed}s remaining`
          : " — almost there!"}
      </span>
    </div>
    <div className="flex items-center gap-1.5 shrink-0">
      <Clock size={12} className="text-yellow-400/60" />
      <span className="text-yellow-300/50 text-[10px] font-mono">{attempt}/{maxAttempts}</span>
    </div>
  </>
)}
```

**Change 4** — Progress bar: include `sleeping` state (~line 208):
```tsx
// BEFORE:
{status === "waking" && (

// AFTER:
{(status === "sleeping" || status === "waking") && (
```

**Change 5** — Border/bg color for `sleeping` state (~lines 145–151):
```tsx
// BEFORE:
: "border-yellow-500/20 bg-yellow-500/5"

// AFTER:
: status === "sleeping"
? "border-orange-500/20 bg-orange-500/5"
: "border-yellow-500/20 bg-yellow-500/5"
```

**Change 6** — Compact mode slim pill (after line 134):
```typescript
if (status === "ready" && compact) return null;

// Add after:
if (compact && (status === "sleeping" || status === "waking")) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2 mb-3 text-xs text-orange-300">
      <Loader2 size={12} className="animate-spin shrink-0" />
      <span>
        {status === "sleeping" ? "Waking server up..." : `Server warming up (${elapsed}s)...`}
      </span>
    </div>
  );
}
```

---

### 2.3 Terabox Reliability & UX (P1)

**File:** `frontend/src/pages/TeraboxDownloaderPage.tsx`

**Change 1** — Add `errorType` state (~lines 35–44):
```typescript
const [error, setError] = useState<string | null>(null);
const [errorType, setErrorType] = useState<"timeout" | "network" | "api" | null>(null);
```

**Change 2** — Set `errorType` in `fetchFileInfo` catch (~lines 95–103):
```typescript
} catch (err: any) {
  if (err?.name === "AbortError") {
    setErrorType("timeout");
    setError("Request timed out. Terabox links can take 15–30s to resolve. Please try again.");
  } else {
    setErrorType("network");
    setError("Could not reach the server. It may be starting up (~30s on free tier). Please try again.");
  }
}
```

**Change 3** — Set `errorType` in `handleDownload` catch (~lines 163–168):
```typescript
} catch (err: any) {
  if (err?.name === "AbortError") {
    setErrorType("timeout");
    setError("Download timed out. The file may be too large or the server is busy.");
  } else {
    setErrorType("network");
    setError("Download failed. Please check your connection and try again.");
  }
}
```

**Change 4** — Add `handleRetry` helper (after `handleReset`, ~line 177):
```typescript
const handleRetry = () => {
  setError(null);
  setErrorType(null);
  if (fileInfo) {
    handleDownload();
  } else {
    fetchFileInfo();
  }
};
```

**Change 5** — Improve error card UI (inline Retry button, ~lines 261–269):
```tsx
{error && (
  <motion.div ... className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
    <div className="flex items-start gap-2 text-destructive">
      <AlertCircle size={16} className="shrink-0 mt-0.5" />
      <span className="flex-1">{error}</span>
    </div>
    {(errorType === "timeout" || errorType === "network") && (
      <button
        onClick={handleRetry}
        className="mt-3 flex items-center gap-1.5 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
      >
        <RefreshCw size={12} />
        {errorType === "timeout" ? "Retry (server may now be ready)" : "Try Again"}
      </button>
    )}
  </motion.div>
)}
```

Add `RefreshCw` to lucide-react import (~line 16).

---

### 2.4 PDF Tools — Enrich Client-Side Error Messages (P1)

**File:** `frontend/src/pages/ToolPage.tsx`

**Problem:** Generic `err.message || "Processing failed"` gives users no actionable guidance.

**Change** — Update `handleProcess` catch (~lines 145–160):
```typescript
} catch (err: any) {
  const raw: string = err?.message || "";
  let friendly = raw || "Processing failed. Please try again.";

  if (raw.includes("out of memory") || raw.includes("Maximum call stack")) {
    friendly = "Your browser ran out of memory. Try a smaller file or use a desktop browser.";
  } else if (raw.includes("Invalid PDF") || raw.includes("Failed to parse")) {
    friendly = "This file doesn't appear to be a valid PDF. Please check the file and try again.";
  } else if (raw.includes("encrypted") || raw.includes("password")) {
    friendly = "This PDF is password-protected. Use the Unlock PDF tool first, then retry.";
  } else if (raw.includes("NetworkError") || raw.includes("fetch")) {
    friendly = "A network resource failed to load (e.g. OCR language data). Check your connection and try again.";
  } else if (raw.includes("workerSrc") || raw.includes("Worker")) {
    friendly = "PDF viewer worker failed to start. Try refreshing the page.";
  }

  setError(friendly);
  setProgressValue(0);
}
```

Apply the same pattern to `handleCreateProcess` catch (~line 172):
```typescript
} catch (err: any) {
  const raw: string = err?.message || "";
  setError(
    raw.includes("NetworkError") || raw.includes("fetch")
      ? "A required resource failed to load. Check your connection and try again."
      : raw || "Processing failed. Please try again."
  );
  setProgressValue(0);
}
```

---

### 2.5 Universal Video Downloader — Platform Detection + Dynamic Loading Message (P1)

**File:** `frontend/src/pages/UniversalVideoDownloaderPage.tsx`

**Change 1** — Add `loadingMsg` state (~line 65):
```typescript
const [loading, setLoading] = useState(false);
const [loadingMsg, setLoadingMsg] = useState("Processing...");
```

**Change 2** — Add `detectPlatform` helper (after `handlePaste`, ~line 77):
```typescript
const detectPlatform = (inputUrl: string): string => {
  try {
    const host = new URL(inputUrl).hostname.replace("www.", "");
    if (host.includes("youtube.com") || host === "youtu.be") return "YouTube";
    if (host.includes("instagram.com")) return "Instagram";
    if (host.includes("tiktok.com")) return "TikTok";
    if (host.includes("twitter.com") || host.includes("x.com")) return "Twitter/X";
    if (host.includes("facebook.com") || host.includes("fb.watch")) return "Facebook";
    if (host.includes("reddit.com") || host.includes("redd.it")) return "Reddit";
    if (host.includes("vimeo.com")) return "Vimeo";
    if (host.includes("twitch.tv")) return "Twitch";
    if (host.includes("dailymotion.com")) return "Dailymotion";
    return "video";
  } catch {
    return "video";
  }
};
```

**Change 3** — Set `loadingMsg` at start of `handleDownload` (~line 107):
```typescript
const platform = detectPlatform(url.trim());
const action = audioOnly ? "audio" : `${selectedQuality}p video`;
setLoadingMsg(`Fetching ${platform} ${action}...`);
setLoading(true);
```

**Change 4** — Use `loadingMsg` in Download button (~line 274):
```tsx
// BEFORE:
<><Loader2 size={18} className="animate-spin" /> Processing...</>

// AFTER:
<><Loader2 size={18} className="animate-spin" /> {loadingMsg}</>
```

**Change 5** — Improve catch error messages (~lines 144–151):
```typescript
} catch (err: any) {
  const platform = detectPlatform(url.trim());
  if (err?.name === "AbortError") {
    setError(`${platform} download timed out. The video may be geo-restricted or the server is busy — please try again.`);
  } else if (err?.message?.includes("fetch") || err?.message?.includes("Failed to fetch")) {
    setError("Could not connect to the server. Backend may be starting up (~30s on free tier). Try again in a moment.");
  } else {
    setError(`${platform} download failed: ${err?.message || "Unknown error. Please try again."}`);
  }
}
```

---

## Verification Checklist

### Phase 1
- [ ] `npm run build` from `frontend/` — no TypeScript errors, no missing imports
- [ ] Open `/tools` — scroll down, verify only visible cards render (DevTools Elements should show ~20 `.tool-card` nodes, not 100+)
- [ ] Toggle OS "Reduce Motion" setting — verify tool cards no longer animate on hover, ParticleField disappears
- [ ] Check DevTools Performance tab — ToolsPage scroll should be 60fps
- [ ] Confirm only ONE toast shows when triggering a notification (no duplicate)

### Phase 2
- [ ] Deploy to Render — check server logs for `yt-dlp found at "/usr/local/bin/yt-dlp"` 
- [ ] Set up UptimeRobot on `/api/wake` every 5 min — verify server stays awake after 20+ min
- [ ] Open UniversalVideoDownloaderPage — paste a YouTube URL, verify loading message shows "Fetching YouTube 1080p video..."
- [ ] Disconnect network briefly — verify Terabox shows orange error card with "Try Again" button
- [ ] Open any PDF tool, upload a password-protected PDF — verify friendly error message appears
- [ ] Let server sleep (disable UptimeRobot temporarily), then open a video page — verify BackendStatusBar shows orange "Server is sleeping — waking it up..." with ~35s countdown

---

## File Index

```
frontend/src/
  App.tsx                                    ← remove <Toaster /> render (keep import)
  index.css                                  ← fix will-change on .animate-breathe
  hooks/
    useReducedMotion.ts                      ← NEW FILE
  pages/
    ToolsPage.tsx                            ← virtualization + useReducedMotion + memoization
    ToolPage.tsx                             ← enrich PDF error messages
    UniversalVideoDownloaderPage.tsx         ← platform detection + loadingMsg
    TeraboxDownloaderPage.tsx                ← errorType + retry button
  components/
    animations/
      ParticleField.tsx                      ← useReducedMotion early return
    tools/
      BackendStatusBar.tsx                   ← sleeping state + countdown + compact pill

backend/
  src/routes/
    videoRoutes.js                           ← yt-dlp candidate path chain
  server.js                                  ← update keep-alive comment
render.yaml                                  ← add --version canary to buildCommand
```
