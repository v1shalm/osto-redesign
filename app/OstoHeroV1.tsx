"use client";

/**
 * osto.one hero redesign.
 *
 * Conversion-focused rewrite. Headline names the category in the first
 * 8 words. Cert-led eyebrow. 4-metric proof strip promoted into the hero.
 * Dashboard preview rotates through three views (security, compliance,
 * VAPT) on a 4.5s timer until the user clicks a tab.
 *
 * Brand fingerprint lifted from osto.one: Inter, navy gradient CTAs,
 * 44px navy grid pattern with diagonal sweep animation, soft blue splash.
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { OstoDashboard, type ViewKey } from "./OstoDashboard";

// Brand tokens lifted directly from osto.one's CSS custom properties.
const BRAND = {
  bg: "#f3f5fc",
  ink: "#060b18",
  inkSoft: "#374151",
  muted: "#6b7280",
  line: "#d8def0",
  lineSoft: "#e6eaf7",
  navy1: "#2e3d9e", // bright royal — the "We fix both." accent
  navy2: "#1c267a", // mid navy — primary brand
  navy3: "#141d5c", // deep navy — gradient end
  splash: "rgba(92, 121, 255, 0.24)", // hero radial glow
  gridLine: "rgba(28, 38, 122, 0.16)", // base hero grid stroke
  gridLineHot: "rgba(28, 38, 122, 0.55)", // grid stroke under the cursor spotlight
  cellSoft: "rgba(28, 38, 122, 0.08)", // ambient activity cell
  cellWarm: "rgba(46, 61, 158, 0.14)", // accent activity cell
  surface: "#ffffff",
};

const CTA_GRADIENT = `linear-gradient(${BRAND.navy1} 0%, ${BRAND.navy2} 60%, ${BRAND.navy3} 100%)`;

// "Current flow" — flow lines that sit exactly on top of existing grid
// lines (same 1px width, snapped to the 44px lattice). Each is a gradient
// stripe whose lit segment travels along the line, themed like current
// flowing through a circuit.
//
// Position is given in "ticks" — multiples of 44px from the top-left of
// the hero region. The base grid uses background-position 0 0 with
// 44px×44px cells, so a vertical line lives at left = tick * 44 - 0.5px
// (the -0.5px offsets the 1px line so its center sits on the lattice).
type Flow = { orient: "v" | "h"; tick: number; delay: number; duration: number };
const FLOW_LINES: Flow[] = [
  { orient: "v", tick:  3,  delay: 0.0, duration: 3.6 },
  { orient: "v", tick:  6,  delay: 2.4, duration: 4.2 },
  { orient: "v", tick: -4,  delay: 1.1, duration: 3.9 }, // negative = from right
  { orient: "v", tick: -7,  delay: 3.0, duration: 3.4 },
  { orient: "h", tick:  4,  delay: 0.7, duration: 4.5 },
  { orient: "h", tick: -3,  delay: 2.0, duration: 4.0 }, // negative = from bottom
];

type Tab = { key: ViewKey; label: string };

const TABS: Tab[] = [
  { key: "security", label: "Security posture" },
  { key: "compliance", label: "Compliance readiness" },
  { key: "vapt", label: "Pen-test findings" },
];

export function OstoHeroV1() {
  const [view, setView] = useState<ViewKey>("security");
  const [paused, setPaused] = useState(false);
  const userInteracted = useRef(false);

  // Auto-rotate dashboard views every 4.5s until the user interacts.
  // Respects prefers-reduced-motion.
  useEffect(() => {
    if (paused || userInteracted.current) return;
    if (typeof window !== "undefined") {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduced) return;
    }
    const id = setInterval(() => {
      setView((current) => {
        const i = TABS.findIndex((t) => t.key === current);
        return TABS[(i + 1) % TABS.length].key;
      });
    }, 4500);
    return () => clearInterval(id);
  }, [paused]);

  const handleTabClick = (key: ViewKey) => {
    userInteracted.current = true;
    setView(key);
  };

  return (
    <main
      style={{
        background: BRAND.bg,
        color: BRAND.ink,
        fontFamily: "var(--font-sans)",
        minHeight: "100vh",
      }}
    >
      <HeroStyles />
      <BackgroundGlow />

      <div data-osto-hero className="relative z-10 mx-auto flex min-h-screen max-w-[1240px] flex-col px-5 md:px-10">
        <OstoNav />

        <section className="flex flex-1 flex-col items-center pt-12 pb-20 text-center md:pt-20 md:pb-28">
          {/* Eyebrow — clean category pill with live-status dot + cert proof */}
          <span
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] md:text-[11.5px]"
            style={{
              background: BRAND.surface,
              boxShadow: `0 0 0 1px ${BRAND.line}, 0 1px 2px rgba(13,21,57,0.04)`,
              color: BRAND.navy2,
            }}
          >
            <PulseDot color={BRAND.navy1} />
            Real security · SOC&nbsp;2 · ISO&nbsp;27001 · HIPAA
          </span>

          {/* H1 — category named in the first 8 words */}
          <h1
            className="mt-7 max-w-[22ch] text-balance leading-[1.04] tracking-[-0.025em] md:mt-9"
            style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)",
              fontWeight: 680,
              color: BRAND.ink,
            }}
          >
            One platform for{" "}
            <span style={{ color: BRAND.navy1 }}>
              security, compliance, and VAPT.
            </span>
          </h1>

          {/* Sub — promise + price */}
          <p
            className="mt-6 max-w-[52ch] text-[16px] leading-[1.55] md:mt-7 md:text-[18px]"
            style={{ color: BRAND.inkSoft }}
          >
            Go live in days, not quarters. $999/month, one invoice, one team.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10">
            <Link
              href="#"
              data-cta="primary"
              className="group inline-flex items-center gap-2 rounded-full px-[22px] py-[11px] text-[14px] font-semibold active:translate-y-[1px]"
              style={{
                background: CTA_GRADIENT,
                color: "#ffffff",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.18), 0 6px 16px -4px rgba(28,38,122,0.45), 0 14px 32px -10px rgba(28,38,122,0.40)",
              }}
            >
              Book a 30-min demo
              <ArrowIcon />
            </Link>
            <Link
              href="#"
              data-cta="secondary"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-semibold"
              style={{
                color: BRAND.ink,
                background: BRAND.surface,
                boxShadow: `0 0 0 1px ${BRAND.line}`,
              }}
            >
              Start 7-day free trial
            </Link>
          </div>

          {/* Trial micro-copy */}
          <p
            className="mt-3 text-[12.5px] font-medium"
            style={{ color: BRAND.inkSoft }}
          >
            Free for 7 days. No card. Real engineer on the call.
          </p>

          {/* Proof strip — promoted into the hero */}
          <ProofStrip />

          {/* Dashboard region */}
          <div
            className="mx-auto mt-12 w-full max-w-[1100px] md:mt-16"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Tabs — centered, subtle nav style, not CTAs */}
            <div className="flex justify-center">
              <div
                role="tablist"
                aria-label="Dashboard view"
                className="inline-flex items-center gap-1 md:gap-2"
              >
                {TABS.map((tab) => {
                  const active = view === tab.key;
                  // Bar state: animating-fill while auto-rotating on the
                  // active tab, fully filled on the locked-in tab after a
                  // user click, empty on inactive tabs.
                  const stopped = userInteracted.current || paused;
                  return (
                    <button
                      key={tab.key}
                      role="tab"
                      aria-selected={active}
                      data-tab
                      onClick={() => handleTabClick(tab.key)}
                      className="group relative inline-flex flex-col items-stretch gap-2 rounded-md px-3 pt-2 text-[12.5px] font-medium transition-colors md:text-[13px]"
                      style={{
                        color: active ? BRAND.ink : BRAND.muted,
                      }}
                    >
                      <span className="px-0.5">{tab.label}</span>
                      <span
                        aria-hidden
                        className="relative block h-[2px] w-full overflow-hidden rounded-full"
                        style={{ background: BRAND.lineSoft }}
                      >
                        <span
                          // Re-mount on every view change so the fill
                          // restarts from 0 cleanly.
                          key={`${tab.key}-${view}-${stopped ? "stopped" : "running"}`}
                          data-tab-bar
                          data-active={active ? "true" : "false"}
                          data-stopped={stopped ? "true" : "false"}
                          className="absolute inset-y-0 left-0 block rounded-full"
                          style={{ background: BRAND.navy1 }}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 md:mt-6">
              <OstoDashboard view={view} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const PROOF_STATS: { label: string; value: string }[] = [
  { label: "Threat protection", value: "Live in hours" },
  { label: "SOC 2 / ISO readiness", value: "Ready in days" },
  { label: "Penetration test", value: "Done in 7 days" },
  { label: "Security questionnaires", value: "Answered in 5 min" },
];

function ProofStrip() {
  return (
    <ul
      data-proof-strip
      className="mt-10 grid w-full max-w-[920px] grid-cols-2 overflow-hidden rounded-2xl md:mt-12 md:grid-cols-4"
      style={{
        background: BRAND.surface,
        boxShadow: `0 0 0 1px ${BRAND.line}, 0 8px 24px -16px rgba(13,21,57,0.18)`,
      }}
    >
      {PROOF_STATS.map((s, i) => (
        <li
          key={s.label}
          data-cell-index={i}
          className="flex flex-col items-start justify-end gap-1.5 px-5 py-4 text-left md:px-6 md:py-5"
        >
          <span
            className="text-[10.5px] font-semibold uppercase leading-[1.25] tracking-[0.14em]"
            style={{ color: BRAND.muted, minHeight: "2.4em" }}
          >
            {s.label}
          </span>
          <span
            className="text-[17px] font-bold leading-[1.15] tracking-[-0.01em] md:text-[19px]"
            style={{ color: BRAND.ink }}
          >
            {s.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

function OstoNav() {
  return (
    <nav className="flex items-center justify-between pt-6 md:pt-7">
      <div className="flex items-center gap-9">
        <Link href="/" aria-label="Osto home" className="inline-flex items-center">
          <Image
            src="/osto-logo.png"
            alt="Osto"
            width={1163}
            height={432}
            priority
            className="h-[26px] w-auto md:h-[28px]"
          />
        </Link>
        <ul
          className="hidden items-center gap-7 text-[14px] font-medium md:flex"
          style={{ color: BRAND.inkSoft }}
        >
          <li className="inline-flex items-center gap-1">
            Platform <Caret />
          </li>
          <li>Pricing</li>
          <li>Docs</li>
          <li>Blog</li>
        </ul>
      </div>
      <Link
        href="#"
        data-nav-cta
        className="inline-flex items-center gap-2 rounded-full px-[18px] py-[9px] text-[13.5px] font-semibold transition-transform hover:-translate-y-[1px]"
        style={{
          background: CTA_GRADIENT,
          color: "#ffffff",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.18), 0 6px 14px -6px rgba(28,38,122,0.40)",
        }}
      >
        Book demo
        <ArrowIcon size={12} />
      </Link>
    </nav>
  );
}

function PulseDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="relative inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ background: color }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: color,
          opacity: 0.45,
          animation: "ostoPulse 2.6s ease-out infinite",
        }}
      />
    </span>
  );
}

function HeroStyles() {
  return (
    <style>{`
      @keyframes ostoPulse {
        0% { transform: scale(1); opacity: 0.45; }
        80%, 100% { transform: scale(2.6); opacity: 0; }
      }
      /* Diagonal sweep reveal across the bright grid layer.
         Animates the mask, not transform — keeps it on the compositor
         and avoids any layout work. */
      [data-osto-sweep] {
        -webkit-mask-image: linear-gradient(
          115deg,
          transparent 0%,
          transparent 38%,
          rgba(0,0,0,0.85) 50%,
          transparent 62%,
          transparent 100%
        );
        mask-image: linear-gradient(
          115deg,
          transparent 0%,
          transparent 38%,
          rgba(0,0,0,0.85) 50%,
          transparent 62%,
          transparent 100%
        );
        -webkit-mask-size: 240% 240%;
        mask-size: 240% 240%;
        -webkit-mask-position: 0% 0%;
        mask-position: 0% 0%;
        animation: ostoSweep 14s ease-in-out infinite;
      }
      @keyframes ostoSweep {
        0%   { -webkit-mask-position: -20% 110%; mask-position: -20% 110%; opacity: 0.0; }
        10%  { opacity: 0.9; }
        50%  { -webkit-mask-position:  60%  40%; mask-position:  60%  40%; opacity: 0.9; }
        90%  { opacity: 0.9; }
        100% { -webkit-mask-position: 120% -20%; mask-position: 120% -20%; opacity: 0.0; }
      }
      /* Current flow — bright stripe travels along an existing grid
         line. Bright royal-blue (matches the splash glow family) so the
         lit segment reads as "live current," not just a darker line. */
      [data-osto-flow] {
        background: rgb(92, 121, 255);
        box-shadow: 0 0 6px rgba(92, 121, 255, 0.55);
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
        opacity: 0;
      }
      [data-osto-flow="v"] {
        -webkit-mask-image: linear-gradient(
          to bottom,
          transparent 0%,
          transparent 38%,
          rgba(0,0,0,1) 50%,
          transparent 62%,
          transparent 100%
        );
        mask-image: linear-gradient(
          to bottom,
          transparent 0%,
          transparent 38%,
          rgba(0,0,0,1) 50%,
          transparent 62%,
          transparent 100%
        );
        -webkit-mask-size: 100% 200%;
        mask-size: 100% 200%;
        animation-name: ostoFlowV;
      }
      [data-osto-flow="h"] {
        -webkit-mask-image: linear-gradient(
          to right,
          transparent 0%,
          transparent 38%,
          rgba(0,0,0,1) 50%,
          transparent 62%,
          transparent 100%
        );
        mask-image: linear-gradient(
          to right,
          transparent 0%,
          transparent 38%,
          rgba(0,0,0,1) 50%,
          transparent 62%,
          transparent 100%
        );
        -webkit-mask-size: 200% 100%;
        mask-size: 200% 100%;
        animation-name: ostoFlowH;
      }
      @keyframes ostoFlowV {
        0%   { -webkit-mask-position: 0% 100%; mask-position: 0% 100%; opacity: 0; }
        15%  { opacity: 1; }
        85%  { opacity: 1; }
        100% { -webkit-mask-position: 0% 0%;   mask-position: 0% 0%;   opacity: 0; }
      }
      @keyframes ostoFlowH {
        0%   { -webkit-mask-position: 100% 0%; mask-position: 100% 0%; opacity: 0; }
        15%  { opacity: 1; }
        85%  { opacity: 1; }
        100% { -webkit-mask-position: 0% 0%;   mask-position: 0% 0%;   opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        [data-osto-flow] { display: none; }
      }
      @media (prefers-reduced-motion: reduce) {
        [data-osto-hero] *, [data-osto-hero] *::before, [data-osto-hero] *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
        [data-osto-sweep] { display: none; }
      }
      /* CTA hover & focus */
      [data-cta="primary"] { transition: transform 160ms ease-out, box-shadow 160ms ease-out; }
      [data-cta="primary"]:hover {
        transform: translateY(-1px);
        box-shadow: 0 1px 0 rgba(255,255,255,0.12) inset, 0 14px 28px -10px rgba(13,21,57,0.55);
      }
      [data-cta="secondary"] { transition: background 160ms ease-out, box-shadow 160ms ease-out; }
      [data-cta="secondary"]:hover {
        background: ${BRAND.lineSoft};
        box-shadow: 0 0 0 1px ${BRAND.line}, 0 4px 14px -10px rgba(13,21,57,0.25);
      }
      [data-cta]:focus-visible,
      [data-tab]:focus-visible,
      [data-nav-cta]:focus-visible {
        outline: 2px solid ${BRAND.navy2};
        outline-offset: 3px;
      }
      /* Tab hover */
      [data-tab]:hover { color: ${BRAND.ink}; }

      /* Tab progress bar — three states:
         • inactive   → empty (width 0)
         • active+running → animates 0→100% over 4500ms
         • active+stopped (user clicked or hover paused) → stays full */
      [data-tab-bar] {
        width: 0%;
        transition: width 220ms ease-out;
      }
      [data-tab-bar][data-active="true"][data-stopped="false"] {
        animation: ostoTabFill 4500ms linear forwards;
      }
      [data-tab-bar][data-active="true"][data-stopped="true"] {
        width: 100%;
      }
      @keyframes ostoTabFill {
        from { width: 0%; }
        to   { width: 100%; }
      }
      @media (prefers-reduced-motion: reduce) {
        [data-tab-bar][data-active="true"] { width: 100% !important; animation: none !important; }
      }
      /* Proof strip dividers */
      ul[data-proof-strip] > li[data-cell-index="1"],
      ul[data-proof-strip] > li[data-cell-index="3"] {
        border-left: 1px solid ${BRAND.lineSoft};
      }
      ul[data-proof-strip] > li[data-cell-index="2"],
      ul[data-proof-strip] > li[data-cell-index="3"] {
        border-top: 1px solid ${BRAND.lineSoft};
      }
      @media (min-width: 768px) {
        ul[data-proof-strip] > li {
          border-top: none;
          border-left: none;
        }
        ul[data-proof-strip] > li[data-cell-index="1"],
        ul[data-proof-strip] > li[data-cell-index="2"],
        ul[data-proof-strip] > li[data-cell-index="3"] {
          border-left: 1px solid ${BRAND.lineSoft};
        }
      }
    `}</style>
  );
}

function ArrowIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 13 13" fill="none" aria-hidden style={{ display: "block" }}>
      <path d="M3 6.5h7M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Caret() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden style={{ display: "block", opacity: 0.7 }}>
      <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BackgroundGlow() {
  // Hero treatment, back → front:
  //   1. Page wash      — soft navy tint at the top
  //   2. Base grid      — quiet 44px lattice, top-down fade
  //   3. Sweep band     — diagonal "scan line" that drifts across the grid
  //                       on a 14s loop, revealing brighter cells beneath
  //                       (always-on motion, themed like a security console).
  //                       Disabled under prefers-reduced-motion.
  //   4. Center splash  — blue radial glow above the headline
  //   5. Content scrim  — soft white behind nav + text so type breathes

  const baseGridMask =
    "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.18) 60%, rgba(0,0,0,0) 88%)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[110vh] overflow-hidden"
    >
      {/* 1. Page wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 70% at 50% -15%, rgba(28,38,122,0.06), transparent 55%)",
        }}
      />

      {/* 2. Base grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${BRAND.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.gridLine} 1px, transparent 1px)`,
          backgroundSize: "44px 44px, 44px 44px",
          WebkitMaskImage: baseGridMask,
          maskImage: baseGridMask,
        }}
      />

      {/* 3. Sweep band — bright grid revealed by a moving diagonal mask */}
      <div
        data-osto-sweep
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${BRAND.gridLineHot} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.gridLineHot} 1px, transparent 1px)`,
          backgroundSize: "44px 44px, 44px 44px",
        }}
      />

      {/* 3b. Current flow — bright grid lines that sit exactly on top of
             existing lattice lines (same 1px width, snapped to ticks).
             A lit segment travels down each line, like current through
             a circuit. Sits under the scrim so it only reads in the
             periphery. */}
      <div
        className="absolute inset-0"
        style={{ WebkitMaskImage: baseGridMask, maskImage: baseGridMask }}
      >
        {FLOW_LINES.map((f, i) => {
          const offset = `calc(${Math.abs(f.tick)} * 44px - 0.5px)`;
          if (f.orient === "v") {
            return (
              <span
                key={i}
                data-osto-flow="v"
                className="absolute top-0 bottom-0"
                style={{
                  ...(f.tick >= 0 ? { left: offset } : { right: offset }),
                  width: "1px",
                  animationDelay: `${f.delay}s`,
                  animationDuration: `${f.duration}s`,
                }}
              />
            );
          }
          return (
            <span
              key={i}
              data-osto-flow="h"
              className="absolute left-0 right-0"
              style={{
                ...(f.tick >= 0 ? { top: offset } : { bottom: offset }),
                height: "1px",
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.duration}s`,
              }}
            />
          );
        })}
      </div>

      {/* 4. Center splash above the headline */}
      <div
        className="absolute inset-x-0 top-0 h-[70vh]"
        style={{
          background: `radial-gradient(420px at 50% 30%, ${BRAND.splash} 0%, rgba(92,121,255,0.12) 36%, rgba(92,121,255,0.04) 58%, transparent 75%)`,
        }}
      />

      {/* 5. Nav band scrim — always-on horizontal wash at the very top so
             the nav row sits on a solid surface regardless of the sweep. */}
      <div
        className="absolute inset-x-0 top-0 h-[120px]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(243,245,252,0.96) 0%, rgba(243,245,252,0.85) 60%, rgba(243,245,252,0) 100%)",
        }}
      />

      {/* 6. Content scrim — strong soft-white behind the entire content
             column: eyebrow → headline → sub → CTAs → micro-copy → proof
             strip → dashboard tabs. Fully opaque core so type, the strip,
             and the tab tracks always read cleanly when the bright sweep
             passes through. */}
      <div
        className="absolute inset-x-0 top-0 h-[120vh]"
        style={{
          background:
            "radial-gradient(ellipse 62% 58% at 50% 44%, rgba(243,245,252,1) 0%, rgba(243,245,252,0.97) 42%, rgba(243,245,252,0.85) 65%, rgba(243,245,252,0.50) 82%, transparent 96%)",
        }}
      />
    </div>
  );
}
