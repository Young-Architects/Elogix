/**
 * opengraph-image — /solutions/pharmaceutical
 *
 * Uses the shared card from `@/lib/og-card` so this route's preview matches the
 * site-wide one in design while carrying its own copy. `twitter-image.tsx`
 * re-exports it, so og:image and twitter:image never show different cards for
 * the same URL.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ogCard } from "@/lib/og-card";

export const alt =
  "Expendesk for pharmaceutical companies — medical rep claims, policy compliance and audit-ready expense records";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function PharmaceuticalOpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public", "logo-white.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    ogCard({
      eyebrow: "Pharma solution",
      headline: "Expense management for pharma teams.",
      sub: "Medical rep claims, field-force travel and audit-ready records in one platform.",
      chips: [
        "Medical rep claims",
        "Fuel & travel",
        "Policy compliance",
        "Audit-ready records",
      ],
      logoSrc,
    }),
    { ...size },
  );
}
