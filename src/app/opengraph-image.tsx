/**
 * opengraph-image — the card shown wherever the site link is pasted
 * (WhatsApp, Slack, iMessage, LinkedIn, Facebook, Discord, X). Next wires this
 * file into `og:image` + `og:image:width/height/alt` automatically for the
 * root route, and `twitter-image.tsx` re-exports it so both cards match.
 *
 * The layout lives in `@/lib/og-card` and is shared with the per-route cards,
 * so there is one design to maintain rather than one per page.
 *
 * ── What changed and why ──
 *
 * This used to render the white wordmark and a tagline, centred on the dark
 * brand field. It looked tidy and said nothing. A pasted link is frequently the
 * first and only impression — the card has to answer "what is this", not "who
 * made this" — so it now leads with the product proposition and shows a
 * schematic of the thing itself, with the wordmark reduced to a signature.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ogCard } from "@/lib/og-card";

/** Becomes `og:image:alt` / `twitter:image:alt`. Describes the card, which is
 *  what a screen-reader user on a social client actually encounters. */
export const alt =
  "Expendesk — expense management software: automated claims, approvals and real-time spend visibility for finance teams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Inlined as a data URI: satori has no network access, so a remote src
  // silently renders nothing.
  const logo = await readFile(join(process.cwd(), "public", "logo-white.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    ogCard({
      eyebrow: "Expense intelligence",
      // Kept under ~48 characters — satori does not shrink text to fit.
      headline: "Every business expense, under control.",
      sub: "Automated claims, approvals and reimbursements for SME and mid-market finance teams.",
      chips: [
        "Receipt capture",
        "Approval workflows",
        "Policy compliance",
        "Real-time spend visibility",
      ],
      logoSrc,
    }),
    { ...size },
  );
}
