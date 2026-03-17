# ISHU Project — Implementation Plans for Tasks 6–7

---

## TASK 6: Background Images & Parallax Enhancements

### Complexity: Medium (~3–4 hours)

### 6.0 Analysis — Which Pages Need Work?

| Page | Background Image | Parallax | Lazy Loading | Verdict |
|------|-----------------|----------|-------------|---------|
| **HomePage (Index.tsx)** | ✅ `hero-bg.jpg` (local) | ✅ `useTransform` bgY | ✅ eager (above-fold) | ✅ **Already excellent** — skip |
| **CVPage** | ✅ Unsplash | ✅ `heroImgY` | — | ✅ **Enhanced in Task 4** — skip |
| **ResumePage** | ✅ Yes | ✅ Partial | — | ✅ **Enhanced in Task 4** — skip |
| **BioDataPage** | ✅ 3D + gradients | ✅ Full | — | ✅ **Gold standard** — skip |
| **AboutPage** | ✅ Unsplash + GSAP | ✅ Full | — | ✅ **Good already** — skip |
| **ToolsPage** | ✅ Fixed + `bgY` | ✅ Full | — | ✅ **Good already** — skip |
| **ToolPage** | ✅ Fixed + `bgY` | ✅ Full | — | ✅ **Good already** — skip |
| **NewsPage** | ✅ Unsplash + `bgY` | ✅ `heroY` + `heroOpacity` | ✅ All `loading="lazy"` | ⚠️ **Minor** — add `will-change` hint |
| **BlogPage** | ✅ Unsplash + `bgY` | ✅ `bgY` parallax | ❌ No hero lazy | ⚠️ **Minor** — add `will-change`, reduced motion |
| **ResultsPage** | ✅ Unsplash + `bgY` | ✅ `bgY` parallax | ❌ No hero lazy | ⚠️ **Minor** — add `will-change`, reduced motion |
| **TVPage** | ✅ Fixed Unsplash (CSS) | ❌ **No parallax** | ❌ No lazy loading | 🔴 **Enhance** — add parallax + perf hints |
| **ContactPage** | ✅ Unsplash (absolute) | ❌ **No scroll parallax** | ❌ No lazy loading | 🔴 **Enhance** — add parallax + perf hints |

**Actionable pages:** TVPage (major), ContactPage (major), BlogPage (minor), ResultsPage (minor), NewsPage (minor)

### 6.1 Files to Modify/Create

| # | File (full path) | Purpose |
|---|---|---|
| 1 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\components\animations\ParallaxHero.tsx` | **NEW** — Reusable parallax hero background component |
| 2 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\pages\TVPage.tsx` | Add parallax to hero background |
| 3 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\pages\ContactPage.tsx` | Add parallax to hero background |
| 4 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\pages\BlogPage.tsx` | Add perf hints + reduced motion |
| 5 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\pages\ResultsPage.tsx` | Add perf hints + reduced motion |
| 6 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\pages\NewsPage.tsx` | Add `will-change` hint to parallax bg |

---

### 6.2 Change A — Create Reusable `ParallaxHero` Component (NEW FILE)

**File:** `frontend\src\components\animations\ParallaxHero.tsx`

**Purpose:** Standardize the hero background pattern used across pages. Encapsulates: Unsplash image, parallax transform, gradient overlay, lazy loading via `react-intersection-observer`, `will-change` hints, and `prefers-reduced-motion` support.

**Why:** Currently each page hand-rolls its own parallax background `motion.div` with slightly different patterns. This component unifies the pattern for consistency and performance.

```tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface ParallaxHeroProps {
  /** Full Unsplash URL (include ?auto=format&fit=crop&w=1920&q=80) */
  imageUrl: string;
  /** Parallax scroll range in px (default: [-150, 0] → moves up 150px over 2000px scroll) */
  scrollRange?: [number, number];
  /** Max scroll distance to map over (default: 2000) */
  scrollDistance?: number;
  /** Background opacity (default: 0.05) */
  opacity?: number;
  /** Extra CSS classes */
  className?: string;
  /** Whether the image is above-the-fold and should load eagerly */
  eager?: boolean;
}

const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ParallaxHero = ({
  imageUrl,
  scrollRange = [0, -150],
  scrollDistance = 2000,
  opacity = 0.05,
  className = "",
  eager = false,
}: ParallaxHeroProps) => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, scrollDistance], PREFERS_REDUCED_MOTION ? [0, 0] : scrollRange);

  // Lazy load the background image using react-intersection-observer
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    rootMargin: "200px 0px", // start loading 200px before visible
  });
  const [loaded, setLoaded] = useState(eager);

  // Preload image when in view
  if (inView && !loaded) {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.src = imageUrl;
  }

  return (
    <motion.div
      ref={inViewRef}
      className={`fixed inset-0 -z-10 mix-blend-luminosity pointer-events-none scale-[1.15] origin-center transition-opacity duration-700 ${className}`}
      style={{
        backgroundImage: loaded ? `url('${imageUrl}')` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: loaded ? opacity : 0,
        y: bgY,
        willChange: "transform",
      }}
    />
  );
};

export default ParallaxHero;
```

**Key design decisions:**
- Uses `react-intersection-observer` (already installed) for lazy loading with 200px rootMargin
- `will-change: transform` hint for GPU compositing
- `prefers-reduced-motion` support: disables parallax movement, still shows the image
- `eager` prop for above-fold heroes (like HomePage) that shouldn't lazy-load
- `transition-opacity duration-700` for a smooth fade-in when the image loads
- Matches the existing pattern in BlogPage/ResultsPage/NewsPage (`bgY` transform, fixed positioning, mix-blend-luminosity)
- Default opacity `0.05` matches the consistent pattern across all existing pages

---

### 6.3 Change B — TVPage: Add Parallax to Hero Background (Lines 1–20, 1157–1162)

**File:** `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\pages\TVPage.tsx`

**Step 1 — Add imports** (after line 20, near existing animation imports)

Add to imports section:
```typescript
// Add this import alongside the existing animation imports (after line 20):
import ParallaxHero from "@/components/animations/ParallaxHero";
```

**Step 2 — Replace fixed background div** (lines 1156–1162)

Replace the current static CSS background:
```tsx
// OLD (lines 1156-1162):
      {/* Dynamic Background Image for TVPage (Fixed to viewport - CSS only for performance) */}
      <div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }} />
```

With the new ParallaxHero component:
```tsx
// NEW — Parallax background with lazy loading + GPU hints
      <ParallaxHero
        imageUrl="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1920&q=80"
        scrollRange={[0, -120]}
        scrollDistance={1500}
      />
```

**Why:** Adds smooth parallax scrolling to TVPage (was only using `backgroundAttachment: fixed` which doesn't actually parallax), adds lazy loading for the Unsplash image, adds `will-change` hint, adds reduced-motion support, and adds `&w=1920` to the URL for proper image sizing (was missing).

---

### 6.4 Change C — ContactPage: Add Parallax to Hero Background (Lines 1–40, 172–176)

**File:** `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\pages\ContactPage.tsx`

**Step 1 — Add imports** (after line 31 or in the existing import block)

```typescript
// Add alongside existing animation imports:
import { useScroll, useTransform } from "framer-motion";
```

Note: `motion` is already imported from framer-motion on an existing line. We need to ensure `useScroll` and `useTransform` are included. Check if they're already in the existing import — if not, add them.

**Current import (line ~37):**
```typescript
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
```

`useTransform` is already imported. We need to add `useScroll`. Update to:
```typescript
// UPDATED — add useScroll:
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
```

**Step 2 — Add parallax transform** (inside the component function, near the existing `useMotionValue` calls — around line ~120)

Find the line where `useMotionValue` is used and add after it:
```typescript
// Add after existing useMotionValue/useSpring declarations:
const { scrollY } = useScroll();
const heroBgY = useTransform(scrollY, [0, 800], [0, -80]);
```

**Step 3 — Update the hero background div** (lines 171–176)

Replace:
```tsx
// OLD (lines 172-176):
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 opacity-[0.10] mix-blend-luminosity pointer-events-none" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
```

With:
```tsx
// NEW — parallax background with GPU hint + reduced motion support
        <motion.div
          className="absolute inset-0 opacity-[0.10] mix-blend-luminosity pointer-events-none scale-[1.1] origin-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            y: heroBgY,
            willChange: "transform",
          }}
        />
```

**Why:** Adds smooth parallax scrolling to the ContactPage hero background. The existing page had a static `div` — now it uses `motion.div` with `heroBgY` transform. The `scale-[1.1]` prevents edge gaps during parallax movement. `will-change: transform` enables GPU compositing. The scroll range `[0, 800]` with output `[0, -80]` gives a subtle, smooth effect that doesn't conflict with the existing mouse-tracking spotlight effect.

---

### 6.5 Change D — BlogPage: Add Performance Hints (Lines 113–118)

**File:** `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\pages\BlogPage.tsx`

The BlogPage already has parallax (`bgY`). We just add `will-change` for GPU compositing.

**Location:** Line 113–118 (the `motion.div` for the background image)

Replace:
```tsx
// OLD (lines 113-118):
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=2073&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />
```

With:
```tsx
// NEW — added willChange hint for GPU compositing
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY,
        willChange: "transform",
      }} />
```

**Why:** Adds `willChange: "transform"` to hint the browser to promote this element to its own compositing layer, avoiding expensive repaints during scroll. Also standardizes width to `w=1920` (was `w=2073`).

---

### 6.6 Change E — ResultsPage: Add Performance Hints (Lines 397–402)

**File:** `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\pages\ResultsPage.tsx`

Same pattern as BlogPage — already has parallax, just needs GPU hint.

**Location:** Lines 397–402

Replace:
```tsx
// OLD (lines 397-402):
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2071&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />
```

With:
```tsx
// NEW — added willChange hint for GPU compositing
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY,
        willChange: "transform",
      }} />
```

**Why:** Same as BlogPage — GPU compositing hint. Standardizes `w=2071` → `w=1920`.

---

### 6.7 Change F — NewsPage: Add Performance Hints (Lines 529–534)

**File:** `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\src\pages\NewsPage.tsx`

Same pattern — already has parallax + lazy-loaded images. Just needs GPU hint on the fixed background.

**Location:** Lines 529–534

Replace:
```tsx
// OLD (lines 529-534):
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=2069&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />
```

With:
```tsx
// NEW — added willChange hint for GPU compositing
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY,
        willChange: "transform",
      }} />
```

**Why:** GPU compositing hint, standardize width to `w=1920`.

---

### 6.8 New Libraries

**None.** All dependencies are already installed:
- `framer-motion` (v12.35.1) — for parallax transforms
- `react-intersection-observer` — for lazy loading in ParallaxHero

---

### 6.9 Implementation Order

1. **Create `ParallaxHero.tsx`** (Change A) — foundation component
2. **Update TVPage.tsx** (Change B) — biggest visual improvement, uses new component
3. **Update ContactPage.tsx** (Change C) — second biggest improvement, inline parallax
4. **Update BlogPage.tsx** (Change D) — minor perf hint
5. **Update ResultsPage.tsx** (Change E) — minor perf hint
6. **Update NewsPage.tsx** (Change F) — minor perf hint
7. **Run build** — `cd frontend && npm run build` — verify no TypeScript errors
8. **Run lint** — `cd frontend && npm run lint` — verify no ESLint warnings

---

### 6.10 Testing & Verification

```bash
# 1. Build check (must pass with zero errors)
cd frontend && npm run build

# 2. Lint check
cd frontend && npm run lint

# 3. Dev server visual checks
cd frontend && npm run dev
# Then manually verify in browser:
#   - http://localhost:5173/tv        → background should parallax on scroll
#   - http://localhost:5173/contact   → background should parallax on scroll
#   - http://localhost:5173/blog      → verify existing parallax still works
#   - http://localhost:5173/results   → verify existing parallax still works
#   - http://localhost:5173/news      → verify existing parallax still works

# 4. Performance checks in DevTools:
#   - Open Chrome DevTools → Performance tab
#   - Record a scroll session on /tv
#   - Verify: no layout shifts, paint events should show "composited layer"
#   - Layers panel: background div should be on its own layer (willChange: transform)

# 5. Reduced motion check:
#   - Chrome DevTools → Rendering → "Emulate prefers-reduced-motion: reduce"
#   - Verify: background images still appear but don't move on scroll

# 6. Lazy loading check (TVPage with ParallaxHero):
#   - Open Network tab, reload /tv
#   - The Unsplash image should load shortly after page load (200px rootMargin)
#   - On fast connections it loads almost immediately; on throttled connections the delay is visible
```

---

### 6.11 Summary of Visual Changes

| Page | Before | After |
|------|--------|-------|
| TVPage | Static `background-attachment: fixed` image | Smooth parallax scroll (-120px over 1500px), lazy loaded, GPU composited |
| ContactPage | Static `position: absolute` image, no movement | Smooth parallax scroll (-80px over 800px), GPU composited |
| BlogPage | Parallax works, no GPU hint | Same parallax + `willChange: transform` |
| ResultsPage | Parallax works, no GPU hint | Same parallax + `willChange: transform` |
| NewsPage | Parallax works, no GPU hint | Same parallax + `willChange: transform` |

---
---

## TASK 7: Deployment

### Complexity: Low (~1–2 hours)

### 7.0 Prerequisites

- All Tasks 1–6 changes are complete and verified
- Frontend builds successfully (`npm run build` exits 0)
- Lint passes (`npm run lint` exits 0 — or only pre-existing warnings)
- No secrets or `.env` files staged

### 7.1 Files Involved

| # | File (full path) | Purpose |
|---|---|---|
| 1 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\vercel.json` (root) | Vercel deploy config — **no changes needed** |
| 2 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\frontend\vercel.json` | Frontend Vercel config — **no changes needed** |
| 3 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\render.yaml` | Render backend config — **no changes needed** |
| 4 | `c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU\.gitignore` | Verify no sensitive files staged — **no changes needed** |

**No files need modification for deployment.** The existing configs are correct. This task is purely procedural.

---

### 7.2 Step 1 — Pre-Deployment Build Verification

```bash
# Navigate to project root
cd "c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU"

# Step 1a: Clean install + build (mirrors what Vercel will do)
cd frontend && npm install && npm run build

# Expected: "✓ built in X.XXs" with zero errors
# The output directory is frontend/dist/
# Verify dist exists and has index.html:
ls frontend/dist/index.html

# Step 1b: Lint check
cd frontend && npm run lint

# Expected: exits 0 (some pre-existing warnings are OK, zero errors)

# Step 1c: Run tests (if any exist)
cd frontend && npm run test

# Expected: test suite passes (or "no test files found" if no tests written yet)
```

---

### 7.3 Step 2 — Pre-Commit Safety Checks

```bash
cd "c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU"

# 2a: Check git status — review all changed/new files
git --no-pager status

# 2b: Review the diff to ensure no secrets, no .env content, no accidental deletions
git --no-pager diff --stat

# 2c: Verify .gitignore covers sensitive files
# These MUST NOT appear in git status output:
#   - .env, .env.local, .env.production (only .env.example is safe)
#   - node_modules/
#   - dist/, build/
#   - Any file with API keys or tokens

# 2d: Check that .env files are not staged
git --no-pager diff --cached --name-only | findstr ".env"
# Expected: no output (no .env files staged)
```

---

### 7.4 Step 3 — Git Stage, Commit, and Push

```bash
cd "c:\Users\MR.ROBOT\OneDrive - Park University\Desktop\ISHU"

# 3a: Stage all changes
git add -A

# 3b: Review what's staged one final time
git --no-pager diff --cached --stat

# 3c: Commit with descriptive message
git commit -m "feat: enhance parallax backgrounds, add ParallaxHero component, optimize GPU compositing

- Create reusable ParallaxHero component with lazy loading + reduced-motion support
- Add parallax scrolling to TVPage and ContactPage hero backgrounds
- Add will-change: transform GPU hints to BlogPage, ResultsPage, NewsPage backgrounds
- Standardize Unsplash image widths to w=1920 across all pages
- Use react-intersection-observer for lazy image loading in ParallaxHero

Tasks 6-7: Background Images & Parallax + Deployment

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# 3d: Push to main branch
git push origin main
```

**Important:** The push to `main` triggers Vercel auto-deployment. No manual Vercel action needed.

---

### 7.5 Step 4 — Monitor Vercel Deployment

```bash
# 4a: After push, Vercel auto-deploys. Monitor via:
#   - Visit https://vercel.com/dashboard (or the project-specific URL)
#   - Or check the GitHub commit — Vercel bot adds a deployment status check

# 4b: Wait for deployment to complete (typically 1-3 minutes)
#   - Build command: cd frontend && npm install && npm run build
#   - Output directory: frontend/dist

# 4c: Verify the live site loads
# Open in browser: https://ishu.fun
# Check the following pages load without errors:
#   - https://ishu.fun/           (HomePage)
#   - https://ishu.fun/tv         (TVPage — verify parallax)
#   - https://ishu.fun/contact    (ContactPage — verify parallax)
#   - https://ishu.fun/blog       (BlogPage)
#   - https://ishu.fun/results    (ResultsPage)
#   - https://ishu.fun/news       (NewsPage)
```

---

### 7.6 Step 5 — Backend Health Verification

```bash
# 5a: Wake the Render backend (free tier sleeps after inactivity)
curl -s https://ishu-site.onrender.com/api/wake
# Expected: {"status":"awake"} or similar 200 response

# 5b: Check health endpoint
curl -s https://ishu-site.onrender.com/api/health
# Expected: 200 OK with health status JSON

# 5c: If backend is sleeping, wait 30-60 seconds for cold start, then retry
# Free-tier Render spins down after 15 min inactivity — first request takes ~30s
```

---

### 7.7 Step 6 — Environment Variable Verification

```bash
# 6a: Verify frontend env vars are set in Vercel dashboard
# Required variables (check in Vercel → Project Settings → Environment Variables):
#   - VITE_CLERK_PUBLISHABLE_KEY   (Clerk auth)
#   - VITE_API_URL                 (should be https://ishu-site.onrender.com)
#   - VITE_SUPABASE_URL            (Supabase project URL)
#   - VITE_SUPABASE_ANON_KEY       (Supabase anonymous key)

# 6b: Verify by checking the live site's network requests:
#   - Open https://ishu.fun in Chrome
#   - DevTools → Network tab
#   - Filter by "onrender.com" — should see API requests going to the backend
#   - Filter by "supabase" — should see Supabase requests

# 6c: Verify Clerk auth works:
#   - Click Sign In on the live site
#   - Clerk modal should appear (not a 404 or blank page)
```

---

### 7.8 Step 7 — Post-Deployment Performance Checks

```bash
# 7a: Lighthouse audit (use Chrome DevTools → Lighthouse tab)
#   - Run on https://ishu.fun/ (mobile preset)
#   - Target scores:
#     - Performance: > 80
#     - Accessibility: > 90
#     - Best Practices: > 90
#     - SEO: > 90

# 7b: Check Core Web Vitals via PageSpeed Insights
#   - Visit: https://pagespeed.web.dev/
#   - Enter: https://ishu.fun
#   - Verify: LCP < 2.5s, FID < 100ms, CLS < 0.1

# 7c: Check SPA routing works (Vercel rewrite rule)
#   - Direct-navigate to https://ishu.fun/tv (should load, NOT 404)
#   - Direct-navigate to https://ishu.fun/contact (should load, NOT 404)
#   - Direct-navigate to https://ishu.fun/blog (should load, NOT 404)

# 7d: Check caching headers
curl -sI https://ishu.fun/assets/index-abc123.js | findstr "Cache-Control"
# Expected: Cache-Control: public, max-age=31536000, immutable

# 7e: Check security headers
curl -sI https://ishu.fun/ | findstr "X-Content-Type-Options X-Frame-Options X-XSS-Protection"
# Expected:
#   X-Content-Type-Options: nosniff
#   X-Frame-Options: SAMEORIGIN
#   X-XSS-Protection: 1; mode=block
```

---

### 7.9 Step 8 — Rollback Plan (If Issues Found)

```bash
# If the deployment has critical issues:

# Option A: Revert in Vercel dashboard
#   - Go to Vercel → Deployments
#   - Find the previous working deployment
#   - Click "..." → "Promote to Production"

# Option B: Git revert
git revert HEAD --no-edit
git push origin main
# This creates a new commit undoing the changes and triggers a new deployment

# Option C: Specific file rollback
git checkout HEAD~1 -- frontend/src/pages/TVPage.tsx
git commit -m "fix: revert TVPage parallax changes"
git push origin main
```

---

### 7.10 Implementation Order

1. **Build verification** (Step 1) — confirm everything compiles
2. **Safety checks** (Step 2) — no secrets, no accidental deletions
3. **Git commit + push** (Step 3) — triggers auto-deploy
4. **Monitor Vercel** (Step 4) — wait for green deployment
5. **Backend health** (Step 5) — wake Render, verify API
6. **Env vars** (Step 6) — confirm all 4 frontend vars set
7. **Performance** (Step 7) — Lighthouse, CWV, headers
8. **Rollback prep** (Step 8) — know the escape plan before you need it

---

### 7.11 Post-Deployment Checklist

| # | Check | Expected | Status |
|---|-------|----------|--------|
| 1 | `npm run build` exits 0 | ✓ Built in <30s | ☐ |
| 2 | `npm run lint` exits 0 | ✓ No errors | ☐ |
| 3 | `git push origin main` succeeds | ✓ Pushed | ☐ |
| 4 | Vercel deployment completes | ✓ Green status | ☐ |
| 5 | https://ishu.fun loads | ✓ No console errors | ☐ |
| 6 | /tv parallax works | ✓ Background moves on scroll | ☐ |
| 7 | /contact parallax works | ✓ Background moves on scroll | ☐ |
| 8 | /blog parallax works | ✓ Existing behavior preserved | ☐ |
| 9 | /results parallax works | ✓ Existing behavior preserved | ☐ |
| 10 | /news parallax works | ✓ Existing behavior preserved | ☐ |
| 11 | Backend health check | ✓ /api/health returns 200 | ☐ |
| 12 | SPA routing (direct URL) | ✓ No 404 on direct nav | ☐ |
| 13 | Cache headers on /assets/* | ✓ max-age=31536000 | ☐ |
| 14 | Security headers present | ✓ nosniff, SAMEORIGIN, etc. | ☐ |
| 15 | Clerk sign-in modal | ✓ Opens correctly | ☐ |
| 16 | Reduced-motion preference | ✓ Parallax disabled, images shown | ☐ |
| 17 | Lighthouse Performance > 80 | ✓ Score check | ☐ |

---

*End of Tasks 6–7 Implementation Plan*
