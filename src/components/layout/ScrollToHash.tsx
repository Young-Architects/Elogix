"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToId } from "@/lib/scroll";

/**
 * Fired on `window` whenever a same-page hash link is handled here. Because this
 * controller intercepts those clicks in capture phase + stopPropagation(), the
 * link's own React onClick never runs — so components like the mobile nav listen
 * for this event to react to in-page navigation (e.g. close themselves).
 */
export const IN_PAGE_NAV_EVENT = "expendesk:inpagenav";

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

// Self-heal: collapse a stacked hash ("#hero#hero", "#a#b") in the address bar
// down to its first id, in place — so any stray stacking (back/forward, shared
// links, a missed click) never lingers in the URL.
function normalizeHash(): void {
  if (typeof window === "undefined") return;
  const raw = window.location.hash;
  if (!raw) return;
  const id = idFromHash(raw);
  const clean = id ? `#${encodeURIComponent(id)}` : "";
  if (raw !== clean) {
    history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}${clean}`,
    );
  }
}

export default function ScrollToHash(): null {
  const pathname = usePathname();

  // (1) Scroll to the hash present after a route change / fresh load.
  useEffect(() => {
    normalizeHash();
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

      // Resolve to a single id even if the href is itself stacked.
      const id = idFromHash(url.hash);
      if (!id) return;

      // Own the scroll for EVERY same-page hash link. We deliberately do NOT bail
      // when the element is missing: below-fold sections lazy-load, so the target
      // may not be in the DOM at click time — scrollToId() waits for it. Bailing
      // here (without preventDefault) would let the browser AND Next both navigate,
      // which is exactly what stacks duplicate hashes ("#hero#hero") into the URL.
      e.preventDefault();
      e.stopPropagation();

      // Always write a normalised, single hash — never the raw (possibly stacked) one.
      const cleanHash = `#${encodeURIComponent(id)}`;
      if (cleanHash !== window.location.hash) {
        history.pushState(null, "", `${url.pathname}${url.search}${cleanHash}`);
      }
      scrollToId(id);

      // We handled this click in capture phase with stopPropagation(), so the
      // link's own React onClick never fires — UI like the mobile menu can't
      // self-close. Broadcast a signal so it can respond to in-page navigation.
      window.dispatchEvent(new CustomEvent(IN_PAGE_NAV_EVENT, { detail: { id } }));
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // (3) Back/forward navigation between hashes.
  useEffect(() => {
    const onHashChange = (): void => {
      normalizeHash();
      const id = idFromHash(window.location.hash);
      if (id && document.getElementById(id)) scrollToId(id);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return null;
}
