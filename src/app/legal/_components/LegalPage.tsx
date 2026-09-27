/**
 * LegalPage — the shared shell for every /legal/* document.
 *
 * Takes a `LegalDocument` and renders the whole page: header band, prose
 * sections, and the closing contact panel. All six legal routes share this
 * component, so they cannot drift apart visually.
 *
 * ── Deliberately a server component with no client JS ──
 *
 * Every other marketing section on this site is `'use client'` with Framer
 * Motion entrance animation. Legal pages are not marketing. They are reference
 * documents people arrive at with a specific question — often on a slow
 * connection, sometimes with a screen reader — and fading paragraphs in on
 * scroll serves none of that. Rendering as plain HTML also means the full text
 * is in the server response, which matters for a page whose entire value is
 * being readable and indexable.
 *
 * ── Typography and responsiveness ──
 *
 * Spacing is set on the elements themselves rather than through a prose plugin;
 * the project has no typography plugin installed and adding one for six pages
 * would be a dependency for a page of paragraphs. Measure is capped at
 * `max-w-3xl` (~70 characters at this size), the readable range for long-form
 * body text.
 *
 * Every width is fluid. The only element that cannot simply reflow is the
 * cookie-categories table, which is handled explicitly — see `Block`.
 */
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import type {
  LegalBlock,
  LegalDocument,
  LegalRun,
} from "../_data/types";

/* ------------------------------------------------------------------ */
/* Inline runs                                                         */
/* ------------------------------------------------------------------ */

const LINK_CLASS =
  "font-medium text-violet-700 underline underline-offset-2 transition-colors hover:text-violet-900";

/**
 * Render one paragraph's runs. Strings pass through as text; objects become
 * links and/or bold, routed through `next/link` when internal so client-side
 * navigation still applies.
 */
function Runs({ content }: { content: LegalRun[] }) {
  return (
    <>
      {content.map((run, i) => {
        if (typeof run === "string") return <span key={i}>{run}</span>;

        if (!run.href) {
          return (
            <strong key={i} className="font-semibold text-slate-800">
              {run.text}
            </strong>
          );
        }

        const className = run.bold ? `${LINK_CLASS} font-semibold` : LINK_CLASS;

        return run.external ? (
          <a
            key={i}
            href={run.href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {run.text}
          </a>
        ) : (
          <Link key={i} href={run.href} className={className}>
            {run.text}
          </Link>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

const BODY_CLASS =
  "text-[15px] leading-[1.75] text-slate-600 sm:text-base";

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "h3":
      return (
        <h3 className="mt-8 text-base font-bold text-slate-900 sm:text-lg">
          {block.text}
        </h3>
      );

    case "list":
      return (
        <ul className="mt-4 space-y-2.5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className={`relative pl-5 ${BODY_CLASS}`}>
              <span
                aria-hidden
                className="absolute left-0 top-[0.65em] h-1.5 w-1.5 rounded-full bg-violet-400"
              />
              <Runs content={item} />
            </li>
          ))}
        </ul>
      );

    case "definitions":
      return (
        <dl className="mt-4 space-y-3">
          {block.items.map((item) => (
            <div key={item.term} className="sm:flex sm:gap-3">
              <dt className="text-[15px] font-semibold text-slate-800 sm:min-w-[7.5rem] sm:shrink-0 sm:text-base">
                {item.term}
              </dt>
              <dd className={BODY_CLASS}>
                <Runs content={item.description} />
              </dd>
            </div>
          ))}
        </dl>
      );

    /**
     * The cookie-categories table.
     *
     * Two renderings of the same data, swapped at `sm`, because a four-column
     * table of sentences cannot be made legible on a 360px screen by any amount
     * of squeezing:
     *
     *  - Below `sm`: stacked cards, one per row, each cell labelled with its
     *    column header. This is the only honest way to show tabular data on a
     *    phone without a horizontal scroll trap.
     *  - At `sm` and up: a real `<table>`, wrapped in its own `overflow-x-auto`
     *    so that if it ever does exceed its container it scrolls itself rather
     *    than making the whole page scroll sideways.
     *
     * The mobile cards are `aria-hidden` and the table carries the real
     * semantics, so a screen reader always gets one properly structured table
     * rather than the content twice.
     */
    case "table":
      return (
        <div className="mt-6">
          {/* Mobile: stacked cards */}
          <div aria-hidden className="space-y-4 sm:hidden">
            {block.rows.map((row, r) => (
              <div
                key={r}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                {row.map((cell, c) => (
                  <div key={c} className={c > 0 ? "mt-3" : undefined}>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {block.headers[c]}
                    </div>
                    <div className="mt-0.5 text-[14px] leading-[1.6] text-slate-700">
                      {cell}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* sm and up: the real table */}
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full border-collapse text-left text-[14px] leading-[1.6]">
              {block.caption ? (
                <caption className="sr-only">{block.caption}</caption>
              ) : null}
              <thead>
                <tr className="border-b border-slate-300">
                  {block.headers.map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="py-2.5 pr-4 align-bottom font-semibold text-slate-800 last:pr-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r} className="border-b border-slate-200 last:border-0">
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className={`py-3 pr-4 align-top last:pr-0 ${
                          c === 0
                            ? "font-semibold text-slate-800"
                            : "text-slate-600"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "p":
    default:
      return (
        <p className={`mt-4 ${BODY_CLASS}`}>
          <Runs content={block.content} />
        </p>
      );
  }
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LegalPage({ doc }: { doc: LegalDocument }) {
  // Rendered from the ISO date so the visible line and the machine-readable
  // attribute can never disagree. en-GB gives "21 September 2026" — unambiguous
  // internationally, unlike a numeric date where 09/21 and 21/09 both parse.
  const updatedLabel = new Date(`${doc.lastUpdated}T00:00:00Z`).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
  );

  return (
    <main className="min-h-screen bg-white">
      {/* ── Header band ──
          pt-28 clears the fixed navbar (pt-3 + a ~60px pill ≈ 72px) with room
          to spare; the band is intentionally shorter than a marketing hero
          because the document itself is the point. */}
      <section className="bg-gradient-to-b from-violet-50 to-white px-6 pb-12 pt-28 sm:pb-14 sm:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-violet-100 px-4 py-1.5 text-[13px] font-semibold uppercase tracking-widest text-violet-600">
            {doc.eyebrow}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {doc.title}
          </h1>
          <p className="mt-4 text-sm text-slate-500">
            Last updated{" "}
            <time dateTime={doc.lastUpdated} className="font-medium text-slate-600">
              {updatedLabel}
            </time>
          </p>
        </div>
      </section>

      {/* ── Document ── */}
      <article className="mx-auto max-w-3xl px-6 pb-20 sm:pb-24">
        {doc.intro.map((block, i) => (
          <Block key={i} block={block} />
        ))}

        {doc.sections.map((section) => (
          <section key={section.id} className="mt-12">
            {/* scroll-mt-28 keeps the fixed navbar from covering a heading when
                someone lands on a #fragment link to it. */}
            <h2
              id={section.id}
              className="scroll-mt-28 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
            >
              {section.heading}
            </h2>
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </section>
        ))}

        {/* ── Contact panel ── */}
        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
          <h2
            id="contacting-us"
            className="scroll-mt-28 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl"
          >
            {doc.contact.heading ?? "Contacting us"}
          </h2>
          <p className={`mt-4 ${BODY_CLASS}`}>{doc.contact.intro}</p>

          <p className="mt-5 text-[15px] font-semibold text-slate-800">
            {doc.contact.attribution}
          </p>

          <dl className="mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <Mail aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
              <div>
                <dt className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </dt>
                <dd className="mt-0.5 text-[15px] text-slate-700">
                  {/* break-all so a long address cannot push the panel wider
                      than a narrow screen. */}
                  <a
                    href={`mailto:${doc.contact.email}`}
                    className={`${LINK_CLASS} break-all`}
                  >
                    {doc.contact.email}
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
              <div>
                <dt className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                  Mailing address
                </dt>
                {/* <address> is the correct element for contact details and is
                    italic by default in every browser — not-italic resets it. */}
                <dd className="mt-0.5">
                  <address className="not-italic text-[15px] leading-[1.7] text-slate-700">
                    {doc.contact.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </dd>
              </div>
            </div>
          </dl>

          {doc.contact.outro ? (
            <p className={`mt-5 ${BODY_CLASS}`}>{doc.contact.outro}</p>
          ) : null}

          <Link
            href={doc.contact.pageHref}
            className="mt-7 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_28px_rgba(99,102,241,0.32)] transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            {doc.contact.pageLabel}
          </Link>
        </section>
      </article>
    </main>
  );
}
