/**
 * Barrel for the /solutions/pharmaceutical page data.
 *
 * Copy is never hardcoded in the section components — each section has its own
 * data file in this folder, typed against `./types.ts`:
 *
 *   hero.ts             → Hero section copy
 *   problem.ts          → Problem section copy + data (stats, chips, tools, consequences)
 *   self-assessment.ts  → Self-assessment copy + audit questions + score tiers
 *   types.ts            → shared interfaces
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

/** Grouped section objects, one key per section. */
export const content = { hero, problem, selfAssessment } as const;

export { hero } from "./hero";
export { problem } from "./problem";
export { selfAssessment } from "./self-assessment";
export type * from "./types";
