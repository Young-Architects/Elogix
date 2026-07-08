/**
 * /resources/faqs — redirect route.
 *
 * The FAQ content now lives on the home page (`/#faq`), so this legacy route
 * (and any old bookmarks) redirects there instead of 404-ing.
 */
import { redirect } from "next/navigation";

export default function FaqsPage() {
  redirect("/#faq");
}
