/**
 * BookmarksPage.tsx — Saved Items / Bookmarks Page
 * 
 * Real bookmarks from MongoDB via useBookmarks hook.
 * Design: Premium dark UI with tabbed view + masonry-style grid.
 * Features:
 * - 5 tabs: All, Results, News, Blogs, Tools
 * - Card view with thumbnail, title, source, date
 * - Remove bookmark with confirmation
 * - Empty state per tab
 * - GSAP stagger animations
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import {
  Bookmark, FileText, Newspaper, BookOpen, Wrench, Briefcase,
  Trash2, ExternalLink, Loader2, BookmarkX, Search
} from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";

const tabs = [
  { id: "", label: "All", icon: Bookmark, color: "from-blue-500 to-cyan-500" },
  { id: "result", label: "Results", icon: FileText, color: "from-emerald-500 to-green-500" },
  { id: "news", label: "News", icon: Newspaper, color: "from-violet-500 to-purple-500" },
  { id: "blog", label: "Blogs", icon: BookOpen, color: "from-amber-500 to-orange-500" },
  { id: "tool", label: "Tools", icon: Wrench, color: "from-rose-500 to-pink-500" },
  { id: "vacancy", label: "Vacancies", icon: Briefcase, color: "from-teal-500 to-cyan-500" },
];

const BookmarksPage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);

  const [activeTab, setActiveTab] = useState("");
  const [search, setSearch] = useState("");
  const { bookmarks, isLoading, removeBookmark, isRemoving } = useBookmarks(activeTab || undefined);
  const gridRef = useRef<HTMLDivElement>(null);

  // GSAP entrance
  useEffect(() => {
    if (!gridRef.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".bookmark-card",
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, delay: 0.2, ease: "power2.out", clearProps: "all" }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [isLoading, activeTab]);

  // Filter by search
  const filtered = search
    ? bookmarks.filter((b: any) => b.title?.toLowerCase().includes(search.toLowerCase()))
    : bookmarks;

  const handleRemove = async (itemId: string) => {
    try {
      await removeBookmark(itemId);
    } catch (e) {
      console.error("Failed to remove bookmark:", e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-400" />
          <p className="text-sm text-white/40">Loading saved items...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={gridRef} className="max-w-5xl mx-auto px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
      {/* Background Image for Bookmarks (Fixed to viewport) */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/20">
            <Bookmark size={20} className="text-white" />
          </div>
          Saved Items
        </h1>
        <p className="text-sm text-white/40 mt-1">Your bookmarked results, news, and tools</p>
      </motion.div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookmarks..."
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "text-white bg-white/[0.08] border border-white/[0.1]"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bookmarks grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.04] bg-white/[0.02] p-16 text-center"
        >
          <BookmarkX size={48} className="text-white/10 mb-4" />
          <p className="text-sm font-medium text-white/40">No saved items</p>
          <p className="text-xs text-white/20 mt-1">
            Bookmark results, news, and tools to find them here later
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((bm: any) => {
              const tabConfig = tabs.find(t => t.id === bm.type) || tabs[0];
              const TabIcon = tabConfig.icon;
              return (
                <motion.div
                  key={bm.itemId || bm._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  className="bookmark-card group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
                >
                  {/* Thumbnail or gradient */}
                  {bm.thumbnail ? (
                    <div className="h-32 w-full overflow-hidden">
                      <img src={bm.thumbnail} alt={bm.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className={`h-20 w-full bg-gradient-to-br ${tabConfig.color} opacity-20`} />
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] font-medium text-white/40 uppercase tracking-wider`}>
                            <TabIcon size={9} />
                            {bm.type}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-white/85 line-clamp-2">{bm.title}</p>
                        <p className="text-[10px] text-white/25 mt-2">
                          Saved {new Date(bm.savedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
                      {bm.url && (
                        <a
                          href={bm.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium text-white/50 hover:bg-white/[0.08] hover:text-white/80 transition-all"
                        >
                          <ExternalLink size={10} /> Open
                        </a>
                      )}
                      <button
                        onClick={() => handleRemove(bm.itemId)}
                        disabled={isRemoving}
                        className="flex items-center gap-1.5 rounded-lg bg-red-500/[0.04] px-3 py-1.5 text-[10px] font-medium text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-all ml-auto"
                      >
                        <Trash2 size={10} /> Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
