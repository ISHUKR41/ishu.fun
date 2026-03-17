/**
 * BioDataPage.tsx - Bio-Data Generator (Ultra Modern 3D Edition)
 *
 * A form-based bio-data builder with 3D background, photo upload with
 * animated glow, neon glassmorphism section cards, confetti on download,
 * progress tracking, and stunning visual effects.
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import ShimmerText from "@/components/animations/ShimmerText";
import HeroScene3D from "@/components/3d/HeroScene3D";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useState, useMemo, useRef, Suspense, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Tilt from "react-parallax-tilt";
import {
  UserCircle, Download, ArrowLeft, User, Heart, Users,
  GraduationCap, Briefcase, MapPin, Phone, Calendar,
  Upload, Sparkles, CheckCircle, Zap, ImageIcon, Eye, X, Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// ─── Confetti Burst ────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ["#8b5cf6","#3b82f6","#06b6d4","#ec4899","#f59e0b","#10b981","#ef4444"];

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
            <motion.div key={p.id}
              style={{ position:"absolute", left:`${p.x}%`, bottom:"15%", width: p.shape==="rect"?p.w*2:p.w, height:p.h, backgroundColor:p.color, borderRadius:p.shape==="circle"?"50%":"2px" }}
              initial={{ opacity:1, y:0, x:0, rotate:0, scale:0 }}
              animate={{ opacity:[0,1,1,1,0], y:[0,-(200+Math.random()*180)], x:[0,p.dx*3.5], rotate:[0,(Math.random()-0.5)*720], scale:[0,1,1,0.7,0] }}
              transition={{ duration:1.9+Math.random()*0.5, delay:p.delay, ease:[0.1,0.8,0.3,1] }}
              onAnimationComplete={() => p.id===55 && onComplete()}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── Circular Progress ─────────────────────────────────────────────────────────
const CircularProgress: React.FC<{ value: number }> = ({ value }) => {
  const size = 88; const sw = 5; const r = (size-sw)/2; const circ = 2*Math.PI*r; const offset = circ-(value/100)*circ;
  return (
    <div className="relative shrink-0" style={{ width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <defs><linearGradient id="pbg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={sw} fill="none"/>
        <motion.circle cx={size/2} cy={size/2} r={r} stroke="url(#pbg)" strokeWidth={sw} fill="none" strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset:circ }} animate={{ strokeDashoffset:offset }} transition={{ duration:0.9, ease:"easeOut" }}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-black text-foreground leading-none">{value}%</span>
        <span className="text-[8px] text-muted-foreground mt-0.5 uppercase tracking-wide">done</span>
      </div>
    </div>
  );
};

// ─── Section Card ──────────────────────────────────────────────────────────────
interface SCProps { id?: string; icon: React.ElementType; title: string; gradient: string; glowColor: string; children: React.ReactNode; }
const SectionCard: React.FC<SCProps> = ({ id, icon: Icon, title, gradient, glowColor, children }) => (
  <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} glareEnable glareMaxOpacity={0.04} transitionSpeed={900}>
    <motion.div id={id} whileHover={{ y:-2 }}
      className="rounded-2xl border border-border/40 bg-gradient-to-b from-card/90 to-card/50 backdrop-blur-xl shadow-2xl transition-all duration-300 relative overflow-hidden"
      style={{ boxShadow:`0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.4)` }}
    >
      {/* Animated left glow border */}
      <motion.div
        className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${gradient} rounded-l-2xl`}
        animate={{ opacity: [0.4, 1, 0.4], scaleY: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        style={{ boxShadow: `0 0 16px ${glowColor}`, transformOrigin: "top" }}
      />
      <div className={`h-px w-full rounded-t-2xl bg-gradient-to-r ${gradient} opacity-60`}/>
      <div className="p-6">
        <div className="mb-5 flex items-center gap-3">
          <motion.div whileHover={{ rotate:15, scale:1.1 }}
            className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
            style={{ boxShadow:`0 4px 16px ${glowColor}` }}
          >
            <Icon className="h-[18px] w-[18px] text-white"/>
          </motion.div>
          <h2 className="text-base font-bold text-foreground">{title}</h2>
        </div>
        {children}
      </div>
    </motion.div>
  </Tilt>
);

// ─── Bio-Data Preview Component ────────────────────────────────────────────────
interface BioDataPreviewProps {
  fullName: string; dob: string; gender: string; religion: string; caste: string;
  nationality: string; maritalStatus: string; height: string; weight: string;
  bloodGroup: string; complexion: string; motherTongue: string; hobbies: string;
  email: string; phone: string; address: string; education: string;
  occupation: string; income: string; fatherName: string; fatherOccupation: string;
  motherName: string; motherOccupation: string; siblings: string; familyType: string;
  photoSrc: string | null; onClose: () => void;
}
const BioDataPreview: React.FC<BioDataPreviewProps> = (p) => {
  const personalRows = [
    ["Full Name", p.fullName], ["Date of Birth", p.dob], ["Gender", p.gender],
    ["Religion", p.religion], ["Caste", p.caste], ["Nationality", p.nationality],
    ["Marital Status", p.maritalStatus], ["Height", p.height], ["Weight", p.weight],
    ["Blood Group", p.bloodGroup], ["Complexion", p.complexion],
    ["Mother Tongue", p.motherTongue], ["Hobbies", p.hobbies],
  ].filter(([, v]) => v?.trim());
  const contactRows = [
    ["Email", p.email], ["Phone", p.phone], ["Address", p.address],
  ].filter(([, v]) => v?.trim());
  const eduRows = [
    ["Education", p.education], ["Occupation", p.occupation], ["Annual Income", p.income],
  ].filter(([, v]) => v?.trim());
  const familyRows = [
    ["Father's Name", p.fatherName], ["Father's Occupation", p.fatherOccupation],
    ["Mother's Name", p.motherName], ["Mother's Occupation", p.motherOccupation],
    ["Siblings", p.siblings], ["Family Type", p.familyType],
  ].filter(([, v]) => v?.trim());

  const Section = ({ title, rows }: { title: string; rows: string[][] }) => (
    rows.length > 0 ? (
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400">{title}</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-violet-500/40 to-transparent" />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex gap-1">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 shrink-0">{label}:</span>
              <span className="text-[11px] text-zinc-700 dark:text-zinc-200 break-words">{value}</span>
            </div>
          ))}
        </div>
      </div>
    ) : null
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={p.onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/40 bg-white dark:bg-zinc-950 shadow-[0_0_80px_rgba(0,0,0,0.5)]"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={p.onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-all">
          <X className="h-4 w-4 text-foreground" />
        </button>
        <div className="h-1.5 w-full rounded-t-3xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
        <div className="p-8">
          <div className="flex items-start gap-4 border-b border-violet-500/20 pb-5 mb-5">
            {p.photoSrc ? (
              <img src={p.photoSrc} alt="Profile" className="h-20 w-16 rounded-xl object-cover border-2 border-violet-500/30 shadow-lg shrink-0" />
            ) : (
              <div className="h-20 w-16 rounded-xl bg-violet-500/10 border-2 border-dashed border-violet-500/30 flex items-center justify-center shrink-0">
                <UserCircle className="h-8 w-8 text-violet-500/40" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-zinc-800 dark:text-zinc-100">{p.fullName || "Your Name"}</h1>
              <div className="text-violet-600 dark:text-violet-400 font-medium text-sm mt-0.5">BIO-DATA</div>
              {p.phone && <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">📞 {p.phone}</div>}
              {p.email && <div className="text-xs text-zinc-500 dark:text-zinc-400">✉️ {p.email}</div>}
            </div>
          </div>
          <Section title="Personal Details" rows={personalRows} />
          <Section title="Contact Details" rows={contactRows} />
          <Section title="Education & Career" rows={eduRows} />
          <Section title="Family Details" rows={familyRows} />
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Constants ─────────────────────────────────────────────────────────────────
const inputCls = "w-full rounded-xl border border-border/50 bg-background/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/45 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:shadow-[0_0_18px_rgba(139,92,246,0.12)] backdrop-blur-md transition-all duration-300";
const labelCls = "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70";

// ─── Main Component ────────────────────────────────────────────────────────────
const BioDataPage = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 2000], [0, -150]);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const disableHeavyEffects = isMobile || prefersReducedMotion;
  // Personal
  const [fullName, setFullName]         = useState("");
  const [dob, setDob]                   = useState("");
  const [gender, setGender]             = useState("");
  const [religion, setReligion]         = useState("");
  const [caste, setCaste]               = useState("");
  const [nationality, setNationality]   = useState("Indian");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [height, setHeight]             = useState("");
  const [weight, setWeight]             = useState("");
  const [bloodGroup, setBloodGroup]     = useState("");
  const [complexion, setComplexion]     = useState("");
  const [motherTongue, setMotherTongue] = useState("");
  const [hobbies, setHobbies]           = useState("");
  // Contact
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [address, setAddress] = useState("");
  // Education & Career
  const [education, setEducation]   = useState("");
  const [occupation, setOccupation] = useState("");
  const [income, setIncome]         = useState("");
  // Family
  const [fatherName, setFatherName]           = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [motherName, setMotherName]           = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [siblings, setSiblings]   = useState("");
  const [familyType, setFamilyType] = useState("");
  // Photo
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [confetti, setConfetti] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const formSectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disableHeavyEffects) return;
    const ctx = gsap.context(() => {
    if (formSectionsRef.current) {
      const sections = formSectionsRef.current.querySelectorAll(".bio-section-gsap");
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
    });

    return () => ctx.revert();
  }, [disableHeavyEffects]);

  const completion = useMemo(() => {
    const fields = [fullName, dob, gender, email, phone, education, occupation, fatherName];
    const filled = fields.filter(f => f.trim()).length;
    return Math.round((filled / fields.length) * 100);
  }, [fullName, dob, gender, email, phone, education, occupation, fatherName]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    let y = 20;

    const heading = (text: string) => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFontSize(12); doc.setFont("helvetica","bold"); doc.setTextColor(88,28,135);
      doc.text(text, 15, y); y += 2;
      doc.setDrawColor(180,140,220); doc.line(15,y,pw-15,y); y += 7;
    };
    const row = (label: string, value: string) => {
      if (!value.trim()) return;
      if (y > 275) { doc.addPage(); y = 20; }
      doc.setFontSize(10); doc.setFont("helvetica","bold"); doc.setTextColor(60,60,60);
      doc.text(`${label}:`,15,y);
      doc.setFont("helvetica","normal"); doc.setTextColor(33,33,33);
      doc.text(value,70,y); y += 6.5;
    };

    // Title
    doc.setFontSize(22); doc.setFont("helvetica","bold"); doc.setTextColor(88,28,135);
    doc.text("BIO-DATA", pw/2, y, { align:"center" }); y += 5;
    doc.setDrawColor(88,28,135); doc.setLineWidth(0.5);
    doc.line(pw/2-25,y,pw/2+25,y); y += 12;

    // Photo
    if (photoSrc) {
      try { doc.addImage(photoSrc,"JPEG",pw-55,5,40,45); } catch {}
    }

    heading("PERSONAL DETAILS");
    row("Full Name",fullName); row("Date of Birth",dob); row("Gender",gender);
    row("Religion",religion); row("Caste",caste); row("Nationality",nationality);
    row("Marital Status",maritalStatus); row("Height",height); row("Weight",weight);
    row("Blood Group",bloodGroup); row("Complexion",complexion);
    row("Mother Tongue",motherTongue); row("Hobbies",hobbies); y += 4;

    heading("CONTACT DETAILS");
    row("Email",email); row("Phone",phone); row("Address",address); y += 4;

    heading("EDUCATION & CAREER");
    row("Education",education); row("Occupation",occupation); row("Annual Income",income); y += 4;

    heading("FAMILY DETAILS");
    row("Father's Name",fatherName); row("Father's Occupation",fatherOccupation);
    row("Mother's Name",motherName); row("Mother's Occupation",motherOccupation);
    row("Siblings",siblings); row("Family Type",familyType);

    doc.save(`${fullName||"BioData"}_BioData.pdf`);
    toast.success("✨ Bio-Data downloaded successfully!", { duration: 3000 });
    setConfetti(true);
  };

  return (
    <Layout>
      <SEOHead {...SEO_DATA.biodata} />
      <BreadcrumbSchema items={[
        { name:"Home", url:"https://ishu.fun/" },
        { name:"CV", url:"https://ishu.fun/cv" },
        { name:"Bio-Data", url:"https://ishu.fun/cv/bio-data" },
      ]} />

      {/* Dynamic Background Image */}
      <motion.div className="fixed inset-0 -z-10 opacity-[0.05] mix-blend-luminosity pointer-events-none scale-[1.15] origin-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        y: bgY
      }} />

      <ConfettiBurst active={confetti} onComplete={() => setConfetti(false)} />

      <section className="relative overflow-hidden min-h-screen py-16 md:py-20">
        {!disableHeavyEffects && <div className="opacity-20"><Suspense fallback={null}><HeroScene3D /></Suspense></div>}
        <GradientMesh className="opacity-15" />
        <MorphingBlob className="absolute -top-40 -right-40 h-[500px] w-[500px] opacity-10" color="violet" />
        <MorphingBlob className="absolute -bottom-40 -left-40 h-[400px] w-[400px] opacity-8" color="purple" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage:"linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)", backgroundSize:"50px 50px" }}/>

        <div className="container relative z-10">
          {/* ── Header ── */}
          <FadeInView>
            <div className="mb-10">
              <Link to="/cv" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-violet-400 transition-colors group">
                <motion.span whileHover={{ x:-3 }} className="inline-flex"><ArrowLeft className="h-4 w-4"/></motion.span>
                Back to CV Hub
              </Link>
              <div className="flex items-center gap-4">
                <motion.div initial={{ scale:0, rotate:-180 }} animate={{ scale:1, rotate:0 }}
                  transition={{ type:"spring", stiffness:200, damping:15 }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-2xl"
                  style={{ boxShadow:"0 8px 32px rgba(139,92,246,0.4)" }}>
                  <UserCircle className="h-8 w-8 text-white drop-shadow"/>
                </motion.div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                    <ShimmerText>Bio-Data</ShimmerText>{" "}<span className="text-foreground">Builder</span>
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Fill in your details and download a formatted bio-data PDF</p>
                </div>
              </div>
            </div>
          </FadeInView>

          {/* ── Progress ── */}
          <FadeInView delay={0.05}>
            <div className="mx-auto max-w-4xl mb-8">
              <div className="rounded-2xl border border-border/40 bg-gradient-to-b from-card/90 to-card/50 backdrop-blur-xl p-5 shadow-2xl">
                <div className="flex items-center gap-5">
                  <CircularProgress value={completion} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-foreground">Form Completion</span>
                      <span className={`text-xs font-bold ${completion===100?"text-emerald-400":"text-violet-400"}`}>
                        {completion===100?"✅ All filled!":completion>50?"Keep going! 🔥":"Let's start! 🚀"}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-border/40 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                        initial={{ width:0 }} animate={{ width:`${completion}%` }} transition={{ duration:0.6, ease:"easeOut" }}/>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Fill Name, DOB, Gender, Email, Phone, Education, Occupation & Father's Name for 100%</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInView>

          <div ref={formSectionsRef} className="mx-auto max-w-4xl space-y-5">

            {/* ── Photo Upload ── */}
            <div className="bio-section-gsap" style={{ willChange: "transform" }}>
            <FadeInView delay={0.08}>
              <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} glareEnable glareMaxOpacity={0.04} transitionSpeed={900}>
                <motion.div whileHover={{ y:-2 }} className="rounded-2xl border border-border/40 bg-gradient-to-b from-card/90 to-card/50 backdrop-blur-xl shadow-2xl overflow-hidden relative">
                  {/* Animated left glow border */}
                  <motion.div
                    className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-pink-500 to-rose-500 rounded-l-2xl"
                    animate={{ opacity: [0.4, 1, 0.4], scaleY: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    style={{ boxShadow: "0 0 16px rgba(236,72,153,0.5)", transformOrigin: "top" }}
                  />
                  <div className="h-px w-full bg-gradient-to-r from-violet-500 to-pink-500 opacity-60"/>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <motion.div whileHover={{ rotate:15, scale:1.1 }}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg"
                        style={{ boxShadow:"0 4px 16px rgba(236,72,153,0.4)" }}>
                        <ImageIcon className="h-[18px] w-[18px] text-white"/>
                      </motion.div>
                      <h2 className="text-base font-bold text-foreground">Profile Photo <span className="text-muted-foreground font-normal text-sm">(Optional)</span></h2>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Photo preview with holographic glow + spinning gradient border */}
                      <div className="relative shrink-0">
                        {/* Spinning gradient border ring */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                          className="absolute -inset-1 rounded-2xl"
                          style={{
                            background: photoSrc
                              ? "conic-gradient(from 0deg, #8b5cf6, #ec4899, #06b6d4, #10b981, #8b5cf6)"
                              : "conic-gradient(from 0deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3), rgba(139,92,246,0.3))",
                            padding: "1.5px",
                          }}
                        >
                          <div className="w-full h-full rounded-2xl bg-card/90" />
                        </motion.div>
                        {/* Holographic glow when photo uploaded */}
                        {photoSrc && (
                          <motion.div
                            animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.08, 1] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            className="absolute -inset-3 rounded-3xl pointer-events-none"
                            style={{
                              background: "radial-gradient(ellipse at center, rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.2) 50%, transparent 70%)",
                              filter: "blur(8px)",
                            }}
                          />
                        )}
                        <motion.div whileHover={{ scale:1.04 }} onClick={() => fileRef.current?.click()}
                          className="relative h-28 w-24 rounded-xl overflow-hidden border-2 border-transparent bg-violet-500/5 cursor-pointer transition-all group z-10"
                          style={photoSrc ? { boxShadow: "0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(236,72,153,0.2)" } : {}}
                        >
                          {photoSrc ? (
                            <img src={photoSrc} alt="Profile" className="h-full w-full object-cover"/>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center gap-1">
                              <Upload className="h-6 w-6 text-violet-500/50 group-hover:text-violet-400 transition-colors"/>
                              <span className="text-[9px] text-muted-foreground group-hover:text-violet-400 transition-colors text-center px-1">Click to upload</span>
                            </div>
                          )}
                        </motion.div>
                        {/* Sparkle decorations when photo uploaded */}
                        {photoSrc && [
                          { top: "-8px", right: "-8px", delay: 0, size: "h-4 w-4" },
                          { top: "50%", right: "-12px", delay: 0.5, size: "h-3 w-3" },
                          { bottom: "-8px", left: "-8px", delay: 1, size: "h-4 w-4" },
                          { top: "-10px", left: "30%", delay: 1.5, size: "h-3 w-3" },
                        ].map((spark, i) => (
                          <motion.div
                            key={i}
                            className={`absolute ${spark.size} text-violet-400 pointer-events-none z-20`}
                            style={{ top: spark.top, right: (spark as { right?: string }).right, bottom: (spark as { bottom?: string }).bottom, left: (spark as { left?: string }).left }}
                            animate={{ scale: [0.5, 1.2, 0.5], opacity: [0.3, 1, 0.3], rotate: [0, 180, 360] }}
                            transition={{ repeat: Infinity, duration: 2 + i * 0.3, delay: spark.delay, ease: "easeInOut" }}
                          >
                            <Sparkles className="h-full w-full" />
                          </motion.div>
                        ))}
                      </div>
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto}/>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Upload your photo</p>
                        <p className="text-xs text-muted-foreground mb-3">JPG, PNG, WEBP accepted. Will appear in the top-right corner of your bio-data PDF.</p>
                        <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                          onClick={() => fileRef.current?.click()}
                          className="inline-flex items-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-400 hover:bg-violet-500/20 transition-all">
                          <Upload className="h-3.5 w-3.5"/>{photoSrc ? "Change Photo" : "Upload Photo"}
                        </motion.button>
                        {photoSrc && (
                          <button onClick={() => setPhotoSrc(null)} className="ml-2 text-xs text-red-400/60 hover:text-red-400 transition-colors">Remove</button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Tilt>
            </FadeInView>
            </div>

            {/* ── Personal Details ── */}
            <div className="bio-section-gsap" style={{ willChange: "transform" }}>
            <FadeInView delay={0.1}>
              <SectionCard id="personal" icon={User} title="Personal Details" gradient="from-violet-500 to-purple-500" glowColor="rgba(139,92,246,0.4)">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className={labelCls}>Full Name</label>
                    <input className={inputCls} placeholder="e.g. Priya Sharma" value={fullName} onChange={e=>setFullName(e.target.value)}/>
                  </div>
                  <div><label className={labelCls}>Date of Birth</label><input className={inputCls} type="date" value={dob} onChange={e=>setDob(e.target.value)}/></div>
                  <div><label className={labelCls}>Gender</label>
                    <select className={inputCls} value={gender} onChange={e=>setGender(e.target.value)}>
                      <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div><label className={labelCls}>Religion</label><input className={inputCls} placeholder="e.g. Hindu" value={religion} onChange={e=>setReligion(e.target.value)}/></div>
                  <div><label className={labelCls}>Caste</label><input className={inputCls} placeholder="e.g. General" value={caste} onChange={e=>setCaste(e.target.value)}/></div>
                  <div><label className={labelCls}>Nationality</label><input className={inputCls} placeholder="Indian" value={nationality} onChange={e=>setNationality(e.target.value)}/></div>
                  <div><label className={labelCls}>Marital Status</label>
                    <select className={inputCls} value={maritalStatus} onChange={e=>setMaritalStatus(e.target.value)}>
                      <option value="">Select</option><option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                    </select>
                  </div>
                  <div><label className={labelCls}>Height</label><input className={inputCls} placeholder='e.g. 5&apos;8"' value={height} onChange={e=>setHeight(e.target.value)}/></div>
                  <div><label className={labelCls}>Weight</label><input className={inputCls} placeholder="e.g. 65 kg" value={weight} onChange={e=>setWeight(e.target.value)}/></div>
                  <div><label className={labelCls}>Blood Group</label><input className={inputCls} placeholder="e.g. B+" value={bloodGroup} onChange={e=>setBloodGroup(e.target.value)}/></div>
                  <div><label className={labelCls}>Complexion</label><input className={inputCls} placeholder="e.g. Fair" value={complexion} onChange={e=>setComplexion(e.target.value)}/></div>
                  <div><label className={labelCls}>Mother Tongue</label><input className={inputCls} placeholder="e.g. Hindi" value={motherTongue} onChange={e=>setMotherTongue(e.target.value)}/></div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className={labelCls}>Hobbies & Interests</label>
                    <input className={inputCls} placeholder="e.g. Reading, Cooking, Traveling" value={hobbies} onChange={e=>setHobbies(e.target.value)}/>
                  </div>
                </div>
              </SectionCard>
            </FadeInView>
            </div>

            {/* ── Contact ── */}
            <div className="bio-section-gsap" style={{ willChange: "transform" }}>
            <FadeInView delay={0.12}>
              <SectionCard icon={Phone} title="Contact Details" gradient="from-emerald-500 to-teal-500" glowColor="rgba(16,185,129,0.4)">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className={labelCls}>Email</label><input className={`${inputCls} focus:border-emerald-500/60 focus:ring-emerald-500/20`} type="email" placeholder="priya@email.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
                  <div><label className={labelCls}>Phone</label><input className={`${inputCls} focus:border-emerald-500/60 focus:ring-emerald-500/20`} placeholder="+91 98765 43210" value={phone} onChange={e=>setPhone(e.target.value)}/></div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Address</label>
                    <textarea className={`${inputCls} min-h-[70px] resize-y focus:border-emerald-500/60 focus:ring-emerald-500/20`} placeholder="Full address..." value={address} onChange={e=>setAddress(e.target.value)}/>
                  </div>
                </div>
              </SectionCard>
            </FadeInView>
            </div>

            {/* ── Education & Career ── */}
            <div className="bio-section-gsap" style={{ willChange: "transform" }}>
            <FadeInView delay={0.14}>
              <SectionCard icon={GraduationCap} title="Education & Career" gradient="from-blue-500 to-cyan-500" glowColor="rgba(59,130,246,0.4)">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div><label className={labelCls}>Highest Education</label><input className={`${inputCls} focus:border-blue-500/60 focus:ring-blue-500/20`} placeholder="e.g. B.Tech" value={education} onChange={e=>setEducation(e.target.value)}/></div>
                  <div><label className={labelCls}>Occupation</label><input className={`${inputCls} focus:border-blue-500/60 focus:ring-blue-500/20`} placeholder="e.g. Software Engineer" value={occupation} onChange={e=>setOccupation(e.target.value)}/></div>
                  <div><label className={labelCls}>Annual Income</label><input className={`${inputCls} focus:border-blue-500/60 focus:ring-blue-500/20`} placeholder="e.g. ₹8,00,000" value={income} onChange={e=>setIncome(e.target.value)}/></div>
                </div>
              </SectionCard>
            </FadeInView>
            </div>

            {/* ── Family ── */}
            <div className="bio-section-gsap" style={{ willChange: "transform" }}>
            <FadeInView delay={0.16}>
              <SectionCard icon={Users} title="Family Details" gradient="from-amber-500 to-orange-500" glowColor="rgba(245,158,11,0.4)">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className={labelCls}>Father's Name</label><input className={`${inputCls} focus:border-amber-500/60 focus:ring-amber-500/20`} placeholder="e.g. Rajesh Sharma" value={fatherName} onChange={e=>setFatherName(e.target.value)}/></div>
                  <div><label className={labelCls}>Father's Occupation</label><input className={`${inputCls} focus:border-amber-500/60 focus:ring-amber-500/20`} placeholder="e.g. Businessman" value={fatherOccupation} onChange={e=>setFatherOccupation(e.target.value)}/></div>
                  <div><label className={labelCls}>Mother's Name</label><input className={`${inputCls} focus:border-amber-500/60 focus:ring-amber-500/20`} placeholder="e.g. Sunita Sharma" value={motherName} onChange={e=>setMotherName(e.target.value)}/></div>
                  <div><label className={labelCls}>Mother's Occupation</label><input className={`${inputCls} focus:border-amber-500/60 focus:ring-amber-500/20`} placeholder="e.g. Homemaker" value={motherOccupation} onChange={e=>setMotherOccupation(e.target.value)}/></div>
                  <div><label className={labelCls}>Siblings</label><input className={`${inputCls} focus:border-amber-500/60 focus:ring-amber-500/20`} placeholder="e.g. 1 Elder Brother, 1 Younger Sister" value={siblings} onChange={e=>setSiblings(e.target.value)}/></div>
                  <div><label className={labelCls}>Family Type</label>
                    <select className={`${inputCls} focus:border-amber-500/60 focus:ring-amber-500/20`} value={familyType} onChange={e=>setFamilyType(e.target.value)}>
                      <option value="">Select</option><option>Joint Family</option><option>Nuclear Family</option>
                    </select>
                  </div>
                </div>
              </SectionCard>
            </FadeInView>
            </div>

            {/* ── Download CTA ── */}
            <div className="bio-section-gsap" style={{ willChange: "transform" }}>
            <FadeInView delay={0.18}>
              <motion.div
                className="rounded-2xl border border-border/40 bg-gradient-to-br from-violet-500/10 via-purple-500/8 to-pink-500/10 p-8 text-center backdrop-blur-xl shadow-2xl"
                style={{ boxShadow:"0 0 60px rgba(139,92,246,0.08), 0 20px 60px rgba(0,0,0,0.3)" }}>
                <motion.div animate={{ y:[0,-6,0] }} transition={{ repeat:Infinity, duration:3, ease:"easeInOut" }} className="mb-4 inline-block">
                  <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-2xl"
                    style={{ boxShadow:"0 8px 32px rgba(139,92,246,0.5)" }}>
                    <Sparkles className="h-8 w-8 text-white"/>
                  </div>
                </motion.div>
                <h3 className="text-xl font-black text-foreground mb-2">Ready to Download?</h3>
                <p className="text-sm text-muted-foreground mb-6">Your bio-data will be exported as a beautifully formatted PDF</p>
                <motion.button
                  whileHover={{ scale:1.04, boxShadow:"0 0 40px rgba(139,92,246,0.6), 0 8px 32px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale:0.97 }}
                  onClick={generatePDF}
                  className="relative overflow-hidden inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 px-10 py-4 text-sm font-bold text-white shadow-2xl transition-all"
                  style={{ boxShadow:"0 4px 24px rgba(139,92,246,0.4)" }}>
                  <motion.div animate={{ x:["-100%","200%"] }} transition={{ repeat:Infinity, duration:2.5, ease:"linear" }}
                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"/>
                  <Download className="h-5 w-5 relative z-10"/>
                  <span className="relative z-10">Download Bio-Data PDF</span>
                  <Zap className="h-4 w-4 relative z-10 opacity-80"/>
                </motion.button>
              </motion.div>
            </FadeInView>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BioDataPage;
