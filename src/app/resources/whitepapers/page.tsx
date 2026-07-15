/**
 * /resources/whitepapers — placeholder route.
 *
 * Linked from the Navbar + Footer "Resources" menus. Renders a branded
 * "Coming Soon" page until real content is built out; kept out of the search
 * index while it's a placeholder.
 */
import type { Metadata } from "next";
import ComingSoon from "@/components/ui/ComingSoon";
import { comingSoon } from "./_data/content";

export const metadata: Metadata = {
  title: "Whitepapers",
  description: "In-depth Expendesk research and insights — coming soon.",
  robots: { index: false, follow: true },
};

export default function WhitepapersPage() {
  return (
    <ComingSoon {...comingSoon} />
  );
}
