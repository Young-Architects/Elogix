/**
 * ThankYouSection — the whole of /book-a-demo/thank-you.
 *
 * Layout follows the UX note in the source document: rather than a lone PDF
 * cover filling the middle of the page, the resource block is split into a
 * cover mockup on the left (40%) and "what's inside" plus both CTAs on the
 * right (60%). A cover image on its own gives a reader nothing to act on; the
 * split puts the reasons and the buttons side by side.
 *
 * Two exits, deliberately ranked. The download is primary because it is the
 * promise just made; "Book My Demo Now" is the secondary path for someone who
 * does not want to wait for a callback, separated by an "or" rather than
 * presented as an equal twin — two buttons of identical weight is how a page
 * ends up with neither being pressed.
 *
 * Server component apart from the video, which is its own client facade.
 */
import Link from "next/link";
import { ArrowRight, Check, Download, FileText } from "lucide-react";
import YouTubeFacade from "@/components/ui/YouTubeFacade";
import { resource, THANK_YOU_VIDEO_ID, thankYouHero } from "../_data/content";

export default function ThankYouSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-[#FAF9FF] to-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-20 h-[24rem] w-[24rem] rounded-full bg-indigo-400/10 blur-[110px]" />
        <div className="absolute -right-28 top-1/2 h-[20rem] w-[20rem] rounded-full bg-fuchsia-400/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
        {/* ── Confirmation ── */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-[13px] font-semibold uppercase tracking-widest text-emerald-700">
            <Check aria-hidden className="h-4 w-4" />
            {thankYouHero.eyebrow}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.14]">
            {thankYouHero.heading}
          </h1>
          <div className="mx-auto mt-5 max-w-2xl space-y-3">
            {thankYouHero.lines.map((line) => (
              <p key={line} className="text-[15px] leading-relaxed text-slate-600 sm:text-base">
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* ── Demo video ── */}
        <div className="mx-auto mt-10 max-w-3xl sm:mt-12">
          <YouTubeFacade
            videoId={THANK_YOU_VIDEO_ID}
            title={thankYouHero.videoTitle}
          />
        </div>

        {/* ── Resource ── */}
        <div className="mt-14 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_20px_48px_rgba(99,102,241,0.08)] backdrop-blur-sm sm:mt-16 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,40%)_minmax(0,60%)] lg:gap-10">
            {/* Left 40% — cover mockup.
                Drawn rather than an image file: there is no cover asset in the
                repo, and a wrong or stretched cover reads worse than a clean
                placeholder that states what the document is. Swap for the real
                cover when it exists. */}
            <div className="flex items-start justify-center lg:justify-start">
              <div className="relative w-full max-w-[260px]">
                {/* Offset back-sheet for depth */}
                <div
                  aria-hidden
                  className="absolute left-3 top-3 h-full w-full rounded-xl bg-gradient-to-br from-indigo-200/60 to-violet-200/60"
                />
                <div className="relative flex aspect-[3/4] w-full flex-col justify-between rounded-xl border border-slate-200 bg-gradient-to-br from-[#0f1535] via-[#1a1245] to-[#2a1550] p-5 shadow-xl">
                  <div>
                    <FileText aria-hidden className="h-7 w-7 text-violet-300" />
                    <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300">
                      Expendesk™
                    </p>
                    <p className="mt-2 text-[15px] font-bold leading-snug text-white">
                      Expense Management Maturity Assessment
                    </p>
                  </div>
                  <div>
                    <div
                      aria-hidden
                      className="h-1 w-12 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400"
                    />
                    <p className="mt-3 text-[11px] text-slate-400">
                      25-point framework
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 60% — what's inside + both CTAs */}
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-widest text-violet-600">
                {resource.eyebrow}
              </p>
              <h2 className="mt-2 text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl">
                {resource.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                {resource.description}
              </p>

              <p className="mt-6 text-[14px] font-bold text-slate-900">
                {resource.insideHeading}
              </p>
              <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {resource.inside.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check
                      aria-hidden
                      className="mt-[3px] h-4 w-4 shrink-0 text-violet-600"
                    />
                    <span className="text-[14px] leading-relaxed text-slate-600">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Primary CTA */}
              <div className="mt-8">
                <p className="text-[15px] font-bold text-slate-900">
                  {resource.primaryCta.heading}
                </p>
                <a
                  href={resource.downloadHref}
                  download
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(99,102,241,0.34)] transition-transform hover:scale-[1.02] active:scale-[0.99] sm:w-auto"
                >
                  <Download aria-hidden className="h-4 w-4" />
                  {resource.primaryCta.label}
                </a>
              </div>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4" aria-hidden>
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-[12px] font-semibold uppercase tracking-widest text-slate-400">
                  {resource.dividerLabel}
                </span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Secondary CTA → the booking calendar */}
              <div>
                <p className="text-[15px] font-bold text-slate-900">
                  {resource.secondaryCta.heading}
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-slate-600">
                  {resource.secondaryCta.description}
                </p>
                <Link
                  href={resource.secondaryCta.href}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-violet-300 bg-white px-7 py-3 text-[15px] font-bold text-violet-700 transition-colors hover:border-violet-400 hover:bg-violet-50 sm:w-auto"
                >
                  {resource.secondaryCta.label}
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
