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
  /** Where the primary CTA points (the checklist PDF — triggers a download). */
  ctaPrimaryHref: string;
  ctaSecondary: string;
  /** Where the secondary CTA points (the contact page, to schedule). */
  ctaSecondaryHref: string;
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

/* ── Self-assessment section ──────────────────────────── */

/** The four scoring tiers, keyed by band. */
export type ScoreTierKey = "idle" | "critical" | "atRisk" | "strong";

/** Keys into the component's SVG icon registry. */
export type AssessmentIconKey = "clipboard" | "alert" | "trend" | "shield";

/** A single yes/no audit question in the interactive checklist. */
export interface AssessmentQuestion {
  id: string;
  question: string;
}

/** Presentation config for one score tier (copy + Tailwind classes + colors). */
export interface ScoreTier {
  label: string;
  message: string;
  /** Tailwind classes for the tier badge pill. */
  badgeClass: string;
  /** Tailwind gradient stops for the progress bar. */
  barClass: string;
  /** Progress-ring gradient stops, `[from, to]`. */
  ring: readonly [string, string];
  /** Which registry icon represents this tier. */
  iconKey: AssessmentIconKey;
}

/** All copy + data for the interactive self-assessment section. */
export interface SelfAssessmentContent {
  /** Eyebrow pill copy. */
  badge: string;
  heading: {
    lead: string;
    /** Gradient-accented run. */
    accent: string;
    tail: string;
  };
  subheading: string;
  /** Label above the mobile sticky score bar. */
  liveScoreLabel: string;
  /** Small "of {total}" label under the desktop ring. */
  ofLabel: string;
  /** Shared CTA (mobile footer + desktop panel). */
  scheduleCta: string;
  closing: {
    /** Emphasised lead-in run. */
    emphasis: string;
    body: string;
  };
  questions: AssessmentQuestion[];
  tiers: Record<ScoreTierKey, ScoreTier>;
}

/* ── Checklist-intro (lead magnet) section ────────────── */

/** Keys into the checklist section's SVG icon registry. */
export type ChecklistIconKey =
  | "briefcase"
  | "chartBar"
  | "handshake"
  | "target"
  | "users"
  | "wallet"
  | "document"
  | "workflow"
  | "shieldAlert"
  | "chartLine"
  | "shieldCheck"
  | "smile";

/** A "built for" audience chip. */
export interface ChecklistRole {
  label: string;
  iconKey: ChecklistIconKey;
}

/** A row in the document-mock "what it evaluates" list. */
export interface ChecklistEvalItem {
  label: string;
  iconKey: ChecklistIconKey;
}

/** All copy + data for the checklist-intro lead-magnet section. */
export interface ChecklistIntroContent {
  badge: string;
  heading: {
    lead: string;
    /** Gradient-accented run. */
    accent: string;
    tail: string;
  };
  /** Eyebrow above the audience chips. */
  builtForLabel: string;
  roles: ChecklistRole[];
  closing: {
    /** Emphasised lead-in run. */
    emphasis: string;
    body: string;
  };
  cta: {
    label: string;
    /** Download URL for the checklist PDF. */
    href: string;
    /** Suggested filename for the downloaded file. */
    downloadName: string;
    subtext: string;
  };
  /** Copy for the floating "checklist preview" document mock. */
  document: {
    ribbon: string;
    fileName: string;
    pointsBadge: string;
    evaluates: ChecklistEvalItem[];
    footer: { time: string; categories: string };
    floatingBadge: { title: string; subtitle: string };
  };
}

/* ── Bridge section ───────────────────────────────────── */

/** Keys into the bridge section's Lucide icon registry. */
export type BridgeIconKey =
  | "fileWarning"
  | "clock"
  | "eyeOff"
  | "hourglass"
  | "shieldAlert"
  | "alertTriangle";

/** A "same challenges" card. */
export interface BridgeChallenge {
  id: string;
  label: string;
  iconKey: BridgeIconKey;
}

/** All copy + data for the bridge ("how do you fix them?") section. */
export interface BridgeContent {
  badge: string;
  heading: {
    lead: string;
    /** Gradient-accented run. */
    accent: string;
  };
  subheading: string;
  challenges: BridgeChallenge[];
  closing: {
    lead: string;
    /** Gradient-accented run. */
    accent: string;
  };
}

/* ── Introducing-Expendesk section ────────────────────── */

/** Keys into the introducing section's Lucide icon registry. */
export type IntroducingIconKey =
  | "fileCheck"
  | "zap"
  | "shieldCheck"
  | "workflow"
  | "barChart"
  | "trendingDown"
  | "smile";

/** A capability card in the auto-cycling command center. */
export interface IntroducingFeature {
  id: number;
  label: string;
  iconKey: IntroducingIconKey;
}

/** All copy + data for the "Introducing Expendesk" section. */
export interface IntroducingExpendeskContent {
  badge: string;
  heading: {
    lead: string;
    /** Gradient-accented run. */
    accent: string;
  };
  subheading: string;
  features: IntroducingFeature[];
  /** Dark closing banner copy + CTA. */
  outro: string;
  cta: { label: string; href: string };
}

/* ── Checklist-contents ("what's inside") section ─────── */

/** Keys into the checklist-contents section's Lucide icon registry. */
export type ChecklistContentsIconKey =
  | "receipt"
  | "fuel"
  | "plane"
  | "workflow"
  | "shieldAlert"
  | "fileCheck"
  | "clipboardCheck"
  | "eye"
  | "smile"
  | "barChart";

/** A single revealed checklist category (timeline row / compact tile). */
export interface ChecklistContentsItem {
  id: number;
  title: string;
  iconKey: ChecklistContentsIconKey;
}

/** All copy + data for the "What's inside the checklist" section. */
export interface ChecklistContentsContent {
  badge: string;
  heading: {
    lead: string;
    /** Gradient-accented run. */
    accent: string;
    tail: string;
  };
  /** Total assessment points advertised; the hidden count is derived as
   *  `totalAreas - items.length`. */
  totalAreas: number;
  items: ChecklistContentsItem[];
  /** Locked "plus N more" card copy. The number is injected from the derived
   *  hidden count, so `accentSuffix` is just the trailing phrase. */
  locked: { lead: string; accentSuffix: string };
}

/* ── Choose-next-step (dual CTA + trust) section ──────── */

/** Keys into the choose-next-step section's Lucide icon registry. */
export type ChooseNextStepIconKey = "download" | "calendar";

/** One of the two "next step" CTA cards. */
export interface ChooseNextStepOption {
  id: number;
  /** Small eyebrow, e.g. "Option 1". */
  label: string;
  title: string;
  description: string;
  buttonLabel: string;
  /** Optional link target; the demo CTA points at the contact page. */
  href?: string;
  iconKey: ChooseNextStepIconKey;
}

/** All copy + data for the "Choose your next step" section. */
export interface ChooseNextStepContent {
  badge: string;
  heading: {
    lead: string;
    /** Gradient-accented run. */
    accent: string;
  };
  options: ChooseNextStepOption[];
  /** Dark social-proof / trust capsule. */
  trust: {
    heading: {
      lead: string;
      /** Gradient-accented run. */
      accent: string;
    };
    subheading: string;
    points: string[];
  };
}

/* ── Final CTA section ────────────────────────────────── */

/** Keys into the final-CTA section's Lucide icon registry. */
export type FinalCtaIconKey = "download" | "calendar";

/** One structured action panel (checklist download / book a demo). */
export interface FinalCtaPanel {
  /** Primary panel gets the bolder gradient treatment. */
  isPrimary: boolean;
  iconKey: FinalCtaIconKey;
  /** Optional small pill above the title (e.g. "Secondary Option:"). */
  eyebrow?: string;
  title: string;
  /** Optional description with a gradient-accented middle run. */
  description?: { lead: string; accent: string; tail: string };
  buttonLabel: string;
  /** Optional link target; the demo CTA points at the contact page. */
  href?: string;
}

/** All copy + data for the closing final-CTA section. */
export interface FinalCtaContent {
  heading: {
    lead: string;
    /** Gradient-accented run. */
    accent: string;
  };
  subheading: string;
  panels: FinalCtaPanel[];
}
