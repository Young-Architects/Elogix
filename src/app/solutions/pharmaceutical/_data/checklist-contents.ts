/**
 * All copy + data for the pharmaceutical "What's inside the checklist" section
 * (`_components/ChecklistContentsSection.tsx`).
 *
 * The component is purely presentational — the heading, the revealed checklist
 * categories (rendered as a desktop timeline and a mobile tile grid), and the
 * locked "plus N more" card all read from `checklistContents` below. Items
 * reference Lucide icons by `iconKey`, mapped through a registry in the
 * component, so no JSX lives in this data file.
 *
 * The hidden count shown on the locked card ("Plus 15 more…") and the "+N"
 * avatar chip are derived in the component as `totalAreas - items.length`, so
 * they stay in sync automatically if items are added or removed here.
 */
import type { ChecklistContentsContent } from "./types";

export const checklistContents: ChecklistContentsContent = {
  badge: "WHAT'S INSIDE THE CHECKLIST",
  heading: {
    lead: "The ",
    accent: "25 Critical Areas",
    tail: " Every Pharma Company Should Audit",
  },
  totalAreas: 25,

  items: [
    { id: 1, title: "Expense Submission Process", iconKey: "receipt" },
    { id: 2, title: "Fuel Reimbursement Management", iconKey: "fuel" },
    { id: 3, title: "Travel & Lodging Claims", iconKey: "plane" },
    { id: 4, title: "Approval Workflow Efficiency", iconKey: "workflow" },
    { id: 5, title: "Expense Fraud Prevention", iconKey: "shieldAlert" },
    { id: 6, title: "Policy Compliance", iconKey: "fileCheck" },
    { id: 7, title: "Audit Readiness", iconKey: "clipboardCheck" },
    { id: 8, title: "Spend Visibility", iconKey: "eye" },
    { id: 9, title: "Employee Experience", iconKey: "smile" },
    { id: 10, title: "Reporting & Analytics", iconKey: "barChart" },
  ],

  locked: {
    lead: "Plus ",
    accentSuffix: " more assessment points.",
  },
};
