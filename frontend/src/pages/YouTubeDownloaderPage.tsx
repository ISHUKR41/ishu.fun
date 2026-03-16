/**
 * YouTubeDownloaderPage.tsx — YouTube Video Downloader Tool
 *
 * Uses yt-dlp backend for actual working downloads.
 * Features: URL input, video preview (YouTube embed), quality selection, download.
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowLeft, Search, Loader2, Download, Play, Eye,
  User, Youtube, Clipboard, AlertCircle, CheckCircle,
  Sparkles, MonitorPlay, Film, Zap, Shield, Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface VideoInfo {
  title: string;
  channel: string;
  thumbnail: string;
  thumbnailHQ: string;
  videoId: string;
  url: string;
  duration?: string;
  views?: string;
}

interface FormatOption {
  quality: string;
  height: number;
  filesize?: string;
  ext?: string;
  formatId?: string;
  itag?: number;
}

const QUALITY_OPTIONS = ["2160", "1080", "720", "480", "360"];

const YouTubeDownloaderPage = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [formats, setFormats] = useState<FormatOption[]>([]);
  const [selectedQuality, setSelectedQuality] = useState("1080");
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadReady, setDownloadReady] = useState<{url: string; filename: string; filesize?: string} | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [backendReady, setBackendReady] = useState(false);

  // Pre-warm the backend on page load (Render free tier sleeps after inactivity)
  useEffect(() => {
    fetch(`${API_URL}/api/health`, { method: "GET" })
      .then(r => { if (r.ok) setBackendReady(true); })
      .catch(() => {});
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch { /* clipboard not available */ }
  };

  const fetchWithRetry = async (fetchUrl: string, options: RequestInit, retries = 2): Promise<Response> => {
    for (let i = 0; i <= retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000);
        const res = await fetch(fetchUrl, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        return res;
      } catch (err: any) {
        if (i < retries && err?.name !== "AbortError") {
          console.log(`Retry ${i + 1}/${retries}...`);
          await new Promise(r => setTimeout(r, 3000));
          continue;
        }
        throw err;
      }
    }
    throw new Error("Request failed after retries");
  };

  const fetchVideoInfo = async () => {
    if (!url.trim()) { setError("Please enter a YouTube URL."); return; }
    setLoading(true);
    setError(null);
    setVideoInfo(null);
    setFormats([]);
    setDownloadReady(null);
    setShowPreview(false);

    try {
      const res = await fetchWithRetry(`${API_URL}/api/tools/youtube-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      if (!data.success) { setError(data.error || "Failed to fetch video info."); return; }
      setVideoInfo(data.video);
      setFormats(data.formats || []);
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setError("Request timed out. The server might be starting up — please wait 30 seconds and try again.");
      } else {
        setError("Could not connect to the server. The backend may be waking up (free tier takes ~30s). Please try again in a moment.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);
    setDownloadReady(null);

    try {
      const res = await fetchWithRetry(`${API_URL}/api/tools/youtube-download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), quality: selectedQuality }),
      });

      const data = await res.json();
      if (!data.success) { setError(data.error || "Download failed."); return; }

      // Build the full download URL
      const fullDownloadUrl = data.downloadUrl.startsWith("http")
        ? data.downloadUrl
        : `${API_URL}${data.downloadUrl}`;

      setDownloadReady({ url: fullDownloadUrl, filename: data.filename, filesize: data.filesize });

      // Trigger proper file download via hidden anchor
      const a = document.createElement("a");
      a.href = fullDownloadUrl;
      a.download = data.filename || "video.mp4";
      // For direct Cobalt URLs (cross-origin), open in new tab
      if (data.isDirect) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setError("Download timed out. The video may be too large or the server is busy.");
      } else {
        setError("Download failed. Please check your connection and try again.");
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleReset = () => {
    setUrl(""); setVideoInfo(null); setFormats([]); setError(null);
    setDownloading(false); setDownloadReady(null); setShowPreview(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 overflow-hidden">
        <GradientMesh variant="aurora" />
        <div className="pointer-events-none absolute inset-0 cross-grid opacity-10" />
        <MorphingBlob color="hsl(0 100% 50% / 0.08)" size={500} className="left-[5%] top-[10%]" />
        <MorphingBlob color="hsl(0 70% 45% / 0.06)" size={400} className="right-[10%] bottom-[15%]" duration={22} />

        <div className="container relative">
          <FadeInView>
            <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft size={14} /> All Tools
            </Link>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 text-xs">
              <Youtube size={14} className="text-red-500" />
              <span className="font-semibold text-foreground">Video Tools</span>
            </div>

            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              YouTube Video <span className="text-shimmer">Downloader</span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
              Download YouTube videos in HD quality. Paste the URL, preview, select quality, and download instantly — 100% free.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Zap, text: "Instant Download" },
                { icon: MonitorPlay, text: "HD/4K Quality" },
                { icon: Shield, text: "100% Free" },
                { icon: Film, text: "Video Preview" },
              ].map((chip) => (
                <div key={chip.text} className="flex items-center gap-2 rounded-full border border-border glass px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <chip.icon size={12} className="text-red-500" />
                  {chip.text}
                </div>
              ))}
            </div>
          </FadeInView>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Tool Section */}
      <section className="py-12">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            {/* URL Input */}
            <FadeInView>
              <div className="rounded-2xl border border-border glass-strong p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Youtube size={20} className="text-red-500" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Enter YouTube URL</h2>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
                    <Search size={18} className="text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && fetchVideoInfo()}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                    />
                    <button onClick={handlePaste} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors" title="Paste">
                      <Clipboard size={16} />
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={fetchVideoInfo}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-display text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-glow disabled:opacity-50 shrink-0"
                  >
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Fetching...</> : <><Play size={16} /> Fetch</>}
                  </motion.button>
                </div>

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
                  className="mt-6 rounded-2xl border border-border glass-strong p-6">
                  <div className="flex gap-6">
                    <div className="w-48 h-28 rounded-xl bg-secondary animate-pulse shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 w-3/4 rounded bg-secondary animate-pulse" />
                      <div className="h-4 w-1/2 rounded bg-secondary animate-pulse" />
                      <div className="h-4 w-1/3 rounded bg-secondary animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Preview + Download */}
            <AnimatePresence>
              {videoInfo && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }} className="mt-6 space-y-6">
                  {/* Video Card */}
                  <div className="rounded-2xl border border-border glass-strong overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      <div className="relative w-full md:w-72 shrink-0">
                        <div className="relative rounded-xl overflow-hidden group cursor-pointer"
                          onClick={() => videoInfo.videoId && setShowPreview(!showPreview)}>
                          <img
                            src={videoInfo.thumbnail}
                            alt={videoInfo.title}
                            className="w-full h-auto aspect-video object-cover transition-transform group-hover:scale-105"
                            onError={(e: any) => { e.target.src = videoInfo.thumbnailHQ || `https://img.youtube.com/vi/${videoInfo.videoId}/hqdefault.jpg`; }}
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="rounded-full bg-white/20 backdrop-blur-sm p-3">
                              {showPreview ? <Eye size={24} className="text-white" /> : <Play size={24} className="text-white" />}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="font-display text-lg font-bold text-foreground leading-tight line-clamp-2">{videoInfo.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <User size={14} className="text-primary" /> {videoInfo.channel}
                          </span>
                          {videoInfo.duration && (
                            <span className="flex items-center gap-1.5">
                              <Clock size={14} className="text-primary" /> {videoInfo.duration}
                            </span>
                          )}
                          {videoInfo.views && (
                            <span className="flex items-center gap-1.5">
                              <Eye size={14} className="text-primary" /> {videoInfo.views} views
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-success" />
                          <span className="text-xs text-success font-medium">Video found! Select quality and download.</span>
                        </div>
                        {videoInfo.videoId && (
                          <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-500/20 transition-colors"
                          >
                            <Play size={12} /> {showPreview ? "Hide Preview" : "Watch Preview"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* YouTube Embed Preview */}
                    <AnimatePresence>
                      {showPreview && videoInfo.videoId && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-border overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="relative rounded-xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                              <iframe
                                src={`https://www.youtube.com/embed/${videoInfo.videoId}?autoplay=0&rel=0`}
                                title={videoInfo.title}
                                className="absolute inset-0 w-full h-full rounded-xl"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Quality + Download */}
                  <div className="rounded-2xl border border-border glass-strong p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={18} className="text-primary" />
                      <h3 className="font-display text-base font-semibold text-foreground">Select Quality</h3>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {/* Show server-returned formats first, then fallback to QUALITY_OPTIONS */}
                      {(formats.length > 0
                        ? formats.map(f => String(f.height || parseInt(f.quality)))
                        : QUALITY_OPTIONS
                      ).filter((v, i, a) => a.indexOf(v) === i).map((q) => {
                        const format = formats.find(f => String(f.height) === q || f.quality === `${q}p`);
                        return (
                          <motion.button
                            key={q}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedQuality(q)}
                            className={`rounded-xl border px-5 py-3 text-sm font-semibold transition-all ${
                              selectedQuality === q
                                ? "border-red-500 bg-red-500/10 text-red-500 shadow-glow"
                                : "border-border bg-card text-foreground hover:border-primary/30"
                            }`}
                          >
                            {q}p {q === "2160" && "4K"} {q === "1080" && "FHD"} {q === "720" && "HD"}
                            {format?.filesize && <span className="text-xs ml-1 opacity-60">({format.filesize})</span>}
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleDownload}
                        disabled={downloading}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 py-4 font-display text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-glow disabled:opacity-50"
                      >
                        {downloading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : <><Download size={18} /> Download {selectedQuality}p</>}
                      </motion.button>
                      <button onClick={handleReset} className="rounded-xl border border-border px-6 py-4 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                        Download Another
                      </button>
                    </div>

                    {downloadReady && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-green-400 font-medium">Download started!</span>
                          {downloadReady.filesize && <span className="text-muted-foreground text-xs">({downloadReady.filesize})</span>}
                        </div>
                        <a href={downloadReady.url} target="_blank" rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          <Download size={12} /> Click here if download didn't start
                        </a>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* How It Works */}
            {!videoInfo && !loading && (
              <FadeInView delay={0.2}>
                <div className="mt-12 rounded-2xl border border-border glass p-8">
                  <h3 className="font-display text-xl font-bold text-foreground text-center mb-8">
                    How to <span className="text-shimmer">Download</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { step: "1", title: "Paste URL", desc: "Copy the YouTube video URL and paste it above.", icon: Clipboard },
                      { step: "2", title: "Preview & Select", desc: "Preview the video details and select quality.", icon: MonitorPlay },
                      { step: "3", title: "Download", desc: "Click download and save the video.", icon: Download },
                    ].map((item) => (
                      <motion.div key={item.step} whileHover={{ y: -4 }} className="text-center group">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 transition-all group-hover:bg-red-500 group-hover:text-white group-hover:shadow-glow">
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
            <FadeInView delay={0.3}>
              <div className="mt-12">
                <h3 className="font-display text-xl font-bold text-foreground text-center mb-6">
                  Frequently Asked <span className="text-shimmer">Questions</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { q: "Is this YouTube downloader free?", a: "Yes! Completely free with no limits, no sign-up, and no ads." },
                    { q: "What video qualities are supported?", a: "360p, 480p, 720p HD, 1080p Full HD, and 4K 2160p." },
                    { q: "Can I download YouTube Shorts?", a: "Yes! YouTube Shorts work just like regular videos." },
                    { q: "Is it safe to use?", a: "Absolutely. We don't store any data. Downloads are processed securely." },
                  ].map((faq, i) => (
                    <motion.div key={i} whileHover={{ x: 3 }} className="rounded-xl border border-border glass p-5 transition-all hover:border-primary/20">
                      <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500/10 text-[10px] font-bold text-red-500">{String(i + 1).padStart(2, "0")}</span>
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
          "name": "YouTube Video Downloader — ISHU",
          "description": "Free online YouTube video downloader. Download in HD/4K quality with preview.",
          "url": "https://ishu.fun/tools/youtube-downloader",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
        })
      }} />
    </Layout>
  );
};

export default YouTubeDownloaderPage;
