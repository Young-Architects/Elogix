/**
 * /solutions — hub index placeholder.
 *
 * Linked from the Footer "Quick Links" ("Industries"). A unified solutions hub
 * isn't built yet, so this renders a branded "Coming Soon" page. The individual
 * industry pages remain reachable from the Solutions menu.
 */
import type { Metadata } from "next";
import ComingSoon from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "Solutions",
  description: "The Expendesk solutions hub across every industry — coming soon.",
  robots: { index: false, follow: true },
};

export default function SolutionsPage() {
  return (
    <ComingSoon
      eyebrow="Solutions"
      title="Solutions Hub"
      message="A unified overview of Expendesk across every industry is on the way. For now, explore our industry pages from the Solutions menu, or talk to our team about your business."
    />
  );
}
