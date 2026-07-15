"use client";

/**
 * useGhlEmbedLoaded — reports when a GHL (LeadConnector) embed has rendered.
 *
 * Signal: the iframe's `load` event — the widget document actually arriving.
 * Watching the embed script set `style.height` is NOT reliable here: for
 * form embeds, `form_embed.js` pre-sets the height from the `data-height`
 * attribute well before the widget content loads, which would dismiss the
 * loading overlay over a still-blank card.
 *
 * Two fallbacks:
 *  - the iframe may already have finished loading before hydration (fast
 *    cache hit) — its navigation shows up in the resource-timing buffer, so
 *    an initial async check covers that;
 *  - `timeoutMs` is a hard ceiling: if the widget never loads (URL down),
 *    the overlay must still get out of the way.
 */

import { useEffect, useState } from "react";

export function useGhlEmbedLoaded(iframeId: string, timeoutMs = 12000): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const iframe = document.getElementById(iframeId);
    if (!(iframe instanceof HTMLIFrameElement)) return;

    const done = (): void => setLoaded(true);
    const srcBase = iframe.src.split("?")[0];
    const widgetResponded = (): boolean =>
      performance
        .getEntriesByType("resource")
        .some(
          (entry) =>
            entry.name.startsWith(srcBase) &&
            (entry as PerformanceResourceTiming).responseEnd > 0
        );

    // Iframes fire a `load` for their initial empty document while the real
    // navigation is still in flight — only count a load once the widget's
    // response exists in the resource-timing buffer. The genuine document
    // fires its own `load` afterwards, so ignoring the early one is safe.
    const onLoad = (): void => {
      if (widgetResponded()) done();
    };
    iframe.addEventListener("load", onLoad);

    // Already-loaded check (scheduled so the effect body never sets state).
    const initialCheck = setTimeout(() => {
      if (widgetResponded()) done();
    }, 0);
    const timeout = setTimeout(done, timeoutMs);

    return () => {
      iframe.removeEventListener("load", onLoad);
      clearTimeout(initialCheck);
      clearTimeout(timeout);
    };
  }, [iframeId, timeoutMs]);

  return loaded;
}
