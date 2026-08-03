/**
 * All copy + data for the pharmaceutical Self-Assessment section
 * (`_components/SelfAssessmentSection.tsx`).
 *
 * The component is purely presentational — headings, labels, CTAs, the audit
 * questions, and the score-tier config all live here. Tiers reference icons by
 * `iconKey`; the component maps those keys onto SVG components through a local
 * registry (same convention the home-page sections use), so no JSX lives in
 * this data file.
 */
import type { SelfAssessmentContent } from "./types";

export const selfAssessment: SelfAssessmentContent = {
  badge: "SELF-ASSESSMENT · 60-SECOND AUDIT",
  heading: {
    lead: "How Healthy Is Your ",
    accent: "Expense Management",
    tail: " Process?",
  },
  subheading:
    "Answer honestly. Most pharma leaders are surprised by where they land.",
  liveScoreLabel: "Your live score",
  ofLabel: "of",
  scheduleCta: "Schedule a Free Assessment",
  closing: {
    emphasis: "If you're unsure about even a few of these, ",
    body: "your organization may already be losing time, money, and productivity.",
  },

  /* Interactive checklist — each toggled "yes" adds a point to the live score. */
  questions: [
    {
      id: "digital-submission",
      question: "Can Medical Representatives submit claims digitally?",
    },
    {
      id: "sla-processing",
      question: "Are reimbursements processed within a defined SLA?",
    },
    {
      id: "status-tracking",
      question: "Can employees track reimbursement status?",
    },
    {
      id: "duplicate-detection",
      question: "Are duplicate claims automatically detected?",
    },
    {
      id: "approval-speed",
      question: "Do managers approve claims without delays?",
    },
    {
      id: "spend-visibility",
      question: "Does leadership have real-time spend visibility?",
    },
    { id: "audit-readiness", question: "Are expense records audit-ready?" },
  ],

  /* Score bands — `getTier()` in the component picks one from the live score. */
  tiers: {
    idle: {
      label: "Not started",
      message: "Tap each question to see where your process stands.",
      badgeClass: "border-gray-200 bg-gray-50 text-gray-500",
      barClass: "from-gray-300 to-gray-300",
      ring: ["#d1d5db", "#d1d5db"],
      iconKey: "clipboard",
    },
    critical: {
      label: "Critical gaps",
      message: "There are real blind spots here actively costing you.",
      badgeClass: "border-red-200 bg-red-50 text-red-600",
      barClass: "from-red-400 to-orange-400",
      ring: ["#f87171", "#fb923c"],
      iconKey: "alert",
    },
    atRisk: {
      label: "At risk",
      message: "Lengthy gaps are quietly draining time and budget.",
      badgeClass: "border-amber-200 bg-amber-50 text-amber-600",
      barClass: "from-amber-400 to-orange-400",
      ring: ["#fbbf24", "#fb923c"],
      iconKey: "trend",
    },
    strong: {
      label: "Ahead of the curve",
      message: "Solid foundation — a few refinements make it airtight.",
      badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-600",
      barClass: "from-emerald-400 to-purple-500",
      ring: ["#34d399", "#a855f7"],
      iconKey: "shield",
    },
  },
};
