/**
 * Copy for the /contact-us demo-booking page — one exported object per
 * section, consumed by the matching component in `../_components`.
 *
 * This page is **step 3 of the demo funnel**, not its entry point. Demo CTAs
 * across the site now go to /book-a-demo (the qualifying form); visitors reach
 * this calendar from the thank-you page that follows it, or directly if they
 * already have the link. General contact enquiries go to /contact-sales.
 *
 * It was previously the destination for every demo CTA, which asked a stranger
 * to pick a slot before anything had been established.
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
  /** Shown in the loading overlay while the widget boots. */
  loadingLabel: "Loading live calendar…",
} as const;

/** Small trust line under the calendar. */
export const bookingReassurance = [
  "30-minute session, tailored to you",
  "No credit card required",
  "No obligation, no pressure",
] as const;

/**
 * Alternative route under the trust line — visitors who aren't ready to pick
 * a slot can reach the contact form instead of bouncing.
 */
export const bookingAlternative = {
  label: "Not ready to book? Talk to a market specialist",
  href: "/contact-sales",
} as const;

/* ------------------------------------------------------------------ */
/* Below the calendar                                                  */
/* ------------------------------------------------------------------ */

/**
 * The sections below sit under the calendar rather than above it. Someone who
 * reached this page came to pick a time — the widget stays the first thing
 * they see, and the detail that reassures them is there if they scroll.
 */

export const calendarCover = {
  heading: "What You'll Cover",
  subheading: "In Your Demo, You'll Discover",
  items: [
    "How to automate employee expense claims",
    "How to reduce reimbursement turnaround time",
    "How to eliminate manual approval bottlenecks",
    "How to improve spend visibility across teams",
    "How Expendesk fits into your existing finance workflows",
    "Best practices tailored to your business",
  ],
} as const;

export const calendarAttendees = {
  heading: "Who Should Attend?",
  intro: "This session is ideal for:",
  items: [
    "Founders & Business Owners",
    "CFOs",
    "Finance Heads",
    "Finance Managers",
    "Operations Managers",
    "HR & Administration Teams",
  ],
} as const;

export const calendarClosing = {
  heading: "Looking Forward to Meeting You!",
  lines: [
    "Our goal isn't to give you a generic product tour.",
    "We'll understand your current expense management process, discuss your operational challenges, and demonstrate how Expendesk can help your business gain better control over expenses, reimbursements, and financial visibility.",
  ],
  footerNote: "30-Minute Session • Personalized Walkthrough • No Obligation",
} as const;
