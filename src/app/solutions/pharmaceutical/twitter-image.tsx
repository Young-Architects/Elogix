/**
 * twitter-image — /solutions/pharmaceutical
 *
 * Re-exports this route's Open Graph card so X shows the same page-specific
 * preview. Without this file the segment would fall back to the site-wide
 * twitter-image, leaving og:image and twitter:image showing different cards
 * for the same URL.
 */
export { default, alt, size, contentType } from "./opengraph-image";
