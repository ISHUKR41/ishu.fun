/**
 * NotificationsPage.tsx — Full Notification Center
 * 
 * Real notifications computed from user's activity data via API.
 * Design: Vercel/Linear-inspired dark premium notification center.
 * Features:
 * - Grouped by date (Today, Yesterday, Earlier)
 * - Filter by type (all, exam, tool, badge, system)
 * - Mark all as read
 * - Empty state with animation
 * - GSAP stagger entrance animations
 */

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import {
  Bell, GraduationCap, Wrench, Trophy, Shield, Megaphone,
  CheckCircle, Filter, Loader2, BellOff
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";

// Notification type icon + color mapping
const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  exam_alert: { icon: GraduationCap, color: "text-blue-400", bg: "bg-blue-500/10", label: "Exam" },
  tool_update: { icon: Wrench, color: "text-violet-400", bg: "bg-violet-500/10", label: "Tool" },
  badge_earned: { icon: Trophy, color: "text-amber-400", bg: "bg-amber-500/10", label: "Badge" },
  security: { icon: Shield, color: "text-red-400", bg: "bg-red-500/10", label: "Security" },
  welcome: { icon: Megaphone, color: "text-emerald-400", bg: "bg-emerald-500/10", label: "System" },
};

const filterTabs = [
  { id: "all", label: "All" },
  { id: "exam_alert", label: "Exams" },
  { id: "tool_update", label: "Tools" },
  { id: "badge_earned", label: "Badges" },
  { id: "welcome", label: "System" },
];

// Group notifications by date
const groupByDate = (items: any[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: { label: string; items: any[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Earlier", items: [] },
  ];

  for (const item of items) {
    const d = new Date(item.createdAt);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() >= today.getTime()) groups[0].items.push(item);
    else if (d.getTime() >= yesterday.getTime()) groups[1].items.push(item);
    else groups[2].items.push(item);
  }

  return groups.filter(g => g.items.length > 0);
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
  return then.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

const NotificationsPage = () => {
  const {
    notifications, unreadCount, isLoading, markAsRead, markAllAsRead
  } = useNotifications();
  const [activeFilter, setActiveFilter] = useState("all");
  const listRef = useRef<HTMLDivElement>(null);

  // GSAP entrance
  useEffect(() => {
    if (!listRef.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".notif-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, delay: 0.2, ease: "power2.out", clearProps: "all" }
      );
    }, listRef);
    return () => ctx.revert();
  }, [isLoading, activeFilter]);

  const filtered = activeFilter === "all" ? notifications : notifications.filter((n: any) => n.type === activeFilter);
  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);

  // Handler: mark all as read
  const handleMarkAllRead = async () => {
    const unreadIds = notifications
      .filter((n: any) => !n.isRead)
      .map((n: any) => n._id || n.id);
    if (unreadIds.length === 0) return;
    try {
      await markAllAsRead(unreadIds);
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  // Handler: mark single notification as read
  const handleMarkRead = async (notifId: string, isRead: boolean) => {
    if (isRead) return;
    try {
      await markAsRead(notifId);
    } catch {
      // Silently fail — not critical
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-400" />
          <p className="text-sm text-white/40">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={listRef} className="max-w-3xl mx-auto px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
      {/* Background Image for Notifications (Fixed to viewport) */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/20">
                <Bell size={20} className="text-white" />
              </div>
              Notifications
            </h1>
            <p className="text-sm text-white/40 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/60 hover:bg-white/[0.08] hover:text-white transition-all"
            >
              <CheckCircle size={13} /> Mark all read
            </button>
          )}
        </div>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`relative rounded-lg px-4 py-2 text-xs font-medium whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? "text-white bg-white/[0.08] border border-white/[0.1]"
                : "text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {grouped.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.04] bg-white/[0.02] p-16 text-center"
        >
          <BellOff size={48} className="text-white/10 mb-4" />
          <p className="text-sm font-medium text-white/40">No notifications yet</p>
          <p className="text-xs text-white/20 mt-1">
            Start using tools and tracking exams to receive notifications
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3 ml-1">{group.label}</p>
              <div className="space-y-2">
                {group.items.map((notif: any) => {
                  const config = typeConfig[notif.type] || typeConfig.welcome;
                  const Icon = config.icon;
                  const notifId = notif._id || notif.id;
                  return (
                    <div
                      key={notifId}
                      onClick={() => handleMarkRead(notifId, notif.isRead)}
                      className={`notif-card group flex items-start gap-4 rounded-xl border p-4 transition-all duration-200 hover:bg-white/[0.04] cursor-pointer ${
                        notif.isRead
                          ? "border-white/[0.04] bg-white/[0.01]"
                          : "border-blue-500/20 bg-blue-500/[0.03]"
                      }`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                        <Icon size={16} className={config.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white/85 truncate">{notif.title}</p>
                          {!notif.isRead && (
                            <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-white/35 mt-0.5 line-clamp-2">{notif.body}</p>
                      </div>
                      <span className="text-[10px] text-white/20 shrink-0 whitespace-nowrap mt-0.5">
                        {getRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
