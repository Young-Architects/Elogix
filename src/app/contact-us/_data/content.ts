/**
 * Copy for the /contact-us hub page — one exported object per section,
 * consumed by the matching component in `../_components`.
 *
 * Icons are referenced by string `iconKey` (mapped to Lucide components
 * inside the section components) so this file stays serialisable and never
 * imports React.
 */

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ContactChannelIconKey = "sales" | "chat";

export interface ContactChannelCard {
  iconKey: ContactChannelIconKey;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  /**
   * What the card's CTA does:
   *  - `link`  → client-side navigation to `href`
   *  - `chat`  → opens the floating Expendesk AI chat (General Queries)
   */
  action: { type: "link"; href: string } | { type: "chat" };
}

export type SupportLinkIconKey = "mail" | "faq" | "resources";

export interface SupportLink {
  iconKey: SupportLinkIconKey;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}

/* ------------------------------------------------------------------ */
/* Hero + channel cards                                                */
/* ------------------------------------------------------------------ */

export const contactHero = {
  eyebrow: "Contact us",
  heading: {
    lead: "Talk to an ",
    accent: "expense management",
    tail: " expert",
  },
  subheading:
    "Our team of expense management specialists is here to fix issues and provide expert advice.",
} as const;

export const contactChannels: ContactChannelCard[] = [
  {
    iconKey: "sales",
    eyebrow: "Sales",
    title: "Talk to sales",
    description:
      "Want to build the perfect expense management processes for your business? Our market specialists will walk you through it.",
    ctaLabel: "Talk to sales",
    action: { type: "link", href: "/contact-sales" },
  },
  {
    iconKey: "chat",
    eyebrow: "General queries",
    title: "Chat with us",
    description:
      "Have a question or request which doesn't fit the other option? Our AI assistant answers instantly, day or night.",
    ctaLabel: "Chat with us",
    action: { type: "chat" },
  },
];

/** Small trust line under the cards. */
export const contactReassurance = [
  "Instant answers on chat",
  "Sales replies within 24 hours",
  "No obligation, no pressure",
] as const;

/* ------------------------------------------------------------------ */
/* Secondary "other ways to reach us" strip                            */
/* ------------------------------------------------------------------ */

export const contactSupport = {
  heading: "Prefer another way to reach us?",
  subheading:
    "Not ready for a conversation yet? These are good places to start.",
  links: [
    {
      iconKey: "mail",
      title: "Email us",
      description: "Drop us a line and we'll get back to you within one business day.",
      ctaLabel: "hello@expendesk.com",
      href: "mailto:hello@expendesk.com",
    },
    {
      iconKey: "faq",
      title: "Browse the FAQs",
      description: "Quick answers to the questions we hear most often.",
      ctaLabel: "Read FAQs",
      href: "/resources/faqs",
    },
    {
      iconKey: "resources",
      title: "Explore resources",
      description: "Whitepapers, case studies and guides from our finance experts.",
      ctaLabel: "View resources",
      href: "/resources/blogs",
    },
  ] satisfies SupportLink[],
} as const;
