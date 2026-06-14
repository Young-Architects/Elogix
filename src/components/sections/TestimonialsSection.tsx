"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ScrollBeamDivider from "../ui/ScrollBeamDivider";
import rawTestData from "@/data/sections/testimonials.json";
import type { Testimonial } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// DATA  —  imported from @/data/sections/testimonials.json
// avatarGradient is a display concern kept here; backend provides the rest.
// ─────────────────────────────────────────────────────────────────────────────

const TESTIMONIAL_GRADIENTS: Record<string, string> = {
  "1":  "from-violet-500 to-purple-700",
  "2":  "from-fuchsia-500 to-pink-600",
  "3":  "from-indigo-500 to-blue-600",
  "4":  "from-emerald-500 to-teal-600",
  "5":  "from-orange-500 to-amber-600",
  "6":  "from-violet-500 to-indigo-600",
  "7":  "from-rose-500 to-pink-600",
  "8":  "from-cyan-500 to-blue-600",
  "9":  "from-purple-500 to-violet-700",
  "10": "from-violet-600 to-fuchsia-600",
  "11": "from-teal-500 to-emerald-600",
  "12": "from-amber-500 to-orange-600",
};

export const testimonialsData: Testimonial[] = rawTestData.testimonials.map(
  (t) => ({
    ...t,
    avatarImage: t.avatarImage ?? undefined,
    metric: t.metric ?? undefined,
    avatarGradient: TESTIMONIAL_GRADIENTS[t.id] ?? "from-slate-500 to-slate-700",
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function QuoteGlyph({ className }: { className?: string }) {
  // Solid editorial quotation mark — used as a faint decorative glyph inside cards.
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M12.7 6.2C8 8.2 4.8 12.6 4.8 18.3c0 4.4 2.7 7.5 6.4 7.5 3.3 0 5.7-2.5 5.7-5.6 0-3.1-2.1-5.3-5-5.3-.6 0-1.3.1-1.6.2.5-2.6 3-5.4 6-6.8l-3.6-2.1Zm14 0C22 8.2 18.8 12.6 18.8 18.3c0 4.4 2.7 7.5 6.4 7.5 3.3 0 5.7-2.5 5.7-5.6 0-3.1-2.1-5.3-5-5.3-.6 0-1.3.1-1.6.2.5-2.6 3-5.4 6-6.8l-3.6-2.1Z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          className={`h-3.5 w-3.5 flex-shrink-0 transition-colors ${
            i < count ? "text-amber-400" : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function Avatar({ t }: { t: Testimonial }) {
  const ring =
    "h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl shadow-sm ring-1 ring-white/70";

  if (t.avatarImage) {
    return (
      <div className={ring}>
        {/* Swap for next/image when you wire up real photos */}
        <img
          src={t.avatarImage}
          alt={t.author}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${ring} flex items-center justify-center bg-gradient-to-br ${t.avatarGradient} text-xs font-bold tracking-wide text-white`}
      aria-hidden="true"
    >
      {t.avatar}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    // flex-shrink-0 keeps width fixed; h-full lets it stretch to the tallest
    // card in its row so EVERY card in a row is the same height.
    <div className="group relative mx-2.5 h-full flex-shrink-0 select-none sm:mx-3 w-[300px] sm:w-[336px] lg:w-[360px]">
      {/* Hover glow */}
      <div
        className="
          pointer-events-none absolute -inset-1 rounded-[26px] opacity-0 blur-xl
          transition-opacity duration-500
          bg-gradient-to-br from-violet-400/40 via-fuchsia-400/30 to-indigo-400/40
          group-hover:opacity-100
        "
        aria-hidden="true"
      />

      {/* Gradient ring (1px border) — h-full so the visible card fills the slot */}
      <div
        className="
          relative h-full rounded-[22px] p-px transition-all duration-500 ease-out
          bg-gradient-to-br from-white/90 via-white/40 to-violet-200/50
          shadow-[0_8px_30px_-12px_rgba(76,29,149,0.18)]
          group-hover:-translate-y-1.5
          group-hover:from-violet-300/80 group-hover:via-white/60 group-hover:to-fuchsia-300/60
          group-hover:shadow-[0_24px_48px_-16px_rgba(109,40,217,0.35)]
        "
      >
        {/* Glass body — solid-ish white (no backdrop-filter) so text stays
            razor-sharp while the row is animating. */}
        <article className="relative flex h-full flex-col overflow-hidden rounded-[21px] bg-white/95 p-5 antialiased sm:p-6">
          {/* top inner highlight */}
          <div
            className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
            aria-hidden="true"
          />
          {/* faint decorative quote glyph */}
          <QuoteGlyph className="pointer-events-none absolute -right-1 -top-2 h-14 w-14 text-violet-500/[0.07] transition-colors duration-500 group-hover:text-violet-500/[0.12]" />

          {/* Stars */}
          <StarRating count={t.rating} />

          {/* Quote — full text, no truncation. Darker for clear readability. */}
          <blockquote className="relative mt-3 mb-5 text-[13.5px] font-medium leading-relaxed text-gray-700 sm:text-sm">
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          {/* Footer — mt-auto pushes it to the bottom of every card */}
          <div className="mt-auto border-t border-violet-900/[0.08] pt-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar t={t} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold leading-tight text-gray-900">
                    {t.author}
                  </p>
                  <p className="truncate text-[11px] text-gray-500">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>

              {/* Metric badge */}
              {t.metric && (
                <div className="flex-shrink-0 rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50/70 px-3 py-2 text-right shadow-sm">
                  <p className="bg-gradient-to-br from-violet-600 to-fuchsia-600 bg-clip-text text-sm font-black leading-none text-transparent">
                    {t.metric.value}
                  </p>
                  <p className="mt-1 whitespace-nowrap text-[9px] leading-none text-violet-500">
                    {t.metric.label}
                  </p>
                </div>
              )}
            </div>

            <p className="mt-2.5 pl-[3.25rem] text-[10px] text-gray-400">
              {t.companyType}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

// ── Marquee row ────────────────────────────────────────────────────────────

interface MarqueeRowProps {
  items: Testimonial[];
  direction: "left" | "right";
  duration: number;
}

function MarqueeRow({ items, direction, duration }: MarqueeRowProps) {
  const [paused, setPaused] = useState(false);
  const track = [...items, ...items]; // duplicate for seamless loop
  const animCls =
    direction === "left" ? "expd-marquee-left" : "expd-marquee-right";

  return (
    <div
      className="flex overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* items-stretch (default) + the cards' h-full chain = equal-height cards.
          py-6 gives the hover-lift + glow room so they aren't clipped. */}
      <div
        className={`flex items-stretch py-6 will-change-transform ${animCls}`}
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {track.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-700",
  "from-fuchsia-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const row1 = testimonialsData.slice(0, 6);
  const row2 = testimonialsData.slice(6, 12);

  return (
    <section
        ref={sectionRef}
        id="testimonials"
        className="relative overflow-hidden bg-[#ECECF4] pb-20 md:pb-28 pt-0"
      >
        {/* Your own divider, sitting at the seam between the two sections */}
        <ScrollBeamDivider />

        {/* ── Background: glow blobs ──────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 left-1/3 h-[700px] w-[700px] rounded-full bg-violet-300/15 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-fuchsia-300/12 blur-[90px]" />
          <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-200/10 blur-[100px]" />
        </div>

        {/* ── Background: dot grid (masked so it fades at the edges) ───────── */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(109,40,217,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* ─────────────────── HEADER ───────────────────────────────────── */}
        <div className="relative mx-auto mb-12 mt-12 max-w-7xl px-4 text-center sm:mb-16 sm:px-6 lg:px-8">
          {/* Badge — quote icon + testimonial-relevant copy */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-violet-200/60 bg-white/70 px-4 py-2 shadow-[0_2px_12px_-4px_rgba(109,40,217,0.25)] backdrop-blur-md"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm">
              <QuoteGlyph className="h-2.5 w-2.5" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-violet-600">
              {rawTestData.section.badge.label}
            </span>
            <span className="h-3 w-px bg-violet-200" aria-hidden="true" />
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
              <StarIcon className="h-3 w-3" />
              {rawTestData.section.badge.rating}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-3xl font-black leading-[1.1] tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-[56px]"
          >
            {rawTestData.section.headline.plain1}{" "}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              {rawTestData.section.headline.accent1}
            </span>
            <br />
            {rawTestData.section.headline.plain2}{" "}
            <span className="bg-gradient-to-r from-violet-700 via-violet-600 to-purple-500 bg-clip-text text-transparent">
              {rawTestData.section.headline.accent2}
            </span>
          </motion.h2>
        </div>

        {/* ─────────────────── MARQUEE ROWS (contained, not full-bleed) ────
            Mobile/tablet now get side gutters via px-5 / sm:px-8 so the cards
            no longer run edge-to-edge; lg returns to your original px-4 because
            max-w-7xl already creates the desktop gutter. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.42 }}
          className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-4"
        >
          <MarqueeRow items={row1} direction="left" duration={58} />
          <MarqueeRow items={row2} direction="right" duration={50} />

          {/* Edge fade masks — anchored to the container edges */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#ECECF4] to-transparent sm:w-24"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#ECECF4] to-transparent sm:w-24"
            aria-hidden="true"
          />
        </motion.div>

        {/* ─────────────────── BOTTOM CTA ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.56 }}
          className="relative mt-14 flex flex-col items-center gap-5 px-4 text-center sm:mt-16"
        >
          <div className="flex items-center gap-3 rounded-full border border-violet-200/50 bg-white/60 px-5 py-2.5 shadow-sm backdrop-blur-md">
            <div className="flex -space-x-2">
              {AVATAR_GRADIENTS.map((g, i) => (
                <div
                  key={i}
                  className={`h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br ${g} border-2 border-white`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {rawTestData.section.bottomCta.pre}{" "}
              <span className="font-semibold text-gray-700">{rawTestData.section.bottomCta.highlight}</span>{" "}
              {rawTestData.section.bottomCta.post}
            </p>
          </div>
        </motion.div>
      </section>
  );
}