/**
 * Index.tsx - Home Page
 *
 * Landing page of ISHU — Indian StudentHub University.
 * Sections:
 *  1.  HeroSection           - Main banner (Apple/Tesla/Vercel style)
 *  2.  MarqueeSection        - Infinite scroll marquee of exams + tools
 *  3.  TrustedBySection      - Social proof logos / badges
 *  4.  StatsSection          - Key numbers (users, tools, states, news)
 *  5.  PlatformOverview      - General platform intro
 *  6.  HowItWorksSection     - 4-step guide
 *  7.  ImmersiveExperienceSection
 *  8.  InnovationMatrixSection
 *  9.  FeaturesSection       - 6-card features grid
 *  10. ExamCategoriesSection - Exam category links
 *  11. ResultsPreview        - Latest govt exam results
 *  12. StatesMapSection      - India map
 *  13. ToolsPreview          - Popular PDF tools
 *  14. NewsPreview           - Latest news
 *  15. WhyChooseUs
 *  16. TechStackSection
 *  17. WhatsAppCTA
 *  18. BlogPreview
 *  19. TestimonialsSection
 *  20. AchievementsSection
 *  21. LivePulseSection
 *  22. CallToActionSection
 *  23. FAQSection
 *
 * SEO: WebsiteSchema, OrganizationSchema, HomeFAQSchema, SiteLinksSearchBoxSchema
 */

import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead, { SEO_DATA } from "@/components/seo/SEOHead";
import HeroSection from "@/components/home/HeroSection";
import MarqueeSection from "@/components/home/MarqueeSection";
import TrustedBySection from "@/components/home/TrustedBySection";
import StatsSection from "@/components/home/StatsSection";
import { WebsiteSchema, OrganizationSchema, HomeFAQSchema, SiteLinksSearchBoxSchema } from "@/components/seo/JsonLd";

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

const SectionFallback = () => <div aria-hidden="true" />;

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

      {/* ── Below-fold: lazy loaded ── */}
      <Suspense fallback={<SectionFallback />}>
        <ProductShowcase />
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
