/**
 * /solutions — hub index placeholder.
 *
 * Linked from the Footer "Quick Links" ("Industries"). A unified solutions hub
 * isn't built yet, so this renders a branded "Coming Soon" page. The individual
 * industry pages remain reachable from the Solutions menu.
 */
import type { Metadata } from "next";
import ComingSoon from "@/components/ui/ComingSoon";
import { comingSoon } from "./_data/content";

export const metadata: Metadata = {
  title: "Solutions",
  description: "The Expendesk solutions hub across every industry — coming soon.",
  robots: { index: false, follow: true },
};

export default function SolutionsPage() {
  return (
    <ComingSoon {...comingSoon} />
  );
}
