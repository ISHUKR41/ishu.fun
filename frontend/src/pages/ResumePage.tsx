/**
 * ResumePage.tsx - Professional Resume Builder (Ultra Modern 3D Edition)
 *
 * A form-based resume builder with 3D background, circular progress ring,
 * neon glassmorphism section cards, animated gradient borders, confetti
 * on download, template color themes, collapsible sections, and more.
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import ShimmerText from "@/components/animations/ShimmerText";
import HeroScene3D from "@/components/3d/HeroScene3D";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef, useCallback, Suspense, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Tilt from "react-parallax-tilt";
import {
  FileText, Plus, Trash2, Download, ArrowLeft,
  User, GraduationCap, Briefcase, Code, FolderOpen,
  CheckCircle, Sparkles, Palette, ChevronUp, Zap,
  Eye, EyeOff, X, MapPin, Mail, Phone, Globe, Linkedin, Award
} from "lucide-react";
import { Link } from "react-router-dom";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

// ─── Confetti Burst ────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ["#3b82f6","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899"];

const ConfettiBurst: React.FC<{ active: boolean; onComplete: () => void }> = ({ active, onComplete }) => {
  const pieces = useMemo(() =>
    Array.from({ length: 56 }, (_, i) => ({
      id: i,
      x: 40 + Math.random() * 20,
      dx: (Math.random() - 0.5) * 70,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      shape: (["circle","square","rect"] as const)[i % 3],
      w: Math.random() * 9 + 5,
      h: Math.random() * 9 + 5,
      delay: i * 0.018,
    }))
  , []);

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-[999] overflow-hidden">
          {pieces.map((p) => (
            <motion.div
              key={p.id}
              style={{
                position: "absolute",
                left: `${p.x}%`,
                bottom: "15%",
                width: p.shape === "rect" ? p.w * 2 : p.w,
                height: p.h,
                backgroundColor: p.color,
                borderRadius: p.shape === "circle" ? "50%" : "2px",
              }}
              initial={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 1, 0],
                y: [0, -(200 + Math.random() * 180)],
                x: [0, p.dx * 3.5],
                rotate: [0, (Math.random() - 0.5) * 720],
                scale: [0, 1, 1, 0.7, 0],
              }}
              transition={{ duration: 1.9 + Math.random() * 0.5, delay: p.delay, ease: [0.1, 0.8, 0.3, 1] }}
              onAnimationComplete={() => p.id === 55 && onComplete()}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── Circular Progress Ring ────────────────────────────────────────────────────
const CircularProgress: React.FC<{ value: number; accentColor: string }> = ({ value, accentColor }) => {
  const size = 88;
  const sw = 5;
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={sw} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="url(#pg)" strokeWidth={sw} fill="none"
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-black text-foreground leading-none">{value}%</span>
        <span className="text-[8px] text-muted-foreground mt-0.5 uppercase tracking-wide">done</span>
      </div>
    </div>
  );
};

// ─── Section Card ──────────────────────────────────────────────────────────────
interface SectionCardProps {
  id: string;
  icon: React.ElementType;
  title: string;
  gradient: string;
  glowColor: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
  collapsed: boolean;
  onToggle: () => void;
}
const SectionCard: React.FC<SectionCardProps> = ({
  id, icon: Icon, title, gradient, glowColor, children, extra, collapsed, onToggle
}) => (
  <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} glareEnable glareMaxOpacity={0.04} transitionSpeed={900}>
    <motion.div
      id={`section-${id}`}
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-border/40 bg-gradient-to-b from-card/90 to-card/50 backdrop-blur-xl shadow-2xl transition-all duration-300 relative overflow-hidden"
      style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.4)` }}
    >
      {/* Animated left glow border */}
      <motion.div
        className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${gradient} rounded-l-2xl`}
        animate={{ opacity: [0.4, 1, 0.4], scaleY: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ boxShadow: `0 0 16px ${glowColor}`, transformOrigin: "top" }}
      />
      {/* Gradient top border line */}
      <div className={`h-px w-full rounded-t-2xl bg-gradient-to-r ${gradient} opacity-60`} />
      <div className="p-4 sm:p-6">
        <button onClick={onToggle} className="mb-5 flex w-full items-center justify-between group">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
              style={{ boxShadow: `0 4px 16px ${glowColor}` }}
            >
              <Icon className="h-4.5 w-4.5 text-white h-[18px] w-[18px]" />
            </motion.div>
            <h2 className="text-base font-bold text-foreground group-hover:text-primary/90 transition-colors">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            {extra}
            <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}>
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </div>
        </button>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  </Tilt>
);

// ─── Types & Constants ─────────────────────────────────────────────────────────
interface Education { degree: string; institution: string; year: string; grade: string; }
interface Experience { title: string; company: string; duration: string; description: string; }
interface Project { name: string; description: string; tech: string; }

const emptyEdu: Education = { degree: "", institution: "", year: "", grade: "" };
const emptyExp: Experience = { title: "", company: "", duration: "", description: "" };
const emptyProj: Project = { name: "", description: "", tech: "" };

const inputCls = "w-full rounded-xl border border-border/50 bg-background/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/45 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_18px_rgba(59,130,246,0.12)] backdrop-blur-md transition-all duration-300 min-h-[44px] touch-manipulation";
const labelCls = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70";

const templateColors = [
  { name: "Blue",    primary: [30,64,175] as [number,number,number],   accent: "from-blue-500 to-cyan-500",     ring: "ring-blue-500",     hex: "#3b82f6" },
  { name: "Violet",  primary: [88,28,135] as [number,number,number],   accent: "from-violet-500 to-purple-500", ring: "ring-violet-500",   hex: "#8b5cf6" },
  { name: "Emerald", primary: [5,122,85]  as [number,number,number],   accent: "from-emerald-500 to-teal-500",  ring: "ring-emerald-500",  hex: "#10b981" },
  { name: "Rose",    primary: [190,18,60] as [number,number,number],   accent: "from-rose-500 to-pink-500",     ring: "ring-rose-500",     hex: "#ef4444" },
  { name: "Amber",   primary: [180,83,9]  as [number,number,number],   accent: "from-amber-500 to-orange-500",  ring: "ring-amber-500",    hex: "#f59e0b" },
];

const sectionMeta = [
  { id: "personal",    label: "Personal",    icon: User,          color: "text-blue-500"    },
  { id: "summary",     label: "Summary",     icon: FileText,      color: "text-indigo-500"  },
  { id: "education",   label: "Education",   icon: GraduationCap, color: "text-emerald-500" },
  { id: "experience",  label: "Experience",  icon: Briefcase,     color: "text-amber-500"   },
  { id: "skills",      label: "Skills",      icon: Code,          color: "text-cyan-500"    },
  { id: "projects",    label: "Projects",    icon: FolderOpen,    color: "text-violet-500"  },
];

// ─── Live Preview Component ────────────────────────────────────────────────────
interface ResumePreviewProps {
  fullName: string; email: string; phone: string; location: string;
  website: string; linkedin: string; summary: string; skills: string;
  education: Education[]; experience: Experience[]; projects: Project[];
  accentHex: string; accentGradient: string;
  onClose: () => void;
}
const ResumePreview: React.FC<ResumePreviewProps> = (props) => {
  const { fullName, email, phone, location, website, linkedin, summary, skills,
    education, experience, projects, accentHex, accentGradient, onClose } = props;

  const skillTags = skills.split(/[,،\n]/).map(s => s.trim()).filter(Boolean);
  const filledEdu = education.filter(e => e.degree || e.institution);
  const filledExp = experience.filter(e => e.title || e.company);
  const filledProj = projects.filter(p => p.name);
  const contactItems = [
    email && { icon: Mail, text: email },
    phone && { icon: Phone, text: phone },
    location && { icon: MapPin, text: location },
    website && { icon: Globe, text: website },
    linkedin && { icon: Linkedin, text: linkedin.replace("https://linkedin.com/in/", "@") },
  ].filter(Boolean) as { icon: React.ElementType; text: string }[];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/40 bg-white dark:bg-zinc-950 shadow-[0_0_80px_rgba(0,0,0,0.5)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close btn */}
        <button onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 text-foreground hover:bg-black/20 dark:hover:bg-white/20 transition-all">
          <X className="h-4 w-4" />
        </button>

        {/* Header bar */}
        <div className={`h-1.5 w-full rounded-t-3xl bg-gradient-to-r ${accentGradient}`} />

        <div className="p-8 md:p-10">
          {/* Resume Name */}
          <div className="text-center border-b pb-6 mb-6" style={{ borderColor: `${accentHex}30` }}>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: accentHex }}>
              {fullName || "Your Name"}
            </h1>
            {contactItems.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
                {contactItems.map((item, i) => (
                  <span key={i} className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <item.icon className="h-3 w-3" style={{ color: accentHex }} />
                    {item.text}
                  </span>
                ))}
              </div>
            )}
          </div>

          {summary && (
            <div className="mb-6">
              <h2 className="mb-2 text-[11px] font-black uppercase tracking-widest" style={{ color: accentHex }}>Professional Summary</h2>
              <div className="h-px mb-3" style={{ background: `linear-gradient(to right, ${accentHex}60, transparent)` }} />
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{summary}</p>
            </div>
          )}

          {filledEdu.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 text-[11px] font-black uppercase tracking-widest" style={{ color: accentHex }}>Education</h2>
              <div className="h-px mb-3" style={{ background: `linear-gradient(to right, ${accentHex}60, transparent)` }} />
              <div className="space-y-3">
                {filledEdu.map((edu, i) => (
                  <div key={i}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{edu.degree}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{edu.institution}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {edu.year && <p className="text-xs text-zinc-500 dark:text-zinc-400">{edu.year}</p>}
                        {edu.grade && <p className="text-xs font-semibold" style={{ color: accentHex }}>{edu.grade}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filledExp.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 text-[11px] font-black uppercase tracking-widest" style={{ color: accentHex }}>Experience</h2>
              <div className="h-px mb-3" style={{ background: `linear-gradient(to right, ${accentHex}60, transparent)` }} />
              <div className="space-y-4">
                {filledExp.map((exp, i) => (
                  <div key={i}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{exp.title}</p>
                        <p className="text-xs font-medium" style={{ color: accentHex }}>{exp.company}</p>
                      </div>
                      {exp.duration && <p className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">{exp.duration}</p>}
                    </div>
                    {exp.description && <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {skillTags.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-2 text-[11px] font-black uppercase tracking-widest" style={{ color: accentHex }}>Skills</h2>
              <div className="h-px mb-3" style={{ background: `linear-gradient(to right, ${accentHex}60, transparent)` }} />
              <div className="flex flex-wrap gap-2">
                {skillTags.map((skill, i) => (
                  <span key={i} className="rounded-md px-2.5 py-1 text-xs font-medium"
                    style={{ background: `${accentHex}15`, color: accentHex, border: `1px solid ${accentHex}30` }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {filledProj.length > 0 && (
            <div className="mb-2">
              <h2 className="mb-2 text-[11px] font-black uppercase tracking-widest" style={{ color: accentHex }}>Projects</h2>
              <div className="h-px mb-3" style={{ background: `linear-gradient(to right, ${accentHex}60, transparent)` }} />
              <div className="space-y-3">
                {filledProj.map((proj, i) => (
                  <div key={i}>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{proj.name}</p>
                    {proj.tech && <p className="text-xs" style={{ color: accentHex }}>Tech: {proj.tech}</p>}
                    {proj.description && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Skill Tag Display ─────────────────────────────────────────────────────────
const SkillTags: React.FC<{ skills: string; accentHex: string }> = ({ skills, accentHex }) => {
  const tags = skills.split(/[,،\n]/).map(s => s.trim()).filter(Boolean);
  if (!tags.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {tags.map((tag, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.03 }}
          className="rounded-lg px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: `${accentHex}15`, color: accentHex, border: `1px solid ${accentHex}25` }}
        >
          {tag}
        </motion.span>
      ))}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const ResumePage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite]   = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [summary, setSummary]   = useState("");
  const [skills, setSkills]     = useState("");
  const [education, setEducation]   = useState<Education[]>([{ ...emptyEdu }]);
  const [experience, setExperience] = useState<Experience[]>([{ ...emptyExp }]);
  const [projects, setProjects]     = useState<Project[]>([{ ...emptyProj }]);
  const [selectedColor, setSelectedColor] = useState(0);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [confetti, setConfetti]   = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const tc = templateColors[selectedColor];
  const formSectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formSectionsRef.current) {
      const sections = formSectionsRef.current.querySelectorAll(".form-section-gsap");
      sections.forEach((section) => {
        gsap.fromTo(section,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const toggle = (id: string) => setCollapsed(p => ({ ...p, [id]: !p[id] }));
  const addItem    = <T,>(set: React.Dispatch<React.SetStateAction<T[]>>, empty: T) => set(p => [...p, { ...empty }]);
  const removeItem = <T,>(set: React.Dispatch<React.SetStateAction<T[]>>, i: number) => set(p => p.filter((_, j) => j !== i));
  const updateItem = <T,>(set: React.Dispatch<React.SetStateAction<T[]>>, i: number, field: keyof T, val: string) =>
    set(p => p.map((item, j) => j === i ? { ...item, [field]: val } : item));

  const completion = useMemo(() => {
    let f = 0, t = 8;
    if (fullName.trim())  f++;
    if (email.trim())     f++;
    if (phone.trim())     f++;
    if (location.trim())  f++;
    if (summary.trim())   f++;
    if (skills.trim())    f++;
    if (education.some(e => e.degree || e.institution)) f++;
    if (experience.some(e => e.title || e.company))     f++;
    return Math.round((f / t) * 100);
  }, [fullName, email, phone, location, summary, skills, education, experience]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    const tc_color = tc.primary;
    let y = 20;

    const addText = (text: string, x: number, size: number, style = "normal", color: [number,number,number] = [33,33,33]) => {
      doc.setFontSize(size); doc.setFont("helvetica", style); doc.setTextColor(...color); doc.text(text, x, y);
    };
    const addLine = () => { doc.setDrawColor(200,200,200); doc.line(15, y, pw-15, y); y += 6; };
    const checkPage = (n: number) => { if (y + n > 280) { doc.addPage(); y = 20; } };

    addText(fullName || "Your Name", pw/2 - doc.getTextWidth(fullName||"Your Name")*0.5*(20/12), 20, "bold", tc_color);
    y += 8;
    const cp = [email, phone, location, website, linkedin].filter(Boolean);
    if (cp.length) {
      doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(100,100,100);
      doc.text(cp.join("  |  "), pw/2, y, { align: "center" }); y += 10;
    }
    if (summary.trim()) {
      addLine(); addText("PROFESSIONAL SUMMARY", 15, 11, "bold", tc_color); y += 6;
      doc.setFontSize(9.5); doc.setFont("helvetica","normal"); doc.setTextColor(60,60,60);
      const sl = doc.splitTextToSize(summary, pw-30); doc.text(sl, 15, y); y += sl.length*4.5+4;
    }
    const filledEdu = education.filter(e => e.degree || e.institution);
    if (filledEdu.length) {
      checkPage(30); addLine(); addText("EDUCATION", 15, 11, "bold", tc_color); y += 7;
      filledEdu.forEach(edu => {
        checkPage(18); addText(edu.degree, 15, 10, "bold"); y += 5;
        addText(`${edu.institution}${edu.year?` — ${edu.year}`:""}${edu.grade?` | ${edu.grade}`:""}`, 15, 9, "normal", [80,80,80]); y += 7;
      });
    }
    const filledExp = experience.filter(e => e.title || e.company);
    if (filledExp.length) {
      checkPage(30); addLine(); addText("EXPERIENCE", 15, 11, "bold", tc_color); y += 7;
      filledExp.forEach(exp => {
        checkPage(22); addText(exp.title, 15, 10, "bold");
        if (exp.company||exp.duration) { y += 5; addText(`${exp.company}${exp.duration?` — ${exp.duration}`:""}`, 15, 9, "italic", [80,80,80]); }
        if (exp.description) { y += 5; doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(60,60,60); const dl=doc.splitTextToSize(exp.description,pw-30); doc.text(dl,15,y); y+=dl.length*4+2; }
        y += 4;
      });
    }
    if (skills.trim()) {
      checkPage(20); addLine(); addText("SKILLS", 15, 11, "bold", tc_color); y += 6;
      doc.setFontSize(9.5); doc.setFont("helvetica","normal"); doc.setTextColor(60,60,60);
      const sl = doc.splitTextToSize(skills, pw-30); doc.text(sl,15,y); y+=sl.length*4.5+4;
    }
    const filledProj = projects.filter(p => p.name);
    if (filledProj.length) {
      checkPage(30); addLine(); addText("PROJECTS", 15, 11, "bold", tc_color); y += 7;
      filledProj.forEach(proj => {
        checkPage(18); addText(proj.name, 15, 10, "bold");
        if (proj.tech) { y+=5; addText(`Tech: ${proj.tech}`, 15, 8.5, "italic", [100,100,100]); }
        if (proj.description) { y+=5; doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(60,60,60); const pl=doc.splitTextToSize(proj.description,pw-30); doc.text(pl,15,y); y+=pl.length*4+2; }
        y+=4;
      });
    }
    doc.save(`${fullName||"Resume"}_Resume.pdf`);
    toast.success("✨ Resume downloaded successfully!", { duration: 3000 });
    setConfetti(true);
  };

  return (
    <Layout>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://ishu.dev/" },
        { name: "CV", url: "https://ishu.dev/cv" },
        { name: "Resume", url: "https://ishu.dev/cv/resume" },
      ]} />
      <ConfettiBurst active={confetti} onComplete={() => setConfetti(false)} />

      {/* Live Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <ResumePreview
            fullName={fullName} email={email} phone={phone} location={location}
            website={website} linkedin={linkedin} summary={summary} skills={skills}
            education={education} experience={experience} projects={projects}
            accentHex={tc.hex} accentGradient={tc.accent}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Action Buttons - Enhanced with labels */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[800] flex flex-col gap-2">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.08, boxShadow: `0 0 30px ${tc.hex}80` }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPreview(true)}
          className="group flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border/50 text-foreground shadow-2xl backdrop-blur-xl transition-all touch-manipulation"
          title="Preview Resume"
          style={{ willChange: "transform" }}
        >
          <Eye className="h-5 w-5" />
          <span className="absolute right-full mr-3 hidden group-hover:flex items-center whitespace-nowrap rounded-lg bg-card border border-border/50 px-3 py-1.5 text-xs font-medium text-foreground shadow-xl backdrop-blur-xl">
            Preview
          </span>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.08, boxShadow: `0 0 30px ${tc.hex}80` }}
          whileTap={{ scale: 0.95 }}
          onClick={generatePDF}
          className={`group flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${tc.accent} text-white shadow-2xl transition-all touch-manipulation`}
          style={{ boxShadow: `0 4px 24px ${tc.hex}50`, willChange: "transform" }}
          title="Download PDF"
        >
          <Download className="h-6 w-6" />
          <span className="absolute right-full mr-3 hidden group-hover:flex items-center whitespace-nowrap rounded-lg bg-card border border-border/50 px-3 py-1.5 text-xs font-medium text-foreground shadow-xl backdrop-blur-xl">
            Download PDF
          </span>
        </motion.button>
      </div>

      <section className="relative overflow-hidden min-h-screen py-12 sm:py-16 md:py-20 pb-24 sm:pb-16">
        {/* 3D Background */}
        <div className="opacity-20"><Suspense fallback={null}><HeroScene3D /></Suspense></div>
        <GradientMesh className="opacity-15" />
        <MorphingBlob className="absolute -top-40 -right-40 h-[500px] w-[500px] opacity-10" color="blue" />
        <MorphingBlob className="absolute -bottom-40 -left-40 h-[400px] w-[400px] opacity-8" color="violet" />
        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,1) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />

        <div className="container relative z-10">
          {/* ── Header ── */}
          <FadeInView>
            <div className="mb-10">
              <Link to="/cv" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group">
                <motion.span whileHover={{ x: -3 }} className="inline-flex"><ArrowLeft className="h-4 w-4" /></motion.span>
                Back to CV Hub
              </Link>
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${tc.accent} shadow-2xl`}
                  style={{ boxShadow: `0 8px 32px ${tc.hex}50` }}
                >
                  <FileText className="h-8 w-8 text-white drop-shadow" />
                </motion.div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                    <ShimmerText>Resume</ShimmerText>{" "}
                    <span className="text-foreground">Builder</span>
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Fill in your details and download a professional PDF resume</p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* ── Progress + Controls ── */}
          <FadeInView delay={0.05}>
            <div className="mx-auto max-w-4xl mb-6 sm:mb-8">
              <div className="rounded-2xl border border-border/40 bg-gradient-to-b from-card/90 to-card/50 backdrop-blur-xl p-4 sm:p-5 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                  {/* Circular ring */}
                  <CircularProgress value={completion} accentColor={tc.hex} />
                  <div className="flex-1 space-y-4 min-w-0">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-foreground">Profile Completion</span>
                        <span className={`text-xs font-bold ${completion === 100 ? "text-emerald-400" : "text-primary"}`}>
                          {completion === 100 ? "✅ Complete!" : `${completion}% filled`}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${tc.accent}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${completion}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                    {/* Quick Nav */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {sectionMeta.map(s => (
                        <button key={s.id} onClick={() => document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                          className="inline-flex items-center gap-1 rounded-lg border border-border/40 bg-background/30 px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-[10px] sm:text-[11px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all touch-manipulation active:scale-95">
                          <s.icon className={`h-3 w-3 ${s.color}`} />{s.label}
                        </button>
                      ))}
                    </div>
                    {/* Color Picker with Visual Swatches */}
                    <div className="flex items-start gap-3">
                      <Palette className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-1.5" />
                      <span className="text-[11px] text-muted-foreground mt-1.5 shrink-0">Theme:</span>
                      <div className="flex gap-3 flex-wrap">
                        {templateColors.map((color, i) => (
                          <motion.button key={color.name} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedColor(i)}
                            className="flex flex-col items-center gap-1 touch-manipulation"
                          >
                            <div
                              className={`relative h-8 w-8 rounded-full bg-gradient-to-br ${color.accent} shadow-md transition-all ${selectedColor===i ? `ring-2 ring-offset-2 ring-offset-background ${color.ring} scale-110` : "opacity-60 hover:opacity-100"}`}
                              style={{ boxShadow: selectedColor===i ? `0 0 16px ${color.hex}80` : undefined }}
                            >
                              {selectedColor===i && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 flex items-center justify-center">
                                  <CheckCircle className="h-4 w-4 text-white drop-shadow" />
                                </motion.div>
                              )}
                            </div>
                            <span className={`text-[9px] font-medium transition-colors ${selectedColor===i ? "text-foreground" : "text-muted-foreground/60"}`}>{color.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* ── Form Sections ── */}
          <div ref={formSectionsRef} className="mx-auto max-w-4xl space-y-5">

            {/* Personal Info */}
            <div className="form-section-gsap" style={{ willChange: "transform" }}>
            <FadeInView delay={0.1}>
              <SectionCard id="personal" icon={User} title="Personal Information"
                gradient="from-blue-500 to-cyan-500" glowColor="#3b82f640"
                collapsed={!!collapsed.personal} onToggle={() => toggle("personal")}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Full Name</label>
                    <input className={inputCls} placeholder="e.g. Rahul Sharma" value={fullName} onChange={e => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input className={inputCls} type="email" placeholder="rahul@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input className={inputCls} placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Location</label>
                    <input className={inputCls} placeholder="New Delhi, India" value={location} onChange={e => setLocation(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Website</label>
                    <input className={inputCls} placeholder="https://yoursite.com" value={website} onChange={e => setWebsite(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>LinkedIn</label>
                    <input className={inputCls} placeholder="https://linkedin.com/in/yourprofile" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
                  </div>
                </div>
              </SectionCard>
            </FadeInView>
            </div>

            {/* Summary */}
            <div className="form-section-gsap" style={{ willChange: "transform" }}>
            <FadeInView delay={0.12}>
              <SectionCard id="summary" icon={FileText} title="Professional Summary"
                gradient="from-indigo-500 to-blue-500" glowColor="#6366f140"
                collapsed={!!collapsed.summary} onToggle={() => toggle("summary")}>
                <textarea className={`${inputCls} min-h-[100px] resize-y`}
                  placeholder="A brief summary about your professional background, key skills, and career goals..."
                  value={summary} onChange={e => setSummary(e.target.value)} />
              </SectionCard>
            </FadeInView>
            </div>

            {/* Education */}
            <div className="form-section-gsap" style={{ willChange: "transform" }}>
            <FadeInView delay={0.14}>
              <SectionCard id="education" icon={GraduationCap} title="Education"
                gradient="from-emerald-500 to-teal-500" glowColor="#10b98140"
                collapsed={!!collapsed.education} onToggle={() => toggle("education")}
                extra={
                  <button onClick={e => { e.stopPropagation(); addItem(setEducation, emptyEdu); }}
                    className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border/60 px-3 py-1 text-[11px] text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-400 transition-all">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                }>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="relative grid gap-3 rounded-xl border border-border/40 bg-background/20 p-4 sm:grid-cols-2 hover:border-emerald-500/20 transition-all">
                      {education.length > 1 && (
                        <button onClick={() => removeItem(setEducation, i)} className="absolute right-3 top-3 text-muted-foreground/50 hover:text-red-400 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <div><label className={labelCls}>Degree</label><input className={inputCls} placeholder="B.Tech Computer Science" value={edu.degree} onChange={e => updateItem(setEducation,i,"degree",e.target.value)} /></div>
                      <div><label className={labelCls}>Institution</label><input className={inputCls} placeholder="IIT Delhi" value={edu.institution} onChange={e => updateItem(setEducation,i,"institution",e.target.value)} /></div>
                      <div><label className={labelCls}>Year</label><input className={inputCls} placeholder="2020 – 2024" value={edu.year} onChange={e => updateItem(setEducation,i,"year",e.target.value)} /></div>
                      <div><label className={labelCls}>Grade / CGPA</label><input className={inputCls} placeholder="8.5 CGPA" value={edu.grade} onChange={e => updateItem(setEducation,i,"grade",e.target.value)} /></div>
                    </motion.div>
                  ))}
                </div>
              </SectionCard>
            </FadeInView>
            </div>

            {/* Experience */}
            <div className="form-section-gsap" style={{ willChange: "transform" }}>
            <FadeInView delay={0.16}>
              <SectionCard id="experience" icon={Briefcase} title="Work Experience"
                gradient="from-amber-500 to-orange-500" glowColor="#f59e0b40"
                collapsed={!!collapsed.experience} onToggle={() => toggle("experience")}
                extra={
                  <button onClick={e => { e.stopPropagation(); addItem(setExperience, emptyExp); }}
                    className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border/60 px-3 py-1 text-[11px] text-muted-foreground hover:border-amber-500/40 hover:text-amber-400 transition-all">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                }>
                <div className="space-y-4">
                  {experience.map((exp, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="relative grid gap-3 rounded-xl border border-border/40 bg-background/20 p-4 sm:grid-cols-2 hover:border-amber-500/20 transition-all">
                      {experience.length > 1 && (
                        <button onClick={() => removeItem(setExperience, i)} className="absolute right-3 top-3 text-muted-foreground/50 hover:text-red-400 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <div><label className={labelCls}>Job Title</label><input className={inputCls} placeholder="Software Engineer" value={exp.title} onChange={e => updateItem(setExperience,i,"title",e.target.value)} /></div>
                      <div><label className={labelCls}>Company</label><input className={inputCls} placeholder="Google India" value={exp.company} onChange={e => updateItem(setExperience,i,"company",e.target.value)} /></div>
                      <div><label className={labelCls}>Duration</label><input className={inputCls} placeholder="Jan 2023 – Present" value={exp.duration} onChange={e => updateItem(setExperience,i,"duration",e.target.value)} /></div>
                      <div className="sm:col-span-2"><label className={labelCls}>Description</label>
                        <textarea className={`${inputCls} min-h-[70px] resize-y`} placeholder="What did you achieve in this role..."
                          value={exp.description} onChange={e => updateItem(setExperience,i,"description",e.target.value)} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </SectionCard>
            </FadeInView>
            </div>

            {/* Skills */}
            <div className="form-section-gsap" style={{ willChange: "transform" }}>
            <FadeInView delay={0.18}>
              <SectionCard id="skills" icon={Code} title="Skills & Technologies"
                gradient="from-cyan-500 to-blue-500" glowColor="#06b6d440"
                collapsed={!!collapsed.skills} onToggle={() => toggle("skills")}>
                <textarea className={`${inputCls} min-h-[80px] resize-y`}
                  placeholder="e.g. JavaScript, React, Node.js, Python, SQL, Git, AWS, Docker..."
                  value={skills} onChange={e => setSkills(e.target.value)} />
                <SkillTags skills={skills} accentHex={tc.hex} />
              </SectionCard>
            </FadeInView>
            </div>

            {/* Projects */}
            <div className="form-section-gsap" style={{ willChange: "transform" }}>
            <FadeInView delay={0.20}>
              <SectionCard id="projects" icon={FolderOpen} title="Projects"
                gradient="from-violet-500 to-purple-500" glowColor="#8b5cf640"
                collapsed={!!collapsed.projects} onToggle={() => toggle("projects")}
                extra={
                  <button onClick={e => { e.stopPropagation(); addItem(setProjects, emptyProj); }}
                    className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border/60 px-3 py-1 text-[11px] text-muted-foreground hover:border-violet-500/40 hover:text-violet-400 transition-all">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                }>
                <div className="space-y-4">
                  {projects.map((proj, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="relative grid gap-3 rounded-xl border border-border/40 bg-background/20 p-4 sm:grid-cols-2 hover:border-violet-500/20 transition-all">
                      {projects.length > 1 && (
                        <button onClick={() => removeItem(setProjects, i)} className="absolute right-3 top-3 text-muted-foreground/50 hover:text-red-400 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <div><label className={labelCls}>Project Name</label><input className={inputCls} placeholder="E-Commerce Platform" value={proj.name} onChange={e => updateItem(setProjects,i,"name",e.target.value)} /></div>
                      <div><label className={labelCls}>Technologies</label><input className={inputCls} placeholder="React, Node.js, MongoDB" value={proj.tech} onChange={e => updateItem(setProjects,i,"tech",e.target.value)} /></div>
                      <div className="sm:col-span-2"><label className={labelCls}>Description</label>
                        <textarea className={`${inputCls} min-h-[70px] resize-y`} placeholder="Brief description of the project..."
                          value={proj.description} onChange={e => updateItem(setProjects,i,"description",e.target.value)} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </SectionCard>
            </FadeInView>
            </div>

            {/* Download CTA */}
            <div className="form-section-gsap" style={{ willChange: "transform" }}>
            <FadeInView delay={0.22}>
              <motion.div
                className="rounded-2xl border border-border/40 bg-gradient-to-br from-blue-500/10 via-violet-500/8 to-purple-500/10 p-6 sm:p-8 text-center backdrop-blur-xl shadow-2xl"
                style={{ boxShadow: "0 0 60px rgba(59,130,246,0.08), 0 20px 60px rgba(0,0,0,0.3)" }}
              >
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="mb-4 inline-block">
                  <div className={`flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br ${tc.accent} shadow-2xl`}
                    style={{ boxShadow: `0 8px 32px ${tc.hex}50` }}>
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </motion.div>
                <h3 className="text-xl font-black text-foreground mb-2">Ready to Download?</h3>
                <p className="text-sm text-muted-foreground mb-6">Your resume will be exported as a beautifully formatted PDF</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowPreview(true)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-card/60 px-5 sm:px-6 py-3 sm:py-3.5 text-sm font-bold text-foreground backdrop-blur-sm transition-all hover:border-primary/40 touch-manipulation"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Resume
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: `0 0 40px ${tc.hex}60, 0 8px 32px rgba(0,0,0,0.3)` }}
                    whileTap={{ scale: 0.97 }}
                    onClick={generatePDF}
                    className={`relative overflow-hidden inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r ${tc.accent} px-7 sm:px-10 py-3.5 sm:py-4 text-sm font-bold text-white shadow-2xl transition-all touch-manipulation`}
                    style={{ boxShadow: `0 4px 24px ${tc.hex}40` }}
                  >
                    {/* Shimmer overlay */}
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                      className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                    <Download className="h-5 w-5 relative z-10" />
                    <span className="relative z-10">Download Resume PDF</span>
                    <Zap className="h-4 w-4 relative z-10 opacity-80" />
                  </motion.button>
                </div>
              </motion.div>
            </FadeInView>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResumePage;
