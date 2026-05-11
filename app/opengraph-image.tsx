import { ImageResponse } from "next/og";

// ─── Open Graph image — 1200×630 ───────────────────────────────────────
// Renders a static-but-Edge-generated PNG that visually echoes the hero:
// off-white paper, the Resonate wordmark top-left, the H1 with a single
// blue highlight word, a simplified product waveform below, and a brand-
// blue CTA pill in the corner. Designed to read at thumbnail size on
// Twitter / LinkedIn / Slack / iMessage cards.
//
// Edge runtime is required so `ImageResponse` can render without a Node
// canvas dependency.

export const runtime = "edge";

export const alt =
  "Resonate — The voice API for real-time agents. Streaming speech, function calling, and telephony in one SDK.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// ─── Token mirrors of the site palette ─────────────────────────────────
// Duplicated here intentionally — the edge runtime can't reach into the
// client-component PALETTE objects without dragging the whole tree.
const PAGE       = "#fafafa";
const INK        = "#0a0a10";
const INK_SOFT   = "#3a3a48";
const INK_SUBTLE = "#737386";
const RING       = "rgba(10,10,16,0.10)";
const BLUE       = "#3b82f6";
const BLUE_SOFT  = "#93c5fd";
const BLUE_DEEP  = "#2563eb";

export default async function Image() {
  // Precompute 56 waveform bar heights with the same envelope + seeded
  // jitter the live hero uses, so the OG card reads as a continuation of
  // the page rather than a different graphic.
  const N = 56;
  let s = 0x9e3779b9;
  const rand = () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let r = Math.imul(s ^ (s >>> 15), 1 | s);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  const bars = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const sigma = 0.22;
    const env = Math.exp(-Math.pow((t - 0.5) / sigma, 2));
    const jitter = 0.45 + rand() * 0.55;
    return Math.max(0.04, Math.min(1, env * jitter));
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PAGE,
          padding: "72px 96px",
          fontFamily: "Geist, system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top bar: wordmark on the left, status pill on the right */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Wordmark — chevron mark + "Resonate" */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="36" height="30" viewBox="0 0 24 20" fill="none">
              <rect x="3" y="7" width="6" height="6" fill={BLUE} />
              <path
                d="M 11 5 L 14 10 L 11 15"
                stroke={BLUE}
                strokeWidth="1.8"
                fill="none"
                opacity="0.95"
              />
              <path
                d="M 15.5 3 L 19 10 L 15.5 17"
                stroke={BLUE}
                strokeWidth="1.6"
                fill="none"
                opacity="0.55"
              />
              <path
                d="M 20 1 L 23.5 10 L 20 19"
                stroke={BLUE}
                strokeWidth="1.4"
                fill="none"
                opacity="0.25"
              />
            </svg>
            <span
              style={{
                fontSize: 36,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: INK,
              }}
            >
              Resonate
            </span>
          </div>

          {/* Status pill — small mono caption */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              border: `1px solid ${RING}`,
              fontSize: 18,
              color: INK_SUBTLE,
              fontFamily: "Geist Mono, ui-monospace, monospace",
              letterSpacing: "0.02em",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                background: BLUE,
                display: "block",
              }}
            />
            voice API · live
          </div>
        </div>

        {/* Headline block — centered vertically in the remaining space */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            marginTop: 24,
          }}
        >
          <div
            style={{
              fontSize: 108,
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              color: INK,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: "0 24px",
              maxWidth: 1000,
            }}
          >
            <span>The voice API for</span>
            <span style={{ color: BLUE }}>real-time</span>
            <span>agents.</span>
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 28,
              lineHeight: 1.45,
              color: INK_SOFT,
              letterSpacing: "-0.012em",
              maxWidth: 880,
            }}
          >
            Streaming speech, function calling, and telephony in one SDK.
            Agents answer in 90 ms and switch languages mid-call.
          </div>
        </div>

        {/* Bottom band: waveform on the left, CTA pill on the right */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 64,
            marginTop: 32,
          }}
        >
          {/* Waveform — mirrors the hero strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              height: 96,
              flex: 1,
            }}
          >
            {bars.map((h, i) => {
              const t = i / (N - 1);
              let bg = BLUE;
              if (t < 0.08 || t > 0.92) bg = "rgba(10,10,16,0.22)";
              else if (t < 0.30 || t > 0.78) bg = BLUE_SOFT;
              else if (t < 0.55) bg = BLUE;
              else bg = BLUE_DEEP;
              return (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: `${h * 100}%`,
                    background: bg,
                  }}
                />
              );
            })}
          </div>

          {/* CTA pill — brand-blue */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 28px",
              background: BLUE,
              color: "#ffffff",
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "-0.012em",
              flexShrink: 0,
            }}
          >
            Try a live agent →
          </div>
        </div>

        {/* Bottom-left URL anchor */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 96,
            fontSize: 16,
            color: INK_SUBTLE,
            fontFamily: "Geist Mono, ui-monospace, monospace",
            letterSpacing: "0.02em",
          }}
        >
          resonateai2.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
