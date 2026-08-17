/**
 * /about — the brand entity page.
 *
 * ── Why this route exists ──
 *
 * Searching "expendesk" on Google returns "Did you mean: spendesk" and this
 * site does not appear. `docs/SEO.md` covers the technical half of that problem
 * (canonical domain, sitemap, entity JSON-LD), all of which is already fixed
 * and live. What remained missing was simpler: the site had no page whose
 * *subject* is the brand.
 *
 * Every existing page sells the product to someone who already knows the name.
 * None of them answers "what is Expendesk?" — so there was nothing for Google
 * to rank against a query that is only the brand name, and nothing for an AI
 * overview or featured snippet to quote. This page is that answer, and it is
 * the on-page counterpart to the `Organization` graph in the root layout: the
 * same claims, in prose, on a page a human can read.
 *
 * Rendered as a plain server component — no client JS, no scroll-triggered
 * animation. That is deliberate. The rest of the site initialises most content
 * at `opacity: 0` and fades it in on hydration; it works, but on the one page
 * whose entire job is to be read by a crawler, text that requires JavaScript to
 * become visible is a risk with no upside.
 */
import type { Metadata } from "next";
import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";
import {
  breadcrumbStructuredData,
  webPageStructuredData,
  jsonLd,
} from "@/lib/structured-data";
import { PARENT_ORGANIZATION, SITE_NAME } from "@/lib/site";
import footerData from "@/data/footer.json";
import { content } from "./_data/content";

/**
 * The title leads with the brand as a bare noun — "About Expendesk" — and the
 * root layout's template appends the brand again, giving
 * "About Expendesk — Expendesk". That repetition is usually a mistake and is
 * called out as one in docs/SEO.md; here it is the point. The exact string
 * needs to appear in the one element Google weights most heavily for a
 * navigational query.
 *
 * The description is written to work as a SERP snippet on its own: it defines
 * the term and names the parent company inside the ~155 characters that
 * actually render.
 */
export const metadata: Metadata = {
  title: "About Expendesk",
  description:
    "Expendesk is an expense and reimbursement management platform for finance teams, built by Elogix Software Pvt. Ltd. Learn what Expendesk is and who it is for.",
  alternates: { canonical: "/about" },
  // `openGraph` is replaced wholesale rather than merged when a page declares
  // it, so `siteName` and `locale` are repeated here — omitting them would drop
  // them from this page's tags rather than inherit the layout's.
  openGraph: {
    title: "About Expendesk — Expense Management Software by Elogix Software",
    description:
      "What Expendesk is, who builds it, and who it is for. An expense and reimbursement management platform for SMEs and mid-market finance teams.",
    url: "/about",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
};

export default function AboutPage() {
  const socials = footerData.socials;

  return (
    <main className="min-h-screen bg-white">
      {/* AboutPage + BreadcrumbList. `about`/`mainEntity` both point at the
          Organization node declared in the root layout, which is what states
          that this page's subject *is* the company called Expendesk. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            webPageStructuredData({
              path: "/about",
              name: "About Expendesk",
              description: content.definition,
              type: "AboutPage",
              about: "organization",
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbStructuredData([{ name: "About", path: "/about" }])
          ),
        }}
      />

      {/* ── Definition ───────────────────────────────────────────────────
          H1 and first paragraph both contain the exact brand string. */}
      <section className="flex flex-col items-center justify-center px-6 py-28 text-center bg-gradient-to-b from-violet-50 to-white">
        <span className="mb-4 inline-block rounded-full bg-violet-100 px-4 py-1.5 text-[14px] font-semibold uppercase tracking-widest text-violet-600">
          {content.eyebrow}
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {content.headline.pre}{" "}
          <span className="text-violet-600">{content.headline.accent}</span>
          {content.headline.post}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          {content.definition}
        </p>
      </section>

      {/* ── Name + maker ─────────────────────────────────────────────────
          The outbound link to the parent company is the load-bearing element
          of this page. It is a plain, followed <a> on purpose: a crawler
          following it lands on a 25-year-old indexed domain, which is what
          turns "Elogix builds Expendesk" from an unverifiable string into a
          checkable claim. Do not add rel="nofollow" here. */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              {content.spelling.heading}
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              {content.spelling.body}
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              {content.maker.heading}
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              {content.maker.body}
            </p>
            <a
              href={PARENT_ORGANIZATION.url}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-block text-sm font-semibold text-violet-600 underline underline-offset-4 hover:text-violet-700"
            >
              {content.maker.linkLabel} →
            </a>
          </div>
        </div>
      </section>

      {/* ── Audience ─────────────────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            {content.built.heading}
          </h2>
          <p className="text-base leading-relaxed text-slate-600">
            {content.built.body}
          </p>
        </div>
      </section>

      {/* ── Capabilities ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">
          {content.capabilities.heading}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.capabilities.items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-2 text-base font-semibold text-slate-800">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Official channels ────────────────────────────────────────────
          The same URLs the Organization schema emits as `sameAs`, rendered as
          real links. Structured data corroborated by visible links on the page
          is stronger than structured data alone — and these are read from the
          same footer.json the schema reads, so the two can never disagree. */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            {content.connect.heading}
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            {content.connect.body}
          </p>
          <ul className="flex flex-wrap gap-3">
            {socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener"
                  className="inline-block rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-violet-400 hover:text-violet-700"
                >
                  Expendesk on {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          {content.cta.heading}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-slate-600">
          {content.cta.body}
        </p>
        <MagneticButton
          href={content.cta.href}
          variant="primary"
          className="mt-8 rounded-full px-7 py-3 shadow-lg shadow-violet-500/30"
        >
          {content.cta.label}
        </MagneticButton>
        <p className="mt-6 text-sm text-slate-500">
          Or see{" "}
          <Link
            href="/pricing"
            className="font-semibold text-violet-600 underline underline-offset-4"
          >
            Expendesk pricing
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
