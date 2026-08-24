'use client';

// app/solutions/pharmaceutical/_components/BridgeSection.tsx
// "Once you identify the gaps, how do you fix them?" — the transition section
// that lists the recurring pharma pain points and bridges into the Expendesk
// pitch. All copy + card data live in ../_data/bridge.ts; the mobile marquee
// animation lives in globals.css (.br-marquee). This file is presentation only:
// layout, the GSAP parallax blobs, and the scroll-in reveals.

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRightLeft,
  Sparkles,
  FileWarning,
  Clock,
  EyeOff,
  Hourglass,
  ShieldAlert,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';
import ScrollBeamDivider from '@/components/ui/ScrollBeamDivider';
import { bridge } from '../_data';
import type { BridgeChallenge, BridgeIconKey } from '../_data';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** Maps a challenge's `iconKey` (from data) onto its Lucide icon. */
const bridgeIcons: Record<BridgeIconKey, LucideIcon> = {
  fileWarning: FileWarning,
  clock: Clock,
  eyeOff: EyeOff,
  hourglass: Hourglass,
  shieldAlert: ShieldAlert,
  alertTriangle: AlertTriangle,
};

// Cards rendered twice so the mobile marquee (.br-marquee) can loop seamlessly.
// The second pass is a visual duplicate, not content — see `isLoopCopy` below.
const marqueeChallenges = [...bridge.challenges, ...bridge.challenges];
/** Index at which the seamless-loop duplicate begins. */
const MARQUEE_LOOP_START = bridge.challenges.length;

/* -------------------------------------------------------------------------- */
/* Framer Motion variants                                                     */
/* -------------------------------------------------------------------------- */

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
  },
};

/* -------------------------------------------------------------------------- */
/* Shared card content                                                        */
/* -------------------------------------------------------------------------- */

function CardContent({ item }: { item: BridgeChallenge }) {
  const Icon = bridgeIcons[item.iconKey];
  return (
    <>
      {/* Subtle hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 ring-1 ring-inset ring-gray-200/50 transition-colors duration-300 group-hover:bg-violet-600 group-hover:text-white group-hover:ring-violet-600 group-hover:shadow-md group-hover:shadow-violet-200">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <h3 className="font-semibold text-gray-800 transition-colors duration-300 group-hover:text-gray-900">
          {item.label}
        </h3>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Main section                                                               */
/* -------------------------------------------------------------------------- */

export default function BridgeToExpendeskSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const blobRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Sophisticated multi-directional parallax for the ambient background
      blobRefs.current.forEach((blob, i) => {
        if (!blob) return;
        gsap.to(blob, {
          y: i % 2 === 0 ? -80 : 80,
          x: i % 2 === 0 ? 40 : -40,
          rotation: i % 2 === 0 ? 45 : -45,
          scale: 1.2,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Bridge to Expendesk"
      // pt-0 (all breakpoints) keeps the ScrollBeamDivider flush on the seam
      // with the section above; the top gap is carried by the inner container
      // instead, so the divider sits centered between the two sections rather
      // than pushed down into the body.
      className="relative overflow-hidden bg-[#FAFAFC] pt-0 pb-12 sm:pb-16"
    >
      <ScrollBeamDivider />

      {/* Ambient background grid & textures */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      {/* Ambient glowing blobs */}
      <div
        ref={(el) => { blobRefs.current[0] = el; }}
        className="pointer-events-none absolute -left-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-violet-400/20 blur-[120px]"
      />
      <div
        ref={(el) => { blobRefs.current[1] = el; }}
        className="pointer-events-none absolute -right-[10%] bottom-[10%] h-[600px] w-[600px] rounded-full bg-fuchsia-400/15 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200/50 bg-white/60 px-4 py-1.5 text-[14px] font-bold uppercase tracking-widest text-violet-700 shadow-sm backdrop-blur-md">
            <ArrowRightLeft className="h-4 w-4" aria-hidden />
            {bridge.badge}
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            {bridge.heading.lead}
            <br className="hidden sm:block" />
            <span className="relative inline-block pb-2">
              <span className="relative z-10 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                {bridge.heading.accent}
              </span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" fill="none" stroke="url(#grad)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#d946ef" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
          <p className="mt-6 text-lg font-medium text-gray-600 sm:text-xl">
            {bridge.subheading}
          </p>
        </motion.div>

        {/* ========================================= */}
        {/* DESKTOP BENTO GRID (hidden on mobile/tablet) */}
        {/* ========================================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 hidden grid-cols-1 gap-4 sm:gap-6 lg:grid lg:grid-cols-3"
        >
          {bridge.challenges.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative flex flex-col justify-center overflow-hidden rounded-2xl border border-gray-200/60 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-violet-300 hover:shadow-[0_8px_30px_-4px_rgba(139,92,246,0.15)]"
            >
              <CardContent item={item} />
            </motion.div>
          ))}
        </motion.div>

        {/* ========================================= */}
        {/* MOBILE/TABLET INFINITE SCROLL MARQUEE     */}
        {/* ========================================= */}
        <div className="relative mt-12 flex w-full overflow-hidden lg:hidden">

          {/* Fading edges for the premium "emerging" look */}
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-12 bg-gradient-to-r from-[#FAFAFC] to-transparent sm:w-20" />
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-12 bg-gradient-to-l from-[#FAFAFC] to-transparent sm:w-20" />

          {/* Scrolling track (animation defined in globals.css → .br-marquee) */}
          <div className="br-marquee flex gap-4 sm:gap-6">
            {marqueeChallenges.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                /* The loop copy exists only so the marquee can scroll without a
                   visible seam. Hiding it from the accessibility tree stops
                   screen readers announcing twelve cards where there are six,
                   and keeps the page's heading outline honest — each of these
                   cards contains an <h3>. */
                aria-hidden={idx >= MARQUEE_LOOP_START || undefined}
                className="group relative flex w-[280px] shrink-0 flex-col justify-center overflow-hidden rounded-2xl border border-gray-200/60 bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-colors duration-300 hover:border-violet-300 sm:w-[320px] sm:p-6"
              >
                <CardContent item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* High-contrast closing banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative mx-auto mt-16 overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 shadow-2xl sm:mt-24 sm:px-12 sm:py-14"
        >
          {/* Inner banner glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.2),transparent_50%)]" />

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
              <Sparkles className="h-6 w-6 text-fuchsia-400" aria-hidden />
            </div>
            <p className="text-xl font-medium leading-relaxed text-gray-200 sm:text-2xl sm:leading-snug">
              {bridge.closing.lead}
              <span className="animate-gradient bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text font-bold text-transparent">
                {bridge.closing.accent}
              </span>
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
