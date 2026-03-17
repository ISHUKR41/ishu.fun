/**
 * useDynamicFavicon.ts - Dynamic Browser Tab Icon & Title
 * 
 * Changes the browser tab favicon and page title based on current page.
 * Titles are SEO-optimized with keywords for ishu.fun ranking.
 * Brand: ISHU — Indian StudentHub University
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const faviconMap: Record<string, { emoji: string; bg: string }> = {
  "/": { emoji: "🎓", bg: "#3b82f6" },
  "/results": { emoji: "📊", bg: "#10b981" },
  "/tools": { emoji: "🛠️", bg: "#8b5cf6" },
  "/tools/youtube-downloader": { emoji: "▶️", bg: "#ff0000" },
  "/tools/terabox-downloader": { emoji: "☁️", bg: "#0ea5e9" },
  "/tools/universal-video-downloader": { emoji: "📥", bg: "#f97316" },
  "/news": { emoji: "📰", bg: "#f59e0b" },
  "/test": { emoji: "📝", bg: "#06b6d4" },
  "/blog": { emoji: "✍️", bg: "#ec4899" },
  "/about": { emoji: "💡", bg: "#6366f1" },
  "/contact": { emoji: "📬", bg: "#14b8a6" },
  "/tv": { emoji: "📺", bg: "#ef4444" },
  "/cv": { emoji: "📄", bg: "#8b5cf6" },
  "/cv/resume": { emoji: "📋", bg: "#3b82f6" },
  "/cv/bio-data": { emoji: "👤", bg: "#ec4899" },
  "/admin": { emoji: "⚙️", bg: "#ef4444" },
  "/auth/signin": { emoji: "🔐", bg: "#f97316" },
  "/auth/signup": { emoji: "🚀", bg: "#8b5cf6" },
  "/privacy": { emoji: "🛡️", bg: "#64748b" },
  "/terms": { emoji: "📜", bg: "#64748b" },
  "/dashboard": { emoji: "📊", bg: "#3b82f6" },
  "/profile": { emoji: "👤", bg: "#6366f1" },
  "/settings": { emoji: "⚙️", bg: "#64748b" },
  "/saved": { emoji: "🔖", bg: "#f59e0b" },
  "/tracker": { emoji: "📅", bg: "#10b981" },
};

const titleMap: Record<string, string> = {
  "/": "ISHU — Indian StudentHub University | #1 Government Exam Results, Free PDF Tools & Video Downloader",
  "/results": "Government Exam Results 2025-2026 | Sarkari Result, Vacancies, Admit Cards — ISHU",
  "/tools": "100+ Free PDF Tools Online — Merge, Compress, Convert PDF | ISHU",
  "/tools/youtube-downloader": "YouTube Video Downloader HD Free — Download Videos Online | ISHU",
  "/tools/terabox-downloader": "Terabox Video Downloader Free — Download Files Online | ISHU",
  "/tools/universal-video-downloader": "Universal Video Downloader — Download from Any Site Free | ISHU",
  "/news": "Latest News India 2026 — Breaking News Hindi English | ISHU",
  "/test": "Free Practice Tests — Mock Test Series for Competitive Exams | ISHU",
  "/blog": "ISHU Blog — Exam Preparation Tips, Study Guides & Success Stories",
  "/about": "About ISHU — India's #1 Free Educational Platform for Students",
  "/contact": "Contact ISHU — Support, Feedback & Partnerships",
  "/tv": "700+ Live Indian TV Channels Free — Watch Live TV Online | ISHU",
  "/cv": "Free CV Maker — Create Professional CV, Resume & Bio-Data | ISHU",
  "/cv/resume": "Free Resume Builder — Professional Resume Templates PDF | ISHU",
  "/cv/bio-data": "Free Bio-Data Maker — Marriage & Job Bio-Data Templates | ISHU",
  "/admin": "Admin Panel — ISHU",
  "/auth/signin": "Sign In — ISHU",
  "/auth/signup": "Create Account — ISHU",
  "/privacy": "Privacy Policy — ISHU (ishu.fun)",
  "/terms": "Terms of Service — ISHU (ishu.fun)",
  "/dashboard": "Dashboard — ISHU",
  "/profile": "My Profile — ISHU",
  "/settings": "Settings — ISHU",
  "/saved": "Saved Bookmarks — ISHU",
  "/tracker": "Exam Tracker — ISHU",
  "/notifications": "Notifications — ISHU",
  "/activity": "Activity History — ISHU",
};

function generateFaviconSvg(emoji: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="${bg}"/>
    <text x="32" y="44" font-size="36" text-anchor="middle" font-family="Arial,sans-serif">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function useDynamicFavicon() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const matchedKey =
      Object.keys(faviconMap).find((k) => k === path) ||
      Object.keys(faviconMap).find((k) => k !== "/" && path.startsWith(k)) ||
      "/";

    const { emoji, bg } = faviconMap[matchedKey] || faviconMap["/"];

    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/svg+xml";
    link.href = generateFaviconSvg(emoji, bg);

    const titleKey =
      Object.keys(titleMap).find((k) => k === path) ||
      Object.keys(titleMap).find((k) => k !== "/" && path.startsWith(k)) ||
      "/";
    const title = titleMap[titleKey] || titleMap["/"];
    document.title = title;
  }, [location.pathname]);
}
