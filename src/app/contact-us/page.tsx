/**
 * /contact-us — the "Book a Demo" calendar page.
 *
 * Every demo CTA across the site (navbar "Book a Demo", hero, section CTAs,
 * pricing plans, footer) lands here, on the embedded GHL booking calendar
 * where visitors pick a date and time for their 45-minute walkthrough.
 *
 * General contact enquiries go to /contact-sales (the form page), which the
 * navbar/footer "Contact" links point at.
 *
 * Sections live in `./_components`, copy in `./_data/content.ts` — same
 * structure as the `solutions/*` pages.
 */
import type { Metadata } from "next";
import BookingCalendarSection from "./_components/BookingCalendarSection";

export const metadata: Metadata = {
  title: "Book a Demo",
  description:
    "Schedule your personalized Expendesk demo — a 45-minute session where a product specialist walks you through automating expense management for your business.",
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-white">
      <BookingCalendarSection />
    </main>
  );
}
