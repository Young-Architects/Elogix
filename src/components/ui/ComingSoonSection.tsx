"use client";

/**
 * ComingSoonSection — inline "this part isn't built yet" banner.
 *
 * The section-sized sibling of `ComingSoon` (which fills a whole page):
 * drop this between finished sections of a page that is still being built
 * out — e.g. the solutions/manufacturing + solutions/digital-agencies stubs,
 * where the deep-dive content between the hero and the benefits grid is
 * still to come.
 *
 * Same visual language as ComingSoon: light gradient card, masked dot grid,
 * pulsing "Coming Soon" badge, gradient title. All copy comes in as props
 * from the page's `_data/content.ts` — nothing is hardcoded here.
 */

import { motion } from "framer-motion";
import { Clock } from "lucide-react";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ComingSoonSection({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <section aria-label="Coming soon" className="px-6 pb-4 pt-2 sm:pb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: EASE }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border-2 border-dashed border-violet-200/80 bg-gradient-to-b from-[#faf9ff] to-[#f3f1fc] px-6 py-12 text-center shadow-[0_4px_24px_rgba(124,58,237,0.06)] sm:px-10 sm:py-14"
      >
        {/* Masked dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(124,58,237,0.14) 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(ellipse 75% 80% at 50% 40%, #000 10%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 80% at 50% 40%, #000 10%, transparent 75%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          {/* Coming Soon badge with pulsing rings */}
          <div className="relative mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-md">
            {[0, 1].map((n) => (
              <motion.span
                key={n}
                aria-hidden
                className="absolute inset-0 rounded-full border border-violet-300/40"
                animate={{
                  scale: [1, 1.35 + n * 0.15],
                  opacity: [0.4 - n * 0.15, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.6 + n * 0.4,
                  delay: n * 0.4,
                  ease: "easeOut",
                }}
              />
            ))}
            <Clock className="h-3.5 w-3.5 text-violet-600" />
            <span className="text-xs font-bold tracking-wide text-violet-800">
              Coming Soon
            </span>
          </div>

          <h2 className="text-balance text-xl font-extrabold tracking-tight sm:text-2xl">
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
              {title}
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-pretty text-sm font-medium leading-relaxed text-slate-500 sm:text-[15px]">
            {message}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
