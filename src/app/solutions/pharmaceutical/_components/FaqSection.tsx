/**
 * FaqSection — /solutions/pharmaceutical
 * ----------------------------------------------------------------
 * Renders the page's FAQ accordion AND emits the `FAQPage` JSON-LD, both from
 * the same `faq.items` array in ../_data/faq.ts.
 *
 * ── Why one source ──
 *
 * Google requires FAQ structured data to match answer text the visitor can
 * actually read. The SEO team supplied these six Q&As as markup only, for a
 * page that had no FAQ section at all — marking those up would have described
 * content that did not exist. Rendering and marking up from one array makes
 * that class of mismatch unrepresentable rather than merely discouraged.
 *
 * ── Why this is a server component with no client JS ──
 *
 * Every other section on this page is `'use client'` with Framer Motion and, in
 * two cases, GSAP. This one is deliberately plain: native `<details>`/`<summary>`
 * gives an accordion with zero JavaScript, correct keyboard behaviour and
 * built-in screen-reader semantics.
 *
 * That matters more than consistency here. The answers are the reason this
 * section exists — they are the text Google is asked to trust in the FAQPage
 * markup. Rendering them through a client component with a scroll-triggered
 * `opacity: 0` entrance, as the sibling sections do, makes the page's most
 * SEO-load-bearing copy dependent on hydration for no benefit. `<details>` keeps
 * every answer in the server HTML, collapsed visually but always present in the
 * DOM — which is exactly what Google's guidance on expandable FAQ content asks
 * for.
 */
import { faq } from "../_data";

/**
 * FAQPage payload, built from the rendered items.
 *
 * Note there is no `@id` and no `isPartOf`: `FAQPage` is a standalone node here
 * rather than part of the root layout's `@graph`, matching how the home page
 * emits its own. Angle brackets are escaped on the way out so no answer string
 * can terminate the script element early.
 */
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FaqSection() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#F7F6FD] to-white py-20 md:py-28"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(FAQ_JSON_LD).replace(/</g, "\\u003c"),
        }}
      />

      {/* Ambient brand blobs, matching the sibling sections' treatment. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-1/4 h-[22rem] w-[22rem] rounded-full bg-violet-400/10 blur-[100px]" />
        <div className="absolute -right-28 bottom-0 h-[18rem] w-[18rem] rounded-full bg-fuchsia-400/10 blur-[90px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block rounded-full bg-violet-100 px-4 py-1.5 text-[13px] font-semibold uppercase tracking-widest text-violet-600">
            {faq.badge}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {faq.heading.plain}{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              {faq.heading.accent}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
            {faq.subheading}
          </p>
        </div>

        <div className="space-y-3">
          {faq.items.map((item, index) => (
            <details
              key={item.id}
              id={item.id}
              // First entry open so the section never reads as an empty stack
              // of bars, and so at least one answer is visible without
              // interaction.
              open={index === 0}
              className="group rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm transition-colors open:border-violet-300 hover:border-violet-300"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-semibold">{item.question}</h3>
                {/* Rotating chevron, drawn inline so the section stays
                    dependency-free. `aria-hidden` because <summary> already
                    announces its own expanded/collapsed state. */}
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  className="h-5 w-5 shrink-0 text-violet-500 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 7.5 10 12.5 15 7.5" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
