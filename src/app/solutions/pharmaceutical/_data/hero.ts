/**
 * Copy for the pharmaceutical Hero section (`_components/HeroSection.tsx`).
 * Edit the text here — the component maps over it and stays free of hardcoded strings.
 */
import type { HeroContent } from "./types";

export const hero: HeroContent = {
  badge: "Pharma Solution · Expense Intelligence",
  /**
   * The H1, split across four lines (`accent` gets the gradient).
   *
   * It previously read "Is Your Pharma Expense Process Costing You More Than
   * You Think?" — strong conversion copy for the checklist download, but it
   * contained no term anyone searches for. This page was not indexed while its
   * sibling /solutions/manufacturing, whose H1 is the plain phrase "Expense
   * Management for Manufacturing Industries", was indexed and ranking — even
   * for pharmaceutical queries, because Google had no pharma page to serve.
   *
   * The keyword phrase now leads and the question moved to `subheadline.
   * emphasis`, immediately below, so the hook still hits before the CTA.
   * Keep a searchable noun phrase in this headline; the persuasion belongs in
   * the subheadline.
   */
  headline: {
    line1: "Expense Management",
    line2: "Software for",
    accent: "Pharmaceutical",
    line4: "Companies",
  },
  subheadline: {
    // The original headline's hook, demoted but not lost — rendered in bold
    // violet directly under the H1.
    emphasis: "Is your expense process costing you more than you think?",
    body: "Download the FREE 25-Point Pharma Expense Management Audit Checklist and uncover the hidden reimbursement delays, approval bottlenecks, expense leakages and compliance risks slowing down your field teams.",
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
