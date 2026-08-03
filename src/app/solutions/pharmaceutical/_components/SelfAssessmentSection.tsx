"use client";

// app/solutions/pharmaceutical/_components/SelfAssessmentSection.tsx
// Interactive 60-second expense-audit checklist with a live score.
// All copy, questions, and score-tier config live in ../_data/self-assessment.ts;
// the border-beam animation lives in globals.css (.sa-border-beam). This file is
// presentation only: SVG icons, layout, and the scoring interaction.

import type { SVGProps, ReactElement } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CTA_TEXT, CTA_NOWRAP } from "@/components/ui/MagneticButton";
import { selfAssessment } from "../_data";
import type { AssessmentIconKey, ScoreTier } from "../_data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const { questions, tiers } = selfAssessment;
const TOTAL = questions.length;

/* ----------------------------- inline icons ----------------------------- */

const IconClipboard = (p: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    {...p}
  >
    <path
      d="M9 4.5h6a1 1 0 0 1 1 1V6h1.5A1.5 1.5 0 0 1 19 7.5v11A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-11A1.5 1.5 0 0 1 6.5 6H8v-.5a1 1 0 0 1 1-1Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="m9 12.5 2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconCheckCircle = (p: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    {...p}
  >
    <circle cx="12" cy="12" r="9" />
    <path
      d="m8.5 12.5 2.3 2.3L15.5 9.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconCircle = (p: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    {...p}
  >
    <circle cx="12" cy="12" r="9" />
  </svg>
);
const IconAlert = (p: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    {...p}
  >
    <path d="M12 3 2 20h20L12 3Z" strokeLinejoin="round" />
    <path d="M12 10v4" strokeLinecap="round" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);
const IconTrend = (p: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    {...p}
  >
    <path d="M3 17 9 11l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 7h6v6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconShield = (p: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    {...p}
  >
    <path
      d="M12 3.5 5 6v5.5c0 4.2 2.9 7.4 7 8.5 4.1-1.1 7-4.3 7-8.5V6l-7-2.5Z"
      strokeLinejoin="round"
    />
    <path d="m9 12 2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Maps a tier's `iconKey` (from data) onto its SVG component. */
const tierIcons: Record<
  AssessmentIconKey,
  (p: SVGProps<SVGSVGElement>) => ReactElement
> = {
  clipboard: IconClipboard,
  alert: IconAlert,
  trend: IconTrend,
  shield: IconShield,
};

/* ----------------------------- tier selection --------------------------- */

function getTier(score: number, answered: number): ScoreTier {
  if (answered === 0) return tiers.idle;
  if (score <= 2) return tiers.critical;
  if (score <= 5) return tiers.atRisk;
  return tiers.strong;
}

/* ══════════════════════════════════════════════════════
   BORDER BEAM — animated conic ring (keyframes in globals.css)
══════════════════════════════════════════════════════ */

function BorderBeam({
  duration = 7,
  colorFrom = "#7c3aed",
  colorTo = "#ec4899",
  className = "",
}: {
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}) {
  return (
    <div
      className={`sa-border-beam pointer-events-none absolute inset-0 z-20 ${className}`}
      style={{
        // 2px so the beam cleanly masks the card's 1px inner border.
        padding: "2px",
        background: `conic-gradient(from var(--sa-bb-angle), transparent 60%, ${colorFrom} 80%, ${colorTo} 90%, transparent 100%)`,
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        animationDuration: `${duration}s`,
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════
   QUESTION ROW — light theme
══════════════════════════════════════════════════════ */

function QuestionRow({
  index,
  question,
  isChecked,
  onToggle,
}: {
  index: number;
  question: string;
  isChecked: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-pressed={isChecked}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.38, delay: index * 0.045, ease: "easeOut" }}
      whileTap={{ scale: 0.985 }}
      className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50
        ${
          isChecked
            ? "border-purple-300 bg-purple-50"
            : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
        }`}
    >
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isChecked ? (
            <motion.span
              key="on"
              initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 22 }}
            >
              <IconCheckCircle className="h-5 w-5 text-purple-600" />
            </motion.span>
          ) : (
            <motion.span
              key="off"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
            >
              <IconCircle className="h-5 w-5 text-gray-300 group-hover:text-gray-400" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span
        className={`text-sm font-medium leading-snug sm:text-[15px] transition-colors
        ${isChecked ? "text-gray-900" : "text-gray-600"}`}
      >
        {question}
      </span>
    </motion.button>
  );
}

/* ══════════════════════════════════════════════════════
   MOBILE STICKY SCORE HEADER — light
══════════════════════════════════════════════════════ */

function MobileScoreHeader({
  score,
  answered,
}: {
  score: number;
  answered: number;
}) {
  const tier = getTier(score, answered);
  const percent = (score / TOTAL) * 100;

  return (
    <div className="shrink-0 border-b border-gray-100 bg-white/95 px-5 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {selfAssessment.liveScoreLabel}
        </span>
        <span className="text-sm font-bold text-gray-900">
          {score}
          <span className="font-medium text-gray-400">/{TOTAL}</span>
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${tier.barClass}`}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={tier.label}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="mt-2 inline-block text-xs font-semibold text-gray-500"
        >
          {tier.label} · {tier.message}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MOBILE STICKY CTA FOOTER — only "Schedule" button
══════════════════════════════════════════════════════ */

function MobileCtaFooter() {
  return (
    <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-3 lg:hidden">
      <a
        href="/contact-us"
        className={`flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-center font-semibold leading-tight text-gray-700 transition-colors hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/40 ${CTA_TEXT} ${CTA_NOWRAP}`}
      >
        {selfAssessment.scheduleCta}
      </a>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   DESKTOP SCORE PANEL — light, static "Schedule" button
══════════════════════════════════════════════════════ */

function DesktopScorePanel({
  score,
  answered,
}: {
  score: number;
  answered: number;
}) {
  const tier = getTier(score, answered);
  const TierIcon = tierIcons[tier.iconKey];
  const percent = (score / TOTAL) * 100;
  const circumference = 2 * Math.PI * 46;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="hidden h-full flex-col border-l border-gray-100 bg-gray-50/60 p-6 lg:flex">
      {/* ── Top: ring + badge + message ── */}
      <div className="flex flex-col items-center text-center">
        {/* Circular ring */}
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 108 108" className="h-full w-full -rotate-90">
            <circle
              cx="54"
              cy="54"
              r="46"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="7"
            />
            <motion.circle
              cx="54"
              cy="54"
              r="46"
              fill="none"
              stroke="url(#sa-ring-grad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={false}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <defs>
              <linearGradient
                id="sa-ring-grad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={tier.ring[0]} />
                <stop offset="100%" stopColor={tier.ring[1]} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={score}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-extrabold text-gray-900"
              >
                {score}
              </motion.span>
            </AnimatePresence>
            <span className="text-[10px] uppercase tracking-wide text-gray-400">
              {selfAssessment.ofLabel} {TOTAL}
            </span>
          </div>
        </div>

        {/* Tier badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tier.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className={`mt-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tier.badgeClass}`}
          >
            <TierIcon className="h-3.5 w-3.5" />
            {tier.label}
          </motion.div>
        </AnimatePresence>

        <p className="mt-3 text-xs leading-relaxed text-gray-500">
          {tier.message}
        </p>

        {/* ── "Schedule a Free Assessment" as a static button ── */}
        <a
          href="/contact-us"
          className={`mt-6 flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-center font-semibold leading-tight text-gray-700 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/40 ${CTA_TEXT} ${CTA_NOWRAP}`}
        >
          {selfAssessment.scheduleCta}
        </a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════════════════ */

export default function SelfAssessmentSection() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const answeredCount = Object.keys(checked).length;
  const score = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked],
  );

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    if (reduceMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 24, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      id="self-assessment"
      className="relative overflow-hidden bg-[#FAFAFC] py-16 sm:py-15"
    >
      {/* Subtle dot/grid background matching hero */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* ── Badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex w-fit items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-[14px] font-semibold tracking-wide text-purple-700"
        >
          <IconClipboard className="h-4 w-4" />
          {selfAssessment.badge}
        </motion.div>

        {/* ── Heading ── */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mx-auto mt-4 max-w-2xl text-center text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl"
        >
          {selfAssessment.heading.lead}
          <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
            {selfAssessment.heading.accent}
          </span>
          {selfAssessment.heading.tail}
        </motion.h2>

        {/* ── Sub-heading ── */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500"
        >
          {selfAssessment.subheading}
        </motion.p>

        {/* ══ CARD WRAPPER — border beam lives here ══ */}
        <div
          ref={cardRef}
          className="relative mx-auto mt-8 max-w-4xl rounded-3xl"
        >
          {/* Border beam — explicitly passing rounded-3xl so it curves perfectly */}
          <BorderBeam
            colorFrom="#7c3aed"
            colorTo="#ec4899"
            duration={7}
            className="rounded-3xl"
          />

          {/* The actual card */}
          <div className="relative flex h-[min(66vh,540px)] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-200/70 lg:h-[540px] lg:flex-row">
            {/* Left — questions */}
            <div className="flex min-h-0 flex-1 flex-col">
              <MobileScoreHeader score={score} answered={answeredCount} />

              <div
                className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-4 sm:px-6"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#e5e7eb transparent",
                }}
              >
                {questions.map((q, i) => (
                  <QuestionRow
                    key={q.id}
                    index={i}
                    question={q.question}
                    isChecked={!!checked[q.id]}
                    onToggle={() => toggle(q.id)}
                  />
                ))}
              </div>

              <MobileCtaFooter />
            </div>

            {/* Right — score panel */}
            <div className="lg:w-[280px] lg:shrink-0">
              <DesktopScorePanel score={score} answered={answeredCount} />
            </div>
          </div>
        </div>

        {/* ── Closing note ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mt-5 max-w-4xl rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-center sm:text-left"
        >
          <p className="text-sm leading-relaxed text-orange-900">
            <span className="font-semibold text-orange-700">
              {selfAssessment.closing.emphasis}
            </span>
            {selfAssessment.closing.body}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
