"use client";

/**
 * PricingFaqSection — "Have Questions? Get some Insights" (id="pricing-faq").
 *
 * Single-open accordion in the same light violet style as the home FaqSection:
 * active item gets a violet accent bar + soft glow, the "+" toggle rotates to
 * "×", and an animated height reveal (AnimatePresence). Answers can carry an
 * optional bullet list (used by "What's included in the free demo?").
 *
 * A FAQPage JSON-LD script is emitted for rich search results. All copy comes
 * from ../_data/content.ts.
 */

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check, Plus, Sparkles } from "lucide-react";
import { pricingFaq, type PricingFaqItem } from "../_data/content";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Flattens an item's answer (+ bullets/tail) into one string for JSON-LD. */
function fullAnswerText(item: PricingFaqItem): string {
  return [item.answer, ...(item.bullets ?? []), item.answerTail]
    .filter(Boolean)
    .join(" ");
}

/* FAQPage structured data for search engines */
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pricingFaq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: fullAnswerText(item) },
  })),
};

export default function PricingFaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggle = (i: number) => setOpenIndex((cur) => (cur === i ? -1 : i));

  return (
    <section
      id="pricing-faq"
      ref={sectionRef}
      aria-labelledby="pricing-faq-heading"
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#F6F4FD] to-[#EFECFA] py-16 md:py-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      {/* Ambient blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-1/4 h-[24rem] w-[24rem] rounded-full bg-violet-400/8 blur-[100px]" />
        <div className="absolute -right-28 bottom-0 h-[20rem] w-[20rem] rounded-full bg-fuchsia-400/7 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-100/50 px-4 py-1.5 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-violet-600" />
            <span className="text-[14px] font-bold tracking-wide text-violet-800">
              {pricingFaq.badge}
            </span>
          </motion.div>

          <motion.h2
            id="pricing-faq-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.55, ease: EASE }}
            className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl"
          >
            {pricingFaq.heading.lead}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
              {pricingFaq.heading.accent}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.16, duration: 0.5, ease: EASE }}
            className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-slate-500 sm:text-base"
          >
            {pricingFaq.subheading}
          </motion.p>
        </div>

        {/* ── Accordion ── */}
        <div className="mt-10 flex flex-col gap-3 md:mt-12">
          {pricingFaq.items.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.22 + i * 0.08, duration: 0.5, ease: EASE }}
                className={[
                  "relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300",
                  isOpen
                    ? "border-violet-200/80 bg-white/95 shadow-[0_10px_36px_rgba(124,58,237,0.12)]"
                    : "border-white/80 bg-white/70 shadow-sm hover:border-violet-200/50 hover:bg-white/85",
                ].join(" ")}
              >
                {/* Active accent bar */}
                <div
                  className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(180deg, #7c3aed, #d946ef)",
                    opacity: isOpen ? 1 : 0,
                  }}
                />

                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`pricing-faq-answer-${faq.id}`}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 sm:gap-4 sm:px-6 sm:py-5"
                >
                  {/* Number chip */}
                  <span
                    className={[
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[10.5px] font-black transition-all duration-300 sm:h-8 sm:w-8 sm:rounded-xl sm:text-[11.5px]",
                      isOpen
                        ? "text-white shadow-md"
                        : "bg-violet-50 text-violet-500 ring-1 ring-violet-100",
                    ].join(" ")}
                    style={
                      isOpen
                        ? {
                            background: "linear-gradient(135deg, #7c3aed, #d946ef)",
                            boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
                          }
                        : undefined
                    }
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span
                    className={[
                      "flex-1 text-[13.5px] font-bold leading-snug tracking-tight transition-colors duration-200 sm:text-[15.5px]",
                      isOpen ? "text-slate-900" : "text-slate-700",
                    ].join(" ")}
                  >
                    {faq.question}
                  </span>

                  {/* Plus → × toggle */}
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={[
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 sm:h-8 sm:w-8",
                      isOpen
                        ? "bg-violet-100 text-violet-600"
                        : "bg-slate-100/80 text-slate-400",
                    ].join(" ")}
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.6} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      id={`pricing-faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-5 pl-[52px] text-[13px] font-medium leading-relaxed text-slate-500 sm:px-6 sm:pb-6 sm:pl-[72px] sm:text-[14.5px]">
                        <p>{faq.answer}</p>

                        {faq.bullets && (
                          <ul className="mt-3 flex flex-col gap-2">
                            {faq.bullets.map((bullet) => (
                              <li
                                key={bullet}
                                className="flex items-start gap-2.5"
                              >
                                <span className="mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-500 ring-1 ring-violet-100">
                                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                                </span>
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}

                        {faq.answerTail && (
                          <p className="mt-3">{faq.answerTail}</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
