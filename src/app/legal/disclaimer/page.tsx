/**
 * /legal/disclaimer — Disclaimer.
 *
 * Policy text lives in `./_data/content.ts` (transcribed from the company's
 * source PDF, last updated 21 September 2026). Entity details and
 * cross-document links come from `../_data/company.ts` — never hardcode the
 * registered address or another policy's path.
 *
 * Indexable, deliberately. Legal pages are sometimes reflexively `noindex`-ed
 * as "not marketing content". They should not be here: published terms, a
 * privacy policy and a cookie policy are among the cheapest trust signals a
 * young domain has, and they are what a cautious visitor checks before handing
 * a finance tool their company's spend data. They sit at low priority in the
 * sitemap rather than being hidden from it.
 */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import LegalDocumentPage from "../_components/LegalDocumentPage";
import { disclaimer } from "./_data/content";

const DESCRIPTION =
  "Disclosures on the Expendesk website: product information and performance figures, AI-generated content, testimonials, and why nothing here is tax or legal advice.";

export const metadata: Metadata = pageMetadata({
  path: "/legal/disclaimer",
  title: "Disclaimer",
  description: DESCRIPTION,
});

export default function DisclaimerPage() {
  return (
    <LegalDocumentPage
      doc={disclaimer}
      path="/legal/disclaimer"
      description={DESCRIPTION}
    />
  );
}
