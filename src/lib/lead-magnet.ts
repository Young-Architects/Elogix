/**
 * Single source of truth for the downloadable lead-magnet PDF (the MSME expense
 * guide) and the shared "open in a new tab AND download" behavior used by every
 * download CTA across the site.
 *
 * The PDF lives in `public/downloads/`, so it is served from the site origin at
 * {@link LEAD_MAGNET_HREF}. Keeping the path/filename here means a future asset
 * swap is a one-line change.
 */

/** Public URL of the lead-magnet PDF (served from `public/downloads/`). */
export const LEAD_MAGNET_HREF = "/downloads/msme-lead-magnet.pdf";

/** Filename suggested to the browser when the PDF is downloaded. */
export const LEAD_MAGNET_FILENAME = "MSME-Lead-Magnet.pdf";

/**
 * Opens the lead-magnet PDF in a new browser tab (inline preview) AND triggers
 * a file download — the behavior every "Download …" CTA shares.
 *
 * Pass the click event to suppress the host element's default navigation (so a
 * Next.js `<Link>`/`<a>` doesn't also route away). Must be called from within a
 * user gesture (a click handler) or the browser will block the popup/download.
 */
export function openAndDownloadLeadMagnet(event?: {
  preventDefault?: () => void;
}): void {
  event?.preventDefault?.();

  if (typeof window === "undefined") return;

  // 1) Preview in a new tab.
  window.open(LEAD_MAGNET_HREF, "_blank", "noopener,noreferrer");

  // 2) Force a download of the same file.
  const link = document.createElement("a");
  link.href = LEAD_MAGNET_HREF;
  link.download = LEAD_MAGNET_FILENAME;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
