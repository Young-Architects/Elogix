"use client";

/**
 * PricingFinalCtaSection — the page's closing banner.
 *
 * "Start with the essentials. Scale as you grow." on the same dark canvas as
 * the solutions pages' final CTAs, so every marketing page closes with the
 * familiar dark bookend before the Footer. One centered CTA:
 * Book a Free Demo → /contact-us (the demo booking calendar).
 *
 * Copy lives in ../_data/content.ts; this file is presentation only.
 */

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { pricingFinalCta } from "../_data/content";

const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function PricingFinalCtaSection() {
  return (
    <section
      aria-labelledby="pricing-final-cta-heading"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black py-20 sm:py-24 lg:py-28"
    >
      {/* Ambient glows (static — no scroll cost) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-indigo-600/25 blur-[110px]" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-[120px]" />
      </div>

      <motion.div
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative mx-auto max-w-3xl px-6 text-center lg:px-8"
      >
        <motion.h2
          id="pricing-final-cta-heading"
          variants={ITEM_VARIANTS}
          className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          {pricingFinalCta.heading.line1}
          <br className="hidden sm:block" />{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            {pricingFinalCta.heading.accent}
          </span>
        </motion.h2>

        <motion.p
          variants={ITEM_VARIANTS}
          className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base"
        >
          {pricingFinalCta.subheading}
        </motion.p>

        <motion.div variants={ITEM_VARIANTS} className="mt-9 flex justify-center">
          <MagneticButton
            href={pricingFinalCta.ctaHref}
            variant="ghost"
            icon={<ArrowRight className="h-4 w-4" />}
            className="rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-8 py-3.5 font-bold shadow-lg shadow-indigo-900/40"
          >
            {pricingFinalCta.ctaLabel}
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
