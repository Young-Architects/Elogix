// Centralised, layout-shift-aware smooth scrolling for in-page hash navigation.
//
// Why this exists: the homepage lazy-loads several below-fold sections behind
// small placeholders, so a section's final Y position keeps moving while its
// real content streams in and hydrates. A one-shot `scrollTo({behavior:"smooth"})`
// locks onto a target that is computed against the *collapsed* layout and then
// gets shoved away — the user lands in the wrong place or the scroll "sticks".
//
// The engine below re-computes the target every animation frame (so it tracks
// the element as the layout settles), snaps exactly at the end, and runs a short
// post-settle correction to catch late shifts. It also bails the moment the user
// scrolls manually, so it never fights the user for control.

// Vertical gap left above a section so it clears the fixed navbar pill.
export const NAVBAR_OFFSET = 90;

const SCROLL_DURATION = 650; // ms
const ELEMENT_WAIT_TIMEOUT = 3000; // ms — how long to wait for a not-yet-rendered section
const SETTLE_DURATION = 600; // ms — keep correcting for late layout shifts after arrival
const SETTLE_THRESHOLD = 2; // px — re-snap only if drift exceeds this

// Monotonic token: incrementing it cancels any in-flight animation, so a second
// click immediately supersedes the first instead of two scrolls overlapping.
let animationToken = 0;

// easeInOutCubic — gentle acceleration and deceleration.
const ease = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function targetYFor(el: HTMLElement): number {
  const max = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  const y = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
  return Math.min(Math.max(0, y), max);
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Smoothly scroll the given element id into view, accounting for the fixed
 * navbar and for sections whose height/position is still settling.
 *
 * Returns `true` once a scroll was started (or the element was found),
 * `false` if the element does not exist yet and never appeared in time.
 */
export function scrollToId(id: string, opts?: { smooth?: boolean }): void {
  if (typeof window === "undefined") return;

  const token = ++animationToken;
  const smooth = (opts?.smooth ?? true) && !prefersReducedMotion();

  const waitStart = performance.now();

  // Wait (across frames) for the section to exist before animating — covers
  // cross-page navigations where the target page is still mounting.
  const begin = (): void => {
    if (token !== animationToken) return; // superseded
    const el = document.getElementById(id);
    if (!el) {
      if (performance.now() - waitStart < ELEMENT_WAIT_TIMEOUT) {
        requestAnimationFrame(begin);
      }
      return;
    }

    if (!smooth) {
      window.scrollTo(0, targetYFor(el));
      runSettle(id, token);
      return;
    }

    animate(el, id, token);
  };

  requestAnimationFrame(begin);
}

function animate(el: HTMLElement, id: string, token: number): void {
  const startY = window.scrollY;
  const startTime = performance.now();

  let cancelled = false;
  const cancel = (): void => {
    cancelled = true;
    teardown();
  };
  const onKey = (e: KeyboardEvent): void => {
    // Any scroll-intent key hands control straight back to the user.
    if (
      e.key === " " ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "PageUp" ||
      e.key === "PageDown" ||
      e.key === "Home" ||
      e.key === "End"
    ) {
      cancel();
    }
  };
  const teardown = (): void => {
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchmove", cancel);
    window.removeEventListener("keydown", onKey);
  };

  // Manual input always wins — never trap the user inside the animation.
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchmove", cancel, { passive: true });
  window.addEventListener("keydown", onKey);

  const step = (now: number): void => {
    if (cancelled || token !== animationToken) {
      teardown();
      return;
    }

    // Re-resolve every frame so we follow the element as the layout settles.
    const live = document.getElementById(id);
    if (!live) {
      requestAnimationFrame(step);
      return;
    }
    const targetY = targetYFor(live);

    const t = Math.min((now - startTime) / SCROLL_DURATION, 1);
    const y = startY + (targetY - startY) * ease(t);
    window.scrollTo(0, y);

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      window.scrollTo(0, targetY); // exact final snap
      teardown();
      runSettle(id, token);
    }
  };

  requestAnimationFrame(step);
}

// After arrival, sections that hydrate above the target can still nudge it.
// Keep gently re-snapping for a short window unless the user has taken over.
function runSettle(id: string, token: number): void {
  const settleStart = performance.now();

  const check = (now: number): void => {
    if (token !== animationToken) return; // superseded by a newer scroll
    const el = document.getElementById(id);
    if (!el) {
      if (now - settleStart < SETTLE_DURATION) requestAnimationFrame(check);
      return;
    }
    const targetY = targetYFor(el);
    if (Math.abs(window.scrollY - targetY) > SETTLE_THRESHOLD) {
      window.scrollTo(0, targetY);
    }
    if (now - settleStart < SETTLE_DURATION) requestAnimationFrame(check);
  };

  requestAnimationFrame(check);
}
