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
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        // "any" (not "maskable"): these were generated without the ~20% safe-zone
        // padding Android crops to for maskable icons, so declaring them maskable
        // would clip the logo on adaptive-icon launchers.
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
