/**
 * Copy for /book-a-demo — step 1 of the demo funnel.
 *
 * ── The funnel ──
 *
 *   /book-a-demo              this page: qualifying copy + GHL intent form
 *        ↓ (form submit, redirect configured in GHL — see below)
 *   /book-a-demo/thank-you    confirmation + the free resource + two CTAs
 *        ↓ ("Book My Demo Now")
 *   /contact-us               the existing GHL booking calendar
 *
 * Every "Book a Demo" CTA on the site now enters at step 1. They previously
 * went straight to the calendar, which asked a stranger to pick a slot before
 * anything had been established; the form qualifies first and the calendar
 * becomes the step someone takes once they have decided.
 *
 * ── Handoff: the redirect is NOT set here ──
 *
 * Where a GHL form goes after submit is configured inside GHL, not in this
 * codebase. The form's "On submit → Redirect to URL" must be pointed at
 * https://www.expendesk.com/book-a-demo/thank-you or the funnel stops at step
 * one and the thank-you page is unreachable.
 */
import type { GhlFormEmbedConfig } from "@/components/ui/GhlFormEmbed";

/* ------------------------------------------------------------------ */
/* Left panel                                                          */
/* ------------------------------------------------------------------ */

export const demoHero = {
  heading: "Book a Personalized Demo",
  subheading:
    "See How Expendesk Can Simplify Expense Management for Your Business",
} as const;

export const demoLearn = {
  heading: "What You'll Learn During the Demo",
  items: [
    "How to automate employee expense claims",
    "How to reduce reimbursement turnaround time",
    "How to eliminate manual approval bottlenecks",
    "How to gain real-time visibility into company spending",
    "How to improve finance productivity and policy compliance",
    "Best practices tailored to your business workflows",
  ],
} as const;

export const demoAudience = {
  heading: "Is This Demo Right for You?",
  intro: "This personalized session is ideal for:",
  items: [
    "Founders & Business Owners",
    "CFOs & Finance Leaders",
    "Finance Managers",
    "Operations Managers",
    "HR & Administration Teams",
    "Businesses looking to modernize expense management",
  ],
} as const;

export const demoSteps = {
  heading: "What Happens Next?",
  steps: [
    { label: "Step 1", text: "Complete the form." },
    { label: "Step 2", text: "Our team will contact you within one business day." },
    {
      label: "Step 3",
      text: "Attend a personalized 30-minute walkthrough tailored to your business needs.",
    },
    {
      label: "Step 4",
      text: "Receive practical recommendations and see how Expendesk can fit into your workflows.",
    },
  ],
} as const;

export const demoLoved = {
  heading: "Expendesk is loved by Finance Teams",
  /** Rendered as a two-column grid from sm; source doc shows them paired. */
  items: [
    "Faster Employee Reimbursements",
    "Expense Policy Compliance",
    "Automated Approval Workflows",
    "Reduced Manual Finance Work",
    "Real-Time Spend Visibility",
    "Built for SMEs & Mid-Market Businesses",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Right panel                                                         */
/* ------------------------------------------------------------------ */

export const demoFormPanel = {
  heading: "Schedule Your Free Demo",
  description:
    "See how Expendesk can help your business gain complete control over expenses and reimbursements.",
  /**
   * Reassurance under the form. The fields, consent checkbox and the
   * "Book My Free Demo" button all live inside the GHL widget — they are
   * configured there, not here.
   */
  reassurance:
    "30-minute personalized session • No obligation • No credit card required",
} as const;

/**
 * GHL "Demo Intent Form - Expendesk" embed config, copied verbatim from the
 * widget's embed snippet. Unlike the /contact-sales form, this widget's
 * `data-form-id` and iframe id share the same identifier.
 */
export const demoFormEmbed: GhlFormEmbedConfig = {
  src: "https://link.youngarchitects.in/widget/form/B3jC5EuG9AdUIzD0I3t1",
  formId: "B3jC5EuG9AdUIzD0I3t1",
  iframeId: "inline-B3jC5EuG9AdUIzD0I3t1",
  embedScriptSrc: "https://link.youngarchitects.in/js/form_embed.js",
  title: "Demo Intent Form - Expendesk",
  dataHeight: "701",
  loadingLabel: "Loading secure demo form…",
};
