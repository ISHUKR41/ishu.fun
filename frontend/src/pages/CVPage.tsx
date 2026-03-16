/**
 * CVPage.tsx - CV Hub Landing Page
 * 
 * Main CV page with two sections:
 * 1. Resume - Professional resume builder
 * 2. Bio-Data - Personal bio-data creator
 * 
 * Each section links to its own dedicated page.
 */
import Layout from "@/components/layout/Layout";
import FadeInView from "@/components/animations/FadeInView";
import GradientMesh from "@/components/animations/GradientMesh";
import MorphingBlob from "@/components/animations/MorphingBlob";
import { motion } from "framer-motion";
import { FileText, UserCircle, ArrowRight, Sparkles, Download, Shield, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BreadcrumbSchema } from "@/components/seo/JsonLd";

const cvSections = [
  {
    title: "Resume",
    description: "Create a professional resume that stands out. Choose from modern templates, add your experience, skills, and education — download as PDF instantly.",
    icon: FileText,
    href: "/cv/resume",
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/10 to-cyan-500/10",
    borderColor: "border-blue-500/20",
    features: ["Professional Templates", "ATS-Friendly Format", "PDF Download", "Easy Editing"],
  },
  {
    title: "Bio-Data",
    description: "Generate a clean and well-formatted bio-data for personal, matrimonial, or official purposes. Fill in your details and get a polished document ready to share.",
    icon: UserCircle,
    href: "/cv/bio-data",
    color: "from-violet-500 to-purple-500",
    bgColor: "from-violet-500/10 to-purple-500/10",
    borderColor: "border-violet-500/20",
    features: ["Personal Details", "Family Information", "Photo Upload", "Print Ready"],
  },
];

const stats = [
  { label: "Templates", value: "10+", icon: Sparkles },
  { label: "Downloads", value: "Free", icon: Download },
  { label: "Privacy", value: "100%", icon: Shield },
  { label: "Instant", value: "Fast", icon: Zap },
];

const CVPage = () => {
  return (
    <Layout>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://ishu.dev/" },
        { name: "CV", url: "https://ishu.dev/cv" },
      ]} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <GradientMesh className="opacity-30" />
        <MorphingBlob className="absolute -top-40 -right-40 h-[500px] w-[500px] opacity-20" color="blue" />
        <MorphingBlob className="absolute -bottom-40 -left-40 h-[400px] w-[400px] opacity-15" color="violet" />

        <div className="container relative z-10">
          <FadeInView>
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg shadow-blue-500/25"
              >
                <FileText className="h-8 w-8 text-white" />
              </motion.div>

              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                <span className="text-gradient">CV</span> Builder
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Create professional Resumes and Bio-Data in minutes. 
                Choose a section below to get started — completely free, no sign-up required.
              </p>
            </div>
          </FadeInView>

          {/* Stats Row */}
          <FadeInView delay={0.2}>
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </FadeInView>
        </div>
      </section>

      {/* CV Sections */}
      <section className="pb-20">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {cvSections.map((section, index) => (
              <FadeInView key={section.title} delay={index * 0.15}>
                <Link to={section.href} className="group block">
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`relative overflow-hidden rounded-2xl border ${section.borderColor} bg-card/60 p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5`}
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${section.bgColor} opacity-50`} />

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${section.color} shadow-lg`}>
                        <section.icon className="h-7 w-7 text-white" />
                      </div>

                      {/* Title */}
                      <h2 className="mb-3 text-2xl font-bold text-foreground">
                        {section.title}
                      </h2>

                      {/* Description */}
                      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                        {section.description}
                      </p>

                      {/* Features */}
                      <div className="mb-6 grid grid-cols-2 gap-2">
                        {section.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className={`inline-flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
                        Get Started
                        <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CVPage;
