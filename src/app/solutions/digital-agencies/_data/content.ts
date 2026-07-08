/**
 * Content for the /solutions/digital-agencies landing page.
 * Keeps copy out of the component, mirroring the home page's data-driven pattern.
 */
export const content = {
  eyebrow: "Digital Agencies",
  headline: { pre: "Expense Management for", accent: "Digital Agencies" },
  description:
    "Stop losing margin to untracked spend. Expendesk lets agencies link every expense to a project and client — so billing is accurate and profitability is always clear.",
  cta: { label: "Book a Demo", href: "/contact-us" },
  benefits: {
    heading: "Built for Agency Workflows",
    items: [
      {
        title: "Project-Level Budgets",
        desc: "Assign budgets per project or client and get alerts before you go over.",
      },
      {
        title: "Client Billing Sync",
        desc: "Tag expenses as billable or non-billable and export directly to invoices.",
      },
      {
        title: "Team Spend Cards",
        desc: "Issue virtual cards to team members with pre-set limits per campaign.",
      },
    ],
  },
} as const;
