/**
 * /contact-sales — the sales lead-capture page, reached from the "Talk to
 * sales" card on /contact-us (mirrors the Spendesk contact-sales pattern).
 *
 * Layout/copy structure matches the other marketing pages: components in
 * `./_components`, copy + form options in `./_data/content.ts`.
 */
import type { Metadata } from "next";
import ContactSalesSection from "./_components/ContactSalesSection";

export const metadata: Metadata = {
  title: "Contact Sales",
  description:
    "Talk to an Expendesk market specialist — get your questions answered, see the platform live, and find the right plan for your business.",
};

export default function ContactSalesPage() {
  return (
    <main className="min-h-screen bg-white">
      <ContactSalesSection />
    </main>
  );
}
