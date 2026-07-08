/**
 * /resources/whitepapers — placeholder route.
 *
 * Linked from the Navbar + Footer "Resources" menus. Renders a branded
 * "Coming Soon" page until real content is built out; kept out of the search
 * index while it's a placeholder.
 */
import type { Metadata } from "next";
import ComingSoon from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "Whitepapers",
  description: "In-depth Expendesk research and insights — coming soon.",
  robots: { index: false, follow: true },
};

export default function WhitepapersPage() {
  return (
    <ComingSoon
      eyebrow="Resources"
      title="Whitepapers"
      message="In-depth research and insights on expense management are on the way. In the meantime, explore our blog or talk to our team."
    />
  );
}
