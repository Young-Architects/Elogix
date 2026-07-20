"use client";

/**
 * WhyExpendesk — "before vs after" capability comparison (id="why-expendesk").
 *
 * Two responsive presentations of the same `comparisons` data:
 *  - `TableView` (desktop, md+): a "list + spotlight" panel. The left column
 *    lists capabilities; the right shows full detail for the active one. It
 *    auto-rotates on a requestAnimationFrame progress timer (story-style
 *    segmented bars) and can be paused / jumped via the controls.
 *  - `CardView` (mobile, <md): a horizontal snap-scroll carousel of cards with
 *    dots and prev/next buttons; `measure()` tracks the active card on scroll.
 *
 * Both show a skeleton (`eb-skel`) for `LOAD_MS` after the section first enters
 * the viewport to fake a load-in, then the real content. `CtaPanel` renders the
 * closing dark CTA. Content + icon keys come from
 * `src/data/sections/why-expendesk.json` (typed as `WhyExpendeskData`); icon
 * keys map to Lucide via the `ICONS` registry. Most animations/effects
 * (beam, shimmer, orbs, skeleton) are CSS classes defined in globals.css.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  Sparkles,
  Check,
  X,
  Star,
  ArrowRight,
  ArrowLeftRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Workflow,
  Zap,
  Camera,
  BarChart3,
  ShieldCheck,
  Wallet,
  Gauge,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import ScrollBeamDivider from "../ui/ScrollBeamDivider";
import MagneticButton from "@/components/ui/MagneticButton";
import { LEAD_MAGNET_HREF, openAndDownloadLeadMagnet } from "@/lib/lead-magnet";
import type { WhyExpendeskData } from "@/types";
import rawContent from "@/data/sections/why-expendesk.json";

const content = rawContent as WhyExpendeskData;

/* =========================================================================
 * Icon registry
 * ========================================================================= */

const ICONS: Record<string, LucideIcon> = {
  Workflow,
  Zap,
  Camera,
  BarChart3,
  ShieldCheck,
  Wallet,
  Gauge,
  TrendingUp,
};

/* =========================================================================
 * Motion config
 * ========================================================================= */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function useMotion() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 },
    },
  };

  const fade: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  };

  return { container, fade };
}

/* =========================================================================
 * GradientUnderline
 * ========================================================================= */

function GradientUnderline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 340 20"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -bottom-3 left-0 h-4 w-full"
      style={{ filter: "drop-shadow(0 3px 12px rgba(124,58,237,.55))" }}
    >
      <defs>
        <linearGradient id="eb-ul" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#5B21B6" />
          <stop offset="35%"  stopColor="#7C3AED" />
          <stop offset="65%"  stopColor="#A855F7" />
          <stop offset="100%" stopColor="#E879F9" />
        </linearGradient>
      </defs>
      <path
        d="M10 15 C 95 5 248 4 330 12"
        fill="none"
        stroke="url(#eb-ul)"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.16"
      />
      <path
        d="M10 15 C 95 5 248 4 330 12"
        fill="none"
        stroke="url(#eb-ul)"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================================
 * TableView — desktop "list + spotlight" comparison panel
 * ========================================================================= */

const ROTATE_MS = 4200;

function TableView({ loading }: { loading: boolean }) {
  const { fade } = useMotion();
  const { columns, comparisons } = content;

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing || loading) return;
    let start: number | null = null;

    const tick = (t: number) => {
      if (start === null) start = t;
      const elapsed = t - start;
      const pct = Math.min(100, (elapsed / ROTATE_MS) * 100);
      setProgress(pct);
      if (elapsed >= ROTATE_MS) {
        setActive((a) => (a + 1) % comparisons.length);
        start = t;
        setProgress(0);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, loading, comparisons.length]);

  const selectRow = (i: number) => {
    setActive(i);
    setPlaying(false);
    setProgress(0);
  };

  const togglePlaying = () => setPlaying((p) => !p);

  const activeItem = comparisons[active];
  const SpotlightIcon = ICONS[activeItem.icon] ?? Workflow;

  return (
    <motion.div variants={fade} className="mt-10 hidden md:block">
      <div
        className="relative overflow-hidden rounded-[32px] p-[2px]"
        style={{
          boxShadow:
            "0 4px 6px rgba(16,24,40,0.04), 0 36px 80px -28px rgba(76,29,149,0.30)",
        }}
      >
        <span
          aria-hidden="true"
          className="eb-beam-new pointer-events-none absolute -inset-[50%] z-0"
        />

        <div className="relative z-10 overflow-hidden rounded-[30px] bg-white">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-32 rounded-t-[30px] bg-gradient-to-b from-violet-50/40 to-transparent"
          />

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="relative z-10"
              >
                <div className="flex items-center gap-3 px-6 pt-6 lg:px-7">
                  <div className="flex flex-1 gap-1.5">
                    {Array.from({ length: comparisons.length }).map((_, i) => (
                      <div key={i} className="eb-skel h-1 flex-1 rounded-full" />
                    ))}
                  </div>
                  <div className="eb-skel h-7 w-7 shrink-0 rounded-full" />
                </div>

                <div className="grid lg:grid-cols-[1fr_1.3fr]">
                  <div className="flex flex-col gap-1 p-6 lg:border-r lg:border-slate-100 lg:p-7">
                    <div className="eb-skel mb-3 ml-3 h-2.5 w-20 rounded-full" />
                    {Array.from({ length: comparisons.length }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-2xl px-3 py-2.5">
                        <div className="eb-skel h-9 w-9 shrink-0 rounded-xl" />
                        <div className="flex-1 space-y-1.5">
                          <div className="eb-skel h-3 w-24 rounded-full" />
                          <div className="eb-skel h-2.5 w-32 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 lg:p-8">
                    <div className="flex items-center justify-between gap-3">
                      <div className="eb-skel h-6 w-24 rounded-full" />
                      <div className="eb-skel h-11 w-16 rounded-[10px]" />
                    </div>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="eb-skel h-12 w-12 rounded-2xl" />
                      <div className="eb-skel h-5 w-36 rounded-full" />
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="eb-skel h-20 rounded-2xl" />
                      <div className="eb-skel h-20 rounded-2xl" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="eb-skel h-3 w-full rounded-full" />
                      <div className="eb-skel h-3 w-2/3 rounded-full" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="relative z-10"
              >
                {/* Story-style segmented progress / quick-jump nav */}
                <div className="flex items-center gap-3 px-6 pt-6 lg:px-7">
                  <div className="flex flex-1 gap-1.5">
                    {comparisons.map((c, i) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => selectRow(i)}
                        aria-label={`Jump to ${c.aspect}`}
                        className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100"
                      >
                        <span
                          className="block h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
                          style={{
                            width: `${i < active ? 100 : i === active ? progress : 0}%`,
                            transition: i === active ? "none" : "width .3s ease",
                          }}
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={togglePlaying}
                    aria-label={playing ? "Pause auto-play" : "Resume auto-play"}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-50 text-violet-600 ring-1 ring-violet-200 transition-colors duration-200 hover:bg-violet-100"
                  >
                    {playing ? (
                      <Pause className="h-3 w-3" strokeWidth={2.5} />
                    ) : (
                      <Play className="ml-[1px] h-3 w-3" strokeWidth={2.5} />
                    )}
                  </button>
                </div>

                {/* List + Spotlight */}
                <div className="grid lg:grid-cols-[1fr_1.3fr]">
                  <div className="flex flex-col gap-1 p-6 lg:border-r lg:border-slate-100 lg:p-7">
                    <span className="mb-2 px-3 text-[9.5px] font-extrabold uppercase tracking-[0.28em] text-violet-500">
                      {columns.aspect}
                    </span>

                    {comparisons.map((c, i) => {
                      const Icon = ICONS[c.icon] ?? Workflow;
                      const isActive = i === active;

                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => selectRow(i)}
                          aria-pressed={isActive}
                          className={[
                            "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-violet-400/60",
                            isActive
                              ? "bg-gradient-to-r from-violet-50 to-fuchsia-50/60 ring-1 ring-violet-200"
                              : "hover:bg-slate-50",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-all duration-300",
                              isActive
                                ? "bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-md shadow-violet-500/30"
                                : "bg-violet-50 text-violet-500 group-hover:bg-violet-100",
                            ].join(" ")}
                          >
                            <Icon className="h-4 w-4" strokeWidth={2.3} />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-bold tracking-tight text-slate-800">
                              {c.aspect}
                            </span>
                            <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-700">
                              <span className="truncate line-through decoration-rose-500">
                                {c.before}
                              </span>
                              <ArrowRight className="h-2.5 w-2.5 shrink-0 text-violet-700" />
                              <span className="truncate font-semibold text-violet-600">
                                {c.after}
                              </span>
                            </span>
                          </span>

                          <span
                            className={[
                              "h-2 w-2 shrink-0 rounded-full transition-all duration-300",
                              isActive
                                ? "bg-gradient-to-br from-violet-600 to-fuchsia-500"
                                : "bg-transparent",
                            ].join(" ")}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Spotlight: full detail for the active capability */}
                  <div
                    aria-live="polite"
                    className="relative flex flex-col justify-center overflow-hidden p-6 lg:p-8"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-50/60 via-transparent to-fuchsia-50/50"
                    />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeItem.id}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -14 }}
                        transition={{ duration: 0.32, ease: EASE }}
                        className="relative z-10"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="eb-shimmer inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-violet-500/30">
                            <Star className="eb-star h-2.5 w-2.5 fill-white" strokeWidth={0} />
                            {columns.after.tag}
                          </span>
                          <span className="shrink-0 rounded-[10px] bg-white px-3 py-1.5 text-center shadow-sm ring-1 ring-violet-200">
                            <span className="block text-[15px] font-black leading-tight text-violet-700">
                              {activeItem.metric}
                            </span>
                            <span className="block text-[8px] font-bold uppercase leading-tight tracking-wide text-violet-500">
                              {activeItem.metricLabel}
                            </span>
                          </span>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-xl shadow-violet-500/30">
                            <SpotlightIcon className="h-5 w-5" strokeWidth={2.2} />
                          </span>
                          <h3 className="text-[20px] font-extrabold tracking-tight text-slate-900">
                            {activeItem.aspect}
                          </h3>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-2xl bg-rose-50 p-4 ring-1 ring-rose-100">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-500">
                              <X className="h-3 w-3" strokeWidth={3} />
                              {columns.before.label}
                            </span>
                            <span className="mt-2 block text-[15px] font-semibold leading-snug text-slate-600 line-through decoration-rose-700">
                              {activeItem.before}
                            </span>
                          </div>
                          <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4 ring-1 ring-violet-200">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-600">
                              <Check className="h-3 w-3" strokeWidth={3} />
                              {columns.after.label}
                            </span>
                            <span className="mt-2 block text-[15px] font-bold leading-snug text-slate-900">
                              {activeItem.after}
                            </span>
                          </div>
                        </div>

                        <p className="mt-4 text-[13.5px] font-medium leading-relaxed text-slate-600">
                          {activeItem.detail}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
 * CardView — mobile / tablet carousel
 * ========================================================================= */

function CardView({ loading }: { loading: boolean }) {
  const { columns, comparisons } = content;
  const cardCount = comparisons.length;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [interacted, setInteracted] = useState(false);

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const children = Array.from(el.children) as HTMLElement[];
    let closestIdx = 0;
    let closestDist = Infinity;
    children.forEach((child, idx) => {
      const dist = Math.abs(child.offsetLeft - el.scrollLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = idx;
      }
    });

    setActive(closestIdx);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(measure);
    setInteracted(true);
  }, [measure]);

  useEffect(() => {
    if (loading) return;
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, loading]);

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => setInteracted(true), 4500);
    return () => clearTimeout(t);
  }, [loading]);

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(cardCount - 1, i));
    const child = el.children[clamped] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft - 16, behavior: "smooth" });
  };

  return (
    <div className="mt-12 md:hidden">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <div className="mb-4 flex items-center justify-between px-1">
              <div className="eb-skel h-5 w-12 rounded-full" />
              <div className="eb-skel h-4 w-28 rounded-full" />
            </div>

            <div className="eb-no-scrollbar flex gap-4 overflow-x-hidden px-4 pb-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[82vw] max-w-[320px] shrink-0 rounded-[24px] border border-slate-200 bg-white p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="eb-skel h-11 w-11 shrink-0 rounded-2xl" />
                    <div className="eb-skel h-4 flex-1 rounded-full" />
                    <div className="eb-skel h-11 w-12 shrink-0 rounded-[10px]" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="eb-skel h-14 flex-1 rounded-2xl" />
                    <div className="eb-skel h-14 flex-1 rounded-2xl" />
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <div className="eb-skel h-2.5 w-full rounded-full" />
                    <div className="eb-skel h-2.5 w-2/3 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5">
              {Array.from({ length: cardCount }).map((_, i) => (
                <div key={i} className="eb-skel h-1.5 w-1.5 rounded-full" />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="mb-4 flex items-center justify-between px-1">
              <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-bold tracking-wide text-violet-600 ring-1 ring-violet-200">
                {active + 1} <span className="text-violet-300">/</span> {cardCount}
              </span>

              {!interacted && (
                <span className="eb-swipe-hint flex items-center gap-1.5 text-[11px] font-semibold text-violet-400">
                  Swipe to compare
                  <ArrowLeftRight className="h-3.5 w-3.5" strokeWidth={2.4} />
                </span>
              )}
            </div>

            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-gradient-to-r from-[#FAFAFF] to-transparent transition-opacity duration-300"
                style={{ opacity: atStart ? 0 : 1 }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-[#FAFAFF] to-transparent transition-opacity duration-300"
                style={{ opacity: atEnd ? 0 : 1 }}
              />

              <button
                type="button"
                aria-label="Previous comparison"
                onClick={() => scrollToIndex(active - 1)}
                style={{ opacity: atStart ? 0 : 1, pointerEvents: atStart ? "none" : "auto" }}
                className="eb-nav-btn absolute left-1.5 top-1/2 z-30 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white text-violet-600 shadow-lg shadow-violet-900/10 ring-1 ring-violet-100"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.6} />
              </button>
              <button
                type="button"
                aria-label="Next comparison"
                onClick={() => scrollToIndex(active + 1)}
                style={{ opacity: atEnd ? 0 : 1, pointerEvents: atEnd ? "none" : "auto" }}
                className="eb-nav-btn absolute right-1.5 top-1/2 z-30 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white text-violet-600 shadow-lg shadow-violet-900/10 ring-1 ring-violet-100"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.6} />
              </button>

              <div
                ref={scrollerRef}
                onScroll={handleScroll}
                role="region"
                aria-label="Feature comparison — swipe to browse"
                className="eb-no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth scroll-pl-4 scroll-pr-4 px-4 pb-2"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {comparisons.map((c, i) => {
                  const Icon = ICONS[c.icon] ?? Workflow;
                  const isActive = i === active;

                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                      className="w-[82vw] max-w-[320px] shrink-0 snap-start"
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => scrollToIndex(i)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") scrollToIndex(i);
                        }}
                        className={[
                          "flex h-full cursor-pointer flex-col justify-between rounded-[24px] border bg-white p-5 outline-none transition-all duration-300",
                          isActive
                            ? "scale-100 border-violet-200 shadow-[0_4px_8px_rgba(16,24,40,0.08),0_24px_48px_-18px_rgba(76,29,149,0.30)]"
                            : "scale-[0.96] border-slate-200 shadow-[0_2px_4px_rgba(16,24,40,0.05),0_16px_36px_-20px_rgba(76,29,149,0.16)]",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25">
                            <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                          </span>
                          <span className="flex-1 text-[15px] font-bold tracking-tight text-slate-800">
                            {c.aspect}
                          </span>
                          <span className="shrink-0 rounded-[10px] bg-violet-50 px-2.5 py-1.5 text-center ring-1 ring-violet-200">
                            <span className="block text-[12px] font-black leading-tight tracking-tight text-violet-700">
                              {c.metric}
                            </span>
                            <span className="block text-[7px] font-bold uppercase leading-tight tracking-wide text-violet-500">
                              {c.metricLabel}
                            </span>
                          </span>
                        </div>

                        <div className="mt-4 flex items-stretch gap-2">
                          <div className="flex-1 rounded-2xl bg-rose-50 px-3 py-2.5 ring-1 ring-rose-100">
                            <span className="block text-[8px] font-bold uppercase tracking-wider text-rose-400">
                              {columns.before.label}
                            </span>
                            <span className="mt-1 flex items-start gap-1.5 text-[12px] font-semibold leading-snug text-slate-500 line-through decoration-rose-600">
                              <X className="mt-[1px] h-3 w-3 shrink-0 text-rose-600" strokeWidth={3} />
                              {c.before}
                            </span>
                          </div>

                          <span className="flex shrink-0 items-center text-violet-300">
                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                          </span>

                          <div className="flex-1 rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 px-3 py-2.5 ring-1 ring-violet-200">
                            <span className="block bg-gradient-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-[8px] font-bold uppercase tracking-wider text-transparent">
                              {columns.after.label}
                            </span>
                            <span className="mt-1 flex items-start gap-1.5 text-[12px] font-bold leading-snug text-slate-800">
                              <Check className="mt-[1px] h-3 w-3 shrink-0 text-emerald-500" strokeWidth={3} />
                              {c.after}
                            </span>
                          </div>
                        </div>

                        <p className="eb-clamp-3 mt-4 text-[12px] font-medium leading-relaxed text-slate-500">
                          {c.detail}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-1.5">
              {comparisons.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  aria-label={`Go to ${c.aspect}`}
                  onClick={() => scrollToIndex(i)}
                  className={[
                    "h-1.5 rounded-full transition-all duration-300",
                    i === active
                      ? "w-6 bg-gradient-to-r from-violet-600 to-fuchsia-500"
                      : "w-1.5 bg-slate-200",
                  ].join(" ")}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================================
 * CtaPanel — closing copy block under the comparison card
 * ========================================================================= */

function CtaPanel() {
  const { fade } = useMotion();
  const { cta } = content;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fade}
      className="mt-10 md:mt-14"
    >
      <div
        className="relative overflow-hidden rounded-[32px] px-6 py-14 text-center ring-1 ring-white/[0.06] sm:px-10 sm:py-16 lg:px-16 lg:py-20"
        style={{
          background: "linear-gradient(180deg, #14101F 0%, #0A0814 60%, #07050D 100%)",
          boxShadow:
            "0 50px 100px -30px rgba(8,5,18,0.65), 0 0 0 1px rgba(255,255,255,0.03)",
        }}
      >
        <div aria-hidden="true" className="eb-grain pointer-events-none absolute inset-0 opacity-[0.05]" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[340px] w-[620px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-50 blur-[90px]"
          style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.35), transparent 70%)" }}
        />

        <div
          aria-hidden="true"
          className="eb-orb-1 pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]"
        />
        <div
          aria-hidden="true"
          className="eb-orb-2 pointer-events-none absolute -left-20 -bottom-24 h-64 w-64 rounded-full bg-fuchsia-700/15 blur-[100px]"
        />

        <div className="relative z-10 mx-auto max-w-2xl">
          <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-[2.4rem]">
            {cta.heading}
          </h3>

          <p className="mx-auto mt-3 max-w-lg text-[16px] font-bold leading-snug sm:text-[19px]">
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-200 bg-clip-text text-transparent">
              {cta.subheading}
            </span>
          </p>

          <p className="mx-auto mt-4 max-w-md text-[14.5px] font-medium leading-relaxed text-violet-200/65 sm:text-[15px]">
            {cta.body}
          </p>

          {/* Highlight chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {cta.highlights.map((h) => (
              <span
                key={h}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11.5px] font-semibold text-violet-100/80 backdrop-blur-sm"
              >
                <Check className="h-3 w-3 shrink-0 text-fuchsia-400" strokeWidth={3} />
                {h}
              </span>
            ))}
          </div>

          <p className="mt-8 text-[10.5px] font-bold uppercase tracking-[0.22em] text-violet-400">
            {cta.prompt}
          </p>

          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticButton
              href={cta.buttonHref}
              variant="primary"
              className="w-full rounded-full px-7 py-3.5 text-[15px] shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:w-auto"
              icon={<ArrowRight className="h-4 w-4" strokeWidth={2.6} />}
            >
              {cta.button}
            </MagneticButton>
            <MagneticButton
              href={LEAD_MAGNET_HREF}
              onClick={openAndDownloadLeadMagnet}
              variant="secondary"
              className="w-full rounded-full px-6 py-3.5 text-[13.5px] text-violet-100 sm:w-auto"
              icon={<BookOpen className="h-4 w-4" strokeWidth={2.2} />}
            >
              {cta.secondaryButton.label}
            </MagneticButton>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-x-3 gap-y-1.5 text-[12px] font-medium text-violet-300/50 sm:flex-row">
            {cta.trustPoints.map((point, i) => (
              <span key={point} className="flex items-center gap-1.5">
                <Check className="h-3 w-3 shrink-0 text-violet-400" strokeWidth={3} />
                {point}
                {i < cta.trustPoints.length - 1 && (
                  <span className="hidden text-violet-700 sm:inline">·</span>
                )}
              </span>
            ))}
            <span className="hidden text-violet-700 sm:inline">·</span>
            <span>{cta.note}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================================
 * WhyExpendesk — main section export
 * ========================================================================= */

const LOAD_MS = 650;

export default function WhyExpendesk() {
  const { container, fade } = useMotion();
  const { badge, heading, subheading } = content;

  const revealRef = useRef<HTMLDivElement>(null);
  const inView = useInView(revealRef, { once: true, margin: "-80px" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setLoading(false), LOAD_MS);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <section
      id="why-expendesk"
      aria-labelledby="why-expendesk-title"
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#FAFAFF] to-[#F0EEFF] pb-16 pt-0 md:pb-20"
    >
      <ScrollBeamDivider />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(124,58,237,0.14) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 78% 58% at 50% 0%, #000 10%, transparent 68%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 78% 58% at 50% 0%, #000 10%, transparent 68%)",
        }}
      />

      <div
        aria-hidden="true"
        className="eb-orb-1 pointer-events-none absolute -right-28 top-8 h-[520px] w-[520px] rounded-full bg-violet-200/20 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="eb-orb-2 pointer-events-none absolute -left-28 bottom-8 h-[440px] w-[440px] rounded-full bg-fuchsia-200/20 blur-[100px]"
      />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-6">
        <motion.div
          ref={revealRef}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          <div className="mx-auto max-w-2xl text-center">
            <motion.span
              variants={fade}
              className="eb-shimmer mt-8 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-1.5 text-sm font-semibold text-violet-700 shadow-lg shadow-violet-200/50"
            >
              <Sparkles className="h-4 w-4 text-fuchsia-500" />
              {badge}
            </motion.span>

            <motion.h2
              id="why-expendesk-title"
              variants={fade}
              className="mt-4 text-3xl font-extrabold leading-[1.08] tracking-[-0.025em] text-slate-900 sm:text-4xl lg:text-[3.1rem]"
            >
              <span className="block">{heading.lead}</span>
              <span className="relative mt-1 inline-block">
                <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                  {heading.highlight}
                </span>
                <GradientUnderline />
              </span>
            </motion.h2>

            <motion.p
              variants={fade}
              className="mx-auto mt-5 max-w-lg text-base font-medium leading-relaxed text-slate-600 sm:text-[17px]"
            >
              {subheading}
            </motion.p>
          </div>

          <TableView loading={loading} />

          <CardView loading={loading} />

          <CtaPanel />
        </motion.div>
      </div>
    </section>
  );
}
