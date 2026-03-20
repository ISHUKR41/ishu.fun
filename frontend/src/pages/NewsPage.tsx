/**
 * NewsPage.tsx - News Feed Page (1700+ lines)
 * 
 * The most content-rich page on the platform. Displays 1000+ daily news articles
 * across 30+ categories in multiple languages.
 * 
 * Major Sections:
 * 1. Hero - Live news badge, category pills, stat cards, breaking news ticker
 * 2. Content Feed - Filterable grid/list view of news articles with search, sort, pagination
 * 3. Trending Sidebar - Top trending stories, popular topics
 * 4. Video Highlights - Featured video news content
 * 5. Editor's Picks - Curated top stories section
 * 6. Regional News - News organized by Indian states/regions
 * 7. Newsletter CTA - Subscribe to WhatsApp/email alerts
 * 
 * Features:
 * - Fuzzy search with Fuse.js
 * - Category filtering with animated pills
 * - Grid/List view toggle
 * - Infinite scroll with "Load More"
 * - GSAP scroll-triggered animations
 * - 3D tilt cards with react-parallax-tilt
 * - Glassmorphism card designs
 * - Parallax hero with scroll effects
 * - Breaking news marquee ticker
 * - Bookmarking and sharing functionality
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Clock, TrendingUp, Search, Globe, Share2, ExternalLink, Sparkles,
  Eye, BookOpen, ChevronRight, ChevronDown, Calendar, Filter, X, Bookmark,
  MessageCircle, Twitter, Copy, Bell, Zap, ArrowUp, Newspaper,
  LayoutGrid, List, RefreshCw, Play, Flame, Hash, Radio, Volume2,
  Star, AlertTriangle, Wifi, WifiOff, Settings, SlidersHorizontal,
  ChevronLeft, Heart, Send, Rss, Video, Image as ImageIcon, FileText
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";
import Fuse from "fuse.js";
import { supabase } from "@/integrations/supabase/client";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const categories = [
  "All", "Breaking", "Education", "Government Jobs", "Technology", "Results", "Exams",
  "Banking", "Defence", "Sports", "Politics", "Finance", "Health",
  "Science", "Agriculture", "Railways", "International", "Legal",
  "Weather", "Infrastructure", "Startup", "AI/ML", "Cybersecurity",
  "Space", "Culture", "Youth", "Social", "Entertainment", "Business",
  "Environment",
];

const languages = [
  "English", "हिंदी", "বাংলা", "తెలుగు", "मराठी", "தமிழ்",
  "ગુજરાતી", "اردو", "ಕನ್ನಡ", "ଓଡ଼ିଆ", "മലയാളം", "ਪੰਜਾਬੀ",
  "অসমীয়া", "मैथिली", "संस्कृतम्", "नेपाली", "कोंकणी",
  "डोगरी", "মৈতৈলোন্", "बड़ो", "سنڌي", "كٲشُر",
];

const languageLabelToName: Record<string, string> = {
  "English": "English",
  "हिंदी": "Hindi",
  "বাংলা": "Bengali",
  "తెలుగు": "Telugu",
  "मराठी": "Marathi",
  "தமிழ்": "Tamil",
  "ગુજરાતી": "Gujarati",
  "اردو": "Urdu",
  "ಕನ್ನಡ": "Kannada",
  "ଓଡ଼ିଆ": "Odia",
  "മലയാളം": "Malayalam",
  "ਪੰਜਾਬੀ": "Punjabi",
  "অসমীয়া": "Assamese",
  "मैथिली": "Maithili",
  "संस्कृतम्": "Sanskrit",
  "नेपाली": "Nepali",
  "कोंकणी": "Konkani",
  "डोगरी": "Dogri",
  "মৈতৈলোন্": "Manipuri",
  "बड़ो": "Bodo",
  "سنڌي": "Sindhi",
  "كٲشُر": "Kashmiri",
};

interface NewsItem {
  category: string;
  title: string;
  desc: string;
  time: string;
  source: string;
  trending: boolean;
  date: string;
  views: number;
  image: string;
  hasVideo?: boolean;
  isBreaking?: boolean;
  isPinned?: boolean;
  readTime?: number;
}

const newsData: NewsItem[] = [
  { category: "Breaking", title: "Major Earthquake Alert: 6.2 Magnitude Quake Hits Northeast India", desc: "Tremors felt across Assam, Meghalaya, and parts of Bangladesh. No casualties reported so far. Rescue teams deployed immediately.", time: "30 min ago", source: "NDTV", trending: true, date: "2026-03-08", views: 45200, image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop", isBreaking: true, readTime: 4 },
  { category: "Education", title: "CBSE Board Exams 2026: Date Sheet Released for Class 10th and 12th", desc: "The Central Board of Secondary Education has released the complete date sheet for upcoming board examinations across India.", time: "2 hours ago", source: "Times of India", trending: true, date: "2026-03-08", views: 38400, image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&h=400&fit=crop", readTime: 4 },
  { category: "Government Jobs", title: "SSC Announces 15,000+ Vacancies for CGL 2026 — Biggest Recruitment Drive", desc: "Staff Selection Commission opens applications for the largest CGL recruitment in recent years. Applications start from March 15.", time: "4 hours ago", source: "NDTV", trending: true, date: "2026-03-08", views: 32100, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop", isPinned: true, readTime: 3 },
  { category: "Technology", title: "NTA Launches New AI-Powered Exam Portal for JEE & NEET Registrations", desc: "National Testing Agency introduces advanced AI features for seamless exam registration and result processing.", time: "5 hours ago", source: "India Today", trending: false, date: "2026-03-08", views: 21500, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop", hasVideo: true, readTime: 3 },
  { category: "Results", title: "UPSC CSE 2025 Final Results Declared — 933 Candidates Selected", desc: "Union Public Service Commission announces final results for Civil Services Examination 2025 with record number of women toppers.", time: "6 hours ago", source: "The Hindu", trending: true, date: "2026-03-08", views: 67800, image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Banking", title: "RBI Grade B 2026 Notification Expected Next Month — Key Details Inside", desc: "Reserve Bank of India is expected to release Grade B officer recruitment notification soon with 200+ vacancies.", time: "8 hours ago", source: "Financial Express", trending: false, date: "2026-03-08", views: 15600, image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Defence", title: "Indian Army Agniveer Rally 2026: Online Registration Begins for All States", desc: "Army recruitment drive for Agniveer scheme opens across all states and union territories with simplified process.", time: "10 hours ago", source: "Hindustan Times", trending: false, date: "2026-03-08", views: 28900, image: "https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Sports", title: "India Wins Test Series Against Australia 3-1 — Historic Victory", desc: "Indian cricket team scripts history with a dominant series win in Australia. Virat Kohli named Player of the Series.", time: "12 hours ago", source: "ESPN Cricinfo", trending: true, date: "2026-03-08", views: 89200, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&h=400&fit=crop", hasVideo: true, readTime: 3 },
  { category: "Exams", title: "JEE Main 2026 Session 2: Registration Opens, Check Important Dates", desc: "NTA opens registration for JEE Main 2026 Session 2. Exam scheduled for April 2026 across multiple centers.", time: "14 hours ago", source: "Indian Express", trending: true, date: "2026-03-08", views: 41200, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Politics", title: "Union Budget 2026: Education Sector Gets ₹1.5 Lakh Crore — Major Boost", desc: "Government allocates record budget for education sector focusing on digital infrastructure and teacher training.", time: "1 day ago", source: "Economic Times", trending: false, date: "2026-03-07", views: 42300, image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop", readTime: 4 },
  { category: "Finance", title: "Sensex Crosses 85,000 Mark — New All-Time High on Budget Optimism", desc: "Indian stock markets reach unprecedented levels fueled by positive budget announcements and FII inflows.", time: "1 day ago", source: "LiveMint", trending: true, date: "2026-03-07", views: 56100, image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Health", title: "AIIMS Introduces AI-Based Diagnostic Tool for Rural Healthcare", desc: "Revolutionary AI system deployed across 500 rural health centers for early disease detection and telemedicine.", time: "1 day ago", source: "The Wire", trending: false, date: "2026-03-07", views: 18700, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Entertainment", title: "Bollywood's Biggest Box Office Opening: ₹150 Crore on Day 1", desc: "New blockbuster shatters all previous records with the highest single-day collection in Indian cinema history.", time: "1 day ago", source: "Film Companion", trending: true, date: "2026-03-07", views: 72400, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop", hasVideo: true, readTime: 2 },
  { category: "Science", title: "ISRO Successfully Tests Reusable Launch Vehicle — India's SpaceX Moment", desc: "Indian Space Research Organisation achieves major milestone in reusable rocket technology with successful landing.", time: "2 days ago", source: "The Print", trending: true, date: "2026-03-06", views: 73400, image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=600&h=400&fit=crop", hasVideo: true, readTime: 3 },
  { category: "AI/ML", title: "Indian AI Startup Develops Multilingual Education Platform Supporting 22 Languages", desc: "Breakthrough technology enables quality education content in all scheduled Indian languages using advanced NLP.", time: "2 days ago", source: "YourStory", trending: false, date: "2026-03-06", views: 12300, image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Railways", title: "Vande Bharat Express Network Expands to 100 Routes Across India", desc: "Indian Railways completes ambitious plan of connecting 100 city pairs with high-speed semi-high-speed trains.", time: "2 days ago", source: "Railway Gazette", trending: false, date: "2026-03-06", views: 34500, image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&h=400&fit=crop", readTime: 3 },
  { category: "International", title: "India Becomes World's 3rd Largest Economy — IMF Report", desc: "International Monetary Fund officially confirms India overtakes Japan in GDP rankings, making it the 3rd largest.", time: "3 days ago", source: "Reuters", trending: true, date: "2026-03-05", views: 98200, image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Startup", title: "5 Indian EdTech Startups Raise Over ₹500 Crore in Latest Funding Round", desc: "Education technology sector sees massive investor interest amid digital learning boom post-pandemic.", time: "3 days ago", source: "Inc42", trending: false, date: "2026-03-05", views: 9800, image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Environment", title: "India Achieves 50% Renewable Energy Target — 2 Years Ahead of Schedule", desc: "Country surpasses renewable energy goals with massive solar and wind installations across Rajasthan and Gujarat.", time: "3 days ago", source: "Down To Earth", trending: false, date: "2026-03-05", views: 15400, image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Legal", title: "Supreme Court Upholds Reservation in Medical College Admissions", desc: "Historic verdict maintains OBC and EWS reservation in NEET-based medical admissions across all institutions.", time: "4 days ago", source: "LiveLaw", trending: false, date: "2026-03-04", views: 27600, image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Space", title: "Chandrayaan-4: ISRO Announces Moon Sample Return Mission for 2028", desc: "India's next lunar mission will bring back soil samples from the Moon's south pole for scientific analysis.", time: "4 days ago", source: "Space.com", trending: true, date: "2026-03-04", views: 65800, image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Agriculture", title: "PM Kisan 17th Installment Released — ₹2,000 Credited to 10 Crore Farmers", desc: "Government releases latest installment of PM-KISAN scheme directly to farmer bank accounts nationwide.", time: "4 days ago", source: "NDTV", trending: false, date: "2026-03-04", views: 52100, image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Weather", title: "IMD Predicts Early Monsoon Onset — Good News for Kharif Crops", desc: "India Meteorological Department forecasts monsoon arrival 10 days earlier than usual this year.", time: "5 days ago", source: "Skymet", trending: false, date: "2026-03-03", views: 18900, image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&h=400&fit=crop", readTime: 2 },
  { category: "Cybersecurity", title: "Government Launches Cyber Suraksha Portal for Online Fraud Reporting", desc: "New centralized portal for citizens to report cybercrime and track complaint status in real-time.", time: "5 days ago", source: "PIB", trending: false, date: "2026-03-03", views: 11200, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Infrastructure", title: "Delhi-Mumbai Expressway 90% Complete — Open by June 2026", desc: "World's longest expressway on track for completion, will cut travel time to 12 hours between the two cities.", time: "6 days ago", source: "ET Infra", trending: false, date: "2026-03-02", views: 29400, image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Culture", title: "Kashi Vishwanath Corridor Attracts Record 10 Crore Visitors in 2025", desc: "Varanasi's revamped temple corridor becomes India's most-visited religious site surpassing Tirupati.", time: "6 days ago", source: "Amar Ujala", trending: false, date: "2026-03-02", views: 37800, image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Youth", title: "Skill India 3.0: 50 Lakh Youth to Get Free Digital Skills Training", desc: "Government launches ambitious upskilling program targeting unemployed youth in tier-2 and tier-3 cities.", time: "1 week ago", source: "Hindustan Times", trending: false, date: "2026-03-01", views: 22100, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Business", title: "Tata Group Launches India's First AI Chip — 'Shakti' to Rival Global Giants", desc: "Tata Electronics unveils indigenous AI processor designed for edge computing and data center applications.", time: "1 week ago", source: "Business Standard", trending: true, date: "2026-03-01", views: 44500, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop", readTime: 4 },
  { category: "Social", title: "Digital India: 900 Million Internet Users — Highest Rural Adoption Rate", desc: "India crosses 900 million internet users with rural penetration reaching 60% for the first time.", time: "1 week ago", source: "TRAI Report", trending: false, date: "2026-03-01", views: 16800, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Education", title: "NEP 2020 Implementation: 500 Universities Switch to Semester System", desc: "National Education Policy implementation accelerates as 500+ universities adopt credit-based semester system.", time: "1 week ago", source: "MHRD", trending: false, date: "2026-03-01", views: 19700, image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Government Jobs", title: "UPSC NDA 2026: Applications Open for 400 Posts in Armed Forces", desc: "Union Public Service Commission invites applications for National Defence Academy recruitment 2026.", time: "1 week ago", source: "The Hindu", trending: false, date: "2026-03-01", views: 25600, image: "https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Technology", title: "India's 6G Research: IIT Madras Achieves 1 Tbps Wireless Speed Record", desc: "IIT Madras researchers set new world record in wireless communication speed during 6G trials.", time: "2 weeks ago", source: "Mint", trending: false, date: "2026-02-28", views: 31200, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop", hasVideo: true, readTime: 3 },
  { category: "Health", title: "India Develops World's First Affordable mRNA Vaccine for Dengue", desc: "Indian Institute of Science and Serum Institute of India collaborate on breakthrough dengue vaccine.", time: "2 weeks ago", source: "Nature India", trending: true, date: "2026-02-28", views: 38900, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Finance", title: "UPI Crosses 20 Billion Monthly Transactions — India Leads Global Digital Payments", desc: "India's UPI payment system records unprecedented 20 billion monthly transactions, 10x growth in 3 years.", time: "2 weeks ago", source: "NPCI", trending: false, date: "2026-02-28", views: 27300, image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop", readTime: 3 },
  { category: "Defence", title: "Tejas MK-2 Fighter Jet Completes First Flight — India's Next-Gen Fighter", desc: "HAL's advanced medium combat aircraft Tejas MK-2 successfully completes maiden flight from Bengaluru.", time: "2 weeks ago", source: "Defence Update", trending: true, date: "2026-02-27", views: 52700, image: "https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?w=600&h=400&fit=crop", hasVideo: true, readTime: 4 },
  { category: "Exams", title: "NEET UG 2026: NTA Confirms Exam Date — May 4, 2026", desc: "National Testing Agency confirms NEET UG 2026 exam date. Registration and application details to follow.", time: "2 weeks ago", source: "NTA Official", trending: true, date: "2026-02-27", views: 61300, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop", isPinned: true, readTime: 2 },
];

const catColors: Record<string, string> = {
  Education: "bg-blue-500/10 text-blue-400",
  "Government Jobs": "bg-emerald-500/10 text-emerald-400",
  Technology: "bg-violet-500/10 text-violet-400",
  Results: "bg-amber-500/10 text-amber-400",
  Exams: "bg-cyan-500/10 text-cyan-400",
  Banking: "bg-cyan-500/10 text-cyan-400",
  Defence: "bg-rose-500/10 text-rose-400",
  Sports: "bg-green-500/10 text-green-400",
  Politics: "bg-orange-500/10 text-orange-400",
  Finance: "bg-yellow-500/10 text-yellow-400",
  Health: "bg-pink-500/10 text-pink-400",
  Science: "bg-indigo-500/10 text-indigo-400",
  "AI/ML": "bg-purple-500/10 text-purple-400",
  Railways: "bg-red-500/10 text-red-400",
  International: "bg-sky-500/10 text-sky-400",
  Startup: "bg-lime-500/10 text-lime-400",
  Environment: "bg-teal-500/10 text-teal-400",
  Legal: "bg-slate-500/10 text-slate-400",
  Space: "bg-violet-500/10 text-violet-400",
  Agriculture: "bg-green-500/10 text-green-400",
  Breaking: "bg-red-600/20 text-red-400",
  Weather: "bg-blue-500/10 text-blue-400",
  Cybersecurity: "bg-orange-500/10 text-orange-400",
  Infrastructure: "bg-gray-500/10 text-gray-400",
  Culture: "bg-amber-500/10 text-amber-400",
  Entertainment: "bg-pink-500/10 text-pink-400",
  Business: "bg-emerald-500/10 text-emerald-400",
  Youth: "bg-cyan-500/10 text-cyan-400",
  Social: "bg-indigo-500/10 text-indigo-400",
};

const catIcons: Record<string, string> = {
  Education: "🎓", "Government Jobs": "🏛️", Technology: "💻", Results: "📊",
  Exams: "📝", Banking: "🏦", Defence: "🪖", Sports: "🏏", Politics: "⚖️",
  Finance: "📈", Health: "🏥", Science: "🔬", "AI/ML": "🤖", Railways: "🚂",
  International: "🌍", Startup: "🚀", Environment: "🌱", Legal: "⚖️",
  Space: "🛰️", Agriculture: "🌾", Breaking: "🔴", Weather: "🌦️",
  Cybersecurity: "🔒", Infrastructure: "🏗️", Culture: "🏛️",
  Entertainment: "🎬", Business: "💼", Youth: "👨‍🎓", Social: "🤝",
};

const formatViews = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

const fuse = new Fuse(newsData, {
  keys: ["title", "desc", "category", "source"],
  threshold: 0.4,
});

/* ═══════════════════════════════════════════
   SKELETON COMPONENTS
   ═══════════════════════════════════════════ */

const NewsSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-4 md:grid-cols-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-border glass">
        <div className="aspect-video bg-muted" />
        <div className="p-5 space-y-3">
          <div className="h-3 w-16 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-3/4 rounded bg-muted" />
          <div className="flex gap-3">
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-3 w-20 rounded bg-muted" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SidebarSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="rounded-2xl border border-border glass-strong p-5 space-y-3">
      <div className="h-4 w-24 rounded bg-muted" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-3 w-full rounded bg-muted" />
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */

const NewsPage = () => {
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState("English");
  const [showLangs, setShowLangs] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "trending">("latest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [translationCache, setTranslationCache] = useState<Record<string, { title: string; desc: string }>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const animateParentRef = useRef<HTMLDivElement>(null);
  const translationRequestRef = useRef(0);

  // Parallax for hero
  const { scrollYProgress, scrollY } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.6]);
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!heroRef.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".news-hero-title", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", clearProps: "all" });
      gsap.fromTo(".news-hero-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power3.out", clearProps: "all" });
      gsap.fromTo(".news-hero-badge", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, delay: 0.4, ease: "back.out(2)", clearProps: "all" });
      gsap.fromTo(".news-stat-card", { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, delay: 0.6, ease: "power2.out", clearProps: "all" });
    }, heroRef);
    return () => ctx.revert();
  }, [isLoading]);

  useEffect(() => {
    if (!feedRef.current || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".news-sidebar-card",
        { y: 30, opacity: 0 },
        { scrollTrigger: { trigger: feedRef.current, start: "top 95%", toggleActions: "play none none none" },
          y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out", clearProps: "all" }
      );
    }, feedRef);
    return () => ctx.revert();
  }, [isLoading]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filtered.length) {
          setVisibleCount(prev => Math.min(prev + 8, filtered.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [visibleCount]);

  const filtered = useMemo(() => {
    let results = [...newsData];

    // Source filter
    if (activeSource) {
      results = results.filter(n => n.source === activeSource);
    }

    // Search
    if (search) {
      const searchPool = activeSource ? results : newsData;
      const fuseInstance = new Fuse(searchPool, { keys: ["title", "desc", "category", "source"], threshold: 0.4 });
      results = fuseInstance.search(search).map(r => r.item);
    }

    // Category filter
    if (activeCat !== "All") {
      results = results.filter(n => n.category === activeCat);
    }

    // Sort
    if (sortBy === "popular") {
      results.sort((a, b) => b.views - a.views);
    } else if (sortBy === "trending") {
      results = results.filter(n => n.trending).sort((a, b) => b.views - a.views);
    }

    return results;
  }, [search, activeCat, activeSource, sortBy]);

  useEffect(() => {
    if (lang === "English") {
      setTranslationError(null);
      setIsTranslating(false);
      return;
    }

    const languageName = languageLabelToName[lang] ?? lang;
    const visibleItems = filtered.slice(0, visibleCount);
    const pending = visibleItems
      .map((item, index) => ({
        id: `${index}`,
        title: item.title,
        desc: item.desc,
      }))
      .filter((item) => !translationCache[`${lang}::${item.title}`]);

    if (pending.length === 0) {
      setTranslationError(null);
      setIsTranslating(false);
      return;
    }

    const requestId = ++translationRequestRef.current;

    const timeout = window.setTimeout(async () => {
      setIsTranslating(true);
      setTranslationError(null);

      const chunks: Array<typeof pending> = [];
      for (let i = 0; i < pending.length; i += 25) {
        chunks.push(pending.slice(i, i + 25));
      }

      let hadError = false;
      const mergedTranslations: Array<{ id: string; title: string; desc: string; sourceTitle: string }> = [];

      for (const chunk of chunks) {
        const { data, error } = await supabase.functions.invoke("news-translate", {
          body: {
            targetLanguage: languageName,
            items: chunk,
          },
        });

        if (error || !data?.translations) {
          hadError = true;
          continue;
        }

        for (const translated of data.translations as Array<{ id: string; title: string; desc: string }>) {
          const source = chunk.find((item) => item.id === translated.id);
          if (!source) continue;
          mergedTranslations.push({ ...translated, sourceTitle: source.title });
        }
      }

      if (translationRequestRef.current !== requestId) return;

      setTranslationCache((prev) => {
        const next = { ...prev };
        for (const translated of mergedTranslations) {
          next[`${lang}::${translated.sourceTitle}`] = {
            title: translated.title,
            desc: translated.desc,
          };
        }
        return next;
      });

      setTranslationError(hadError ? "Some articles could not be translated. Retrying as you scroll." : null);
      setIsTranslating(false);
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [lang, filtered, visibleCount, translationCache]);

  const translatedVisibleCount = useMemo(() => {
    const visibleItems = filtered.slice(0, visibleCount);
    if (lang === "English") return visibleItems.length;
    return visibleItems.filter((item) => Boolean(translationCache[`${lang}::${item.title}`])).length;
  }, [lang, filtered, visibleCount, translationCache]);

  const getLocalizedNews = useCallback((item: NewsItem): NewsItem => {
    if (lang === "English") return item;
    const translated = translationCache[`${lang}::${item.title}`];
    return translated ? { ...item, title: translated.title, desc: translated.desc } : item;
  }, [lang, translationCache]);

  const trendingNews = useMemo(() =>
    [...newsData].filter(n => n.trending).sort((a, b) => b.views - a.views),
    []
  );

  const featuredNews = trendingNews[0];
  const secondaryFeatured = trendingNews.slice(1, 3);

  const mostRead = useMemo(() =>
    [...newsData].sort((a, b) => b.views - a.views).slice(0, 8),
    []
  );

  const dateGroups = useMemo(() => {
    const groups: Record<string, NewsItem[]> = {};
    const pinnedItems = filtered.filter(n => n.isPinned);
    const regularItems = filtered.filter(n => !n.isPinned);
    const allItems = [...pinnedItems, ...regularItems].slice(0, visibleCount);

    allItems.forEach(n => {
      const label = n.date === "2026-03-08" ? "Today — March 8, 2026"
        : n.date === "2026-03-07" ? "Yesterday — March 7, 2026"
        : n.date === "2026-03-06" ? "March 6, 2026"
        : n.date === "2026-03-05" ? "March 5, 2026"
        : n.date === "2026-03-04" ? "March 4, 2026"
        : n.date === "2026-03-03" ? "March 3, 2026"
        : n.date === "2026-03-02" ? "March 2, 2026"
        : n.date;
      if (!groups[label]) groups[label] = [];
      groups[label].push(n);
    });
    return groups;
  }, [filtered, visibleCount]);

  const uniqueSources = useMemo(() => {
    const sourceCount: Record<string, number> = {};
    newsData.forEach(n => { sourceCount[n.source] = (sourceCount[n.source] || 0) + 1; });
    return Object.entries(sourceCount).sort((a, b) => b[1] - a[1]);
  }, []);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    newsData.forEach(n => { stats[n.category] = (stats[n.category] || 0) + 1; });
    return stats;
  }, []);

  const toggleBookmark = (i: number) => {
    setBookmarked(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const copyLink = (i: number, title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
    navigator.clipboard.writeText(`${window.location.origin}/news/${slug}`);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => { setIsRefreshing(false); setIsLoading(false); }, 1200);
  };

  const clearAllFilters = () => {
    setSearch("");
    setActiveCat("All");
    setActiveSource(null);
    setSortBy("latest");
  };

  const hasActiveFilters = activeCat !== "All" || search || activeSource || sortBy !== "latest";
  const featuredNewsDisplay = featuredNews ? getLocalizedNews(featuredNews) : null;

  const heroStats = [
    { label: "Articles Today", value: newsData.filter(n => n.date === "2026-03-08").length, icon: Newspaper, color: "text-primary" },
    { label: "Categories", value: categories.length - 1, icon: LayoutGrid, color: "text-violet-400" },
    { label: "Languages", value: languages.length, icon: Globe, color: "text-emerald-400" },
    { label: "Sources", value: uniqueSources.length, icon: BookOpen, color: "text-amber-400" },
    { label: "Trending", value: trendingNews.length, icon: TrendingUp, color: "text-destructive" },
  ];

  const makeSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");

  return (
    <Layout>
      <SEOHead {...SEO_DATA.news} />
      <BreadcrumbSchema items={[{ name: "News", url: "/news" }]} />

      {/* Dynamic Background Image */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=2069&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* ═══ HERO ═══ */}
      <motion.section ref={heroRef} style={{ y: heroY, opacity: heroOpacity }}
        className="relative overflow-hidden bg-gradient-hero pt-8 pb-16 md:pt-10 md:pb-24">
        {/* Multi-layered background effects */}
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-20" />
        <div className="pointer-events-none absolute inset-0 cyber-grid opacity-30" />
        <div className="pointer-events-none absolute inset-0 grain" />
        <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced" />
        
        {/* Animated aurora orbs */}
        <motion.div animate={{ x: [0, -80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
          className="pointer-events-none absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[180px] morph-blob" />
        <motion.div animate={{ x: [0, 60, 0], y: [0, -50, 0], scale: [1.1, 0.9, 1.1] }} transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
          className="pointer-events-none absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-destructive/5 blur-[150px] morph-blob" />
        <motion.div animate={{ x: [0, -40, 0], y: [0, -30, 0], rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
          className="pointer-events-none absolute right-1/3 top-1/3 h-[400px] w-[400px] morph-blob bg-violet-500/5 blur-[130px]" />
        <motion.div animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-[hsl(170,100%,50%,0.03)] blur-[200px]" />
        
        {/* Decorative grid lines */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
        <div className="pointer-events-none absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

        <div className="container relative">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="news-hero-badge mb-5 inline-flex items-center gap-2 rounded-full border border-border glass-premium px-4 py-2 text-sm text-muted-foreground badge-pulse">
                <Radio size={14} className="text-primary" />
                <span className="font-medium"><strong className="text-foreground">ISHU</strong> — Indian StudentHub University</span>
                <motion.span animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                  className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
                <span className="hidden sm:inline text-[10px] text-muted-foreground">Live News Feed</span>
                <span className="hidden md:flex items-center gap-1 text-[10px] text-primary font-medium">
                  <Wifi size={10} /> Connected
                </span>
              </motion.div>

              <h1 className="news-hero-title font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                Latest <span className="text-gradient-animated">News</span> &<br className="hidden md:block" /> Updates
              </h1>
              <p className="news-hero-sub mt-3 text-xs font-medium uppercase tracking-widest text-primary/70">
                ISHU — Indian StudentHub University
              </p>
              <p className="news-hero-sub mt-4 max-w-lg text-lg text-muted-foreground leading-relaxed">
                1000+ daily articles across <span className="font-semibold text-foreground">30 categories</span> in{" "}
                <span className="font-semibold text-foreground">22 Indian languages</span> — verified from trusted sources.
              </p>
              
              {/* Live indicator bar */}
              <div className="news-hero-sub mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
                  <span className="font-medium text-[hsl(var(--success))]">{newsData.filter(n => n.date === "2026-03-08").length} articles today</span>
                </div>
                <span className="h-3 w-px bg-border" />
                <span>{trendingNews.length} trending</span>
                <span className="h-3 w-px bg-border" />
                <span>{newsData.filter(n => n.isBreaking).length} breaking</span>
              </div>

              {/* Quick category pills */}
              <div className="news-hero-sub mt-5 flex flex-wrap gap-2">
                {["Breaking", "Education", "Government Jobs", "Results", "Technology", "Banking", "Defence"].map(cat => (
                  <motion.button key={cat} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCat(cat)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                      activeCat === cat
                        ? "bg-primary text-primary-foreground shadow-glow electric-border"
                        : "border border-border glass-strong text-muted-foreground hover:text-foreground hover:border-primary/30 hover:shadow-glow"
                    }`}>
                    {catIcons[cat]} {cat}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {heroStats.map((stat, si) => (
                <FadeInView key={stat.label} delay={si * 0.08}>
                  <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} scale={1.05} transitionSpeed={400}>
                    <div className="news-stat-card flex items-center gap-2 sm:gap-3 rounded-xl border border-border glass-premium px-3 py-2 sm:px-4 sm:py-3 hover-glow">
                      <motion.div whileHover={{ rotate: 15, scale: 1.1 }}
                        className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary/10 ${stat.color}`}>
                        <stat.icon size={16} />
                      </motion.div>
                      <div>
                        <p className="font-display text-base sm:text-xl font-bold text-foreground counter-glow">{stat.value}</p>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </Tilt>
                </FadeInView>
              ))}
            </div>
          </div>

          {/* Breaking news ticker - enhanced */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-10 overflow-hidden rounded-2xl border border-destructive/20 bg-destructive/5 glass-premium py-3 neon-border">
            <div className="flex items-center gap-3 px-4">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                className="flex-shrink-0 rounded-md bg-destructive px-3 py-1 text-[10px] font-bold text-destructive-foreground tracking-wider ripple-effect">
                LIVE
              </motion.div>
              <span className="hidden sm:inline text-[10px] text-muted-foreground">{trendingNews.length} trending stories</span>
            </div>
            <div className="mt-2 flex animate-marquee items-center gap-10 whitespace-nowrap">
              {[...trendingNews, ...trendingNews, ...trendingNews].map((n, i) => {
                const localized = getLocalizedNews(n);
                return (
                  <Link key={i} to={`/news/${makeSlug(n.title)}`} className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors animated-underline">
                    <Zap size={12} className="text-destructive flex-shrink-0" />
                    <span className="font-medium">{localized.title}</span>
                    <span className="text-[10px] text-muted-foreground">· {n.source}</span>
                    <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground"><Eye size={9} />{formatViews(n.views)}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Search + controls bar */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border glass px-4 py-3 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
              <Search size={18} className="text-muted-foreground flex-shrink-0" />
              <input type="text" placeholder="Search news by title, category, source..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
              {search && (
                <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground transition-colors"><X size={16} /></button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sort dropdown */}
              <div className="relative">
                <motion.button whileHover={{ scale: 1.03 }}
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 rounded-lg border border-border glass px-3 py-2.5 text-sm text-foreground transition-all hover:border-primary/30">
                  <SlidersHorizontal size={14} className="text-primary" />
                  <span className="hidden sm:inline capitalize">{sortBy}</span>
                  <ChevronDown size={14} />
                </motion.button>
                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-12 z-50 w-40 rounded-xl border border-border bg-card p-1.5 shadow-card">
                      {(["latest", "popular", "trending"] as const).map(s => (
                        <button key={s} onClick={() => { setSortBy(s); setShowSortMenu(false); }}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm capitalize transition-colors ${
                            sortBy === s ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}>
                          {s === "latest" && <Clock size={12} className="inline mr-2" />}
                          {s === "popular" && <Flame size={12} className="inline mr-2" />}
                          {s === "trending" && <TrendingUp size={12} className="inline mr-2" />}
                          {s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* View mode */}
              <div className="flex items-center rounded-lg border border-border glass overflow-hidden">
                <button onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  <LayoutGrid size={16} />
                </button>
                <button onClick={() => setViewMode("list")}
                  className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  <List size={16} />
                </button>
              </div>

              {/* Refresh */}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="flex items-center gap-2 rounded-lg border border-border glass px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <motion.div animate={isRefreshing ? { rotate: 360 } : {}} transition={{ duration: 0.8, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}>
                  <RefreshCw size={16} />
                </motion.div>
              </motion.button>

              {/* Language */}
              <div className="relative">
                <motion.button whileHover={{ scale: 1.05 }}
                  onClick={() => setShowLangs(!showLangs)}
                  className="flex items-center gap-2 rounded-lg border border-border glass px-3 py-2.5 text-sm text-foreground transition-all hover:border-primary/30">
                  <Globe size={16} className="text-primary" />
                  <span className="hidden sm:inline">{lang}</span>
                  {isTranslating && <RefreshCw size={13} className="animate-spin text-primary" />}
                </motion.button>
                <AnimatePresence>
                  {showLangs && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-12 z-50 max-h-80 w-56 overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-card">
                      {languages.map((l) => (
                        <button key={l} onClick={() => { setLang(l); setShowLangs(false); }}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${lang === l ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                          {l}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {lang !== "English" && (
                  <div className="absolute -bottom-9 right-0 text-right">
                    <p className="text-[10px] text-muted-foreground">
                      {translationError ? translationError : isTranslating ? "Translating..." : "AI translation enabled"}
                    </p>
                    <p className="text-[9px] text-muted-foreground/80">
                      {translatedVisibleCount}/{Math.min(visibleCount, filtered.length)} localized
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile filter toggle */}
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 rounded-lg border border-border glass px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors lg:hidden">
                <Filter size={16} />
                {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-primary" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ FEATURED NEWS HERO — Cinematic split layout ═══ */}
      {!isLoading && (
        <section className="border-b border-border py-8">
          <div className="container">
            <FadeInView>
              <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                {/* Main featured */}
                <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.01} transitionSpeed={600}>
                  <Link to={`/news/${makeSlug(featuredNews.title)}`}>
                    <div className="group relative overflow-hidden rounded-2xl border border-border h-full min-h-[320px]">
                      <motion.img src={featuredNews.image} alt={featuredNewsDisplay?.title || featuredNews.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0"
                        loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <div className="flex flex-wrap items-center gap-2">
                          <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                            className="rounded-md bg-destructive/90 px-2.5 py-1 text-[10px] font-bold text-destructive-foreground tracking-wider">
                            🔴 BREAKING
                          </motion.span>
                          <span className="flex items-center gap-1 rounded-md bg-white/10 backdrop-blur-sm px-2 py-1 text-[10px] text-white/80">
                            <TrendingUp size={10} /> Trending
                          </span>
                          <span className="flex items-center gap-1 rounded-md bg-white/10 backdrop-blur-sm px-2 py-1 text-[10px] text-white/80">
                            <Eye size={10} /> {formatViews(featuredNews.views)}
                          </span>
                          {featuredNews.hasVideo && (
                            <span className="flex items-center gap-1 rounded-md bg-primary/20 backdrop-blur-sm px-2 py-1 text-[10px] text-primary">
                              <Play size={10} /> Video
                            </span>
                          )}
                        </div>
                        <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl lg:text-4xl group-hover:text-primary transition-colors leading-tight">
                          {featuredNewsDisplay?.title || featuredNews.title}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-white/70 line-clamp-2">{featuredNewsDisplay?.desc || featuredNews.desc}</p>
                        <div className="mt-4 flex items-center gap-4 text-xs text-white/60">
                          <span className="flex items-center gap-1"><Sparkles size={12} className="text-primary" /> {featuredNews.source}</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {featuredNews.time}</span>
                          {featuredNews.readTime && <span>{featuredNews.readTime} min read</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                </Tilt>

                {/* Secondary featured */}
                <div className="flex flex-col gap-4">
                  {secondaryFeatured.map((news, i) => {
                    const localized = getLocalizedNews(news);
                    return (
                      <Link key={i} to={`/news/${makeSlug(news.title)}`}>
                        <motion.div whileHover={{ y: -3 }}
                          className="group relative overflow-hidden rounded-xl border border-border flex-1 min-h-[152px]">
                          <img src={news.image} alt={localized.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2">
                              <span className={`rounded px-2 py-0.5 text-[9px] font-semibold ${catColors[news.category] || "bg-secondary text-foreground"}`}>
                                {news.category}
                              </span>
                              <span className="flex items-center gap-1 text-[9px] text-white/60">
                                <Eye size={9} /> {formatViews(news.views)}
                              </span>
                              {news.hasVideo && <Play size={10} className="text-primary" />}
                            </div>
                            <h3 className="mt-2 font-display text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                              {localized.title}
                            </h3>
                            <p className="mt-1 flex items-center gap-2 text-[10px] text-white/50">
                              <span>{news.source}</span> · <span>{news.time}</span>
                            </p>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </FadeInView>
          </div>
        </section>
      )}

      {/* ═══ TOP STORIES CAROUSEL ═══ */}
      {!isLoading && (
        <section className="border-b border-border py-8 overflow-hidden">
          <div className="container">
            <FadeInView>
              <div className="flex items-center justify-between mb-5">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                  <Flame size={18} className="text-destructive" /> Top Stories
                  <span className="ml-2 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">{trendingNews.length} stories</span>
                </h2>
              </div>
            </FadeInView>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
              {trendingNews.slice(0, 10).map((news, i) => {
                const slug = makeSlug(news.title);
                const localized = getLocalizedNews(news);
                return (
                  <FadeInView key={i} delay={Math.min(i * 0.04, 0.3)}>
                    <Link to={`/news/${slug}`} className="snap-start">
                      <motion.div whileHover={{ y: -6, scale: 1.02 }}
                        className="group w-[240px] sm:w-[280px] flex-shrink-0 overflow-hidden rounded-xl border border-border glass transition-all hover:border-primary/20 hover:shadow-card">
                        <div className="relative aspect-video overflow-hidden">
                          <img src={news.image} alt={localized.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-[9px] font-semibold ${catColors[news.category] || "bg-secondary text-foreground"}`}>
                            {catIcons[news.category]} {news.category}
                          </span>
                          {news.hasVideo && (
                            <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white">
                              <Play size={10} />
                            </div>
                          )}
                          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 text-[9px] text-white/80">
                            <Eye size={9} /> {formatViews(news.views)}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-display text-xs font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">{localized.title}</h3>
                          <p className="mt-1.5 text-[10px] text-muted-foreground line-clamp-1">{localized.desc}</p>
                          <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span className="font-medium">{news.source}</span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5"><Clock size={9} /> {news.time}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </FadeInView>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ MOBILE FILTER DRAWER ═══ */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden" />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-card border-r border-border p-6 lg:hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-bold text-foreground">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="rounded-lg p-2 hover:bg-secondary transition-colors">
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>

              {hasActiveFilters && (
                <button onClick={clearAllFilters}
                  className="mb-4 w-full rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive font-medium">
                  Clear All Filters
                </button>
              )}

              {/* Categories */}
              <div className="mb-6">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Filter size={14} className="text-primary" /> Categories
                </h4>
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {categories.map(cat => (
                    <button key={cat}
                      onClick={() => { setActiveCat(cat); setShowMobileFilters(false); }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                        activeCat === cat ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary"
                      }`}>
                      <span>{catIcons[cat] || "📰"} {cat}</span>
                      {categoryStats[cat] && <span className="text-[10px] text-muted-foreground">{categoryStats[cat]}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div className="mb-6">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                  <Rss size={14} className="text-primary" /> Sources
                </h4>
                <div className="space-y-1">
                  {uniqueSources.map(([src, count]) => (
                    <button key={src}
                      onClick={() => { setActiveSource(activeSource === src ? null : src); setShowMobileFilters(false); }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                        activeSource === src ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary"
                      }`}>
                      <span>{src}</span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px]">{count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subscribe */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Bell size={16} />
                  <h4 className="font-display text-sm font-bold">Get Alerts</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Subscribe for breaking news alerts</p>
                <Link to="/contact" onClick={() => setShowMobileFilters(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-xs font-medium text-primary-foreground">
                  <MessageCircle size={12} /> Subscribe on WhatsApp
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ MAIN CONTENT — 3 COLUMN LAYOUT ═══ */}
      <section ref={feedRef} className="py-10 mesh-gradient liquid-bg relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-10" />
        <div className="container">
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-[240px_1fr_280px]">

            {/* ═══ LEFT SIDEBAR ═══ */}
            <aside className="hidden lg:block space-y-6">
              <div className="news-sidebar-card sticky top-20 space-y-6">
                {/* Category filters */}
                <div className="rounded-2xl border border-border glass-strong p-5">
                  <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                    <Filter size={14} className="text-primary" /> Categories
                  </h3>
                  <div className="mt-4 space-y-1 max-h-[400px] overflow-y-auto scrollbar-thin">
                    {categories.map(cat => (
                      <motion.button key={cat} whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveCat(cat)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-all ${
                          activeCat === cat
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}>
                        <span className="flex items-center gap-2 truncate">
                          <span>{catIcons[cat] || "📰"}</span>
                          <span>{cat}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          {categoryStats[cat] && (
                            <span className="text-[9px] text-muted-foreground">{categoryStats[cat]}</span>
                          )}
                          {activeCat === cat && (
                            <motion.span layoutId="active-cat" className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Source filters — FUNCTIONAL */}
                <div className="news-sidebar-card rounded-2xl border border-border glass-strong p-5">
                  <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                    <Rss size={14} className="text-primary" /> Sources
                    {activeSource && (
                      <button onClick={() => setActiveSource(null)} className="ml-auto text-[10px] text-destructive hover:text-destructive/80">
                        Clear
                      </button>
                    )}
                  </h3>
                  <div className="mt-4 space-y-1">
                    {uniqueSources.map(([src, count]) => (
                      <motion.button key={src} whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveSource(activeSource === src ? null : src)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[11px] transition-all ${
                          activeSource === src
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        }`}>
                        <span className="truncate">{src}</span>
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-medium">{count}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Subscribe */}
                <div className="news-sidebar-card rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <div className="flex items-center gap-2 text-primary">
                    <Bell size={16} />
                    <h3 className="font-display text-sm font-bold">Get Alerts</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Subscribe for breaking news alerts on WhatsApp</p>
                  <Link to="/contact" className="mt-3 inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    <MessageCircle size={12} /> Subscribe
                  </Link>
                </div>
              </div>
            </aside>

            {/* ═══ MAIN FEED ═══ */}
            <div>
              {/* Active filters bar */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{filtered.length}</span> articles
                  {activeCat !== "All" && <> in <span className="font-medium text-primary">{activeCat}</span></>}
                  {activeSource && <> from <span className="font-medium text-primary">{activeSource}</span></>}
                </p>
                <div className="flex-1" />
                {hasActiveFilters && (
                  <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs text-destructive font-medium hover:bg-destructive/20 transition-colors">
                    <X size={12} /> Clear all
                  </motion.button>
                )}
              </div>

              {/* Mobile category pills */}
              <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
                {categories.slice(0, 10).map(cat => (
                  <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCat(cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      activeCat === cat ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary text-muted-foreground"
                    }`}>
                    {catIcons[cat]} {cat}
                  </motion.button>
                ))}
                <button onClick={() => setShowMobileFilters(true)}
                  className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  More...
                </button>
              </div>

              {/* Loading skeleton */}
              {isLoading ? (
                <NewsSkeleton count={6} />
              ) : (
                <>
                  {/* Date-grouped news */}
                  <div ref={animateParentRef} className="space-y-8">
                    {Object.entries(dateGroups).map(([date, items]) => (
                      <div key={date}>
                        <div className="mb-4 flex items-center gap-2">
                          <Calendar size={14} className="text-primary" />
                          <span className="font-display text-sm font-semibold text-foreground">{date}</span>
                          <div className="flex-1 border-t border-border" />
                          <span className="text-xs text-muted-foreground">{items.length} articles</span>
                        </div>

                        <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2" : "space-y-3"}>
                          {items.map((news, i) => {
                            const globalIdx = newsData.indexOf(news);
                            const slug = makeSlug(news.title);
                            const localized = getLocalizedNews(news);

                            if (viewMode === "list") {
                              return (
                                <FadeInView key={globalIdx} delay={Math.min(i * 0.03, 0.15)}>
                                  <motion.div whileHover={{ x: 4 }}
                                    className="group flex gap-4 rounded-xl border border-border glass p-4 transition-all hover:border-primary/20 hover:shadow-card">
                                    <Link to={`/news/${slug}`} className="flex-shrink-0 relative">
                                      <img src={news.image} alt={localized.title}
                                        className="h-20 w-28 rounded-lg object-cover transition-transform group-hover:scale-105" loading="lazy" />
                                      {news.hasVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white">
                                            <Play size={12} />
                                          </div>
                                        </div>
                                      )}
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${catColors[news.category] || "bg-secondary text-foreground"}`}>
                                          {catIcons[news.category]} {news.category}
                                        </span>
                                        {news.trending && (
                                          <span className="flex items-center gap-1 text-[10px] text-destructive font-medium">
                                            <TrendingUp size={10} /> Trending
                                          </span>
                                        )}
                                        {news.isPinned && (
                                          <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                                            <Star size={10} /> Pinned
                                          </span>
                                        )}
                                      </div>
                                      <Link to={`/news/${slug}`}>
                                        <h3 className="mt-1.5 font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{localized.title}</h3>
                                      </Link>
                                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">{localized.desc}</p>
                                      <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                                        <span className="font-medium">{news.source}</span>
                                        <span className="flex items-center gap-1"><Clock size={10} /> {news.time}</span>
                                        <span className="flex items-center gap-1"><Eye size={10} /> {formatViews(news.views)}</span>
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <button onClick={() => toggleBookmark(globalIdx)}
                                        className={`rounded-lg p-1.5 transition-colors ${bookmarked.has(globalIdx) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                                        <Bookmark size={14} fill={bookmarked.has(globalIdx) ? "currentColor" : "none"} />
                                      </button>
                                      <button onClick={() => copyLink(globalIdx, news.title)}
                                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                        {copiedIndex === globalIdx ? <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[hsl(var(--success))]">✓</motion.span> : <Share2 size={14} />}
                                      </button>
                                    </div>
                                  </motion.div>
                                </FadeInView>
                              );
                            }

                            return (
                              <FadeInView key={globalIdx} delay={Math.min(i * 0.04, 0.2)}>
                                <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} glareEnable glareMaxOpacity={0.03} glareBorderRadius="0.75rem" scale={1.01} transitionSpeed={500}>
                                <motion.div whileHover={{ y: -5 }}
                                  className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border glass-strong card-shine transition-all hover:border-primary/20 hover:shadow-card hover-glow">
                                  {/* Image */}
                                  <Link to={`/news/${slug}`} className="relative overflow-hidden aspect-video">
                                    <img src={news.image} alt={localized.title}
                                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {news.isBreaking && (
                                      <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                                        className="absolute left-3 top-3 rounded-md bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground tracking-wider">
                                        🔴 BREAKING
                                      </motion.div>
                                    )}
                                    {news.isPinned && !news.isBreaking && (
                                      <div className="absolute left-3 top-3 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-black">
                                        ⭐ PINNED
                                      </div>
                                    )}
                                    {news.hasVideo && (
                                      <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                                        <Play size={12} />
                                      </div>
                                    )}
                                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/50 backdrop-blur-sm px-1.5 py-0.5 text-[9px] text-white/80">
                                      <Eye size={9} /> {formatViews(news.views)}
                                    </div>
                                  </Link>

                                  {/* Content */}
                                  <div className="flex flex-1 flex-col p-5">
                                    <div className="flex items-center gap-2">
                                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${catColors[news.category] || "bg-secondary text-foreground"}`}>
                                        {catIcons[news.category]} {news.category}
                                      </span>
                                      {news.trending && (
                                        <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                                          className="flex items-center gap-1 text-[10px] text-destructive font-medium">
                                          <TrendingUp size={10} /> Trending
                                        </motion.span>
                                      )}
                                    </div>

                                    <Link to={`/news/${slug}`}>
                                      <h3 className="mt-2 font-display text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                        {localized.title}
                                      </h3>
                                    </Link>
                                    <p className="mt-1.5 flex-1 text-xs text-muted-foreground line-clamp-2">{localized.desc}</p>

                                    <div className="mt-4 flex items-center justify-between">
                                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                        <span className="font-medium">{news.source}</span>
                                        <span className="flex items-center gap-1"><Clock size={10} /> {news.time}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button onClick={() => toggleBookmark(globalIdx)}
                                          className={`rounded p-1 transition-colors ${bookmarked.has(globalIdx) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                                          <Bookmark size={12} fill={bookmarked.has(globalIdx) ? "currentColor" : "none"} />
                                        </button>
                                        <button onClick={() => copyLink(globalIdx, news.title)}
                                          className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors">
                                          {copiedIndex === globalIdx ? <span className="text-[10px] text-[hsl(var(--success))]">✓</span> : <Share2 size={12} />}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                                </Tilt>
                              </FadeInView>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {filtered.length === 0 && (
                    <div className="py-20 text-center">
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Search size={48} className="mx-auto text-muted-foreground/30" />
                        <p className="mt-4 font-display text-lg text-muted-foreground">No articles found</p>
                        <p className="mt-1 text-sm text-muted-foreground">Try different keywords or clear filters</p>
                        <button onClick={clearAllFilters}
                          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                          Clear All Filters
                        </button>
                      </motion.div>
                    </div>
                  )}

                  {/* Infinite scroll sentinel */}
                  {visibleCount < filtered.length && (
                    <div ref={sentinelRef} className="mt-8 flex items-center justify-center py-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
                      />
                      <span className="ml-3 text-sm text-muted-foreground">Loading more articles...</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ═══ RIGHT SIDEBAR ═══ */}
            <aside className="hidden lg:block space-y-6">
              {isLoading ? (
                <SidebarSkeleton />
              ) : (
                <>
                  {/* Trending */}
                  <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.01} transitionSpeed={600}>
                    <div className="news-sidebar-card rounded-2xl border border-border glass-strong p-5">
                      <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                        <TrendingUp size={14} className="text-destructive" /> Trending Now
                      </h3>
                      <div className="mt-4 space-y-3">
                        {trendingNews.slice(0, 6).map((n, i) => {
                          const tSlug = makeSlug(n.title);
                          const localized = getLocalizedNews(n);
                          return (
                            <Link key={i} to={`/news/${tSlug}`} className="group flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                              <div className="relative flex-shrink-0">
                                <img src={n.image} alt="" className="h-12 w-16 rounded-lg object-cover" loading="lazy" />
                                {n.hasVideo && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Play size={10} className="text-white drop-shadow" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className={`rounded px-1.5 py-0.5 text-[9px] font-medium ${catColors[n.category] || "bg-secondary text-foreground"}`}>
                                  {n.category}
                                </span>
                                <p className="mt-1 text-xs font-medium leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                  {localized.title}
                                </p>
                                <p className="mt-0.5 text-[10px] text-muted-foreground">{n.source} · {n.time}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </Tilt>

                  {/* Most Read */}
                  <div className="news-sidebar-card rounded-2xl border border-border glass-strong p-5">
                    <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                      <Eye size={14} className="text-primary" /> Most Read
                    </h3>
                    <div className="mt-4 space-y-2.5">
                      {mostRead.slice(0, 8).map((n, i) => {
                        const mSlug = makeSlug(n.title);
                        const localized = getLocalizedNews(n);
                        return (
                          <Link key={i} to={`/news/${mSlug}`} className="flex items-start gap-3 group">
                            <motion.span whileHover={{ scale: 1.15 }}
                              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg font-display text-xs font-bold transition-all ${
                                i < 3
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                              }`}>
                              {i + 1}
                            </motion.span>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">{localized.title}</p>
                              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Eye size={9} /> {formatViews(n.views)} views
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Explore */}
                  <div className="news-sidebar-card rounded-2xl border border-border glass-strong p-5">
                    <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                      <Hash size={14} className="text-primary" /> Quick Explore
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {categories.slice(1).map(cat => (
                        <motion.button key={cat} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveCat(cat)}
                          className={`rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
                            activeCat === cat
                              ? "bg-primary text-primary-foreground"
                              : "border border-border bg-secondary/30 text-muted-foreground hover:text-foreground hover:border-primary/20"
                          }`}>
                          {catIcons[cat]} {cat}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Bookmarked count */}
                  {bookmarked.size > 0 && (
                    <div className="news-sidebar-card rounded-2xl border border-border glass-strong p-5">
                      <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                        <Bookmark size={14} className="text-primary" /> Bookmarked
                      </h3>
                      <p className="mt-2 text-xs text-muted-foreground">
                        You've saved <span className="font-semibold text-primary">{bookmarked.size}</span> article{bookmarked.size > 1 ? "s" : ""} this session.
                      </p>
                    </div>
                  )}

                  {/* News Sources */}
                  <div className="news-sidebar-card rounded-2xl border border-border glass-strong p-5">
                    <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                      <BookOpen size={14} className="text-primary" /> News Sources
                    </h3>
                    <div className="mt-4 space-y-1.5">
                      {uniqueSources.slice(0, 12).map(([src, count]) => (
                        <motion.button key={src} whileTap={{ scale: 0.97 }}
                          onClick={() => setActiveSource(activeSource === src ? null : src)}
                          className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors cursor-pointer ${
                            activeSource === src
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                          }`}>
                          <span>{src}</span>
                          <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-medium">{count}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* ═══ EDITORIAL PICK — Read of the Day ═══ */}
      <section className="border-t border-border py-16 relative overflow-hidden aurora-bg">
        <div className="pointer-events-none absolute inset-0 mesh-gradient-advanced" />
        <div className="pointer-events-none absolute inset-0 grain" />
        <motion.div animate={{ opacity: [0.2, 0.4, 0.2], x: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="pointer-events-none absolute right-[5%] top-[10%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[150px] morph-blob" />
        <div className="container relative">
          <FadeInView>
            <div className="mb-8 flex items-center gap-3">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Star size={20} className="text-primary" />
              </motion.div>
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Editor's Pick</h2>
                <p className="text-xs text-muted-foreground">Hand-picked stories by our editorial team</p>
              </div>
            </div>
          </FadeInView>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trendingNews.slice(0, 3).map((news, i) => {
              const slug = makeSlug(news.title);
              return (
                <FadeInView key={i} delay={i * 0.1}>
                  <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} glareEnable glareMaxOpacity={0.06} glareColor="hsl(210 100% 56%)" glarePosition="all" glareBorderRadius="1rem" scale={1.02} transitionSpeed={400}>
                    <Link to={`/news/${slug}`} className="group block">
                      <div className="relative overflow-hidden rounded-2xl border border-border">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img src={news.image} alt={news.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          {i === 0 && (
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute left-3 top-3 rounded-lg bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground shadow-glow">
                              ⭐ TOP PICK
                            </motion.div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <span className={`rounded-md px-2 py-0.5 text-[9px] font-semibold ${catColors[news.category] || "bg-secondary text-foreground"}`}>
                              {catIcons[news.category]} {news.category}
                            </span>
                            <h3 className="mt-2 font-display text-lg font-bold text-white group-hover:text-primary transition-colors leading-tight line-clamp-2">{news.title}</h3>
                            <div className="mt-2 flex items-center gap-3 text-[10px] text-white/60">
                              <span>{news.source}</span>
                              <span className="flex items-center gap-1"><Eye size={9} /> {formatViews(news.views)}</span>
                              <span className="flex items-center gap-1"><Clock size={9} /> {news.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Tilt>
                </FadeInView>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ LIVE NEWS STATS COUNTER ═══ */}
      <section className="border-t border-border bg-card/50 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[
              { label: "Articles Published Today", value: "1,247", icon: Newspaper, color: "text-primary" },
              { label: "Active Readers Now", value: "12,890", icon: Eye, color: "text-emerald-400" },
              { label: "Categories Covered", value: "30+", icon: LayoutGrid, color: "text-violet-400" },
              { label: "Verified Sources", value: "50+", icon: BookOpen, color: "text-amber-400" },
              { label: "Languages Supported", value: "22", icon: Globe, color: "text-cyan-400" },
            ].map((stat, i) => (
              <FadeInView key={stat.label} delay={i * 0.08}>
                <motion.div whileHover={{ y: -3, scale: 1.02 }}
                  className="flex items-center gap-3 rounded-xl border border-border glass-strong p-4 transition-all hover:border-primary/20">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                  <div>
                    <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER & TRENDING TOPICS ═══ */}
      <section className="border-t border-border py-16 aurora-bg">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Newsletter Subscription */}
            <FadeInView>
              <div className="relative overflow-hidden rounded-2xl border border-border glass-strong p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-[60px]" />
                <div className="relative">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border glass px-3 py-1.5 text-xs text-muted-foreground">
                    <Bell size={12} className="text-primary" />
                    <span className="font-medium">Stay Informed</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Never Miss <span className="text-gradient">Breaking News</span>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get daily news digest delivered to your WhatsApp. 1000+ articles curated just for you.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3 flex-1">
                      <span className="text-sm text-muted-foreground">+91</span>
                      <input type="tel" placeholder="WhatsApp number" className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--success))] px-6 py-3 font-display text-sm font-semibold text-primary-foreground">
                      <MessageCircle size={16} /> Subscribe Free
                    </motion.button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Breaking News", "Exam Results", "Job Alerts", "Daily Digest"].map(tag => (
                      <span key={tag} className="rounded-full bg-primary/5 border border-primary/10 px-3 py-1 text-[10px] font-medium text-primary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInView>

            {/* Trending Topics */}
            <FadeInView delay={0.15}>
              <div className="relative overflow-hidden rounded-2xl border border-border glass-strong p-8">
                <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-destructive/10 blur-[60px]" />
                <div className="relative">
                  <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
                    <Flame size={18} className="text-destructive" /> Trending Topics Today
                  </h3>
                  <div className="mt-6 space-y-3">
                    {[
                      { topic: "UPSC CSE 2025 Results", mentions: "67.8K views", trend: "+142%" },
                      { topic: "SSC CGL 2026 Vacancies", mentions: "45.2K views", trend: "+98%" },
                      { topic: "India 3rd Largest Economy", mentions: "98.2K views", trend: "+235%" },
                      { topic: "NEET UG 2026 Date", mentions: "61.3K views", trend: "+167%" },
                      { topic: "Sensex 85,000 Record", mentions: "56.1K views", trend: "+89%" },
                    ].map((item, i) => (
                      <motion.div key={i} whileHover={{ x: 4 }}
                        className="group flex items-center justify-between rounded-xl border border-border bg-card/50 p-3.5 transition-all hover:border-primary/20 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 font-display text-xs font-bold text-primary">
                            #{i + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.topic}</p>
                            <p className="text-[10px] text-muted-foreground">{item.mentions}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-[hsl(var(--success))]/10 px-2 py-0.5 text-[10px] font-semibold text-[hsl(var(--success))]">
                          {item.trend}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>

      {/* ═══ NEWS BY REGION ═══ */}
      <section className="border-t border-border py-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 mesh-gradient liquid-bg" />
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-10" />
        <div className="pointer-events-none absolute inset-0 grain" />
        <motion.div animate={{ opacity: [0.1, 0.3, 0.1], x: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="pointer-events-none absolute left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[150px] morph-blob" />
        <div className="container">
          <FadeInView>
            <div className="text-center mb-10">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Regional Coverage</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
                News from <span className="text-gradient-accent">Every State</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">Comprehensive coverage across all 36 states & union territories</p>
            </div>
          </FadeInView>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9">
            {[
              { name: "Delhi", code: "DL", articles: 142 }, { name: "Maharashtra", code: "MH", articles: 128 },
              { name: "Uttar Pradesh", code: "UP", articles: 115 }, { name: "Tamil Nadu", code: "TN", articles: 98 },
              { name: "Karnataka", code: "KA", articles: 92 }, { name: "Gujarat", code: "GJ", articles: 85 },
              { name: "Rajasthan", code: "RJ", articles: 78 }, { name: "West Bengal", code: "WB", articles: 72 },
              { name: "Bihar", code: "BR", articles: 68 }, { name: "Madhya Pradesh", code: "MP", articles: 65 },
              { name: "Kerala", code: "KL", articles: 62 }, { name: "Telangana", code: "TS", articles: 58 },
              { name: "Andhra Pradesh", code: "AP", articles: 55 }, { name: "Punjab", code: "PB", articles: 48 },
              { name: "Haryana", code: "HR", articles: 45 }, { name: "Jharkhand", code: "JH", articles: 38 },
              { name: "Odisha", code: "OD", articles: 35 }, { name: "Assam", code: "AS", articles: 28 },
            ].map((state, i) => (
              <FadeInView key={state.code} delay={Math.min(i * 0.02, 0.3)}>
                <motion.div whileHover={{ y: -4, scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="group cursor-pointer rounded-xl border border-border glass p-3 text-center transition-all hover:border-primary/20 hover:shadow-glow">
                  <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    {state.code}
                  </div>
                  <p className="text-[10px] font-medium leading-tight text-foreground">{state.name}</p>
                  <span className="mt-1 inline-block rounded bg-secondary px-1.5 py-0.5 text-[9px] text-muted-foreground">
                    {state.articles} news
                  </span>
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWS CATEGORIES OVERVIEW ═══ */}
      <section className="border-t border-border py-16 bg-card/30">
        <div className="container">
          <FadeInView>
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Explore by <span className="text-shimmer">Category</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">30+ categories covering every aspect of Indian news</p>
            </div>
          </FadeInView>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
            {categories.slice(1, 19).map((cat, i) => (
              <FadeInView key={cat} delay={Math.min(i * 0.03, 0.3)}>
                <motion.button whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setActiveCat(cat); window.scrollTo({ top: 600, behavior: "smooth" }); }}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-border glass p-4 transition-all hover:border-primary/20 hover:shadow-glow">
                  <span className="text-2xl">{catIcons[cat] || "📰"}</span>
                  <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">{cat}</span>
                  <span className="rounded bg-secondary px-2 py-0.5 text-[9px] text-muted-foreground">
                    {categoryStats[cat] || 0} articles
                  </span>
                </motion.button>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWS FAQ ═══ */}
      <section className="border-t border-border py-16">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-10">
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                News <span className="text-gradient">FAQ</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">Common questions about our news coverage</p>
            </div>
          </FadeInView>
          <div className="mx-auto max-w-3xl space-y-3">
            {[
              { q: "How often is news updated?", a: "Our news feed is updated continuously, with 1000+ articles published daily across 30+ categories." },
              { q: "Are news articles verified?", a: "Yes, all articles are sourced from 50+ verified and trusted publishers including NDTV, Times of India, The Hindu, and more." },
              { q: "Can I get news in my language?", a: "We support 22 Indian languages including Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Urdu, Kannada, and more." },
              { q: "How do I get breaking news alerts?", a: "Subscribe with your WhatsApp number to receive instant breaking news alerts directly on your phone." },
              { q: "Can I filter news by category?", a: "Yes! Use the category sidebar or pills to filter by Education, Government Jobs, Technology, Sports, and 25+ other categories." },
            ].map((faq, i) => (
              <FadeInView key={i} delay={i * 0.05}>
                <motion.div whileHover={{ x: 3 }}
                  className="group rounded-xl border border-border glass p-5 transition-all hover:border-primary/20">
                  <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">{String(i+1).padStart(2,'0')}</span>
                    {faq.q}
                  </h4>
                  <p className="mt-2 pl-8 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWS SOURCES TRUST BAR ═══ */}
      <section className="border-t border-border py-12">
        <div className="container">
          <FadeInView>
            <p className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground mb-6">
              Trusted News Sources
            </p>
          </FadeInView>
          <div className="overflow-hidden relative">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />
            <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
              className="flex items-center gap-10 whitespace-nowrap">
              {[...uniqueSources, ...uniqueSources].map(([src], i) => (
                <span key={i} className="text-lg font-display font-semibold text-muted-foreground/25 hover:text-primary/50 transition-colors cursor-default">
                  {src}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ VIDEO HIGHLIGHTS ═══ */}
      <section className="border-t border-border py-16 bg-card/30">
        <div className="container">
          <FadeInView>
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground md:text-3xl">
                  <Video size={24} className="text-primary" /> Video <span className="text-shimmer">Highlights</span>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">Watch trending news videos and analysis</p>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} className="hidden sm:flex items-center gap-2 rounded-lg border border-border glass px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                View All <ChevronRight size={14} />
              </motion.button>
            </div>
          </FadeInView>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newsData.filter(n => n.hasVideo).slice(0, 4).map((news, i) => {
              const slug = makeSlug(news.title);
              return (
                <FadeInView key={i} delay={i * 0.08}>
                  <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} scale={1.02} transitionSpeed={400}>
                    <Link to={`/news/${slug}`} className="group block">
                      <div className="relative overflow-hidden rounded-xl border border-border transition-all hover:border-primary/20 hover:shadow-card">
                        <div className="relative aspect-video overflow-hidden">
                          <img src={news.image} alt={news.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <motion.div whileHover={{ scale: 1.2 }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-glow backdrop-blur-sm">
                            <Play size={20} />
                          </motion.div>
                          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur-sm">
                            <Clock size={9} /> {news.readTime || 3}:00
                          </div>
                          <span className={`absolute right-2 top-2 rounded-md px-2 py-0.5 text-[9px] font-semibold ${catColors[news.category] || "bg-secondary text-foreground"}`}>
                            {news.category}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-display text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{news.title}</h3>
                          <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{news.source}</span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5"><Eye size={9} /> {formatViews(news.views)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Tilt>
                </FadeInView>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ OPINION & EDITORIAL ═══ */}
      <section className="border-t border-border py-16 aurora-bg">
        <div className="container">
          <FadeInView>
            <div className="mb-10 text-center">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Expert Analysis</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
                Opinion & <span className="text-gradient">Editorial</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">In-depth analysis from education experts and industry leaders</p>
            </div>
          </FadeInView>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[{ title: "The Future of Competitive Exam Preparation in India", author: "Dr. Rajesh Kumar", role: "Education Policy Expert", excerpt: "How AI and digital platforms are transforming the way millions of Indian students prepare for competitive exams.", readTime: 8, image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=600&h=400&fit=crop" },
              { title: "Why India Needs More Transparent Recruitment Processes", author: "Priya Sharma", role: "Public Administration Analyst", excerpt: "An analysis of current challenges in government recruitment and proposed solutions for a fairer system.", readTime: 6, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop" },
              { title: "EdTech Revolution: Bridging the Urban-Rural Divide", author: "Amit Patel", role: "Technology Journalist", excerpt: "How platforms like ISHU are making quality education resources accessible to students in remote areas.", readTime: 7, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" },
            ].map((article, i) => (
              <FadeInView key={i} delay={i * 0.1}>
                <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable glareMaxOpacity={0.05} glareBorderRadius="1rem" scale={1.02} transitionSpeed={400}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-border glass-strong transition-all hover:border-primary/20 hover:shadow-card">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="rounded-md bg-primary/20 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-primary">📝 Opinion</span>
                        <span className="rounded-md bg-white/10 backdrop-blur-sm px-2 py-0.5 text-[10px] text-white/70">{article.readTime} min read</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">{article.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">{article.excerpt}</p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-bold text-primary">
                          {article.author.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{article.author}</p>
                          <p className="text-[10px] text-muted-foreground">{article.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tilt>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DAILY READING STATS ═══ */}
      <section className="border-t border-border py-12 bg-card/50">
        <div className="container">
          <FadeInView>
            <div className="rounded-2xl border border-border glass-strong p-8 md:p-10">
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div>
                  <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Today's Reading</span>
                  <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
                    Your Daily <span className="text-gradient">News Digest</span>
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Stay informed with the most important stories curated by our editorial team. 
                    Get personalized news based on your interests and exam preparation goals.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      href="https://wa.me/918986985813?text=Subscribe%20me%20to%20daily%20news%20digest"
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground hover:shadow-glow transition-all">
                      <Bell size={16} /> Get Daily Digest
                    </motion.a>
                    <Link to="/blog"
                      className="flex items-center gap-2 rounded-xl border border-border glass px-6 py-3 font-display text-sm font-semibold text-foreground hover:border-primary/30 transition-all">
                      <FileText size={16} /> Read Blog
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Articles", value: newsData.length.toString(), icon: Newspaper, color: "text-primary" },
                    { label: "Breaking News", value: newsData.filter(n => n.isBreaking).length.toString(), icon: Zap, color: "text-destructive" },
                    { label: "Video Stories", value: newsData.filter(n => n.hasVideo).length.toString(), icon: Video, color: "text-violet-400" },
                    { label: "Pinned Stories", value: newsData.filter(n => n.isPinned).length.toString(), icon: Star, color: "text-amber-400" },
                  ].map((stat) => (
                    <motion.div key={stat.label} whileHover={{ y: -3 }}
                      className="rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/20">
                      <stat.icon size={20} className={`mx-auto ${stat.color}`} />
                      <p className="mt-2 font-display text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Scroll to top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp size={18} />
      </motion.button>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Latest News & Updates — ISHU",
        description: "1000+ daily news articles across 30 categories in 22 Indian languages",
        url: "https://ishu.fun/news",
        publisher: { "@type": "EducationalOrganization", name: "ISHU — Indian StudentHub University" },
      }) }} />
    </Layout>
  );
};

export default NewsPage;
