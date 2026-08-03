'use client';

/**
 * ChecklistContentsSection ("What's inside the checklist")
 * ----------------------------------------------------------------
 * Preview of the 25-point pharma audit checklist for the Expendesk landing
 * page: a left intro panel (heading + progress ring + avatar chips) and a right
 * reveal of the first 10 categories — a timeline on desktop, a compact tile grid
 * on mobile — capped by a locked "plus N more" card.
 *
 * All copy + category data live in ../_data/checklist-contents.ts; the masked
 * dot-grid backdrop lives in globals.css (.cc-dot-grid). This file is
 * presentation only: layout, the scroll timeline, and the entrance/GSAP motion.
 *
 * Stack: Next.js (App Router) + TypeScript + Tailwind CSS +
 * Framer Motion (entrance / hover / timeline scroll) + GSAP (locked-card glow).
 */

import { useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import gsap from "gsap";
import {
  Sparkles,
  Lock,
  Receipt,
  Fuel,
  Plane,
  Workflow,
  ShieldAlert,
  FileCheck2,
  ClipboardCheck,
  Eye,
  Smile,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import ScrollBeamDivider from "@/components/ui/ScrollBeamDivider";
import { checklistContents } from "../_data";
import type { ChecklistContentsIconKey, ChecklistContentsItem } from "../_data";

/** Maps a category's `iconKey` (from data) onto its Lucide icon. */
const checklistContentsIcons: Record<ChecklistContentsIconKey, LucideIcon> = {
  receipt: Receipt,
  fuel: Fuel,
  plane: Plane,
  workflow: Workflow,
  shieldAlert: ShieldAlert,
  fileCheck: FileCheck2,
  clipboardCheck: ClipboardCheck,
  eye: Eye,
  smile: Smile,
  barChart: BarChart3,
};

const { items, totalAreas, badge, heading, locked } = checklistContents;
// Points advertised but not shown in the preview — derived so the "+N" chip and
// the locked "plus N more" copy stay in sync with the item list automatically.
const hiddenCount = totalAreas - items.length;

/* ------------------------------------------------------------------ */
/* Progress ring                                                      */
/* ------------------------------------------------------------------ */

function ProgressRing({ visible, total }: { visible: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const pct = visible / total;

  return (
    <div
      ref={ref}
      className="relative flex h-28 w-28 shrink-0 items-center justify-center sm:h-32 sm:w-32 lg:h-36 lg:w-36"
    >
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#D8B4FE"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="1 10"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          stroke="url(#checklist-ring-gradient)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: inView ? circumference * (1 - pct) : circumference,
          }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        />
        <defs>
          <linearGradient id="checklist-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex items-baseline gap-0.5">
        <span className="text-2xl font-extrabold text-slate-950 sm:text-3xl lg:text-4xl">
          {visible}
        </span>
        <span className="text-sm font-bold text-slate-300 sm:text-base lg:text-lg">
          /{total}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Animated checkmark                                                 */
/* ------------------------------------------------------------------ */

function CheckMark({ size = "md" }: { size?: "sm" | "md" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const wrap = size === "sm" ? "h-5 w-5" : "h-6 w-6 sm:h-7 sm:w-7";
  const icon = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <div ref={ref} className={`flex ${wrap} shrink-0 items-center justify-center rounded-full bg-emerald-50`}>
      <svg viewBox="0 0 24 24" className={`${icon} text-emerald-500`}>
        <motion.path
          d="M4 12l5 5L20 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.45, delay: 0.15 }}
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop / tablet timeline (md and up)                              */
/* ------------------------------------------------------------------ */

function TimelineRow({ item, index }: { item: ChecklistContentsItem; index: number }) {
  const Icon = checklistContentsIcons[item.iconKey];
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: shouldReduceMotion ? 0 : index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex items-center gap-4 lg:gap-5"
    >
      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-purple-100 bg-white text-purple-600 shadow-sm shadow-purple-100/80 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-purple-200 lg:h-14 lg:w-14">
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <Icon className="relative h-5 w-5 transition-colors duration-300 group-hover:text-white lg:h-6 lg:w-6" />
      </div>

      <div className="flex flex-1 items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-3.5 shadow-sm shadow-slate-100 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-purple-200 group-hover:shadow-lg group-hover:shadow-purple-100/70 lg:gap-4 lg:px-6 lg:py-4">
        <div className="flex items-center gap-3 lg:gap-4">
          <span className="text-xs font-bold text-purple-300 lg:text-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-semibold leading-snug text-slate-900 lg:text-base">
            {item.title}
          </span>
        </div>
        <CheckMark />
      </div>
    </motion.li>
  );
}

function LockedRow() {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLLIElement>(null);
  const inView = useInView(rowRef, { once: true, margin: "-60px" });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !glowRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(glowRef.current, {
        scale: 1.25,
        opacity: 0.85,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.li
      ref={rowRef}
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex items-center gap-4 lg:gap-5"
    >
      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-dashed border-purple-300 bg-purple-50 text-purple-500 lg:h-14 lg:w-14">
        <Lock className="h-5 w-5 lg:h-6 lg:w-6" />
      </div>

      <div
        ref={cardRef}
        className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-7 text-center shadow-lg shadow-purple-950/30 lg:px-10 lg:py-8"
      >
        <div
          ref={glowRef}
          className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/40 opacity-60 blur-3xl"
        />
        <div className="relative flex flex-col items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Lock className="h-5 w-5 text-purple-300" />
          </span>
          <p className="text-lg font-bold text-white lg:text-xl">
            {locked.lead}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {hiddenCount}
              {locked.accentSuffix}
            </span>
          </p>
        </div>
      </div>
    </motion.li>
  );
}

function ChecklistTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.4"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <div ref={containerRef} className="relative">
      <div className="absolute bottom-2 left-6 top-2 w-[2px] rounded-full bg-purple-100 lg:left-7" />
      <motion.div
        style={{ scaleY: lineScale }}
        className="absolute bottom-2 left-6 top-2 w-[2px] origin-top rounded-full bg-gradient-to-b from-purple-600 to-pink-500 lg:left-7"
      />

      <ul role="list" aria-label="Checklist categories" className="relative flex flex-col gap-4 lg:gap-5">
        {items.map((item, index) => (
          <TimelineRow key={item.id} item={item} index={index} />
        ))}
        <LockedRow />
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Compact tile grid (below md) — same data, far less vertical space  */
/* ------------------------------------------------------------------ */

function CompactTile({ item, index }: { item: ChecklistContentsItem; index: number }) {
  const Icon = checklistContentsIcons[item.iconKey];
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        delay: shouldReduceMotion ? 0 : index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileTap={{ scale: 0.97 }}
      className="flex flex-col gap-2.5 rounded-xl border border-slate-100 bg-white p-3 shadow-sm shadow-slate-100 transition-colors duration-300 active:border-purple-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
          <Icon className="h-4 w-4" />
        </div>
        <CheckMark size="sm" />
      </div>
      <div className="min-w-0">
        <span className="block text-[10px] font-bold tracking-wide text-purple-300">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="mt-0.5 block text-[13px] font-semibold leading-tight text-slate-900">
          {item.title}
        </span>
      </div>
    </motion.li>
  );
}

function CompactLockedTile() {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative col-span-2 flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 px-4 py-3.5 shadow-md shadow-purple-950/30"
    >
      <div className="pointer-events-none absolute -left-6 -top-10 h-24 w-24 rounded-full bg-purple-500/40 blur-2xl" />
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <Lock className="h-4 w-4 text-purple-300" />
      </div>
      <p className="relative text-[13px] font-bold leading-tight text-white">
        {locked.lead}
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {hiddenCount}
          {locked.accentSuffix}
        </span>
      </p>
    </motion.li>
  );
}

function CompactChecklistGrid() {
  return (
    <ul role="list" aria-label="Checklist categories" className="grid grid-cols-2 gap-2.5">
      {items.map((item, index) => (
        <CompactTile key={item.id} item={item} index={index} />
      ))}
      <CompactLockedTile />
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Left column                                                        */
/* ------------------------------------------------------------------ */

function IntroPanel() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="lg:sticky lg:top-28 lg:self-start"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-1.5 shadow-sm shadow-purple-100">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <span className="text-[14px] font-bold tracking-[0.16em] text-purple-700">
          {badge}
        </span>
      </span>

      {/* text-balance lets the browser distribute words evenly across
          lines instead of leaving a lone word ("Areas") stranded on
          its own line — this is what was breaking the gradient phrase
          awkwardly at lg:text-6xl. */}
      <h2
        id="whats-inside-heading"
        className="mt-5 text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-4xl lg:mt-6 lg:text-5xl"
      >
        {heading.lead}
        <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
          {heading.accent}
        </span>
        {heading.tail}
      </h2>

      <div className="mt-7 flex items-center gap-5 sm:gap-6 lg:mt-10">
        <ProgressRing visible={items.length} total={totalAreas} />
        <div className="hidden h-24 w-px bg-gradient-to-b from-transparent via-purple-200 to-transparent sm:block" />
        <div className="flex -space-x-3">
          {items.slice(0, 5).map(({ id, iconKey }) => {
            const Icon = checklistContentsIcons[iconKey];
            return (
              <span
                key={id}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-purple-100 to-pink-100 shadow-sm sm:h-10 sm:w-10"
              >
                <Icon className="h-4 w-4 text-purple-600" />
              </span>
            );
          })}
          <span className="flex h-9 items-center rounded-full border-2 border-dashed border-purple-300 bg-white px-3 text-xs font-bold text-purple-600 sm:h-10 sm:text-sm">
            +{hiddenCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Section                                                       */
/* ------------------------------------------------------------------ */

export default function WhatsInsideChecklistSection() {
  return (
    // pt-0 keeps the ScrollBeamDivider flush on the seam with the section above;
    // the top spacing is carried by the inner container's pt-* instead. Keeping
    // the vertical rhythm on a single element (here, the inner wrapper) avoids
    // the doubled top gap that a section py-* + inner pt-* combination caused.
    <section
      aria-labelledby="whats-inside-heading"
      className="relative bg-white pt-0 pb-14 sm:pb-20 lg:pb-16"
    >
      <ScrollBeamDivider />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="cc-dot-grid absolute inset-0 opacity-40" />
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-purple-300/25 blur-[100px]" />
        <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-pink-300/25 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-14 sm:pt-20 lg:px-8 lg:pt-28">
        <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
          <IntroPanel />

          <div className="md:hidden">
            <CompactChecklistGrid />
          </div>

          <div className="hidden md:block">
            <ChecklistTimeline />
          </div>
        </div>
      </div>
    </section>
  );
}
