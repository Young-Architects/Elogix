/**
 * /resources — hub index placeholder.
 *
 * Linked from the Footer "Quick Links". A unified resources hub isn't built yet,
 * so this renders a branded "Coming Soon" page. The individual resources (Blog,
 * Whitepapers, Case Studies, FAQ) remain reachable from the Resources menu.
 */
import type { Metadata } from "next";
import ComingSoon from "@/components/ui/ComingSoon";

export const metadata: Metadata = {
  title: "Resources",
  description: "The Expendesk resources hub — coming soon.",
  robots: { index: false, follow: true },
};

export default function ResourcesPage() {
  return (
    <ComingSoon
      eyebrow="Resources"
      title="Resources Hub"
      message="We're bringing our whitepapers, case studies, blog, and FAQs together in one place. For now, browse them from the Resources menu or read the latest on our blog."
    />
  );
}
