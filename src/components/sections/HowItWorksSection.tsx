"use client";

/**
 * HowItWorksSection — "Get Started in Three Simple Steps" (id="how-it-works").
 *
 * Three numbered step cards laid out as a horizontal flow on md+ (arrow chips
 * bridge the grid gaps) and a vertical flow on mobile (bouncing ↓ connectors in
 * the gaps). Cards fade-up on scroll via useInView; a bottom CTA row closes the
 * section. Copy, accent colours and icon keys come from
 * `src/data/sections/how-it-works.json`; icon keys map to Lucide via STEP_ICON_MAP.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  Camera,
  GitBranch,
  BarChart3,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import ScrollBeamDivider from "../ui/ScrollBeamDivider";
import MagneticButton from "@/components/ui/MagneticButton";
import howItWorksData from "@/data/sections/how-it-works.json";

/* ═══════════════════════════════════════
   ICON MAP — React components keyed by iconKey string in JSON
═══════════════════════════════════════ */
const STEP_ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "camera":     Camera,
  "git-branch": GitBranch,
  "bar-chart":  BarChart3,
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ═══════════════════════════════════════
   STEP CARD
═══════════════════════════════════════ */
function StepCard({
  step,
  index,
  isLast,
  inView,
}: {
  step: (typeof howItWorksData.steps)[0];
  index: number;
  isLast: boolean;
  inView: boolean;
}) {
  const Icon = STEP_ICON_MAP[step.iconKey] ?? Camera;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 + index * 0.14, duration: 0.55, ease: EASE }}
        className="group relative h-full overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 sm:p-7"
        style={{ boxShadow: `0 2px 10px rgba(16,24,40,0.04)` }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 40px ${step.glow}`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 2px 10px rgba(16,24,40,0.04)`;
        }}
      >
        {/* Top accent bar */}
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${step.accentFrom}, ${step.accentTo})` }}
        />

        {/* Icon + watermark number */}
        <div className="flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${step.accentFrom}, ${step.accentTo})`,
              boxShadow: `0 8px 20px ${step.glow}`,
            }}
          >
            <Icon style={{ width: 22, height: 22 }} />
          </div>
          <span
            aria-hidden
            className="select-none bg-clip-text text-[44px] font-black leading-none text-transparent opacity-[0.16]"
            style={{ backgroundImage: `linear-gradient(135deg, ${step.accentFrom}, ${step.accentTo})` }}
          >
            {step.step}
          </span>
        </div>

        {/* Copy */}
        <p
          className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.22em]"
          style={{ color: step.accentFrom }}
        >
          {step.stepLabel}
        </p>
        <h3 className="mt-1.5 text-lg font-extrabold tracking-tight text-slate-900">
          {step.title}
        </h3>
        <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
          {step.description}
        </p>
      </motion.div>

      {/* Connector — desktop: arrow chip bridging the grid gap */}
      {!isLast && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.45 + index * 0.14, duration: 0.4, ease: EASE }}
          className="absolute -right-[34px] top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-violet-100 bg-white shadow-md md:flex"
        >
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="flex"
          >
            <ArrowRight className="h-4 w-4 text-violet-500" />
          </motion.span>
        </motion.div>
      )}

      {/* Connector — mobile: bouncing ↓ in the stack gap */}
      {!isLast && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.45 + index * 0.14, duration: 0.4 }}
          className="absolute -bottom-[34px] left-1/2 z-10 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-violet-100 bg-white shadow-md md:hidden"
        >
          <motion.span
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="flex"
          >
            <ArrowDown className="h-3.5 w-3.5 text-violet-500" />
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#f8f9ff] via-[#f3f4fe] to-[#f8f9ff] pb-16 pt-0 md:pb-24"
    >
      <ScrollBeamDivider />

      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-1/3 h-[24rem] w-[24rem] rounded-full bg-violet-400/8 blur-[90px]" />
        <div className="absolute -right-24 bottom-0 h-[20rem] w-[20rem] rounded-full bg-fuchsia-400/8 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="mt-16 inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-100/50 px-4 py-1.5 shadow-sm backdrop-blur-md md:mt-20"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            <span className="text-xs font-bold tracking-wide text-violet-800">
              {howItWorksData.badge}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.08, duration: 0.55, ease: EASE }}
            className="mt-5 text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.9rem]"
          >
            {howItWorksData.headlineParts.pre}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
              {howItWorksData.headlineParts.accent}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.16, duration: 0.5, ease: EASE }}
            className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-slate-500 sm:text-base"
          >
            {howItWorksData.subheading}
          </motion.p>
        </div>

        {/* ── Step cards ── */}
        <div className="mt-12 grid grid-cols-1 gap-[52px] md:mt-14 md:grid-cols-3 md:gap-[32px]">
          {howItWorksData.steps.map((step, i) => (
            <StepCard
              key={step.id}
              step={step}
              index={i}
              isLast={i === howItWorksData.steps.length - 1}
              inView={inView}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.55, ease: EASE }}
          className="mt-12 flex flex-col items-center gap-4 md:mt-14"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-500">
            {howItWorksData.cta.prompt}
          </p>
          <MagneticButton
            href={howItWorksData.cta.buttonHref}
            variant="primary"
            className="rounded-full px-7 py-3.5 text-sm shadow-lg shadow-violet-300/40"
            icon={<ArrowRight className="h-4 w-4" />}
          >
            {howItWorksData.cta.buttonLabel}
          </MagneticButton>
        </motion.div>

      </div>
    </section>
  );
}
