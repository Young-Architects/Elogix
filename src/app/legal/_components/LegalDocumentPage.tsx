/**
 * LegalDocumentPage — renders a legal document plus its structured data.
 *
 * Each /legal/* route still needs its own `page.tsx` (Next requires the
 * `metadata` export and default export to live in the route file), but
 * everything below that is identical across all six: a `WebPage` node, a
 * `BreadcrumbList`, and the document itself. Centralising it here means six
 * route files of a dozen lines rather than six copies of the same JSON-LD
 * plumbing drifting apart.
 */
import {
  webPageStructuredData,
  breadcrumbStructuredData,
  jsonLd,
} from "@/lib/structured-data";
import LegalPage from "./LegalPage";
import type { LegalDocument } from "../_data/types";

export default function LegalDocumentPage({
  doc,
  path,
  description,
}: {
  doc: LegalDocument;
  /** Site-relative path, e.g. "/legal/privacy". Must match the route. */
  path: string;
  /** Used for the WebPage node's description; mirrors the page metadata. */
  description: string;
}) {
  const webPageSchema = webPageStructuredData({
    path,
    name: doc.title,
    description,
    // `about: null` — these pages are about their own subject matter, not about
    // the organisation. Pointing `about` at the Organization node (the default)
    // would tell Google a cookie policy is a page about the company, which is
    // the job of /about.
    about: null,
  });

  /**
   * Breadcrumb runs Home → <document>, with no intermediate "Legal" crumb.
   * There is no `/legal` index route, and a BreadcrumbList item pointing at a
   * URL that 404s is worse than a shorter trail.
   */
  const breadcrumbSchema = breadcrumbStructuredData([
    { name: doc.title, path },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }}
      />
      <LegalPage doc={doc} />
    </>
  );
}
