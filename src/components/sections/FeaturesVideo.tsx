"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  Play,
  ArrowUpRight,
  Sparkles,
  Receipt,
  GitBranch,
  Wallet,
  FileText,
  Monitor,
  Cpu,
  Briefcase,
  Users,
  TrendingUp,
  Shield,
  Layers,
  ChevronRight,
  MousePointer2,
  ChevronDown,
  ArrowDown,
} from "lucide-react";
import ScrollBeamDivider from "../ui/ScrollBeamDivider";
import featuresData from "@/data/sections/features.json";

/* ═══════════════════════════════════════════════════════════════
   SHARED COLOR MAP
═══════════════════════════════════════════════════════════════ */
const badgeColorMap = {
  violet: { icon: "bg-violet-100 text-violet-600", dot: "bg-violet-500", glow: "shadow-violet-200/60" },
  emerald: { icon: "bg-emerald-100 text-emerald-600", dot: "bg-emerald-500", glow: "shadow-emerald-200/60" },
  blue: { icon: "bg-blue-100 text-blue-600", dot: "bg-blue-500", glow: "shadow-blue-200/60" },
  amber: { icon: "bg-amber-100 text-amber-600", dot: "bg-amber-500", glow: "shadow-amber-200/60" },
};

type BadgeColor = keyof typeof badgeColorMap;
type Badge = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: BadgeColor;
  desktopClass: string;
  factor: { x: number; y: number };
  delay: number;
};

/* ═══════════════════════════════════════════════════════════════
   ICON MAPS — React components keyed by iconKey string in JSON
═══════════════════════════════════════════════════════════════ */
const FLOATING_BADGE_ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "receipt":    Receipt,
  "git-branch": GitBranch,
  "wallet":     Wallet,
  "file-text":  FileText,
};

const INDUSTRY_ICON_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "monitor":   Monitor,
  "cpu":       Cpu,
  "briefcase": Briefcase,
  "users":     Users,
};

/* ═══════════════════════════════════════════════════════════════
   FEATURES VIDEO DATA — imported from @/data/sections/features.json
═══════════════════════════════════════════════════════════════ */
const floatingBadges: Badge[] = featuresData.featuresVideo.floatingBadges.map((b) => ({
  ...b,
  color: b.color as BadgeColor,
  icon: FLOATING_BADGE_ICON_MAP[b.iconKey] ?? Receipt,
}));

const featureStats = featuresData.featuresVideo.stats;

/* ═══════════════════════════════════════════════════════════════
   BADGE PILL
═══════════════════════════════════════════════════════════════ */
function BadgePill({ badge, style, className = "" }: { badge: Badge; style?: React.CSSProperties; className?: string }) {
  const c = badgeColorMap[badge.color];
  const Icon = badge.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: badge.delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute ${className} pointer-events-none select-none w-[212px] rounded-2xl border border-white/80 bg-white/70 backdrop-blur-3xl shadow-xl ${c.glow} px-3 py-3 ring-1 ring-black/5 z-30`}
      style={style}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
      <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${c.dot} opacity-60`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${c.dot}`} />
      </span>
      <div className="relative flex items-start gap-2.5 pr-4 min-h-[60px]">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${c.icon} ring-1 ring-white/60 shadow-sm mt-0.5`}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11.5px] font-bold leading-tight text-slate-800 line-clamp-1">{badge.title}</p>
          <p className="text-[10px] font-medium leading-relaxed text-slate-500 mt-1 line-clamp-2">{badge.subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INDUSTRY DATA — imported from @/data/sections/features.json
═══════════════════════════════════════════════════════════════ */
const industries = featuresData.industrySection.industries.map((ind) => ({
  ...ind,
  color: ind.color as keyof typeof industryColorMap,
  icon: INDUSTRY_ICON_MAP[ind.iconKey] ?? Monitor,
}));

const industryColorMap = {
  violet: { dot: "bg-violet-500", iconBg: "bg-violet-100 text-violet-600", pillBg: "bg-violet-50 text-violet-700 border-violet-200", ring: "ring-violet-200", activeBorder: "border-violet-200/60" },
  emerald: { dot: "bg-emerald-500", iconBg: "bg-emerald-100 text-emerald-600", pillBg: "bg-emerald-50 text-emerald-700 border-emerald-200", ring: "ring-emerald-200", activeBorder: "border-emerald-200/60" },
  amber: { dot: "bg-amber-500", iconBg: "bg-amber-100 text-amber-600", pillBg: "bg-amber-50 text-amber-700 border-amber-200", ring: "ring-amber-200", activeBorder: "border-amber-200/60" },
  blue: { dot: "bg-blue-500", iconBg: "bg-blue-100 text-blue-600", pillBg: "bg-blue-50 text-blue-700 border-blue-200", ring: "ring-blue-200", activeBorder: "border-blue-200/60" },
};

/* ═══════════════════════════════════════════════════════════════
   INDUSTRY CARD — crystal-clear click affordance
═══════════════════════════════════════════════════════════════ */
function IndustryCard({
  industry, isActive, onClick, index, hasInteracted, isMobile,
}: {
  industry: (typeof industries)[0];
  isActive: boolean;
  onClick: () => void;
  index: number;
  hasInteracted: boolean;
  isMobile: boolean;
}) {
  const c = industryColorMap[industry.color];
  const Icon = industry.icon;
  // Show a "tap" pulse hint on the first card when user hasn't interacted yet
  const showTapHint = index === 0 && !hasInteracted;

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      aria-pressed={isActive}
      className={`
        group relative w-full text-left rounded-2xl transition-all duration-300 cursor-pointer
        border overflow-hidden
        ${isActive
          ? `bg-white/90 shadow-lg backdrop-blur-2xl ${c.activeBorder}`
          : "bg-white/40 border-white/50 hover:bg-white/65 hover:border-white/80 hover:shadow-md backdrop-blur-md"
        }
      `}
      style={{
        boxShadow: isActive
          ? `0 4px 20px ${industry.glowColor}, 0 0 0 1px rgba(255,255,255,0.7)`
          : undefined,
      }}
    >
      {/* Active left accent bar */}
      {isActive && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
          style={{ background: `linear-gradient(180deg, ${industry.accentFrom}, ${industry.accentTo})` }}
        />
      )}

      <div className="relative z-10 flex items-center gap-3 px-4 py-3.5">
        {/* Icon */}
        <div className={`
          flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm ring-1 ring-white/60
          transition-all duration-300
          ${c.iconBg}
          ${isActive ? "scale-105" : "group-hover:scale-105 opacity-80 group-hover:opacity-100"}
        `}>
          <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-sm font-bold leading-tight transition-colors duration-200 ${isActive ? "text-slate-900" : "text-slate-600 group-hover:text-slate-800"}`}>
              {industry.label}
            </p>
            {industry.badge && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.pillBg}`}>
                {industry.badge}
              </span>
            )}
          </div>
          <p className={`text-xs mt-0.5 font-medium transition-colors duration-200 ${isActive ? "text-slate-500" : "text-slate-400 group-hover:text-slate-500"}`}>
            {industry.tagline}
          </p>
        </div>

        {/* Right side: on desktop show ChevronRight; on mobile show ChevronDown when active, ChevronRight otherwise */}
        <div className="shrink-0 flex items-center gap-1.5">
          {isActive && isMobile ? (
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 0 }}
              className="flex items-center gap-1"
            >
              <span
                className="text-[10px] font-bold hidden xs:inline"
                style={{ color: industry.accentFrom }}
              >
                Details ↓
              </span>
              <ChevronDown
                className="h-4 w-4"
                style={{ color: industry.accentFrom }}
              />
            </motion.div>
          ) : (
            <ChevronRight
              className={`h-4 w-4 transition-all duration-200 ${
                isActive
                  ? "text-slate-600 translate-x-0.5"
                  : "text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5"
              }`}
            />
          )}
        </div>
      </div>

      {/* Active indicator dot — only on desktop (right panel updates there) */}
      {isActive && !isMobile && (
        <span className="absolute top-3 right-3 flex h-2 w-2">
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${c.dot} opacity-50`} />
          <span className={`relative inline-flex h-2 w-2 rounded-full ${c.dot}`} />
        </span>
      )}

      {/* Tap hint ripple — only on first card when not yet interacted, mobile only */}
      <AnimatePresence>
        {showTapHint && isMobile && (
          <motion.span
            key="tap-ripple"
            initial={{ opacity: 0.7, scale: 0.85 }}
            animate={{ opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.4, ease: "easeOut" }}
            className={`absolute inset-0 rounded-2xl pointer-events-none ${c.activeBorder}`}
            style={{ border: `2px solid ${industry.accentFrom}` }}
          />
        )}
      </AnimatePresence>

      {/* Subtle hover shimmer on inactive */}
      {!isActive && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
      )}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DETAIL PANEL
═══════════════════════════════════════════════════════════════ */
function DetailPanel({ industry }: { industry: (typeof industries)[0] }) {
  const Icon = industry.icon;
  const c = industryColorMap[industry.color];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={industry.id}
        initial={{ opacity: 0, y: 8, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.99 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full rounded-2xl overflow-hidden border border-white/80 bg-white/75 backdrop-blur-2xl"
        style={{ boxShadow: `0 12px 40px ${industry.glowColor}, 0 0 0 1px rgba(255,255,255,0.6)` }}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] z-10"
          style={{ background: `linear-gradient(90deg, ${industry.accentFrom}, ${industry.accentTo})` }}
        />

        <div className="relative z-10 p-5 sm:p-7 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.iconBg} ring-2 ring-white/80 shadow-md`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900 leading-tight">{industry.label}</p>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">{industry.tagline}</p>
              </div>
            </div>
            <button
              className="hidden sm:flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${industry.accentFrom}, ${industry.accentTo})` }}
            >
              Explore <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="my-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          <p className="text-sm leading-relaxed text-slate-600 font-medium">
            {industry.description}
          </p>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {industry.stats.map((stat, i) => (
              <div key={i} className="rounded-xl border border-white/90 bg-white/70 backdrop-blur-sm p-4 shadow-sm">
                <p
                  className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent leading-tight"
                  style={{ backgroundImage: `linear-gradient(135deg, ${industry.accentFrom}, ${industry.accentTo})` }}
                >
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Pill tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {featuresData.industrySection.featurePills.map((pill) => (
              <span key={pill} className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-white/60 border-slate-200/60 text-slate-500 backdrop-blur-sm">
                {pill}
              </span>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-5 sm:hidden">
            <button
              className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-md"
              style={{ background: `linear-gradient(135deg, ${industry.accentFrom}, ${industry.accentTo})` }}
            >
              Explore {industry.label} <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Watermark */}
          <div className="absolute bottom-5 right-5 pointer-events-none opacity-[0.035]">
            <Icon className="h-20 w-20 text-slate-900" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INDUSTRY SECTION — subsection treatment, clear interaction UX
═══════════════════════════════════════════════════════════════ */
function IndustrySection() {
  const [activeId, setActiveId] = useState(industries[0].id);
  const [hasInteracted, setHasInteracted] = useState(false);
  const activeIndustry = industries.find((i) => i.id === activeId)!;
  const detailPanelRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/tablet viewport
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSelect = (id: string) => {
    setActiveId(id);
    if (!hasInteracted) setHasInteracted(true);
    // On mobile/tablet, smoothly scroll the detail panel into view
    if (isMobile && detailPanelRef.current) {
      setTimeout(() => {
        detailPanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 60); // slight delay so AnimatePresence can mount the new panel first
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#eceef8] via-[#f1f3fe] to-[#f8f9ff] pt-10 sm:pt-12 pb-16 sm:pb-10">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-[28rem] w-[28rem] rounded-full bg-violet-400/8 blur-[90px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[20rem] w-[20rem] rounded-full bg-fuchsia-400/8 blur-[80px]" />
      </div>
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(99,102,241,1) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Subsection heading ── */}
        <div className="mx-auto max-w-2xl text-center mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-100/50 px-3.5 py-1 backdrop-blur-md shadow-sm mb-4"
          >
            <Layers className="h-3 w-3 text-violet-500" />
            <span className="text-[11px] font-bold text-violet-700 tracking-wide uppercase">{featuresData.industrySection.badge}</span>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5 }}
            className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
          >
            {featuresData.industrySection.headlineParts.pre}{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600">
              {featuresData.industrySection.headlineParts.accent}
            </span>
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500 font-medium sm:text-base"
          >
            {featuresData.industrySection.subheading}
          </motion.p>
        </div>

        {/* ── Interaction hint bar — desktop vs mobile ── */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.25 } }}
              transition={{ delay: 0.6, duration: 0.35 }}
              className="flex items-center justify-center gap-2 mb-5"
            >
              <div className="flex items-center gap-1.5 rounded-full bg-slate-800/8 border border-slate-300/40 px-3.5 py-1.5 backdrop-blur-sm">
                {isMobile ? (
                  // Mobile/tablet hint
                  <>
                    <ArrowDown className="h-3 w-3 text-violet-500 animate-bounce" />
                    <span className="text-[11px] font-semibold text-slate-500">
                      {featuresData.industrySection.interactionHints.mobile}
                    </span>
                  </>
                ) : (
                  // Desktop hint
                  <>
                    <MousePointer2 className="h-3 w-3 text-violet-500" />
                    <span className="text-[11px] font-semibold text-slate-500">
                      {featuresData.industrySection.interactionHints.desktopMain}
                    </span>
                    <span className="ml-1 text-[11px] text-slate-400">{featuresData.industrySection.interactionHints.desktopSub}</span>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:gap-5 items-start"
        >
          {/* Left list */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            {industries.map((industry, index) => (
              <IndustryCard
                key={industry.id}
                industry={industry}
                isActive={activeId === industry.id}
                onClick={() => handleSelect(industry.id)}
                index={index}
                hasInteracted={hasInteracted}
                isMobile={isMobile}
              />
            ))}

            {/* On mobile: visual connector showing detail panel is below */}
            <AnimatePresence>
              {isMobile && !hasInteracted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ delay: 0.8 }}
                  className="lg:hidden flex flex-col items-center gap-1 py-2"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-px h-4 bg-gradient-to-b from-violet-300/60 to-transparent" />
                    <motion.div
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronDown className="h-4 w-4 text-violet-400" />
                    </motion.div>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400 text-center">
                    Detail card updates below
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Coming soon */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2.5 rounded-2xl border border-dashed border-slate-300/50 bg-white/20 backdrop-blur-sm px-4 py-3 mt-1"
            >
              <TrendingUp className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-500">{featuresData.industrySection.comingSoon.label}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{featuresData.industrySection.comingSoon.subtitle}</p>
              </div>
            </motion.div>
          </div>

          {/* Right panel — desktop only */}
          <div className="hidden lg:block lg:col-span-3 min-h-[420px]">
            <DetailPanel industry={activeIndustry} />
          </div>
        </motion.div>

        {/* ── Mobile/Tablet detail panel — renders BELOW the list ── */}
        <div
          ref={detailPanelRef}
          className="lg:hidden mt-4"
        >
          {/* Connector line + label above the panel */}
          <div className="flex items-center gap-3 mb-3 px-1">
            <div
              className="flex-1 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${activeIndustry.accentFrom}40)` }}
            />
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold border"
              style={{
                color: activeIndustry.accentFrom,
                borderColor: `${activeIndustry.accentFrom}30`,
                background: `${activeIndustry.accentFrom}0a`,
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: activeIndustry.accentFrom }}
              />
              {activeIndustry.label}
            </div>
            <div
              className="flex-1 h-px"
              style={{ background: `linear-gradient(90deg, ${activeIndustry.accentFrom}40, transparent)` }}
            />
          </div>
          <DetailPanel industry={activeIndustry} />
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function FeaturesVideoWithIndustry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springCfg = { stiffness: 90, damping: 22, mass: 0.5 };
  const sX = useSpring(rotateX, springCfg);
  const sY = useSpring(rotateY, springCfg);
  const transform = useMotionTemplate`perspective(1200px) rotateX(${sX}deg) rotateY(${sY}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(y * -10);
    rotateY.set(x * 12);
    containerRef.current?.style.setProperty("--mx", `${x}`);
    containerRef.current?.style.setProperty("--my", `${y}`);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    containerRef.current?.style.setProperty("--mx", "0");
    containerRef.current?.style.setProperty("--my", "0");
  };

  return (
    <>
      {/* ══════════════════════════════════════
          SECTION 1 — FEATURES VIDEO
      ══════════════════════════════════════ */}
      <section id="features-video" className="relative overflow-hidden bg-gradient-to-b from-[#f8f9ff] via-[#f1f3fe] to-[#eceef8] pb-14 md:pb-16 pt-0">
        <ScrollBeamDivider />

        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="h-[40rem] w-[40rem] rounded-full bg-violet-400/10 blur-[120px]" />
          <div className="h-[30rem] w-[30rem] rounded-full bg-fuchsia-400/10 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 lg:mt-20">

          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-100/50 px-4 py-1.5 backdrop-blur-md shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              <span className="text-xs font-bold text-violet-800 tracking-wide">{featuresData.featuresVideo.badge}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              {featuresData.featuresVideo.headlineParts.pre}{" "}
              <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600">
                {featuresData.featuresVideo.headlineParts.accent}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 font-medium sm:text-lg"
            >
              {featuresData.featuresVideo.subheading}
            </motion.p>
          </div>

          {/* 3D Card Stage */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto mt-16 sm:mt-24 max-w-5xl"
          >
            {floatingBadges.map((badge) => (
              <BadgePill
                key={badge.id}
                badge={badge}
                className={badge.desktopClass}
                style={{ transform: `translate3d(calc(var(--mx,0) * ${badge.factor.x}px), calc(var(--my,0) * ${badge.factor.y}px), 0)` }}
              />
            ))}

            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full z-20"
              style={{ perspective: "1200px" }}
            >
              <motion.div
                style={{ transform, transformStyle: "preserve-3d" }}
                className="relative w-full rounded-[24px] sm:rounded-[32px] p-[2px] shadow-2xl shadow-violet-500/10"
              >
                <div className="absolute inset-0 rounded-[24px] sm:rounded-[32px] overflow-hidden -z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_60%,rgba(139,92,246,0.8)_80%,transparent_100%)] opacity-70"
                  />
                </div>

                <div className="relative w-full overflow-hidden rounded-[22px] sm:rounded-[30px] border border-white/60 bg-white/60 backdrop-blur-2xl shadow-inner">
                  {/* Browser chrome */}
                  <div className="flex items-center justify-between border-b border-slate-200/50 bg-white/40 px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400 shadow-sm" />
                      <div className="h-3 w-3 rounded-full bg-amber-400 shadow-sm" />
                      <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-sm" />
                    </div>
                    <div className="flex-1 mx-4 max-w-sm mx-auto">
                      <div className="flex items-center justify-center rounded-full border border-slate-200/60 bg-white/50 px-4 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wide text-slate-500 shadow-sm">
                        {featuresData.featuresVideo.browserMockupUrl}
                      </div>
                    </div>
                    <div className="w-9" />
                  </div>

                  <div className="p-3 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Sidebar */}
                    <div className="hidden md:flex md:col-span-3 flex-col gap-3 rounded-xl border border-white/80 bg-white/50 p-4 shadow-sm">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`h-8 w-full rounded-lg ${i === 0 ? "bg-violet-100 border border-violet-200" : "bg-slate-100/60"}`} />
                      ))}
                      <div className="mt-auto space-y-2">
                        <div className="h-6 w-full rounded-lg bg-slate-100/60" />
                        <div className="h-6 w-full rounded-lg bg-slate-100/60" />
                      </div>
                    </div>

                    {/* Video area */}
                    <div className="col-span-1 md:col-span-9 flex flex-col gap-4 rounded-xl border border-white/80 bg-white/50 p-3 sm:p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="h-4 w-32 sm:w-48 rounded-md bg-slate-200" />
                          <div className="h-2 w-20 sm:w-24 rounded-md bg-slate-100 mt-2" />
                        </div>
                        <button className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-violet-700">
                          Live Preview <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 flex items-center justify-center group">
                        <video
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? "opacity-100" : "opacity-40"}`}
                          poster="/video-placeholder.jpg"
                          muted
                          loop
                          playsInline
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:24px_24px] pointer-events-none" />
                        <AnimatePresence>
                          {!isPlaying && (
                            <motion.button
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setIsPlaying(true)}
                              className="relative z-10 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl transition-all hover:bg-white/20"
                            >
                              <span className="absolute inset-0 rounded-full animate-ping bg-white/20 duration-1000" />
                              <Play className="ml-1 h-6 w-6 sm:h-8 sm:w-8 fill-current drop-shadow-md" />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-8 sm:h-10 rounded-lg bg-slate-100/80 border border-slate-200/50" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Mobile badge grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 px-2 xl:hidden">
              {floatingBadges.map((badge) => {
                const c = badgeColorMap[badge.color];
                const Icon = badge.icon;
                return (
                  <div key={badge.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm p-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.icon} mt-0.5`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 leading-snug">{badge.title}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{badge.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mx-auto mt-12 grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 px-6 max-w-lg md:max-w-3xl"
          >
            {featureStats.map((stat, index) => {
              const isLastOdd = index === featureStats.length - 1 && featureStats.length % 2 !== 0;
              return (
                <div key={stat.id} className={`text-center ${isLastOdd ? "col-span-2 md:col-span-1" : ""}`}>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 leading-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm sm:text-base font-extrabold text-slate-700 mt-0.5 leading-tight">{stat.label}</p>
                  <p className="text-xs sm:text-[13px] text-slate-600 mt-1.5 font-medium leading-snug">{stat.sub}</p>
                </div>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          DIVIDER — clean, no gap on mobile
      ══════════════════════════════════════ */}
      <div className="bg-[#eceef8] h-px w-full">
        <div
          className="h-full max-w-7xl mx-auto"
          style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.2), transparent)" }}
        />
      </div>

      {/* ══════════════════════════════════════
          SECTION 2 — INDUSTRY (subsection)
      ══════════════════════════════════════ */}
      <IndustrySection />
    </>
  );
}