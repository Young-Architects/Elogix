"use client";

/**
 * ContactHeroSection — the /contact-us centrepiece.
 *
 * Centered heading block (eyebrow pill → H1 with gradient accent → sub copy)
 * followed by the two routing cards:
 *   - "Talk to sales"  → client navigation to /contact-sales
 *   - "Chat with us"   → opens the floating Expendesk AI chat (ChatProvider)
 *
 * The whole section is one visual unit on the same soft violet canvas used by
 * the solutions heroes, so Contact feels native to the rest of the site.
 * Copy lives in ../_data/content.ts; this file is presentation + wiring only.
 */

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BarChart2,
  CheckCircle2,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { useChat } from "@/components/chat/ChatProvider";
import {
  contactChannels,
  contactHero,
  contactReassurance,
  type ContactChannelCard,
  type ContactChannelIconKey,
} from "../_data/content";

const CHANNEL_ICON_MAP: Record<ContactChannelIconKey, LucideIcon> = {
  sales: BarChart2,
  chat: MessageCircle,
};

/* ------------------------------------------------------------------ */
/* Entrance choreography                                               */
/* ------------------------------------------------------------------ */

const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ------------------------------------------------------------------ */
/* Channel card                                                        */
/* ------------------------------------------------------------------ */

function ChannelCard({ card }: { card: ContactChannelCard }) {
  const { setOpen } = useChat();
  const Icon = CHANNEL_ICON_MAP[card.iconKey];

  const inner = (
    <>
      {/* Gradient hairline that fades in along the top edge on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-6 top-0 h-[2.5px] rounded-b-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <span className="inline-flex w-fit items-center rounded-full border border-indigo-100 bg-indigo-50/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-500">
        {card.eyebrow}
      </span>

      <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_8px_24px_rgba(99,102,241,0.32)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
        <Icon className="h-5.5 w-5.5" />
      </div>

      <h2 className="mt-4 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
        {card.title}
      </h2>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
        {card.description}
      </p>

      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors duration-200 group-hover:text-violet-600">
        {card.ctaLabel}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </>
  );

  const cardClass =
    "group relative flex h-full w-full flex-col rounded-3xl border border-slate-200/80 bg-white p-7 text-left shadow-[0_4px_24px_rgba(99,102,241,0.06),0_1px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_20px_48px_rgba(99,102,241,0.14),0_6px_20px_rgba(0,0,0,0.05)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 sm:p-8";

  return (
    <motion.div variants={ITEM_VARIANTS} className="h-full">
      {card.action.type === "link" ? (
        <Link href={card.action.href} className={cardClass}>
          {inner}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-controls="chat-panel"
          className={cardClass}
        >
          {inner}
        </button>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function ContactHeroSection() {
  return (
    <section
      aria-labelledby="contact-hero-heading"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(155deg,#F5F3FF 0%,#FAFAFF 45%,#EDE9FE 100%)",
      }}
    >
      {/* Ambient background glows (static — no scroll cost) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 15% 20%, rgba(99,102,241,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 88% 75%, rgba(217,70,239,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
        className="relative mx-auto flex min-h-[calc(100svh-0px)] max-w-5xl flex-col items-center justify-center px-6 pb-16 pt-32 text-center sm:pb-20 sm:pt-36 lg:px-8"
      >
        <motion.span
          variants={ITEM_VARIANTS}
          className="inline-flex items-center rounded-full border border-indigo-200/70 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-500 shadow-sm backdrop-blur-sm"
        >
          {contactHero.eyebrow}
        </motion.span>

        <motion.h1
          id="contact-hero-heading"
          variants={ITEM_VARIANTS}
          className="mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
        >
          {contactHero.heading.lead}
          <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            {contactHero.heading.accent}
          </span>
          {contactHero.heading.tail}
        </motion.h1>

        <motion.p
          variants={ITEM_VARIANTS}
          className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-slate-500 sm:text-base"
        >
          {contactHero.subheading}
        </motion.p>

        {/* Channel cards — stacked on mobile, side-by-side from sm up */}
        <div className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          {contactChannels.map((card) => (
            <ChannelCard key={card.title} card={card} />
          ))}
        </div>

        {/* Reassurance row */}
        <motion.ul
          variants={ITEM_VARIANTS}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5"
        >
          {contactReassurance.map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 sm:text-[13px]"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
              {item}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
