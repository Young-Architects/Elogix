"use client";

/**
 * ComingSoon — shared placeholder page body for routes that are linked in the
 * nav/footer but not built out yet (e.g. Resources → Whitepapers / Case Studies,
 * and the /solutions + /resources hub indexes).
 *
 * It renders the full page `<main>` (the persistent Navbar + Footer come from the
 * root layout), matching the site's light gradient / dot-grid aesthetic. Page
 * copy (eyebrow/title/message) is passed in as props by the thin route page
 * that uses it (from the route's `_data/content.ts`); the shared badge + CTA
 * copy lives in `src/data/coming-soon.json` — nothing is hardcoded here.
 */

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Clock, ArrowLeft } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import comingSoonData from "@/data/coming-soon.json";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ComingSoon({
  eyebrow,
  title,
  message,
}: {
  eyebrow: string;
  title: string;
  message: string;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f8f9ff] via-[#f1f3fe] to-[#eceef8]">
      {/* Masked dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(124,58,237,0.14) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 55% at 50% 35%, #000 10%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 55% at 50% 35%, #000 10%, transparent 70%)",
        }}
      />
      {/* Ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-1/4 h-[26rem] w-[26rem] rounded-full bg-violet-400/10 blur-[100px]" />
        <div className="absolute -right-24 bottom-1/4 h-[22rem] w-[22rem] rounded-full bg-fuchsia-400/10 blur-[90px]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 pb-20 pt-32 text-center sm:pt-36 lg:px-8">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="mb-4 text-[11px] font-bold uppercase tracking-[0.28em] text-violet-500"
        >
          {eyebrow}
        </motion.p>

        {/* Coming Soon badge with pulsing rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative mb-8 inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-white/70 px-4 py-1.5 shadow-sm backdrop-blur-md"
        >
          {[0, 1].map((n) => (
            <motion.span
              key={n}
              aria-hidden
              className="absolute inset-0 rounded-full border border-violet-300/40"
              animate={{ scale: [1, 1.35 + n * 0.15], opacity: [0.4 - n * 0.15, 0] }}
              transition={{ repeat: Infinity, duration: 2.6 + n * 0.4, delay: n * 0.4, ease: "easeOut" }}
            />
          ))}
          <Clock className="h-3.5 w-3.5 text-violet-600" />
          <span className="text-xs font-bold tracking-wide text-violet-800">
            {comingSoonData.badge}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6, ease: EASE }}
          className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
            {title}
          </span>
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.55, ease: EASE }}
          className="mx-auto mt-5 max-w-lg text-base font-medium leading-relaxed text-slate-600 sm:text-[17px]"
        >
          {message}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.55, ease: EASE }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <MagneticButton
            href={comingSoonData.primaryCta.href}
            variant="primary"
            className="rounded-full px-7 py-3.5 text-sm shadow-lg shadow-violet-300/40"
            icon={<Sparkles className="h-4 w-4" />}
          >
            {comingSoonData.primaryCta.label}
          </MagneticButton>
          <Link
            href={comingSoonData.secondaryCta.href}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition-colors hover:border-violet-300 hover:text-violet-600"
          >
            <ArrowLeft className="h-4 w-4" />
            {comingSoonData.secondaryCta.label}
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
