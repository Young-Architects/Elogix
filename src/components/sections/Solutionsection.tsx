"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";
import ScrollBeamDivider from "../ui/ScrollBeamDivider";
// ─── Icons ────────────────────────────────────────────────────────────────────

const IconCamera = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const IconBolt = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);
const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IconBarChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  { icon: <IconCamera />, title: "Capture expenses instantly", desc: "Upload receipts on the go and never lose a single expense again.", color: "from-violet-500/10 to-violet-600/5", iconColor: "text-violet-600", dot: "bg-violet-500", border: "hover:border-violet-300/60" },
  { icon: <IconBolt />, title: "Automate approvals", desc: "Set smart approval flows and eliminate manual follow-ups.", color: "from-indigo-500/10 to-indigo-600/5", iconColor: "text-indigo-600", dot: "bg-indigo-500", border: "hover:border-indigo-300/60" },
  { icon: <IconShield />, title: "Enforce spending policies", desc: "Ensure policy compliance before spend, not afterwards.", color: "from-fuchsia-500/10 to-fuchsia-600/5", iconColor: "text-fuchsia-600", dot: "bg-fuchsia-500", border: "hover:border-fuchsia-300/60" },
  { icon: <IconUsers />, title: "Track by team, dept. or location", desc: "Get granular visibility into where and how money is being spent.", color: "from-violet-500/10 to-violet-600/5", iconColor: "text-violet-600", dot: "bg-violet-500", border: "hover:border-violet-300/60" },
  { icon: <IconRefresh />, title: "Accelerate reimbursements", desc: "Reimburse employees faster and boost happiness.", color: "from-emerald-500/10 to-emerald-600/5", iconColor: "text-emerald-600", dot: "bg-emerald-500", border: "hover:border-emerald-300/60" },
  { icon: <IconFile />, title: "Generate audit-ready reports", desc: "One-click reports that are compliant, accurate and audit-ready.", color: "from-indigo-500/10 to-indigo-600/5", iconColor: "text-indigo-600", dot: "bg-indigo-500", border: "hover:border-indigo-300/60" },
  { icon: <IconBarChart />, title: "Gain real-time financial visibility", desc: "Make smarter decisions with real-time spending data.", color: "from-violet-500/10 to-violet-600/5", iconColor: "text-violet-600", dot: "bg-violet-500", border: "hover:border-violet-300/60" },
];

const stats = [
  { icon: <IconBolt />,     value: 95,  suffix: "%", label: "Less approval time",    sub: "Save hours every week",     color: "text-violet-600" },
  { icon: <IconRefresh />,  value: 70,  suffix: "%", label: "Faster reimbursements", sub: "Employees get paid faster", color: "text-indigo-600" },
  { icon: <IconShield />,   value: 100, suffix: "%", label: "Policy compliance",     sub: "Enforced automatically",    color: "text-fuchsia-600" },
  { icon: <IconBarChart />, value: null,suffix: "",  label: "Financial visibility",  sub: "Always up-to-date",         color: "text-violet-600" },
];

// ─── Node diagram data ────────────────────────────────────────────────────────

const chaosNodes  = [
  { label: "Receipts Lost",       icon: "🧾" },
  { label: "Approval Delays",     icon: "⏱"  },
  { label: "Reimbursement Queue", icon: "👥" },
  { label: "Visibility Missing",  icon: "👁"  },
];
const controlNodes = [
  { label: "Expense Captured Instantly", icon: "📸" },
  { label: "Auto Approval",              icon: "⚡" },
  { label: "Instant Reimbursement",      icon: "💸" },
  { label: "Real-Time Dashboard",        icon: "📊" },
];

// ─── Node Diagram (HTML-div nodes + SVG beam overlay) ─────────────────────────

type Beam = { d: string; grad: string };

function NodeDiagram() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const svgRef    = useRef<SVGSVGElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const leftRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [beams,   setBeams]   = React.useState<Beam[]>([]);
  const [svgBox,  setSvgBox]  = React.useState({ w: 0, h: 0 });
  const isInView = useInView(wrapRef, { once: true, margin: "-80px" });

  // ── build bezier paths from real DOM rects ──────────────────────────────────
  const buildBeams = useCallback(() => {
    const wrap   = wrapRef.current;
    const center = centerRef.current;
    if (!wrap || !center) return;

    const wR = wrap.getBoundingClientRect();
    const cR = center.getBoundingClientRect();
    const cx = cR.left + cR.width  / 2 - wR.left;
    const cy = cR.top  + cR.height / 2 - wR.top;
    const cr = cR.width / 2;

    setSvgBox({ w: wR.width, h: wR.height });

    const next: Beam[] = [];

    leftRefs.current.forEach((el) => {
      if (!el) return;
      const nR  = el.getBoundingClientRect();
      const sx  = nR.right - wR.left;
      const sy  = nR.top + nR.height / 2 - wR.top;
      const ex  = cx - cr;
      const ey  = cy;
      const cpx = sx + (ex - sx) * 0.52;
      next.push({ d: `M ${sx} ${sy} C ${cpx} ${sy},${cpx} ${ey},${ex} ${ey}`, grad: "url(#gChaos)" });
    });

    rightRefs.current.forEach((el) => {
      if (!el) return;
      const nR  = el.getBoundingClientRect();
      const sx  = cx + cr;
      const sy  = cy;
      const ex  = nR.left - wR.left;
      const ey  = nR.top + nR.height / 2 - wR.top;
      const cpx = sx + (ex - sx) * 0.48;
      next.push({ d: `M ${sx} ${sy} C ${cpx} ${sy},${cpx} ${ey},${ex} ${ey}`, grad: "url(#gControl)" });
    });

    setBeams(next);
  }, []);

  // rebuild on resize
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => buildBeams());
    ro.observe(el);
    const t = setTimeout(buildBeams, 200);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, [buildBeams]);

  // animate beams once in view
  useEffect(() => {
    if (!isInView || !svgRef.current || beams.length === 0) return;
    const paths = svgRef.current.querySelectorAll<SVGPathElement>(".bp");
    paths.forEach((el, i) => {
      const len = el.getTotalLength?.() ?? 180;
      el.style.strokeDasharray  = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      el.style.opacity = "1";
      setTimeout(() => {
        el.style.transition       = `stroke-dashoffset 0.85s cubic-bezier(.4,0,.2,1) ${0.2 + i * 0.08}s`;
        el.style.strokeDashoffset = "0";
      }, 60);
    });
  }, [isInView, beams]);

  return (
    <div ref={wrapRef} className="relative w-full select-none">
      {/* ── Glass card ── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background:     "rgba(255,255,255,0.92)",
          border:         "1px solid rgba(139,92,246,0.14)",
          backdropFilter: "blur(20px)",
          boxShadow:      "0 8px 40px rgba(124,58,237,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Header labels */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-2 border-b border-slate-100/80">
          <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-rose-500">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            From Chaos
          </span>
          <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-widest uppercase text-indigo-600">
            To Control
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          </span>
        </div>

        {/* ── 3-column grid: left nodes | center circle | right nodes ── */}
        {/*
          FIX: increased gap-x on mobile (was gap-x-1.5), wider center circle (was 48px),
          and showed node icons on all screen sizes with responsive sizing.
        */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 sm:gap-x-5 md:gap-x-7 px-2 sm:px-5 py-4 sm:py-5 items-center">

          {/* LEFT — Chaos nodes */}
          <div className="flex flex-col gap-2 min-w-0">
            {chaosNodes.map((node, i) => (
              <React.Fragment key={`chaos-${i}`}>
                <div
                  ref={(el) => { leftRefs.current[i] = el; }}
                  className="relative flex items-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-2.5 py-2 sm:py-2.5 bg-white border border-rose-100 overflow-hidden"
                  style={{ boxShadow: "0 1px 6px rgba(244,63,94,0.07)" }}
                >
                  {/* left accent */}
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-rose-400" />
                  {/* icon — now always visible, responsive size */}
                  <span className="flex-shrink-0 w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-rose-50 flex items-center justify-center text-[10px] sm:text-sm leading-none">
                    {node.icon}
                  </span>
                  {/* label */}
                  <span className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-slate-800 leading-snug flex-1 min-w-0 break-words">
                    {node.label}
                  </span>
                  {/* ✕ badge — hidden on mobile */}
                  <span className="flex-shrink-0 w-[18px] h-[18px] rounded-full bg-rose-50 border border-rose-200 items-center justify-center ml-1 hidden sm:flex">
                    <span className="text-rose-500 text-[8px] font-black leading-none">✕</span>
                  </span>
                </div>
                {/* down arrow */}
                {i < chaosNodes.length - 1 && (
                  <div className="flex justify-center my-0.5">
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                      <line x1="5" y1="0" x2="5" y2="8" stroke="#fca5a5" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M2.5 6.5L5 11L7.5 6.5" stroke="#fca5a5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* CENTER — EXPENDESK circle */}
          {/*
            FIX: increased mobile circle from w-[48px]/h-[48px] → w-[68px]/h-[68px]
            so beams look natural and the circle has visual weight on small screens.
            Also made "E" text larger (text-xl vs text-sm) and show "EXPENDESK" label
            on mobile at a slightly bigger size.
          */}
          <div className="flex items-center justify-center">
            <div
              ref={centerRef}
              className="relative flex-shrink-0 w-[68px] h-[68px] sm:w-[92px] sm:h-[92px] md:w-[116px] md:h-[116px] rounded-full flex flex-col items-center justify-center"
              style={{
                background: "linear-gradient(145deg,#7c3aed 0%,#4f46e5 55%,#312e81 100%)",
                boxShadow:  "0 0 0 8px rgba(124,58,237,0.07),0 0 28px rgba(124,58,237,0.28)",
              }}
            >
              {/* pulse ring */}
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "rgba(124,58,237,0.1)", animationDuration: "2.5s" }}
              />
              <span className="relative z-10 text-white font-black text-xl sm:text-2xl leading-none">E</span>
              <span className="relative z-10 text-white/90 font-bold text-[7px] sm:text-[8px] tracking-[1px] mt-0.5 leading-none">
                EXPENDESK
              </span>
              <span className="relative z-10 text-violet-200/80 text-[5.5px] sm:text-[7px] text-center leading-tight mt-1 px-1 hidden sm:block">
                Financial<br />Control Engine
              </span>
            </div>
          </div>

          {/* RIGHT — Control nodes */}
          <div className="flex flex-col gap-2 min-w-0">
            {controlNodes.map((node, i) => (
              <React.Fragment key={`ctrl-${i}`}>
                <div
                  ref={(el) => { rightRefs.current[i] = el; }}
                  className="relative flex items-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-2.5 py-2 sm:py-2.5 bg-white border border-indigo-100 overflow-hidden"
                  style={{ boxShadow: "0 1px 6px rgba(79,70,229,0.07)" }}
                >
                  {/* icon — now always visible, responsive size */}
                  <span className="flex-shrink-0 w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] sm:text-sm leading-none">
                    {node.icon}
                  </span>
                  {/* label */}
                  <span className="text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-slate-800 leading-snug flex-1 min-w-0 break-words">
                    {node.label}
                  </span>
                  {/* ✓ badge — hidden on mobile */}
                  <span className="flex-shrink-0 w-[18px] h-[18px] rounded-full bg-emerald-50 border border-emerald-200 items-center justify-center ml-1 hidden sm:flex">
                    <span className="text-emerald-500 text-[8px] font-black leading-none">✓</span>
                  </span>
                  {/* right accent */}
                  <span className="absolute right-0 top-2 bottom-2 w-[3px] rounded-l-full bg-indigo-400" />
                </div>
                {/* down arrow */}
                {i < controlNodes.length - 1 && (
                  <div className="flex justify-center my-0.5">
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                      <line x1="5" y1="0" x2="5" y2="8" stroke="#a5b4fc" strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M2.5 6.5L5 11L7.5 6.5" stroke="#a5b4fc" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── SVG beam overlay (pointer-events none, covers entire card) ── */}
        {svgBox.w > 0 && (
          <svg
            ref={svgRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-visible"
            style={{ zIndex: 0, top: 0, left: 0 }}
            width={svgBox.w}
            height={svgBox.h}
          >
            <defs>
              <linearGradient id="gChaos" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#f43f5e" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.65" />
              </linearGradient>
              <linearGradient id="gControl" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.18" />
              </linearGradient>
              <filter id="bGlow">
                <feGaussianBlur stdDeviation="1.6" result="bl" />
                <feMerge><feMergeNode in="bl" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {beams.map((b, i) => (
              <path
                key={i}
                className="bp"
                d={b.d}
                fill="none"
                stroke={b.grad}
                strokeWidth={1.8}
                strokeLinecap="round"
                filter="url(#bGlow)"
                style={{ opacity: 0 }}
              />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}

// ─── Animated stat counter ────────────────────────────────────────────────────

function StatCounter({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const el = ref.current;
    const duration = 1800;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * value) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value, suffix]);

  return (
    <span ref={ref} className={`text-3xl sm:text-4xl font-black tabular-nums ${color}`}>
      0{suffix}
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const fadeUp = (delay = 0) => ({
    initial:     { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport:    { once: true, margin: "-60px" } as const,
    transition:  { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#f8f9ff] via-[#f1f3fe] to-[#eceef8] pb-20 md:pb-28 pt-0"
    >
        <ScrollBeamDivider />
      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute rounded-full blur-[130px]"
          style={{ width: 560, height: 560, top: -80, left: -120, background: "radial-gradient(circle,rgba(124,58,237,0.07),transparent)" }} />
        <div className="absolute rounded-full blur-[100px]"
          style={{ width: 420, height: 420, bottom: 0, right: -80, background: "radial-gradient(circle,rgba(79,70,229,0.06),transparent)" }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(124,58,237,1) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      {/* ════ HERO — headline + diagram ════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 lg:pt-28">

        {/* Badge */}
        <motion.div {...fadeUp(0)} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(139,92,246,0.25)", color: "#7c3aed" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Solution Section
          </span>
        </motion.div>

        {/* 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.08fr] gap-12 lg:gap-14 items-center">

          {/* LEFT copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.72, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-[3.2rem] font-black leading-[1.06] tracking-tight text-slate-900 mb-5">
              Meet{" "}
              <span style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Expendesk
              </span>
              <br />
              <span className="text-[2rem] sm:text-[2.4rem] lg:text-[2.6rem] font-bold leading-tight text-slate-800">
                The{" "}
                <span style={{ background: "linear-gradient(90deg,#7c3aed,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Smarter Way
                </span>{" "}
                to<br />Manage Business Spending
              </span>
            </h2>

            <p className="text-[15px] leading-relaxed text-slate-500 mb-7 max-w-md">
              Expendesk brings every expense, reimbursement, approval, and spending policy into one centralized platform.
            </p>

            {/* Bullets */}
            <div className="space-y-3 mb-8">
              {[
                { text: "No spreadsheets.",             ok: false },
                { text: "No manual follow-ups.",        ok: false },
                { text: "No guesswork.",                ok: false },
                { text: "Just complete financial control.", ok: true },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.08, duration: 0.45 }}
                  className="flex items-center gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    item.ok ? "bg-violet-600 text-white shadow-sm shadow-violet-200" : "bg-rose-50 border border-rose-200 text-rose-400"
                  }`}>
                    {item.ok ? <IconCheck /> : <IconX />}
                  </span>
                  <span className={`text-sm sm:text-[15px] font-medium ${item.ok ? "text-violet-700 font-semibold" : "text-slate-500"}`}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 35px rgba(124,58,237,0.28)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white text-[13.5px] transition-all duration-300"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 6px 24px rgba(124,58,237,0.22),inset 0 1px 0 rgba(255,255,255,0.15)" }}>
              See Expendesk in Action
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </motion.button>
          </motion.div>

          {/* RIGHT — Node diagram */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <NodeDiagram />
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(124,58,237,0.25),transparent)" }} />
      </div>

      {/* ════ FEATURES ════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            With{" "}
            <span style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Expendesk
            </span>
            , You Can:
          </h3>
          <p className="mt-3 text-slate-500 text-[15px] max-w-lg mx-auto">
            Everything your finance team needs, in one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          {features.map((feat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`group relative cursor-default rounded-2xl p-4 transition-all duration-300 ${feat.border}`}
              style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.05)", backdropFilter: "blur(12px)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-violet-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br ${feat.color}`}
                style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
                <span className={feat.iconColor}>{feat.icon}</span>
              </div>
              <div className={`w-1.5 h-1.5 rounded-full ${feat.dot} mb-2 opacity-60`} />
              <h4 className="text-slate-900 font-bold text-[12.5px] leading-snug mb-1.5">{feat.title}</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(124,58,237,0.2),transparent)" }} />
      </div>

      {/* ════ STATS + CTA ════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* Stats 2×2 */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55 }}
                className="group relative rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(0,0,0,0.05)", backdropFilter: "blur(16px)", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle,rgba(124,58,237,0.25),transparent)" }} />
                <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(90deg,transparent,#7c3aed,transparent)" }} />
                <div className="relative z-10">
                  <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
                  {stat.value !== null
                    ? <StatCounter value={stat.value} suffix={stat.suffix} color={stat.color} />
                    : <span className={`text-2xl sm:text-3xl font-black ${stat.color}`}>Real-Time</span>}
                  <div className="text-slate-800 font-semibold text-xs mt-0.5">{stat.label}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{stat.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA card with dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative rounded-2xl overflow-hidden flex flex-col"
            style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(139,92,246,0.15)", backdropFilter: "blur(20px)", boxShadow: "0 8px 40px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.9)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%,rgba(124,58,237,0.04),transparent 70%)" }} />

            {/* Mini dashboard */}
            <div className="relative z-10 p-5 flex-1">
              <div className="rounded-xl overflow-hidden"
                style={{ background: "rgba(10,8,25,0.92)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 6px 28px rgba(0,0,0,0.2)" }}>
                <div className="px-4 py-2.5 border-b border-white/[0.05] flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="text-slate-400 text-[11px] font-semibold ml-1">Dashboard</span>
                </div>
                <div className="p-4">
                  <div className="text-slate-500 text-[10px] mb-0.5 font-medium tracking-wide">Total Spending</div>
                  <div className="text-white text-2xl font-black mb-0.5">$187,540</div>
                  <div className="text-emerald-400 text-[11px] font-semibold mb-4">↑ +12.9% vs last month</div>
                  <svg viewBox="0 0 200 36" className="w-full mb-4" style={{ height: 36 }}>
                    <defs>
                      <linearGradient id="sparkG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,30 L28,24 L55,26 L80,14 L105,18 L130,6 L155,10 L180,2 L200,5" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M0,30 L28,24 L55,26 L80,14 L105,18 L130,6 L155,10 L180,2 L200,5 L200,36 L0,36 Z" fill="url(#sparkG)" opacity="0.35" />
                  </svg>
                  <div className="flex items-center justify-between text-[9px] font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                    <span className="w-28">Name</span><span className="w-14 text-right">Amount</span>
                    <span className="w-16 text-right hidden sm:block">Team</span><span className="w-14 text-right">Status</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "Cloud Services", amount: "$1,230.00", dept: "Engineering", status: "Approved" },
                      { name: "Designing",               amount: "$340.00",   dept: "Design",      status: "Approved" },
                      { name: "Transportation",                amount: "$48.90",    dept: "Sales",       status: "Approved" },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300 truncate w-28">{row.name}</span>
                        <span className="text-slate-400 w-14 text-right">{row.amount}</span>
                        <span className="text-slate-500 w-16 text-right hidden sm:block text-[10px]">{row.dept}</span>
                        <span className="text-emerald-400 w-14 text-right font-semibold">{row.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA text */}
            <div className="relative z-10 px-5 pb-5" style={{ borderTop: "1px solid rgba(124,58,237,0.08)" }}>
              <div className="pt-4">
                <h4 className="text-slate-900 text-lg font-black mb-1.5 tracking-tight">Ready to Replace Expense Chaos?</h4>
                <p className="text-slate-500 text-[13px] mb-4 leading-relaxed">
                  See how Expendesk transforms spending management from reactive to automated.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(124,58,237,0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl font-bold text-white text-[13.5px] flex items-center justify-center gap-2 transition-all duration-300"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", boxShadow: "0 4px 18px rgba(124,58,237,0.18),inset 0 1px 0 rgba(255,255,255,0.15)" }}>
                  See Expendesk in Action
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}