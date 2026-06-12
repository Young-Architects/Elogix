"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollBeamDivider from "../ui/ScrollBeamDivider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const LEAD_MAGNET_DATA = {
  eyebrow: "Free eBook",
  headline: {
    plain1: "The",
    accent: "Hidden Cost",
    plain2: "of Poor Expense Management",
  },
  subheadline:
    "Discover how growing businesses lose thousands every month through inefficient expense processes—and learn the proven framework leading companies use to gain control.",
  insideLabel: "Inside you'll learn:",
  bullets: [
    "The 7 most common expense management mistakes",
    "How to reduce reimbursement delays",
    "Ways to eliminate financial leakage",
    "Best practices for scaling expense processes",
    "A practical framework for improving profitability",
  ],
  ctaButton: "Download Free eBook",
  ctaNote: "No spam. Actionable insights only.",
  pdfPlaceholderUrl: "/placeholder-ebook.pdf",
  bookMeta: { pages: "24 pages", format: "PDF", level: "SME / Mid-Market" },
  chartBars: [35, 55, 40, 70, 50, 85, 60],
};

const EASE = [0.23, 1, 0.32, 1] as const;

// ─── PARTICLE ─────────────────────────────────────────────────────────────────
function Particle({
  delay,
  x,
  y,
  size,
}: {
  delay: number;
  x: string;
  y: string;
  size: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: "radial-gradient(circle, rgba(124,58,237,0.45), transparent)",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.55, 0], scale: [0, 1, 0], y: [0, -50, -100] }}
      transition={{ duration: 5, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── HEADLINE WORD REVEAL ─────────────────────────────────────────────────────
function RevealWords({
  text,
  isInView,
  baseDelay = 0,
  className = "",
}: {
  text: string;
  isInView: boolean;
  baseDelay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
        >
          <motion.span
            className="inline-block"
            initial={reduce ? { opacity: 0 } : { y: "110%", opacity: 0 }}
            animate={
              isInView
                ? reduce
                  ? { opacity: 1 }
                  : { y: "0%", opacity: 1 }
                : {}
            }
            transition={{
              duration: 0.65,
              delay: baseDelay + i * 0.055,
              ease: EASE,
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

// ─── EBOOK COVER (mouse-tracked 3D tilt) ──────────────────────────────────────
function EbookCover({ isInView }: { isInView: boolean }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [10, -10]), {
    stiffness: 140,
    damping: 16,
  });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [-7, 7]), {
    stiffness: 140,
    damping: 16,
  });
  const glareX = useTransform(mx, [-0.5, 0.5], ["20%", "80%"]);
  const glareY = useTransform(my, [-0.5, 0.5], ["15%", "85%"]);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.14), transparent 55%)`
  );

  const handleMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduce || e.pointerType === "touch") return;
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my, reduce]
  );

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }, [mx, my]);

  return (
    <div
      ref={wrapRef}
      onPointerMove={handleMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={handleLeave}
      style={{ perspective: 1400 }}
      className="relative"
    >
      {/* Rotating gradient halo — wrapped in a clipped layer so the blur
          can never expand the paint area past the section edge */}
      {!reduce && (
        <div
          aria-hidden
          className="absolute pointer-events-none -z-10 overflow-hidden rounded-full"
          style={{ inset: "-14%", contain: "paint" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(124,58,237,0.0), rgba(168,85,247,0.22), rgba(236,72,153,0.16), rgba(124,58,237,0.0))",
              filter: "blur(28px)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      <motion.div
        style={{
          rotateY: reduce ? 0 : rotY,
          rotateX: reduce ? 0 : rotX,
          transformStyle: "preserve-3d",
        }}
        animate={reduce ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative will-change-transform"
      >
        {/* Spine */}
        <div
          aria-hidden
          className="absolute top-0 rounded-l-[4px]"
          style={{
            left: -13,
            width: 13,
            height: "100%",
            background: "linear-gradient(90deg, #0a0420 0%, #1a0e45 100%)",
            boxShadow: "-2px 0 8px rgba(0,0,0,0.4)",
            transform: "translateZ(-6px)",
          }}
        />
        {/* Pages edge */}
        <div
          aria-hidden
          className="absolute rounded-r-[10px]"
          style={{
            top: 5,
            bottom: 5,
            right: -5,
            width: 7,
            background:
              "repeating-linear-gradient(180deg, #e9e6f5 0px, #e9e6f5 1.5px, #cdc8e2 1.5px, #cdc8e2 3px)",
            transform: "translateZ(-3px)",
          }}
        />
        {/* Cover */}
        <div
          className="relative flex flex-col overflow-hidden w-[210px] h-[278px] sm:w-[240px] sm:h-[318px] lg:w-[268px] lg:h-[354px]"
          style={{
            borderRadius: "4px 14px 14px 4px",
            background:
              "linear-gradient(145deg, #2d1d6e 0%, #1a0e45 50%, #0f0730 100%)",
            boxShadow:
              "2px 0 0 rgba(255,255,255,0.06) inset, -2px 0 0 rgba(0,0,0,0.3) inset, 0 25px 70px rgba(15,7,48,0.5), 0 6px 20px rgba(124,58,237,0.32)",
            padding: "22px 20px 18px",
          }}
        >
          {/* Mouse glare */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background: glareBackground,
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.4s",
              }}
            />
          )}
          {/* Periodic shine sweep */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="absolute top-0 h-full w-20 pointer-events-none z-20 -skew-x-12"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
              }}
              initial={{ x: -120 }}
              animate={{ x: 420 }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                repeatDelay: 4.2,
                ease: "easeInOut",
              }}
            />
          )}
          <div
            aria-hidden
            className="absolute pointer-events-none rounded-full"
            style={{
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              background:
                "radial-gradient(circle, rgba(168,85,247,0.28), transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div
            className="relative z-10 mb-2 self-start px-3 py-[3px] rounded-full text-white font-extrabold tracking-widest"
            style={{
              fontSize: 9,
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
            }}
          >
            FREE eBOOK
          </div>
          <div
            className="relative z-10 flex items-center gap-1.5 mb-auto"
            style={{ fontSize: 9 }}
          >
            <span
              className="flex items-center justify-center rounded-[5px] text-white font-black"
              style={{
                width: 17,
                height: 17,
                fontSize: 10,
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              }}
            >
              E
            </span>
            <span
              className="font-bold tracking-[0.14em] uppercase"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              EXPENDESK
            </span>
          </div>
          <div className="relative z-10 mb-4" style={{ transform: "translateZ(24px)" }}>
            <div
              className="mb-3 rounded-sm"
              style={{
                width: 34,
                height: 3,
                background: "linear-gradient(90deg, #a855f7, #ec4899)",
              }}
            />
            <h3
              className="text-white font-extrabold leading-snug m-0 text-[14px] sm:text-[15px] lg:text-[16px]"
              style={{ letterSpacing: "-0.01em" }}
            >
              {LEAD_MAGNET_DATA.headline.plain1}{" "}
              {LEAD_MAGNET_DATA.headline.accent} of Poor Expense Management
            </h3>
          </div>
          <div
            className="relative z-10 flex items-end gap-1 mb-4"
            style={{ height: 48, transform: "translateZ(16px)" }}
          >
            {LEAD_MAGNET_DATA.chartBars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-[3px]"
                style={{
                  height: `${h}%`,
                  background:
                    "linear-gradient(180deg, rgba(168,85,247,0.85), rgba(124,58,237,0.4))",
                  transformOrigin: "bottom",
                }}
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : {}}
                transition={{ delay: 0.9 + i * 0.08, duration: 0.55, ease: "backOut" }}
                whileHover={reduce ? {} : { scaleY: 1.12 }}
              />
            ))}
          </div>
          <div
            className="relative z-10 flex items-center gap-2 font-medium"
            style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}
          >
            <span>{LEAD_MAGNET_DATA.bookMeta.pages}</span>
            <span className="rounded-full w-[3px] h-[3px]" style={{ background: "rgba(255,255,255,0.2)" }} />
            <span>{LEAD_MAGNET_DATA.bookMeta.format}</span>
            <span className="rounded-full w-[3px] h-[3px]" style={{ background: "rgba(255,255,255,0.2)" }} />
            <span>{LEAD_MAGNET_DATA.bookMeta.level}</span>
          </div>
        </div>

        {/* Ground shadow */}
        <motion.div
          aria-hidden
          className="absolute rounded-[50%] -z-10"
          style={{
            bottom: -24,
            left: "8%",
            width: "88%",
            height: 30,
            background: "rgba(15,7,48,0.38)",
            filter: "blur(16px)",
          }}
          animate={{ opacity: hovered ? 0.5 : 0.24, scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </div>
  );
}

// ─── DOWNLOAD BUTTON (magnetic + states) ──────────────────────────────────────
function DownloadButton({ onClick }: { onClick: () => void }) {
  const reduce = useReducedMotion();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleClick = () => {
    if (state !== "idle") return;
    setState("loading");
    setTimeout(() => {
      onClick();
      setState("done");
      setTimeout(() => setState("idle"), 3000);
    }, 1400);
  };

  return (
    <motion.button
      onClick={handleClick}
      style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
        boxShadow:
          "0 4px 20px rgba(124,58,237,0.35), 0 1px 4px rgba(124,58,237,0.2)",
      }}
      whileHover={reduce || state !== "idle" ? {} : { scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      aria-live="polite"
      className="relative overflow-hidden inline-flex items-center justify-center h-[52px] px-7 rounded-xl font-bold text-[15px] text-white border-0 cursor-pointer w-full sm:w-auto sm:min-w-[230px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
    >
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.span
            key="idle"
            className="flex items-center gap-2 relative z-10"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {LEAD_MAGNET_DATA.ctaButton}
          </motion.span>
        )}
        {state === "loading" && (
          <motion.span
            key="loading"
            className="flex items-center gap-2 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            Preparing your eBook…
          </motion.span>
        )}
        {state === "done" && (
          <motion.span
            key="done"
            className="flex items-center gap-2 relative z-10"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            eBook on its way!
          </motion.span>
        )}
      </AnimatePresence>
      {!reduce && (
        <motion.span
          aria-hidden
          className="absolute top-0 left-0 w-14 h-full -skew-x-12 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "300%" }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 1.4, ease: [0.4, 0, 0.2, 1] }}
        />
      )}
    </motion.button>
  );
}

// ─── FLOATING TAG ─────────────────────────────────────────────────────────────
function FloatingTag({
  children,
  dotColor,
  className,
  floatDelay = 0,
  direction = -1,
}: {
  children: React.ReactNode;
  dotColor: string;
  className: string;
  floatDelay?: number;
  direction?: 1 | -1;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`absolute flex items-center gap-2 rounded-[10px] px-3 py-2 text-[11px] sm:text-[12px] font-semibold text-[#2d2350] whitespace-nowrap border border-violet-100 pointer-events-none z-20 ${className}`}
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: "0 4px 18px rgba(0,0,0,0.09)",
      }}
      animate={reduce ? {} : { y: [0, 6 * direction, 0] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
      {children}
    </motion.div>
  );
}

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
export default function LeadMagnetSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        delay: i * 0.45,
        x: `${10 + ((i * 73) % 78)}%`,
        y: `${12 + ((i * 47) % 74)}%`,
        size: 4 + (i % 4) * 2,
      })),
    []
  );

  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.to(".lm-bg-blob", {
        backgroundPosition: "100% 50%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce]);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = LEAD_MAGNET_DATA.pdfPlaceholderUrl;
    a.download = "Expendesk-Hidden-Cost-Ebook.pdf";
    a.click();
  };

  return (
    <section
      ref={sectionRef}
      id="lead-magnet"
      className="relative bg-[#f8f9ff] pt-0 pb-16 sm:pb-20 lg:pb-24"
      style={{ overflowX: "hidden", overflowY: "clip" }}
    >
      <ScrollBeamDivider />

      {/* Ambient background */}
      <div
        aria-hidden
        className="lm-bg-blob absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 75% 55% at 18% 50%, rgba(124,58,237,0.07) 0%, transparent 70%), radial-gradient(ellipse 55% 45% at 82% 38%, rgba(168,85,247,0.05) 0%, transparent 70%)",
          backgroundSize: "200% 200%",
        }}
      />

      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pt-10 sm:pt-12 lg:pt-14">
        {/* Eyebrow */}
        <motion.div
          className="flex justify-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.09em] uppercase text-violet-600 bg-violet-50 border border-violet-200/60">
            <span
              className="w-[6px] h-[6px] rounded-full bg-violet-600"
              style={{ animation: reduce ? "none" : "lm-pulse 2s ease-in-out infinite" }}
            />
            {LEAD_MAGNET_DATA.eyebrow}
          </span>
        </motion.div>

        {/* Grid */}
        <div className="flex flex-col-reverse gap-12 sm:gap-14 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* LEFT — copy */}
          <div>
            <h2 className="text-[clamp(27px,5vw,46px)] font-extrabold leading-[1.12] tracking-tight text-[#1a1140] mb-4 sm:mb-5">
              <RevealWords text={LEAD_MAGNET_DATA.headline.plain1} isInView={isInView} />{" "}
              <RevealWords
                text={LEAD_MAGNET_DATA.headline.accent}
                isInView={isInView}
                baseDelay={0.06}
                className="bg-clip-text text-transparent"
              />
              <style>{`
                #lead-magnet h2 .bg-clip-text {
                  background-image: linear-gradient(120deg, #7c3aed, #a855f7 55%, #ec4899);
                }
              `}</style>{" "}
              <RevealWords
                text={LEAD_MAGNET_DATA.headline.plain2}
                isInView={isInView}
                baseDelay={0.17}
              />
            </h2>

            <motion.p
              className="text-[15px] sm:text-base leading-[1.72] text-[#5a5580] mb-8 max-w-[480px]"
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            >
              {LEAD_MAGNET_DATA.subheadline}
            </motion.p>

            <motion.p
              className="text-[11px] font-bold tracking-[0.1em] uppercase text-violet-600 mb-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.42 }}
            >
              {LEAD_MAGNET_DATA.insideLabel}
            </motion.p>

            <ul className="flex flex-col gap-3 mb-8 p-0 list-none">
              {LEAD_MAGNET_DATA.bullets.map((bullet, i) => (
                <motion.li
                  key={i}
                  className="group flex items-start gap-3 text-[14px] sm:text-[15px] text-[#2d2350] leading-relaxed rounded-lg -mx-2 px-2 py-1 transition-colors duration-300 hover:bg-violet-50/70"
                  initial={{ opacity: 0, x: -14 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.45 + i * 0.08, ease: "easeOut" }}
                >
                  <motion.span
                    className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      width: 20,
                      height: 20,
                      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                      boxShadow: "0 2px 8px rgba(124,58,237,0.3)",
                    }}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.55 + i * 0.08, ease: "backOut" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <motion.polyline
                        points="2,5 4.5,7.5 9,2"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={isInView ? { pathLength: 1 } : {}}
                        transition={{ duration: 0.35, delay: 0.7 + i * 0.08 }}
                      />
                    </svg>
                  </motion.span>
                  {bullet}
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.85, ease: EASE }}
            >
              <DownloadButton onClick={handleDownload} />
              <p className="flex items-center justify-center sm:justify-start gap-1.5 mt-3 text-[12px] text-[#8b87a8]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                {LEAD_MAGNET_DATA.ctaNote}
              </p>
            </motion.div>
          </div>

          {/* RIGHT — book */}
          <motion.div
            className="flex justify-center items-center relative px-6 py-8 sm:px-10 sm:py-10"
            initial={{ opacity: 0, y: 32, scale: 0.94 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE }}
          >
            <FloatingTag
              dotColor="bg-green-500"
              className="top-1 right-0 sm:top-2 sm:right-2"
              direction={-1}
            >
              5,000+ downloads
            </FloatingTag>
            <FloatingTag
              dotColor="bg-amber-400"
              className="bottom-3 left-0 sm:bottom-6 sm:left-2"
              floatDelay={0.6}
              direction={1}
            >
              12 min read
            </FloatingTag>

            <EbookCover isInView={isInView} />
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes lm-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(1.45); }
        }
      `}</style>
    </section>
  );
}