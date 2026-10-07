/**
 * /contact-us — the booking calendar, **step 3 of the demo funnel**.
 *
 * Demo CTAs across the site now enter at /book-a-demo (the qualifying form);
 * visitors arrive here from the thank-you page that follows it, or directly if
 * they already hold the link. General contact enquiries go to /contact-sales.
 *
 * Two corrections were made when the funnel was wired up:
 *
 *  - The title was "Book a Demo", which is now also the title of /book-a-demo.
 *    Two pages competing on one title is a duplicate-title problem and makes
 *    the pair indistinguishable in a result list, so this one is "Schedule
 *    Your Demo" — which is what it actually does.
 *  - The description said **45-minute**. Every other mention of this session,
 *    on this page and throughout the new funnel copy, says **30-minute**. The
 *    same meeting cannot be two lengths; 30 is what the rest of the site and
 *    the source document say.
 *
 * Sections live in `./_components`, copy in `./_data/content.ts`.
 */
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import BookingCalendarSection from "./_components/BookingCalendarSection";
import CalendarDetailsSection from "./_components/CalendarDetailsSection";

// `pageMetadata` derives og:url from `path`, so it always matches the
// canonical. Declaring `alternates` alone left og:url inheriting the root
// layout's home-page URL — see lib/page-metadata.ts.
export const metadata: Metadata = pageMetadata({
  path: "/contact-us",
  title: "Schedule Your Demo",
  description:
    "Pick a date and time for your personalized Expendesk demo — a 30-minute session where a product specialist walks you through automating expense management.",
});

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-white">
      <BookingCalendarSection />
      <CalendarDetailsSection />
    </main>
  );
}
