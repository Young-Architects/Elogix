/**
 * Content for the /solutions/pharmaceutical landing page.
 *
 * One object per section — add a new key here as each section is built
 * (problem, selfAssessment, checklistIntro, bridge, introducingExpendesk,
 * checklistContents, dualCta, socialProof, finalCta). Keeping all copy in
 * one place mirrors the home page's `src/data/sections/*` convention, so the
 * section components stay free of hardcoded text.
 */
export const content = {
  hero: {
    badge: "Pharma Solution · Expense Intelligence",
    /** Headline split into lines; `accent` gets the gradient treatment. */
    headline: {
      line1: "Is Your Pharma",
      line2: "Expense Process",
      accent: "Costing You More",
      line4: "Than You Think?",
    },
    subheadline: {
      emphasis:
        "Download the FREE 25-Point Pharma Expense Management Audit Checklist",
      body: "Discover hidden reimbursement delays, approval bottlenecks, expense leakages, and compliance risks slowing down your field teams and inflating finance workload.",
    },
    benefits: [
      "Evaluate your current expense process in 15 minutes",
      "Identify gaps before they become costly",
      "Benchmark your reimbursement workflow",
      "Discover where automation can improve efficiency",
    ],
    ctaPrimary: "Download Free Checklist",
    ctaSecondary: "Checklist + Schedule Assessment",
    trustedByLabel: "Trusted by",
    trustTags: ["50+ Pharma Teams", "SOC 2 Aligned", "HIPAA Compatible"],
  },
} as const;
