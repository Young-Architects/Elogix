/**
 * All copy + data for the pharmaceutical "Choose your next step" section
 * (`_components/Choosenextstepsection.tsx`) — the dual-CTA + social-proof
 * closer.
 *
 * The component is purely presentational — the heading, the two CTA cards, and
 * the dark trust capsule all read from `chooseNextStep` below. CTA options
 * reference Lucide icons by `iconKey`, mapped through a registry in the
 * component, so no JSX lives in this data file.
 */
import type { ChooseNextStepContent } from "./types";

export const chooseNextStep: ChooseNextStepContent = {
  badge: "TWO WAYS TO GET STARTED",
  heading: {
    lead: "Choose Your ",
    accent: "Next Step",
  },

  options: [
    {
      id: 1,
      label: "Option 1",
      title: "Download the Audit Checklist",
      description: "Identify weaknesses in your current expense process.",
      buttonLabel: "Download Checklist",
      href: "/downloads/msme-lead-magnet.pdf",
      iconKey: "download",
    },
    {
      id: 2,
      label: "Option 2",
      title: "Book a Personalized Demo",
      description:
        "See how Expendesk can automate and streamline your entire reimbursement process.",
      buttonLabel: "Schedule Demo",
      href: "/contact-us",
      iconKey: "calendar",
    },
  ],

  trust: {
    heading: {
      lead: "Built for Businesses That Depend on ",
      accent: "Efficient Reimbursements",
    },
    subheading: "Expendesk is designed to help growing organizations:",
    points: [
      "Reduce reimbursement delays",
      "Improve compliance",
      "Strengthen financial control",
      "Improve employee experience",
      "Scale expense operations confidently",
    ],
  },
};
