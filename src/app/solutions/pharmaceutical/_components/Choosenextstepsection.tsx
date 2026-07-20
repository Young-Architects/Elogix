"use client";

/**
 * ChooseNextStepSection
 * ----------------------------------------------------------------
 * The dual-CTA + social-proof closer of the pharma landing page:
 *   1. "Choose your next step" — two glass CTA cards (Download the
 *      checklist vs. Book a demo) with a hover-triggered light sweep.
 *   2. A dark premium trust capsule with a gradient border ring,
 *      ambient glow, and each trust point as its own glass pill.
 *
 * Mobile/tablet (below `md`): the two CTA cards become a horizontal,
 * swipeable, snap-scrolling strip instead of stacking vertically.
 *
 * All copy + card/trust data live in ../_data/choose-next-step.ts; the two dot
 * grids and the shimmer-text sizing live in globals.css (.cn-*). The two card
 * buttons are the shared MagneticButton. This file is presentation only.
 *
 * Stack: Next.js (App Router) + TypeScript + Tailwind CSS +
 * Framer Motion (entrances, glass "materialize", shimmer text/sweep) +
 * GSAP (ambient glow drift only).
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Download,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import ScrollBeamDivider from "@/components/ui/ScrollBeamDivider";
import MagneticButton from "@/components/ui/MagneticButton";
import { openAndDownloadLeadMagnet } from "@/lib/lead-magnet";
import { chooseNextStep } from "../_data";
import type { ChooseNextStepIconKey, ChooseNextStepOption } from "../_data";

/** Maps a CTA option's `iconKey` (from data) onto its Lucide icon. */
const chooseNextStepIcons: Record<ChooseNextStepIconKey, LucideIcon> = {
  download: Download,
  calendar: CalendarCheck2,
};

const { badge, heading, options, trust } = chooseNextStep;

/* ------------------------------------------------------------------ */
/* Shared: shimmering gradient text (subtle, looping backgroundPosition) */
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
      // .cn-shimmer-text sets background-size: 200% auto so the position can drift.
      className={`cn-shimmer-text bg-clip-text text-transparent ${className}`}
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
/* Shared: hover-triggered light sweep for glass surfaces              */
/* ------------------------------------------------------------------ */

/**
 * Driven by the card's real hover state (`active`): the band travels in `left`
 * percentages computed against the CARD's width (-60% to 115%, so it starts
 * fully off-screen left and ends fully off-screen right — guaranteed full
 * coverage in between), and reverses quickly when the pointer leaves.
 */
function ShimmerSweep({
  active,
  tone = "light",
}: {
  active: boolean;
  tone?: "light" | "dark";
}) {
  const shouldReduceMotion = useReducedMotion();
  const isActive = active && !shouldReduceMotion;

  return (
    <motion.div
      aria-hidden="true"
      className={
        tone === "light"
          ? "pointer-events-none absolute inset-y-0 w-1/2 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent"
          : "pointer-events-none absolute inset-y-0 w-1/2 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent"
      }
      initial={{ left: "-60%", opacity: 0 }}
      animate={
        isActive
          ? { left: "115%", opacity: 1 }
          : { left: "-60%", opacity: 0 }
      }
      transition={
        isActive
          ? { duration: 1.6, ease: [0.16, 1, 0.3, 1] }
          : { duration: 0.3, ease: "easeIn" }
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* CTA card (glassmorphism)                                            */
/* ------------------------------------------------------------------ */

function CtaCard({ option, index }: { option: ChooseNextStepOption; index: number }) {
  const Icon = chooseNextStepIcons[option.iconKey];
  const isPrimary = index === 1; // "Book a Demo" gets the bolder treatment
  // The "Download the checklist" card opens the guide in a new tab AND downloads it.
  const onCtaClick =
    option.iconKey === "download" ? openAndDownloadLeadMagnet : undefined;
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isPrimary) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !glowRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(glowRef.current, {
        scale: 1.2,
        opacity: 0.9,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, cardRef);

    return () => ctx.revert();
  }, [isPrimary]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={
        isPrimary
          ? "group relative flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 p-8 shadow-2xl shadow-purple-300/50 ring-1 ring-inset ring-white/20 transition-transform duration-500 hover:-translate-y-1.5 sm:p-10"
          : "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/60 p-8 shadow-xl shadow-purple-100/60 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-purple-200 hover:shadow-2xl hover:shadow-purple-200/70 sm:p-10"
      }
    >
      {/* corner color bleed — gives the glass something to refract */}
      <div
        aria-hidden="true"
        ref={isPrimary ? glowRef : undefined}
        className={
          isPrimary
            ? "pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/25 blur-3xl"
            : "pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-purple-300/50 to-pink-300/40 blur-2xl transition-transform duration-500 group-hover:scale-125"
        }
        style={isPrimary ? { opacity: 0.6 } : undefined}
      />

      {/* glass shine — soft diagonal highlight simulating light on glass */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"
      />
      <ShimmerSweep active={isHovered} tone={isPrimary ? "dark" : "light"} />

      <div className="relative flex flex-1 flex-col">
        <div
          className={
            isPrimary
              ? "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white backdrop-blur-sm"
              : "flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-100 bg-white/80 text-purple-600 backdrop-blur-sm"
          }
        >
          <Icon className="h-6 w-6" />
        </div>

        <span
          className={
            isPrimary
              ? "mt-6 text-xs font-bold uppercase tracking-[0.16em] text-white/70"
              : "mt-6 text-xs font-bold uppercase tracking-[0.16em] text-purple-400"
          }
        >
          {option.label}
        </span>

        <h3
          className={
            isPrimary
              ? "mt-2 text-2xl font-extrabold text-white sm:text-[1.75rem]"
              : "mt-2 text-2xl font-extrabold text-slate-950 sm:text-[1.75rem]"
          }
        >
          {option.title}
        </h3>

        <p
          className={
            isPrimary
              ? "mt-3 text-sm leading-relaxed text-white/80 sm:text-base"
              : "mt-3 text-sm leading-relaxed text-slate-500 sm:text-base"
          }
        >
          {option.description}
        </p>

        {/* Shared MagneticButton. The primary card's button is white-on-purple,
            so its label + icon are coloured directly (MagneticButton's own text
            defaults to white); the secondary card keeps the white default. */}
        {isPrimary ? (
          <MagneticButton
            href={option.href}
            onClick={onCtaClick}
            type="button"
            variant="ghost"
            icon={<ArrowRight className="h-4 w-4 text-purple-700" />}
            className="mt-8 w-fit rounded-full bg-white px-6 py-3 text-sm font-bold text-purple-700 shadow-lg shadow-purple-950/20"
          >
            <span className="text-purple-700">{option.buttonLabel}</span>
          </MagneticButton>
        ) : (
          <MagneticButton
            href={option.href}
            onClick={onCtaClick}
            type="button"
            variant="ghost"
            icon={<ArrowRight className="h-4 w-4" />}
            className="mt-8 w-fit rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-sm font-bold shadow-lg shadow-purple-200"
          >
            {option.buttonLabel}
          </MagneticButton>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile / tablet: horizontal swipeable strip (below md)              */
/* ------------------------------------------------------------------ */

function MobileCtaScroller() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Keep a ref mirror of the active index so the autoplay interval
  // (set up once) always reads the *current* value instead of a
  // stale one captured at mount.
  const activeIndexRef = useRef(0);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Autoplay pauses as soon as the user touches/drags the strip, and
  // resumes automatically a few seconds after they let go.
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / options.length;
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
      const next = (activeIndexRef.current + 1) % options.length;
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
    const cardWidth = el.scrollWidth / options.length;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(options.length - 1, Math.max(0, index)));
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
        {options.map((option, index) => (
          <div key={option.id} className="w-[85%] shrink-0 snap-start sm:w-[70%]">
            <CtaCard option={option} index={index} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
        {options.map((_, index) => (
          <span
            key={index}
            className={
              index === activeIndex
                ? "h-1.5 w-6 rounded-full bg-purple-500 transition-all duration-300"
                : "h-1.5 w-1.5 rounded-full bg-purple-200 transition-all duration-300"
            }
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Trust pill (glass capsule chip, dark surface)                       */
/* ------------------------------------------------------------------ */

function TrustPill({
  label,
  index,
  inView,
}: {
  label: string;
  index: number;
  inView: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.li
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 sm:text-[15px]"
    >
      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
      {label}
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/* Trust panel — dark premium capsule card                             */
/* ------------------------------------------------------------------ */

function TrustCapsule() {
  const panelRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !glowRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(glowRef.current, {
        scale: 1.3,
        opacity: 0.9,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, panelRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative mt-16 sm:mt-20">
      {/* gradient border ring */}
      <div className="rounded-[2rem] bg-gradient-to-r from-purple-500/70 via-fuchsia-500/70 to-pink-500/70 p-px shadow-2xl shadow-purple-300/30">
        <motion.div
          ref={panelRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={
            shouldReduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.96, filter: "blur(6px)" }
          }
          animate={inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-gradient-to-b from-slate-900 via-slate-950 to-black px-6 py-12 text-center sm:px-12 sm:py-16"
        >
          <div
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/40 opacity-70 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="cn-dot-grid-dark pointer-events-none absolute inset-0 opacity-[0.07]"
          />
          <ShimmerSweep active={isHovered} tone="dark" />

          <div className="relative">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <ShieldCheck className="h-6 w-6 text-purple-300" />
            </span>

            <h3 className="mx-auto mt-5 max-w-2xl text-balance text-2xl font-extrabold leading-snug tracking-tight text-white sm:text-3xl">
              {trust.heading.lead}
              <ShimmerText className="bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300">
                {trust.heading.accent}
              </ShimmerText>
            </h3>
            <p className="mt-3 text-sm font-medium text-white/60 sm:text-base">
              {trust.subheading}
            </p>

            <ul
              role="list"
              className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-3.5"
            >
              {trust.points.map((point, index) => (
                <TrustPill key={point} label={point} index={index} inView={inView} />
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function ChooseNextStepSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    // pt-0 keeps the ScrollBeamDivider flush on the seam with the section above;
    // the top spacing is carried by the inner container's pt-* (matched to the
    // previous section's bottom padding so the beam sits centered on the seam).
    <section
      aria-labelledby="choose-next-step-heading"
      className="relative bg-white pt-0 pb-20 sm:pb-28"
    >
      <ScrollBeamDivider />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="cn-dot-grid absolute inset-0 opacity-40" />
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-purple-200/30 blur-[100px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-pink-200/30 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-14 sm:pt-20 lg:px-8 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-1.5 shadow-sm shadow-purple-100">
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            <span className="text-xs font-bold tracking-[0.16em] text-purple-700">
              {badge}
            </span>
          </span>
        </motion.div>

        <motion.h2
          id="choose-next-step-heading"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-center text-balance text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
        >
          {heading.lead}
          <ShimmerText className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500">
            {heading.accent}
          </ShimmerText>
        </motion.h2>

        <div className="mt-10 sm:mt-12">
          <MobileCtaScroller />
          <div className="hidden md:grid md:grid-cols-2 md:gap-8">
            {options.map((option, index) => (
              <CtaCard key={option.id} option={option} index={index} />
            ))}
          </div>
        </div>

        <TrustCapsule />
      </div>
    </section>
  );
}
