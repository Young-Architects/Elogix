/**
 * Shared content types for the /solutions/pharmaceutical page.
 *
 * Every section's data file (`hero.ts`, `problem.ts`, …) is typed against the
 * interfaces here, so the section components consume strongly-typed copy and
 * never hardcode strings. Add a new interface when you add a new section.
 */

/* ── Hero section ─────────────────────────────────────── */
export interface HeroContent {
  badge: string;
  /** Headline split into lines; `accent` gets the gradient treatment. */
  headline: {
    line1: string;
    line2: string;
    accent: string;
    line4: string;
  };
  subheadline: {
    emphasis: string;
    body: string;
  };
  benefits: string[];
  ctaPrimary: string;
  ctaSecondary: string;
  trustedByLabel: string;
  trustTags: string[];
  /** Micro-label on the scroll-down nudge. */
  scrollLabel: string;
}

/* ── Problem section ──────────────────────────────────── */

/** A chip in the "MRs spend their own money on…" row. */
export interface MrExpense {
  emoji: string;
  label: string;
}

/** A legacy tool card ("Yet most still rely on…"). */
export interface OldTool {
  emoji: string;
  name: string;
  desc: string;
  /** Short status tag rendered top-right (e.g. MANUAL, SLOW, RISKY). */
  tag: string;
  /** Inline style values for the tag pill (computed at runtime). */
  tagColor: string;
  tagBorder: string;
  tagText: string;
}

/** A consequence card in the "As a result…" grid. */
export interface Problem {
  emoji: string;
  label: string;
  body: string;
}

/** An animated impact statistic (counts up when scrolled into view). */
export interface ImpactStat {
  /** Numeric target the CountUp animation eases toward. */
  value: number;
  /** Appended after the number (e.g. "%", " Days"). */
  suffix: string;
  label: string;
  emoji: string;
  /** Stagger delay (seconds) for the entrance animation. */
  delay: number;
}

/**
 * All copy + data for the Problem section, in render order. Headlines that mix
 * plain and gradient-accented text are split into fragments (`lead` / `accent`
 * / `tail…`) so the component can style each run without hardcoding strings.
 */
export interface ProblemContent {
  /** Top eyebrow pill. */
  badge: string;
  headline: {
    lead: string;
    /** Gradient-accented run. */
    accent: string;
    tailLead: string;
    /** Final white-emphasised run. */
    tailEmphasis: string;
  };
  intro: string;
  /** Microcopy on the mobile carousel swipe hint. */
  swipeHint: string;
  impactStats: ImpactStat[];
  /** Caption above the MR expense chips. */
  mrExpensesLabel: string;
  mrExpenses: MrExpense[];
  /** Center pill on the "Yet most still rely on…" divider. */
  legacyDivider: { icon: string; label: string };
  /** Footer label under each legacy-tool card. */
  oldToolsFooter: string;
  oldTools: OldTool[];
  result: {
    eyebrow: string;
    lead: string;
    /** Gradient-accented run. */
    accent: string;
    subtext: string;
  };
  problems: Problem[];
  closing: {
    icon: string;
    badge: string;
    headlineLead: string;
    /** Gradient-accented run. */
    headlineAccent: string;
    headlineTail: string;
    body: string;
    cta: string;
  };
}
