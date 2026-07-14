/**
 * /contact-sales — the contact/lead-capture page, reached from the "Contact"
 * links in the navbar and footer. Leads are captured by the embedded GHL
 * "Contact Expendesk" form (demo bookings happen on /contact-us instead).
 *
 * Layout/copy structure matches the other marketing pages: components in
 * `./_components`, copy + embed config in `./_data/content.ts`.
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
