/**
 * DashboardPage.tsx — Main User Dashboard
 * 
 * ALL DATA fetched from backend API via useUserProfile hook.
 * NO demo/placeholder data — shows real user stats, real activity, real tools used.
 * 
 * Design: Vercel/Linear-inspired premium dark dashboard
 * Features:
 * - Time-of-day greeting with real user name from Clerk/MongoDB
 * - 6 stat cards showing REAL data from user.stats (MongoDB)
 * - Quick launch grid for PDF tools (these are real tool links)
 * - Recent activity feed from user.toolHistory (MongoDB)
 * - GSAP stagger animations on entrance
 */

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import Tilt from "react-parallax-tilt";
import gsap from "gsap";
import {
  Wrench, FileText, Newspaper, GraduationCap, Flame, Trophy,
  ArrowRight, Scissors, FileImage, Lock, FileType,
  Merge, RotateCw, Type, Image, Loader2, Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

// ──── Stats card config (icons + labels + colors — values come from API) ────
const statsConfig = [
  { key: "toolsUsed", icon: Wrench, label: "Tools Used", color: "from-blue-500 to-cyan-500", shadowColor: "shadow-blue-500/20" },
  { key: "pdfProcessed", icon: FileText, label: "PDFs Processed", color: "from-violet-500 to-purple-500", shadowColor: "shadow-violet-500/20" },
  { key: "newsRead", icon: Newspaper, label: "News Read", color: "from-emerald-500 to-green-500", shadowColor: "shadow-emerald-500/20" },
  { key: "examsTracked", icon: GraduationCap, label: "Exams Tracked", color: "from-amber-500 to-orange-500", shadowColor: "shadow-amber-500/20" },
  { key: "loginStreak", icon: Flame, label: "Login Streak", color: "from-rose-500 to-pink-500", shadowColor: "shadow-rose-500/20", suffix: "🔥" },
  { key: "points", icon: Trophy, label: "Points", color: "from-yellow-500 to-amber-500", shadowColor: "shadow-yellow-500/20" },
] as const;

// ──── Quick launch tools (real tool routes that exist in the app) ────
const quickTools = [
  { icon: Merge, label: "Merge PDF", href: "/tools/merge", color: "text-blue-400" },
  { icon: Scissors, label: "Split PDF", href: "/tools/split", color: "text-violet-400" },
  { icon: Lock, label: "Protect PDF", href: "/tools/protect", color: "text-red-400" },
  { icon: FileImage, label: "PDF to Image", href: "/tools/pdf-to-image", color: "text-emerald-400" },
  { icon: RotateCw, label: "Rotate PDF", href: "/tools/rotate", color: "text-amber-400" },
  { icon: FileType, label: "PDF to Word", href: "/tools/pdf-to-word", color: "text-cyan-400" },
  { icon: Type, label: "Add Text", href: "/tools/add-text", color: "text-pink-400" },
  { icon: Image, label: "Image to PDF", href: "/tools/image-to-pdf", color: "text-teal-400" },
];

// Tool icon mapping for activity feed
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

// ──── Get greeting based on time ────
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

// ──── Format relative time ────
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
  return then.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

const DashboardPage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);

  const { user } = useAuth();
  const { profile, stats, isLoading, statsLoading } = useUserProfile();
  const gridRef = useRef<HTMLDivElement>(null);

  // GSAP stagger entrance for stat cards
  useEffect(() => {
    if (!gridRef.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".stat-card",
        { y: 60, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, delay: 0.3, ease: "power3.out", clearProps: "all" }
      );
      gsap.fromTo(".quick-tool",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.8, ease: "power2.out", clearProps: "all" }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [isLoading]);

  // Real user name from profile (MongoDB) → Clerk → email fallback
  const displayName = profile?.firstName
    ? `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ""}`
    : user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  // Real tool history from profile (MongoDB)
  const recentActivity = (profile?.toolHistory || [])
    .slice(-10) // Last 10 activities
    .reverse(); // Most recent first

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-400" />
          <p className="text-sm text-white/40">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="px-3 py-6 sm:px-4 sm:py-8 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Dynamic Background Image for Dashboard (Fixed to viewport) */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2072&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* ──── Welcome Hero ──── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm px-4 py-1.5 mb-4">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-white/50">Online</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
          {getGreeting()},{" "}
          <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            {displayName}
          </span>
        </h1>
        <p className="mt-2 text-base text-white/40 max-w-lg">
          Here's what's happening with your account today. Explore your tools, track exams, and stay updated.
        </p>
      </motion.div>

      {/* ──── Stats Grid (REAL data from API) ──── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {statsConfig.map((cfg) => {
          const value = stats?.[cfg.key] ?? 0; // Real value from MongoDB
          return (
            <Tilt
              key={cfg.key}
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              glareEnable
              glareMaxOpacity={0.06}
              glareColor="#60a5fa"
              glareBorderRadius="16px"
              scale={1.02}
            >
              <div className="stat-card group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]">
                <div className={`absolute top-0 right-0 h-24 w-24 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${cfg.color}`} />
                <div className="relative z-10">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cfg.color} ${cfg.shadowColor} shadow-lg mb-3 transition-transform duration-300 group-hover:scale-110`}>
                    <cfg.icon size={20} className="text-white" />
                  </div>
                  <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">{cfg.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">
                      {statsLoading ? (
                        <span className="inline-block h-7 w-12 animate-pulse rounded bg-white/[0.06]" />
                      ) : (
                        <CountUp end={value} duration={2} enableScrollSpy scrollSpyOnce />
                      )}
                    </span>
                    {"suffix" in cfg && cfg.suffix && <span className="text-lg">{cfg.suffix}</span>}
                  </div>
                </div>
              </div>
            </Tilt>
          );
        })}
      </div>

      {/* ──── Quick Launch Tools (real app tool routes) ──── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">Quick Launch</h2>
          <Link to="/tools" className="flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors group">
            All Tools <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {quickTools.map((tool) => (
            <Link
              key={tool.label}
              to={tool.href}
              className="quick-tool group flex flex-col items-center gap-2 sm:gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 sm:p-4 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.05] hover:scale-[1.03]"
            >
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/[0.04] transition-all group-hover:bg-white/[0.08] group-hover:scale-110">
                <tool.icon size={18} className={`sm:w-5 sm:h-5 ${tool.color} transition-all`} />
              </div>
              <span className="text-[11px] font-medium text-white/50 text-center group-hover:text-white/80 transition-colors">{tool.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ──── Recent Activity (REAL data from user.toolHistory in MongoDB) ──── */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-5">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.04] bg-white/[0.02] p-10 text-center">
            <Clock size={32} className="text-white/15 mb-3" />
            <p className="text-sm font-medium text-white/40">No activity yet</p>
            <p className="text-xs text-white/25 mt-1">Start using PDF tools and your activity will appear here</p>
            <Link to="/tools" className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600/20 px-4 py-2 text-xs font-medium text-blue-400 hover:bg-blue-600/30 transition-all">
              Explore Tools <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity: any, i: number) => {
              const toolInfo = toolIconMap[activity.toolId] || { icon: Wrench, color: "text-white/40" };
              const ActivityIcon = toolInfo.icon;
              return (
                <motion.div
                  key={activity._id || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                    <ActivityIcon size={16} className={toolInfo.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 truncate">
                      Used {activity.toolName || activity.toolId}
                      {activity.fileCount > 1 ? ` (${activity.fileCount} files)` : ""}
                    </p>
                    <p className="text-xs text-white/30">
                      {activity.success ? "✓ Completed" : "✗ Failed"}
                    </p>
                  </div>
                  <span className="text-xs text-white/25 shrink-0">
                    {activity.usedAt ? getRelativeTime(activity.usedAt) : ""}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ──── Upgrade CTA ──── */}
      {profile?.subscription?.plan === "free" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-purple-600/10 p-4 sm:p-6 lg:p-8"
        >
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl opacity-30 bg-gradient-to-br from-blue-500 to-violet-500" />
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-2">Unlock Premium Features</h3>
            <p className="text-sm text-white/40 max-w-md mb-4">
              Get unlimited PDF processing, priority WhatsApp alerts, advanced exam analytics, and more with ISHU Pro.
            </p>
            <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-[1.02]">
              Upgrade to Pro <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage;
