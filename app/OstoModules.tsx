"use client";

/**
 * Resonate — 2×2 bento feature grid.
 *
 * Four tiles, each animating a product-UI fragment on loop:
 *   1. Streaming console — `> resonate.stream("hello")` with a live
 *      waveform and "speaking · · ·" indicator.
 *   2. Phoneme alignment — IPA token row where the active token + a
 *      playhead step from token 1 → 7 in sequence; waveform breathes.
 *   3. Voice cloning — multi-step status cycle (scanning → building →
 *      cloning → ready), with the voice card highlighting on completion.
 *   4. Two-channel transcript — 3 turn-pairs cycle (caller speaks →
 *      agent responds with a tool call).
 *
 * Tiles share inner hairlines and meet at a cross with four small
 * inset notches (Vite-style pinwheel detail). Animations are
 * transform-only / opacity-only and respect prefers-reduced-motion.
 */

// ─── PALETTE — single source of truth (mirrors OstoHeroV2) ────────────
// Edit values here to re-theme the bento. Every other token is derived.
const PALETTE = {
  page:        "#fafafa",
  surface:     "#ffffff",
  panel:       "#f4f4f6",
  ink:         "#0a0a10",
  inkStrong:   "#1a1a22",
  inkSoft:     "#3a3a48",
  inkMid:      "#5a5a6e",
  inkSubtle:   "#737386",
  inkFaint:    "#a0a0b0",
  ring:        "rgba(10,10,16,0.08)",
  ringStrong:  "rgba(10,10,16,0.14)",
  ringFaint:   "rgba(10,10,16,0.04)",
  // Brand. Only one accent — everything else is white / grays / black.
  blue:        "#3b82f6",
  blueDeep:    "#2563eb",
  blueDark:    "#1d4ed8",
  // Legacy slots kept as aliases so existing illustrations don't break.
  // All four resolve to the same brand blue now.
  cyan:        "#3b82f6",
  violet:      "#3b82f6",
  pink:        "#3b82f6",
};

const T = {
  ink:        PALETTE.ink,
  inkStrong:  PALETTE.inkStrong,
  inkSoft:    PALETTE.inkSoft,
  inkMid:     PALETTE.inkMid,
  inkSubtle:  PALETTE.inkSubtle,
  inkFaint:   PALETTE.inkFaint,
  inkLine:    PALETTE.ring,
  panel:      PALETTE.panel,
  surface:    PALETTE.surface,
  ring:       PALETTE.ring,
  hairline:   PALETTE.ringFaint,
};

// Single brand accent. Within illustrations we vary value (light blue
// tint vs full blue) and lean on gray for the quietest layer, so a
// mono palette still has visual depth.
const BRAND        = PALETTE.blue;     // electric blue (primary)
const BRAND_SOFT   = "#93c5fd";        // light blue tint — secondary fills
const BRAND_DEEP   = PALETTE.blueDeep; // darker blue — emphasis

const E = {
  card: `0 0 0 1px ${PALETTE.ring}, 0 1px 2px rgba(10,10,16,0.04)`,
  cardElev:
    `0 0 0 1px ${PALETTE.ring}, 0 8px 24px -12px rgba(10,10,16,0.10), 0 24px 48px -24px rgba(10,10,16,0.10)`,
};

// V2 page-rail tokens — duplicated locally so the bento can anchor
// edge-to-edge to the same rails as HowItWorks and FinalCTA.
const RAIL_INSET = "max(24px, calc((100vw - 1240px) / 2))";
const RAIL_STROKE = PALETTE.ring;

// ─── Section ──────────────────────────────────────────────────────────
export function OstoModules() {
  return (
    <section className="pt-4" style={{ color: T.ink }}>
      {/* Heading — left-aligned for consistency with the rest of the
          section headings on the page. */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
        <h2
          className="max-w-[780px] text-balance text-[32px] leading-[38px] tracking-[-0.8px] md:text-[44px] md:leading-[48px] md:tracking-[-1.1px]"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            color: T.ink,
          }}
        >
          Four pieces of the voice agent,
          handled inside one&nbsp;<span style={{ color: BRAND }}>SDK</span>.
        </h2>
        <p
          className="mt-5 max-w-[560px] text-pretty text-[16px] leading-[24px] md:text-[17px] md:leading-[26px]"
          style={{ color: T.inkSoft, letterSpacing: "-0.18px" }}
        >
          Streaming speech, voice cloning, turn-taking, and bi-directional
          audio on a single stream you bill from one&nbsp;vendor.
        </p>
      </div>

      {/* Bento — full-bleed: extends edge-to-edge to V2's global page rails.
          On phone the page rails are hidden, so the bento goes fully
          edge-to-edge (mx-0). On md+ we inset by RAIL_INSET + 1px so
          the rails read as the bento's outer frame. */}
      <div
        className="osto-rail-frame relative mt-12 overflow-hidden md:mt-16"
        style={{
          background: T.surface,
          boxShadow: `inset 0 1px 0 0 ${RAIL_STROKE}, inset 0 -1px 0 0 ${RAIL_STROKE}`,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <BentoCell side="tl">
            <BentoCopy
              title="Streaming on one socket"
              desc="TTS, STT, and turn-taking share one stream. Your agent answers the moment the first token is ready."
            />
            <BentoIllusContainer>
              <IllusWaveform accent={BRAND} />
            </BentoIllusContainer>
          </BentoCell>

          <BentoCell side="tr">
            <BentoCopy
              title="Phoneme-aligned speech"
              desc="The model paces itself on syllables rather than tokens, so emphasis lands on the words you'd stress in conversation."
            />
            <BentoIllusContainer>
              <IllusPhoneme accent={BRAND} />
            </BentoIllusContainer>
          </BentoCell>

          <BentoCell side="bl">
            <BentoCopy
              title="Voice cloning in 30 seconds"
              desc="Upload a clip, get a voice that carries its pitch and prosody across all 32 languages we support."
            />
            <BentoIllusContainer>
              <IllusFingerprint accent={BRAND} />
            </BentoIllusContainer>
          </BentoCell>

          <BentoCell side="br">
            <BentoCopy
              title="Talks and listens at once"
              desc="Your agent keeps the inbound stream open while it speaks. When the caller cuts in, it yields and picks back up where it left&nbsp;off."
            />
            <BentoIllusContainer>
              <IllusConversation accent={BRAND} />
            </BentoIllusContainer>
          </BentoCell>
        </div>

        {/* Intersection notches — four small inset triangles at the
            inner cross. Each notch is a square pinned to one inner
            corner with a panel-colored triangle rotated to point
            inward, creating the Vite "pinwheel" detail. Only visible
            on md+ where the 2×2 cross exists. */}
        <BentoNotches />
      </div>
    </section>
  );
}

// ─── Bento primitives ─────────────────────────────────────────────────

/**
 * BentoCell — a 1/4 cell of the 2×2 frame. Draws inner hairlines on the
 * edges that face the cross (right for left cells, bottom for top cells)
 * so tiles share borders without doubling up. The outer frame has its
 * own hairline ring already.
 */
function BentoCell({
  side,
  children,
}: {
  side: "tl" | "tr" | "bl" | "br";
  children: React.ReactNode;
}) {
  // Inset hairlines on the edges that face the cross
  const isTop = side === "tl" || side === "tr";
  const isLeft = side === "tl" || side === "bl";
  const shadows: string[] = [];
  if (isTop) shadows.push(`inset 0 -0.5px 0 0 ${T.hairline}`); // bottom edge
  if (isLeft) shadows.push(`inset -0.5px 0 0 0 ${T.hairline}`); // right edge

  return (
    <article
      className="relative flex min-h-[440px] flex-col overflow-hidden"
      style={{
        boxShadow: shadows.join(", "),
      }}
    >
      <div className="relative flex h-full w-full flex-col">{children}</div>
    </article>
  );
}

function BentoCopy({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="px-7 pt-8 md:px-12 md:pt-12">
      <h3
        className="text-balance text-[20px] font-medium leading-[26px] md:text-[24px] md:leading-[30px]"
        style={{
          fontFamily: "var(--font-sans)",
          color: T.ink,
          letterSpacing: "-0.5px",
        }}
      >
        {title}
      </h3>
      <p
        className="mt-3 max-w-[48ch] text-pretty text-[14px] leading-[22px] md:text-[15px] md:leading-[24px]"
        style={{ color: T.inkSoft, letterSpacing: "-0.15px" }}
      >
        {desc}
      </p>
    </div>
  );
}

function BentoIllusContainer({ children }: { children: React.ReactNode }) {
  // 260px tall on every breakpoint. On phones the inner SVG (600×220
  // viewBox) is then scaled up ~1.7× via the .osto-bento-illus CSS
  // hook so the artwork visually fills the cell instead of collapsing
  // to a thin fit-to-width strip; overflow-hidden here crops the
  // horizontal overflow.
  return (
    <div className="osto-bento-illus relative mt-auto h-[260px] w-full overflow-hidden">
      {children}
    </div>
  );
}

/**
 * BentoNotches — Vite-style intersection detail. Four small inset
 * triangles meet at the inner cross of the 2×2 grid. Each notch is
 * a panel-colored triangle pointing outward from the cross center,
 * which gives the seam a 4-petal pinwheel read.
 *
 * Hidden on mobile (single-column) since the cross only exists at md+.
 */
function BentoNotches() {
  const size = 14; // px — notch size
  // Each triangle is built with CSS borders so it inherits color cleanly.
  // The container is centered absolutely at the grid's cross point.
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 hidden md:block"
      style={{
        width: size * 2,
        height: size * 2,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Top-left tile's bottom-right corner — triangle pointing UP+LEFT */}
      <span
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          borderTop: `${size}px solid ${PALETTE.page}`,
          borderRight: `${size}px solid transparent`,
          // Hairline edge so the notch reads as a cut, not a paste
          filter: `drop-shadow(-0.5px 0.5px 0 ${T.hairline})`,
        }}
      />
      {/* Top-right tile's bottom-left corner — triangle pointing UP+RIGHT */}
      <span
        className="absolute"
        style={{
          right: 0,
          top: 0,
          width: 0,
          height: 0,
          borderTop: `${size}px solid ${PALETTE.page}`,
          borderLeft: `${size}px solid transparent`,
          filter: `drop-shadow(0.5px 0.5px 0 ${T.hairline})`,
        }}
      />
      {/* Bottom-left tile's top-right corner — triangle pointing DOWN+LEFT */}
      <span
        className="absolute"
        style={{
          left: 0,
          bottom: 0,
          width: 0,
          height: 0,
          borderBottom: `${size}px solid ${PALETTE.page}`,
          borderRight: `${size}px solid transparent`,
          filter: `drop-shadow(-0.5px -0.5px 0 ${T.hairline})`,
        }}
      />
      {/* Bottom-right tile's top-left corner — triangle pointing DOWN+RIGHT */}
      <span
        className="absolute"
        style={{
          right: 0,
          bottom: 0,
          width: 0,
          height: 0,
          borderBottom: `${size}px solid ${PALETTE.page}`,
          borderLeft: `${size}px solid transparent`,
          filter: `drop-shadow(0.5px -0.5px 0 ${T.hairline})`,
        }}
      />
      {/* Center accent square — focal point at the cross, glowing */}
      <span
        className="absolute left-1/2 top-1/2"
        style={{
          width: 4,
          height: 4,
          background: BRAND,
          transform: "translate(-50%, -50%)",
          boxShadow: `0 0 0 1.5px ${PALETTE.page}, 0 0 12px ${BRAND}55`,
        }}
      />
    </div>
  );
}

// ═══ ILLUSTRATIONS ════════════════════════════════════════════════════
// Each illustration is an audio-tool surface, monochromatic with brand-
// color accents. No globes, no dials, no generic charts.

// ─── Illustration 1 — Streaming console ───────────────────────────────
// A stylized SDK invocation in a console-style card. Shows the actual
// shape of the developer's experience: a single function call,
// "speaking..." status indicator with a live audio cursor, and a one-line
// waveform that reads as the stream emerging in real time. Reads as
// "what your code does when you call the API," not abstract audio art.
function IllusWaveform({ accent }: { accent: string }) {
  const W = 600;
  const H = 220;
  // Card metrics
  const cardX = 24;
  const cardY = 18;
  const cardW = W - cardX * 2;
  const cardH = H - cardY * 2 - 8;
  // Inner content padding
  const padX = 22;
  const padY = 18;
  // Color shorthands
  const ink = T.ink;
  const sub = T.inkMid;
  const faint = "rgba(10,10,16,0.06)";
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {/* Card surface */}
        <rect
          x={cardX} y={cardY} width={cardW} height={cardH}
          fill="#ffffff"
          stroke={T.ring}
          strokeWidth={1}
        />
        {/* Window chrome: a thin top bar with three dot-buttons */}
        <rect
          x={cardX} y={cardY} width={cardW} height={22}
          fill={T.panel}
        />
        <line
          x1={cardX} y1={cardY + 22} x2={cardX + cardW} y2={cardY + 22}
          stroke={T.ring}
        />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={cardX + 14 + i * 12}
            cy={cardY + 11}
            r={3}
            fill={T.inkFaint}
          />
        ))}
        {/* Tab label — "agent.ts" */}
        <text
          x={cardX + 64} y={cardY + 15}
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill={sub}
          letterSpacing="0.02em"
        >
          agent.ts
        </text>

        {/* Line 1 — prompt arrow */}
        <text
          x={cardX + padX} y={cardY + 22 + padY + 12}
          fontFamily="var(--font-mono)"
          fontSize="13"
          fill={sub}
        >
          {">"}
        </text>
        {/* Line 1 — function call.  resonate.stream() */}
        <text
          x={cardX + padX + 16} y={cardY + 22 + padY + 12}
          fontFamily="var(--font-mono)"
          fontSize="13"
          fill={ink}
        >
          resonate.stream(
        </text>
        <text
          x={cardX + padX + 16 + 130} y={cardY + 22 + padY + 12}
          fontFamily="var(--font-mono)"
          fontSize="13"
          fill={accent}
        >
          {`"hello"`}
        </text>
        <text
          x={cardX + padX + 16 + 184} y={cardY + 22 + padY + 12}
          fontFamily="var(--font-mono)"
          fontSize="13"
          fill={ink}
        >
          )
        </text>

        {/* Line 2 — status row: filled dot + "speaking..." */}
        <circle
          cx={cardX + padX + 4}
          cy={cardY + 22 + padY + 38}
          r={4}
          fill={accent}
        />
        <text
          x={cardX + padX + 16} y={cardY + 22 + padY + 42}
          fontFamily="var(--font-mono)"
          fontSize="12"
          fill={sub}
          letterSpacing="0.02em"
        >
          speaking
        </text>
        {/* Animated dot trail — each dot fades in and out on a 1.2s
            cycle with a 400ms stagger, so the row reads as "...". */}
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            className="bento-speaking-dot"
            cx={cardX + padX + 76 + i * 6}
            cy={cardY + 22 + padY + 38}
            r={1.6}
            fill={sub}
            style={{ animationDelay: `${i * 400}ms` }}
          />
        ))}
        {/* trailing latency tag */}
        <text
          x={cardX + cardW - padX} y={cardY + 22 + padY + 42}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize="11"
          fill={T.inkSubtle}
        >
          92 ms
        </text>

        {/* Live audio waveform — single horizontal row of bars across
            the card, brand-blue at the leading edge fading back to gray
            as it tapers off (it just played those samples). */}
        <g>
          {Array.from({ length: 56 }).map((_, i) => {
            const t = i / 55;
            // Gaussian-ish envelope biased toward the right (current sample)
            const env = Math.exp(-Math.pow((t - 0.78) / 0.32, 2));
            // Deterministic jitter via cheap hash
            const jitter = (Math.sin(i * 11.37) * 0.5 + 0.5) * 0.45 + 0.55;
            const h = Math.max(0.15, env * jitter) * 28;
            const x = cardX + padX + i * ((cardW - padX * 2) / 56);
            const baseY = cardY + cardH - padY - 14;
            // Color: bars near the leading edge are accent; further back
            // they soften toward gray (samples already heard).
            const bg =
              t > 0.85 ? accent : t > 0.6 ? BRAND_SOFT : faint === "rgba(10,10,16,0.06)" ? "rgba(10,10,16,0.18)" : faint;
            return (
              <rect
                key={i}
                className="bento-console-bar"
                x={x}
                y={baseY - h / 2}
                width={3}
                height={h}
                fill={bg}
                style={{
                  // Per-bar stagger — the bars to the right (closer to
                  // the playhead) fire earlier so the height-wave reads
                  // as travelling left → right toward the cursor.
                  transformOrigin: `${x + 1.5}px ${baseY}px`,
                  animationDelay: `${(i * 28) % 1600}ms`,
                }}
              />
            );
          })}
          {/* Playhead — vertical accent line at the leading edge.
              Soft opacity breath so the cursor reads as "live". */}
          <line
            className="bento-console-playhead"
            x1={cardX + padX + ((cardW - padX * 2) / 56) * 47}
            y1={cardY + cardH - padY - 30}
            x2={cardX + padX + ((cardW - padX * 2) / 56) * 47}
            y2={cardY + cardH - padY + 2}
            stroke={accent}
            strokeWidth={1.2}
          />
        </g>
      </svg>
    </div>
  );
}

// ─── Illustration 2 — Phoneme-aligned audio editor ────────────────────
// A horizontal timeline strip styled as a fragment of a speech editor
// (think Praat / Audacity). IPA phoneme tokens span the row; one token
// is "active" (blue fill), and a vertical playhead crosses it. Below
// the strip, a single waveform row visualizes the audio backing those
// phonemes. Reads as "the agent paces on syllables, not tokens."
function IllusPhoneme({ accent }: { accent: string }) {
  // Floating composition — no card frame. Tokens sit directly on the
  // tile background. The blue active-token highlight + playhead STEP
  // from token 1 → 2 → 3 → ... → 7 in sequence on a 7s loop. Each
  // token's "active" window is staggered via animationDelay using a
  // single shared keyframe.
  //
  // The waveform underneath breathes continuously, independent of the
  // playhead — bars scale Y on staggered delays so it reads as live
  // audio for the entire cycle.
  const W = 600;
  const H = 220;
  const phonemes = [
    { label: "h",  from: 0.05, to: 0.16 },
    { label: "ɛ",  from: 0.16, to: 0.30 },
    { label: "l",  from: 0.30, to: 0.44 },
    { label: "oʊ", from: 0.44, to: 0.58 },
    { label: "ð",  from: 0.58, to: 0.70 },
    { label: "ɛ",  from: 0.70, to: 0.84 },
    { label: "ɹ",  from: 0.84, to: 0.95 },
  ];
  const N_TOKENS = phonemes.length;
  // Total cycle is 7s; each token is "active" for 1s.
  const CYCLE_S = 7;
  // Inner rail
  const innerX0 = 64;
  const innerW = W - innerX0 * 2;
  const px = (frac: number) => innerX0 + frac * innerW;
  const tokenY = 52;
  const tokenH = 30;
  const waveY = tokenY + tokenH + 36;
  const waveBars = 64;
  return (
    <div className="absolute inset-0 flex items-center justify-center px-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {/* ── Base phoneme tokens — hairline-ringed, always visible ── */}
        {phonemes.map((p, i) => {
          const x0 = px(p.from);
          const x1 = px(p.to);
          const w = x1 - x0 - 4;
          return (
            <g key={`base-${i}`}>
              <rect
                x={x0}
                y={tokenY}
                width={w}
                height={tokenH}
                fill="transparent"
                stroke={T.ring}
                strokeWidth={1}
              />
              <text
                x={x0 + w / 2}
                y={tokenY + tokenH / 2 + 5}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="14"
                fill={T.ink}
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* ── Per-token active overlay — exactly one is visible at a
             time, cycling in sequence. Each <g> uses the shared
             `bento-phoneme-step` keyframe; their animationDelay is
             offset by -(i/N)*CYCLE so the active highlight advances. ── */}
        {phonemes.map((p, i) => {
          const x0 = px(p.from);
          const x1 = px(p.to);
          const w = x1 - x0 - 4;
          const cx = x0 + w / 2;
          return (
            <g
              key={`active-${i}`}
              className="bento-phoneme-step"
              style={{
                animationDelay: `${-(i / N_TOKENS) * CYCLE_S}s`,
              }}
            >
              {/* Active blue fill */}
              <rect
                x={x0}
                y={tokenY}
                width={w}
                height={tokenH}
                fill={accent}
              />
              {/* White label on top */}
              <text
                x={cx}
                y={tokenY + tokenH / 2 + 5}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="14"
                fill="#ffffff"
              >
                {p.label}
              </text>
              {/* Vertical playhead pinned to this token's center */}
              <line
                x1={cx}
                y1={tokenY - 10}
                x2={cx}
                y2={waveY + 38}
                stroke={accent}
                strokeWidth={1.4}
              />
              <circle cx={cx} cy={tokenY - 10} r={3.5} fill={accent} />
            </g>
          );
        })}

        {/* ── Continuous waveform — bars breathe independently of the
             playhead so the audio reads as "always live." Each bar
             has a per-bar stagger so the breath travels left → right
             across the strip. ── */}
        {Array.from({ length: waveBars }).map((_, i) => {
          const t = i / (waveBars - 1);
          const env = Math.exp(-Math.pow((t - 0.5) / 0.32, 2));
          const jitter = (Math.sin(i * 9.71) * 0.5 + 0.5) * 0.4 + 0.6;
          const h = Math.max(0.18, env * jitter) * 38;
          const x = innerX0 + (i / waveBars) * innerW;
          // Color: alternate blueSoft / accent / blueDeep based on
          // position so the strip has its own depth, no longer
          // dependent on playhead position.
          const bg =
            t < 0.30 || t > 0.78 ? BRAND_SOFT :
            t < 0.55 ? accent : BRAND_DEEP;
          return (
            <rect
              key={`wave-${i}`}
              className="bento-phoneme-bar"
              x={x}
              y={waveY - h / 2}
              width={3}
              height={h}
              fill={bg}
              style={{
                transformOrigin: `${x + 1.5}px ${waveY}px`,
                animationDelay: `${(i * 36) % 1800}ms`,
              }}
            />
          );
        })}

        {/* Bottom timecode anchors */}
        <text x={innerX0} y={H - 14} fontFamily="var(--font-mono)" fontSize="10" fill={T.inkSubtle}>
          0:00
        </text>
        <text x={innerX0 + innerW} y={H - 14} textAnchor="end" fontFamily="var(--font-mono)" fontSize="10" fill={T.inkSubtle}>
          0:01
        </text>
        <text x={W / 2} y={H - 14} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill={accent} letterSpacing="0.04em">
          alignment · 92 ms
        </text>
      </svg>
    </div>
  );
}


// ─── Illustration 3 — Voice cloning card ──────────────────────────────
// A "voice library" panel showing a 30-second sample being uploaded
// (waveform clip + filename), then a "Voice ready" status row with the
// cloned voice surfaced as a selectable item. Reads as "upload → done"
// without resorting to fingerprints, retinal-scan rings, or polar plots.
function IllusFingerprint({ accent }: { accent: string }) {
  // Voice cloning as a multi-step AI process that loops:
  //   Step 1 (0–33%)  Scanning sample      → progress 0→33%, status spinner
  //   Step 2 (33–66%) Building voiceprint  → progress 33→66%
  //   Step 3 (66–95%) Cloning voice        → progress 66→100%
  //   Step 4 (95–100%) Voice ready!        → voice card highlights with
  //                                          a brand-blue ring pulse
  // Loop length 6s. The status label text and progress fill share the
  // same 6s timeline so the readout and bar stay in lockstep.
  const W = 600;
  const H = 220;
  const innerX0 = 48;
  const innerW = W - innerX0 * 2;
  const uploadY = 24;
  const dividerY = uploadY + 64;
  const readyY = dividerY + 24;
  const progressX = innerX0 + 50;
  const progressW = innerW - 50 - 90;
  return (
    <div className="absolute inset-0 flex items-center justify-center px-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {/* ── Upload / process row ── */}
        {/* Source tile — shows .wav, then animates to a spinning icon
             during the "building" phase via a subtle pulse on the tile
             itself (`bento-clone-source`). */}
        <rect
          className="bento-clone-source"
          x={innerX0}
          y={uploadY}
          width={36}
          height={36}
          fill={T.panel}
          stroke={T.ring}
          strokeWidth={1}
          style={{ transformOrigin: `${innerX0 + 18}px ${uploadY + 18}px` }}
        />
        <text
          x={innerX0 + 18}
          y={uploadY + 23}
          textAnchor="middle"
          fontFamily="var(--font-mono)" fontSize="11" fill={T.inkMid}
          letterSpacing="0.02em"
        >
          wav
        </text>

        {/* Filename */}
        <text
          x={innerX0 + 50}
          y={uploadY + 14}
          fontFamily="var(--font-sans)" fontSize="13" fill={T.ink} fontWeight={500}
        >
          sample_ava.wav
        </text>

        {/* Cycling status label — 4 lines stacked, one visible at a time.
             Each shares `bento-clone-status` with a 6s cycle and a
             staggered animationDelay so they appear in order. */}
        {[
          "Scanning sample · · ·",
          "Building voiceprint · · ·",
          "Cloning voice · · ·",
          "Voice ready",
        ].map((label, i) => (
          <text
            key={i}
            className="bento-clone-status"
            x={innerX0 + 50}
            y={uploadY + 30}
            fontFamily="var(--font-mono)" fontSize="10.5"
            fill={i === 3 ? accent : T.inkMid}
            letterSpacing="0.02em"
            style={{ animationDelay: `${-(i / 4) * 6}s` }}
          >
            {label}
          </text>
        ))}

        {/* Progress track */}
        <rect
          x={progressX}
          y={uploadY + 42}
          width={progressW}
          height={3}
          fill={T.ring}
        />
        {/* Progress fill — animates from 0 → 100% via scaleX, then
             resets. Wrapped in its own keyframe so the bar advances
             through the 3 processing phases. */}
        <rect
          className="bento-clone-progress"
          x={progressX}
          y={uploadY + 42}
          width={progressW}
          height={3}
          fill={accent}
          style={{ transformOrigin: `${progressX}px ${uploadY + 43.5}px` }}
        />

        {/* Percentage readout — cycles 0 / 33 / 66 / 100 in step with
             the progress bar. Four <text>s stacked, only one visible
             at a time via `bento-clone-pct` staggered delays. */}
        {["0%", "33%", "66%", "100%"].map((pct, i) => (
          <text
            key={i}
            className="bento-clone-pct"
            x={innerX0 + innerW}
            y={uploadY + 46}
            textAnchor="end"
            fontFamily="var(--font-mono)" fontSize="10.5" fill={accent}
            letterSpacing="0.02em"
            style={{ animationDelay: `${-(i / 4) * 6}s` }}
          >
            {pct}
          </text>
        ))}

        {/* ── Hairline divider ── */}
        <line
          x1={innerX0}
          y1={dividerY}
          x2={innerX0 + innerW}
          y2={dividerY}
          stroke={T.ring}
        />

        {/* ── Voice-ready card.
             The whole card is wrapped in `.bento-clone-ready-card`,
             which gets a brand-blue ring pulse during the last quarter
             of the cycle (when status reads "Voice ready"). */}
        <g
          className="bento-clone-ready-card"
          style={{ transformOrigin: `${innerX0 + innerW / 2}px ${readyY + 18}px` }}
        >
          {/* Card surround — invisible normally, becomes a glowing
              accent ring during the "ready" phase. */}
          <rect
            className="bento-clone-ready-ring"
            x={innerX0 - 6}
            y={readyY - 6}
            width={innerW + 12}
            height={48}
            fill="none"
            stroke={accent}
            strokeWidth={1.5}
            opacity={0}
          />
          {/* Avatar tile */}
          <rect
            x={innerX0}
            y={readyY}
            width={36}
            height={36}
            fill={accent}
          />
          <text
            x={innerX0 + 18}
            y={readyY + 24}
            textAnchor="middle"
            fontFamily="var(--font-sans)" fontSize="16" fill="#ffffff" fontWeight={600}
          >
            A
          </text>

          {/* Voice name + descriptor */}
          <text
            x={innerX0 + 50}
            y={readyY + 14}
            fontFamily="var(--font-sans)" fontSize="13" fill={T.ink} fontWeight={500}
          >
            Ava (cloned)
          </text>
          <text
            x={innerX0 + 50}
            y={readyY + 30}
            fontFamily="var(--font-mono)" fontSize="10.5" fill={T.inkMid}
            letterSpacing="0.02em"
          >
            warm · en-US · 32 languages
          </text>

          {/* Status pill */}
          <rect
            x={innerX0 + innerW - 70}
            y={readyY + 8}
            width={70}
            height={20}
            fill={T.panel}
            stroke={T.ring}
            strokeWidth={1}
          />
          <circle
            className="bento-ready-dot"
            cx={innerX0 + innerW - 60}
            cy={readyY + 18}
            r={3}
            fill={accent}
            style={{ transformOrigin: `${innerX0 + innerW - 60}px ${readyY + 18}px` }}
          />
          <text
            x={innerX0 + innerW - 50}
            y={readyY + 22}
            fontFamily="var(--font-mono)" fontSize="11" fill={T.ink}
            letterSpacing="0.02em"
          >
            Ready
          </text>
        </g>
      </svg>
    </div>
  );
}

// ─── Illustration 4 — Two-channel transcript ──────────────────────────
// A snippet of a live transcript with two channels (AGENT + CALLER)
// sharing the same timeline. Mid-sentence, the caller cuts in — the
// agent's line shows a trailing ellipsis and a small "yielded" tag.
// Reads as turn-taking in flight, not as abstract motion trails.
function IllusConversation({ accent }: { accent: string }) {
  // Looping caller/agent dialogue. Three turn-pairs cycle in sequence
  // over 9 seconds — each pair = 3s. The CALLER row shows what the
  // caller just said; the AGENT row shows the agent's response.
  //
  // Implementation: render all 3 caller bubbles and all 3 agent
  // bubbles stacked at the same coords, then cycle which one is
  // visible via a shared `bento-turn-step` keyframe with staggered
  // delays. Agent bubbles fire 1s after their caller counterpart so
  // each turn-pair reads as "caller speaks → agent responds."
  const W = 600;
  const H = 220;
  const innerX0 = 48;
  const labelW = 64;
  const rowH = 36;
  const rowGap = 14;
  const callerY = 30;
  const agentY = callerY + rowH + rowGap;
  const bubbleX = innerX0 + labelW + 12;
  const bubbleW = W - innerX0 - bubbleX;

  // The three turn-pairs. Each is a [caller line, agent response].
  const turns: Array<[string, string]> = [
    ["Change my flight to Tuesday", "Updating reservation"],
    ["What's the new departure time?", "Booked for 4:15 PM"],
    ["Send the confirmation to my phone", "Sent · check messages"],
  ];
  const CYCLE_S = 9;
  return (
    <div className="absolute inset-0 flex items-center justify-center px-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {/* ── Static channel labels (always visible) ── */}
        {/* CALLER label */}
        <rect
          x={innerX0}
          y={callerY + 6}
          width={labelW}
          height={20}
          fill={accent}
        />
        <text
          x={innerX0 + labelW / 2}
          y={callerY + 20}
          textAnchor="middle"
          fontFamily="var(--font-mono)" fontSize="10" fill="#ffffff"
          letterSpacing="0.06em"
        >
          CALLER
        </text>
        {/* AGENT label */}
        <rect
          x={innerX0}
          y={agentY + 6}
          width={labelW}
          height={20}
          fill={T.panel}
          stroke={T.ring}
          strokeWidth={1}
        />
        <text
          x={innerX0 + labelW / 2}
          y={agentY + 20}
          textAnchor="middle"
          fontFamily="var(--font-mono)" fontSize="10" fill={T.inkMid}
          letterSpacing="0.06em"
        >
          AGENT
        </text>

        {/* ── Cycling CALLER bubbles ── */}
        {turns.map(([caller], i) => (
          <g
            key={`caller-${i}`}
            className="bento-turn-step"
            style={{ animationDelay: `${-(i / turns.length) * CYCLE_S}s` }}
          >
            <rect
              x={bubbleX}
              y={callerY}
              width={bubbleW}
              height={rowH - 4}
              fill="#ffffff"
              stroke={accent}
              strokeWidth={1.4}
            />
            <text
              x={bubbleX + 14}
              y={callerY + 21}
              fontFamily="var(--font-sans)" fontSize="13" fill={T.ink}
            >
              {caller}
            </text>
          </g>
        ))}

        {/* ── Cycling AGENT bubbles — fire ~1s after their caller
             counterpart so each turn pair reads as "caller speaks →
             agent responds." ── */}
        {turns.map(([, agent], i) => (
          <g
            key={`agent-${i}`}
            className="bento-turn-step bento-turn-step-agent"
            style={{ animationDelay: `${-(i / turns.length) * CYCLE_S + 1.2}s` }}
          >
            <rect
              x={bubbleX}
              y={agentY}
              width={bubbleW - 70}
              height={rowH - 4}
              fill={T.panel}
              stroke={T.ring}
              strokeWidth={1}
            />
            <text
              x={bubbleX + 14}
              y={agentY + 21}
              fontFamily="var(--font-sans)" fontSize="13" fill={T.ink}
            >
              {agent}
            </text>
            {/* Typing dots — agent is "thinking/responding" */}
            {[0, 1, 2].map((d) => (
              <circle
                key={d}
                className="bento-typing-dot"
                cx={bubbleX + bubbleW - 90 + d * 6}
                cy={agentY + 17}
                r={1.8}
                fill={T.inkMid}
                style={{ animationDelay: `${d * 360}ms` }}
              />
            ))}
            {/* Action pill on the right of the agent row — visually
                marks the agent "doing" something. */}
            <rect
              x={W - innerX0 - 60}
              y={agentY + 6}
              width={60}
              height={20}
              fill="rgba(59,130,246,0.08)"
              stroke={accent}
              strokeWidth={1}
            />
            <text
              x={W - innerX0 - 30}
              y={agentY + 20}
              textAnchor="middle"
              fontFamily="var(--font-mono)" fontSize="9.5" fill={accent}
              letterSpacing="0.04em"
            >
              tool
            </text>
          </g>
        ))}

        {/* Bottom caption */}
        <text
          x={innerX0}
          y={H - 14}
          fontFamily="var(--font-mono)" fontSize="10" fill={T.inkSubtle}
        >
          live
        </text>
        <text
          x={W - innerX0}
          y={H - 14}
          textAnchor="end"
          fontFamily="var(--font-mono)" fontSize="10" fill={accent}
          letterSpacing="0.04em"
        >
          turn-taking · 92 ms
        </text>
      </svg>
    </div>
  );
}

// ─── Animation styles ─────────────────────────────────────────────────
export function OstoModulesStyles() {
  return (
    <style>{`
      /* Bento illustration sizing on phone — the SVG viewBox is 600×220
         (~2.7:1) so preserveAspectRatio="meet" inside a phone-width
         container collapses the SVG to ~140px tall, leaving the rest
         of the 320px container empty. Solution: zero the wrapper's
         padding and scale the SVG up (~1.6×) via transform so it
         visually fills more of the cell. overflow-hidden on the bento
         cell crops the horizontal overflow; the viewBox is centered so
         cropping is symmetric and the card / waveform stay readable. */
      @media (max-width: 639px) {
        .osto-bento-illus > div {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .osto-bento-illus svg {
          transform: scale(1.7);
          transform-origin: center;
        }
      }

      /* Waveform bars: breathe their height. */
      @keyframes resonateModBar {
        0%, 100% { transform: scaleY(1); }
        50%      { transform: scaleY(0.5); }
      }
      .resonate-mod-bar {
        transform-origin: center;
        animation: resonateModBar 1800ms ease-in-out infinite;
      }

      /* Streaming waveform playhead: scrubs across the strip. */
      @keyframes resonatePlayhead {
        0%   { left: 6%; opacity: 0; }
        8%   { opacity: 1; }
        92%  { opacity: 1; }
        100% { left: 94%; opacity: 0; }
      }
      .resonate-playhead {
        animation: resonatePlayhead 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      /* Fingerprint polygon: subtle pulse around its center. */
      @keyframes resonateFingerprintPulse {
        0%, 100% { transform: scale(1); }
        50%      { transform: scale(1.03); }
      }
      .resonate-fingerprint-pulse {
        transform-origin: 100px 100px;
        animation: resonateFingerprintPulse 4.2s ease-in-out infinite;
      }

      /* Live dot: slow pulse. */
      @keyframes resonateLiveDot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%      { opacity: 0.55; transform: scale(0.85); }
      }
      .resonate-live-dot {
        animation: resonateLiveDot 1.6s ease-in-out infinite;
        transform-origin: center;
      }


      /* ─── Bento tile animations ───────────────────────────────────
         Per-tile loops that mirror the action the illustration depicts.
         All transform-only / opacity-only so they're GPU-cheap, and all
         opt out under prefers-reduced-motion. */

      /* Tile 1 — Console waveform bars. Per-bar scaleY breath with a
         travelling-wave stagger applied inline via animationDelay. */
      @keyframes bentoConsoleBar {
        0%, 100% { transform: scaleY(0.55); }
        50%      { transform: scaleY(1); }
      }
      .bento-console-bar {
        animation: bentoConsoleBar 1600ms ease-in-out infinite;
      }
      /* Tile 1 — Console playhead. Soft opacity breath. */
      @keyframes bentoConsolePlayhead {
        0%, 100% { opacity: 1; }
        50%      { opacity: 0.45; }
      }
      .bento-console-playhead {
        animation: bentoConsolePlayhead 1400ms ease-in-out infinite;
      }
      /* Tile 1 + Tile 4 — typing/speaking dots: opacity pulse, staggered
         via inline animationDelay. */
      @keyframes bentoDotPulse {
        0%, 100% { opacity: 0.2; }
        50%      { opacity: 0.9; }
      }
      .bento-speaking-dot,
      .bento-typing-dot {
        animation: bentoDotPulse 1200ms ease-in-out infinite;
      }

      /* Tile 2 — Phoneme step.
         Each token has its own .bento-phoneme-step <g> with the same
         7s keyframe but a staggered animationDelay = -(i/7)*7s, so
         exactly one token is visible (opacity 1) at a time, cycling
         left → right and looping back to the first.
         The 100/7 ≈ 14.3% of the cycle = ~1s per token. We give each
         a tiny crossfade in/out so it doesn't strobe. */
      @keyframes bentoPhonemeStep {
        0%     { opacity: 0; }
        2%     { opacity: 1; }
        13.5%  { opacity: 1; }
        14.3%  { opacity: 0; }
        100%   { opacity: 0; }
      }
      .bento-phoneme-step {
        opacity: 0;
        animation: bentoPhonemeStep 7s linear infinite;
      }

      /* Tile 2 — waveform bars breathe continuously, independent of
         the token playhead. Per-bar scaleY pulse with travelling
         stagger via inline animationDelay. */
      @keyframes bentoPhonemeBar {
        0%, 100% { transform: scaleY(0.5); }
        50%      { transform: scaleY(1); }
      }
      .bento-phoneme-bar {
        animation: bentoPhonemeBar 1800ms ease-in-out infinite;
      }

      /* Tile 3 — Voice clone. The cycle is 6s long and goes through
         4 phases of equal duration: scanning, building, cloning, ready.
         All elements use the same 6s timeline so they stay in lockstep. */

      /* Progress bar fills 0→33→66→100 in 3 ramped jumps, then resets. */
      @keyframes bentoCloneProgress {
        0%    { transform: scaleX(0.02); }
        25%   { transform: scaleX(0.33); }
        50%   { transform: scaleX(0.66); }
        75%   { transform: scaleX(1); }
        92%   { transform: scaleX(1); }
        100%  { transform: scaleX(0.02); }
      }
      .bento-clone-progress {
        animation: bentoCloneProgress 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }

      /* Cycling status text — 4 lines, one visible at a time. Each
         <text> has the same keyframe and offsets via animationDelay. */
      @keyframes bentoCloneStatus {
        0%     { opacity: 0; }
        2%     { opacity: 1; }
        23%    { opacity: 1; }
        25%    { opacity: 0; }
        100%   { opacity: 0; }
      }
      .bento-clone-status {
        opacity: 0;
        animation: bentoCloneStatus 6s linear infinite;
      }

      /* Cycling percentage — same pattern as the status text. */
      @keyframes bentoClonePct {
        0%     { opacity: 0; }
        2%     { opacity: 1; }
        23%    { opacity: 1; }
        25%    { opacity: 0; }
        100%   { opacity: 0; }
      }
      .bento-clone-pct {
        opacity: 0;
        animation: bentoClonePct 6s linear infinite;
      }

      /* Source tile breathes through the "building" phase — a soft
         scale pulse to suggest processing. */
      @keyframes bentoCloneSource {
        0%, 25%, 75%, 100% { transform: scale(1); }
        50%                 { transform: scale(0.92); }
      }
      .bento-clone-source {
        animation: bentoCloneSource 6s ease-in-out infinite;
      }

      /* "Voice ready" highlight — the surround ring pulses on visible
         during the last quarter of the cycle, when the status reads
         "Voice ready". */
      @keyframes bentoCloneReadyRing {
        0%, 73%   { opacity: 0; transform: scale(0.99); }
        78%       { opacity: 0.5; transform: scale(1.02); }
        86%       { opacity: 1; transform: scale(1); }
        96%       { opacity: 0.5; transform: scale(1.01); }
        100%      { opacity: 0; transform: scale(0.99); }
      }
      .bento-clone-ready-ring {
        transform-origin: center;
        animation: bentoCloneReadyRing 6s ease-out infinite;
      }

      /* Ready dot — slow opacity pulse, always on (the avatar's
         status indicator). */
      @keyframes bentoReadyDot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%      { opacity: 0.45; transform: scale(0.7); }
      }
      .bento-ready-dot {
        animation: bentoReadyDot 1800ms ease-in-out infinite;
      }

      /* Tile 4 — Transcript turn cycle. 9s loop, 3 turn-pairs of 3s
         each. Within each 3s window, the caller bubble fades in and
         stays visible for ~2s, then fades out and the next pair takes
         over. Each pair's caller and agent <g> shares this keyframe
         with staggered animationDelays (the agent fires 1.2s after
         its caller so each pair reads as a real exchange). */
      @keyframes bentoTurnStep {
        0%    { opacity: 0; transform: translateY(4px); }
        5%    { opacity: 1; transform: translateY(0); }
        30%   { opacity: 1; transform: translateY(0); }
        33.3% { opacity: 0; transform: translateY(0); }
        100%  { opacity: 0; transform: translateY(0); }
      }
      .bento-turn-step {
        opacity: 0;
        animation: bentoTurnStep 9s ease-in-out infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .resonate-mod-bar,
        .resonate-playhead,
        .resonate-fingerprint-pulse,
        .resonate-live-dot,
        .bento-console-bar,
        .bento-console-playhead,
        .bento-speaking-dot,
        .bento-typing-dot,
        .bento-phoneme-step,
        .bento-phoneme-bar,
        .bento-clone-progress,
        .bento-clone-status,
        .bento-clone-pct,
        .bento-clone-source,
        .bento-clone-ready-ring,
        .bento-ready-dot,
        .bento-turn-step {
          animation: none !important;
        }
        /* Lock displays to a sensible final state in reduced-motion
           mode so the illustrations still read as "complete." */
        .bento-phoneme-step:first-of-type,
        .bento-clone-status:last-of-type,
        .bento-clone-pct:last-of-type,
        .bento-turn-step:first-of-type {
          opacity: 1;
        }
        .bento-clone-progress {
          transform: scaleX(1);
        }
        .bento-clone-ready-ring {
          opacity: 1;
        }
      }
    `}</style>
  );
}
