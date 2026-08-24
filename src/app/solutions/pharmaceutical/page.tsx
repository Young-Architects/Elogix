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
import { pageMetadata } from "@/lib/page-metadata";
import {
  serviceStructuredData,
  breadcrumbStructuredData,
  jsonLd,
} from "@/lib/structured-data";
import HeroSection from "./_components/HeroSection";
import ProblemSection from "./_components/ProblemSection";
import SelfAssessmentSection from "./_components/SelfAssessmentSection";
import ChecklistIntroSection from "./_components/ChecklistIntroSection";
import BridgeSection from "./_components/BridgeSection";
import IntroducingExpendeskSection from "./_components/IntroducingExpendeskSection";
import ChecklistContentsSection from "./_components/ChecklistContentsSection";
import Choosenextstepsection from "./_components/Choosenextstepsection";
import FinalCtaSection from "./_components/FinalCtaSection";
import FaqSection from "./_components/FaqSection";

/**
 * Title and description follow the SEO team's brief — lead with the keyword
 * head, and cut the description under the ~155 characters that actually render
 * in a result (the previous one was 172 and was being truncated mid-sentence).
 *
 * One deviation from the brief, and it is not cosmetic. It asked for
 * `<title>Pharma Expense Management Software | Expendesk</title>`. Setting that
 * string here would render:
 *
 *     Pharma Expense Management Software | Expendesk — Expendesk
 *
 * because the root layout's `template: "%s — Expendesk"` appends the brand to
 * every child route's title. So the brand is left out of the string and the
 * template supplies it, producing
 * "Pharma Expense Management Software — Expendesk" (45 chars) — the brief's
 * intent, one brand mention, and the same separator as every other page.
 *
 * (The home page is the one route where the brand *must* be written into the
 * string, because `title.template` does not apply to the root segment. See
 * app/page.tsx.)
 *
 * `pageMetadata` derives og:url from `path`, so it always matches the
 * canonical — the sitewide defect the brief flagged, fixed in Round 4.
 */
export const metadata: Metadata = pageMetadata({
  path: "/solutions/pharmaceutical",
  title: "Pharma Expense Management Software",
  description:
    "Expense management software for pharmaceutical companies. Automate medical rep claims, enforce policy compliance and keep every expense audit-ready.",
});

/**
 * `Service` + `BreadcrumbList` for this route.
 *
 * The Service node's `provider` points at the Organization `@id` the root
 * layout emits, so this page's offering is attached to the same entity as the
 * rest of the site rather than describing an unconnected company.
 *
 * Every capability listed below is stated somewhere on the page — the offer
 * catalogue is not a wish list. All `Offer` nodes are deliberately price-free;
 * see the note in lib/structured-data.ts.
 */
const serviceSchema = serviceStructuredData({
  path: "/solutions/pharmaceutical",
  name: "Expense Management Software for Pharmaceutical Companies",
  serviceType: "Expense Management Software",
  description:
    "Expense management and reimbursement software for pharmaceutical companies: medical rep claims, field force travel, policy compliance and audit-ready records.",
  audience: "Pharmaceutical companies",
  capabilities: [
    "Medical rep expense capture",
    "Fuel, travel and lodging claims",
    "Automated policy compliance",
    "Audit-ready expense records",
  ],
});

const breadcrumbSchema = breadcrumbStructuredData([
  { name: "Solutions", path: "/solutions" },
  { name: "Pharmaceutical", path: "/solutions/pharmaceutical" },
]);

export default function PharmaceuticalSolutionPage() {
  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }}
      />
      <HeroSection />
      <ProblemSection />
      <SelfAssessmentSection />
      <ChecklistIntroSection />
      <BridgeSection />
      <IntroducingExpendeskSection />
      <ChecklistContentsSection />
      <Choosenextstepsection />
      {/* FAQ sits before the closing CTA: it answers the last objections a
          reader has, and its markup needs the answers rendered on the page. */}
      <FaqSection />
      <FinalCtaSection />
    </main>
  );
}
