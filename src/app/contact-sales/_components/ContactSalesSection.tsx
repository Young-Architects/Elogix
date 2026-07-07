"use client";

/**
 * ContactSalesSection — the full /contact-sales layout.
 *
 * Two-column grid on lg+ (intro left, form card right) that stacks to a
 * single column on mobile/tablet with the intro first so the form always has
 * context. Includes a breadcrumb-style back link to /contact-us.
 *
 * Copy lives in ../_data/content.ts; the form is ./SalesForm.
 */

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { salesIntro } from "../_data/content";
import SalesForm from "./SalesForm";

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
        className="relative mx-auto max-w-6xl px-6 pb-16 pt-28 sm:pb-20 sm:pt-32 lg:px-8"
      >
        {/* Back link */}
        <motion.div variants={ITEM_VARIANTS}>
          <Link
            href="/contact-us"
            className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/70 px-3.5 py-1.5 text-[12px] font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition-colors duration-200 hover:border-indigo-200 hover:text-indigo-600"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            All contact options
          </Link>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(0,480px)] lg:items-start lg:gap-14">
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
          </div>

          {/* ── Form column ── */}
          <motion.div variants={ITEM_VARIANTS}>
            <SalesForm />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
