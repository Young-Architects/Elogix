/**
 * /contact-us — the contact hub.
 *
 * Two routing cards (mirroring the Spendesk contact pattern, minus Support):
 *   - Sales           → /contact-sales (form page)
 *   - General queries → opens the floating Expendesk AI chat
 *
 * Sections live in `./_components`, copy in `./_data/content.ts` — same
 * structure as the `solutions/*` pages.
 */
import type { Metadata } from "next";
import ContactHeroSection from "./_components/ContactHeroSection";
import ContactSupportSection from "./_components/ContactSupportSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to an Expendesk expense management expert — reach our sales team or get instant answers from our AI assistant.",
};

export default function ContactUsPage() {
  return (
    <main className="min-h-screen bg-white">
      <ContactHeroSection />
      <ContactSupportSection />
    </main>
  );
}
