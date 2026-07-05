"use client";

/**
 * Footer — the site-wide footer rendered on every route (mounted once in the
 * root layout, after the page `children`).
 *
 * Structure:
 *  - Brand block: logo mark (matches the Navbar), name, subheading, tagline,
 *    and a magnetic social "dock".
 *  - Four link columns (Solutions / Features / Resources / Quick Links).
 *  - A bottom bar: copyright + legal links.
 *
 * Data-driven: every string, link, and social handle comes from
 * `src/data/footer.json`. Socials carry a string `iconKey` mapped to an inline
 * brand SVG via `SOCIAL_ICONS` below (lucide-react 1.x removed brand glyphs, so
 * the marks are hand-rolled) — the JSON stays serialisable and React-free.
 *
 * The social dock mirrors macOS-style dock magnification: the icon nearest the
 * cursor grows, its neighbours grow a little, and a tooltip rises above the
 * hovered icon. Built with Framer Motion (`useMotionValue` + distance-based
 * `useTransform` + `useSpring`). Honours `prefers-reduced-motion`.
 */

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import footerData from "@/data/footer.json";

/* ───────────────────────── brand social icons ───────────────────────── */
/* Inline SVGs (lucide-react 1.x no longer ships brand marks). Each inherits
   `currentColor`, so colour is controlled by the button's text class. */

const SOCIAL_ICONS: Record<string, ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-1/2 w-1/2">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.6 8.65 22 11 22 14.1V21h-4v-6.1c0-1.46-.03-3.34-2.03-3.34-2.03 0-2.34 1.59-2.34 3.23V21h-4V9Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-1/2 w-1/2">
      <path d="M23.5 6.9a3 3 0 0 0-2.11-2.12C19.5 4.25 12 4.25 12 4.25s-7.5 0-9.39.53A3 3 0 0 0 .5 6.9 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.1 3 3 0 0 0 2.11 2.12c1.89.53 9.39.53 9.39.53s7.5 0 9.39-.53a3 3 0 0 0 2.11-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.1ZM9.6 15.5v-7l6.2 3.5-6.2 3.5Z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-1/2 w-1/2">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-1/2 w-1/2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[45%] w-[45%]">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.96 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.02 4.13H5.06l12.02 15.64Z" />
    </svg>
  ),
};

/* ───────────────────────── magnetic social dock ───────────────────────── */
/* macOS-style magnification (like the reference): each icon is a circle that
   scales up toward the cursor — biggest directly under it, neighbours a little
   larger — smoothed by a spring. The container has a LOCKED height with
   `overflow-visible`, so the box itself never grows taller; the enlarged icon
   simply rises out of the pill. Only the horizontal spread changes. */

const ICON_BASE = 44; // resting diameter of every icon (px)
const ICON_MAX = 62; // diameter directly under the cursor (px)
const RANGE = 150; // how far (px) the cursor's influence reaches

const DOCK_SPRING = { mass: 0.22, stiffness: 150, damping: 15 } as const;

function DockIcon({
  iconKey,
  label,
  href,
  mouseX,
}: {
  iconKey: string;
  label: string;
  href: string;
  mouseX: MotionValue<number>;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  // Signed horizontal distance from the cursor to this icon's centre.
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return RANGE + 1;
    return val - (bounds.x + bounds.width / 2);
  });

  // Diameter scales with proximity; width === height so it stays a circle.
  const sizeSync = useTransform(distance, [-RANGE, 0, RANGE], [ICON_BASE, ICON_MAX, ICON_BASE]);
  const size = useSpring(sizeSync, DOCK_SPRING);

  return (
    <Link
      ref={ref}
      href={href}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex shrink-0 items-center justify-center outline-none"
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute -top-11 whitespace-nowrap rounded-md border border-white/10 bg-neutral-800 px-2.5 py-1 text-xs font-medium text-white shadow-lg"
          >
            {label}
            <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-neutral-800" />
          </motion.span>
        )}
      </AnimatePresence>

      <motion.span
        style={{ width: size, height: size }}
        className="flex items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/65 transition-colors duration-300 hover:border-white/30 hover:bg-white/15 hover:text-white"
      >
        {SOCIAL_ICONS[iconKey]}
      </motion.span>
    </Link>
  );
}

function SocialDock() {
  const shouldReduceMotion = useReducedMotion();
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => {
        if (!shouldReduceMotion) mouseX.set(e.clientX);
      }}
      onMouseLeave={() => mouseX.set(Infinity)}
      // Locked height + overflow-visible: the box never grows taller — the
      // magnified icon rises out of the pill instead (as in the reference).
      className="flex h-19 w-fit items-center gap-2.5 overflow-visible rounded-3xl border border-white/10 bg-white/3 px-4 backdrop-blur-sm"
    >
      {footerData.socials.map((s) => (
        <DockIcon
          key={s.iconKey}
          iconKey={s.iconKey}
          label={s.label}
          href={s.href}
          mouseX={mouseX}
        />
      ))}
    </div>
  );
}

/* ───────────────────────── brand logo mark ───────────────────────── */
/* Same gradient "E" tile the Navbar uses, so the footer reads as one system. */

function BrandMark() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5">
      <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_6px_20px_rgba(99,102,241,0.4)]">
        <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative z-10 text-sm font-bold tracking-tight text-white">E</span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight text-white">
          {footerData.brand.name}
        </span>
        <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.25em] text-indigo-300/70">
          Intelligence
        </span>
      </span>
    </Link>
  );
}

/* ───────────────────────── link column ───────────────────────── */

function LinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wide text-white">{heading}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center text-[13.5px] text-white/55 transition-colors duration-200 hover:text-white"
            >
              <span className="h-px w-0 bg-indigo-400 transition-all duration-300 group-hover:mr-2 group-hover:w-4" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────── footer ───────────────────────── */

export default function Footer(): ReactNode {
  const { brand, columns, legal } = footerData;

  // Updates itself every year, automatically. This is a client component, so
  // `getFullYear()` runs on the client at hydration and yields the real current
  // year even though the page is statically prerendered with a build-time year.
  // `suppressHydrationWarning` on the render below absorbs that Jan-1 rollover.
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-slate-950 to-black text-white">
      {/* Ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:py-16 lg:px-8">
        {/* Top: brand + link columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-12">
          {/* Brand block */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            <BrandMark />
            <p className="mt-5 max-w-sm text-sm font-medium leading-relaxed text-white/70">
              {brand.subheading}
            </p>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/45">
              {brand.tagline}
            </p>

            <div className="mt-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                Follow Us
              </p>
              <SocialDock />
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading} className="lg:col-span-2">
              <LinkColumn heading={col.heading} links={col.links} />
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/45" suppressHydrationWarning>
            © {year} {brand.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {legal.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-xs text-white/45 transition-colors duration-200 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
