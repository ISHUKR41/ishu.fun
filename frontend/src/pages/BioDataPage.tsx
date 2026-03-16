/**
 * BioDataPage.tsx - Bio-Data Generator
 * 
 * A form-based bio-data builder for personal, matrimonial, or official use.
 * Users fill in personal and family details and download a formatted PDF.
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  UserCircle, Download, ArrowLeft, User, Heart, Users, GraduationCap, Briefcase, MapPin, Phone, Mail, Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";
import jsPDF from "jspdf";

const inputClass = "w-full rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 backdrop-blur-sm";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground";

const BioDataPage = () => {
  // Personal Details
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [religion, setReligion] = useState("");
  const [caste, setCaste] = useState("");
  const [nationality, setNationality] = useState("Indian");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [complexion, setComplexion] = useState("");
  const [motherTongue, setMotherTongue] = useState("");
  const [hobbies, setHobbies] = useState("");

  // Contact
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Education & Career
  const [education, setEducation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [income, setIncome] = useState("");

  // Family Details
  const [fatherName, setFatherName] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [siblings, setSiblings] = useState("");
  const [familyType, setFamilyType] = useState("");

  const generatePDF = () => {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    let y = 20;

    const heading = (text: string) => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(88, 28, 135);
      doc.text(text, 15, y);
      y += 2;
      doc.setDrawColor(180, 140, 220);
      doc.line(15, y, pw - 15, y);
      y += 7;
    };

    const row = (label: string, value: string) => {
      if (!value.trim()) return;
      if (y > 275) { doc.addPage(); y = 20; }
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text(`${label}:`, 15, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(33, 33, 33);
      doc.text(value, 70, y);
      y += 6.5;
    };

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(88, 28, 135);
    const title = "BIO-DATA";
    doc.text(title, pw / 2, y, { align: "center" });
    y += 5;
    doc.setDrawColor(88, 28, 135);
    doc.setLineWidth(0.5);
    doc.line(pw / 2 - 25, y, pw / 2 + 25, y);
    y += 12;

    // Personal Details
    heading("PERSONAL DETAILS");
    row("Full Name", fullName);
    row("Date of Birth", dob);
    row("Gender", gender);
    row("Religion", religion);
    row("Caste", caste);
    row("Nationality", nationality);
    row("Marital Status", maritalStatus);
    row("Height", height);
    row("Weight", weight);
    row("Blood Group", bloodGroup);
    row("Complexion", complexion);
    row("Mother Tongue", motherTongue);
    row("Hobbies", hobbies);
    y += 4;

    // Contact
    heading("CONTACT DETAILS");
    row("Email", email);
    row("Phone", phone);
    row("Address", address);
    y += 4;

    // Education & Career
    heading("EDUCATION & CAREER");
    row("Education", education);
    row("Occupation", occupation);
    row("Annual Income", income);
    y += 4;

    // Family Details
    heading("FAMILY DETAILS");
    row("Father's Name", fatherName);
    row("Father's Occupation", fatherOccupation);
    row("Mother's Name", motherName);
    row("Mother's Occupation", motherOccupation);
    row("Siblings", siblings);
    row("Family Type", familyType);

    doc.save(`${fullName || "BioData"}_BioData.pdf`);
  };

  return (
    <Layout>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://ishu.dev/" },
        { name: "CV", url: "https://ishu.dev/cv" },
        { name: "Bio-Data", url: "https://ishu.dev/cv/bio-data" },
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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
                  <UserCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Bio-Data Builder</h1>
                  <p className="text-sm text-muted-foreground">Fill in your details and download a formatted bio-data PDF</p>
                </div>
              </div>
            </div>
          </FadeInView>

          <div className="mx-auto max-w-4xl space-y-8">
            {/* Personal Details */}
            <FadeInView delay={0.1}>
              <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
                <div className="mb-5 flex items-center gap-3">
                  <User className="h-5 w-5 text-violet-500" />
                  <h2 className="text-lg font-semibold text-foreground">Personal Details</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className={labelClass}>Full Name</label>
                    <input className={inputClass} placeholder="e.g. Priya Sharma" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input className={inputClass} type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select className={inputClass} value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Religion</label>
                    <input className={inputClass} placeholder="e.g. Hindu" value={religion} onChange={(e) => setReligion(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Caste</label>
                    <input className={inputClass} placeholder="e.g. General" value={caste} onChange={(e) => setCaste(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Nationality</label>
                    <input className={inputClass} placeholder="Indian" value={nationality} onChange={(e) => setNationality(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Marital Status</label>
                    <select className={inputClass} value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Height</label>
                    <input className={inputClass} placeholder="e.g. 5'8&quot;" value={height} onChange={(e) => setHeight(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Weight</label>
                    <input className={inputClass} placeholder="e.g. 65 kg" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Blood Group</label>
                    <input className={inputClass} placeholder="e.g. B+" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Complexion</label>
                    <input className={inputClass} placeholder="e.g. Fair" value={complexion} onChange={(e) => setComplexion(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Mother Tongue</label>
                    <input className={inputClass} placeholder="e.g. Hindi" value={motherTongue} onChange={(e) => setMotherTongue(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className={labelClass}>Hobbies & Interests</label>
                    <input className={inputClass} placeholder="e.g. Reading, Cooking, Traveling" value={hobbies} onChange={(e) => setHobbies(e.target.value)} />
                  </div>
                </div>
              </div>
            </FadeInView>

            {/* Contact Details */}
            <FadeInView delay={0.15}>
              <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Phone className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-lg font-semibold text-foreground">Contact Details</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Email</label>
                    <input className={inputClass} type="email" placeholder="priya@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input className={inputClass} placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Address</label>
                    <textarea className={`${inputClass} min-h-[70px] resize-y`} placeholder="Full address..." value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>
              </div>
            </FadeInView>

            {/* Education & Career */}
            <FadeInView delay={0.2}>
              <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
                <div className="mb-5 flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-foreground">Education & Career</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Highest Education</label>
                    <input className={inputClass} placeholder="e.g. B.Tech" value={education} onChange={(e) => setEducation(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Occupation</label>
                    <input className={inputClass} placeholder="e.g. Software Engineer" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Annual Income</label>
                    <input className={inputClass} placeholder="e.g. ₹8,00,000" value={income} onChange={(e) => setIncome(e.target.value)} />
                  </div>
                </div>
              </div>
            </FadeInView>

            {/* Family Details */}
            <FadeInView delay={0.25}>
              <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Users className="h-5 w-5 text-amber-500" />
                  <h2 className="text-lg font-semibold text-foreground">Family Details</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Father's Name</label>
                    <input className={inputClass} placeholder="e.g. Rajesh Sharma" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Father's Occupation</label>
                    <input className={inputClass} placeholder="e.g. Businessman" value={fatherOccupation} onChange={(e) => setFatherOccupation(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Mother's Name</label>
                    <input className={inputClass} placeholder="e.g. Sunita Sharma" value={motherName} onChange={(e) => setMotherName(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Mother's Occupation</label>
                    <input className={inputClass} placeholder="e.g. Homemaker" value={motherOccupation} onChange={(e) => setMotherOccupation(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Siblings</label>
                    <input className={inputClass} placeholder="e.g. 1 Elder Brother, 1 Younger Sister" value={siblings} onChange={(e) => setSiblings(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Family Type</label>
                    <select className={inputClass} value={familyType} onChange={(e) => setFamilyType(e.target.value)}>
                      <option value="">Select</option>
                      <option value="Joint Family">Joint Family</option>
                      <option value="Nuclear Family">Nuclear Family</option>
                    </select>
                  </div>
                </div>
              </div>
            </FadeInView>

            {/* Action Buttons */}
            <FadeInView delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={generatePDF}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40"
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

export default BioDataPage;
