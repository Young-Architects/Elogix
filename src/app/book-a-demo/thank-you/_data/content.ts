/**
 * Copy for /book-a-demo/thank-you — step 2 of the demo funnel.
 *
 * Reached by the GHL form's post-submit redirect (configured in GHL, not here —
 * see ../../_data/content.ts). From here the visitor either downloads the
 * resource or jumps straight to the booking calendar.
 *
 * ── One thing needs supplying ──
 *
 * `resource.downloadHref` points at the MSME lead magnet, which is the only
 * real PDF in `public/downloads/` (the other file there is an 812-byte
 * placeholder). The source document names the resource "The Expendesk™ Expense
 * Management Maturity Assessment" with a 25-point framework, and no such file
 * exists in the repo. The page needs a working download, so it links the best
 * available file rather than a 404 — but the title below promises a document
 * that has not been written. Either supply that PDF and repoint this constant,
 * or change the title to match what actually downloads.
 */

/** YouTube id of the product demo, same video used on the home page. */
export const THANK_YOU_VIDEO_ID = "ijrI2tlUtZo";

export const thankYouHero = {
  eyebrow: "You're all set",
  heading: "Welcome to Expendesk — You're All Set!",
  lines: [
    "Thank you for scheduling your demo.",
    "One of our product specialists will contact you shortly to confirm your session.",
    "While you're here, we've prepared a free resource to help you evaluate your current expense management process.",
  ],
  videoTitle: "Expendesk Product Demo Video",
} as const;

export const resource = {
  eyebrow: "Your complimentary resource",
  title: "The Expendesk™ Expense Management Maturity Assessment",
  description:
    "Discover how mature your current expense management process really is using our proprietary 25-point assessment framework.",
  insideHeading: "Inside you'll learn how to:",
  inside: [
    "Evaluate your current expense workflows",
    "Identify hidden operational inefficiencies",
    "Improve reimbursement processes",
    "Strengthen approval workflows",
    "Increase finance productivity",
    "Prepare your business for scalable growth",
  ],
  /** See the file header — this is the placeholder that needs replacing. */
  downloadHref: "/downloads/msme-lead-magnet.pdf",
  primaryCta: {
    heading: "Download Your Free Assessment",
    label: "Download Now",
  },
  dividerLabel: "or",
  secondaryCta: {
    heading: "Can't Wait to Speak With Our Team?",
    description: "Skip the wait and book a convenient time that works for you.",
    label: "Book My Demo Now",
    /** Step 3: the existing GHL booking calendar. */
    href: "/contact-us",
  },
} as const;
