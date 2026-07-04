'use client';

// app/solutions/pharmaceutical/_components/IntroducingExpendeskSection.tsx
// "Introducing Expendesk" — the product reveal. An auto-cycling command center
// of capability cards (grid on desktop, snap-scroll carousel on mobile) plus a
// dark closing banner + CTA. All copy + card data live in
// ../_data/introducing-expendesk.ts; the scrollbar-hide utility lives in
// globals.css (.ie-no-scrollbar). This file is presentation + interaction only.

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Zap,
  ShieldCheck,
  Workflow,
  BarChart3,
  TrendingDown,
  Smile,
  FileCheck2,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import ScrollBeamDivider from '@/components/ui/ScrollBeamDivider';
import MagneticButton from '@/components/ui/MagneticButton';
import { introducingExpendesk } from '../_data';
import type { IntroducingIconKey } from '../_data';

/** Maps a feature's `iconKey` (from data) onto its Lucide icon. */
const featureIcons: Record<IntroducingIconKey, LucideIcon> = {
  fileCheck: FileCheck2,
  zap: Zap,
  shieldCheck: ShieldCheck,
  workflow: Workflow,
  barChart: BarChart3,
  trendingDown: TrendingDown,
  smile: Smile,
};

const { features } = introducingExpendesk;

/* -------------------------------------------------------------------------- */
/* Main section                                                               */
/* -------------------------------------------------------------------------- */

export default function IntroducingExpendeskSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 1. Auto-cycle through features
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // 2. Mobile/tablet horizontal auto-scroll: keep the active card centered
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    // Only execute programmatic horizontal scroll on mobile/tablet screens
    if (window.innerWidth >= 768) return;

    const container = scrollContainerRef.current;
    const activeCard = container.children[activeIndex] as HTMLElement;

    if (activeCard) {
      // Calculate position to center the active card
      const scrollLeft = activeCard.offsetLeft - container.offsetLeft - (container.clientWidth / 2) + (activeCard.clientWidth / 2);

      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      // pt-0 (all breakpoints) keeps the ScrollBeamDivider flush on the seam
      // with BridgeSection above; the top gap is carried by the inner container
      // instead, so on mobile the divider isn't pushed down and there's no large
      // white gap between the two sections.
      className="relative overflow-hidden bg-[#F8F9FC] pb-24 pt-0 sm:pb-32 lg:pb-40"
    >
      <ScrollBeamDivider />

      {/* High-precision hexagonal grid pattern (static) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 41.569L12 34.641v-13.856L24 13.856l12 6.929v13.856L24 41.569zM24 39.26l10-5.774V21.938L24 16.164l-10 5.774v11.547L24 39.26z' fill='%23a78bfa' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Static ambient glowing orbs */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-violet-300/30 to-fuchsia-300/20 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-[550px] w-[550px] rounded-full bg-gradient-to-bl from-fuchsia-300/25 to-indigo-300/20 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">

        {/* Top header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-violet-200/80 bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-700 shadow-sm backdrop-blur-md">
            <Sparkles className="h-4 w-4 animate-pulse text-fuchsia-500" aria-hidden />
            {introducingExpendesk.badge}
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl lg:leading-[1.12]">
            {introducingExpendesk.heading.lead}
            <span className="animate-gradient bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_auto] bg-clip-text text-transparent">
              {introducingExpendesk.heading.accent}
            </span>
          </h2>

          <p className="mt-6 text-lg font-semibold text-gray-600 sm:text-xl">
            {introducingExpendesk.subheading}
          </p>
        </motion.div>

        {/* Interactive command center — grid on desktop, auto-scroll flex on mobile */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="ie-no-scrollbar mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-8 sm:gap-6 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3 xl:grid-cols-4"
        >
          {features.map((item, index) => {
            const Icon = featureIcons[item.iconKey];
            const isActive = activeIndex === index;

            return (
              <motion.div
                key={item.id}
                onClick={() => setActiveIndex(index)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`group relative w-[85vw] max-w-[340px] shrink-0 snap-center cursor-pointer overflow-hidden rounded-3xl border p-6 transition-all duration-500 sm:p-7 md:w-auto md:max-w-none ${
                  isActive
                    ? 'border-violet-500 bg-white shadow-[0_12px_40px_-10px_rgba(139,92,246,0.25)] ring-2 ring-violet-500/20'
                    : 'border-gray-200/80 bg-white/70 shadow-sm hover:border-violet-300 hover:bg-white hover:shadow-md'
                } ${index === 6 ? 'md:col-span-2 lg:col-span-3 xl:col-span-2' : ''}`}
              >
                {/* Active glowing background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-violet-500/[0.04] via-transparent to-fuchsia-500/[0.04] transition-opacity duration-500 ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                />

                {/* Progress bar (fills over the auto-cycle interval) */}
                {isActive && !isPaused && (
                  <motion.div
                    key={`progress-${item.id}`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3.5, ease: 'linear' }}
                    className="absolute bottom-0 left-0 z-20 h-1.5 rounded-b-3xl bg-gradient-to-r from-violet-600 to-fuchsia-500"
                  />
                )}

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 ${
                      isActive
                        ? 'scale-110 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30'
                        : 'bg-gray-100/80 text-gray-600 group-hover:bg-violet-100 group-hover:text-violet-700'
                    }`}
                  >
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>

                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-300 ${
                      isActive
                        ? 'bg-violet-100 text-violet-600'
                        : 'text-gray-300 group-hover:text-gray-400'
                    }`}
                  >
                    <CheckCircle2 className="h-5 w-5" aria-hidden />
                  </div>
                </div>

                <h3
                  className={`mt-6 text-lg font-bold leading-snug transition-colors duration-300 sm:text-xl ${
                    isActive ? 'font-extrabold text-violet-950' : 'text-gray-800 group-hover:text-gray-950'
                  }`}
                >
                  {item.label}
                </h3>
              </motion.div>
            );
          })}
        </div>

        {/* High-contrast lifecycle transformation + CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mt-12 overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 shadow-2xl sm:mt-20 sm:p-12 lg:p-14"
        >
          {/* Subtle ambient glow inside the banner */}
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-violet-600/30 blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-fuchsia-600/25 blur-[100px]" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row lg:gap-12">

            {/* Outro copy */}
            <div className="max-w-3xl text-center lg:text-left">
              <p className="text-xl font-medium leading-relaxed text-gray-200 sm:text-2xl sm:leading-normal">
                {introducingExpendesk.outro}
              </p>
            </div>

            {/* Glowing action button — shared MagneticButton (ghost variant so
                the page's violet/fuchsia gradient is kept via className rather
                than the primary variant's blue→purple→pink fill). */}
            <div className="shrink-0">
              <MagneticButton
                href={introducingExpendesk.cta.href}
                variant="ghost"
                icon={<ArrowRight className="h-5 w-5" aria-hidden />}
                className="rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_auto] px-8 py-4 text-base font-bold shadow-[0_0_35px_rgba(139,92,246,0.4)]"
              >
                {introducingExpendesk.cta.label}
              </MagneticButton>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
