/**
 * /solutions/pharmaceutical — static, SEO-focused industry landing page.
 *
 * One of three sibling pages under `solutions/` (manufacturing, pharmaceutical,
 * digital-agencies), linked from the Navbar "Solutions" dropdown. This page is
 * being built out section-by-section: each section is a component in
 * `./_components/`, composed here, with all copy in `./_data/content.ts`.
 *
 * `#demo` CTA anchors are placeholders — there is no demo section yet.
 */
import type { Metadata } from "next";
import HeroSection from "./_components/HeroSection";

export const metadata: Metadata = {
  title: "Expense Management for Pharmaceutical Industries | Expendesk",
  description:
    "Streamline compliance and audit-ready expense reporting for pharmaceutical companies with Expendesk.",
};

export default function PharmaceuticalSolutionPage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />

      {/*
        Upcoming sections — build each one in ./_components/ and compose it
        here in order. Add its copy under a new key in ./_data/content.ts.

        <ProblemSection />
        <SelfAssessmentSection />
        <ChecklistIntroSection />
        <BridgeSection />
        <IntroducingExpendeskSection />
        <ChecklistContentsSection />
        <DualCtaSection />
        <SocialProofSection />
        <FinalCtaSection />
      */}
    </main>
  );
}
