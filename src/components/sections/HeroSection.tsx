"use client";

/**
 * HeroSection — the first, above-the-fold section (id="hero").
 *
 * Pieces:
 *  - An interactive `<canvas>` dot grid that repels/brightens around the cursor
 *    (runs on its own requestAnimationFrame loop; cleaned up on unmount/resize).
 *  - A cursor-following blurred glow driven by Framer Motion springs.
 *  - `Counter` — counts a stat up from 0 once it scrolls into view.
 *  - `LiveExpenseTicker` — auto-cycling fake "approved/flagged/pending" feed.
 *  - Floating badges, trust pills, CTAs, feature cards and a social-proof strip.
 *
 * Typography uses the site-wide default font stack (same as every other
 * section — no web font here). All copy comes from
 * `src/data/sections/hero.json`; string `iconKey`s map to Lucide icons via the
 * `TRUST_PILL_ICONS` / `FEATURE_CARD_ICONS` registries below.
 */

import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import {
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  GitBranch,
  Eye,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroData from "@/data/sections/hero.json";
import MagneticButton from "@/components/ui/MagneticButton";
import HeroChatDock from "@/components/chat/HeroChatDock";
import { LEAD_MAGNET_HREF, openLeadMagnet } from "@/lib/lead-magnet";

/* ─────────────────────── helpers ─────────────────────── */

type CounterProps = {
  to: number;
  suffix?: string;
  duration?: number;
};

function Counter({ to, suffix = "", duration = 1.5 }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ─────────────────────── icon maps ─────────────────────── */

const FEATURE_CARD_ICONS: Record<string, React.ElementType> = {
  "zap":            Zap,
  "git-branch":     GitBranch,
  "eye":            Eye,
  "shield-check":   ShieldCheck,
  "trending-up":    TrendingUp,
};

/* ─────────────────────── hero right slot ───────────────────────
   The right-side "Live Expense Feed" card has been replaced by the
   docked Expendesk AI chat — rendered via <HeroChatDock /> in the
   right column below. The chat auto-opens here while the hero is in
   view, then hands off to the floating launcher once scrolled past. */

/* ─────────────────────── main component ─────────────────────── */

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rawMouse = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 22, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 22, mass: 0.5 });

  /* mouse tracking */
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
      rawMouse.current = { x, y };
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  /* premium light canvas dot grid - full page coverage */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let particles: Array<{
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      opacity: number;
    }> = [];
    const GAP = 28;

    const init = () => {
      particles = [];
      const rect = canvas.parentElement?.getBoundingClientRect() || {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      canvas.width = rect.width;
      canvas.height = rect.height;

      for (let x = GAP / 2; x < canvas.width; x += GAP) {
        for (let y = GAP / 2; y < canvas.height; y += GAP) {
          particles.push({
            baseX: x,
            baseY: y,
            x,
            y,
            vx: 0,
            vy: 0,
            opacity: 0.14 + Math.random() * 0.04,
          });
        }
      }
    };

    init();

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const mouse = rawMouse.current;
      const ATTRACT = 140; // glow attract radius
      const REPEL = 60; // push radius

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        /* repel */
        if (dist < REPEL && mouse.x > 0) {
          const force = ((REPEL - dist) / REPEL) * 5;
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
        }

        /* spring back */
        p.vx += (p.baseX - p.x) * 0.07;
        p.vy += (p.baseY - p.y) * 0.07;
        p.vx *= 0.8;
        p.vy *= 0.8;
        p.x += p.vx;
        p.y += p.vy;

        /* brightness by proximity */
        const proximity = Math.max(0, 1 - dist / ATTRACT);
        const alpha = p.opacity + proximity * 0.5;
        const radius = 1.2 + proximity * 1.2;

        /* premium light indigo tint near cursor */
        if (proximity > 0.1) {
          const r = Math.round(79 + (1 - proximity) * 20);
          const g = Math.round(70 + (1 - proximity) * 32);
          const b = Math.round(229);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        } else {
          ctx.fillStyle = `rgba(15, 23, 42, ${p.opacity})`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      init();
    };

    window.addEventListener("resize", onResize);
    const t = setTimeout(init, 100);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, []);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.75, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]"
      style={{
        paddingTop: "clamp(100px, 14vw, 152px)",
        paddingBottom: "clamp(60px, 8vw, 120px)",
      }}
    >
      {/* ── Canvas dot grid ── */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* ── Mouse glow ── */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="pointer-events-none absolute z-0 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.05] blur-[100px]"
      />

      {/* ── Static ambient glows ── */}
      <div className="pointer-events-none absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-500/[0.04] blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-[10%] h-[300px] w-[300px] rounded-full bg-indigo-500/[0.03] blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-[10%] h-[260px] w-[260px] rounded-full bg-fuchsia-500/[0.03] blur-[100px]" />

      {/* ── Subtle horizontal lines ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[15, 40, 65, 87].map((t) => (
          <div
            key={t}
            className="absolute left-0 right-0 h-px bg-black/[0.02]"
            style={{ top: `${t}%` }}
          />
        ))}
      </div>

      {/* ── Premium Fine Grain overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.012] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px",
        }}
      />

      {/* ── Main content grid ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-8 xl:gap-16">
          {/* ════ LEFT COLUMN ════ */}
          <div className="flex w-full flex-col items-center text-center lg:items-start lg:text-left lg:flex-1">
            {/* Badge */}
            <motion.div
              {...fadeUp(0.05)}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/15 bg-indigo-500/[0.04] px-4 py-1.5 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span className="text-[11.5px] font-semibold tracking-wide text-indigo-700">
                {heroData.badge.text}
              </span>
              <span className="ml-1 rounded-full bg-indigo-600/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-700">
                {heroData.badge.tag}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.12)}
              className="max-w-2xl text-[clamp(2.1rem,6vw,4.5rem)] font-black leading-[1.06] tracking-tight text-slate-900"
            >
              {heroData.headlineParts.pre}{" "}
              <span className="relative inline-block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                {heroData.headlineParts.accent}
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M0 3 Q50 0 100 3 Q150 6 200 3"
                    stroke="url(#ul)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="ul" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>{" "}
              <br className="hidden sm:block" />
              <span className="text-slate-700">
                {" "}
                {heroData.headlineParts.post}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.div
              {...fadeUp(0.2)}
              className="mt-6 max-w-xl text-[clamp(0.875rem,2vw,1.0625rem)] leading-[1.85] text-slate-600 font-medium text-left"
            >
              <span className="mb-4">
                {heroData.description}
              </span>

              <div className="font-bold text-[clamp(0.875rem,2vw,1.0625rem)] my-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                {heroData.highlightText}
              </div>

              <span>
                {heroData.subDescription}
              </span>
            </motion.div>
            {/* Trust pills */}
            {/* <motion.div
              {...fadeUp(0.27)}
              className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              {heroData.trustPills.map(({ iconKey, label }) => {
                const Icon = TRUST_PILL_ICONS[iconKey] ?? ShieldCheck;
                return (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 rounded-full border border-black/[0.05] bg-white/60 px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                  >
                    <Icon className="h-3 w-3 text-indigo-600" />
                    {label}
                  </div>
                );
              })}
            </motion.div> */}

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.33)}
              className="mt-8 flex flex-col items-center gap-3.5 sm:flex-row lg:items-start"
            >
              <MagneticButton
                href={heroData.ctas.primary.href}
                variant="primary"
                className="px-7 py-3.5 text-[13.5px] rounded-xl shadow-[0_10px_30px_rgba(99,102,241,0.25)]"
                icon={<ArrowUpRight className="h-4 w-4" />}
              >
                {heroData.ctas.primary.label}
              </MagneticButton>

              <a
                href={LEAD_MAGNET_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={openLeadMagnet}
                className="group inline-flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white/60 px-7 py-3.5 text-[13.5px] font-semibold text-slate-700 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-indigo-500/30 hover:bg-white hover:text-slate-900"
              >
                {heroData.ctas.secondary.label}
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-indigo-600" />
              </a>
            </motion.div>

            {/* Stats row */}
            <motion.div
              {...fadeUp(0.42)}
              className="mt-10 flex items-center gap-6 divide-x divide-black/[0.06]"
            >
              {heroData.stats.map(({ value, suffix, label }, i) => (
                <div
                  key={label}
                  className={`${i > 0 ? "pl-6" : ""} flex flex-col`}
                >
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">
                    <Counter to={value} suffix={suffix} duration={1.4} />
                  </span>
                  <span className="mt-0.5 text-[11px] font-medium text-slate-500">
                    {label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ════ RIGHT COLUMN — docked Expendesk AI chat ════ */}
           <motion.div
                      className="relative flex w-full shrink-0 justify-center lg:w-[380px] lg:justify-end xl:w-[400px]"
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
          
                      {/* Chat container — matches width of HeroChatDock */}
                      <div className="relative w-full max-w-[420px]">
                        <HeroChatDock />
                      </div>
                    </motion.div>
        </div>

        {/* ════ FEATURE CARDS ROW ════ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {heroData.featureCards.map((card, i) => {
            const Icon = FEATURE_CARD_ICONS[card.iconKey] ?? ShieldCheck;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.6 + i * 0.08,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 15px 35px rgba(0,0,0,0.04)",
                  transition: { duration: 0.25 },
                }}
                className={`group relative overflow-hidden rounded-2xl border border-black/[0.04] bg-white/60 p-5 backdrop-blur-xl transition-all duration-400 ${card.borderHover} hover:bg-white`}
              >
                {/* hover top glow */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradientColor} border border-black/[0.02]`}
                >
                  <Icon className={`h-4.5 w-4.5 ${card.iconColor}`} />
                </div>

                <h3 className="text-[14px] font-bold leading-snug text-slate-900">
                  {card.title}
                </h3>

                {/* Corner accent */}
                <div className="absolute right-3 top-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4 text-indigo-600" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ════ SOCIAL PROOF STRIP ════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-8"
        >
          {/* Avatars */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {heroData.socialProof.avatarInitials.map((initials, i) => (
                <div
                  key={initials}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#f1f5f9] bg-gradient-to-br from-indigo-500/20 to-violet-600/20 text-[9px] font-bold text-indigo-700"
                  style={{ zIndex: 4 - i }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-[12px] font-medium text-slate-500">
              <span className="font-bold text-slate-700">
                {heroData.socialProof.businessCount} finance teams
              </span>{" "}
              {heroData.socialProof.businessText}
            </span>
          </div>

          <div className="hidden h-4 w-px bg-black/[0.08] sm:block" />

          {/* Stars */}
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="h-3.5 w-3.5 text-amber-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-[12px] font-medium text-slate-500 ml-1">
              {heroData.socialProof.rating} / 5 {heroData.socialProof.ratingText}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}