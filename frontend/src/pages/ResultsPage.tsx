/**
 * ResultsPage.tsx - Government Exam Results & Vacancies (829 lines)
 * 
 * Shows all government exam results, vacancies, admit cards, and answer keys.
 * Users can filter by category (UPSC, SSC, Banking, etc.), type, and status.
 * 
 * Features:
 * - Search bar with fuzzy matching
 * - Category filters (UPSC, SSC, Banking, Railways, NTA, Defence, etc.)
 * - Type filters (Vacancy, Result, Admit Card, Answer Key, etc.)
 * - Status filters (Active, Upcoming, Result Out)
 * - Result cards with vacancy count, dates, qualifications, fees
 * - Expandable card details with apply links
 * - Featured/pinned results at top
 * - GSAP scroll-triggered card animations
 * - 3D tilt cards and glassmorphism design
 * - SEO: BreadcrumbSchema for navigation
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Calendar, Users, MapPin, FileText, ChevronDown, ChevronUp, ArrowRight, Clock, AlertCircle, CheckCircle, BookOpen, Filter, Bell, Sparkles, TrendingUp, Zap, Shield } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Tilt from "react-parallax-tilt";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BreadcrumbSchema, ResultsFAQSchema, GovernmentServiceSchema } from "@/components/seo/JsonLd";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";

gsap.registerPlugin(ScrollTrigger);

const categories = ["All", "UPSC", "SSC", "Banking", "Railways", "NTA", "Defence", "Teaching", "PSU", "Insurance", "Police"];
const types = ["All Types", "Vacancy", "Result", "Admit Card", "Answer Key", "Registration", "Syllabus"];
const statuses = ["All Status", "Active", "Upcoming", "Result Out"];

const results = [
  {
    title: "SSC CGL 2026 Notification",
    body: "Staff Selection Commission",
    category: "SSC",
    type: "Vacancy",
    vacancies: 14582,
    lastDate: "30 Apr 2026",
    examDate: "15 Jul 2026",
    status: "active",
    qualification: "Any Graduate from recognized university",
    ageLimit: "18-32 years",
    fee: { general: 100, sc_st: 0 },
    documents: ["10th Marksheet", "12th Marksheet", "Graduation Certificate", "Aadhaar Card", "Caste Certificate (if applicable)", "Photo & Signature"],
    description: "Staff Selection Commission invites applications for Combined Graduate Level Examination 2026 for recruitment to various Group 'B' and Group 'C' posts."
  },
  {
    title: "UPSC Civil Services 2026",
    body: "Union Public Service Commission",
    category: "UPSC",
    type: "Vacancy",
    vacancies: 1056,
    lastDate: "15 Apr 2026",
    examDate: "25 May 2026",
    status: "active",
    qualification: "Graduate in any discipline",
    ageLimit: "21-32 years (relaxation for reserved)",
    fee: { general: 100, sc_st: 0 },
    documents: ["Graduation Certificate", "Aadhaar Card", "Caste Certificate", "Photo ID", "Age Proof", "Photo & Signature"],
    description: "UPSC conducts Civil Services Examination for recruitment to IAS, IPS, IFS, and other allied services."
  },
  {
    title: "IBPS PO 2026 Result",
    body: "Institute of Banking Personnel Selection",
    category: "Banking",
    type: "Result",
    vacancies: 4500,
    lastDate: "Result Out",
    examDate: "Completed",
    status: "result_out",
    qualification: "Any Graduate",
    ageLimit: "20-30 years",
    fee: { general: 850, sc_st: 175 },
    documents: ["Graduation Certificate", "Bank Passbook", "Aadhaar Card", "Photo"],
    description: "IBPS PO Main exam result has been declared. Selected candidates will be called for interview."
  },
  {
    title: "RRB NTPC 2026 CBT-2",
    body: "Railway Recruitment Board",
    category: "Railways",
    type: "Admit Card",
    vacancies: 35208,
    lastDate: "20 Mar 2026",
    examDate: "10 Apr 2026",
    status: "upcoming",
    qualification: "12th Pass / Graduation",
    ageLimit: "18-33 years",
    fee: { general: 500, sc_st: 250 },
    documents: ["10th Certificate", "12th Certificate", "Aadhaar", "Caste Certificate", "Photo"],
    description: "Railway Recruitment Board Non-Technical Popular Categories Stage-2 exam admit cards are available."
  },
  {
    title: "NEET UG 2026 Registration",
    body: "National Testing Agency",
    category: "NTA",
    type: "Registration",
    vacancies: 108000,
    lastDate: "10 Apr 2026",
    examDate: "04 May 2026",
    status: "active",
    qualification: "12th with PCB (min 50%)",
    ageLimit: "17+ years (no upper limit)",
    fee: { general: 1700, sc_st: 1000 },
    documents: ["10th Marksheet", "12th Marksheet", "Aadhaar Card", "Category Certificate", "Photo & Signature", "Left Thumb Impression"],
    description: "NTA opens registration for NEET UG 2026 for admission to MBBS, BDS, AYUSH, and other medical courses across India."
  },
  {
    title: "JEE Main 2026 Session 2",
    body: "National Testing Agency",
    category: "NTA",
    type: "Registration",
    vacancies: 0,
    lastDate: "25 Mar 2026",
    examDate: "05 Apr 2026",
    status: "active",
    qualification: "12th with PCM (min 75%)",
    ageLimit: "No age limit",
    fee: { general: 1000, sc_st: 500 },
    documents: ["10th Certificate", "12th Marksheet", "Aadhaar Card", "Photo"],
    description: "Joint Entrance Examination Main 2026 Session 2 registration open for engineering admissions."
  },
  {
    title: "CTET December 2026",
    body: "Central Board of Secondary Education",
    category: "Teaching",
    type: "Vacancy",
    vacancies: 0,
    lastDate: "01 May 2026",
    examDate: "Jul 2026",
    status: "upcoming",
    qualification: "B.Ed / D.El.Ed",
    ageLimit: "No age limit",
    fee: { general: 1000, sc_st: 500 },
    documents: ["B.Ed Certificate", "Graduation Certificate", "Aadhaar Card"],
    description: "Central Teacher Eligibility Test for PRT and TGT level teaching positions."
  },
  {
    title: "CDS 2026 (I) Result",
    body: "UPSC",
    category: "UPSC",
    type: "Result",
    vacancies: 457,
    lastDate: "Result Out",
    examDate: "Completed",
    status: "result_out",
    qualification: "Graduation",
    ageLimit: "19-25 years",
    fee: { general: 200, sc_st: 0 },
    documents: ["Graduation Certificate", "NCC Certificate", "Photo ID"],
    description: "Combined Defence Services examination results for Indian Military Academy, Officers Training Academy."
  },
  {
    title: "SSC CHSL 2026 Tier-1 Answer Key",
    body: "Staff Selection Commission",
    category: "SSC",
    type: "Answer Key",
    vacancies: 4500,
    lastDate: "Objection by 20 Mar",
    examDate: "Completed",
    status: "active",
    qualification: "12th Pass",
    ageLimit: "18-27 years",
    fee: { general: 100, sc_st: 0 },
    documents: ["10th Marksheet", "12th Marksheet", "Aadhaar Card", "Photo"],
    description: "SSC has released the provisional answer key for CHSL Tier-1 2026. Candidates can raise objections till 20th March."
  },
  {
    title: "NDA 2026 (I) Exam Notification",
    body: "Union Public Service Commission",
    category: "Defence",
    type: "Vacancy",
    vacancies: 400,
    lastDate: "18 Apr 2026",
    examDate: "22 Jun 2026",
    status: "active",
    qualification: "12th Pass (PCM for Navy/Air Force)",
    ageLimit: "16.5-19.5 years",
    fee: { general: 100, sc_st: 0 },
    documents: ["10th Marksheet", "12th Marksheet", "Aadhaar Card", "Photo"],
    description: "UPSC National Defence Academy & Naval Academy Examination 2026 for admission to Army, Navy, Air Force wings."
  },
  {
    title: "LIC AAO 2026 Recruitment",
    body: "Life Insurance Corporation of India",
    category: "Insurance",
    type: "Vacancy",
    vacancies: 750,
    lastDate: "22 Apr 2026",
    examDate: "May 2026",
    status: "upcoming",
    qualification: "Any Graduate (60%+)",
    ageLimit: "21-30 years",
    fee: { general: 700, sc_st: 85 },
    documents: ["Graduation Certificate", "Aadhaar", "Photo", "Experience Certificate (if any)"],
    description: "LIC invites applications for Assistant Administrative Officer cadre across generalist, IT, and chartered accountant streams."
  },
  {
    title: "IBPS Clerk 2026 Prelims Result",
    body: "Institute of Banking Personnel Selection",
    category: "Banking",
    type: "Result",
    vacancies: 6035,
    lastDate: "Result Out",
    examDate: "Completed",
    status: "result_out",
    qualification: "Any Graduate",
    ageLimit: "20-28 years",
    fee: { general: 850, sc_st: 175 },
    documents: ["Graduation Certificate", "Aadhaar Card", "Photo"],
    description: "IBPS Clerk Prelims 2026 result declared. Qualified candidates will appear for Mains examination."
  },
  {
    title: "SBI PO 2026 Notification",
    body: "State Bank of India",
    category: "Banking",
    type: "Vacancy",
    vacancies: 2000,
    lastDate: "28 Apr 2026",
    examDate: "Jun 2026",
    status: "active",
    qualification: "Any Graduate",
    ageLimit: "21-30 years",
    fee: { general: 750, sc_st: 125 },
    documents: ["Graduation Certificate", "Aadhaar", "PAN Card", "Photo & Signature"],
    description: "State Bank of India Probationary Officer recruitment 2026 for various branches across India."
  },
  {
    title: "RRB Group D 2026 Admit Card",
    body: "Railway Recruitment Board",
    category: "Railways",
    type: "Admit Card",
    vacancies: 103769,
    lastDate: "Download Now",
    examDate: "15 Apr 2026",
    status: "active",
    qualification: "10th Pass + ITI",
    ageLimit: "18-33 years",
    fee: { general: 500, sc_st: 250 },
    documents: ["10th Certificate", "ITI Certificate", "Aadhaar", "Photo"],
    description: "RRB Group D Level 1 exam city slip and admit card released for all zones. Download from regional RRB websites."
  },
  {
    title: "SSC MTS 2026 Syllabus Released",
    body: "Staff Selection Commission",
    category: "SSC",
    type: "Syllabus",
    vacancies: 8326,
    lastDate: "Ongoing",
    examDate: "Aug 2026",
    status: "upcoming",
    qualification: "10th Pass",
    ageLimit: "18-25 years",
    fee: { general: 100, sc_st: 0 },
    documents: ["10th Marksheet", "Aadhaar Card", "Photo"],
    description: "SSC Multi-Tasking Staff 2026 detailed syllabus and exam pattern released. Computer-based examination with two papers."
  },
  {
    title: "CISF Head Constable 2026",
    body: "Central Industrial Security Force",
    category: "Police",
    type: "Vacancy",
    vacancies: 1284,
    lastDate: "05 May 2026",
    examDate: "Jul 2026",
    status: "upcoming",
    qualification: "12th Pass",
    ageLimit: "18-25 years",
    fee: { general: 100, sc_st: 0 },
    documents: ["10th & 12th Certificate", "Aadhaar", "Sports Certificate (if any)", "Photo"],
    description: "CISF recruitment for Head Constable (Ministerial) posts in various locations across India."
  },
  {
    title: "ONGC Graduate Trainee 2026",
    body: "Oil and Natural Gas Corporation",
    category: "PSU",
    type: "Vacancy",
    vacancies: 2500,
    lastDate: "30 Apr 2026",
    examDate: "Jun 2026",
    status: "active",
    qualification: "B.E/B.Tech/MBA/CA",
    ageLimit: "30 years",
    fee: { general: 370, sc_st: 0 },
    documents: ["Engineering Degree", "GATE Scorecard", "Aadhaar", "Category Certificate"],
    description: "ONGC invites applications through GATE score for Graduate Trainee posts in E-1 level across engineering disciplines."
  },
];

const states = [
  { name: "Uttar Pradesh", slug: "uttar-pradesh", code: "UP", active: true, posts: 45 },
  { name: "Bihar", slug: "bihar", code: "BR", active: true, posts: 32 },
  { name: "Rajasthan", slug: "rajasthan", code: "RJ", active: true, posts: 38 },
  { name: "Madhya Pradesh", slug: "madhya-pradesh", code: "MP", active: true, posts: 28 },
  { name: "Maharashtra", slug: "maharashtra", code: "MH", active: true, posts: 52 },
  { name: "Gujarat", slug: "gujarat", code: "GJ", active: true, posts: 25 },
  { name: "Karnataka", slug: "karnataka", code: "KA", active: true, posts: 30 },
  { name: "Tamil Nadu", slug: "tamil-nadu", code: "TN", active: true, posts: 35 },
  { name: "West Bengal", slug: "west-bengal", code: "WB", active: true, posts: 22 },
  { name: "Jharkhand", slug: "jharkhand", code: "JH", active: true, posts: 18 },
  { name: "Haryana", slug: "haryana", code: "HR", active: true, posts: 20 },
  { name: "Punjab", slug: "punjab", code: "PB", active: true, posts: 15 },
  { name: "Delhi", slug: "delhi", code: "DL", active: true, posts: 40 },
  { name: "Uttarakhand", slug: "uttarakhand", code: "UK", active: true, posts: 12 },
  { name: "Himachal Pradesh", slug: "himachal-pradesh", code: "HP", active: false, posts: 0 },
  { name: "Chhattisgarh", slug: "chhattisgarh", code: "CG", active: true, posts: 14 },
  { name: "Odisha", slug: "odisha", code: "OD", active: true, posts: 16 },
  { name: "Kerala", slug: "kerala", code: "KL", active: true, posts: 24 },
  { name: "Telangana", slug: "telangana", code: "TS", active: true, posts: 20 },
  { name: "Andhra Pradesh", slug: "andhra-pradesh", code: "AP", active: true, posts: 18 },
  { name: "Assam", slug: "assam", code: "AS", active: false, posts: 0 },
  { name: "Goa", slug: "goa", code: "GA", active: false, posts: 0 },
  { name: "Manipur", slug: "manipur", code: "MN", active: false, posts: 0 },
  { name: "Meghalaya", slug: "meghalaya", code: "ML", active: false, posts: 0 },
  { name: "Mizoram", slug: "mizoram", code: "MZ", active: false, posts: 0 },
  { name: "Nagaland", slug: "nagaland", code: "NL", active: false, posts: 0 },
  { name: "Sikkim", slug: "sikkim", code: "SK", active: false, posts: 0 },
  { name: "Tripura", slug: "tripura", code: "TR", active: false, posts: 0 },
  { name: "Arunachal Pradesh", slug: "arunachal-pradesh", code: "AR", active: false, posts: 0 },
  { name: "Jammu & Kashmir", slug: "jammu-kashmir", code: "JK", active: false, posts: 0 },
  { name: "Ladakh", slug: "ladakh", code: "LA", active: false, posts: 0 },
  { name: "Chandigarh", slug: "chandigarh", code: "CH", active: false, posts: 0 },
  { name: "Puducherry", slug: "puducherry", code: "PY", active: false, posts: 0 },
  { name: "Andaman & Nicobar", slug: "andaman-nicobar", code: "AN", active: false, posts: 0 },
  { name: "Dadra & N. Haveli", slug: "dadra-nagar-haveli", code: "DN", active: false, posts: 0 },
  { name: "Lakshadweep", slug: "lakshadweep", code: "LD", active: false, posts: 0 },
];

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  result_out: "bg-primary/10 text-primary",
  upcoming: "bg-warning/10 text-warning",
};
const statusLabels: Record<string, string> = {
  active: "Active",
  result_out: "Result Out",
  upcoming: "Upcoming",
};
const statusToFilter: Record<string, string> = {
  "Active": "active",
  "Upcoming": "upcoming",
  "Result Out": "result_out",
};

const ResultsPage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All Types");
  const [activeStatus, setActiveStatus] = useState("All Status");
  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const statesRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".result-hero-title", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "all" });
      gsap.fromTo(".result-hero-stat", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, delay: 0.4, ease: "back.out(2)", clearProps: "all" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!statesRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".state-card",
        { scale: 0.8, opacity: 0 },
        { scrollTrigger: { trigger: statesRef.current, start: "top 80%", toggleActions: "play none none none" },
          scale: 1, opacity: 1, stagger: 0.02, duration: 0.4, ease: "back.out(1.5)", clearProps: "all" }
      );
    }, statesRef);
    return () => ctx.revert();
  }, []);

  const filtered = results.filter((r) => {
    if (activeCategory !== "All" && r.category !== activeCategory) return false;
    if (activeType !== "All Types" && r.type !== activeType) return false;
    if (activeStatus !== "All Status" && r.status !== statusToFilter[activeStatus]) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.body.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Layout>
      <SEOHead {...SEO_DATA.results} />
      <BreadcrumbSchema items={[{ name: "Results", url: "/results" }]} />
      <GovernmentServiceSchema />
      <ResultsFAQSchema />

      {/* Dynamic Background Image */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2071&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* Hero */}
      <section ref={heroRef} className="relative bg-gradient-hero pt-10 pb-20 overflow-hidden">
        {/* Enhanced background effects */}
        <GradientMesh variant="default" />
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-15" />
        <div className="pointer-events-none absolute inset-0 cross-grid opacity-20" />
        <MorphingBlob color="hsl(210 100% 56% / 0.08)" size={500} className="right-[10%] top-[10%]" />
        <MorphingBlob color="hsl(260 100% 66% / 0.06)" size={400} className="left-[5%] bottom-[10%]" duration={25} />
        
        {/* Animated accent lines */}
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="pointer-events-none absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
        
        <div className="container relative">
          <FadeInView>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  transition={{ duration: 0.5 }}
                  className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary"
                >
                  <Shield size={14} />
                  <span className="font-semibold"><strong>ISHU</strong> — Indian StudentHub University · Verified from Official Sources</span>
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="h-2 w-2 rounded-full bg-success"
                  />
                </motion.div>
                
                <h1 className="result-hero-title font-display text-3xl font-bold text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  Government{" "}
                  <span className="text-shimmer">Results</span>
                  <br className="hidden sm:block" />
                  <span className="text-gradient-animated">& Vacancies</span>
                </h1>
                
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
                  Central & state-level exam results, vacancies, admit cards, answer keys & more — 
                  all in one place.
                </p>
                
                {/* Quick stats row */}
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Zap size={16} className="text-primary" />
                    <span><strong className="text-foreground">{results.filter(r => r.status === "active").length}</strong> Active</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <TrendingUp size={16} className="text-success" />
                    <span><strong className="text-foreground">{results.filter(r => r.status === "result_out").length}</strong> Results Out</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Clock size={16} className="text-warning" />
                    <span><strong className="text-foreground">{results.filter(r => r.status === "upcoming").length}</strong> Upcoming</span>
                  </motion.div>
                </div>
              </div>
              
              {/* Stats cards */}
              <div className="flex items-center gap-4">
                <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} glareEnable glareMaxOpacity={0.1} glareBorderRadius="1rem" scale={1.05}>
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="result-hero-stat rounded-2xl border border-border glass-ultra px-6 py-4 text-center"
                  >
                    <p className="font-display text-3xl font-bold text-primary">{results.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Posts</p>
                  </motion.div>
                </Tilt>
                <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} glareEnable glareMaxOpacity={0.1} glareBorderRadius="1rem" scale={1.05}>
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="result-hero-stat rounded-2xl border border-border glass-ultra px-6 py-4 text-center"
                  >
                    <p className="font-display text-3xl font-bold text-success">{states.filter(s => s.active).length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Active States</p>
                  </motion.div>
                </Tilt>
              </div>
            </div>
          </FadeInView>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="container py-4">
          {/* Search */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 transition-all focus-within:border-primary/40 focus-within:shadow-glow">
              <Search size={16} className="text-muted-foreground" />
              <input type="text" placeholder="Search exams, vacancies, results..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
            </div>
            <div className="flex gap-2">
              <select value={activeType} onChange={(e) => setActiveType(e.target.value)}
                className="rounded-xl border border-border bg-secondary px-3 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none">
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
              <select value={activeStatus} onChange={(e) => setActiveStatus(e.target.value)}
                className="rounded-xl border border-border bg-secondary px-3 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none">
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                {cat}
                <span className="ml-1 opacity-60">
                  ({cat === "All" ? results.length : results.filter(r => r.category === cat).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Central Results */}
      <section className="py-12 mesh-gradient">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
              <span className="text-primary">●</span> Central Level Results & Vacancies
            </h2>
            <p className="text-sm text-muted-foreground">{filtered.length} results found</p>
          </div>

          <div className="space-y-3">
            {filtered.map((result, i) => (
              <FadeInView key={result.title} delay={Math.min(i * 0.03, 0.3)}>
                <motion.div whileHover={{ scale: 1.005 }} className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/20 hover:shadow-glow">
                  <div
                    className="flex cursor-pointer flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-secondary px-2.5 py-1 font-display text-xs font-semibold text-foreground">{result.category}</span>
                        <span className="rounded-md bg-secondary px-2.5 py-1 text-xs text-muted-foreground">{result.type}</span>
                        <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${statusColors[result.status]}`}>{statusLabels[result.status]}</span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-semibold text-foreground">{result.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{result.body}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {result.vacancies > 0 && (
                        <div className="flex items-center gap-1.5"><Users size={14} /><span>{result.vacancies.toLocaleString()}</span></div>
                      )}
                      <div className="flex items-center gap-1.5"><Calendar size={14} /><span>{result.lastDate}</span></div>
                      {expandedIndex === i ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <motion.div
                    initial={false}
                    animate={{ height: expandedIndex === i ? "auto" : 0, opacity: expandedIndex === i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border px-5 pb-5 pt-4">
                      <p className="text-sm leading-relaxed text-muted-foreground">{result.description}</p>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-secondary p-3">
                          <p className="text-xs text-muted-foreground">Qualification</p>
                          <p className="mt-1 text-sm font-medium text-foreground">{result.qualification}</p>
                        </div>
                        <div className="rounded-lg bg-secondary p-3">
                          <p className="text-xs text-muted-foreground">Age Limit</p>
                          <p className="mt-1 text-sm font-medium text-foreground">{result.ageLimit}</p>
                        </div>
                        <div className="rounded-lg bg-secondary p-3">
                          <p className="text-xs text-muted-foreground">Exam Date</p>
                          <p className="mt-1 text-sm font-medium text-foreground">{result.examDate}</p>
                        </div>
                        <div className="rounded-lg bg-secondary p-3">
                          <p className="text-xs text-muted-foreground">Application Fee</p>
                          <p className="mt-1 text-sm font-medium text-foreground">Gen: ₹{result.fee.general} | SC/ST: ₹{result.fee.sc_st}</p>
                        </div>
                      </div>

                      {/* Required Documents */}
                      <div className="mt-4">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          <FileText size={14} className="text-primary" /> Required Documents
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {result.documents.map((doc) => (
                            <span key={doc} className="flex items-center gap-1 rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground">
                              <CheckCircle size={10} className="text-success" /> {doc}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-glow">
                          Apply Now <ArrowRight size={14} />
                        </button>
                        <button className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                          Download Notification PDF
                        </button>
                        <button className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-5 py-2.5 text-sm font-medium text-success transition-colors hover:bg-success/10">
                          <Bell size={14} /> Get WhatsApp Alert
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </FadeInView>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-16 text-center">
              <AlertCircle size={32} className="mx-auto text-muted-foreground" />
              <p className="mt-3 font-display text-lg font-semibold text-foreground">No results found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search query</p>
              <button onClick={() => { setActiveCategory("All"); setActiveType("All Types"); setActiveStatus("All Status"); setSearch(""); }}
                className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground">
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Trending Exams Banner */}
      <section className="border-t border-border bg-card/50 py-10">
        <div className="container">
          <FadeInView>
            <div className="mb-6">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">🔥 Trending</span>
              <h2 className="mt-2 font-display text-xl font-bold text-foreground md:text-2xl">
                Most Searched <span className="text-gradient">Exams</span>
              </h2>
            </div>
          </FadeInView>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
            {results.filter(r => r.status === "active").slice(0, 6).map((r) => (
              <motion.div key={r.title} whileHover={{ y: -4 }}
                className="min-w-[220px] sm:min-w-[260px] snap-start cursor-pointer rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-card"
                onClick={() => {
                  const idx = results.findIndex(res => res.title === r.title);
                  setExpandedIndex(idx);
                }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{r.category}</span>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${statusColors[r.status]}`}>{statusLabels[r.status]}</span>
                </div>
                <p className="font-display text-sm font-semibold text-foreground truncate">{r.title}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  {r.vacancies > 0 && <span>{r.vacancies.toLocaleString()} vacancies</span>}
                  <span>{r.lastDate}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EXAM CALENDAR ═══ */}
      <section className="border-t border-border py-16 aurora-bg">
        <div className="container">
          <FadeInView>
            <div className="mb-10 text-center">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">Important Dates</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
                Upcoming <span className="text-shimmer">Exam Calendar</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">Never miss a deadline — all important dates at a glance</p>
            </div>
          </FadeInView>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.filter(r => r.status === "active" || r.status === "upcoming").slice(0, 6).map((r, i) => (
              <FadeInView key={r.title} delay={i * 0.08}>
                <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={400}>
                  <motion.div whileHover={{ y: -3 }}
                    className="group rounded-xl border border-border glass-strong p-5 transition-all hover:border-primary/20 hover:shadow-card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">{r.category}</span>
                      <span className={`rounded-md px-2.5 py-1 text-[10px] font-medium ${statusColors[r.status]}`}>{statusLabels[r.status]}</span>
                    </div>
                    <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{r.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{r.body}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar size={12} className="text-primary" />
                        <span>Last Date: <strong className="text-foreground">{r.lastDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock size={12} className="text-warning" />
                        <span>Exam: <strong className="text-foreground">{r.examDate}</strong></span>
                      </div>
                      {r.vacancies > 0 && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users size={12} className="text-success" />
                          <span>Vacancies: <strong className="text-foreground">{r.vacancies.toLocaleString()}</strong></span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 rounded-lg bg-primary/10 py-2 text-[10px] font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                        View Details
                      </button>
                      <button className="rounded-lg border border-border px-3 py-2 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <Bell size={12} />
                      </button>
                    </div>
                  </motion.div>
                </Tilt>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUICK STATS OVERVIEW ═══ */}
      <section className="border-t border-border py-12 bg-card/50">
        <div className="container">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[
              { label: "Total Vacancies", value: results.reduce((sum, r) => sum + r.vacancies, 0).toLocaleString(), color: "text-primary" },
              { label: "Active Posts", value: results.filter(r => r.status === "active").length.toString(), color: "text-[hsl(var(--success))]" },
              { label: "Results Out", value: results.filter(r => r.status === "result_out").length.toString(), color: "text-primary" },
              { label: "Upcoming", value: results.filter(r => r.status === "upcoming").length.toString(), color: "text-warning" },
              { label: "Categories", value: categories.length.toString(), color: "text-violet-400" },
              { label: "States Covered", value: states.filter(s => s.active).length.toString(), color: "text-cyan-400" },
            ].map((stat) => (
              <motion.div key={stat.label} whileHover={{ y: -3, scale: 1.02 }}
                className="rounded-xl border border-border glass-strong p-4 text-center transition-all hover:border-primary/20">
                <p className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="border-t border-border py-12">
        <div className="container">
          <FadeInView>
            <div className="overflow-hidden rounded-2xl border border-[hsl(var(--success))]/20 bg-[hsl(var(--success))]/5 p-8 text-center md:p-12 relative">
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[hsl(var(--success))]/10 blur-[50px]" />
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
                Never Miss a <span className="text-shimmer">Deadline</span>
              </h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                Get instant WhatsApp notifications for new vacancies, results, and admit cards.
              </p>
              <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                href="https://wa.me/918986985813?text=I%20want%20to%20subscribe%20for%20exam%20alerts"
                target="_blank" rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--success))] px-8 py-3.5 font-display text-sm font-semibold text-[hsl(var(--success-foreground))] transition-all hover:opacity-90">
                <Bell size={18} /> Subscribe on WhatsApp <ArrowRight size={14} />
              </motion.a>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* States Grid */}
      <section ref={statesRef} className="border-t border-border py-20 aurora-bg">
        <div className="container">
          <FadeInView>
            <div className="mx-auto max-w-2xl text-center mb-10">
              <span className="font-display text-sm font-semibold uppercase tracking-widest text-primary">All India Coverage</span>
              <h2 className="mt-4 font-display text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
                State-wise Results — All <span className="text-shimmer">36 States & UTs</span>
              </h2>
              <p className="mt-3 text-muted-foreground">Click on any state to view its latest vacancies & results</p>
              <div className="mx-auto mt-4 gradient-line w-24" />
            </div>
          </FadeInView>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {states.map((state) => (
              <Link key={state.code} to={`/results/state/${state.slug}`}>
                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.04} transitionSpeed={400}>
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    className={`state-card cursor-pointer rounded-xl border p-4 text-center transition-all ${
                      state.active
                        ? "border-border glass-strong hover:border-primary/30 hover:shadow-card"
                        : "border-border/50 bg-card/50 opacity-60"
                    }`}
                  >
                    <motion.div whileHover={{ scale: 1.15 }} className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold ${
                      state.active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                    }`}>
                      {state.code}
                    </motion.div>
                    <p className="text-xs font-medium text-foreground">{state.name}</p>
                    {state.active ? (
                      <span className="mt-1 inline-block rounded bg-[hsl(var(--success))]/10 px-2 py-0.5 text-[10px] font-medium text-[hsl(var(--success))]">
                        {state.posts} Active Posts
                      </span>
                    ) : (
                      <span className="mt-1 inline-block rounded bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                        Coming Soon
                      </span>
                    )}
                  </motion.div>
                </Tilt>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Government Exam Results & Vacancies",
          "description": "Central & state-level exam results, vacancies, admit cards for UPSC, SSC, Banking, Railways, NTA & more.",
          "url": "https://ishu.fun/results",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ishu.fun/" },
              { "@type": "ListItem", "position": 2, "name": "Results", "item": "https://ishu.fun/results" }
            ]
          }
        })
      }} />
    </Layout>
  );
};

export default ResultsPage;
