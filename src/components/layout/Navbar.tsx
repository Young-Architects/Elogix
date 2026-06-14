"use client";

import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  type Transition,
} from "framer-motion";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

import {
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  BarChart2,
  Shield,
  Zap,
  Users,
  CreditCard,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import navData from "@/data/navigation.json";

/* ───────────────────────── animation ───────────────────────── */

const SMOOTH_EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const FAST_SPRING: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.6,
};

const TOGGLE_SPRING: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 26,
};

/* ───────────────────────── types ───────────────────────── */

type DropdownItem = {
  icon: LucideIcon;
  label: string;
  desc: string;
  href: string;
};

type NavItem = {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
};

type NavDropdownProps = {
  items: DropdownItem[];
  isOpen: boolean;
};

type MobileNavItemProps = {
  item: NavItem;
  idx: number;
  isOpen: boolean;
  onToggle: () => void;
  onClick: () => void;
};

/* ───────────────────────── icon map ───────────────────────── */

const NAV_ICON_MAP: Record<string, LucideIcon> = {
  "bar-chart-2":      BarChart2,
  "zap":              Zap,
  "layout-dashboard": LayoutDashboard,
  "users":            Users,
  "shield":           Shield,
  "credit-card":      CreditCard,
};

/* ───────────────────────── data (from navigation.json) ───────────────────────── */

const NAV_ITEMS: NavItem[] = navData.items.map((item) => ({
  label: item.label,
  href:  item.href,
  dropdown: item.dropdown?.map((d) => ({
    icon:  NAV_ICON_MAP[d.iconKey] ?? BarChart2,
    label: d.label,
    desc:  d.desc,
    href:  d.href,
  })),
}));

/* ───────────────────────── dropdown ───────────────────────── */

function NavDropdown({ items, isOpen }: NavDropdownProps): ReactNode {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.22, ease: SMOOTH_EASE }}
          className="absolute left-1/2 top-full z-50 mt-3.5 w-64 -translate-x-1/2"
        >
          {/* Pointer arrow — crisp white, no glass bleed */}
          <div className="absolute -top-[6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-slate-200/80 bg-white" />

          {/* Dropdown panel — fully opaque white */}
          <div className="relative overflow-hidden rounded-[22px] border border-slate-200/70 bg-white p-1.5 shadow-[0_20px_48px_rgba(99,102,241,0.12),0_6px_20px_rgba(0,0,0,0.06)]">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className="group flex items-center gap-3 rounded-[16px] px-3 py-2.5 transition-all duration-200 hover:bg-indigo-50/70"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-sm transition-all duration-300 group-hover:border-indigo-200 group-hover:shadow-[0_4px_12px_rgba(99,102,241,0.15)] group-hover:scale-105">
                    <Icon className="h-3.5 w-3.5 text-indigo-600" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[12.5px] font-semibold text-slate-800">
                      {item.label}
                    </span>
                    <span className="text-[10.5px] text-slate-500 leading-tight">
                      {item.desc}
                    </span>
                  </div>

                  <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-indigo-400 opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── mobile nav item ───────────────────────── */

function MobileNavItem({ item, idx, isOpen, onToggle, onClick }: MobileNavItemProps): ReactNode {
  const hasDropdown = Boolean(item.dropdown?.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.03, duration: 0.22, ease: SMOOTH_EASE }}
    >
      {hasDropdown ? (
        <div className="overflow-hidden rounded-2xl">
          <button
            onClick={onToggle}
            className="group flex w-full items-center justify-between rounded-2xl px-4 py-2.5 text-left transition-all duration-200 hover:bg-indigo-50/70 active:scale-[0.99]"
          >
            <span className="text-[13.5px] font-semibold text-slate-700 transition-colors duration-200 group-hover:text-indigo-600">
              {item.label}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={FAST_SPRING}
              className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-200 ${
                isOpen ? "bg-indigo-100" : "bg-slate-100/80"
              }`}
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-colors duration-200 ${
                  isOpen ? "text-indigo-600" : "text-slate-500"
                }`}
              />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: SMOOTH_EASE }}
                className="overflow-hidden"
              >
                <div className="mx-2 mb-2 space-y-0.5 rounded-xl border border-indigo-100/60 bg-indigo-50/40 p-1.5">
                  {item.dropdown?.map((sub) => {
                    const Icon = sub.icon;
                    return (
                      <a
                        key={sub.label}
                        href={sub.href}
                        onClick={onClick}
                        className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-white hover:shadow-sm"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 text-indigo-600 transition-all duration-200 group-hover:bg-indigo-600 group-hover:text-white">
                          <Icon className="h-3 w-3" />
                        </div>
                        <span className="text-[12px] font-medium text-slate-600 transition-colors duration-200 group-hover:text-slate-900">
                          {sub.label}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <a
          href={item.href}
          onClick={onClick}
          className="group flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-200 hover:bg-indigo-50/70"
        >
          <span className="text-[13.5px] font-semibold text-slate-700 transition-colors duration-200 group-hover:text-indigo-600">
            {item.label}
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 text-indigo-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
        </a>
      )}
    </motion.div>
  );
}

/* ───────────────────────── navbar ───────────────────────── */

export default function Navbar(): ReactNode {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const [scrollPct, setScrollPct] = useState(0);

  const navRef = useRef<HTMLElement | null>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setScrollPct(value);
  });

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent): void => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setMobileOpen(false);
        setMobileOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openMenu = useCallback((label: string): void => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(label);
  }, []);

  const closeMenu = useCallback((): void => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 100);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[100] h-[2.5px] origin-left bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
        style={{ scaleX: scrollPct }}
      />

      {/* Header */}
      <motion.header
        ref={navRef}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: SMOOTH_EASE }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8"
      >
        {/* ── Pill container ── */}
        <motion.div
          animate={{
            height: scrolled ? 54 : 66,
            backgroundColor:
              scrolled || mobileOpen
                ? "rgba(255, 255, 255, 0.98)"
                : "rgba(255, 255, 255, 0.90)",
            boxShadow: scrolled
              ? "0 8px 32px -4px rgba(99,102,241,0.14), 0 2px 12px -2px rgba(0,0,0,0.07), 0 0 0 1px rgba(99,102,241,0.07)"
              : "0 4px 24px rgba(99,102,241,0.07), 0 1px 8px rgba(0,0,0,0.05), 0 0 0 1px rgba(148,163,184,0.18)",
          }}
          transition={{ duration: 0.4, ease: SMOOTH_EASE }}
          className="relative mx-auto flex max-w-7xl items-center justify-between rounded-full border border-slate-200/70 px-4.5 backdrop-blur-2xl"
        >

          {/* ── Logo ── */}
          <Link href="/" className="group relative z-20 flex items-center gap-2 pl-0.5">
            <motion.div
              animate={{ scale: scrolled ? 0.92 : 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30" />
              <div className="relative flex h-8.5 w-8.5 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_6px_20px_rgba(99,102,241,0.38)]">
                <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative z-10 text-[11.5px] font-bold tracking-tight text-white">
                  E
                </span>
              </div>
            </motion.div>

            <div className="flex flex-col">
              <motion.span
                animate={{ fontSize: scrolled ? "14px" : "14.5px" }}
                className="font-bold tracking-tight text-slate-800 transition-colors duration-300 group-hover:text-indigo-600"
              >
                Expendesk
              </motion.span>
              <AnimatePresence>
                {!scrolled && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[7.5px] uppercase tracking-[0.25em] font-semibold text-indigo-500/70"
                  >
                    Intelligence
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => {
              const hasDropdown = Boolean(item.dropdown?.length);
              const isOpen = openDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => openMenu(item.label)}
                  onMouseLeave={closeMenu}
                >
                  {hasDropdown ? (
                    <button className="nav-underline-item group relative flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium text-slate-600 transition-colors duration-200 hover:text-indigo-600">
                      <span>{item.label}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={FAST_SPRING}
                      >
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-colors duration-200 group-hover:text-indigo-500" />
                      </motion.div>
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className="nav-underline-item group relative block rounded-full px-3.5 py-1.5 text-[12.5px] font-medium text-slate-600 transition-colors duration-200 hover:text-indigo-600"
                    >
                      <span>{item.label}</span>
                    </a>
                  )}

                  {hasDropdown && item.dropdown && (
                    <div
                      onMouseEnter={() => openMenu(item.label)}
                      onMouseLeave={closeMenu}
                    >
                      <NavDropdown items={item.dropdown} isOpen={isOpen} />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ── Desktop CTA ── */}
          <div className="hidden items-center md:flex pr-0.5">
            <motion.a
              whileHover={{ scale: 1.025, y: -0.5 }}
              whileTap={{ scale: 0.975 }}
              animate={{
                paddingTop: scrolled ? "6px" : "8px",
                paddingBottom: scrolled ? "6px" : "8px",
                fontSize: scrolled ? "12px" : "12.5px",
              }}
              transition={FAST_SPRING}
              href={navData.cta.href}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4.5 font-semibold text-white shadow-[0_6px_20px_rgba(99,102,241,0.32),0_2px_8px_rgba(139,92,246,0.18)]"
            >
              {/* Shimmer sweep */}
              <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center gap-1.5">
                {navData.cta.label}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </motion.a>
          </div>

          {/* ── Hamburger → Cross ── */}
          <button
            onClick={() => {
              setMobileOpen((prev) => !prev);
              setMobileOpenDropdown(null); // Clear open menus when closing container
            }}
            aria-label="Toggle menu"
            className="relative z-[90] flex h-8.5 w-8.5 items-center justify-center rounded-xl transition-all duration-300 md:hidden hover:bg-indigo-50"
          >
            <div className="relative flex h-3 w-4 flex-col justify-between">
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={TOGGLE_SPRING}
                className="h-[2px] w-4 origin-center rounded-full bg-slate-700"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="h-[2px] w-4 rounded-full bg-slate-700"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={TOGGLE_SPRING}
                className="h-[2px] w-4 origin-center rounded-full bg-slate-700"
              />
            </div>
          </button>

          {/* ── Mobile dropdown ── */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.22, ease: SMOOTH_EASE }}
                className="absolute right-1 top-[70px] z-50 w-full max-w-[270px] overflow-hidden rounded-[24px] border border-slate-200/70 bg-white p-2.5 shadow-[0_20px_50px_rgba(99,102,241,0.13),0_6px_20px_rgba(0,0,0,0.07)] md:hidden padding-x-400"
              >
                <div className="max-h-[55vh] space-y-0.5 overflow-y-auto pr-0.5">
                  {NAV_ITEMS.map((item, idx) => (
                    <MobileNavItem
                      key={item.label}
                      item={item}
                      idx={idx}
                      isOpen={mobileOpenDropdown === item.label}
                      onToggle={() =>
                        setMobileOpenDropdown((prev) =>
                          prev === item.label ? null : item.label
                        )
                      }
                      onClick={() => {
                        setMobileOpen(false);
                        setMobileOpenDropdown(null);
                      }}
                    />
                  ))}
                </div>

                <div className="mt-2.5 border-t border-slate-100 pt-2.5">
                  <motion.a
                    whileTap={{ scale: 0.98 }}
                    transition={FAST_SPRING}
                    href={navData.cta.href}
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileOpenDropdown(null);
                    }}
                    className="group relative flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-2.5 text-[12px] font-semibold text-white shadow-lg shadow-indigo-500/20"
                  >
                    <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative z-10">{navData.cta.label}</span>
                    <Sparkles className="relative z-10 h-3.5 w-3.5" />
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>

    </>
  );
}