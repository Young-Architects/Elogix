/**
 * Single source of truth for the lead-magnet PDF (the MSME expense guide) and
 * the shared "open in a new tab" behavior used by every guide CTA across the
 * site.
 *
 * The PDF lives in `public/downloads/`, so it is served from the site origin at
 * {@link LEAD_MAGNET_HREF}. Keeping the path/filename here means a future asset
 * swap is a one-line change.
 */

/** Public URL of the lead-magnet PDF (served from `public/downloads/`). */
export const LEAD_MAGNET_HREF = "/downloads/msme-lead-magnet.pdf";

/**
 * Opens the lead-magnet PDF in a new browser tab (inline preview) — the
 * behavior every guide CTA shares. The file is NOT force-downloaded; the user
 * views it in the new tab and can save it themselves if they want.
 *
 * Pass the click event to suppress the host element's default navigation (so a
 * Next.js `<Link>`/`<a>` doesn't also route away). Must be called from within a
 * user gesture (a click handler) or the browser will block the popup.
 */
export function openLeadMagnet(event?: {
  preventDefault?: () => void;
}): void {
  event?.preventDefault?.();

  if (typeof window === "undefined") return;

  window.open(LEAD_MAGNET_HREF, "_blank", "noopener,noreferrer");
}
