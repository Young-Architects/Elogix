"use client";

/**
 * ComparisonSection — "Traditional Process vs Expendesk" table (id="comparison").
 *
 * A premium "versus" card: each comparison renders as ONE two-column grid row
 * (left = traditional pain, right = Expendesk upgrade), so the pairs stay
 * perfectly aligned at every viewport width. A spinning border beam wraps the
 * card, a spring-popped "VS" badge sits on the centre divider, and rows slide
 * in from opposite sides on scroll. Copy and icon keys come from
 * `src/data/sections/comparison.json`; icon keys map to Lucide via ROW_ICON_MAP.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  Star,
  X,
  Zap,
  Workflow,
  Timer,
  FolderCheck,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import ScrollBeamDivider from "../ui/ScrollBeamDivider";
import comparisonData from "@/data/sections/comparison.json";

/* ═══════════════════════════════════════
   ICON MAP — React components keyed by iconKey string in JSON
═══════════════════════════════════════ */
const ROW_ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "zap":          Zap,
  "workflow":     Workflow,
  "timer":        Timer,
  "folder-check": FolderCheck,
  "bar-chart":    BarChart3,
  "trending-up":  TrendingUp,
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function ComparisonSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  const { columns, rows } = comparisonData;

  return (
    <section
      id="comparison"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#f8f9ff] via-[#f3f4fd] to-[#ECECF4] pb-16 pt-0 md:pb-24"
    >
      <ScrollBeamDivider />

      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-28 top-1/4 h-[26rem] w-[26rem] rounded-full bg-violet-400/8 blur-[100px]" />
        <div className="absolute -left-28 bottom-1/4 h-[20rem] w-[20rem] rounded-full bg-rose-400/6 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="mt-16 inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-100/50 px-4 py-1.5 shadow-sm backdrop-blur-md md:mt-20"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            <span className="text-xs font-bold tracking-wide text-violet-800">
              {comparisonData.badge}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.55, ease: EASE }}
            className="mt-5 text-3xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.9rem]"
          >
            <span className="block">{comparisonData.headline.plain}</span>
            <span className="block bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
              {comparisonData.headline.accent}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.16, duration: 0.5, ease: EASE }}
            className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-slate-500 sm:text-base"
          >
            {comparisonData.subheading}
          </motion.p>
        </div>

        {/* ── Versus card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.22, duration: 0.6, ease: EASE }}
          className="relative mt-12 rounded-[32px] p-[2px] md:mt-14"
          style={{
            boxShadow:
              "0 4px 6px rgba(16,24,40,0.04), 0 36px 80px -28px rgba(76,29,149,0.28)",
          }}
        >
          {/* Spinning border beam */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[32px]">
            <div
              className="absolute inset-[-100%] animate-[spin_6s_linear_infinite]"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 78%, rgba(124,58,237,0.45) 90%, rgba(244,63,94,0.35) 100%)",
              }}
            />
          </div>

          <div className="relative z-10 overflow-hidden rounded-[30px] bg-white/90 backdrop-blur-2xl">

            {/* Centre divider + VS badge */}
            <div
              aria-hidden
              className="absolute bottom-0 left-1/2 top-0 z-20 w-px bg-gradient-to-b from-transparent via-violet-200/80 to-transparent"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.7, type: "spring", bounce: 0.4 }}
              className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative flex items-center justify-center">
                {[0, 1].map((n) => (
                  <motion.span
                    key={n}
                    aria-hidden
                    className="absolute rounded-full bg-violet-400/15"
                    style={{ inset: -(n + 1) * 7 }}
                    animate={{ scale: [1, 1.25 + n * 0.12], opacity: [0.25 - n * 0.08, 0] }}
                    transition={{ repeat: Infinity, duration: 2.4 + n * 0.4, delay: n * 0.35, ease: "easeOut" }}
                  />
                ))}
                <div
                  className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-violet-100 bg-white sm:h-12 sm:w-12"
                  style={{ boxShadow: "0 0 0 5px rgba(124,58,237,0.05), 0 6px 18px rgba(124,58,237,0.18)" }}
                >
                  <span className="bg-gradient-to-br from-violet-600 to-fuchsia-500 bg-clip-text text-[11px] font-black tracking-wider text-transparent sm:text-[13px]">
                    {comparisonData.vsLabel}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right-half premium glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-0 w-1/2"
              style={{
                background:
                  "radial-gradient(ellipse 90% 60% at 70% 0%, rgba(124,58,237,0.07), transparent 65%)",
              }}
            />

            {/* ── Header row ── */}
            <div className="relative z-10 grid grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                className="bg-rose-50/50 px-4 py-5 sm:px-8 sm:py-6"
              >
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-500 ring-1 ring-rose-200/60 sm:h-7 sm:w-7">
                    <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={3} />
                  </span>
                  <p className="text-[13px] font-extrabold tracking-tight text-slate-700 sm:text-[16px]">
                    {columns.before.label}
                  </p>
                </div>
                <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-400/90 sm:text-[10.5px]">
                  {columns.before.caption}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                className="bg-gradient-to-r from-violet-50/60 to-fuchsia-50/40 px-4 py-5 sm:px-8 sm:py-6"
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-black text-white shadow-md sm:h-7 sm:w-7 sm:rounded-xl sm:text-[13px]"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #d946ef)", boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}
                  >
                    E
                  </span>
                  <p className="text-[13px] font-extrabold tracking-tight text-slate-900 sm:text-[16px]">
                    {columns.after.label}
                  </p>
                  <span className="eb-shimmer hidden items-center gap-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-white shadow-md shadow-violet-500/30 sm:inline-flex">
                    <Star className="h-2 w-2 fill-white" strokeWidth={0} />
                    {columns.after.tag}
                  </span>
                </div>
                <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-500/90 sm:text-[10.5px]">
                  {columns.after.caption}
                </p>
              </motion.div>
            </div>

            {/* ── Comparison rows — one grid row per pair, always aligned ── */}
            <div className="relative z-10">
              {rows.map((row, i) => {
                const Icon = ROW_ICON_MAP[row.iconKey] ?? Zap;
                return (
                  <div key={row.id} className="group grid grid-cols-2">
                    {/* Traditional side */}
                    <motion.div
                      initial={{ opacity: 0, x: -22 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.42 + i * 0.08, duration: 0.5, ease: EASE }}
                      className="flex items-center gap-2 border-t border-rose-100/50 bg-rose-50/25 px-4 py-3.5 transition-colors duration-300 group-hover:bg-rose-50/60 sm:gap-3 sm:px-8 sm:py-[18px]"
                    >
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-rose-100/80 text-rose-400 sm:h-6 sm:w-6">
                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" strokeWidth={3} />
                      </span>
                      <span className="text-[11.5px] font-semibold leading-snug text-slate-800 line-through decoration-rose-700/70 sm:text-[14px]">
                        {row.before}
                      </span>
                    </motion.div>

                    {/* Expendesk side */}
                    <motion.div
                      initial={{ opacity: 0, x: 22 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.48 + i * 0.08, duration: 0.5, ease: EASE }}
                      className="flex items-center gap-2 border-t border-violet-100/60 bg-gradient-to-r from-violet-50/30 to-fuchsia-50/20 px-4 py-3.5 transition-colors duration-300 group-hover:from-violet-50/70 group-hover:to-fuchsia-50/50 sm:gap-3 sm:px-8 sm:py-[18px]"
                    >
                      <span
                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-white transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:w-6 sm:rounded-lg"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #d946ef)", boxShadow: "0 3px 8px rgba(124,58,237,0.25)" }}
                      >
                        <Icon style={{ width: 12, height: 12 }} />
                      </span>
                      <span className="text-[11.5px] font-bold leading-snug text-slate-900 sm:text-[14px]">
                        {row.after}
                      </span>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Footnote ── */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.0, duration: 0.5, ease: EASE }}
          className="mt-8 text-center text-[12px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:text-[13px]"
        >
          {comparisonData.footnote.pre}{" "}
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
            {comparisonData.footnote.accent}
          </span>{" "}
          {comparisonData.footnote.post}
        </motion.p>

      </div>
    </section>
  );
}
