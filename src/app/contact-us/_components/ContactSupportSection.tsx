"use client";

/**
 * ContactSupportSection — secondary strip under the contact hero.
 *
 * Three low-commitment ways in (email, FAQs, resources) for visitors who
 * aren't ready to talk to sales or open the chat yet. Copy and links live in
 * ../_data/content.ts.
 */

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  HelpCircle,
  Mail,
  type LucideIcon,
} from "lucide-react";
import {
  contactSupport,
  type SupportLinkIconKey,
} from "../_data/content";

const SUPPORT_ICON_MAP: Record<SupportLinkIconKey, LucideIcon> = {
  mail: Mail,
  faq: HelpCircle,
  resources: BookOpen,
};

const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ContactSupportSection() {
  return (
    <section
      aria-labelledby="contact-support-heading"
      className="bg-white py-16 sm:py-20"
    >
      <motion.div
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto max-w-5xl px-6 lg:px-8"
      >
        <motion.h2
          id="contact-support-heading"
          variants={ITEM_VARIANTS}
          className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          {contactSupport.heading}
        </motion.h2>
        <motion.p
          variants={ITEM_VARIANTS}
          className="mx-auto mt-3 max-w-md text-center text-sm leading-relaxed text-slate-500"
        >
          {contactSupport.subheading}
        </motion.p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {contactSupport.links.map((link) => {
            const Icon = SUPPORT_ICON_MAP[link.iconKey];
            const isExternalScheme = link.href.startsWith("mailto:");

            const inner = (
              <>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:border-indigo-200">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mt-4 text-[15px] font-bold text-slate-900">
                  {link.title}
                </h3>
                <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-slate-500">
                  {link.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-indigo-600 transition-colors duration-200 group-hover:text-violet-600">
                  {link.ctaLabel}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </>
            );

            const cardClass =
              "group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_12px_32px_rgba(99,102,241,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2";

            return (
              <motion.div key={link.title} variants={ITEM_VARIANTS} className="h-full">
                {isExternalScheme ? (
                  <a href={link.href} className={cardClass}>
                    {inner}
                  </a>
                ) : (
                  <Link href={link.href} className={cardClass}>
                    {inner}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
