/**
 * /book-a-demo — step 1 of the demo funnel.
 *
 * Every "Book a Demo" CTA on the site enters here. See ./_data/content.ts for
 * the funnel map and the one piece of configuration that lives in GHL rather
 * than in this repo (the post-submit redirect).
 *
 * Indexable: it is a real landing page with substantive copy, and it is the
 * page a "book a demo expendesk" search should find. The thank-you page that
 * follows it is noindex — see that route.
 */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import DemoFormSection from "./_components/DemoFormSection";

export const metadata: Metadata = pageMetadata({
  path: "/book-a-demo",
  title: "Book a Demo",
  description:
    "Book a personalized 30-minute Expendesk demo. See how to automate expense claims, approvals and reimbursements for your finance team. No obligation.",
  socialDescription:
    "Book a personalized 30-minute Expendesk demo. A product specialist walks your team through automating expense claims, approval workflows and reimbursements, and shows where your current process is losing time and money. No obligation, no credit card.",
});

export default function BookADemoPage() {
  return (
    <main className="min-h-screen bg-white">
      <DemoFormSection />
    </main>
  );
}
