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

const CATS: Category[] = [
  {
    key: "cloud",
    label: "Cloud",
    color: "#1c267a",
    colorSoft: "rgba(28,38,122,0.10)",
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
    color: "#0ea5e9",
    colorSoft: "rgba(14,165,233,0.10)",
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
    color: "#0d9488",
    colorSoft: "rgba(13,148,136,0.10)",
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
    color: "#7c3aed",
    colorSoft: "rgba(124,58,237,0.10)",
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
    color: "#d97706",
    colorSoft: "rgba(217,119,6,0.10)",
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
    <section className="px-6 pt-4" style={{ color: T.ink }}>
      <div className="mx-auto max-w-[1240px]">
        {/* Eyebrow + Heading */}
        <div className="text-center">
          <span
            className="inline-flex items-center gap-x-2 text-[12px] font-medium"
            style={{ color: cat.color, letterSpacing: "-0.018px" }}
          >
            <span
              aria-hidden
              className="inline-block h-2.5 w-4 rounded transition-colors"
              style={{ background: cat.color }}
            />
            Every module, built in-house
          </span>
          <h2
            className="mx-auto mt-4 max-w-[680px] text-balance md:mt-5"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(28px, 4vw, 40px)",
              lineHeight: "1.1",
              letterSpacing: "-0.025em",
              fontWeight: 500,
              color: T.ink,
            }}
          >
            Twenty modules. <span style={{ color: cat.color, transition: "color 320ms ease-out" }}>One platform.</span>
          </h2>
          <p
            className="mx-auto mt-3 max-w-[520px]"
            style={{
              color: T.inkSoft,
              fontSize: "14px",
              lineHeight: "24px",
              letterSpacing: "-0.14px",
            }}
          >
            Cloud, app, endpoint, network, compliance. Every layer of the stack, built and integrated by Osto. No third-party patchwork.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Module categories"
            className="flex w-full max-w-[920px] items-center justify-center gap-x-1 overflow-x-auto"
          >
            {CATS.map((c) => {
              const isActive = c.key === active;
              return (
                <button
                  key={c.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(c.key)}
                  className="relative whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium tracking-[-0.13px] transition-[background-color,color,box-shadow,scale] duration-300 ease-out active:scale-[0.96]"
                  style={{
                    background: isActive ? c.color : "transparent",
                    color: isActive ? "#ffffff" : T.inkSoft,
                    boxShadow: isActive
                      ? `inset 0 1px 0.5px rgba(255,255,255,0.18), 0 1px 1px rgba(0,0,0,0.10), 0 2px 6px -2px ${c.color}66`
                      : "none",
                  }}
                >
                  {c.label}
                  <span
                    className="ml-1.5 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                    style={{
                      background: isActive
                        ? "rgba(255,255,255,0.18)"
                        : "rgba(38,38,43,0.06)",
                      color: isActive ? "#ffffff" : T.inkSubtle,
                    }}
                  >
                    {c.modules.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Module grid — dynamic column count, no empty placeholders */}
        <div
          key={cycle}
          className="mx-auto mt-10 overflow-hidden rounded-2xl"
          style={{
            background: T.surface,
            boxShadow: E.ringOnly,
            maxWidth: cols === 1 ? "420px" : cols === 2 ? "780px" : "1180px",
          }}
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {tiles.map((t, i) => {
              const isLastInRow = (i + 1) % cols === 0;
              const isLastRow = i >= tiles.length - (tiles.length % cols || cols);
              return (
                <ModuleTile
                  key={`${cycle}-${i}`}
                  module={t.mod}
                  cat={t.cat}
                  borderRight={!isLastInRow}
                  borderBottom={!isLastRow}
                  delay={i * 60}
                />
              );
            })}
          </div>
        </div>
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
  return (
    <article
      className="relative flex h-[340px] flex-col p-6"
      style={{
        background: T.surface,
        boxShadow: [
          borderRight ? `inset -0.5px 0 0 0 ${T.hairline}` : "",
          borderBottom ? `inset 0 -0.5px 0 0 ${T.hairline}` : "",
        ]
          .filter(Boolean)
          .join(", "),
      }}
    >
      <span
        className="absolute right-5 top-5 font-mono text-[10px] font-medium uppercase tracking-[0.1em]"
        style={{ color: T.inkFaint, opacity: 0.6 }}
      >
        MOD. [{module.num}]
      </span>

      <div
        className="osto-tile-fade flex items-start gap-x-2"
        style={{ animationDelay: `${delay}ms` }}
      >
        <span
          aria-hidden
          className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full"
          style={{ background: cat.color }}
        />
        <div>
          <h3
            className="font-medium"
            style={{
              fontFamily: "var(--font-sans)",
              color: T.ink,
              fontSize: "15px",
              lineHeight: "20px",
              letterSpacing: "-0.225px",
            }}
          >
            {module.title}
          </h3>
          <p
            className="mt-1 max-w-[240px]"
            style={{
              color: T.inkSoft,
              fontSize: "12.5px",
              lineHeight: "18px",
              letterSpacing: "-0.018px",
            }}
          >
            {module.desc}
          </p>
        </div>
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

// ── Cloud category ─────────────────────────────────────────────────

// 1. CSPM — three cloud provider rows with status dots
function IllusCSPM({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden">
        <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          <span className="text-[10px] font-semibold tracking-[-0.1px]" style={{ color: T.ink }}>
            Cloud posture
          </span>
          <span className="font-mono text-[9px]" style={{ color: T.inkSubtle }}>
            247 checks
          </span>
        </div>
        {[
          { p: "AWS", region: "us-east-1", n: "189", ok: true },
          { p: "Azure", region: "eastus", n: "42", ok: true },
          { p: "GCP", region: "us-central1", n: "16", warn: true },
        ].map((r) => (
          <div key={r.p} className="flex items-center gap-x-2 border-b px-3 py-2 last:border-b-0" style={{ borderColor: "rgba(38,38,43,0.04)" }}>
            <span className="flex h-5 w-5 items-center justify-center rounded text-[8.5px] font-bold" style={{ background: T.panel, color: T.ink }}>
              {r.p[0]}
            </span>
            <div className="flex-1 leading-tight">
              <p className="text-[10px] font-semibold" style={{ color: T.ink }}>{r.p}</p>
              <p className="font-mono text-[8.5px]" style={{ color: T.inkSubtle }}>{r.region}</p>
            </div>
            <span className="font-mono text-[10px]" style={{ color: T.ink }}>{r.n}</span>
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: r.warn ? color : "#19a974" }}
            />
          </div>
        ))}
      </FintaCard>
    </div>
  );
}

// 2. WAF — incoming request blocked, with tiny stats
function IllusWAF({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden p-3">
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: T.inkSubtle }}>Last 24h</span>
          <span className="font-mono text-[9px]" style={{ color: T.inkFaint }}>updated 2m ago</span>
        </div>
        <div className="mt-2 flex items-baseline gap-x-2">
          <span className="font-medium tabular-nums" style={{ color: T.ink, fontFamily: "var(--font-sans)", fontSize: "22px", letterSpacing: "-0.5px" }}>
            142,891
          </span>
          <span className="text-[10px] font-medium" style={{ color: "#19a974" }}>requests allowed</span>
        </div>
        <div className="mt-2 flex items-center gap-x-2">
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
            style={{ background: `${color}1a`, color }}
          >
            ✕ 1,204 blocked
          </span>
          <span className="font-mono text-[9px]" style={{ color: T.inkSubtle }}>OWASP, bot, DDoS</span>
        </div>
      </FintaCard>
    </div>
  );
}

// 3. API — endpoint list with shadow API detection
function IllusAPI({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden">
        <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>API endpoints</span>
          <span className="font-mono text-[9px]" style={{ color: T.inkSubtle }}>14 active</span>
        </div>
        {[
          { m: "GET", p: "/v1/users" },
          { m: "POST", p: "/v1/auth", shadow: true },
          { m: "GET", p: "/v1/orders" },
          { m: "PUT", p: "/v1/sessions" },
        ].map((e, i) => (
          <div key={i} className="flex items-center gap-x-2 px-3 py-1.5 border-b last:border-b-0" style={{ borderColor: "rgba(38,38,43,0.04)" }}>
            <span
              className="rounded font-mono text-[8.5px] font-bold"
              style={{
                background: e.m === "POST" ? color : T.panel,
                color: e.m === "POST" ? "#fff" : T.inkSoft,
                minWidth: "30px",
                textAlign: "center",
                padding: "2px 4px",
              }}
            >
              {e.m}
            </span>
            <span className="font-mono text-[10.5px]" style={{ color: T.ink }}>{e.p}</span>
            {e.shadow && (
              <span
                className="ml-auto rounded-full px-1.5 py-0.5 text-[8.5px] font-semibold"
                style={{ background: `${color}1a`, color }}
              >
                shadow
              </span>
            )}
          </div>
        ))}
      </FintaCard>
    </div>
  );
}

// ── Application category ───────────────────────────────────────────

// 4. Web App Scanner — finding card with severity + URL
function IllusWebScan({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden">
        <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>Latest scan</span>
          <span className="font-mono text-[9px]" style={{ color: T.inkSubtle }}>2 min ago</span>
        </div>
        {[
          { sev: "HIGH", url: "/api/v1/auth", w: 100 },
          { sev: "MED", url: "/admin/users", w: 60 },
          { sev: "LOW", url: "/static/js", w: 30 },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-x-2 px-3 py-1.5 border-b last:border-b-0" style={{ borderColor: "rgba(38,38,43,0.04)" }}>
            <span
              className="rounded text-[8.5px] font-bold"
              style={{
                background: f.sev === "HIGH" ? color : f.sev === "MED" ? `${color}66` : T.panel,
                color: f.sev === "LOW" ? T.inkSoft : "#fff",
                padding: "2px 5px",
                minWidth: "32px",
                textAlign: "center",
              }}
            >
              {f.sev}
            </span>
            <span className="font-mono text-[10px]" style={{ color: T.ink }}>{f.url}</span>
            <span className="ml-auto font-mono text-[9px]" style={{ color: T.inkSubtle }}>×{f.w / 30 | 0}</span>
          </div>
        ))}
      </FintaCard>
    </div>
  );
}

// 5. Mobile Scanner — phone build with pass/fail summary
function IllusMobile({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden p-3">
        <div className="flex items-center gap-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px]" style={{ background: T.panel }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="6" y="2" width="12" height="20" rx="2" stroke={T.ink} strokeWidth="1.6" />
              <line x1="10" y1="5" x2="14" y2="5" stroke={T.ink} strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1 leading-tight">
            <p className="text-[11px] font-semibold" style={{ color: T.ink }}>my-app v2.4.1</p>
            <p className="font-mono text-[9px]" style={{ color: T.inkSubtle }}>com.osto.demo · iOS + Android</p>
          </div>
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-x-2 border-t pt-2.5" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          {[
            { l: "Static", v: "OK", ok: true },
            { l: "Network", v: "OK", ok: true },
            { l: "Crypto", v: "1 issue", ok: false },
          ].map((s) => (
            <div key={s.l} className="leading-tight">
              <p className="font-mono text-[8.5px] uppercase tracking-[0.08em]" style={{ color: T.inkSubtle }}>{s.l}</p>
              <p className="text-[10px] font-semibold" style={{ color: s.ok ? "#19a974" : color }}>{s.v}</p>
            </div>
          ))}
        </div>
      </FintaCard>
    </div>
  );
}

// 6. SAST/SBOM — code review card with diff highlight
function IllusSAST({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden font-mono">
        <div className="flex items-center gap-x-2 border-b px-3 py-2" style={{ borderColor: "rgba(38,38,43,0.06)", fontFamily: "var(--font-sans)" }}>
          <span className="rounded px-1.5 py-0.5 text-[8.5px] font-bold" style={{ background: `${color}1a`, color }}>
            HIGH
          </span>
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>auth.ts</span>
          <span className="ml-auto font-mono text-[9px]" style={{ color: T.inkSubtle }}>L42</span>
        </div>
        <div className="px-3 py-2 text-[10px]">
          {[
            { t: "function login(user) {", off: 0 },
            { t: "  return verify(...)", off: 0, hi: true },
            { t: "}", off: 0 },
          ].map((line, i) => (
            <div key={i} className="flex items-center gap-x-2 py-[1px]">
              <span style={{ color: T.inkFaint, fontSize: "9px", width: "12px", textAlign: "right" }}>{41 + i}</span>
              <span
                className="rounded px-1.5 text-[10px]"
                style={{
                  marginLeft: line.off,
                  color: line.hi ? color : T.ink,
                  background: line.hi ? `${color}14` : "transparent",
                  fontWeight: line.hi ? 600 : 400,
                }}
              >
                {line.t}
              </span>
            </div>
          ))}
        </div>
      </FintaCard>
    </div>
  );
}

// ── Endpoint category ──────────────────────────────────────────────

// 7. Antimalware — threat blocked notification card
function IllusAntimalware({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden p-3">
        <div className="flex items-center gap-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: `${color}14` }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 1.5 L13 3.5 V8 Q13 12 8 14.5 Q3 12 3 8 V3.5 L8 1.5 Z" fill={color} />
              <path d="M5.5 8 L7 9.5 L10.5 6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1 leading-tight">
            <p className="text-[11px] font-semibold" style={{ color: T.ink }}>Threat blocked</p>
            <p className="font-mono text-[9px]" style={{ color: T.inkSubtle }}>Macintosh-Pro · 14:22</p>
          </div>
          <span className="rounded-full px-2 py-0.5 text-[8.5px] font-semibold" style={{ background: `${color}1a`, color }}>
            quarantined
          </span>
        </div>
        <div className="mt-2 rounded-md bg-[#fafafb] p-2 leading-tight">
          <p className="font-mono text-[9.5px]" style={{ color: T.ink }}>Trojan.MacOS.Generic.A</p>
          <p className="font-mono text-[9px]" style={{ color: T.inkSubtle }}>~/Downloads/installer.dmg</p>
        </div>
      </FintaCard>
    </div>
  );
}

// 8. Disk Encryption — drive card
function IllusDiskEnc({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden p-3">
        <div className="flex items-center gap-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[10px]" style={{ background: `${color}10` }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2.5" stroke={color} strokeWidth="1.6" />
              <circle cx="17" cy="12" r="1.6" fill={color} />
              <line x1="6" y1="9" x2="13" y2="9" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
              <line x1="6" y1="12" x2="11" y2="12" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
              <line x1="6" y1="15" x2="13" y2="15" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold" style={{ color: T.ink }}>Macintosh HD</p>
              <span className="font-mono text-[9px]" style={{ color: T.inkSubtle }}>512 GB</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ background: T.panel }}>
              <div className="h-full rounded-full" style={{ background: color, width: "100%" }} />
            </div>
            <p className="mt-1.5 text-[8.5px] font-bold uppercase tracking-[0.12em]" style={{ color }}>
              AES-256 · Encrypted
            </p>
          </div>
        </div>
      </FintaCard>
    </div>
  );
}

// 9. App Control — installed apps with allow/deny status
function IllusAppControl({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden">
        <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>Allowed apps</span>
          <span className="font-mono text-[9px]" style={{ color: T.inkSubtle }}>42 / 47</span>
        </div>
        {[
          { n: "Slack", k: "ok", g: "#ff7", g2: "#7af" },
          { n: "Cursor", k: "ok", g: "#000", g2: "#444" },
          { n: "iTerm 2.app", k: "warn" },
        ].map((a, i) => (
          <div key={i} className="flex items-center gap-x-2 px-3 py-1.5 border-b last:border-b-0" style={{ borderColor: "rgba(38,38,43,0.04)" }}>
            <span
              className="flex h-5 w-5 items-center justify-center rounded text-[8.5px] font-bold"
              style={{
                background: a.g ? `linear-gradient(135deg, ${a.g}, ${a.g2})` : T.panel,
                color: "#fff",
              }}
            >
              {a.n[0]}
            </span>
            <span className="text-[10px] font-medium" style={{ color: T.ink }}>{a.n}</span>
            <span
              className="ml-auto rounded-full px-1.5 py-0.5 text-[8.5px] font-semibold"
              style={{
                background: a.k === "ok" ? "rgba(25,169,116,0.12)" : `${color}1a`,
                color: a.k === "ok" ? "#0d8050" : color,
              }}
            >
              {a.k === "ok" ? "trusted" : "review"}
            </span>
          </div>
        ))}
      </FintaCard>
    </div>
  );
}

// 10. Device Control — USB device denied event
function IllusDeviceControl({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden p-3">
        <div className="flex items-center gap-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px]" style={{ background: `${color}14` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 2 L12 22" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="6" r="2" fill={color} />
              <rect x="9" y="14" width="6" height="6" rx="1" stroke={color} strokeWidth="1.6" />
              <line x1="10.5" y1="10" x2="10.5" y2="11" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
              <line x1="13.5" y1="10" x2="13.5" y2="11" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1 leading-tight">
            <p className="text-[11px] font-semibold" style={{ color: T.ink }}>USB device denied</p>
            <p className="font-mono text-[9px]" style={{ color: T.inkSubtle }}>SanDisk Cruzer · 32GB</p>
          </div>
        </div>
        <div className="mt-2 rounded-md bg-[#fafafb] px-2 py-1.5 leading-tight">
          <p className="text-[9px]" style={{ color: T.inkSoft }}>Policy: <span className="font-mono" style={{ color: T.ink }}>block-removable-media</span></p>
        </div>
      </FintaCard>
    </div>
  );
}

// 11. DLP — file with masked PII rows
function IllusDLP({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden">
        <div className="flex items-center gap-x-2 border-b px-3 py-2" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 2 L9 2 L13 6 L13 14 L3 14 Z" fill="#fafafb" stroke={T.ink} strokeWidth="1" strokeLinejoin="round" />
            <path d="M9 2 L9 6 L13 6" fill="none" stroke={T.ink} strokeWidth="1" strokeLinejoin="round" />
          </svg>
          <span className="text-[10.5px] font-semibold" style={{ color: T.ink }}>customers.csv</span>
          <span className="ml-auto rounded px-1.5 py-0.5 text-[8.5px] font-semibold" style={{ background: T.panel, color: T.inkSoft }}>
            12k rows
          </span>
        </div>
        <div className="px-3 py-2">
          {[
            { label: "name", w: 80, masked: false },
            { label: "email", w: 60, masked: true },
            { label: "phone", w: 50, masked: true },
          ].map((r, i) => (
            <div key={i} className="mt-1.5 flex items-center gap-x-2 first:mt-0">
              <span className="font-mono text-[9px]" style={{ color: T.inkSubtle, width: "44px" }}>{r.label}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: T.panel }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${r.w}%`,
                    background: r.masked
                      ? `repeating-linear-gradient(90deg, ${color} 0 3px, ${color}66 3px 6px)`
                      : T.inkFaint,
                    opacity: r.masked ? 1 : 0.6,
                  }}
                />
              </div>
              {r.masked && (
                <span className="rounded-full px-1.5 py-0.5 text-[8.5px] font-semibold" style={{ background: `${color}1a`, color }}>
                  masked
                </span>
              )}
            </div>
          ))}
        </div>
      </FintaCard>
    </div>
  );
}

// 12. Screen Lock — idle session card
function IllusScreenLock({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden p-3">
        <div className="flex items-center gap-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: T.panel }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="5" y="11" width="14" height="9" rx="2" stroke={color} strokeWidth="1.6" />
              <path d="M8 11 V8 a4 4 0 0 1 8 0 V11" stroke={color} strokeWidth="1.6" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold" style={{ color: T.ink }}>Idle session</p>
            <p className="mt-0.5 font-mono text-[18px] font-medium tabular-nums" style={{ color }}>
              0:32
            </p>
            <p className="mt-0.5 font-mono text-[9px]" style={{ color: T.inkSubtle }}>locks at 1:00 idle</p>
          </div>
        </div>
      </FintaCard>
    </div>
  );
}

// 13. Swipe Clean — devices wiped log card
function IllusSwipe({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden">
        <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>Recent wipes</span>
          <span className="font-mono text-[9px]" style={{ color: T.inkSubtle }}>this week</span>
        </div>
        {[
          { n: "MacBook Pro · Yash", t: "2h ago" },
          { n: "Dell XPS 15 · Anita", t: "1d ago" },
          { n: "iPhone 14 · Rohan", t: "3d ago" },
        ].map((d, i) => (
          <div key={i} className="flex items-center gap-x-2 px-3 py-1.5 border-b last:border-b-0" style={{ borderColor: "rgba(38,38,43,0.04)" }}>
            <span className="flex h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            <span className="text-[10px]" style={{ color: T.ink }}>{d.n}</span>
            <span className="ml-auto font-mono text-[9px]" style={{ color: T.inkSubtle }}>{d.t}</span>
          </div>
        ))}
      </FintaCard>
    </div>
  );
}

// ── Network category ───────────────────────────────────────────────

// 14. ZTNA — access policy card
function IllusZTNA({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden p-3">
        <div className="flex items-center gap-x-2">
          <span className="rounded-full px-2 py-0.5 text-[8.5px] font-bold" style={{ background: color, color: "#fff", letterSpacing: "0.04em" }}>
            ALLOW
          </span>
          <span className="text-[10.5px] font-semibold" style={{ color: T.ink }}>prod-db.osto.internal</span>
        </div>
        <div className="mt-2 grid gap-y-1.5 rounded-md bg-[#fafafb] p-2 leading-tight">
          <div className="flex items-center justify-between">
            <span className="text-[9px]" style={{ color: T.inkSubtle }}>User</span>
            <span className="font-mono text-[10px]" style={{ color: T.ink }}>nitin@osto.one</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px]" style={{ color: T.inkSubtle }}>2FA</span>
            <span className="rounded-full px-1.5 py-0.5 text-[8.5px] font-semibold" style={{ background: "rgba(25,169,116,0.14)", color: "#0d8050" }}>
              verified
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px]" style={{ color: T.inkSubtle }}>Window</span>
            <span className="font-mono text-[9.5px]" style={{ color: T.ink }}>14:00 – 18:00 IST</span>
          </div>
        </div>
      </FintaCard>
    </div>
  );
}

// 15. Domain Filtering — recent allow / block decisions
function IllusDomain({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden">
        <div className="flex items-center justify-between border-b px-3 py-2" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>Decisions · 5 min</span>
          <span className="font-mono text-[9px]" style={{ color: T.inkSubtle }}>auto</span>
        </div>
        {[
          { d: "stripe.com", ok: true },
          { d: "phishy-vault.xyz", ok: false },
          { d: "github.com", ok: true },
          { d: "api.openai.com", ok: true },
        ].map((u, i) => (
          <div key={i} className="flex items-center gap-x-2 px-3 py-1.5 border-b last:border-b-0" style={{ borderColor: "rgba(38,38,43,0.04)" }}>
            <span className="flex h-1.5 w-1.5 rounded-full" style={{ background: u.ok ? "#19a974" : color }} />
            <span className="font-mono text-[10px]" style={{ color: T.ink }}>{u.d}</span>
            {!u.ok && (
              <span className="ml-auto rounded-full px-1.5 py-0.5 text-[8.5px] font-semibold" style={{ background: `${color}1a`, color }}>
                blocked
              </span>
            )}
          </div>
        ))}
      </FintaCard>
    </div>
  );
}

// ── Compliance category ────────────────────────────────────────────

// 16. AI Q&A — questionnaire card with AI answer
function IllusAIQA({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden p-3">
        <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          <span className="text-[8.5px] font-bold uppercase tracking-[0.12em]" style={{ color: T.inkSubtle }}>Q12 · Encryption</span>
          <span className="rounded-full px-1.5 py-0.5 text-[8px] font-bold" style={{ background: `${color}1a`, color }}>AI</span>
        </div>
        <p className="mt-2 text-[10.5px] font-semibold" style={{ color: T.ink }}>
          Do you encrypt endpoints at rest?
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: T.panel }}>
          <div className="h-full w-[72%] rounded-full" style={{ background: color }} />
        </div>
        <p className="mt-2 text-[9.5px]" style={{ color: T.inkSoft, lineHeight: 1.45 }}>
          Yes. AES-256 enforced across managed macOS and Windows
          devices with live evidence on the dashboard.
        </p>
      </FintaCard>
    </div>
  );
}

// 17. Compliance Automation — framework readiness rows (Finta-table-style)
function IllusCompliance({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 border-b px-3 py-2 text-[8.5px] font-bold uppercase tracking-[0.08em]" style={{ borderColor: "rgba(38,38,43,0.06)", color: T.inkSubtle }}>
          <span>Framework</span>
          <span>Controls</span>
          <span>Ready</span>
        </div>
        {[
          { f: "SOC 2 Type II", c: "92/100", w: 92 },
          { f: "ISO 27001", c: "88/114", w: 77 },
          { f: "HIPAA", c: "54/65", w: 83 },
        ].map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 border-b px-3 py-1.5 last:border-b-0" style={{ borderColor: "rgba(38,38,43,0.04)" }}>
            <span className="text-[10px] font-medium" style={{ color: T.ink }}>{r.f}</span>
            <span className="font-mono text-[9.5px]" style={{ color: T.inkSoft }}>{r.c}</span>
            <span className="font-mono text-[10px] font-semibold tabular-nums" style={{ color }}>
              {r.w}%
            </span>
          </div>
        ))}
      </FintaCard>
    </div>
  );
}

// 18. Training — phishing quiz card
function IllusTraining({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden p-3">
        <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          <span className="text-[8.5px] font-bold uppercase tracking-[0.12em]" style={{ color: T.inkSubtle }}>Phishing · Q3 / 8</span>
          <span className="rounded-full px-1.5 py-0.5 text-[8px] font-bold" style={{ background: `${color}1a`, color }}>87%</span>
        </div>
        <p className="mt-2 text-[10.5px] font-semibold" style={{ color: T.ink }}>
          Spotted a suspicious link?
        </p>
        <div className="mt-2 space-y-1">
          {[
            { t: "Hover and inspect first", on: true },
            { t: "Reply with credentials", on: false },
            { t: "Forward to CEO", on: false },
          ].map((opt, i) => (
            <div
              key={i}
              className="flex items-center gap-x-2 rounded-[6px] px-2 py-1.5"
              style={{
                background: opt.on ? `${color}12` : T.panel,
                boxShadow: opt.on ? `inset 0 0 0 1px ${color}33` : "none",
              }}
            >
              <span
                className="flex h-3 w-3 items-center justify-center rounded-full"
                style={{ background: opt.on ? color : "#ffffff", boxShadow: opt.on ? "none" : `inset 0 0 0 1px ${T.inkFaint}` }}
              >
                {opt.on && <span className="h-1 w-1 rounded-full bg-white" />}
              </span>
              <span className="text-[9.5px]" style={{ color: T.ink, fontWeight: opt.on ? 600 : 400 }}>{opt.t}</span>
            </div>
          ))}
        </div>
      </FintaCard>
    </div>
  );
}

// 19. Logs Analyzer — terminal-style log card
function IllusLogs({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden">
        <div className="flex items-center gap-x-2 border-b px-3 py-2" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          <span className="flex h-1.5 w-1.5 rounded-full" style={{ background: "#19a974" }} />
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>Live tail · audit.log</span>
        </div>
        <div className="px-3 py-2 font-mono text-[9.5px] leading-tight" style={{ color: T.inkSoft }}>
          {[
            { sev: "INFO", t: "user.login ok · nitin" },
            { sev: "WARN", t: "policy.drift · cspm-04", warn: true },
            { sev: "INFO", t: "evidence.synced · soc2" },
            { sev: "INFO", t: "scan.complete · web-01" },
          ].map((l, i) => (
            <div key={i} className="flex gap-x-2 py-[1px]">
              <span style={{ color: l.warn ? color : T.inkFaint, width: "32px", fontWeight: l.warn ? 700 : 500 }}>{l.sev}</span>
              <span style={{ color: l.warn ? T.ink : T.inkSoft }}>{l.t}</span>
            </div>
          ))}
        </div>
      </FintaCard>
    </div>
  );
}

// 20. VAPT — engagement card with finding pills
function IllusVAPT({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <FintaCard className="w-full max-w-[260px] overflow-hidden p-3">
        <div className="flex items-center justify-between">
          <div className="leading-tight">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.12em]" style={{ color: T.inkSubtle }}>Engagement</p>
            <p className="text-[11px] font-semibold" style={{ color: T.ink }}>OSCP · 7-day delivery</p>
          </div>
          <span className="rounded-full px-2 py-0.5 text-[8.5px] font-bold" style={{ background: "rgba(25,169,116,0.14)", color: "#0d8050" }}>
            on track
          </span>
        </div>
        <div className="mt-2 flex items-center gap-x-1.5">
          {[
            { l: "WEB", on: true },
            { l: "API", on: true },
            { l: "MOBILE", on: false },
          ].map((s) => (
            <span
              key={s.l}
              className="rounded-full px-2 py-0.5 text-[8.5px] font-bold"
              style={{
                background: s.on ? color : "#ffffff",
                color: s.on ? "#fff" : T.inkSoft,
                boxShadow: s.on ? "none" : `inset 0 0 0 1px ${T.inkFaint}`,
                letterSpacing: "0.04em",
              }}
            >
              {s.l}
            </span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-x-2 border-t pt-2" style={{ borderColor: "rgba(38,38,43,0.06)" }}>
          {[
            { l: "Critical", v: "0", g: true },
            { l: "High", v: "2", c: true },
            { l: "Medium", v: "5" },
          ].map((s) => (
            <div key={s.l} className="leading-tight">
              <p className="text-[8.5px] font-bold uppercase tracking-[0.08em]" style={{ color: T.inkSubtle }}>{s.l}</p>
              <p
                className="text-[12px] font-semibold tabular-nums"
                style={{ color: s.g ? "#0d8050" : s.c ? color : T.ink }}
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
      @keyframes ostoTileFade {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      @keyframes ostoTilePulse {
        0%, 100% { transform: translateY(0); opacity: 1; }
        50% { transform: translateY(-3px); opacity: 0.85; }
      }
      @keyframes ostoTileFlash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.55; }
      }
      @keyframes ostoRipple {
        0% { transform: scale(0.6); opacity: 0.6; }
        100% { transform: scale(1.2); opacity: 0; }
      }
      @keyframes ostoFill {
        from { opacity: 0.7; }
        to { opacity: 1; }
      }
      @keyframes ostoFillWidth {
        0% { width: 0%; }
        70%, 100% { width: 100%; }
      }
      @keyframes ostoSlideIn {
        0%, 100% { transform: translateX(0); }
        50% { transform: translateX(38px); }
      }
      @keyframes ostoFadeBlink {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
      @keyframes ostoFadeOut {
        0% { opacity: 1; }
        70% { opacity: 0.2; transform: translateX(0); }
        80% { opacity: 0; transform: translateX(8px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      @keyframes ostoScanY {
        0% { top: 0; }
        100% { top: 100%; }
      }
      @keyframes ostoCount {
        0% { content: "0:30"; }
        100% { content: "0:00"; }
      }
      @keyframes ostoTypeIn {
        0% { opacity: 0; transform: translateX(-4px); }
        20%, 100% { opacity: 1; transform: translateX(0); }
      }
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
      @media (prefers-reduced-motion: reduce) {
        .osto-tile-fade, .osto-tile-rise,
        [class*="ostoTile"], [class*="ostoRipple"], [class*="ostoFill"],
        [class*="ostoSlide"], [class*="ostoFade"], [class*="ostoScan"],
        [class*="ostoCount"], [class*="ostoType"], [class*="ostoPulse"] {
          animation: none !important;
        }
      }
    `}</style>
  );
}
