"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Live, interactive product dashboard mock for the osto.one hero.
 * - Sidebar items switch the right pane
 * - Live tickers: scan-counter, feed timestamps, security-score drift
 *
 * Brand tokens are duplicated locally so this component is self-contained.
 */
const C = {
  bg: "#f7f8fb",
  ink: "#0d1539",
  inkSoft: "#3d4566",
  muted: "#7a829e",
  mutedSoft: "#a3aac0",
  line: "#e4e7ef",
  lineSoft: "#eef0f6",
  surface: "#ffffff",
  accent: "#3340e6",
  accentDeep: "#1f2bbf",
  accentSoft: "rgba(51,64,230,0.10)",
  accentTint: "rgba(51,64,230,0.06)",
  ok: "#1ca672",
  okSoft: "rgba(28,166,114,0.14)",
  warn: "#d49a14",
  warnSoft: "rgba(212,154,20,0.14)",
  danger: "#dc2929",
  dangerSoft: "rgba(220,41,41,0.12)",
  pinkGlow: "rgba(249,28,169,0.18)",
};

export type ViewKey =
  | "security"
  | "compliance"
  | "vapt"
  | "questionnaire"
  | "headsup";

type SecurityModule = "all" | "cloud" | "app" | "endpoint" | "network";

export function OstoDashboard({
  view: controlledView,
  showSidebar = false,
}: {
  view?: ViewKey;
  showSidebar?: boolean;
} = {}) {
  const [internalView, setInternalView] = useState<ViewKey>("security");
  const view = controlledView ?? internalView;
  const setView = setInternalView;
  const [securityModule, setSecurityModule] = useState<SecurityModule>("all");
  const [scanMin, setScanMin] = useState(2);
  const [score, setScore] = useState(94);

  // scan timer: 2m → 5m, then resets
  useEffect(() => {
    const id = window.setInterval(() => {
      setScanMin((m) => (m >= 5 ? 2 : m + 1));
    }, 8000);
    return () => window.clearInterval(id);
  }, []);

  // score gentle drift: 94 ↔ 95 every 6s
  useEffect(() => {
    const id = window.setInterval(() => {
      setScore((s) => (s === 94 ? 95 : 94));
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden rounded-[14px]"
      style={{
        background: C.surface,
        boxShadow: `0 0 0 1px ${C.line}, 0 24px 60px -28px rgba(13,21,57,0.30), 0 8px 18px -10px rgba(13,21,57,0.12)`,
      }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: `1px solid ${C.lineSoft}` }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="block rounded-full"
            style={{ width: 9, height: 9, background: "#ff5f57" }}
          />
          <span
            className="block rounded-full"
            style={{ width: 9, height: 9, background: "#febc2e" }}
          />
          <span
            className="block rounded-full"
            style={{ width: 9, height: 9, background: "#28c840" }}
          />
        </div>
        <span
          className="rounded-md px-3 py-1 text-[11.5px] font-medium tabular-nums"
          style={{
            color: C.inkSoft,
            background: C.bg,
            boxShadow: `0 0 0 1px ${C.lineSoft}`,
          }}
        >
          secure.osto.one
        </span>
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.04em]"
          style={{ color: C.inkSoft }}
        >
          <LiveDot />
          live
        </span>
      </div>

      {/* Layout: optional sidebar + main */}
      <div className="flex" style={{ minHeight: 540 }}>
        {showSidebar && (
          <Sidebar
            view={view}
            setView={setView}
            securityModule={securityModule}
            setSecurityModule={setSecurityModule}
          />
        )}

        <main className="relative flex-1" style={{ background: C.bg }}>
          {view === "security" && (
            <SecurityView
              score={score}
              scanMin={scanMin}
              activeModule={securityModule}
            />
          )}
          {view === "compliance" && <ComplianceView />}
          {view === "vapt" && <VaptView />}
          {view === "questionnaire" && <QuestionnaireView />}
          {view === "headsup" && <HeadsUpView />}
        </main>
      </div>

      {/* Footer "what you get" strip */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{
          borderTop: `1px solid ${C.lineSoft}`,
          background: C.surface,
        }}
      >
        <span
          className="text-[12px] font-semibold"
          style={{ color: C.ink }}
        >
          What you get in one platform
        </span>
        <span
          className="hidden text-[11px] font-medium md:inline"
          style={{ color: C.muted }}
        >
          security · compliance · vapt · questionnaires
        </span>
      </div>

      {/* Bottom edge pink/blue glow tint, mimicking osto reference */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${C.pinkGlow}, ${C.accentSoft}, transparent)`,
        }}
      />
    </div>
  );
}

/* ── Sidebar ─────────────────────────────────────────────── */

function Sidebar({
  view,
  setView,
  securityModule,
  setSecurityModule,
}: {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  securityModule: SecurityModule;
  setSecurityModule: (m: SecurityModule) => void;
}) {
  return (
    <aside
      className="flex w-[170px] flex-shrink-0 flex-col px-3 py-4"
      style={{
        background: C.surface,
        borderRight: `1px solid ${C.lineSoft}`,
      }}
    >
      <div
        className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: C.muted }}
      >
        Workspace
      </div>
      <div
        className="mb-3 flex items-center gap-2 rounded-md px-2 py-1.5"
        style={{ color: C.ink }}
      >
        <span
          className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white"
          style={{ background: C.ink }}
        >
          O
        </span>
        <span className="text-[13px] font-bold">osto</span>
      </div>

      <NavItem
        label="Security"
        icon={<IconGrid />}
        active={view === "security"}
        onClick={() => setView("security")}
      />
      {view === "security" && (
        <div className="mt-1 mb-1 flex flex-col gap-0.5 pl-7">
          {SECURITY_MODULES.map((m) => (
            <button
              key={m.key}
              onClick={() => setSecurityModule(m.key)}
              className="text-left text-[12px] font-medium transition-colors"
              style={{
                color:
                  securityModule === m.key ? C.ink : C.muted,
                padding: "3px 6px",
                borderRadius: 4,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      <NavItem
        label="Compliance"
        sub="Readiness"
        icon={<IconDoc />}
        active={view === "compliance"}
        onClick={() => setView("compliance")}
      />
      {view === "compliance" && (
        <div className="mt-1 mb-1 flex flex-col gap-0.5 pl-7">
          {["SOC2", "HIPAA", "GDPR", "ISO27001", "… see more"].map((f) => (
            <span
              key={f}
              className="text-[12px] font-medium"
              style={{ color: C.muted, padding: "3px 6px" }}
            >
              {f}
            </span>
          ))}
        </div>
      )}

      <NavItem
        label="VAPT"
        icon={<IconSearch />}
        active={view === "vapt"}
        onClick={() => setView("vapt")}
      />
      <NavItem
        label="Questionnaire"
        icon={<IconChat />}
        active={view === "questionnaire"}
        onClick={() => setView("questionnaire")}
      />

      {/* Heads up card */}
      <button
        onClick={() => setView("headsup")}
        className="mt-auto rounded-lg p-3 text-left transition-shadow"
        style={{
          background: view === "headsup" ? C.accentSoft : C.bg,
          boxShadow:
            view === "headsup"
              ? `0 0 0 1px ${C.accent}`
              : `0 0 0 1px ${C.lineSoft}`,
        }}
      >
        <div
          className="text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: view === "headsup" ? C.accent : C.muted }}
        >
          Heads up
        </div>
        <div
          className="mt-1 text-[12px] font-medium leading-[1.35]"
          style={{ color: C.ink }}
        >
          2 evidence items ready for SOC 2 auditor.
        </div>
      </button>

      {/* Version */}
      <div className="mt-3 flex items-center gap-1.5 px-1">
        <LiveDot small />
        <span
          className="text-[11px] font-semibold"
          style={{ color: C.ink }}
        >
          osto
        </span>
        <span
          className="text-[10.5px] font-medium tabular-nums"
          style={{ color: C.muted }}
        >
          · v2.3.1
        </span>
        <span
          className="ml-1 rounded-[3px] px-1 py-px text-[9px] font-bold uppercase tracking-[0.08em]"
          style={{
            color: C.ok,
            background: C.okSoft,
            letterSpacing: "0.1em",
          }}
        >
          Live
        </span>
      </div>
    </aside>
  );
}

const SECURITY_MODULES: { key: SecurityModule; label: string }[] = [
  { key: "all", label: "All modules" },
  { key: "cloud", label: "Cloud security" },
  { key: "app", label: "Application security" },
  { key: "endpoint", label: "Endpoint security" },
  { key: "network", label: "Network security" },
];

function NavItem({
  label,
  sub,
  icon,
  active,
  onClick,
}: {
  label: string;
  sub?: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="mb-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] font-medium transition-colors"
      style={{
        background: active ? C.accentSoft : "transparent",
        color: active ? C.accent : C.inkSoft,
        boxShadow: active ? `inset 0 0 0 1px ${C.accent}` : "none",
      }}
    >
      <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
      <span className="leading-tight">
        {label}
        {sub && (
          <>
            <br />
            <span className="text-[11px]" style={{ opacity: 0.85 }}>
              {sub}
            </span>
          </>
        )}
      </span>
    </button>
  );
}

/* ── Security view (default) ─────────────────────────────── */

function SecurityView({
  score,
  scanMin,
  activeModule,
}: {
  score: number;
  scanMin: number;
  activeModule: SecurityModule;
}) {
  const cardData = useMemo(() => {
    const moduleColor = MODULE_TINT[activeModule];
    return {
      threatsBlocked: 1284,
      threatsCaption: MODULE_THREAT_CAPTION[activeModule],
      cloudCovered: 47,
      cloudTotal: 50,
      cloudCaption: "posture, web, api, scanners",
      complianceReady: 84,
      complianceCaption: "live controls already mapped",
      vaptOpen: 2,
      vaptCaption: "high findings already assigned",
      moduleColor,
    };
  }, [activeModule]);

  return (
    <div className="flex h-full flex-col gap-4 px-5 py-4">
      {/* Header row: score + status */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div
            className="text-[10.5px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: C.muted }}
          >
            Security score
          </div>
          <div className="mt-1 flex items-baseline gap-3">
            <span
              className="text-[44px] font-bold leading-none tabular-nums tracking-[-0.025em]"
              style={{ color: C.ink, transition: "all 400ms ease" }}
            >
              {score}
            </span>
            <span
              className="text-[16px] font-semibold tabular-nums"
              style={{ color: C.muted }}
            >
              /100
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold tabular-nums"
              style={{
                background: C.okSoft,
                color: C.ok,
              }}
            >
              <TriangleUp /> +6 wk
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
            style={{
              background: C.surface,
              color: C.inkSoft,
              boxShadow: `0 0 0 1px ${C.lineSoft}`,
            }}
          >
            <LiveDot /> all modules live
          </span>
          <span
            className="rounded-full px-3 py-1.5 text-[11px] font-semibold tabular-nums"
            style={{
              background: C.surface,
              color: C.inkSoft,
              boxShadow: `0 0 0 1px ${C.lineSoft}`,
            }}
          >
            scan {scanMin}m ago
          </span>
        </div>
      </div>

      {/* 4 metric cards */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard
          label="Threats blocked"
          value={cardData.threatsBlocked.toLocaleString()}
          caption={cardData.threatsCaption}
          accent={cardData.moduleColor}
        />
        <MetricCard
          label="Cloud security"
          value={`${cardData.cloudCovered}/${cardData.cloudTotal}`}
          caption={cardData.cloudCaption}
        />
        <MetricCard
          label="Compliance readiness"
          value={`${cardData.complianceReady}%`}
          caption={cardData.complianceCaption}
          highlight="live controls already mapped"
          highlightColor={C.accent}
        />
        <MetricCard
          label="VAPT findings open"
          value={String(cardData.vaptOpen)}
          caption={cardData.vaptCaption}
          highlight="high findings already assigned"
          highlightColor={C.danger}
        />
      </div>

      {/* Chart + feed */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <span
              className="text-[13px] font-semibold"
              style={{ color: C.ink }}
            >
              Threats over time
            </span>
            <div className="flex gap-1">
              <RangePill label="7d" active />
              <RangePill label="30d" />
            </div>
          </div>
          <ThreatsChart accent={cardData.moduleColor} />
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span
              className="text-[13px] font-semibold"
              style={{ color: C.ink }}
            >
              Operational feed
            </span>
            <span
              className="text-[10px] font-medium"
              style={{ color: C.muted }}
            >
              Email · Slack · Teams
            </span>
          </div>
          <FeedList />
        </Card>
      </div>
    </div>
  );
}

const MODULE_TINT: Record<SecurityModule, string> = {
  all: C.accent,
  cloud: "#3340e6",
  app: "#7e3aed",
  endpoint: "#0e9b8a",
  network: "#d49a14",
};

const MODULE_THREAT_CAPTION: Record<SecurityModule, string> = {
  all: "web, api, bot, and network traffic",
  cloud: "cloud workloads and posture drift",
  app: "web and api injection attempts",
  endpoint: "device and process anomalies",
  network: "ingress and egress anomalies",
};

function MetricCard({
  label,
  value,
  caption,
  accent,
  highlight,
  highlightColor,
}: {
  label: string;
  value: string;
  caption: string;
  accent?: string;
  highlight?: string;
  highlightColor?: string;
}) {
  // Render caption with highlighted phrase if provided
  const renderedCaption = useMemo(() => {
    if (!highlight) return <>{caption}</>;
    const idx = caption.indexOf(highlight);
    if (idx === -1) return <>{caption}</>;
    return (
      <>
        {caption.slice(0, idx)}
        <span
          style={{ color: highlightColor, fontWeight: 600 }}
        >
          {highlight}
        </span>
        {caption.slice(idx + highlight.length)}
      </>
    );
  }, [caption, highlight, highlightColor]);

  return (
    <div
      className="flex flex-col gap-1.5 rounded-xl p-4"
      style={{
        background: C.surface,
        boxShadow: `0 0 0 1px ${C.lineSoft}`,
      }}
    >
      <span
        className="text-[10px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: C.muted }}
      >
        {label}
      </span>
      <span
        className="text-[28px] font-bold leading-none tabular-nums tracking-[-0.02em]"
        style={{ color: accent || C.ink }}
      >
        {value}
      </span>
      <span
        className="text-[11px] leading-[1.4]"
        style={{ color: C.muted }}
      >
        {renderedCaption}
      </span>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl p-4"
      style={{
        background: C.surface,
        boxShadow: `0 0 0 1px ${C.lineSoft}`,
      }}
    >
      {children}
    </div>
  );
}

function RangePill({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold tabular-nums"
      style={{
        background: active ? C.accentSoft : "transparent",
        color: active ? C.accent : C.muted,
      }}
    >
      {label}
    </span>
  );
}

function ThreatsChart({ accent }: { accent: string }) {
  const points = [10, 18, 16, 28, 24, 38, 46];
  const max = 50;
  const w = 280;
  const h = 90;
  const stepX = w / (points.length - 1);

  const path = points
    .map((p, i) => {
      const x = i * stepX;
      const y = h - (p / max) * h;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const fill = points
    .map((p, i) => {
      const x = i * stepX;
      const y = h - (p / max) * h;
      return `${i === 0 ? `M 0 ${h} L` : "L"} ${x} ${y}`;
    })
    .join(" ") + ` L ${w} ${h} Z`;

  const lastX = (points.length - 1) * stepX;
  const lastY = h - (points[points.length - 1] / max) * h;

  return (
    <div className="relative">
      <svg
        width="100%"
        viewBox={`0 0 ${w} ${h + 18}`}
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="threatFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.20" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={fill} fill="url(#threatFill)" />
        <path
          d={path}
          stroke={accent}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={lastX} cy={lastY} r="4" fill={C.surface} stroke={accent} strokeWidth="2" />
        <circle cx={lastX} cy={lastY} r="6" fill={accent} fillOpacity="0.18">
          <animate
            attributeName="r"
            from="4"
            to="11"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="fill-opacity"
            from="0.18"
            to="0"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Day labels */}
        {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((d, i) => (
          <text
            key={d}
            x={i * stepX}
            y={h + 14}
            textAnchor={i === 0 ? "start" : i === 6 ? "end" : "middle"}
            fontSize="9"
            fill={C.muted}
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            {d}
          </text>
        ))}
      </svg>
    </div>
  );
}

const FEED_ITEMS = [
  { dot: C.ink, title: "SQL injection blocked", target: "/login", time: "4m" },
  { dot: C.accent, title: "ZTNA policy applied", target: "finance-admin", time: "12m" },
  { dot: C.ok, title: "Cloud drift fixed", target: "s3", time: "1h" },
  { dot: "#7e3aed", title: "Encryption enforced", target: "kayan-mbp", time: "2h" },
  { dot: C.ok, title: "Threat summary shared", target: "Slack", time: "today" },
];

function FeedList() {
  return (
    <ul className="flex flex-col">
      {FEED_ITEMS.map((item, i) => (
        <li
          key={i}
          className="flex items-center justify-between py-1.5"
          style={{
            borderTop:
              i > 0 ? `1px solid ${C.lineSoft}` : "none",
          }}
        >
          <span className="flex items-center gap-2">
            <span
              className="block h-1.5 w-1.5 rounded-full"
              style={{ background: item.dot }}
            />
            <span
              className="text-[11.5px] font-medium"
              style={{ color: C.ink }}
            >
              {item.title}{" "}
              <span
                className="font-mono"
                style={{ color: C.muted }}
              >
                {item.target}
              </span>
            </span>
          </span>
          <span
            className="text-[10.5px] font-medium tabular-nums"
            style={{ color: C.muted }}
          >
            {item.time}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ── Compliance Readiness view ───────────────────────────── */

function ComplianceView() {
  const frameworks = [
    { name: "SOC 2", pct: 84, status: "Audit in 4 weeks", color: C.accent },
    { name: "HIPAA", pct: 92, status: "Ready", color: C.ok },
    { name: "GDPR", pct: 67, status: "12 controls open", color: C.warn },
    { name: "ISO 27001", pct: 78, status: "8 controls open", color: C.accent },
  ];

  return (
    <div className="flex h-full flex-col gap-4 px-5 py-4">
      <div className="flex items-end justify-between">
        <div>
          <div
            className="text-[10.5px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: C.muted }}
          >
            Compliance readiness
          </div>
          <div
            className="mt-1 text-[24px] font-bold leading-tight tracking-[-0.015em]"
            style={{ color: C.ink }}
          >
            4 frameworks tracked · 142 controls auto-mapped
          </div>
        </div>
        <span
          className="rounded-full px-3 py-1.5 text-[11px] font-semibold"
          style={{
            background: C.accentSoft,
            color: C.accent,
          }}
        >
          Auditor-ready
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {frameworks.map((f) => (
          <div
            key={f.name}
            className="flex flex-col gap-2.5 rounded-xl p-4"
            style={{
              background: C.surface,
              boxShadow: `0 0 0 1px ${C.lineSoft}`,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[14px] font-bold"
                style={{ color: C.ink }}
              >
                {f.name}
              </span>
              <span
                className="text-[11px] font-semibold tabular-nums"
                style={{ color: f.color }}
              >
                {f.pct}%
              </span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full"
              style={{ background: C.lineSoft }}
            >
              <div
                className="h-full rounded-full transition-[width]"
                style={{
                  width: `${f.pct}%`,
                  background: f.color,
                  transitionDuration: "800ms",
                }}
              />
            </div>
            <span
              className="text-[11px] font-medium"
              style={{ color: C.muted }}
            >
              {f.status}
            </span>
          </div>
        ))}
      </div>

      <div
        className="mt-auto rounded-xl p-4"
        style={{
          background: C.accentSoft,
          boxShadow: `0 0 0 1px ${C.accent}`,
        }}
      >
        <div
          className="text-[10.5px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: C.accent }}
        >
          Next deliverable
        </div>
        <div
          className="mt-1.5 text-[14px] font-semibold"
          style={{ color: C.ink }}
        >
          SOC 2 evidence pack ready in 4 weeks
        </div>
        <div
          className="mt-0.5 text-[11.5px] font-medium"
          style={{ color: C.inkSoft }}
        >
          12 controls auto-mapped this week. 0 spreadsheets.
        </div>
      </div>
    </div>
  );
}

/* ── VAPT view ──────────────────────────────────────────── */

function VaptView() {
  const findings = [
    { sev: "high", title: "SSRF in /api/proxy", env: "production", age: "2d", color: C.danger, bg: C.dangerSoft },
    { sev: "high", title: "Hardcoded API key in config", env: "staging", age: "3d", color: C.danger, bg: C.dangerSoft },
    { sev: "med", title: "Missing rate limit on /login", env: "production", age: "5d", color: C.warn, bg: C.warnSoft },
    { sev: "med", title: "S3 bucket public list ACL", env: "staging", age: "5d", color: C.warn, bg: C.warnSoft },
    { sev: "low", title: "Verbose error in 500 page", env: "production", age: "7d", color: C.muted, bg: C.lineSoft },
  ];

  return (
    <div className="flex h-full flex-col gap-4 px-5 py-4">
      <div className="flex items-end justify-between">
        <div>
          <div
            className="text-[10.5px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: C.muted }}
          >
            Pen-test findings
          </div>
          <div
            className="mt-1 text-[24px] font-bold leading-tight tracking-[-0.015em]"
            style={{ color: C.ink }}
          >
            5 open · 2 high
          </div>
        </div>
        <div
          className="rounded-xl p-3"
          style={{
            background: C.surface,
            boxShadow: `0 0 0 1px ${C.lineSoft}`,
            minWidth: 220,
          }}
        >
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: C.muted }}
          >
            Scan in progress
          </div>
          <div
            className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: C.lineSoft }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "62%",
                background: C.accent,
              }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-medium tabular-nums" style={{ color: C.muted }}>
            <span>62% complete</span>
            <span>~3 min left</span>
          </div>
        </div>
      </div>

      <div
        className="overflow-hidden rounded-xl"
        style={{
          background: C.surface,
          boxShadow: `0 0 0 1px ${C.lineSoft}`,
        }}
      >
        <div
          className="grid grid-cols-[60px_1fr_120px_60px] gap-3 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{
            color: C.muted,
            background: C.bg,
            borderBottom: `1px solid ${C.lineSoft}`,
          }}
        >
          <span>Sev</span>
          <span>Finding</span>
          <span>Env</span>
          <span>Age</span>
        </div>
        {findings.map((f, i) => (
          <div
            key={i}
            className="grid grid-cols-[60px_1fr_120px_60px] items-center gap-3 px-4 py-2.5"
            style={{
              borderTop:
                i > 0 ? `1px solid ${C.lineSoft}` : "none",
            }}
          >
            <span
              className="inline-flex justify-self-start rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em]"
              style={{ background: f.bg, color: f.color }}
            >
              {f.sev}
            </span>
            <span
              className="text-[12.5px] font-medium"
              style={{ color: C.ink }}
            >
              {f.title}
            </span>
            <span
              className="text-[11.5px] font-medium"
              style={{ color: C.muted }}
            >
              {f.env}
            </span>
            <span
              className="text-[11.5px] font-medium tabular-nums"
              style={{ color: C.muted }}
            >
              {f.age}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Questionnaire view ─────────────────────────────────── */

function QuestionnaireView() {
  const items = [
    { name: "Acme Corp · Security review", q: 84, status: "Ready", color: C.ok },
    { name: "Globex · Vendor onboarding", q: 142, status: "Auto-answering", color: C.accent },
    { name: "Initech · DPA + security", q: 36, status: "Sent", color: C.muted },
    { name: "Wayne Enterprises · SIG-Lite", q: 220, status: "Drafting", color: C.warn },
  ];

  return (
    <div className="flex h-full flex-col gap-4 px-5 py-4">
      <div className="flex items-end justify-between">
        <div>
          <div
            className="text-[10.5px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: C.muted }}
          >
            Security questionnaires
          </div>
          <div
            className="mt-1 text-[24px] font-bold leading-tight tracking-[-0.015em]"
            style={{ color: C.ink }}
          >
            4 active · 482 questions answered
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: C.muted }}
          >
            Auto-answer rate
          </div>
          <div
            className="text-[28px] font-bold tabular-nums leading-none"
            style={{ color: C.accent }}
          >
            93%
          </div>
        </div>
      </div>

      <div
        className="overflow-hidden rounded-xl"
        style={{
          background: C.surface,
          boxShadow: `0 0 0 1px ${C.lineSoft}`,
        }}
      >
        {items.map((it, i) => (
          <div
            key={it.name}
            className="flex items-center justify-between px-4 py-3.5"
            style={{
              borderTop:
                i > 0 ? `1px solid ${C.lineSoft}` : "none",
            }}
          >
            <div className="flex flex-col">
              <span
                className="text-[12.5px] font-semibold"
                style={{ color: C.ink }}
              >
                {it.name}
              </span>
              <span
                className="text-[11px] font-medium tabular-nums"
                style={{ color: C.muted }}
              >
                {it.q} questions
              </span>
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em]"
              style={{
                color: it.color,
                background: `${it.color}1f`,
              }}
            >
              {it.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Heads up view (clicking the sidebar card) ──────────── */

function HeadsUpView() {
  return (
    <div className="flex h-full flex-col gap-4 px-5 py-4">
      <div>
        <div
          className="text-[10.5px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: C.accent }}
        >
          Heads up · ready for review
        </div>
        <div
          className="mt-1 text-[24px] font-bold leading-tight tracking-[-0.015em]"
          style={{ color: C.ink }}
        >
          2 evidence items ready for SOC 2 auditor
        </div>
      </div>

      {[
        {
          title: "CC6.1 · Logical access controls",
          summary:
            "Production access reviewed. 8 controls passed automated checks.",
        },
        {
          title: "CC7.2 · Anomaly detection",
          summary:
            "30-day threat log packaged. Auditor-ready format generated.",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="rounded-xl p-4"
          style={{
            background: C.surface,
            boxShadow: `0 0 0 1px ${C.lineSoft}`,
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[13px] font-bold"
              style={{ color: C.ink }}
            >
              {item.title}
            </span>
            <span
              className="rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.08em]"
              style={{
                color: C.ok,
                background: C.okSoft,
              }}
            >
              Ready
            </span>
          </div>
          <div
            className="mt-1.5 text-[12px] font-medium"
            style={{ color: C.inkSoft }}
          >
            {item.summary}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Sidebar icons ───────────────────────────────────────── */

function IconGrid() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="8" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2" y="8" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="8" y="8" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function IconDoc() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 1.5h5L11 4.5V12.5H3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M8 1.5V4.5H11" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function IconChat() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 3.5C2 2.7 2.7 2 3.5 2H10.5C11.3 2 12 2.7 12 3.5V8.5C12 9.3 11.3 10 10.5 10H6L3.5 12V10C2.7 10 2 9.3 2 8.5V3.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function TriangleUp() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <path d="M4 1L7 6.5H1L4 1Z" fill="currentColor" />
    </svg>
  );
}

function LiveDot({ small }: { small?: boolean } = {}) {
  const size = small ? 6 : 7;
  return (
    <span
      aria-hidden
      className="relative inline-block rounded-full"
      style={{ width: size, height: size, background: C.ok }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: C.ok,
          opacity: 0.4,
          animation: "ostoLive 2.4s ease-out infinite",
        }}
      />
      <style>{`
        @keyframes ostoLive {
          0% { transform: scale(1); opacity: 0.4; }
          80%, 100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>
    </span>
  );
}
