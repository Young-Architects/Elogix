/**
 * Copy + form configuration for the /contact-sales page, consumed by the
 * components in `../_components`. Keeping select options and copy here means
 * the form component stays pure presentation/validation logic.
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
/* Form configuration                                                  */
/* ------------------------------------------------------------------ */

export const companySizeOptions = [
  "1–10 employees",
  "11–50 employees",
  "51–200 employees",
  "201–500 employees",
  "500+ employees",
] as const;

export const countryOptions = [
  "India",
  "United States",
  "United Kingdom",
  "Australia",
  "Belgium",
  "Brazil",
  "Canada",
  "France",
  "Germany",
  "Ireland",
  "Italy",
  "Japan",
  "Mexico",
  "Netherlands",
  "New Zealand",
  "Poland",
  "Portugal",
  "Singapore",
  "South Africa",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Arab Emirates",
  "Other",
] as const;

export const salesForm = {
  consentLabel:
    "I agree to be contacted by Expendesk for informational and marketing purposes according to the",
  consentLinkLabel: "Privacy Policy",
  consentLinkHref: "/legal/privacy",
  submitLabel: "Submit form",
  footnote: "No credit card required. No need to install software.",
  success: {
    heading: "Request received!",
    body: "Thanks for reaching out — a market specialist will get back to you within 24 hours. In the meantime, feel free to explore how other teams use Expendesk.",
    ctaLabel: "Explore case studies",
    ctaHref: "/resources/case-studies",
  },
  errorBanner:
    "Something went wrong while sending your request. Please try again in a moment.",
} as const;

/** Shape of the lead payload sent to the sales webhook. */
export interface SalesLeadPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companySize: string;
  country: string;
  message: string;
  consent: boolean;
  submittedAt: string;
  source: "contact-sales";
}
