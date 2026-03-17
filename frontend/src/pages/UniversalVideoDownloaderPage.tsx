/**
 * UniversalVideoDownloaderPage.tsx — Universal Video Downloader Tool
 *
 * Downloads from ANY platform: YouTube, Instagram, TikTok, Twitter/X,
 * Facebook, Reddit, Vimeo, Twitch, Dailymotion, Pinterest, SoundCloud,
 * and 1000+ more sites. Powered by Cobalt API.
 *
 * Features:
 * - Auto platform detection with visual badge
 * - Quality selection (144p → 4K)
 * - Audio-only download (MP3)
 * - Download link generation
 * - Responsive premium UI
 */
import Layout from "@/components/layout/Layout";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";
import { VideoToolSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";
import BackendStatusBar, { wakeBackend } from "@/components/tools/BackendStatusBar";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Search, Loader2, Download, Play,
  Clipboard, AlertCircle, CheckCircle, Globe,
  MonitorPlay, Film, Zap, Shield, Music, Video,
  Instagram, Twitter, Facebook,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://ishu-site.onrender.com";

const QUALITY_OPTIONS = [
  { value: "2160", label: "4K (2160p)", badge: "4K" },
  { value: "1440", label: "2K (1440p)", badge: "2K" },
  { value: "1080", label: "Full HD (1080p)", badge: "FHD" },
  { value: "720", label: "HD (720p)", badge: "HD" },
  { value: "480", label: "SD (480p)", badge: "SD" },
  { value: "360", label: "360p", badge: "360" },
];

const SUPPORTED_PLATFORMS = [
  { name: "YouTube", icon: "🔴", color: "text-red-500 border-red-500/20 bg-red-500/5" },
  { name: "Instagram", icon: "📸", color: "text-pink-500 border-pink-500/20 bg-pink-500/5" },
  { name: "TikTok", icon: "🎵", color: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5" },
  { name: "Twitter/X", icon: "🐦", color: "text-sky-500 border-sky-500/20 bg-sky-500/5" },
  { name: "Facebook", icon: "📘", color: "text-blue-600 border-blue-600/20 bg-blue-600/5" },
  { name: "Reddit", icon: "🟠", color: "text-orange-500 border-orange-500/20 bg-orange-500/5" },
  { name: "Vimeo", icon: "🎬", color: "text-teal-500 border-teal-500/20 bg-teal-500/5" },
  { name: "Twitch", icon: "💜", color: "text-purple-500 border-purple-500/20 bg-purple-500/5" },
  { name: "Pinterest", icon: "📌", color: "text-red-600 border-red-600/20 bg-red-600/5" },
  { name: "SoundCloud", icon: "🟧", color: "text-orange-400 border-orange-400/20 bg-orange-400/5" },
  { name: "Dailymotion", icon: "📺", color: "text-blue-400 border-blue-400/20 bg-blue-400/5" },
  { name: "1000+ More", icon: "🌐", color: "text-primary border-primary/20 bg-primary/5" },
];

interface DownloadResult {
  downloadUrl: string;
  filename: string;
  platform: { name: string; icon: string };
  items?: Array<{ url: string; thumb?: string; type: string }>;
  audioUrl?: string;
}

const UniversalVideoDownloaderPage = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("1080");
  const [audioOnly, setAudioOnly] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [backendReady, setBackendReady] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 2000], [0, -150]);

  const handlePaste = async () => {
    try { const text = await navigator.clipboard.readText(); setUrl(text); } catch {}
  };

  const fetchWithRetry = async (fetchUrl: string, options: RequestInit, retries = 3): Promise<Response> => {
    for (let i = 0; i <= retries; i++) {
      const controller = new AbortController();
      abortRef.current = controller;
      // First attempt gets longest timeout (backend may be cold-starting)
      const timeoutMs = i === 0 ? 240000 : Math.max(60000, 180000 - i * 30000);
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(fetchUrl, { ...options, signal: controller.signal });
        return res;
      } catch (err: any) {
        if (i < retries) {
          // On network error or timeout, try waking backend before next retry
          if (err?.name === "AbortError" || err?.message?.includes("fetch")) {
            try { await wakeBackend(); } catch {}
          }
          await new Promise(r => setTimeout(r, 3000 * (i + 1)));
          continue;
        }
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    }
    throw new Error("Request failed after retries");
  };

  const handleDownload = async () => {
    if (!url.trim()) { setError("Please enter a video URL."); return; }
    if (!backendReady) {
      const ok = await wakeBackend();
      if (!ok) {
        setError("Backend is waking up (~30s on free tier). Please wait and try again.");
        return;
      }
      setBackendReady(true);
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetchWithRetry(`${API_URL}/api/tools/video-download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          quality: selectedQuality,
          audioOnly,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) { setError(data.error || `Download failed (HTTP ${res.status}).`); return; }

      // Fix download URL: prepend API_URL for relative backend paths
      if (data.downloadUrl && !data.downloadUrl.startsWith("http")) {
        data.downloadUrl = `${API_URL}${data.downloadUrl}`;
      }

      setResult(data);
      // Trigger proper file download via hidden anchor
      if (data.downloadUrl) {
        const a = document.createElement("a");
        a.href = data.downloadUrl;
        a.download = data.filename || "video.mp4";
        if (data.isDirect) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setError("Request timed out. The video may be too large or the server is busy — please try again.");
      } else if (err?.message?.includes("fetch") || err?.message?.includes("Failed to fetch")) {
        setError("Could not connect to the server. Backend may be waking up (~30s). Try again.");
      } else {
        setError(`Download error: ${err?.message || "Unknown error. Please try again."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl(""); setResult(null); setError(null);
  };

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return (
    <Layout>
      <SEOHead {...SEO_DATA.universalVideoDownloader} />
      <BreadcrumbSchema items={[{ name: "Tools", url: "/tools" }, { name: "Universal Video Downloader", url: "/tools/universal-video-downloader" }]} />
      <VideoToolSchema name="Universal Video Downloader — ISHU" description="Download videos from Instagram, TikTok, Facebook, Twitter & 1000+ sites for free." url="/tools/universal-video-downloader" />
      
      {/* Dynamic Background Image for UniversalVideoDownloaderPage (Fixed to viewport) */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=2074&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y
      }} />

      {/* Hero */}
      <section className="relative bg-gradient-hero py-20 overflow-hidden">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 opacity-[0.12] mix-blend-luminosity" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <GradientMesh variant="aurora" />
        <div className="pointer-events-none absolute inset-0 cross-grid opacity-10" />
        <MorphingBlob color="hsl(270 100% 60% / 0.08)" size={550} className="left-[2%] top-[5%]" />
        <MorphingBlob color="hsl(200 100% 50% / 0.06)" size={450} className="right-[5%] bottom-[10%]" duration={22} />

        <div className="container relative">
          <FadeInView>
            <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft size={14} /> All Tools
            </Link>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 text-xs">
              <Globe size={14} className="text-purple-500" />
              <span className="font-semibold text-foreground">Universal Downloader</span>
              <span className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-2 py-0.5 text-[10px] font-bold text-white">1000+ Sites</span>
            </div>

            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Universal Video <span className="text-shimmer">Downloader</span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
              Download videos from <strong>any platform</strong> — YouTube, Instagram, TikTok, Twitter/X, Facebook, Reddit, Vimeo, and 1000+ more sites. Paste URL and download instantly.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Zap, text: "1000+ Platforms" },
                { icon: MonitorPlay, text: "Up to 4K" },
                { icon: Shield, text: "No Sign-Up" },
                { icon: Music, text: "Audio Extract" },
              ].map((chip) => (
                <div key={chip.text} className="flex items-center gap-2 rounded-full border border-border glass px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <chip.icon size={12} className="text-purple-500" /> {chip.text}
                </div>
              ))}
            </div>
          </FadeInView>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Tool */}
      <section className="py-12">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {/* Backend Status */}
            <BackendStatusBar onReady={() => setBackendReady(true)} compact />

            {/* URL Input + Options */}
            <FadeInView>
              <div className="rounded-2xl border border-border glass-strong p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={20} className="text-purple-500" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Paste Any Video URL</h2>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
                    <Search size={18} className="text-muted-foreground shrink-0" />
                    <input
                      type="text" value={url} onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                      placeholder="Paste YouTube, Instagram, TikTok, Twitter, or any video URL..."
                      className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                    />
                    <button onClick={handlePaste} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                      <Clipboard size={16} />
                    </button>
                  </div>
                </div>

                {/* Quality + Audio Toggle */}
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Video Quality</label>
                    <div className="flex flex-wrap gap-2">
                      {QUALITY_OPTIONS.map((q) => (
                        <button
                          key={q.value}
                          onClick={() => { setSelectedQuality(q.value); setAudioOnly(false); }}
                          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                            selectedQuality === q.value && !audioOnly
                              ? "border-purple-500 bg-purple-500/10 text-purple-400"
                              : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                          }`}
                        >
                          {q.badge}
                        </button>
                      ))}
                      <button
                        onClick={() => setAudioOnly(!audioOnly)}
                        className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-all flex items-center gap-1 ${
                          audioOnly
                            ? "border-green-500 bg-green-500/10 text-green-400"
                            : "border-border bg-card text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <Music size={12} /> MP3
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    disabled={loading || !backendReady}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 font-display text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Processing...</>
                    ) : (
                      <><Download size={18} /> {backendReady ? (audioOnly ? "Download Audio (MP3)" : `Download Video (${selectedQuality}p)`) : "Waiting for Server..."}</>
                    )}
                  </motion.button>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                      <AlertCircle size={16} /> {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeInView>

            {/* Loading */}
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-6 rounded-2xl border border-border glass-strong p-8 flex flex-col items-center gap-4">
                  <div className="relative">
                    <Loader2 size={40} className="animate-spin text-purple-500" />
                    <div className="absolute inset-0 animate-ping opacity-20">
                      <Loader2 size={40} className="text-purple-500" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">Detecting platform and fetching download link...</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result */}
            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="mt-6 rounded-2xl border border-border glass-strong overflow-hidden">
                  {/* Platform badge */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{result.platform.icon}</span>
                        <div>
                          <p className="font-display text-sm font-semibold text-foreground">{result.platform.name}</p>
                          <p className="text-xs text-muted-foreground">Platform detected</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-500" />
                        <span className="text-sm text-green-400 font-semibold">Ready!</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mb-4 flex items-center gap-2">
                      <Film size={12} /> {result.filename}
                    </div>

                    {/* Download button */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={result.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 font-display text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-glow"
                      >
                        <Download size={18} /> Download Now
                      </a>
                      {result.audioUrl && (
                        <a
                          href={result.audioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                        >
                          <Music size={16} /> Audio Only
                        </a>
                      )}
                      <button onClick={handleReset}
                        className="rounded-xl border border-border px-6 py-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                        New URL
                      </button>
                    </div>

                    {/* Picker items (carousels, etc.) */}
                    {result.items && result.items.length > 1 && (
                      <div className="mt-6">
                        <p className="text-xs text-muted-foreground mb-3">Multiple items found:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {result.items.slice(0, 9).map((item, i) => (
                            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
                              className="relative rounded-xl border border-border overflow-hidden group hover:border-primary/30 transition-colors">
                              {item.thumb ? (
                                <img src={item.thumb} alt={`Item ${i + 1}`} className="w-full aspect-square object-cover transition-transform group-hover:scale-105" />
                              ) : (
                                <div className="w-full aspect-square bg-secondary flex items-center justify-center">
                                  <Video size={24} className="text-muted-foreground" />
                                </div>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <span className="text-[10px] text-white font-medium flex items-center gap-1">
                                  <Download size={10} /> Item {i + 1}
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Supported Platforms Grid */}
            {!result && !loading && (
              <FadeInView delay={0.15}>
                <div className="mt-12 rounded-2xl border border-border glass p-8">
                  <h3 className="font-display text-xl font-bold text-foreground text-center mb-6">
                    Supported <span className="text-shimmer">Platforms</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {SUPPORTED_PLATFORMS.map((p) => (
                      <motion.div
                        key={p.name}
                        whileHover={{ y: -3, scale: 1.03 }}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${p.color}`}
                      >
                        <span className="text-lg">{p.icon}</span>
                        <span className="text-xs font-semibold">{p.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FadeInView>
            )}

            {/* How It Works */}
            {!result && !loading && (
              <FadeInView delay={0.25}>
                <div className="mt-8 rounded-2xl border border-border glass p-8">
                  <h3 className="font-display text-xl font-bold text-foreground text-center mb-8">
                    How It <span className="text-shimmer">Works</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { step: "1", title: "Paste URL", desc: "Copy the video URL from any platform and paste it above.", icon: Clipboard },
                      { step: "2", title: "Select Quality", desc: "Choose video quality (360p to 4K) or extract audio as MP3.", icon: MonitorPlay },
                      { step: "3", title: "Download", desc: "Hit download and the file is saved to your device instantly.", icon: Download },
                    ].map((item) => (
                      <motion.div key={item.step} whileHover={{ y: -4 }} className="text-center group">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500 transition-all group-hover:bg-purple-500 group-hover:text-white group-hover:shadow-glow">
                          <item.icon size={24} />
                        </div>
                        <div className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">{item.step}</div>
                        <h4 className="font-display text-sm font-semibold text-foreground">{item.title}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FadeInView>
            )}

            {/* FAQ */}
            <FadeInView delay={0.35}>
              <div className="mt-12">
                <h3 className="font-display text-xl font-bold text-foreground text-center mb-6">
                  Frequently Asked <span className="text-shimmer">Questions</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { q: "Which platforms are supported?", a: "YouTube, Instagram, TikTok, Twitter/X, Facebook, Reddit, Vimeo, Twitch, Dailymotion, Pinterest, SoundCloud, Bilibili, and 1000+ more." },
                    { q: "Can I download audio only?", a: "Yes! Select the MP3 option to extract audio from any video." },
                    { q: "Is there a download limit?", a: "No! Download as many videos as you want. 100% free, no sign-up." },
                    { q: "What about private videos?", a: "Only publicly accessible videos can be downloaded. Private or DRM-protected content is not supported." },
                  ].map((faq, i) => (
                    <motion.div key={i} whileHover={{ x: 3 }} className="rounded-xl border border-border glass p-5 transition-all hover:border-primary/20">
                      <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-500/10 text-[10px] font-bold text-purple-500">{String(i + 1).padStart(2, "0")}</span>
                        {faq.q}
                      </h4>
                      <p className="mt-2 pl-8 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "WebApplication",
          "name": "Universal Video Downloader — ISHU",
          "description": "Download videos from YouTube, Instagram, TikTok, Twitter, Facebook, Reddit, and 1000+ platforms. Free, no sign-up, HD/4K quality.",
          "url": "https://ishu.fun/tools/universal-video-downloader",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
        })
      }} />
    </Layout>
  );
};

export default UniversalVideoDownloaderPage;
