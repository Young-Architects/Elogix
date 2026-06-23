"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * MagneticButton — Premium magnetic CTA component
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Stack: Next.js · TypeScript · Framer Motion · Tailwind CSS
 *
 * VARIANTS
 *   primary    Blue → Purple → Pink gradient    main CTAs
 *   glow       Deep navy → Cyan gradient        hero sections, dark bg
 *   secondary  Glassmorphism + cyan ring        paired secondary CTA
 *   ghost      Transparent + white hover fill   nav links, tertiary actions
 *   outline    Bordered → fills gradient        light/mixed backgrounds
 *   danger     Red gradient                     destructive actions
 *
 * SIZES
 *   xs  sm  md  lg  xl  2xl   ← or override freely via className
 *
 * QUICK START
 *   import MagneticButton from "@/components/ui/MagneticButton"
 *
 *   <MagneticButton>Book a Demo</MagneticButton>
 *
 *   <MagneticButton variant="secondary" size="lg">
 *     Explore Features
 *   </MagneticButton>
 *
 *   <MagneticButton variant="glow" size="xl" icon={<ArrowRight size={16} />}>
 *     Get Started
 *   </MagneticButton>
 *
 *   <MagneticButton href="/pricing" variant="outline">
 *     View Pricing
 *   </MagneticButton>
 *
 *   <MagneticButton size="2xl" fullWidth>Create Account</MagneticButton>
 *
 *   <MagneticButton magnetStrength={0.45}>Stronger Pull</MagneticButton>
 *
 *   <MagneticButton loading>Processing...</MagneticButton>
 *
 *   <MagneticButton disabled>Not Available</MagneticButton>
 *
 *   <MagneticButton className="px-20 py-6 text-2xl rounded-full">
 *     Giant Custom
 *   </MagneticButton>
 *
 * PEER DEPS
 *   npm install framer-motion     (≥ 10.x — you likely already have this)
 *   next/link                     built into Next.js
 *   lucide-react / any icon lib   optional — pass any ReactNode as icon
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// Internal class utility  (no external dep needed)
// ─────────────────────────────────────────────────────────────────────────────

const cx = (...c: (string | false | null | undefined)[]): string =>
  c.filter(Boolean).join(" ");

// ─────────────────────────────────────────────────────────────────────────────
// Size token map
// ─────────────────────────────────────────────────────────────────────────────

const SIZES = {
  xs:    { pad: "px-3 py-1.5",  text: "text-xs",   gap: "gap-1.5", r: "rounded-lg"   },
  sm:    { pad: "px-4 py-2",    text: "text-sm",   gap: "gap-2",   r: "rounded-xl"   },
  md:    { pad: "px-5 py-2.5",  text: "text-sm",   gap: "gap-2",   r: "rounded-xl"   },
  lg:    { pad: "px-6 py-3",    text: "text-base", gap: "gap-2.5", r: "rounded-xl"   },
  xl:    { pad: "px-8 py-4",    text: "text-lg",   gap: "gap-3",   r: "rounded-2xl"  },
  "2xl": { pad: "px-10 py-5",   text: "text-xl",   gap: "gap-3",   r: "rounded-2xl"  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Variant config
// ─────────────────────────────────────────────────────────────────────────────

type VCfg = {
  /** Extra Tailwind classes applied directly on the button element */
  cls:    string;
  /** CSS gradient for the resting background (null = no bg layer) */
  bgBase: string | null;
  /** CSS gradient that fades in on hover (null = no hover bg change) */
  bgHov:  string | null;
  /** CSS gradient for the ambient blur glow behind the button */
  glow:   string | null;
  /** Shimmer rgba-white opacity (0–1) */
  sh:     number;
};

const VARIANTS: Record<string, VCfg> = {
  primary: {
    cls:    "border-transparent",
    bgBase: "linear-gradient(135deg,#1d4ed8 0%,#6d28d9 50%,#be185d 100%)",
    bgHov:  "linear-gradient(135deg,#3b82f6 0%,#8b5cf6 50%,#ec4899 100%)",
    glow:   "linear-gradient(135deg,#2563eb,#7c3aed,#db2777)",
    sh:     0.22,
  },
  glow: {
    cls:    "border-transparent",
    bgBase: "linear-gradient(135deg,#0c4a6e 0%,#1e3a8a 50%,#1e1b4b 100%)",
    bgHov:  "linear-gradient(135deg,#0e7490 0%,#2563eb 50%,#4338ca 100%)",
    glow:   "linear-gradient(135deg,#06b6d4 0%,#3b82f6 100%)",
    sh:     0.16,
  },
  secondary: {
    cls:    "border-white/15 bg-white/5 backdrop-blur-md",
    bgBase: null,
    bgHov:  null,
    glow:   null,
    sh:     0.13,
  },
  ghost: {
    cls:    "border-transparent",
    bgBase: null,
    bgHov:  null,
    glow:   null,
    sh:     0.10,
  },
  outline: {
    cls:    "border-blue-500/50",
    bgBase: null,
    bgHov:  "linear-gradient(135deg,#1d4ed8 0%,#6d28d9 50%,#be185d 100%)",
    glow:   null,
    sh:     0.20,
  },
  danger: {
    cls:    "border-transparent",
    bgBase: "linear-gradient(135deg,#7f1d1d 0%,#991b1b 100%)",
    bgHov:  "linear-gradient(135deg,#dc2626 0%,#ef4444 100%)",
    glow:   "linear-gradient(135deg,#dc2626,#f87171)",
    sh:     0.18,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Public types — export so consuming files can type their own wrappers
// ─────────────────────────────────────────────────────────────────────────────

export type MagneticButtonVariant = keyof typeof VARIANTS;
export type MagneticButtonSize    = keyof typeof SIZES;

export interface MagneticButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    // These are handled internally by the magnetic system.
    // Pass onClick normally — that still works.
    // The drag/animation handlers are excluded because Framer Motion
    // redefines them with incompatible signatures on motion.button.
    | "children"
    | "size"
    | "onMouseMove"
    | "onMouseEnter"
    | "onMouseLeave"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onDragStart"
    | "onDrag"
    | "onDragEnd"
  > {
  /** Button label — text, JSX, or any React node */
  children: React.ReactNode;

  /** Visual preset. Default: "primary" */
  variant?: MagneticButtonVariant;

  /**
   * Size preset.
   * Controls padding, font-size, and border-radius.
   * Default: "md"
   * Override any value with className.
   */
  size?: MagneticButtonSize;

  /** Renders the button as a Next.js <Link> */
  href?: string;

  /** Opens href in a new tab. Default: false */
  external?: boolean;

  /** Optional icon — any React node (Lucide, HeroIcons, SVG, etc.) */
  icon?: React.ReactNode;

  /** Where the icon appears relative to the label. Default: "right" */
  iconPosition?: "left" | "right";

  /** Shows a spinner and disables all interaction. Default: false */
  loading?: boolean;

  /**
   * How strongly the button drifts toward the cursor.
   * Range: 0 (no drift) → 1 (fully cursor-locked)
   * Default: 0.25  (natural, weighted feel)
   *
   * Recommended ranges:
   *   0.1–0.2  → subtle, professional
   *   0.25     → default, noticeable but natural
   *   0.4–0.6  → strong pull, very premium feel
   */
  magnetStrength?: number;

  /** Stretches to 100% width of its container. Default: false */
  fullWidth?: boolean;

  /**
   * Extra Tailwind classes appended last (highest specificity).
   * Use this for custom sizes, overrides, one-offs.
   *
   * Examples:
   *   className="px-20 py-6 text-2xl rounded-full"   → giant pill
   *   className="w-48"                                → fixed width
   */
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading spinner (internal)
// ─────────────────────────────────────────────────────────────────────────────

const Spinner = (): React.JSX.Element => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    width="15"
    height="15"
    aria-hidden="true"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 0.75, ease: "linear" }}
  >
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" />
  </motion.svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// MagneticButton
// ─────────────────────────────────────────────────────────────────────────────

const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton(
    {
      children,
      variant         = "primary",
      size            = "md",
      href,
      external        = false,
      icon,
      iconPosition    = "right",
      loading         = false,
      magnetStrength  = 0.25,
      fullWidth       = false,
      className       = "",
      disabled,
      onClick,
      ...rest
    },
    forwardedRef
  ) {
    const localRef = useRef<HTMLButtonElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLButtonElement>) ?? localRef;

    const [hovered, setHovered] = useState(false);

    // ── Spring-based magnetic translation ─────────────────────────────────
    // mass: 0.8 gives a slightly "heavy" feel — the button has physical weight.
    // stiffness: 260 + damping: 20 → snappy but not jittery.
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 260, damping: 20, mass: 0.8 });
    const sy = useSpring(my, { stiffness: 260, damping: 20, mass: 0.8 });

    const isDisabled = disabled || loading;

    // Track cursor relative to button center → drive spring values
    const handleMove = useCallback(
      (e: React.MouseEvent) => {
        if (isDisabled) return;
        const el = e.currentTarget as HTMLElement;
        const br = el.getBoundingClientRect();
        mx.set((e.clientX - br.left - br.width  / 2) * magnetStrength);
        my.set((e.clientY - br.top  - br.height / 2) * magnetStrength);
      },
      [isDisabled, magnetStrength, mx, my]
    );

    // Spring returns to zero on leave
    const handleLeave = useCallback(() => {
      mx.set(0);
      my.set(0);
      setHovered(false);
    }, [mx, my]);

    // ── Token lookup ───────────────────────────────────────────────────────
    const v = VARIANTS[variant] ?? VARIANTS.primary;
    const s = SIZES[size]       ?? SIZES.md;

    // ── Base button class string ───────────────────────────────────────────
    const btnCls = cx(
      "relative inline-flex items-center justify-center",
      "select-none border",
      "font-semibold tracking-wide text-white",
      "transition-colors duration-200",
      "outline-none",
      "focus-visible:ring-2 focus-visible:ring-blue-400/70",
      "focus-visible:ring-offset-2 focus-visible:ring-offset-black",
      // Size tokens
      s.pad, s.text, s.r,
      // Variant base classes (bg, border, backdrop)
      v.cls,
      // Modifiers
      fullWidth  ? "w-full"                        : "",
      isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      // User overrides (highest specificity)
      className,
    );

    // ── Visual layer stack ─────────────────────────────────────────────────
    //
    // IMPORTANT ARCHITECTURE NOTE:
    // The button element itself does NOT have overflow:hidden.
    // This lets the ambient glow (layer ①) bleed beyond the button's edges,
    // creating the premium floating-glow effect.
    // The shimmer sweep (layer ⑥) is self-contained inside its own
    // overflow:hidden wrapper so it clips correctly.
    //
    const layers = (
      <>

        {/* ①  AMBIENT GLOW ─────────────────────────────────────────────────
            Sits behind the button (z-index: -1), extends past edges,
            and blooms outward on hover. Only shown for gradient variants. */}
        {v.glow && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute rounded-[inherit]"
            style={{
              inset:      "-3px",
              background: v.glow,
              filter:     "blur(18px)",
              zIndex:     -1,
            }}
            animate={{
              opacity: hovered ? 0.60 : 0.20,
              scale:   hovered ? 1.07 : 1.00,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        )}

        {/* ②  BASE GRADIENT ────────────────────────────────────────────────
            The resting-state gradient fill. Static — never animates. */}
        {v.bgBase && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: v.bgBase }}
          />
        )}

        {/* ③  HOVER GRADIENT ───────────────────────────────────────────────
            A brighter/lighter version of the gradient.
            opacity: 0 at rest → 1 on hover. Cross-fades over the base. */}
        {v.bgHov && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: v.bgHov }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.28 }}
          />
        )}

        {/* ④  SECONDARY — CYAN RING ────────────────────────────────────────
            Glassmorphism variant gets an animated inset ring + outer glow
            in cyan on hover instead of a filled background. */}
        {variant === "secondary" && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            animate={{
              boxShadow: hovered
                ? "inset 0 0 0 1px rgba(6,182,212,0.55), 0 0 30px rgba(6,182,212,0.18)"
                : "inset 0 0 0 1px rgba(255,255,255,0.08)",
            }}
            transition={{ duration: 0.28 }}
          />
        )}

        {/* ⑤  GHOST — WHITE FILL ───────────────────────────────────────────
            Ghost variant gets a soft white fill that fades in on hover. */}
        {variant === "ghost" && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: "rgba(255,255,255,0.07)" }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.22 }}
          />
        )}

        {/* ⑥  SHIMMER SWEEP ────────────────────────────────────────────────
            A diagonal white band that sweeps left→right on hover.
            Wrapped in its own overflow:hidden so it clips at button edges.
            z-index: 2 puts it above the bg layers but below the label. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
          style={{ zIndex: 2 }}
        >
          <motion.span
            className="absolute top-0 h-full"
            style={{
              width:      "55%",
              background: `linear-gradient(90deg,transparent,rgba(255,255,255,${v.sh}),transparent)`,
            }}
            animate={{ left: hovered ? "130%" : "-60%" }}
            transition={{ duration: 0.52, ease: "easeInOut" }}
          />
        </span>

        {/* ⑦  CONTENT: spinner · icon · label ──────────────────────────────
            z-index: 3 keeps content above all visual layers.
            The icon gets a subtle x-nudge (±2px) on hover for liveliness. */}
        <span
          className={cx("relative flex items-center", s.gap)}
          style={{ zIndex: 3 }}
        >
          {/* Spinner replaces icon when loading */}
          {loading && <Spinner />}

          {/* Left icon */}
          {!loading && icon && iconPosition === "left" && (
            <motion.span
              className="flex items-center"
              animate={{ x: hovered ? -1 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              {icon}
            </motion.span>
          )}

          <span>{children}</span>

          {/* Right icon (default) */}
          {!loading && icon && iconPosition === "right" && (
            <motion.span
              className="flex items-center"
              animate={{ x: hovered ? 2 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              {icon}
            </motion.span>
          )}
        </span>

      </>
    );

    // ── Shared magnetic motion props ───────────────────────────────────────
    const magneticProps = {
      style:        { x: sx, y: sy },
      onMouseMove:  handleMove,
      onMouseEnter: () => !isDisabled && setHovered(true),
      onMouseLeave: handleLeave,
      whileHover:   isDisabled ? undefined : { scale: 1.048 },
      whileTap:     isDisabled ? undefined : { scale: 0.965 },
      // Spring for scale: stiffness 380, damping 22, mass 0.6
      // Feels snappy on the up-scale, slightly bouncy on release.
      transition: {
        type:      "spring" as const,
        stiffness: 380,
        damping:   22,
        mass:      0.6,
      },
    };

    // ── Render: Link ───────────────────────────────────────────────────────
    // When href is provided, wraps a Next.js <Link> in a motion.div that
    // carries all the magnetic behavior.
    if (href) {
      return (
        <motion.div
          {...magneticProps}
          style={{
            x:       sx,
            y:       sy,
            display: fullWidth ? "block" : "inline-block",
          }}
        >
          <Link
            href={href}
            className={btnCls}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {layers}
          </Link>
        </motion.div>
      );
    }

    // ── Render: Button ─────────────────────────────────────────────────────
    return (
      <motion.button
        ref={ref}
        {...magneticProps}
        className={btnCls}
        disabled={isDisabled}
        onClick={isDisabled ? undefined : onClick}
        {...rest}
      >
        {layers}
      </motion.button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

export { MagneticButton };
export default MagneticButton;
