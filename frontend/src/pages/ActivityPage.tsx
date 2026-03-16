/**
 * ActivityPage.tsx — User Activity Timeline
 * 
 * Real activity data from MongoDB via API.
 * Design: GitHub-inspired activity timeline with icons and colors.
 * Features:
 * - Timeline view grouped by date
 * - Activity types: tool used, bookmark added, exam tracked, account created
 * - Animated entrance with GSAP
 * - Paginated loading
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  Activity, Wrench, Bookmark, GraduationCap, Shield,
  Loader2, Clock, ChevronRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://ishu-site.onrender.com";

const typeIcons: Record<string, { icon: any; color: string; bg: string }> = {
  tool_used: { icon: Wrench, color: "text-blue-400", bg: "bg-blue-500/10" },
  bookmark_added: { icon: Bookmark, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  exam_tracked: { icon: GraduationCap, color: "text-amber-400", bg: "bg-amber-500/10" },
  account: { icon: Shield, color: "text-violet-400", bg: "bg-violet-500/10" },
};

const getRelativeTime = (date: string | Date) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
};

// Group activities by date
const groupByDay = (items: any[]) => {
  const groups: Record<string, any[]> = {};
  for (const item of items) {
    const key = new Date(item.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return Object.entries(groups);
};

const ActivityPage = () => {
  const { getToken, isSignedIn } = useClerkAuth();
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["activity", page],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await axios.get(`${API_BASE}/api/user/activity?page=${page}&limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!isSignedIn,
    staleTime: 60 * 1000,
  });

  // GSAP entrance
  useEffect(() => {
    if (!listRef.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".activity-item",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.04, delay: 0.2, ease: "power2.out", clearProps: "all" }
      );
    }, listRef);
    return () => ctx.revert();
  }, [isLoading]);

  const activities = data?.activities || [];
  const grouped = groupByDay(activities);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-400" />
          <p className="text-sm text-white/40">Loading activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={listRef} className="max-w-3xl mx-auto px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20">
            <Activity size={20} className="text-white" />
          </div>
          Activity
        </h1>
        <p className="text-sm text-white/40 mt-1">Your complete activity timeline</p>
      </motion.div>

      {/* Activity timeline */}
      {activities.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.04] bg-white/[0.02] p-16 text-center"
        >
          <Clock size={48} className="text-white/10 mb-4" />
          <p className="text-sm font-medium text-white/40">No activity yet</p>
          <p className="text-xs text-white/20 mt-1">Start using tools and your activity will appear here</p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([dateLabel, items]) => (
            <div key={dateLabel}>
              <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3 ml-1">{dateLabel}</p>
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[17px] top-2 bottom-2 w-px bg-white/[0.06]" />

                <div className="space-y-1">
                  {items.map((act: any, i: number) => {
                    const config = typeIcons[act.type] || typeIcons.account;
                    const Icon = config.icon;
                    return (
                      <div
                        key={act.id || i}
                        className="activity-item group flex items-start gap-4 rounded-xl p-2.5 hover:bg-white/[0.03] transition-all relative"
                      >
                        {/* Timeline dot */}
                        <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg} ring-4 ring-[hsl(225,50%,5%)]`}>
                          <Icon size={14} className={config.color} />
                        </div>

                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white/80 truncate">{act.title}</p>
                            {act.success === false && (
                              <span className="text-[9px] font-medium text-red-400 bg-red-500/10 rounded-full px-1.5 py-0.5">Failed</span>
                            )}
                          </div>
                          <p className="text-xs text-white/30 mt-0.5">{act.detail}</p>
                        </div>

                        <span className="text-[10px] text-white/20 shrink-0 mt-1">
                          {getRelativeTime(act.createdAt)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Load more */}
          {data?.totalPages > page && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-xs font-medium text-white/50 hover:bg-white/[0.08] hover:text-white transition-all"
              >
                Load More <ChevronRight size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
