/**
 * Copy for the pharmaceutical Hero section (`_components/HeroSection.tsx`).
 * Edit the text here — the component maps over it and stays free of hardcoded strings.
 */
import type { HeroContent } from "./types";

export const hero: HeroContent = {
  badge: "Pharma Solution · Expense Intelligence",
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
  ctaPrimaryHref: "/downloads/msme-lead-magnet.pdf",
  ctaSecondary: "Checklist + Schedule Assessment",
  ctaSecondaryHref: "/contact-us",
  trustedByLabel: "Trusted by",
  trustTags: ["50+ Pharma Teams", "SOC 2 Aligned", "HIPAA Compatible"],
  scrollLabel: "Scroll",
};
