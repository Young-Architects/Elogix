/**
 * All copy + data for the pharmaceutical Bridge section
 * (`_components/BridgeSection.tsx`) — the "Once you identify the gaps, how do
 * you fix them?" transition into the Expendesk pitch.
 *
 * The component is purely presentational — the headline, the "same challenges"
 * cards, and the closing banner all read from `bridge` below. Cards reference
 * Lucide icons by `iconKey`, mapped through a registry in the component, so no
 * JSX lives in this data file.
 */
import type { BridgeContent } from "./types";

export const bridge: BridgeContent = {
  badge: "Bridge to Expendesk",
  heading: {
    lead: "Once You Identify the Gaps, ",
    accent: "How Do You Fix Them?",
  },
  subheading: "Most pharma companies discover the same challenges:",

  challenges: [
    { id: "manual-claims", label: "Manual expense claims", iconKey: "fileWarning" },
    { id: "delayed-approvals", label: "Delayed approvals", iconKey: "clock" },
    { id: "poor-visibility", label: "Poor spend visibility", iconKey: "eyeOff" },
    {
      id: "reimbursement-bottlenecks",
      label: "Reimbursement bottlenecks",
      iconKey: "hourglass",
    },
    { id: "fraud-risk", label: "Expense fraud risks", iconKey: "shieldAlert" },
    { id: "compliance-issues", label: "Compliance issues", iconKey: "alertTriangle" },
  ],

  closing: {
    lead: "This is exactly why organizations are moving toward ",
    accent: "automated expense management platforms.",
  },
};
