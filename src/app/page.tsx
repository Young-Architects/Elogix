import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import LeadMagnetSection from "@/components/sections/LeadMagnetSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import WhyExpendesk from "@/components/sections/Whyexpendesk";
import Whyexpendesk from "@/components/sections/Whyexpendesk";

// Below-fold sections: lazy loaded to reduce initial JS bundle
// They render a minimal placeholder until the user scrolls near them
const ProblemSection = dynamic(
  () => import("@/components/sections/ProblemSection"),
  { loading: () => <div className="min-h-[200px]" />, ssr: true }
);

const SolutionSection = dynamic(
  () => import("@/components/sections/SolutionSection"),
  { loading: () => <div className="min-h-[200px]" />, ssr: true }
);

const BenefitsSection = dynamic(
  () => import("@/components/sections/BenefitsSection"),
  { loading: () => <div className="min-h-[200px]" />, ssr: true }
);

const FeaturesVideo = dynamic(
  () => import("@/components/sections/FeaturesVideo"),
  { loading: () => <div className="min-h-[200px]" />, ssr: true }
);

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <FeaturesVideo />
      <LeadMagnetSection />
      <TestimonialsSection />
      <Whyexpendesk/>
    </main>
  );
}