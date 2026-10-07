/**
 * /book-a-demo/thank-you — step 2 of the demo funnel.
 *
 * Reached by the GHL form's post-submit redirect, which is configured inside
 * GHL rather than here — see ../_data/content.ts.
 *
 * ── noindex, deliberately ──
 *
 * This is the one page in the funnel that must stay out of search. A thank-you
 * page ranking means people arrive at it without ever filling in the form:
 * they get a confirmation for something that did not happen, and every
 * conversion metric keyed on this URL is inflated by visitors who never
 * converted. `follow` is kept so the links out of it still pass.
 */
import type { Metadata } from "next";
import ThankYouSection from "./_components/ThankYouSection";

export const metadata: Metadata = {
  title: "Thank You",
  description:
    "Your Expendesk demo request has been received. Download the Expense Management Maturity Assessment or book a time with our team.",
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-white">
      <ThankYouSection />
    </main>
  );
}
