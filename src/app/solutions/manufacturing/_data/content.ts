/**
 * Content for the /solutions/manufacturing landing page.
 * Keeps copy out of the component, mirroring the home page's data-driven pattern.
 */
export const content = {
  eyebrow: "Manufacturing",
  headline: { pre: "Expense Management for", accent: "Manufacturing Industries" },
  description:
    "Keep every plant, facility, and department on budget. Expendesk gives manufacturing teams granular cost control without slowing down operations.",
  cta: { label: "Book a Demo", href: "/contact-us" },
  comingSoon: {
    title: "The full Manufacturing page is on its way",
    message:
      "We're building out the complete deep-dive for manufacturing teams — industry challenges, workflows, and resources. In the meantime, book a demo to see Expendesk in action today.",
  },
  benefits: {
    heading: "Built for Manufacturing Operations",
    items: [
      {
        title: "Multi-Site Cost Control",
        desc: "Manage and compare spend across multiple plants and facilities in one dashboard.",
      },
      {
        title: "Purchase Order Matching",
        desc: "Automatically match expenses to POs and flag discrepancies before they escalate.",
      },
      {
        title: "Vendor Spend Analytics",
        desc: "Get clear visibility into supplier and vendor costs to negotiate better rates.",
      },
    ],
  },
} as const;
