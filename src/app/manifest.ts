/**
 * Web App Manifest — served at /manifest.webmanifest.
 *
 * This covers the "installed app" surfaces that <link rel="icon"> cannot:
 * the Android home screen, the Chrome task switcher, and the desktop PWA
 * window. Browser-tab icons are handled separately by the file conventions
 * in this same directory (favicon.ico / icon0.png / icon1.png / apple-icon.png).
 *
 * The icons below point at /public rather than the app-directory icons on
 * purpose: files in app/ are emitted with hashed, content-addressed URLs, and
 * a manifest needs stable paths that stay valid across deploys.
 *
 * Note: `theme_color` is intentionally identical to `viewport.themeColor` in
 * layout.tsx — if the two disagree, an installed PWA flashes one colour on the
 * splash screen and another once the page paints.
 */
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Expendesk — Expense Intelligence Platform for Finance Teams",
    short_name: "Expendesk",
    description:
      "Track expenses, automate reimbursements, enforce policies, and gain real-time visibility into company spending — all from one powerful platform built for SMEs.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f9ff",
    theme_color: "#f8f9ff",
    icons: [
      /**
       * Two sets, because Android uses them for different things.
       *
       * `any` is drawn as-is (task switcher, install prompt, older launchers).
       * `maskable` is cropped by the launcher to whatever shape the device
       * uses — circle, squircle, rounded square — so the mark has to sit
       * inside a centred "safe zone" circle 80% of the canvas wide, and the
       * background must reach every edge or the crop reveals bare corners.
       *
       * Both sets are now opaque. The previous ones were transparent, which
       * is why this file could only offer `any`: a transparent maskable icon
       * gets composited on whatever the launcher chooses, commonly black.
       * `scripts/generate-icons.mjs` regenerates both from one master.
       */
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/maskable-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
