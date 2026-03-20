/**
 * ToolPage.tsx - Individual PDF Tool Page (392 lines)
 * 
 * The actual tool interface where users can upload files and process them.
 * The tool slug from the URL determines which tool is shown.
 * 
 * Flow:
 * 1. User uploads file(s) via drag-and-drop or file picker
 * 2. Tool options panel shows (if applicable) - like quality, format, etc.
 * 3. User clicks "Process" - file is processed in the browser
 * 4. Progress bar shows processing status
 * 5. Download button appears when done
 * 
 * Features:
 * - Drag and drop file upload with visual feedback
 * - File type validation based on tool requirements
 * - Progress bar during processing
 * - Error handling with user-friendly messages
 * - Tool-specific options panel (ToolOptionsPanel component)
 * - All processing happens client-side (files never leave the browser)
 */
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Upload, FileText, Download, CheckCircle, ArrowLeft, Loader2, X, ArrowRight, AlertCircle } from "lucide-react";
import { allToolsData } from "@/data/tools-data";
import ToolIcon from "@/components/tools/ToolIcon";
import ToolOptionsPanel from "@/components/tools/ToolOptionsPanel";
import { Progress } from "@/components/ui/progress";
import { processFiles, downloadResult, getAcceptedTypes, isCreateTool, needsMultipleFiles, type ProcessResult, type ToolOptions } from "@/lib/pdf-processor";

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
            <Link to="/tools" className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
              <ArrowLeft size={14} /> Back to Tools
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isCreate = isCreateTool(toolSlug!);
  const acceptTypes = getAcceptedTypes(toolSlug!);
  const multiFiles = needsMultipleFiles(toolSlug!);

  const toAcceptedExtList = (accept: string) =>
    accept
      .split(",")
      .map((ext) => ext.trim().toLowerCase())
      .filter(Boolean);

  const validateIncomingFiles = (incomingFiles: File[]) => {
    const maxSizeBytes = 20 * 1024 * 1024;
    const acceptedList = acceptTypes === "*" ? [] : toAcceptedExtList(acceptTypes);

    const valid: File[] = [];

    incomingFiles.forEach((file) => {
      if (file.size > maxSizeBytes) {
        setError(`\"${file.name}\" is larger than 20MB.`);
        return;
      }

      if (acceptedList.length > 0) {
        const ext = file.name.includes(".") ? `.${file.name.split(".").pop()!.toLowerCase()}` : "";
        if (!acceptedList.includes(ext)) {
          setError(`\"${file.name}\" is not supported for this tool.`);
          return;
        }
      }

      valid.push(file);
    });

    return valid;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setError(null);

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
    setProcessing(true);
    setProgressValue(6);
    setError(null);
    try {
      const res = await processFiles(toolSlug!, files, optionsRef.current);
      setResult(res);
      setProgressValue(100);
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Processing failed. Please try again.");
      setProgressValue(0);
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateProcess = async () => {
    setProcessing(true);
    setProgressValue(6);
    setError(null);
    try {
      const res = await processFiles(toolSlug!, [], optionsRef.current);
      setResult(res);
      setProgressValue(100);
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Processing failed.");
      setProgressValue(0);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result) downloadResult(result);
  };

  const handleReset = () => {
    setFiles([]);
    setDone(false);
    setProcessing(false);
    setProgressValue(0);
    setResult(null);
    setError(null);
  };

  const originalSize = files.reduce((sum, f) => sum + f.size, 0);
  const resultSize = result?.blob.size || 0;

  return (
    <Layout>
      {/* Dynamic Background Image for ToolPage (Fixed to viewport) */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=2074&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* Header */}
      <section className="bg-gradient-hero pt-6 pb-12">
        <div className="container">
          <FadeInView>
            <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft size={14} /> All Tools
            </Link>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">ISHU</span> — Indian StudentHub University
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              {tool.name}
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">{tool.desc}</p>
            <span className="mt-3 inline-block rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {tool.category}
            </span>
          </FadeInView>
        </div>
      </section>

      {/* Tool Area */}
      <section className="py-12">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            {!done ? (
              <FadeInView>
                {/* Create tools don't need file upload */}
                {isCreate ? (
                  <div className="space-y-4">
                    <ToolOptionsPanel toolSlug={toolSlug!} onChange={handleOptionsChange} />
                    <button
                      onClick={handleCreateProcess}
                      disabled={processing}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-50"
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
                        <p className="text-xs text-muted-foreground">Preparing output... {Math.round(progressValue)}%</p>
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
                      className={`rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
                        dragOver ? "border-primary bg-primary/5" : "border-border bg-card"
                      }`}
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                      >
                        <Upload size={32} className="text-primary" />
                      </motion.div>
                      <p className="font-display text-lg font-semibold text-foreground">
                        {multiFiles ? "Drop your files here" : "Drop your file here"}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        or click to browse • Accepted: {acceptTypes === '*' ? 'All files' : acceptTypes}
                      </p>
                      <label className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow">
                        <Upload size={16} /> Select File{multiFiles ? 's' : ''}
                        <input
                          type="file"
                          multiple={multiFiles}
                          className="hidden"
                          onChange={handleFileInput}
                          accept={acceptTypes}
                        />
                      </label>
                    </div>

                    {/* Tool Options */}
                    {files.length > 0 && (
                      <div className="mt-4">
                        <ToolOptionsPanel toolSlug={toolSlug!} onChange={handleOptionsChange} />
                      </div>
                    )}

                    {/* Error */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
                      >
                        <AlertCircle size={18} />
                        {error}
                      </motion.div>
                    )}

                    {/* File List */}
                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {files.map((file, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                          >
                            <div className="flex items-center gap-3">
                              <FileText size={20} className="text-primary" />
                              <div>
                                <p className="text-sm font-medium text-foreground">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                            <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
                              <X size={16} />
                            </button>
                          </motion.div>
                        ))}

                        <button
                          onClick={handleProcess}
                          disabled={processing}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:opacity-50"
                        >
                          {processing ? (
                            <><Loader2 size={18} className="animate-spin" /> Processing your file{files.length > 1 ? 's' : ''}...</>
                          ) : (
                            <>Process {files.length} file{files.length > 1 ? "s" : ""} <ArrowRight size={16} /></>
                          )}
                        </button>
                        {processing && (
                          <div className="space-y-2">
                            <Progress value={progressValue} />
                            <p className="text-xs text-muted-foreground">Processing... {Math.round(progressValue)}%</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </FadeInView>
            ) : (
              <FadeInView>
                <div className="rounded-2xl border border-border bg-card p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
                  >
                    <CheckCircle size={40} className="text-success" />
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold text-foreground">Done!</h2>
                  <p className="mt-2 text-muted-foreground">
                    Your file has been processed successfully.
                  </p>
                  {originalSize > 0 && resultSize > 0 && (
                    <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <span>Original: {(originalSize / 1024).toFixed(1)} KB</span>
                      <ArrowRight size={12} />
                      <span className="font-semibold text-primary">Output: {(resultSize / 1024).toFixed(1)} KB</span>
                    </div>
                  )}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-display text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow"
                    >
                      <Download size={16} /> Download {result?.filename}
                    </button>
                    <button onClick={handleReset} className="rounded-xl border border-border px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                      Process Another File
                    </button>
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">All processing done locally — your files never leave your device</p>
                </div>
              </FadeInView>
            )}
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="mt-16">
              <FadeInView>
                <h3 className="font-display text-xl font-bold text-foreground">Related Tools</h3>
              </FadeInView>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {relatedTools.map((rt, i) => (
                  <FadeInView key={rt.slug} delay={i * 0.05}>
                    <Link to={`/tools/${rt.slug}`} onClick={handleReset}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/30"
                      >
                        <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <ToolIcon iconName={rt.icon} size={16} />
                        </div>
                        <p className="mt-1 font-display text-xs font-semibold text-foreground">{rt.name}</p>
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
