/**
 * /pricing — the plans & pricing page, built from the GTM sheet copy.
 *
 * Sections (top → bottom):
 *   - PricingHeroSection      → headline + Book-a-Free-Demo CTA
 *   - PricingPlansSection     → Growth / Business / Enterprise cards
 *   - PricingFaqSection       → "Have Questions? Get some Insights" accordion
 *   - PricingFinalCtaSection  → "Start with the essentials. Scale as you grow."
 *
 * Sections live in `./_components`, copy in `./_data/content.ts` — same
 * structure as the contact + solutions pages. Plan prices/features are
 * placeholders (flagged in the data file) until the GTM numbers are final.
 * Every "Book a Free Demo" CTA points at /contact-us (the demo booking calendar).
 */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import PricingHeroSection from "./_components/PricingHeroSection";
import PricingPlansSection from "./_components/PricingPlansSection";
import PricingFaqSection from "./_components/PricingFaqSection";
import PricingFinalCtaSection from "./_components/PricingFinalCtaSection";

// `pageMetadata` derives og:url from `path`, so it always matches the
// canonical. Declaring `alternates` alone left og:url inheriting the root
// layout's home-page URL — see lib/page-metadata.ts.
export const metadata: Metadata = pageMetadata({
  path: "/pricing",
  title: "Pricing",
  description:
    "Flexible Expendesk plans for growing SMEs and mid-market businesses — start with the essentials and scale as you grow. Book a free demo to find your fit.",
});

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <PricingHeroSection />
      <PricingPlansSection />
      <PricingFaqSection />
      <PricingFinalCtaSection />
    </main>
  );
}
