/**
 * CalendarDetailsSection — the supporting copy beneath the booking calendar
 * on /contact-us (step 3 of the demo funnel).
 *
 * Deliberately below the widget. Someone on this page came to pick a time; the
 * calendar stays the first thing they see, and this is what answers "what am I
 * actually signing up for" if they hesitate and scroll.
 *
 * Server component — nothing here is interactive.
 */
import { Check } from "lucide-react";
import {
  calendarAttendees,
  calendarClosing,
  calendarCover,
} from "../_data/content";

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <Check aria-hidden className="mt-[3px] h-4 w-4 shrink-0 text-violet-600" />
          <span className="text-[15px] leading-relaxed text-slate-600">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function CalendarDetailsSection() {
  return (
    <section className="bg-white px-5 pb-20 sm:px-6 sm:pb-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="grid gap-10 sm:gap-12">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {calendarCover.heading}
            </h2>
            <p className="mt-3 text-[15px] font-semibold text-slate-700">
              {calendarCover.subheading}
            </p>
            <CheckList items={calendarCover.items} />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {calendarAttendees.heading}
            </h2>
            <p className="mt-3 text-[15px] text-slate-600">
              {calendarAttendees.intro}
            </p>
            <CheckList items={calendarAttendees.items} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-violet-50/70 to-white p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {calendarClosing.heading}
            </h2>
            <div className="mt-4 space-y-3">
              {calendarClosing.lines.map((line) => (
                <p
                  key={line}
                  className="text-[15px] leading-relaxed text-slate-600"
                >
                  {line}
                </p>
              ))}
            </div>
            <p className="mt-6 border-t border-slate-200 pt-5 text-center text-[13px] font-bold tracking-wide text-slate-700">
              {calendarClosing.footerNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
