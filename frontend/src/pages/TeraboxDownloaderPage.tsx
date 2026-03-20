/**
 * TeraboxDownloaderPage.tsx — Terabox Video/File Downloader Tool
 *
 * Uses backend Terabox APIs (yt-dlp + third-party) for file info and download.
 * Features: URL input, file preview, video player, download.
 */
import Layout from "@/components/layout/Layout";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";
import { VideoToolSchema, BreadcrumbSchema, HowToSchema, ToolFAQSchema } from "@/components/seo/JsonLd";
import BackendStatusBar, { wakeBackend } from "@/components/tools/BackendStatusBar";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Search, Loader2, Download, Play,
  Cloud, Clipboard, AlertCircle, CheckCircle,
  MonitorPlay, Film, Zap, Shield, HardDrive,
  FileVideo, File
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "" : "https://ishu-site.onrender.com");

interface FileInfo {
  name: string;
  size: string;
  thumbnail: string;
  downloadLink: string;
  isVideo: boolean;
  duration?: string;
  useBackendDownload?: boolean;
}

const TeraboxDownloaderPage = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [downloadReady, setDownloadReady] = useState<{url: string; filename: string} | null>(null);

  const [backendReady, setBackendReady] = useState(false);
  const downloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      const timeoutMs = i === 0 ? 240000 : Math.max(60000, 180000 - i * 30000);
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(fetchUrl, { ...options, signal: controller.signal });
        return res;
      } catch (err: any) {
        if (i < retries) {
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

  const fetchFileInfo = async () => {
    if (!url.trim()) { setError("Please enter a Terabox URL."); return; }
    if (!backendReady) {
      const ok = await wakeBackend();
      if (!ok) {
        setError("Backend is still waking up. Please wait a few seconds and try again.");
        return;
      }
      setBackendReady(true);
    }
    setLoading(true);
    setError(null);
    setFileInfo(null);
    setShowPreview(false);
    setDownloadReady(null);

    try {
      const res = await fetchWithRetry(
        `${API_URL}/api/tools/terabox-info?url=${encodeURIComponent(url.trim())}`,
        { method: "GET" }
      );

      const data = await res.json();
      if (!data.success || !data.data) {
        const msg = data.error || "Failed to fetch file info.";
        setError(msg + " Please check that the link is valid and publicly shared.");
        return;
      }
      const d = data.data;
      setFileInfo({
        name: d.filename || "Unknown File",
        size: d.sizeFormatted || "Unknown size",
        thumbnail: d.thumbnail || "",
        downloadLink: "",
        isVideo: d.isVideo || false,
        useBackendDownload: true,
      });
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setError("Request timed out. The server might be waking up — please try again in a few seconds.");
      } else {
        setError("Could not connect to the server. The backend may be waking up (free tier takes ~30s). Please try again in a moment.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!fileInfo) return;
    if (!backendReady) {
      const ok = await wakeBackend();
      if (!ok) {
        setError("Backend is still waking up. Please wait a few seconds and try again.");
        return;
      }
      setBackendReady(true);
    }
    setDownloading(true);
    setError(null);
    setDownloadReady(null);

    // If the file has a direct download link from third-party API, use it
    if (fileInfo.downloadLink && !fileInfo.useBackendDownload) {
      const a = document.createElement("a");
      a.href = fileInfo.downloadLink;
      a.download = fileInfo.name;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadReady({ url: fileInfo.downloadLink, filename: fileInfo.name });
      if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
      downloadTimerRef.current = setTimeout(() => setDownloading(false), 3000);
      return;
    }

    // Otherwise, use backend download endpoint
    try {
      const res = await fetchWithRetry(`${API_URL}/api/tools/terabox-download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      if (!data.success) { setError(data.error || "Download failed."); return; }

      const fullDownloadUrl = data.downloadUrl.startsWith("http")
        ? data.downloadUrl
        : `${API_URL}${data.downloadUrl}`;

      setDownloadReady({ url: fullDownloadUrl, filename: data.filename || fileInfo.name });

      const a = document.createElement("a");
      a.href = fullDownloadUrl;
      a.download = data.filename || fileInfo.name;
      if (data.isDirect) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setError("Download timed out. The file may be too large or the server is busy.");
      } else {
        setError("Download failed. Please check your connection and try again.");
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleReset = () => {
    setUrl(""); setFileInfo(null); setError(null); setDownloading(false);
    setShowPreview(false); setDownloadReady(null);
  };

  useEffect(() => {
    return () => {
      if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  return (
    <Layout>
      <SEOHead {...SEO_DATA.teraboxDownloader} />
      <BreadcrumbSchema items={[{ name: "Tools", url: "/tools" }, { name: "Terabox Downloader", url: "/tools/terabox-downloader" }]} />
      <VideoToolSchema name="Terabox Downloader — ISHU" description="Download Terabox videos and files for free. Paste link, preview and download." url="/tools/terabox-downloader" />
      <ToolFAQSchema toolName="Terabox Downloader" toolType="video" />
      
      {/* Dynamic Background Image for TeraboxDownloaderPage (Fixed to viewport) */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y
      }} />

      {/* Hero */}
      <section className="relative bg-gradient-hero pt-8 pb-16 overflow-hidden">
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 opacity-[0.10] mix-blend-luminosity" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />
        <GradientMesh variant="aurora" />
        <div className="pointer-events-none absolute inset-0 cross-grid opacity-10" />
        <MorphingBlob color="hsl(210 100% 56% / 0.08)" size={500} className="left-[5%] top-[10%]" />
        <MorphingBlob color="hsl(260 100% 66% / 0.06)" size={400} className="right-[10%] bottom-[15%]" duration={22} />

        <div className="container relative">
          <FadeInView>
            <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft size={14} /> All Tools
            </Link>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-1.5 text-xs">
              <Cloud size={14} className="text-blue-500" />
              <span className="font-semibold text-foreground">Video Tools</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Terabox Video <span className="text-shimmer">Downloader</span>
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
              Download Terabox videos and files with preview. Paste your Terabox share link and download directly — 100% free.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: Zap, text: "Fast Download" },
                { icon: HardDrive, text: "All File Types" },
                { icon: Shield, text: "100% Free" },
                { icon: Film, text: "Video Preview" },
              ].map((chip) => (
                <div key={chip.text} className="flex items-center gap-2 rounded-full border border-border glass px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  <chip.icon size={12} className="text-blue-500" /> {chip.text}
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

            {/* URL Input */}
            <FadeInView>
              <div className="rounded-2xl border border-border glass-strong p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Cloud size={20} className="text-blue-500" />
                  <h2 className="font-display text-lg font-semibold text-foreground">Enter Terabox URL</h2>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
                    <Search size={18} className="text-muted-foreground shrink-0" />
                    <input
                      type="text" value={url} onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && fetchFileInfo()}
                      placeholder="https://terabox.com/s/... or https://1024tera.com/s/..."
                      className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                    />
                    <button onClick={handlePaste} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors" title="Paste">
                      <Clipboard size={16} />
                    </button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={fetchFileInfo} disabled={loading || !backendReady}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-display text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Fetching...</> : <><Search size={16} /> {backendReady ? "Fetch" : "Waiting for Server..."}</>}
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
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File Info + Download */}
            <AnimatePresence>
              {fileInfo && (
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }} className="mt-6 space-y-6">
                  <div className="rounded-2xl border border-border glass-strong overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      <div className="relative w-full md:w-72 shrink-0">
                        {fileInfo.thumbnail ? (
                          <div className="relative rounded-xl overflow-hidden group cursor-pointer" onClick={() => fileInfo.isVideo && setShowPreview(!showPreview)}>
                            <img src={fileInfo.thumbnail} alt={fileInfo.name} className="w-full h-auto aspect-video object-cover transition-transform group-hover:scale-105" />
                            {fileInfo.isVideo && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="rounded-full bg-white/20 backdrop-blur-sm p-3"><Play size={24} className="text-white" /></div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full aspect-video rounded-xl bg-secondary/50 flex items-center justify-center">
                            {fileInfo.isVideo ? <FileVideo size={48} className="text-muted-foreground" /> : <File size={48} className="text-muted-foreground" />}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-3">
                        <h3 className="font-display text-lg font-bold text-foreground leading-tight line-clamp-2">{fileInfo.name}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><HardDrive size={14} className="text-primary" /> {fileInfo.size}</span>
                          <span className="flex items-center gap-1.5">
                            {fileInfo.isVideo ? <><FileVideo size={14} className="text-primary" /> Video</> : <><File size={14} className="text-primary" /> File</>}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-success" />
                          <span className="text-xs text-success font-medium">File found! Click download below.</span>
                        </div>
                        {fileInfo.isVideo && fileInfo.thumbnail && (
                          <button onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                            <Play size={12} /> {showPreview ? "Hide Preview" : "Show Video Preview"}
                          </button>
                        )}
                      </div>
                    </div>
                    <AnimatePresence>
                      {showPreview && fileInfo.isVideo && (fileInfo.downloadLink || fileInfo.thumbnail) && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-border overflow-hidden">
                          <div className="p-4">
                            {fileInfo.downloadLink ? (
                              <video src={fileInfo.downloadLink} controls className="w-full rounded-xl max-h-[400px]" poster={fileInfo.thumbnail}>
                                Your browser does not support video playback.
                              </video>
                            ) : (
                              <img src={fileInfo.thumbnail} alt="Preview" className="w-full rounded-xl max-h-[400px] object-contain" />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="rounded-2xl border border-border glass-strong p-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={handleDownload} disabled={downloading || !backendReady}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-display text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloading ? <><Loader2 size={18} className="animate-spin" /> Downloading...</> : <><Download size={18} /> Download File</>}
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
            {!fileInfo && !loading && (
              <FadeInView delay={0.2}>
                <div className="mt-12 rounded-2xl border border-border glass p-8">
                  <h3 className="font-display text-xl font-bold text-foreground text-center mb-8">How to <span className="text-shimmer">Download</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { step: "1", title: "Paste URL", desc: "Copy your Terabox share link and paste it above.", icon: Clipboard },
                      { step: "2", title: "Preview File", desc: "Preview file details and video thumbnail.", icon: MonitorPlay },
                      { step: "3", title: "Download", desc: "Click download to save the file.", icon: Download },
                    ].map((item) => (
                      <motion.div key={item.step} whileHover={{ y: -4 }} className="text-center group">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 transition-all group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-glow">
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
                <h3 className="font-display text-xl font-bold text-foreground text-center mb-6">Frequently Asked <span className="text-shimmer">Questions</span></h3>
                <div className="space-y-3">
                  {[
                    { q: "Is this Terabox downloader free?", a: "Yes! 100% free with no limits or sign-up required." },
                    { q: "What file types can I download?", a: "Any file from Terabox — videos, documents, images, archives." },
                    { q: "Can I preview videos?", a: "Yes! If it's a video file, you can preview it directly in the browser." },
                    { q: "Which Terabox domains are supported?", a: "terabox.com, 1024tera.com, freeterabox.com, teraboxapp.com, and all mirrors." },
                  ].map((faq, i) => (
                    <motion.div key={i} whileHover={{ x: 3 }} className="rounded-xl border border-border glass p-5 transition-all hover:border-primary/20">
                      <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 text-[10px] font-bold text-blue-500">{String(i + 1).padStart(2, "0")}</span>
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
          "name": "Terabox Video Downloader — ISHU",
          "description": "Free Terabox video and file downloader with preview.",
          "url": "https://ishu.fun/tools/terabox-downloader",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
        })
      }} />
    </Layout>
  );
};

export default TeraboxDownloaderPage;


