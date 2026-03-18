# ISHU Platform - Testing Guide

**Purpose:** Verify all features work correctly before final deployment

---

## 🎯 Quick Test (15 minutes)

### 1. Video Downloaders (5 min)
```
1. Go to https://ishu.fun/tools/youtube-downloader
2. Paste: https://www.youtube.com/watch?v=dQw4w9WgXcQ
3. Wait for backend to wake up (30-60s if cold)
4. Click "Fetch" → Should show video info
5. Select quality → Click "Download"
6. Verify download starts

Repeat for:
- Terabox downloader (use any Terabox link)
- Universal downloader (use Instagram/TikTok link)
```

### 2. TV Page (5 min)
```
1. Go to https://ishu.fun/tv
2. Select "Hindi" language
3. Click any News channel (e.g., "Aaj Tak")
4. Wait for stream to load (2-10s)
5. Verify video plays
6. Try 3-5 more channels
7. Test search: type "news"
8. Test category filter: click "Entertainment"
```

### 3. Performance (5 min)
```
1. Open Chrome DevTools → Performance tab
2. Scroll through home page
3. Check FPS (should be 60+)
4. Test on mobile (Chrome DevTools → Device toolbar)
5. Check responsive design at different sizes
```

---

## 🔍 Detailed Test (1 hour)

### Backend Wake-Up Test (10 min)
**Goal:** Verify backend cold start handling

```
1. Wait 15+ minutes (backend goes to sleep)
2. Go to YouTube downloader
3. Paste URL and click "Fetch"
4. Observe BackendStatusBar:
   - Should show "Connecting to server..."
   - Then "Server is waking up... (Xs elapsed)"
   - Progress bar should animate
   - After 30-60s: "Server connected!"
5. Verify video info loads after wake-up
6. Test download works
```

**Expected Behavior:**
- First request after sleep: 30-60s wait
- Clear progress indication
- No generic "Network error"
- Automatic retry on failure

**If It Fails:**
- Check Render dashboard (backend running?)
- Check browser console for errors
- Try manual "Retry" button
- Check CORS settings

---

### Video Downloaders Full Test (20 min)

#### YouTube Downloader
```
Test URLs:
1. Regular video: https://www.youtube.com/watch?v=dQw4w9WgXcQ
2. Short video: https://www.youtube.com/shorts/xyz
3. Long video (>1 hour): Any documentary

For each:
- Paste URL → Click "Fetch"
- Verify video info (title, thumbnail, channel, duration)
- Test preview (click "Watch Preview")
- Select different qualities (360p, 720p, 1080p)
- Click "Download"
- Verify download starts
- Check file size is reasonable
```

#### Terabox Downloader
```
Test URLs:
1. Any Terabox share link
2. Video file
3. Document file

For each:
- Paste URL → Click "Fetch"
- Verify file info (name, size, thumbnail)
- Test preview (if video)
- Click "Download"
- Verify download starts
```

#### Universal Downloader
```
Test URLs:
1. Instagram: https://www.instagram.com/p/xyz
2. TikTok: https://www.tiktok.com/@user/video/xyz
3. Twitter: https://twitter.com/user/status/xyz
4. Facebook: https://www.facebook.com/watch?v=xyz

For each:
- Paste URL → Select quality
- Click "Download"
- Verify platform detection (icon + name)
- Verify download starts
```

**Common Issues:**
- "Network error" → Backend is waking up, wait 30-60s
- "Failed to fetch" → Check internet connection
- "Invalid URL" → Check URL format
- "Download failed" → Video may be private/deleted

---

### TV Page Full Test (20 min)

#### Language Selection
```
1. Go to /tv
2. Test each language:
   - Hindi (should have 200+ channels)
   - Tamil (should have 50+ channels)
   - Telugu (should have 50+ channels)
   - Bengali (should have 30+ channels)
   - English (should have 100+ channels)
3. Verify channels load
4. Verify category grouping works
```

#### Channel Playback
```
For each language, test 5-10 channels:
1. Click channel card
2. Wait for stream to load (2-10s)
3. Verify video plays
4. Check quality indicator
5. Test controls:
   - Play/Pause (spacebar)
   - Mute (M key)
   - Fullscreen (F key)
   - Volume (arrow keys)
   - Quality selector
6. Test auto-skip (if stream fails)
```

#### Search & Filters
```
1. Test search:
   - Type "news" → Should show news channels
   - Type "star" → Should show Star channels
   - Type "zee" → Should show Zee channels
2. Test category filter:
   - Click "News" → Only news channels
   - Click "Entertainment" → Only entertainment
   - Click "Movies" → Only movie channels
3. Test favorites:
   - Click star icon on channel
   - Click "Favorites" category
   - Verify favorited channels appear
```

#### Performance
```
1. Scroll through channel list
   - Should be smooth (60fps)
   - No lag or stuttering
2. Test virtual scrolling
   - Scroll to bottom (should load more)
   - Scroll back to top (should unload)
3. Test on mobile
   - Responsive layout
   - Touch controls work
   - No horizontal scroll
```

**Common Issues:**
- Channel doesn't play → Try next channel (some streams go offline)
- Slow loading → Check network speed
- Auto-skip countdown → Normal behavior for failed streams
- "No channels found" → Check language selection

---

### Performance Test (10 min)

#### Desktop (Chrome DevTools)
```
1. Open DevTools → Performance tab
2. Start recording
3. Scroll through home page
4. Stop recording
5. Check:
   - FPS (should be 60+)
   - Main thread activity (should be low)
   - Layout shifts (should be minimal)
6. Run Lighthouse audit:
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+
```

#### Mobile (Chrome DevTools)
```
1. Enable Device toolbar (Ctrl+Shift+M)
2. Select device (iPhone 12, Galaxy S21, etc.)
3. Test:
   - Responsive layout
   - Touch interactions
   - Scroll performance
   - Button sizes (44px min)
4. Test on real device if possible
```

#### Network Throttling
```
1. DevTools → Network tab
2. Select "Slow 3G"
3. Test:
   - Page loads
   - Images load
   - Videos load
   - No timeouts
```

---

### SEO Test (10 min)

#### Meta Tags
```
1. View page source (Ctrl+U)
2. Check for:
   - <title> tag (unique per page)
   - <meta name="description"> (160 chars)
   - <meta name="keywords">
   - <link rel="canonical">
   - Open Graph tags (og:title, og:description, og:image)
   - Twitter Card tags
3. Verify on each page:
   - Home
   - Tools
   - TV
   - YouTube Downloader
   - About
```

#### Structured Data
```
1. Go to https://search.google.com/test/rich-results
2. Enter page URL
3. Verify structured data:
   - Organization
   - WebSite
   - Breadcrumb
   - VideoObject (for video pages)
   - SoftwareApplication (for tool pages)
4. Fix any errors
```

#### Social Sharing
```
1. Facebook Sharing Debugger:
   https://developers.facebook.com/tools/debug/
2. Twitter Card Validator:
   https://cards-dev.twitter.com/validator
3. LinkedIn Post Inspector:
   https://www.linkedin.com/post-inspector/
4. Verify:
   - Title appears correctly
   - Description appears correctly
   - Image appears correctly (1200x630px)
```

---

## 🐛 Bug Reporting Template

If you find a bug, report it with this format:

```
**Bug Title:** [Short description]

**Page:** [URL where bug occurs]

**Steps to Reproduce:**
1. Go to [page]
2. Click [button]
3. See error

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots:**
[Attach screenshots]

**Browser:** [Chrome 120, Firefox 121, etc.]
**Device:** [Desktop, Mobile, Tablet]
**OS:** [Windows 11, macOS 14, Android 13, iOS 17]

**Console Errors:**
[Copy any errors from browser console]

**Network Errors:**
[Copy any failed requests from Network tab]
```

---

## ✅ Test Results Checklist

### Video Downloaders
- [ ] YouTube downloader works
- [ ] Terabox downloader works
- [ ] Universal downloader works
- [ ] Backend wake-up works correctly
- [ ] Error messages are clear
- [ ] Downloads complete successfully
- [ ] Preview works
- [ ] Quality selection works

### TV Page
- [ ] Language selection works
- [ ] Category filtering works
- [ ] Search works
- [ ] Channel playback works
- [ ] Auto-skip works
- [ ] Quality selector works
- [ ] Favorites work
- [ ] Responsive on mobile
- [ ] Smooth scrolling (60fps+)

### Performance
- [ ] Home page loads fast (<3s)
- [ ] Smooth scrolling (60fps+)
- [ ] No layout shifts
- [ ] Works on mobile
- [ ] Works on slow networks
- [ ] Lighthouse score 90+

### SEO
- [ ] Meta tags present on all pages
- [ ] Structured data valid
- [ ] Social sharing works
- [ ] Sitemap exists
- [ ] Robots.txt exists

### Responsive Design
- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] Works on large screens (1920px+)
- [ ] Works on 4K (3840px+)
- [ ] No horizontal scroll
- [ ] Touch targets 44px+

---

## 🚀 Ready for Production?

**All tests passed?** ✅  
**No critical bugs?** ✅  
**Performance good?** ✅  
**SEO optimized?** ✅  
**Responsive?** ✅  

**→ DEPLOY TO PRODUCTION! 🎉**

---

## 📞 Need Help?

**Backend Issues:**
- Check Render dashboard: https://dashboard.render.com
- Check backend logs
- Verify environment variables

**Frontend Issues:**
- Check Vercel dashboard: https://vercel.com/dashboard
- Check browser console
- Check Network tab

**General Issues:**
- Check GitHub issues
- Check documentation
- Contact support

---

**Last Updated:** March 18, 2026
