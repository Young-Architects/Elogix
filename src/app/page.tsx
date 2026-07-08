/**
 * Home page — composes the marketing landing page from independent sections.
 *
 * Rendering strategy (performance):
 *  - Above-the-fold sections (Hero, LeadMagnet, Testimonials, WhyExpendesk) are
 *    imported statically so they are in the initial bundle / first paint.
 *  - Below-the-fold sections are loaded with `next/dynamic` so their client JS
 *    is code-split into separate chunks. `ssr: true` keeps them server-rendered
 *    for SEO; the `loading` placeholder only reserves space during hydration.
 *
 * Section order here is the visual order on the page. Each section is fully
 * self-contained and reads its copy from `src/data/sections/<name>.json`.
 */
import dynamic from "next/dynamic";
import HeroSection from "@/components/sections/HeroSection";
import LeadMagnetSection from "@/components/sections/LeadMagnetSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import WhyExpendesk from "@/components/sections/WhyExpendesk";

// Below-fold sections: lazy loaded to reduce initial JS bundle
// They render a minimal placeholder until the user scrolls near them
const ProblemSection = dynamic(
  () => import("@/components/sections/ProblemSection"),
  { loading: () => <div className="min-h-50" />, ssr: true }
);

const SolutionSection = dynamic(
  () => import("@/components/sections/SolutionSection"),
  { loading: () => <div className="min-h-50" />, ssr: true }
);

const BenefitsSection = dynamic(
  () => import("@/components/sections/BenefitsSection"),
  { loading: () => <div className="min-h-50" />, ssr: true }
);

const FeaturesVideo = dynamic(
  () => import("@/components/sections/FeaturesVideo"),
  { loading: () => <div className="min-h-50" />, ssr: true }
);

const HowItWorksSection = dynamic(
  () => import("@/components/sections/HowItWorksSection"),
  { loading: () => <div className="min-h-50" />, ssr: true }
);

const ComparisonSection = dynamic(
  () => import("@/components/sections/ComparisonSection"),
  { loading: () => <div className="min-h-50" />, ssr: true }
);

const FaqSection = dynamic(
  () => import("@/components/sections/FaqSection"),
  { loading: () => <div className="min-h-50" />, ssr: true }
);

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <FeaturesVideo />
      <HowItWorksSection />
      <LeadMagnetSection />
      <ComparisonSection />
      <TestimonialsSection />
      <FaqSection />
      <WhyExpendesk />
    </main>
  );
}