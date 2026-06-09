"use client";

import { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { Play, ArrowUpRight, Sparkles, ShieldCheck, Layers3, Activity } from "lucide-react";
import ScrollBeamDivider from "../ui/ScrollBeamDivider";

/* ─────────────────────────────────────────────
   Badge config
───────────────────────────────────────────── */
const floatingBadges: Badge[] = [
  {
    id: "auditing",
    title: "Autonomous Auditing",
    subtitle: "AI-driven compliance checks",
    icon: ShieldCheck,
    color: "violet",
    desktopClass: "hidden xl:flex -top-6 right-4 2xl:-right-6",
    factor: { x: -8, y: -8 },
    delay: 0.1,
  },
  {
    id: "showreel",
    title: "Real-time Showreel",
    subtitle: "Live render pipeline",
    icon: Activity,
    color: "emerald",
    desktopClass: "hidden xl:flex top-1/2 -translate-y-1/2 -right-6 2xl:-right-12",
    factor: { x: 10, y: 5 },
    delay: 0.2,
  },
  {
    id: "ledger",
    title: "Ledger Sync",
    subtitle: "Zero-latency reconciliation",
    icon: Layers3,
    color: "blue",
    desktopClass: "hidden xl:flex -bottom-6 left-4 2xl:-left-6",
    factor: { x: -6, y: 10 },
    delay: 0.3,
  },
  {
    id: "validation",
    title: "AI Validation",
    subtitle: "Intelligent fraud detection",
    icon: Sparkles,
    color: "amber",
    desktopClass: "hidden xl:flex top-1/2 -translate-y-1/2 -left-6 2xl:-left-12",
    factor: { x: -10, y: -5 },
    delay: 0.4,
  },
];

const colorMap = {
  violet: {
    icon: "bg-violet-100 text-violet-600",
    dot: "bg-violet-500",
    glow: "shadow-violet-200/60",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-600",
    dot: "bg-emerald-500",
    glow: "shadow-emerald-200/60",
  },
  blue: {
    icon: "bg-blue-100 text-blue-600",
    dot: "bg-blue-500",
    glow: "shadow-blue-200/60",
  },
  amber: {
    icon: "bg-amber-100 text-amber-600",
    dot: "bg-amber-500",
    glow: "shadow-amber-200/60",
  },
};

/* ─────────────────────────────────────────────
   Badge Component (Desktop Floating)
───────────────────────────────────────────── */
type Badge = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: keyof typeof colorMap;
  desktopClass: string;
  factor: { x: number; y: number };
  delay: number;
};

function BadgePill({ badge, style, className = "" }: { badge: Badge; style?: React.CSSProperties; className?: string }) {
  const c = colorMap[badge.color];
  const Icon = badge.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: badge.delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`
        absolute ${className}
        pointer-events-none select-none
        min-w-[180px] max-w-[220px]
        rounded-2xl border border-white/80
        bg-white/70 backdrop-blur-3xl
        shadow-xl ${c.glow} 
        px-3.5 py-2.5
        ring-1 ring-black/5
        z-30
      `}
      style={style}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
      <div className="relative flex items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${c.icon} ring-1 ring-white/60 shadow-sm`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold leading-tight text-slate-800 truncate">{badge.title}</p>
          <p className="text-[10px] font-medium leading-snug text-slate-500 truncate mt-0.5">{badge.subtitle}</p>
        </div>
      </div>
      <span className="absolute top-2 right-2.5 flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${c.dot} opacity-60`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${c.dot}`} />
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main Section Component
───────────────────────────────────────────── */
export default function FeaturesVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 3D Parallax logic
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
    rotateX.set(y * -10); // Tilt
    rotateY.set(x * 12);
    
    // Pass raw values to CSS variables for badges
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f8f9ff] via-[#f1f3fe] to-[#eceef8] pb-20 md:pb-28 pt-0">
    <ScrollBeamDivider />
      
      {/* ── Premium Breaker (Top Divider) ── */}
      {/* <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent opacity-50" />
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white to-transparent" /> */}

      {/* ── Background Elements ── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="h-[40rem] w-[40rem] rounded-full bg-violet-400/10 blur-[120px]" />
        <div className="h-[30rem] w-[30rem] rounded-full bg-fuchsia-400/10 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 lg:mt-20">
        
        {/* ── Header ── */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-100/50 px-4 py-1.5 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            <span className="text-xs font-bold text-violet-800 tracking-wide">
              Interactive Product Intelligence
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Your financial workflow,{" "}
            <br className="hidden sm:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600">
              rendered in motion.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 font-medium sm:text-lg"
          >
            Intelligent approvals, AI-powered auditing, and live operational visibility — inside a premium, cinematic product experience.
          </motion.p>
        </div>

        {/* ── 3D Card Stage ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="relative mx-auto mt-16 sm:mt-24 max-w-5xl"
        >
          {/* Floating Badges (Hidden on tablets & mobile, uses grid below instead) */}
          {floatingBadges.map((badge) => (
            <BadgePill
              key={badge.id}
              badge={badge}
              className={badge.desktopClass}
              style={{
                transform: `translate3d(calc(var(--mx,0) * ${badge.factor.x}px), calc(var(--my,0) * ${badge.factor.y}px), 0)`,
              }}
            />
          ))}

          {/* Main Container for 3D */}
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
              {/* ── Border Beam Animation ── */}
              <div className="absolute inset-0 rounded-[24px] sm:rounded-[32px] overflow-hidden -z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_60%,rgba(139,92,246,0.8)_80%,transparent_100%)] opacity-70"
                />
              </div>

              {/* ── Inner Glass Card ── */}
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
                      expendesk.com/tour
                    </div>
                  </div>
                  <div className="w-9" /> {/* Spacer for balance */}
                </div>

                {/* Dashboard layout structure */}
                <div className="p-3 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4">
                  
                  {/* Sidebar (Hidden on small) */}
                  <div className="hidden md:flex md:col-span-3 flex-col gap-3 rounded-xl border border-white/80 bg-white/50 p-4 shadow-sm">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-8 w-full rounded-lg ${i === 0 ? "bg-violet-100 border border-violet-200" : "bg-slate-100/60"}`} />
                    ))}
                    <div className="mt-auto space-y-2">
                      <div className="h-6 w-full rounded-lg bg-slate-100/60" />
                      <div className="h-6 w-full rounded-lg bg-slate-100/60" />
                    </div>
                  </div>

                  {/* Main Video Area */}
                  <div className="col-span-1 md:col-span-9 flex flex-col gap-4 rounded-xl border border-white/80 bg-white/50 p-3 sm:p-5 shadow-sm">
                    
                    {/* Top Bar inside dashboard */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="h-4 w-32 sm:w-48 rounded-md bg-slate-200" />
                        <div className="h-2 w-20 sm:w-24 rounded-md bg-slate-100 mt-2" />
                      </div>
                      <button className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:bg-violet-700">
                        Live Preview <ArrowUpRight className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Highly Structured Video Container */}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 flex items-center justify-center group">
                      
                      {/* Placeholder Image / Video */}
                      <video 
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isPlaying ? "opacity-100" : "opacity-40"}`} 
                        poster="/video-placeholder.jpg" 
                        muted 
                        loop 
                        playsInline
                      >
                        {/* <source src="YOUR_FUTURE_VIDEO.mp4" type="video/mp4" /> */}
                      </video>

                      {/* Fallback pattern if no poster */}
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

                    {/* Bottom Stats inside dashboard */}
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

          {/* ── Mobile/Tablet Badge Grid (Visible below xl screens) ── */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 px-2 xl:hidden">
            {floatingBadges.map((badge) => {
              const c = colorMap[badge.color as keyof typeof colorMap];
              const Icon = badge.icon;
              return (
                <div key={badge.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm p-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.icon}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800 leading-tight truncate">{badge.title}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">{badge.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mx-auto mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 px-4"
        >
          {[
            { value: "99.9%", label: "Uptime SLA" },
            { value: "< 50ms", label: "Ledger Sync" },
            { value: "SOC 2", label: "Type II Certified" },
            { value: "10M+", label: "Transactions Audited" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600">
                {stat.value}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-bold tracking-widest uppercase">{stat.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}