/**
 * /resources/faqs — redirect route.
 *
 * The FAQ content now lives on the home page (`/#faq`), so this legacy route
 * (and any old bookmarks) redirects there instead of 404-ing.
 *
 * `permanentRedirect` (308), not `redirect` (307): the move is permanent, and
 * only a permanent redirect tells a crawler to drop the old URL from the index
 * and pass its accumulated signals to the destination. A 307 asks Google to
 * keep the old URL around and re-check it indefinitely.
 */
import { permanentRedirect } from "next/navigation";

export default function FaqsPage() {
  permanentRedirect("/#faq");
}
