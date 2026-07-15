"use client";

/**
 * ContactSalesSection — the full /contact-sales layout.
 *
 * Two-column grid on lg+ (intro left, form card right) that stacks to a
 * single column on mobile/tablet with the intro first so the form always has
 * context.
 *
 * Copy lives in ../_data/content.ts; the form is the embedded GHL
 * "Contact Expendesk" form in ./GhlContactForm.
 */

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Mail,
  type LucideIcon,
} from "lucide-react";
import {
  salesAlternatives,
  salesIntro,
  type SalesAlternativeIconKey,
} from "../_data/content";
import GhlContactForm from "./GhlContactForm";

const ALTERNATIVE_ICON_MAP: Record<SalesAlternativeIconKey, LucideIcon> = {
  calendar: CalendarDays,
  mail: Mail,
};

const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function ContactSalesSection() {
  return (
    <section
      aria-labelledby="contact-sales-heading"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(155deg,#F5F3FF 0%,#FAFAFF 45%,#EDE9FE 100%)",
      }}
    >
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 12% 30%, rgba(99,102,241,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 90% 70%, rgba(217,70,239,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-7xl px-6 pb-16 pt-28 sm:pb-20 sm:pt-32 lg:px-8"
      >
        {/* items-center (not items-start) so the shorter intro column sits
            vertically centered beside the much taller form card on lg+.
            The form column must reach ≥650px of iframe width on xl so the
            embedded GHL form renders its two-column (side-by-side fields)
            desktop layout instead of the stacked mobile one. */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(0,560px)] lg:items-center lg:gap-14 xl:grid-cols-[1fr_minmax(0,680px)]">
          {/* ── Intro column ── */}
          <div className="max-w-xl">
            <motion.span
              variants={ITEM_VARIANTS}
              className="inline-flex items-center rounded-full border border-indigo-200/70 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-500 shadow-sm backdrop-blur-sm"
            >
              {salesIntro.eyebrow}
            </motion.span>

            <motion.h1
              id="contact-sales-heading"
              variants={ITEM_VARIANTS}
              className="mt-5 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl"
            >
              {salesIntro.heading.lead}
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                {salesIntro.heading.accent}
              </span>
            </motion.h1>

            <motion.p
              variants={ITEM_VARIANTS}
              className="mt-5 text-pretty text-sm leading-relaxed text-slate-500 sm:text-[15px]"
            >
              {salesIntro.description}
            </motion.p>

            {/* What to expect */}
            <motion.div
              variants={ITEM_VARIANTS}
              className="mt-10 rounded-2xl border border-indigo-100/80 bg-white/60 p-5 backdrop-blur-sm sm:p-6"
            >
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-500">
                {salesIntro.expectations.heading}
              </h2>
              <ul className="mt-4 space-y-3">
                {salesIntro.expectations.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-slate-600"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Alternative routes: live demo booking + direct email */}
            <motion.div
              variants={ITEM_VARIANTS}
              className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3"
            >
              {salesAlternatives.map((alt) => {
                const Icon = ALTERNATIVE_ICON_MAP[alt.iconKey];
                const inner = (
                  <>
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-100 bg-white/80 text-indigo-500 shadow-sm transition-colors duration-200 group-hover:border-indigo-200 group-hover:text-violet-600">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    {alt.label}
                    <ArrowRight className="h-3.5 w-3.5 -translate-x-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                  </>
                );
                const linkClass =
                  "group inline-flex items-center gap-2 text-[13px] font-semibold text-indigo-600 transition-colors duration-200 hover:text-violet-600";
                return alt.href.startsWith("/") ? (
                  <Link key={alt.href} href={alt.href} className={linkClass}>
                    {inner}
                  </Link>
                ) : (
                  <a key={alt.href} href={alt.href} className={linkClass}>
                    {inner}
                  </a>
                );
              })}
            </motion.div>
          </div>

          {/* ── Form column ──
              max-w cap below lg keeps the stacked-page form card at a width
              where the GHL form stays in its single-column mode (<~640px of
              iframe), so GhlContactForm's crop margins hold; on lg+ the grid
              column controls the width instead. */}
          <motion.div
            variants={ITEM_VARIANTS}
            className="mx-auto w-full max-w-[600px] lg:mx-0 lg:max-w-none"
          >
            <GhlContactForm />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
