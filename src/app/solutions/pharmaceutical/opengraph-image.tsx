/**
 * opengraph-image — /solutions/pharmaceutical
 *
 * The SEO brief asked for `og:image` at
 * `https://www.expendesk.com/og/solutions-pharmaceutical.png`. That file does
 * not exist and hardcoding the tag would have pointed every share of this page
 * at a 404. Generating the card here instead gives the brief what it actually
 * wanted — a page-specific share image rather than the generic site one — and
 * Next wires `og:image`, `og:image:width`, `og:image:height`, `og:image:type`
 * and `og:image:alt` automatically for this route segment. No manual tags, and
 * no path that can rot.
 *
 * Rendered at request/build time by satori, so note its constraints: flexbox
 * only, every element that contains more than one child needs an explicit
 * `display`, and there is no access to the network — the logo is inlined as a
 * data URI.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Becomes `og:image:alt` / `twitter:image:alt`. */
export const alt =
  "Expendesk expense management for pharmaceutical field force teams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function PharmaceuticalOpengraphImage() {
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
          justifyContent: "center",
          background: "#050816",
          position: "relative",
          padding: "0 88px",
        }}
      >
        {/* Brand glow, offset left so it sits behind the copy rather than
            washing out the centre as the site-wide card does. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(700px 460px at 22% 40%, rgba(124,58,237,0.40), rgba(5,8,22,0) 64%)",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={330} height={85} alt="Expendesk" />

        <div
          style={{
            marginTop: 34,
            fontSize: 62,
            fontWeight: 700,
            lineHeight: 1.12,
            color: "#ffffff",
            maxWidth: 900,
            display: "flex",
          }}
        >
          Expense management for pharmaceutical teams
        </div>

        <div
          style={{
            marginTop: 26,
            fontSize: 29,
            lineHeight: 1.4,
            color: "rgba(199,210,254,0.82)",
            maxWidth: 880,
            display: "flex",
          }}
        >
          Medical rep claims, policy compliance and audit-ready records.
        </div>

        <div
          style={{
            marginTop: 38,
            width: 132,
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
