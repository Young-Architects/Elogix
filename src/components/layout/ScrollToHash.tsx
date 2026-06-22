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
// Extract a single, usable section id from a hash that may be malformed —
// e.g. a stacked "#features-video#benefits#lead-magnet" from an old/shared
// link resolves to its first non-empty segment.
function idFromHash(hash: string): string | null {
  if (!hash || hash === "#") return null;
  const first = hash.replace(/^#+/, "").split("#")[0];
  return first ? decodeURIComponent(first) : null;
}

export default function ScrollToHash(): null {
  const pathname = usePathname();

  // (1) Scroll to the hash present after a route change / fresh load.
  useEffect(() => {
    const id = idFromHash(window.location.hash);
    if (!id) return;
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

      // Write a fully-normalised URL (path + single, clean hash) rather than
      // pushing the bare "#id" — pushing a bare fragment against a URL that
      // already has one can stack them (e.g. "/#features#benefits#lead-magnet").
      if (url.hash !== window.location.hash) {
        history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }
      scrollToId(id);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // (3) Back/forward navigation between hashes.
  useEffect(() => {
    const onHashChange = (): void => {
      const id = idFromHash(window.location.hash);
      if (id && document.getElementById(id)) scrollToId(id);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
