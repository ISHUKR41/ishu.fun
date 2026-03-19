import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import ShimmerText from "@/components/animations/ShimmerText";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  FileText, Plus, Trash2, Download, ArrowLeft,
  User, GraduationCap, Briefcase, Code, FolderOpen,
  CheckCircle, Palette, ChevronUp, Zap,
  Eye, X, MapPin, Mail, Phone, Globe, Linkedin, Award,
  Shield, Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

// Section Card
interface SectionCardProps {
  id: string;
  icon: React.ElementType;
  title: string;
  accentColor: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
  collapsed: boolean;
  onToggle: () => void;
}
const SectionCard: React.FC<SectionCardProps> = ({
  id, icon: Icon, title, accentColor, children, extra, collapsed, onToggle
}) => (
  <div
    id={`section-${id}`}
    className="rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
  >
    <div
      role="button" tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onToggle()}
      className="flex w-full cursor-pointer items-center justify-between p-4 sm:p-5 group"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
          <Icon className="h-4 w-4" style={{ color: accentColor }} />
        </div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        {extra}
        <motion.div animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.2 }}>
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </div>
    </div>
    <AnimatePresence initial={false}>
      {!collapsed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-5 sm:px-5 pt-0">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Types
interface Education { degree: string; institution: string; year: string; grade: string; }
interface Experience { title: string; company: string; duration: string; description: string; }
interface Project { name: string; description: string; tech: string; }

const emptyEdu: Education = { degree: "", institution: "", year: "", grade: "" };
const emptyExp: Experience = { title: "", company: "", duration: "", description: "" };
const emptyProj: Project = { name: "", description: "", tech: "" };

const inputCls = "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 hover:border-primary/30 hover:bg-accent/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.06)] transition-all duration-300 min-h-[42px]";
const labelCls = "mb-1.5 block text-xs font-medium text-muted-foreground";

const templateColors = [
  { name: "Blue",     primary: [30,64,175]  as [number,number,number], hex: "#3b82f6" },
  { name: "Violet",   primary: [88,28,135]  as [number,number,number], hex: "#8b5cf6" },
  { name: "Emerald",  primary: [5,122,85]   as [number,number,number], hex: "#10b981" },
  { name: "Rose",     primary: [190,18,60]  as [number,number,number], hex: "#ef4444" },
  { name: "Amber",    primary: [180,83,9]   as [number,number,number], hex: "#f59e0b" },
  { name: "Ocean",    primary: [2,132,199]  as [number,number,number], hex: "#0ea5e9" },
  { name: "Sunset",   primary: [234,88,12]  as [number,number,number], hex: "#f97316" },
  { name: "Forest",   primary: [22,101,52]  as [number,number,number], hex: "#16a34a" },
  { name: "Royal",    primary: [67,56,202]  as [number,number,number], hex: "#4f46e5" },
  { name: "Midnight", primary: [51,65,85]   as [number,number,number], hex: "#475569" },
];

const sectionMeta = [
  { id: "personal",    label: "Personal",    icon: User,          color: "#3b82f6" },
  { id: "summary",     label: "Summary",     icon: FileText,      color: "#6366f1" },
  { id: "education",   label: "Education",   icon: GraduationCap, color: "#10b981" },
  { id: "experience",  label: "Experience",  icon: Briefcase,     color: "#f59e0b" },
  { id: "skills",      label: "Skills",      icon: Code,          color: "#06b6d4" },
  { id: "projects",    label: "Projects",    icon: FolderOpen,    color: "#8b5cf6" },
];

// Live Preview
interface ResumePreviewProps {
  fullName: string; email: string; phone: string; location: string;
  website: string; linkedin: string; summary: string; skills: string;
  education: Education[]; experience: Experience[]; projects: Project[];
  accentHex: string; onClose: () => void;
}
const ResumePreview: React.FC<ResumePreviewProps> = (props) => {
  const { fullName, email, phone, location, website, linkedin, summary, skills,
    education, experience, projects, accentHex, onClose } = props;

  const skillTags = skills.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
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
  const [tplStyle, setTplStyle] = useState<"classic"|"modern"|"minimal">("classic");

  const SectionHeading = ({ text }: { text: string }) => (
    <div className="mb-3">
      <h2 className="text-[11px] font-bold uppercase tracking-widest" style={{ color: accentHex }}>{text}</h2>
      <div className="mt-1 h-px" style={{ background: `linear-gradient(to right, ${accentHex}50, transparent)` }} />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-white dark:bg-zinc-950 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-md bg-muted hover:bg-muted/80 transition-colors">
          <X className="h-3.5 w-3.5 text-foreground" />
        </button>

        <div className="h-1 w-full rounded-t-xl" style={{ backgroundColor: accentHex }} />

        {/* Template Style Tabs */}
        <div className="flex items-center gap-1 px-4 pt-3 pb-0">
          {(["classic","modern","minimal"] as const).map(s => (
            <button key={s} onClick={() => setTplStyle(s)}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all ${tplStyle===s ? "text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
              style={tplStyle===s ? { backgroundColor: accentHex } : {}}>
              {s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>

        {tplStyle === "classic" ? (
        <div className="p-8 md:p-10">
          <div className="text-center border-b pb-5 mb-6" style={{ borderColor: `${accentHex}25` }}>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: accentHex }}>
              {fullName || "Your Name"}
            </h1>
            {contactItems.length > 0 && (
              <div className="mt-2.5 flex flex-wrap justify-center gap-x-4 gap-y-1">
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
            <div className="mb-5">
              <SectionHeading text="Professional Summary" />
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{summary}</p>
            </div>
          )}

          {filledEdu.length > 0 && (
            <div className="mb-5">
              <SectionHeading text="Education" />
              <div className="space-y-2.5">
                {filledEdu.map((edu, i) => (
                  <div key={i} className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{edu.degree}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{edu.institution}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {edu.year && <p className="text-xs text-zinc-500 dark:text-zinc-400">{edu.year}</p>}
                      {edu.grade && <p className="text-xs font-medium" style={{ color: accentHex }}>{edu.grade}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filledExp.length > 0 && (
            <div className="mb-5">
              <SectionHeading text="Experience" />
              <div className="space-y-3">
                {filledExp.map((exp, i) => (
                  <div key={i}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{exp.title}</p>
                        <p className="text-xs font-medium" style={{ color: accentHex }}>{exp.company}</p>
                      </div>
                      {exp.duration && <p className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">{exp.duration}</p>}
                    </div>
                    {exp.description && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {skillTags.length > 0 && (
            <div className="mb-5">
              <SectionHeading text="Skills" />
              <div className="flex flex-wrap gap-1.5">
                {skillTags.map((skill, i) => (
                  <span key={i} className="rounded-md px-2 py-0.5 text-xs font-medium"
                    style={{ background: `${accentHex}12`, color: accentHex, border: `1px solid ${accentHex}25` }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {filledProj.length > 0 && (
            <div>
              <SectionHeading text="Projects" />
              <div className="space-y-2.5">
                {filledProj.map((proj, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{proj.name}</p>
                    {proj.tech && <p className="text-xs" style={{ color: accentHex }}>Tech: {proj.tech}</p>}
                    {proj.description && <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        ) : tplStyle === "modern" ? (
        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-[35%] shrink-0 md:pr-6 md:border-r-2" style={{ borderColor: `${accentHex}15` }}>
              <div className="rounded-lg p-4 mb-4" style={{ background: `${accentHex}08` }}>
                <h1 className="text-xl font-bold tracking-tight" style={{ color: accentHex }}>{fullName || "Your Name"}</h1>
              </div>
              {contactItems.length > 0 && (
                <div className="space-y-1.5 mb-5">
                  {contactItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <item.icon className="h-3 w-3" style={{ color: accentHex }} />
                      {item.text}
                    </div>
                  ))}
                </div>
              )}
              {skillTags.length > 0 && (
                <div>
                  <SectionHeading text="Skills" />
                  <div className="flex flex-wrap gap-1.5">
                    {skillTags.map((skill, i) => (
                      <span key={i} className="rounded-md px-2 py-0.5 text-xs font-medium"
                        style={{ background: `${accentHex}12`, color: accentHex, border: `1px solid ${accentHex}25` }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-5">
              {summary && (
                <div>
                  <SectionHeading text="Professional Summary" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{summary}</p>
                </div>
              )}
              {filledExp.length > 0 && (
                <div>
                  <SectionHeading text="Experience" />
                  <div className="space-y-3">
                    {filledExp.map((exp, i) => (
                      <div key={i}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{exp.title}</p>
                            <p className="text-xs font-medium" style={{ color: accentHex }}>{exp.company}</p>
                          </div>
                          {exp.duration && <p className="text-xs text-zinc-500 dark:text-zinc-400 shrink-0">{exp.duration}</p>}
                        </div>
                        {exp.description && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {filledEdu.length > 0 && (
                <div>
                  <SectionHeading text="Education" />
                  <div className="space-y-2.5">
                    {filledEdu.map((edu, i) => (
                      <div key={i} className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{edu.degree}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">{edu.institution}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {edu.year && <p className="text-xs text-zinc-500 dark:text-zinc-400">{edu.year}</p>}
                          {edu.grade && <p className="text-xs font-medium" style={{ color: accentHex }}>{edu.grade}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {filledProj.length > 0 && (
                <div>
                  <SectionHeading text="Projects" />
                  <div className="space-y-2.5">
                    {filledProj.map((proj, i) => (
                      <div key={i}>
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{proj.name}</p>
                        {proj.tech && <p className="text-xs" style={{ color: accentHex }}>Tech: {proj.tech}</p>}
                        {proj.description && <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{proj.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        ) : (
        <div className="p-8 md:p-10">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-light tracking-widest text-zinc-800 dark:text-zinc-100 uppercase">{fullName || "Your Name"}</h1>
            {contactItems.length > 0 && (
              <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
                {contactItems.map((item, i) => (
                  <span key={i} className="text-[11px] text-zinc-500 dark:text-zinc-400">{item.text}</span>
                ))}
              </div>
            )}
            <div className="mt-3 h-px bg-zinc-200 dark:bg-zinc-700" />
          </div>
          {summary && (
            <div className="mb-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">Summary</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{summary}</p>
            </div>
          )}
          {filledEdu.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">Education</h2>
              <div className="space-y-2">
                {filledEdu.map((edu, i) => (
                  <div key={i}>
                    <p className="text-sm text-zinc-800 dark:text-zinc-100">{edu.degree}{edu.institution ? ` — ${edu.institution}` : ""}</p>
                    <p className="text-xs text-zinc-400">{[edu.year, edu.grade].filter(Boolean).join(" | ")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {filledExp.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">Experience</h2>
              <div className="space-y-3">
                {filledExp.map((exp, i) => (
                  <div key={i}>
                    <p className="text-sm text-zinc-800 dark:text-zinc-100">{exp.title}{exp.company ? ` — ${exp.company}` : ""}</p>
                    {exp.duration && <p className="text-xs text-zinc-400">{exp.duration}</p>}
                    {exp.description && <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {skillTags.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">Skills</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{skillTags.join("  ·  ")}</p>
            </div>
          )}
          {filledProj.length > 0 && (
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">Projects</h2>
              <div className="space-y-2">
                {filledProj.map((proj, i) => (
                  <div key={i}>
                    <p className="text-sm text-zinc-800 dark:text-zinc-100">{proj.name}</p>
                    {proj.tech && <p className="text-xs text-zinc-400">Tech: {proj.tech}</p>}
                    {proj.description && <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Skill Tags Display
const SkillTags: React.FC<{ skills: string; accentHex: string }> = ({ skills, accentHex }) => {
  const tags = skills.split(/[,\n]/).map(s => s.trim()).filter(Boolean);
  if (!tags.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="rounded-md px-2 py-0.5 text-[11px] font-medium"
          style={{ background: `${accentHex}12`, color: accentHex, border: `1px solid ${accentHex}20` }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

// Main Component
const ResumePage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);
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
  const [showPreview, setShowPreview] = useState(false);
  const tc = templateColors[selectedColor];

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

  const sectionFilled = useMemo(() => ({
    personal: !!(fullName.trim() || email.trim() || phone.trim() || location.trim()),
    summary: !!summary.trim(),
    education: education.some(e => e.degree || e.institution),
    experience: experience.some(e => e.title || e.company),
    skills: !!skills.trim(),
    projects: projects.some(p => p.name),
  }), [fullName, email, phone, location, summary, education, experience, skills, projects]);

  const atsScore = useMemo(() => {
    let score = 0;
    if (fullName.trim()) score += 12;
    if (email.trim()) score += 10;
    if (phone.trim()) score += 8;
    if (location.trim()) score += 5;
    if (summary.trim()) { score += 10; if (summary.trim().length > 100) score += 5; }
    if (education.some(e => e.degree || e.institution)) score += 12;
    if (experience.some(e => e.title || e.company)) score += 15;
    const skillCount = skills.split(/[,\n]/).map(s => s.trim()).filter(Boolean).length;
    if (skillCount > 0) { score += 10; if (skillCount >= 5) score += 5; }
    if (projects.some(p => p.name)) score += 8;
    return Math.min(score, 100);
  }, [fullName, email, phone, location, summary, education, experience, skills, projects]);

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
        addText(`${edu.institution}${edu.year?` \u2014 ${edu.year}`:""}${edu.grade?` | ${edu.grade}`:""}`, 15, 9, "normal", [80,80,80]); y += 7;
      });
    }
    const filledExp = experience.filter(e => e.title || e.company);
    if (filledExp.length) {
      checkPage(30); addLine(); addText("EXPERIENCE", 15, 11, "bold", tc_color); y += 7;
      filledExp.forEach(exp => {
        checkPage(22); addText(exp.title, 15, 10, "bold");
        if (exp.company||exp.duration) { y += 5; addText(`${exp.company}${exp.duration?` \u2014 ${exp.duration}`:""}`, 15, 9, "italic", [80,80,80]); }
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
    toast.success("Resume downloaded successfully!", { duration: 3000 });
  };

  return (
    <Layout>
      <SEOHead {...SEO_DATA.resume} />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://ishu.fun/" },
        { name: "CV", url: "https://ishu.fun/cv" },
        { name: "Resume", url: "https://ishu.fun/cv/resume" },
      ]} />

      {/* Dynamic Background Image */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 -z-[9] pointer-events-none">
        <GradientMesh variant="aurora" />
      </div>

      {/* Live Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <ResumePreview
            fullName={fullName} email={email} phone={phone} location={location}
            website={website} linkedin={linkedin} summary={summary} skills={skills}
            education={education} experience={experience} projects={projects}
            accentHex={tc.hex}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating Actions */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[800] flex flex-col gap-2">
        <button
          onClick={() => setShowPreview(true)}
          className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg hover:shadow-xl transition-all"
          title="Preview Resume"
        >
          <Eye className="h-4.5 w-4.5 h-[18px] w-[18px]" />
          <span className="absolute right-full mr-2 hidden group-hover:flex items-center whitespace-nowrap rounded-md bg-card border border-border px-2.5 py-1 text-xs text-foreground shadow-lg">
            Preview
          </span>
        </button>
        <button
          onClick={generatePDF}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: tc.hex }}
          title="Download PDF"
        >
          <Download className="h-5 w-5" />
          <span className="absolute right-full mr-2 hidden group-hover:flex items-center whitespace-nowrap rounded-md bg-card border border-border px-2.5 py-1 text-xs text-foreground shadow-lg">
            Download PDF
          </span>
        </button>
      </div>

      <section className="py-8 sm:py-12 md:py-16 pb-24">
        <div className="container">
          {/* Header */}
          <FadeInView>
            <div className="mb-8">
              <Link to="/cv" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to CV
              </Link>
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${tc.hex}15` }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Sparkles className="h-5 w-5" style={{ color: tc.hex }} />
                </motion.div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">
                    <ShimmerText>Resume Builder</ShimmerText>
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">Build your professional resume with AI-powered ATS optimization</p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* Progress + Controls */}
          <FadeInView delay={0.05}>
            <div className="mx-auto max-w-4xl mb-6">
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Progress & ATS indicators */}
                  <div className="flex items-center gap-4 min-w-0 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-12 w-12 shrink-0">
                        <svg width="48" height="48" style={{ transform: "rotate(-90deg)" }}>
                          <circle cx="24" cy="24" r="20" stroke="currentColor" className="text-border" strokeWidth="3" fill="none" />
                          <circle cx="24" cy="24" r="20" stroke={tc.hex} strokeWidth="3" fill="none"
                            strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 20}`}
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - completion / 100)}`}
                            className="transition-all duration-500" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-foreground">{completion}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-foreground">Complete</span>
                        <p className="text-[10px] text-muted-foreground">
                          {completion === 100 ? "All filled" : `${completion}%`}
                        </p>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-border hidden sm:block" />
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-12 w-12 shrink-0">
                        <svg width="48" height="48" style={{ transform: "rotate(-90deg)" }}>
                          <circle cx="24" cy="24" r="20" stroke="currentColor" className="text-border" strokeWidth="3" fill="none" />
                          <motion.circle cx="24" cy="24" r="20"
                            stroke={atsScore >= 70 ? "#10b981" : atsScore >= 40 ? "#f59e0b" : "#ef4444"}
                            strokeWidth="3" fill="none" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 20}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 20 * (1 - atsScore / 100) }}
                            transition={{ duration: 0.8, ease: "easeOut" }} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-foreground">{atsScore}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-foreground flex items-center gap-1">
                          <Shield className="h-3 w-3" style={{ color: atsScore >= 70 ? "#10b981" : atsScore >= 40 ? "#f59e0b" : "#ef4444" }} />
                          ATS Score
                        </span>
                        <p className="text-[10px] text-muted-foreground">
                          {atsScore >= 80 ? "Excellent" : atsScore >= 60 ? "Good" : atsScore >= 40 ? "Fair" : "Needs work"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    {/* Section nav */}
                    <div className="flex flex-wrap gap-1.5">
                      {sectionMeta.map(s => {
                        const isFilled = sectionFilled[s.id as keyof typeof sectionFilled];
                        return (
                          <button key={s.id}
                            onClick={() => document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                              isFilled
                                ? 'border-primary/20 bg-primary/5 text-foreground'
                                : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/20'
                            }`}
                          >
                            <s.icon className="h-3 w-3" style={{ color: s.color }} />
                            {s.label}
                            {isFilled && <CheckCircle className="h-2.5 w-2.5 text-emerald-500" />}
                          </button>
                        );
                      })}
                    </div>
                    {/* Color picker */}
                    <div className="flex items-center gap-2">
                      <Palette className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-[11px] text-muted-foreground shrink-0">Theme:</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {templateColors.map((color, i) => (
                          <button key={color.name}
                            onClick={() => setSelectedColor(i)}
                            className="flex flex-col items-center gap-0.5"
                          >
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              className={`h-5 w-5 rounded-full transition-all ${selectedColor===i ? "ring-2 ring-offset-2 ring-offset-background scale-110" : "opacity-50 hover:opacity-80"}`}
                              style={{ backgroundColor: color.hex, ...(selectedColor===i ? { boxShadow: `0 0 0 2px ${color.hex}` } : {}) }}
                            >
                              {selectedColor===i && (
                                <div className="flex items-center justify-center h-full">
                                  <CheckCircle className="h-2.5 w-2.5 text-white" />
                                </div>
                              )}
                            </motion.div>
                            <span className={`text-[8px] ${selectedColor===i ? "text-foreground font-medium" : "text-muted-foreground/50"}`}>{color.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* Form Sections */}
          <div className="mx-auto max-w-4xl space-y-4">

            {/* Personal Info */}
            <FadeInView delay={0.08}>
              <SectionCard id="personal" icon={User} title="Personal Information"
                accentColor="#3b82f6"
                collapsed={!!collapsed.personal} onToggle={() => toggle("personal")}>
                <div className="grid gap-3 sm:grid-cols-2">
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

            {/* Summary */}
            <FadeInView delay={0.1}>
              <SectionCard id="summary" icon={FileText} title="Professional Summary"
                accentColor="#6366f1"
                collapsed={!!collapsed.summary} onToggle={() => toggle("summary")}>
                <textarea className={`${inputCls} min-h-[100px] resize-y`}
                  placeholder="A brief summary about your professional background, key skills, and career goals..."
                  value={summary} onChange={e => setSummary(e.target.value)} />
              </SectionCard>
            </FadeInView>

            {/* Education */}
            <FadeInView delay={0.12}>
              <SectionCard id="education" icon={GraduationCap} title="Education"
                accentColor="#10b981"
                collapsed={!!collapsed.education} onToggle={() => toggle("education")}
                extra={
                  <button onClick={e => { e.stopPropagation(); addItem(setEducation, emptyEdu); }}
                    className="inline-flex items-center gap-1 rounded-md border border-dashed border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-500 transition-colors">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                }>
                <div className="space-y-3">
                  {education.map((edu, i) => (
                    <div key={i} className="relative grid gap-3 rounded-lg border border-border bg-muted/30 p-3.5 sm:grid-cols-2">
                      {education.length > 1 && (
                        <button onClick={() => removeItem(setEducation, i)} className="absolute right-3 top-3 text-muted-foreground/50 hover:text-red-500 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <div><label className={labelCls}>Degree</label><input className={inputCls} placeholder="B.Tech Computer Science" value={edu.degree} onChange={e => updateItem(setEducation,i,"degree",e.target.value)} /></div>
                      <div><label className={labelCls}>Institution</label><input className={inputCls} placeholder="IIT Delhi" value={edu.institution} onChange={e => updateItem(setEducation,i,"institution",e.target.value)} /></div>
                      <div><label className={labelCls}>Year</label><input className={inputCls} placeholder="2020 - 2024" value={edu.year} onChange={e => updateItem(setEducation,i,"year",e.target.value)} /></div>
                      <div><label className={labelCls}>Grade / CGPA</label><input className={inputCls} placeholder="8.5 CGPA" value={edu.grade} onChange={e => updateItem(setEducation,i,"grade",e.target.value)} /></div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </FadeInView>

            {/* Experience */}
            <FadeInView delay={0.14}>
              <SectionCard id="experience" icon={Briefcase} title="Work Experience"
                accentColor="#f59e0b"
                collapsed={!!collapsed.experience} onToggle={() => toggle("experience")}
                extra={
                  <button onClick={e => { e.stopPropagation(); addItem(setExperience, emptyExp); }}
                    className="inline-flex items-center gap-1 rounded-md border border-dashed border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:border-amber-500/40 hover:text-amber-500 transition-colors">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                }>
                <div className="space-y-3">
                  {experience.map((exp, i) => (
                    <div key={i} className="relative grid gap-3 rounded-lg border border-border bg-muted/30 p-3.5 sm:grid-cols-2">
                      {experience.length > 1 && (
                        <button onClick={() => removeItem(setExperience, i)} className="absolute right-3 top-3 text-muted-foreground/50 hover:text-red-500 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <div><label className={labelCls}>Job Title</label><input className={inputCls} placeholder="Software Engineer" value={exp.title} onChange={e => updateItem(setExperience,i,"title",e.target.value)} /></div>
                      <div><label className={labelCls}>Company</label><input className={inputCls} placeholder="Google India" value={exp.company} onChange={e => updateItem(setExperience,i,"company",e.target.value)} /></div>
                      <div><label className={labelCls}>Duration</label><input className={inputCls} placeholder="Jan 2023 - Present" value={exp.duration} onChange={e => updateItem(setExperience,i,"duration",e.target.value)} /></div>
                      <div className="sm:col-span-2"><label className={labelCls}>Description</label>
                        <textarea className={`${inputCls} min-h-[70px] resize-y`} placeholder="What did you achieve in this role..."
                          value={exp.description} onChange={e => updateItem(setExperience,i,"description",e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </FadeInView>

            {/* Skills */}
            <FadeInView delay={0.16}>
              <SectionCard id="skills" icon={Code} title="Skills & Technologies"
                accentColor="#06b6d4"
                collapsed={!!collapsed.skills} onToggle={() => toggle("skills")}>
                <textarea className={`${inputCls} min-h-[80px] resize-y`}
                  placeholder="e.g. JavaScript, React, Node.js, Python, SQL, Git, AWS, Docker..."
                  value={skills} onChange={e => setSkills(e.target.value)} />
                <SkillTags skills={skills} accentHex={tc.hex} />
              </SectionCard>
            </FadeInView>

            {/* Projects */}
            <FadeInView delay={0.18}>
              <SectionCard id="projects" icon={FolderOpen} title="Projects"
                accentColor="#8b5cf6"
                collapsed={!!collapsed.projects} onToggle={() => toggle("projects")}
                extra={
                  <button onClick={e => { e.stopPropagation(); addItem(setProjects, emptyProj); }}
                    className="inline-flex items-center gap-1 rounded-md border border-dashed border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:border-violet-500/40 hover:text-violet-500 transition-colors">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                }>
                <div className="space-y-3">
                  {projects.map((proj, i) => (
                    <div key={i} className="relative grid gap-3 rounded-lg border border-border bg-muted/30 p-3.5 sm:grid-cols-2">
                      {projects.length > 1 && (
                        <button onClick={() => removeItem(setProjects, i)} className="absolute right-3 top-3 text-muted-foreground/50 hover:text-red-500 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <div><label className={labelCls}>Project Name</label><input className={inputCls} placeholder="E-Commerce Platform" value={proj.name} onChange={e => updateItem(setProjects,i,"name",e.target.value)} /></div>
                      <div><label className={labelCls}>Technologies</label><input className={inputCls} placeholder="React, Node.js, MongoDB" value={proj.tech} onChange={e => updateItem(setProjects,i,"tech",e.target.value)} /></div>
                      <div className="sm:col-span-2"><label className={labelCls}>Description</label>
                        <textarea className={`${inputCls} min-h-[70px] resize-y`} placeholder="Brief description of the project..."
                          value={proj.description} onChange={e => updateItem(setProjects,i,"description",e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </FadeInView>

            {/* Download CTA */}
            <FadeInView delay={0.2}>
              <div className="rounded-xl border border-border bg-card p-6 sm:p-8 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl mb-4" style={{ backgroundColor: `${tc.hex}15` }}>
                  <Download className="h-6 w-6" style={{ color: tc.hex }} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1.5">Ready to download?</h3>
                <p className="text-sm text-muted-foreground mb-5">Your resume will be exported as a formatted PDF document</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Resume
                  </button>
                  <button
                    onClick={generatePDF}
                    className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: tc.hex }}
                  >
                    <Download className="h-4 w-4" />
                    Download Resume PDF
                  </button>
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResumePage;
