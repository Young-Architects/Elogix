/**
 * Copy for the /pricing page — one exported object per section, consumed by
 * the matching component in `../_components` (same structure as contact-us).
 *
 * NOTE: plan prices + feature lists are PLACEHOLDER data — swap them for the
 * final numbers from the GTM sheet whenever they're confirmed. Nothing else
 * needs to change: the components map over whatever is defined here.
 *
 * This file never imports React so it stays fully serialisable.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface PricingPlan {
  /** Stable key — also used for aria ids. */
  id: "growth" | "business" | "enterprise";
  name: string;
  tagline: string;
  /** Placeholder price. `custom: true` renders "Custom" instead of a number. */
  price: {
    amount?: string;
    period?: string;
    custom?: boolean;
    note: string;
  };
  /** "Everything in X, plus:" lead-in above the feature list (tiers > Growth). */
  inheritsLabel?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  /** The visually elevated "Most Popular" card. */
  highlighted?: boolean;
}

export interface PricingFaqItem {
  id: string;
  question: string;
  answer: string;
  /** Optional bullet list rendered between `answer` and `answerTail`. */
  bullets?: string[];
  answerTail?: string;
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const pricingHero = {
  eyebrow: "Pricing",
  heading: {
    lead: "Increase your Team Satisfaction with ",
    accent: "Timely Expense Management",
  },
  subheading:
    "We all hate delays when it comes to reimbursement. Expendesk helps you keep a healthy smile on your Team, as the expenses get reimbursed faster.",
  helper: "Not sure about the plans? Talk to our Expert Today",
  ctaLabel: "Book a Free Demo",
  ctaHref: "/contact-us",
  reassurance: [
    "No obligation after the demo",
    "Plans for SMEs & mid-market",
    "Scale anytime, no platform switch",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Plans (placeholder data — see note at the top of this file)         */
/* ------------------------------------------------------------------ */

export const pricingPlans: PricingPlan[] = [
  {
    id: "growth",
    name: "Growth",
    tagline: "For small teams bringing order to expenses for the first time.",
    price: {
      amount: "₹3,999",
      period: "/month",
      note: "Billed annually · placeholder pricing",
    },
    features: [
      "Expense tracking & receipt capture",
      "Simple approval workflows",
      "Mileage & per-diem claims",
      "Standard reports & analytics",
      "Mobile app for on-the-go claims",
      "Email support",
    ],
    ctaLabel: "Book a Free Demo",
    ctaHref: "/contact-us",
  },
  {
    id: "business",
    name: "Business",
    tagline: "For growing companies that need policy control and visibility.",
    price: {
      amount: "₹7,999",
      period: "/month",
      note: "Billed annually · placeholder pricing",
    },
    inheritsLabel: "Everything in Growth, plus:",
    features: [
      "Multi-level approval workflows",
      "Policy controls & spend limits",
      "Real-time budget visibility",
      "Accounting software integrations",
      "Advanced analytics & audit trail",
      "Priority email & chat support",
    ],
    ctaLabel: "Book a Free Demo",
    ctaHref: "/contact-us",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For organisations with multiple entities, locations and teams.",
    price: {
      custom: true,
      note: "Tailored to your organisation",
    },
    inheritsLabel: "Everything in Business, plus:",
    features: [
      "Priority support & dedicated account manager",
      "Custom integrations & API access",
      "Multi-entity & multi-location management",
      "Advanced security & compliance controls",
      "Unlimited users & custom roles",
      "Tailored onboarding & training",
    ],
    ctaLabel: "Book a Free Demo",
    ctaHref: "/contact-us",
  },
];

export const pricingPlansHeader = {
  badge: "Plans",
  heading: {
    lead: "Pick the plan that fits ",
    accent: "your business today",
  },
  subheading:
    "Flexible pricing based on your business size, number of users, and the features you need — you only pay for what your organisation requires.",
} as const;

/* ------------------------------------------------------------------ */
/* FAQ — "Have Questions? Get some Insights"                           */
/* ------------------------------------------------------------------ */

export const pricingFaq = {
  badge: "Pricing FAQs",
  heading: {
    lead: "Have Questions? ",
    accent: "Get some Insights",
  },
  subheading:
    "Everything you need to know about plans, demos and getting started with Expendesk.",
  items: [
    {
      id: "how-priced",
      question: "How is Expendesk priced?",
      answer:
        "Expendesk offers flexible pricing based on your business size, number of users, and the features you need. This ensures you only pay for what your organization requires today, with the flexibility to scale as your business grows.",
    },
    {
      id: "minimum-users",
      question: "Is there a minimum number of users required?",
      answer:
        "No. Expendesk is designed for both growing SMEs and mid-market businesses. Whether you're managing a small finance team or hundreds of employees across multiple locations, we'll recommend a plan that best fits your needs.",
    },
    {
      id: "free-demo",
      question: "What's included in the free demo?",
      answer: "During your personalized demo, we'll:",
      bullets: [
        "Understand your current expense management process",
        "Walk you through Expendesk's features",
        "Show how it can fit into your existing workflows",
        "Answer your questions and recommend the most suitable plan",
      ],
      answerTail: "There's no obligation to purchase after the demo.",
    },
    {
      id: "implementation",
      question: "How long does implementation take?",
      answer:
        "Implementation timelines depend on your business requirements, but most organizations can get started quickly. Our onboarding team will guide you through setup, workflow configuration, and user training to ensure a smooth transition.",
    },
    {
      id: "grow-with-business",
      question: "Can Expendesk grow with my business?",
      answer:
        "Absolutely. Expendesk is built to scale with your organization. As your team grows, you can easily add users, configure new approval workflows, manage multiple locations, and expand your expense management processes without changing platforms.",
    },
    {
      id: "onboarding-support",
      question: "Do you offer onboarding and customer support?",
      answer:
        "Yes. Every Expendesk customer receives onboarding guidance, implementation support, and ongoing assistance from our team to help you maximize the value of the platform.",
    },
  ] satisfies PricingFaqItem[],
} as const;

/* ------------------------------------------------------------------ */
/* Final CTA banner                                                    */
/* ------------------------------------------------------------------ */

export const pricingFinalCta = {
  heading: {
    line1: "Start with the essentials.",
    accent: "Scale as you grow.",
  },
  subheading: "Get Started with Expendesk Today",
  ctaLabel: "Book a Free Demo",
  ctaHref: "/contact-us",
} as const;
