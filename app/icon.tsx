import { ImageResponse } from "next/og";

// ─── Favicon (32×32) ──────────────────────────────────────────────────
// Compact version of the Resonate chevron mark — the filled square
// "source" + the strongest chevron, dropping the two faded ones since
// they disappear at 32px anyway. Brand blue on white so the icon reads
// on light and dark browser chromes alike.

export const runtime = "edge";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <svg width="28" height="24" viewBox="0 0 24 20" fill="none">
          <rect x="3" y="7" width="6" height="6" fill="#3b82f6" />
          <path
            d="M 11 5 L 14 10 L 11 15"
            stroke="#3b82f6"
            strokeWidth="2.2"
            fill="none"
          />
          <path
            d="M 15.5 3 L 19 10 L 15.5 17"
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
            opacity="0.55"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
