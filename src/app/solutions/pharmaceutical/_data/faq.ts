/**
 * FAQ section copy for /solutions/pharmaceutical.
 *
 * ── This array is the single source for BOTH the visible accordion and the
 *    FAQPage structured data. ──
 *
 * `FaqSection.tsx` renders these entries on the page and builds the JSON-LD
 * from the same objects. That is deliberate and must stay that way: Google
 * requires FAQ markup to match the answer text a visitor can actually read.
 * Deriving both from one array makes a mismatch impossible; a hand-written
 * parallel block in structured data would drift the first time someone edits
 * one and not the other.
 *
 * The SEO team supplied these six as markup only, with no corresponding
 * section on the page. Marking up answers that do not appear anywhere on the
 * page is a structured-data policy violation, so the content was added to the
 * page instead of the markup being dropped — which is also the better outcome,
 * since these are real buyer questions and the page had no FAQ at all.
 *
 * ── Claims to verify with product ──
 *
 * Three answers assert capabilities that could not be confirmed anywhere in
 * this repository. They are published as the SEO team wrote them, but they are
 * claims rather than verified facts:
 *
 *   - `duplicate-claims`   — automatic duplicate detection at submission.
 *   - `territory-policies` — policy/routing configurable per territory.
 *   - `implementation`     — "live within days" (same claim as the home page).
 *
 * Also note `field-submission` says claims can be submitted "from mobile" —
 * true of the mobile web app, but there is no native iOS/Android app, and the
 * SoftwareApplication schema correctly declares `operatingSystem: "Web"`. If
 * marketing means a native app, the schema is what needs changing, not this.
 */
import type { PharmaFaqContent } from "./types";

export const faq: PharmaFaqContent = {
  badge: "FAQ",
  heading: {
    plain: "Pharma expense questions,",
    accent: "answered",
  },
  subheading:
    "The questions finance and field-force leads ask before moving off spreadsheets.",
  items: [
    {
      id: "field-submission",
      question:
        "Can medical representatives submit expense claims from the field?",
      answer:
        "Yes. Medical reps capture receipts and submit claims from mobile, web or upload while they are still in the field, rather than batching paperwork at month end.",
    },
    {
      id: "travel-claims",
      question: "How does Expendesk handle fuel, travel and lodging claims?",
      answer:
        "Fuel, travel, lodging and daily allowance claims are captured as separate categories with their own limits. Claims that exceed a limit are flagged at submission, so the rep can correct them before the claim enters the approval queue.",
    },
    {
      id: "territory-policies",
      question:
        "Can we enforce different expense policies per territory or team?",
      answer:
        "Yes. Policies and approval routing are configured by department, manager, territory or spend limit, so a field team in one region can operate under different limits from another.",
    },
    {
      id: "audit-trail",
      question: "Does Expendesk keep an audit trail of approvals?",
      answer:
        "Every claim retains its full approval trail — who submitted it, which policy checks ran, who approved it and when. Records are stored digitally so claims are audit-ready from the day they are filed.",
    },
    {
      id: "duplicate-claims",
      question: "Can Expendesk detect duplicate expense claims?",
      answer:
        "Yes. Duplicate detection runs automatically at submission, which is where high-volume field force claims most often leak cost through accidental double reimbursement.",
    },
    {
      id: "implementation",
      question: "How long does implementation take for a field force team?",
      answer:
        "Most teams are live within days rather than months. Setup is three steps: capture expenses, configure approval routing by territory, then switch on reporting. No migration project is required.",
    },
  ],
} as const;
