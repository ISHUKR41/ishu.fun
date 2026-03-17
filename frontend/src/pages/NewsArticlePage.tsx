/**
 * NewsArticlePage.tsx - Individual News Article Page (814 lines)
 * 
 * Displays a full news article with rich content layout.
 * The article slug from the URL is used to find the matching article data.
 * 
 * Features:
 * - Reading progress bar at top of page
 * - Breadcrumb navigation (Home > News > Article)
 * - Article metadata (source, date, views, read time)
 * - Font size controls (increase/decrease text size)
 * - Social sharing buttons (WhatsApp, Twitter, LinkedIn, Copy link)
 * - Bookmark and like functionality
 * - Table of Contents sidebar
 * - Related articles section at bottom
 * - "Back to News" navigation
 * - GSAP scroll animations and parallax effects
 * - SEO: BreadcrumbSchema structured data
 */
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  Clock, ArrowLeft, ChevronRight, Globe, MessageCircle, Twitter,
  Linkedin, Copy, Check, TrendingUp, ExternalLink, Eye, Bookmark,
  Share2, Calendar, User, ThumbsUp, ArrowUp, Sparkles, BookOpen, Tag,
  Printer, Type, Minus, Plus, ChevronDown, AlertTriangle, Newspaper,
  Facebook, Mail, Play, Heart, Star, Hash, FileText, Volume2
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   ARTICLE DATA
   ═══════════════════════════════════════════ */

interface ArticleData {
  title: string; summary: string; content: string[]; category: string;
  source: string; sourceUrl: string; time: string; date: string;
  tags: string[]; related: string[]; views: number; image: string;
  readTime: number; hasVideo?: boolean;
}

const newsArticles: Record<string, ArticleData> = {
  "major-earthquake-alert-6-2-magnitude-quake-hits-northeast-india": {
    title: "Major Earthquake Alert: 6.2 Magnitude Quake Hits Northeast India",
    summary: "Tremors felt across Assam, Meghalaya, and parts of Bangladesh. No casualties reported so far. Rescue teams deployed immediately.",
    content: [
      "A powerful earthquake measuring 6.2 on the Richter scale struck northeast India early this morning, with the epicenter located approximately 50 km southeast of Imphal, Manipur, at a depth of 35 km.",
      "The tremors were felt across multiple states including Assam, Meghalaya, Nagaland, Tripura, and Mizoram, as well as neighboring Bangladesh and Myanmar. The earthquake lasted approximately 15 seconds.",
      "Key details of the earthquake:\n\n• Magnitude: 6.2 on Richter scale\n• Epicenter: 50 km SE of Imphal, Manipur\n• Depth: 35 km\n• Time: 5:42 AM IST\n• Duration: ~15 seconds\n• Aftershocks: 3 minor (2.1, 2.8, 3.1)",
      "The National Disaster Response Force (NDRF) has deployed 12 teams across the affected region. The Indian Army's Eastern Command has also mobilized resources for relief operations. So far, no casualties have been reported, though several buildings have developed cracks in Imphal and Silchar.",
      "India's National Center for Seismology has issued an advisory for possible aftershocks in the next 24-48 hours. Residents in the affected areas are advised to stay in open spaces and avoid damaged structures.",
      "The northeast region of India falls in Seismic Zone V, the highest seismic hazard zone. The region has experienced several major earthquakes historically, including the devastating 1950 Assam earthquake (8.6 magnitude)."
    ],
    category: "Breaking", source: "NDTV", sourceUrl: "https://ndtv.com",
    time: "30 min ago", date: "Mar 8, 2026",
    tags: ["Earthquake", "Northeast India", "NDRF", "Natural Disaster", "Manipur"],
    related: ["isro-successfully-tests-reusable-launch-vehicle-india-s-spacex-moment", "india-becomes-world-s-3rd-largest-economy-imf-report"],
    views: 45200, image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=600&fit=crop", readTime: 4,
  },
  "cbse-board-exams-2026-date-sheet-released-for-class-10th-and-12th": {
    title: "CBSE Board Exams 2026: Date Sheet Released for Class 10th and 12th",
    summary: "The Central Board of Secondary Education has released the complete date sheet for upcoming board examinations starting March 2026.",
    content: [
      "The Central Board of Secondary Education (CBSE) has officially released the complete date sheet for Class 10th and Class 12th board examinations for the academic year 2025-26. The exams are scheduled to begin from March 15, 2026.",
      "The date sheet covers all major subjects across both classes. For Class 12th, the exams will start with English Core on March 15 and conclude with Physical Education on April 25. Class 10th exams will run from March 16 to April 20.",
      "Key highlights of the CBSE Date Sheet 2026:\n\n• Class 12th English Core: March 15, 2026\n• Class 12th Mathematics: March 22, 2026\n• Class 12th Physics: March 28, 2026\n• Class 12th Chemistry: April 2, 2026\n• Class 10th Mathematics: March 20, 2026\n• Class 10th Science: March 26, 2026",
      "CBSE has also announced that admit cards will be available for download from the official website two weeks before the first exam. Students are advised to verify their details on the admit card and report any discrepancies to their respective schools immediately.",
      "The board has introduced several student-friendly measures this year, including additional 15 minutes for reading the question paper, a choice of questions in most subjects, and provisions for students with special needs.",
      "Students can download the complete date sheet from the official CBSE website at cbse.gov.in. The board also recommends students refer to the sample papers and marking schemes available on the website for effective preparation."
    ],
    category: "Education", source: "Times of India", sourceUrl: "https://timesofindia.com",
    time: "2 hours ago", date: "Mar 8, 2026",
    tags: ["CBSE", "Board Exams", "Date Sheet", "Class 10", "Class 12"],
    related: ["ssc-announces-15-000-vacancies-for-cgl-2026-biggest-recruitment-drive", "nta-launches-new-ai-powered-exam-portal-for-jee-neet-registrations"],
    views: 38400, image: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1200&h=600&fit=crop", readTime: 4,
  },
  "ssc-announces-15-000-vacancies-for-cgl-2026-biggest-recruitment-drive": {
    title: "SSC Announces 15,000+ Vacancies for CGL 2026 — Biggest Recruitment Drive",
    summary: "Staff Selection Commission opens applications for the largest CGL recruitment in recent years with over 15,000 vacancies across multiple departments.",
    content: [
      "The Staff Selection Commission (SSC) has officially announced the Combined Graduate Level (CGL) Examination 2026, with a record-breaking 15,000+ vacancies across various central government departments and ministries.",
      "This marks the largest SSC CGL recruitment drive in the commission's history, surpassing the previous record of 14,582 vacancies in 2025. The increase in vacancies is attributed to the government's push to fill pending positions across departments.",
      "Key details of SSC CGL 2026:\n\n• Total Vacancies: 15,000+ (expected to increase)\n• Application Start Date: March 10, 2026\n• Application Last Date: April 30, 2026\n• Tier-I Exam: July 2026 (tentative)\n• Eligibility: Graduate from any recognized university\n• Age Limit: 18-32 years (relaxation for reserved categories)",
      "The vacancies are spread across key departments including Income Tax, Customs & Excise, CAG, Central Secretariat, and various ministries. Posts include Tax Assistant, Auditor, Upper Division Clerk, and Sub-Inspector among others.",
      "Application fee is ₹100 for general/OBC candidates, while SC/ST and female candidates are exempt from paying the fee. Candidates can apply through the official SSC website at ssc.nic.in.",
    ],
    category: "Government Jobs", source: "NDTV", sourceUrl: "https://ndtv.com",
    time: "4 hours ago", date: "Mar 8, 2026",
    tags: ["SSC", "CGL", "Vacancies", "Government Jobs", "2026"],
    related: ["cbse-board-exams-2026-date-sheet-released-for-class-10th-and-12th", "upsc-cse-2025-final-results-declared-933-candidates-selected"],
    views: 32100, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop", readTime: 3,
  },
  "nta-launches-new-ai-powered-exam-portal-for-jee-neet-registrations": {
    title: "NTA Launches New AI-Powered Exam Portal for JEE & NEET Registrations",
    summary: "National Testing Agency introduces advanced AI features for seamless exam registration and result processing.",
    content: [
      "The National Testing Agency (NTA) has unveiled a revolutionary AI-powered examination portal that promises to streamline the registration process for JEE Main and NEET UG examinations.",
      "The new portal features AI-driven form filling assistance, real-time photo validation, and automated document verification. Students can now complete their registration in under 10 minutes compared to the previous 30-40 minutes.",
      "Key features include:\n\n• AI-assisted form completion with smart suggestions\n• Real-time photo and signature validation\n• Automated eligibility checking\n• Multi-language support in 13 Indian languages\n• Integrated payment gateway with UPI support",
      "NTA Chairman stated that the portal has been designed keeping in mind the challenges students face, especially those from rural areas with limited internet access. The portal works efficiently even on 2G connections and has a progressive web app version for mobile devices.",
      "The portal also includes a built-in exam preparation section with free mock tests, previous year papers, and AI-generated practice questions based on the student's weak areas."
    ],
    category: "Technology", source: "India Today", sourceUrl: "https://indiatoday.in",
    time: "5 hours ago", date: "Mar 8, 2026",
    tags: ["NTA", "AI", "JEE", "NEET", "Technology"],
    related: ["cbse-board-exams-2026-date-sheet-released-for-class-10th-and-12th"],
    views: 21500, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop", readTime: 3,
  },
  "upsc-cse-2025-final-results-declared-933-candidates-selected": {
    title: "UPSC CSE 2025 Final Results Declared — 933 Candidates Selected",
    summary: "Union Public Service Commission announces final results for Civil Services Examination 2025 with record number of women toppers.",
    content: [
      "The Union Public Service Commission (UPSC) has declared the final results of the Civil Services Examination (CSE) 2025, with 933 candidates recommended for appointment to various All India Services and Central Services.",
      "The topper of UPSC CSE 2025 is a 24-year-old engineering graduate from IIT Delhi who secured All India Rank 1 in her first attempt. She has opted for the Indian Administrative Service (IAS).",
      "Key statistics:\n\n• Total recommended: 933 candidates\n• General category: 412\n• OBC: 256\n• SC: 142\n• ST: 78\n• EWS: 45\n• Female candidates: 287 (30.7%)\n• First-attempt selections: 389 (41.6%)",
      "The commission noted a significant increase in selections from rural backgrounds, with 34% of successful candidates coming from small towns and villages. The youngest selected candidate is 21 years old, while the oldest is 32.",
      "UPSC has also released the marks of all candidates who appeared for the interview round. Candidates can check their individual marks on the official UPSC website upsc.gov.in."
    ],
    category: "Results", source: "The Hindu", sourceUrl: "https://thehindu.com",
    time: "6 hours ago", date: "Mar 8, 2026",
    tags: ["UPSC", "CSE", "Results", "IAS", "2025"],
    related: ["ssc-announces-15-000-vacancies-for-cgl-2026-biggest-recruitment-drive"],
    views: 67800, image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1200&h=600&fit=crop", readTime: 3,
  },
  "india-wins-test-series-against-australia-3-1-historic-victory": {
    title: "India Wins Test Series Against Australia 3-1 — Historic Victory",
    summary: "Indian cricket team scripts history with a dominant series win in Australia. Virat Kohli named Player of the Series.",
    content: [
      "The Indian cricket team has achieved a historic 3-1 series victory against Australia in the Border-Gavaskar Trophy 2025-26, marking one of the greatest achievements in Indian cricket history.",
      "The decisive fifth Test at the SCG saw India win by 8 wickets, with the Indian pace attack dismantling the Australian batting lineup for just 162 and 198 in the two innings.",
      "Series highlights:\n\n• 1st Test (Perth): India won by 295 runs\n• 2nd Test (Adelaide): Australia won by 10 wickets\n• 3rd Test (Brisbane): India won by 5 wickets\n• 4th Test (Melbourne): Match drawn\n• 5th Test (Sydney): India won by 8 wickets",
      "India's young batting sensation scored a century in the final Test, while the pace trio shared 47 wickets across the series. The spin all-rounder contributed crucial lower-order runs throughout.",
      "This victory also ensures India's qualification for the ICC World Test Championship Final, scheduled for June 2026 at Lord's, London."
    ],
    category: "Sports", source: "ESPN Cricinfo", sourceUrl: "https://espncricinfo.com",
    time: "12 hours ago", date: "Mar 8, 2026",
    tags: ["Cricket", "India", "Australia", "Test Series", "Sports"],
    related: ["cbse-board-exams-2026-date-sheet-released-for-class-10th-and-12th"],
    views: 89200, image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&h=600&fit=crop", readTime: 3, hasVideo: true,
  },
  "isro-successfully-tests-reusable-launch-vehicle-india-s-spacex-moment": {
    title: "ISRO Successfully Tests Reusable Launch Vehicle — India's SpaceX Moment",
    summary: "Indian Space Research Organisation achieves major milestone in reusable rocket technology with successful landing.",
    content: [
      "The Indian Space Research Organisation (ISRO) has successfully completed the autonomous landing experiment of its Reusable Launch Vehicle-Technology Demonstrator (RLV-TD), marking a giant leap in India's space capabilities.",
      "The RLV, nicknamed 'Pushpak', was carried to an altitude of 70 km by a helicopter before being released. It autonomously navigated back to the runway at the Aeronautical Test Range in Chitradurga, Karnataka.",
      "This achievement puts India in an elite group of nations working on reusable launch technology:\n\n• USA: SpaceX Falcon 9 (operational since 2015)\n• China: Long March 8 (testing phase)\n• India: RLV-TD Pushpak (testing phase)\n• Europe: Themis (development phase)",
      "ISRO Chairman said this technology will reduce launch costs by up to 80% once fully operational. The target is to have a fully reusable orbital launch vehicle by 2030.",
      "The success comes just months before ISRO's planned Chandrayaan-4 mission, which aims to bring back soil samples from the Moon's south pole."
    ],
    category: "Science", source: "The Print", sourceUrl: "https://theprint.in",
    time: "2 days ago", date: "Mar 6, 2026",
    tags: ["ISRO", "Space", "RLV", "Technology", "Science"],
    related: ["chandrayaan-4-isro-announces-moon-sample-return-mission-for-2028"],
    views: 73400, image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&h=600&fit=crop", readTime: 3, hasVideo: true,
  },
  "india-becomes-world-s-3rd-largest-economy-imf-report": {
    title: "India Becomes World's 3rd Largest Economy — IMF Report",
    summary: "International Monetary Fund officially confirms India overtakes Japan in GDP rankings.",
    content: [
      "The International Monetary Fund (IMF) has officially confirmed that India has surpassed Japan to become the world's third-largest economy by nominal GDP.",
      "According to the IMF's latest World Economic Outlook, India's GDP stands at $4.18 trillion, marginally ahead of Japan's $4.12 trillion.",
      "Factors driving India's economic rise:\n\n• Strong domestic consumption (1.4 billion population)\n• Digital economy growth (UPI, Digital India)\n• Manufacturing push (Make in India, PLI schemes)\n• Services sector dominance (IT, pharma, finance)\n• Young demographic (median age 28.4 years)",
      "The IMF report also projects India to maintain a GDP growth rate of 6.5-7% over the next five years.",
      "Prime Minister celebrated the achievement, stating that the government's goal is to make India a $10 trillion economy by 2032."
    ],
    category: "International", source: "Reuters", sourceUrl: "https://reuters.com",
    time: "3 days ago", date: "Mar 5, 2026",
    tags: ["India", "Economy", "GDP", "IMF", "International"],
    related: ["sensex-crosses-85-000-mark-new-all-time-high-on-budget-optimism"],
    views: 98200, image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=600&fit=crop", readTime: 3,
  },
  "sensex-crosses-85-000-mark-new-all-time-high-on-budget-optimism": {
    title: "Sensex Crosses 85,000 Mark — New All-Time High on Budget Optimism",
    summary: "Indian stock markets reach unprecedented levels fueled by positive budget announcements.",
    content: [
      "The BSE Sensex crossed the historic 85,000 mark for the first time, driven by investor optimism following the Union Budget 2026-27 announcements.",
      "The rally was led by IT, banking, and education technology stocks. The Nifty 50 also hit a new all-time high of 25,800.",
      "Market drivers:\n\n• Pro-growth budget with infrastructure focus\n• Tax rationalization measures\n• FII inflows of ₹15,000 crore in March alone\n• Strong Q3 corporate earnings\n• Positive global cues with US Fed rate cut expectations",
      "Banking stocks were the biggest gainers, with SBI, HDFC Bank, and ICICI Bank hitting 52-week highs.",
      "Analysts predict the Sensex could reach 90,000 by year-end if the government delivers on its budget promises."
    ],
    category: "Finance", source: "LiveMint", sourceUrl: "https://livemint.com",
    time: "1 day ago", date: "Mar 7, 2026",
    tags: ["Sensex", "Stock Market", "Finance", "Budget", "Economy"],
    related: ["india-becomes-world-s-3rd-largest-economy-imf-report"],
    views: 56100, image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop", readTime: 3,
  },
  "chandrayaan-4-isro-announces-moon-sample-return-mission-for-2028": {
    title: "Chandrayaan-4: ISRO Announces Moon Sample Return Mission for 2028",
    summary: "India's next lunar mission will bring back soil samples from the Moon's south pole.",
    content: [
      "The Indian Space Research Organisation (ISRO) has officially announced Chandrayaan-4, an ambitious lunar sample return mission targeted for 2028.",
      "The mission will build on the success of Chandrayaan-3's historic south pole landing in 2023 and aims to collect approximately 1-2 kg of lunar soil.",
      "Mission architecture:\n\n• Launch vehicle: LVM3 (GSLV Mk III)\n• Mission duration: 45 days (approx)\n• Landing site: Near Chandrayaan-3's Shiv Shakti Point\n• Sample collection: Robotic arm with drill\n• Sample return: Ascent vehicle + Earth return capsule",
      "ISRO Chairman explained that the south pole samples are scientifically invaluable as they may contain water ice and minerals not found in equatorial samples.",
      "The estimated cost of Chandrayaan-4 is ₹2,104 crore, making it one of the most cost-effective sample return missions ever planned."
    ],
    category: "Space", source: "Space.com", sourceUrl: "https://space.com",
    time: "4 days ago", date: "Mar 4, 2026",
    tags: ["ISRO", "Chandrayaan", "Moon", "Space", "Science"],
    related: ["isro-successfully-tests-reusable-launch-vehicle-india-s-spacex-moment"],
    views: 65800, image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&h=600&fit=crop", readTime: 3,
  },
  "jee-main-2026-session-2-registration-opens-check-important-dates": {
    title: "JEE Main 2026 Session 2: Registration Opens, Check Important Dates",
    summary: "NTA opens registration for JEE Main 2026 Session 2. Exam scheduled for April 2026.",
    content: [
      "The National Testing Agency (NTA) has opened the registration window for JEE Main 2026 Session 2.",
      "Important dates:\n\n• Registration Start: March 5, 2026\n• Registration End: April 5, 2026\n• Admit Card: April 15, 2026\n• Exam Dates: April 20-25, 2026\n• Result: May 10, 2026 (tentative)",
      "Candidates who appeared in Session 1 can improve their scores by appearing again. The best of the two scores will be considered for JEE Main ranking.",
      "The exam will be conducted in 13 languages and across 400+ centers nationwide. Computer-based testing (CBT) mode will be used for all papers.",
      "Students are advised to start their preparation early and focus on topics that carry higher weightage in the examination."
    ],
    category: "Exams", source: "Indian Express", sourceUrl: "https://indianexpress.com",
    time: "14 hours ago", date: "Mar 8, 2026",
    tags: ["JEE Main", "NTA", "Session 2", "Engineering", "2026"],
    related: ["nta-launches-new-ai-powered-exam-portal-for-jee-neet-registrations", "cbse-board-exams-2026-date-sheet-released-for-class-10th-and-12th"],
    views: 41200, image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop", readTime: 3,
  },
  "tata-group-launches-india-s-first-ai-chip-shakti-to-rival-global-giants": {
    title: "Tata Group Launches India's First AI Chip — 'Shakti' to Rival Global Giants",
    summary: "Tata Electronics unveils indigenous AI processor designed for edge computing and data center applications.",
    content: [
      "Tata Electronics has unveiled India's first indigenously designed AI processor chip named 'Shakti', marking a significant milestone in India's semiconductor journey.",
      "The Shakti chip is designed for edge AI applications, data center workloads, and IoT devices. It features a custom RISC-V architecture optimized for machine learning inference.",
      "Key specifications:\n\n• Architecture: Custom RISC-V with AI accelerators\n• Process Node: 7nm (fabricated at TSMC)\n• AI Performance: 100 TOPS (INT8)\n• Power Efficiency: 5x better than competing solutions\n• Target Markets: Edge AI, IoT, Data Centers",
      "This chip positions India as a serious player in the global semiconductor race, reducing dependence on foreign chip designs from companies like Nvidia, Intel, and AMD.",
      "The Indian government has committed ₹76,000 crore to the semiconductor sector under the India Semiconductor Mission, and Shakti represents the first major output of this initiative."
    ],
    category: "Technology", source: "Business Standard", sourceUrl: "https://business-standard.com",
    time: "1 week ago", date: "Mar 1, 2026",
    tags: ["Tata", "AI", "Semiconductor", "Shakti", "Technology"],
    related: ["nta-launches-new-ai-powered-exam-portal-for-jee-neet-registrations"],
    views: 44500, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop", readTime: 4,
  },
};

const catColors: Record<string, string> = {
  Education: "bg-blue-500/10 text-blue-400",
  "Government Jobs": "bg-emerald-500/10 text-emerald-400",
  Technology: "bg-violet-500/10 text-violet-400",
  Results: "bg-amber-500/10 text-amber-400",
  Exams: "bg-cyan-500/10 text-cyan-400",
  Banking: "bg-cyan-500/10 text-cyan-400",
  Defence: "bg-rose-500/10 text-rose-400",
  Sports: "bg-green-500/10 text-green-400",
  Science: "bg-indigo-500/10 text-indigo-400",
  International: "bg-sky-500/10 text-sky-400",
  Space: "bg-violet-500/10 text-violet-400",
  Breaking: "bg-red-600/20 text-red-400",
  Finance: "bg-yellow-500/10 text-yellow-400",
};

const languages = [
  "English", "हिंदी", "বাংলা", "తెలుగు", "मराठी", "தமிழ்",
  "ગુજરાતી", "اردو", "ಕನ್ನಡ", "ଓଡ଼ିଆ", "മലയാളം", "ਪੰਜਾਬੀ",
  "অসমীয়া", "मैथिली", "संस्कृतम्", "नेपाली", "कोंकणी",
  "डोगरी", "মৈতৈলোন্", "बड़ो", "سنڌي", "كٲشُر",
];

const formatViews = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

const NewsArticlePage = () => {
  const { newsSlug } = useParams<{ newsSlug: string }>();
  const article = newsSlug ? newsArticles[newsSlug] : null;
  const [lang, setLang] = useState("English");
  const [copied, setCopied] = useState(false);
  const [showLangs, setShowLangs] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showToc, setShowToc] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  // Reading progress
  const { scrollY, scrollYProgress } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const progressPercent = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // GSAP
  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".article-hero-title", { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" });
      gsap.from(".article-hero-meta", { y: 20, opacity: 0, duration: 0.6, delay: 0.3, ease: "power2.out" });
      gsap.from(".article-hero-badge", { scale: 0.8, opacity: 0, duration: 0.4, delay: 0.1, ease: "back.out(2)" });
    }, heroRef);
    return () => ctx.revert();
  }, [newsSlug]);

  useEffect(() => {
    if (!articleRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".article-para", {
        scrollTrigger: { trigger: articleRef.current, start: "top 80%" },
        y: 20, opacity: 0, stagger: 0.08, duration: 0.5, ease: "power2.out",
      });
      gsap.from(".article-sidebar-block", {
        scrollTrigger: { trigger: ".article-sidebar-block", start: "top 85%" },
        x: 30, opacity: 0, stagger: 0.1, duration: 0.5, ease: "power2.out",
      });
    }, articleRef);
    return () => ctx.revert();
  }, [newsSlug]);

  useEffect(() => {
    if (article) setLikeCount(Math.floor(article.views * 0.12));
  }, [article]);

  // Scroll tracking for ToC
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".article-para");
      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < 300 && rect.bottom > 0) setActiveSection(i);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handlePrint = () => window.print();

  // Not found
  if (!article) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <BookOpen size={40} className="text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Article Not Found</h1>
            <p className="mt-2 text-muted-foreground">This article may have been moved or removed.</p>
            <Link to="/news" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <ArrowLeft size={14} /> Back to News
            </Link>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  // Generate table of contents from content
  const tocItems = article.content.map((para, i) => {
    const firstLine = para.split("\n")[0];
    return firstLine.length > 60 ? firstLine.substring(0, 60) + "..." : firstLine;
  });

  const wordCount = article.content.join(" ").split(/\s+/).length;

  return (
    <Layout>
      <BreadcrumbSchema items={[{ name: "News", url: "/news" }, { name: article.category, url: `/news?cat=${article.category}` }]} />

      {/* Dynamic Background Image */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* Reading Progress Bar */}
      <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-16 z-50 h-1 origin-left bg-primary" />

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="relative aspect-[21/9] max-h-[480px] w-full overflow-hidden">
          <motion.img initial={{ scale: 1.1 }} animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src={article.image} alt={article.title}
            className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 pb-10">
          <div className="container">
            {/* Breadcrumb */}
            <div className="mb-4 flex items-center gap-2 text-sm text-white/60">
              <Link to="/" className="hover:text-white/90 transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link to="/news" className="hover:text-white/90 transition-colors">News</Link>
              <ChevronRight size={14} />
              <span className="text-white/80">{article.category}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 article-hero-badge">
              <span className="flex items-center gap-1.5 rounded-lg bg-white/10 backdrop-blur px-3 py-1 text-xs text-white/80">
                <Sparkles size={10} /> <strong>ISHU</strong> — Indian StudentHub University
              </span>
              <span className={`rounded-lg px-3 py-1 text-xs font-semibold ${catColors[article.category] || "bg-secondary text-foreground"}`}>
                {article.category}
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-white/10 backdrop-blur px-3 py-1 text-xs text-white/80">
                <Eye size={12} /> {formatViews(article.views)} views
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-white/10 backdrop-blur px-3 py-1 text-xs text-white/80">
                <Clock size={12} /> {article.readTime} min read
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-white/10 backdrop-blur px-3 py-1 text-xs text-white/80">
                <FileText size={12} /> {wordCount} words
              </span>
              {article.hasVideo && (
                <span className="flex items-center gap-1 rounded-lg bg-primary/20 backdrop-blur px-3 py-1 text-xs text-primary">
                  <Play size={12} /> Video Available
                </span>
              )}
            </div>

            <h1 className="article-hero-title mt-4 max-w-4xl font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <p className="article-hero-meta mt-4 max-w-3xl text-base text-white/70 md:text-lg">
              {article.summary}
            </p>

            <div className="article-hero-meta mt-5 flex flex-wrap items-center gap-5 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <User size={14} />
                </div>
                {article.source}
              </span>
              <span className="flex items-center gap-1"><Clock size={14} /> {article.time}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {article.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ARTICLE CONTENT ═══ */}
      <section ref={articleRef} className="py-12">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            {/* Main Content */}
            <div>
              {/* Action Bar */}
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border glass-strong p-4">
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${liked ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    <ThumbsUp size={16} fill={liked ? "currentColor" : "none"} />
                    <span>{likeCount}</span>
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${isBookmarked ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    <Bookmark size={16} fill={isBookmarked ? "currentColor" : "none"} />
                    {isBookmarked ? "Saved" : "Save"}
                  </motion.button>

                  {/* Print */}
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}
                    onClick={handlePrint}
                    className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
                    <Printer size={16} />
                    <span className="hidden sm:inline">Print</span>
                  </motion.button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Font size controls */}
                  <div className="flex items-center gap-1 rounded-xl border border-border bg-secondary/50 px-2 py-1">
                    <button onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
                      className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors"><Minus size={14} /></button>
                    <Type size={14} className="text-muted-foreground mx-1" />
                    <button onClick={() => setFontSize(prev => Math.min(22, prev + 1))}
                      className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors"><Plus size={14} /></button>
                  </div>

                  {/* Language toggle */}
                  <div className="relative">
                    <motion.button whileHover={{ scale: 1.05 }}
                      onClick={() => setShowLangs(!showLangs)}
                      className="flex items-center gap-2 rounded-xl border border-border glass px-3 py-2.5 text-sm text-foreground hover:border-primary/30 transition-all">
                      <Globe size={14} className="text-primary" />
                      <span className="hidden sm:inline">{lang}</span>
                    </motion.button>
                    <AnimatePresence>
                      {showLangs && (
                        <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          className="absolute right-0 top-12 z-50 max-h-72 w-52 overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-card">
                          {languages.map((l) => (
                            <button key={l} onClick={() => { setLang(l); setShowLangs(false); }}
                              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${lang === l ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                              {l}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Share buttons */}
                  <a href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + shareUrl)}`} target="_blank" rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors">
                    <MessageCircle size={16} />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors">
                    <Twitter size={16} />
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors">
                    <Linkedin size={16} />
                  </a>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
                    <Facebook size={16} />
                  </a>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={handleCopyLink}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    {copied ? <Check size={16} className="text-[hsl(var(--success))]" /> : <Copy size={16} />}
                  </motion.button>
                </div>
              </div>

              {/* Article Body */}
              <article className="space-y-6" style={{ fontSize: `${fontSize}px` }}>
                {article.content.map((para, i) => (
                  <div key={i} className="article-para" id={`section-${i}`}>
                    {para.includes("\n") ? (
                      <div className="rounded-xl border border-border glass p-5 space-y-2">
                        {para.split("\n").filter(Boolean).map((line, j) => (
                          <p key={j} className={`leading-relaxed ${
                            line.startsWith("•")
                              ? "flex items-start gap-2 pl-2 text-muted-foreground text-sm"
                              : "font-medium text-foreground"
                          }`}>
                            {line.startsWith("•") ? (
                              <>
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                                <span>{line.substring(2)}</span>
                              </>
                            ) : line}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="leading-relaxed text-muted-foreground">{para}</p>
                    )}
                  </div>
                ))}
              </article>

              {/* Source card */}
              <Tilt tiltMaxAngleX={3} tiltMaxAngleY={3} scale={1.01}>
                <div className="mt-8 rounded-xl border border-border glass-strong p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <ExternalLink size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Source: {article.source}</p>
                        <p className="text-xs text-muted-foreground">Read the original article</p>
                      </div>
                    </div>
                    <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                      Visit Source
                    </a>
                  </div>
                </div>
              </Tilt>

              {/* Tags */}
              <div className="mt-6">
                <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                  <Hash size={14} className="text-primary" /> Tags
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <motion.span key={tag} whileHover={{ scale: 1.05 }}
                      className="cursor-pointer rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/20 hover:text-foreground transition-all">
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Share strip */}
              <div className="mt-8 rounded-xl border border-border glass-strong p-5">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground mb-4">
                  <Share2 size={14} className="text-primary" /> Share this article
                </h3>
                <div className="flex flex-wrap gap-3">
                  <a href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + shareUrl)}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-[#25D366]/10 px-4 py-2.5 text-sm font-medium text-[#25D366] hover:bg-[#25D366]/20 transition-colors">
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-sky-500/10 px-4 py-2.5 text-sm font-medium text-sky-400 hover:bg-sky-500/20 transition-colors">
                    <Twitter size={16} /> Twitter
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-blue-600/10 px-4 py-2.5 text-sm font-medium text-blue-400 hover:bg-blue-600/20 transition-colors">
                    <Linkedin size={16} /> LinkedIn
                  </a>
                  <a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(shareUrl)}`}
                    className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <Mail size={16} /> Email
                  </a>
                  <button onClick={handleCopyLink}
                    className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    {copied ? <Check size={16} className="text-[hsl(var(--success))]" /> : <Copy size={16} />}
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              {/* Related News */}
              {article.related.length > 0 && (
                <div className="mt-12">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-primary" />
                    <h3 className="font-display text-xl font-bold text-foreground">Related News</h3>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {article.related.map((slug) => {
                      const related = newsArticles[slug];
                      if (!related) return null;
                      return (
                        <Link key={slug} to={`/news/${slug}`}>
                          <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={400}>
                            <motion.div whileTap={{ scale: 0.98 }}
                              className="group overflow-hidden rounded-xl border border-border glass transition-all hover:border-primary/20 hover:shadow-card">
                              <div className="aspect-video overflow-hidden">
                                <img src={related.image} alt={related.title}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                              </div>
                              <div className="p-5">
                                <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${catColors[related.category] || "bg-secondary text-foreground"}`}>
                                  {related.category}
                                </span>
                                <h4 className="mt-2 font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                  {related.title}
                                </h4>
                                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{related.summary}</p>
                                <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground">
                                  <span>{related.source}</span>
                                  <span className="flex items-center gap-1"><Clock size={10} /> {related.time}</span>
                                  <span className="flex items-center gap-1"><Eye size={10} /> {formatViews(related.views)}</span>
                                </div>
                              </div>
                            </motion.div>
                          </Tilt>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ═══ SIDEBAR ═══ */}
            <aside className="space-y-6">
              {/* Table of Contents */}
              <div className="article-sidebar-block sticky top-24 space-y-6">
                <div className="rounded-2xl border border-border glass-strong p-5">
                  <button onClick={() => setShowToc(!showToc)}
                    className="flex w-full items-center justify-between font-display text-sm font-bold text-foreground">
                    <span className="flex items-center gap-2">
                      <FileText size={14} className="text-primary" /> In This Article
                    </span>
                    <ChevronDown size={14} className={`transition-transform ${showToc ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showToc && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="mt-3 space-y-1 overflow-hidden">
                        {tocItems.map((item, i) => (
                          <button key={i}
                            onClick={() => document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                            className={`w-full rounded-lg px-3 py-2 text-left text-xs transition-all ${
                              activeSection === i
                                ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            }`}>
                            <span className="line-clamp-2">{item}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Article stats */}
                <div className="article-sidebar-block rounded-2xl border border-border glass-strong p-5">
                  <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground mb-3">
                    <Star size={14} className="text-amber-400" /> Article Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Views</span>
                      <span className="font-medium text-foreground">{formatViews(article.views)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Likes</span>
                      <span className="font-medium text-foreground">{likeCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Words</span>
                      <span className="font-medium text-foreground">{wordCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Read Time</span>
                      <span className="font-medium text-foreground">{article.readTime} min</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Published</span>
                      <span className="font-medium text-foreground">{article.date}</span>
                    </div>
                  </div>
                </div>

                {/* More from category */}
                <Tilt tiltMaxAngleX={4} tiltMaxAngleY={4} scale={1.01} transitionSpeed={600}>
                  <div className="article-sidebar-block rounded-2xl border border-border glass-strong p-5">
                    <h3 className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                      <TrendingUp size={14} className="text-destructive" /> More in {article.category}
                    </h3>
                    <div className="mt-4 space-y-3">
                      {Object.entries(newsArticles)
                        .filter(([s, n]) => s !== newsSlug && n.category === article.category)
                        .slice(0, 3)
                        .map(([slug, n]) => (
                          <Link key={slug} to={`/news/${slug}`} className="group flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                            <img src={n.image} alt="" className="h-12 w-16 flex-shrink-0 rounded-lg object-cover" loading="lazy" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">{n.title}</p>
                              <p className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                                <span>{n.source}</span>
                                <span className="flex items-center gap-0.5"><Eye size={9} /> {formatViews(n.views)}</span>
                              </p>
                            </div>
                          </Link>
                        ))}
                    </div>

                    {/* Show all articles if no same-category */}
                    {Object.entries(newsArticles).filter(([s, n]) => s !== newsSlug && n.category === article.category).length === 0 && (
                      <>
                        <p className="mt-2 text-xs text-muted-foreground mb-3">More articles you might like</p>
                        {Object.entries(newsArticles)
                          .filter(([s]) => s !== newsSlug)
                          .slice(0, 4)
                          .map(([slug, n]) => (
                            <Link key={slug} to={`/news/${slug}`} className="group flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0 mt-3">
                              <img src={n.image} alt="" className="h-12 w-16 flex-shrink-0 rounded-lg object-cover" loading="lazy" />
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">{n.title}</p>
                                <p className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                                  <span>{n.source}</span>
                                </p>
                              </div>
                            </Link>
                          ))}
                      </>
                    )}
                  </div>
                </Tilt>

                {/* Subscribe */}
                <div className="article-sidebar-block rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles size={16} />
                    <h3 className="font-display text-sm font-bold">Stay Updated</h3>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Get breaking news alerts directly on WhatsApp</p>
                  <Link to="/contact"
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    <MessageCircle size={14} /> Subscribe on WhatsApp
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Scroll to top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp size={18} />
      </motion.button>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description: article.summary,
        image: article.image,
        datePublished: article.date,
        wordCount: wordCount,
        publisher: { "@type": "EducationalOrganization", name: "ISHU — Indian StudentHub University" },
        author: { "@type": "Organization", name: article.source },
        mainEntityOfPage: { "@type": "WebPage", "@id": shareUrl },
      }) }} />
    </Layout>
  );
};

export default NewsArticlePage;
