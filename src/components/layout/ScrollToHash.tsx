"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Matches the fixed navbar's total height (pill height + top padding).
const NAVBAR_OFFSET = 90;

export default function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1); // strip leading #

    // Retry until the element exists in the DOM — necessary because
    // below-fold sections on the homepage are dynamically loaded and
    // won't be present immediately after a cross-page navigation.
    const scrollToEl = (tries = 0) => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }
      if (tries < 20) setTimeout(() => scrollToEl(tries + 1), 100);
    };

    // Small initial delay so the page has started rendering before we look.
    setTimeout(() => scrollToEl(), 80);
  }, [pathname]);

  return null;
}
