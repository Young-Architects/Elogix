/**
 * Shared content types for the /legal/* pages.
 *
 * Six legal routes are linked from the site footer — terms, privacy, cookies,
 * acceptable use, disclaimer and copyright — and every one is the same shape: a
 * titled document of headed sections containing prose. Typing that shape once
 * means each document is a data file, with no new layout code and no chance of
 * six legal pages drifting into six different designs.
 *
 * Copy lives in `<route>/_data/content.ts`; `_components/LegalPage.tsx` renders
 * it. No legal text is ever hardcoded in a component.
 */

/**
 * A run of text inside a paragraph. Plain strings render as text; objects
 * render as a link, as bold, or as both.
 *
 * Paragraphs are modelled as an array of runs rather than a single string with
 * markup in it, because legal copy genuinely does contain mid-sentence links
 * ("…see our Privacy Policy") and mid-sentence emphasis ("**Right to
 * correction and erasure:** to have inaccurate…"). The alternatives are both
 * worse: `dangerouslySetInnerHTML` on text pasted in from a document, or a
 * bespoke mini-parser. This keeps the data plain, serialisable and impossible
 * to inject into.
 */
export type LegalRun =
  | string
  | {
      text: string;
      /** Omit for a non-link run that is only emphasised. */
      href?: string;
      /** External links get `target="_blank"` + `rel="noopener noreferrer"`. */
      external?: boolean;
      /** Renders the run in semibold. Used for defined terms and list leads. */
      bold?: boolean;
    };

/** One row of the cookie-categories table. Cells are plain strings. */
export type LegalTableRow = readonly string[];

/** One term/description pair, e.g. the Grievance Officer's details. */
export interface LegalDefinition {
  term: string;
  description: LegalRun[];
}

/** One renderable element within a section. */
export type LegalBlock =
  /** A paragraph. */
  | { type: "p"; content: LegalRun[] }
  /** A sub-heading inside a section — renders as an `h3`. */
  | { type: "h3"; text: string }
  /** A bulleted list. */
  | { type: "list"; items: LegalRun[][] }
  /**
   * A data table. Only the Cookie Policy uses one. It scrolls horizontally on
   * narrow screens rather than forcing the page to, and collapses to stacked
   * cards below `sm` so it stays readable on a phone.
   */
  | { type: "table"; caption?: string; headers: readonly string[]; rows: readonly LegalTableRow[] }
  /** A term/description list, rendered as a `dl`. */
  | { type: "definitions"; items: LegalDefinition[] };

/** A top-level section of the document — renders an `h2` plus its blocks. */
export interface LegalSection {
  /** Stable slug: used as the heading's DOM id so sections are linkable. */
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

/** Contact details rendered in the closing panel. */
export interface LegalContact {
  /**
   * Heading for the closing panel. Defaults to "Contacting us"; the Copyright
   * and DMCA Policy closes with "Reporting copyright infringement" instead, and
   * a legal document's own section headings are not ours to rename.
   */
  heading?: string;
  intro: string;
  /** "Expendesk, a product of Elogix Software Private Limited". */
  attribution: string;
  /** Site-relative path to the contact page. */
  pageHref: string;
  pageLabel: string;
  email: string;
  /** Postal address, one line per array entry. */
  address: string[];
  /**
   * Optional closing paragraph rendered after the contact details. Only the
   * Privacy Policy has one ("We will attempt to resolve complaints and
   * disputes…"), and it sits after the address in the source document.
   */
  outro?: string;
}

/** A complete legal document. */
export interface LegalDocument {
  /** Small pill above the title. */
  eyebrow: string;
  title: string;
  /**
   * ISO date (YYYY-MM-DD) this document was last revised.
   *
   * Kept as ISO rather than a display string so it can drive both the visible
   * "Last updated" line and the `<time dateTime>` attribute without a second
   * source of truth going stale.
   */
  lastUpdated: string;
  /** Opening paragraphs, before the first headed section. */
  intro: LegalBlock[];
  sections: LegalSection[];
  contact: LegalContact;
}
