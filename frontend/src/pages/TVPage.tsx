/**
 * TVPage.tsx - Live Indian TV (API-powered, Multi-URL Fallback)
 *
 * Architecture:
 * 1. Fetch channels.json → filter country="IN" → get channel metadata + categories
 * 2. Fetch streams.json → group by channel ID → build URL fallback map
 * 3. Each channel can have 1-5 stream URLs sorted by quality
 * 4. Player tries URL1, if fails → URL2 → URL3 → auto-skip to next channel
 * 5. Streams with user_agent/referrer headers are handled via HLS config
 * 6. M3U playlists used as additional fallback source
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import ParticleField from "@/components/animations/ParticleField";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tv, Search, X, Play, Loader2, Radio, Film, Music, Newspaper, Baby,
  BookOpen, Heart, Dumbbell, Globe, Laugh, Church, Utensils,
  Landmark, MonitorPlay, Volume2, VolumeX, Maximize, Minimize, ChevronLeft,
  AlertCircle, Star, Zap, Signal, PictureInPicture2, RotateCcw,
  SkipForward, Sparkles, Wifi, WifiOff, Languages,
  Grid3X3, List, TimerReset, RefreshCw, Check,
  Settings2, ChevronDown, Gauge,
} from "lucide-react";
import Hls from "hls.js";
import Fuse from "fuse.js";
import Tilt from "react-parallax-tilt";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════ TYPES ═══════════════════ */
interface ApiChannel {
  id: string;
  name: string;
  alt_names: string[];
  network: string | null;
  country: string;
  categories: string[];
  is_nsfw: boolean;
  closed: string | null;
  replaced_by: string | null;
}

interface ApiStream {
  channel: string | null;
  url: string;
  quality: string | null;
  user_agent: string | null;
  referrer: string | null;
}

interface StreamUrl {
  url: string;
  quality: string | null;
  userAgent: string | null;
  referrer: string | null;
}

interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  categoryLabel: string;
  language: string;
  group: string;
  streams: StreamUrl[];
}

/* ═══════════════════ CATEGORY CONFIG ═══════════════════ */
const CAT_META: Record<string, { label: string; icon: typeof Tv; gradient: string }> = {
  news:          { label: "News",          icon: Newspaper,   gradient: "from-red-500 to-orange-500" },
  entertainment: { label: "Entertainment", icon: MonitorPlay,  gradient: "from-purple-500 to-pink-500" },
  movies:        { label: "Movies",        icon: Film,         gradient: "from-amber-500 to-yellow-500" },
  music:         { label: "Music",         icon: Music,        gradient: "from-green-500 to-emerald-500" },
  kids:          { label: "Kids",          icon: Baby,         gradient: "from-cyan-400 to-blue-400" },
  animation:     { label: "Cartoon",       icon: Baby,         gradient: "from-sky-400 to-indigo-400" },
  sports:        { label: "Sports",        icon: Dumbbell,     gradient: "from-orange-500 to-red-500" },
  religious:     { label: "Religious",     icon: Church,       gradient: "from-yellow-500 to-amber-600" },
  education:     { label: "Education",     icon: BookOpen,     gradient: "from-blue-500 to-indigo-500" },
  documentary:   { label: "Documentary",   icon: BookOpen,     gradient: "from-teal-500 to-cyan-500" },
  lifestyle:     { label: "Lifestyle",     icon: Heart,        gradient: "from-pink-400 to-rose-500" },
  comedy:        { label: "Comedy",        icon: Laugh,        gradient: "from-yellow-400 to-orange-400" },
  cooking:       { label: "Cooking",       icon: Utensils,     gradient: "from-orange-400 to-red-400" },
  business:      { label: "Business",      icon: Landmark,     gradient: "from-slate-500 to-zinc-500" },
  general:       { label: "General",       icon: Globe,        gradient: "from-indigo-500 to-purple-500" },
  family:        { label: "Family",        icon: Heart,        gradient: "from-rose-400 to-pink-500" },
  science:       { label: "Science",       icon: BookOpen,     gradient: "from-emerald-500 to-teal-500" },
  classic:       { label: "Classic",       icon: Film,         gradient: "from-stone-500 to-zinc-400" },
  series:        { label: "Series",        icon: MonitorPlay,  gradient: "from-violet-500 to-fuchsia-500" },
  shop:          { label: "Shopping",      icon: Landmark,     gradient: "from-green-600 to-emerald-600" },
  travel:        { label: "Travel",        icon: Globe,        gradient: "from-sky-500 to-blue-500" },
  culture:       { label: "Culture",       icon: Globe,        gradient: "from-amber-600 to-orange-600" },
};

const ALL_CAT = "all";
const FAV_CAT = "favorites";

// Quality sort priority (higher = better)
const Q_ORDER: Record<string, number> = { "1080p": 4, "720p": 3, "576p": 2, "480p": 1 };

/* ═══════════════════ M3U PARSER (fallback) ═══════════════════ */
function parseM3U(text: string, defaultLang: string): { name: string; logo: string; group: string; url: string; language: string }[] {
  const lines = text.split("\n");
  const out: { name: string; logo: string; group: string; url: string; language: string }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith("#EXTINF")) continue;
    const nameM = line.match(/,(.+)$/);
    const logoM = line.match(/tvg-logo="([^"]*)"/);
    const groupM = line.match(/group-title="([^"]*)"/);
    const langM = line.match(/tvg-language="([^"]*)"/);
    const idM = line.match(/tvg-id="([^"]*)"/);
    let url = "";
    for (let j = i + 1; j < lines.length; j++) {
      const n = lines[j].trim();
      if (!n || n.startsWith("#EXTINF")) break;
      if (n.startsWith("#")) continue;
      url = n;
      break;
    }
    if (url && nameM) {
      out.push({
        name: nameM[1].trim(),
        logo: logoM?.[1] || "",
        group: groupM?.[1] || "General",
        url,
        language: langM?.[1]?.split(";")[0] || defaultLang,
      });
    }
  }
  return out;
}

/* ═══════════════════ DATA FETCHING ═══════════════════ */
async function fetchAllChannels(
  signal: AbortSignal,
  onProgress: (pct: number, msg: string) => void,
): Promise<Channel[]> {

  onProgress(5, "Fetching channel database...");

  // 1) Fetch channels.json + streams.json in parallel
  const [chRes, stRes] = await Promise.all([
    fetch("https://iptv-org.github.io/api/channels.json", { signal }),
    fetch("https://iptv-org.github.io/api/streams.json", { signal }),
  ]);

  if (!chRes.ok || !stRes.ok) throw new Error("Failed to fetch channel database");

  onProgress(30, "Parsing channel data...");
  const allChannels: ApiChannel[] = await chRes.json();
  onProgress(50, "Parsing stream URLs...");
  const allStreams: ApiStream[] = await stRes.json();

  onProgress(65, "Mapping Indian channels...");

  // 2) Filter Indian channels (not closed, not NSFW)
  const indianChannels = allChannels.filter(
    (c) => c.country === "IN" && !c.closed && !c.is_nsfw,
  );

  // 3) Build stream map: channelId → StreamUrl[]
  const streamMap = new Map<string, StreamUrl[]>();
  for (const s of allStreams) {
    if (!s.channel || !s.url) continue;
    if (!streamMap.has(s.channel)) streamMap.set(s.channel, []);
    streamMap.get(s.channel)!.push({
      url: s.url,
      quality: s.quality,
      userAgent: s.user_agent,
      referrer: s.referrer,
    });
  }

  // Sort each channel's streams by quality (best first)
  for (const [, urls] of streamMap) {
    urls.sort((a, b) => (Q_ORDER[b.quality || ""] || 0) - (Q_ORDER[a.quality || ""] || 0));
  }

  onProgress(75, "Fetching additional sources...");

  // 4) Also fetch M3U for extra channels + logos
  const m3uSources = [
    { url: "https://iptv-org.github.io/iptv/countries/in.m3u", lang: "Mixed" },
    { url: "https://iptv-org.github.io/iptv/languages/hin.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/tam.m3u", lang: "Tamil" },
    { url: "https://iptv-org.github.io/iptv/languages/tel.m3u", lang: "Telugu" },
    { url: "https://iptv-org.github.io/iptv/languages/ben.m3u", lang: "Bengali" },
    { url: "https://iptv-org.github.io/iptv/languages/mal.m3u", lang: "Malayalam" },
    { url: "https://iptv-org.github.io/iptv/languages/kan.m3u", lang: "Kannada" },
    { url: "https://iptv-org.github.io/iptv/languages/mar.m3u", lang: "Marathi" },
    { url: "https://iptv-org.github.io/iptv/languages/pan.m3u", lang: "Punjabi" },
    { url: "https://iptv-org.github.io/iptv/languages/guj.m3u", lang: "Gujarati" },
    { url: "https://iptv-org.github.io/iptv/languages/urd.m3u", lang: "Urdu" },
  ];

  // Fetch M3Us in parallel (don't wait too long, these are supplementary)
  const m3uResults = await Promise.allSettled(
    m3uSources.map(async (src) => {
      try {
        const r = await fetch(src.url, { signal });
        if (!r.ok) return [];
        return parseM3U(await r.text(), src.lang);
      } catch { return []; }
    }),
  );

  // Build logo + language map from M3U data
  const logoMap = new Map<string, string>();
  const langMap = new Map<string, string>();
  const extraStreams = new Map<string, StreamUrl[]>();

  for (const r of m3uResults) {
    if (r.status !== "fulfilled") continue;
    for (const ch of r.value) {
      const key = ch.name.toLowerCase().replace(/\s*\([\d]+p\)\s*/g, "").trim();
      if (ch.logo) logoMap.set(key, ch.logo);
      if (ch.language && ch.language !== "Mixed") langMap.set(key, ch.language);
      // Add as extra stream URLs
      if (!extraStreams.has(key)) extraStreams.set(key, []);
      extraStreams.get(key)!.push({ url: ch.url, quality: null, userAgent: null, referrer: null });
    }
  }

  onProgress(90, "Building channel list...");

  // 5) Build final channels
  const result: Channel[] = [];
  const seenNames = new Set<string>();

  for (const ch of indianChannels) {
    const streams = streamMap.get(ch.id) || [];
    const nameKey = ch.name.toLowerCase().trim();

    // Also add M3U extra streams as fallbacks
    const extras = extraStreams.get(nameKey);
    if (extras) {
      for (const e of extras) {
        if (!streams.some((s) => s.url === e.url)) streams.push(e);
      }
    }

    if (streams.length === 0) continue; // No streams = skip
    if (seenNames.has(nameKey)) continue;
    seenNames.add(nameKey);

    const primaryCat = ch.categories[0] || "general";
    const catMeta = CAT_META[primaryCat];

    result.push({
      id: ch.id,
      name: ch.name,
      logo: logoMap.get(nameKey) || `https://raw.githubusercontent.com/nicep64/iptv-logo/master/logodata/${encodeURIComponent(ch.name)}.png`,
      category: primaryCat,
      categoryLabel: catMeta?.label || primaryCat.charAt(0).toUpperCase() + primaryCat.slice(1),
      language: langMap.get(nameKey) || "Hindi",
      group: catMeta?.label || "General",
      streams,
    });
  }

  // 6) Add M3U-only channels (not in API) as extras
  for (const r of m3uResults) {
    if (r.status !== "fulfilled") continue;
    for (const ch of r.value) {
      const nameKey = ch.name.toLowerCase().replace(/\s*\([\d]+p\)\s*/g, "").trim();
      if (seenNames.has(nameKey)) continue;
      seenNames.add(nameKey);
      const groupLower = ch.group.toLowerCase();
      let cat = "entertainment";
      for (const [key, meta] of Object.entries(CAT_META)) {
        if (groupLower.includes(key)) { cat = key; break; }
      }
      result.push({
        id: `m3u_${nameKey}`,
        name: ch.name,
        logo: ch.logo,
        category: cat,
        categoryLabel: CAT_META[cat]?.label || ch.group,
        language: ch.language,
        group: ch.group,
        streams: [{ url: ch.url, quality: null, userAgent: null, referrer: null }],
      });
    }
  }

  onProgress(100, `Loaded ${result.length} channels`);
  return result;
}

/* ═══════════════════ ROBUST HLS PLAYER HOOK ═══════════════════
   Multi-URL cascade + quality level control.
   - tries each stream URL for a channel
   - Per URL: 3-stage HLS recovery (recoverMedia → swapCodec → reload)
   - Stall detection: auto-retries if video freezes 12s
   - Auto-skip: moves to next channel after all URLs exhausted
   - Exposes hlsLevels for manual quality switching
   - Auto quality by default, manual override available
   ═══════════════════════════════════════════════════════════════ */
interface QualityLevel {
  index: number;
  height: number;
  width: number;
  bitrate: number;
  label: string;
}

function useRobustPlayer(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  streams: StreamUrl[] | null,
  onAutoSkip: () => void,
) {
  const hlsRef = useRef<Hls | null>(null);
  const urlIdxRef = useRef(0);
  const retryRef = useRef(0);
  const stallRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "switching" | "error">("idle");
  const [quality, setQuality] = useState("");
  const [urlAttempt, setUrlAttempt] = useState(0);
  const [totalUrls, setTotalUrls] = useState(0);
  const [skipIn, setSkipIn] = useState(0);
  const [hlsLevels, setHlsLevels] = useState<QualityLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 = auto
  const [isAutoQuality, setIsAutoQuality] = useState(true);

  const cleanup = useCallback(() => {
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    if (stallRef.current) { clearTimeout(stallRef.current); stallRef.current = null; }
    if (skipRef.current) { clearInterval(skipRef.current); skipRef.current = null; }
    setSkipIn(0);
    setHlsLevels([]);
    setCurrentLevel(-1);
    setIsAutoQuality(true);
  }, []);

  const startSkipCountdown = useCallback(() => {
    if (skipRef.current) return;
    let c = 6;
    setSkipIn(c);
    skipRef.current = setInterval(() => {
      c--;
      setSkipIn(c);
      if (c <= 0) {
        if (skipRef.current) clearInterval(skipRef.current);
        skipRef.current = null;
        onAutoSkip();
      }
    }, 1000);
  }, [onAutoSkip]);

  const cancelSkip = useCallback(() => {
    if (skipRef.current) { clearInterval(skipRef.current); skipRef.current = null; }
    setSkipIn(0);
  }, []);

  // Quality level switching
  const setQualityLevel = useCallback((levelIdx: number) => {
    if (!hlsRef.current) return;
    if (levelIdx === -1) {
      hlsRef.current.currentLevel = -1; // auto
      setIsAutoQuality(true);
      setCurrentLevel(-1);
    } else {
      hlsRef.current.currentLevel = levelIdx;
      setIsAutoQuality(false);
      setCurrentLevel(levelIdx);
    }
  }, []);

  const tryUrl = useCallback((urlList: StreamUrl[], idx: number) => {
    cleanup();
    const video = videoRef.current;
    if (!video || idx >= urlList.length) {
      setState("error");
      startSkipCountdown();
      return;
    }

    const s = urlList[idx];
    urlIdxRef.current = idx;
    retryRef.current = 0;
    setUrlAttempt(idx + 1);
    setState(idx === 0 ? "loading" : "switching");
    setQuality(s.quality || "");

    // Stall detection
    const onTimeUpdate = () => {
      if (stallRef.current) clearTimeout(stallRef.current);
      stallRef.current = setTimeout(() => {
        tryUrl(urlList, idx + 1);
      }, 12000);
    };
    video.addEventListener("timeupdate", onTimeUpdate);

    if (video.canPlayType("application/vnd.apple.mpegurl") && !s.userAgent && !s.referrer) {
      video.src = s.url;
      video.addEventListener("loadeddata", () => setState("playing"), { once: true });
      video.addEventListener("error", () => tryUrl(urlList, idx + 1), { once: true });
      video.play().catch(() => {});
      return;
    }

    if (!Hls.isSupported()) { tryUrl(urlList, idx + 1); return; }

    const hlsConfig: Partial<any> = {
      enableWorker: true,
      lowLatencyMode: true,
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      startLevel: -1,
      fragLoadingMaxRetry: 4,
      fragLoadingRetryDelay: 1000,
      fragLoadingMaxRetryTimeout: 8000,
      manifestLoadingMaxRetry: 3,
      manifestLoadingRetryDelay: 1000,
      manifestLoadingMaxRetryTimeout: 10000,
      levelLoadingMaxRetry: 3,
      levelLoadingRetryDelay: 1000,
      levelLoadingMaxRetryTimeout: 10000,
    };

    if (s.userAgent || s.referrer) {
      hlsConfig.xhrSetup = (xhr: XMLHttpRequest) => {
        if (s.referrer) {
          try { xhr.setRequestHeader("Referer", s.referrer); } catch {}
        }
      };
    }

    const hls = new Hls(hlsConfig);
    hlsRef.current = hls;
    hls.loadSource(s.url);
    hls.attachMedia(video);

    const loadTimeout = setTimeout(() => {
      if (hlsRef.current === hls) {
        hls.destroy();
        hlsRef.current = null;
        tryUrl(urlList, idx + 1);
      }
    }, 15000);

    hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
      clearTimeout(loadTimeout);
      setState("playing");
      retryRef.current = 0;

      // Extract quality levels for the selector
      if (data.levels.length > 0) {
        const levels: QualityLevel[] = data.levels.map((lvl, i) => ({
          index: i,
          height: lvl.height || 0,
          width: lvl.width || 0,
          bitrate: lvl.bitrate || 0,
          label: lvl.height ? `${lvl.height}p` : `${Math.round((lvl.bitrate || 0) / 1000)}kbps`,
        }));
        setHlsLevels(levels);
        const best = data.levels[data.levels.length - 1];
        setQuality(best.height ? `${best.height}p` : s.quality || "");
      }
      video.play().catch(() => {});
    });

    // Track auto quality level changes
    hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => {
      const lvl = hls.levels[data.level];
      if (lvl) {
        setQuality(lvl.height ? `${lvl.height}p` : "");
        setCurrentLevel(data.level);
      }
    });

    hls.on(Hls.Events.ERROR, (_e, data) => {
      if (!data.fatal) return;
      if (data.type === Hls.ErrorTypes.MEDIA_ERROR && retryRef.current === 0) {
        retryRef.current++;
        hls.recoverMediaError();
        return;
      }
      if (data.type === Hls.ErrorTypes.MEDIA_ERROR && retryRef.current === 1) {
        retryRef.current++;
        hls.swapAudioCodec();
        hls.recoverMediaError();
        return;
      }
      clearTimeout(loadTimeout);
      hls.destroy();
      hlsRef.current = null;
      video.removeEventListener("timeupdate", onTimeUpdate);
      tryUrl(urlList, idx + 1);
    });
  }, [cleanup, startSkipCountdown, videoRef]);

  const retry = useCallback(() => {
    if (!streams || streams.length === 0) return;
    cancelSkip();
    tryUrl(streams, 0);
  }, [streams, tryUrl, cancelSkip]);

  useEffect(() => {
    if (!streams || streams.length === 0) { cleanup(); setState("idle"); return; }
    setTotalUrls(streams.length);
    tryUrl(streams, 0);
    return cleanup;
  }, [streams]);

  return { state, quality, urlAttempt, totalUrls, skipIn, retry, cancelSkip, hlsLevels, currentLevel, isAutoQuality, setQualityLevel };
}

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
const TVPage = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [fetchMsg, setFetchMsg] = useState("Initializing...");
  const [fetchError, setFetchError] = useState("");
  const [activeCat, setActiveCat] = useState(ALL_CAT);
  const [activeLang, setActiveLang] = useState("all");
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [playing, setPlaying] = useState<Channel | null>(null);
  const [muted, setMuted] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try { const s = localStorage.getItem("ishu_tv_favs"); return s ? new Set(JSON.parse(s)) : new Set<string>(); }
    catch { return new Set<string>(); }
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  /* ── Fuse.js search ── */
  const fuse = useMemo(() => new Fuse(channels, {
    keys: [{ name: "name", weight: 0.6 }, { name: "group", weight: 0.15 }, { name: "language", weight: 0.15 }, { name: "categoryLabel", weight: 0.1 }],
    threshold: 0.35, includeScore: true, minMatchCharLength: 1,
  }), [channels]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    return fuse.search(search).slice(0, 10).map((r) => r.item);
  }, [fuse, search]);

  /* ── filtered channels (sorted by reliability) ── */
  const filtered = useMemo(() => {
    let list = channels;
    if (activeCat === FAV_CAT) list = list.filter((c) => favorites.has(c.id));
    else if (activeCat !== ALL_CAT) list = list.filter((c) => c.category === activeCat);
    if (activeLang !== "all") list = list.filter((c) => c.language.toLowerCase() === activeLang.toLowerCase());
    if (search.trim()) { const ids = new Set(fuse.search(search).map((r) => r.item.id)); list = list.filter((c) => ids.has(c.id)); }
    // Sort: multi-stream channels first (more reliable), then alphabetical
    return [...list].sort((a, b) => {
      // Failed channels go last
      const aFailed = failedIds.has(a.id) ? 1 : 0;
      const bFailed = failedIds.has(b.id) ? 1 : 0;
      if (aFailed !== bFailed) return aFailed - bFailed;
      // More streams = more reliable = first
      if (b.streams.length !== a.streams.length) return b.streams.length - a.streams.length;
      // Alphabetical
      return a.name.localeCompare(b.name);
    });
  }, [channels, activeCat, activeLang, search, fuse, favorites, failedIds]);

  /* ── auto-skip ── */
  const playNext = useCallback(() => {
    if (!playing) return;
    setFailedIds((p) => new Set(p).add(playing.id));
    const idx = filtered.findIndex((c) => c.id === playing.id);
    for (let i = 1; i <= filtered.length; i++) {
      const next = filtered[(idx + i) % filtered.length];
      if (next && !failedIds.has(next.id) && next.id !== playing.id) { setPlaying(next); return; }
    }
    if (filtered.length > 1) setPlaying(filtered[(idx + 1) % filtered.length]);
  }, [playing, filtered, failedIds]);

  /* ── player ── */
  const playingStreams = useMemo(() => playing?.streams ?? null, [playing]);
  const { state: pState, quality, urlAttempt, totalUrls, skipIn, retry: pRetry, cancelSkip, hlsLevels, currentLevel, isAutoQuality, setQualityLevel } = useRobustPlayer(videoRef, playingStreams, playNext);
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  useEffect(() => {
    if (pState === "playing" && playing) setFailedIds((p) => { const n = new Set(p); n.delete(playing.id); return n; });
  }, [pState, playing]);

  /* ── fetch data ── */
  useEffect(() => {
    const ctrl = new AbortController();
    fetchAllChannels(ctrl.signal, (pct, msg) => { setFetchProgress(pct); setFetchMsg(msg); })
      .then((chs) => { setChannels(chs); setFetchLoading(false); })
      .catch((err) => { if (err.name !== "AbortError") { setFetchError(err.message); setFetchLoading(false); } });
    return () => ctrl.abort();
  }, []);

  /* ── GSAP ── */
  useEffect(() => {
    if (fetchLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".tv-stat", { y: 40, opacity: 0 }, { scrollTrigger: { trigger: statsRef.current, start: "top 85%" }, y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "back.out(1.7)" });
      gsap.fromTo(".tv-chip", { scale: 0.8, opacity: 0 }, { scrollTrigger: { trigger: ".tv-chips", start: "top 90%" }, scale: 1, opacity: 1, stagger: 0.04, duration: 0.4, ease: "back.out(2)" });
    });
    return () => ctx.revert();
  }, [fetchLoading]);

  /* ── favorites persistence ── */
  useEffect(() => { localStorage.setItem("ishu_tv_favs", JSON.stringify([...favorites])); }, [favorites]);
  const toggleFav = useCallback((id: string) => { setFavorites((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; }); }, []);

  /* ── counts ── */
  const catCounts = useMemo(() => {
    const c: Record<string, number> = { [ALL_CAT]: channels.length, [FAV_CAT]: channels.filter((ch) => favorites.has(ch.id)).length };
    for (const ch of channels) c[ch.category] = (c[ch.category] || 0) + 1;
    return c;
  }, [channels, favorites]);
  const langList = useMemo(() => {
    const m: Record<string, number> = {};
    for (const ch of channels) m[ch.language] = (m[ch.language] || 0) + 1;
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [channels]);

  /* ── player controls ── */
  const toggleFs = useCallback(() => {
    if (!playerRef.current) return;
    if (document.fullscreenElement) { document.exitFullscreen(); setIsFs(false); } else { playerRef.current.requestFullscreen(); setIsFs(true); }
  }, []);
  const togglePiP = useCallback(async () => {
    if (!videoRef.current) return;
    try { if (document.pictureInPictureElement) await document.exitPictureInPicture(); else await videoRef.current.requestPictureInPicture(); } catch {}
  }, []);
  const playChannel = useCallback((ch: Channel) => { cancelSkip(); setPlaying(ch); setTimeout(() => playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100); }, [cancelSkip]);

  /* ── keyboard ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "m") setMuted((p) => !p);
      if (e.key === "f") toggleFs();
      if (e.key === "n") playNext();
      if (e.key === "Escape" && playing) { setPlaying(null); cancelSkip(); setShowQualityMenu(false); }
      if (e.key === "Escape" && showQualityMenu) { setShowQualityMenu(false); return; }
      if (e.key === "/" && !playing) { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [playing, toggleFs, playNext, cancelSkip]);

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <Layout>
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Live TV", url: "/tv" }]} />
      <div className="min-h-screen">

        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
          <div className="pointer-events-none absolute inset-0">
            <GradientMesh variant="aurora" />
            <MorphingBlob color="hsl(217,91%,55%)" size={500} duration={20} />
            <MorphingBlob color="hsl(260,100%,65%)" size={400} duration={25} />
            <div className="absolute inset-0 cross-grid opacity-[0.03]" />
          </div>
          <ParticleField />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

          <div className="container relative z-10">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto max-w-3xl text-center">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2.5">
                <Signal className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Live Streaming</span>
                <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              </motion.div>

              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="text-shimmer">Live Indian TV</span><br />
                <span className="text-gradient">Channels</span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                Watch <span className="font-semibold text-foreground">{channels.length || "500+"}</span> Indian TV channels with
                <span className="font-semibold text-foreground"> multi-stream fallback</span>. If one stream is down, we automatically try alternatives.
              </p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {[
                  { icon: Zap, text: "Instant Play" },
                  { icon: RefreshCw, text: "Auto-Fallback" },
                  { icon: Languages, text: "14+ Languages" },
                  { icon: Sparkles, text: "HD Quality" },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 rounded-full border border-border/50 glass px-4 py-2 text-xs font-medium text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary" /> {text}
                  </span>
                ))}
              </motion.div>

              {/* Search */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="relative mx-auto mt-10 max-w-xl">
                <div className={`flex items-center gap-3 rounded-2xl border bg-card/80 px-5 py-3.5 backdrop-blur-xl transition-all ${searchFocused ? "border-primary/50 shadow-lg shadow-primary/10" : "border-border/60"}`}>
                  <Search className={`h-5 w-5 shrink-0 transition-colors ${searchFocused ? "text-primary" : "text-muted-foreground"}`} />
                  <input ref={searchRef} type="text" placeholder='Search channels... (Press "/" to focus)' value={search}
                    onChange={(e) => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60" />
                  {search && <button onClick={() => setSearch("")} className="rounded-lg p-1 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}
                  <kbd className="hidden rounded-md border border-border/60 bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground sm:block">/</kbd>
                </div>
                <AnimatePresence>
                  {searchFocused && search.trim() && searchResults.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-2xl backdrop-blur-xl">
                      <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">{searchResults.length} results</div>
                      {searchResults.map((ch) => (
                        <button key={ch.id} onMouseDown={(e) => { e.preventDefault(); playChannel(ch); setSearch(""); }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-primary/5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5">
                            {ch.logo ? <img src={ch.logo} alt="" className="h-full w-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <Tv className="h-5 w-5 text-muted-foreground" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{ch.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{ch.categoryLabel}</span>
                              <span className="text-primary">{ch.language}</span>
                              <span className="text-green-400">{ch.streams.length} stream{ch.streams.length > 1 ? "s" : ""}</span>
                            </div>
                          </div>
                          <Play className="h-4 w-4 shrink-0 text-primary" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        {!fetchLoading && channels.length > 0 && (
          <section ref={statsRef} className="container -mt-8 mb-10 relative z-10">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Tv, label: "Total Channels", value: channels.length, gradient: "from-blue-500 to-cyan-500" },
                { icon: Languages, label: "Languages", value: langList.length, gradient: "from-purple-500 to-pink-500" },
                { icon: Signal, label: "Stream URLs", value: channels.reduce((a, c) => a + c.streams.length, 0), gradient: "from-green-500 to-emerald-500" },
                { icon: RefreshCw, label: "Multi-URL Channels", value: channels.filter((c) => c.streams.length > 1).length, gradient: "from-amber-500 to-orange-500" },
              ].map(({ icon: Icon, label, value, gradient }) => (
                <div key={label} className="tv-stat rounded-2xl border border-border/40 glass-strong p-4 text-center">
                  <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-foreground"><AnimatedCounter target={value} suffix="+" duration={1.5} /></div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══ VIDEO PLAYER ═══ */}
        <AnimatePresence>
          {playing && (
            <motion.section ref={playerRef} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }} className="container mb-10">
              <div className="overflow-hidden rounded-3xl border border-border/40 bg-black shadow-2xl shadow-black/50">
                {/* chrome */}
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-3 sm:px-6">
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => { setPlaying(null); cancelSkip(); }} className="rounded-xl p-1.5 hover:bg-white/20 transition-colors">
                      <ChevronLeft className="h-5 w-5 text-white" />
                    </button>
                    {playing.logo && <img src={playing.logo} alt="" className="h-9 w-9 rounded-xl bg-white object-contain p-0.5 shadow-md"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-white sm:text-base">{playing.name}</h3>
                      <p className="text-xs text-white/60">{playing.categoryLabel} &middot; {playing.language} &middot; {playing.streams.length} stream{playing.streams.length > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {pState === "playing" && (
                      <span className="flex items-center gap-1 rounded-full bg-green-500/90 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                        <Check className="h-3 w-3" /> Live
                      </span>
                    )}
                    {(pState === "loading" || pState === "switching") && (
                      <span className="flex items-center gap-1 rounded-full bg-yellow-500/90 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                        <Loader2 className="h-3 w-3 animate-spin" /> {pState === "switching" ? `URL ${urlAttempt}/${totalUrls}` : "Connecting"}
                      </span>
                    )}
                    {pState === "error" && (
                      <span className="flex items-center gap-1 rounded-full bg-red-500/90 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                        <WifiOff className="h-3 w-3" /> Offline
                      </span>
                    )}
                    {/* Quality selector dropdown */}
                    <div className="relative hidden sm:block">
                      <button onClick={() => setShowQualityMenu((p) => !p)}
                        className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-white/25 transition-colors">
                        <Gauge className="h-3 w-3" />
                        {isAutoQuality ? `Auto${quality ? ` (${quality})` : ""}` : quality || "Quality"}
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      <AnimatePresence>
                        {showQualityMenu && (
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                            className="absolute right-0 top-full z-50 mt-2 min-w-[140px] overflow-hidden rounded-xl border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl">
                            <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-white/40">Quality</div>
                            <button onClick={() => { setQualityLevel(-1); setShowQualityMenu(false); }}
                              className={`flex w-full items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-white/10 ${isAutoQuality ? "text-blue-400 font-bold" : "text-white/70"}`}>
                              Auto {isAutoQuality && <Check className="h-3 w-3" />}
                            </button>
                            {hlsLevels.map((lvl) => (
                              <button key={lvl.index} onClick={() => { setQualityLevel(lvl.index); setShowQualityMenu(false); }}
                                className={`flex w-full items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-white/10 ${!isAutoQuality && currentLevel === lvl.index ? "text-blue-400 font-bold" : "text-white/70"}`}>
                                <span>{lvl.label}</span>
                                <span className="text-[9px] text-white/30">{lvl.bitrate > 0 ? `${Math.round(lvl.bitrate / 1000)}k` : ""}</span>
                                {!isAutoQuality && currentLevel === lvl.index && <Check className="h-3 w-3 ml-1" />}
                              </button>
                            ))}
                            {hlsLevels.length === 0 && (
                              <div className="px-3 py-2 text-xs text-white/30">Single quality stream</div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button onClick={() => toggleFav(playing.id)} className={`rounded-xl p-1.5 transition-colors ${favorites.has(playing.id) ? "text-yellow-300 bg-yellow-400/20" : "text-white/60 hover:bg-white/20"}`}>
                      <Star className="h-4 w-4" fill={favorites.has(playing.id) ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => setMuted(!muted)} className="rounded-xl p-1.5 text-white/80 hover:bg-white/20"><Volume2 className="h-4 w-4" /></button>
                    <button onClick={togglePiP} className="hidden rounded-xl p-1.5 text-white/80 hover:bg-white/20 sm:block"><PictureInPicture2 className="h-4 w-4" /></button>
                    <button onClick={playNext} className="rounded-xl p-1.5 text-white/80 hover:bg-white/20"><SkipForward className="h-4 w-4" /></button>
                    <button onClick={toggleFs} className="rounded-xl p-1.5 text-white/80 hover:bg-white/20">{isFs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}</button>
                  </div>
                </div>

                {/* video */}
                <div className="relative aspect-video w-full bg-black">
                  {(pState === "loading" || pState === "switching") && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
                      <div className="relative">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />
                        <Tv className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-blue-400" />
                      </div>
                      <p className="text-sm text-white/50">{pState === "switching" ? `Trying stream ${urlAttempt} of ${totalUrls}...` : "Connecting..."}</p>
                      {totalUrls > 1 && <p className="text-xs text-white/30">{totalUrls} backup streams available</p>}
                    </div>
                  )}
                  {pState === "error" && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
                      <WifiOff className="h-12 w-12 text-red-400" />
                      <p className="text-sm font-medium text-white/70">All {totalUrls} stream URLs tried - channel offline</p>
                      {skipIn > 0 && (
                        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                          <TimerReset className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-white/70">Next channel in <span className="font-bold text-blue-400">{skipIn}s</span></span>
                          <button onClick={cancelSkip} className="ml-2 rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/60 hover:bg-white/20">Cancel</button>
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button onClick={pRetry} className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600">
                          <RotateCcw className="h-4 w-4" /> Retry All
                        </button>
                        <button onClick={playNext} className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20">
                          <SkipForward className="h-4 w-4" /> Next Channel
                        </button>
                      </div>
                    </div>
                  )}
                  <video ref={videoRef} muted={muted} autoPlay playsInline controls className="h-full w-full" />
                </div>

                <div className="hidden items-center justify-center gap-4 bg-black/80 px-4 py-2 text-[10px] text-white/30 sm:flex">
                  {[{ k: "M", a: "Mute" }, { k: "F", a: "Fullscreen" }, { k: "N", a: "Next" }, { k: "ESC", a: "Close" }].map(({ k, a }) => (
                    <span key={k} className="flex items-center gap-1"><kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono">{k}</kbd> {a}</span>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ═══ CATEGORIES ═══ */}
        <section className="container mb-4">
          <FadeInView delay={0.1}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">Categories</h2>
              <div className="flex items-center gap-2">
                {failedIds.size > 0 && (
                  <button onClick={() => setFailedIds(new Set())} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <RotateCcw className="h-3 w-3" /> Reset {failedIds.size} offline
                  </button>
                )}
                <div className="flex gap-1">
                  <button onClick={() => setViewMode("grid")} className={`rounded-lg p-1.5 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><Grid3X3 className="h-4 w-4" /></button>
                  <button onClick={() => setViewMode("list")} className={`rounded-lg p-1.5 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><List className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </FadeInView>
          <div className="tv-chips flex flex-wrap gap-2">
            <button onClick={() => setActiveCat(ALL_CAT)}
              className={`tv-chip flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${activeCat === ALL_CAT ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "glass border border-border/40 text-muted-foreground hover:text-foreground"}`}>
              <Globe className="h-4 w-4" /> All <span className="text-xs opacity-60">({catCounts[ALL_CAT] || 0})</span>
            </button>
            <button onClick={() => setActiveCat(FAV_CAT)}
              className={`tv-chip flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${activeCat === FAV_CAT ? "bg-yellow-500 text-black shadow-lg" : "glass border border-border/40 text-muted-foreground hover:text-foreground"}`}>
              <Star className="h-4 w-4" /> Favorites <span className="text-xs opacity-60">({catCounts[FAV_CAT] || 0})</span>
            </button>
            {Object.entries(CAT_META).map(([key, { label, icon: Icon, gradient }]) => {
              const count = catCounts[key] || 0;
              if (count === 0) return null;
              return (
                <button key={key} onClick={() => setActiveCat(key)}
                  className={`tv-chip flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${activeCat === key ? `bg-gradient-to-r ${gradient} text-white shadow-lg` : "glass border border-border/40 text-muted-foreground hover:text-foreground"}`}>
                  <Icon className="h-4 w-4" /> {label} <span className="text-xs opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ═══ LANGUAGES ═══ */}
        {langList.length > 1 && (
          <section className="container mb-8">
            <FadeInView delay={0.15}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-2">
                <Languages className="h-4 w-4" /> Filter by Language
                {activeLang !== "all" && (
                  <button onClick={() => setActiveLang("all")} className="ml-2 flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors">
                    <X className="h-3 w-3" /> Clear
                  </button>
                )}
              </h2>
            </FadeInView>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActiveLang("all")}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeLang === "all" ? "bg-secondary text-foreground shadow-md" : "glass border border-border/40 text-muted-foreground hover:text-foreground"
                }`}>
                <Globe className="h-3.5 w-3.5" /> All <span className="text-xs opacity-60">({channels.length})</span>
              </button>
              {langList.map(([lang, count]) => (
                <button key={lang} onClick={() => setActiveLang(lang)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    activeLang === lang ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" : "glass border border-border/40 text-muted-foreground hover:text-foreground"
                  }`}>
                  {lang} <span className="text-xs opacity-60">({count})</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ═══ CHANNEL GRID ═══ */}
        <section className="container pb-24">
          {fetchLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="relative">
                <div className="h-20 w-20 animate-spin rounded-full border-4 border-border/30 border-t-primary" />
                <Tv className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">{fetchMsg}</p>
                <div className="mx-auto mt-4 h-2 w-48 overflow-hidden rounded-full bg-secondary">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" animate={{ width: `${fetchProgress}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{fetchProgress}%</p>
              </div>
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <AlertCircle className="h-12 w-12 text-red-400" />
              <p className="font-medium text-red-400">{fetchError}</p>
              <button onClick={() => window.location.reload()} className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Tv className="h-12 w-12 text-muted-foreground" />
              <p className="font-medium text-foreground">No channels found</p>
              <button onClick={() => { setSearch(""); setActiveCat(ALL_CAT); setActiveLang("all"); }}
                className="rounded-xl border border-border px-5 py-2.5 text-sm text-foreground hover:bg-secondary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filtered.length}</span> channels
                  {failedIds.size > 0 && <span className="text-yellow-500 ml-1">({failedIds.size} offline)</span>}
                </p>
                {/* Active filters */}
                {(activeCat !== ALL_CAT || activeLang !== "all" || search) && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeCat !== ALL_CAT && activeCat !== FAV_CAT && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {CAT_META[activeCat]?.label || activeCat}
                        <button onClick={() => setActiveCat(ALL_CAT)} className="ml-0.5 hover:text-foreground"><X className="h-3 w-3" /></button>
                      </span>
                    )}
                    {activeCat === FAV_CAT && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-medium text-yellow-500">
                        Favorites
                        <button onClick={() => setActiveCat(ALL_CAT)} className="ml-0.5 hover:text-foreground"><X className="h-3 w-3" /></button>
                      </span>
                    )}
                    {activeLang !== "all" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                        {activeLang}
                        <button onClick={() => setActiveLang("all")} className="ml-0.5 hover:text-foreground"><X className="h-3 w-3" /></button>
                      </span>
                    )}
                    {search && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                        &quot;{search}&quot;
                        <button onClick={() => setSearch("")} className="ml-0.5 hover:text-foreground"><X className="h-3 w-3" /></button>
                      </span>
                    )}
                    <button onClick={() => { setSearch(""); setActiveCat(ALL_CAT); setActiveLang("all"); }}
                      className="text-xs text-muted-foreground hover:text-foreground underline ml-1">Clear all</button>
                  </div>
                )}
              </div>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {filtered.map((ch, idx) => {
                    const isP = playing?.id === ch.id;
                    const isF = favorites.has(ch.id);
                    const isDead = failedIds.has(ch.id);
                    return (
                      <FadeInView key={ch.id} delay={Math.min(idx * 0.012, 0.25)}>
                        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable glareMaxOpacity={0.05} scale={1.02}>
                          <div onClick={() => playChannel(ch)}
                            className={`group relative flex h-full flex-col items-center gap-2.5 rounded-2xl border p-4 text-center cursor-pointer transition-all ${
                              isP ? "border-primary/60 bg-primary/10 shadow-xl shadow-primary/20"
                              : isDead ? "border-red-500/20 bg-red-500/5 opacity-50"
                              : "border-border/40 glass hover:border-primary/30 hover:shadow-lg"
                            }`}>

                            {isDead && !isP && <div className="absolute left-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20"><WifiOff className="h-3 w-3 text-red-400" /></div>}
                            {ch.streams.length > 1 && !isDead && <div className="absolute left-2 top-2 z-10 rounded-full bg-green-500/10 px-1.5 py-0.5 text-[8px] font-bold text-green-400">{ch.streams.length} URLs</div>}

                            <button onClick={(e) => { e.stopPropagation(); toggleFav(ch.id); }}
                              className={`absolute right-2 top-2 z-10 rounded-full p-1 transition-all ${isF ? "text-yellow-400" : "text-transparent group-hover:text-muted-foreground/50"}`}>
                              <Star className="h-3.5 w-3.5" fill={isF ? "currentColor" : "none"} />
                            </button>

                            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white/5 p-1.5 group-hover:scale-105 transition-transform">
                              {ch.logo ? <img src={ch.logo} alt={ch.name} loading="lazy" className="h-full w-full object-contain"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <Tv className="h-7 w-7 text-muted-foreground" />}
                            </div>

                            <h3 className="line-clamp-2 text-xs font-semibold leading-tight text-foreground sm:text-sm">{ch.name}</h3>

                            <div className="flex flex-wrap items-center justify-center gap-1">
                              <span className="rounded-full bg-secondary/80 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">{ch.categoryLabel}</span>
                              {ch.language && ch.language !== "Hindi" && (
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">{ch.language}</span>
                              )}
                            </div>

                            {isP ? (
                              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-primary/5 backdrop-blur-[1px]">
                                <div className="flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1.5 text-[10px] font-bold text-white">
                                  <Radio className="h-3 w-3 animate-pulse" /> PLAYING
                                </div>
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center rounded-2xl opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 shadow-lg transition-transform group-hover:scale-110">
                                  <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
                                </div>
                              </div>
                            )}
                          </div>
                        </Tilt>
                      </FadeInView>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((ch, idx) => {
                    const isP = playing?.id === ch.id;
                    const isF = favorites.has(ch.id);
                    const isDead = failedIds.has(ch.id);
                    return (
                      <motion.div key={ch.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                        onClick={() => playChannel(ch)}
                        className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-3 transition-all hover:bg-card ${
                          isP ? "border-primary/50 bg-primary/5" : isDead ? "border-red-500/20 opacity-50" : "border-border/30 glass"
                        }`}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5 p-1">
                          {ch.logo ? <img src={ch.logo} alt="" loading="lazy" className="h-full w-full object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <Tv className="h-5 w-5 text-muted-foreground" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{ch.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{ch.categoryLabel}</span>
                            <span className="text-primary">{ch.language}</span>
                            <span className="text-green-400">{ch.streams.length} URLs</span>
                            {isDead && <span className="text-red-400">offline</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); toggleFav(ch.id); }}
                            className={isF ? "text-yellow-400" : "text-muted-foreground/30 hover:text-muted-foreground"}>
                            <Star className="h-4 w-4" fill={isF ? "currentColor" : "none"} />
                          </button>
                          {isP ? <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary"><Radio className="h-3 w-3 animate-pulse" /> LIVE</span>
                          : <Play className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default TVPage;
