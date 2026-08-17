/**
 * Copy for /about — the brand entity page.
 *
 * ── Read this before editing ──
 *
 * This page is not a normal marketing page and its copy is not free-form. Its
 * job is to be the one document on the internet that answers, unambiguously,
 * "what is Expendesk?" — because Google currently answers that question with
 * "did you mean spendesk?".
 *
 * Two rules follow from that, and both are load-bearing:
 *
 * 1. **The word "Expendesk" appears in the H1, the first sentence, and the
 *    definition below.** Everywhere else on the site the brand is assumed;
 *    here it is the subject. A brand query needs a page whose visible text
 *    plainly states the brand name next to what it is.
 *
 * 2. **Every factual claim here must be independently verifiable**, because the
 *    same facts are asserted in JSON-LD on this page. Google cross-checks
 *    structured data against the rendered page — a mismatch is worse than
 *    silence. The Elogix details (Kolkata, 2000, elogixsoft.com) were checked
 *    against the live parent site; the product facts restate what the home
 *    page already says. Do not add a founding date, employee count, address or
 *    customer number here unless you can point at a public source for it.
 */

export const content = {
  eyebrow: 'About Expendesk',

  headline: {
    pre: 'What is',
    accent: 'Expendesk',
    post: '?',
  },

  /**
   * The definition sentence. Deliberately written in the "X is a Y that does Z"
   * shape used by encyclopaedia entries and knowledge panels, because that is
   * the pattern extractive systems — featured snippets, AI overviews — lift
   * verbatim. It leads with the exact brand string rather than a pronoun.
   */
  definition:
    'Expendesk is an expense and reimbursement management platform for finance teams. It automates expense tracking, employee reimbursements, approval workflows and spend-policy compliance, giving growing businesses real-time visibility over where their money goes.',

  spelling: {
    heading: 'The name',
    body: 'Expendesk is spelled E-X-P-E-N-D-E-S-K — from “expense” and “desk”. It is the official product name of the platform published at expendesk.com, and it is written as one word.',
  },

  maker: {
    heading: 'Who makes Expendesk',
    /**
     * The parent-company paragraph. This is the single most important block of
     * text on the page: it connects a brand name Google does not recognise to a
     * company it has indexed since 2000, in plain prose, with an outbound link
     * it can follow to confirm the claim.
     */
    body: 'Expendesk is built and published by Elogix Software Pvt. Ltd., an IT services and product company that began in Kolkata, India in 2000 and now works with teams across India and the United States. Expendesk is the company’s expense management product, launched in 2026.',
    linkLabel: 'Visit Elogix Software',
  },

  built: {
    heading: 'Who it is built for',
    body: 'Expendesk is designed for SMEs and mid-market businesses — companies large enough that spreadsheets and email approvals have stopped working, but that do not want the cost and complexity of enterprise finance suites.',
  },

  /**
   * What the product actually does, as short factual statements. These mirror
   * the `featureList` in the SoftwareApplication schema — keep the two in sync,
   * since claiming a capability in structured data that the page does not
   * mention is the kind of mismatch that gets markup ignored.
   */
  capabilities: {
    heading: 'What Expendesk does',
    items: [
      {
        title: 'Expense tracking',
        desc: 'Every business expense captured in one place, categorised as it arrives instead of at month end.',
      },
      {
        title: 'Automated reimbursements',
        desc: 'Employee claims move from submission to payout without manual chasing between finance and managers.',
      },
      {
        title: 'Approval workflows',
        desc: 'Spend routes to the right approver automatically, with the full trail retained for audit.',
      },
      {
        title: 'Policy compliance',
        desc: 'Out-of-policy spend is flagged as it happens, rather than discovered after the money has left.',
      },
      {
        title: 'Real-time visibility',
        desc: 'Live view of committed and actual spend, so finance is not reconstructing the picture from receipts.',
      },
      {
        title: 'Receipt capture',
        desc: 'Receipts are captured and matched to transactions, closing the gap that makes reconciliation slow.',
      },
    ],
  },

  connect: {
    heading: 'Find Expendesk elsewhere',
    body: 'Expendesk publishes updates on these official channels. If you found this page while checking whether the brand is real, these are the accounts it runs.',
  },

  cta: {
    heading: 'See Expendesk on your own numbers',
    body: 'A free demo walks through how expenses, approvals and reimbursements would run for your team.',
    label: 'Book a Free Demo',
    href: '/contact-us',
  },
} as const;
