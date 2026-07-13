'use client';

/**
 * BenefitsSection — "bento" grid of benefit cards (id="benefits").
 *
 * Layout:
 *  - Desktop (lg+): a 3-column bento grid where cards can be `normal`, `wide`,
 *    or `tall` (see `gridCls` in `BentoCard`).
 *  - Mobile/tablet (<lg): the same cards become a swipeable, auto-advancing
 *    `MobileCardCarousel` with progress bar, dots, and arrows.
 *
 * Cards animate counters (`useCounter`) and bars into view, and have a
 * mouse-following spotlight + shimmer on hover. The `ACCENTS` token map defines
 * the per-card colour theme (keyed by `accent` from the JSON). A `TickerStrip`
 * marquee sits above the grid. All content + card layout config come from
 * `src/data/sections/benefits.json`; `iconKey`s map to Lucide via `ICON_MAP`.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Eye,
  CalendarCheck,
  Building2,
  TrendingUp,
  Timer,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Receipt,
  BarChart3,
} from 'lucide-react';
import ScrollBeamDivider from '../ui/ScrollBeamDivider';
import MagneticButton from '@/components/ui/MagneticButton';
import rawBenefitsData from '@/data/sections/benefits.json';

/* ============================================================
   TYPES
============================================================ */
export type AccentKey = 'purple' | 'pink' | 'teal' | 'amber' | 'blue' | 'green';
export type CardLayout = 'normal' | 'wide' | 'tall';

export interface MetricConfig {
  value: number;
  suffix: string;
  label: string;
  rawInitial?: string;
}

export interface BarConfig {
  label: string;
  tag: string;
  targetWidth: number;
}

export interface CardConfig {
  id: string;
  layout: CardLayout;
  accent: AccentKey;
  iconKey: string;
  title: string;
  description: string;
  metric?: MetricConfig;
  dualMetrics?: MetricConfig[];
  bars?: BarConfig[];
}

export interface SectionContent {
  badge: string;
  headingLine1: string;
  headingLine2: string;
  headingAccent: string;
  subheading: string;
  cta: {
    eyebrow: string;
    body: string;
    buttonLabel: string;
    buttonHref: string;
  };
}

/* ============================================================
   DATA — imported from @/data/sections/benefits.json
============================================================ */
export const SECTION_CONTENT = rawBenefitsData.sectionContent as SectionContent;
export const CARDS_DATA = rawBenefitsData.cards as unknown as CardConfig[];
const TICKER_ITEMS = rawBenefitsData.ticker as { color: string; text: string }[];

/* ============================================================
   DESIGN TOKENS — accent palette
============================================================ */
const ACCENTS: Record<
  AccentKey,
  {
    topLine: string;
    iconBg: string;
    iconColor: string;
    numColor: string;
    barColor: string;
    spotlight: string;
    borderHover: string;
    shadowHover: string;
    glowHover: string;
  }
> = {
  purple: {
    topLine:     'linear-gradient(90deg,#7C3AED,#A78BFA)',
    iconBg:      'rgba(124,58,237,0.10)',
    iconColor:   '#7C3AED',
    numColor:    '#7C3AED',
    barColor:    '#7C3AED',
    spotlight:   'rgba(124,58,237,0.08)',
    borderHover: 'rgba(124,58,237,0.32)',
    shadowHover: '0 16px 48px rgba(124,58,237,0.14), 0 4px 16px rgba(124,58,237,0.08)',
    glowHover:   'rgba(124,58,237,0.06)',
  },
  pink: {
    topLine:     'linear-gradient(90deg,#DB2777,#F472B6)',
    iconBg:      'rgba(219,39,119,0.10)',
    iconColor:   '#DB2777',
    numColor:    '#DB2777',
    barColor:    '#DB2777',
    spotlight:   'rgba(219,39,119,0.08)',
    borderHover: 'rgba(219,39,119,0.32)',
    shadowHover: '0 16px 48px rgba(219,39,119,0.12), 0 4px 16px rgba(219,39,119,0.07)',
    glowHover:   'rgba(219,39,119,0.05)',
  },
  teal: {
    topLine:     'linear-gradient(90deg,#0891B2,#22D3EE)',
    iconBg:      'rgba(8,145,178,0.10)',
    iconColor:   '#0891B2',
    numColor:    '#0891B2',
    barColor:    '#22D3EE',
    spotlight:   'rgba(8,145,178,0.08)',
    borderHover: 'rgba(8,145,178,0.32)',
    shadowHover: '0 16px 48px rgba(8,145,178,0.12), 0 4px 16px rgba(8,145,178,0.07)',
    glowHover:   'rgba(8,145,178,0.05)',
  },
  amber: {
    topLine:     'linear-gradient(90deg,#D97706,#FCD34D)',
    iconBg:      'rgba(217,119,6,0.10)',
    iconColor:   '#D97706',
    numColor:    '#D97706',
    barColor:    '#D97706',
    spotlight:   'rgba(217,119,6,0.07)',
    borderHover: 'rgba(217,119,6,0.32)',
    shadowHover: '0 16px 48px rgba(217,119,6,0.12), 0 4px 16px rgba(217,119,6,0.07)',
    glowHover:   'rgba(217,119,6,0.05)',
  },
  blue: {
    topLine:     'linear-gradient(90deg,#2563EB,#60A5FA)',
    iconBg:      'rgba(37,99,235,0.10)',
    iconColor:   '#2563EB',
    numColor:    '#2563EB',
    barColor:    '#2563EB',
    spotlight:   'rgba(37,99,235,0.08)',
    borderHover: 'rgba(37,99,235,0.32)',
    shadowHover: '0 16px 48px rgba(37,99,235,0.12), 0 4px 16px rgba(37,99,235,0.07)',
    glowHover:   'rgba(37,99,235,0.05)',
  },
  green: {
    topLine:     'linear-gradient(90deg,#059669,#34D399)',
    iconBg:      'rgba(5,150,105,0.10)',
    iconColor:   '#059669',
    numColor:    '#059669',
    barColor:    '#059669',
    spotlight:   'rgba(5,150,105,0.08)',
    borderHover: 'rgba(5,150,105,0.32)',
    shadowHover: '0 16px 48px rgba(5,150,105,0.12), 0 4px 16px rgba(5,150,105,0.07)',
    glowHover:   'rgba(5,150,105,0.05)',
  },
};

/* ============================================================
   ICON MAP
============================================================ */
const ICON_MAP: Record<string, React.ReactNode> = {
  eye:      <Eye      size={18} aria-hidden />,
  calendar: <CalendarCheck size={18} aria-hidden />,
  building: <Building2    size={18} aria-hidden />,
  trending: <TrendingUp   size={18} aria-hidden />,
  timer:    <Timer        size={18} aria-hidden />,
  shield:   <ShieldCheck  size={18} aria-hidden />,
  receipt:  <Receipt      size={18} aria-hidden />,
  chart:    <BarChart3    size={18} aria-hidden />,
};

/* ============================================================
   COUNTER HOOK
============================================================ */
function useCounter(target: number, duration = 1400, active = false): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (target === 0) {
      const frame = requestAnimationFrame(() => setCount(0));
      return () => cancelAnimationFrame(frame);
    }

    let startTs: number | null = null;
    let raf: number;

    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const elapsed  = ts - startTs;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return count;
}

/* ============================================================
   COUNTER DISPLAY
============================================================ */
function AnimatedCounter({
  metric,
  active,
  style,
}: {
  metric: MetricConfig;
  active: boolean;
  style?: React.CSSProperties;
}) {
  const value = useCounter(metric.value, 1400, active);

  const display = !active && metric.rawInitial
    ? metric.rawInitial
    : `${value}${metric.suffix}`;

  return <span style={style}>{display}</span>;
}

/* ============================================================
   ANIMATED BAR ROW
============================================================ */
function AnimatedBar({
  bar,
  barColor,
  active,
  delay = 0,
}: {
  bar: BarConfig;
  barColor: string;
  active: boolean;
  delay?: number;
}) {
  return (
    <div className="mb-[10px]">
      <div className="flex justify-between mb-1 text-[10px] text-slate-400">
        <span>{bar.label}</span>
        <span className="font-bold text-slate-500">{bar.tag}</span>
      </div>
      <div className="bg-black/[0.07] rounded-full h-1.5 overflow-hidden">
        <motion.div
          style={{ height: '100%', borderRadius: 999, background: barColor }}
          initial={{ width: '0%' }}
          animate={{ width: active ? `${bar.targetWidth}%` : '0%' }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   METRIC ROW (single)
============================================================ */
function MetricRow({
  metric,
  active,
  numColor,
  fontSize = 28,
}: {
  metric: MetricConfig;
  active: boolean;
  numColor: string;
  fontSize?: number;
}) {
  return (
    <div className="mt-4 pt-[14px] border-t border-black/[0.06]">
      <AnimatedCounter
        metric={metric}
        active={active}
        style={{ fontSize, fontWeight: 900, lineHeight: 1, color: numColor, display: 'block' }}
      />
      <div className="text-[11px] text-slate-500 mt-1 font-medium tracking-[0.03em]">
        {metric.label}
      </div>
    </div>
  );
}

/* ============================================================
   ICON BOX
============================================================ */
function IconBox({ iconKey, accent }: { iconKey: string; accent: typeof ACCENTS[AccentKey] }) {
  return (
    <div
      className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center mb-[14px] shrink-0 transition-transform duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style={{ background: accent.iconBg, color: accent.iconColor }}
    >
      {ICON_MAP[iconKey]}
    </div>
  );
}

/* ============================================================
   CARD CONTENT VARIANTS
============================================================ */
function NormalContent({
  card,
  accent,
  active,
}: {
  card: CardConfig;
  accent: typeof ACCENTS[AccentKey];
  active: boolean;
}) {
  return (
    <>
      <IconBox iconKey={card.iconKey} accent={accent} />
      <p className="text-[13px] font-bold text-[#1E1B4B] mb-1.5 leading-[1.3]">
        {card.title}
      </p>
      <p className="text-[12px] text-slate-500 leading-relaxed">
        {card.description}
      </p>
      {card.metric && (
        <MetricRow metric={card.metric} active={active} numColor={accent.numColor} />
      )}
    </>
  );
}

function TallContent({
  card,
  accent,
  active,
}: {
  card: CardConfig;
  accent: typeof ACCENTS[AccentKey];
  active: boolean;
}) {
  return (
    <>
      <div>
        <IconBox iconKey={card.iconKey} accent={accent} />
        <p className="text-[13px] font-bold text-[#1E1B4B] mb-1.5 leading-[1.3]">
          {card.title}
        </p>
        <p className="text-[12px] text-slate-500 leading-relaxed">
          {card.description}
        </p>
      </div>
      <div>
        {card.bars && (
          <div className="mt-5">
            {card.bars.map((bar, i) => (
              <AnimatedBar
                key={bar.label}
                bar={bar}
                barColor={accent.barColor}
                active={active}
                delay={0.15 + i * 0.1}
              />
            ))}
          </div>
        )}
        {card.metric && (
          <MetricRow metric={card.metric} active={active} numColor={accent.numColor} />
        )}
      </div>
    </>
  );
}

function WideContent({
  card,
  accent,
  active,
}: {
  card: CardConfig;
  accent: typeof ACCENTS[AccentKey];
  active: boolean;
}) {
  return (
    <div className="flex-1">
      <IconBox iconKey={card.iconKey} accent={accent} />
      <p className="text-[13px] font-bold text-[#1E1B4B] mb-1.5 leading-[1.3]">
        {card.title}
      </p>
      <p className="text-[12px] text-slate-500 leading-relaxed">
        {card.description}
      </p>
      {card.dualMetrics && (
        <div className="mt-4 pt-[14px] border-t border-black/[0.06] flex gap-7 flex-wrap">
          {card.dualMetrics.map((m) => (
            <div key={m.label}>
              <AnimatedCounter
                metric={m}
                active={active}
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  lineHeight: 1,
                  color: accent.numColor,
                  display: 'block',
                }}
              />
              <div className="text-[11px] text-slate-500 mt-1 font-medium tracking-[0.03em]">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   BENTO CARD
============================================================ */
function BentoCard({
  card,
  index,
  active,
  carouselMode = false,
}: {
  card: CardConfig;
  index: number;
  active: boolean;
  carouselMode?: boolean;
}) {
  const accent = ACCENTS[card.accent];
  const [spot, setSpot] = useState({ x: 0, y: 0, show: false });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top, show: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSpot((s) => ({ ...s, show: false }));
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const gridCls = carouselMode ? '' : (() => {
    if (card.layout === 'tall') return 'lg:col-start-3 lg:row-start-1 lg:row-span-2';
    if (card.layout === 'wide') return 'md:col-span-2 lg:col-span-2';
    return '';
  })();

  const isTall = !carouselMode && card.layout === 'tall';

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl select-none ${gridCls}`}
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.85)',
        boxShadow:
          '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(99,102,241,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        padding: '22px 20px 20px',
        cursor: 'default',
        ...(carouselMode
          ? {
              height: 320,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }
          : {}),
        ...(isTall
          ? { display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
          : {}),
      }}
      initial={{ opacity: 0, y: 28 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{
        duration: 0.65,
        delay: index * 0.09,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      whileHover={{
        y: -6,
        scale: 1.012,
        borderColor: accent.borderHover,
        boxShadow: accent.shadowHover + ', inset 0 1px 0 rgba(255,255,255,0.95)',
        backdropFilter: 'blur(28px) saturate(200%) brightness(1.03)',
        transition: {
          duration: 0.38,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Shimmer sweep on hover */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        style={{
          background:
            'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)',
          backgroundSize: '250% 100%',
          backgroundPosition: '120% 0',
        }}
        animate={isHovered ? { backgroundPosition: ['-20% 0', '120% 0'] } : { backgroundPosition: '120% 0' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />

      {/* Mouse-following spotlight */}
      <div
        aria-hidden
        className="absolute w-[260px] h-[260px] rounded-full pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, ${accent.spotlight} 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          left: spot.x,
          top: spot.y,
          opacity: spot.show ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* Ambient glow behind card on hover */}
      <motion.div
        aria-hidden
        className="absolute -inset-px rounded-[18px] pointer-events-none -z-10"
        style={{
          background: accent.glowHover,
          filter: 'blur(12px)',
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />

      {/* Colored top line */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl z-10"
        style={{
          background: accent.topLine,
          opacity: 0.8,
        }}
      />

      {/* Content wrapper */}
      <div
        className={carouselMode ? 'carousel-content' : ''}
        style={{
          position: 'relative',
          zIndex: 2,
          ...(carouselMode
            ? {
                flex: 1,
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none' as React.CSSProperties['msOverflowStyle'],
                maskImage: 'linear-gradient(180deg, #000 78%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(180deg, #000 78%, transparent 100%)',
              }
            : {}),
          ...(isTall
            ? { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }
            : {}),
        }}
      >
        {card.layout === 'normal' && (
          <NormalContent card={card} accent={accent} active={active} />
        )}
        {card.layout === 'tall' && (
          <TallContent card={card} accent={accent} active={active} />
        )}
        {card.layout === 'wide' && (
          <WideContent card={card} accent={accent} active={active} />
        )}
      </div>
    </motion.div>
  );
}

/* ============================================================
   AUTO-SCROLL TICKER STRIP
============================================================ */
function TickerStrip() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      aria-hidden
      className="overflow-hidden w-full mb-7"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      <motion.div
        className="flex w-max gap-0"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 30,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2.5 py-[7px] px-[22px] border-r border-[rgba(124,58,237,0.12)] whitespace-nowrap text-[11px] font-bold text-slate-500 tracking-[0.04em]"
          >
            <span
              className="w-[5px] h-[5px] rounded-full shrink-0 inline-block"
              style={{ background: item.color }}
            />
            {item.text}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ============================================================
   MOBILE HORIZONTAL CARD CAROUSEL
============================================================ */
function MobileCardCarousel({ active }: { active: boolean }) {
  const total = CARDS_DATA.length;
  const [current, setCurrent]       = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [progress, setProgress]     = useState(0);
  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DELAY = 2800;

  const goTo = useCallback((idx: number, fromUser = false) => {
    setCurrent((idx + total) % total);
    setProgress(0);
    if (fromUser) {
      setUserPaused(true);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = setTimeout(() => {
        setProgress(0);
        setUserPaused(false);
        pauseTimeoutRef.current = null;
      }, 5000);
    }
  }, [total]);

  const goNext = useCallback((fromUser = false) => goTo(current + 1, fromUser), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1, true), [current, goTo]);

  useEffect(() => {
    if (userPaused) {
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }
    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100;
        return p + (100 / (DELAY / 28));
      });
    }, 28);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [current, userPaused]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (userPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => goNext(false), DELAY);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, userPaused, goNext]);

  const touchStartX = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goTo(current + 1, true);
      else goTo(current - 1, true);
    }
  }, [current, goTo]);

  const card   = CARDS_DATA[current];
  const accent = ACCENTS[card.accent];

  return (
    <div className="relative select-none">
      {/* Card viewport */}
      <div
        className="relative overflow-hidden rounded-[20px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: 48, scale: 0.97 }}
            animate={{ opacity: 1, x: 0,  scale: 1    }}
            exit={{    opacity: 0, x: -48, scale: 0.97 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <BentoCard card={card} index={0} active={active} carouselMode />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="mt-[14px] h-[3px] rounded-full bg-[rgba(124,58,237,0.12)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: accent.topLine,
            width: `${progress}%`,
          }}
          transition={{ duration: 0.028, ease: 'linear' }}
        />
      </div>

      {/* Controls row: prev · dots · next */}
      <div className="mt-[14px] flex items-center justify-center gap-3">
        {/* Prev button */}
        <motion.button
          onClick={goPrev}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          className="w-[34px] h-[34px] rounded-full flex items-center justify-center cursor-pointer shrink-0 text-[#7C3AED] transition-[border-color] duration-200"
          style={{
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(124,58,237,0.18)',
            boxShadow: '0 2px 8px rgba(99,102,241,0.10)',
          }}
          aria-label="Previous card"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>

        {/* Dot indicators */}
        <div className="flex gap-1.5 items-center">
          {CARDS_DATA.map((c, i) => {
            const a = ACCENTS[c.accent];
            const isActive = i === current;
            return (
              <motion.button
                key={c.id}
                onClick={() => goTo(i, true)}
                animate={{
                  width:      isActive ? 22 : 7,
                  background: isActive ? a.numColor : 'rgba(124,58,237,0.20)',
                  opacity:    isActive ? 1 : 0.55,
                }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="h-[7px] rounded-full border-none cursor-pointer p-0"
                aria-label={`Go to card ${i + 1}`}
              />
            );
          })}
        </div>

        {/* Next button */}
        <motion.button
          onClick={() => goTo(current + 1, true)}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          className="w-[34px] h-[34px] rounded-full flex items-center justify-center cursor-pointer text-[#7C3AED] shrink-0 transition-[border-color] duration-200"
          style={{
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(124,58,237,0.18)',
            boxShadow: '0 2px 8px rgba(99,102,241,0.10)',
          }}
          aria-label="Next card"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.button>
      </div>

      {/* Card counter */}
      <div className="mt-2 text-center text-[10px] font-semibold text-slate-400 tracking-[0.06em]">
        {current + 1} / {total}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN SECTION
============================================================ */
export default function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: '-80px' });

  const headerAnim = {
    initial:    { opacity: 0, y: 22 },
    animate:    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  };

  const tickerAnim = {
    initial:    { opacity: 0, y: 10 },
    animate:    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    transition: { duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <section
      id="benefits"
      ref={sectionRef}
      className="relative overflow-hidden font-['Inter',sans-serif]"
      style={{
        background:      '#F4F2FE',
        backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.18) 1px, transparent 1px)',
        backgroundSize:  '24px 24px',
        /* ↓ Zero top padding so the divider sits flush at the very top of the section.
             The inner container adds its own top padding below the divider. */
        paddingTop:    0,
        paddingBottom: 'clamp(48px, 8vw, 88px)',
        paddingLeft:   'clamp(16px, 5vw, 48px)',
        paddingRight:  'clamp(16px, 5vw, 48px)',
      }}
    >
      {/* ── ScrollBeamDivider flush at the top ── */}
      <ScrollBeamDivider />

      {/* Background ambient orbs */}
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500, height: 500,
          background: '#EDE9FE',
          filter: 'blur(90px)',
          opacity: 0.5,
          top: -160,
          left: -120,
        }}
      />
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 380, height: 380,
          background: '#FCE7F3',
          filter: 'blur(90px)',
          opacity: 0.35,
          bottom: -80,
          right: -80,
        }}
      />
      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 280, height: 280,
          background: '#DBEAFE',
          filter: 'blur(90px)',
          opacity: 0.25,
          top: '35%',
          left: '55%',
        }}
      />

      {/* Inner container
          pt-[clamp(48px,8vw,88px)] pushes all content below the divider
          by the same amount the original section top-padding used. */}
      <div
        className="max-w-[1200px] mx-auto relative z-10"
        style={{ paddingTop: 'clamp(48px, 8vw, 88px)' }}
      >

        {/* ── Header ── */}
        <motion.div {...headerAnim}>
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[rgba(124,58,237,0.08)] border border-[rgba(124,58,237,0.22)] rounded-full px-[14px] py-[5px] text-[11px] font-bold text-[#7C3AED] tracking-[0.08em] uppercase mb-[22px]">
            <Sparkles size={11} aria-hidden />
            {SECTION_CONTENT.badge}
          </div>

          {/* Heading */}
          <h2
            className="font-black text-[#1E1B4B] leading-[1.1] mb-2.5"
            style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}
          >
            {SECTION_CONTENT.headingLine1}
            <br />
            {SECTION_CONTENT.headingLine2}
            <span
              style={{
                background:           'linear-gradient(100deg,#7C3AED 0%,#EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}
            >
              {SECTION_CONTENT.headingAccent}
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-[14px] text-slate-500 leading-[1.65] max-w-[480px] mb-5">
            {SECTION_CONTENT.subheading}
          </p>
        </motion.div>

        {/* ── Auto-scroll Ticker ── */}
        <motion.div {...tickerAnim}>
          <TickerStrip />
        </motion.div>

        {/* ── Bento Grid — desktop only (lg+) ── */}
        <div
          className="hidden lg:grid lg:grid-cols-3"
          style={{ gap: 12 }}
        >
          {CARDS_DATA.map((card, i) => (
            <BentoCard key={card.id} card={card} index={i} active={isInView} />
          ))}
        </div>

        {/* ── Horizontal Card Carousel — tablet & mobile only (< lg) ── */}
        <div className="block lg:hidden">
          <MobileCardCarousel active={isInView} />
        </div>

        {/* ── CTA Strip ── */}
        <motion.div
          className="mt-3 flex items-center justify-between gap-4 flex-wrap rounded-2xl"
          style={{
            background:     'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(12px) saturate(150%)',
            WebkitBackdropFilter: 'blur(12px) saturate(150%)',
            border:         '1px solid rgba(124,58,237,0.14)',
            padding:        'clamp(14px, 2vw, 20px) clamp(16px, 2.5vw, 24px)',
            boxShadow:      'inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.65, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex-1 min-w-[220px] max-w-[440px]">
            <strong className="text-[#1E1B4B] block text-[13px] font-bold mb-1 leading-[1.4]">
              {SECTION_CONTENT.cta.eyebrow}
            </strong>
            <span className="text-[12px] text-slate-500 leading-[1.55]">
              {SECTION_CONTENT.cta.body}
            </span>
          </div>

          <MagneticButton
            href={SECTION_CONTENT.cta.buttonHref}
            variant="primary"
            className="shrink-0 whitespace-nowrap rounded-full px-5.5 py-2.75 text-[12px]"
            icon={<ArrowRight size={14} aria-hidden />}
          >
            {SECTION_CONTENT.cta.buttonLabel}
          </MagneticButton>
        </motion.div>

      </div>
    </section>
  );
}