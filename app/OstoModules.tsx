"use client";

/**
 * Tabbed module gallery — every osto module, organized by category, with
 * a motion illustration on each active tile. Inactive tabs render their
 * tiles as dimmed outline placeholders with module numbers.
 *
 * Layout pattern follows the reference: 4-column grid, dashed-grid frame
 * around the section, soft active-tile illustrations that animate on
 * mount + when the active tab changes, color of the tab + active tiles
 * shifts per category.
 */

import { useEffect, useState } from "react";

// ─── Categories ───────────────────────────────────────────────────────
type CatKey = "cloud" | "application" | "endpoint" | "network" | "compliance";

type Module = {
  num: string;
  title: string;
  desc: string;
  illus: (color: string) => React.ReactNode;
};

type Category = {
  key: CatKey;
  label: string;
  color: string;
  colorSoft: string;
  modules: Module[];
};

// Single brand color for all categories. Finta-discipline: one accent, one
// neutral palette, no per-category color theming.
const BRAND = "#1c267a";
const BRAND_SOFT = "rgba(28,38,122,0.10)";

const CATS: Category[] = [
  {
    key: "cloud",
    label: "Cloud",
    color: BRAND,
    colorSoft: BRAND_SOFT,
    modules: [
      {
        num: "01",
        title: "Cloud Posture (CSPM)",
        desc: "Scan AWS, Azure, GCP for misconfigs and drift.",
        illus: (c) => <IllusCSPM color={c} />,
      },
      {
        num: "02",
        title: "Web App Protection",
        desc: "OWASP Top 10, DDoS, bot blocking, virtual patching.",
        illus: (c) => <IllusWAF color={c} />,
      },
      {
        num: "03",
        title: "Web API Protection",
        desc: "Shadow API discovery, schema enforcement, malicious traffic.",
        illus: (c) => <IllusAPI color={c} />,
      },
    ],
  },
  {
    key: "application",
    label: "Application",
    color: BRAND,
    colorSoft: BRAND_SOFT,
    modules: [
      {
        num: "04",
        title: "Web App Scanner",
        desc: "Continuously scan internet-facing apps for exploitable issues.",
        illus: (c) => <IllusWebScan color={c} />,
      },
      {
        num: "05",
        title: "Mobile App Scanner",
        desc: "Assess mobile app builds for weaknesses before release.",
        illus: (c) => <IllusMobile color={c} />,
      },
      {
        num: "06",
        title: "SAST / SBOM",
        desc: "Static analysis and software bill of materials.",
        illus: (c) => <IllusSAST color={c} />,
      },
    ],
  },
  {
    key: "endpoint",
    label: "Endpoint",
    color: BRAND,
    colorSoft: BRAND_SOFT,
    modules: [
      {
        num: "07",
        title: "Endpoint Antimalware",
        desc: "Real-time malware detection, ransomware prevention.",
        illus: (c) => <IllusAntimalware color={c} />,
      },
      {
        num: "08",
        title: "Disk Encryption",
        desc: "Protect startup devices and sensitive data at rest.",
        illus: (c) => <IllusDiskEnc color={c} />,
      },
      {
        num: "09",
        title: "App Control",
        desc: "Reduce unauthorized execution risk on every device.",
        illus: (c) => <IllusAppControl color={c} />,
      },
      {
        num: "10",
        title: "Device Control",
        desc: "Block USB peripherals and removable media.",
        illus: (c) => <IllusDeviceControl color={c} />,
      },
      {
        num: "11",
        title: "File Access DLP",
        desc: "Protect sensitive files with access controls.",
        illus: (c) => <IllusDLP color={c} />,
      },
      {
        num: "12",
        title: "Screen Lock",
        desc: "Enforce automatic device lock and idle protection.",
        illus: (c) => <IllusScreenLock color={c} />,
      },
      {
        num: "13",
        title: "Swipe Clean",
        desc: "Remote wipe and cleanup actions for managed devices.",
        illus: (c) => <IllusSwipe color={c} />,
      },
    ],
  },
  {
    key: "network",
    label: "Network",
    color: BRAND,
    colorSoft: BRAND_SOFT,
    modules: [
      {
        num: "14",
        title: "ZTNA Secure Access",
        desc: "Zero Trust with 2FA, time-based permissions, instant blocking.",
        illus: (c) => <IllusZTNA color={c} />,
      },
      {
        num: "15",
        title: "Domain Filtering",
        desc: "Block malicious domains and enforce browsing policies.",
        illus: (c) => <IllusDomain color={c} />,
      },
    ],
  },
  {
    key: "compliance",
    label: "Compliance",
    color: BRAND,
    colorSoft: BRAND_SOFT,
    modules: [
      {
        num: "16",
        title: "AI Security Q&A",
        desc: "Pre-fill questionnaires in 5 minutes at 99% precision.",
        illus: (c) => <IllusAIQA color={c} />,
      },
      {
        num: "17",
        title: "Compliance Automation",
        desc: "Continuously mapped controls and evidence collection.",
        illus: (c) => <IllusCompliance color={c} />,
      },
      {
        num: "18",
        title: "Security Awareness Training",
        desc: "Train employees and keep participation evidence audit-ready.",
        illus: (c) => <IllusTraining color={c} />,
      },
      {
        num: "19",
        title: "Logs Analyzer",
        desc: "Centralized logs and audit-ready posture across modules.",
        illus: (c) => <IllusLogs color={c} />,
      },
      {
        num: "20",
        title: "VAPT",
        desc: "OSCP-led engineers · 1–2 week delivery.",
        illus: (c) => <IllusVAPT color={c} />,
      },
    ],
  },
];

// Match V2's global rail inset so the grid spans edge-to-edge to the rails.
const RAIL_INSET = "max(24px, calc((100vw - 1240px) / 2))";

// Tokens — match V2's AG-derived system
const T = {
  ink: "#26262b",
  inkSoft: "#5e5f6b",
  inkSubtle: "#92939e",
  inkFaint: "#b8b9c1",
  panel: "#f7f7f8",
  surface: "#ffffff",
  ring: "rgba(38,38,43,0.08)",
  hairline: "#eeeef0",
};

const E = {
  card: "0 0 0 1px rgba(38,38,43,0.08)",
  ringOnly: "0 0 0 1px rgba(38,38,43,0.08)",
};

// ─── Section ──────────────────────────────────────────────────────────
export function OstoModules() {
  const [active, setActive] = useState<CatKey>("cloud");
  // Bumping `cycle` re-mounts illustrations on tab change so animations restart
  const [cycle, setCycle] = useState(0);

  const cat = CATS.find((c) => c.key === active)!;

  useEffect(() => {
    setCycle((n) => n + 1);
  }, [active]);

  // Only render the active category's modules. The grid column count
  // adapts to the module count so we never render empty/placeholder
  // tiles. Categories with 1–3 modules center on a single row; larger
  // sets wrap into a 3-up grid that fills cleanly.
  const tiles = cat.modules.map((m) => ({ mod: m, cat }));
  const cols = Math.min(tiles.length, 3);

  return (
    <section className="pt-4" style={{ color: T.ink }}>
      <div className="mx-auto max-w-[1240px] px-6">
        {/* Eyebrow + Heading */}
        <div className="text-center">
          <span
            className="inline-flex items-center text-[12px] font-medium leading-[20px]"
            style={{ color: T.inkSubtle, letterSpacing: "-0.018px" }}
          >
            Every module, built in-house
          </span>
          <h2
            className="mx-auto mt-4 max-w-[720px] text-balance text-[32px] leading-[38px] tracking-[-0.8px] md:mt-5 md:text-[40px] md:leading-[44px] md:tracking-[-1px]"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              color: T.ink,
            }}
          >
            Twenty modules. <span style={{ color: BRAND }}>One platform.</span>
          </h2>
          <p
            className="mx-auto mt-4 max-w-[560px] text-[16px] leading-[24px] md:text-[18px] md:leading-[26px]"
            style={{
              color: T.inkSoft,
              letterSpacing: "-0.18px",
            }}
          >
            Cloud, app, endpoint, network, compliance. Every layer of the stack, built and integrated by Osto.
          </p>
        </div>

        {/* Tabs — Finta-style segmented control: neutral track, white active
            pill with subtle shadow. Single tab style, no per-category color. */}
        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Module categories"
            className="inline-flex items-center gap-x-0.5 rounded-full p-1"
            style={{
              background: T.panel,
              boxShadow: "inset 0 0 0 1px rgba(38,38,43,0.06)",
            }}
          >
            {CATS.map((c) => {
              const isActive = c.key === active;
              return (
                <button
                  key={c.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(c.key)}
                  className="relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-[14px] font-medium leading-[20px] transition-[background-color,color,box-shadow] duration-200 ease-out active:scale-[0.96]"
                  style={{
                    background: isActive ? T.surface : "transparent",
                    color: isActive ? T.ink : T.inkSoft,
                    boxShadow: isActive
                      ? "0 0 0 1px rgba(38,38,43,0.06), 0 1px 2px rgba(38,38,43,0.06)"
                      : "none",
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Module grid — edge-to-edge to the global rails. No outer card,
          no rounded container, no stroke. Hairline column/row separators
          are rendered as inset shadows on every tile; we strip the
          right-most column's right hairline per breakpoint via CSS rules
          keyed on data-cols. cols comes from JS (1, 2, or 3). */}
      <style>{`
        .osto-modgrid > * {
          box-shadow:
            inset -0.5px 0 0 0 ${T.hairline},
            inset 0 -0.5px 0 0 ${T.hairline};
        }
        /* mobile: 1 col → strip every right hairline */
        .osto-modgrid > *:nth-child(1n) {
          box-shadow: inset 0 -0.5px 0 0 ${T.hairline};
        }
        @media (min-width: 640px) {
          .osto-modgrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .osto-modgrid > * {
            box-shadow:
              inset -0.5px 0 0 0 ${T.hairline},
              inset 0 -0.5px 0 0 ${T.hairline};
          }
          .osto-modgrid > *:nth-child(2n) {
            box-shadow: inset 0 -0.5px 0 0 ${T.hairline};
          }
        }
        @media (min-width: 768px) {
          .osto-modgrid[data-cols="1"] { grid-template-columns: 1fr; }
          .osto-modgrid[data-cols="2"] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .osto-modgrid[data-cols="3"] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .osto-modgrid > * {
            box-shadow:
              inset -0.5px 0 0 0 ${T.hairline},
              inset 0 -0.5px 0 0 ${T.hairline};
          }
          .osto-modgrid[data-cols="1"] > *:nth-child(1n) { box-shadow: inset 0 -0.5px 0 0 ${T.hairline}; }
          .osto-modgrid[data-cols="2"] > *:nth-child(2n) { box-shadow: inset 0 -0.5px 0 0 ${T.hairline}; }
          .osto-modgrid[data-cols="3"] > *:nth-child(3n) { box-shadow: inset 0 -0.5px 0 0 ${T.hairline}; }
        }
      `}</style>
      <div
        key={cycle}
        data-cols={cols}
        className="osto-modgrid grid grid-cols-1 mt-10"
        style={{
          marginLeft: `calc(${RAIL_INSET} + 1px)`,
          marginRight: `calc(${RAIL_INSET} + 1px)`,
          borderTop: `0.5px solid ${T.hairline}`,
          borderBottom: `0.5px solid ${T.hairline}`,
        }}
      >
        {tiles.map((t, i) => (
          <ModuleTile
            key={`${cycle}-${i}`}
            module={t.mod}
            cat={t.cat}
            borderRight={false}
            borderBottom={false}
            delay={i * 60}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Tile ─────────────────────────────────────────────────────────────
function ModuleTile({
  module,
  cat,
  borderRight,
  borderBottom,
  delay,
}: {
  module: Module;
  cat: Category;
  borderRight: boolean;
  borderBottom: boolean;
  delay: number;
}) {
  // Compose hairline borders. When both flags are false, omit boxShadow
  // entirely so the parent grid's CSS rules can apply per-breakpoint
  // hairlines (an empty string would override the cascade).
  const shadow = [
    borderRight ? `inset -0.5px 0 0 0 ${T.hairline}` : "",
    borderBottom ? `inset 0 -0.5px 0 0 ${T.hairline}` : "",
  ]
    .filter(Boolean)
    .join(", ");
  return (
    <article
      className="relative flex h-[340px] flex-col p-6"
      style={{
        background: T.surface,
        ...(shadow ? { boxShadow: shadow } : {}),
      }}
    >
      <div
        className="osto-tile-fade"
        style={{ animationDelay: `${delay}ms` }}
      >
        <h3
          className="text-[16px] font-medium leading-[24px]"
          style={{
            fontFamily: "var(--font-sans)",
            color: T.ink,
            letterSpacing: "-0.24px",
          }}
        >
          {module.title}
        </h3>
        <p
          className="mt-1 max-w-[260px] text-[14px] leading-[20px]"
          style={{
            color: T.inkSoft,
            letterSpacing: "-0.14px",
          }}
        >
          {module.desc}
        </p>
      </div>

      <div
        className="osto-tile-rise relative mt-auto overflow-hidden"
        style={{
          animationDelay: `${delay + 100}ms`,
          height: "180px",
        }}
      >
        {module.illus(cat.color)}
      </div>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ILLUSTRATIONS — Attio-style design system.
//
// Four archetypes, mixed across the 20 modules:
//   1. Wireframe isometric line drawings  — 1px ink stroke, no fill,
//      dashed lines for hidden edges. "Engineering blueprint" feel.
//   2. Real-product UI chrome             — cropped, framed app cards
//      that float on the dotted grid behind the tile.
//   3. Connected-node diagrams            — pill chips connected to a
//      central card by curved 1px paths.
//   4. Color-on-data bar charts            — bars carry the only color;
//      everything around them is grey.
//
// Color discipline: the category `color` is reserved for DATA marks
// only (status dots, chart bars, "live" pills). Every structural
// stroke is the muted ink ramp.
// ═══════════════════════════════════════════════════════════════════════

const STROKE = "#92939e"; // ink-subtle, primary line color
const STROKE_SOFT = "#cdced3"; // softer line for hidden / secondary edges
const FILL_BG = "#ffffff";
// ═══════════════════════════════════════════════════════════════════════
// Finta-style illustrations — every module gets one or two product-UI
// cards floating on the gradient backdrop. Cards are realistic in
// proportion + content; color is reserved for status/data marks.
// ═══════════════════════════════════════════════════════════════════════

const CARD_SHADOW =
  "0 0 0 1px rgba(38,38,43,0.06), 0 1px 2px 0 rgba(38,38,43,0.04), 0 6px 16px -8px rgba(38,38,43,0.12)";
const CARD_RADIUS = 10;

/**
 * FintaCard — base product UI fragment. White card, soft shadow, 1px
 * ring. Optional tilt/offset so multiple stacked cards feel "scattered"
 * the way Finta lays them out (not perfectly grid-aligned).
 */
function FintaCard({
  children,
  className = "",
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        background: "#ffffff",
        boxShadow: CARD_SHADOW,
        borderRadius: CARD_RADIUS,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── FlowIllus ──────────────────────────────────────────────────────
// Connected-node flow: 3 input chips on the left, a central circular gate
// with an icon, and one outcome callout on the right. Three dashed neutral
// paths trace the routine flow; one solid brand path traces the meaningful
// outcome (the thing this module actually catches/does).
//
// This is the single shape used for every module — same visual rhythm,
// different content. The "story" comes from the inputs, the gate icon, and
// the outcome.

type GateIcon =
  | "shield-check"   // CSPM, DiskEnc, ZTNA — verified / hardened
  | "shield-block"   // WAF, Domain — blocked
  | "schema"         // API — schema/contract
  | "scan"           // WebScan, Mobile, SAST, Antimalware — scanner
  | "policy"         // AppControl, DeviceControl, Compliance — policy/rules
  | "mask"           // DLP — masking
  | "clock"          // ScreenLock — idle
  | "wipe"           // Swipe — erase
  | "ai"             // AIQA — sparkle
  | "graduation"     // Training — checked answer
  | "logs"           // Logs — stream
  | "target"         // VAPT — pen-test target
  ;

function GateIconSvg({ icon, color }: { icon: GateIcon; color: string }) {
  switch (icon) {
    case "shield-check":
      return (
        <>
          <path d="M9 1.5 L15 4 V9 C15 12.5 12.5 14.7 9 16 C5.5 14.7 3 12.5 3 9 V4 Z" fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="m6.4 9 1.8 1.8L11.6 7.2" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case "shield-block":
      return (
        <>
          <path d="M9 1.5 L15 4 V9 C15 12.5 12.5 14.7 9 16 C5.5 14.7 3 12.5 3 9 V4 Z" fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="m6.5 6.5 5 5 m0-5-5 5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        </>
      );
    case "schema":
      return (
        <>
          <rect x="3.5" y="3.5" width="11" height="11" rx="2" stroke={color} strokeWidth="1.4" fill="none" />
          <path d="M3.5 7.5 H14.5 M3.5 11 H14.5" stroke={color} strokeWidth="1.2" />
          <circle cx="6" cy="9.25" r="0.7" fill={color} />
        </>
      );
    case "scan":
      return (
        <>
          <circle cx="8" cy="8" r="4.5" stroke={color} strokeWidth="1.4" fill="none" />
          <path d="m11.5 11.5 3.5 3.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="8" cy="8" r="1.4" fill={color} />
        </>
      );
    case "policy":
      return (
        <>
          <path d="M4 3 H12 L14 5 V14 a1 1 0 0 1 -1 1 H4 Z" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
          <path d="M6 8 H12 M6 11 H10" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        </>
      );
    case "mask":
      return (
        <>
          <path d="M2 9 C2 6 5 4 9 4 C13 4 16 6 16 9 C16 12 13 14 9 14 C5 14 2 12 2 9 Z" stroke={color} strokeWidth="1.4" fill="none" />
          <circle cx="9" cy="9" r="2" fill={color} />
          <path d="m4.5 4.5 9 9" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        </>
      );
    case "clock":
      return (
        <>
          <circle cx="9" cy="9" r="6" stroke={color} strokeWidth="1.4" fill="none" />
          <path d="M9 5.5 V9 L11.5 10.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        </>
      );
    case "wipe":
      return (
        <>
          <path d="M4 5 H14 L13 14 a1 1 0 0 1 -1 1 H6 a1 1 0 0 1 -1 -1 Z" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
          <path d="M7 5 V3.5 a1 1 0 0 1 1 -1 H10 a1 1 0 0 1 1 1 V5" stroke={color} strokeWidth="1.4" />
          <path d="M8 8 V12 M10 8 V12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        </>
      );
    case "ai":
      return (
        <>
          <path d="M9 2 L10.4 6.6 L15 8 L10.4 9.4 L9 14 L7.6 9.4 L3 8 L7.6 6.6 Z" fill={color} />
          <circle cx="14" cy="13.5" r="1" fill={color} opacity="0.7" />
        </>
      );
    case "graduation":
      return (
        <>
          <path d="M2 7 L9 4 L16 7 L9 10 Z" stroke={color} strokeWidth="1.4" fill="none" strokeLinejoin="round" />
          <path d="M5 8.5 V12 C5 13 7 14 9 14 C11 14 13 13 13 12 V8.5" stroke={color} strokeWidth="1.4" fill="none" />
          <path d="M16 7 V11" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        </>
      );
    case "logs":
      return (
        <>
          <path d="M3 4 H15 M3 7 H15 M3 10 H11 M3 13 H13" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        </>
      );
    case "target":
      return (
        <>
          <circle cx="9" cy="9" r="6" stroke={color} strokeWidth="1.4" fill="none" />
          <circle cx="9" cy="9" r="3" stroke={color} strokeWidth="1.4" fill="none" />
          <circle cx="9" cy="9" r="1" fill={color} />
        </>
      );
  }
}

type FlowInput = {
  badge?: string;     // e.g. "GET", "iOS", "AWS"
  label: string;      // e.g. "/users", "v2.4.1"
};

type FlowOutcome = {
  eyebrow: string;    // small uppercase-feel label inside the callout
  text: string;       // the meaningful result, brand-colored
};

function FlowIllus({
  color,
  inputs,
  icon,
  outcome,
}: {
  color: string;
  inputs: FlowInput[];
  icon: GateIcon;
  outcome: FlowOutcome;
}) {
  const padInput = inputs.length === 2 ? 24 : 0; // narrower vertical span when only 2 inputs
  return (
    <div className="absolute inset-0 flex items-center justify-center px-3">
      <div className="relative h-[170px] w-full">
        {/* Connecting paths */}
        <svg viewBox="0 0 280 170" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          {inputs.map((_, i) => {
            const top = inputs.length === 1
              ? 86
              : inputs.length === 2
                ? padInput + 18 + i * (170 - 2 * (padInput + 18) - 36)
                : 38 + i * 48;
            return (
              <path
                key={i}
                d={`M52 ${top} C 110 ${top}, 110 86, 132 86`}
                stroke={T.inkFaint}
                strokeWidth="1"
                fill="none"
                strokeDasharray="2 3"
              />
            );
          })}
          {/* solid brand path — gate to outcome */}
          <path
            d="M158 86 C 200 86, 200 130, 230 130"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
          />
        </svg>

        {/* Left column — input chips */}
        <div
          className={`absolute left-0 flex flex-col ${
            inputs.length === 1 ? "h-full justify-center" : "justify-between"
          }`}
          style={
            inputs.length === 2
              ? { top: padInput, bottom: padInput }
              : { top: 0, bottom: 0 }
          }
        >
          {inputs.map((inp, i) => (
            <FintaCard key={i} className="flex items-center gap-x-1.5 px-2 py-1">
              {inp.badge && (
                <span
                  className="rounded text-[9px] font-bold tabular-nums"
                  style={{
                    background: T.panel,
                    color: T.inkSoft,
                    minWidth: "26px",
                    textAlign: "center",
                    padding: "2px 4px",
                  }}
                >
                  {inp.badge}
                </span>
              )}
              <span className="text-[10px] font-medium" style={{ color: T.ink }}>
                {inp.label}
              </span>
            </FintaCard>
          ))}
        </div>

        {/* Center — gate */}
        <div
          className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{
            background: "#fff",
            boxShadow: `0 0 0 1px ${color}26, 0 4px 12px -4px ${color}33`,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <GateIconSvg icon={icon} color={color} />
          </svg>
        </div>

        {/* Right — outcome callout */}
        <FintaCard
          className="absolute bottom-2 right-0 px-2.5 py-1.5"
          style={{
            background: "#fff",
            boxShadow: `0 0 0 1px ${color}33, 0 6px 14px -6px ${color}40`,
          }}
        >
          <p
            className="text-[9px] font-medium"
            style={{ color: T.inkSubtle, letterSpacing: "0.04em" }}
          >
            {outcome.eyebrow}
          </p>
          <p
            className="text-[11px] font-semibold"
            style={{ color, letterSpacing: "-0.1px" }}
          >
            {outcome.text}
          </p>
        </FintaCard>
      </div>
    </div>
  );
}

// ── Cloud category ─────────────────────────────────────────────────
//
// Each illustration is a different SURFACE of the Osto platform — not
// abstract concepts. The visual rhythm of the section comes from mixing
// surface types: an alert card, a live feed, a tabular inventory, a
// settings panel, a notification toast, a chart, etc.

// CSPM — Surface: finding alert card. Looks like an Osto dashboard
// pulling up the most critical misconfig with a one-click auto-fix.
function IllusCSPM({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden">
        {/* breadcrumb header */}
        <div
          className="flex items-center gap-x-1.5 border-b px-3 py-2"
          style={{ borderColor: "rgba(38,38,43,0.06)" }}
        >
          <span className="text-[10px] font-medium" style={{ color: T.inkSubtle }}>
            Cloud
          </span>
          <span style={{ color: T.inkFaint }}>›</span>
          <span className="text-[10px] font-medium" style={{ color: T.inkSubtle }}>
            AWS · prod
          </span>
          <span className="ml-auto flex items-center gap-x-1 text-[10px] font-medium" style={{ color: "#0d8050" }}>
            <span className="osto-live h-1.5 w-1.5 rounded-full" style={{ background: "#19a974" }} />
            scanning
          </span>
        </div>
        {/* finding body */}
        <div className="p-3">
          <div className="flex items-start gap-x-2">
            <div
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              style={{ background: `${color}14` }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1.5 L13 12 H1 Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M7 6 V8.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="7" cy="10.3" r="0.7" fill={color} />
              </svg>
            </div>
            <div className="flex-1 leading-tight">
              <p className="text-[11px] font-semibold" style={{ color: T.ink }}>
                Public S3 bucket exposed
              </p>
              <p className="mt-0.5 text-[10px]" style={{ color: T.inkSubtle }}>
                prod-uploads · us-east-1
              </p>
            </div>
            <span
              className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
              style={{ background: `${color}1a`, color, letterSpacing: "0.04em" }}
            >
              HIGH
            </span>
          </div>
          <div className="mt-3 flex items-center gap-x-2">
            <button
              className="osto-btn-shimmer flex items-center gap-x-1 rounded-[6px] px-2 py-1 text-[10px] font-semibold"
              style={{ background: color, color: "#fff" }}
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path d="m1.8 5 2 2L8 2.6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Auto-fix
            </button>
            <button
              className="rounded-[6px] px-2 py-1 text-[10px] font-medium"
              style={{ color: T.inkSoft, boxShadow: "inset 0 0 0 1px rgba(38,38,43,0.08)" }}
            >
              View
            </button>
            <span className="ml-auto text-[10px]" style={{ color: T.inkSubtle }}>
              SOC2 · CC6.1
            </span>
          </div>
        </div>
      </FintaCard>
    </div>
  );
}

// WAF — Surface: live activity feed. Recent requests streaming, one
// highlighted as blocked in real time.
function IllusWAF({ color }: { color: string }) {
  const rows: Array<{ ip: string; rule: string; blocked?: boolean }> = [
    { ip: "104.28.•.42", rule: "GET /api/v1" },
    { ip: "203.0.•.7", rule: "SQLi · /search", blocked: true },
    { ip: "52.84.•.211", rule: "POST /auth" },
    { ip: "93.184.•.16", rule: "GET /static" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden">
        {/* feed header */}
        <div
          className="flex items-center justify-between border-b px-3 py-2"
          style={{ borderColor: "rgba(38,38,43,0.06)" }}
        >
          <div className="flex items-center gap-x-1.5">
            <span
              className="osto-live h-1.5 w-1.5 rounded-full"
              style={{
                background: "#19a974",
                boxShadow: "0 0 0 3px rgba(25,169,116,0.18)",
              }}
            />
            <span className="text-[10px] font-semibold" style={{ color: T.ink }}>
              Live · firewall
            </span>
          </div>
          <span className="text-[10px]" style={{ color: T.inkSubtle }}>
            now
          </span>
        </div>
        {/* request rows */}
        <ul>
          {rows.map((r, i) => (
            <li
              key={i}
              className={`flex items-center gap-x-2 border-b px-3 py-1.5 last:border-b-0 osto-appear ${r.blocked ? "osto-row-sheen" : ""}`}
              style={{
                borderColor: "rgba(38,38,43,0.04)",
                background: r.blocked ? `${color}08` : "transparent",
                animationDelay: `${300 + i * 90}ms`,
              }}
            >
              <span
                className="text-[10px] font-medium tabular-nums"
                style={{ color: r.blocked ? color : T.inkSoft, width: "78px" }}
              >
                {r.ip}
              </span>
              <span
                className="flex-1 text-[10px]"
                style={{ color: r.blocked ? T.ink : T.inkSoft, fontWeight: r.blocked ? 600 : 400 }}
              >
                {r.rule}
              </span>
              {r.blocked ? (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                  style={{ background: color, color: "#fff", letterSpacing: "0.04em" }}
                >
                  BLOCKED
                </span>
              ) : (
                <span
                  className="text-[10px]"
                  style={{ color: "#0d8050" }}
                >
                  ✓
                </span>
              )}
            </li>
          ))}
        </ul>
      </FintaCard>
    </div>
  );
}

// API — Surface: endpoint inventory table. One endpoint flagged as
// "shadow" — discovered but undocumented.
function IllusAPI({ color }: { color: string }) {
  const rows: Array<{ m: string; p: string; status?: "shadow" | "ok" }> = [
    { m: "GET", p: "/v1/users", status: "ok" },
    { m: "POST", p: "/v1/auth", status: "ok" },
    { m: "POST", p: "/internal/billing", status: "shadow" },
    { m: "GET", p: "/v1/orders", status: "ok" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden">
        {/* table header */}
        <div
          className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 border-b px-3 py-2"
          style={{ borderColor: "rgba(38,38,43,0.06)" }}
        >
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>
            API inventory
          </span>
          <span />
          <span className="text-[10px]" style={{ color: T.inkSubtle }}>
            14 active
          </span>
        </div>
        {/* rows */}
        <ul>
          {rows.map((r, i) => {
            const isShadow = r.status === "shadow";
            return (
              <li
                key={i}
                className={`flex items-center gap-x-2 border-b px-3 py-1.5 last:border-b-0 osto-appear ${isShadow ? "osto-row-sheen" : ""}`}
                style={{
                  borderColor: "rgba(38,38,43,0.04)",
                  background: isShadow ? `${color}10` : "transparent",
                  animationDelay: `${300 + i * 90}ms`,
                }}
              >
                <span
                  className="rounded text-[9px] font-bold tabular-nums"
                  style={{
                    background: isShadow ? color : T.panel,
                    color: isShadow ? "#fff" : T.inkSoft,
                    minWidth: "32px",
                    textAlign: "center",
                    padding: "2px 4px",
                  }}
                >
                  {r.m}
                </span>
                <span
                  className="flex-1 text-[10px]"
                  style={{ color: isShadow ? T.ink : T.inkSoft, fontWeight: isShadow ? 600 : 400 }}
                >
                  {r.p}
                </span>
                {isShadow && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                    style={{ background: "#fff", color, boxShadow: `inset 0 0 0 1px ${color}40`, letterSpacing: "0.04em" }}
                  >
                    SHADOW
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </FintaCard>
    </div>
  );
}

// ── Application category ───────────────────────────────────────────

// Web Scanner — Surface: scan-in-progress card. Shows the active URL being
// crawled, a progress bar, and a live count of findings appearing as the
// scan runs. Reads as "we caught this in real time."
function IllusWebScan({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden">
        {/* header — current target */}
        <div
          className="flex items-center gap-x-2 border-b px-3 py-2"
          style={{ borderColor: "rgba(38,38,43,0.06)" }}
        >
          <span
            className="osto-live h-1.5 w-1.5 rounded-full"
            style={{ background: color, boxShadow: `0 0 0 3px ${color}26` }}
          />
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>
            Scanning
          </span>
          <span
            className="text-[10px] tabular-nums"
            style={{ color: T.inkSoft }}
          >
            app.osto.one
          </span>
          <span className="ml-auto text-[10px]" style={{ color: T.inkSubtle }}>
            128 / 247
          </span>
        </div>
        {/* progress bar */}
        <div
          className="h-1 w-full overflow-hidden"
          style={{ background: T.panel }}
        >
          <div
            className="osto-progress-loop h-full"
            style={{ background: color }}
          />
        </div>
        {/* findings list — surface area */}
        <ul className="p-3 pt-2">
          {[
            { sev: "HIGH", url: "/api/auth · bypass", fresh: true },
            { sev: "MED", url: "/admin · weak XSS filter" },
            { sev: "LOW", url: "/static · cache header" },
          ].map((f, i) => (
            <li
              key={i}
              className="osto-appear mt-1.5 flex items-center gap-x-2 first:mt-0"
              style={{ animationDelay: `${300 + i * 120}ms` }}
            >
              <span
                className="rounded text-[9px] font-bold"
                style={{
                  background:
                    f.sev === "HIGH" ? color : f.sev === "MED" ? `${color}66` : T.panel,
                  color: f.sev === "LOW" ? T.inkSoft : "#fff",
                  padding: "2px 5px",
                  minWidth: "32px",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                }}
              >
                {f.sev}
              </span>
              <span
                className="flex-1 text-[10px]"
                style={{ color: f.fresh ? T.ink : T.inkSoft, fontWeight: f.fresh ? 600 : 400 }}
              >
                {f.url}
              </span>
              {f.fresh && (
                <span className="text-[9px] font-medium" style={{ color }}>
                  new
                </span>
              )}
            </li>
          ))}
        </ul>
      </FintaCard>
    </div>
  );
}

// Mobile App Scanner — Surface: build report card. Phone silhouette on the
// left, three category checks on the right (static / network / crypto)
// with a single failing category called out. Reads as a release-gate report.
function IllusMobile({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden p-3">
        <div className="flex items-start gap-x-3">
          {/* phone artwork */}
          <div
            className="osto-float flex h-[88px] w-[52px] shrink-0 items-center justify-center rounded-[10px] p-1"
            style={{ background: T.panel, boxShadow: "inset 0 0 0 1px rgba(38,38,43,0.06)" }}
          >
            <div
              className="flex h-full w-full flex-col items-center justify-between rounded-[7px] py-2"
              style={{ background: "#fff", boxShadow: "inset 0 0 0 1px rgba(38,38,43,0.04)" }}
            >
              <div
                className="h-1 w-3 rounded-full"
                style={{ background: T.inkFaint, opacity: 0.5 }}
              />
              <div
                className="flex h-7 w-7 items-center justify-center rounded-[6px]"
                style={{ background: color }}
              >
                <span className="text-[10px] font-bold text-white">o</span>
              </div>
              <div className="space-y-0.5">
                <div className="h-0.5 w-5 rounded-full" style={{ background: T.inkFaint }} />
                <div className="h-0.5 w-3 rounded-full" style={{ background: T.inkFaint }} />
              </div>
            </div>
          </div>
          {/* report */}
          <div className="flex-1 leading-tight">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-semibold" style={{ color: T.ink }}>
                osto-mobile
              </p>
              <span className="text-[10px]" style={{ color: T.inkSubtle }}>
                v2.4.1
              </span>
            </div>
            <p className="mt-0.5 text-[10px]" style={{ color: T.inkSubtle }}>
              iOS · Android build
            </p>
            <ul className="mt-2 space-y-1">
              {[
                { l: "Static", v: "passed", ok: true },
                { l: "Network", v: "passed", ok: true },
                { l: "Crypto", v: "1 issue", ok: false },
              ].map((c, i) => (
                <li
                  key={c.l}
                  className="osto-appear flex items-center gap-x-1.5"
                  style={{ animationDelay: `${300 + i * 120}ms` }}
                >
                  <span
                    className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full"
                    style={{ background: c.ok ? "rgba(25,169,116,0.16)" : `${color}1a` }}
                  >
                    <span
                      className="h-1 w-1 rounded-full"
                      style={{ background: c.ok ? "#19a974" : color }}
                    />
                  </span>
                  <span className="text-[10px] font-medium" style={{ color: T.ink }}>
                    {c.l}
                  </span>
                  <span
                    className="ml-auto text-[10px]"
                    style={{ color: c.ok ? "#0d8050" : color, fontWeight: c.ok ? 500 : 600 }}
                  >
                    {c.v}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FintaCard>
    </div>
  );
}

// SAST/SBOM — Surface: code-review fragment. File path + line numbers,
// one vulnerable line highlighted brand-color with an inline finding pill.
// Looks like the IDE/PR review surface.
function IllusSAST({ color }: { color: string }) {
  const lines: Array<{ n: number; text: string; hi?: boolean }> = [
    { n: 41, text: "function login(req) {" },
    { n: 42, text: "  const u = req.body.user", hi: true },
    { n: 43, text: "  return query(`SELECT *…${u}`)" },
    { n: 44, text: "}" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden">
        {/* file header */}
        <div
          className="flex items-center gap-x-2 border-b px-3 py-2"
          style={{ borderColor: "rgba(38,38,43,0.06)" }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 1.5 L7 1.5 L9.5 4 V10.5 L2.5 10.5 Z" stroke={T.inkSoft} strokeWidth="1" strokeLinejoin="round" />
            <path d="M7 1.5 V4 H9.5" stroke={T.inkSoft} strokeWidth="1" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>
            auth.ts
          </span>
          <span className="text-[10px]" style={{ color: T.inkSubtle }}>
            #412
          </span>
          <span
            className="ml-auto rounded px-1.5 py-0.5 text-[9px] font-bold"
            style={{ background: `${color}1a`, color, letterSpacing: "0.04em" }}
          >
            SQLi
          </span>
        </div>
        {/* code body */}
        <div className="px-3 py-2">
          {lines.map((l, i) => (
            <div
              key={l.n}
              className={`flex items-center gap-x-2 rounded px-1.5 py-[2px] osto-appear ${l.hi ? "osto-line-breath" : ""}`}
              style={{
                background: l.hi ? `${color}10` : "transparent",
                boxShadow: l.hi ? `inset 2px 0 0 0 ${color}` : "none",
                animationDelay: `${250 + i * 90}ms`,
              }}
            >
              <span
                className="text-[9px] tabular-nums"
                style={{ color: T.inkFaint, width: "14px", textAlign: "right" }}
              >
                {l.n}
              </span>
              <span
                className="text-[10px]"
                style={{
                  color: l.hi ? color : T.ink,
                  fontWeight: l.hi ? 600 : 400,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {l.text}
              </span>
            </div>
          ))}
        </div>
        {/* footer — finding caption */}
        <div
          className="flex items-center gap-x-1.5 border-t px-3 py-1.5"
          style={{ borderColor: "rgba(38,38,43,0.06)", background: T.panel }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
          <span className="text-[10px] font-medium" style={{ color: T.inkSoft }}>
            Unsanitized input · L42
          </span>
        </div>
      </FintaCard>
    </div>
  );
}

// ── Endpoint category ──────────────────────────────────────────────

// Antimalware — Surface: notification toast. Looks like the Osto agent
// just blocked something. Big shield icon, threat detail, quarantine pill.
function IllusAntimalware({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden p-3">
        <div className="flex items-start gap-x-2.5">
          <div
            className="osto-icon-pulse flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ background: `${color}14` }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 1.5 L15 3.8 V9 C15 12.2 12.6 14.6 9 16 C5.4 14.6 3 12.2 3 9 V3.8 Z"
                fill={color}
              />
              <path d="M6 9 L8 11 L12 6.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1 leading-tight">
            <div className="flex items-center gap-x-1.5">
              <p className="text-[11px] font-semibold" style={{ color: T.ink }}>
                Threat blocked
              </p>
              <span className="text-[10px]" style={{ color: T.inkSubtle }}>
                · 14:22
              </span>
            </div>
            <p className="mt-0.5 text-[10px]" style={{ color: T.inkSubtle }}>
              Macintosh-Pro · Yash
            </p>
          </div>
          <span
            className="osto-stamp rounded-full px-2 py-0.5 text-[9px] font-bold"
            style={{ background: `${color}1a`, color, letterSpacing: "0.04em", animationDelay: "400ms" }}
          >
            QUARANTINED
          </span>
        </div>
        {/* threat detail */}
        <div
          className="mt-3 rounded-[6px] px-2 py-1.5"
          style={{ background: T.panel }}
        >
          <p className="text-[10px] font-medium" style={{ color: T.ink }}>
            Trojan.MacOS.Generic.A
          </p>
          <p className="text-[10px]" style={{ color: T.inkSubtle }}>
            ~/Downloads/installer.dmg
          </p>
        </div>
      </FintaCard>
    </div>
  );
}

// Disk Encryption — Surface: drive panel. Drive artwork on the left, status
// + AES-256 confirmation + protected progress on the right.
function IllusDiskEnc({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden p-3">
        <div className="flex items-center gap-x-3">
          {/* drive object */}
          <div
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px]"
            style={{ background: `${color}10` }}
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <rect x="3" y="6" width="20" height="14" rx="2.5" stroke={color} strokeWidth="1.6" />
              <line x1="6" y1="10" x2="14" y2="10" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
              <line x1="6" y1="13" x2="11" y2="13" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
              <line x1="6" y1="16" x2="14" y2="16" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
              <circle cx="19" cy="13" r="1.6" fill={color} />
            </svg>
            {/* lock badge */}
            <div
              className="osto-icon-pulse absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full"
              style={{ background: color, boxShadow: `0 2px 6px ${color}55` }}
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <rect x="2" y="4.5" width="6" height="4" rx="0.8" fill="#fff" />
                <path d="M3.5 4.5 V3.2 a1.5 1.5 0 0 1 3 0 V4.5" stroke="#fff" strokeWidth="1.1" fill="none" />
              </svg>
            </div>
          </div>
          {/* status */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold" style={{ color: T.ink }}>
                Macintosh HD
              </p>
              <span className="text-[10px]" style={{ color: T.inkSubtle }}>
                512 GB
              </span>
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full" style={{ background: T.panel }}>
              <div
                className="osto-fill-once h-full rounded-full"
                style={{ background: color, width: "100%", animationDelay: "200ms" }}
              />
            </div>
            <p className="mt-1.5 text-[10px] font-semibold" style={{ color }}>
              AES-256 · Encrypted
            </p>
          </div>
        </div>
        {/* fleet roll-up */}
        <div className="mt-3 flex items-center gap-x-2 border-t pt-2" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          <span className="text-[10px]" style={{ color: T.inkSubtle }}>
            Fleet
          </span>
          <span className="text-[10px] font-semibold tabular-nums" style={{ color: T.ink }}>
            47 / 47
          </span>
          <span className="ml-auto text-[10px] font-medium" style={{ color: "#0d8050" }}>
            ✓ all encrypted
          </span>
        </div>
      </FintaCard>
    </div>
  );
}

// App Control — Surface: app allowlist. Three managed apps with branded
// icon tiles, each with an allow/review status.
function IllusAppControl({ color }: { color: string }) {
  const apps: Array<{ n: string; bg: string; ch: string; status: "ok" | "review" }> = [
    { n: "Slack", bg: "linear-gradient(135deg,#36C5F0,#E01E5A,#ECB22E)", ch: "S", status: "ok" },
    { n: "Cursor", bg: "linear-gradient(135deg,#1f1f1f,#404040)", ch: "C", status: "ok" },
    { n: "iTerm 2.app", bg: "#fff", ch: "I", status: "review" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden">
        <div
          className="flex items-center justify-between border-b px-3 py-2"
          style={{ borderColor: "rgba(38,38,43,0.06)" }}
        >
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>
            Allowed apps
          </span>
          <span className="text-[10px] tabular-nums" style={{ color: T.inkSubtle }}>
            42 / 47
          </span>
        </div>
        <ul>
          {apps.map((a, i) => (
            <li
              key={i}
              className="osto-appear flex items-center gap-x-2 border-b px-3 py-1.5 last:border-b-0"
              style={{ borderColor: "rgba(38,38,43,0.04)", animationDelay: `${250 + i * 110}ms` }}
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold"
                style={{
                  background: a.bg,
                  color: a.status === "review" ? T.inkSoft : "#fff",
                  boxShadow: a.status === "review" ? "inset 0 0 0 1px rgba(38,38,43,0.12)" : "none",
                }}
              >
                {a.ch}
              </span>
              <span className="flex-1 text-[10px] font-medium" style={{ color: T.ink }}>
                {a.n}
              </span>
              {a.status === "ok" ? (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                  style={{ background: "rgba(25,169,116,0.14)", color: "#0d8050", letterSpacing: "0.04em" }}
                >
                  TRUSTED
                </span>
              ) : (
                <span
                  className="osto-chip-glow rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                  style={{ background: `${color}1a`, color, letterSpacing: "0.04em" }}
                >
                  REVIEW
                </span>
              )}
            </li>
          ))}
        </ul>
      </FintaCard>
    </div>
  );
}

// Device Control — Surface: device-event card. USB peripheral artwork +
// "Denied" status + the policy that triggered it.
function IllusDeviceControl({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden p-3">
        <div className="flex items-start gap-x-2.5">
          {/* USB plug artwork */}
          <div
            className="osto-icon-pulse flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px]"
            style={{ background: `${color}14` }}
          >
            <svg width="18" height="20" viewBox="0 0 18 22" fill="none">
              <path d="M9 2 V19" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="9" cy="5" r="2.2" fill={color} />
              <rect x="6" y="13" width="6" height="6" rx="1" stroke={color} strokeWidth="1.6" />
              <line x1="7.5" y1="9" x2="7.5" y2="10.4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
              <line x1="10.5" y1="9" x2="10.5" y2="10.4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1 leading-tight">
            <div className="flex items-center gap-x-1.5">
              <p className="text-[11px] font-semibold" style={{ color: T.ink }}>
                USB device denied
              </p>
            </div>
            <p className="mt-0.5 text-[10px]" style={{ color: T.inkSubtle }}>
              SanDisk Cruzer · 32 GB
            </p>
          </div>
          <span
            className="osto-stamp rounded-full px-2 py-0.5 text-[9px] font-bold"
            style={{ background: color, color: "#fff", letterSpacing: "0.04em", animationDelay: "350ms" }}
          >
            BLOCKED
          </span>
        </div>
        {/* policy reference */}
        <div
          className="mt-3 flex items-center gap-x-1.5 rounded-[6px] px-2 py-1.5"
          style={{ background: T.panel }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M3 1.5 H8 L10 3.5 V10 L3 10 Z" stroke={T.inkSoft} strokeWidth="1" strokeLinejoin="round" />
            <path d="M5 5.5 H8 M5 7 H7" stroke={T.inkSoft} strokeWidth="1" strokeLinecap="round" />
          </svg>
          <span className="text-[10px]" style={{ color: T.inkSoft }}>
            Policy:
          </span>
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>
            block-removable-media
          </span>
        </div>
      </FintaCard>
    </div>
  );
}

// DLP — Surface: spreadsheet preview. CSV file fragment with two columns
// visibly masked with a dotted pattern.
function IllusDLP({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden">
        <div
          className="flex items-center gap-x-2 border-b px-3 py-2"
          style={{ borderColor: "rgba(38,38,43,0.06)" }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 1.5 L7 1.5 L9.5 4 V10.5 L2.5 10.5 Z" stroke={T.inkSoft} strokeWidth="1" strokeLinejoin="round" />
            <path d="M7 1.5 V4 H9.5" stroke={T.inkSoft} strokeWidth="1" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>
            customers.csv
          </span>
          <span className="ml-auto text-[10px]" style={{ color: T.inkSubtle }}>
            12,481 rows
          </span>
        </div>
        {/* table header */}
        <div
          className="grid grid-cols-3 gap-x-2 border-b px-3 py-1.5 text-[9px] font-medium"
          style={{ borderColor: "rgba(38,38,43,0.04)", color: T.inkSubtle, letterSpacing: "0.04em" }}
        >
          <span>NAME</span>
          <span>EMAIL</span>
          <span>PHONE</span>
        </div>
        {/* rows with masked columns */}
        {[
          { n: "Yash R." },
          { n: "Anita K." },
          { n: "Rohan P." },
        ].map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-3 gap-x-2 border-b px-3 py-1.5 text-[10px] last:border-b-0"
            style={{ borderColor: "rgba(38,38,43,0.04)" }}
          >
            <span style={{ color: T.ink }}>{r.n}</span>
            <span
              className="osto-mask-shift h-2.5 self-center rounded"
              style={{
                background: `repeating-linear-gradient(90deg, ${color} 0 3px, ${color}66 3px 6px)`,
              }}
            />
            <span
              className="osto-mask-shift h-2.5 self-center rounded"
              style={{
                background: `repeating-linear-gradient(90deg, ${color} 0 3px, ${color}66 3px 6px)`,
                width: "70%",
              }}
            />
          </div>
        ))}
        <div
          className="flex items-center gap-x-1.5 border-t px-3 py-1.5"
          style={{ borderColor: "rgba(38,38,43,0.06)", background: T.panel }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
          <span className="text-[10px] font-medium" style={{ color: T.inkSoft }}>
            2 columns auto-masked · email, phone
          </span>
        </div>
      </FintaCard>
    </div>
  );
}

// Screen Lock — Surface: lock screen mockup. Mac-style lock screen with a
// big clock and a small lock-icon affordance.
function IllusScreenLock({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <div
        className="osto-float relative flex h-[160px] w-[240px] flex-col items-center justify-center overflow-hidden rounded-[10px]"
        style={{
          background: `linear-gradient(135deg, ${color}, #0d1539)`,
          boxShadow: `0 0 0 1px rgba(38,38,43,0.08), 0 12px 24px -8px ${color}40`,
        }}
      >
        {/* soft "wallpaper" highlights */}
        <div
          className="absolute -top-12 -left-8 h-32 w-32 rounded-full"
          style={{ background: "rgba(255,255,255,0.08)", filter: "blur(8px)" }}
        />
        <div
          className="absolute -bottom-10 -right-6 h-24 w-24 rounded-full"
          style={{ background: "rgba(255,255,255,0.06)", filter: "blur(10px)" }}
        />
        {/* clock */}
        <div className="relative flex flex-col items-center text-white">
          <span
            className="tabular-nums"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "42px",
              fontWeight: 500,
              lineHeight: "1",
              letterSpacing: "-1.4px",
            }}
          >
            11:50
          </span>
          <span
            className="mt-1 text-[10px] font-medium"
            style={{ color: "rgba(255,255,255,0.78)", letterSpacing: "0.02em" }}
          >
            Friday, May 9
          </span>
        </div>
        {/* lock badge bottom */}
        <div className="relative mt-4 flex items-center gap-x-1.5 rounded-full bg-white/15 px-2 py-1 backdrop-blur">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <rect x="2.5" y="5.5" width="7" height="5" rx="1" fill="#fff" />
            <path d="M4 5.5 V3.8 a2 2 0 0 1 4 0 V5.5" stroke="#fff" strokeWidth="1.2" fill="none" />
          </svg>
          <span className="text-[10px] font-medium text-white">
            Locked · idle 1:00
          </span>
        </div>
      </div>
    </div>
  );
}

// Swipe Clean — Surface: remote-wipe progress card. Phone artwork being
// erased + step list showing what's been wiped.
function IllusSwipe({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden p-3">
        <div className="flex items-start gap-x-3">
          {/* phone with progress fill */}
          <div className="relative flex h-[88px] w-[44px] shrink-0 items-center justify-center">
            <div
              className="absolute inset-0 rounded-[10px] p-[3px]"
              style={{ background: T.panel, boxShadow: "inset 0 0 0 1px rgba(38,38,43,0.06)" }}
            >
              <div
                className="relative h-full w-full overflow-hidden rounded-[7px]"
                style={{ background: "#fff", boxShadow: "inset 0 0 0 1px rgba(38,38,43,0.04)" }}
              >
                {/* fill — bottom-up wipe */}
                <div
                  className="osto-fill-up absolute bottom-0 left-0 right-0"
                  style={{ background: `${color}1a` }}
                />
                <div
                  className="absolute left-0 right-0"
                  style={{ bottom: "62%", height: "1px", background: color, opacity: 0.6 }}
                />
              </div>
            </div>
          </div>
          {/* steps */}
          <div className="flex-1 leading-tight">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-semibold" style={{ color: T.ink }}>
                Wiping device
              </p>
              <span
                className="text-[10px] font-semibold tabular-nums"
                style={{ color }}
              >
                62%
              </span>
            </div>
            <p className="mt-0.5 text-[10px]" style={{ color: T.inkSubtle }}>
              MacBook Pro · Yash
            </p>
            <ul className="mt-2 space-y-1">
              {[
                { t: "Browser data", on: true },
                { t: "Saved tokens", on: true },
                { t: "User profile", on: false },
              ].map((s, i) => (
                <li
                  key={i}
                  className="osto-appear flex items-center gap-x-1.5"
                  style={{ animationDelay: `${300 + i * 130}ms` }}
                >
                  <span
                    className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: s.on ? color : "#fff",
                      boxShadow: s.on ? "none" : `inset 0 0 0 1px ${T.inkFaint}`,
                    }}
                  >
                    {s.on && (
                      <svg width="6" height="6" viewBox="0 0 8 8" fill="none">
                        <path d="m1.5 4 1.7 1.7L6.5 2.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: s.on ? T.ink : T.inkSubtle, fontWeight: s.on ? 500 : 400 }}
                  >
                    {s.t}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FintaCard>
    </div>
  );
}

// ── Network category ───────────────────────────────────────────────

// ZTNA — Surface: access decision modal. User identity + 2FA + grant
// scope, with an ALLOW stamp. The "decision being made" surface.
function IllusZTNA({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden">
        {/* decision header */}
        <div
          className="flex items-center gap-x-2 border-b px-3 py-2"
          style={{ borderColor: "rgba(38,38,43,0.06)" }}
        >
          <span
            className="osto-stamp rounded-full px-2 py-0.5 text-[9px] font-bold"
            style={{ background: "rgba(25,169,116,0.16)", color: "#0d8050", letterSpacing: "0.04em", animationDelay: "350ms" }}
          >
            ALLOW
          </span>
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>
            prod-db.osto.internal
          </span>
        </div>
        {/* policy rows */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-x-2 py-0.5">
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ background: color }}
            >
              N
            </div>
            <div className="flex-1 leading-tight">
              <p className="text-[10px] font-semibold" style={{ color: T.ink }}>
                Nitin Yadav
              </p>
              <p className="text-[10px]" style={{ color: T.inkSubtle }}>
                engineer · IST
              </p>
            </div>
            <span
              className="osto-chip-glow rounded-full px-1.5 py-0.5 text-[9px] font-bold"
              style={{ background: "rgba(25,169,116,0.14)", color: "#0d8050", letterSpacing: "0.04em" }}
            >
              2FA ✓
            </span>
          </div>
          {/* time window */}
          <div
            className="mt-2 flex items-center gap-x-2 rounded-[6px] px-2 py-1.5"
            style={{ background: T.panel }}
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="4.2" stroke={T.inkSoft} strokeWidth="1" fill="none" />
              <path d="M6 4 V6 L7.5 7" stroke={T.inkSoft} strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span className="text-[10px]" style={{ color: T.inkSoft }}>
              Window
            </span>
            <span className="ml-auto text-[10px] font-medium" style={{ color: T.ink }}>
              14:00 – 18:00 IST
            </span>
          </div>
        </div>
      </FintaCard>
    </div>
  );
}

// Domain — Surface: blocked-page screenshot. A fake browser chrome with
// the address bar showing a phishing domain and a captive page beneath.
function IllusDomain({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden">
        {/* browser chrome */}
        <div
          className="flex items-center gap-x-1.5 border-b px-3 py-2"
          style={{ borderColor: "rgba(38,38,43,0.06)" }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="h-2 w-2 rounded-full" style={{ background: "#febc2e" }} />
          <span className="h-2 w-2 rounded-full" style={{ background: "#28c840" }} />
          <div
            className="ml-2 flex flex-1 items-center gap-x-1 rounded px-2 py-0.5"
            style={{ background: T.panel }}
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <rect x="2" y="4.5" width="6" height="4" rx="0.6" fill={color} />
              <path d="M3.4 4.5 V3.2 a1.6 1.6 0 0 1 3.2 0 V4.5" stroke={color} strokeWidth="1" fill="none" />
            </svg>
            <span className="osto-block-blink text-[10px] font-medium" style={{ color }}>
              phishy-vault.xyz
            </span>
            <span className="ml-auto text-[10px]" style={{ color: T.inkSubtle }}>
              ⌘
            </span>
          </div>
        </div>
        {/* captive block page */}
        <div className="flex flex-col items-center px-4 py-4">
          <div
            className="osto-icon-pulse mb-2 flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: `${color}14` }}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M9 1.5 L15 4 V9 C15 12.5 12.5 14.7 9 16 C5.5 14.7 3 12.5 3 9 V4 Z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
              <path d="m6.5 6.5 5 5 m0-5-5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[11px] font-semibold" style={{ color: T.ink }}>
            Site blocked by Osto
          </p>
          <p className="mt-1 text-[10px]" style={{ color: T.inkSubtle }}>
            Phishing · matched on threat-intel feed
          </p>
        </div>
      </FintaCard>
    </div>
  );
}

// ── Compliance category ────────────────────────────────────────────

// AI Q&A — Surface: questionnaire row + AI-drafted answer. Looks like the
// surface where AI is filling in a security questionnaire response.
function IllusAIQA({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden">
        {/* question header */}
        <div
          className="flex items-center justify-between border-b px-3 py-2"
          style={{ borderColor: "rgba(38,38,43,0.06)" }}
        >
          <span className="text-[10px] font-semibold" style={{ color: T.inkSubtle }}>
            Q12 · Encryption
          </span>
          <span
            className="flex items-center gap-x-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
            style={{ background: `${color}1a`, color, letterSpacing: "0.04em" }}
          >
            <svg className="osto-sparkle" width="8" height="8" viewBox="0 0 10 10" fill="none">
              <path d="M5 1 L6 4 L9 5 L6 6 L5 9 L4 6 L1 5 L4 4 Z" fill={color} />
            </svg>
            AI DRAFTED
          </span>
        </div>
        {/* question text */}
        <p className="px-3 pt-2 text-[11px] font-semibold" style={{ color: T.ink }}>
          Do you encrypt endpoints at rest?
        </p>
        {/* answer */}
        <div className="osto-appear px-3 py-2" style={{ animationDelay: "350ms" }}>
          <p
            className="text-[10px]"
            style={{ color: T.inkSoft, lineHeight: 1.5 }}
          >
            Yes. <span style={{ color: T.ink, fontWeight: 600 }}>AES-256</span> enforced across
            managed macOS and Windows devices. Live evidence from Disk
            Encryption module.<span className="osto-caret" style={{ marginLeft: "2px", color: T.ink }}>▍</span>
          </p>
        </div>
        {/* citation footer */}
        <div
          className="flex items-center gap-x-1.5 border-t px-3 py-1.5"
          style={{ borderColor: "rgba(38,38,43,0.06)", background: T.panel }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
          <span className="text-[10px]" style={{ color: T.inkSoft }}>
            Cited:
          </span>
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>
            Disk Encryption · 47 / 47
          </span>
        </div>
      </FintaCard>
    </div>
  );
}

// Compliance Automation — Surface: framework readiness chart. Bar chart
// (color reserved for data) showing SOC 2 / ISO / HIPAA progress.
function IllusCompliance({ color }: { color: string }) {
  const frameworks = [
    { f: "SOC 2", w: 92, c: "92 / 100" },
    { f: "ISO 27001", w: 77, c: "88 / 114" },
    { f: "HIPAA", w: 83, c: "54 / 65" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden p-3">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-semibold" style={{ color: T.ink }}>
            Framework readiness
          </p>
          <span className="text-[10px]" style={{ color: T.inkSubtle }}>
            live
          </span>
        </div>
        <ul className="mt-2.5 space-y-2">
          {frameworks.map((f, i) => (
            <li key={f.f}>
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-medium" style={{ color: T.ink }}>
                  {f.f}
                </span>
                <span
                  className="text-[10px] font-semibold tabular-nums"
                  style={{ color: T.inkSoft }}
                >
                  {f.c}
                </span>
              </div>
              <div
                className="mt-1 h-1.5 w-full overflow-hidden rounded-full"
                style={{ background: T.panel }}
              >
                <div
                  className="osto-bar-fill h-full rounded-full"
                  style={{ width: `${f.w}%`, background: color, animationDelay: `${250 + i * 140}ms` }}
                />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-2.5 flex items-center gap-x-1.5 border-t pt-2" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          <span className="osto-live h-1.5 w-1.5 rounded-full" style={{ background: "#19a974" }} />
          <span className="text-[10px] font-medium" style={{ color: T.inkSoft }}>
            Evidence syncing · 5 min ago
          </span>
        </div>
      </FintaCard>
    </div>
  );
}

// Training — Surface: phishing quiz card. Question + radio options with
// one selected (correct), score chip top-right.
function IllusTraining({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold" style={{ color: T.inkSubtle }}>
            Phishing · Q3 / 8
          </span>
          <span
            className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
            style={{ background: "rgba(25,169,116,0.14)", color: "#0d8050", letterSpacing: "0.04em" }}
          >
            87% PASS
          </span>
        </div>
        <p className="mt-2 text-[11px] font-semibold" style={{ color: T.ink }}>
          You receive a link from “IT-support”. What now?
        </p>
        <div className="mt-2 space-y-1">
          {[
            { t: "Hover and inspect URL first", on: true },
            { t: "Reply with credentials" },
            { t: "Forward to leadership" },
          ].map((opt, i) => (
            <div
              key={i}
              className={`flex items-center gap-x-2 rounded-[6px] px-2 py-1.5 osto-appear ${opt.on ? "osto-chip-glow" : ""}`}
              style={{
                background: opt.on ? `${color}10` : T.panel,
                boxShadow: opt.on ? `inset 0 0 0 1px ${color}33` : "none",
                animationDelay: `${250 + i * 110}ms`,
              }}
            >
              <span
                className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: opt.on ? color : "#fff",
                  boxShadow: opt.on ? "none" : `inset 0 0 0 1px ${T.inkFaint}`,
                }}
              >
                {opt.on && (
                  <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                    <path d="m1.5 4 1.7 1.7L6.5 2.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span
                className="text-[10px]"
                style={{ color: T.ink, fontWeight: opt.on ? 600 : 400 }}
              >
                {opt.t}
              </span>
            </div>
          ))}
        </div>
      </FintaCard>
    </div>
  );
}

// Logs — Surface: live log tail. Header dot pulses, four log rows with
// one WARN highlighted brand-color.
function IllusLogs({ color }: { color: string }) {
  const rows: Array<{ sev: string; msg: string; warn?: boolean }> = [
    { sev: "INFO", msg: "user.login · nitin@osto.one" },
    { sev: "INFO", msg: "evidence.synced · soc2-cc6.1" },
    { sev: "WARN", msg: "policy.drift · cspm-04 · S3", warn: true },
    { sev: "INFO", msg: "scan.complete · web-01" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden">
        <div
          className="flex items-center gap-x-2 border-b px-3 py-2"
          style={{ borderColor: "rgba(38,38,43,0.06)" }}
        >
          <span
            className="osto-live h-1.5 w-1.5 rounded-full"
            style={{ background: "#19a974", boxShadow: "0 0 0 3px rgba(25,169,116,0.18)" }}
          />
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>
            Live tail · audit.log
          </span>
          <span className="ml-auto text-[10px]" style={{ color: T.inkSubtle }}>
            127 today
          </span>
        </div>
        <ul className="px-3 py-2">
          {rows.map((l, i) => (
            <li
              key={i}
              className={`flex items-baseline gap-x-2 rounded px-1 py-[2px] osto-appear ${l.warn ? "osto-row-sheen" : ""}`}
              style={{
                background: l.warn ? `${color}10` : "transparent",
                boxShadow: l.warn ? `inset 2px 0 0 0 ${color}` : "none",
                animationDelay: `${250 + i * 90}ms`,
              }}
            >
              <span
                className="text-[9px] font-bold tabular-nums"
                style={{
                  color: l.warn ? color : T.inkFaint,
                  width: "32px",
                  letterSpacing: "0.04em",
                }}
              >
                {l.sev}
              </span>
              <span
                className="text-[10px]"
                style={{ color: l.warn ? T.ink : T.inkSoft, fontWeight: l.warn ? 600 : 400 }}
              >
                {l.msg}
              </span>
            </li>
          ))}
        </ul>
      </FintaCard>
    </div>
  );
}

// VAPT — Surface: engagement report. Header with engagement detail, scope
// chips, and finding stats grid.
function IllusVAPT({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[280px] overflow-hidden p-3">
        <div className="flex items-center justify-between">
          <div className="leading-tight">
            <p className="text-[10px] font-semibold" style={{ color: T.inkSubtle }}>
              Engagement
            </p>
            <p className="text-[11px] font-semibold" style={{ color: T.ink }}>
              OSCP-led · 7-day delivery
            </p>
          </div>
          <span
            className="osto-chip-glow rounded-full px-2 py-0.5 text-[9px] font-bold"
            style={{ background: "rgba(25,169,116,0.14)", color: "#0d8050", letterSpacing: "0.04em" }}
          >
            ON TRACK
          </span>
        </div>
        {/* scope chips */}
        <div className="mt-2 flex items-center gap-x-1.5">
          {[
            { l: "Web", on: true },
            { l: "API", on: true },
            { l: "Mobile", on: false },
          ].map((s) => (
            <span
              key={s.l}
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{
                background: s.on ? color : "#fff",
                color: s.on ? "#fff" : T.inkSoft,
                boxShadow: s.on ? "none" : `inset 0 0 0 1px ${T.inkFaint}`,
              }}
            >
              {s.l}
            </span>
          ))}
        </div>
        {/* finding stats */}
        <div
          className="mt-3 grid grid-cols-3 gap-x-2 border-t pt-2"
          style={{ borderColor: "rgba(38,38,43,0.06)" }}
        >
          {[
            { l: "Critical", v: "0", g: true },
            { l: "High", v: "2", c: true },
            { l: "Medium", v: "5" },
          ].map((s, i) => (
            <div key={s.l} className="leading-tight">
              <p
                className="text-[9px] font-semibold"
                style={{ color: T.inkSubtle, letterSpacing: "0.04em" }}
              >
                {s.l.toUpperCase()}
              </p>
              <p
                className="osto-count-up mt-0.5 text-[16px] font-semibold tabular-nums"
                style={{
                  color: s.g ? "#0d8050" : s.c ? color : T.ink,
                  letterSpacing: "-0.3px",
                  animationDelay: `${300 + i * 130}ms`,
                }}
              >
                {s.v}
              </p>
            </div>
          ))}
        </div>
      </FintaCard>
    </div>
  );
}

export function OstoModulesStyles() {
  return (
    <style>{`
      @keyframes ostoTileEnter {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .osto-tile-fade {
        animation: ostoTileEnter 480ms cubic-bezier(0.2,0.8,0.2,1) both;
      }
      .osto-tile-rise {
        animation: ostoTileEnter 600ms cubic-bezier(0.2,0.8,0.2,1) both;
      }

      /* ── Per-illustration motion ───────────────────────────────── */

      /* Soft "live" dot — green or brand status pulse */
      @keyframes ostoLivePulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.55; transform: scale(0.85); }
      }
      .osto-live { animation: ostoLivePulse 1.6s ease-in-out infinite; transform-origin: center; }

      /* Slow soft glow for status chips */
      @keyframes ostoChipGlow {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      .osto-chip-glow { animation: ostoChipGlow 2.4s ease-in-out infinite; }

      /* CSPM Auto-fix button shimmer */
      @keyframes ostoBtnShimmer {
        0%, 100% { box-shadow: 0 0 0 0 rgba(28,38,122,0); }
        50% { box-shadow: 0 0 0 4px rgba(28,38,122,0.18); }
      }
      .osto-btn-shimmer { animation: ostoBtnShimmer 2.2s ease-in-out infinite; }

      /* WAF / Logs row sweep — highlighted row gets a subtle horizontal sheen */
      @keyframes ostoRowSheen {
        0%, 100% { background-position: 200% 0; }
        50% { background-position: -100% 0; }
      }
      .osto-row-sheen {
        background-image: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%);
        background-size: 60% 100%;
        background-repeat: no-repeat;
        animation: ostoRowSheen 2.8s ease-in-out infinite;
      }

      /* New-row slide in (used for live feeds) */
      @keyframes ostoSlideIn {
        0% { opacity: 0; transform: translateX(-6px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      .osto-slide-in { animation: ostoSlideIn 700ms cubic-bezier(0.2,0.8,0.2,1) both; }

      /* Web scanner progress bar — fills 0→52% over time then resets */
      @keyframes ostoProgressLoop {
        0% { width: 18%; }
        85% { width: 78%; }
        100% { width: 18%; }
      }
      .osto-progress-loop { animation: ostoProgressLoop 4s ease-in-out infinite; }

      /* Single sweep — encryption fill once, hold */
      @keyframes ostoFillOnce {
        0% { transform: scaleX(0); }
        100% { transform: scaleX(1); }
      }
      .osto-fill-once { animation: ostoFillOnce 1.4s cubic-bezier(0.2,0.8,0.2,1) both; transform-origin: left center; }

      /* Vertical fill — Swipe wipe rises */
      @keyframes ostoFillUp {
        0% { height: 0%; }
        100% { height: 62%; }
      }
      .osto-fill-up { animation: ostoFillUp 2s cubic-bezier(0.2,0.8,0.2,1) both; }

      /* Subtle scan line — vertical sweep on a card body */
      @keyframes ostoScanLine {
        0% { transform: translateY(-100%); opacity: 0; }
        20% { opacity: 0.7; }
        80% { opacity: 0.7; }
        100% { transform: translateY(120%); opacity: 0; }
      }
      .osto-scan-line { animation: ostoScanLine 2.6s ease-in-out infinite; }

      /* Highlighted code line breath */
      @keyframes ostoLineBreath {
        0%, 100% { background-color: rgba(28,38,122,0.06); }
        50% { background-color: rgba(28,38,122,0.16); }
      }
      .osto-line-breath { animation: ostoLineBreath 2.2s ease-in-out infinite; }

      /* Shield/icon emphasis ring */
      @keyframes ostoIconPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }
      .osto-icon-pulse { animation: ostoIconPulse 2.4s ease-in-out infinite; transform-origin: center; }

      /* Stamp / blocked badge — settle */
      @keyframes ostoStampIn {
        0% { opacity: 0; transform: scale(1.15) rotate(-3deg); }
        60% { opacity: 1; transform: scale(0.97) rotate(-1deg); }
        100% { opacity: 1; transform: scale(1) rotate(0); }
      }
      .osto-stamp { animation: ostoStampIn 800ms cubic-bezier(0.2,0.8,0.2,1) both; }

      /* DLP masked column shimmer — keep stripes moving */
      @keyframes ostoMaskShift {
        0% { background-position: 0 0; }
        100% { background-position: 12px 0; }
      }
      .osto-mask-shift { animation: ostoMaskShift 1.4s linear infinite; }

      /* Sparkle rotation for AI icon */
      @keyframes ostoSparkle {
        0%, 100% { transform: rotate(0); opacity: 1; }
        50% { transform: rotate(20deg); opacity: 0.85; }
      }
      .osto-sparkle { animation: ostoSparkle 2.8s ease-in-out infinite; transform-origin: center; }

      /* Type-in cursor / text-revealing caret */
      @keyframes ostoCaret {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
      }
      .osto-caret { animation: ostoCaret 900ms steps(1) infinite; display: inline-block; }

      /* Compliance bars fill from 0 → final width on tab change */
      @keyframes ostoBarFill {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
      .osto-bar-fill { animation: ostoBarFill 1.3s cubic-bezier(0.2,0.8,0.2,1) both; transform-origin: left center; }

      /* VAPT count-up — quick number flicker on enter */
      @keyframes ostoCountUp {
        0% { opacity: 0; transform: translateY(6px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .osto-count-up { animation: ostoCountUp 700ms cubic-bezier(0.2,0.8,0.2,1) both; }

      /* Soft float — phones, drives, USB plugs */
      @keyframes ostoFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }
      .osto-float { animation: ostoFloat 3.2s ease-in-out infinite; }

      /* Browser address-bar lock blink for Domain */
      @keyframes ostoBlockBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.55; }
      }
      .osto-block-blink { animation: ostoBlockBlink 1.8s ease-in-out infinite; }

      /* Checkmark draw — used for ZTNA / Mobile / Training selections */
      @keyframes ostoCheckDraw {
        from { stroke-dashoffset: 12; }
        to { stroke-dashoffset: 0; }
      }
      .osto-check-draw path {
        stroke-dasharray: 12;
        stroke-dashoffset: 12;
        animation: ostoCheckDraw 600ms cubic-bezier(0.2,0.8,0.2,1) both;
      }

      /* Generic appear — fades and rises with delay support via inline style */
      @keyframes ostoAppear {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .osto-appear { animation: ostoAppear 600ms cubic-bezier(0.2,0.8,0.2,1) both; }

      @media (prefers-reduced-motion: reduce) {
        .osto-tile-fade, .osto-tile-rise,
        .osto-live, .osto-chip-glow, .osto-btn-shimmer, .osto-row-sheen,
        .osto-slide-in, .osto-progress-loop, .osto-fill-once, .osto-fill-up,
        .osto-scan-line, .osto-line-breath, .osto-icon-pulse, .osto-stamp,
        .osto-mask-shift, .osto-sparkle, .osto-caret, .osto-bar-fill,
        .osto-count-up, .osto-float, .osto-block-blink, .osto-check-draw path,
        .osto-appear {
          animation: none !important;
        }
      }
    `}</style>
  );
}
