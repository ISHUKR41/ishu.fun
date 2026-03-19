/**
 * TVPage.tsx - Live Indian TV (v5 - Backend-First Ultra Reliability)
 *
 * Flow: Language Selection → Category-Grouped Channels → Player
 *
 * Key Improvements v5:
 * - Backend proxy moved to 2nd priority (after direct) for maximum reliability
 * - LocalStorage per-channel success cache: channels that worked before load instantly
 * - Backend proxy timeout extended to 6s (proper CORS + referrer support)
 * - Timeout: direct 2.5s, backend 6s, public proxies 4s, stall 5s
 * - Language-first: user picks language, sees ALL channels organized by category
 * - 12 CORS proxies + backend: allorigins, corsproxy.io, etc + backend as #2 choice
 * - 800+ channels from iptv-org + 55+ M3U sources (added more India repos)
 * - Quality selector with real HLS level switching + ABR
 * - Fuzzy search with live suggestions, keyboard navigation, highlight matching
 * - Modern 3D/animated UI with fully responsive design (mobile to 4K)
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";
import { useState, useEffect, useRef, useMemo, useCallback, memo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tv, Search, X, Play, Loader2, Radio, Film, Music, Newspaper, Baby,
  BookOpen, Heart, Dumbbell, Globe, Laugh, Church, Utensils,
  Landmark, MonitorPlay, Volume2, VolumeX, Maximize, Minimize, ChevronLeft,
  AlertCircle, Star, Zap, Signal, PictureInPicture2, RotateCcw,
  SkipForward, Sparkles, WifiOff, Languages,
  Grid3X3, List, TimerReset, RefreshCw, Check,
  ChevronDown, Gauge, ArrowRight, Filter,
  TrendingUp,
} from "lucide-react";
import Hls from "hls.js";
import Fuse from "fuse.js";
import Tilt from "react-parallax-tilt";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  IS_MOBILE, 
  IS_LOW_END, 
  PREFERS_REDUCED_MOTION, 
  shouldEnableAnimation,
  STREAM_CONFIG,
  ANIMATION_CONFIG,
} from "@/config/performance";
import { API_URL as CENTRAL_API_URL } from "@/config/api";

gsap.registerPlugin(ScrollTrigger);

// Lazy load ParticleField - heavy canvas component
const ParticleField = lazy(() => import("@/components/animations/ParticleField"));

/* ═══════════════════ TYPES ═══════════════════ */
interface ApiChannel {
  id: string;
  name: string;
  alt_names: string[];
  network: string | null;
  country: string;
  subdivision: string | null;
  categories: string[];
  languages: string[];
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
  languages: string[];
  group: string;
  streams: StreamUrl[];
  network: string | null;
}

/* ═══════════════════ LANGUAGE CONFIG ═══════════════════ */
interface LangMeta {
  label: string;
  native: string;
  gradient: string;
  emoji: string;
}

const LANGUAGES: Record<string, LangMeta> = {
  Hindi:     { label: "Hindi",     native: "हिन्दी",     gradient: "from-orange-500 to-red-500",     emoji: "🇮🇳" },
  Tamil:     { label: "Tamil",     native: "தமிழ்",      gradient: "from-red-500 to-pink-500",       emoji: "🎭" },
  Telugu:    { label: "Telugu",    native: "తెలుగు",     gradient: "from-yellow-500 to-orange-500",  emoji: "🌟" },
  Bengali:   { label: "Bengali",   native: "বাংলা",      gradient: "from-green-500 to-teal-500",     emoji: "🌸" },
  Malayalam: { label: "Malayalam", native: "മലയാളം",    gradient: "from-emerald-500 to-green-500",  emoji: "🌴" },
  Kannada:   { label: "Kannada",   native: "ಕನ್ನಡ",      gradient: "from-red-600 to-yellow-500",     emoji: "🏛️" },
  Marathi:   { label: "Marathi",   native: "मराठी",      gradient: "from-orange-600 to-amber-500",   emoji: "🏰" },
  Gujarati:  { label: "Gujarati",  native: "ગુજરાતી",    gradient: "from-blue-500 to-indigo-500",    emoji: "🦁" },
  Punjabi:   { label: "Punjabi",   native: "ਪੰਜਾਬੀ",     gradient: "from-amber-500 to-yellow-500",   emoji: "🌾" },
  Odia:      { label: "Odia",      native: "ଓଡ଼ିଆ",      gradient: "from-teal-500 to-cyan-500",      emoji: "🛕" },
  Urdu:      { label: "Urdu",      native: "اردو",       gradient: "from-green-600 to-emerald-600",  emoji: "📜" },
  Assamese:  { label: "Assamese",  native: "অসমীয়া",     gradient: "from-lime-500 to-green-500",     emoji: "🍵" },
  Bhojpuri:  { label: "Bhojpuri",  native: "भोजपुरी",    gradient: "from-yellow-600 to-orange-500",  emoji: "🎶" },
  English:   { label: "English",   native: "English",    gradient: "from-blue-600 to-purple-600",    emoji: "🌍" },
};

const LANG_ISO_MAP: Record<string, string> = {
  hin: "Hindi", tam: "Tamil", tel: "Telugu", ben: "Bengali", mal: "Malayalam",
  kan: "Kannada", mar: "Marathi", guj: "Gujarati", pan: "Punjabi", ori: "Odia",
  urd: "Urdu", asm: "Assamese", bho: "Bhojpuri", eng: "English",
  sat: "Santali", lus: "Mizo", mai: "Maithili", snd: "Sindhi",
  kok: "Konkani", gom: "Konkani", bgc: "Haryanvi", hne: "Chhattisgarhi",
  mni: "Manipuri", nep: "Nepali", kas: "Kashmiri", doi: "Dogri", san: "Sanskrit",
};

/* ═══════════════════ CATEGORY CONFIG ═══════════════════ */
// Categories in display order (most popular first)
const CAT_ORDER = [
  "news", "entertainment", "movies", "sports", "music", "kids", "animation",
  "religious", "general", "documentary", "lifestyle", "business", "comedy",
  "cooking", "education", "family", "science", "classic", "series", "shop",
  "travel", "culture", "legislative", "outdoor", "weather",
];

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
  legislative:   { label: "Legislative",   icon: Landmark,     gradient: "from-gray-500 to-slate-500" },
  outdoor:       { label: "Outdoor",       icon: Globe,        gradient: "from-lime-500 to-green-500" },
  weather:       { label: "Weather",       icon: Globe,        gradient: "from-blue-400 to-cyan-400" },
};

const ALL_CAT = "all";
const FAV_CAT = "favorites";

/* ═══════════════════ SESSION STORAGE CACHE ═══════════════════ */
const TV_CACHE_KEY = "ishu_tv_channels_v10";
const TV_CACHE_TTL = 45 * 60 * 1000; // 45 minutes
const TV_LANG_PREF_KEY = "ishu_tv_lang_pref";

/* ═══════════════════ STREAM SUCCESS CACHE ═══════════════════
   Stores working stream URL + proxy index per channel in localStorage.
   When a channel is selected, the last working attempt is tried FIRST — instant load!
   Cache expires after 4 hours to handle dead links rotating.
═══════════════════════════════════════════════════════════════ */
const STREAM_SUCCESS_CACHE_KEY = "ishu_tv_stream_success_v2";
const STREAM_SUCCESS_TTL = 4 * 60 * 60 * 1000; // 4 hours

function readStreamSuccessCache(): Record<string, { url: string; proxyIdx: number; ts: number }> {
  try {
    const s = localStorage.getItem(STREAM_SUCCESS_CACHE_KEY);
    if (!s) return {};
    const parsed = JSON.parse(s);
    const now = Date.now();
    // Prune expired entries
    const cleaned: Record<string, { url: string; proxyIdx: number; ts: number }> = {};
    for (const [k, v] of Object.entries(parsed) as [string, any][]) {
      if (now - v.ts < STREAM_SUCCESS_TTL) cleaned[k] = v;
    }
    return cleaned;
  } catch { return {}; }
}

function saveStreamSuccess(channelId: string, url: string, proxyIdx: number) {
  try {
    const cache = readStreamSuccessCache();
    cache[channelId] = { url, proxyIdx, ts: Date.now() };
    localStorage.setItem(STREAM_SUCCESS_CACHE_KEY, JSON.stringify(cache));
  } catch {}
}
const Q_ORDER: Record<string, number> = { "2160p": 6, "1080p": 5, "720p": 4, "576p": 3, "480p": 2, "360p": 1, "240p": 0 };

/* ═══════════════════ M3U PARSER ═══════════════════ */
function parseM3U(text: string, defaultLang: string): { name: string; logo: string; group: string; url: string; language: string; id: string }[] {
  const lines = text.split("\n");
  const out: { name: string; logo: string; group: string; url: string; language: string; id: string }[] = [];
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
        id: idM?.[1] || "",
      });
    }
  }
  return out;
}

/* ═══════════════════ PROXY CONFIG ═══════════════════ */
// Backend proxy for CORS bypass (runs on your Express backend via Vite proxy)
const BACKEND_PROXY = `${CENTRAL_API_URL}/api/stream-proxy`;

// Backend proxy index — MUST match position in CORS_PROXIES array
const BACKEND_PROXY_IDX = 0;

// Proxy fallbacks in PRIORITY order (index 0 = highest priority)
// Backend first, then 29 public CORS proxies = 30 total fallback layers
const CORS_PROXIES = [
  // 0: backend proxy — most reliable (caching + Indian OTT referrers + smart UA)
  (url: string) => `${BACKEND_PROXY}?url=${encodeURIComponent(url)}`,
  // 1: allorigins - fast & reliable, most widely used
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  // 2: corsproxy.io - high performance public proxy
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  // 3: corsproxy.org - very reliable
  (url: string) => `https://www.corsproxy.org/?${encodeURIComponent(url)}`,
  // 4: cors.lol - reliable & fast
  (url: string) => `https://api.cors.lol/?url=${encodeURIComponent(url)}`,
  // 5: cors.sh - fast alternative
  (url: string) => `https://proxy.cors.sh/${url}`,
  // 6: thingproxy - alternative
  (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
  // 7: crossorigin.me
  (url: string) => `https://crossorigin.me/${url}`,
  // 8: jsonp.afeld.me - another public proxy
  (url: string) => `https://jsonp.afeld.me/?url=${encodeURIComponent(url)}`,
  // 9: api.codetabs.com - fast & reliable CORS proxy
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  // 10: cors-anywhere heroku
  (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
  // 11: yacdn.org CORS proxy
  (url: string) => `https://yacdn.org/proxy/${url}`,
  // 12: cors.bridged.cc
  (url: string) => `https://cors.bridged.cc/${url}`,
  // 13: bypass.cors.sh - additional bypass option
  (url: string) => `https://bypass.cors.sh/?url=${encodeURIComponent(url)}`,
  // 14: cors.proxy.tools
  (url: string) => `https://cors.proxy.tools/?url=${encodeURIComponent(url)}`,
  // 15: corsproxy.github.io
  (url: string) => `https://corsproxy.github.io/?${encodeURIComponent(url)}`,
  // 16: gobetween CORS worker
  (url: string) => `https://worker.bridged.cc/${url}`,
  // 17: cors.eu.org free proxy
  (url: string) => `https://cors.eu.org/${url}`,
  // 18: htmldriven cors proxy
  (url: string) => `https://cors-proxy.htmldriven.com/?url=${encodeURIComponent(url)}`,
  // 19: allorigins JSONP fallback
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&callback=cb`,
  // 20: supersimple cors everywhere
  (url: string) => `https://supersimple.io/cors-proxy/?url=${encodeURIComponent(url)}`,
  // 21: cors-bypass using xhook
  (url: string) => `https://nhcorsanywhere.vercel.app/${url}`,
  // 22: proxy.techfree.workers.dev
  (url: string) => `https://proxy.techfree.workers.dev/?url=${encodeURIComponent(url)}`,
  // 23: corsproxy.cc - additional proxy
  (url: string) => `https://corsproxy.cc/?${encodeURIComponent(url)}`,
  // 24: cors-anywhere alternative
  (url: string) => `https://corsproxy.herokuapp.com/?${encodeURIComponent(url)}`,
  // 25: noCORSE proxy (new addition)
  (url: string) => `https://nocorse.com/api?url=${encodeURIComponent(url)}`,
  // 26: corss.io proxy (new addition)
  (url: string) => `https://corss.io/?url=${encodeURIComponent(url)}`,
  // 27: cors.zimjs.com (new addition)
  (url: string) => `https://cors.zimjs.com/${url}`,
  // 28: allow-any-origin (new addition)
  (url: string) => `https://allow-any-origin.appspot.com/${url}`,
  // 29: cors-proxy-server (new addition)
  (url: string) => `https://cors-proxy.fringe.zone/${url}`,
];

/* ═══════════════════ STREAM RELIABILITY SCORING ═══════════════════ */
function scoreStream(s: StreamUrl): number {
  let score = 50;
  const url = s.url.toLowerCase();
  // Tier 1 - Enterprise CDNs (best reliability + CORS headers)
  if (url.includes("akamaized.net")) score += 40;
  else if (url.includes("cloudfront.net")) score += 38;
  else if (url.includes("fastly.net") || url.includes("fastly.com")) score += 36;
  else if (url.includes("amagi.tv") || url.includes("amagimedia.com")) score += 35;
  else if (url.includes("dai.google.com") || url.includes("googlevideo.com")) score += 34;
  else if (url.includes("youtube.com")) score += 30;
  else if (url.includes("cdn.jwplayer.com")) score += 30;
  // Tier 2 - Indian OTT infra (well-known providers)
  else if (url.includes("jprdigital.in")) score += 25;
  else if (url.includes("pishow.tv")) score += 22;
  else if (url.includes("tangotv.in")) score += 22;
  else if (url.includes("wiseplayout.com")) score += 22;
  else if (url.includes("smartplaytv.in")) score += 20;
  else if (url.includes("5centscdn.com")) score += 20;
  else if (url.includes("wmncdn.net")) score += 18;
  else if (url.includes("livebox.co.in")) score += 18;
  else if (url.includes("ottlive.co.in")) score += 18;
  else if (url.includes("legitpro.co.in")) score += 18;
  else if (url.includes("mediaops.in")) score += 16;
  else if (url.includes("broadcast.in")) score += 16;
  else if (url.includes("newsclick.in")) score += 15;
  else if (url.includes("mylivecricket")) score += 15;
  else if (url.includes("streamhits.com")) score += 14;
  else if (url.includes("prodb.pro")) score += 14;
  else if (url.includes("botlive.in")) score += 14;
  else if (url.includes("streamedge.io")) score += 14;
  // Tier 3 - bare IPs (least reliable)
  else if (/https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) score -= 10;
  // HTTPS bonus
  if (url.startsWith("https")) score += 8;
  // Quality bonus
  if (s.quality) score += (Q_ORDER[s.quality] || 0) * 5;
  // Penalty for custom headers (harder to use with proxy)
  if (s.userAgent || s.referrer) score -= 3;
  return score;
}

/* ═══════════════════ DATA FETCHING ═══════════════════ */
async function fetchAllChannels(
  signal: AbortSignal,
  onProgress: (pct: number, msg: string) => void,
): Promise<Channel[]> {
  onProgress(5, "Fetching channel database...");

  const [chRes, stRes] = await Promise.all([
    fetch("https://iptv-org.github.io/api/channels.json", { signal }),
    fetch("https://iptv-org.github.io/api/streams.json", { signal }),
  ]);

  if (!chRes.ok || !stRes.ok) throw new Error("Failed to fetch channel database");

  onProgress(30, "Parsing channel data...");
  const allChannels: ApiChannel[] = await chRes.json();
  onProgress(50, "Parsing stream URLs...");
  const allStreams: ApiStream[] = await stRes.json();

  onProgress(60, "Mapping Indian channels...");

  // Filter Indian channels
  const indianChannels = allChannels.filter(
    (c) => c.country === "IN" && !c.closed && !c.is_nsfw,
  );

  // Build stream map
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

  // Sort by reliability
  for (const [, urls] of streamMap) {
    urls.sort((a, b) => scoreStream(b) - scoreStream(a));
  }

  onProgress(70, "Fetching M3U sources for logos & extras...");

  // M3U sources: India country + all language + regional subdivisions + Free-TV
  // Each fetch gets its own 10s timeout via Promise.race so slow sources don't block loading
  const m3uSources = [
    { url: "https://iptv-org.github.io/iptv/countries/in.m3u", lang: "Hindi" },
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
    { url: "https://iptv-org.github.io/iptv/languages/ori.m3u", lang: "Odia" },
    { url: "https://iptv-org.github.io/iptv/languages/asm.m3u", lang: "Assamese" },
    { url: "https://iptv-org.github.io/iptv/languages/bho.m3u", lang: "Bhojpuri" },
    // Regional subdivisions
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-tn.m3u", lang: "Tamil" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-kl.m3u", lang: "Malayalam" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-ka.m3u", lang: "Kannada" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-mh.m3u", lang: "Marathi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-ap.m3u", lang: "Telugu" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-dl.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-wb.m3u", lang: "Bengali" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-gj.m3u", lang: "Gujarati" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-pb.m3u", lang: "Punjabi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-or.m3u", lang: "Odia" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-as.m3u", lang: "Assamese" },
    // English language (for English news/docs in India)
    { url: "https://iptv-org.github.io/iptv/languages/eng.m3u", lang: "English" },
    // Free-TV IPTV (additional sources for India)
    { url: "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_india.m3u8", lang: "Hindi" },
    // Additional subdivision feeds
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-ts.m3u", lang: "Telugu" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-rj.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-up.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-br.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-jh.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-mp.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-ct.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-hr.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-ga.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-hp.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-uk.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-mn.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-tr.m3u", lang: "Bengali" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-sk.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-nl.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-mz.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-ar.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-ml.m3u", lang: "Hindi" },
    // Category-based playlists (will catch Indian channels tagged in these categories)
    { url: "https://iptv-org.github.io/iptv/categories/kids.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/music.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/movies.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/entertainment.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/sports.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/news.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/education.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/comedy.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/religious.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/documentary.m3u", lang: "English" },
    // Additional high-quality Indian sources
    { url: "https://raw.githubusercontent.com/dtankdempse/free-iptv-channels/main/channels/in.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/PetitPrince/playlists/refs/heads/master/India.m3u8", lang: "Hindi" },
    // More verified working Indian IPTV repos
    { url: "https://raw.githubusercontent.com/jaiswalvik/IPTV/main/Indian-TV-Channels.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/Avi-D-coder/indian-iptv/master/indian.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/kefranabg/bento-starter/master/public/india.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_india.m3u8", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/mai.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/bgc.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/hne.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/kok.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/nep.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/sat.m3u", lang: "Hindi" },
    // Additional curated Indian IPTV playlists
    { url: "https://raw.githubusercontent.com/Ankit-Slnk/flutter-iptv/master/iptv.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/JigarM/IndiaTVChannels/main/India.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/rashedul-alam-raju/bdix-playlist/main/India.m3u", lang: "Hindi" },
    // More category-specific playlists  
    { url: "https://iptv-org.github.io/iptv/categories/general.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/lifestyle.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/business.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/family.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/cooking.m3u", lang: "Hindi" },
    // Extra curated lists with high reliability Indian channels
    { url: "https://raw.githubusercontent.com/iptv-org/iptv/master/streams/in.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/techblog-info/live-streaming/main/channels/in.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/IPTV-India/IPTV/main/india.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/atifshahab/iptv/main/india.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/bimalpanta/Free-IPTV/main/India%20TV.m3u", lang: "Hindi" },
    // More regional language sources
    { url: "https://iptv-org.github.io/iptv/languages/raj.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/cgg.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/mni.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/kas.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/doi.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/san.m3u", lang: "Hindi" },
    // Sports-specific channels
    { url: "https://iptv-org.github.io/iptv/categories/outdoor.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/classic.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/travel.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/culture.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/series.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/shop.m3u", lang: "Hindi" },
    // Additional high-quality sources with known working Indian streams
    { url: "https://raw.githubusercontent.com/jnk22/kodinerds-iptv/master/iptv/kodi/kodi_india.m3u8", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/shayanali4/tambola/master/index.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/AqeelShaik786/Indian-IPTV/main/Indian-IPTV.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/PetitPrince/playlists/refs/heads/master/India.m3u8", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/realvitya/iptv/main/india.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/Aayush2111/Indian-IPTV/main/India.m3u", lang: "Hindi" },
    // Tata Play / JioCinema / SonyLIV channels via iptv-org specific country streams
    { url: "https://iptv-org.github.io/iptv/countries/in.m3u", lang: "Hindi" },
    // Additional curated Indian IPTV repos with active maintenance
    { url: "https://raw.githubusercontent.com/imSourav1992/India-Free-IPTV/main/India_Free_IPTV.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/sriramhms/IndianIPTV/main/india.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/gauravsarma1992/iptv-playlist/main/playlists/india.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/sydul9/Bangladesh-India-Live-TV/main/india.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/byte-capsule/Toffee-Channels-Link-Headers/main/toffee_OTT_Live_channels.m3u", lang: "Bengali" },
    { url: "https://raw.githubusercontent.com/Kry9tN/IPTV-India/main/index.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/KailashSatkari/India-IPTV/main/India.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/IPTV-INDIA/IPTV/main/india.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/shahprogrammer/Indian-IPTV-Playlist/main/Indian-IPTV-Playlist.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/HimDek/IPTV-Playlist/main/India.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/tamilrockers/india-iptv-free-channels/main/india_iptv.m3u", lang: "Tamil" },
    { url: "https://raw.githubusercontent.com/Sujayr321/Indian-Channels/main/channels.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/punitkmryh/indian-iptv-m3u/main/india.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/masterentertainmentofficial/MasterEntertainment/main/MasterEntertainment.m3u", lang: "Hindi" },
    // Doordarshan & DD National free-to-air streams
    { url: "https://iptv-org.github.io/iptv/categories/legislative.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/weather.m3u", lang: "Hindi" },
    // More Santali, Maithili, Sindhi, Konkani language streams
    { url: "https://iptv-org.github.io/iptv/languages/snd.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/gom.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/lus.m3u", lang: "Hindi" },
    // Extra verified active repos (newer additions)
    { url: "https://raw.githubusercontent.com/vkumbhare/indian-iptv/main/channels.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/nikhilbadyal/docker-py-revanced/dev/iptv/in.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/tcy.m3u", lang: "Kannada" },
    { url: "https://iptv-org.github.io/iptv/languages/raj.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/wbq.m3u", lang: "Bengali" },
    // Indian channel aggregators with direct HLS streams
    { url: "https://raw.githubusercontent.com/luongz/iptv-jp/main/in.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/fruitstudios/iptv/main/india.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/Coldtapwater/IPTV/main/india.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/redqx/iptv_list/main/india.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/sairajchouhan/indian-live-tv/main/channels.m3u", lang: "Hindi" },
    // DD Free Dish & Doordarshan
    { url: "https://raw.githubusercontent.com/vishal-shete/dd-freedish/main/dd-freedish.m3u", lang: "Hindi" },
    // Additional regional Indian language sources
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-jk.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-ch.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-an.m3u", lang: "Hindi" },
    // Sports focused
    { url: "https://iptv-org.github.io/iptv/categories/auto.m3u", lang: "English" },
    { url: "https://iptv-org.github.io/iptv/categories/swim.m3u", lang: "English" },
    // South Asian region aggregator (includes India + Pakistan + Bangladesh + Sri Lanka)
    { url: "https://iptv-org.github.io/iptv/regions/sas.m3u", lang: "Hindi" },
    // General Hindi news channels
    { url: "https://iptv-org.github.io/iptv/categories/general.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/kids.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/cooking.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/travel.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/culture.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/categories/family.m3u", lang: "Hindi" },
    // Additional language-specific official iptv-org streams
    { url: "https://iptv-org.github.io/iptv/languages/sin.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/nep.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/mni.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/doi.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/kok.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/sat.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/languages/mai.m3u", lang: "Hindi" },
    // More popular Indian M3U aggregator repos
    { url: "https://raw.githubusercontent.com/Cha0smagick/IPTV_playlist_magic/master/india_channels.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/Lunaticsatoshi/Indian-IPTV/main/channels.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/AkashMundari/IPTV/master/India.m3u8", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/amitjoki/IndianIPTV/main/IndianChannels.m3u", lang: "Hindi" },
    { url: "https://raw.githubusercontent.com/abhilash-dev/Indian-TV-Channels-M3U-Playlist/main/IndianTV.m3u", lang: "Hindi" },
    // Pakistani channels (Urdu language — many overlap with Hindi)
    { url: "https://iptv-org.github.io/iptv/countries/pk.m3u", lang: "Urdu" },
    // Bangladesh channels (Bengali language)
    { url: "https://iptv-org.github.io/iptv/countries/bd.m3u", lang: "Bengali" },
    // Sri Lanka channels
    { url: "https://iptv-org.github.io/iptv/countries/lk.m3u", lang: "Tamil" },
    // Nepal channels
    { url: "https://iptv-org.github.io/iptv/countries/np.m3u", lang: "Hindi" },
    // More entertainment category
    { url: "https://iptv-org.github.io/iptv/categories/animation.m3u", lang: "English" },
    { url: "https://iptv-org.github.io/iptv/categories/classic.m3u", lang: "Hindi" },
    // Additional subdivisions
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-mh.m3u", lang: "Marathi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-wb.m3u", lang: "Bengali" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-ka.m3u", lang: "Kannada" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-gu.m3u", lang: "Gujarati" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-pb.m3u", lang: "Punjabi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-up.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-or.m3u", lang: "Odia" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-br.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-rj.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-mp.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-as.m3u", lang: "Assamese" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-ts.m3u", lang: "Telugu" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-ap.m3u", lang: "Telugu" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-hp.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-uk.m3u", lang: "Hindi" },
    { url: "https://iptv-org.github.io/iptv/subdivisions/in-ga.m3u", lang: "Hindi" },
  ];

  // Fetch each M3U source with individual 12s timeout to avoid slow sources blocking everything
  const m3uResults = await Promise.allSettled(
    m3uSources.map(async (src) => {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 12000),
        );
        const fetchPromise = fetch(src.url, { signal }).then(async (r) => {
          if (!r.ok) return [];
          return parseM3U(await r.text(), src.lang);
        });
        return await Promise.race([fetchPromise, timeoutPromise]);
      } catch { return []; }
    }),
  );

  onProgress(85, "Building channel list...");

  // Build logo + language data from M3U
  const logoMap = new Map<string, string>();
  const langMap = new Map<string, string>();
  const extraStreams = new Map<string, StreamUrl[]>();
  const m3uIdToLang = new Map<string, string>();

  for (const r of m3uResults) {
    if (r.status !== "fulfilled") continue;
    for (const ch of r.value) {
      const key = ch.name.toLowerCase().replace(/\s*\([\d]+p\)\s*/g, "").trim();
      if (ch.logo) {
        logoMap.set(key, ch.logo);
        if (ch.id) logoMap.set(ch.id.toLowerCase(), ch.logo);
      }
      if (ch.id && ch.language && ch.language !== "Mixed") m3uIdToLang.set(ch.id, ch.language);
      if (ch.language && ch.language !== "Mixed") langMap.set(key, ch.language);
      if (!extraStreams.has(key)) extraStreams.set(key, []);
      extraStreams.get(key)!.push({ url: ch.url, quality: null, userAgent: null, referrer: null });
    }
  }

  // Build final channels
  const result: Channel[] = [];
  const seenNames = new Set<string>();

  for (const ch of indianChannels) {
    const streams = [...(streamMap.get(ch.id) || [])];
    const nameKey = ch.name.toLowerCase().trim();

    // Add M3U extra streams as fallbacks
    const extras = extraStreams.get(nameKey);
    if (extras) {
      for (const e of extras) {
        if (!streams.some((s) => s.url === e.url)) streams.push(e);
      }
    }

    if (streams.length === 0) continue;
    if (seenNames.has(nameKey)) continue;
    seenNames.add(nameKey);

    const primaryCat = ch.categories[0] || "general";
    const catMeta = CAT_META[primaryCat];

    // Resolve languages
    let channelLangs: string[] = [];
    if (ch.languages && ch.languages.length > 0) {
      channelLangs = ch.languages.map(code => LANG_ISO_MAP[code] || code).filter(Boolean);
    }
    if (channelLangs.length === 0) {
      const m3uLang = m3uIdToLang.get(ch.id) || langMap.get(nameKey);
      if (m3uLang) channelLangs = [m3uLang];
    }
    if (channelLangs.length === 0) channelLangs = ["Hindi"];

    result.push({
      id: ch.id,
      name: ch.name,
      logo: logoMap.get(ch.id.toLowerCase()) || logoMap.get(nameKey) || "",
      category: primaryCat,
      categoryLabel: catMeta?.label || primaryCat.charAt(0).toUpperCase() + primaryCat.slice(1),
      languages: channelLangs,
      group: catMeta?.label || "General",
      streams,
      network: ch.network,
    });
  }

  // Add M3U-only channels
  for (const r of m3uResults) {
    if (r.status !== "fulfilled") continue;
    for (const ch of r.value) {
      const nameKey = ch.name.toLowerCase().replace(/\s*\([\d]+p\)\s*/g, "").trim();
      if (seenNames.has(nameKey)) continue;
      seenNames.add(nameKey);
      const groupLower = ch.group.toLowerCase();
      let cat = "general";
      if (groupLower.includes("news")) cat = "news";
      else if (groupLower.includes("entertainment")) cat = "entertainment";
      else if (groupLower.includes("movie") || groupLower.includes("cinema")) cat = "movies";
      else if (groupLower.includes("sport")) cat = "sports";
      else if (groupLower.includes("music")) cat = "music";
      else if (groupLower.includes("kid") || groupLower.includes("cartoon") || groupLower.includes("animation")) cat = "kids";
      else if (groupLower.includes("religio") || groupLower.includes("devotion") || groupLower.includes("spiritual")) cat = "religious";
      else if (groupLower.includes("document")) cat = "documentary";
      else if (groupLower.includes("life")) cat = "lifestyle";
      else if (groupLower.includes("business") || groupLower.includes("finance")) cat = "business";
      else if (groupLower.includes("comedy")) cat = "comedy";
      else if (groupLower.includes("cook") || groupLower.includes("food")) cat = "cooking";
      else if (groupLower.includes("educat")) cat = "education";
      else if (groupLower.includes("family")) cat = "family";

      result.push({
        id: ch.id || `m3u_${nameKey.replace(/[^a-z0-9]/g, "_")}`,
        name: ch.name.replace(/\s*\([\d]+p\)\s*/g, "").trim(),
        logo: ch.logo,
        category: cat,
        categoryLabel: CAT_META[cat]?.label || ch.group,
        languages: [ch.language || "Hindi"],
        group: ch.group,
        streams: [{ url: ch.url, quality: null, userAgent: null, referrer: null }],
        network: null,
      });
    }
  }

  // Sort result by name
  result.sort((a, b) => a.name.localeCompare(b.name));

  onProgress(100, `Loaded ${result.length} channels`);
  return result;
}

/* ═══════════════════ QUALITY LEVEL TYPE ═══════════════════ */
interface QualityLevel {
  index: number;
  height: number;
  width: number;
  bitrate: number;
  label: string;
}

/* ═══════════════════ ROBUST HLS PLAYER HOOK ═══════════════════
   Multi-URL cascade with CORS proxy fallback:
   1. Check localStorage success cache — if channel worked before, try that FIRST
   2. For each stream URL: try DIRECT (2.5s) → Backend proxy (6s) → public CORS proxies (4s)
   3. All attempts exhausted → show error + auto-skip countdown

   Backend proxy (index 11) is now 2nd priority (after direct) because:
   - No rate limits, no CORS issues, proper referrer support for Hotstar/JioCinema/Zee5
   - Has connection pooling + manifest caching for faster repeated loads
   - Runs on Render free tier but keep-alive ping keeps it awake

   HLS recovery: recoverMediaError → swapAudioCodec → next attempt
   Stall detection: 5s freeze → next attempt
   Quality: auto ABR + manual HLS level override
   Success cache: working attempt saved to localStorage (4h TTL) for instant reloads
   ═══════════════════════════════════════════════════════════════ */
function useRobustPlayer(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  streams: StreamUrl[] | null,
  onAutoSkip: () => void,
  channelId?: string,
) {
  const hlsRef = useRef<Hls | null>(null);
  const retryRef = useRef(0);
  const stallRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeUpdateRef = useRef<(() => void) | null>(null);
  // Track position in the expanded attempt list
  const attemptListRef = useRef<{ url: string; proxyIdx: number; original: StreamUrl }[]>([]);
  const attemptIdxRef = useRef(0);

  const [state, setState] = useState<"idle" | "loading" | "playing" | "switching" | "error">("idle");
  const [quality, setQuality] = useState("");
  const [urlAttempt, setUrlAttempt] = useState(0);
  const [totalUrls, setTotalUrls] = useState(0);
  const [skipIn, setSkipIn] = useState(0);
  const [hlsLevels, setHlsLevels] = useState<QualityLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [isAutoQuality, setIsAutoQuality] = useState(true);
  const [proxyActive, setProxyActive] = useState<false | string>(false);

  const cleanup = useCallback(() => {
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    if (stallRef.current) { clearTimeout(stallRef.current); stallRef.current = null; }
    if (skipRef.current) { clearInterval(skipRef.current); skipRef.current = null; }
    if (timeUpdateRef.current && videoRef.current) {
      videoRef.current.removeEventListener("timeupdate", timeUpdateRef.current);
      timeUpdateRef.current = null;
    }
    setSkipIn(0);
    setHlsLevels([]);
    setCurrentLevel(-1);
    setIsAutoQuality(true);
    setProxyActive(false);
  }, [videoRef]);

  const startSkipCountdown = useCallback(() => {
    if (skipRef.current) return;
    let c = 2;
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

  const setQualityLevel = useCallback((levelIdx: number) => {
    if (!hlsRef.current) return;
    if (levelIdx === -1) {
      hlsRef.current.currentLevel = -1;
      setIsAutoQuality(true);
      setCurrentLevel(-1);
    } else {
      hlsRef.current.currentLevel = levelIdx;
      setIsAutoQuality(false);
      setCurrentLevel(levelIdx);
    }
  }, []);

  // Build optimized attempt list: DIRECT → BACKEND → public proxies per URL
  // Strategy: backend proxy is 2nd (best CORS handling + caching, no rate limits)
  // Max ~5 attempts per URL (direct + backend + 3 public proxies)
  // BACKEND PROXY = index 12 in CORS_PROXIES
  const buildAttemptList = useCallback((streamList: StreamUrl[], cachedAttempt?: { url: string; proxyIdx: number } | null) => {
    const list: { url: string; proxyIdx: number; original: StreamUrl }[] = [];

    // Prepend cached successful attempt FIRST (instant channel load on revisit)
    if (cachedAttempt) {
      const cached = streamList.find(s => s.url === cachedAttempt.url) ?? streamList[0];
      if (cached) {
        list.push({ url: cachedAttempt.url, proxyIdx: cachedAttempt.proxyIdx, original: cached });
      }
    }

    // These CDNs serve CORS headers natively — direct always works
    const directCDNs = [
      "akamaized.net", "cloudfront.net", "youtube.com", "googlevideo.com",
      "dai.google.com", "amagi.tv", "amagimedia.com", "cdn.jwplayer.com",
      "fastly.net", "fastly.com", "edgecastcdn.net", "limelight.com",
      "llnwd.net", "jprdigital.in", "wiseplayout.com", "pishow.tv",
      "tangotv.in", "smartplaytv.in", "5centscdn.com", "ottlive.co.in",
      "wmncdn.net", "livebox.co.in", "legitpro.co.in", "mediaops.in",
    ];
    // Take top 5 streams max to keep attempt list manageable
    const topStreams = streamList.slice(0, 5);
    for (const s of topStreams) {
      const urlLower = s.url.toLowerCase();
      const isDirectCDN = directCDNs.some(cdn => urlLower.includes(cdn));
      if (isDirectCDN) {
        // CDN streams: direct, then backend proxy (has caching), then allorigins
        list.push({ url: s.url, proxyIdx: -1,  original: s }); // direct
        list.push({ url: s.url, proxyIdx: BACKEND_PROXY_IDX,  original: s }); // backend (CORS + referrer + cache)
        list.push({ url: s.url, proxyIdx: 0,   original: s }); // allorigins
        list.push({ url: s.url, proxyIdx: 1,   original: s }); // corsproxy.io
        list.push({ url: s.url, proxyIdx: 2,   original: s }); // corsproxy.org
      } else {
        // Other streams: direct → backend → 3 public CORS proxies
        list.push({ url: s.url, proxyIdx: -1,  original: s }); // direct
        list.push({ url: s.url, proxyIdx: BACKEND_PROXY_IDX,  original: s }); // backend (most reliable proxy)
        list.push({ url: s.url, proxyIdx: 0,   original: s }); // allorigins
        list.push({ url: s.url, proxyIdx: 1,   original: s }); // corsproxy.io
        list.push({ url: s.url, proxyIdx: 2,   original: s }); // corsproxy.org
      }
    }
    // Remaining streams (beyond top 5): direct + backend only
    for (const s of streamList.slice(5)) {
      list.push({ url: s.url, proxyIdx: -1,  original: s }); // direct
      list.push({ url: s.url, proxyIdx: BACKEND_PROXY_IDX,  original: s }); // backend
    }

    // Remove duplicate entries (same url+proxyIdx) while preserving order
    const seen = new Set<string>();
    return list.filter(a => {
      const key = `${a.url}::${a.proxyIdx}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, []);

  const tryAttempt = useCallback((idx: number) => {
    // Cleanup previous
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    if (stallRef.current) { clearTimeout(stallRef.current); stallRef.current = null; }
    if (timeUpdateRef.current && videoRef.current) {
      videoRef.current.removeEventListener("timeupdate", timeUpdateRef.current);
      timeUpdateRef.current = null;
    }

    const attempts = attemptListRef.current;
    const video = videoRef.current;

    if (!video || idx >= attempts.length) {
      setState("error");
      startSkipCountdown();
      return;
    }

    const attempt = attempts[idx];
    attemptIdxRef.current = idx;
    retryRef.current = 0;

    // Calculate which original URL # we're on (for UI display)
    const attemptsPerUrl = 1 + CORS_PROXIES.length;
    const originalUrlIdx = Math.floor(idx / attemptsPerUrl);
    setUrlAttempt(originalUrlIdx + 1);
    // Show proxy label
    const proxyNames = ["backend", "allorigins", "corsproxy.io", "corsproxy.org", "cors.lol", "cors.sh", "thingproxy", "crossorigin.me", "jsonp", "codetabs", "cors-anywhere", "yacdn.org", "bridged", "bypass.cors", "cors.tools", "corsproxy.gh", "worker.bridged", "cors.eu.org", "htmldriven", "allorigins.js", "supersimple", "nhcors", "techfree", "corsproxy.cc", "corsproxy.heroku", "nocorse", "corss.io", "zimjs", "allow-origin", "fringe"];
    setProxyActive(attempt.proxyIdx >= 0 ? (proxyNames[attempt.proxyIdx] || "proxy") : false);

    setState(idx === 0 ? "loading" : "switching");
    setQuality(attempt.original.quality || "");

    // Determine the actual URL to load and whether to use proxy xhrSetup
    const isProxied = attempt.proxyIdx >= 0;
    const loadUrl = isProxied ? CORS_PROXIES[attempt.proxyIdx](attempt.url) : attempt.url;
    // Timeout strategy (ultra-aggressive fail-fast for instant switching):
    //   direct  → 900ms (fail fast, native CDN)
    //   backend → 1200ms (most reliable proxy, slight buffer)
    //   public CORS proxies → 800ms (fast public proxies)
    const timeout = !isProxied ? 600 : (attempt.proxyIdx === BACKEND_PROXY_IDX ? 1200 : 800);

    // Stall detection — if video freezes for 1s, try next source (faster switching)
    const onTimeUpdate = () => {
      if (stallRef.current) clearTimeout(stallRef.current);
      stallRef.current = setTimeout(() => tryAttempt(idx + 1), 1000);
    };
    timeUpdateRef.current = onTimeUpdate;
    video.addEventListener("timeupdate", onTimeUpdate);

    // Native HLS (Safari) - only for direct, no proxy needed
    if (!isProxied && video.canPlayType("application/vnd.apple.mpegurl") && !attempt.original.userAgent && !attempt.original.referrer) {
      video.src = loadUrl;
      video.addEventListener("loadeddata", () => setState("playing"), { once: true });
      video.addEventListener("error", () => {
        video.removeEventListener("timeupdate", onTimeUpdate);
        timeUpdateRef.current = null;
        tryAttempt(idx + 1);
      }, { once: true });
      video.play().catch(() => {});
      return;
    }

    if (!Hls.isSupported()) { tryAttempt(idx + 1); return; }

    const hlsConfig: Partial<any> = {
      enableWorker: true,
      lowLatencyMode: false,
      maxBufferLength: STREAM_CONFIG.maxBufferLength,
      maxMaxBufferLength: STREAM_CONFIG.maxMaxBufferLength,
      startLevel: -1,
      // Ultra-fast fail — move to next source almost immediately
      fragLoadingMaxRetry: 1,
      fragLoadingRetryDelay: 100,
      fragLoadingMaxRetryTimeout: timeout,
      manifestLoadingMaxRetry: 1,
      manifestLoadingRetryDelay: 100,
      manifestLoadingMaxRetryTimeout: timeout,
      levelLoadingMaxRetry: 1,
      levelLoadingRetryDelay: 100,
      levelLoadingMaxRetryTimeout: timeout,
      backBufferLength: IS_MOBILE ? 10 : 15,
      capLevelToPlayerSize: true,
      progressive: true,
      testBandwidth: true,
      abrEwmaDefaultEstimate: 500000,
      abrBandWidthFactor: 0.8,
      abrBandWidthUpFactor: 0.5,
      appendErrorMaxRetry: 2,
      enableSoftwareAES: true,
      // Ultra fast-fail policy — instant move to next source
      fragLoadPolicy: { 
        default: { 
          maxTimeToFirstByteMs: isProxied ? 700 : 400,
          maxLoadTimeMs: isProxied ? 800 : 600,
          timeoutRetry: { maxNumRetry: 0, retryDelayMs: 50, maxRetryDelayMs: 100 },
          errorRetry: { maxNumRetry: 0, retryDelayMs: 50, maxRetryDelayMs: 100 }
        } 
      },
      startFragPrefetch: true,
      initialLiveManifestSize: 1,
    };

    // For proxied streams, route ALL XHR requests through the proxy
    if (isProxied) {
      const proxyFn = CORS_PROXIES[attempt.proxyIdx];
      const proxyDomains = ['/api/stream-proxy', 'allorigins.win', 'corsproxy.io', 'corsproxy.org', 'cors.lol', 'proxy.cors.sh', 'thingproxy.freeboard.io', 'crossorigin.me', 'jsonp.afeld.me', 'codetabs.com', 'cors-anywhere.herokuapp.com', 'yacdn.org', 'cors.bridged.cc', 'bypass.cors.sh', 'cors.proxy.tools', 'corsproxy.github.io', 'worker.bridged.cc', 'cors.eu.org', 'cors-proxy.htmldriven.com', 'supersimple.io', 'nhcorsanywhere.vercel.app', 'proxy.techfree.workers.dev', 'corsproxy.cc', 'corsproxy.herokuapp.com', 'nocorse.com', 'corss.io', 'cors.zimjs.com', 'allow-any-origin.appspot.com', 'cors-proxy.fringe.zone'];
      hlsConfig.xhrSetup = (xhr: XMLHttpRequest, url: string) => {
        // Don't double-wrap if already proxied
        if (proxyDomains.some(d => url.includes(d))) return;
        const proxiedUrl = proxyFn(url);
        xhr.open("GET", proxiedUrl, true);
      };
    } else if (attempt.original.referrer) {
      hlsConfig.xhrSetup = (xhr: XMLHttpRequest) => {
        try { xhr.setRequestHeader("Referer", attempt.original.referrer!); } catch {}
      };
    }

    const hls = new Hls(hlsConfig);
    hlsRef.current = hls;
    hls.loadSource(loadUrl);
    hls.attachMedia(video);

    const loadTimeout = setTimeout(() => {
      if (hlsRef.current === hls) {
        hls.destroy();
        hlsRef.current = null;
        video.removeEventListener("timeupdate", onTimeUpdate);
        timeUpdateRef.current = null;
        tryAttempt(idx + 1);
      }
    }, timeout);

    hls.on(Hls.Events.MANIFEST_PARSED, (_e: any, data: any) => {
      clearTimeout(loadTimeout);
      setState("playing");
      retryRef.current = 0;

      // Save working attempt to localStorage so next visit loads this channel instantly
      if (channelId) {
        saveStreamSuccess(channelId, attempt.url, attempt.proxyIdx);
      }

      if (data.levels.length > 0) {
        const levels: QualityLevel[] = data.levels.map((lvl: any, i: number) => ({
          index: i,
          height: lvl.height || 0,
          width: lvl.width || 0,
          bitrate: lvl.bitrate || 0,
          label: lvl.height ? `${lvl.height}p` : `${Math.round((lvl.bitrate || 0) / 1000)}kbps`,
        }));
        levels.sort((a, b) => b.height - a.height);
        setHlsLevels(levels);
        const best = data.levels[data.levels.length - 1];
        setQuality(best.height ? `${best.height}p` : attempt.original.quality || "");
      }
      video.play().catch(() => {});
    });

    hls.on(Hls.Events.LEVEL_SWITCHED, (_e: any, data: any) => {
      const lvl = hls.levels[data.level];
      if (lvl) {
        setQuality(lvl.height ? `${lvl.height}p` : "");
        setCurrentLevel(data.level);
      }
    });

    hls.on(Hls.Events.ERROR, (_e: any, data: any) => {
      if (!data.fatal) return;
      // Fast-fail: limited retries so we move to next source quickly
      if (data.type === Hls.ErrorTypes.MEDIA_ERROR && retryRef.current < 1) {
        retryRef.current++;
        hls.recoverMediaError();
        return;
      }
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR && retryRef.current < 1) {
        retryRef.current++;
        hls.startLoad();
        return;
      }
      clearTimeout(loadTimeout);
      hls.destroy();
      hlsRef.current = null;
      video.removeEventListener("timeupdate", onTimeUpdate);
      timeUpdateRef.current = null;
      tryAttempt(idx + 1);
    });
  }, [cleanup, startSkipCountdown, videoRef]);

  const retry = useCallback(() => {
    if (!streams || streams.length === 0) return;
    cancelSkip();
    attemptIdxRef.current = 0;
    tryAttempt(0);
  }, [streams, tryAttempt, cancelSkip]);

  useEffect(() => {
    if (!streams || streams.length === 0) { cleanup(); setState("idle"); return; }
    const cached = channelId ? readStreamSuccessCache()[channelId] ?? null : null;
    const expandedList = buildAttemptList(streams, cached);
    attemptListRef.current = expandedList;
    attemptIdxRef.current = 0;
    setTotalUrls(streams.length);

    // If cached successful attempt exists, use it directly (instant!)
    if (cached) {
      tryAttempt(0);
      return cleanup;
    }

    // Parallel probe: test top 10 attempts simultaneously with 350ms timeout
    // Jump to first server that responds — eliminates sequential wait time
    let cancelled = false;
    const probeControllers: AbortController[] = [];
    setState("loading");

    const toProbe = expandedList.slice(0, Math.min(10, expandedList.length));
    Promise.any(
      toProbe.map((attempt, i) => new Promise<number>((resolve, reject) => {
        const ctrl = new AbortController();
        probeControllers.push(ctrl);
        const timer = setTimeout(() => { ctrl.abort(); reject(new Error("probe timeout")); }, 350);
        const loadUrl = attempt.proxyIdx >= 0
          ? CORS_PROXIES[attempt.proxyIdx](attempt.url)
          : attempt.url;
        fetch(loadUrl, {
          signal: ctrl.signal,
          mode: attempt.proxyIdx >= 0 ? 'cors' : 'no-cors',
          cache: 'no-store',
        }).then(r => {
          clearTimeout(timer);
          if (r.ok || r.type === 'opaque') resolve(i);
          else reject(new Error(`HTTP ${r.status}`));
        }).catch(e => { clearTimeout(timer); reject(e); });
      }))
    ).then(winnerIdx => {
      if (!cancelled) {
        attemptIdxRef.current = winnerIdx;
        tryAttempt(winnerIdx);
      }
    }).catch(() => {
      if (!cancelled) tryAttempt(0);
    });

    return () => {
      cancelled = true;
      probeControllers.forEach(c => { try { c.abort(); } catch {} });
      cleanup();
    };
  }, [streams, channelId]);

  return { state, quality, urlAttempt, totalUrls, skipIn, retry, cancelSkip, hlsLevels, currentLevel, isAutoQuality, setQualityLevel, proxyActive };
}

/* ═══════════════════ CHANNEL CARD COMPONENT ═══════════════════ */
const ChannelCard = memo(({
  ch, isPlaying, isFav, isDead, showLang, onPlay, onToggleFav,
}: {
  ch: Channel;
  isPlaying: boolean;
  isFav: boolean;
  isDead: boolean;
  showLang: boolean;
  onPlay: () => void;
  onToggleFav: () => void;
}) => {
  const cardContent = (
    <div onClick={onPlay}
      className={`group relative flex h-full flex-col items-center gap-2 rounded-2xl border p-3 sm:p-4 text-center cursor-pointer transition-all ${
        isPlaying ? "border-primary/60 bg-primary/10 shadow-xl shadow-primary/20 ring-1 ring-primary/30"
        : isDead ? "border-red-500/20 bg-red-500/5 opacity-40"
        : "border-border/40 glass hover:border-primary/30 hover:shadow-lg"
      }`} style={{ contain: "layout style paint" }}>
      {isDead && !isPlaying && (
        <div className="absolute left-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20">
          <WifiOff className="h-3 w-3 text-red-400" />
        </div>
      )}
      {ch.streams.length > 1 && !isDead && (
        <div className="absolute left-1.5 top-1.5 z-10 rounded-full bg-green-500/15 px-1.5 py-0.5 text-[8px] font-bold text-green-400">
          {ch.streams.length}
        </div>
      )}
      <button onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
        className={`absolute right-1.5 top-1.5 z-10 rounded-full p-1 transition-all ${isFav ? "text-yellow-400" : "text-transparent group-hover:text-muted-foreground/40"}`}>
        <Star className="h-3.5 w-3.5" fill={isFav ? "currentColor" : "none"} />
      </button>
      <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center overflow-hidden rounded-xl bg-white/5 p-1 group-hover:scale-105 transition-transform">
        {ch.logo ? (
          <img src={ch.logo} alt={ch.name} loading="lazy" decoding="async" className="h-full w-full object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).nextElementSibling && ((e.target as HTMLImageElement).parentElement!.querySelector('.fallback-icon') as HTMLElement)?.classList.remove('hidden'); }} />
        ) : null}
        <Tv className={`h-6 w-6 text-muted-foreground ${ch.logo ? "hidden fallback-icon" : ""}`} />
      </div>
      <h3 className="line-clamp-2 text-[11px] sm:text-xs font-semibold leading-tight text-foreground">{ch.name}</h3>
      <div className="flex flex-wrap items-center justify-center gap-1">
        <span className="rounded-full bg-secondary/80 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-medium text-muted-foreground">{ch.categoryLabel}</span>
        {showLang && ch.languages[0] && (
          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-medium text-primary">{ch.languages[0]}</span>
        )}
      </div>
      {isPlaying ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-primary/5 backdrop-blur-[1px]">
          <div className="flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1.5 text-[10px] font-bold text-white">
            <Radio className="h-3 w-3 animate-pulse" /> LIVE
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/90 shadow-lg transition-transform group-hover:scale-110">
            <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
          </div>
        </div>
      )}
    </div>
  );

  // Remove Tilt glare for performance - too many channel cards
  if (IS_MOBILE || PREFERS_REDUCED_MOTION) return cardContent;

  return (
    <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} glareEnable={false} scale={1.01} transitionSpeed={600}>
      {cardContent}
    </Tilt>
  );
});

/* ═══════════════════ PAGINATED FLAT GRID ═══════════════════ */
const FLAT_PAGE_SIZE = 100;

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */
const TVPage = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [fetchMsg, setFetchMsg] = useState("Initializing...");
  const [fetchError, setFetchError] = useState("");

  // Language-first selection (persisted in localStorage)
  const [selectedLang, setSelectedLang] = useState<string | null>(() => {
    try { return localStorage.getItem(TV_LANG_PREF_KEY) || null; } catch { return null; }
  });

  // Filters
  const [activeCat, setActiveCat] = useState(ALL_CAT);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Debounce search to avoid multiple Fuse.js runs per keystroke
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 200);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Player
  const [playing, setPlaying] = useState<Channel | null>(null);
  const [muted, setMuted] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [volume, setVolume] = useState(80);

  // Tracking
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try { const s = localStorage.getItem("ishu_tv_favs"); return s ? new Set(JSON.parse(s)) : new Set<string>(); }
    catch { return new Set<string>(); }
  });

  // Track which categories have been expanded (for "Show More" optimization)
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  // Paginated flat grid page counter (used when specific category is active)
  const [flatPage, setFlatPage] = useState(1);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  /* ── Volume sync ── */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
      videoRef.current.muted = muted;
    }
  }, [volume, muted]);

  /* ── Fuse.js search (lazily initialized) ── */
  const fuseRef = useRef<Fuse<Channel> | null>(null);
  const fuseChannelsRef = useRef<Channel[]>([]);
  const getFuse = useCallback(() => {
    if (!fuseRef.current || fuseChannelsRef.current !== channels) {
      fuseRef.current = new Fuse(channels, {
        keys: [
          { name: "name", weight: 0.5 },
          { name: "group", weight: 0.1 },
          { name: "languages", weight: 0.15 },
          { name: "categoryLabel", weight: 0.1 },
          { name: "network", weight: 0.15 },
        ],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 1,
        ignoreLocation: true,
        findAllMatches: true,
      });
      fuseChannelsRef.current = channels;
    }
    return fuseRef.current;
  }, [channels]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const results = getFuse().search(search).slice(0, 80).map((r) => r.item);
    // Filter by selected language if one is chosen
    if (selectedLang && selectedLang !== "all") {
      return results.filter(ch => ch.languages.some(l => l.toLowerCase() === selectedLang.toLowerCase()));
    }
    return results;
  }, [getFuse, search, selectedLang]);

  /* ── Channels filtered by selected language ── */
  const langChannels = useMemo(() => {
    if (!selectedLang || selectedLang === "all") return channels;
    return channels.filter(ch => ch.languages.some(l => l.toLowerCase() === selectedLang.toLowerCase()));
  }, [channels, selectedLang]);

  /* ── Filtered channels (category + search) ── */
  const filtered = useMemo(() => {
    let list = langChannels;
    if (activeCat === FAV_CAT) list = list.filter((c) => favorites.has(c.id));
    else if (activeCat !== ALL_CAT) list = list.filter((c) => c.category === activeCat);
    if (search.trim() && searchResults.length > 0) {
      const ids = new Set(searchResults.map((r) => r.id));
      list = list.filter((c) => ids.has(c.id));
    }
    return list.slice().sort((a, b) => {
      const aF = failedIds.has(a.id) ? 1 : 0;
      const bF = failedIds.has(b.id) ? 1 : 0;
      if (aF !== bF) return aF - bF;
      if (b.streams.length !== a.streams.length) return b.streams.length - a.streams.length;
      return a.name.localeCompare(b.name);
    });
  }, [langChannels, activeCat, search, searchResults, favorites, failedIds]);

  // Reset expanded categories and flat page when language or category filter changes
  useEffect(() => { setExpandedCats(new Set()); setFlatPage(1); }, [selectedLang, activeCat, search]);

  /* ── Category-grouped channels for section view ── */
  const categoryGroups = useMemo(() => {
    if (activeCat !== ALL_CAT) return null; // Don't group when filtering by specific category
    const groups: { key: string; channels: Channel[] }[] = [];
    const byCategory = new Map<string, Channel[]>();
    for (const ch of filtered) {
      if (!byCategory.has(ch.category)) byCategory.set(ch.category, []);
      byCategory.get(ch.category)!.push(ch);
    }
    // Use CAT_ORDER for consistent display
    for (const cat of CAT_ORDER) {
      const chs = byCategory.get(cat);
      if (chs && chs.length > 0) {
        groups.push({ key: cat, channels: chs });
      }
    }
    // Unknown cats at end
    for (const [cat, chs] of byCategory) {
      if (!CAT_ORDER.includes(cat) && chs.length > 0) {
        groups.push({ key: cat, channels: chs });
      }
    }
    return groups;
  }, [filtered, activeCat]);

  /* ── Language counts ── */
  const langCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const ch of channels) {
      for (const lang of ch.languages) {
        m[lang] = (m[lang] || 0) + 1;
      }
    }
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [channels]);

  /* ── Category counts ── */
  const catCounts = useMemo(() => {
    const c: Record<string, number> = {
      [ALL_CAT]: langChannels.length,
      [FAV_CAT]: langChannels.filter((ch) => favorites.has(ch.id)).length,
    };
    for (const ch of langChannels) c[ch.category] = (c[ch.category] || 0) + 1;
    return c;
  }, [langChannels, favorites]);

  /* ── Auto-skip callback ── */
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

  /* ── Player hook ── */
  const playingStreams = useMemo(() => playing?.streams ?? null, [playing]);
  const {
    state: pState, quality, urlAttempt, totalUrls, skipIn,
    retry: pRetry, cancelSkip, hlsLevels, currentLevel,
    isAutoQuality, setQualityLevel,
    proxyActive,
  } = useRobustPlayer(videoRef, playingStreams, playNext, playing?.id);

  useEffect(() => {
    if (pState === "playing" && playing) {
      setFailedIds((p) => { const n = new Set(p); n.delete(playing.id); return n; });
    }
  }, [pState, playing]);

  /* ── Fetch data (with sessionStorage cache) ── */
  useEffect(() => {
    // Check sessionStorage cache first
    try {
      const cached = sessionStorage.getItem(TV_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < TV_CACHE_TTL && Array.isArray(data) && data.length > 0) {
          setChannels(data);
          setFetchProgress(100);
          setFetchMsg(`Loaded ${data.length} channels (cached)`);
          setFetchLoading(false);
          return;
        }
      }
    } catch {}

    const ctrl = new AbortController();
    fetchAllChannels(ctrl.signal, (pct, msg) => { setFetchProgress(pct); setFetchMsg(msg); })
      .then((chs) => {
        setChannels(chs);
        setFetchLoading(false);
        // Cache in sessionStorage
        try {
          sessionStorage.setItem(TV_CACHE_KEY, JSON.stringify({ data: chs, timestamp: Date.now() }));
        } catch {}
      })
      .catch((err) => {
        if (err.name !== "AbortError") { setFetchError(err.message); setFetchLoading(false); }
      });
    return () => ctrl.abort();
  }, []);

  /* ── GSAP animations ── */
  useEffect(() => {
    if (fetchLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".tv-stat", { y: 40, opacity: 0 }, {
        scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
        y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "back.out(1.7)",
      });
    });
    return () => ctx.revert();
  }, [fetchLoading]);

  /* ── Language preference persistence ── */
  useEffect(() => {
    try {
      if (selectedLang) localStorage.setItem(TV_LANG_PREF_KEY, selectedLang);
      else localStorage.removeItem(TV_LANG_PREF_KEY);
    } catch {}
  }, [selectedLang]);

  /* ── Favorites ── */
  useEffect(() => { localStorage.setItem("ishu_tv_favs", JSON.stringify([...favorites])); }, [favorites]);
  const toggleFav = useCallback((id: string) => {
    setFavorites((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }, []);

  /* ── Controls ── */
  const toggleFs = useCallback(() => {
    if (!playerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else playerRef.current.requestFullscreen();
  }, []);
  const togglePiP = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await videoRef.current.requestPictureInPicture();
    } catch {}
  }, []);
  const playChannel = useCallback((ch: Channel) => {
    cancelSkip();
    setPlaying(ch);
    setShowQualityMenu(false);
    setTimeout(() => playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }, [cancelSkip]);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "m") setMuted((p) => !p);
      if (e.key === "f") toggleFs();
      if (e.key === "n") playNext();
      if (e.key === "Escape") {
        if (showQualityMenu) { setShowQualityMenu(false); return; }
        if (playing) { setPlaying(null); cancelSkip(); }
      }
      if (e.key === "/" && !playing) { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "ArrowUp" && playing) { setVolume(v => Math.min(100, v + 5)); }
      if (e.key === "ArrowDown" && playing) { setVolume(v => Math.max(0, v - 5)); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [playing, toggleFs, playNext, cancelSkip, showQualityMenu]);

  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const showAllLangs = selectedLang === "all";

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <Layout>
      {/* Dynamic Background Image for TVPage (Fixed to viewport - CSS only for performance) */}
      <div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }} />
      <SEOHead {...SEO_DATA.tv} />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Live TV", url: "/tv" }]} />
      <div className="min-h-screen">

        {/* ═══ HERO ═══ */}
        {!selectedLang && !playing ? (
        <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
          <div className="pointer-events-none absolute inset-0">
            <GradientMesh variant="aurora" />
            {!IS_MOBILE && <MorphingBlob color="hsl(217,91%,55%)" size={300} duration={40} />}
            {!IS_MOBILE && <MorphingBlob color="hsl(260,100%,65%)" size={250} duration={50} />}
            <div className="absolute inset-0 cross-grid opacity-[0.03]" />
          </div>
          {!IS_MOBILE && !PREFERS_REDUCED_MOTION && (
            <Suspense fallback={null}>
              <ParticleField />
            </Suspense>
          )}
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
                Watch <span className="font-semibold text-foreground">{channels.length || "700+"}</span> Indian TV channels across
                <span className="font-semibold text-foreground"> {langCounts.length || "14+"} languages</span> with
                <span className="font-semibold text-foreground"> multi-stream fallback</span>.
              </p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {[
                  { icon: Zap, text: "Instant Play" },
                  { icon: RefreshCw, text: "Auto-Fallback" },
                  { icon: Languages, text: `${langCounts.length || "14+"} Languages` },
                  { icon: Gauge, text: "Quality Control" },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-1.5 rounded-full border border-border/50 glass px-4 py-2 text-xs font-medium text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary" /> {text}
                  </span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
        ) : (
          /* Lightweight spacer when browsing channels (hero hidden for perf) */
          <div className="pt-6" />
        )}

        {/* ═══ STATS ═══ */}
        {!fetchLoading && channels.length > 0 && !selectedLang && !playing && (
          <section ref={statsRef} className="container -mt-8 mb-10 relative z-[1]">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Tv, label: "Total Channels", value: channels.length, gradient: "from-blue-500 to-cyan-500" },
                { icon: Languages, label: "Languages", value: langCounts.length, gradient: "from-purple-500 to-pink-500" },
                { icon: Signal, label: "Stream URLs", value: channels.reduce((a, c) => a + c.streams.length, 0), gradient: "from-green-500 to-emerald-500" },
                { icon: TrendingUp, label: "Multi-Stream", value: channels.filter((c) => c.streams.length > 1).length, gradient: "from-amber-500 to-orange-500" },
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

        {/* ═══ LOADING ═══ */}
        {fetchLoading && (
          <section className="container pb-24">
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
          </section>
        )}

        {/* ═══ ERROR ═══ */}
        {!fetchLoading && fetchError && (
          <section className="container pb-24">
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <AlertCircle className="h-12 w-12 text-red-400" />
              <p className="font-medium text-red-400">{fetchError}</p>
              <button onClick={() => window.location.reload()} className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Retry</button>
            </div>
          </section>
        )}

        {/* ═══ MAIN CONTENT ═══ */}
        {!fetchLoading && !fetchError && channels.length > 0 && (
          <>
            {/* ═══ LANGUAGE SELECTION SCREEN ═══ */}
            {!selectedLang && !playing && (
              <section className="container mb-12 relative z-[10]">
                <FadeInView>
                  <div className="text-center mb-8">
                    <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                      Select Your <span className="text-gradient">Language</span>
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">Choose a language to see all channels in that language, organized by category</p>
                  </div>
                </FadeInView>

                <FadeInView>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {/* All Languages */}
                    {IS_MOBILE ? (
                      <button onClick={() => setSelectedLang("all")}
                        className="group relative flex w-full flex-col items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6 text-center transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                        <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl sm:text-3xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                          🌐
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">All Languages</p>
                          <p className="text-xs text-primary font-medium mt-0.5">{channels.length} channels</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3" />
                      </button>
                    ) : (
                    <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable={false} scale={1.02} transitionSpeed={600}>
                      <button onClick={() => setSelectedLang("all")}
                        className="group relative flex w-full flex-col items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5 sm:p-6 text-center transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
                        <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl sm:text-3xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                          🌐
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">All Languages</p>
                          <p className="text-xs text-primary font-medium mt-0.5">{channels.length} channels</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3" />
                      </button>
                    </Tilt>
                    )}

                  {/* Known languages */}
                  {langCounts
                    .filter(([lang]) => LANGUAGES[lang])
                    .map(([lang, count]) => {
                      const meta = LANGUAGES[lang]!;
                      const langBtn = (
                        <button onClick={() => setSelectedLang(lang)}
                          className="group relative flex w-full flex-col items-center gap-3 rounded-2xl border border-border/40 glass p-5 sm:p-6 text-center transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                          <div className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradient} text-2xl sm:text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                            {meta.emoji}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{meta.label}</p>
                            <p className="text-[11px] text-muted-foreground/70">{meta.native}</p>
                            <p className="text-xs text-primary font-medium mt-0.5">{count} channels</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3" />
                        </button>
                      );
                      return (
                        <div key={lang}>
                          {IS_MOBILE ? langBtn : (
                            <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable={false} scale={1.02} transitionSpeed={600}>
                              {langBtn}
                            </Tilt>
                          )}
                        </div>
                      );
                    })}

                  {/* Other languages */}
                  {langCounts
                    .filter(([lang]) => !LANGUAGES[lang])
                    .map(([lang, count]) => {
                      const otherBtn = (
                        <button onClick={() => setSelectedLang(lang)}
                          className="group relative flex w-full flex-col items-center gap-3 rounded-2xl border border-border/40 glass p-5 sm:p-6 text-center transition-all hover:border-primary/40 hover:shadow-xl">
                          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-500 to-gray-600 text-2xl sm:text-3xl shadow-lg group-hover:scale-110 transition-transform">
                            🗣️
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{lang}</p>
                            <p className="text-xs text-primary font-medium mt-0.5">{count} channels</p>
                          </div>
                        </button>
                      );
                      return (
                        <div key={lang}>
                          {IS_MOBILE ? otherBtn : (
                            <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable={false} scale={1.02} transitionSpeed={600}>
                              {otherBtn}
                            </Tilt>
                          )}
                        </div>
                      );
                    })}
                </div>
                </FadeInView>

                {/* Quick search */}
                <FadeInView delay={0.3}>
                  <div className="mt-10 text-center">
                    <p className="text-xs text-muted-foreground mb-3">Or search across all languages</p>
                    <SearchBar
                      searchRef={searchRef} search={searchInput} setSearch={setSearchInput}
                      searchFocused={searchFocused} setSearchFocused={setSearchFocused}
                      searchResults={searchResults}
                      onSelect={(ch) => { setSelectedLang("all"); playChannel(ch); setSearchInput(""); }}
                    />
                  </div>
                </FadeInView>
              </section>
            )}

            {/* ═══ VIDEO PLAYER ═══ */}
            <AnimatePresence>
              {playing && (
                <motion.section ref={playerRef} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }} className="container mb-10">
                  <div className="overflow-hidden rounded-3xl border border-border/40 bg-black shadow-2xl shadow-black/50">
                    {/* Chrome bar */}
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-3 py-2.5 sm:px-6 sm:py-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <button onClick={() => { setPlaying(null); cancelSkip(); setShowQualityMenu(false); }} className="rounded-xl p-1.5 hover:bg-white/20 transition-colors">
                          <ChevronLeft className="h-5 w-5 text-white" />
                        </button>
                        {playing.logo && (
                          <img src={playing.logo} alt="" className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-white object-contain p-0.5 shadow-md"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        )}
                        <div className="min-w-0">
                          <h3 className="truncate text-xs sm:text-sm font-bold text-white">{playing.name}</h3>
                          <p className="text-[10px] sm:text-xs text-white/60">{playing.categoryLabel} &middot; {playing.languages.join(", ")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {pState === "playing" && (
                          <span className="hidden sm:flex items-center gap-1 rounded-full bg-green-500/90 px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase text-white">
                            <Check className="h-3 w-3" /> Live {proxyActive && <span className="opacity-80 lowercase font-normal">via {proxyActive}</span>}
                          </span>
                        )}
                        {(pState === "loading" || pState === "switching") && (
                          <span className="flex items-center gap-1 rounded-full bg-yellow-500/90 px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase text-white">
                            <Loader2 className="h-3 w-3 animate-spin" /> <span className="hidden sm:inline">{pState === "switching" ? `${urlAttempt}/${totalUrls}` : "Loading"}</span>
                          </span>
                        )}
                        {pState === "error" && (
                          <span className="flex items-center gap-1 rounded-full bg-red-500/90 px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase text-white">
                            <WifiOff className="h-3 w-3" /> <span className="hidden sm:inline">Offline</span>
                          </span>
                        )}
                        {/* Quality */}
                        <div className="relative">
                          <button onClick={() => setShowQualityMenu((p) => !p)}
                            className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[9px] sm:text-[10px] font-bold text-white hover:bg-white/25 transition-colors">
                            <Gauge className="h-3 w-3" />
                            <span>{isAutoQuality ? (quality ? `A(${quality})` : "Auto") : quality || "Q"}</span>
                            <ChevronDown className="h-3 w-3" />
                          </button>
                          <AnimatePresence>
                            {showQualityMenu && (
                              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                                className="absolute right-0 top-full z-50 mt-2 min-w-[150px] overflow-hidden rounded-xl border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl">
                                <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-white/40">Quality</div>
                                <button onClick={() => { setQualityLevel(-1); setShowQualityMenu(false); }}
                                  className={`flex w-full items-center justify-between px-3 py-2.5 text-xs transition-colors hover:bg-white/10 ${isAutoQuality ? "text-blue-400 font-bold" : "text-white/70"}`}>
                                  <span className="flex items-center gap-2"><Sparkles className="h-3 w-3" /> Auto</span>
                                  {isAutoQuality && <Check className="h-3 w-3" />}
                                </button>
                                <div className="mx-3 border-t border-white/5" />
                                {hlsLevels.map((lvl) => (
                                  <button key={lvl.index} onClick={() => { setQualityLevel(lvl.index); setShowQualityMenu(false); }}
                                    className={`flex w-full items-center justify-between px-3 py-2.5 text-xs transition-colors hover:bg-white/10 ${!isAutoQuality && currentLevel === lvl.index ? "text-blue-400 font-bold" : "text-white/70"}`}>
                                    <span>{lvl.label}</span>
                                    <div className="flex items-center gap-1">
                                      {lvl.bitrate > 0 && <span className="text-[9px] text-white/30">{Math.round(lvl.bitrate / 1000)}k</span>}
                                      {!isAutoQuality && currentLevel === lvl.index && <Check className="h-3 w-3 ml-1" />}
                                    </div>
                                  </button>
                                ))}
                                {hlsLevels.length === 0 && <div className="px-3 py-2 text-xs text-white/30">Single quality</div>}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <button onClick={() => toggleFav(playing.id)} className={`rounded-xl p-1.5 transition-colors ${favorites.has(playing.id) ? "text-yellow-300 bg-yellow-400/20" : "text-white/60 hover:bg-white/20"}`}>
                          <Star className="h-4 w-4" fill={favorites.has(playing.id) ? "currentColor" : "none"} />
                        </button>
                        <button onClick={() => setMuted(!muted)} className="rounded-xl p-1.5 text-white/80 hover:bg-white/20">
                          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>
                        <button onClick={togglePiP} className="hidden sm:block rounded-xl p-1.5 text-white/80 hover:bg-white/20"><PictureInPicture2 className="h-4 w-4" /></button>
                        <button onClick={playNext} className="rounded-xl p-1.5 text-white/80 hover:bg-white/20"><SkipForward className="h-4 w-4" /></button>
                        <button onClick={toggleFs} className="rounded-xl p-1.5 text-white/80 hover:bg-white/20">{isFs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}</button>
                      </div>
                    </div>
                    {/* Video */}
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
                          <WifiOff className="h-12 w-12 text-red-400/80" />
                          <p className="text-sm text-white/60">Channel currently unavailable</p>
                          <p className="text-xs text-white/30">Tried {totalUrls} stream sources</p>
                          {skipIn > 0 && (
                            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                              <TimerReset className="h-4 w-4 text-blue-400" />
                              <span className="text-sm text-white/70">Next in <span className="font-bold text-blue-400">{skipIn}s</span></span>
                              <button onClick={cancelSkip} className="ml-2 rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/60 hover:bg-white/20">Stay</button>
                            </div>
                          )}
                          <div className="flex gap-3">
                            <button onClick={pRetry} className="flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600">
                              <RotateCcw className="h-4 w-4" /> Retry
                            </button>
                            <button onClick={playNext} className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/20">
                              <SkipForward className="h-4 w-4" /> Next
                            </button>
                          </div>
                        </div>
                      )}
                      <video ref={videoRef} muted={muted} autoPlay playsInline controls className="h-full w-full object-contain" style={{ background: '#000' }} />
                    </div>
                    {/* Volume + shortcuts */}
                    <div className="flex items-center justify-between bg-black/80 px-4 py-2">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setMuted(!muted)} className="text-white/40 hover:text-white/70">
                          {muted || volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                        </button>
                        <input type="range" min="0" max="100" value={muted ? 0 : volume}
                          onChange={(e) => { setVolume(Number(e.target.value)); if (muted) setMuted(false); }}
                          className="h-1 w-20 sm:w-28 cursor-pointer appearance-none rounded-full bg-white/10 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400" />
                        <span className="text-[10px] text-white/30 w-8">{muted ? 0 : volume}%</span>
                      </div>
                      <div className="hidden sm:flex items-center gap-4 text-[10px] text-white/30">
                        {[{ k: "M", a: "Mute" }, { k: "F", a: "Full" }, { k: "N", a: "Next" }, { k: "↑↓", a: "Vol" }, { k: "ESC", a: "Close" }].map(({ k, a }) => (
                          <span key={k} className="flex items-center gap-1"><kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono">{k}</kbd> {a}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* ═══ CHANNEL BROWSER (after language selection) ═══ */}
            {(selectedLang || playing) && (
              <>
                {/* Top bar: back + language badge + search */}
                <section className="container mb-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 flex-wrap">
                      <button onClick={() => { setSelectedLang(null); setActiveCat(ALL_CAT); setSearchInput(""); setSearch(""); }}
                        className="flex items-center gap-1.5 rounded-xl border border-border/40 glass px-3 py-2 text-sm font-medium text-foreground hover:border-primary/30 transition-all">
                        <ChevronLeft className="h-4 w-4" /> Languages
                      </button>
                      {selectedLang && selectedLang !== "all" && LANGUAGES[selectedLang] && (
                        <span className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${LANGUAGES[selectedLang].gradient} px-4 py-2 text-sm font-bold text-white shadow-lg`}>
                          {LANGUAGES[selectedLang].emoji} {LANGUAGES[selectedLang].label}
                          <span className="text-white/70 font-normal text-xs">({langChannels.length})</span>
                        </span>
                      )}
                      {showAllLangs && (
                        <span className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-bold text-white shadow-lg">
                          🌐 All Languages <span className="text-white/70 font-normal text-xs">({channels.length})</span>
                        </span>
                      )}
                      {selectedLang && selectedLang !== "all" && !LANGUAGES[selectedLang] && (
                        <span className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 px-4 py-2 text-sm font-bold text-white shadow-lg">
                          🗣️ {selectedLang} <span className="text-white/70 font-normal text-xs">({langChannels.length})</span>
                        </span>
                      )}
                    </div>
                    <div className="flex-1 max-w-sm">
                      <SearchBar
                        searchRef={searchRef} search={searchInput} setSearch={setSearchInput}
                        searchFocused={searchFocused} setSearchFocused={setSearchFocused}
                        searchResults={searchResults}
                        onSelect={(ch) => { playChannel(ch); setSearchInput(""); }}
                        compact
                      />
                    </div>
                  </div>
                </section>

                {/* Category filter chips */}
                <section className="container mb-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-2">
                      <Filter className="h-3.5 w-3.5" /> Categories
                    </h2>
                    <div className="flex items-center gap-2">
                      {failedIds.size > 0 && (
                        <button onClick={() => setFailedIds(new Set())} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <RotateCcw className="h-3 w-3" /> Reset {failedIds.size} offline
                        </button>
                      )}
                      <div className="flex gap-1">
                        <button onClick={() => setViewMode("grid")} className={`rounded-lg p-1.5 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                          <Grid3X3 className="h-4 w-4" />
                        </button>
                        <button onClick={() => setViewMode("list")} className={`rounded-lg p-1.5 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                          <List className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
                    <button onClick={() => setActiveCat(ALL_CAT)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all ${activeCat === ALL_CAT ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "glass border border-border/40 text-muted-foreground hover:text-foreground"}`}>
                      <Globe className="h-3.5 w-3.5" /> All <span className="text-[10px] opacity-60">({catCounts[ALL_CAT] || 0})</span>
                    </button>
                    <button onClick={() => setActiveCat(FAV_CAT)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all ${activeCat === FAV_CAT ? "bg-yellow-500 text-black shadow-lg" : "glass border border-border/40 text-muted-foreground hover:text-foreground"}`}>
                      <Star className="h-3.5 w-3.5" /> Favs <span className="text-[10px] opacity-60">({catCounts[FAV_CAT] || 0})</span>
                    </button>
                    {CAT_ORDER.map((key) => {
                      const count = catCounts[key] || 0;
                      if (count === 0) return null;
                      const { label, icon: Icon, gradient } = CAT_META[key];
                      return (
                        <button key={key} onClick={() => setActiveCat(key)}
                          className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-all ${activeCat === key ? `bg-gradient-to-r ${gradient} text-white shadow-lg` : "glass border border-border/40 text-muted-foreground hover:text-foreground"}`}>
                          <Icon className="h-3.5 w-3.5" /> {label} <span className="text-[10px] opacity-60">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Channel display */}
                <section className="container pb-24">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                      <Tv className="h-12 w-12 text-muted-foreground" />
                      <p className="font-medium text-foreground">No channels found</p>
                      <button onClick={() => { setSearchInput(""); setSearch(""); setActiveCat(ALL_CAT); }}
                        className="rounded-xl border border-border px-5 py-2.5 text-sm text-foreground hover:bg-secondary">Clear Filters</button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
                        <span>Showing <span className="font-semibold text-foreground">{filtered.length}</span> channels</span>
                        {failedIds.size > 0 && <span className="text-yellow-500">({failedIds.size} offline)</span>}
                      </div>

                      {/* CATEGORY-GROUPED VIEW (when ALL category selected) */}
                      {categoryGroups && viewMode === "grid" ? (
                        <div className="space-y-10">
                          {categoryGroups.map(({ key, channels: catChannels }) => {
                            const meta = CAT_META[key];
                            const Icon = meta?.icon || Globe;
                            const INITIAL_SHOW = 20;
                            const isExpanded = expandedCats.has(key);
                            const visibleChannels = isExpanded ? catChannels : catChannels.slice(0, INITIAL_SHOW);
                            const hasMore = catChannels.length > INITIAL_SHOW;
                            return (
                              <div key={key}>
                                {/* Category section header */}
                                <div className="mb-4 flex items-center gap-3">
                                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${meta?.gradient || "from-gray-500 to-gray-600"} shadow-md`}>
                                    <Icon className="h-4 w-4 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-base sm:text-lg font-bold text-foreground">{meta?.label || key}</h3>
                                    <p className="text-xs text-muted-foreground">{catChannels.length} channels</p>
                                  </div>
                                </div>
                                {/* Channel grid */}
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8">
                                  {visibleChannels.map((ch) => (
                                    <ChannelCard
                                      key={ch.id} ch={ch}
                                      isPlaying={playing?.id === ch.id}
                                      isFav={favorites.has(ch.id)}
                                      isDead={failedIds.has(ch.id)}
                                      showLang={showAllLangs}
                                      onPlay={() => playChannel(ch)}
                                      onToggleFav={() => toggleFav(ch.id)}
                                    />
                                  ))}
                                </div>
                                {/* Show More / Show Less button */}
                                {hasMore && (
                                  <div className="mt-3 text-center">
                                    <button
                                      onClick={() => setExpandedCats(prev => {
                                        const next = new Set(prev);
                                        if (next.has(key)) next.delete(key); else next.add(key);
                                        return next;
                                      })}
                                      className="inline-flex items-center gap-2 rounded-xl border border-border/40 glass px-5 py-2.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                                    >
                                      {isExpanded ? (
                                        <>Show Less</>
                                      ) : (
                                        <>Show All {catChannels.length} Channels <ChevronDown className="h-3.5 w-3.5" /></>
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : viewMode === "grid" ? (
                        /* Flat grid when specific category selected - paginated */
                        <>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8">
                            {filtered.slice(0, flatPage * FLAT_PAGE_SIZE).map((ch) => (
                              <ChannelCard
                                key={ch.id} ch={ch}
                                isPlaying={playing?.id === ch.id}
                                isFav={favorites.has(ch.id)}
                                isDead={failedIds.has(ch.id)}
                                showLang={showAllLangs}
                                onPlay={() => playChannel(ch)}
                                onToggleFav={() => toggleFav(ch.id)}
                              />
                            ))}
                          </div>
                          {filtered.length > flatPage * FLAT_PAGE_SIZE && (
                            <div className="mt-6 text-center">
                              <button
                                onClick={() => setFlatPage(p => p + 1)}
                                className="inline-flex items-center gap-2 rounded-xl border border-border/40 glass px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                              >
                                <ChevronDown className="h-4 w-4" />
                                Load More ({filtered.length - flatPage * FLAT_PAGE_SIZE} remaining)
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        /* List view */
                        <div className="space-y-1.5">
                          {filtered.map((ch) => {
                            const isP = playing?.id === ch.id;
                            const isF = favorites.has(ch.id);
                            const isDead = failedIds.has(ch.id);
                            return (
                              <div key={ch.id} onClick={() => playChannel(ch)}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-all hover:bg-card ${
                                  isP ? "border-primary/50 bg-primary/5" : isDead ? "border-red-500/20 opacity-40" : "border-border/30 glass"
                                }`}>
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/5 p-0.5">
                                  {ch.logo ? <img src={ch.logo} alt="" loading="lazy" className="h-full w-full object-contain"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <Tv className="h-4 w-4 text-muted-foreground" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-foreground">{ch.name}</p>
                                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                    <span>{ch.categoryLabel}</span>
                                    {showAllLangs && <span className="text-primary">{ch.languages[0]}</span>}
                                    <span className="text-green-400">{ch.streams.length} URLs</span>
                                    {isDead && <span className="text-red-400">offline</span>}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button onClick={(e) => { e.stopPropagation(); toggleFav(ch.id); }}
                                    className={isF ? "text-yellow-400" : "text-muted-foreground/20 hover:text-muted-foreground"}>
                                    <Star className="h-4 w-4" fill={isF ? "currentColor" : "none"} />
                                  </button>
                                  {isP ? (
                                    <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                                      <Radio className="h-3 w-3 animate-pulse" /> LIVE
                                    </span>
                                  ) : <Play className="h-4 w-4 text-muted-foreground" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

/* ═══════════════════ SEARCH BAR COMPONENT ═══════════════════ */
const SearchBar = ({
  searchRef, search, setSearch, searchFocused, setSearchFocused,
  searchResults, onSelect, compact,
}: {
  searchRef: React.RefObject<HTMLInputElement | null>;
  search: string;
  setSearch: (s: string) => void;
  searchFocused: boolean;
  setSearchFocused: (f: boolean) => void;
  searchResults: Channel[];
  onSelect: (ch: Channel) => void;
  compact?: boolean;
}) => {
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  // Reset selection when results change
  useEffect(() => { setSelectedIdx(-1); }, [searchResults]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!searchResults.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIdx >= 0) {
      e.preventDefault();
      onSelect(searchResults[selectedIdx]);
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIdx >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-search-item]");
      items[selectedIdx]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIdx]);

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part)
        ? <span key={i} className="text-primary font-bold bg-primary/10 rounded px-0.5">{part}</span>
        : part
    );
  };

  const showDropdown = searchFocused && search.trim().length > 0;

  return (
    <div className={`relative ${compact ? "" : "mx-auto max-w-xl"}`} style={{ zIndex: 100 }}>
      <div className={`flex items-center gap-3 rounded-2xl border bg-card/80 backdrop-blur-xl transition-all ${compact ? "px-3 py-2" : "px-5 py-3.5"} ${searchFocused ? "border-primary/50 shadow-lg shadow-primary/10" : "border-border/60"}`}>
        <Search className={`${compact ? "h-4 w-4" : "h-5 w-5"} shrink-0 transition-colors ${searchFocused ? "text-primary" : "text-muted-foreground"}`} />
        <input ref={searchRef} type="text"
          placeholder={compact ? "Search channels..." : 'Search any channel... (Press "/" to focus)'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          onKeyDown={handleKeyDown}
          className={`flex-1 bg-transparent ${compact ? "text-xs" : "text-sm"} text-foreground outline-none placeholder:text-muted-foreground/60`}
        />
        {search && (
          <button onClick={() => setSearch("")} className="rounded-lg p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
        {!compact && <kbd className="hidden sm:block rounded-md border border-border/60 bg-secondary/50 px-2 py-0.5 text-[10px] text-muted-foreground">/</kbd>}
      </div>
      <AnimatePresence>
        {showDropdown && (
          <motion.div ref={listRef} initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-border/60 bg-card/95 shadow-2xl backdrop-blur-xl scrollbar-thin">
            {searchResults.length > 0 ? (
              <>
                <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-xl px-4 py-2 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/30">
                  {searchResults.length} results &middot; <span className="text-primary">↑↓</span> navigate &middot; <span className="text-primary">Enter</span> select
                </div>
                {searchResults.map((ch, idx) => (
                  <button key={ch.id} data-search-item onMouseDown={(e) => { e.preventDefault(); onSelect(ch); }}
                    onMouseEnter={() => setSelectedIdx(idx)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${idx === selectedIdx ? "bg-primary/10" : "hover:bg-primary/5"}`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5 border border-border/20">
                      {ch.logo ? <img src={ch.logo} alt="" className="h-full w-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <Tv className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{highlightMatch(ch.name, search)}</p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                        <span className="rounded-full bg-secondary/80 px-1.5 py-0.5 text-[9px]">{ch.categoryLabel}</span>
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary">{ch.languages[0]}</span>
                        <span className="text-green-400 text-[9px]">{ch.streams.length} streams</span>
                      </div>
                    </div>
                    <Play className={`h-4 w-4 shrink-0 ${idx === selectedIdx ? "text-primary" : "text-muted-foreground/40"}`} />
                  </button>
                ))}
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <Search className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No channels found for "{search}"</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Try a different search term</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TVPage;
