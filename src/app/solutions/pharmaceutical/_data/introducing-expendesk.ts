/**
 * All copy + data for the pharmaceutical "Introducing Expendesk" section
 * (`_components/IntroducingExpendeskSection.tsx`).
 *
 * The component is purely presentational — the headline, the auto-cycling
 * capability cards, and the dark closing banner + CTA all read from
 * `introducingExpendesk` below. Cards reference Lucide icons by `iconKey`,
 * mapped through a registry in the component, so no JSX lives in this data file.
 */
import type { IntroducingExpendeskContent } from "./types";

export const introducingExpendesk: IntroducingExpendeskContent = {
  badge: "Introducing Expendesk",
  heading: {
    lead: "Expense & Reimbursement Management Built for ",
    accent: "Growing Pharma Teams",
  },
  subheading: "Expendesk helps pharmaceutical companies:",

  features: [
    { id: 0, label: "Automate expense claims", iconKey: "fileCheck" },
    { id: 1, label: "Accelerate reimbursements", iconKey: "zap" },
    { id: 2, label: "Enforce policy compliance", iconKey: "shieldCheck" },
    { id: 3, label: "Eliminate approval bottlenecks", iconKey: "workflow" },
    { id: 4, label: "Gain real-time spend visibility", iconKey: "barChart" },
    { id: 5, label: "Reduce finance workload", iconKey: "trendingDown" },
    { id: 6, label: "Improve employee satisfaction", iconKey: "smile" },
  ],

  outro:
    "Instead of managing expenses through spreadsheets and emails, finance teams can manage the entire reimbursement lifecycle from a single platform.",
  cta: { label: "Book a Free Demo", href: "#book-demo" },
};
