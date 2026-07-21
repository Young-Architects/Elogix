"use client";

/**
 * FinalCtaSection
 * ----------------------------------------------------------------
 * The page's closing CTA: heading + shared context line at top, then
 * two structured action panels (checklist download / book a demo).
 *
 * Below `md`, the two panels become a horizontal, auto-advancing,
 * swipeable strip instead of stacking vertically — at `md` and up it's
 * the normal side-by-side grid.
 *
 * All copy + panel data live in ../_data/final-cta.ts; the shimmer-text
 * sizing lives in globals.css (.fc-shimmer-text). The panel CTAs are the
 * shared MagneticButton. This file is presentation only.
 *
 * Stack: Next.js (App Router) + TypeScript + Tailwind CSS +
 * Framer Motion (staggered entrance, shimmer text) + GSAP (ambient glow drift).
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, CalendarCheck2, Download, type LucideIcon } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { openLeadMagnet } from "@/lib/lead-magnet";
import { finalCta } from "../_data";
import type { FinalCtaIconKey, FinalCtaPanel } from "../_data";

/** Maps a panel's `iconKey` (from data) onto its Lucide icon. */
const finalCtaIcons: Record<FinalCtaIconKey, LucideIcon> = {
  download: Download,
  calendar: CalendarCheck2,
};

const { heading, subheading, panels } = finalCta;

/* ------------------------------------------------------------------ */
/* Shared: shimmering gradient text                                    */
/* ------------------------------------------------------------------ */

function ShimmerText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.span
      // .fc-shimmer-text sets background-size: 200% auto so the position can drift.
      className={`fc-shimmer-text bg-clip-text text-transparent ${className}`}
      animate={
        shouldReduceMotion
          ? undefined
          : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
      }
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Entrance choreography                                               */
/* ------------------------------------------------------------------ */

const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ------------------------------------------------------------------ */
/* Action panel — one structured card per path                        */
/* ------------------------------------------------------------------ */

function ActionPanel({ panel }: { panel: FinalCtaPanel }) {
  const { isPrimary, iconKey, eyebrow, title, description, buttonLabel, href } = panel;
  const Icon = finalCtaIcons[iconKey];
  // The "Download the checklist" panel opens the guide in a new tab AND downloads it.
  const onCtaClick = iconKey === "download" ? openLeadMagnet : undefined;

  return (
    <motion.div
      variants={ITEM_VARIANTS}
      className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05] sm:p-7"
    >
      {eyebrow && (
        <span className="mb-3 inline-flex w-fit items-center rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
          {eyebrow}
        </span>
      )}

      <div
        className={
          isPrimary
            ? "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white"
            : "flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/80"
        }
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-base font-bold text-white sm:text-lg">{title}</p>

      {description && (
        <div className="mt-2 text-sm leading-relaxed text-white/55">
          {description.lead}
          <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text font-bold text-transparent">
            {description.accent}
          </span>
          {description.tail}
        </div>
      )}

      {/* Shared MagneticButton (both panels use white text — the component's
          default — so only the fill/border comes from className). */}
      <MagneticButton
        href={href}
        onClick={onCtaClick}
        type="button"
        variant="ghost"
        icon={<ArrowRight className="h-4 w-4" />}
        className={
          isPrimary
            ? "mt-5 w-fit rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-6 py-3 text-sm font-bold shadow-lg shadow-purple-900/40"
            : "mt-5 w-fit rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold"
        }
      >
        {buttonLabel}
      </MagneticButton>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile / tablet: horizontal auto-advancing strip (below md)         */
/* ------------------------------------------------------------------ */

function MobilePanelScroller() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Mirror the active index in a ref so the autoplay interval (set up
  // once) always reads the current value instead of a stale one.
  const activeIndexRef = useRef(0);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Autoplay pauses the moment the user touches/drags the strip, and
  // resumes a few seconds after they let go.
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / panels.length;
    el.scrollTo({ left: cardWidth * index, behavior: "smooth" });
  };

  const pauseAutoplay = () => {
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 5000);
  };

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      const next = (activeIndexRef.current + 1) % panels.length;
      scrollToIndex(next);
      setActiveIndex(next);
    }, 3500);

    return () => {
      clearInterval(interval);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [shouldReduceMotion]);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / panels.length;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(panels.length - 1, Math.max(0, index)));
  };

  return (
    <div className="md:hidden">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onPointerDown={pauseAutoplay}
        onTouchStart={pauseAutoplay}
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {panels.map((panel, index) => (
          <div key={index} className="w-[85%] shrink-0 snap-start sm:w-[70%]">
            <ActionPanel panel={panel} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
        {panels.map((_, index) => (
          <span
            key={index}
            className={
              index === activeIndex
                ? "h-1.5 w-6 rounded-full bg-purple-400 transition-all duration-300"
                : "h-1.5 w-1.5 rounded-full bg-white/20 transition-all duration-300"
            }
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      if (orbARef.current) {
        gsap.to(orbARef.current, {
          x: 30,
          y: -20,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      if (orbBRef.current) {
        gsap.to(orbBRef.current, {
          x: -25,
          y: 20,
          duration: 9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          ref={orbARef}
          className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-purple-600/25 blur-[110px]"
        />
        <div
          ref={orbBRef}
          className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-pink-600/20 blur-[120px]"
        />
      </div>

      <motion.div
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative mx-auto max-w-4xl px-6 text-center lg:px-8"
      >
        <motion.h2
          id="final-cta-heading"
          variants={ITEM_VARIANTS}
          className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          {heading.lead}
          <ShimmerText className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
            {heading.accent}
          </ShimmerText>
        </motion.h2>

        <motion.p
          variants={ITEM_VARIANTS}
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base"
        >
          {subheading}
        </motion.p>

        <motion.div variants={ITEM_VARIANTS} className="mt-9 text-left sm:mt-10">
          <MobilePanelScroller />

          <div className="hidden md:grid md:grid-cols-2 md:gap-6">
            {panels.map((panel, index) => (
              <ActionPanel key={index} panel={panel} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
