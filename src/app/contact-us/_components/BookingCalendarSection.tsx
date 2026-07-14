"use client";

/**
 * BookingCalendarSection — the /contact-us (Book a Demo) centrepiece.
 *
 * Centered heading block (eyebrow pill → H1 with gradient accent → sub copy)
 * followed by the GHL booking-calendar embed in a white card. The embed's
 * companion script (`form_embed.js`) listens for postMessage events from the
 * widget and auto-resizes the iframe to fit its content on every viewport,
 * so the card needs no fixed height — only a min-height fallback while the
 * widget boots.
 *
 * Same soft violet canvas as the solutions heroes so the page feels native
 * to the rest of the site. Copy + embed config live in ../_data/content.ts.
 */

import Script from "next/script";
import { motion, type Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import {
  bookingCalendar,
  bookingHero,
  bookingReassurance,
} from "../_data/content";

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

export default function BookingCalendarSection() {
  return (
    <section
      aria-labelledby="booking-hero-heading"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(155deg,#F5F3FF 0%,#FAFAFF 45%,#EDE9FE 100%)",
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
              "radial-gradient(ellipse 70% 55% at 15% 20%, rgba(99,102,241,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 88% 75%, rgba(217,70,239,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pb-16 pt-32 text-center sm:px-6 sm:pb-20 sm:pt-36 lg:px-8"
      >
        <motion.span
          variants={ITEM_VARIANTS}
          className="inline-flex items-center rounded-full border border-indigo-200/70 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-500 shadow-sm backdrop-blur-sm"
        >
          {bookingHero.eyebrow}
        </motion.span>

        {/* max-w-4xl (not 3xl) + no text-balance so the lead fits on a single
            line at lg:text-6xl; the gradient accent gets its own line. */}
        <motion.h1
          id="booking-hero-heading"
          variants={ITEM_VARIANTS}
          className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          {bookingHero.heading.lead}
          <span className="block bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            {bookingHero.heading.accent}
          </span>
        </motion.h1>

        <motion.p
          variants={ITEM_VARIANTS}
          className="mx-auto mt-5 max-w-xl text-pretty text-sm font-semibold leading-relaxed text-slate-600 sm:text-base"
        >
          {bookingHero.subheading}
        </motion.p>

        <motion.p
          variants={ITEM_VARIANTS}
          className="mx-auto mt-2.5 max-w-2xl text-pretty text-sm leading-relaxed text-slate-500 sm:text-base"
        >
          {bookingHero.description}
        </motion.p>

        {/* Calendar card — the GHL widget resizes itself via form_embed.js */}
        {/* min-height on the card (not just the iframe) so it can't collapse
            to a sliver while the widget loads or if the booking URL is down */}
        <motion.div
          variants={ITEM_VARIANTS}
          className="mt-12 min-h-[420px] w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-2 shadow-[0_20px_48px_rgba(99,102,241,0.10),0_6px_20px_rgba(0,0,0,0.05)] sm:p-4"
        >
          {/* Small min-height only as a boot fallback — form_embed.js sets the
              real height inline, and a large CSS min-height would beat it and
              pad the card with empty space (see GhlContactForm). */}
          <iframe
            src={bookingCalendar.src}
            id={bookingCalendar.iframeId}
            title={bookingCalendar.title}
            scrolling="no"
            className="block min-h-[420px] w-full"
            style={{ width: "100%", border: "none", overflow: "hidden" }}
          />
        </motion.div>

        {/* Reassurance row */}
        <motion.ul
          variants={ITEM_VARIANTS}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5"
        >
          {bookingReassurance.map((item) => (
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

      {/* Auto-resizes the LeadConnector iframe to its content height */}
      <Script src={bookingCalendar.embedScriptSrc} strategy="afterInteractive" />
    </section>
  );
}
