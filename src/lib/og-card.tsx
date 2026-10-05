/**
 * Shared Open Graph card layout.
 *
 * ── Why this replaced a logo lockup ──
 *
 * The previous card was the wordmark and a tagline centred on a dark field. It
 * was clean, and it told a reader nothing. When someone pastes the link into
 * WhatsApp or Slack, the card is the pitch — often the only thing seen before
 * the decision to tap — and a logo answers "who" while the reader is asking
 * "what is this and why would I care".
 *
 * This card answers that: a headline, a line of value copy, and the four
 * capabilities that matter, beside a suggestion of the product itself. The
 * brand is still there, sized as a signature rather than as the subject.
 *
 * ── Working inside satori ──
 *
 * `next/og` renders through satori, which is not a browser. The constraints
 * that actually bite:
 *
 *  - Flexbox only. No grid, no float, no position other than absolute.
 *  - Every element with more than one child needs an explicit `display`.
 *  - No external fetches — images must be inlined as data URIs by the caller.
 *  - `background` gradients work; `box-shadow` and `filter` are unreliable, so
 *    depth here comes from borders and layered translucent fills instead.
 *
 * Text is not auto-fitted, so `headline` should stay within about 48
 * characters or it will wrap past the panel. The call sites keep to that.
 */

export interface OgCardInput {
  /** Small uppercase label above the headline. */
  eyebrow: string;
  /** The main line. Keep to ~48 characters; satori will not shrink it. */
  headline: string;
  /** One sentence of value copy beneath the headline. */
  sub: string;
  /** Four short capability labels. More than four crowds the column. */
  chips: readonly string[];
  /** The white wordmark, already inlined as a data URI by the route. */
  logoSrc: string;
}

/** Rows drawn in the product panel. Status colour is picked per row. */
const PANEL_ROWS = [
  { label: "Client dinner · Mumbai", amount: "₹4,280", tone: "ok" },
  { label: "Flight · BLR → DEL", amount: "₹12,650", tone: "ok" },
  { label: "Hotel · 3 nights", amount: "₹18,900", tone: "warn" },
] as const;

const TONES = {
  ok: { dot: "#34d399", chip: "rgba(52,211,153,0.14)", text: "#6ee7b7", label: "Approved" },
  warn: { dot: "#fbbf24", chip: "rgba(251,191,36,0.14)", text: "#fcd34d", label: "Review" },
} as const;

export function ogCard({ eyebrow, headline, sub, chips, logoSrc }: OgCardInput) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#050816",
        position: "relative",
      }}
    >
      {/* Brand glow, offset left so it sits behind the copy rather than
          washing out the middle of the card. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(760px 520px at 18% 30%, rgba(124,58,237,0.42), rgba(5,8,22,0) 66%)",
        }}
      />
      {/* A second, cooler glow behind the panel so the right half is not flat. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(520px 420px at 88% 78%, rgba(99,102,241,0.26), rgba(5,8,22,0) 70%)",
        }}
      />

      {/* ── Left column: the pitch ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          /* Both columns are explicitly sized and pinned with flexShrink/
             flexGrow 0. Satori sizes a flex item to its content first, so a
             `flexGrow: 1` panel grew past the 1200px canvas and clipped every
             amount on the right edge. Fixed widths that sum to 1200 are the
             only reliable way to keep content inside the frame here. */
          width: 648,
          flexShrink: 0,
          flexGrow: 0,
          padding: "0 0 0 72px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={228} height={59} alt="Expendesk" />

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 19,
            letterSpacing: 3.4,
            textTransform: "uppercase",
            color: "rgba(167,139,250,0.95)",
            fontWeight: 600,
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 14,
            fontSize: 54,
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#ffffff",
            maxWidth: 600,
          }}
        >
          {headline}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 24,
            lineHeight: 1.45,
            color: "rgba(203,213,225,0.9)",
            maxWidth: 590,
          }}
        >
          {sub}
        </div>

        {/* Capability chips — the "what you get" line. */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: 30,
            maxWidth: 556,
          }}
        >
          {chips.map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: 10,
                marginBottom: 10,
                padding: "9px 16px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.26)",
                background: "rgba(148,163,184,0.09)",
                color: "rgba(226,232,240,0.95)",
                fontSize: 19,
                fontWeight: 500,
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right column: a suggestion of the product ──
          Not a screenshot — satori cannot take one, and a stale screenshot
          rots. This is a schematic of the thing the copy describes: claims
          arriving, each with a status, totalling to a figure. It reads as
          "expense software" in the half-second a card gets. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: 552,
          flexShrink: 0,
          flexGrow: 0,
          paddingRight: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            borderRadius: 20,
            border: "1px solid rgba(148,163,184,0.22)",
            background: "rgba(15,23,42,0.72)",
            padding: 24,
          }}
        >
          {/* Panel header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 16,
              borderBottom: "1px solid rgba(148,163,184,0.18)",
            }}
          >
            <div style={{ display: "flex", fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>
              Pending approvals
            </div>
            <div
              style={{
                display: "flex",
                padding: "5px 12px",
                borderRadius: 999,
                background: "rgba(139,92,246,0.18)",
                color: "#c4b5fd",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              3 new
            </div>
          </div>

          {/* Claim rows */}
          {PANEL_ROWS.map((row) => {
            const tone = TONES[row.tone];
            return (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      width: 9,
                      height: 9,
                      borderRadius: 999,
                      background: tone.dot,
                      marginRight: 11,
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", fontSize: 16, color: "#e2e8f0" }}>
                      {row.label}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        marginTop: 3,
                        fontSize: 13,
                        color: tone.text,
                      }}
                    >
                      {tone.label}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#f1f5f9",
                  }}
                >
                  {row.amount}
                </div>
              </div>
            );
          })}

          {/* Footer total */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid rgba(148,163,184,0.18)",
            }}
          >
            <div style={{ display: "flex", fontSize: 15, color: "rgba(148,163,184,0.95)" }}>
              Reimbursed this week
            </div>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 800, color: "#ffffff" }}>
              ₹35,830
            </div>
          </div>
        </div>
      </div>

      {/* Brand accent along the bottom edge. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 7,
          background:
            "linear-gradient(90deg, #6366f1 0%, #8b5cf6 52%, #d946ef 100%)",
        }}
      />
    </div>
  );
}
