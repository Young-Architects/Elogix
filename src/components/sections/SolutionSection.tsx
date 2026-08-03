"use client";

/**
 * SolutionSection — "from chaos to control" (id="solution").
 *
 * Three stacked blocks:
 *  1. `NodeDiagram` — chaos nodes (left) and control nodes (right) wired to a
 *     central Expendesk hub by animated SVG beams. Like ProblemSection, the
 *     beam paths are computed from measured DOM positions and redrawn on resize.
 *  2. `FeaturesSection` — an auto-scrolling marquee of feature cards on mobile/
 *     tablet (<1024px, pauses on press) that becomes a static grid on desktop.
 *  3. Stats (animated `StatCounter`s) + a CTA card containing a mini dashboard
 *     mockup with a sparkline.
 *
 * Inline SVG components (IconCamera, IconBolt, …) are mapped from string
 * `iconKey`s in `src/data/sections/solution.json` via FEATURE_ICON_MAP /
 * STAT_ICON_MAP. All copy/figures live in that JSON.
 */

import React, { useCallback, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";
import ScrollBeamDivider from "../ui/ScrollBeamDivider";
import MagneticButton from "@/components/ui/MagneticButton";
import solutionData from "@/data/sections/solution.json";
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

// ─── Icon maps — React components keyed by iconKey string in JSON ─────────────

const FEATURE_ICON_MAP: Record<string, React.ReactNode> = {
  camera:    <IconCamera />,
  bolt:      <IconBolt />,
  shield:    <IconShield />,
  users:     <IconUsers />,
  refresh:   <IconRefresh />,
  file:      <IconFile />,
  "bar-chart": <IconBarChart />,
};

const STAT_ICON_MAP: Record<string, React.ReactNode> = {
  bolt:        <IconBolt />,
  refresh:     <IconRefresh />,
  shield:      <IconShield />,
  "bar-chart": <IconBarChart />,
};

// ─── Data — imported from @/data/sections/solution.json ──────────────────────

const features = solutionData.featuresSection.features.map((f) => ({
  ...f,
  icon: FEATURE_ICON_MAP[f.iconKey] ?? null,
}));

const stats = solutionData.stats.map((s) => ({
  ...s,
  icon: STAT_ICON_MAP[s.iconKey] ?? null,
}));

// ─── Node diagram data ────────────────────────────────────────────────────────

const chaosNodes  = solutionData.nodeDiagram.chaosNodes;
const controlNodes = solutionData.nodeDiagram.controlNodes;

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

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => buildBeams());
    ro.observe(el);
    const t = setTimeout(buildBeams, 200);
    return () => { ro.disconnect(); clearTimeout(t); };
  }, [buildBeams]);

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
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background:     "rgba(255,255,255,0.92)",
          border:         "1px solid rgba(139,92,246,0.14)",
          backdropFilter: "blur(20px)",
          boxShadow:      "0 8px 40px rgba(124,58,237,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 pb-2.5 border-b border-slate-100/80">
          <span className="flex items-center gap-2 text-[13px] sm:text-[14.5px] font-extrabold tracking-[0.14em] uppercase text-rose-500">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            {solutionData.nodeDiagram.chaosLabel}
          </span>
          <span className="flex items-center gap-2 text-[13px] sm:text-[14.5px] font-extrabold tracking-[0.14em] uppercase text-indigo-600">
            {solutionData.nodeDiagram.controlLabel}
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-x-2 sm:gap-x-5 md:gap-x-7 px-2 sm:px-5 py-4 sm:py-5 items-center">

          <div className="flex flex-col gap-2 min-w-0">
            {chaosNodes.map((node, i) => (
              <React.Fragment key={`chaos-${i}`}>
                <div
                  ref={(el) => { leftRefs.current[i] = el; }}
                  className="relative flex items-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-2.5 py-2 sm:py-2.5 bg-white border border-rose-100 overflow-hidden"
                  style={{ boxShadow: "0 1px 6px rgba(244,63,94,0.07)" }}
                >
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-rose-400" />
                  <span className="flex-shrink-0 w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-rose-50 flex items-center justify-center text-[10px] sm:text-sm leading-none">
                    {node.icon}
                  </span>
                  <span className="text-[12.5px] sm:text-[14px] md:text-[15px] font-semibold text-slate-800 leading-snug flex-1 min-w-0 break-words">
                    {node.label}
                  </span>
                  <span className="flex-shrink-0 w-[18px] h-[18px] rounded-full bg-rose-50 border border-rose-200 items-center justify-center ml-1 hidden sm:flex">
                    <span className="text-rose-500 text-[8px] font-black leading-none">✕</span>
                  </span>
                </div>
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

          <div className="flex items-center justify-center">
            <div
              ref={centerRef}
              className="relative flex-shrink-0 w-[68px] h-[68px] sm:w-[92px] sm:h-[92px] md:w-[116px] md:h-[116px] rounded-full flex flex-col items-center justify-center"
              style={{
                background: "linear-gradient(145deg,#7c3aed 0%,#4f46e5 55%,#312e81 100%)",
                boxShadow:  "0 0 0 8px rgba(124,58,237,0.07),0 0 28px rgba(124,58,237,0.28)",
              }}
            >
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "rgba(124,58,237,0.1)", animationDuration: "2.5s" }}
              />
              <span className="relative z-10 text-white font-black text-xl sm:text-2xl leading-none">{solutionData.nodeDiagram.brandName.charAt(0)}</span>
              <span className="relative z-10 text-white/90 font-bold text-[8.5px] sm:text-[10px] tracking-[1px] mt-0.5 leading-none">
                {solutionData.nodeDiagram.brandName}
              </span>
              <span className="relative z-10 text-violet-200/80 text-[7px] sm:text-[8.5px] text-center leading-tight mt-1 px-1 hidden sm:block">
                {solutionData.nodeDiagram.brandTaglineParts[0]}<br />{solutionData.nodeDiagram.brandTaglineParts[1]}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-0">
            {controlNodes.map((node, i) => (
              <React.Fragment key={`ctrl-${i}`}>
                <div
                  ref={(el) => { rightRefs.current[i] = el; }}
                  className="relative flex items-center gap-1.5 sm:gap-2 rounded-xl px-2 sm:px-2.5 py-2 sm:py-2.5 bg-white border border-indigo-100 overflow-hidden"
                  style={{ boxShadow: "0 1px 6px rgba(79,70,229,0.07)" }}
                >
                  <span className="flex-shrink-0 w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] sm:text-sm leading-none">
                    {node.icon}
                  </span>
                  <span className="text-[12.5px] sm:text-[14px] md:text-[15px] font-semibold text-slate-800 leading-snug flex-1 min-w-0 break-words">
                    {node.label}
                  </span>
                  <span className="flex-shrink-0 w-[18px] h-[18px] rounded-full bg-emerald-50 border border-emerald-200 items-center justify-center ml-1 hidden sm:flex">
                    <span className="text-emerald-500 text-[8px] font-black leading-none">✓</span>
                  </span>
                  <span className="absolute right-0 top-2 bottom-2 w-[3px] rounded-l-full bg-indigo-400" />
                </div>
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

// ─── Features Carousel (auto-scroll on mobile/tablet, grid on desktop) ────────

function FeaturesSection() {
  const trackRef   = useRef<HTMLDivElement>(null);
  const animRef    = useRef<number | null>(null);
  const pausedRef  = useRef(false);
  const posRef     = useRef(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Auto-scroll: only runs on mobile/tablet (lg breakpoint = 1024px)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const SPEED = 0.38; // slightly slower — easier to read

    const step = () => {
      if (!pausedRef.current && window.innerWidth < 1024) {
        posRef.current += SPEED;
        const half = track.scrollWidth / 2;
        if (posRef.current >= half) posRef.current -= half;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const pause  = () => { pausedRef.current = true;  setIsPaused(true);  };
  const resume = () => { pausedRef.current = false; setIsPaused(false); };

  // Duplicated cards for seamless loop
  const allCards = [...features, ...features];

  return (
    <>
      {/* ── Mobile / Tablet: auto-scroll carousel ── */}
      <div className="lg:hidden">

        {/* Pause hint pill — tells users they can hold to read */}
        <div className="flex justify-center mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-300 ${
              isPaused
                ? "bg-violet-100 text-violet-700 border border-violet-200"
                : "bg-slate-100 text-slate-400 border border-slate-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                isPaused ? "bg-violet-500" : "bg-slate-300"
              }`}
            />
            {isPaused ? "Paused — release to continue" : "Hold any card to pause & read"}
          </span>
        </div>

        <div
          className="relative overflow-hidden"
          style={{
            maskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
          }}
        >
          <div
            ref={trackRef}
            className="flex gap-3 py-1"
            style={{ width: "max-content", willChange: "transform" }}
          >
            {allCards.map((feat, i) => (
              <div
                key={i}
                onPointerDown={pause}
                onPointerUp={resume}
                onPointerLeave={resume}
                onTouchStart={pause}
                onTouchEnd={resume}
                className={`group relative cursor-pointer rounded-2xl p-4 flex-shrink-0 flex flex-col transition-all duration-200 select-none ${feat.border}`}
                style={{
                  width: "168px",
                  background: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(0,0,0,0.05)",
                  backdropFilter: "blur(12px)",
                  boxShadow: isPaused
                    ? "0 4px 20px rgba(124,58,237,0.12)"
                    : "0 2px 12px rgba(0,0,0,0.04)",
                  transform: isPaused ? "scale(1.02)" : "scale(1)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-violet-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 flex-shrink-0 bg-gradient-to-br ${feat.color}`}
                  style={{ border: "1px solid rgba(0,0,0,0.04)" }}
                >
                  <span className={feat.iconColor}>{feat.icon}</span>
                </div>
                {/* Dot */}
                <div className={`w-1.5 h-1.5 rounded-full ${feat.dot} mb-2 opacity-60 flex-shrink-0`} />
                {/* Title */}
                <h4 className="text-slate-900 font-bold text-[12.5px] leading-snug mb-1.5 flex-shrink-0">
                  {feat.title}
                </h4>
                {/* Description — sits naturally below, no extra space */}
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Desktop: original 7-col grid ── */}
      <div className="hidden lg:grid grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        {features.map((feat, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`group relative cursor-default rounded-2xl p-4 flex flex-col transition-all duration-300 ${feat.border}`}
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(0,0,0,0.05)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-violet-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 bg-gradient-to-br ${feat.color}`}
              style={{ border: "1px solid rgba(0,0,0,0.04)" }}
            >
              <span className={feat.iconColor}>{feat.icon}</span>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full ${feat.dot} mb-2 opacity-60 flex-shrink-0`} />
            <h4 className="text-slate-900 font-bold text-[12.5px] leading-snug mb-1.5 flex-shrink-0">{feat.title}</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </>
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
      id="solution"
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
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[14px] font-semibold tracking-widest uppercase"
            style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(139,92,246,0.25)", color: "#7c3aed" }}>
            <Sparkles className="w-4 h-4" />
            {solutionData.badge}
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
              {solutionData.hero.headline.pre}{" "}
              <span style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {solutionData.hero.headline.brand}
              </span>
              <br />
              <span className="text-[2rem] sm:text-[2.4rem] lg:text-[2.6rem] font-bold leading-tight text-slate-800">
                The{" "}
                <span style={{ background: "linear-gradient(90deg,#7c3aed,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {solutionData.hero.headline.subAccent}
                </span>{" "}
                {solutionData.hero.headline.subPostPre}<br />{solutionData.hero.headline.subPostSuffix}
              </span>
            </h2>

            <p className="text-[15px] leading-relaxed text-slate-500 mb-7 max-w-md">
              {solutionData.hero.description}
            </p>

            {/* Bullets */}
            <div className="space-y-3 mb-8">
              {solutionData.hero.bullets.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.08, duration: 0.45 }}
                  className="flex items-center gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    item.positive ? "bg-violet-600 text-white shadow-sm shadow-violet-200" : "bg-rose-50 border border-rose-200 text-rose-400"
                  }`}>
                    {item.positive ? <IconCheck /> : <IconX />}
                  </span>
                  <span className={`text-sm sm:text-[15px] font-medium ${item.positive ? "text-violet-700 font-semibold" : "text-slate-500"}`}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.5 }}
              className="inline-block"
            >
              <MagneticButton
                href={solutionData.hero.ctaHref}
                variant="primary"
                className="rounded-xl px-7 py-3.5"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                }
              >
                {solutionData.hero.cta}
              </MagneticButton>
            </motion.div>
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
            {solutionData.featuresSection.headingParts.pre}
            <span style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {solutionData.featuresSection.headingParts.brand}
            </span>
            {solutionData.featuresSection.headingParts.post}
          </h3>
          <p className="mt-3 text-slate-500 text-[15px] max-w-lg mx-auto">
            {solutionData.featuresSection.subheading}
          </p>
        </motion.div>

        {/* ── Carousel on mobile/tablet, grid on desktop ── */}
        <FeaturesSection />
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
                    : <span className={`text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.valueText}</span>}
                  <div className="text-slate-800 font-semibold text-xs mt-0.5">{stat.label}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{stat.sub}</div>
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
                  <span className="text-slate-400 text-[11px] font-semibold ml-1">{solutionData.dashboardPreview.title}</span>
                </div>
                <div className="p-4">
                  <div className="text-slate-500 text-[10px] mb-0.5 font-medium tracking-wide">{solutionData.dashboardPreview.totalLabel}</div>
                  <div className="text-white text-2xl font-black mb-0.5">{solutionData.dashboardPreview.totalSpending}</div>
                  <div className="text-emerald-400 text-[11px] font-semibold mb-4">{solutionData.dashboardPreview.trend}</div>
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
                    {solutionData.dashboardPreview.transactions.map((row, i) => (
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
                <h4 className="text-slate-900 text-lg font-black mb-1.5 tracking-tight">{solutionData.dashboardCta.headline}</h4>
                <p className="text-slate-500 text-[13px] mb-4 leading-relaxed">
                  {solutionData.dashboardCta.description}
                </p>
                <MagneticButton
                  href={solutionData.dashboardCta.buttonHref}
                  variant="primary"
                  fullWidth
                  className="rounded-xl py-3"
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  }
                >
                  {solutionData.dashboardCta.buttonLabel}
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}