/**
 * Copy + embed configuration for the /contact-sales page, consumed by the
 * components in `../_components`. Lead capture runs through the embedded GHL
 * "Contact Expendesk" form (see `salesFormEmbed`), so submissions land
 * directly in the GHL CRM — no custom form/webhook code on our side.
 */

/* ------------------------------------------------------------------ */
/* Intro column                                                        */
/* ------------------------------------------------------------------ */

export const salesIntro = {
  eyebrow: "Contact sales",
  heading: { lead: "Talk to a ", accent: "market specialist" },
  description:
    "Get your questions answered on the spot by one of our expense management experts and see Expendesk live in action. Our market specialists help you identify which solutions and packages best suit your needs, based on your location, industry, and growth plans.",
  expectations: {
    heading: "What to expect",
    items: [
      "A reply from a specialist within 24 hours",
      "A tailored walkthrough of Expendesk for your industry",
      "Transparent pricing for your team size — no surprises",
      "Zero commitment: explore first, decide later",
    ],
  },
} as const;

/* ------------------------------------------------------------------ */
/* Form embed                                                          */
/* ------------------------------------------------------------------ */

/** GHL "Contact Expendesk" form embed config (LeadConnector widget). */
export const salesFormEmbed = {
  src: "https://link.youngarchitects.in/widget/form/rk4yf4oo9XFsnFZpo0cT",
  formId: "rk4yf4oo9XFsnFZpo0cT",
  iframeId: "inline-rk4yf4oo9XFsnFZpo0cT",
  embedScriptSrc: "https://link.youngarchitects.in/js/form_embed.js",
  title: "Contact Expendesk",
} as const;
