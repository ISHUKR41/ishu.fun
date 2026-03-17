# ISHU Project — Implementation Plans for Tasks 1–3

---

## TASK 1: Video Download Tools — Reliability & Coverage Improvements

### Complexity: Medium-High (~4–6 hours)

### 1.1 Files to Modify

| # | File (full path) | Purpose |
|---|---|---|
| 1 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\backend\src\routes\videoRoutes.js` | Core video engine |
| 2 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\backend\package.json` | No new deps needed |

### 1.2 Change A — Add More Cobalt Instances (Line ~201)

**Location:** `tryCobaltDownload()` → `ALL_INSTANCES` array (line 201–218)

**What to add:** Append 8 additional community Cobalt instances AFTER the existing 17. Do NOT remove any existing entries.

```javascript
// After line 218 (after 'https://api.cobalt.lol'):
'https://cobalt.wixnic.com',
'https://cobalt.drmhze.xyz',
'https://cobalt.perennialte.ch',
'https://cobalt-api.kwiatekmiki.com',
'https://cobalt.grin.hu',
'https://cobalt.kaurin.dev',
'https://co.tskau.team',
'https://cobalt.mikumiku.dev',
```

**Why:** More instances = higher chance at least one is alive at any given time. The health-tracking system (cobaltHealthMap) already sorts dead instances to the back.

### 1.3 Change B — Add More Terabox Parsers (Lines ~946 and ~1134)

**Location:** Both the inline `apis` array in `router.post('/terabox-info')` (line 946–1092) AND the `getTeraboxInfoFromAPIs()` helper (line 1134–1240).

**What to add:** Append 4 additional parser entries AFTER the existing `TeraboxDL-V8` entry in BOTH arrays. Both arrays must stay in sync.

```javascript
// Add after TeraboxDL-V8 (after line 1091 in terabox-info route, after line 1218 in helper):
{
  name: 'TeraboxDL-V9',
  url: `https://terabox.hnn.workers.dev/api/get-download?url=${encodeURIComponent(url)}`,
  parse: (data) => {
    if (data && (data.file_name || data.name || data.filename)) {
      const name = data.file_name || data.name || data.filename || 'Terabox File';
      return {
        name, size: data.size || data.file_size || 'Unknown',
        thumbnail: data.thumb || data.thumbnail || '',
        downloadLink: data.direct_link || data.download_link || data.dlink || data.url || '',
        isVideo: /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|3gp)$/i.test(name),
      };
    }
    return null;
  },
},
{
  name: 'TeraboxDL-V10',
  url: `https://terabox-api.azurewebsites.net/api/download?url=${encodeURIComponent(url)}`,
  parse: (data) => {
    if (data && data.ok !== false && (data.file_name || data.name)) {
      const name = data.file_name || data.name || 'Terabox File';
      return {
        name, size: data.size || data.file_size || 'Unknown',
        thumbnail: data.thumb || data.thumbnail || '',
        downloadLink: data.direct_link || data.download_link || data.dlink || '',
        isVideo: /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|3gp)$/i.test(name),
      };
    }
    return null;
  },
},
{
  name: 'TeraboxDL-V11',
  url: `https://api.teraboxdownloader.io/api?url=${encodeURIComponent(url)}`,
  parse: (data) => {
    if (data && (data.file_name || data.name || data.title)) {
      const name = data.file_name || data.name || data.title || 'Terabox File';
      return {
        name, size: data.size || data.file_size || 'Unknown',
        thumbnail: data.thumb || data.thumbnail || '',
        downloadLink: data.direct_link || data.download_link || data.dlink || '',
        isVideo: /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|3gp)$/i.test(name),
      };
    }
    return null;
  },
},
{
  name: 'TeraboxDL-V12',
  url: `https://terabox-dl.vercel.app/api/download?url=${encodeURIComponent(url)}`,
  parse: (data) => {
    if (data && data.data && (data.data.file_name || data.data.name)) {
      const d = data.data;
      return {
        name: d.file_name || d.name || 'Terabox File',
        size: d.size || 'Unknown',
        thumbnail: d.thumb || d.thumbnail || '',
        downloadLink: d.direct_link || d.download_link || d.dlink || '',
        isVideo: true,
      };
    }
    return null;
  },
},
```

### 1.4 Change C — Improve ytdl-core Error Handling & Format Selection (Lines 839–889)

**Location:** `router.post('/youtube-download')` → Method 4: ytdl-core fallback block (line 839–889)

**What to change:** Wrap `ytdl.getInfo()` in a timeout and add format retry logic.

Replace lines 842–856:
```javascript
// OLD (lines 842-856):
const info = await ytdl.getInfo(url);
const requestedHeight = parseInt(quality) || 720;

let chosenFormat;
if (itag) chosenFormat = info.formats.find(f => f.itag === parseInt(itag));
if (!chosenFormat) {
  const combinedFormats = info.formats
    .filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4')
    .sort((a, b) => (b.height || 0) - (a.height || 0));
  chosenFormat = combinedFormats.find(f => (f.height || 0) <= requestedHeight) || combinedFormats[0];
}
if (!chosenFormat) {
  chosenFormat = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
}
```

With:
```javascript
// NEW — timeout-protected getInfo + broader format fallback
const infoPromise = ytdl.getInfo(url);
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('ytdl-core getInfo timed out after 30s')), 30000)
);
const info = await Promise.race([infoPromise, timeoutPromise]);
const requestedHeight = parseInt(quality) || 720;

let chosenFormat;
if (itag) chosenFormat = info.formats.find(f => f.itag === parseInt(itag));
if (!chosenFormat) {
  // Try mp4 combined first
  const combinedFormats = info.formats
    .filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4')
    .sort((a, b) => (b.height || 0) - (a.height || 0));
  chosenFormat = combinedFormats.find(f => (f.height || 0) <= requestedHeight) || combinedFormats[0];
}
if (!chosenFormat) {
  // Fallback: any container with video+audio
  const anyFormat = info.formats
    .filter(f => f.hasVideo && f.hasAudio)
    .sort((a, b) => (b.height || 0) - (a.height || 0));
  chosenFormat = anyFormat.find(f => (f.height || 0) <= requestedHeight) || anyFormat[0];
}
if (!chosenFormat) {
  chosenFormat = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
}
```

**Also:** Apply the same timeout pattern in the video-download universal route (lines 1473–1519) for the ytdl-core block there.

### 1.5 Change D — Add Per-API Timeout Control for Terabox Parsers

**Location:** Terabox API loop in `router.post('/terabox-info')` (line 1095–1112) and `getTeraboxInfoFromAPIs()` (line 1221–1238)

**What to change:** Reduce per-API timeout from 20s→12s and overall abort from 25s→15s for faster failover:

```javascript
// Change in BOTH locations:
// OLD:
timeout: 20000,
signal: AbortSignal.timeout(25000),

// NEW:
timeout: 12000,
signal: AbortSignal.timeout(15000),
```

### 1.6 Change E — Add Request ID Logging for Debugging

**Location:** At the top of each route handler (lines 536, 697, 906, 1246, 1313, 1404)

**What to add:** After extracting `url` from `req.body`, add:
```javascript
const reqId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
// Then prefix all console.log in that handler with [reqId]
```

This is optional but recommended for production debugging.

### 1.7 Implementation Order

1. Add Cobalt instances (Change A) — lowest risk
2. Add Terabox parsers (Change B) — medium risk, must update BOTH arrays
3. Reduce Terabox timeouts (Change D) — quick win
4. Improve ytdl-core error handling (Change C) — moderate complexity
5. (Optional) Add request ID logging (Change E)

### 1.8 Testing / Verification

```bash
# 1. Start backend locally
cd backend && npm run dev

# 2. Test YouTube info endpoint
curl -X POST http://localhost:5000/api/tools/youtube-info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'

# 3. Test YouTube download
curl -X POST http://localhost:5000/api/tools/youtube-download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=dQw4w9WgXcQ","quality":"720"}'

# 4. Test universal video-info with a TikTok/Instagram URL
curl -X POST http://localhost:5000/api/tools/video-info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.tiktok.com/@username/video/123"}'

# 5. Test Terabox info (if you have a test URL)
curl -X POST http://localhost:5000/api/tools/terabox-info \
  -H "Content-Type: application/json" \
  -d '{"url":"https://terabox.com/s/TESTLINK"}'

# 6. Verify health endpoint still reports correct counts
curl http://localhost:5000/api/health
```

---

## TASK 2: TV Page Performance — Critical Bug Fixes & Optimizations

### Complexity: Medium (~3–5 hours)

### 2.1 Files to Modify

| # | File (full path) | Purpose |
|---|---|---|
| 1 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\pages\TVPage.tsx` | Main TV page (1826 lines) |

### 2.2 Change A — Fix timeupdate Listener Leak in `tryAttempt()` (CRITICAL BUG)

**Location:** `tryAttempt()` callback, inside `useRobustPlayer` hook (lines 593–757)

**The Bug:** On line 634, a `timeupdate` event listener is added to the video element. When playback succeeds (MANIFEST_PARSED fires on line 709), the listener is NEVER removed — it persists indefinitely, calling `tryAttempt(idx + 1)` after 8s of stall even during normal playback pauses. Over time, multiple leaked listeners accumulate.

**Fix:** Inside the `MANIFEST_PARSED` handler (after line 712, where `retryRef.current = 0`), remove the stall-detection listener and replace it with a fresh one that only resets the stall timer (without triggering next-attempt):

```typescript
// ADD after line 712 (retryRef.current = 0;)

// Remove old stall-detection listener (it would trigger tryAttempt on pause)
if (timeUpdateRef.current && video) {
  video.removeEventListener("timeupdate", timeUpdateRef.current);
}
// Replace with a playing-mode stall detector that just monitors for freeze
const playingStallDetect = () => {
  if (stallRef.current) clearTimeout(stallRef.current);
  stallRef.current = setTimeout(() => {
    // Stream froze for 8s during active playback → try next
    if (hlsRef.current) tryAttempt(idx + 1);
  }, 8000);
};
timeUpdateRef.current = playingStallDetect;
video.addEventListener("timeupdate", playingStallDetect);
```

**Why:** The original `onTimeUpdate` (line 629–631) calls `tryAttempt(idx + 1)` on any 8s stall. This is correct during connection phase, but after MANIFEST_PARSED, we should only escalate if the HLS instance is still active and truly stalled. The fix re-attaches a listener that's safe for the playing state.

### 2.3 Change B — Fix Fuse.js `minMatchCharLength` (Performance)

**Location:** `fuse` useMemo on line 904–916

**What to change on line 914:**
```typescript
// OLD:
minMatchCharLength: 1,

// NEW:
minMatchCharLength: 2,
```

**Why:** `minMatchCharLength: 1` causes Fuse to do expensive fuzzy matching on single characters. Changing to 2 means search only activates with 2+ chars typed. The `searchResults` useMemo on line 918–921 already guards against empty search (`if (!search.trim()) return []`), but Fuse still creates internal indices for single chars.

### 2.4 Change C — Add Search Debouncing (Performance)

**Location:** Add a debounced search state after the `search` state declaration (line 869)

**Step 1:** Add a debounced search value state and useRef timer:

```typescript
// ADD after line 869 (const [search, setSearch] = useState("");)
const [debouncedSearch, setDebouncedSearch] = useState("");
const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

// Add debounce effect after searchFocused state (after line 870):
useEffect(() => {
  if (debounceRef.current) clearTimeout(debounceRef.current);
  if (!search.trim()) { setDebouncedSearch(""); return; }
  debounceRef.current = setTimeout(() => setDebouncedSearch(search), 250);
  return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
}, [search]);
```

**Step 2:** Replace `search` with `debouncedSearch` in the two useMemo hooks that run Fuse:

Line 918–921 (`searchResults`):
```typescript
// OLD:
const searchResults = useMemo(() => {
  if (!search.trim()) return [];
  return fuse.search(search).slice(0, 50).map((r) => r.item);
}, [fuse, search]);

// NEW:
const searchResults = useMemo(() => {
  if (!debouncedSearch.trim()) return [];
  return fuse.search(debouncedSearch).slice(0, 50).map((r) => r.item);
}, [fuse, debouncedSearch]);
```

Line 930–945 (`filtered`):
```typescript
// OLD (line 934-936):
if (search.trim()) {
  const ids = new Set(fuse.search(search).map((r) => r.item.id));
  list = list.filter((c) => ids.has(c.id));
}

// NEW:
if (debouncedSearch.trim()) {
  const ids = new Set(fuse.search(debouncedSearch).map((r) => r.item.id));
  list = list.filter((c) => ids.has(c.id));
}
```

And update the deps array on line 945:
```typescript
// OLD:
}, [langChannels, activeCat, search, fuse, favorites, failedIds]);

// NEW:
}, [langChannels, activeCat, debouncedSearch, fuse, favorites, failedIds]);
```

**NOTE:** Keep the `search` state as-is for the input field value (instant visual feedback). Only Fuse computation uses `debouncedSearch`.

### 2.5 Change D — Remove `favorites` and `failedIds` from `filtered` Dependencies

**Location:** `filtered` useMemo (lines 930–945)

**The Problem:** `favorites` and `failedIds` are `Set<string>` objects. Every call to `setFavorites` or `setFailedIds` creates a new Set, causing `filtered` to recompute. `filtered` only uses `favorites` when `activeCat === FAV_CAT`, and `failedIds` only for sort order (cosmetic).

**Fix:** Extract the favorite filtering into a stable callback and use refs for sort-only deps:

```typescript
// ADD before the filtered useMemo (before line 930):
const failedIdsRef = useRef(failedIds);
failedIdsRef.current = failedIds;
const favoritesRef = useRef(favorites);
favoritesRef.current = favorites;

// Track activeCat FAV to trigger recompute only when viewing favorites
const isFavView = activeCat === FAV_CAT;
const favVersion = useMemo(() => isFavView ? [...favorites].sort().join(',') : '', [isFavView, favorites]);
```

Then update `filtered`:
```typescript
const filtered = useMemo(() => {
  let list = langChannels;
  if (isFavView) list = list.filter((c) => favoritesRef.current.has(c.id));
  else if (activeCat !== ALL_CAT) list = list.filter((c) => c.category === activeCat);
  if (debouncedSearch.trim()) {
    const ids = new Set(fuse.search(debouncedSearch).map((r) => r.item.id));
    list = list.filter((c) => ids.has(c.id));
  }
  return [...list].sort((a, b) => {
    const aF = failedIdsRef.current.has(a.id) ? 1 : 0;
    const bF = failedIdsRef.current.has(b.id) ? 1 : 0;
    if (aF !== bF) return aF - bF;
    if (b.streams.length !== a.streams.length) return b.streams.length - a.streams.length;
    return a.name.localeCompare(b.name);
  });
}, [langChannels, activeCat, debouncedSearch, fuse, isFavView, favVersion]);
```

**Impact:** Toggling a favorite or marking a channel as failed no longer triggers an expensive re-filter of 700+ channels plus Fuse re-search. The `ChannelCard` components still pick up the latest `favorites.has(ch.id)` from the state because they receive it as a prop directly.

### 2.6 Change E — Debounce Favorites localStorage Writes

**Location:** Line 1047

```typescript
// OLD:
useEffect(() => { localStorage.setItem("ishu_tv_favs", JSON.stringify([...favorites])); }, [favorites]);

// NEW:
useEffect(() => {
  const t = setTimeout(() => {
    localStorage.setItem("ishu_tv_favs", JSON.stringify([...favorites]));
  }, 500);
  return () => clearTimeout(t);
}, [favorites]);
```

**Why:** `localStorage.setItem` is synchronous and blocks the main thread. A 500ms debounce batches rapid favorite toggles.

### 2.7 Change F — Batch M3U Fetches with Concurrency Limit

**Location:** `fetchAllChannels()` → `Promise.allSettled` on line 361–369

```typescript
// OLD (line 361-369):
const m3uResults = await Promise.allSettled(
  m3uSources.map(async (src) => {
    try {
      const r = await fetch(src.url, { signal });
      if (!r.ok) return [];
      return parseM3U(await r.text(), src.lang);
    } catch { return []; }
  }),
);

// NEW — limit concurrency to 10 parallel fetches:
const CONCURRENCY = 10;
const m3uResults: PromiseSettledResult<ReturnType<typeof parseM3U>>[] = [];
for (let i = 0; i < m3uSources.length; i += CONCURRENCY) {
  const batch = m3uSources.slice(i, i + CONCURRENCY);
  const batchResults = await Promise.allSettled(
    batch.map(async (src) => {
      try {
        const r = await fetch(src.url, { signal });
        if (!r.ok) return [];
        return parseM3U(await r.text(), src.lang);
      } catch { return []; }
    }),
  );
  m3uResults.push(...batchResults);
  // Update progress as batches complete
  const batchPct = 70 + Math.round((i / m3uSources.length) * 15);
  onProgress(Math.min(batchPct, 85), `Fetching M3U sources (${Math.min(i + CONCURRENCY, m3uSources.length)}/${m3uSources.length})...`);
}
```

**Why:** 59 parallel HTTP requests cause browser network congestion and can trigger ERR_INSUFFICIENT_RESOURCES on mobile. 10 at a time is optimal.

### 2.8 Change G — Stabilize Volume/Mute to Avoid Full Page Re-renders

**Location:** Volume sync effect (lines 896–901)

The current effect correctly syncs volume to the video element. The issue is that `setMuted` / `setVolume` on lines 1412/1463 cause re-renders of the entire TVPage including all ChannelCards. The `ChannelCard` is already `React.memo`'d, so the re-render is shallow (just the TVPage function body). This is acceptable given `React.memo` on cards, but we can minimize by ensuring the volume range input uses a ref update:

```typescript
// Replace lines 896-901:
// OLD:
useEffect(() => {
  if (videoRef.current) {
    videoRef.current.volume = volume / 100;
    videoRef.current.muted = muted;
  }
}, [volume, muted]);

// NEW — also update via ref to avoid triggering render for transient drags:
const volumeRef = useRef(volume);
const mutedRef = useRef(muted);
useEffect(() => {
  volumeRef.current = volume;
  mutedRef.current = muted;
  if (videoRef.current) {
    videoRef.current.volume = volume / 100;
    videoRef.current.muted = muted;
  }
}, [volume, muted]);
```

This is minimal; the real protection comes from `React.memo` on `ChannelCard` which already prevents child re-renders.

### 2.9 Implementation Order

1. **Fix timeupdate leak (Change A)** — Critical bug, do first
2. **Fix minMatchCharLength (Change B)** — One-line fix
3. **Add search debouncing (Change C)** — High performance impact
4. **Remove favorites/failedIds from filtered deps (Change D)** — Reduces cascading re-renders
5. **Debounce localStorage writes (Change E)** — Quick win
6. **Batch M3U fetches (Change F)** — Improves initial load reliability
7. **Volume ref optimization (Change G)** — Minor polish

### 2.10 Testing / Verification

```
1. Open browser DevTools → Performance tab
2. Navigate to /tv → select a language
3. Type single characters in search → verify NO Fuse search runs until 2+ chars + 250ms delay
4. Monitor "timeupdate" listener count in DevTools Memory tab:
   - Play a channel → count should be 1
   - Switch channels 5 times → count should still be 1 (not 5)
5. Toggle favorites rapidly → verify no UI jank
6. Check initial load: M3U fetches should appear in 10-batch waves in Network tab
7. Verify playback works: play channel, quality switching, auto-skip all functional
```

---

## TASK 3: Tools Verification — Ensure All 145 Tools Work End-to-End

### Complexity: Medium (~3–4 hours)

### 3.1 Files to Audit & Potentially Modify

| # | File (full path) | Purpose |
|---|---|---|
| 1 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\data\tools-data.ts` | 145 tool definitions |
| 2 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\lib\pdf-processor.ts` | Client processing engine (~1300 lines) |
| 3 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\pages\ToolPage.tsx` | Tool UI page |
| 4 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\backend\src\routes\organizeRoutes.js` | 9 organize endpoints |
| 5 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\backend\src\routes\editRoutes.js` | 11 edit endpoints |
| 6 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\backend\src\routes\convertRoutes.js` | 75+ convert endpoints |
| 7 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\backend\src\routes\securityRoutes.js` | 7 security endpoints |
| 8 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\backend\src\routes\aiRoutes.js` | 12 AI endpoints |
| 9 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\backend\src\routes\videoRoutes.js` | 6 video endpoints |
| 10 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\backend\server.js` | Health endpoint, route mounting |

### 3.2 Verification Strategy — Cross-Reference Matrix

The verification requires checking 3 layers for EACH of the 145 tools:

```
Layer 1: tools-data.ts    → slug exists in allToolsData[]
Layer 2: pdf-processor.ts → slug has a case in processFiles() switch
Layer 3: Backend route     → /api/tools/{slug} endpoint exists (for backend-fallback tools)
```

#### Step 1: Extract All Slugs from tools-data.ts

The file has 145 entries. Each has a `slug` property. Collect all slugs:

```
Video Tools (3): youtube-downloader, terabox-downloader, universal-video-downloader
Organize (8): merge-pdf, split-pdf, organize-pdf, rotate-pdf, delete-pages, rearrange-pages, extract-pages, crop-pdf
Edit (14): compress-pdf, edit-pdf, edit-pdf-text, add-text, add-image-to-pdf, sign-pdf, watermark, page-numbers, header-and-footer, annotate-pdf, highlight-pdf, pdf-filler, whiteout-pdf, grayscale-pdf
Convert to PDF (35): word-to-pdf, powerpoint-to-pdf, excel-to-pdf, jpg-to-pdf, png-to-pdf, image-to-pdf, html-to-pdf, url-to-pdf, docx-to-pdf, pptx-to-pdf, epub-to-pdf, txt-to-pdf, odt-to-pdf, rtf-to-pdf, csv-to-pdf, svg-to-pdf, heic-to-pdf, heif-to-pdf, webp-to-pdf, bmp-to-pdf, tiff-to-pdf, gif-to-pdf, jfif-to-pdf, djvu-to-pdf, pages-to-pdf, mobi-to-pdf, xml-to-pdf, md-to-pdf, ebook-to-pdf, dwg-to-pdf, dxf-to-pdf, pub-to-pdf, xps-to-pdf, hwp-to-pdf, chm-to-pdf, fb2-to-pdf, wps-to-pdf, eml-to-pdf, zip-to-pdf, cbz-to-pdf, cbr-to-pdf, ai-to-pdf
Convert from PDF (20): pdf-to-word, pdf-to-powerpoint, pdf-to-excel, pdf-to-jpg, pdf-to-png, pdf-to-image, pdf-to-html, pdf-to-docx, pdf-to-epub, pdf-to-txt, pdf-to-odt, pdf-to-rtf, pdf-to-csv, pdf-to-svg, pdf-to-bmp, pdf-to-tiff, pdf-to-gif, pdf-to-mobi, pdf-to-pdfa, pdf-to-ppt, pdf-converter
Security (6): protect-pdf, unlock-pdf, redact-pdf, flatten-pdf, remove-metadata, edit-metadata
AI & Others (14): ocr-pdf, compare-pdf, translate-pdf, chat-with-pdf, summarize, repair-pdf, scan-to-pdf, pdf-viewer, create-pdf, resize-pages, extract-text, extract-images
```

#### Step 2: Cross-Reference with pdf-processor.ts `processFiles()` switch (lines 1123–1246)

Run this verification script to find mismatches:

```bash
# Extract slugs from tools-data.ts
grep -oP "slug:\s*\"([^\"]+)\"" frontend/src/data/tools-data.ts | sed 's/slug: "//;s/"//' | sort > /tmp/tools_slugs.txt

# Extract case slugs from pdf-processor.ts  
grep -oP "case '([^']+)':" frontend/src/lib/pdf-processor.ts | sed "s/case '//;s/'://" | sort -u > /tmp/processor_slugs.txt

# Find tools in tools-data.ts that have NO case in pdf-processor.ts
comm -23 /tmp/tools_slugs.txt /tmp/processor_slugs.txt
```

**Known expected mismatches** (Video tools are handled differently — via ToolPage special routing to video components, not pdf-processor):
- `youtube-downloader` — Handled by dedicated video downloader page
- `terabox-downloader` — Handled by dedicated video downloader page
- `universal-video-downloader` — Handled by dedicated video downloader page

These 3 should be verified separately (they route to video-specific pages/components, not through pdf-processor).

#### Step 3: Verify Backend Route Coverage

For each tool that uses `tryBackendThenClient()` or `tryClientThenBackend()`, verify the backend has a matching endpoint:

```bash
# Extract backend route slugs from all route files:
grep -rhP "router\.(post|get)\('/([\w-]+)'" backend/src/routes/ | \
  grep -oP "'/([\w-]+)'" | sed "s/'//g;s/\///" | sort -u > /tmp/backend_slugs.txt

# Extract tools that call backend:
grep -oP "tryBackendThenClient\('([^']+)'" frontend/src/lib/pdf-processor.ts | \
  sed "s/tryBackendThenClient('//;s/'//" | sort -u > /tmp/backend_needed.txt

grep -oP "tryClientThenBackend\([^,]+,\s*'([^']+)'" frontend/src/lib/pdf-processor.ts | \
  sed "s/.*'//;s/'//" | sort -u >> /tmp/backend_needed.txt

# Find backend routes that are needed but missing:
comm -23 <(sort -u /tmp/backend_needed.txt) /tmp/backend_slugs.txt
```

### 3.3 Potential Issues to Fix

#### Issue A — Missing `processFiles()` Cases for New/Exotic Tools

If any slug from tools-data.ts has no matching case in pdf-processor.ts, it falls through to the `default` case (line 1245):
```typescript
default: return tryBackendThenClient(toolSlug, files, options, () => genericToPdf(file));
```

This is actually safe — the default handler tries the backend first, then a generic client conversion. **No fix needed** unless a tool has specific client-side logic that's missing.

#### Issue B — Health Endpoint Tool Count Mismatch

**Location:** `backend/server.js` line 344–351

The health endpoint hardcodes `total: 116` but tools-data.ts has 145 entries (including 3 video tools). The count should be updated:

```javascript
// OLD:
toolGroups: {
    organize: 9,
    edit: 11,
    convert: 77,
    security: 7,
    ai: 12,
    total: 116,
},

// NEW (add video group, verify counts):
toolGroups: {
    organize: 9,
    edit: 14,      // verify: compress, edit-pdf, edit-pdf-text, add-text, add-image, sign, watermark, page-numbers, header-footer, annotate, highlight, pdf-filler, whiteout, grayscale = 14
    convert: 77,
    security: 6,
    ai: 14,        // verify: ocr, compare, translate, chat, summarize, repair, scan-to-pdf, pdf-viewer, create-pdf, resize-pages, extract-text, extract-images = 12; + scan, viewer = 14
    video: 3,
    total: 145,
},
```

> **Note:** The exact breakdown must be verified by counting tools in each category from tools-data.ts. Run:
> ```bash
> grep '"category":' frontend/src/data/tools-data.ts | sort | uniq -c
> ```

#### Issue C — Backend Route Slug Mismatches

Some tools in pdf-processor.ts pass different slugs to `tryBackendThenClient()` than what the backend expects. For example:

- `tryClientThenBackend(() => protectPdf(file, options), 'protect', ...)` — sends slug `protect` to backend, but backend route might be `/protect-pdf`
- `tryClientThenBackend(() => unlockPdf(file), 'unlock', ...)` — sends slug `unlock`
- `tryClientThenBackend(() => redactPdf(file, options), 'redact', ...)` — sends slug `redact`

**Verification needed:** Check if `securityRoutes.js` has routes like `/protect` or `/protect-pdf`. If the backend uses `/protect-pdf` but the frontend sends `/protect`, those calls silently fail and fall back to client-side only.

**Fix (if mismatch found):** Update the slug passed to `tryClientThenBackend()` to match backend routes:
```typescript
// Example fix in pdf-processor.ts:
case 'protect-pdf': return tryClientThenBackend(() => protectPdf(file, options), 'protect-pdf', files, options);
```

### 3.4 Specific Checks per Category

#### Video Tools (3 tools)
- Verify `youtube-downloader`, `terabox-downloader`, `universal-video-downloader` slugs in tools-data.ts map to the correct frontend components (NOT pdf-processor)
- Check ToolPage.tsx has special handling for video tool slugs (likely redirects to video-specific pages)

#### Organize (8 tools)  
- Verify all 8 have client-side implementations in pdf-processor.ts (merge, split, rotate, delete, extract, compress, organize/rearrange, crop)
- All should work client-side without backend

#### Edit (14 tools)
- Verify edit-pdf-text and edit-pdf both map to `addTextToPdf`
- Verify annotate-pdf, highlight-pdf, pdf-filler all map to `addTextToPdf`

#### Convert (77 tools)
- 35 "to-PDF" tools: Many exotic formats use `tryBackendThenClient` with `genericToPdf` fallback
- 20 "from-PDF" tools: pdf-to-bmp/tiff/gif/svg use `tryBackendThenClient` with `pdfToImage` fallback
- Verify Word/DOCX uses mammoth library client-side
- Verify Excel uses xlsx library client-side

#### Security (6 tools)
- protect/unlock/redact use `tryClientThenBackend` (client first)
- flatten/remove-metadata/edit-metadata are client-only

#### AI (12+ tools)
- ocr-pdf uses tesseract.js client-side
- translate/chat/summarize use Supabase edge function
- Verify Supabase client is properly configured

### 3.5 Implementation Order

1. **Run cross-reference scripts** (Step 2 & 3) to identify actual mismatches
2. **Fix any slug mismatches** between pdf-processor.ts and backend routes
3. **Update health endpoint counts** in server.js
4. **Verify video tool routing** in ToolPage.tsx
5. **Test 5 representative tools** from each category manually
6. **Run full frontend build** to catch any import/type errors

### 3.6 Testing / Verification

```bash
# 1. Build frontend to catch compile errors
cd frontend && npm run build

# 2. Run cross-reference script
node -e "
const toolsData = require('./frontend/src/data/tools-data.ts'); // Need ts-node
// Or parse manually
"

# 3. Test representative tools via backend:
# Organize: merge-pdf
curl -X POST http://localhost:5000/api/tools/merge-pdf \
  -F "files=@test1.pdf" -F "files=@test2.pdf"

# Convert: word-to-pdf
curl -X POST http://localhost:5000/api/tools/word-to-pdf \
  -F "files=@test.docx"

# Security: protect-pdf
curl -X POST http://localhost:5000/api/tools/protect-pdf \
  -F "files=@test.pdf" -F 'options={"password":"test123"}'

# AI: extract-text
curl -X POST http://localhost:5000/api/tools/extract-text \
  -F "files=@test.pdf"

# 4. Test health endpoint
curl http://localhost:5000/api/health | python -m json.tool

# 5. Frontend smoke test — navigate to each tool page:
# /tools/merge-pdf, /tools/jpg-to-pdf, /tools/protect-pdf, /tools/ocr-pdf
# Verify: upload zone appears, file type validation works, processing completes
```

### 3.7 Automated Verification Script

Create a one-off verification script (DO NOT commit to repo):

```javascript
// verify-tools.mjs — Run with: node verify-tools.mjs
import fs from 'fs';

// 1. Parse tools-data.ts for slugs
const toolsFile = fs.readFileSync('frontend/src/data/tools-data.ts', 'utf8');
const slugRegex = /slug:\s*"([^"]+)"/g;
const toolSlugs = [];
let match;
while ((match = slugRegex.exec(toolsFile))) toolSlugs.push(match[1]);

// 2. Parse pdf-processor.ts for case slugs
const procFile = fs.readFileSync('frontend/src/lib/pdf-processor.ts', 'utf8');
const caseRegex = /case\s+'([^']+)':/g;
const procSlugs = new Set();
while ((match = caseRegex.exec(procFile))) procSlugs.add(match[1]);

// 3. Find tools without processor cases
const videoSlugs = new Set(['youtube-downloader', 'terabox-downloader', 'universal-video-downloader']);
const missing = toolSlugs.filter(s => !procSlugs.has(s) && !videoSlugs.has(s));

console.log(`\nTotal tools in tools-data.ts: ${toolSlugs.length}`);
console.log(`Total cases in pdf-processor.ts: ${procSlugs.size}`);
console.log(`Video tools (separate routing): ${videoSlugs.size}`);
console.log(`\nTools missing processor case (${missing.length}):`);
missing.forEach(s => console.log(`  ⚠️  ${s}`));
if (missing.length === 0) console.log('  ✅ All non-video tools have processor cases!');

// 4. Parse backend routes
const routeFiles = fs.readdirSync('backend/src/routes').filter(f => f.endsWith('.js'));
const backendSlugs = new Set();
for (const rf of routeFiles) {
  const content = fs.readFileSync(`backend/src/routes/${rf}`, 'utf8');
  const routeRegex = /router\.(post|get)\(['"]\/([^'"]+)['"]/g;
  while ((match = routeRegex.exec(content))) backendSlugs.add(match[2]);
}

// 5. Check backend-dependent tools
const backendCallRegex = /tryBackendThenClient\(['"]([^'"]+)['"]/g;
const clientBackendRegex = /tryClientThenBackend\([^,]+,\s*['"]([^'"]+)['"]/g;
const neededBackend = new Set();
while ((match = backendCallRegex.exec(procFile))) neededBackend.add(match[1]);
while ((match = clientBackendRegex.exec(procFile))) neededBackend.add(match[1]);

const missingBackend = [...neededBackend].filter(s => !backendSlugs.has(s));
console.log(`\nBackend routes needed: ${neededBackend.size}`);
console.log(`Backend routes available: ${backendSlugs.size}`);
console.log(`\nBackend routes missing (${missingBackend.length}):`);
missingBackend.forEach(s => console.log(`  ⚠️  ${s} — frontend calls backend but no route exists`));
if (missingBackend.length === 0) console.log('  ✅ All backend-dependent tools have routes!');
```

---

## Summary: Priority & Risk Matrix

| Task | Priority | Risk | Key Changes |
|------|----------|------|------------|
| **Task 2 — Change A** (timeupdate leak) | 🔴 Critical | Low | Fix event listener leak in HLS player |
| **Task 2 — Change C** (search debounce) | 🟡 High | Low | Add 250ms debounce to Fuse search |
| **Task 2 — Change D** (filtered deps) | 🟡 High | Medium | Use refs for favorites/failedIds in sort |
| **Task 2 — Change B** (minMatchCharLength) | 🟢 Medium | None | One-line config change |
| **Task 2 — Change F** (M3U batching) | 🟢 Medium | Low | Limit to 10 concurrent fetches |
| **Task 1 — Change A** (Cobalt instances) | 🟢 Medium | None | Add 8 instances to array |
| **Task 1 — Change B** (Terabox parsers) | 🟢 Medium | Low | Add 4 parsers to 2 arrays |
| **Task 1 — Change C** (ytdl-core timeout) | 🟡 High | Low | Add 30s timeout to getInfo |
| **Task 1 — Change D** (Terabox timeouts) | 🟢 Medium | None | Reduce timeouts for faster failover |
| **Task 3 — Cross-reference** | 🟡 High | None | Read-only verification |
| **Task 3 — Health count fix** | 🟢 Low | None | Update hardcoded numbers |
| **Task 3 — Slug mismatch fixes** | 🟡 High | Low | Fix tryClientThenBackend slugs if needed |

**Total estimated time: 10–15 hours across all 3 tasks.**
