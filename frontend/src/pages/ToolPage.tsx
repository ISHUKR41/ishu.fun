/**
 * ToolPage.tsx — Individual PDF Tool Page (Rebuilt from scratch)
 *
 * The actual tool interface where users upload files and process them.
 * Features:
 *  - Dynamic SEO per tool (title, description, keywords)
 *  - Premium drag-and-drop upload zone with visual feedback
 *  - Tool options panel integration
 *  - Animated progress bar during processing
 *  - File size comparison on completion
 *  - Related tools grid
 *  - Responsive dark-theme design matching the tools listing
 */
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Upload, FileText, Download, CheckCircle, ArrowLeft, Loader2, X, ArrowRight, AlertCircle, Shield, Zap, Star, Clock } from "lucide-react";
import { allToolsData } from "@/data/tools-data";
import ToolIcon from "@/components/tools/ToolIcon";
import ToolOptionsPanel from "@/components/tools/ToolOptionsPanel";
import { Progress } from "@/components/ui/progress";
import { processFiles, downloadResult, getAcceptedTypes, isCreateTool, needsMultipleFiles, type ProcessResult, type ToolOptions } from "@/lib/pdf-processor";
import SEOHead from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import Tilt from "react-parallax-tilt";

const CAT_COLORS: Record<string, { color: string; bg: string }> = {
  "Convert":     { color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  "Edit":        { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  "Organize":    { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  "Security":    { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  "AI & Others": { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  "Video Tools": { color: "#ec4899", bg: "rgba(236,72,153,0.12)" },
};

function getCatColor(cat: string) {
  return CAT_COLORS[cat] ?? { color: "#6366f1", bg: "rgba(99,102,241,0.12)" };
}

const TRUST_FEATURES = [
  { icon: Shield, text: "100% Secure" },
  { icon: Zap, text: "Instant Processing" },
  { icon: Star, text: "No Sign-up" },
  { icon: Clock, text: "Always Free" },
];

const ToolPage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);

  const { toolSlug } = useParams<{ toolSlug: string }>();
  const tool = allToolsData.find((t) => t.slug === toolSlug);
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [toolOptions, setToolOptions] = useState<ToolOptions>({});
  const [progressValue, setProgressValue] = useState(0);
  const optionsRef = useRef<ToolOptions>({});

  const isMobile = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches,
    []
  );

  useEffect(() => {
    if (!processing) return;
    setProgressValue((prev) => (prev > 5 ? prev : 5));
    const timer = window.setInterval(() => {
      setProgressValue((prev) => (prev >= 92 ? prev : prev + 6));
    }, 300);
    return () => window.clearInterval(timer);
  }, [processing]);

  const handleOptionsChange = useCallback((opts: ToolOptions) => {
    optionsRef.current = opts;
    setToolOptions(opts);
  }, []);

  const relatedTools = useMemo(() =>
    allToolsData
      .filter((t) => t.slug !== toolSlug && t.category === tool?.category)
      .slice(0, 6),
    [toolSlug, tool?.category]
  );

  if (!tool) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">Tool Not Found</h1>
            <p className="mt-2 text-muted-foreground">The tool you're looking for doesn't exist.</p>
            <Link to="/tools" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              <ArrowLeft size={14} /> Back to All Tools
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { color, bg } = getCatColor(tool.category);
  const isCreate = isCreateTool(toolSlug!);
  const acceptTypes = getAcceptedTypes(toolSlug!);
  const multiFiles = needsMultipleFiles(toolSlug!);

  const toolSeoTitle = `${tool.name} — Free Online ${tool.category} Tool | ISHU`;
  const toolSeoDesc = `${tool.desc} Use ${tool.name} for free online at ISHU — Indian StudentHub University. No sign-up required, 100% secure, process files instantly in your browser.`;
  const toolSeoKeywords = `${tool.name.toLowerCase()}, ${tool.name.toLowerCase()} online free, ${tool.name.toLowerCase()} tool, free ${tool.name.toLowerCase()}, ${tool.slug}, ishu ${tool.name.toLowerCase()}, ishu tools, pdf tools online, ishu.fun`;

  const toAcceptedExtList = (accept: string) =>
    accept.split(",").map((ext) => ext.trim().toLowerCase()).filter(Boolean);

  const validateIncomingFiles = (incomingFiles: File[]) => {
    const maxSizeBytes = 20 * 1024 * 1024;
    const acceptedList = acceptTypes === "*" ? [] : toAcceptedExtList(acceptTypes);
    const valid: File[] = [];
    incomingFiles.forEach((file) => {
      if (file.size > maxSizeBytes) { setError(`"${file.name}" is larger than 20MB.`); return; }
      if (acceptedList.length > 0) {
        const ext = file.name.includes(".") ? `.${file.name.split(".").pop()!.toLowerCase()}` : "";
        if (!acceptedList.includes(ext)) { setError(`"${file.name}" is not supported for this tool.`); return; }
      }
      valid.push(file);
    });
    return valid;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false); setError(null);
    const dropped = validateIncomingFiles(Array.from(e.dataTransfer.files));
    if (dropped.length === 0) return;
    setFiles((prev) => {
      const next = [...prev, ...dropped];
      return Array.from(new Map(next.map((f) => [`${f.name}-${f.size}-${f.lastModified}`, f])).values());
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setError(null);
      const incoming = validateIncomingFiles(Array.from(e.target.files));
      if (incoming.length === 0) return;
      setFiles((prev) => {
        const next = [...prev, ...incoming];
        return Array.from(new Map(next.map((f) => [`${f.name}-${f.size}-${f.lastModified}`, f])).values());
      });
    }
  };

  const handleProcess = async () => {
    setProcessing(true); setProgressValue(6); setError(null);
    try {
      const res = await processFiles(toolSlug!, files, optionsRef.current);
      setResult(res); setProgressValue(100); setDone(true);
    } catch (err: any) {
      setError(err.message || "Processing failed. Please try again."); setProgressValue(0);
    } finally { setProcessing(false); }
  };

  const handleCreateProcess = async () => {
    setProcessing(true); setProgressValue(6); setError(null);
    try {
      const res = await processFiles(toolSlug!, [], optionsRef.current);
      setResult(res); setProgressValue(100); setDone(true);
    } catch (err: any) {
      setError(err.message || "Processing failed."); setProgressValue(0);
    } finally { setProcessing(false); }
  };

  const handleDownload = () => { if (result) downloadResult(result); };

  const handleReset = () => {
    setFiles([]); setDone(false); setProcessing(false);
    setProgressValue(0); setResult(null); setError(null);
  };

  const originalSize = files.reduce((sum, f) => sum + f.size, 0);
  const resultSize = result?.blob.size || 0;

  return (
    <Layout>
      <SEOHead title={toolSeoTitle} description={toolSeoDesc} keywords={toolSeoKeywords} />
      <BreadcrumbSchema items={[{ name: "PDF Tools", url: "/tools" }, { name: tool.name, url: `/tools/${tool.slug}` }]} />

      {/* Background */}
      <motion.div className="fixed inset-0 -z-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(ellipse at 30% 50%, ${color}08 0%, transparent 50%)`,
        y: bgY
      }} />

      {/* Header */}
      <section className="bg-gradient-hero pt-6 pb-12">
        <div className="container">
          <FadeInView>
            <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors mb-6">
              <ArrowLeft size={14} /> All Tools
            </Link>

            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 6 }}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: bg }}
              >
                <ToolIcon iconName={tool.icon} size={28} color={color} />
              </motion.div>
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/50">
                  <span className="font-semibold text-white/70">ISHU</span> — Free Online Tool
                </div>
                <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
                  {tool.name}
                </h1>
                <p className="mt-2 max-w-xl text-white/50 text-sm leading-relaxed">{tool.desc}</p>
                <span
                  className="mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                  style={{ color, background: bg }}
                >
                  {tool.category}
                </span>
              </div>
            </div>

            {/* Trust chips */}
            <div className="mt-6 flex flex-wrap gap-2">
              {TRUST_FEATURES.map((f) => (
                <div key={f.text} className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/50">
                  <f.icon size={11} className="text-primary" />
                  {f.text}
                </div>
              ))}
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Tool Area */}
      <section className="py-12">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            {!done ? (
              <FadeInView>
                {isCreate ? (
                  <div className="space-y-4">
                    <ToolOptionsPanel toolSlug={toolSlug!} onChange={handleOptionsChange} />
                    <button
                      onClick={handleCreateProcess}
                      disabled={processing}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] disabled:opacity-50"
                    >
                      {processing ? (
                        <><Loader2 size={18} className="animate-spin" /> Processing...</>
                      ) : (
                        <>{tool.name} <ArrowRight size={16} /></>
                      )}
                    </button>
                    {processing && (
                      <div className="space-y-2">
                        <Progress value={progressValue} />
                        <p className="text-xs text-white/40">Preparing output... {Math.round(progressValue)}%</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Upload Zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                        dragOver
                          ? "border-primary bg-primary/5 shadow-[0_0_40px_rgba(99,102,241,0.15)]"
                          : "border-white/[0.12] bg-[#111118]/60 hover:border-white/[0.2]"
                      }`}
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                      >
                        <Upload size={32} className="text-primary" />
                      </motion.div>
                      <p className="font-display text-lg font-semibold text-white/90">
                        {multiFiles ? "Drop your files here" : "Drop your file here"}
                      </p>
                      <p className="mt-2 text-sm text-white/40">
                        or click to browse • Accepted: {acceptTypes === '*' ? 'All files' : acceptTypes}
                      </p>
                      <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 font-display text-sm font-semibold text-white transition-all hover:shadow-[0_0_24px_rgba(99,102,241,0.3)]">
                        <Upload size={16} /> Select File{multiFiles ? 's' : ''}
                        <input type="file" multiple={multiFiles} className="hidden" onChange={handleFileInput} accept={acceptTypes} />
                      </label>
                    </div>

                    {/* Tool Options */}
                    {files.length > 0 && (
                      <div className="mt-4">
                        <ToolOptionsPanel toolSlug={toolSlug!} onChange={handleOptionsChange} />
                      </div>
                    )}

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400"
                        >
                          <AlertCircle size={18} />
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* File List */}
                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {files.map((file, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#111118] p-4"
                          >
                            <div className="flex items-center gap-3">
                              <FileText size={20} className="text-primary" />
                              <div>
                                <p className="text-sm font-medium text-white/85">{file.name}</p>
                                <p className="text-xs text-white/35">{(file.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                            <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-white/30 hover:text-red-400 transition-colors">
                              <X size={16} />
                            </button>
                          </motion.div>
                        ))}

                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={handleProcess}
                          disabled={processing}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-display text-sm font-semibold text-white transition-all hover:shadow-[0_0_24px_rgba(99,102,241,0.3)] disabled:opacity-50"
                        >
                          {processing ? (
                            <><Loader2 size={18} className="animate-spin" /> Processing your file{files.length > 1 ? 's' : ''}...</>
                          ) : (
                            <>Process {files.length} file{files.length > 1 ? "s" : ""} <ArrowRight size={16} /></>
                          )}
                        </motion.button>
                        {processing && (
                          <div className="space-y-2">
                            <Progress value={progressValue} />
                            <p className="text-xs text-white/40">Processing... {Math.round(progressValue)}%</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </FadeInView>
            ) : (
              <FadeInView>
                <div className="rounded-2xl border border-white/[0.08] bg-[#111118] p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10"
                  >
                    <CheckCircle size={40} className="text-emerald-400" />
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold text-white">Done!</h2>
                  <p className="mt-2 text-white/50">Your file has been processed successfully.</p>
                  {originalSize > 0 && resultSize > 0 && (
                    <div className="mt-3 flex items-center justify-center gap-4 text-xs text-white/40">
                      <span>Original: {(originalSize / 1024).toFixed(1)} KB</span>
                      <ArrowRight size={12} />
                      <span className="font-semibold text-primary">Output: {(resultSize / 1024).toFixed(1)} KB</span>
                    </div>
                  )}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-display text-sm font-semibold text-white transition-all hover:shadow-[0_0_24px_rgba(99,102,241,0.3)]"
                    >
                      <Download size={16} /> Download {result?.filename}
                    </button>
                    <button onClick={handleReset} className="rounded-xl border border-white/10 px-8 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.04]">
                      Process Another File
                    </button>
                  </div>
                  <p className="mt-4 text-xs text-white/30">All processing done locally — your files never leave your device</p>
                </div>
              </FadeInView>
            )}
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="mt-16">
              <FadeInView>
                <h3 className="font-display text-xl font-bold text-white">Related Tools</h3>
                <p className="mt-1 text-sm text-white/40">More {tool.category} tools you might find useful</p>
              </FadeInView>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {relatedTools.map((rt, i) => (
                  <FadeInView key={rt.slug} delay={i * 0.05}>
                    <Link to={`/tools/${rt.slug}`} onClick={handleReset}>
                      <motion.div
                        whileHover={{ y: -4, scale: 1.03 }}
                        className="rounded-xl border border-white/[0.07] bg-[#111118] p-4 text-center transition-all hover:border-primary/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                      >
                        <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: getCatColor(rt.category).bg }}>
                          <ToolIcon iconName={rt.icon} size={18} color={getCatColor(rt.category).color} />
                        </div>
                        <p className="font-display text-xs font-semibold text-white/80">{rt.name}</p>
                      </motion.div>
                    </Link>
                  </FadeInView>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ToolPage;
