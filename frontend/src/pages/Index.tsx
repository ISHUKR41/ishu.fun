/**
 * Index.tsx - Home Page
 *
 * Landing page of ISHU — Indian StudentHub University.
 * 
 * PERFORMANCE FIX v2: Each below-fold section uses LazySection which defers
 * loading the JS chunk until the section is ~300px from viewport. This means
 * on initial page load, ONLY the above-fold code is downloaded + executed.
 * Below-fold sections load progressively as the user scrolls.
 *
 * Above-fold sections (Hero, Marquee, TrustedBy, Stats) are imported
 * directly (no lazy) for instant render.
 */

import { lazy } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";
import HeroSection from "@/components/home/HeroSection";
import MarqueeSection from "@/components/home/MarqueeSection";
import TrustedBySection from "@/components/home/TrustedBySection";
import StatsSection from "@/components/home/StatsSection";
import { WebsiteSchema, OrganizationSchema, HomeFAQSchema, SiteLinksSearchBoxSchema } from "@/components/seo/JsonLd";
import LazySection from "@/components/performance/LazySection";

const ProductShowcase         = lazy(() => import("@/components/home/ProductShowcase"));
const PlatformOverview        = lazy(() => import("@/components/home/PlatformOverview"));
const HowItWorksSection       = lazy(() => import("@/components/home/HowItWorksSection"));
const ImmersiveExperienceSection = lazy(() => import("@/components/home/ImmersiveExperienceSection"));
const InnovationMatrixSection = lazy(() => import("@/components/home/InnovationMatrixSection"));
const FeaturesSection         = lazy(() => import("@/components/home/FeaturesSection"));
const ExamCategoriesSection   = lazy(() => import("@/components/home/ExamCategoriesSection"));
const ResultsPreview          = lazy(() => import("@/components/home/ResultsPreview"));
const StatesMapSection        = lazy(() => import("@/components/home/StatesMapSection"));
const ToolsPreview            = lazy(() => import("@/components/home/ToolsPreview"));
const NewsPreview             = lazy(() => import("@/components/home/NewsPreview"));
const WhyChooseUs             = lazy(() => import("@/components/home/WhyChooseUs"));
const TechStackSection        = lazy(() => import("@/components/home/TechStackSection"));
const WhatsAppCTA             = lazy(() => import("@/components/home/WhatsAppCTA"));
const BlogPreview             = lazy(() => import("@/components/home/BlogPreview"));
const TestimonialsSection     = lazy(() => import("@/components/home/TestimonialsSection"));
const AchievementsSection     = lazy(() => import("@/components/home/AchievementsSection"));
const LivePulseSection        = lazy(() => import("@/components/home/LivePulseSection"));
const CallToActionSection     = lazy(() => import("@/components/home/CallToActionSection"));
const FAQSection              = lazy(() => import("@/components/home/FAQSection"));

const Index = () => {
  return (
    <Layout>
      <SEOHead {...SEO_DATA.home} />
      <WebsiteSchema />
      <OrganizationSchema />
      <HomeFAQSchema />
      <SiteLinksSearchBoxSchema />

      {/* ── Above-fold: rendered immediately ── */}
      <HeroSection />
      <MarqueeSection />
      <TrustedBySection />
      <StatsSection />

      {/* ── Below-fold: each section loads only when near viewport ── */}
      <LazySection><ProductShowcase /></LazySection>
      <LazySection><PlatformOverview /></LazySection>
      <LazySection><HowItWorksSection /></LazySection>
      <LazySection><ImmersiveExperienceSection /></LazySection>
      <LazySection><InnovationMatrixSection /></LazySection>
      <LazySection><FeaturesSection /></LazySection>
      <LazySection><ExamCategoriesSection /></LazySection>
      <LazySection><ResultsPreview /></LazySection>
      <LazySection><StatesMapSection /></LazySection>
      <LazySection><ToolsPreview /></LazySection>
      <LazySection><NewsPreview /></LazySection>
      <LazySection><WhyChooseUs /></LazySection>
      <LazySection><TechStackSection /></LazySection>
      <LazySection><WhatsAppCTA /></LazySection>
      <LazySection><BlogPreview /></LazySection>
      <LazySection><TestimonialsSection /></LazySection>
      <LazySection><AchievementsSection /></LazySection>
      <LazySection><LivePulseSection /></LazySection>
      <LazySection><CallToActionSection /></LazySection>
      <LazySection><FAQSection /></LazySection>
    </Layout>
  );
};

export default Index;
