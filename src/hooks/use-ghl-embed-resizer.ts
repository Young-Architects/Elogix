"use client";

/**
 * useGhlEmbedResizer — fixes GHL embeds that render clipped/short after a
 * Next.js *client-side* return navigation, without touching the (already
 * working) full-page-load path.
 *
 * Background
 * ----------
 * `form_embed.js` scans the DOM and hands each embed iframe to its bundled
 * iframe-resizer exactly once — gated by the window flag
 * `__ghl_iframe_resizer_initialized__`, which it sets on first run and which
 * then persists for the life of the SPA. Because of that guard:
 *
 *  - Full page load (e.g. the navbar "Book a Demo", a plain `<a>`) and the
 *    first client navigation to the page both run the scan with the iframe
 *    present → the calendar sizes correctly. On this path form_embed.js also
 *    briefly hides the iframe and reveals it after the handshake, so we must
 *    NOT interfere here (doing so leaves the card blank).
 *  - A *return* client navigation (a `<Link>`/MagneticButton CTA back to the
 *    page after it was visited once) mounts a fresh iframe, but the one-time
 *    scan never re-runs → the new iframe is never wired up and stays stuck at
 *    its CSS min-height (the date grid renders clipped).
 *
 * The fix
 * -------
 * The library exposes the public entry `window.iFrameResize(options, iframe)`
 * and skips any iframe already carrying `data-iframe-resizer-initialized`, so
 * calling it is idempotent. We only call it on the return-navigation case,
 * detected by reading the window flag *synchronously* at mount: it is already
 * `true` only when the script ran on a previous page (return nav); on a full
 * load / first nav the async-loaded script has not executed yet, so the flag
 * is `false` and we do nothing — leaving form_embed.js's own init untouched.
 */

import { useEffect } from "react";

/** Standard iframe-resizer per-element guard attribute. */
const RESIZER_ATTR = "data-iframe-resizer-initialized";
/** Window flag form_embed.js sets on its one-time init (persists across SPA navs). */
const GLOBAL_INIT_FLAG = "__ghl_iframe_resizer_initialized__";

/** Options mirroring form_embed.js's own internal `iFrameResize()` call. */
const RESIZE_OPTIONS: Record<string, unknown> = {
  log: false,
  checkOrigin: false,
  enablePublicMethods: true,
  scrolling: true,
  heightCalculationMethod: "offset",
  autoResize: true,
  sizeWidth: false,
  sizeHeight: true,
};

const POLL_INTERVAL_MS = 120;
const POLL_CEILING_MS = 5000;

type IFrameResize = (
  options: Record<string, unknown>,
  target: HTMLIFrameElement,
) => void;

export function useGhlEmbedResizer(iframeId: string): void {
  useEffect(() => {
    const iframe = document.getElementById(iframeId);
    if (!(iframe instanceof HTMLIFrameElement)) return;

    // Read synchronously — before the async-loaded form_embed.js can run on
    // this mount. Only a return client navigation has the flag already set.
    const isReturnNavigation = Boolean(
      (window as unknown as Record<string, unknown>)[GLOBAL_INIT_FLAG],
    );
    if (!isReturnNavigation) return; // full load / first nav → let the script do its thing

    let done = false;
    let pollId: ReturnType<typeof setInterval> | undefined;
    let ceilingId: ReturnType<typeof setTimeout> | undefined;

    const stop = (): void => {
      if (pollId !== undefined) clearInterval(pollId);
      if (ceilingId !== undefined) clearTimeout(ceilingId);
      pollId = undefined;
      ceilingId = undefined;
    };

    // Returns true once there's nothing left to do (bound, or already wired by
    // the library). Returns false only while waiting for window.iFrameResize.
    const bind = (): boolean => {
      if (done) return true;
      if (iframe.getAttribute(RESIZER_ATTR) === "true") {
        done = true; // the library already handled this iframe — leave it alone
        return true;
      }
      const resize = (window as unknown as { iFrameResize?: IFrameResize })
        .iFrameResize;
      if (typeof resize !== "function") return false;
      try {
        resize({ ...RESIZE_OPTIONS }, iframe);
        done = true;
      } catch {
        return false; // child not reachable yet — a later poll retries
      }
      return true;
    };

    if (!bind()) {
      pollId = setInterval(() => {
        if (bind()) stop();
      }, POLL_INTERVAL_MS);
      ceilingId = setTimeout(stop, POLL_CEILING_MS);
    }

    return () => {
      done = true;
      stop();
    };
  }, [iframeId]);
}
