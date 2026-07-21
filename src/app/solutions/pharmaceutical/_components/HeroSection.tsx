"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { Sparkles } from "lucide-react";
import HeroChatDock from "@/components/chat/HeroChatDock";
import { openLeadMagnet } from "@/lib/lead-magnet";
import { hero } from "../_data";

// ─── Hex grid background ─────────────────────────────────────────────────
function HexGrid() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="pharma-hex-purple"
          x="0"
          y="0"
          width="56"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="28,2 54,16 54,44 28,58 2,44 2,16"
            fill="none"
            stroke="rgba(124,58,237,0.085)"
            strokeWidth="0.9"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pharma-hex-purple)" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  // ── Pure ambient GSAP — ZERO ScrollTrigger ──────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          y: -50,
          x: 24,
          duration: 9,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          y: 35,
          x: -20,
          duration: 7.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.2,
        });
      }
      if (orb3Ref.current) {
        gsap.to(orb3Ref.current, {
          y: -30,
          x: 14,
          duration: 11,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 2.5,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      // FIX 1: items-start on mobile so content aligns to top and doesn't
      // leave a dead zone below. lg:items-center restores desktop centering.
      className="relative min-h-screen overflow-hidden flex items-start lg:items-center"
      style={{
        background:
          "linear-gradient(155deg,#F5F3FF 0%,#FAFAFF 42%,#EDE9FE 100%)",
      }}
    >
      {/* ── Background layer ────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <HexGrid />

        {/* Radial glow overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 72% 55% at 10% 48%,rgba(124,58,237,0.07) 0%,transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 58% 48% at 90% 22%,rgba(217,70,239,0.055) 0%,transparent 70%)",
          }}
        />

        {/* Ambient orbs */}
        <div
          ref={orb1Ref}
          className="absolute top-[6%] left-[2%] w-[580px] h-[580px] rounded-full will-change-transform"
          style={{
            background:
              "radial-gradient(circle,rgba(124,58,237,0.11) 0%,transparent 70%)",
            filter: "blur(52px)",
          }}
        />
        <div
          ref={orb2Ref}
          className="absolute bottom-[10%] right-[4%] w-[460px] h-[460px] rounded-full will-change-transform"
          style={{
            background:
              "radial-gradient(circle,rgba(217,70,239,0.09) 0%,transparent 70%)",
            filter: "blur(58px)",
          }}
        />
        <div
          ref={orb3Ref}
          className="absolute top-[44%] left-[44%] w-[300px] h-[300px] rounded-full will-change-transform"
          style={{
            background:
              "radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)",
            filter: "blur(62px)",
          }}
        />

        {/* Subtle horizontal light lines */}
        <div className="absolute top-[30%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-300/20 to-transparent" />
        <div className="absolute top-[66%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300/15 to-transparent" />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#F5F3FF] to-transparent" />
      </div>

      {/* ── Main Content ─────────────────────────────── */}
      <div
        // FIX 2 (updated): Split py into pt/pb so mobile top clears the fixed
        // navbar (~60-64 px) — pt-24 (96px) guarantees the pill badge is always
        // visible. Bottom stays lean. Desktop keeps lg:py-36 via overrides.
        className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-10 pt-24 pb-14 sm:pt-28 sm:pb-16 lg:py-36"
      >
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── LEFT: Copy ──────────────────────────────── */}
          <div className="space-y-7 lg:pr-6">

            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, ease: "easeOut" }}
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-[9px] rounded-full text-[10.5px] font-semibold tracking-[0.13em] uppercase"
                style={{
                  background: "rgba(124,58,237,0.07)",
                  border: "1px solid rgba(124,58,237,0.22)",
                  color: "#6D28D9",
                }}
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                {hero.badge}
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              className="text-[2.45rem] sm:text-5xl xl:text-[3.4rem] font-extrabold leading-[1.08] tracking-tight"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.68,
                delay: 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <span className="text-[#0F0A1E]">{hero.headline.line1}</span>
              <br />
              <span className="text-[#0F0A1E]">{hero.headline.line2}</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(130deg,#7C3AED 0%,#A855F7 45%,#D946EF 100%)",
                }}
              >
                {hero.headline.accent}
              </span>
              <br />
              <span className="text-[#1A1035]">{hero.headline.line4}</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.div
              className="space-y-2.5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.2 }}
            >
              <p className="text-[14.5px] font-bold text-violet-700 leading-snug">
                {hero.subheadline.emphasis}
              </p>
              <p className="text-slate-600 text-[14.5px] leading-[1.72] font-normal">
                {hero.subheadline.body}
              </p>
            </motion.div>

            {/* Benefit list */}
            <ul className="space-y-[13px]">
              {hero.benefits.map((text, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.48,
                    delay: 0.36 + i * 0.11,
                    ease: "easeOut",
                  }}
                >
                  {/* Check icon */}
                  <div
                    className="mt-[2px] flex-shrink-0 w-[19px] h-[19px] rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(124,58,237,0.09)",
                      border: "1px solid rgba(124,58,237,0.28)",
                    }}
                  >
                    <svg
                      className="w-[10px] h-[10px] text-violet-600"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M1.5 5l2.5 2.5 4.5-4.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-slate-700 text-[13.5px] leading-relaxed font-medium">
                    {text}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 pt-0.5"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.88 }}
            >
              {/* Primary CTA — opens the guide in a new tab and downloads it */}
              <motion.a
                href={hero.ctaPrimaryHref}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={openLeadMagnet}
                className="group relative overflow-hidden px-7 py-[13px] rounded-xl font-semibold text-[13.5px] text-white flex items-center justify-center gap-2.5"
                style={{
                  background:
                    "linear-gradient(135deg,#7C3AED 0%,#A855F7 60%,#C026D3 100%)",
                  boxShadow:
                    "0 0 0 1px rgba(124,58,237,0.28), 0 8px 28px rgba(124,58,237,0.38), 0 2px 6px rgba(124,58,237,0.22)",
                }}
                whileHover={{
                  scale: 1.026,
                  boxShadow:
                    "0 0 0 1px rgba(124,58,237,0.45), 0 14px 38px rgba(124,58,237,0.48)",
                }}
                whileTap={{ scale: 0.974 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
              >
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/18 to-transparent"
                  initial={{ x: "-160%" }}
                  whileHover={{ x: "160%" }}
                  transition={{ duration: 0.58, ease: "easeInOut" }}
                />
                <svg
                  className="w-[15px] h-[15px] relative z-10 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="relative z-10">{hero.ctaPrimary}</span>
              </motion.a>

              {/* Secondary CTA — checklist + schedule an assessment call */}
              <motion.a
                href={hero.ctaSecondaryHref}
                className="px-7 py-[13px] rounded-xl font-semibold text-[13.5px] text-violet-700 flex items-center justify-center gap-2.5 transition-all duration-200"
                style={{
                  border: "1.5px solid rgba(124,58,237,0.26)",
                  background: "rgba(124,58,237,0.05)",
                }}
                whileHover={{
                  scale: 1.02,
                  background: "rgba(124,58,237,0.10)",
                  borderColor: "rgba(124,58,237,0.42)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
              >
                <svg
                  className="w-[15px] h-[15px] flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {hero.ctaSecondary}
              </motion.a>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1.5"
              style={{
                borderTop: "1px solid rgba(124,58,237,0.12)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05 }}
            >
              <span className="text-[10.5px] text-slate-400 uppercase tracking-[0.12em] font-medium">
                {hero.trustedByLabel}
              </span>
              {hero.trustTags.map(
                (tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-[6px] text-[11px] text-slate-500 font-medium"
                  >
                    <span className="w-[5px] h-[5px] rounded-full bg-violet-500 opacity-80" />
                    {tag}
                  </div>
                ),
              )}
            </motion.div>
          </div>

          {/* ── RIGHT: HeroChatDock ─────────────────────── */}
          <motion.div
            className="relative flex w-full justify-center lg:justify-end"
            initial={{ opacity: 0, x: 32, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
              duration: 0.78,
              delay: 0.28,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
          >
            {/* Glow halo behind chat */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 70% at 50% 50%,rgba(124,58,237,0.12) 0%,transparent 72%)",
                filter: "blur(24px)",
              }}
            />

            {/* Chat container
                FIX 3: Removed mb-30 (was ~120px phantom bottom margin on mobile).
                        pb-20 gives the chat dock generous breathing room on mobile
                        so the scroll nudge is clearly visible below it.
                        lg:pb-0 removes it on desktop where it isn't needed.        */}
            <div className="relative w-full pb-20 lg:pb-0 max-w-[420px] lg:w-[380px] xl:w-[420px]">
              <HeroChatDock />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll nudge ────────────────────────────── */}
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[6px] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
      >
        <span className="text-slate-400 text-[9.5px] uppercase tracking-[0.18em] font-semibold">
          {hero.scrollLabel}
        </span>
        <motion.div
          className="w-px h-9 origin-top"
          style={{
            background:
              "linear-gradient(to bottom,rgba(124,58,237,0.45),transparent)",
          }}
          animate={{
            scaleY: [1, 0.3, 1],
            opacity: [0.35, 0.85, 0.35],
          }}
          transition={{
            duration: 1.9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </section>
  );
}