/**
 * All copy + data for the pharmaceutical Checklist-Intro (lead magnet) section
 * (`_components/ChecklistIntroSection.tsx`).
 *
 * The component is purely presentational — headings, audience chips, the
 * document-mock preview, and the CTA all read from the `checklistIntro` object
 * below. Items reference icons by `iconKey`; the component maps those keys onto
 * SVG components through a local registry, so no JSX lives in this data file.
 *
 * NOTE: `cta.href` points at a demo PDF in `/public/downloads/` — drop the real
 * designed checklist there and swap the path before launch.
 */
import type { ChecklistIntroContent } from "./types";

export const checklistIntro: ChecklistIntroContent = {
  badge: "INTRODUCING THE CHECKLIST",
  heading: {
    lead: "A Practical ",
    accent: "25-Point Audit Framework",
    tail: " for Pharmaceutical Companies",
  },

  builtForLabel: "Built specifically for",
  roles: [
    { label: "CFOs", iconKey: "briefcase" },
    { label: "Finance Heads", iconKey: "chartBar" },
    { label: "Commercial Teams", iconKey: "handshake" },
    { label: "Sales Operations Leaders", iconKey: "target" },
    { label: "HR & Administration Teams", iconKey: "users" },
  ],

  closing: {
    emphasis: "In less than 15 minutes, ",
    body: "you'll know exactly where your organization stands.",
  },

  cta: {
    label: "Download the Checklist",
    href: "/downloads/pharma-expense-audit-checklist-demo.pdf",
    downloadName: "Pharma-Expense-Audit-Checklist.pdf",
    subtext: "Instant PDF · No spam · Built for pharma finance teams",
  },

  document: {
    ribbon: "100% Free",
    fileName: "Pharma-Expense-Audit-Checklist.pdf",
    pointsBadge: "25 Points",
    evaluates: [
      { label: "Reimbursement Processes", iconKey: "wallet" },
      { label: "Expense Policies", iconKey: "document" },
      { label: "Approval Workflows", iconKey: "workflow" },
      { label: "Fraud Controls", iconKey: "shieldAlert" },
      { label: "Reporting Systems", iconKey: "chartLine" },
      { label: "Compliance Readiness", iconKey: "shieldCheck" },
      { label: "Employee Experience", iconKey: "smile" },
    ],
    footer: { time: "Under 15 minutes", categories: "7 categories" },
    floatingBadge: { title: "Instant clarity", subtitle: "Know where you stand" },
  },
};
