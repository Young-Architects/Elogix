"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { problem } from "../_data";

/* ══════════════════════════════════════════════════════
   ANIMATED COUNTER
══════════════════════════════════════════════════════ */

function CountUp({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: to,
      duration: 2.2,
      ease: "power2.out",
      onUpdate() {
        if (ref.current) {
          ref.current.textContent =
            prefix + Math.round(obj.val).toLocaleString("en-IN") + suffix;
        }
      },
    });
  }, [inView, to, prefix, suffix]);

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

/* ══════════════════════════════════════════════════════
   HORIZONTAL CAROUSEL HELPERS (mobile only — collapses
   to a normal grid at the sm breakpoint and above)
══════════════════════════════════════════════════════ */

function useActiveCarouselIndex(
  containerRef: React.RefObject<HTMLDivElement | null>,
  count: number
) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = Array.from(
      container.querySelectorAll<HTMLElement>("[data-carousel-item]")
    );
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.55) {
            const idx = Number(
              entry.target.getAttribute("data-carousel-item")
            );
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { root: container, threshold: [0.55] }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [containerRef, count]);

  return active;
}

function CarouselDots({
  count,
  active,
  activeColor = "#EF4444",
}: {
  count: number;
  active: number;
  activeColor?: string;
}) {
  return (
    <div className="flex sm:hidden items-center justify-center gap-1.5 mt-5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: i === active ? "18px" : "6px",
            background:
              i === active ? activeColor : "rgba(255,255,255,0.14)",
          }}
        />
      ))}
    </div>
  );
}

function SwipeHint({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="flex sm:hidden items-center justify-center gap-1.5 mb-3 text-slate-600 text-[10px] font-semibold uppercase tracking-[0.14em]"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.span
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        ←
      </motion.span>
      {problem.swipeHint}
      <motion.span
        animate={{ x: [0, -4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        →
      </motion.span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const problemGridRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const dividerLineLeftRef = useRef<HTMLDivElement>(null);
  const dividerLineRightRef = useRef<HTMLDivElement>(null);

  const toolsActive = useActiveCarouselIndex(toolsRef, problem.oldTools.length);
  const problemsActive = useActiveCarouselIndex(
    problemGridRef,
    problem.problems.length
  );

  const [toolsSwiped, setToolsSwiped] = useState(false);
  const [problemsSwiped, setProblemsSwiped] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* Divider lines grow outward from center */
      if (dividerLineLeftRef.current && dividerLineRightRef.current) {
        gsap.fromTo(
          [dividerLineLeftRef.current, dividerLineRightRef.current],
          { scaleX: 0, transformOrigin: "center" },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: dividerLineLeftRef.current,
              start: "top 88%",
            },
          }
        );
      }

      /* Tool cards stagger in */
      if (toolsRef.current) {
        gsap.fromTo(
          toolsRef.current.querySelectorAll(".tool-card"),
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: toolsRef.current,
              start: "top 85%",
            },
          }
        );
      }

      /* Problem cards stagger in */
      if (problemGridRef.current) {
        gsap.fromTo(
          problemGridRef.current.querySelectorAll(".problem-card"),
          { opacity: 0, y: 44, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.62,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: problemGridRef.current,
              start: "top 85%",
            },
          }
        );
      }

      /* Closing banner scale + fade */
      if (closingRef.current) {
        gsap.fromTo(
          closingRef.current,
          { opacity: 0, scale: 0.97, y: 22 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: closingRef.current,
              start: "top 88%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(168deg, #070510 0%, #0C0818 48%, #0F091C 100%)",
      }}
    >
      {/* ── Top curved separator (light hero → dark) ── */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none pointer-events-none">
        <svg
          viewBox="0 0 1440 96"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ display: "block", height: "96px", width: "100%" }}
        >
          <path d="M0,0 L1440,0 L1440,32 Q720,96 0,32 Z" fill="#F5F3FF" />
        </svg>
      </div>

      {/* ── Spreadsheet grid lines (ironic background metaphor) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.032) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Ambient glows ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "8%",
          right: "-10%",
          width: "640px",
          height: "640px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 65%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "12%",
          left: "-8%",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)",
          filter: "blur(90px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "55%",
          left: "42%",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(239,68,68,0.04) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* ════════════════ MAIN CONTENT ════════════════ */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-10 pt-36 pb-28">

        {/* ── 1. BADGE + HEADLINE ── */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.78, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <motion.span
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-[10.5px] font-black tracking-[0.18em] uppercase mb-8"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.22)",
              color: "#FCA5A5",
            }}
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(239,68,68,0)",
                  "0 0 0 5px rgba(239,68,68,0.22)",
                  "0 0 0 0 rgba(239,68,68,0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {problem.badge}
          </motion.span>

          <h2 className="text-[2.1rem] sm:text-[2.8rem] xl:text-[3.6rem] font-extrabold leading-[1.08] tracking-tight mb-5">
            <span className="text-slate-200">{problem.headline.lead}</span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(118deg, #EF4444 0%, #F97316 55%, #FBBF24 100%)",
              }}
            >
              {problem.headline.accent}
            </span>
            <br />
            <span className="text-slate-100">{problem.headline.tailLead}</span>
            <span className="text-white">{problem.headline.tailEmphasis}</span>
          </h2>

          <p className="text-slate-500 text-[15px] max-w-lg mx-auto leading-relaxed">
            {problem.intro}
          </p>
        </motion.div>

        {/* ── 2. IMPACT STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
          {problem.impactStats.map((stat) => (
            <motion.div
              key={stat.label}
              className="relative rounded-2xl p-6 text-center overflow-hidden group cursor-default"
              style={{
                background: "rgba(255,255,255,0.022)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: stat.delay }}
              whileHover={{
                borderColor: "rgba(239,68,68,0.28)",
                background: "rgba(239,68,68,0.04)",
                y: -3,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(239,68,68,0.1) 0%, transparent 72%)",
                }}
              />
              <div className="text-3xl mb-3">{stat.emoji}</div>
              <div
                className="text-5xl sm:text-4xl xl:text-5xl font-black mb-2 bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(118deg,#EF4444 0%,#F97316 100%)",
                }}
              >
                <CountUp to={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── 3. MR EXPENSE CHIPS ── */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-center text-slate-600 text-[10.5px] font-black uppercase tracking-[0.2em] mb-7">
            {problem.mrExpensesLabel}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {problem.mrExpenses.map((item, i) => (
              <motion.div
                key={item.label}
                className="flex items-center gap-2.5 px-5 py-3 rounded-full cursor-default"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                initial={{ opacity: 0, scale: 0.82 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: 0.06 * i }}
                whileHover={{
                  scale: 1.06,
                  background: "rgba(124,58,237,0.09)",
                  borderColor: "rgba(124,58,237,0.28)",
                }}
              >
                <span className="text-lg leading-none">{item.emoji}</span>
                <span className="text-slate-300 text-[13px] font-semibold">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── 4. DIVIDER: "Yet most still rely on..." ── */}
        <div className="flex items-center gap-5 mb-10">
          <div
            ref={dividerLineLeftRef}
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(239,68,68,0.38))",
            }}
          />
          <div
            className="flex-shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[10.5px] font-black uppercase tracking-[0.16em] whitespace-nowrap"
            style={{
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.18)",
              color: "#FCA5A5",
            }}
          >
            <span className="text-base leading-none">
              {problem.legacyDivider.icon}
            </span>
            {problem.legacyDivider.label}
          </div>
          <div
            ref={dividerLineRightRef}
            className="flex-1 h-px"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(239,68,68,0.38))",
            }}
          />
        </div>

        {/* ── 5. OLD TOOLS — horizontal swipe carousel on mobile, grid on desktop ── */}
        <div className="mb-6 sm:mb-20">
          <SwipeHint visible={!toolsSwiped} />
          <div
            ref={toolsRef}
            onScroll={() => setToolsSwiped(true)}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 sm:pb-0
                       sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:snap-none
                       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              WebkitOverflowScrolling: "touch",
              maskImage:
                "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
            }}
          >
            {problem.oldTools.map((tool, i) => (
              <div
                key={tool.name}
                data-carousel-item={i}
                className="tool-card group relative rounded-2xl p-5 overflow-hidden cursor-default
                           flex-shrink-0 w-[78%] xs:w-[68%] snap-center sm:w-auto
                           transition-transform duration-300 sm:hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.018)",
                  border: "1px solid rgba(255,255,255,0.055)",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 5px)",
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(239,68,68,0.09) 0%, transparent 75%)",
                  }}
                />
                <span
                  className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded text-[9px] font-black tracking-[0.14em]"
                  style={{
                    background: tool.tagColor,
                    border: `1px solid ${tool.tagBorder}`,
                    color: tool.tagText,
                  }}
                >
                  {tool.tag}
                </span>

                <div className="text-3xl mb-4 leading-none">{tool.emoji}</div>
                <h3 className="text-white font-bold text-[13.5px] mb-2">
                  {tool.name}
                </h3>
                <p className="text-slate-500 text-[12px] leading-relaxed">
                  {tool.desc}
                </p>

                <div className="mt-4 flex items-center gap-1.5">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-red-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    style={{ boxShadow: "0 0 4px rgba(239,68,68,0.7)" }}
                  />
                  <span className="text-red-400/50 text-[10px] font-semibold tracking-wide">
                    {problem.oldToolsFooter}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <CarouselDots count={problem.oldTools.length} active={toolsActive} />
        </div>

        {/* ── 6. "As a result..." TRANSITION ── */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.62 }}
        >
          <p className="text-slate-600 text-[10.5px] font-black uppercase tracking-[0.22em] mb-3">
            {problem.result.eyebrow}
          </p>
          <h3 className="text-[1.8rem] sm:text-4xl font-extrabold text-white leading-snug">
            {problem.result.lead}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(128deg, #EF4444 0%, #F97316 100%)",
              }}
            >
              {problem.result.accent}
            </span>
          </h3>
          <p className="text-slate-500 text-[13.5px] mt-3 max-w-sm mx-auto leading-relaxed">
            {problem.result.subtext}
          </p>
        </motion.div>

        {/* ── 7. PROBLEM GRID — horizontal swipe carousel on mobile, grid on desktop ── */}
        <div className="mb-10 sm:mb-24">
          <SwipeHint visible={!problemsSwiped} />
          <div
            ref={problemGridRef}
            onScroll={() => setProblemsSwiped(true)}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 sm:pb-0
                       sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:snap-none
                       [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              WebkitOverflowScrolling: "touch",
              maskImage:
                "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
            }}
          >
            {problem.problems.map((item, i) => (
              <div
                key={item.label}
                data-carousel-item={i}
                className="problem-card group relative rounded-2xl p-6 overflow-hidden cursor-default
                           flex-shrink-0 w-[80%] xs:w-[70%] snap-center sm:w-auto
                           transition-transform duration-300 sm:hover:-translate-y-1"
                style={{
                  background: "rgba(239,68,68,0.03)",
                  border: "1px solid rgba(239,68,68,0.09)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(239,68,68,0.13) 0%, transparent 72%)",
                  }}
                />

                <div
                  className="absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full transition-all duration-500"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(239,68,68,0.5), rgba(249,115,22,0.3))",
                  }}
                />
                <div
                  className="absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(to bottom, #EF4444, #F97316)",
                    boxShadow: "0 0 12px rgba(239,68,68,0.5)",
                  }}
                />

                <div className="pl-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-[15px]"
                      style={{
                        background: "rgba(239,68,68,0.09)",
                        border: "1px solid rgba(239,68,68,0.16)",
                      }}
                    >
                      {item.emoji}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0">
                        <path
                          d="M1.5 1.5L11.5 11.5M11.5 1.5L1.5 11.5"
                          stroke="#EF4444"
                          strokeWidth="2.1"
                          strokeLinecap="round"
                        />
                      </svg>
                      <h4 className="text-white font-bold text-[13px] leading-snug">
                        {item.label}
                      </h4>
                    </div>
                  </div>
                  <p className="text-slate-500 text-[12px] leading-[1.75]">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <CarouselDots
            count={problem.problems.length}
            active={problemsActive}
          />
        </div>

        {/* ── 8. CLOSING BANNER — compact, structured "scary part" ── */}
        <div ref={closingRef}>
          <div
            className="relative rounded-2xl p-px"
            style={{
              background:
                "linear-gradient(135deg, rgba(239,68,68,0.4) 0%, rgba(124,58,237,0.25) 50%, rgba(239,68,68,0.4) 100%)",
            }}
          >
            <div
              className="relative rounded-[calc(1rem-1px)] overflow-hidden"
              style={{
                background:
                  "linear-gradient(148deg, rgba(239,68,68,0.06) 0%, #0C0818 35%, rgba(124,58,237,0.07) 100%)",
              }}
            >
              <div
                className="absolute top-0 left-0 w-40 h-40 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 0% 0%, rgba(239,68,68,0.18) 0%, transparent 60%)",
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-40 h-40 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 100% 100%, rgba(124,58,237,0.18) 0%, transparent 60%)",
                }}
              />

              {/* Structured two-column layout on larger screens, stacked & compact on mobile */}
              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7 px-6 sm:px-9 py-7 sm:py-8">
                {/* Icon + pill */}
                <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-2.5 flex-shrink-0">
                  <motion.div
                    className="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex-shrink-0"
                    style={{
                      background: "rgba(239,68,68,0.09)",
                      border: "1px solid rgba(239,68,68,0.22)",
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(239,68,68,0.0)",
                        "0 0 0 6px rgba(239,68,68,0.1)",
                        "0 0 0 0 rgba(239,68,68,0.0)",
                      ],
                    }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-lg leading-none">
                      {problem.closing.icon}
                    </span>
                  </motion.div>
                  <span
                    className="inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-[9px] font-black tracking-[0.16em] uppercase"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "#FCA5A5",
                    }}
                  >
                    {problem.closing.badge}
                  </span>
                </div>

                {/* Copy + CTA */}
                <div className="text-center sm:text-left flex-1 min-w-0">
                  <h3 className="text-[1.25rem] sm:text-[1.4rem] xl:text-[1.55rem] font-extrabold text-white mb-2.5 leading-[1.2] tracking-tight">
                    {problem.closing.headlineLead}
                    <span
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage:
                          "linear-gradient(118deg,#EF4444 0%,#F97316 100%)",
                      }}
                    >
                      {problem.closing.headlineAccent}
                    </span>
                    {problem.closing.headlineTail}
                  </h3>

                  <p className="text-slate-400 text-[12.5px] leading-[1.65] mb-4 max-w-xl mx-auto sm:mx-0">
                    {problem.closing.body}
                  </p>

                  <motion.div
                    className="inline-flex items-center gap-2 text-violet-400 text-[12.5px] font-semibold cursor-pointer group"
                    whileHover={{ x: 2 }}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="group-hover:text-violet-300 transition-colors">
                      {problem.closing.cta}
                    </span>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 15 15"
                      fill="none"
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      <path
                        d="M2.5 7.5H12.5M12.5 7.5L8.5 3.5M12.5 7.5L8.5 11.5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(7,5,16,1) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}