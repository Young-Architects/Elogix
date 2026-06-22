/**
 * /resources/faqs — placeholder route.
 *
 * Linked from the Navbar "Resources" dropdown. Intentionally renders a 404 for
 * now via `notFound()`; replace with real content when this page is built out.
 */
import { notFound } from "next/navigation";

export default function FaqsPage() {
  notFound();
}
