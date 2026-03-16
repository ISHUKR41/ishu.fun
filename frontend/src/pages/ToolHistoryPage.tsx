/**
 * ToolHistoryPage.tsx — PDF Tool Usage History
 * 
 * Real tool usage data from user's toolHistory in MongoDB.
 * Design: Linear-inspired table view with stats summary.
 * Features:
 * - Stats summary: total tools used, most used, success rate
 * - Table view: tool name, date, status, file count
 * - Empty state with CTA
 * - GSAP stagger animations
 */

import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import gsap from "gsap";
import {
  History, Wrench, CheckCircle, XCircle, FileText,
  ArrowRight, Loader2, Clock, Merge, Scissors, Lock,
  FileImage, RotateCw, FileType, Type, Image
} from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import CountUp from "react-countup";

// Tool icon mapping
const toolIconMap: Record<string, { icon: any; color: string }> = {
  merge: { icon: Merge, color: "text-blue-400" },
  split: { icon: Scissors, color: "text-violet-400" },
  protect: { icon: Lock, color: "text-red-400" },
  "pdf-to-image": { icon: FileImage, color: "text-emerald-400" },
  rotate: { icon: RotateCw, color: "text-amber-400" },
  "pdf-to-word": { icon: FileType, color: "text-cyan-400" },
  "add-text": { icon: Type, color: "text-pink-400" },
  "image-to-pdf": { icon: Image, color: "text-teal-400" },
};

const ToolHistoryPage = () => {
  const { profile, isLoading } = useUserProfile();
  const listRef = useRef<HTMLDivElement>(null);

  // GSAP entrance
  useEffect(() => {
    if (!listRef.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".stat-mini",
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, delay: 0.2, ease: "power2.out", clearProps: "all" }
      );
      gsap.fromTo(".history-row",
        { x: -15, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.04, delay: 0.5, ease: "power2.out", clearProps: "all" }
      );
    }, listRef);
    return () => ctx.revert();
  }, [isLoading]);

  // Compute stats from real data
  const toolHistory = useMemo(() => {
    return (profile?.toolHistory || []).slice().reverse(); // Most recent first
  }, [profile?.toolHistory]);

  const stats = useMemo(() => {
    const total = toolHistory.length;
    const successCount = toolHistory.filter((t: any) => t.success).length;
    const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;

    // Most used tool
    const toolCounts: Record<string, number> = {};
    for (const t of toolHistory) {
      const id = (t as any).toolId || "unknown";
      toolCounts[id] = (toolCounts[id] || 0) + 1;
    }
    const mostUsed = Object.entries(toolCounts).sort((a, b) => b[1] - a[1])[0];
    const totalFiles = toolHistory.reduce((s: number, t: any) => s + (t.fileCount || 1), 0);

    return {
      total,
      successRate,
      mostUsedTool: mostUsed ? mostUsed[0] : null,
      mostUsedCount: mostUsed ? mostUsed[1] : 0,
      totalFiles,
    };
  }, [toolHistory]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-400" />
          <p className="text-sm text-white/40">Loading tool history...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={listRef} className="max-w-4xl mx-auto px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20">
            <History size={20} className="text-white" />
          </div>
          Tool History
        </h1>
        <p className="text-sm text-white/40 mt-1">Your PDF tool usage log</p>
      </motion.div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total Uses", value: stats.total, color: "from-blue-500 to-cyan-500", icon: Wrench },
          { label: "Files Processed", value: stats.totalFiles, color: "from-violet-500 to-purple-500", icon: FileText },
          { label: "Success Rate", value: stats.successRate, suffix: "%", color: "from-emerald-500 to-green-500", icon: CheckCircle },
          { label: "Most Used", value: stats.mostUsedCount, subLabel: stats.mostUsedTool?.replace(/-/g, " ") || "—", color: "from-amber-500 to-orange-500", icon: History },
        ].map((s, i) => (
          <div key={i} className="stat-mini rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 relative overflow-hidden">
            <div className={`absolute top-0 right-0 h-16 w-16 rounded-full blur-2xl opacity-15 bg-gradient-to-br ${s.color}`} />
            <s.icon size={14} className="text-white/25 mb-2" />
            <p className="text-[10px] text-white/35 uppercase tracking-wider font-medium">{s.label}</p>
            <p className="text-xl font-bold text-white mt-0.5">
              <CountUp end={s.value} duration={1.5} enableScrollSpy scrollSpyOnce />
              {s.suffix || ""}
            </p>
            {s.subLabel && <p className="text-[10px] text-white/25 mt-0.5 capitalize">{s.subLabel}</p>}
          </div>
        ))}
      </div>

      {/* Tool history table */}
      {toolHistory.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.04] bg-white/[0.02] p-16 text-center"
        >
          <Clock size={48} className="text-white/10 mb-4" />
          <p className="text-sm font-medium text-white/40">No tools used yet</p>
          <p className="text-xs text-white/20 mt-1 mb-4">Start using PDF tools and your history will appear here</p>
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            Explore Tools <ArrowRight size={14} />
          </Link>
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-white/[0.06] text-[10px] font-medium text-white/30 uppercase tracking-wider">
            <div className="col-span-5">Tool</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-2">Files</div>
            <div className="col-span-2">Status</div>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-white/[0.03]">
            {toolHistory.map((entry: any, i: number) => {
              const tool = toolIconMap[entry.toolId] || { icon: Wrench, color: "text-white/40" };
              const ToolIcon = tool.icon;
              return (
                <div key={entry._id || i} className="history-row grid grid-cols-12 gap-2 items-center px-4 py-3 hover:bg-white/[0.03] transition-all">
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                      <ToolIcon size={14} className={tool.color} />
                    </div>
                    <span className="text-sm font-medium text-white/75 truncate">
                      {entry.toolName || entry.toolId?.replace(/-/g, " ") || "Unknown"}
                    </span>
                  </div>
                  <div className="col-span-3 text-xs text-white/35">
                    {entry.usedAt ? new Date(entry.usedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </div>
                  <div className="col-span-2 text-xs text-white/35">
                    {entry.fileCount || 1} file{(entry.fileCount || 1) > 1 ? "s" : ""}
                  </div>
                  <div className="col-span-2">
                    {entry.success ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 rounded-full px-2 py-0.5">
                        <CheckCircle size={10} /> Done
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-400 bg-red-500/10 rounded-full px-2 py-0.5">
                        <XCircle size={10} /> Failed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolHistoryPage;
