"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToId } from "@/lib/scroll";

/**
 * Owns all in-page hash scrolling so there is exactly one engine in control.
 *
 *  1. On (cross-page) navigation that lands with a hash, smoothly scroll to it.
 *  2. Intercept every same-page hash link click — including ones Next's <Link>
 *     would otherwise handle — and drive a single, layout-shift-aware scroll.
 *  3. Respond to back/forward hash changes.
 */
export default function ScrollToHash(): null {
  const pathname = usePathname();

  // (1) Scroll to the hash present after a route change / fresh load.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === "#") return;
    const id = decodeURIComponent(hash.slice(1));
    // The engine waits for the section to mount, so no manual retry needed.
    scrollToId(id);
  }, [pathname]);

  // (2) Global, capture-phase interception of same-page hash links.
  useEffect(() => {
    const onClick = (e: MouseEvent): void => {
      // Ignore non-primary clicks and modifier clicks (new tab, etc.).
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const anchor = (e.target as Element | null)?.closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank") return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return; // external link
      if (!url.hash || url.hash === "#") return; // not a hash link
      if (url.pathname !== window.location.pathname) return; // other page → let Next navigate; effect (1) handles the scroll on arrival

      const id = decodeURIComponent(url.hash.slice(1));
      const el = document.getElementById(id);
      if (!el) return; // target section isn't on this page — leave default behaviour

      // Capture phase + stopPropagation means Next's <Link> handler never fires,
      // so there is no competing client navigation or native jump.
      e.preventDefault();
      e.stopPropagation();

      if (url.hash !== window.location.hash) {
        history.pushState(null, "", url.hash);
      }
      scrollToId(id);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // (3) Back/forward navigation between hashes.
  useEffect(() => {
    const onHashChange = (): void => {
      const hash = window.location.hash;
      if (!hash || hash === "#") return;
      const id = decodeURIComponent(hash.slice(1));
      if (document.getElementById(id)) scrollToId(id);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
