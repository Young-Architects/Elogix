/**
 * opengraph-image — the social-share card shown when the site link is pasted
 * anywhere that reads Open Graph tags (WhatsApp, iMessage, Slack, LinkedIn,
 * Facebook, Discord, etc.). Next.js wires this file into `og:image` +
 * `og:image:width/height/alt` automatically for the root route.
 *
 * It's a generated 1200×630 PNG (the ratio social platforms expect) rather than
 * the raw transparent logo, which the various apps render inconsistently on
 * black/white. The white wordmark sits on the site's dark brand background.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Expendesk — Expense Intelligence for Finance Teams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Inline the logo as a data URI so satori can embed it without a network hop.
  const logo = await readFile(join(process.cwd(), "public", "logo-white.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050816",
          position: "relative",
        }}
      >
        {/* Soft brand glow behind the logo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(650px 420px at 50% 42%, rgba(124,58,237,0.38), rgba(5,8,22,0) 62%)",
          }}
        />

        {/* White wordmark — 900×290 source, scaled to keep aspect ratio */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={730} height={235} alt="Expendesk" />

        <div
          style={{
            marginTop: 30,
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(199,210,254,0.78)",
          }}
        >
          Expense Intelligence for Finance Teams
        </div>

        {/* Brand-gradient accent underline */}
        <div
          style={{
            marginTop: 34,
            width: 120,
            height: 6,
            borderRadius: 999,
            background:
              "linear-gradient(90deg, #6366f1 0%, #8b5cf6 60%, #a78bfa 100%)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
