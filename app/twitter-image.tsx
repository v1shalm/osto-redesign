// Twitter Card image — reuses the OG renderer at 1200×630. Twitter
// crops to 2:1 by default on `summary_large_image`, which matches our
// canvas; the OG image works as-is.
//
// Route segment config (`runtime`, `size`, `contentType`, `alt`) must be
// declared as plain exports in this file — Next can't statically parse
// them when re-exported, so we restate them here instead of importing.

import OpengraphImage from "./opengraph-image";

export const runtime = "edge";
export const alt =
  "Resonate — The voice API for real-time agents. Streaming speech, function calling, and telephony in one SDK.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return OpengraphImage();
}
