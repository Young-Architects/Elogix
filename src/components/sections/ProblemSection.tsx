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
import { Sparkles, TrendingUp } from "lucide-react";
import ScrollBeamDivider from "../ui/ScrollBeamDivider";
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
const EFFECT_COLORS = ["#f59e0b", "#ef4444", "#94a3b8", "#f97316", "#f43f5e"];

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

        {/* Section label */}
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center mt-20 mb-4 gap-2 rounded-full border border-violet-200/60 bg-violet-100/50 px-4 py-1.5 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            <span className="text-xs font-bold text-violet-800 tracking-wide">
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
          {problemData.headline.line1}
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

        <motion.p
          custom={0.15}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="mb-12 max-w-xl text-[15px] leading-relaxed text-slate-500"
        >
          {problemData.description}
        </motion.p>

        {/* ═══ DIAGRAM CARD ═══ */}
        <motion.div
          custom={0.22}
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
                <div className="flex items-center min-w-0 gap-1 sm:gap-2 px-2 sm:px-7 py-2 sm:py-3">
                  <span className="flex h-[14px] w-[14px] sm:h-[18px] sm:w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-violet-100/80 text-[6px] sm:text-[8px] font-black text-violet-600 shadow-sm">←</span>
                  <span className="text-[7px] sm:text-[9.5px] font-bold uppercase tracking-[.1em] sm:tracking-[.18em] text-slate-500 truncate">
                    Root Causes
                  </span>
                </div>
                {/* centre spacer */}
                <div className="border-x border-white/40" />
                <div className="flex items-center min-w-0 justify-end md:justify-start gap-1 sm:gap-2 border-l border-white/40 px-2 sm:px-7 py-2 sm:py-3">
                  <span className="text-[7px] sm:text-[9.5px] font-bold uppercase tracking-[.1em] sm:tracking-[.18em] text-slate-500 truncate">
                    Consequences
                  </span>
                  <span className="flex h-[14px] w-[14px] sm:h-[18px] sm:w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-rose-100/80 text-[6px] sm:text-[8px] font-black text-rose-500 shadow-sm">→</span>
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
                        {c.tag && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.28 + i * 0.08, duration: 0.32 }}
                            className={`mb-1 sm:mb-1.5 inline-flex items-center gap-1 sm:gap-1.5 rounded-full border px-1.5 sm:px-2.5 py-[2px] sm:py-[3px] text-[6.5px] sm:text-[9.5px] font-semibold tracking-wide max-w-full ${c.tagColor}`}
                          >
                            <span className="flex-shrink-0 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-current opacity-70" />
                            <span className="truncate">{c.tag}</span>
                          </motion.div>
                        )}
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
                            <p className="text-[8.5px] sm:text-[13px] font-bold leading-[1.1] sm:leading-tight text-slate-800 break-words whitespace-normal">{c.title}</p>
                            <p className="hidden sm:block mt-0.5 text-[11.5px] leading-snug text-slate-400 break-words">{c.sub}</p>
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
                        <span className="relative z-10 text-[4px] sm:text-[7.5px] font-black tracking-[.1em] sm:tracking-[.3em] text-rose-500">CHAOS</span>
                        <span className="relative z-10 text-[4px] sm:text-[7.5px] font-black tracking-[.1em] sm:tracking-[.3em] text-rose-500">POINT</span>
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
                          <p className="w-full text-[8.5px] sm:text-[12.5px] font-bold leading-[1.1] sm:leading-tight text-slate-800 break-words whitespace-normal">{e.title}</p>
                          <span className={`flex-shrink-0 rounded-full border px-1.5 sm:px-2 py-[1.5px] sm:py-[2px] text-[5px] sm:text-[9px] font-black tracking-wide ${e.badgeStyle}`}>
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
          className="mt-9 flex flex-col items-center justify-between gap-5 sm:flex-row"
        >
          {/* Redesigned bottom text */}
          <div className="relative max-w-lg">
            {/* Decorative left bar */}
            <div
              className="hidden sm:block absolute -left-4 top-1 bottom-1 w-[3px] rounded-full"
              style={{ background: "linear-gradient(to bottom, #7c3aed, #f43f5e)" }}
            />
            <div className="flex items-start sm:items-center gap-3">
              <div
                className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl text-[16px] sm:flex"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(244,63,94,0.1))",
                  border: "1px solid rgba(124,58,237,0.15)",
                }}
              >
                <TrendingUp className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <p className="text-[14px] sm:text-[15px] font-semibold leading-snug text-slate-700">
                  {problemData.bottomCta.heading.split(",")[0]},
                  <span
                    className="ml-1.5 font-black"
                    style={{
                      background: "linear-gradient(90deg, #7c3aed, #f43f5e)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {problemData.bottomCta.heading.split(",").slice(1).join(",").trim()}
                  </span>
                </p>
                <p className="mt-1 text-[11.5px] text-slate-400 font-medium">
                  {problemData.bottomCta.subtext}
                </p>
              </div>
            </div>
          </div>
 
          <button className="group flex flex-shrink-0 items-center gap-2 rounded-full bg-violet-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-300/40 transition-all duration-200 hover:scale-[1.04] hover:bg-violet-700 hover:shadow-violet-400/50 active:scale-[0.97]">
            {problemData.bottomCta.buttonLabel}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">➤</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}