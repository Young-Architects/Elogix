"use client";

// app/solutions/pharmaceutical/_components/ChecklistIntroSection.tsx
// "Introducing the Checklist" — premium light lead-magnet section.
// Stack: Next.js + TypeScript + Tailwind CSS + Framer Motion.
//
// NOTE: the CTA links to /downloads/pharma-expense-audit-checklist-demo.pdf —
// drop the provided demo PDF into /public/downloads/ (create the folder if
// it doesn't exist) so the button works immediately. Swap in the real,
// designed checklist PDF before launch.

import type { SVGProps, ReactElement } from "react";
import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ScrollBeamDivider from "@/components/ui/ScrollBeamDivider";
import { CTA_TEXT, CTA_NOWRAP } from "@/components/ui/MagneticButton";
import { openLeadMagnet } from "@/lib/lead-magnet";
import { checklistIntro } from "../_data";
import type {
  ChecklistIconKey,
  ChecklistRole,
  ChecklistEvalItem,
} from "../_data";

/* ============================================================================
   INLINE ICONS
   ========================================================================= */

function IconBriefcase(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </svg>
  );
}
function IconChartBar(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M5 20V10M12 20V4M19 20v-7" strokeLinecap="round" />
      <path d="M3 20h18" strokeLinecap="round" />
    </svg>
  );
}
function IconHandshake(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="m3 12 4-4 4 3 3-3 3 2 4-3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 12.5 10 16l2-1.5 2 2 3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconTarget(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconUsers(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" strokeLinecap="round" />
      <path d="M16 9a2.6 2.6 0 1 0 0-5.2" strokeLinecap="round" />
      <path d="M15 14c2.4.4 4.5 2 4.5 5" strokeLinecap="round" />
    </svg>
  );
}
function IconWallet(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <rect x="3" y="6.5" width="18" height="12" rx="2" />
      <path d="M3 10.5h18" />
      <circle cx="16.5" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconDocument(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      <path d="M14 3.5V8h4" strokeLinejoin="round" />
      <path d="M9 13h6M9 16.5h6" strokeLinecap="round" />
    </svg>
  );
}
function IconWorkflow(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <rect x="3" y="4" width="5" height="5" rx="1.2" />
      <rect x="16" y="4" width="5" height="5" rx="1.2" />
      <rect x="9.5" y="15" width="5" height="5" rx="1.2" />
      <path d="M5.5 9v3a2 2 0 0 0 2 2h1.5M18.5 9v3a2 2 0 0 1-2 2h-1.5" strokeLinecap="round" />
    </svg>
  );
}
function IconShieldAlert(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.4 7 8.5 4.1-1.1 7-4.3 7-8.5V6l-7-2.5Z" strokeLinejoin="round" />
      <path d="M12 8.5v4" strokeLinecap="round" />
      <circle cx="12" cy="15.2" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconChartLine(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M4 16 9 10l4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 6h4v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconShieldCheck(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.4 7 8.5 4.1-1.1 7-4.3 7-8.5V6l-7-2.5Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSmile(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 14c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2" strokeLinecap="round" />
      <path d="M8.7 9.8h.01M15.3 9.8h.01" strokeLinecap="round" strokeWidth={2.4} />
    </svg>
  );
}
function IconDownload(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <path d="M12 3.5v11" strokeLinecap="round" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 18.5h15" strokeLinecap="round" />
    </svg>
  );
}
function IconClock(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCheckCircle(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.3 2.3L15.5 9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Maps a data `iconKey` onto its SVG component (roles + evaluates rows). */
const checklistIcons: Record<
  ChecklistIconKey,
  (p: SVGProps<SVGSVGElement>) => ReactElement
> = {
  briefcase: IconBriefcase,
  chartBar: IconChartBar,
  handshake: IconHandshake,
  target: IconTarget,
  users: IconUsers,
  wallet: IconWallet,
  document: IconDocument,
  workflow: IconWorkflow,
  shieldAlert: IconShieldAlert,
  chartLine: IconChartLine,
  shieldCheck: IconShieldCheck,
  smile: IconSmile,
};

/* ============================================================================
   BACKGROUND — same hexagon-grid system used across the page
   ========================================================================= */

function HexBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[#FAF9FF]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.5]" aria-hidden>
        <defs>
          <pattern
            id="ck-hex-pattern"
            width="56"
            height="100"
            patternUnits="userSpaceOnUse"
            patternTransform="translate(-28,0)"
          >
            <path
              d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
              fill="none"
              stroke="rgba(124,58,237,0.10)"
              strokeWidth="1.1"
            />
            <path
              d="M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
              fill="none"
              stroke="rgba(124,58,237,0.10)"
              strokeWidth="1.1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ck-hex-pattern)" />
      </svg>
      <div className="absolute -top-16 right-[8%] h-72 w-72 rounded-full bg-fuchsia-300/20 blur-[110px]" />
      <div className="absolute bottom-[-4rem] left-[6%] h-80 w-80 rounded-full bg-purple-300/20 blur-[120px]" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#FAF9FF] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FAF9FF] to-transparent" />
    </div>
  );
}

/* ============================================================================
   BORDER BEAM — SVG stroke-path beam (uniform speed on ANY aspect ratio,
   traces the real rounded-corner path exactly — no masks, no corner bleed)
   ========================================================================= */

function BorderBeam({
  duration = 9,
  colorFrom = "#7c3aed",
  colorTo = "#ec4899",
  radius = 24,
  className = "",
}: {
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  radius?: number;
  className?: string;
}) {
  // Unique per-instance gradient id so multiple beams never collide. The travel
  // animation itself is shared (.ck-border-beam in globals.css); only the spin
  // duration is per-instance, passed as an inline animation-duration.
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const spin = { animationDuration: `${duration}s` };

  return (
    <svg
      className={`pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={`beamGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={colorFrom} />
          <stop offset="100%" stopColor={colorTo} />
        </linearGradient>
      </defs>

      {/* soft trailing glow — blurred, but it's blurring the real rounded
          path itself, so it can never look square at the corners */}
      <rect
        className="ck-border-beam"
        x="1.5" y="1.5"
        width="calc(100% - 3px)" height="calc(100% - 3px)"
        rx={radius} ry={radius}
        fill="none"
        stroke={`url(#beamGrad-${id})`}
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="14 86"
        opacity={0.45}
        style={{ ...spin, filter: "blur(5px)" }}
      />

      {/* crisp beam line on top */}
      <rect
        className="ck-border-beam"
        x="1.5" y="1.5"
        width="calc(100% - 3px)" height="calc(100% - 3px)"
        rx={radius} ry={radius}
        fill="none"
        stroke={`url(#beamGrad-${id})`}
        strokeWidth={1.5}
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="14 86"
        style={spin}
      />
    </svg>
  );
}

/* ============================================================================
   ROLE CHIP
   ========================================================================= */

function RoleChip({ role, index }: { role: ChecklistRole; index: number }) {
  const Icon = checklistIcons[role.iconKey];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      style={{ willChange: "transform, opacity" }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group flex items-center gap-2 rounded-full border border-white/60 bg-white/50 px-3.5 py-2 shadow-sm backdrop-blur-md transition-colors hover:border-purple-300/70 hover:bg-white/75 sm:px-4"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-fuchsia-100 text-purple-600 transition-colors group-hover:from-purple-600 group-hover:to-fuchsia-500 group-hover:text-white">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="text-xs font-semibold text-gray-700 sm:text-[13px]">{role.label}</span>
    </motion.div>
  );
}

/* ============================================================================
   EVALUATES ROW (used inside the document mock)
   ========================================================================= */

function EvalRow({ item, index }: { item: ChecklistEvalItem; index: number }) {
  const Icon = checklistIcons[item.iconKey];
  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      style={{ willChange: "transform, opacity" }}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white/70 px-3.5 py-2.5 sm:px-4"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-medium text-gray-800">{item.label}</span>
      <IconCheckCircle className="ml-auto h-4 w-4 shrink-0 text-emerald-500" />
    </motion.div>
  );
}

/* ============================================================================
   DOCUMENT MOCK — the "checklist" preview card
   ========================================================================= */

function DocumentMock() {
  const reduceMotion = useReducedMotion();
  const doc = checklistIntro.document;

  return (
    <div className="relative mx-auto w-full max-w-md lg:mx-0">
      {/* floating "FREE" ribbon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
        viewport={{ once: true }}
        style={{ willChange: "transform, opacity" }}
        transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
        className="absolute -right-3 -top-4 z-30 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-purple-500/30 sm:-right-5 sm:-top-5"
      >
        {doc.ribbon}
      </motion.div>

      {/* gentle idle float */}
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
        className="relative"
        style={{ willChange: "transform" }}
      >
        <div className="relative rounded-3xl">
          <BorderBeam colorFrom="#7c3aed" colorTo="#ec4899" duration={9} radius={24} />

          <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/60 p-5 shadow-[0_20px_60px_rgba(124,58,237,0.18)] backdrop-blur-2xl sm:p-6">
            {/* doc header */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <span className="ml-2 truncate text-xs font-medium text-gray-400">
                {doc.fileName}
              </span>
              <span className="ml-auto shrink-0 rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-purple-600">
                {doc.pointsBadge}
              </span>
            </div>

            {/* evaluates list */}
            <div className="mt-4 space-y-2">
              {doc.evaluates.map((item, i) => (
                <EvalRow key={item.label} item={item} index={i} />
              ))}
            </div>

            {/* footer strip */}
            <div className="mt-5 flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-600/95 to-fuchsia-500/95 px-4 py-3">
              <div className="flex items-center gap-2 text-white">
                <IconClock className="h-4 w-4" />
                <span className="text-xs font-semibold">{doc.footer.time}</span>
              </div>
              <span className="text-xs font-semibold text-white/90">
                {doc.footer.categories}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* floating clock badge, bottom-left */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ willChange: "transform, opacity" }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="absolute -bottom-5 -left-4 z-30 hidden items-center gap-2 rounded-2xl border border-white/60 bg-white/80 px-4 py-2.5 shadow-lg shadow-purple-500/10 backdrop-blur-md sm:flex"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <IconCheckCircle className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <p className="text-xs font-bold text-gray-900">
            {doc.floatingBadge.title}
          </p>
          <p className="text-[11px] text-gray-500">
            {doc.floatingBadge.subtitle}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ============================================================================
   MAIN SECTION
   ========================================================================= */

export default function ChecklistIntroSection() {
  return (
    <section
      id="checklist"
      // pt-0 keeps the ScrollBeamDivider flush on the seam with the previous
      // section; the top spacing is carried by the inner grid instead so the
      // divider isn't pushed down into the section body.
      className="relative overflow-hidden pb-12 pt-0 [-webkit-font-smoothing:antialiased] [backface-visibility:hidden] sm:pb-16"
    >
      <HexBackground />
      <ScrollBeamDivider />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:pt-28 sm:pt-20">
        {/* ── LEFT: copy ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ willChange: "transform, opacity" }}
            transition={{ duration: 0.4 }}
            className="flex w-fit items-center gap-2 rounded-full border border-purple-200/70 bg-white/60 px-4 py-1.5 text-[14px] font-semibold tracking-wide text-purple-700 backdrop-blur-md"
          >
            <IconDocument className="h-4 w-4" />
            {checklistIntro.badge}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ willChange: "transform, opacity" }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-gray-900 sm:text-4xl md:text-[2.75rem]"
          >
            {checklistIntro.heading.lead}
            <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
              {checklistIntro.heading.accent}
            </span>
            {checklistIntro.heading.tail}
          </motion.h2>

          {/* built for */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ willChange: "transform, opacity" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-7 text-xs font-bold uppercase tracking-wide text-gray-400"
          >
            {checklistIntro.builtForLabel}
          </motion.p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {checklistIntro.roles.map((role, i) => (
              <RoleChip key={role.label} role={role} index={i} />
            ))}
          </div>

          {/* closing line */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ willChange: "transform, opacity" }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-8 flex items-start gap-3 rounded-2xl border border-purple-100 bg-purple-50/70 px-5 py-4 backdrop-blur-sm"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-purple-600 shadow-sm">
              <IconClock className="h-4 w-4" />
            </span>
            <p className="text-sm leading-relaxed text-gray-700">
              <span className="font-bold text-gray-900">
                {checklistIntro.closing.emphasis}
              </span>
              {checklistIntro.closing.body}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ willChange: "transform, opacity" }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
          >
            <motion.a
              href={checklistIntro.cta.href}
              download={checklistIntro.cta.downloadName}
              target="_blank"
              rel="noopener noreferrer"
              onClick={openLeadMagnet}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={`group inline-flex shrink-0 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 px-6 py-3.5 text-center font-bold leading-tight text-white shadow-lg shadow-purple-500/25 transition-shadow hover:shadow-xl hover:shadow-purple-500/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 focus-visible:ring-offset-2 ${CTA_TEXT} ${CTA_NOWRAP}`}
            >
              <IconDownload className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              {checklistIntro.cta.label}
            </motion.a>
            <span className="text-xs text-gray-400">
              {checklistIntro.cta.subtext}
            </span>
          </motion.div>
        </div>

        {/* ── RIGHT: document mock ── */}
        <DocumentMock />
      </div>
    </section>
  );
}