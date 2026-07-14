"use client";

/**
 * PricingPlansSection — the three plan cards (Growth / Business / Enterprise).
 *
 * Layout:
 *   - Mobile: cards stack in a single centered column.
 *   - md and up: 3-column grid; the highlighted "Business" card is raised
 *     slightly on lg and carries a gradient ring + "Most Popular" badge.
 *
 * Tiers above Growth show an "Everything in X, plus:" lead-in before their
 * feature list (mirrors the GTM sheet's comparison table). Every card's CTA
 * is Book a Free Demo → /contact-us (the demo booking calendar).
 *
 * All plan data (placeholder prices + features) lives in ../_data/content.ts;
 * this file is presentation only.
 */

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  pricingPlans,
  pricingPlansHeader,
  type PricingPlan,
} from "../_data/content";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/* ------------------------------------------------------------------ */
/* Plan card                                                           */
/* ------------------------------------------------------------------ */

function PlanCard({ plan }: { plan: PricingPlan }) {
  const headingId = `plan-${plan.id}-heading`;

  return (
    <motion.div
      variants={ITEM_VARIANTS}
      aria-labelledby={headingId}
      className={[
        "group relative flex h-full flex-col rounded-3xl bg-white p-7 text-left transition-all duration-300 sm:p-8",
        plan.highlighted
          ? "border-2 border-transparent shadow-[0_24px_60px_rgba(99,102,241,0.18),0_8px_24px_rgba(0,0,0,0.06)] [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(135deg,#6366f1,#8b5cf6,#d946ef)_border-box] lg:-translate-y-3 lg:hover:-translate-y-4"
          : "border border-slate-200/80 shadow-[0_4px_24px_rgba(99,102,241,0.06),0_1px_8px_rgba(0,0,0,0.04)] hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_20px_48px_rgba(99,102,241,0.14),0_6px_20px_rgba(0,0,0,0.05)]",
      ].join(" ")}
    >
      {/* "Most Popular" badge on the highlighted card */}
      {plan.highlighted && (
        <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_8px_20px_rgba(99,102,241,0.4)]">
          <Sparkles className="h-3 w-3" />
          Most Popular
        </span>
      )}

      <h3
        id={headingId}
        className={[
          "text-lg font-bold tracking-tight sm:text-xl",
          plan.highlighted ? "text-indigo-600" : "text-slate-900",
        ].join(" ")}
      >
        {plan.name}
      </h3>

      <p className="mt-1.5 min-h-[40px] text-[13px] leading-relaxed text-slate-500">
        {plan.tagline}
      </p>

      {/* Price row */}
      <div className="mt-5">
        {plan.price.custom ? (
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">
            Custom
          </span>
        ) : (
          <span className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">
              {plan.price.amount}
            </span>
            <span className="text-sm font-medium text-slate-400">
              {plan.price.period}
            </span>
          </span>
        )}
        <p className="mt-1.5 text-[11px] font-medium text-slate-400">
          {plan.price.note}
        </p>
      </div>

      <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Feature list */}
      {plan.inheritsLabel && (
        <p className="mb-3 text-[12.5px] font-bold text-slate-700">
          {plan.inheritsLabel}
        </p>
      )}
      <ul className="flex flex-col gap-2.5">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-600"
          >
            <span
              className={[
                "mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full",
                plan.highlighted
                  ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                  : "bg-indigo-50 text-indigo-500 ring-1 ring-indigo-100",
              ].join(" ")}
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA — pinned to the card's bottom edge */}
      <div className="mt-auto pt-7">
        <MagneticButton
          href={plan.ctaHref}
          variant="ghost"
          fullWidth
          icon={<ArrowRight className="h-4 w-4" />}
          className={
            plan.highlighted
              ? "rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 py-3 text-sm font-bold shadow-[0_10px_28px_rgba(99,102,241,0.35)]"
              : "rounded-full bg-slate-900 py-3 text-sm font-bold shadow-[0_8px_20px_rgba(15,23,42,0.18)]"
          }
        >
          {plan.ctaLabel}
        </MagneticButton>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function PricingPlansSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      id="plans"
      ref={sectionRef}
      aria-labelledby="pricing-plans-heading"
      className="relative overflow-hidden bg-white pb-16 pt-6 sm:pb-20 lg:pb-24"
    >
      {/* Ambient blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-1/3 h-[22rem] w-[22rem] rounded-full bg-indigo-400/8 blur-[100px]" />
        <div className="absolute -right-28 bottom-10 h-[20rem] w-[20rem] rounded-full bg-fuchsia-400/7 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-100/50 px-4 py-1.5 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            <span className="text-xs font-bold tracking-wide text-violet-800">
              {pricingPlansHeader.badge}
            </span>
          </motion.div>

          <motion.h2
            id="pricing-plans-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.55, ease: EASE }}
            className="mt-5 text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl"
          >
            {pricingPlansHeader.heading.lead}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              {pricingPlansHeader.heading.accent}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.16, duration: 0.5, ease: EASE }}
            className="mx-auto mt-4 max-w-lg text-pretty text-sm font-medium leading-relaxed text-slate-500 sm:text-base"
          >
            {pricingPlansHeader.subheading}
          </motion.p>
        </div>

        {/* ── Cards ──
            Single centered column on mobile, 3-up grid from md.
            Extra top padding leaves room for the floating "Most Popular"
            badge + the raised highlighted card on lg. */}
        <motion.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mx-auto mt-12 grid max-w-sm grid-cols-1 gap-6 md:mt-14 md:max-w-none md:grid-cols-3 md:gap-5 lg:mt-16 lg:gap-7"
        >
          {pricingPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
