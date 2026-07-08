/**
 * All copy + data for the pharmaceutical closing Final-CTA section
 * (`_components/FinalCtaSection.tsx`).
 *
 * The component is purely presentational — the heading, the shared context line,
 * and the two structured action panels all read from `finalCta` below. Panels
 * reference Lucide icons by `iconKey`, mapped through a registry in the
 * component, so no JSX lives in this data file. Panel descriptions that mix
 * plain and gradient-accented text are split into `lead`/`accent`/`tail` runs.
 */
import type { FinalCtaContent } from "./types";

export const finalCta: FinalCtaContent = {
  heading: {
    lead: "Find Out Where Your Expense Process Is ",
    accent: "Holding You Back",
  },
  subheading:
    "Then decide whether your organization needs process improvements, automation, or a complete expense management solution.",

  panels: [
    {
      isPrimary: true,
      iconKey: "download",
      title: "Start with the checklist.",
      description: {
        lead: "Download the ",
        accent: "25-Point Pharma Expense Management Audit Checklist",
        tail: " today.",
      },
      buttonLabel: "Download Checklist",
    },
    {
      isPrimary: false,
      iconKey: "calendar",
      eyebrow: "Secondary Option:",
      title: "Want to see the solution in action?",
      buttonLabel: "Book a Demo",
      href: "/contact-us",
    },
  ],
};
