"use client";

/**
 * ProblemSection — "root causes → chaos → consequences" flow diagram
 * (id="problem").
 *
 * The visual is a 3-column grid (cause cards | central "CHAOS POINT" node |
 * effect cards) with animated SVG connector lines drawn between them.
 * `ConnectorLines` measures the real DOM positions of each card and the centre
 * node (via refs + getBoundingClientRect) to compute Bézier paths, then
 * re-measures on resize through a ResizeObserver. Because positions are measured
 * at runtime, the same markup works across all breakpoints.
 *
 * Cards, stats and CTA copy come from `src/data/sections/problem.json`. Icons in
 * this section are plain emoji stored directly in the JSON (no Lucide registry).
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import ScrollBeamDivider from "../ui/ScrollBeamDivider";
import MagneticButton from "@/components/ui/MagneticButton";
import problemData from "@/data/sections/problem.json";

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */

interface CauseItem {
  id: string;
  icon: string;
  title: string;
  sub: string;
  tag: string | null;
  tagColor: string;
}

interface EffectItem {
  id: string;
  icon: string;
  title: string;
  badge: string;
  badgeStyle: string;
  iconBg: string;
  accentColor: string;
}

const CAUSES = problemData.causes as unknown as CauseItem[];
const EFFECTS = problemData.effects as unknown as EffectItem[];

// The bottom-CTA headline is authored as ONE sentence in the JSON
// ("<setup>, <payoff>") so the CMS keeps a single editable field. We split on
// the first comma so the setup and the payoff can each own a line — the payoff
// is the part that carries the gradient. Falls back to a single line if the
// copy is ever edited to drop the comma.
const [BOTTOM_CTA_LEAD, BOTTOM_CTA_ACCENT] = (() => {
  const h = problemData.bottomCta.heading;
  const i = h.indexOf(",");
  return i === -1 ? [h, ""] : [h.slice(0, i), h.slice(i + 1).trim()];
})();

/* ═══════════════════════════════════════
   SVG CONNECTOR LINES — responsive, always visible
═══════════════════════════════════════ */

interface PathDef {
  id: string;
  d: string;
  color: string;
  delay: number;
}

// Connector stroke colours, keyed by index. Module-scoped constants so they
// keep a stable identity across renders (no need to list them as hook deps).
const CAUSE_COLORS = ["#7c3aed", "#7c3aed", "#7c3aed", "#7c3aed"];
const EFFECT_COLORS = ["#94a3b8", "#ef4444", "#f43f5e", "#f97316", "#e11d48"];

// Dot colours for the escalation pills — violet deepening to rose as the
// pressure builds toward the chaos point.
const ESCALATION_DOTS = ["#a78bfa", "#8b5cf6", "#7c3aed", "#d946ef", "#f43f5e"];

function ConnectorLines({
  causeEls,
  effectEls,
  chaosRef,
  svgWrapRef,
  ready,
}: {
  causeEls: React.MutableRefObject<(HTMLDivElement | null)[]>;
  effectEls: React.MutableRefObject<(HTMLDivElement | null)[]>;
  chaosRef: React.RefObject<HTMLDivElement | null>;
  svgWrapRef: React.RefObject<HTMLDivElement | null>;
  ready: boolean;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<PathDef[]>([]);

  const buildPaths = useCallback(() => {
    const svg = svgRef.current;
    const chaos = chaosRef.current;
    const wrap = svgWrapRef.current;
    if (!svg || !chaos || !wrap) return;

    const SR = svg.getBoundingClientRect();
    const CR = chaos.getBoundingClientRect();
    const cx = CR.left + CR.width / 2 - SR.left;
    const cy = CR.top + CR.height / 2 - SR.top;

    const built: PathDef[] = [];

    causeEls.current.forEach((el, i) => {
      if (!el) return;
      const R = el.getBoundingClientRect();
      const sx = R.right - SR.left;
      const sy = R.top + R.height / 2 - SR.top;
      const cp1x = sx + (cx - sx) * 0.5;
      const cp2x = cx - (cx - sx) * 0.12;
      built.push({
        id: `c${i}`,
        d: `M${sx},${sy} C${cp1x},${sy} ${cp2x},${cy} ${cx},${cy}`,
        color: CAUSE_COLORS[i] ?? "#7c3aed",
        delay: i * 0.08,
      });
    });

    effectEls.current.forEach((el, i) => {
      if (!el) return;
      const R = el.getBoundingClientRect();
      const ex = R.left - SR.left;
      const ey = R.top + R.height / 2 - SR.top;
      const cp1x = cx + (ex - cx) * 0.12;
      const cp2x = ex - (ex - cx) * 0.5;
      built.push({
        id: `e${i}`,
        d: `M${cx},${cy} C${cp1x},${cy} ${cp2x},${ey} ${ex},${ey}`,
        color: EFFECT_COLORS[i] ?? "#f43f5e",
        delay: 0.38 + i * 0.08,
      });
    });

    setPaths(built);
  }, [causeEls, effectEls, chaosRef, svgWrapRef]);

  useEffect(() => {
    if (!ready) return;
    const id = setTimeout(buildPaths, 300);
    return () => clearTimeout(id);
  }, [ready, buildPaths]);

  useEffect(() => {
    if (!ready) return;
    const ro = new ResizeObserver(() => {
      setPaths([]);
      setTimeout(buildPaths, 80);
    });
    if (svgWrapRef.current) ro.observe(svgWrapRef.current);
    return () => ro.disconnect();
  }, [ready, buildPaths, svgWrapRef]);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ overflow: "visible", zIndex: 1 }}
    >
      <defs>
        {paths.map(({ id, color }) => (
          <marker
            key={`mk-${id}`}
            id={`arrow-${id}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path
              d="M2 2L8 5L2 8"
              fill="none"
              stroke={color}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        ))}
      </defs>
      {paths.map(({ id, d, color, delay }) => (
        <motion.path
          key={id}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="5 4"
          markerEnd={`url(#arrow-${id})`}
          opacity={0}
          initial={{ pathLength: 0, opacity: 0, strokeDashoffset: 0 }}
          animate={{ pathLength: 1, opacity: 0.8, strokeDashoffset: -40 }}
          transition={{
            pathLength: { duration: 1, delay, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 1, delay, ease: [0.4, 0, 0.2, 1] },
            strokeDashoffset: { duration: 1.5, delay: delay + 0.8, repeat: Infinity, ease: "linear" }
          }}
        />
      ))}
    </svg>
  );
}



/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const chaosRef   = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const causeEls   = useRef<(HTMLDivElement | null)[]>([]);
  const effectEls  = useRef<(HTMLDivElement | null)[]>([]);

  const isInView = useInView(sectionRef, { once: true, amount: 0.08 });

  /* shared animation variants */
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (d: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        delay: d,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    }),
  };

  const slideLeft = (i: number) => ({
    initial: { opacity: 0, x: -28 },
    animate: isInView ? { opacity: 1, x: 0 } : {},
    transition: {
      delay: 0.1 + i * 0.1,
      duration: 0.52,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  });

  const slideRight = (i: number) => ({
    initial: { opacity: 0, x: 28 },
    animate: isInView ? { opacity: 1, x: 0 } : {},
    transition: {
      delay: 0.45 + i * 0.09,
      duration: 0.52,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  });

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#f8f9ff] via-[#f1f3fe] to-[#eceef8] pb-20 md:pb-28 pt-0"
    >
      <ScrollBeamDivider />
      
      {/* Ambient mesh — no dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(124,58,237,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(244,63,94,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section label — matches the "THE SOLUTION" badge in SolutionSection
            exactly (uppercase, widely tracked, same tint/border/ink) so the two
            paired sections read as one system. `uppercase` is applied in CSS,
            so the JSON copy stays sentence-case and editable. */}
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 mb-4"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[14px] font-semibold tracking-widest uppercase"
              style={{
                background: "rgba(124,58,237,0.07)",
                border: "1px solid rgba(139,92,246,0.25)",
                color: "#7c3aed",
              }}
            >
              <Sparkles className="w-4 h-4" />
              {problemData.sectionLabel}
            </span>
          </motion.div>

        {/* Headline */}
        <motion.h2
          custom={0.07}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="mb-4 max-w-3xl text-[2.4rem] font-black leading-[1.06] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.3rem]"
        >
          {problemData.headline.line1}{" "}
          <br className="hidden sm:block" />
          {problemData.headline.line2}{" "}
          <span
            className="text-violet-600"
            style={{
              textDecoration: "underline",
              textDecorationStyle: "wavy",
              textDecorationColor: "#a78bfa",
              textUnderlineOffset: "7px",
            }}
          >
            {problemData.headline.accent}
          </span>
        </motion.h2>

        {/* ── Sub-heading ──
            Two-tone hierarchy: the lead statement carries the weight in
            near-black, and the consequence trails behind it in a lighter grey
            — so the eye lands on the claim first and reads the qualifier
            second, instead of meeting one flat wall of grey.
            `max-w-2xl` holds the measure to ~55-65 characters at these sizes,
            which is the readable range; without it the lines run too long on
            wide screens. */}
        <div className="mb-6 max-w-2xl space-y-2.5 mt-8 sm:space-y-0">
          <motion.p
            custom={0.15}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="text-[17px] font-semibold leading-[1.45] tracking-[-0.01em] text-slate-900 sm:text-[22px] lg:text-[22px]"
          >
            {problemData.description}
          </motion.p>

          <motion.p
            custom={0.3}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            className="text-[17px] leading-[1.45] tracking-[-0.01em] text-slate-500 sm:text-[19px] lg:text-[21px] mt-0"
          >
            {problemData.closingLine}
          </motion.p>
        </div>
        {/* Escalation pills — the "More…" build-up toward the chaos point */}
        <div className="mb-5 flex max-w-2xl flex-wrap items-center gap-x-2.5 gap-y-2.5">
          {problemData.escalation.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, y: 8, scale: 0.94 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.22 + i * 0.09, duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
              // whitespace-nowrap keeps each pill a single unit — a wrapped
              // pill label reads as two broken chips. The row already wraps.
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200/80 bg-white/70 px-3.5 py-1.5 text-[14px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm sm:text-[15px]"
            >
              <span
                className="h-2 w-2 flex-shrink-0 rounded-full"
                style={{ backgroundColor: ESCALATION_DOTS[i] ?? "#7c3aed" }}
              />
              {item}
            </motion.span>
          ))}
        </div>


        {/* ── "The result?" — the hinge between the copy above and the diagram
             below. Promoted from a plain line of text to a highlighted pill so
             it reads as a deliberate transition marker rather than another
             paragraph. Borrows the section's existing language: the rounded-full
             pill shape of the badge + escalation chips, and the violet→rose
             gradient used by the connector lines and bottom CTA — so it feels
             highlighted without introducing a new visual idea.
             `w-fit` keeps the pill hugging its text at every width. */}
        <motion.div
          custom={0.38}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="mb-6 flex w-fit items-center gap-2.5 rounded-full border border-violet-200/70 bg-gradient-to-r from-violet-100/90 via-fuchsia-50/80 to-rose-100/70 px-4 py-2 shadow-[0_2px_10px_rgba(124,58,237,0.10)] backdrop-blur-sm sm:gap-3 sm:px-5 sm:py-2.5"
        >
          <span className="text-[17px] font-extrabold tracking-tight text-slate-900 sm:text-[19px] lg:text-[20px]">
            {problemData.resultLead}
          </span>

          {/* Filled chip instead of a bare "↓" glyph — a solid arrow reads as a
              direction cue at a glance and keeps its weight at small sizes,
              where a text arrow gets thin and easy to miss. */}
          <motion.span
            aria-hidden
            animate={{ y: [0, 3, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-rose-500 text-white shadow-sm sm:h-7 sm:w-7"
          >
            <ArrowDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={3} />
          </motion.span>
        </motion.div>

        {/* ═══ DIAGRAM CARD ═══ */}
        <motion.div
          custom={0.46}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="relative rounded-3xl w-full"
        >
          {/* Premium Border Beam Effect */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl z-0 pointer-events-none">
            <div
              className="absolute inset-[-100%] animate-[spin_5s_linear_infinite]"
              style={{
                background: "conic-gradient(from 0deg, transparent 80%, rgba(124,58,237,0.4) 90%, rgba(244,63,94,0.4) 100%)"
              }}
            />
          </div>

          {/* Premium Glassmorphism Background */}
          <div className="absolute inset-[1px] rounded-[calc(1.5rem-1px)] bg-white/80 backdrop-blur-2xl z-0 pointer-events-none" />
          <div className="absolute inset-[1px] rounded-[calc(1.5rem-1px)] border border-white/60 z-0 pointer-events-none" style={{ boxShadow: "0 2px 0 rgba(255,255,255,0.8) inset" }} />

          {/* inner top glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[1px] rounded-[calc(1.5rem-1px)] z-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,58,237,0.08) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10 w-full rounded-[calc(1.5rem-1px)]">
            <div ref={svgWrapRef} className="w-full relative">

              {/* ── Column header bar ── */}
              <div className="grid grid-cols-[minmax(0,1fr)_66px_minmax(0,1fr)] sm:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_156px_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_176px_minmax(0,1fr)] border-b border-white/40">
                <div className="flex items-center min-w-0 gap-1.5 sm:gap-2.5 px-2 sm:px-7 py-2.5 sm:py-3.5">
                  {/* <span className="flex h-[17px] w-[17px] sm:h-[22px] sm:w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-violet-100/80 text-[8px] sm:text-[10px] font-black text-violet-600 shadow-sm">←</span> */}
                  <span className="text-[16px] sm:text-[20px] font-extrabold uppercase text-slate-700 truncate">
                    Root Causes
                  </span>
                </div>
                {/* centre spacer */}
                <div className="border-x border-white/40" />
                <div className="flex items-center min-w-0 justify-end md:justify-start gap-1.5 sm:gap-2.5 border-l border-white/40 px-2 sm:px-7 py-2.5 sm:py-3.5">
                  <span className="text-[16px] sm:text-[20px] font-extrabold uppercase text-slate-700 truncate">
                    Consequences
                  </span>
                  {/* <span className="flex h-[17px] w-[17px] sm:h-[22px] sm:w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-rose-100/80 text-[8px] sm:text-[10px] font-black text-rose-500 shadow-sm">→</span> */}
                </div>
              </div>

              {/* ── Main diagram body ── */}
              <div className="relative px-1.5 py-4 sm:px-8 sm:py-10 overflow-hidden w-full">

                {/* SVG lines - responsive, always visible on all screen sizes */}
                <ConnectorLines
                  causeEls={causeEls}
                  effectEls={effectEls}
                  chaosRef={chaosRef}
                  svgWrapRef={svgWrapRef}
                  ready={isInView}
                />

                {/* ── UNIFIED FLOWCHART GRID - same structure for all screen sizes ── */}
                <div className="relative z-10 w-full grid items-center gap-0 grid-cols-[minmax(0,1fr)_66px_minmax(0,1fr)] sm:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_156px_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_176px_minmax(0,1fr)]">

                  {/* LEFT: Cause cards */}
                  <div className="flex flex-col gap-2 sm:gap-3 pr-1 sm:pr-2 min-w-0">
                    {CAUSES.map((c, i) => (
                      <div key={c.id} className="relative w-full min-w-0">
                        {/* {c.tag && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.28 + i * 0.08, duration: 0.32 }}
                            className={`mb-1 sm:mb-1.5 inline-flex items-center gap-1 sm:gap-1.5 rounded-full border px-2 sm:px-2.5 py-[2.5px] sm:py-[3.5px] text-[8.5px] sm:text-[11.5px] font-bold tracking-wide max-w-full ${c.tagColor}`}
                          >
                            <span className="flex-shrink-0 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-current opacity-70" />
                            <span className="truncate">{c.tag}</span>
                          </motion.div>
                        )} */}
                        <motion.div
                          ref={(el) => { causeEls.current[i] = el; }}
                          {...slideLeft(i)}
                          className="group w-full relative flex cursor-default items-center sm:items-start gap-1.5 sm:gap-3 overflow-hidden rounded-xl sm:rounded-2xl border border-white/80 bg-white/88 p-1.5 sm:px-4 sm:py-3.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-[2px] hover:border-violet-200/80 hover:shadow-[0_6px_24px_rgba(124,58,237,0.10)]"
                        >
                          <div className="absolute left-0 top-2 bottom-2 w-[2px] sm:w-[3px] rounded-r-full bg-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
                          <div className="flex h-6 w-6 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-violet-50 text-[12px] sm:text-[18px] ring-1 ring-violet-200/50 transition-transform duration-300 group-hover:scale-105">
                            {c.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10.5px] sm:text-[15px] font-bold leading-[1.15] sm:leading-tight text-slate-800 break-words whitespace-normal">{c.title}</p>
                            <p className="hidden sm:block mt-0.5 text-[13px] leading-snug text-slate-500 break-words">{c.sub}</p>
                          </div>
                        </motion.div>
                      </div>
                    ))}
                  </div>

                  {/* CENTRE: Chaos node */}
                  <div className="flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.32, duration: 0.72, type: "spring", bounce: 0.38 }}
                      className="relative flex items-center justify-center"
                    >
                      {[0, 1, 2].map((n) => (
                        <motion.span
                          key={n}
                          aria-hidden
                          className="absolute rounded-full bg-rose-400/15"
                          style={{ inset: -(n + 1) * 10 }}
                          animate={{ scale: [1, 1 + (n + 1) * 0.18], opacity: [0.22 - n * 0.06, 0] }}
                          transition={{ repeat: Infinity, duration: 2.6 + n * 0.4, delay: n * 0.38, ease: "easeOut" }}
                        />
                      ))}
                      <div
                        ref={chaosRef}
                        className="relative z-10 flex flex-shrink-0 h-[56px] w-[56px] sm:h-[100px] sm:w-[100px] lg:h-[120px] lg:w-[120px] flex-col items-center justify-center rounded-full border-[1.5px] border-rose-200/70 bg-white xl:h-[134px] xl:w-[134px]"
                        style={{ boxShadow: "0 0 0 4px rgba(244,63,94,0.05), 0 0 0 8px rgba(244,63,94,0.02), 0 4px 16px rgba(244,63,94,0.14)" }}
                      >
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-full"
                          style={{ background: "radial-gradient(circle at 50% 40%, rgba(244,63,94,0.07), transparent 70%)" }}
                        />
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
                          className="relative z-10 mb-0.5 sm:mb-1 text-[12px] sm:text-[20px]"
                        >⚠️</motion.span>
                        <span className="relative z-10 text-[6px] sm:text-[9.5px] font-black tracking-[.08em] sm:tracking-[.24em] text-rose-500">CHAOS</span>
                        <span className="relative z-10 text-[6px] sm:text-[9.5px] font-black tracking-[.08em] sm:tracking-[.24em] text-rose-500">POINT</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* RIGHT: Effect cards */}
                  <div className="flex flex-col gap-2 sm:gap-2.5 pl-1 sm:pl-2 min-w-0">
                    {EFFECTS.map((e, i) => (
                      <motion.div
                        key={e.id}
                        ref={(el) => { effectEls.current[i] = el; }}
                        {...slideRight(i)}
                        className={`group w-full flex cursor-default items-center gap-1.5 sm:gap-3 overflow-hidden rounded-xl sm:rounded-2xl border border-white/80 bg-white/88 p-1.5 sm:py-3 sm:px-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] border-l-[3px] ${e.accentColor}`}
                      >
                        <div className={`flex h-6 w-6 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-xl text-[12px] sm:text-[17px] ${e.iconBg} ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105`}>
                          {e.icon}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
                          <p className="w-full text-[10.5px] sm:text-[14.5px] font-bold leading-[1.15] sm:leading-tight text-slate-800 break-words whitespace-normal">{e.title}</p>
                          <span className={`flex-shrink-0 rounded-full border px-1.5 sm:px-2.5 py-[2px] sm:py-[3px] text-[7.5px] sm:text-[10.5px] font-black tracking-wide ${e.badgeStyle}`}>
                            {e.badge}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stat strip */}
              <div className="relative z-10 border-t border-white/40 bg-white/40 backdrop-blur-md px-4 py-3 sm:px-7 sm:py-4">
                <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2">
                  {problemData.stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 1.0 + i * 0.1, duration: 0.38 }}
                      className="flex items-baseline gap-1 sm:gap-1.5"
                    >
                      <span className={`text-[16px] sm:text-[20px] font-black leading-none lg:text-[22px] ${stat.color}`}>
                        {stat.value}
                      </span>
                      <span className="text-[9px] sm:text-[11px] text-slate-500 lg:text-[11.5px]">{stat.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Bottom CTA row */}
          {/* ── Bottom CTA row with redesigned text ── */}
        <motion.div
          custom={0.9}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="mt-9 flex flex-col items-center justify-between gap-5 sm:flex-row sm:flex-wrap"
        >
          {/* Redesigned bottom text */}
          <div className="relative max-w-xl">
            {/* Decorative left bar — now the only anchor on this block (the
                icon was removed), so it carries a touch more weight. Stays
                hidden below `sm`, where the text is centred and an off-edge
                bar would have nothing to align to. */}
            <div
              className="hidden sm:block absolute -left-5 top-0.5 bottom-0.5 w-[4px] rounded-full"
              style={{ background: "linear-gradient(to bottom, #7c3aed, #f43f5e)" }}
            />
            {/* Three lines, three jobs: the setup, the payoff (gradient), and
                the supporting detail — which steps down a size so it reads as
                support rather than competing with the two lines above it.

                Spacing is deliberately uneven: lines 1-2 are one sentence
                broken across two lines, so they sit tight (mt-0.5). Line 3 is a
                separate thought and gets a small breath (mt-1.5) — just enough
                to separate it without leaving it stranded. */}
            <div className="min-w-0 text-center sm:text-left">
              <p className="text-[17px] font-semibold leading-[1.3] tracking-[-0.01em] text-slate-800 sm:text-[19px] lg:text-[20px]">
                {BOTTOM_CTA_LEAD},
              </p>

              <p
                className="mt-0.5 text-[17px] font-black leading-[1.3] tracking-[-0.01em] sm:text-[19px] lg:text-[20px]"
                style={{
                  background: "linear-gradient(90deg, #7c3aed, #f43f5e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {BOTTOM_CTA_ACCENT}
              </p>

              <p className="mt-1.5 text-[14px] font-medium leading-[1.45] text-slate-500 sm:text-[15px]">
                {problemData.bottomCta.subtext}
              </p>
            </div>
          </div>
 
          <MagneticButton
            href={problemData.bottomCta.buttonHref}
            variant="primary"
            className="shrink-0 rounded-full px-7 py-3.5 shadow-lg shadow-violet-300/40"
            icon={<span className="inline-block">➤</span>}
          >
            {problemData.bottomCta.buttonLabel}
          </MagneticButton>
        </motion.div>

      </div>
    </section>
  );
}