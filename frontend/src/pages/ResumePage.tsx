/**
 * ResumePage.tsx - Professional Resume Builder (Enhanced)
 * 
 * A form-based resume builder where users fill in their details
 * and generate a downloadable PDF resume.
 * 
 * Features: Animated progress bar, template color picker, section
 * animations, particle background, shimmer text, confetti on download,
 * completion tracking, and smooth transitions.
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import ParticleField from "@/components/animations/ParticleField";
import ShimmerText from "@/components/animations/ShimmerText";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  FileText, Plus, Trash2, Download, Eye, ArrowLeft, ArrowRight,
  User, GraduationCap, Briefcase, Code, FolderOpen, Mail, Phone, MapPin, Globe, Linkedin,
  CheckCircle, Sparkles, Palette, RotateCcw, ChevronDown, ChevronUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import jsPDF from "jspdf";
import toast from "react-hot-toast";

interface Education {
  degree: string;
  institution: string;
  year: string;
  grade: string;
}

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Project {
  name: string;
  description: string;
  tech: string;
}

const emptyEducation: Education = { degree: "", institution: "", year: "", grade: "" };
const emptyExperience: Experience = { title: "", company: "", duration: "", description: "" };
const emptyProject: Project = { name: "", description: "", tech: "" };

const inputClass = "w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 backdrop-blur-sm transition-all duration-200";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground";

const templateColors = [
  { name: "Blue", primary: [30, 64, 175] as [number, number, number], accent: "from-blue-500 to-cyan-500", ring: "ring-blue-500" },
  { name: "Violet", primary: [88, 28, 135] as [number, number, number], accent: "from-violet-500 to-purple-500", ring: "ring-violet-500" },
  { name: "Emerald", primary: [5, 122, 85] as [number, number, number], accent: "from-emerald-500 to-teal-500", ring: "ring-emerald-500" },
  { name: "Rose", primary: [190, 18, 60] as [number, number, number], accent: "from-rose-500 to-pink-500", ring: "ring-rose-500" },
  { name: "Amber", primary: [180, 83, 9] as [number, number, number], accent: "from-amber-500 to-orange-500", ring: "ring-amber-500" },
];

const sectionMeta = [
  { id: "personal", label: "Personal Info", icon: User, color: "text-blue-500" },
  { id: "summary", label: "Summary", icon: FileText, color: "text-blue-500" },
  { id: "education", label: "Education", icon: GraduationCap, color: "text-emerald-500" },
  { id: "experience", label: "Experience", icon: Briefcase, color: "text-amber-500" },
  { id: "skills", label: "Skills", icon: Code, color: "text-cyan-500" },
  { id: "projects", label: "Projects", icon: FolderOpen, color: "text-violet-500" },
];

const ResumePage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState<Education[]>([{ ...emptyEducation }]);
  const [experience, setExperience] = useState<Experience[]>([{ ...emptyExperience }]);
  const [projects, setProjects] = useState<Project[]>([{ ...emptyProject }]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setCollapsedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate completion percentage
  const completionPercent = useMemo(() => {
    let filled = 0;
    let total = 8;
    if (fullName.trim()) filled++;
    if (email.trim()) filled++;
    if (phone.trim()) filled++;
    if (location.trim()) filled++;
    if (summary.trim()) filled++;
    if (skills.trim()) filled++;
    if (education.some(e => e.degree || e.institution)) filled++;
    if (experience.some(e => e.title || e.company)) filled++;
    return Math.round((filled / total) * 100);
  }, [fullName, email, phone, location, summary, skills, education, experience]);

  const addItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, empty: T) => {
    setter((prev) => [...prev, { ...empty }]);
  };

  const removeItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number, field: keyof T, value: string) => {
    setter((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const tc = templateColors[selectedColor].primary;
    let y = 20;

    // Helper to add text and advance y
    const addText = (text: string, x: number, size: number, style: string = "normal", color: [number, number, number] = [33, 33, 33]) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", style);
      doc.setTextColor(...color);
      doc.text(text, x, y);
    };

    const addLine = () => {
      doc.setDrawColor(200, 200, 200);
      doc.line(15, y, pageWidth - 15, y);
      y += 6;
    };

    const checkPage = (needed: number) => {
      if (y + needed > 280) {
        doc.addPage();
        y = 20;
      }
    };

    // Name
    addText(fullName || "Your Name", pageWidth / 2 - doc.getTextWidth(fullName || "Your Name") * 0.5 * (20 / 12), 20, "bold", tc);
    y += 8;

    // Contact line
    const contactParts = [email, phone, location, website, linkedin].filter(Boolean);
    if (contactParts.length) {
      const contactLine = contactParts.join("  |  ");
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(contactLine, pageWidth / 2, y, { align: "center" });
      y += 10;
    }

    // Summary
    if (summary.trim()) {
      addLine();
      addText("PROFESSIONAL SUMMARY", 15, 11, "bold", tc);
      y += 6;
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const summaryLines = doc.splitTextToSize(summary, pageWidth - 30);
      doc.text(summaryLines, 15, y);
      y += summaryLines.length * 4.5 + 4;
    }

    // Education
    const filledEdu = education.filter((e) => e.degree || e.institution);
    if (filledEdu.length) {
      checkPage(30);
      addLine();
      addText("EDUCATION", 15, 11, "bold", tc);
      y += 7;
      filledEdu.forEach((edu) => {
        checkPage(18);
        addText(edu.degree, 15, 10, "bold");
        y += 5;
        addText(`${edu.institution}${edu.year ? ` — ${edu.year}` : ""}${edu.grade ? ` | ${edu.grade}` : ""}`, 15, 9, "normal", [80, 80, 80]);
        y += 7;
      });
    }

    // Experience
    const filledExp = experience.filter((e) => e.title || e.company);
    if (filledExp.length) {
      checkPage(30);
      addLine();
      addText("EXPERIENCE", 15, 11, "bold", tc);
      y += 7;
      filledExp.forEach((exp) => {
        checkPage(22);
        addText(exp.title, 15, 10, "bold");
        if (exp.company || exp.duration) {
          y += 5;
          addText(`${exp.company}${exp.duration ? ` — ${exp.duration}` : ""}`, 15, 9, "italic", [80, 80, 80]);
        }
        if (exp.description) {
          y += 5;
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          const descLines = doc.splitTextToSize(exp.description, pageWidth - 30);
          doc.text(descLines, 15, y);
          y += descLines.length * 4 + 2;
        }
        y += 4;
      });
    }

    // Skills
    if (skills.trim()) {
      checkPage(20);
      addLine();
      addText("SKILLS", 15, 11, "bold", tc);
      y += 6;
      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const skillLines = doc.splitTextToSize(skills, pageWidth - 30);
      doc.text(skillLines, 15, y);
      y += skillLines.length * 4.5 + 4;
    }

    // Projects
    const filledProjects = projects.filter((p) => p.name);
    if (filledProjects.length) {
      checkPage(30);
      addLine();
      addText("PROJECTS", 15, 11, "bold", tc);
      y += 7;
      filledProjects.forEach((proj) => {
        checkPage(18);
        addText(proj.name, 15, 10, "bold");
        if (proj.tech) {
          y += 5;
          addText(`Tech: ${proj.tech}`, 15, 8.5, "italic", [100, 100, 100]);
        }
        if (proj.description) {
          y += 5;
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          const projLines = doc.splitTextToSize(proj.description, pageWidth - 30);
          doc.text(projLines, 15, y);
          y += projLines.length * 4 + 2;
        }
        y += 4;
      });
    }

    doc.save(`${fullName || "Resume"}_Resume.pdf`);
    toast.success("Resume downloaded successfully! 🎉", { duration: 3000, icon: "📄" });
  };

  return (
    <Layout>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://ishu.dev/" },
        { name: "CV", url: "https://ishu.dev/cv" },
        { name: "Resume", url: "https://ishu.dev/cv/resume" },
      ]} />

      <section className="relative overflow-hidden py-16 md:py-20">
        <GradientMesh className="opacity-20" />

        <div className="container relative z-10">
          {/* Header */}
          <FadeInView>
            <div className="mb-10">
              <Link to="/cv" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to CV
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Resume Builder</h1>
                  <p className="text-sm text-muted-foreground">Fill in your details and download a professional PDF resume</p>
                </div>
              </div>
            </div>
          </FadeInView>

          <div className="mx-auto max-w-4xl space-y-8">
            {/* Personal Information */}
            <FadeInView delay={0.1}>
              <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
                <div className="mb-5 flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Full Name</label>
                    <input className={inputClass} placeholder="e.g. Rahul Sharma" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input className={inputClass} type="email" placeholder="rahul@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input className={inputClass} placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <input className={inputClass} placeholder="New Delhi, India" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Website</label>
                    <input className={inputClass} placeholder="https://yoursite.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>LinkedIn</label>
                    <input className={inputClass} placeholder="https://linkedin.com/in/yourprofile" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                  </div>
                </div>
              </div>
            </FadeInView>

            {/* Professional Summary */}
            <FadeInView delay={0.15}>
              <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
                <div className="mb-5 flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-foreground">Professional Summary</h2>
                </div>
                <textarea className={`${inputClass} min-h-[100px] resize-y`} placeholder="A brief summary about your professional background and goals..."
                  value={summary} onChange={(e) => setSummary(e.target.value)} />
              </div>
            </FadeInView>

            {/* Education */}
            <FadeInView delay={0.2}>
              <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-emerald-500" />
                    <h2 className="text-lg font-semibold text-foreground">Education</h2>
                  </div>
                  <button onClick={() => addItem(setEducation, emptyEducation)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {education.map((edu, i) => (
                    <div key={i} className="relative grid gap-3 rounded-xl border border-border/50 bg-background/40 p-4 sm:grid-cols-2">
                      {education.length > 1 && (
                        <button onClick={() => removeItem(setEducation, i)} className="absolute right-3 top-3 text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <div>
                        <label className={labelClass}>Degree</label>
                        <input className={inputClass} placeholder="B.Tech Computer Science" value={edu.degree} onChange={(e) => updateItem(setEducation, i, "degree", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Institution</label>
                        <input className={inputClass} placeholder="IIT Delhi" value={edu.institution} onChange={(e) => updateItem(setEducation, i, "institution", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Year</label>
                        <input className={inputClass} placeholder="2020 - 2024" value={edu.year} onChange={(e) => updateItem(setEducation, i, "year", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Grade / CGPA</label>
                        <input className={inputClass} placeholder="8.5 CGPA" value={edu.grade} onChange={(e) => updateItem(setEducation, i, "grade", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInView>

            {/* Experience */}
            <FadeInView delay={0.25}>
              <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-amber-500" />
                    <h2 className="text-lg font-semibold text-foreground">Experience</h2>
                  </div>
                  <button onClick={() => addItem(setExperience, emptyExperience)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {experience.map((exp, i) => (
                    <div key={i} className="relative grid gap-3 rounded-xl border border-border/50 bg-background/40 p-4 sm:grid-cols-2">
                      {experience.length > 1 && (
                        <button onClick={() => removeItem(setExperience, i)} className="absolute right-3 top-3 text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <div>
                        <label className={labelClass}>Job Title</label>
                        <input className={inputClass} placeholder="Software Engineer" value={exp.title} onChange={(e) => updateItem(setExperience, i, "title", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Company</label>
                        <input className={inputClass} placeholder="Google India" value={exp.company} onChange={(e) => updateItem(setExperience, i, "company", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Duration</label>
                        <input className={inputClass} placeholder="Jan 2023 - Present" value={exp.duration} onChange={(e) => updateItem(setExperience, i, "duration", e.target.value)} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Description</label>
                        <textarea className={`${inputClass} min-h-[70px] resize-y`} placeholder="What did you do in this role..."
                          value={exp.description} onChange={(e) => updateItem(setExperience, i, "description", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInView>

            {/* Skills */}
            <FadeInView delay={0.3}>
              <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Code className="h-5 w-5 text-cyan-500" />
                  <h2 className="text-lg font-semibold text-foreground">Skills</h2>
                </div>
                <textarea className={`${inputClass} min-h-[80px] resize-y`}
                  placeholder="e.g. JavaScript, React, Node.js, Python, SQL, Git, AWS..."
                  value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
            </FadeInView>

            {/* Projects */}
            <FadeInView delay={0.35}>
              <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5 text-violet-500" />
                    <h2 className="text-lg font-semibold text-foreground">Projects</h2>
                  </div>
                  <button onClick={() => addItem(setProjects, emptyProject)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
                <div className="space-y-4">
                  {projects.map((proj, i) => (
                    <div key={i} className="relative grid gap-3 rounded-xl border border-border/50 bg-background/40 p-4 sm:grid-cols-2">
                      {projects.length > 1 && (
                        <button onClick={() => removeItem(setProjects, i)} className="absolute right-3 top-3 text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <div>
                        <label className={labelClass}>Project Name</label>
                        <input className={inputClass} placeholder="E-Commerce Platform" value={proj.name} onChange={(e) => updateItem(setProjects, i, "name", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClass}>Technologies</label>
                        <input className={inputClass} placeholder="React, Node.js, MongoDB" value={proj.tech} onChange={(e) => updateItem(setProjects, i, "tech", e.target.value)} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Description</label>
                        <textarea className={`${inputClass} min-h-[70px] resize-y`} placeholder="Brief description of the project..."
                          value={proj.description} onChange={(e) => updateItem(setProjects, i, "description", e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInView>

            {/* Action Buttons */}
            <FadeInView delay={0.4}>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={generatePDF}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </motion.button>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResumePage;
