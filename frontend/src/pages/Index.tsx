/**
 * Index.tsx - Home Page
 * 
 * This is the landing page of ISHU — Indian StudentHub University.
 * It combines multiple sections to showcase all features:
 * 
 * Sections (in order):
 * 1. HeroSection - Main banner with animated text, particles, 3D scene
 * 2. TrustedBySection - Logos/names of organizations that trust us
 * 3. StatsSection - Key numbers (users, tools, states covered)
 * 4. FeaturesSection - Main platform features with icons
 * 5. ExamCategoriesSection - Grid of exam categories (UPSC, SSC, etc.)
 * 6. ResultsPreview - Preview of latest government exam results
 * 7. StatesMapSection - Interactive India map showing state coverage
 * 8. ToolsPreview - Showcase of popular PDF tools
 * 9. NewsPreview - Latest news articles preview
 * 10. WhyChooseUs - Reasons to use the platform
 * 11. WhatsAppCTA - Call-to-action for WhatsApp notifications
 * 12. BlogPreview - Latest blog posts preview
 * 13. TestimonialsSection - User reviews and testimonials
 * 14. FAQSection - Frequently asked questions with accordion
 * 
 * SEO: Includes WebsiteSchema and OrganizationSchema for Google
 */

import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
// Above-fold sections — loaded eagerly for fast initial paint
import HeroSection from "@/components/home/HeroSection";
import TrustedBySection from "@/components/home/TrustedBySection";
import StatsSection from "@/components/home/StatsSection";
import { WebsiteSchema, OrganizationSchema } from "@/components/seo/JsonLd";

// Below-fold sections — lazy loaded for better performance
const PlatformOverview = lazy(() => import("@/components/home/PlatformOverview"));
const HowItWorksSection = lazy(() => import("@/components/home/HowItWorksSection"));
const ImmersiveExperienceSection = lazy(() => import("@/components/home/ImmersiveExperienceSection"));
const InnovationMatrixSection = lazy(() => import("@/components/home/InnovationMatrixSection"));
const FeaturesSection = lazy(() => import("@/components/home/FeaturesSection"));
const ExamCategoriesSection = lazy(() => import("@/components/home/ExamCategoriesSection"));
const ResultsPreview = lazy(() => import("@/components/home/ResultsPreview"));
const StatesMapSection = lazy(() => import("@/components/home/StatesMapSection"));
const ToolsPreview = lazy(() => import("@/components/home/ToolsPreview"));
const NewsPreview = lazy(() => import("@/components/home/NewsPreview"));
const WhyChooseUs = lazy(() => import("@/components/home/WhyChooseUs"));
const TechStackSection = lazy(() => import("@/components/home/TechStackSection"));
const WhatsAppCTA = lazy(() => import("@/components/home/WhatsAppCTA"));
const BlogPreview = lazy(() => import("@/components/home/BlogPreview"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const AchievementsSection = lazy(() => import("@/components/home/AchievementsSection"));
const LivePulseSection = lazy(() => import("@/components/home/LivePulseSection"));
const CallToActionSection = lazy(() => import("@/components/home/CallToActionSection"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));

// Minimal fallback to prevent layout shift while sections load
const SectionFallback = () => <div style={{ minHeight: "200px" }} aria-hidden="true" />;

const Index = () => {
  return (
    <Layout>
      {/* SEO Schemas - invisible structured data for search engines */}
      <WebsiteSchema />
      <OrganizationSchema />
      
      {/* Above-fold sections rendered immediately */}
      <HeroSection />
      <TrustedBySection />
      <StatsSection />

      {/* All home page sections lazy loaded below the fold */}
      <Suspense fallback={<SectionFallback />}>
        <PlatformOverview />
        <HowItWorksSection />
        <ImmersiveExperienceSection />
        <InnovationMatrixSection />
        <FeaturesSection />
        <ExamCategoriesSection />
        <ResultsPreview />
        <StatesMapSection />
        <ToolsPreview />
        <NewsPreview />
        <WhyChooseUs />
        <TechStackSection />
        <WhatsAppCTA />
        <BlogPreview />
        <TestimonialsSection />
        <AchievementsSection />
        <LivePulseSection />
        <CallToActionSection />
        <FAQSection />
      </Suspense>
    </Layout>
  );
};

export default Index;
