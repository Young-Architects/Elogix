/**
 * Barrel for the /solutions/pharmaceutical page data.
 *
 * Copy is never hardcoded in the section components — each section has its own
 * data file in this folder, typed against `./types.ts`:
 *
 *   hero.ts                  → Hero section copy
 *   problem.ts               → Problem section copy + data (stats, chips, tools, consequences)
 *   self-assessment.ts       → Self-assessment copy + audit questions + score tiers
 *   checklist-intro.ts       → Checklist-intro copy + audience roles + document mock
 *   bridge.ts                → Bridge section copy + "same challenges" cards
 *   introducing-expendesk.ts → "Introducing Expendesk" copy + capability cards + CTA
 *   checklist-contents.ts    → "What's inside the checklist" copy + revealed categories
 *   choose-next-step.ts      → Dual-CTA + trust closer copy + options + trust points
 *   final-cta.ts             → Closing final-CTA copy + action panels
 *   faq.ts                   → FAQ entries (rendered AND used for FAQPage JSON-LD)
 *   types.ts                 → shared interfaces
 *
 * As each new section is built, add a `<section>.ts` file here, add its
 * interface to `types.ts`, and re-export it below. `content` groups every
 * section object under one key each, so a component can pull a single
 * `content.<section>` (mirrors the sibling solutions pages); the individual
 * objects are also re-exported for direct import.
 */
import { hero } from "./hero";
import { problem } from "./problem";
import { selfAssessment } from "./self-assessment";
import { checklistIntro } from "./checklist-intro";
import { bridge } from "./bridge";
import { introducingExpendesk } from "./introducing-expendesk";
import { checklistContents } from "./checklist-contents";
import { chooseNextStep } from "./choose-next-step";
import { finalCta } from "./final-cta";
import { faq } from "./faq";

/** Grouped section objects, one key per section. */
export const content = {
  hero,
  problem,
  selfAssessment,
  checklistIntro,
  bridge,
  introducingExpendesk,
  checklistContents,
  chooseNextStep,
  finalCta,
  faq,
} as const;

export { hero } from "./hero";
export { problem } from "./problem";
export { selfAssessment } from "./self-assessment";
export { checklistIntro } from "./checklist-intro";
export { bridge } from "./bridge";
export { introducingExpendesk } from "./introducing-expendesk";
export { checklistContents } from "./checklist-contents";
export { chooseNextStep } from "./choose-next-step";
export { finalCta } from "./final-cta";
export { faq } from "./faq";
export type * from "./types";
