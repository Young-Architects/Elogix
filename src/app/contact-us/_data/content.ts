/**
 * Copy for the /contact-us demo-booking page — one exported object per
 * section, consumed by the matching component in `../_components`.
 *
 * This page is the "Book a Demo" destination: every demo CTA across the site
 * lands here, on the GHL booking calendar. General contact enquiries go to
 * /contact-sales (the form page) instead.
 */

/* ------------------------------------------------------------------ */
/* Hero + calendar                                                     */
/* ------------------------------------------------------------------ */

export const bookingHero = {
  eyebrow: "Book a demo",
  heading: {
    lead: "Schedule your personalized ",
    accent: "Expendesk demo",
  },
  subheading: "Choose a date and time that works best for you.",
  description:
    "During this 30-minute session, one of our product specialists will walk you through how Expendesk can help automate expense management, streamline approvals, and improve visibility into your business spending.",
} as const;

/** GHL booking-calendar embed config (LeadConnector widget). */
export const bookingCalendar = {
  src: "https://link.youngarchitects.in/widget/booking/atLJxFrgGiAVgeECFMpV",
  iframeId: "atLJxFrgGiAVgeECFMpV_1784055561258",
  embedScriptSrc: "https://link.youngarchitects.in/js/form_embed.js",
  title: "Schedule your Expendesk demo",
} as const;

/** Small trust line under the calendar. */
export const bookingReassurance = [
  "30-minute session, tailored to you",
  "No credit card required",
  "No obligation, no pressure",
] as const;
