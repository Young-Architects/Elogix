/**
 * All copy + data for the pharmaceutical Problem section
 * (`_components/ProblemSection.tsx`).
 *
 * The component is purely presentational — every headline, label, paragraph,
 * CTA, chip, card, and stat is read from the `problem` object below. Nothing is
 * hardcoded in the JSX, so all copy edits happen here. Fragmented headline runs
 * (`lead` / `accent` / `tail…`) let the component gradient-style each run.
 */
import type { ProblemContent } from "./types";

export const problem: ProblemContent = {
  /* ── 1. Badge + headline ── */
  badge: "The Hidden Problem",
  headline: {
    lead: "Most Pharma Companies ",
    accent: "Don't Realize",
    tailLead: "How Much Expense Inefficiency Is ",
    tailEmphasis: "Costing Them",
  },
  intro:
    "The pain is real. The losses are compounding. And most organizations won't see it — until it's too late.",

  /** Microcopy on the mobile swipe carousels (tools + consequences). */
  swipeHint: "Swipe to explore",

  /* ── 2. Impact stats (count up on scroll into view) ── */
  impactStats: [
    {
      value: 73,
      suffix: "%",
      label: "of pharma companies still manage field expenses manually",
      emoji: "📊",
      delay: 0,
    },
    {
      value: 21,
      suffix: " Days",
      label: "average reimbursement delay without a proper system",
      emoji: "⏳",
      delay: 0.12,
    },
    {
      value: 18,
      suffix: "%",
      label: "of field expense claims contain errors or duplicate entries",
      emoji: "🔄",
      delay: 0.24,
    },
  ],

  /* ── 3. MR expense chips ── */
  mrExpensesLabel:
    "Every day, your Medical Representatives spend their own money on:",
  mrExpenses: [
    { emoji: "⛽", label: "Fuel" },
    { emoji: "✈️", label: "Travel" },
    { emoji: "🏨", label: "Lodging" },
    { emoji: "👨‍⚕️", label: "Doctor Visits" },
    { emoji: "💰", label: "Daily Allowances" },
    { emoji: "📋", label: "Field Activities" },
  ],

  /* ── 4. "Yet most still rely on…" divider ── */
  legacyDivider: { icon: "⚡", label: "Yet most still rely on..." },

  /* ── 5. Legacy-tool cards ── */
  oldToolsFooter: "No automation",
  oldTools: [
    {
      emoji: "📊",
      name: "Spreadsheets",
      desc: "Version conflicts, formula errors, zero real-time visibility across your field teams.",
      tag: "MANUAL",
      tagColor: "rgba(239,68,68,0.13)",
      tagBorder: "rgba(239,68,68,0.28)",
      tagText: "#FCA5A5",
    },
    {
      emoji: "📧",
      name: "Email Chains",
      desc: "Approval requests buried in inboxes. Days of back-and-forth with zero tracking.",
      tag: "SLOW",
      tagColor: "rgba(245,158,11,0.12)",
      tagBorder: "rgba(245,158,11,0.28)",
      tagText: "#FCD34D",
    },
    {
      emoji: "💬",
      name: "WhatsApp Groups",
      desc: "Informal approvals, no audit trail. A compliance team's worst nightmare.",
      tag: "RISKY",
      tagColor: "rgba(239,68,68,0.13)",
      tagBorder: "rgba(239,68,68,0.28)",
      tagText: "#FCA5A5",
    },
    {
      emoji: "✍️",
      name: "Manual Approvals",
      desc: "Paper trails, human errors, weeks of delay before a rep sees any reimbursement.",
      tag: "BROKEN",
      tagColor: "rgba(239,68,68,0.13)",
      tagBorder: "rgba(239,68,68,0.28)",
      tagText: "#FCA5A5",
    },
  ],

  /* ── 6. "As a result…" transition ── */
  result: {
    eyebrow: "As a result",
    lead: "Your business is ",
    accent: "silently bleeding",
    subtext:
      "And it compounds — month after month — while you're focused on growing revenue.",
  },

  /* ── 7. Consequence cards ── */
  problems: [
    {
      emoji: "⏳",
      label: "Reimbursements get delayed",
      body: "MRs wait weeks for money they've already spent from their own pockets — quietly demotivating your frontline.",
    },
    {
      emoji: "😤",
      label: "Employees become frustrated",
      body: "Your best field talent walks out the door when they feel financially invisible and administratively stuck.",
    },
    {
      emoji: "📉",
      label: "Finance teams get overwhelmed",
      body: "Manual reconciliation consumes dozens of hours each month — hours that should be spent on growth.",
    },
    {
      emoji: "🔍",
      label: "Managers lose visibility",
      body: "No real-time dashboard. No spend control. Decisions made blind while the budget silently erodes.",
    },
    {
      emoji: "🔄",
      label: "Duplicate claims go unnoticed",
      body: "Without automation, the same expense can slip through and get reimbursed twice — every single month.",
    },
    {
      emoji: "⚠️",
      label: "Compliance risks increase",
      body: "One audit can expose months of untracked, undocumented spending. The penalties aren't worth the risk.",
    },
  ],

  /* ── 8. Closing "scary part" banner ── */
  closing: {
    icon: "⚠️",
    badge: "The Scary Part",
    headlineLead: "Most of these issues remain ",
    headlineAccent: "invisible",
    headlineTail: " — until they hit profitability and morale.",
    body: "By the time you notice, the damage is done. Competitors on modern expense management are already pulling ahead.",
    cta: "See how Expendesk solves this",
  },
};
