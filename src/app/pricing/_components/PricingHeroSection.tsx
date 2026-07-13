"use client";

/**
 * PricingHeroSection — the /pricing opener.
 *
 * Centered heading block (eyebrow pill → H1 with gradient accent → sub copy)
 * followed by the "Talk to our Expert" helper line, the Book-a-Free-Demo CTA
 * (→ /contact-sales, where the sales form lives) and a small reassurance row.
 *
 * Sits on the same soft violet canvas as the contact/solutions heroes so the
 * page feels native to the rest of the site. The gradient fades to white at
 * the bottom so it hands over seamlessly to PricingPlansSection.
 * Copy lives in ../_data/content.ts; this file is presentation + wiring only.
 */

import { motion, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { pricingHero } from "../_data/content";

/* ------------------------------------------------------------------ */
/* Entrance choreography                                               */
/* ------------------------------------------------------------------ */

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

export default function PricingHeroSection() {
  return (
    <section
      aria-labelledby="pricing-hero-heading"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg,#F5F3FF 0%,#FAF9FF 55%,#FFFFFF 100%)",
      }}
    >
      {/* Ambient background glows (static — no scroll cost) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 15% 15%, rgba(99,102,241,0.09) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 88% 60%, rgba(217,70,239,0.07) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex max-w-4xl flex-col items-center px-6 pb-10 pt-32 text-center sm:pb-12 sm:pt-36 lg:px-8"
      >
        <motion.span
          variants={ITEM_VARIANTS}
          className="inline-flex items-center rounded-full border border-indigo-200/70 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-500 shadow-sm backdrop-blur-sm"
        >
          {pricingHero.eyebrow}
        </motion.span>

        <motion.h1
          id="pricing-hero-heading"
          variants={ITEM_VARIANTS}
          className="mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          {pricingHero.heading.lead}
          <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            {pricingHero.heading.accent}
          </span>
        </motion.h1>

        <motion.p
          variants={ITEM_VARIANTS}
          className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-slate-500 sm:text-base"
        >
          {pricingHero.subheading}
        </motion.p>

        {/* Helper line + primary CTA */}
        <motion.div
          variants={ITEM_VARIANTS}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <p className="text-sm font-semibold text-slate-700 sm:text-[15px]">
            {pricingHero.helper}
          </p>
          <MagneticButton
            href={pricingHero.ctaHref}
            variant="ghost"
            icon={<ArrowRight className="h-4 w-4" />}
            className="rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-7 py-3.5 text-sm font-bold shadow-[0_10px_30px_rgba(99,102,241,0.35)] sm:text-[15px]"
          >
            {pricingHero.ctaLabel}
          </MagneticButton>
        </motion.div>

        {/* Reassurance row */}
        <motion.ul
          variants={ITEM_VARIANTS}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5"
        >
          {pricingHero.reassurance.map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 sm:text-[13px]"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
              {item}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
