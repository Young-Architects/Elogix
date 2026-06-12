"use client";

import { useRef, useState, useMemo } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import ScrollBeamDivider from "../ui/ScrollBeamDivider";

/* ──────────────────────────────────────────────────────────────────────────
   DATA — single source of truth for all copy & numbers
   ────────────────────────────────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────────────────────────────────
   AMBIENT PARTICLE — hidden on small screens & for reduced-motion users
   ────────────────────────────────────────────────────────────────────────── */
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
  return (
    <motion.div
      aria-hidden
      className="absolute rounded-full pointer-events-none hidden md:block"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: "radial-gradient(circle, rgba(124,58,237,0.4), transparent)",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0], y: [0, -50, -100] }}
      transition={{ duration: 5, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   FLOATING GLASS TAG — frosted badge that orbits the book
   ────────────────────────────────────────────────────────────────────────── */
function FloatingTag({
  children,
  dotClass,
  className = "",
  floatY = -6,
  delay = 0,
  reduceMotion,
}: {
  children: React.ReactNode;
  dotClass: string;
  className?: string;
  floatY?: number;
  delay?: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      className={`absolute z-20 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-full sm:rounded-[12px] border border-white/70 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-[12px] font-semibold text-[#2d2350] pointer-events-none ${className}`}
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow:
          "0 8px 24px rgba(26,17,64,0.12), 0 1px 0 rgba(255,255,255,0.9) inset",
      }}
      animate={reduceMotion ? {} : { y: [0, floatY, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <span className={`h-1.5 w-1.5 sm:h-2 sm:w-2 flex-shrink-0 rounded-full ${dotClass}`} />
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   EBOOK COVER — fully fluid: root font-size scales with viewport, all
   internal dimensions are em-based, so the whole book resizes as one unit.
   ────────────────────────────────────────────────────────────────────────── */
function EbookCover({
  isHovered,
  inView,
  reduceMotion,
}: {
  isHovered: boolean;
  inView: boolean;
  reduceMotion: boolean;
}) {
  return (
    <div style={{ perspective: 1400 }}>
      <motion.div
        className="relative"
        animate={
          reduceMotion
            ? { rotateY: -6, rotateX: 3 }
            : { rotateY: isHovered ? -12 : -6, rotateX: isHovered ? 5 : 3 }
        }
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          transformStyle: "preserve-3d",
          /* The magic: one fluid unit controls the entire book */
          fontSize: "clamp(7.5px, 2.45vw, 10.5px)",
          width: "clamp(188px, 56vw, 268px)",
          aspectRatio: "66 / 87",
        }}
      >
        {/* Page block — stacked paper edge on the right (premium detail) */}
        <div
          aria-hidden
          className="absolute top-[1.5%] bottom-[1.5%] rounded-r-[0.5em]"
          style={{
            right: "-0.9em",
            width: "1.1em",
            background:
              "repeating-linear-gradient(180deg, #f4f2fb 0px, #f4f2fb 2px, #d9d4ee 2px, #d9d4ee 3px)",
            boxShadow: "2px 2px 10px rgba(15,7,48,0.25)",
            transform: "translateZ(-6px)",
          }}
        />

        {/* Spine */}
        <div
          aria-hidden
          className="absolute top-0 h-full rounded-l-[0.4em]"
          style={{
            left: "-1.2em",
            width: "1.2em",
            background: "linear-gradient(90deg, #08031c 0%, #1a0e45 100%)",
            boxShadow: "-2px 0 10px rgba(0,0,0,0.45)",
          }}
        />

        {/* Front cover */}
        <div
          className="relative flex h-full w-full flex-col overflow-hidden"
          style={{
            borderRadius: "0.4em 1.4em 1.4em 0.4em",
            background:
              "linear-gradient(150deg, #34227e 0%, #1d0f4e 48%, #0e0630 100%)",
            boxShadow:
              "2px 0 0 rgba(255,255,255,0.06) inset, -3px 0 6px rgba(0,0,0,0.35) inset, 0 24px 64px rgba(15,7,48,0.45), 0 6px 20px rgba(124,58,237,0.32)",
            padding: "2.2em 2em 1.8em",
          }}
        >
          {/* Corner glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              top: "-6em",
              right: "-6em",
              width: "20em",
              height: "20em",
              background:
                "radial-gradient(circle, rgba(168,85,247,0.32), transparent 70%)",
            }}
          />
          {/* Fine grid texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
              backgroundSize: "2em 2em",
            }}
          />
          {/* Light sweep across the cover on hover */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-[45%] -skew-x-12"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
            }}
            animate={
              reduceMotion ? { left: "-50%" } : { left: isHovered ? "110%" : "-50%" }
            }
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />

          {/* Badge */}
          <div
            className="relative z-10 mb-[0.8em] self-start rounded-full font-extrabold tracking-widest text-white"
            style={{
              fontSize: "0.9em",
              padding: "0.35em 1.2em",
              background: "linear-gradient(135deg, #a855f7, #ec4899)",
              boxShadow: "0 2px 8px rgba(236,72,153,0.35)",
            }}
          >
            FREE eBOOK
          </div>

          {/* Brand */}
          <div
            className="relative z-10 mb-auto flex items-center gap-[0.6em]"
            style={{ fontSize: "0.9em" }}
          >
            <span
              className="flex items-center justify-center rounded-[0.45em] font-black text-white"
              style={{
                width: "1.8em",
                height: "1.8em",
                fontSize: "1.05em",
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              }}
            >
              E
            </span>
            <span
              className="font-bold uppercase tracking-[0.16em]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              EXPENDESK
            </span>
          </div>

          {/* Title */}
          <div className="relative z-10 mb-[1.6em]">
            <div
              className="mb-[1.1em] rounded-sm"
              style={{
                width: "3.4em",
                height: "0.32em",
                background: "linear-gradient(90deg, #a855f7, #ec4899)",
              }}
            />
            <h3
              className="m-0 font-extrabold leading-snug text-white"
              style={{ fontSize: "1.62em", letterSpacing: "-0.01em" }}
            >
              {LEAD_MAGNET_DATA.headline.plain1}{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #c084fc, #f472b6)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {LEAD_MAGNET_DATA.headline.accent}
              </span>{" "}
              {LEAD_MAGNET_DATA.headline.plain2}
            </h3>
          </div>

          {/* Mini chart */}
          <div
            className="relative z-10 mb-[1.6em] flex items-end gap-[0.4em]"
            style={{ height: "4.8em" }}
          >
            {LEAD_MAGNET_DATA.chartBars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-[0.3em]"
                style={{
                  height: `${h}%`,
                  background:
                    "linear-gradient(180deg, rgba(168,85,247,0.85), rgba(124,58,237,0.35))",
                  transformOrigin: "bottom",
                }}
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{
                  delay: reduceMotion ? 0 : 0.7 + i * 0.07,
                  duration: reduceMotion ? 0 : 0.5,
                  ease: "backOut",
                }}
              />
            ))}
          </div>

          {/* Meta */}
          <div
            className="relative z-10 flex items-center gap-[0.8em] font-medium"
            style={{ fontSize: "0.9em", color: "rgba(255,255,255,0.4)" }}
          >
            <span>{LEAD_MAGNET_DATA.bookMeta.pages}</span>
            <span className="rounded-full" style={{ width: "0.3em", height: "0.3em", background: "rgba(255,255,255,0.25)" }} />
            <span>{LEAD_MAGNET_DATA.bookMeta.format}</span>
            <span className="rounded-full" style={{ width: "0.3em", height: "0.3em", background: "rgba(255,255,255,0.25)" }} />
            <span>{LEAD_MAGNET_DATA.bookMeta.level}</span>
          </div>
        </div>

        {/* Ground shadow */}
        <motion.div
          aria-hidden
          className="absolute -z-10 rounded-[50%]"
          style={{
            bottom: "-2.4em",
            left: "8%",
            width: "88%",
            height: "2.8em",
            background: "rgba(15,7,48,0.4)",
            filter: "blur(14px)",
          }}
          animate={{
            opacity: isHovered ? 0.55 : 0.25,
            scale: isHovered ? 1.06 : 1,
          }}
          transition={{ duration: 0.7 }}
        />
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   DOWNLOAD BUTTON — idle / loading / done states, keyboard-focus visible,
   full-width on mobile.
   ────────────────────────────────────────────────────────────────────────── */
function DownloadButton({
  onClick,
  reduceMotion,
}: {
  onClick: () => void;
  reduceMotion: boolean;
}) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleClick = () => {
    if (state !== "idle") return;
    setState("loading");
    setTimeout(() => {
      onClick();
      setState("done");
      setTimeout(() => setState("idle"), 3000);
    }, 1200);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: state === "idle" && !reduceMotion ? 1.02 : 1 }}
      whileTap={{ scale: 0.97 }}
      aria-live="polite"
      className="relative inline-flex h-[52px] w-full min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-0 px-7 text-[15px] font-bold text-white outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8f9ff] sm:w-auto sm:min-w-[230px]"
      style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
        boxShadow:
          "0 6px 24px rgba(124,58,237,0.38), 0 1px 4px rgba(124,58,237,0.22), 0 1px 0 rgba(255,255,255,0.25) inset",
      }}
    >
      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.span
            key="idle"
            className="relative z-10 flex items-center gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
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
            className="relative z-10 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            Preparing your eBook…
          </motion.span>
        )}
        {state === "done" && (
          <motion.span
            key="done"
            className="relative z-10 flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            eBook on its way!
          </motion.span>
        )}
      </AnimatePresence>

      {/* Sheen sweep */}
      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-full w-14 -skew-x-12"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "320%" }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
        />
      )}
    </motion.button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   MAIN SECTION
   ────────────────────────────────────────────────────────────────────────── */
export default function LeadMagnetSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion() ?? false;
  const [bookHovered, setBookHovered] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        delay: i * 0.55,
        x: `${10 + ((i * 73) % 78)}%`,
        y: `${12 + ((i * 47) % 74)}%`,
        size: 4 + (i % 4) * 2,
      })),
    []
  );

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
      /* scroll-mt keeps the headline clear of a fixed navbar on anchor jumps */
      className="relative overflow-hidden bg-[#f8f9ff] pb-16 pt-0 scroll-mt-24 sm:pb-20 lg:pb-24"
    >
      {/* Divider flush at the top edge */}
      <ScrollBeamDivider />

      {/* Ambient background — slow CSS drift (no GSAP needed) */}
      <div
        aria-hidden
        className="lm-bg-drift pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 75% 55% at 18% 50%, rgba(124,58,237,0.07) 0%, transparent 70%), radial-gradient(ellipse 55% 45% at 82% 38%, rgba(168,85,247,0.05) 0%, transparent 70%)",
          backgroundSize: "180% 180%",
        }}
      />

      {/* Faint dotted texture for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(124,58,237,0.08) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black, transparent)",
        }}
      />

      {!reduceMotion && particles.map((p, i) => <Particle key={i} {...p} />)}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-10 sm:px-8 sm:pt-12 lg:px-10 lg:pt-14">
        {/* Eyebrow */}
        <motion.div
          className="mb-8 flex justify-center sm:mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.09em] text-violet-700"
            style={{
              background:
                "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(135deg, rgba(168,85,247,0.45), rgba(236,72,153,0.3), rgba(124,58,237,0.45)) border-box",
              border: "1px solid transparent",
              boxShadow:
                "0 4px 18px rgba(124,58,237,0.14), 0 1px 3px rgba(26,17,64,0.06)",
            }}
          >
            {/* Open-book icon */}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="flex-shrink-0 text-violet-600"
            >
              <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
              <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
            </svg>
            {LEAD_MAGNET_DATA.eyebrow}
          </span>
        </motion.div>

        {/* Two-column grid — book first on mobile, copy first on desktop */}
        <div className="flex flex-col-reverse gap-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* LEFT — copy */}
          <motion.div
            className="text-center sm:text-left"
            initial={{ opacity: 0, x: -28 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h2 className="mb-4 text-[clamp(26px,4.5vw,44px)] font-extrabold leading-[1.12] tracking-tight text-[#1a1140]">
              {LEAD_MAGNET_DATA.headline.plain1}{" "}
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                {LEAD_MAGNET_DATA.headline.accent}
              </span>{" "}
              {LEAD_MAGNET_DATA.headline.plain2}
            </h2>

            <p className="mx-auto mb-8 max-w-[480px] text-[15px] leading-[1.72] font-medium text-[#5a5580] sm:mx-0 sm:text-base">
              {LEAD_MAGNET_DATA.subheadline}
            </p>

            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-violet-600">
              {LEAD_MAGNET_DATA.insideLabel}
            </p>

            <ul className="mb-8 flex list-none flex-col gap-3 p-0 text-left">
              {LEAD_MAGNET_DATA.bullets.map((bullet, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3 text-[14px] leading-relaxed text-[#2d2350] sm:text-[15px]"
                  initial={{ opacity: 0, x: -14 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.3 + i * 0.07, ease: "easeOut" }}
                >
                  <span
                    className="mt-0.5 flex flex-shrink-0 items-center justify-center rounded-full"
                    style={{
                      width: 20,
                      height: 20,
                      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                      boxShadow: "0 2px 6px rgba(124,58,237,0.3)",
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                      <polyline points="2,5 4.5,7.5 9,2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {bullet}
                </motion.li>
              ))}
            </ul>

            <DownloadButton onClick={handleDownload} reduceMotion={reduceMotion} />

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[#8b87a8] sm:justify-start">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50" aria-hidden>
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {LEAD_MAGNET_DATA.ctaNote}
            </p>
          </motion.div>

          {/* RIGHT — book showcase */}
          <motion.div
            className="relative flex items-center justify-center px-8 py-10 sm:px-12 sm:py-12"
            initial={{ opacity: 0, y: 32, scale: 0.94 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.85, delay: 0.15, ease: EASE }}
            onHoverStart={() => setBookHovered(true)}
            onHoverEnd={() => setBookHovered(false)}
          >
            {/* Halo glow behind the book */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "min(440px, 92%)",
                aspectRatio: "1",
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.16) 0%, rgba(124,58,237,0.07) 42%, transparent 70%)",
                filter: "blur(6px)",
              }}
            />
            {/* Decorative ring */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/50"
              style={{ width: "min(400px, 88%)", aspectRatio: "1" }}
            />

            <FloatingTag
              dotClass="bg-green-500"
              className="right-1 top-1 sm:right-3 sm:top-2"
              floatY={-6}
              reduceMotion={reduceMotion}
            >
              5,000+ downloads
            </FloatingTag>

            <FloatingTag
              dotClass="bg-amber-400"
              className="bottom-2 left-1 sm:bottom-4 sm:left-3"
              floatY={6}
              delay={0.6}
              reduceMotion={reduceMotion}
            >
              12 min read
            </FloatingTag>

            <EbookCover isHovered={bookHovered} inView={isInView} reduceMotion={reduceMotion} />
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes lm-drift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .lm-bg-drift { animation: lm-drift 30s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .lm-bg-drift { animation: none; }
        }
      `}</style>
    </section>
  );
}