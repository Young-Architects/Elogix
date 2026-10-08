/**
 * DemoFormSection — the whole of /book-a-demo.
 *
 * Two columns from `lg`: qualifying copy on the left, the GHL intent form on
 * the right. Below `lg` they stack, and the **form comes first** — someone who
 * arrived from a "Book a Demo" button has already decided, and on a phone the
 * supporting copy would otherwise push the form a full screen down. The copy
 * is still there for anyone who wants it, just underneath.
 *
 * `order-*` does that without duplicating markup, so the form exists once in
 * the DOM and the reading order stays sensible for assistive tech: heading,
 * form, then the detail that supports it.
 *
 * Server component — the only interactive part is the embed itself, which is
 * its own client component.
 */
import { Check } from "lucide-react";
import GhlFormEmbed from "@/components/ui/GhlFormEmbed";
import {
  demoAudience,
  demoFormEmbed,
  demoFormPanel,
  demoHero,
  demoLearn,
  demoLoved,
  demoSteps,
} from "../_data/content";

/** Reused for the three check-list blocks in the left column. */
function CheckList({
  items,
  columns = 1,
}: {
  items: readonly string[];
  columns?: 1 | 2;
}) {
  return (
    <ul
      className={`mt-4 grid gap-x-6 gap-y-2.5 ${
        columns === 2 ? "sm:grid-cols-2" : "grid-cols-1"
      }`}
    >
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <Check
            aria-hidden
            className="mt-[3px] h-4 w-4 shrink-0 text-violet-600"
          />
          <span className="text-[15px] leading-relaxed text-slate-600">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function DemoFormSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-[#FAF9FF] to-white">
      {/* Ambient brand glows, matching the other marketing sections. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-28 top-24 h-[24rem] w-[24rem] rounded-full bg-indigo-400/10 blur-[110px]" />
        <div className="absolute -right-28 top-1/2 h-[20rem] w-[20rem] rounded-full bg-fuchsia-400/10 blur-[100px]" />
      </div>

      {/* pt-28 clears the fixed navbar (pt-3 + a ~60px pill ≈ 72px). */}
      {/* Vertical rhythm here is tuned so the form is visible on first paint
          rather than a scroll away: the fixed navbar, the h1 and the subheading
          are all that sit above it. pt-24 is the floor — the navbar is pt-3
          plus a ~60px pill ≈ 72px, so anything less lets the heading touch it. */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-24 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8">
        {/* ── Page heading ──
            No eyebrow badge. On a page reached by clicking "Book a Demo" it
            only restated the h1, and it cost ~48px at the top of the fold. */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            {demoHero.heading}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
            {demoHero.subheading}
          </p>
        </div>

        <div className="mt-8 grid items-start gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,500px)]">
          {/* ── Right column on desktop, FIRST on mobile ── */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-28">
            <div className="mb-4 text-center lg:text-left">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {demoFormPanel.heading}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                {demoFormPanel.description}
              </p>
            </div>

            {/* Crop numbers, and why the bottom one is cautious.
                GhlFormEmbed adds HEIGHT_BUFFER_PX (60) to the height the embed
                script reports, so the *net* bottom crop is (margin − 60):
                -mb-[100px] hides 40px.

                This form's dead space below the submit button is smaller than
                the /contact-sales form's, and the value copied from there
                (-mb-[148px], a 88px net crop) ate into the "Submit Form"
                button. The two numbers are not transferable between forms —
                each GHL form bakes in its own padding.

                The risk here is asymmetric: crop too little and there is a
                little whitespace under the button; crop too much and the
                primary CTA is sliced in half. 40px sits comfortably inside the
                measured gap. If a visible gap remains, raise this number in
                small steps and check the button is still whole — never the
                reverse. */}
            <GhlFormEmbed
              embed={demoFormEmbed}
              cropClassName="-mt-[40px] -mr-[30px] -mb-[100px]"
            />

            <p className="mt-4 text-center text-[13px] font-medium text-slate-500">
              {demoFormPanel.reassurance}
            </p>
          </div>

          {/* ── Left column on desktop, below the form on mobile ── */}
          <div className="order-2 space-y-10 lg:order-1">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {demoLearn.heading}
              </h2>
              <CheckList items={demoLearn.items} />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {demoAudience.heading}
              </h2>
              <p className="mt-3 text-[15px] text-slate-600">
                {demoAudience.intro}
              </p>
              <CheckList items={demoAudience.items} columns={2} />
            </div>

            {/* ── What happens next ──
                A numbered rail rather than four cards: it is a sequence, and a
                grid of equal cards would read as four unrelated options. */}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {demoSteps.heading}
              </h2>
              <ol className="mt-5 space-y-5">
                {demoSteps.steps.map((step, i) => (
                  <li key={step.label} className="relative flex gap-4">
                    {/* Connector line, skipped on the last item. */}
                    {i < demoSteps.steps.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[15px] top-9 h-[calc(100%-4px)] w-px bg-gradient-to-b from-violet-300 to-violet-100"
                      />
                    )}
                    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[13px] font-bold text-white shadow-[0_4px_12px_rgba(99,102,241,0.35)]">
                      {i + 1}
                    </span>
                    <div className="pt-0.5">
                      <p className="text-[14px] font-bold text-slate-900">
                        {step.label}
                      </p>
                      <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 backdrop-blur-sm sm:p-7">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                {demoLoved.heading}
              </h2>
              <CheckList items={demoLoved.items} columns={2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
