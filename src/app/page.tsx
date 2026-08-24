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
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { pageMetadata } from "@/lib/page-metadata";
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

/**
 * Home page metadata.
 *
 * The canonical declaration matters more than usual here: an identical copy of
 * this site is also served on the platform's *.vercel.app deploy URL. A
 * self-referencing canonical is what tells Google that every copy it
 * encounters should consolidate onto the real domain. `pageMetadata` derives
 * `og:url` from the same `path`, so the two can never disagree.
 *
 * ── On the title, and why the brand is written out in full here ──
 *
 * The brand suffix is spelled out literally instead of relying on the root
 * layout's `template: "%s — Expendesk"`. That template does **not** apply to
 * this file.
 *
 * Next only applies `title.template` to titles declared in *child* route
 * segments. `app/page.tsx` is the page for the root segment — the same segment
 * `app/layout.tsx` defines the template in — so a bare title here renders
 * verbatim, with no suffix. It is `title.default` that normally covers this
 * route, and setting an explicit `title` replaces it.
 *
 * That is easy to miss and expensive to get wrong: it silently dropped the
 * word "Expendesk" from the home page `<title>` entirely, on a site whose
 * central problem is that Google does not recognise the brand name. Every
 * other route in the app gets the suffix automatically; this one, and only
 * this one, must carry it in the string.
 *
 * The ordering is the deliberate trade-off: category first ("Expense
 * Management Software…") is stronger for the generic query, brand first is
 * marginally stronger for "expendesk". Brand recognition is carried by
 * `/about`, the entity JSON-LD, and this suffix.
 */
export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "Expense Management Software for Growing Businesses — Expendesk",
  // The social title omits the suffix: OpenGraph cards render `og:site_name`
  // ("Expendesk") next to the title already, so repeating it reads as a stutter.
  socialTitle: "Expense Management Software for Growing Businesses",
  description:
    "Automate expense tracking, approvals and employee reimbursements in one platform. Real-time spend visibility for SME and mid-market finance teams.",
});

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
      {/* <ComparisonSection /> */}
      <TestimonialsSection />
      <WhyExpendesk />
      <FaqSection />
    </main>
  );
}