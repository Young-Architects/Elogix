/**
 * /solutions/pharmaceutical — static, SEO-focused industry landing page.
 *
 * One of three sibling pages under `solutions/` (manufacturing, pharmaceutical,
 * digital-agencies), linked from the Navbar "Solutions" dropdown. This page is
 * being built out section-by-section: each section is a component in
 * `./_components/`, composed here, with all copy in `./_data/` (one file per
 * section, re-exported from `./_data/index.ts`).
 *
 * Demo / "Schedule" CTAs point at `/contact-us` (the demo booking calendar).
 */
import type { Metadata } from "next";
import HeroSection from "./_components/HeroSection";
import ProblemSection from "./_components/ProblemSection";
import SelfAssessmentSection from "./_components/SelfAssessmentSection";
import ChecklistIntroSection from "./_components/ChecklistIntroSection";
import BridgeSection from "./_components/BridgeSection";
import IntroducingExpendeskSection from "./_components/IntroducingExpendeskSection";
import ChecklistContentsSection from "./_components/ChecklistContentsSection";
import Choosenextstepsection from "./_components/Choosenextstepsection";
import FinalCtaSection from "./_components/FinalCtaSection";

export const metadata: Metadata = {
  title: "Expense Management for Pharmaceutical Industries | Expendesk",
  description:
    "Streamline compliance and audit-ready expense reporting for pharmaceutical companies with Expendesk.",
};

export default function PharmaceuticalSolutionPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <ProblemSection />
      <SelfAssessmentSection />
      <ChecklistIntroSection />
      <BridgeSection />
      <IntroducingExpendeskSection />
      <ChecklistContentsSection />
      <Choosenextstepsection />
      <FinalCtaSection />
    </main>
  );
}
