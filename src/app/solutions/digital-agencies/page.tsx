/**
 * /solutions/digital-agencies — static, SEO-focused industry landing page.
 *
 * One of three sibling pages under `solutions/` (manufacturing, pharmaceutical,
 * digital-agencies), linked from the Navbar "Solutions" dropdown. Copy lives in
 * `./_data/content.ts`. Prerendered as static HTML at build.
 *
 * The "Book a Demo" CTA points at `/contact-us` (the demo booking calendar).
 */
import type { Metadata } from "next";
import MagneticButton from "@/components/ui/MagneticButton";
import ComingSoonSection from "@/components/ui/ComingSoonSection";
import { content } from "./_data/content";

export const metadata: Metadata = {
  title: "Expense Management for Digital Agencies | Expendesk",
  description:
    "Track project budgets and client billing with precision. Expense management built for digital agencies and creative teams.",
};

export default function DigitalAgenciesSolutionPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-32 text-center bg-gradient-to-b from-fuchsia-50 to-white">
        <span className="mb-4 inline-block rounded-full bg-fuchsia-100 px-4 py-1.5 text-[14px] font-semibold uppercase tracking-widest text-fuchsia-600">
          {content.eyebrow}
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {content.headline.pre}{" "}
          <span className="text-fuchsia-600">{content.headline.accent}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          {content.description}
        </p>
        <MagneticButton
          href={content.cta.href}
          variant="primary"
          className="mt-8 rounded-full px-7 py-3 shadow-lg shadow-fuchsia-500/30"
        >
          {content.cta.label}
        </MagneticButton>
      </section>

      {/* Placeholder for the full industry deep-dive (still being built) */}
      <ComingSoonSection
        title={content.comingSoon.title}
        message={content.comingSoon.message}
      />

      {/* Key benefits */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-800">
          {content.benefits.heading}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {content.benefits.items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-2 text-base font-semibold text-slate-800">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
