"use client";

/**
 * Resonate — marketing site.
 *
 * Light-theme design system with a single brand accent (electric blue)
 * and tokenized depth (PALETTE → T → E → GRAD). Every color, surface,
 * and shadow derives from PALETTE so re-theming is a one-place edit.
 * Sharp corners throughout; no rounded geometry. Page rails frame
 * every section; full-bleed bands (bento, HowItWorks, FinalCTA, footer)
 * extend to those rails.
 */

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { OstoModules, OstoModulesStyles } from "./OstoModules";

// ─── Brand wordmark ───────────────────────────────────────────────────
// Resonate logo — a filled square "source" with three angular chevron
// waves radiating to the right. Sharp geometry throughout, matching the
// site's no-roundness design rule. Paired with the wordmark.
function ResonateLogo({ size = 18, dark = false }: { size?: number; dark?: boolean }) {
  const ink = dark ? "#ffffff" : "#0a0a10";
  const wave = dark ? "#ffffff" : "#3b82f6";
  const dot = dark ? "#ffffff" : "#3b82f6";
  const w = Math.round(size * 1.2);
  const h = size;
  return (
    <span
      className="inline-flex items-center"
      style={{ gap: Math.round(size * 0.42) }}
      aria-label="Resonate"
    >
      <svg
        aria-hidden
        width={w}
        height={h}
        viewBox="0 0 24 20"
        fill="none"
        style={{ display: "inline-block", flexShrink: 0 }}
      >
        {/* source — filled square */}
        <rect x="3" y="7" width="6" height="6" fill={dot} />
        {/* chevron wave 1 — strongest */}
        <path d="M 11 5 L 14 10 L 11 15" stroke={wave} strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" fill="none" opacity="0.95" />
        {/* chevron wave 2 — mid */}
        <path d="M 15.5 3 L 19 10 L 15.5 17" stroke={wave} strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" fill="none" opacity="0.55" />
        {/* chevron wave 3 — outer, faded */}
        <path d="M 20 1 L 23.5 10 L 20 19" stroke={wave} strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter" fill="none" opacity="0.25" />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          fontSize: Math.round(size * 0.95),
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: ink,
        }}
      >
        Resonate
      </span>
    </span>
  );
}

// ─── PALETTE — single source of truth ─────────────────────────────────
// Change colors here and the entire site re-themes. Every other token
// (T, E, GRAD, DASH) is derived from this object — no other file
// should hard-code a hex value. To swap the brand, just edit PALETTE.
//
// Site is a light, paper-toned canvas with the four brand accents used
// sparingly: buttons, headline highlight, illustrations, focus rings.
// Accents are never bleed into the page background.
const PALETTE = {
  // ── Surface ramp (light) ──
  // Off-white base tinted very slightly cool so brand accents feel native.
  page:        "#fafafa",   // root canvas
  surface:     "#ffffff",   // raised cards, elevated panels
  panel:       "#f4f4f6",   // section bands, bento frame
  panelDeep:   "#eeeef1",   // deepest band (footer underlay)

  // ── Ink ramp (dark text on light) ──
  // Slight cool tint so it sits with the brand blue rather than fighting it.
  ink:         "#0a0a10",   // primary headlines
  inkStrong:   "#1a1a22",   // body emphasis
  inkSoft:     "#3a3a48",   // standard body
  inkMid:      "#5a5a6e",   // secondary body
  inkSubtle:   "#737386",   // captions, helper text (WCAG AA on light)
  inkFaint:    "#a0a0b0",   // disabled, watermark

  // ── Hairlines on light ──
  ring:        "rgba(10,10,16,0.08)",    // standard card edge
  ringStrong:  "rgba(10,10,16,0.14)",    // emphasized edge
  ringFaint:   "rgba(10,10,16,0.04)",    // barely-there separator

  // ── Brand accent — single channel ──
  // The site uses one accent. Everything else is white, grays, and black.
  // Used only on buttons, links, the headline highlight word, and the
  // product waveform. Never as a page-level background wash.
  blue:        "#3b82f6",   // primary — buttons, links, headline highlight
  blueDeep:    "#2563eb",   // button mid-stop, text-on-light brand label
  blueDark:    "#1d4ed8",   // button bottom, ring
  blueSoft:    "#93c5fd",   // light tint — secondary fills in illustrations
  // Legacy alias slots — old code referenced cyan / violet / pink. They
  // all collapse to the single brand channel now (varied by tint).
  cyan:        "#93c5fd",   // soft tint
  violet:      "#3b82f6",   // primary
  pink:        "#2563eb",   // deep
};

// ─── Design tokens — derived from PALETTE ─────────────────────────────
const T = {
  // Surfaces
  page:          PALETTE.page,
  surface:       PALETTE.surface,
  panel:         PALETTE.panel,
  panelDeep:     PALETTE.panelDeep,
  panelHairline: PALETTE.ringFaint,

  // Ink
  ink:        PALETTE.ink,
  inkStrong:  PALETTE.inkStrong,
  inkSoft:    PALETTE.inkSoft,
  inkMid:     PALETTE.inkMid,
  inkSubtle:  PALETTE.inkSubtle,
  inkFaint:   PALETTE.inkFaint,
  inkLine:    PALETTE.ring,

  // Hairlines
  ring:       PALETTE.ring,
  ringStrong: PALETTE.ringStrong,

  // Brand accents (legacy names — kept so existing components don't churn)
  accent:        PALETTE.blue,         // primary brand — buttons, large headlines
  accentText:    PALETTE.blueDeep,     // darker — for text-on-light (WCAG AA)
  accentCyan:    PALETTE.cyan,
  accentViolet:  PALETTE.violet,
  accentPink:    PALETTE.pink,

  // Button stops
  btnTop: PALETTE.blue,
  btnBot: PALETTE.blueDark,
  btnRing: PALETTE.blueDark,

  // Type
  fontSans:    "var(--font-sans)",
  fontDisplay: "var(--font-sans)",
  fontMono:    "var(--font-mono)",
};

// ─── Gradients — derived from PALETTE ─────────────────────────────────
// Multi-stop linear gradients composed from the four brand accents.
// Used as fills inside product geometry (waveform, illustrations) and
// on the primary button. Never used as page-level background washes.
const GRAD = {
  signal:
    `linear-gradient(135deg, ${PALETTE.cyan} 0%, ${PALETTE.blue} 35%, ${PALETTE.violet} 70%, ${PALETTE.pink} 100%)`,
  cool:
    `linear-gradient(135deg, ${PALETTE.cyan} 0%, ${PALETTE.blue} 60%, ${PALETTE.violet} 100%)`,
  warm:
    `linear-gradient(135deg, ${PALETTE.violet} 0%, ${PALETTE.pink} 100%)`,
  // Vertical brand button gradient
  button:
    `linear-gradient(180deg, ${PALETTE.blue} 0%, ${PALETTE.blueDeep} 60%, ${PALETTE.blueDark} 100%)`,
  // Translucent surfaces — for layered geometric blocks on light
  surfaceLow:  "rgba(10,10,16,0.02)",
  surfaceMid:  "rgba(10,10,16,0.035)",
  surfaceHigh: "rgba(10,10,16,0.06)",
  // Legacy halo names — kept so dead references don't break. Set to
  // transparent so any lingering use renders nothing.
  haloCyan:   "transparent",
  haloViolet: "transparent",
  haloPink:   "transparent",
};

// ─── Elevation — derived from PALETTE ─────────────────────────────────
// On light, elevation = soft drop shadow + hairline ring. No glow.
const E = {
  card: `0 0 0 1px ${PALETTE.ring}, 0 1px 2px rgba(10,10,16,0.04)`,
  cardElevated:
    `0 0 0 1px ${PALETTE.ring}, 0 1px 2px rgba(10,10,16,0.04), 0 8px 24px -12px rgba(10,10,16,0.10), 0 24px 48px -24px rgba(10,10,16,0.10)`,
  cardFlat: "none",
  buttonGhost:
    `0 0 0 1px ${PALETTE.ringStrong}, inset 0 1px 0 rgba(255,255,255,0.6)`,
  buttonBrand:
    `inset 0 1px 0 rgba(255,255,255,0.25), 0 0 0 1px ${PALETTE.blueDark}, 0 4px 12px -4px rgba(59,130,246,0.30)`,
  navCapsule:
    `0 0 0 1px ${PALETTE.ring}, inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 24px -12px rgba(10,10,16,0.08)`,
  ringOnly: `0 0 0 1px ${PALETTE.ring}`,
  innerGlow: "none",
};

// Dashed frame tokens — page scaffold lines on light paper.
const DASH = {
  stroke: "rgba(10,10,16,0.10)",
  strokeStrong: "rgba(10,10,16,0.18)",
  pattern: "4, 6",
  outset: 24,
};

// Brand button background — the signature gradient used on the hero
// primary CTA + Pricing tier "Start building" button.
const BUTTON_BRAND_BG = GRAD.button;

// ─── Spacing scale (4pt rhythm) ───────────────────────────────────────
// Used by the components built on top of these tokens. Existing sections
// pre-date this scale and use Tailwind classes directly; we don't churn
// them here, but new primitives must consume from S.
const S = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  // Component-specific
  cardPadding: 32,         // p-8
  cardPaddingLg: 40,       // md:p-10
  cardGap: 24,             // gap-x-6
  cardStackGap: 40,        // gap-y-10 between rows
};

// ─── Radius scale ─────────────────────────────────────────────────────
// All radii zeroed — the site is now sharp-cornered by design rule.
const R = {
  sm: 0,
  md: 0,
  lg: 0,
};

// ─── Type scale ───────────────────────────────────────────────────────
// Pre-baked size + leading + tracking pairings. Each entry is a partial
// CSSProperties object so primitives can spread it into a style prop.
type TypeToken = {
  fontSize: number;
  lineHeight: string;
  letterSpacing: string;
  fontWeight?: number;
};
// Fluid display sizes (h1, h2, lead) are applied directly via clamp()
// in SectionHeading and Hero — they don't fit the fixed-size shape of
// TypeToken and are documented in those components.
const Type: Record<string, TypeToken> = {
  // Eyebrow — small label above an H1/H2
  eyebrow:    { fontSize: 12, lineHeight: "20px", letterSpacing: "-0.18px", fontWeight: 500 },
  // Card-level
  cardTitle:  { fontSize: 16, lineHeight: "24px", letterSpacing: "-0.24px", fontWeight: 500 },
  body:       { fontSize: 14, lineHeight: "20px", letterSpacing: "-0.14px" },
  bodySm:     { fontSize: 13, lineHeight: "20px", letterSpacing: "-0.13px" },
  caption:    { fontSize: 12, lineHeight: "18px", letterSpacing: "-0.18px" },
  // Pricing numerals
  priceLg:    { fontSize: 32, lineHeight: "38px", letterSpacing: "-0.8px",  fontWeight: 500 },
  priceCadence: { fontSize: 14, lineHeight: "20px", letterSpacing: "-0.14px" },
};


// ─── Page ─────────────────────────────────────────────────────────────
export function OstoHeroV2() {
  // Console signature — a small hello to anyone poking around devtools.
  // Fires once per page load. Skipped when reduced-motion is set so we
  // don't surprise users who have minimised the experience.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // eslint-disable-next-line no-console
    console.log(
      "%c Resonate %c voice API for real-time agents ",
      `background:${PALETTE.blue};color:#ffffff;padding:4px 8px;font-weight:600;letter-spacing:0.04em`,
      `background:${PALETTE.surface};color:${PALETTE.ink};padding:4px 10px;letter-spacing:-0.01em;border:1px solid ${PALETTE.ring};border-left:none`
    );
  }, []);

  return (
    <main
      // overflow-x-clip (not overflow-hidden) — clips horizontal overflow
      // from full-bleed bands without creating a scroll container, which
      // would break `position: sticky` for scroll-jacked sections inside.
      className="relative min-h-screen overflow-x-clip"
      style={{
        background: T.page,
        color: T.ink,
        fontFamily: T.fontSans,
      }}
    >
      <V2Styles />
      <PageRails />
      <NavBar />
      <Hero />
      <LogoStrip />
      <SectionSpacer />
      <Reveal><ThreeDoors /></Reveal>
      <SectionSpacer />
      <Reveal><CustomerStories /></Reveal>
      <SectionSpacer />
      <Reveal><OutcomeStrip /></Reveal>
      <SectionSpacer />
      <Reveal><ProblemSection /></Reveal>
      <SectionSpacer />
      <Reveal><StitchedVsResonate /></Reveal>
      <SectionSpacer />
      {/* HowItWorks is NOT wrapped in <Reveal> — the Reveal component
          applies a CSS transform which creates a containing block that
          breaks `position: sticky` for descendants. The section has its
          own scroll-driven fade-in on the inner panel. */}
      <HowItWorks />
      <SectionSpacer />
      <Reveal><CodeSnippet /></Reveal>
      <SectionSpacer />
      <Reveal><OstoModules /></Reveal>
      <SectionSpacer />
      <Reveal><Integrations /></Reveal>
      <SectionSpacer />
      <Reveal><WhyTrust /></Reveal>
      <SectionSpacer />
      <Reveal><PricingCalculator /></Reveal>
      <SectionSpacer />
      <Reveal><Pricing /></Reveal>
      <SectionSpacer />
      <Reveal><FAQ /></Reveal>
      <SectionSpacer />
      <Reveal><FinalCTA /></Reveal>
      <SectionSpacer />
      <Footer />
      <OstoModulesStyles />
    </main>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────
/**
 * PageRails — page-level blueprint backdrop.
 *
 * Two vertical dashed rails at fixed offsets from the page edges run the
 * full document height, giving every section the same architectural framing.
 * Section-level horizontal cross-bars are added inline by the SectionDivider
 * component (used between sections that want a visible boundary).
 *
 * Renders at z-index 0, behind all content. Hidden on small viewports
 * where the inset would crowd the content.
 */
// Rail sits outside the content column so section panels never overlap
// it. Section content is capped at 1180px; rails sit 28px further out so
// there's a visible gutter between the rail and any panel edge.
const RAIL_INSET = "max(24px, calc((100vw - 1240px) / 2))";
const RAIL_STROKE = PALETTE.ring;        // derived from PALETTE — flips with theme
const RAIL_TICK   = PALETTE.ringStrong;  // dashed tick fill for SectionSpacer

function PageRails() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 hidden md:block"
    >
      <span
        className="absolute top-0 bottom-0"
        style={{
          left: RAIL_INSET,
          width: 1,
          background: RAIL_STROKE,
        }}
      />
      <span
        className="absolute top-0 bottom-0"
        style={{
          right: RAIL_INSET,
          width: 1,
          background: RAIL_STROKE,
        }}
      />
    </div>
  );
}

/**
 * SectionSpacer — vertical-line scan band that sits between sections,
 * bounded by hairlines top and bottom. The fill is a column of faded
 * vertical 1px lines that taper at both ends so it reads as transitional
 * rather than busy. Drop one between any two sections.
 */
function SectionSpacer({
  height = 56,
  spaceY = 56,
}: {
  height?: number;
  spaceY?: number;
}) {
  return (
    <>
      {/* Mobile: a single, consistent vertical gap between every
          section. No rail chrome on phone — page rails are hidden
          anyway, and the rails-only spacer collapsed entirely before.
          96px gives clear separation between adjacent sections without
          feeling like an empty room. */}
      <div
        aria-hidden
        className="pointer-events-none md:hidden"
        style={{ height: 96 }}
      />
      {/* Desktop / tablet: the full rail-bound spacer with dashed
          ticks running between the two page rails. */}
      <div
        aria-hidden
        className="pointer-events-none relative hidden md:block"
        style={{ height, marginTop: spaceY, marginBottom: spaceY }}
      >
        <span
          className="absolute"
          style={{
            top: 0,
            left: RAIL_INSET,
            right: RAIL_INSET,
            height: 1,
            background: RAIL_STROKE,
          }}
        />
        <span
          className="absolute"
          style={{
            bottom: 0,
            left: RAIL_INSET,
            right: RAIL_INSET,
            height: 1,
            background: RAIL_STROKE,
          }}
        />
        <span
          className="absolute inset-y-px"
          style={{
            left: RAIL_INSET,
            right: RAIL_INSET,
            backgroundImage: `repeating-linear-gradient(to right, ${RAIL_TICK} 0 1px, transparent 1px 11px)`,
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        />
      </div>
    </>
  );
}

type MenuKey = "platform" | "solutions";

// Mobile menu items — flat list that mirrors what's in the desktop
// mega-menus, minus the illustrations (which would crowd a phone sheet).
const MOBILE_NAV_SECTIONS = [
  {
    heading: "Platform",
    items: [
      { label: "Realtime voice", desc: "90 ms streaming agents", href: "#" },
      { label: "Voice library", desc: "200+ voices · 32 languages", href: "#" },
      { label: "Telephony & SDKs", desc: "SIP, Twilio, WebRTC", href: "#" },
      { label: "Evals & analytics", desc: "Transcripts and drop-off", href: "#" },
    ],
  },
  {
    heading: "Solutions",
    items: [
      { label: "Customer support", desc: "Inbound that resolves 70%", href: "#" },
      { label: "Outbound sales", desc: "Qualify and book at scale", href: "#" },
      { label: "Healthcare & ops", desc: "HIPAA BAA reminders, intake", href: "#" },
      { label: "Receptionist", desc: "Always-on front desk", href: "#" },
    ],
  },
] as const;

function NavBar() {
  const [openMenu, setOpenMenu] = useState<null | MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Delayed close so the cursor can travel from the trigger to the
  // panel across the small mt-3 gap without the menu snapping shut.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };
  const openImmediately = (key: MenuKey) => {
    cancelClose();
    setOpenMenu(key);
  };

  // Close menus on Escape and on outside-click. Covers both desktop
  // mega-menus (openMenu) and the mobile dropdown (mobileOpen). The
  // outside-click guard uses [data-osto-nav] on the <header>, so any
  // click inside the nav region keeps the menu open.
  useEffect(() => {
    if (!openMenu && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-osto-nav]")) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [openMenu, mobileOpen]);

  useEffect(() => () => cancelClose(), []);

  return (
    <header
      data-osto-nav
      className="osto-nav-enter fixed top-4 left-0 right-0 z-50 w-full px-4 md:top-6"
    >
      <div className="relative mx-auto flex max-w-[940px] items-center justify-between gap-x-12">
        <nav
          className="flex w-full items-center justify-between gap-x-12 py-1.5 pl-5 pr-2 backdrop-blur transition-shadow duration-200"
          style={{
            background: "rgba(255,255,255,0.78)",
            boxShadow: E.navCapsule,
            backdropFilter: "blur(14px) saturate(140%)",
            WebkitBackdropFilter: "blur(14px) saturate(140%)",
          }}
        >
          <div className="flex items-center gap-x-5">
            <Link href="/" aria-label="Resonate home" className="flex items-center">
              <ResonateLogo size={18} />
            </Link>

            <div className="hidden items-center md:flex">
              <NavTrigger
                label="Platform"
                open={openMenu === "platform"}
                onOpen={() => openImmediately("platform")}
                onClose={scheduleClose}
                onToggle={() =>
                  setOpenMenu(openMenu === "platform" ? null : "platform")
                }
              />
              <NavTrigger
                label="Solutions"
                open={openMenu === "solutions"}
                onOpen={() => openImmediately("solutions")}
                onClose={scheduleClose}
                onToggle={() =>
                  setOpenMenu(openMenu === "solutions" ? null : "solutions")
                }
              />
              <NavLink href="#pricing">Pricing</NavLink>
              <NavLink href="#docs">Docs</NavLink>
            </div>
          </div>

          <div className="flex items-center gap-x-1">
            <Link
              href="#"
              className="hidden px-3 py-2 text-[13px] font-medium tracking-[-0.13px] md:inline-block"
              style={{ color: T.ink }}
            >
              Sign in
            </Link>
            <BrandButton href="#">Book demo</BrandButton>

            {/* Mobile-only menu trigger. Sits to the right of Book demo
                so the brand button stays the visual anchor on phone. */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="ml-1 inline-flex h-9 w-9 items-center justify-center md:hidden"
              style={{ color: T.ink }}
            >
              {/* Two-line hamburger — collapses to an X when open. The
                  rotation/translation is purely CSS, no extra DOM. */}
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
                <line
                  x1="3" x2="17"
                  y1={mobileOpen ? 10 : 7}
                  y2={mobileOpen ? 10 : 7}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  style={{
                    transformOrigin: "10px 10px",
                    transform: mobileOpen ? "rotate(45deg)" : "none",
                    transition: "transform 220ms cubic-bezier(0.2,0.8,0.2,1), y 220ms cubic-bezier(0.2,0.8,0.2,1)",
                  }}
                />
                <line
                  x1="3" x2="17"
                  y1={mobileOpen ? 10 : 13}
                  y2={mobileOpen ? 10 : 13}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  style={{
                    transformOrigin: "10px 10px",
                    transform: mobileOpen ? "rotate(-45deg)" : "none",
                    transition: "transform 220ms cubic-bezier(0.2,0.8,0.2,1), y 220ms cubic-bezier(0.2,0.8,0.2,1)",
                  }}
                />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mega-menu panels — onMouseEnter cancels pending close so
            cursor can travel from trigger to panel without flicker. */}
        {openMenu === "platform" && (
          <div
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="absolute left-0 top-full"
          >
            <MegaMenu
              items={[
                {
                  icon: "stream",
                  label: "Realtime voice",
                  desc: "Streaming agents that answer in 90 ms and switch languages mid-call.",
                  href: "#",
                },
                {
                  icon: "voice-library",
                  label: "Voice library",
                  desc: "Pick from 200+ voices across 32 languages, or clone your own.",
                  href: "#",
                },
                {
                  icon: "telephony",
                  label: "Telephony & SDKs",
                  desc: "Reach callers over SIP, Twilio, WebRTC, iOS, and Android.",
                  href: "#",
                },
                {
                  icon: "evals",
                  label: "Evals & analytics",
                  desc: "Watch transcripts, sentiment, and drop-off in one dashboard.",
                  href: "#",
                },
              ]}
              preview={{
                title: "Master every endpoint of Resonate",
                desc: "Quickstart guides, SDK reference, and playbooks for shipping production voice agents.",
                href: "#docs",
                illus: <MegaPreviewPlatform />,
              }}
            />
          </div>
        )}

        {openMenu === "solutions" && (
          <div
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="absolute left-0 top-full"
          >
            <MegaMenu
              items={[
                {
                  icon: "support",
                  label: "Customer support",
                  desc: "Inbound that resolves 70% of tickets before a human picks up.",
                  href: "#",
                },
                {
                  icon: "outbound",
                  label: "Outbound sales",
                  desc: "Qualify leads and book meetings without staffing a call center.",
                  href: "#",
                },
                {
                  icon: "healthcare",
                  label: "Healthcare & ops",
                  desc: "Run reminders, intake, and triage under a signed HIPAA BAA.",
                  href: "#",
                },
                {
                  icon: "receptionist",
                  label: "Receptionist",
                  desc: "Front desk that routes, books, and answers in any language.",
                  href: "#",
                },
              ]}
              preview={{
                title: "Voice agents shipped in days, not quarters",
                desc: "Read how support, sales, and healthcare teams put Resonate agents on real phone numbers in production.",
                href: "#customers",
                illus: <MegaPreviewSolutions />,
              }}
            />
          </div>
        )}
      </div>

      {/* Mobile sheet — full-viewport overlay, md:hidden. Slides in from
          the top so the visual relationship to the nav capsule stays
          intact. Body scroll lock and Escape handler live in the parent
          NavBar effect. */}
      <MobileNavSheet
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}

// ─── Mobile nav dropdown ──────────────────────────────────────────────
// Floating card that opens BELOW the hamburger button — same pattern as
// the desktop mega-menu, just narrower and right-anchored. Mounted via
// `position: absolute` inside the nav header, so [data-osto-nav] still
// captures clicks for the parent's outside-click → close logic.
//
// No portal, no scrim, no body-scroll lock. The dropdown is just a
// card; everything else on the page stays visible.
function MobileNavSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      data-osto-mega
      role="menu"
      className="absolute left-4 right-4 top-full mt-3 overflow-hidden md:hidden"
      style={{
        background: T.surface,
        boxShadow: E.card,
        // Cap below 100dvh so the dropdown never extends past the
        // viewport, AND leave a strip of page visible underneath so
        // it reads as a dropdown, not a takeover. 72dvh + the nav
        // capsule above it (~64px) leaves ~24% of viewport unobscured
        // on phones where 100dvh ≈ 800px.
        maxHeight: "72dvh",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div style={{ paddingBlock: 10, paddingInline: 10 }}>
        {MOBILE_NAV_SECTIONS.map((section) => (
          <div key={section.heading} className="mb-2">
            <p
              className="px-2 text-[10.5px] font-medium uppercase"
              style={{
                color: T.inkSubtle,
                fontFamily: T.fontMono,
                letterSpacing: "0.06em",
                paddingBlock: 4,
              }}
            >
              {section.heading}
            </p>
            <ul className="flex flex-col">
              {section.items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block px-2 py-2 text-[14px] font-medium active:bg-black/[0.04]"
                    style={{ color: T.ink, letterSpacing: "-0.012em" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Secondary links — separated by a hairline above. */}
        <div
          className="flex flex-col"
          style={{
            borderTop: `1px solid ${T.ring}`,
            paddingTop: 4,
            marginTop: 2,
          }}
        >
          {[
            { label: "Pricing", href: "#pricing" },
            { label: "Docs", href: "#docs" },
            { label: "Sign in", href: "#" },
          ].map((row) => (
            <Link
              key={row.label}
              href={row.href}
              onClick={onClose}
              className="flex items-center justify-between px-2 py-2 active:bg-black/[0.04]"
              style={{ color: T.ink }}
            >
              <span
                className="text-[14px] font-medium"
                style={{ letterSpacing: "-0.012em" }}
              >
                {row.label}
              </span>
              <NavChevron />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Tiny right-chevron used as the trailing affordance on mobile rows.
function NavChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M4 2 L8 6 L4 10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}

function NavTrigger({
  label,
  open,
  onOpen,
  onClose,
  onToggle,
}: {
  label: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  return (
    <button
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onClick={onToggle}
      aria-expanded={open}
      className="inline-flex items-center gap-x-2 px-3 py-2 text-[13px] font-medium tracking-[-0.13px] transition-colors hover:bg-black/[0.04]"
      style={{ color: T.ink }}
    >
      {label}
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        className="transition-transform"
        style={{
          color: T.inkSubtle,
          transform: open ? "rotate(180deg)" : "rotate(0)",
        }}
      >
        <path
          d="m5 7 3 3 3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  // Hover style matches NavTrigger: a faint dark tint background, no
  // underline. Same px/py, same transition, so all four top-nav items
  // (Platform, Solutions, Pricing, Docs) behave identically.
  return (
    <Link
      href={href}
      className="inline-flex items-center px-3 py-2 text-[13px] font-medium tracking-[-0.13px] transition-colors hover:bg-black/[0.04]"
      style={{ color: T.ink }}
    >
      {children}
    </Link>
  );
}

// ─── Mega-menu — Twenty-style two-column dropdown ─────────────────────
//
// Left column: a vertical list of 4 menu items. Each row = small icon
// tile, an uppercase mono label, and a one-line descriptor underneath.
// Right column: a single clickable "feature preview" card with a small
// product-UI illustration, a heading, and a short caption.
//
// Both halves are clickable links — left rows go to their feature page,
// the right preview goes to docs (Platform) or customer stories
// (Solutions). The whole panel matches the nav capsule's max-width
// (940px) so it tucks neatly under the nav.

type MegaIconKey =
  | "stream"
  | "voice-library"
  | "telephony"
  | "evals"
  | "support"
  | "outbound"
  | "healthcare"
  | "receptionist";

type MegaItem = {
  icon: MegaIconKey;
  label: string;
  desc: string;
  href: string;
};

type MegaPreview = {
  /** Title shown beneath the preview illustration */
  title: string;
  /** Caption shown beneath the title */
  desc: string;
  /** Where the whole preview card links to */
  href: string;
  /** Preview illustration — a small product UI fragment */
  illus: React.ReactNode;
};

function MegaMenu({
  items,
  preview,
}: {
  items: MegaItem[];
  preview: MegaPreview;
}) {
  return (
    <div
      data-osto-mega
      role="menu"
      className="mt-3 overflow-hidden"
      style={{
        background: T.surface,
        boxShadow: E.card,
        // Same envelope as the nav capsule above it.
        width: "min(940px, calc(100vw - 32px))",
      }}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* ── Left column — vertical list of feature items ── */}
        <ul
          className="flex flex-col"
          style={{ background: T.surface }}
        >
          {items.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="group flex items-start gap-x-3.5 px-5 py-4 transition-colors hover:bg-black/[0.03]"
              >
                <MegaIcon kind={item.icon} />
                <div className="min-w-0">
                  <p
                    className="text-[11px] font-medium uppercase"
                    style={{
                      color: T.inkMid,
                      fontFamily: T.fontMono,
                      letterSpacing: "0.06em",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="mt-1 text-pretty text-[13px] leading-[18px]"
                    style={{ color: T.ink, letterSpacing: "-0.012em" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Right column — clickable feature preview ── */}
        <Link
          href={preview.href}
          className="group flex flex-col p-5 transition-colors hover:bg-black/[0.03]"
          style={{
            background: T.panel,
            boxShadow: `inset 1px 0 0 0 ${T.ring}`,
          }}
        >
          {/* Preview illustration — fills the upper portion of the card */}
          <div
            className="relative h-[180px] w-full overflow-hidden"
            style={{ background: T.surface, boxShadow: E.ringOnly }}
          >
            {preview.illus}
          </div>
          {/* Title + caption beneath the preview */}
          <div className="mt-4">
            <p
              className="text-[14px] font-semibold"
              style={{ color: T.ink, letterSpacing: "-0.012em" }}
            >
              {preview.title}
            </p>
            <p
              className="mt-1 text-pretty text-[12.5px] leading-[18px]"
              style={{ color: T.inkSoft, letterSpacing: "-0.012em" }}
            >
              {preview.desc}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

// ─── MegaIcon — bold on-brand tile mark ──────────────────────────────
//
// Each icon is a 44×44 sharp-cornered tile filled with brand blue and
// holding a single white glyph at 24×24. The whole thing reads at a
// glance — no fiddly line-art at micro scales, no mixing line + fill
// across the set. Visually descended from the Resonate chevron mark:
// solid blue plates with a confident white symbol.
function MegaIcon({ kind }: { kind: MegaIconKey }) {
  // Solid blue plate with a hairline accent-deep ring + soft drop
  // shadow so the tile reads as a raised on-brand chip on the menu.
  const TileWrap = ({ children }: { children: React.ReactNode }) => (
    <span
      aria-hidden
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center"
      style={{
        background: T.accent,
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.22)",
          `0 0 0 1px ${PALETTE.blueDark}`,
          "0 1px 2px rgba(10,10,16,0.08)",
          "0 4px 10px -4px rgba(59,130,246,0.30)",
        ].join(", "),
      }}
    >
      {children}
    </span>
  );

  // Single glyph color — white on the blue tile. One consistent stroke
  // weight (1.8) and one consistent fill style across all eight marks.
  const FG = "#ffffff";

  switch (kind) {
    // ── PLATFORM ──
    // Streaming voice → 5 vertical bars, center tallest. On row hover
    // each bar pulses its scaleY with a left→right stagger to suggest
    // streaming audio.
    case "stream":
      return (
        <TileWrap>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            {[
              { x: 3,  y: 10, h: 4  },
              { x: 7,  y: 7,  h: 10 },
              { x: 11, y: 4,  h: 16 },
              { x: 15, y: 7,  h: 10 },
              { x: 19, y: 10, h: 4  },
            ].map((b, i) => (
              <rect
                key={i}
                className="osto-mi osto-mi-stream-bar"
                x={b.x}
                y={b.y}
                width="2.4"
                height={b.h}
                fill={FG}
                style={{
                  transformOrigin: "center",
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </svg>
        </TileWrap>
      );

    // Voice library → three stacked solid rows. On hover the rows
    // sweep in from the left with a top→down stagger like a list
    // loading.
    case "voice-library":
      return (
        <TileWrap>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            {[
              { y: 4,  o: 1    },
              { y: 10, o: 0.85 },
              { y: 16, o: 0.55 },
            ].map((r, i) => (
              <rect
                key={i}
                className="osto-mi osto-mi-row"
                x="3"
                y={r.y}
                width="18"
                height="4"
                fill={FG}
                opacity={r.o}
                style={{
                  animationDelay: `${i * 80}ms`,
                  // The keyframe reads --row-o so the swept-in row
                  // settles to its per-row opacity instead of 1.
                  ["--row-o" as string]: `${r.o}`,
                }}
              />
            ))}
          </svg>
        </TileWrap>
      );

    // Telephony → solid handset. On hover the handset wiggles (small
    // rotation) like an incoming call buzz.
    case "telephony":
      return (
        <TileWrap>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              className="osto-mi osto-mi-phone"
              d="M5 4 L 9.5 4 L 11 8.5 L 8.5 10.5 Q 11 14.5 14 16 L 15.5 13.5 L 20 15 L 20 19 Q 11 19.5 5 13 Z"
              fill={FG}
              style={{ transformOrigin: "center" }}
            />
          </svg>
        </TileWrap>
      );

    // Evals → three analytics bars climbing left→right. On hover the
    // bars rise from baseline (scaleY 0→1) with a stagger.
    case "evals":
      return (
        <TileWrap>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            {[
              { x: 4,  y: 13, h: 7,  o: 0.7  },
              { x: 10, y: 9,  h: 11, o: 0.85 },
              { x: 16, y: 5,  h: 15, o: 1    },
            ].map((b, i) => (
              <rect
                key={i}
                className="osto-mi osto-mi-evals-bar"
                x={b.x}
                y={b.y}
                width="3.5"
                height={b.h}
                fill={FG}
                opacity={b.o}
                style={{
                  // Anchor at the bottom of each bar (bbox-local
                  // bottom-center) so scaleY 0→1 rises from baseline.
                  transformOrigin: "center bottom",
                  animationDelay: `${i * 90}ms`,
                }}
              />
            ))}
          </svg>
        </TileWrap>
      );

    // ── SOLUTIONS ──
    // Customer support → speech bubble. On hover a quick pop/scale
    // pulse from the tail's anchor like a new message arriving.
    case "support":
      return (
        <TileWrap>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              className="osto-mi osto-mi-bubble"
              d="M4 5 H 20 V 16 H 10 L 6 20 V 16 H 4 Z"
              fill={FG}
              style={{ transformOrigin: "12% 100%" }}
            />
          </svg>
        </TileWrap>
      );

    // Outbound → arrow shaft + head. On hover the shaft + head
    // translate forward then snap back.
    case "outbound":
      return (
        <TileWrap>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <g className="osto-mi osto-mi-arrow">
              <path d="M3 12 H 17" stroke={FG} strokeWidth="2.4" strokeLinecap="square" />
              <path d="M14 6 L 21 12 L 14 18 Z" fill={FG} />
            </g>
          </svg>
        </TileWrap>
      );

    // Healthcare → solid cross. On hover it rotates from -45° → 0
    // like a stamp landing.
    case "healthcare":
      return (
        <TileWrap>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <g className="osto-mi osto-mi-cross" style={{ transformOrigin: "center" }}>
              <rect x="10" y="3"  width="4" height="18" fill={FG} />
              <rect x="3"  y="10" width="18" height="4" fill={FG} />
            </g>
          </svg>
        </TileWrap>
      );

    // Receptionist → bell with clapper. On hover the bell tilts
    // left/right with the clapper swinging — ringing motion.
    case "receptionist":
      return (
        <TileWrap>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <g className="osto-mi osto-mi-bell" style={{ transformOrigin: "50% 0%" }}>
              <path d="M5 16 Q 5 6 12 6 Q 19 6 19 16 Z" fill={FG} />
              <rect x="4" y="16" width="16" height="2.4" fill={FG} />
            </g>
            <rect
              className="osto-mi osto-mi-bell-clapper"
              x="11"
              y="19"
              width="2"
              height="2.4"
              fill={FG}
              style={{ transformOrigin: "center top" }}
            />
          </svg>
        </TileWrap>
      );
  }
}

// ─── Mega-menu preview illustrations ──────────────────────────────────
//
// The right-side card in each mega-menu uses one of these. They are
// small product-UI fragments rendered as a single SVG, scaled to fill
// a 180px-tall canvas. Same mono-blue + gray vocabulary as the bento.
function MegaPreviewPlatform() {
  // Stylized docs page: a left sidebar of nav rows + a content column
  // with a heading bar and a few text rows. The active sidebar row is
  // brand-blue. Reads as "what the developer docs look like."
  return (
    <svg
      viewBox="0 0 360 180"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {/* Outer page chrome */}
      <rect x="14" y="14" width="332" height="152" fill={T.surface} stroke={T.ring} />
      {/* Top bar */}
      <rect x="14" y="14" width="332" height="22" fill={T.panel} />
      <line x1="14" y1="36" x2="346" y2="36" stroke={T.ring} />
      {/* Window dots */}
      <circle cx="26" cy="25" r="2.5" fill={T.inkFaint} />
      <circle cx="36" cy="25" r="2.5" fill={T.inkFaint} />
      <circle cx="46" cy="25" r="2.5" fill={T.inkFaint} />

      {/* Left sidebar */}
      <rect x="14" y="36" width="92" height="130" fill={T.panel} />
      <line x1="106" y1="36" x2="106" y2="166" stroke={T.ring} />
      {/* Sidebar items */}
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 50 + i * 18;
        const isActive = i === 1;
        return (
          <g key={i}>
            {isActive && (
              <rect x="22" y={y - 5} width="76" height="14" fill={T.accent} />
            )}
            <rect
              x={28}
              y={y - 1}
              width={i % 2 === 0 ? 56 : 64}
              height="3"
              fill={isActive ? "#ffffff" : T.inkMid}
              opacity={isActive ? 0.95 : 0.7}
            />
          </g>
        );
      })}

      {/* Content column — heading + body rows */}
      <g>
        <rect x="124" y="48"  width="120" height="6" fill={T.ink} opacity="0.85" />
        <rect x="124" y="62"  width="180" height="3" fill={T.inkMid} opacity="0.55" />
        <rect x="124" y="70"  width="160" height="3" fill={T.inkMid} opacity="0.55" />
        <rect x="124" y="78"  width="200" height="3" fill={T.inkMid} opacity="0.55" />
        {/* Code block */}
        <rect x="124" y="92"  width="208" height="48" fill={T.panel} stroke={T.ring} />
        <rect x="132" y="100" width="56"  height="3" fill={T.accent} />
        <rect x="192" y="100" width="80"  height="3" fill={T.inkMid} opacity="0.6" />
        <rect x="132" y="110" width="48"  height="3" fill={T.inkMid} opacity="0.55" />
        <rect x="132" y="120" width="120" height="3" fill={T.inkMid} opacity="0.55" />
        <rect x="132" y="130" width="36"  height="3" fill={T.accent} />
        {/* Footer row */}
        <rect x="124" y="150" width="60"  height="3" fill={T.inkMid} opacity="0.5" />
      </g>
    </svg>
  );
}

function MegaPreviewSolutions() {
  // Stylized customer-stories grid: 4 cards in a 2×2 with a small
  // avatar tile, a name bar, a quote bar, and one card highlighted in
  // brand-blue. Reads as "what the customer wall looks like."
  return (
    <svg
      viewBox="0 0 360 180"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect x="14" y="14" width="332" height="152" fill={T.surface} stroke={T.ring} />
      {/* Heading bar at top */}
      <rect x="28" y="30" width="160" height="5" fill={T.ink} opacity="0.85" />
      <rect x="28" y="42" width="120" height="3" fill={T.inkMid} opacity="0.55" />

      {/* 4 customer cards in a 2×2 */}
      {[
        { x: 28,  y: 64, accent: false },
        { x: 192, y: 64, accent: true  },
        { x: 28,  y: 118, accent: false },
        { x: 192, y: 118, accent: false },
      ].map((c, i) => (
        <g key={i}>
          <rect
            x={c.x}
            y={c.y}
            width="140"
            height="46"
            fill={c.accent ? T.accent : T.panel}
            stroke={c.accent ? "none" : T.ring}
          />
          {/* Avatar */}
          <rect
            x={c.x + 8}
            y={c.y + 8}
            width="14"
            height="14"
            fill={c.accent ? "rgba(255,255,255,0.32)" : T.inkFaint}
          />
          {/* Name */}
          <rect
            x={c.x + 28}
            y={c.y + 10}
            width="50"
            height="3"
            fill={c.accent ? "#ffffff" : T.ink}
            opacity={c.accent ? 0.95 : 0.85}
          />
          {/* Role */}
          <rect
            x={c.x + 28}
            y={c.y + 17}
            width="36"
            height="2.5"
            fill={c.accent ? "rgba(255,255,255,0.7)" : T.inkMid}
            opacity={c.accent ? 1 : 0.6}
          />
          {/* Quote lines */}
          <rect
            x={c.x + 8}
            y={c.y + 30}
            width="120"
            height="2.5"
            fill={c.accent ? "rgba(255,255,255,0.78)" : T.inkMid}
            opacity={c.accent ? 1 : 0.5}
          />
          <rect
            x={c.x + 8}
            y={c.y + 37}
            width="90"
            height="2.5"
            fill={c.accent ? "rgba(255,255,255,0.78)" : T.inkMid}
            opacity={c.accent ? 1 : 0.5}
          />
        </g>
      ))}
    </svg>
  );
}

// ─── Buttons ──────────────────────────────────────────────────────────
// Two visual variants (brand / ghost), two sizes (sm / md). Size sm
// matches the dense in-product feel used throughout the page. Size md
// scales for the hero CTA where the headline is 56px.
type ButtonSize = "sm" | "md";

const BTN_SIZE: Record<ButtonSize, { padX: number; padY: number; height: number; gap: number; type: TypeToken }> = {
  sm: { padX: 12, padY: 6,  height: 32, gap: 6, type: Type.bodySm },
  md: { padX: 18, padY: 10, height: 44, gap: 8, type: { fontSize: 15, lineHeight: "20px", letterSpacing: "-0.15px", fontWeight: 500 } },
};

function BrandButton({
  href,
  children,
  size = "sm",
}: {
  href: string;
  children: React.ReactNode;
  size?: ButtonSize;
}) {
  const s = BTN_SIZE[size];
  // md gets a phone-only tall tap target (48px min-height) — Apple HIG
  // and Google Material both want ≥44; the hero CTAs at 40 felt
  // squished against the headline.
  const tallClass = size === "md" ? "osto-btn-tall" : "";
  return (
    <Link
      href={href}
      data-osto-brand-btn
      className={`inline-flex items-center justify-center text-white ${tallClass}`}
      style={{
        ...s.type,
        background: BUTTON_BRAND_BG,
        boxShadow: E.buttonBrand,
        borderRadius: R.md,
        paddingInline: s.padX,
        paddingBlock: s.padY,
        gap: s.gap,
      }}
    >
      {children}
    </Link>
  );
}

function GhostButton({
  href,
  children,
  withCaret = false,
  size = "sm",
}: {
  href: string;
  children: React.ReactNode;
  withCaret?: boolean;
  size?: ButtonSize;
}) {
  const s = BTN_SIZE[size];
  const caret = size === "md" ? 14 : 12;
  const tallClass = size === "md" ? "osto-btn-tall" : "";
  return (
    <Link
      href={href}
      data-osto-ghost-btn
      className={`inline-flex items-center justify-center ${tallClass}`}
      style={{
        ...s.type,
        background: T.surface,
        color: T.ink,
        boxShadow: E.buttonGhost,
        borderRadius: R.md,
        paddingInline: s.padX,
        paddingBlock: s.padY,
        gap: s.gap,
      }}
    >
      {children}
      {withCaret && (
        <svg
          width={caret}
          height={caret}
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          data-osto-caret
          style={{ color: T.inkSubtle }}
        >
          <path
            d="M3.5 2 8 6l-4.5 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Link>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative px-5 sm:px-6"
      style={{ paddingTop: "clamp(140px, 18vw, 200px)" }}
    >
      {/* Hero is intentionally quiet — page rails and the section's own
          dashed-grid frame provide all the structure. No ambient glow. */}

      <div className="relative mx-auto max-w-[960px] text-center">
        <h1
          className="osto-hero-rise text-balance"
          style={{
            fontFamily: T.fontDisplay,
            fontWeight: 500,
            color: T.ink,
            // Fluid display scale.
            //   • Phone (≤375): 38px — readable + still feels editorial
            //   • Wide phone / tablet: scales smoothly via 9vw
            //   • Desktop ceiling: 80px (Geist gets dense at larger sizes)
            fontSize: "clamp(38px, 9vw, 80px)",
            lineHeight: 1.04,
            letterSpacing: "-0.035em",
            marginInline: "auto",
            maxWidth: 920,
            animationDelay: "120ms",
          }}
        >
          The voice API for{" "}
          <span style={{ color: T.accent, whiteSpace: "nowrap" }}>real&#8209;time</span>{" "}
          agents.
        </h1>

        {/* H1 → lead — 28px of air. Lead is one focused sentence; the
            money/timeline pitch moved to the trust line below. Slightly
            larger than before (17–20px) for more presence under the H1. */}
        <p
          className="osto-hero-rise mx-auto text-pretty"
          style={{
            color: T.inkSoft,
            fontSize: "clamp(17px, 1.5vw, 20px)",
            lineHeight: 1.5,
            letterSpacing: "-0.012em",
            marginTop: 28,
            maxWidth: 580,
            animationDelay: "240ms",
          }}
        >
          Streaming speech, function calling, and telephony in one SDK.
          Your agent answers in 90&nbsp;ms and switches languages&nbsp;mid-call.
        </p>

        {/* Lead → CTAs: 40px. On phone the two buttons stack and run
            edge-to-edge inside the section padding so each one is a
            full-width tap target. Above sm they collapse back to an
            inline pair. */}
        <div
          className="osto-hero-rise flex flex-col items-stretch justify-center sm:flex-row sm:items-center"
          style={{ marginTop: 40, gap: S.sm, animationDelay: "360ms" }}
        >
          <BrandButton href="#" size="md">Try a live agent</BrandButton>
          <GhostButton href="#" size="md" withCaret>
            Get an API key
          </GhostButton>
        </div>

        {/* Trust line — small, quiet. Sits 20px under the CTAs so the
            buttons keep their breathing room. */}
        <p
          className="osto-hero-rise mx-auto text-[13px] leading-[20px]"
          style={{
            color: T.inkSubtle,
            letterSpacing: "-0.02em",
            marginTop: 20,
            animationDelay: "440ms",
          }}
        >
          10,000 free minutes. Pay-as-you-go after. No credit&nbsp;card.
        </p>

        {/* Hero waveform — the visual anchor. 32px on phone (tight so
            the strip lands above the first-viewport fold), 56px on
            tablet+ for desktop breathing room. */}
        <div
          className="osto-hero-rise mt-8 sm:mt-14"
          style={{ animationDelay: "520ms" }}
        >
          <HeroWaveform />
        </div>
      </div>
    </section>
  );
}

// ─── Hero waveform ────────────────────────────────────────────────────
// Horizontal stack of vertical bars whose heights follow a sinusoidal
// envelope so the strip reads as a speech waveform, not random noise.
// Each bar's height also breathes via a per-bar delayed animation, giving
// the strip a "live audio" feel without burning the CPU.
function HeroWaveform() {
  // 128 bars across the strip. Each bar's height is the product of a
  // Gaussian "loudness" envelope (so edges taper, middle is loud) and a
  // per-bar pseudo-random multiplier — so the strip reads as real,
  // unrepeating speech instead of a smooth symmetric lozenge.
  //
  // The RNG is seeded so the same heights ship from the server and the
  // client, which keeps React hydration happy. Math.random() would diverge.
  const N = 128;
  // mulberry32 — tiny, deterministic, good enough for visual jitter.
  const seed = 0x9e3779b9;
  let s = seed;
  const rand = () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let r = Math.imul(s ^ (s >>> 15), 1 | s);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  const bars = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    // Gaussian envelope centered at t = 0.5. Smaller sigma = narrower edges.
    const sigma = 0.22;
    const env = Math.exp(-Math.pow((t - 0.5) / sigma, 2));
    // Per-bar random multiplier in [0.45, 1.0] — wide enough to look like
    // real speech (some bars short, some tall) but not so wide that an
    // edge bar randomly outshouts the middle.
    const jitter = 0.45 + rand() * 0.55;
    const h = Math.max(0.04, Math.min(1, env * jitter));
    return h;
  });

  // SVG-based rendering. Switched away from a flex row of percentage-
  // height <span> bars because iOS Safari (and a few Android browsers)
  // resolve percentage heights on flex items with align-items:center to
  // 0 — the entire wave disappeared on phones. SVG's viewBox math is
  // bulletproof: every bar's y/height is computed in viewBox units that
  // the renderer scales deterministically.
  const VB_W = 1000;
  const VB_H = 200;
  const BAR_W = 4;
  const GAP = (VB_W - N * BAR_W) / (N - 1); // perfect edge-to-edge fill
  const startX = 0;
  return (
    <div
      aria-hidden
      className="relative mx-auto"
      style={{
        width: "clamp(320px, 96vw, 960px)",
        height: "clamp(140px, 24vw, 220px)",
      }}
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        className="resonate-wave-mask block"
        style={{ overflow: "visible" }}
      >
        {bars.map((h, i) => {
          const t = i / (N - 1);
          let bg: string;
          if (t < 0.30 || t > 0.78) bg = PALETTE.blueSoft;
          else if (t < 0.55) bg = PALETTE.blue;
          else bg = PALETTE.blueDeep;
          const barH = h * VB_H;
          const x = startX + i * (BAR_W + GAP);
          const y = (VB_H - barH) / 2;
          return (
            <rect
              key={i}
              className="resonate-bar"
              x={x}
              y={y}
              width={BAR_W}
              height={barH}
              fill={bg}
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                animationDelay: `${(i * 22) % 1400}ms`,
              }}
            />
          );
        })}
      </svg>
      {/* Time labels — anchor at the stage's outer edges, which now
          equal the wave's edges. Live indicator sits in the middle. */}
      <div
        className="absolute -bottom-5 left-0 right-0 flex items-center justify-between text-[11px] tabular-nums"
        style={{ color: T.inkSubtle, fontFamily: "var(--font-mono)" }}
      >
        <span>0:00</span>
        <span className="inline-flex items-center gap-x-1.5" style={{ color: T.accent }}>
          <span
            aria-hidden
            className="resonate-live-dot inline-block"
            style={{
              width: 6,
              height: 6,
              background: T.accent,
              boxShadow: `0 0 8px ${T.accent}66`,
            }}
          />
          streaming · 92 ms
        </span>
        <span>0:14</span>
      </div>
    </div>
  );
}

// ─── Logo strip ───────────────────────────────────────────────────────
// Each customer logo is a small SVG mark + wordmark, all rendered in the
// same muted ink ramp so the strip reads as one cohesive row. Marks vary
// in geometric primitive (chevron, dots, monogram, rounded-square, hex)
// so the strip doesn't look procedurally generated.

type LogoSpec = {
  name: string;
  font: string;
  weight: number;
  tracking: string;
  mark: (color: string) => React.ReactNode;
  /** vertical optical nudge for the wordmark to sit on the mark's baseline */
  nudge?: number;
};

const LOGO_MARKS: LogoSpec[] = [
  {
    // Vercel — equilateral triangle pointing up. The simplest mark on
    // the strip, drawn as a single filled path.
    name: "Vercel",
    font: "var(--font-sans)",
    weight: 600,
    tracking: "-0.3px",
    mark: (c) => (
      <svg width="20" height="18" viewBox="0 0 24 22" fill="none" aria-hidden>
        <path d="M12 2 L23 21 L1 21 Z" fill={c} />
      </svg>
    ),
  },
  {
    // Linear — three concentric inverted arcs reading as a curl/swoop.
    // Simplified from the brand mark to a clean stroke study.
    name: "Linear",
    font: "var(--font-sans)",
    weight: 500,
    tracking: "-0.3px",
    mark: (c) => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M2 12 A10 10 0 0 1 12 2"
          stroke={c}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M2 16.5 A14 14 0 0 1 16.5 2"
          stroke={c}
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M5.5 18 A12.5 12.5 0 0 1 18 5.5"
          stroke={c}
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    ),
  },
  {
    // Notion — the "N" rendered as two vertical bars + a connecting
    // diagonal. Wordmark uses a slab-ish weight to nod to the brand.
    name: "Notion",
    font: "var(--font-sans)",
    weight: 700,
    tracking: "-0.2px",
    mark: (c) => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="3" y="3" width="14" height="14" stroke={c} strokeWidth="1.5" fill="none" />
        <path
          d="M6.5 14 V6 L13.5 14 V6"
          stroke={c}
          strokeWidth="1.7"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill="none"
        />
      </svg>
    ),
  },
  {
    // Figma — four overlapping circles forming the quadrant mark.
    // Stacked vertically in the real logo; rendered here as a tight
    // 2-up cluster so it reads at small sizes.
    name: "Figma",
    font: "var(--font-sans)",
    weight: 600,
    tracking: "-0.2px",
    mark: (c) => (
      <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden>
        <circle cx="4"  cy="4"  r="3.2" fill={c} opacity="0.9" />
        <circle cx="10" cy="4"  r="3.2" fill={c} opacity="0.55" />
        <circle cx="4"  cy="10" r="3.2" fill={c} opacity="0.8" />
        <circle cx="10" cy="10" r="3.2" fill={c} />
        <circle cx="4"  cy="16" r="3.2" fill={c} opacity="0.45" />
      </svg>
    ),
  },
  {
    // Ramp — stacked horizontal bars suggesting a ramp/ascent. The
    // real Ramp mark uses three diagonals; this reads as the same
    // ascending family at glance.
    name: "Ramp",
    font: "var(--font-sans)",
    weight: 700,
    tracking: "-0.2px",
    mark: (c) => (
      <svg width="20" height="18" viewBox="0 0 22 20" fill="none" aria-hidden>
        <rect x="2"  y="14" width="18" height="3" fill={c} />
        <rect x="5"  y="9"  width="15" height="3" fill={c} opacity="0.75" />
        <rect x="8"  y="4"  width="12" height="3" fill={c} opacity="0.5" />
      </svg>
    ),
  },
];

function LogoStrip() {
  // Slightly muted ink so the strip reads as a quiet credibility row,
  // not as primary content. All marks + wordmarks share this color.
  const logoInk = T.inkMid;

  return (
    <section className="px-5 pt-24 sm:px-6 sm:pt-40 md:pt-48">
      <div className="mx-auto max-w-[980px]">
        <p
          className="text-center"
          style={{ ...Type.body, color: T.inkSubtle }}
        >
          Powering 2M+ conversations a day for teams like
        </p>
        <ul
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:mt-8 sm:gap-x-12"
          style={{
            // Inline styles previously set columnGap/rowGap; moved to
            // Tailwind so they can shrink on mobile.
          }}
        >
          {LOGO_MARKS.map((logo, i) => (
            <li
              key={logo.name}
              // Last logo (Ramp) hides on phone so the strip is a clean
              // 4-up row at 375px width instead of orphaning one logo
              // on a second line. Re-appears at sm+.
              className={`inline-flex items-center ${i === LOGO_MARKS.length - 1 ? "hidden sm:inline-flex" : ""}`}
              style={{ gap: S.xs, color: logoInk }}
              aria-label={logo.name}
            >
              {logo.mark(logoInk)}
              <span
                style={{
                  fontFamily: logo.font,
                  fontWeight: logo.weight,
                  fontSize: 16,
                  lineHeight: "20px",
                  letterSpacing: logo.tracking,
                  color: logoInk,
                  transform: logo.nudge
                    ? `translateY(${logo.nudge}px)`
                    : undefined,
                }}
              >
                {logo.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ─── How it works (split panel with dashed grid frame) ────────────────
// ─── HowItWorks — scroll-jacked, three-stage progressive build ────────
//
// The section is taller than the viewport (2.4× by default). While the
// outer wrapper is in view, an inner panel sticks to the viewport top
// and the right-side mock console progressively fills in across three
// "step" states derived from scroll progress.
//
// Behavior contract:
//  • Sticky lock engages only at md+ — below md and under
//    prefers-reduced-motion, the section collapses to a plain stacked
//    list (every step visible, no sticky, no scroll-jack).
//  • Native scroll velocity is never captured. We listen passively to
//    scroll events and derive a step index from the wrapper's bounding
//    rect, so trackpad/mouse/keyboard scrolling all feel normal.
//  • Total page scroll grows by ~1.4 viewports vs. the original section.
//    Worth the cost because the section is the product story.
const HIW_STEPS = [
  {
    n: 1,
    title: "Pick a voice",
    body: "Choose from 200+ voices across 32 languages, or clone yours from a 30-second sample.",
  },
  {
    n: 2,
    title: "Give it a persona",
    body: "Write the agent's instructions and connect the tools and knowledge it can reach.",
  },
  {
    n: 3,
    title: "Point a channel at it",
    body: "Attach a phone number, embed the web widget, or wire it into your app over the SDK.",
  },
] as const;

// The scroll-driven multiplier. 1.8 = the wrapper is 1.8× viewport tall,
// so the user spends about a third of a viewport per step before the
// section releases. The old 240 budget left the panel pinned with
// visible empty space above and below it for too long.
const HIW_SCROLL_VH = 180;

function HowItWorks() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(0); // 0, 1, or 2
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reducedMotion) {
      // In reduced-motion mode every step is rendered open at once, so
      // we hold `step` at the last index and skip the scroll listener.
      setStep(HIW_STEPS.length - 1);
      return;
    }
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight;
      // The sticky window is [start, end] in pixels of vertical scroll
      // relative to wrapper top. We consider the section "active" once
      // its top crosses the viewport top, and "released" when its
      // bottom passes the viewport top.
      // Progress = how far through the scrollable height we are, in [0, 1].
      const totalScrollable = rect.height - vh;
      const traveled = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const progress = totalScrollable > 0 ? traveled / totalScrollable : 0;
      // Map progress → step index. Thresholds bias slightly later so
      // each step's "moment" lands centered in its scroll segment.
      let next = 0;
      if (progress >= 0.66) next = 2;
      else if (progress >= 0.33) next = 1;
      else next = 0;
      setStep((prev) => (prev === next ? prev : next));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion]);

  // If reduced-motion is on, skip the scroll-jacked shell entirely and
  // render a plain stacked panel. Same code path as mobile.
  if (reducedMotion) {
    return (
      <section className="pt-4">
        <HowItWorksPanel step={HIW_STEPS.length - 1} reducedMotion />
      </section>
    );
  }

  return (
    <section className="pt-4">
      {/* Mobile shell — under md, no sticky, all steps visible. */}
      <div className="md:hidden">
        <HowItWorksPanel step={HIW_STEPS.length - 1} reducedMotion />
      </div>

      {/* md+ scroll-jacked shell. The outer wrapper is 2.4× viewport
          tall — that's the scroll budget. The inner is `position:
          sticky` so it pins to the viewport top until the wrapper
          scrolls past, then releases naturally. The wrapper sits as a
          plain block in the document flow so SectionSpacers above and
          below it act normally. */}
      <div
        ref={wrapperRef}
        className="relative hidden md:block"
        style={{ height: `${HIW_SCROLL_VH}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center">
          <HowItWorksPanel step={step} reducedMotion={false} />
        </div>
      </div>
    </section>
  );
}

// ─── HowItWorks visual panel ──────────────────────────────────────────
// Pure presentation. Takes the current `step` (0, 1, 2) and renders the
// rail-framed band, left copy + step list, right progressive console.
function HowItWorksPanel({
  step,
  reducedMotion,
}: {
  step: number;
  reducedMotion: boolean;
}) {
  return (
    <div
      className="osto-rail-frame relative w-full overflow-hidden"
      style={{
        background: T.panel,
        boxShadow: `inset 0 1px 0 0 ${RAIL_STROKE}, inset 0 -1px 0 0 ${RAIL_STROKE}`,
        // Margins are applied via .osto-hiw-frame so they can be zero
        // on phone (rails are hidden < md) and the rail-inset on md+.
      }}
    >
      <div className="relative grid gap-y-10 px-6 py-10 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-x-12 md:px-12 md:py-10">
        {/* ── Left: heading + step list (active step highlights) ── */}
        <div className="relative z-10">
          <h2
            className="text-balance text-[32px] leading-[38px] tracking-[-0.8px] md:text-[44px] md:leading-[48px] md:tracking-[-1.1px]"
            style={{
              fontFamily: T.fontDisplay,
              fontWeight: 500,
              color: T.ink,
            }}
          >
            Live agents in three&nbsp;steps.
          </h2>
          <p
            className="mt-4 max-w-[44ch] text-pretty text-[16px] leading-[24px]"
            style={{ color: T.inkSoft, letterSpacing: "-0.012em" }}
          >
            Watch an agent come together — voice first, then persona,
            then the channel that puts it on a real&nbsp;phone.
          </p>
          <ol className="mt-10 space-y-5">
            {HIW_STEPS.map((s, i) => {
              const isActive = reducedMotion ? true : step === i;
              const isDone = reducedMotion ? false : step > i;
              return (
                <HiwStep
                  key={s.n}
                  n={s.n}
                  title={s.title}
                  body={s.body}
                  state={isActive ? "active" : isDone ? "done" : "upcoming"}
                />
              );
            })}
          </ol>
        </div>

        {/* ── Right: progressive console ── */}
        <div className="relative">
          <DashedGrid />
          <ConsoleMock step={step} reducedMotion={reducedMotion} />
        </div>
      </div>
    </div>
  );
}

// ─── Single step row ──────────────────────────────────────────────────
function HiwStep({
  n,
  title,
  body,
  state,
}: {
  n: number;
  title: string;
  body: string;
  state: "active" | "done" | "upcoming";
}) {
  const isActive = state === "active";
  const isDone = state === "done";
  // Step badge color: active = brand, done = quieter brand, upcoming = gray
  const badgeBg = isActive
    ? T.accent
    : isDone
    ? T.accentText
    : "transparent";
  const badgeRing = isActive
    ? `0 0 0 1px ${T.accent}, 0 0 0 6px ${T.accent}1f`
    : isDone
    ? `0 0 0 1px ${T.accentText}`
    : `0 0 0 1px ${T.ring}`;
  const badgeInk = isActive || isDone ? "#ffffff" : T.inkMid;
  const titleColor = isActive ? T.ink : isDone ? T.ink : T.inkMid;
  const bodyColor = isActive ? T.inkSoft : isDone ? T.inkMid : T.inkSubtle;
  return (
    <li className="flex gap-x-4">
      <span
        className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center text-[12px] font-medium tabular-nums transition-[box-shadow,background-color] duration-300 ease-out"
        style={{
          background: badgeBg,
          fontFamily: T.fontMono,
          boxShadow: badgeRing,
          color: badgeInk,
        }}
      >
        {isDone ? (
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="m3.5 8 3 3 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          n
        )}
      </span>
      <div>
        <p
          className="text-[16px] font-medium leading-[24px] transition-colors duration-300"
          style={{
            color: titleColor,
            fontFamily: T.fontDisplay,
            letterSpacing: "-0.012em",
          }}
        >
          {title}
        </p>
        <p
          className="mt-1.5 max-w-[42ch] text-pretty text-[14px] leading-[22px] transition-colors duration-300"
          style={{ color: bodyColor, letterSpacing: "-0.012em" }}
        >
          {body}
        </p>
      </div>
    </li>
  );
}

// ─── Console mock — progressively fills in ────────────────────────────
// Step 0: header + channel toggle + voice + latency.
// Step 1: + persona/instructions field + tools chip row.
// Step 2: + phone number field + active buttons (Cancel / Deploy).
function ConsoleMock({
  step,
  reducedMotion,
}: {
  step: number;
  reducedMotion: boolean;
}) {
  // Each row uses a CSS grid-template-rows animation pattern: when
  // active, gridTemplateRows = "1fr" + opacity 1; when not, "0fr" + 0.
  // Reduced-motion: all rows are visible at once (step === last).
  const showStep1 = reducedMotion || step >= 1;
  const showStep2 = reducedMotion || step >= 2;
  return (
    <div
      className="relative z-10 ml-auto w-full max-w-[460px] p-5 md:p-6"
      style={{ background: T.surface, boxShadow: E.cardElevated }}
    >
      {/* Console header */}
      <div className="flex items-center justify-between">
        <p
          className="text-[13px] font-semibold tracking-[-0.13px]"
          style={{ color: T.ink }}
        >
          New agent
        </p>
        <span
          className="inline-flex items-center gap-x-1.5 text-[11px] font-medium"
          style={{
            color: T.inkSubtle,
            fontFamily: T.fontMono,
            letterSpacing: "0.04em",
          }}
        >
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5"
            style={{ background: T.accent }}
          />
          step {Math.min(step, 2) + 1}/3
        </span>
      </div>

      {/* ── Always-visible block: Channel + Voice + Latency ── */}
      <div className="mt-5">
        <p
          className="text-[12px]"
          style={{ color: T.inkSoft, letterSpacing: "-0.018px" }}
        >
          Channel
        </p>
        <div
          className="mt-2 grid grid-cols-2 gap-1 p-1"
          style={{ background: T.panel, boxShadow: E.ringOnly }}
        >
          <button
            className="py-2 text-[13px] font-medium tracking-[-0.13px]"
            style={{
              background: T.surface,
              color: T.ink,
              boxShadow: E.ringOnly,
            }}
          >
            Phone
          </button>
          <button
            className="py-2 text-[13px] font-medium tracking-[-0.13px]"
            style={{ color: T.inkSoft }}
          >
            Web
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-3">
          <Field label="Voice" value="Ava · warm EN" />
          <Field label="Latency" value="92 ms" status="ok" />
        </div>
      </div>

      {/* ── Step 1 reveal: Persona + Tools ── */}
      <ConsoleReveal open={showStep1}>
        <div className="mt-4">
          <Field label="Persona" value="Friendly, concise. Speaks the caller's name once." multiline />
        </div>
        <div className="mt-3">
          <p
            className="text-[12px] font-medium"
            style={{ color: T.inkSubtle }}
          >
            Tools
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {["lookup_order", "book_meeting", "transfer_human"].map((t) => (
              <span
                key={t}
                className="inline-flex items-center px-2 py-1 text-[11px] font-medium"
                style={{
                  background: T.panel,
                  color: T.ink,
                  fontFamily: T.fontMono,
                  letterSpacing: "0.02em",
                  boxShadow: E.ringOnly,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </ConsoleReveal>

      {/* ── Step 2 reveal: Number + buttons ── */}
      <ConsoleReveal open={showStep2}>
        <div className="mt-4">
          <Field label="Number" value="+1 (415) 555-0142" />
        </div>
        <div className="mt-5 flex justify-end gap-x-2">
          <GhostButton href="#">Cancel</GhostButton>
          <BrandButton href="#">Deploy agent</BrandButton>
        </div>
      </ConsoleReveal>
    </div>
  );
}

// Grid-template-rows trick: animates from 0fr → 1fr without measuring
// element height. Smooth on every modern browser.
function ConsoleReveal({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
      style={{
        gridTemplateRows: open ? "1fr" : "0fr",
        opacity: open ? 1 : 0,
      }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  status,
  multiline = false,
}: {
  label: string;
  value: string;
  status?: "ok";
  /** When true, the value box wraps onto multiple lines (used for the
   *  persona/instructions field in the HowItWorks console). */
  multiline?: boolean;
}) {
  return (
    <div>
      <p
        className="text-[12px] font-medium leading-[16px]"
        style={{ color: T.inkSubtle }}
      >
        {label}
      </p>
      <div
        className={
          multiline
            ? "mt-1 flex items-start gap-x-2 px-3 py-2 text-[13px] leading-[20px]"
            : "mt-1 flex items-center gap-x-2 px-3 py-2 text-[14px] leading-[20px]"
        }
        style={{
          background: T.surface,
          color: multiline ? T.inkSoft : T.ink,
          boxShadow: E.ringOnly,
        }}
      >
        {status === "ok" && (
          <span
            aria-hidden
            className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0"
            style={{ background: "#19a974" }}
          />
        )}
        <span className={multiline ? "" : "truncate"}>{value}</span>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="pt-4">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
        <SectionHeading>
          Building a voice agent the old way takes{" "}
          <span style={{ color: T.accent }}>months.</span>
        </SectionHeading>
        <p
          className="mt-4 max-w-[600px] text-pretty text-[15px] leading-[24px] md:mx-auto md:text-center"
          style={{ color: T.inkSoft, letterSpacing: "-0.15px" }}
        >
          You wire up a TTS vendor, an STT vendor, an LLM, and a telephony
          stack. Six SDKs and three round-trips later, your caller still
          knows they&apos;re talking to a&nbsp;machine.
        </p>
      </div>

      {/* Two panels split the rail-bounded area edge to edge.
          Stack vertically below md so the hero metrics don't crush. */}
      <div className="osto-rail-frame mt-12 grid grid-cols-1 md:[grid-template-columns:minmax(0,12fr)_minmax(0,14fr)]">
        <ComparisonPanel
          tone="neutral"
          label="DIY voice stack"
          title="Six SDKs duct-taped together"
          metric="1,400 ms"
          metricCaption="median time-to-first-byte"
          timeline="3–6 months"
          timelineCaption="to ship one production agent"
          tagsLabel="You stitch"
          tags={["TTS", "STT", "LLM", "VAD", "Telephony", "Eval"]}
        />
        <ComparisonPanel
          tone="brand"
          label="With Resonate"
          title="One SDK, one stream"
          metric="90 ms"
          metricCaption="time-to-first-byte, end-to-end"
          timeline="An afternoon"
          timelineCaption="from signup to first live call"
          tagsLabel="Built in"
          tags={["TTS", "STT", "LLM routing", "Turn-taking", "Twilio/SIP", "Evals"]}
        />
      </div>

      <div className="mx-auto max-w-[1240px] px-5 sm:px-6">
        <DeltaRow />
      </div>
    </section>
  );
}

function ComparisonPanel({
  tone,
  label,
  title,
  metric,
  metricCaption,
  timeline,
  timelineCaption,
  tagsLabel,
  tags,
}: {
  tone: "neutral" | "brand";
  label: string;
  title: string;
  metric: string;
  metricCaption: string;
  timeline: string;
  timelineCaption: string;
  tagsLabel: string;
  tags: string[];
}) {
  const isBrand = tone === "brand";

  const ink = isBrand ? "rgba(255,255,255,0.96)" : T.ink;
  const inkSoft = isBrand ? "rgba(255,255,255,0.66)" : T.inkSoft;
  const inkSubtle = isBrand ? "rgba(255,255,255,0.50)" : T.inkSubtle;
  const inkLine = isBrand ? "rgba(255,255,255,0.12)" : T.panelHairline;

  // Brand panel's seam highlight: top edge always (works in both stack
  // and side-by-side). Left edge only on md+ where the seam is vertical.
  return (
    <article
      className={
        isBrand
          ? "relative overflow-hidden px-6 py-8 md:px-12 md:py-14 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.10)] md:[box-shadow:inset_1px_0_0_rgba(255,255,255,0.10),inset_0_1px_0_rgba(255,255,255,0.10)]"
          : "relative px-6 py-8 md:px-12 md:py-14"
      }
      style={{
        background: isBrand ? BUTTON_BRAND_BG : T.panel,
        zIndex: isBrand ? 2 : 1,
      }}
    >
      {/* Brand panel: dashed-rail pattern across the full card, faded
          at the top so the label / title / metric stays the focal area
          and the pattern thickens as you move down behind the timeline
          and tags. Same drafting vocabulary as the FinalCTA rails. */}
      {isBrand && <BrandPanelRailPattern />}

      <div className="relative z-10">
        <p
          className="text-[13px] font-medium leading-[20px]"
          style={{ color: inkSubtle, letterSpacing: "-0.13px" }}
        >
          {label}
        </p>

        <h3
          className="mt-2 max-w-[26ch] text-[20px] font-medium leading-[26px] md:text-[22px] md:leading-[28px]"
          style={{
            fontFamily: T.fontDisplay,
            color: ink,
            letterSpacing: "-0.36px",
            textWrap: "balance",
          }}
        >
          {title}
        </h3>

        <div className="mt-10">
          <p
            className="font-medium tabular-nums"
            style={{
              fontFamily: T.fontDisplay,
              color: ink,
              letterSpacing: isBrand ? "-2.2px" : "-1.4px",
              fontSize: isBrand ? "clamp(48px, 6.4vw, 76px)" : "clamp(36px, 4.4vw, 52px)",
              lineHeight: "1",
            }}
          >
            {metric}
          </p>
          <p
            className="mt-3 text-[13px] leading-[20px]"
            style={{ color: inkSoft, letterSpacing: "-0.13px" }}
          >
            {metricCaption}
          </p>
        </div>

        <div
          className="mt-8 flex flex-wrap items-baseline gap-x-3 pt-4"
          style={{ borderTop: `1px solid ${inkLine}` }}
        >
          <span
            className="shrink-0 text-[18px] font-medium leading-[24px] md:text-[20px] md:leading-[26px]"
            style={{
              fontFamily: T.fontDisplay,
              color: ink,
              letterSpacing: "-0.4px",
            }}
          >
            {timeline}
          </span>
          <span
            className="text-[13px] leading-[20px]"
            style={{ color: inkSoft, letterSpacing: "-0.13px" }}
          >
            {timelineCaption}
          </span>
        </div>

        <p
          className="mt-7 text-[13px] leading-[20px]"
          style={{ color: inkSoft, letterSpacing: "-0.13px" }}
        >
          <span className="mr-1.5 font-medium" style={{ color: inkSubtle }}>
            {tagsLabel}
          </span>
          {tags.map((t, i) => (
            <span key={t}>
              <span style={{ color: ink, fontWeight: 500 }}>{t}</span>
              {i < tags.length - 1 && (
                <span style={{ color: inkSubtle }}>{", "}</span>
              )}
            </span>
          ))}
        </p>
      </div>
    </article>
  );
}

function DeltaRow() {
  const deltas: Array<{ from: string; to: string; label: string }> = [
    { from: "6 vendors", to: "1 API", label: "Stack" },
    { from: "1,400 ms", to: "90 ms", label: "Latency" },
    { from: "3–6 months", to: "An afternoon", label: "Time to ship" },
  ];
  return (
    <div
      className="mt-12 grid grid-cols-1 gap-px md:mt-16 md:grid-cols-3"
      style={{
        background: T.ring,
        borderTop: `1px solid ${T.ring}`,
        borderBottom: `1px solid ${T.ring}`,
      }}
    >
      {deltas.map((d) => (
        <div
          key={d.label}
          className="px-6 py-8 md:px-8 md:py-10"
          style={{ background: T.page }}
        >
          <p
            className="text-[13px] font-medium"
            style={{
              color: T.inkSubtle,
              letterSpacing: "-0.13px",
            }}
          >
            {d.label}
          </p>
          <div className="mt-5 flex items-baseline gap-x-3">
            <span
              className="text-[15px] leading-[20px]"
              style={{
                color: T.inkSubtle,
                textDecoration: "line-through",
                textDecorationThickness: "1px",
                letterSpacing: "-0.15px",
              }}
            >
              {d.from}
            </span>
            <svg
              width="14"
              height="10"
              viewBox="0 0 14 10"
              fill="none"
              aria-hidden
              style={{ flexShrink: 0, opacity: 0.5 }}
            >
              <path
                d="M1 5h11M9 1l4 4-4 4"
                stroke={T.inkSubtle}
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              className="text-[26px] font-medium leading-[30px] md:text-[30px] md:leading-[34px]"
              style={{
                fontFamily: T.fontDisplay,
                color: T.accent,
                letterSpacing: "-0.6px",
              }}
            >
              {d.to}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SketchPortrait — local customer headshot, optimized by next/image ──
// Photos live under /public/*.jpg. next/image resizes the source files
// (~1-8MB raw Unsplash downloads) down to ~5KB webp at 40×40 display.
// The 80px sizes hint generates a 2x retina asset for sharp DPI screens.
function SketchPortrait({
  src,
  alt,
  onBrand = false,
}: {
  src: string;
  alt: string;
  /** Light hairline ring instead of dark — used inside the brand-blue
   *  feature tile so the portrait reads against the dark surface. */
  onBrand?: boolean;
}) {
  // 48×48 on phone (better proportional balance with the 14px name +
  // 12px role pair next to it), 40×40 on tablet+ where the cards are
  // narrower and the smaller portrait reads as a discrete UI tile.
  return (
    <span
      className="relative block h-12 w-12 shrink-0 overflow-hidden sm:h-10 sm:w-10"
      style={{
        boxShadow: onBrand
          ? "0 0 0 1px rgba(255,255,255,0.24)"
          : "0 0 0 1px rgba(10,10,16,0.08)",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 48px, 40px"
        style={{ objectFit: "cover" }}
      />
    </span>
  );
}

// ─── Customer stories — masonry of quote cards + 2 feature cards ──────
// Mosaic inspired by Clerk's testimonial wall: a 3-column CSS-columns
// masonry on md+, single column on phone. Mostly plain quote cards
// (white surface, hairline ring, gray name/role under the quote, small
// square portrait). Two cards "break" the rhythm:
//   • A LOGO feature card — large customer wordmark over a long, lead
//     quote from that customer (visual anchor).
//   • A BRAND feature card — solid brand-blue tile with a quote in
//     white (chromatic punctuation against the otherwise muted grid).
// Every card type carries an `avatar` path pointing into /public/*.jpg.
// Next/image optimizes the photo down to ~5KB at 40×40 display.
type QuoteCard = {
  kind: "quote";
  quote: string;
  name: string;
  role: string;
  avatar: string;
};
type LogoFeatureCard = {
  kind: "logo";
  /** SVG mark renderer for the company wordmark */
  mark: React.ReactNode;
  company: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
};
type BrandFeatureCard = {
  kind: "brand";
  company: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
};
type StoryCard = QuoteCard | LogoFeatureCard | BrandFeatureCard;

const STORIES: StoryCard[] = [
  // Logo feature — anchors the top-left of the mosaic. Wordmark up top,
  // long quote underneath. Visually the heaviest card in the grid.
  {
    kind: "logo",
    company: "Vercel",
    mark: (
      <span
        className="inline-flex items-center gap-x-2"
        style={{ color: "#0a0a10" }}
      >
        <svg width="22" height="20" viewBox="0 0 24 22" fill="none" aria-hidden>
          <path d="M12 2 L23 21 L1 21 Z" fill="currentColor" />
        </svg>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: "-0.02em",
          }}
        >
          Vercel
        </span>
      </span>
    ),
    quote:
      "We swapped a 40-seat Tier-1 queue for Resonate agents on the first day of the pilot. The 90 ms latency did it. Callers stopped detecting the gap, and we now route 71% of tickets to the agent before a human even sees them.",
    name: "Maya Okafor",
    role: "VP Support",
    avatar: "/christina-wocintechchat-com-m-AHfRjkk8QcE-unsplash.jpg",
  },
  // Short quote — focused on streaming / interrupt behavior
  {
    kind: "quote",
    quote:
      "The agent yields the moment a caller speaks over it, then picks up exactly where it left off. That's the detail every other vendor faked.",
    name: "Ravi Sundar",
    role: "Staff Engineer, Plaid",
    avatar: "/rupinder-singh-UoTr28JYsMI-unsplash.jpg",
  },
  // Short quote — focused on voice cloning + multi-language
  {
    kind: "quote",
    quote:
      "We cloned our founder's voice from a 30-second clip and shipped it in five languages by the weekend. Customers in Mexico City didn't know they weren't speaking to him.",
    name: "Elena Marquez",
    role: "Head of Growth, Loft",
    avatar: "/rochelle-lee-nzZJKFTO8w8-unsplash.jpg",
  },
  // Medium quote — telephony + outbound sales
  {
    kind: "quote",
    quote:
      "We had 200K dormant leads and no call-center budget. Resonate's SIP integration plus the booked-meeting tool lifted our re-engagement rate by 38% in the first month.",
    name: "Daniel Park",
    role: "RevOps Lead, Numerade",
    avatar: "/dao-vi-t-hoang-8GhBqS5Xws0-unsplash.jpg",
  },
  // Medium quote — compliance / HIPAA
  {
    kind: "quote",
    quote:
      "HIPAA was the blocker that killed two previous vendors for us. Resonate signed the BAA in week one, plugged into our EHR, and ran appointment reminders before the legal team finished reading the contract.",
    name: "Priya Iyer",
    role: "VP Engineering, Curio Health",
    avatar: "/paul-hanaoka-hNQCPAz4ILU-unsplash.jpg",
  },
  // Brand feature — the punctuation card. The strongest "wow" line.
  {
    kind: "brand",
    company: "Linear",
    quote:
      "The first time the agent paused mid-sentence to listen, our CEO walked into the room and asked who we'd just hired. The 90 ms time-to-first-byte is the difference between an assistant and a&nbsp;coworker.",
    name: "Kanishka Garg",
    role: "Director of Product",
    avatar: "/alex-suprun-ZHvM3XIOHoE-unsplash.jpg",
  },
  // Short quote — voice library + handoff
  {
    kind: "quote",
    quote:
      "We picked a voice from the library on Tuesday, wired it to our knowledge base on Wednesday, and the agent was answering refund calls by Friday.",
    name: "Marcus Hale",
    role: "CTO, Heir",
    avatar: "/ed-pylypenko-7zcbtbI4E2o-unsplash.jpg",
  },
  // Short quote — analytics / evals
  {
    kind: "quote",
    quote:
      "Transcripts, sentiment, and drop-off heatmaps in the same dashboard meant we could finally tune what the agent said next. By month two it was outperforming our top-quartile reps.",
    name: "Sasha Levine",
    role: "Head of CX, Faire",
    avatar: "/zach-wear-5fkOfxsTd58-unsplash.jpg",
  },
];

function CustomerStories() {
  return (
    <section className="px-5 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading>
          Voice agents already running in{" "}
          <span style={{ color: T.accent }}>production.</span>
        </SectionHeading>

        {/* CSS columns masonry. `break-inside: avoid` on each card keeps
            them from splitting across columns. Single column on phone;
            two columns on sm; three columns on md+. */}
        <div
          className="mt-12 gap-5 sm:columns-2 sm:gap-6 md:columns-3"
          style={{ columnFill: "balance" }}
        >
          {STORIES.map((s, i) => (
            <div
              key={i}
              className="mb-5 sm:mb-6"
              style={{ breakInside: "avoid" }}
            >
              {s.kind === "logo" ? (
                <LogoFeatureTile s={s} />
              ) : s.kind === "brand" ? (
                <BrandFeatureTile s={s} />
              ) : (
                <QuoteTile s={s} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Plain quote tile ─────────────────────────────────────────────────
function QuoteTile({ s }: { s: QuoteCard }) {
  return (
    <article
      className="p-6 md:p-7"
      style={{ background: T.surface, boxShadow: E.card }}
    >
      <p
        className="text-pretty text-[15px] leading-[24px] md:text-[16px] md:leading-[26px]"
        style={{
          color: T.ink,
          letterSpacing: "-0.012em",
        }}
      >
        &ldquo;{s.quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center justify-between gap-x-3">
        <div>
          <p
            className="text-[13px] font-medium leading-[18px]"
            style={{ color: T.ink }}
          >
            {s.name}
          </p>
          <p
            className="mt-0.5 text-[12px] leading-[18px]"
            style={{ color: T.inkMid, letterSpacing: "-0.012em" }}
          >
            {s.role}
          </p>
        </div>
        <SketchPortrait src={s.avatar} alt={s.name} />
      </div>
    </article>
  );
}

// ─── Logo feature tile — wordmark on top, lead quote below ────────────
function LogoFeatureTile({ s }: { s: LogoFeatureCard }) {
  return (
    <article
      className="p-6 md:p-8"
      style={{ background: T.surface, boxShadow: E.card }}
    >
      <div className="flex items-center">{s.mark}</div>
      <p
        className="mt-6 text-pretty text-[17px] leading-[26px] md:mt-12 md:text-[20px] md:leading-[30px]"
        style={{
          color: T.ink,
          letterSpacing: "-0.014em",
          fontWeight: 500,
        }}
      >
        &ldquo;{s.quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center justify-between gap-x-3 md:mt-8">
        <div>
          <p
            className="text-[13px] font-medium leading-[18px]"
            style={{ color: T.ink }}
          >
            {s.name}
          </p>
          <p
            className="mt-0.5 text-[12px] leading-[18px]"
            style={{ color: T.inkMid, letterSpacing: "-0.012em" }}
          >
            {s.role} · {s.company}
          </p>
        </div>
        <SketchPortrait src={s.avatar} alt={s.name} />
      </div>
    </article>
  );
}

// ─── Brand feature tile — full brand-blue card, quote in white ────────
function BrandFeatureTile({ s }: { s: BrandFeatureCard }) {
  return (
    <article
      className="p-6 md:p-8"
      style={{
        background: T.accent,
        // Slight inner top highlight for the same "lit" feel the brand
        // button has — keeps the tile from looking like a flat sticker.
        boxShadow:
          `inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 2px rgba(10,10,16,0.06)`,
      }}
    >
      <p
        className="text-[14px] font-semibold"
        style={{
          color: "#ffffff",
          letterSpacing: "-0.012em",
          fontFamily: "var(--font-sans)",
        }}
      >
        {s.company}
      </p>
      <p
        className="mt-6 text-pretty text-[17px] leading-[26px] md:mt-16 md:text-[20px] md:leading-[30px]"
        style={{
          color: "#ffffff",
          letterSpacing: "-0.014em",
          fontWeight: 500,
        }}
        dangerouslySetInnerHTML={{ __html: `&ldquo;${s.quote}&rdquo;` }}
      />
      <div className="mt-6 flex items-center justify-between gap-x-3 md:mt-8">
        <div>
          <p
            className="text-[13px] font-medium leading-[18px]"
            style={{ color: "rgba(255,255,255,0.96)" }}
          >
            {s.name}
          </p>
          <p
            className="mt-0.5 text-[12px] leading-[18px]"
            style={{
              color: "rgba(255,255,255,0.72)",
              letterSpacing: "-0.012em",
            }}
          >
            {s.role}
          </p>
        </div>
        <SketchPortrait src={s.avatar} alt={s.name} onBrand />
      </div>
    </article>
  );
}

// ─── Pricing calculator — interactive, AG-pattern 3-column ────────────
type AudienceKey = "seed" | "seriesA" | "seriesBplus" | "custom";

const AUDIENCE_DEFAULTS: Record<
  AudienceKey,
  { label: string; users: number; reqs: number; modules: string[]; vapt: boolean }
> = {
  seed: {
    label: "Startup",
    users: 2,
    reqs: 50,
    modules: ["voice", "telephony"],
    vapt: false,
  },
  seriesA: {
    label: "Growth",
    users: 6,
    reqs: 200,
    modules: ["voice", "telephony", "cloning", "analytics"],
    vapt: true,
  },
  seriesBplus: {
    label: "Scale",
    users: 20,
    reqs: 800,
    modules: ["voice", "telephony", "cloning", "analytics", "compliance"],
    vapt: true,
  },
  custom: {
    label: "Enterprise",
    users: 12,
    reqs: 400,
    modules: ["voice", "telephony", "compliance"],
    vapt: false,
  },
};

const MODULE_BUNDLES: { key: string; label: string; price: number }[] = [
  { key: "voice", label: "Voice library (200+ voices, 32 languages)", price: 99 },
  { key: "cloning", label: "Instant voice cloning + studio", price: 149 },
  { key: "telephony", label: "Telephony (SIP, Twilio, numbers)", price: 129 },
  { key: "analytics", label: "Analytics, transcripts, eval suite", price: 99 },
  { key: "compliance", label: "Compliance (HIPAA, SOC 2, PCI redact)", price: 199 },
];

const PLATFORM_FEE = 99; // monthly base
const USER_PRICE = 19; // per seat / month
const REQ_PRICE_PER_100K = 89; // per 1K voice minutes/mo
const VAPT_PRICE = 499; // one-time agent build service

function PricingCalculator() {
  const [audience, setAudience] = useState<AudienceKey>("seriesA");
  const defaults = AUDIENCE_DEFAULTS[audience];

  const [users, setUsers] = useState(defaults.users);
  const [reqs, setReqs] = useState(defaults.reqs); // K req/mo
  const [modules, setModules] = useState<string[]>(defaults.modules);
  const [vapt, setVapt] = useState(defaults.vapt);

  // Reset inputs when audience tab changes
  useEffect(() => {
    setUsers(defaults.users);
    setReqs(defaults.reqs);
    setModules(defaults.modules);
    setVapt(defaults.vapt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audience]);

  const moduleCost = MODULE_BUNDLES.filter((m) =>
    modules.includes(m.key)
  ).reduce((s, m) => s + m.price, 0);
  const userCost = users * USER_PRICE;
  const reqCost = Math.ceil(reqs / 100) * REQ_PRICE_PER_100K;
  const monthly = PLATFORM_FEE + moduleCost + userCost + reqCost;
  const annual = monthly * 10; // 2 months free
  const total = annual + (vapt ? VAPT_PRICE : 0);

  const toggleModule = (key: string) => {
    setModules((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <section className="px-5 pt-4 sm:px-6" id="calculator">
      <div className="mx-auto max-w-[1180px]">
        <h2
          className="max-w-[680px] text-balance text-[28px] leading-[34px] tracking-[-0.7px] sm:text-[32px] sm:leading-[38px] sm:tracking-[-0.8px] md:mx-auto md:text-center md:text-[40px] md:leading-[44px] md:tracking-[-1px]"
          style={{
            fontFamily: T.fontDisplay,
            fontWeight: 500,
            color: T.ink,
          }}
        >
          Pay for the minutes your agents{" "}
          <span style={{ color: T.accent }}>speak.</span>
        </h2>
        <p
          className="mt-3 max-w-[480px] text-pretty text-[14px] leading-[24px] md:mx-auto md:text-center"
          style={{ color: T.inkSoft, letterSpacing: "-0.14px" }}
        >
          Drag the sliders, toggle the modules. The total updates as you go.
        </p>

        {/* Audience tabs — left-aligned on phone to flow with the
            heading, centered on md+ when the heading sits as a marquee. */}
        <div className="mt-8 flex justify-start sm:mt-10 md:justify-center">
          <div
            role="tablist"
            aria-label="Pricing audience"
            className="inline-flex max-w-full items-center gap-x-1 overflow-x-auto p-1"
            style={{ background: T.panel, boxShadow: E.ringOnly }}
          >
            {(Object.keys(AUDIENCE_DEFAULTS) as AudienceKey[]).map((k) => {
              const isActive = audience === k;
              return (
                <button
                  key={k}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setAudience(k)}
                  className="px-3.5 py-1.5 text-[13px] font-medium tracking-[-0.13px] transition-[background-color,color,box-shadow,scale] duration-200 ease-out active:scale-[0.96]"
                  style={{
                    background: isActive ? T.surface : "transparent",
                    color: isActive ? T.accent : T.inkSoft,
                    boxShadow: isActive ? E.buttonGhost : "none",
                  }}
                >
                  {AUDIENCE_DEFAULTS[k].label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Calculator body — full-bleed: lives outside the 1180px wrapper
          above so we can anchor its edges to the global rails using the
          same RAIL_INSET formula as PageRails. + 1px stops the card
          1px inside the rail line so the rail itself remains visible
          as a hairline boundary on each side. Top + bottom inset
          hairlines ground the three columns inside. */}
      <div
        className="osto-rail-frame mt-16 overflow-hidden"
        style={{
          background: T.surface,
          boxShadow: `inset 0 1px 0 0 ${RAIL_STROKE}, inset 0 -1px 0 0 ${RAIL_STROKE}`,
        }}
      >
          <div className="relative grid lg:grid-cols-[1fr_1.2fr_1fr]">
            {/* Column 1: line items */}
            <div
              className="flex flex-col gap-y-7 p-6 md:p-10"
              style={{
                backgroundImage: `repeating-linear-gradient(to bottom, ${DASH.stroke} 0 4px, transparent 4px 10px)`,
                backgroundSize: "1px 10px",
                backgroundRepeat: "repeat-y",
                backgroundPosition: "100% 0",
              }}
            >
              <CalcLineItem
                label="Platform fee"
                price={`$${PLATFORM_FEE}/mo`}
                caption="Studio, dashboard, transcripts, version history."
              />
              <CalcLineItem
                label="Per builder seat"
                price={`$${USER_PRICE}/seat/mo`}
                caption="Anyone shipping or editing a production agent."
              />
              <CalcLineItem
                label="Voice minutes"
                price={`$${REQ_PRICE_PER_100K}/1K min/mo`}
                caption="Round-trip TTS + STT + LLM, billed per second."
              />
              <CalcLineItem
                label="Agent build (one-time)"
                price={`$${VAPT_PRICE}`}
                caption="Our team builds, evals, and ships your first agent in 7 days."
              />
            </div>

            {/* Column 2: inputs — dotted product-mockup grid + dashed right divider */}
            <div
              className="relative flex flex-col gap-y-7 p-6 md:p-10"
              style={{
                background: T.panel,
                // Layered backgrounds: dotted grid (mockup cell) + flat
                // panel + dashed right divider stripe.
                backgroundImage: `radial-gradient(circle, rgba(38,38,43,0.10) 1px, transparent 1px), linear-gradient(${T.panel}, ${T.panel}), repeating-linear-gradient(to bottom, ${DASH.stroke} 0 4px, transparent 4px 10px)`,
                backgroundSize: "14px 14px, calc(100% - 1px) 100%, 1px 10px",
                backgroundRepeat: "repeat, no-repeat, repeat-y",
                backgroundPosition: "0 0, 0 0, 100% 0",
              }}
            >
              <CalcSlider
                label="Builder seats"
                value={users}
                min={1}
                max={100}
                step={1}
                onChange={setUsers}
                format={(v) => `${v} ${v === 1 ? "seat" : "seats"}`}
              />
              <CalcSlider
                label="Voice minutes per month"
                value={reqs}
                min={50}
                max={2000}
                step={50}
                onChange={setReqs}
                format={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(1)}M min/mo` : `${v}K min/mo`
                }
              />

              <div>
                <p
                  className="mb-3 text-[13px] font-medium"
                  style={{ color: T.ink, letterSpacing: "-0.13px" }}
                >
                  Add-on modules
                </p>
                <ul className="space-y-2">
                  {MODULE_BUNDLES.map((m) => {
                    const checked = modules.includes(m.key);
                    return (
                      <li key={m.key}>
                        <label
                          className="flex cursor-pointer items-center justify-between p-2.5 transition-colors hover:bg-black/[0.03]"
                          style={{
                            background: T.surface,
                            boxShadow: E.ringOnly,
                          }}
                        >
                          <span className="flex items-center gap-x-2.5">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleModule(m.key)}
                              className="sr-only"
                            />
                            <span
                              aria-hidden
                              className="flex h-4 w-4 items-center justify-center transition-[background-color,box-shadow] duration-200 ease-out"
                              style={{
                                background: checked ? T.accent : T.surface,
                                boxShadow: checked
                                  ? "none"
                                  : `inset 0 0 0 1.5px ${T.inkFaint}`,
                              }}
                            >
                              {checked && (
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    className="osto-check-draw"
                                    d="m3.5 8 3 3 6-6"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    pathLength={1}
                                  />
                                </svg>
                              )}
                            </span>
                            <span
                              className="text-[13px]"
                              style={{
                                color: T.ink,
                                letterSpacing: "-0.13px",
                              }}
                            >
                              {m.label}
                            </span>
                          </span>
                          <span
                            className="text-[12px] font-medium"
                            style={{ color: T.inkSoft }}
                          >
                            ${m.price}/mo
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <label
                className="flex cursor-pointer items-center justify-between p-3"
                style={{
                  background: T.surface,
                  boxShadow: E.ringOnly,
                }}
              >
                <span className="flex items-center gap-x-2.5">
                  <input
                    type="checkbox"
                    checked={vapt}
                    onChange={() => setVapt((v) => !v)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className="flex h-4 w-4 items-center justify-center  transition-[background-color,box-shadow] duration-200 ease-out"
                    style={{
                      background: vapt ? T.accent : T.surface,
                      boxShadow: vapt
                        ? "none"
                        : `inset 0 0 0 1.5px ${T.inkFaint}`,
                    }}
                  >
                    {vapt && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          className="osto-check-draw"
                          d="m3.5 8 3 3 6-6"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          pathLength={1}
                        />
                      </svg>
                    )}
                  </span>
                  <span>
                    <span
                      className="block text-[14px] leading-[20px]"
                      style={{
                        color: T.ink,
                        letterSpacing: "-0.14px",
                      }}
                    >
                      Add white-glove agent build
                    </span>
                    <span
                      className="block text-[12px] leading-[16px]"
                      style={{ color: T.inkSubtle }}
                    >
                      We build, eval, and tune your first agent in 7 days
                    </span>
                  </span>
                </span>
                <span
                  className="text-[14px] font-medium leading-[20px] tabular-nums"
                  style={{ color: T.inkSoft }}
                >
                  +${VAPT_PRICE}
                </span>
              </label>
            </div>

            {/* Column 3: live total */}
            <div className="flex flex-col gap-y-5 p-6 md:p-10">
              <p
                className="text-[14px] font-medium leading-[20px]"
                style={{ color: T.inkSubtle }}
              >
                Annual estimate
              </p>

              <SummaryRow
                label="Platform fee × 12"
                value={`$${(PLATFORM_FEE * 12).toLocaleString()}`}
              />
              <SummaryRow
                label={`${users} builder ${users === 1 ? "seat" : "seats"} × 12`}
                value={`$${(userCost * 12).toLocaleString()}`}
              />
              <SummaryRow
                label={`${reqs}K voice min/mo × 12`}
                value={`$${(reqCost * 12).toLocaleString()}`}
              />
              {modules.length > 0 && (
                <SummaryRow
                  label={`${modules.length} add-on ${modules.length === 1 ? "module" : "modules"} × 12`}
                  value={`$${(moduleCost * 12).toLocaleString()}`}
                />
              )}
              {vapt && (
                <SummaryRow
                  label="Agent build (one-time)"
                  value={`$${VAPT_PRICE.toLocaleString()}`}
                />
              )}

              <div
                className="my-2 h-px w-full"
                style={{ background: T.ring }}
                aria-hidden
              />

              <div className="flex items-baseline justify-between gap-x-4">
                <span
                  className="text-[13px]"
                  style={{ color: T.inkSoft, letterSpacing: "-0.13px" }}
                >
                  Total amount
                </span>
                <span
                  className="font-medium tabular-nums"
                  style={{
                    fontFamily: T.fontDisplay,
                    color: T.accent,
                    fontSize: "32px",
                    lineHeight: "36px",
                    letterSpacing: "-0.8px",
                  }}
                >
                  <AnimatedTotal value={total} />
                </span>
              </div>
              <p
                className="text-pretty text-[14px] leading-[20px]"
                style={{ color: T.inkSubtle }}
              >
                Annual billing · 2 months free vs monthly. Includes onboarding,
                a shared Slack channel, and 24/7 ops&nbsp;support.
              </p>

              <div className="mt-2 flex flex-col gap-y-2">
                <BrandButton href="#">Get started today</BrandButton>
                <GhostButton href="#" withCaret>
                  Talk to sales
                </GhostButton>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}

function CalcLineItem({
  label,
  price,
  caption,
}: {
  label: string;
  price: string;
  caption: string;
}) {
  return (
    <div>
      <p
        className="text-[14px] font-medium leading-[20px]"
        style={{ color: T.inkSoft }}
      >
        {label}
      </p>
      <p
        className="mt-1 text-[24px] font-medium leading-[28px]"
        style={{
          fontFamily: T.fontDisplay,
          color: T.ink,
          letterSpacing: "-0.6px",
        }}
      >
        {price}
      </p>
      <p
        className="mt-1.5 text-[14px] leading-[20px]"
        style={{ color: T.inkSubtle }}
      >
        {caption}
      </p>
    </div>
  );
}

function CalcSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  const inputId = useId();
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-[13px] font-medium"
          style={{ color: T.ink, letterSpacing: "-0.13px" }}
        >
          {label}
        </label>
        <span
          className="px-2 py-0.5 text-[12px] font-medium tabular-nums"
          style={{
            background: T.surface,
            boxShadow: E.ringOnly,
            color: T.ink,
          }}
        >
          {format(value)}
        </span>
      </div>
      <div className="relative">
        <input
          id={inputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={format(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="osto-range w-full"
          style={{
            // CSS var for the filled portion
            ["--osto-pct" as string]: `${((value - min) / (max - min)) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-x-4">
      <span
        className="text-[14px] leading-[20px]"
        style={{ color: T.inkSoft }}
      >
        {label}
      </span>
      <span
        className="text-[14px] font-medium leading-[20px] tabular-nums"
        style={{ color: T.ink }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Pricing — Platform + Custom ──────────────────────────────────────
const PLATFORM_FEATURES = [
  "10,000 voice minutes / month included",
  "200+ pre-built voices, 32 languages",
  "Twilio, SIP, WebRTC, iOS & Android SDKs",
  "Real-time transcripts, eval suite, sentiment",
  "Up to 10 builder seats",
];

const CUSTOM_FEATURES = [
  "Unlimited minutes & seats",
  "Dedicated voice model fine-tunes",
  "HIPAA BAA, SOC 2 Type II, EU residency",
  "99.99% SLA + named on-call engineer",
  "On-prem and self-hosted deployments",
];

function Pricing() {
  return (
    <section className="px-5 pt-4 sm:px-6" id="pricing">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading>
          Pricing scales with the{" "}
          <span style={{ color: T.accent }}>minute</span>.
        </SectionHeading>

        <div
          className="grid items-start md:grid-cols-2"
          style={{
            marginTop: S.xxl,
            columnGap: S.cardGap,
            rowGap: S.cardStackGap,
          }}
        >
          <PricingTier variant="elevated">
            <PriceLabel
              name="Studio"
              description="Teams shipping their first production voice agent."
            />
            <PriceAmount
              amount="$299"
              cadence="/month"
              footnote="$2,990 billed annually, 10,000 minutes free"
            />

            <div
              className="flex flex-col sm:flex-row sm:items-center"
              style={{ marginTop: S.lg, gap: S.xs }}
            >
              <BrandButton href="#">Start building</BrandButton>
              <GhostButton href="#" withCaret>
                Talk to sales
              </GhostButton>
            </div>

            <FeatureList items={PLATFORM_FEATURES} />
          </PricingTier>

          <PricingTier variant="flat">
            <PriceLabel
              name="Enterprise"
              description="High volume, regulated industries, custom voices."
            />
            <PriceAmount
              amount="Let's talk"
              footnote="Volume-based pricing tuned to your call mix."
            />

            <div style={{ marginTop: S.lg }}>
              <GhostButton href="#" withCaret>
                Request a quote
              </GhostButton>
            </div>

            <FeatureList items={CUSTOM_FEATURES} />
          </PricingTier>
        </div>
      </div>
    </section>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul
      style={{
        marginTop: S.xl,
        paddingTop: S.lg,
        borderTop: `1px solid ${T.ring}`,
        display: "flex",
        flexDirection: "column",
        gap: S.sm,
      }}
    >
      {items.map((f) => (
        <PricingFeature key={f}>{f}</PricingFeature>
      ))}
    </ul>
  );
}

function PricingFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start" style={{ gap: S.sm }}>
      <svg
        width={14}
        height={14}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        className="shrink-0"
        style={{ marginTop: S.xxs }}
      >
        <path
          d="m3.5 8 3 3 6-6"
          stroke={T.accent}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span style={{ ...Type.bodySm, color: T.ink }}>{children}</span>
    </li>
  );
}

// ─── Pricing primitives ───────────────────────────────────────────────

/**
 * PricingTier — card surface for one pricing plan. Two variants:
 * `elevated` (the upsell — white fill + layered drop shadow) and
 * `flat` (the alternative — no chrome, sits on the page).
 *
 * Padding scales up at md+ for the elevated variant so the upsell
 * card breathes on desktop without bloating mobile.
 */
function PricingTier({
  variant,
  children,
}: {
  variant: "elevated" | "flat";
  children: React.ReactNode;
}) {
  const isElevated = variant === "elevated";
  return (
    // Both variants share the same padding + structure so paragraphs,
    // prices, buttons, and feature lists line up across the two tiers.
    // The only thing the `flat` variant drops is the background fill
    // and the elevation shadow — it reads as a ghost twin of the
    // elevated card on the right side of the row.
    <article
      className="relative p-6 md:p-10"
      style={{
        background: isElevated ? T.surface : "transparent",
        boxShadow: isElevated ? E.cardElevated : E.cardFlat,
        borderRadius: isElevated ? R.lg : 0,
      }}
    >
      {children}
    </article>
  );
}

/**
 * PriceLabel — tier name + one-line description.
 */
function PriceLabel({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <div>
      <p style={{ ...Type.cardTitle, color: T.ink }}>{name}</p>
      <p style={{ ...Type.body, color: T.inkSoft, marginTop: S.xxs }}>
        {description}
      </p>
    </div>
  );
}

/**
 * PriceAmount — numeric or text price + optional cadence + optional
 * footnote (annual price, trial info, etc).
 */
function PriceAmount({
  amount,
  cadence,
  footnote,
}: {
  amount: string;
  cadence?: string;
  footnote?: string;
}) {
  return (
    <div style={{ marginTop: S.lg }}>
      <div className="flex items-baseline" style={{ gap: S.xs }}>
        <span
          style={{
            ...Type.priceLg,
            fontFamily: T.fontDisplay,
            color: T.ink,
          }}
        >
          {amount}
        </span>
        {cadence && (
          <span style={{ ...Type.priceCadence, color: T.inkSoft }}>
            {cadence}
          </span>
        )}
      </div>
      {footnote && (
        <p
          style={{
            ...Type.caption,
            color: T.inkSubtle,
            marginTop: S.xxs,
          }}
        >
          {footnote}
        </p>
      )}
    </div>
  );
}

// ─── Why trust Resonate — asymmetric stat trio ────────────────────────
// One hero stat (latency) gets the dominant card; the other two
// (languages, throughput) stack as smaller supporting cards. The
// reframe is honest: latency is the killer number every voice-AI
// buyer compares on, so it should visually outweigh the other two.
// The two smaller cards drop the long body copy in favour of tight
// captions, keeping vertical alignment clean.
function WhyTrust() {
  return (
    <section className="px-5 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading>
          Built by speech{" "}
          <span style={{ color: T.accent }}>researchers</span>, not prompt
          engineers.
        </SectionHeading>

        {/* Asymmetric 2-column layout on md+: hero card takes 1.6fr,
            supporting stack takes 1fr. Single column on phone with
            the hero on top and the two supporting cards stacked
            below it. */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-[1.6fr_1fr]">
          {/* ── Hero stat: latency ─────────────────────────────── */}
          <article
            className="flex flex-col justify-between p-8 md:p-10"
            style={{ background: T.surface, boxShadow: E.card }}
          >
            <div>
              {/* Hero number — 64-72px display so it actually reads as
                  the headline of the section, not just one of three. */}
              <p
                className="text-[64px] font-medium leading-[64px] md:text-[72px] md:leading-[72px]"
                style={{
                  fontFamily: T.fontDisplay,
                  color: T.accent,
                  letterSpacing: "-2px",
                }}
              >
                90 ms
              </p>
              <h3
                className="mt-5 text-balance text-[20px] font-medium leading-[28px]"
                style={{
                  color: T.ink,
                  fontFamily: T.fontDisplay,
                  letterSpacing: "-0.3px",
                }}
              >
                Time to first byte
              </h3>
              <p
                className="mt-3 max-w-[44ch] text-pretty text-[15px] leading-[24px]"
                style={{ color: T.inkSoft, letterSpacing: "-0.15px" }}
              >
                Our TTS, STT, and turn-taking run on the same GPU stack,
                so your caller hears the first syllable before a stitched
                vendor pipeline finishes routing.
              </p>
            </div>
            {/* p95 footnote — sits at the bottom of the hero card,
                signalling engineering rigor (every credible competitor
                publishes a median; disclosing the tail is the move).
                TODO: replace 180 ms with the real p95 from the last
                30 days of production traffic. Number should match
                the public status page. */}
            <p
              className="mt-8 text-[12.5px] leading-[18px]"
              style={{
                fontFamily: T.fontMono,
                color: T.inkSubtle,
                letterSpacing: "-0.05px",
              }}
            >
              p50 90 ms · p95 180 ms · measured across 30 days of US
              production traffic
            </p>
          </article>

          {/* ── Supporting stack: two smaller stats ─────────────── */}
          <div className="grid grid-cols-1 gap-6">
            <TrustPillarSmall
              big="32"
              heading="Languages, accent-native"
              caption="Hindi, Spanish, Arabic, and Mandarin spoken the way locals do, with code-switching mid-call."
            />
            <TrustPillarSmall
              big="2M+"
              heading="Conversations a day"
              caption="Production load under a 99.99% uptime SLA. We answer the phone when you call too."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Smaller stat card used as a supporting pillar next to the hero
// latency card. Body copy is shorter (1 sentence vs. the hero's
// paragraph) and the big number is smaller — the visual hierarchy
// puts latency first, these second.
function TrustPillarSmall({
  big,
  heading,
  caption,
}: {
  big: string;
  heading: string;
  caption: string;
}) {
  return (
    <article
      className="flex flex-col p-7 md:p-8"
      style={{ background: T.surface, boxShadow: E.card }}
    >
      <p
        className="text-[40px] font-medium leading-[44px]"
        style={{
          fontFamily: T.fontDisplay,
          color: T.accent,
          letterSpacing: "-1.2px",
        }}
      >
        {big}
      </p>
      <h3
        className="mt-3 text-balance text-[16px] font-medium leading-[22px]"
        style={{
          color: T.ink,
          fontFamily: T.fontDisplay,
          letterSpacing: "-0.2px",
        }}
      >
        {heading}
      </h3>
      <p
        className="mt-2 text-pretty text-[14px] leading-[22px]"
        style={{ color: T.inkSoft, letterSpacing: "-0.1px" }}
      >
        {caption}
      </p>
    </article>
  );
}

// ─── FAQ — collapsible questions ──────────────────────────────────────
const FAQS: { q: string; a: string }[] = [
  {
    q: "How does Resonate sound so realistic?",
    a: "We trained our own streaming TTS and STT on a single GPU stack so the agent doesn't wait on a TTS vendor, an STT vendor, and an LLM in sequence. That collapses 1,400 ms of round-trips into ~90 ms time-to-first-byte, which is where callers stop hearing a robot.",
  },
  {
    q: "Can I bring my own LLM or knowledge base?",
    a: "Yes. Resonate routes to OpenAI, Anthropic, Gemini, or any OpenAI-compatible endpoint, including your private fine-tunes. Knowledge base sources include Notion, Drive, Confluence, raw URLs, or your vector DB.",
  },
  {
    q: "Does Resonate work over a phone number?",
    a: "Out of the box. We provide telephony via SIP and Twilio, bring-your-own-carrier, and direct-dial numbers in 60+ countries. Web SDK, iOS, and Android cover everything else.",
  },
  {
    q: "How is Resonate different from ElevenLabs, Cartesia, or Vapi?",
    a: "ElevenLabs and Cartesia are great speech models. You still glue on STT, LLM, telephony, and evals. Vapi orchestrates third-party models with the latency penalty that brings. Resonate owns the full stack end-to-end, which is how we hold 90 ms TTFB under real production load.",
  },
  {
    q: "What about HIPAA, SOC 2, and PII?",
    a: "SOC 2 Type II and HIPAA BAA available on Enterprise. PII redaction runs on the transcript stream before it hits logs. EU data residency is one toggle. We do not train on customer audio.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-5 pt-4 sm:px-6">
      <div className="mx-auto max-w-[820px]">
        <SectionHeading>
          Frequently{" "}
          <span style={{ color: T.accent }}>asked.</span>
        </SectionHeading>

        <ul
          className="mt-10 overflow-hidden "
          style={{ background: T.surface, boxShadow: E.ringOnly }}
        >
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            const isLast = i === FAQS.length - 1;
            return (
              <li
                key={i}
                style={{
                  boxShadow: !isLast ? `inset 0 -0.5px 0 0 ${T.ring}` : "none",
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-x-4 px-5 py-4 text-left transition-colors hover:bg-black/[0.03] sm:px-6 sm:py-5"
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-[16px] font-medium leading-[24px]"
                    style={{
                      color: T.ink,
                      fontFamily: T.fontDisplay,
                      letterSpacing: "-0.24px",
                    }}
                  >
                    {f.q}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                    className="mt-1 shrink-0 transition-transform"
                    style={{
                      color: T.inkSubtle,
                      transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                    }}
                  >
                    <path
                      d="M8 3v10M3 8h10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div
                  className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p
                    className="overflow-hidden px-5 text-pretty text-[15px] leading-[24px] sm:px-6 sm:text-[16px]"
                    style={{
                      color: T.inkSoft,
                      letterSpacing: "-0.24px",
                      maxWidth: "640px",
                      paddingBottom: isOpen ? "24px" : "0px",
                      transition: "padding-bottom 300ms ease-out",
                    }}
                  >
                    {f.a}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ─── Final CTA — full-bleed dark band with cert chips ─────────────────
function FinalCTA() {
  return (
    // Full-bleed: card extends edge-to-edge to the global page rails on
    // all four sides. Left/right edges land at RAIL_INSET. On md+ the
    // top/bottom are pulled flush against the surrounding SectionSpacer
    // rails via negative vertical margins (cancels the spacer's 56px
    // outer gap). On phone the mobile SectionSpacer is a simple 80px
    // block with no outer margin, so we DON'T apply negative margins
    // there — doing so would clip the bottom of the CTA into the footer.
    <section className="relative">
      <div
        className="osto-rail-frame-inner relative overflow-hidden px-6 py-12 sm:px-8 sm:py-14 md:px-14 md:py-20 md:[margin-top:-56px] md:[margin-bottom:-56px]"
        style={{
          background: BUTTON_BRAND_BG,
        }}
      >
        {/* Decorative dashed-rail field — same drafting/blueprint
            vocabulary as the page-rails on light sections, transposed
            to brand blue. Fills the entire band; the radial fade
            above settles it down behind the headline + CTAs. */}
        <FinalCtaRailField />

        <div className="relative z-10 text-center">
          <h1
            className="mx-auto max-w-[720px] text-balance text-center text-white text-[32px] leading-[36px] tracking-[-0.9px] sm:text-[40px] sm:leading-[44px] sm:tracking-[-1px] md:text-[56px] md:leading-[56px] md:tracking-[-1.4px]"
            style={{
              fontFamily: T.fontDisplay,
              fontWeight: 500,
            }}
          >
            Your first live call is one afternoon away.
          </h1>
          <p
            className="mx-auto mt-5 max-w-[520px] text-pretty text-[15px] leading-[24px] sm:text-[16px] md:text-[18px] md:leading-[28px]"
            style={{
              color: "rgba(255,255,255,0.82)",
              letterSpacing: "-0.012em",
            }}
          >
            10,000 free minutes get you through prototyping. After that
            you pay only for the minutes your agent actually&nbsp;speaks.
          </p>
          {/* CTA pair — stacks on phone (full-width tap targets), goes
              inline on sm+. */}
          <div className="mt-8 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
            <GhostButton href="#" size="md">Try a live agent</GhostButton>
            <Link
              href="#"
              className="osto-btn-tall inline-flex items-center justify-center gap-x-1.5 px-4 py-[10px] text-[15px] font-medium leading-[20px] tracking-[-0.15px] text-white transition-colors hover:bg-white/10"
              style={{
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)",
              }}
            >
              Get an API key
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {["SOC 2 Type II", "HIPAA BAA", "GDPR", "PCI redaction"].map(
              (c) => (
                <li
                  key={c}
                  className="inline-flex items-center gap-x-1.5 text-[12px] font-medium"
                  style={{ color: "rgba(255,255,255,0.78)" }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="m3.5 8 3 3 6-6"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {c}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ─── Dot-matrix shared helpers ────────────────────────────────────────
// The two matrix fields (BrandPanelRailPattern, FinalCtaRailField)
// share their dot-generation logic. We previously animated each dot's
// opacity individually, which paints thousands of nodes every frame
// and lags on lower-end devices. The new shimmer animates a single
// wrapper per layer (composited on the GPU) and gets per-dot variety
// for free by splitting the dot population into two interleaved sets
// that crossfade against each other.

// Deterministic pseudo-random in [0,1) seeded by (i,j). No Math.random
// so SSR and client markup match on hydration.
function ostoMatrixRand(i: number, j: number) {
  const s = Math.sin((i + 1) * 12.9898 + (j + 1) * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

type OstoMatrixDot = { x: number; y: number; o: number };

// Build two interleaved subsets ("A" + "B") of dots over a COLS×ROWS
// grid with step STEP. ~45% of cells fire (down from 62%): the mask
// fades half the field anyway, so trimming density saves paint cost
// without changing the look. Each fired cell falls into set A or B
// based on another rand call — set membership is fixed, so the two
// SVGs render once and never re-render.
function ostoBuildMatrix(COLS: number, ROWS: number, STEP: number) {
  const setA: OstoMatrixDot[] = [];
  const setB: OstoMatrixDot[] = [];
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      if (ostoMatrixRand(i, j) > 0.55) {
        const o = 0.45 + ostoMatrixRand(i + 100, j + 100) * 0.45;
        const dot: OstoMatrixDot = { x: i * STEP, y: j * STEP, o };
        if (ostoMatrixRand(i + 200, j + 200) > 0.5) setA.push(dot);
        else setB.push(dot);
      }
    }
  }
  return { setA, setB };
}

function OstoMatrixSvg({
  dots,
  cols,
  rows,
  step,
}: {
  dots: OstoMatrixDot[];
  cols: number;
  rows: number;
  step: number;
}) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${cols * step} ${rows * step}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block" }}
    >
      {dots.map((d, idx) => (
        <circle
          key={idx}
          cx={d.x}
          cy={d.y}
          r={1.4}
          fill="#ffffff"
          opacity={d.o}
        />
      ))}
    </svg>
  );
}

// ─── BrandPanelRailPattern ────────────────────────────────────────────
// Dot-matrix field that covers the entire "With Resonate" brand panel
// in the ProblemSection. Two interleaved SVG layers crossfade so the
// field shimmers without paint-animating thousands of nodes. A
// horizontal fade-mask keeps the marks faint on the left (behind the
// label / title / metric copy) and strong on the right edge.
function BrandPanelRailPattern() {
  const STEP = 12;
  const COLS = 60;
  const ROWS = 36;
  const { setA, setB } = ostoBuildMatrix(COLS, ROWS, STEP);

  // Horizontal fade-mask — pattern is barely there on the left (where
  // the label / title / metric text lives), ramps through the middle,
  // and is fully visible on the right edge.
  const fade =
    "linear-gradient(to right, transparent 0%, transparent 32%, rgba(0,0,0,0.55) 56%, #000 80%, #000 100%)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        WebkitMaskImage: fade,
        maskImage: fade,
      }}
    >
      <div className="osto-matrix-layer osto-matrix-layer-a absolute inset-0">
        <OstoMatrixSvg dots={setA} cols={COLS} rows={ROWS} step={STEP} />
      </div>
      <div className="osto-matrix-layer osto-matrix-layer-b absolute inset-0">
        <OstoMatrixSvg dots={setB} cols={COLS} rows={ROWS} step={STEP} />
      </div>
    </div>
  );
}

// ─── FinalCtaRailField ────────────────────────────────────────────────
// Decorative dot-matrix that fills the entire FinalCTA band. Same
// two-layer crossfade technique as BrandPanelRailPattern. A radial
// fade-mask hollows out the center so the headline + CTAs sit in a
// calm spotlight while the dots read stronger toward the edges.
function FinalCtaRailField() {
  const STEP = 12;
  // 80 cols × 12px = 960px viewBox width — wider than any realistic
  // FinalCTA band on a 1240px-rail layout. preserveAspectRatio: slice
  // crops cleanly if the band is narrower.
  const COLS = 80;
  const ROWS = 36;
  const { setA, setB } = ostoBuildMatrix(COLS, ROWS, STEP);

  // Radial fade-mask: transparent (hide) in the center, ramping out
  // to fully opaque black (show) toward the band edges. Same alpha-
  // mode geometry as the previous rail field — the headline + CTAs
  // sit in the cleared zone, dots gather around the perimeter.
  const centerFade =
    "radial-gradient(ellipse 75% 85% at 50% 50%, transparent 0%, transparent 25%, rgba(0,0,0,0.5) 55%, #000 85%)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
      style={{
        WebkitMaskImage: centerFade,
        maskImage: centerFade,
      }}
    >
      <div className="osto-matrix-layer osto-matrix-layer-a absolute inset-0">
        <OstoMatrixSvg dots={setA} cols={COLS} rows={ROWS} step={STEP} />
      </div>
      <div className="osto-matrix-layer osto-matrix-layer-b absolute inset-0">
        <OstoMatrixSvg dots={setB} cols={COLS} rows={ROWS} step={STEP} />
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────
function Footer() {
  return (
    // Edge-to-edge: footer panel extends to the page rails on left/right
    // and runs flush to the page bottom. Bottom padding is bumped so the
    // copyright row gets generous breathing room.
    <footer className="relative">
      <div
        className="osto-rail-frame-inner px-6 pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-12 md:px-12 md:pb-32 md:pt-14 md:[margin-top:-56px]"
        style={{
          background: T.panel,
        }}
      >
       <div className="mx-auto max-w-[1120px]">
        {/* Top: brand block + 4 link columns */}
        <div className="grid gap-y-10 md:grid-cols-[1.4fr_2.6fr] md:gap-x-16">
          <div>
            <ResonateLogo size={22} />
            <p
              className="mt-4 max-w-[40ch] text-pretty text-[16px] leading-[24px]"
              style={{ color: T.inkSoft, letterSpacing: "-0.24px" }}
            >
              The voice API for real-time, human-grade agents. Built by speech
              researchers, shipped by&nbsp;developers.
            </p>
            <ul className="mt-6 flex items-center gap-x-3">
              {[
                {
                  label: "Twitter",
                  href: "#",
                  icon: (
                    <path
                      d="M14.5 1.5h2.7l-5.9 6.7 6.9 9.1h-5.4l-4.2-5.6-4.9 5.6H1l6.3-7.2L.7 1.5h5.5l3.8 5.1 4.5-5.1Z"
                      fill="currentColor"
                    />
                  ),
                },
                {
                  label: "LinkedIn",
                  href: "#",
                  icon: (
                    <>
                      <path
                        d="M3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM2 6h3v11H2V6Zm5 0h2.9v1.5h.04c.4-.75 1.4-1.55 2.86-1.55 3.06 0 3.6 2 3.6 4.6V17h-3v-5.6c0-1.34-.02-3.06-1.86-3.06-1.86 0-2.14 1.45-2.14 2.96V17H7V6Z"
                        fill="currentColor"
                      />
                    </>
                  ),
                },
                {
                  label: "GitHub",
                  href: "#",
                  icon: (
                    <path
                      d="M9 1a8 8 0 0 0-2.53 15.59c.4.07.55-.18.55-.39v-1.36c-2.23.49-2.7-1.07-2.7-1.07-.36-.93-.89-1.18-.89-1.18-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.88.5-1.08-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.83-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82a7.7 7.7 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.83 1.28.83 2.15 0 3.07-1.86 3.74-3.65 3.94.29.25.54.74.54 1.49v2.21c0 .21.14.47.55.39A8 8 0 0 0 9 1Z"
                      fill="currentColor"
                    />
                  ),
                },
              ].map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    aria-label={s.label}
                    className="inline-flex h-10 w-10 items-center justify-center transition-colors hover:bg-black/[0.04]"
                    style={{
                      background: T.surface,
                      boxShadow: E.ringOnly,
                      color: T.inkSoft,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden>
                      {s.icon}
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-x-6">
            <FooterColumn
              heading="Product"
              items={[
                "Voice library",
                "Voice cloning",
                "Telephony & SDKs",
                "Function calling",
                "Evals & analytics",
              ]}
            />
            <FooterColumn
              heading="Use cases"
              items={[
                "Customer support",
                "Outbound sales",
                "Receptionist",
                "Healthcare",
                "Recruiting",
              ]}
            />
            <FooterColumn
              heading="Company"
              items={["About", "Pricing", "Customers", "Careers", "Blog"]}
            />
            <FooterColumn
              heading="Developers"
              items={["Docs", "API reference", "Changelog", "Status"]}
            />
          </div>
        </div>

        {/* Bottom strip: copyright · certs · legal */}
        <div
          className="mt-12 flex flex-col gap-y-4 border-t pt-6 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: T.ring }}
        >
          <p
            className="text-[12px]"
            style={{ color: T.inkSubtle, letterSpacing: "-0.018px" }}
          >
            © 2026 Resonate Voice, Inc. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <CertChip>SOC 2 Type II</CertChip>
            <CertChip>HIPAA BAA</CertChip>
            <span
              className="hidden h-3 w-px md:inline-block"
              style={{ background: T.ring }}
              aria-hidden
            />
            <Link
              href="#"
              className="text-[12px]"
              style={{ color: T.inkSoft, letterSpacing: "-0.018px" }}
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-[12px]"
              style={{ color: T.inkSoft, letterSpacing: "-0.018px" }}
            >
              Terms
            </Link>
          </ul>
        </div>
       </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  items,
}: {
  heading: string;
  items: string[];
}) {
  return (
    <div>
      <p
        className="mb-4 text-[14px] font-medium leading-[20px]"
        style={{ color: T.inkSubtle }}
      >
        {heading}
      </p>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it}>
            <Link
              href="#"
              className="text-[14px] leading-[20px] transition-colors hover:underline"
              style={{ color: T.ink }}
            >
              {it}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CertChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-x-1 px-2.5 py-0.5 text-[12px] font-medium leading-[20px]"
      style={{
        background: T.surface,
        boxShadow: E.ringOnly,
        color: T.inkSoft,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="m3.5 8 3 3 6-6"
          stroke={T.accent}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </span>
  );
}

// ─── ThreeDoors ───────────────────────────────────────────────────────
// Buyer-self-identification band. Three cards routing the three
// audiences this page is trying to capture: developers, CX/ops teams,
// and enterprise. Each card carries a small persona label, one
// headline, one real visual, and one CTA, no paragraph. The visual
// IS the explanation: the dev card shows an editor pane (prefiguring
// the CodeSnippet section below), the CX card shows a flow-builder
// canvas, and the enterprise card shows a stylised master-agreement
// contract with the four compliance line items. The job of this
// section is fast self-identification and routing, not narrative,
// so it stays light.
function ThreeDoors() {
  return (
    <section className="px-5 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <div
          className="grid grid-cols-1 gap-px md:grid-cols-3"
          style={{ background: T.ring }}
        >
          <DoorCard
            label="For developers"
            headline={
              <>
                Ship a voice agent
                <br />
                from your editor.
              </>
            }
            cta="Read the docs"
            visual={<DoorVisualCode />}
          />
          <DoorCard
            label="For CX and ops teams"
            headline={
              <>
                Design flows
                <br />
                without writing code.
              </>
            }
            cta="See a live demo"
            visual={<DoorVisualFlow />}
          />
          <DoorCard
            label="For enterprise"
            headline={
              <>
                Sign a contract
                <br />
                with one vendor.
              </>
            }
            cta="Contact sales"
            visual={<DoorVisualCompliance />}
          />
        </div>
      </div>
    </section>
  );
}

// Shared card shell so the three doors share padding, height balance,
// label + headline typography, and CTA placement. Each visual is
// constrained to a fixed-height region so the trio's CTAs always
// line up across the row.
function DoorCard({
  label,
  headline,
  cta,
  visual,
}: {
  label: string;
  // ReactNode so a card can force an explicit line break inside its
  // headline (e.g. "Sign a contract / with one vendor.") to keep the
  // three headlines visually balanced at two lines each.
  headline: React.ReactNode;
  cta: string;
  visual: React.ReactNode;
}) {
  return (
    <article
      className="flex flex-col p-7 md:p-8"
      style={{ background: T.surface }}
    >
      <h3
        className="text-[14px] font-medium leading-[22px]"
        style={{ color: T.inkMid, letterSpacing: "-0.1px" }}
      >
        {label}
      </h3>
      <p
        className="mt-3 text-balance text-[22px] font-medium leading-[30px]"
        style={{
          fontFamily: T.fontDisplay,
          color: T.ink,
          letterSpacing: "-0.4px",
        }}
      >
        {headline}
      </p>

      {/* Visual region — fixed height (not just min-h) so all three
          doors render their visuals into the exact same vertical box.
          Each visual is responsible for filling this region: the
          editor pane stretches vertically, the flow canvas already
          fills, and the contract document fills edge-to-edge. */}
      <div className="mt-6 h-[200px] md:h-[220px]">{visual}</div>

      <Link
        href="#"
        className="mt-auto inline-flex items-center gap-x-1.5 pt-6 text-[14px] font-medium leading-[22px]"
        style={{ color: T.accentText, letterSpacing: "-0.1px" }}
      >
        {cta}
        <DoorArrow />
      </Link>
    </article>
  );
}

// ─── Door visual shell ────────────────────────────────────────────────
// All three door visuals share one structure: a document/artifact
// tile sitting on the panel-coloured outer region with a top tab
// strip (accent dot + filename in mono), a hairline-divided body
// area, and a flex-column layout so content fills the height
// cleanly. The enterprise contract was the design baseline; the
// other two are rebuilt to match its vocabulary so the trio reads
// as one family.
function DoorArtifact({
  filename,
  children,
}: {
  filename: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="h-full"
      style={{
        background: T.panel,
        boxShadow: `inset 0 0 0 1px ${T.ring}`,
        padding: 12,
      }}
    >
      <div
        className="flex h-full flex-col"
        style={{
          background: T.surface,
          boxShadow: E.card,
        }}
      >
        {/* Top tab strip — accent corner mark + filename in mono.
            Shared across all three artifacts. */}
        <div
          className="flex shrink-0 items-center gap-x-2 px-3 py-2"
          style={{
            borderBottom: `1px solid ${T.ring}`,
            fontFamily: T.fontMono,
            fontSize: 10.5,
            color: T.inkMid,
            letterSpacing: "-0.05px",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              background: T.accent,
              display: "inline-block",
            }}
          />
          {filename}
        </div>
        {/* Body — flex-1 so content fills the rest of the height. */}
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

// Developer visual — editor pane inside the shared artifact shell.
// The `agent.ts` filename in the tab strip matches the larger
// CodeSnippet section further down the page.
function DoorVisualCode() {
  return (
    <DoorArtifact filename="agent.ts">
      <pre
        className="flex-1 overflow-hidden whitespace-pre px-4 py-3 text-[12.5px] leading-[20px]"
        style={{
          fontFamily: T.fontMono,
          color: T.inkStrong,
          letterSpacing: "-0.1px",
        }}
      >
        <span style={{ color: T.accentText, fontWeight: 600 }}>import</span>
        {` { Resonate } `}
        <span style={{ color: T.accentText, fontWeight: 600 }}>from</span>
        {` `}
        <span style={{ color: T.inkStrong }}>{`"resonate"`}</span>
        {`;\n\n`}
        <span style={{ color: T.accentText, fontWeight: 600 }}>const</span>
        {` agent = `}
        <span style={{ color: T.accentText, fontWeight: 600 }}>new</span>
        {` Resonate({\n  voice: `}
        <span style={{ color: T.inkStrong }}>{`"ada"`}</span>
        {`, `}
        <span style={{ color: T.inkSubtle }}>{`// 32 languages`}</span>
        {`\n});`}
      </pre>
    </DoorArtifact>
  );
}

// CX/ops visual — flow-builder canvas inside the shared artifact
// shell. Primary path is horizontal (Incoming → Verify intent →
// Hand off); one branch breaks upward to a refund tool call with a
// labelled "if refund" edge. Three node tiers: trigger pill
// (smallest, accent fill), decision node (largest, selected with
// accent ring), action boxes (medium). All coordinates on a 4px
// grid for clean alignment.
function DoorVisualFlow() {
  // viewBox 360×200. Primary path runs along y=120.
  const Y = 120;
  const TRIG = { x: 24, y: Y - 14, w: 64, h: 28 };
  const DEC = { x: 134, y: Y - 26, w: 92, h: 52 };
  const HAND = { x: 264, y: Y - 16, w: 80, h: 32 };
  const REF = { x: 254, y: 28, w: 80, h: 32 };
  const LBL = { w: 44, h: 16 };

  return (
    <DoorArtifact filename="flows/refund.flow">
      {/* Canvas body — dot-grid background so it reads as a workspace,
          then the SVG flow diagram on top. The artifact shell handles
          the surface, tab strip, and outer panel border. */}
      <div
        className="relative flex-1"
        style={{
          backgroundImage: `radial-gradient(circle, ${T.ring} 1px, transparent 1px)`,
          backgroundSize: "12px 12px",
          backgroundPosition: "6px 6px",
        }}
      >
        <svg
          viewBox="0 0 360 200"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          style={{ position: "absolute", inset: 0 }}
        >
        {/* ── Edges (drawn before nodes so endpoints sit under) ──── */}
        {/* Primary edge A: trigger → decision (clean horizontal) */}
        <line
          x1={TRIG.x + TRIG.w}
          y1={Y}
          x2={DEC.x}
          y2={Y}
          stroke={T.accent}
          strokeWidth={1.4}
        />
        {/* Primary edge C: decision → hand off (clean horizontal) */}
        <line
          x1={DEC.x + DEC.w}
          y1={Y}
          x2={HAND.x}
          y2={Y}
          stroke={T.accent}
          strokeWidth={1.4}
        />
        {/* Branch edge B: decision top → refund. Smooth cubic from
            the top edge of the decision node up to the bottom edge
            of the refund node, dashed to signal "conditional path". */}
        {(() => {
          const x1 = DEC.x + DEC.w / 2 + 16;
          const y1 = DEC.y;
          const x2 = REF.x + REF.w / 2;
          const y2 = REF.y + REF.h;
          return (
            <path
              d={`M${x1} ${y1} C ${x1} ${y1 - 30}, ${x2} ${y2 + 30}, ${x2} ${y2}`}
              stroke={T.accent}
              strokeWidth={1.4}
              fill="none"
              strokeDasharray="3 3"
            />
          );
        })()}

        {/* Edge label on branch B — "if refund" in mono inside a
            surface tile. Centred on the branch midpoint horizontally,
            offset right slightly so it doesn't collide with the
            decision node's selected ring. */}
        {(() => {
          const cx = (DEC.x + DEC.w / 2 + 16 + REF.x + REF.w / 2) / 2 + 8;
          const cy = (DEC.y + REF.y + REF.h) / 2;
          return (
            <g>
              <rect
                x={cx - LBL.w / 2}
                y={cy - LBL.h / 2}
                width={LBL.w}
                height={LBL.h}
                fill={T.surface}
                stroke={T.ring}
                strokeWidth={1}
              />
              <text
                x={cx}
                y={cy + 3.5}
                fontFamily="var(--font-mono)"
                fontSize="9"
                fill={T.inkMid}
                textAnchor="middle"
                letterSpacing="-0.05px"
              >
                if refund
              </text>
            </g>
          );
        })()}

        {/* ── Nodes ────────────────────────────────────────────────── */}
        {/* Trigger pill (accent fill, white text) */}
        <g>
          <rect
            x={TRIG.x}
            y={TRIG.y}
            width={TRIG.w}
            height={TRIG.h}
            fill={T.accent}
          />
          <text
            x={TRIG.x + TRIG.w / 2}
            y={TRIG.y + TRIG.h / 2 + 4}
            fontFamily="var(--font-sans)"
            fontSize="11"
            fontWeight={500}
            fill="#ffffff"
            textAnchor="middle"
            letterSpacing="-0.1px"
          >
            Incoming
          </text>
        </g>

        {/* Decision node (selected, accent ring, step index + label) */}
        <g>
          <rect
            x={DEC.x}
            y={DEC.y}
            width={DEC.w}
            height={DEC.h}
            fill={T.surface}
            stroke={T.accent}
            strokeWidth={2}
          />
          <text
            x={DEC.x + 8}
            y={DEC.y + 14}
            fontFamily="var(--font-mono)"
            fontSize="9"
            fill={T.inkSubtle}
            letterSpacing="-0.05px"
          >
            02
          </text>
          <text
            x={DEC.x + DEC.w / 2}
            y={DEC.y + DEC.h / 2 + 8}
            fontFamily="var(--font-sans)"
            fontSize="12"
            fontWeight={500}
            fill={T.ink}
            textAnchor="middle"
            letterSpacing="-0.1px"
          >
            Verify intent
          </text>
        </g>

        {/* Hand off action box (right side of primary path) */}
        <g>
          <rect
            x={HAND.x}
            y={HAND.y}
            width={HAND.w}
            height={HAND.h}
            fill={T.surface}
            stroke={T.ring}
            strokeWidth={1}
          />
          <text
            x={HAND.x + HAND.w / 2}
            y={HAND.y + HAND.h / 2 + 4}
            fontFamily="var(--font-sans)"
            fontSize="11"
            fill={T.ink}
            textAnchor="middle"
            letterSpacing="-0.1px"
          >
            Hand off
          </text>
        </g>

        {/* Refund branch box (above decision, with a leading dot to
            mark it as a tool call, mirroring the dev card's syntax) */}
        <g>
          <rect
            x={REF.x}
            y={REF.y}
            width={REF.w}
            height={REF.h}
            fill={T.surface}
            stroke={T.ring}
            strokeWidth={1}
          />
          <circle
            cx={REF.x + 10}
            cy={REF.y + REF.h / 2}
            r={2.5}
            fill={T.accent}
          />
          <text
            x={REF.x + REF.w / 2 + 6}
            y={REF.y + REF.h / 2 + 4}
            fontFamily="var(--font-mono)"
            fontSize="10.5"
            fill={T.ink}
            textAnchor="middle"
            letterSpacing="-0.05px"
          >
            refund()
          </text>
        </g>
      </svg>
      </div>
    </DoorArtifact>
  );
}

// Enterprise visual — standalone contract artifact (no shared shell).
// The card headline says "Sign a contract with one vendor", so the
// visual is literally a stylised contract: a document tile with a
// tab header, a stack of four compliance lines, a signature line
// at the bottom, and a circular vendor seal in the corner. This is
// the user-preferred baseline — kept standalone so its surface +
// padding can stay exactly as approved.
function DoorVisualCompliance() {
  return (
    <div
      className="relative h-full p-4"
      style={{
        background: T.panel,
        boxShadow: `inset 0 0 0 1px ${T.ring}`,
      }}
    >
      <div
        className="relative flex h-full flex-col"
        style={{
          background: T.surface,
          boxShadow: E.card,
        }}
      >
        {/* Top tab strip — accent corner mark + filename in mono. */}
        <div
          className="flex shrink-0 items-center gap-x-2 px-3 py-2"
          style={{
            borderBottom: `1px solid ${T.ring}`,
            fontFamily: T.fontMono,
            fontSize: 10.5,
            color: T.inkMid,
            letterSpacing: "-0.05px",
          }}
        >
          <span
            aria-hidden
            style={{
              width: 6,
              height: 6,
              background: T.accent,
              display: "inline-block",
            }}
          />
          master-agreement.pdf
        </div>

        {/* Compliance clause stack. */}
        <div className="px-4 py-3">
          {[
            ["SOC 2 Type II", "covered"],
            ["HIPAA BAA", "signed"],
            ["GDPR + EU residency", "available"],
            ["PCI redaction", "default"],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-baseline gap-x-2 py-[3px]"
              style={{
                fontFamily: T.fontMono,
                fontSize: 10.5,
                color: T.inkStrong,
                letterSpacing: "-0.05px",
              }}
            >
              <span style={{ color: T.ink }}>{k}</span>
              <span
                aria-hidden
                className="flex-1 self-center"
                style={{
                  borderBottom: `1px dotted ${T.ring}`,
                  marginTop: -3,
                }}
              />
              <span style={{ color: T.accentText, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Signature line — pinned to the bottom-left of the document
            via mt-auto. The vendor seal sits absolutely positioned in
            the bottom-right corner of the document (sibling to the
            signature column) so the rotation can't push it into the
            outer panel's clip region. */}
        <div className="mt-auto px-4 pb-3 pt-3">
          <div className="flex flex-col gap-y-1">
            <span
              style={{
                width: 88,
                height: 1,
                background: T.ink,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: T.fontMono,
                fontSize: 9.5,
                color: T.inkSubtle,
                letterSpacing: "-0.05px",
              }}
            >
              signed
            </span>
          </div>
        </div>

        {/* Vendor seal — absolutely positioned in the document's
            bottom-right corner. Insets are sized so the rotated
            bounding box (a 58×58 square rotated 6° needs ~63×63)
            never touches the document edge: 8px inset on each side
            gives the rotation comfortable clearance. */}
        <div
          className="pointer-events-none absolute"
          style={{
            right: 12,
            bottom: 10,
            width: 58,
            height: 58,
            transform: "rotate(-6deg)",
          }}
          aria-hidden
        >
          <svg width="58" height="58" viewBox="0 0 60 60" fill="none">
            <defs>
              <path
                id="seal-arc-top"
                d="M 8 30 A 22 22 0 0 1 52 30"
                fill="none"
              />
              <path
                id="seal-arc-bot"
                d="M 11 32 A 19 19 0 0 0 49 32"
                fill="none"
              />
            </defs>
            <circle
              cx="30"
              cy="30"
              r="26"
              fill={T.surface}
              stroke={T.accent}
              strokeWidth={1.4}
            />
            <circle
              cx="30"
              cy="30"
              r="22"
              fill="none"
              stroke={T.accent}
              strokeWidth={0.8}
            />
            <text
              fontFamily="var(--font-sans)"
              fontSize="6.5"
              fontWeight={600}
              fill={T.accentText}
              letterSpacing="0.06em"
            >
              <textPath
                href="#seal-arc-top"
                startOffset="50%"
                textAnchor="middle"
              >
                Resonate · vendor
              </textPath>
            </text>
            <text
              fontFamily="var(--font-mono)"
              fontSize="5.5"
              fill={T.accentText}
              letterSpacing="0.08em"
            >
              <textPath
                href="#seal-arc-bot"
                startOffset="50%"
                textAnchor="middle"
              >
                signed · 2026
              </textPath>
            </text>
            <rect x="24" y="25" width="12" height="12" fill={T.accent} />
            <path
              d="M26.5 31 l2.5 2.5 l4.5 -5"
              stroke="#ffffff"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── CodeSnippet ──────────────────────────────────────────────────────
// Standalone code block that shows the SDK shape after the conceptual
// "How it works" scrollytelling. The whole point of this section is
// developer credibility in five seconds: import → construct → tool →
// place a call, in ~15 lines, no scrolling required. Renders inside
// the project's paper panel with a thin filename tab on top so it
// reads like an editor pane, not a marketing widget.
//
// IMPORTANT: the SDK surface below is a representative draft. Swap
// for the real `resonate` package shape when finalising. The shape
// chosen here (constructor options → tools array → .call()) is what
// developers expect after seeing Vapi, Retell, and LiveKit — it's the
// shortest credible path from "I read a marketing page" to "I can see
// myself shipping this on Monday".
function CodeSnippet() {
  // Each line is a tuple of (text, tone). Tone drives ink-weight:
  // "kw"  = keywords and SDK identifiers (strongest ink)
  // "str" = strings and numbers (mid ink)
  // "tx"  = regular text (default ink)
  // "cm"  = comments (faintest)
  type Tone = "kw" | "str" | "tx" | "cm";
  const line = (parts: Array<[string, Tone]>) => parts;

  // The snippet itself. Indentation is preserved with literal spaces
  // so the whole block stays inside one <pre> with no layout helpers.
  const snippet: Array<Array<[string, Tone]>> = [
    line([
      ["import", "kw"],
      [" { Resonate } ", "tx"],
      ["from", "kw"],
      [" ", "tx"],
      [`"resonate"`, "str"],
      [";", "tx"],
    ]),
    line([["", "tx"]]),
    line([
      ["const", "kw"],
      [" agent = ", "tx"],
      ["new", "kw"],
      [" Resonate({", "tx"],
    ]),
    line([
      ["  voice: ", "tx"],
      [`"ada"`, "str"],
      [",                 ", "tx"],
      ["// 32 languages, accent-native", "cm"],
    ]),
    line([
      ["  model: ", "tx"],
      [`"gpt-4o"`, "str"],
      [",             ", "tx"],
      ["// or anthropic, gemini, your fine-tune", "cm"],
    ]),
    line([
      ["  tools: [searchOrders, escalate],", "tx"],
    ]),
    line([["});", "tx"]]),
    line([["", "tx"]]),
    line([
      ["await", "kw"],
      [" agent.call({", "tx"],
    ]),
    line([
      ["  to: ", "tx"],
      [`"+14155550123"`, "str"],
      [",", "tx"],
    ]),
    line([
      ["  onTranscript: (t) => console.log(t.text),", "tx"],
    ]),
    line([["});", "tx"]]),
  ];

  const inkForTone = (t: Tone) => {
    switch (t) {
      case "kw":
        return T.accentText;
      case "str":
        return T.inkStrong;
      case "tx":
        return T.ink;
      case "cm":
        return T.inkSubtle;
    }
  };

  return (
    <section className="px-5 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading>
          Three minutes from{" "}
          <span style={{ color: T.accent }}>npm install</span> to a live call.
        </SectionHeading>
        <p
          className="mt-4 max-w-[620px] text-pretty text-[15px] leading-[24px] md:mx-auto md:text-center"
          style={{ color: T.inkSoft, letterSpacing: "-0.15px" }}
        >
          One SDK. Bring your own LLM, voice, and tools. Streaming
          telephony, transcripts, and evals are already&nbsp;wired.
        </p>

        {/* Editor pane. The filename tab sits flush above the body so
            the whole thing reads as one continuous artifact. */}
        <div className="mt-12 mx-auto max-w-[760px]">
          {/* Filename tab */}
          <div
            className="inline-flex items-center gap-x-2 px-4 py-2"
            style={{
              background: T.surface,
              boxShadow: `inset 0 0 0 1px ${T.ring}, inset 0 -1px 0 ${T.surface}`,
              fontFamily: T.fontMono,
              fontSize: 12.5,
              color: T.inkMid,
              letterSpacing: "-0.1px",
            }}
          >
            <span
              aria-hidden
              style={{
                width: 8,
                height: 8,
                background: T.accent,
                display: "inline-block",
              }}
            />
            agent.ts
          </div>

          {/* Body */}
          <pre
            className="overflow-x-auto p-6 text-[13.5px] leading-[22px]"
            style={{
              background: T.surface,
              boxShadow: E.card,
              fontFamily: T.fontMono,
              letterSpacing: "-0.1px",
              tabSize: 2,
            }}
          >
            {snippet.map((parts, lineIdx) => (
              <div key={lineIdx} style={{ minHeight: 22 }}>
                {parts.map(([text, tone], partIdx) => (
                  <span
                    key={partIdx}
                    style={{
                      color: inkForTone(tone),
                      fontWeight: tone === "kw" ? 600 : 400,
                    }}
                  >
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </pre>
        </div>

        <div className="mt-8 flex items-center justify-center gap-x-6">
          <Link
            href="#"
            className="inline-flex items-center gap-x-1.5 text-[14px] font-medium leading-[22px]"
            style={{ color: T.accentText, letterSpacing: "-0.1px" }}
          >
            Full API reference
            <DoorArrow />
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-x-1.5 text-[14px] font-medium leading-[22px]"
            style={{ color: T.inkMid, letterSpacing: "-0.1px" }}
          >
            Open in a sandbox
            <DoorArrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── OutcomeStrip ─────────────────────────────────────────────────────
// Business-outcome counterpart to WhyTrust. WhyTrust publishes the
// engineering numbers (TTFB, languages, throughput); this strip
// publishes the numbers a CX procurement team actually scans for:
// containment, cost cut, time-to-launch, CSAT delta. The two together
// answer "is the engineering serious" and "is the ROI real".
//
// IMPORTANT: every number below is a representative draft. Replace
// each one with the real figure aggregated from production customers
// (or pull from a single anchor case study you have permission to
// quote). Numbers without provenance kill credibility — keep this
// section accurate or pull it.
function OutcomeStrip() {
  type Metric = { value: string; label: string };
  const metrics: Metric[] = [
    {
      value: "78%",
      label: "of calls fully contained, no human handoff",
    },
    {
      value: "61%",
      label: "lower cost per resolved conversation",
    },
    {
      value: "1 day",
      label: "from kickoff to first live production call",
    },
    {
      value: "+22",
      label: "CSAT points versus the prior IVR baseline",
    },
  ];

  return (
    <section className="px-5 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading>
          What that looks like in the{" "}
          <span style={{ color: T.accent }}>quarterly&nbsp;review.</span>
        </SectionHeading>
        <p
          className="mt-4 max-w-[620px] text-pretty text-[15px] leading-[24px] md:mx-auto md:text-center"
          style={{ color: T.inkSoft, letterSpacing: "-0.15px" }}
        >
          Aggregated across support, sales, and healthcare deployments
          running on Resonate today. Methodology and per-customer
          numbers available on&nbsp;request.
        </p>

        {/* Grid-gap-as-hairline: the parent paints a ring-coloured
            background; each cell paints the page colour over it; the
            1px gap between cells becomes the hairline. Same hairline
            on both axes, both breakpoints, without per-cell border
            arithmetic. */}
        <div
          className="mt-12 grid grid-cols-2 gap-px md:grid-cols-4"
          style={{
            background: T.ring,
            borderTop: `1px solid ${T.ring}`,
            borderBottom: `1px solid ${T.ring}`,
          }}
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              className="px-6 py-8 md:px-8 md:py-10"
              style={{ background: T.page }}
            >
              <p
                className="text-[40px] font-medium leading-[44px] md:text-[48px] md:leading-[52px]"
                style={{
                  fontFamily: T.fontDisplay,
                  color: T.accent,
                  letterSpacing: "-1px",
                }}
              >
                {m.value}
              </p>
              <p
                className="mt-3 text-pretty text-[13.5px] leading-[20px]"
                style={{
                  color: T.inkSoft,
                  letterSpacing: "-0.1px",
                }}
              >
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Inline chevron arrow used on the ThreeDoors CTAs. Standalone so the
// markup of each card stays scan-able.
function DoorArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── StitchedVsResonate ───────────────────────────────────────────────
// Two-part comparison band. The top half is an architecture diagram
// (stitched pipeline vs. Resonate runtime) showing the latency story
// in concrete shapes. The bottom half is a radar chart plotting the
// remaining five dimensions (model freedom, languages, compliance,
// time to launch, on-call) plus latency, with Resonate's polygon
// overlaid on the stitched polygon so the area difference IS the
// argument. An overall-score badge in the corner gives a numeric
// anchor; the radar shape carries the visual one.
function StitchedVsResonate() {
  // Per-axis scores 0-100. These are honest characterisations: the
  // stitched pipeline lands ~25-40 on every dimension, Resonate lands
  // ~85-95. The shape contrast is the read; precise numbers matter
  // less than the polygon coverage.
  type RadarAxis = { label: string; old: number; res: number };
  const axes: RadarAxis[] = [
    { label: "Latency",        old: 25, res: 95 },
    { label: "Model freedom",  old: 30, res: 92 },
    { label: "Languages",      old: 35, res: 95 },
    { label: "Compliance",     old: 40, res: 90 },
    { label: "Time to launch", old: 25, res: 95 },
    { label: "On-call",        old: 30, res: 92 },
  ];

  return (
    <section className="px-5 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading>
          Stitching it together vs.{" "}
          <span style={{ color: T.accent }}>one&nbsp;stream.</span>
        </SectionHeading>
        <p
          className="mt-4 max-w-[640px] text-pretty text-[15px] leading-[24px] md:mx-auto md:text-center"
          style={{ color: T.inkSoft, letterSpacing: "-0.15px" }}
        >
          The same call drawn two ways. Latency on each hop is what the
          caller&nbsp;hears.
        </p>

        {/* Architecture diagram — full-width SVG showing the per-hop
            latency story. */}
        <div className="mt-12">
          <ArchitectureDiagram />
        </div>

        {/* Radar chart — six dimensions plotted as overlapping
            polygons. The contrast in covered area carries the
            non-latency comparison without needing a paragraph per
            dimension. */}
        <div className="mt-8">
          <ComparisonRadar axes={axes} />
        </div>
      </div>
    </section>
  );
}

// ComparisonRadar — six-axis radar plotting Stitched (dim hairline
// polygon) vs. Resonate (filled accent polygon). Two-column panel:
// chart fills the left ~60% on md+ with axis labels around the
// perimeter; the right column carries the headline score, the
// comparator number, and the legend. Single column on phone (chart
// on top, copy below). SVG is responsive via preserveAspectRatio.
function ComparisonRadar({
  axes,
}: {
  axes: { label: string; old: number; res: number }[];
}) {
  // ViewBox is wider than tall to give axis labels enough horizontal
  // room. The right-hemisphere labels ("Model freedom", "Languages")
  // anchor "start" at the polygon's right edge and run outward, and
  // the left-hemisphere labels ("Time to launch", "On-call") anchor
  // "end" and run inward. A 560-wide box with R=175 cropped the
  // 18px label text at "Model freedo[m]" — bumping W to 760 leaves
  // ~110px of horizontal breathing room on each side for label glyphs.
  const W = 760;
  const H = 480;
  const cx = W / 2;
  const cy = H / 2;
  const R = 175;
  const N = axes.length;

  const angleAt = (i: number) => (-Math.PI / 2) + (i / N) * 2 * Math.PI;
  const point = (i: number, score: number) => {
    const a = angleAt(i);
    const r = (score / 100) * R;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };
  const spokeEnd = (i: number) => point(i, 100);
  const toPoints = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");

  const stitchedPts = axes.map((a, i) => point(i, a.old));
  const resonatePts = axes.map((a, i) => point(i, a.res));
  const ringPolygon = (pct: number) =>
    toPoints(axes.map((_, i) => point(i, pct)));

  const avgRes = Math.round(
    axes.reduce((s, a) => s + a.res, 0) / axes.length,
  );
  const avgOld = Math.round(
    axes.reduce((s, a) => s + a.old, 0) / axes.length,
  );

  // Axis label positioning. Anchor flips at the left/right
  // hemispheres so labels don't overhang the chart polygon.
  const labelPos = (i: number) => {
    const a = angleAt(i);
    const r = R + 24;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    let anchor: "start" | "middle" | "end" = "middle";
    if (Math.cos(a) > 0.2) anchor = "start";
    else if (Math.cos(a) < -0.2) anchor = "end";
    return { x, y, anchor };
  };

  return (
    <div
      style={{
        background: T.surface,
        boxShadow: E.card,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] md:items-center">
        {/* ── Chart column ───────────────────────────────────────── */}
        <div className="px-6 pt-8 pb-2 md:px-8 md:pt-10 md:pb-10">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
            style={{ display: "block" }}
          >
            {/* Concentric guide rings at 33/66/100%. */}
            {[33, 66, 100].map((pct, i) => (
              <polygon
                key={pct}
                points={ringPolygon(pct)}
                fill="none"
                stroke={T.ring}
                strokeWidth={1}
                strokeDasharray={i === 2 ? "0" : "3 4"}
              />
            ))}

            {/* Spokes from centre to each axis vertex */}
            {axes.map((_, i) => {
              const end = spokeEnd(i);
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={end.x}
                  y2={end.y}
                  stroke={T.ring}
                  strokeWidth={1}
                />
              );
            })}

            {/* Stitched polygon — bumped opacity + stroke so it
                actually reads behind the Resonate polygon. The
                previous 0.18 / 1.4 was disappearing on light surface. */}
            <polygon
              points={toPoints(stitchedPts)}
              fill={T.inkLine}
              fillOpacity={0.35}
              stroke={T.inkSoft}
              strokeWidth={1.8}
            />
            {/* Stitched vertex dots — same size as Resonate dots so
                neither series reads as the "leftover". */}
            {stitchedPts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={T.inkSoft} />
            ))}

            {/* Resonate polygon — strong accent fill + stroke. */}
            <polygon
              points={toPoints(resonatePts)}
              fill={T.accent}
              fillOpacity={0.42}
              stroke={T.accent}
              strokeWidth={2}
            />
            {resonatePts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={T.accent} />
            ))}

            {/* Axis labels — sit outside the outer ring at each axis
                endpoint. Font size 18 in the viewBox so they render
                cleanly at desktop sizes (the chart column is ~600px
                wide on a 1180px section). */}
            {axes.map((a, i) => {
              const pos = labelPos(i);
              return (
                <text
                  key={a.label}
                  x={pos.x}
                  y={pos.y}
                  fontFamily="var(--font-sans)"
                  fontSize={18}
                  fontWeight={500}
                  fill={T.ink}
                  textAnchor={pos.anchor}
                  dominantBaseline="middle"
                  letterSpacing="-0.1px"
                >
                  {a.label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* ── Copy column — headline, score, legend ────────────────
            The hairline divider separating chart from copy is a top
            rule on phone (stacked layout) and a left rule on md+
            (side-by-side). Tailwind handles the breakpoint flip. */}
        <div
          className="flex flex-col gap-y-6 border-t px-6 pb-8 pt-8 md:gap-y-8 md:border-t-0 md:border-l md:px-10 md:pb-10 md:pt-10"
          style={{ borderColor: T.ring }}
        >
          <div>
            <span
              className="text-[12px] font-medium leading-[18px]"
              style={{
                fontFamily: T.fontMono,
                color: T.inkMid,
                letterSpacing: "-0.05px",
              }}
            >
              Coverage by dimension
            </span>
            <h3
              className="mt-3 text-balance text-[24px] font-medium leading-[30px] md:text-[26px] md:leading-[32px]"
              style={{
                fontFamily: T.fontDisplay,
                color: T.ink,
                letterSpacing: "-0.4px",
              }}
            >
              Resonate scores higher on every&nbsp;axis.
            </h3>
          </div>

          {/* Score block — big Resonate number stacked over the
              stitched comparator. The visual mass here mirrors what
              the polygons say at a glance. */}
          <div className="flex flex-col gap-y-3">
            <div className="flex items-baseline gap-x-3">
              <span
                className="text-[56px] font-medium leading-[56px] md:text-[64px] md:leading-[64px]"
                style={{
                  fontFamily: T.fontDisplay,
                  color: T.accent,
                  letterSpacing: "-1.6px",
                }}
              >
                {avgRes}%
              </span>
              <span
                className="text-[14px] leading-[20px]"
                style={{ color: T.inkSoft, letterSpacing: "-0.1px" }}
              >
                with Resonate
              </span>
            </div>
            <div className="flex items-baseline gap-x-2">
              <span
                className="text-[24px] font-medium leading-[28px]"
                style={{
                  fontFamily: T.fontDisplay,
                  color: T.inkSoft,
                  letterSpacing: "-0.6px",
                }}
              >
                {avgOld}%
              </span>
              <span
                className="text-[13px] leading-[18px]"
                style={{ color: T.inkSubtle, letterSpacing: "-0.05px" }}
              >
                stitched pipeline
              </span>
            </div>
          </div>

          {/* Legend — two swatches matching the polygon colours. */}
          <div className="flex flex-col gap-y-2 pt-2" style={{ borderTop: `1px solid ${T.ring}` }}>
            <div className="flex items-center gap-x-3 pt-3">
              <span
                aria-hidden
                style={{
                  width: 14,
                  height: 14,
                  background: T.accent,
                  display: "inline-block",
                }}
              />
              <span
                className="text-[13px] leading-[20px]"
                style={{ color: T.inkMid, letterSpacing: "-0.05px" }}
              >
                With Resonate
              </span>
            </div>
            <div className="flex items-center gap-x-3">
              <span
                aria-hidden
                style={{
                  width: 14,
                  height: 14,
                  background: T.inkLine,
                  display: "inline-block",
                }}
              />
              <span
                className="text-[13px] leading-[20px]"
                style={{ color: T.inkMid, letterSpacing: "-0.05px" }}
              >
                Stitched pipeline
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ArchitectureDiagram — the diagram for StitchedVsResonate. Renders
// two architecture sketches side-by-side: the stitched pipeline as a
// chain of five vendor boxes with per-hop latency badges, and
// Resonate as a single unified block with one 90ms TTFB badge. SVG
// at viewBox 1100×340 so both halves get plenty of room; the SVG
// scales to container width via preserveAspectRatio.
function ArchitectureDiagram() {
  // Vendor boxes for the stitched side. 5 hops; each box is 86×44.
  // Latency between hops is shown as a small accent-coloured pill
  // on the connector line. The total stacks to ~2.2s, which sits as
  // a strong badge at the right edge of the left half.
  const STITCHED = [
    { label: "Telephony" },
    { label: "STT vendor" },
    { label: "LLM API" },
    { label: "TTS vendor" },
    { label: "PII proxy" },
  ];
  const HOP_LATENCIES = ["420 ms", "380 ms", "640 ms", "490 ms"];

  // viewBox geometry. Bumped from 1100×340 to 1180×420 so both
  // halves have proper internal padding (was 12px on the left,
  // cropping the caller marker) and the headlines + totals get
  // breathing room above and below the chain.
  const W = 1180;
  const H = 420;
  // Left half occupies x ∈ [0, 560]; right half occupies x ∈ [620, W].
  // Internal padding inset is 40px on each side so the chain doesn't
  // kiss the panel edges.
  const PAD = 40;
  const LEFT_END = 560;
  const RIGHT_START = 620;
  const ROW_Y = 200; // Vertical centre of both pipelines (more headroom)
  const BOX_W = 84;
  const BOX_H = 48;

  // Heading baseline — sits 60px above the row centre, in the
  // panel's top padding zone.
  const HEAD_Y = 80;
  // Total-latency / TTFB badge baseline — sits 100px below the row
  // centre with enough room for a display-type number.
  const TOTAL_Y = ROW_Y + BOX_H + 64;
  // Caller dot positions — inset from the panel edges so labels
  // anchor cleanly. Left caller at PAD; right caller at RIGHT_START + PAD.
  const LEFT_CALLER_X = PAD;
  const RIGHT_CALLER_X = RIGHT_START + PAD;
  // Stitched boxes start AFTER the caller marker + a 24px gap.
  const STITCHED_START_X = LEFT_CALLER_X + 24;
  // 5 boxes × 84 = 420; available between STITCHED_START_X and
  // (LEFT_END - PAD) = 560 - 40 - (40+24) = 456px. 456 - 420 = 36
  // shared among 4 gaps = 9px each.
  const STITCHED_GAP = 9;
  const stitchedX = (i: number) =>
    STITCHED_START_X + i * (BOX_W + STITCHED_GAP);

  return (
    <div
      style={{
        background: T.surface,
        boxShadow: E.card,
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        style={{ display: "block" }}
      >
        {/* ── Headings for each half — promoted to 18px and given
            proper baseline above the row. They now sit in the panel's
            top padding zone with breathing room before the diagram
            starts. ─────────────────────────────────────────────── */}
        <text
          x={PAD}
          y={HEAD_Y}
          fontFamily="var(--font-sans)"
          fontSize={18}
          fontWeight={500}
          fill={T.inkMid}
          letterSpacing="-0.2px"
        >
          The stitched way
        </text>
        <text
          x={RIGHT_START + PAD}
          y={HEAD_Y}
          fontFamily="var(--font-sans)"
          fontSize={18}
          fontWeight={500}
          fill={T.accentText}
          letterSpacing="-0.2px"
        >
          With Resonate
        </text>

        {/* ── Vertical divider between halves ──────────────────── */}
        <line
          x1={(LEFT_END + RIGHT_START) / 2}
          y1={40}
          x2={(LEFT_END + RIGHT_START) / 2}
          y2={H - 40}
          stroke={T.ring}
          strokeWidth={1}
          strokeDasharray="2 4"
        />

        {/* ────────────────────────────────────────────────────────
            LEFT HALF — stitched pipeline
            ──────────────────────────────────────────────────────── */}

        {/* Inbound caller marker — inset from edge with label anchored
            "start" so it doesn't crop at the panel boundary. */}
        <g>
          <circle
            cx={LEFT_CALLER_X}
            cy={ROW_Y + BOX_H / 2}
            r={5}
            fill={T.inkSoft}
          />
          <text
            x={LEFT_CALLER_X}
            y={ROW_Y + BOX_H + 24}
            fontFamily="var(--font-mono)"
            fontSize={11}
            fill={T.inkSubtle}
            textAnchor="middle"
            letterSpacing="-0.05px"
          >
            caller
          </text>
        </g>

        {/* Vendor boxes + connectors */}
        {STITCHED.map((s, i) => {
          const x = stitchedX(i);
          const y = ROW_Y;
          return (
            <g key={s.label}>
              {/* Connector from previous box (or from caller marker
                  for i=0). */}
              {(() => {
                const fromX = i === 0 ? LEFT_CALLER_X + 6 : stitchedX(i - 1) + BOX_W;
                const fromY = y + BOX_H / 2;
                return (
                  <line
                    x1={fromX}
                    y1={fromY}
                    x2={x}
                    y2={fromY}
                    stroke={T.inkLine}
                    strokeWidth={1.2}
                  />
                );
              })()}
              {/* Box */}
              <rect
                x={x}
                y={y}
                width={BOX_W}
                height={BOX_H}
                fill={T.surface}
                stroke={T.inkLine}
                strokeWidth={1}
              />
              <text
                x={x + BOX_W / 2}
                y={y + BOX_H / 2 + 4}
                fontFamily="var(--font-sans)"
                fontSize={12}
                fontWeight={500}
                fill={T.ink}
                textAnchor="middle"
                letterSpacing="-0.1px"
              >
                {s.label}
              </text>
              {/* Latency badge ABOVE the connector to this box. */}
              {i > 0 && (
                <g>
                  {(() => {
                    const midX = (stitchedX(i - 1) + BOX_W + x) / 2;
                    const badgeY = y - 18;
                    return (
                      <>
                        <rect
                          x={midX - 24}
                          y={badgeY - 12}
                          width={48}
                          height={18}
                          fill={T.panel}
                          stroke={T.ring}
                          strokeWidth={1}
                        />
                        <text
                          x={midX}
                          y={badgeY + 1}
                          fontFamily="var(--font-mono)"
                          fontSize={10.5}
                          fill={T.inkMid}
                          textAnchor="middle"
                          letterSpacing="-0.05px"
                        >
                          {HOP_LATENCIES[i - 1]}
                        </text>
                      </>
                    );
                  })()}
                </g>
              )}
            </g>
          );
        })}

        {/* TOTAL LATENCY — promoted to a display-type readout.
            ~1.9s sits in the lower section of the left half in the
            same size/weight family as the 90ms TTFB badge on the
            right, but rendered as ink (not filled accent) because
            it's the unwanted outcome. "What the caller hears" sits
            below it as a one-line caption. */}
        <text
          x={PAD + 100}
          y={TOTAL_Y}
          fontFamily="var(--font-sans)"
          fontSize={32}
          fontWeight={500}
          fill={T.ink}
          letterSpacing="-0.8px"
        >
          ≈ 1.9s
        </text>
        <text
          x={PAD + 100 + 86}
          y={TOTAL_Y - 4}
          fontFamily="var(--font-sans)"
          fontSize={13}
          fill={T.inkSoft}
          letterSpacing="-0.1px"
        >
          before
        </text>
        <text
          x={PAD + 100 + 86}
          y={TOTAL_Y + 12}
          fontFamily="var(--font-sans)"
          fontSize={13}
          fill={T.inkSoft}
          letterSpacing="-0.1px"
        >
          first syllable
        </text>

        {/* ────────────────────────────────────────────────────────
            RIGHT HALF — Resonate as one unified block
            ──────────────────────────────────────────────────────── */}

        {/* Inbound caller marker on the right side */}
        <g>
          <circle
            cx={RIGHT_CALLER_X}
            cy={ROW_Y + BOX_H / 2}
            r={5}
            fill={T.accent}
          />
          <text
            x={RIGHT_CALLER_X}
            y={ROW_Y + BOX_H + 24}
            fontFamily="var(--font-mono)"
            fontSize={11}
            fill={T.inkSubtle}
            textAnchor="middle"
            letterSpacing="-0.05px"
          >
            caller
          </text>
        </g>

        {/* The unified Resonate block. Expanded to use more of the
            right half's horizontal space so it visually balances the
            5-box stitched chain on the left. */}
        {(() => {
          const blockX = RIGHT_CALLER_X + 24;
          // Right edge of the block ends before the 90ms TTFB badge,
          // which is 132px wide + 24px connector + PAD inset.
          const blockEndX = W - PAD - 132 - 24;
          const blockW = blockEndX - blockX;
          const compW = blockW / 4;
          const compartments = ["Telephony", "Voice", "Reasoning", "Tools"];
          return (
            <g>
              {/* Connector from caller dot into block left edge */}
              <line
                x1={RIGHT_CALLER_X + 6}
                y1={ROW_Y + BOX_H / 2}
                x2={blockX}
                y2={ROW_Y + BOX_H / 2}
                stroke={T.accent}
                strokeWidth={1.6}
              />
              {/* The block */}
              <rect
                x={blockX}
                y={ROW_Y}
                width={blockW}
                height={BOX_H}
                fill={T.surface}
                stroke={T.accent}
                strokeWidth={1.6}
              />
              {/* Internal compartment dividers */}
              {[1, 2, 3].map((i) => (
                <line
                  key={i}
                  x1={blockX + compW * i}
                  y1={ROW_Y + 8}
                  x2={blockX + compW * i}
                  y2={ROW_Y + BOX_H - 8}
                  stroke={T.accent}
                  strokeOpacity={0.4}
                  strokeWidth={1}
                  strokeDasharray="2 3"
                />
              ))}
              {/* Compartment labels */}
              {compartments.map((c, i) => (
                <text
                  key={c}
                  x={blockX + compW * i + compW / 2}
                  y={ROW_Y + BOX_H / 2 + 4}
                  fontFamily="var(--font-sans)"
                  fontSize={12}
                  fontWeight={500}
                  fill={T.ink}
                  textAnchor="middle"
                  letterSpacing="-0.1px"
                >
                  {c}
                </text>
              ))}
              {/* Block name label above the block — slightly larger
                  to match the heading scale flip we did. */}
              <text
                x={blockX + blockW / 2}
                y={ROW_Y - 18}
                fontFamily="var(--font-sans)"
                fontSize={12}
                fontWeight={500}
                fill={T.accentText}
                textAnchor="middle"
                letterSpacing="-0.05px"
              >
                One runtime, one SDK
              </text>
              {/* 90ms TTFB badge — kept at the same compact pill
                  shape but a touch larger to match the promoted left-
                  side total. The connector line from block to badge
                  stays clean. */}
              <line
                x1={blockEndX}
                y1={ROW_Y + BOX_H / 2}
                x2={blockEndX + 24}
                y2={ROW_Y + BOX_H / 2}
                stroke={T.accent}
                strokeWidth={1.6}
              />
              <rect
                x={blockEndX + 24}
                y={ROW_Y + BOX_H / 2 - 18}
                width={132}
                height={36}
                fill={T.accent}
              />
              <text
                x={blockEndX + 24 + 66}
                y={ROW_Y + BOX_H / 2 + 5}
                fontFamily="var(--font-sans)"
                fontSize={15}
                fontWeight={600}
                fill="#ffffff"
                textAnchor="middle"
                letterSpacing="-0.1px"
              >
                90 ms TTFB
              </text>
              {/* p95 subnote below the block, aligned with the same
                  baseline as the left-half "before first syllable"
                  caption so both halves' bottom lines align. */}
              <text
                x={blockX + blockW / 2}
                y={TOTAL_Y - 6}
                fontFamily="var(--font-mono)"
                fontSize={11}
                fill={T.inkSubtle}
                textAnchor="middle"
                letterSpacing="-0.05px"
              >
                p50 90 ms · p95 180 ms
              </text>
            </g>
          );
        })()}

        {/* Bottom-of-block contextual captions — one per half. They
            align at the same y, sized as readable body text. */}
        <text
          x={PAD}
          y={H - 30}
          fontFamily="var(--font-sans)"
          fontSize={13}
          fill={T.inkSoft}
          letterSpacing="-0.1px"
        >
          The caller hears silence before the first syllable.
        </text>
        <text
          x={RIGHT_START + PAD}
          y={H - 30}
          fontFamily="var(--font-sans)"
          fontSize={13}
          fill={T.inkSoft}
          letterSpacing="-0.1px"
        >
          The caller never hears the join.
        </text>
      </svg>
    </div>
  );
}


// ─── Integrations ─────────────────────────────────────────────────────
// Pipeline-style integrations panel. Four stages — Telephony, Voice
// stack, Language models, Apps & data — laid out left-to-right with
// thin connector rules and arrows between them, echoing how a call
// actually flows through the system. Each stage shows ~4-6 logos.
// Real brand SVG paths inline for the recognisable brands (Twilio,
// OpenAI, etc.); typographic wordmark fallback for the rest. All
// logos render at a single ink weight so the row reads as one
// family rather than a multi-colour logo zoo.
//
// Brand logo SVG paths below are from simple-icons (CC0 license).
// All rendered at currentColor at the project's ink token so the
// row stays paper-toned and visually consistent.
type BrandLogo = {
  name: string;
  // SVG path data for the brand mark, viewBox 24×24 (simple-icons
  // standard). If undefined, the BrandTile renders the wordmark
  // typographically instead.
  path?: string;
};

// Subset of simple-icons paths for the recognisable brands. These
// are the logos a voice-AI buyer expects to see when they scan an
// integrations panel.
const BRAND_LOGOS: Record<string, string> = {
  twilio:
    "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 21.6C6.7 21.6 2.4 17.3 2.4 12S6.7 2.4 12 2.4s9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6zm5.7-11.4a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-7.5 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-7.5 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
  openai:
    "M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.682zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z",
  anthropic:
    "M17.3043 3.625H13.7568L20.2 20.375H23.7475L17.3043 3.625ZM6.762 3.625L0.319336 20.375H3.94013L5.26033 16.9275H11.9913L13.3114 20.375H16.9322L10.4895 3.625H6.762ZM6.4087 13.9252L8.6258 8.1407L10.8429 13.9252H6.4087Z",
  salesforce:
    "M10.006 5.415a4.195 4.195 0 0 1 3.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22 0 2.879-2.31 5.219-5.16 5.219-.345 0-.69-.044-1.02-.104a3.75 3.75 0 0 1-3.27 1.95c-.6 0-1.155-.15-1.65-.404a4.302 4.302 0 0 1-3.989 2.624c-1.74 0-3.27-1.005-3.989-2.504a3.985 3.985 0 0 1-.81.074C1.8 17.939 0 16.17 0 13.984c0-1.47.81-2.744 1.995-3.434a4.6 4.6 0 0 1-.39-1.83c0-2.534 2.085-4.59 4.65-4.59 1.515 0 2.85.72 3.704 1.83",
  hubspot:
    "M18.164 7.93V5.084a2.198 2.198 0 0 0 1.267-1.978v-.067A2.2 2.2 0 0 0 17.238.845h-.067a2.2 2.2 0 0 0-2.193 2.194v.067a2.196 2.196 0 0 0 1.252 1.973l.013.005V7.93a6.243 6.243 0 0 0-2.969 1.31L13.27 9.23 5.487 3.168a2.5 2.5 0 1 0-1.155 1.495l-.014.008 7.66 5.965a6.232 6.232 0 0 0-1.05 3.456c0 1.36.436 2.62 1.176 3.65l-.011-.018-2.332 2.336a2.01 2.01 0 0 0-.585-.093H9.17a2.034 2.034 0 1 0 .046 4.067h.046a2.029 2.029 0 0 0 1.952-2.06v-.005a2.024 2.024 0 0 0-.094-.598l.004.014L13.46 18.9a6.27 6.27 0 0 0 11.041-4.81l.001.013a6.282 6.282 0 0 0-6.318-6.184l-.02-.001Zm-.36 9.396a3.22 3.22 0 1 1 .009-6.44 3.22 3.22 0 0 1-.009 6.44Z",
  zendesk:
    "M11.1808 7.0732v15.2754H0L11.1808 7.0732zM11.1808 1.6514a5.589 5.589 0 0 1-11.1798 0h11.1798zM12.8192 22.3486a5.589 5.589 0 0 1 11.1798 0H12.8192zM12.8192 16.9268V1.6514H24L12.8192 16.9268z",
  intercom:
    "M22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm-6.4 4c0-.44.36-.8.8-.8.44 0 .8.36.8.8v9.6c0 .44-.36.8-.8.8-.44 0-.8-.36-.8-.8V4zm-3.99-.4c0-.44.36-.8.8-.8.44 0 .8.36.8.8v10.4c0 .44-.36.8-.8.8-.44 0-.8-.36-.8-.8V3.6zm-4 .4c0-.44.36-.8.8-.8.44 0 .8.36.8.8v9.6c0 .44-.36.8-.8.8-.44 0-.8-.36-.8-.8V4zm-4 .8c0-.44.36-.8.8-.8.44 0 .8.36.8.8v8c0 .44-.36.8-.8.8-.44 0-.8-.36-.8-.8v-8zm17.06 13.86c-.16.13-3.94 3.34-8.67 3.34S3.49 18.79 3.34 18.66c-.34-.29-.38-.79-.09-1.13.29-.34.79-.38 1.12-.1.06.05 3.47 2.91 7.62 2.91 4.2 0 7.58-2.87 7.61-2.91.34-.29.84-.25 1.13.09.29.34.25.85-.09 1.13zM20.4 12.8c0 .44-.36.8-.8.8-.44 0-.8-.36-.8-.8V4.8c0-.44.36-.8.8-.8.44 0 .8.36.8.8v8z",
  notion:
    "M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933z",
};

// Auto-advance interval per tab, in ms. 3.5s reads as a comfortable
// "tour" pace — slow enough to read each panel, fast enough that
// all four cycle in 14s. Shared with the progress-bar animation.
const INTEGRATIONS_TAB_MS = 3500;

function Integrations() {
  type Stage = {
    name: string;
    sub: string;
    items: { name: string; key?: keyof typeof BRAND_LOGOS }[];
  };
  // Stages flow in call order: a call enters via Telephony, is
  // processed by the Voice stack, reasons via a Language model,
  // and acts on Apps & data.
  const stages: Stage[] = [
    {
      name: "Telephony",
      sub: "Carriers and SIP trunks. Bring your own number.",
      items: [
        { name: "Twilio", key: "twilio" },
        { name: "Plivo" },
        { name: "Telnyx" },
        { name: "SignalWire" },
      ],
    },
    {
      name: "Voice stack",
      sub: "Streaming TTS and STT. Use ours or swap any vendor.",
      items: [
        { name: "Resonate TTS" },
        { name: "Resonate STT" },
        { name: "ElevenLabs" },
        { name: "Cartesia" },
        { name: "Deepgram" },
      ],
    },
    {
      name: "Language models",
      sub: "Reasoning and tool-use. Per route, per language, per call.",
      items: [
        { name: "OpenAI", key: "openai" },
        { name: "Anthropic", key: "anthropic" },
        { name: "Gemini" },
        { name: "Llama" },
        { name: "Mistral" },
        { name: "Your fine-tune" },
      ],
    },
    {
      name: "Apps and data",
      sub: "Where calls land. CRMs, helpdesks, your warehouse.",
      items: [
        { name: "Salesforce", key: "salesforce" },
        { name: "HubSpot", key: "hubspot" },
        { name: "Zendesk", key: "zendesk" },
        { name: "Intercom", key: "intercom" },
        { name: "Notion", key: "notion" },
        { name: "Snowflake" },
      ],
    },
  ];

  // Auto-advancing tab state. `active` is the visible tab; `paused`
  // freezes the auto-advance (set on hover, click, or reduced-motion).
  // `tick` is a re-render trigger for the progress-bar fill — it
  // resets to 0 on every tab change and runs to 1 over INTEGRATIONS_TAB_MS.
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const tabStartRef = useRef<number>(0);

  // Honour prefers-reduced-motion — pause auto-advance entirely and
  // freeze the progress bar at zero so no looping animation runs.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) setPaused(true);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Auto-advance + progress-bar driver. Single rAF loop reads the
  // current time, computes how much of the tab window has elapsed,
  // and either updates the progress bar or rolls to the next tab.
  useEffect(() => {
    if (paused) return;
    tabStartRef.current = performance.now();
    setProgress(0);

    const tick = (now: number) => {
      const elapsed = now - tabStartRef.current;
      const pct = Math.min(elapsed / INTEGRATIONS_TAB_MS, 1);
      setProgress(pct);
      if (pct >= 1) {
        // Advance to next tab (wraps).
        setActive((i) => (i + 1) % stages.length);
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // `active` is intentionally in the dep array — when it changes
    // (either via auto-advance or manual click), we restart the
    // timer from zero for the new tab. `stages.length` is constant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, paused]);

  // Manual tab selection — pauses for ~6s before resuming auto-
  // advance, so a user click doesn't immediately get overridden by
  // the next auto-tick.
  const selectTab = (i: number) => {
    setActive(i);
    setPaused(true);
    window.setTimeout(() => setPaused(false), 6000);
  };

  return (
    <section className="px-5 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading>
          Plugs into the stack you{" "}
          <span style={{ color: T.accent }}>already&nbsp;have.</span>
        </SectionHeading>
        <p
          className="mt-4 max-w-[620px] text-pretty text-[15px] leading-[24px] md:mx-auto md:text-center"
          style={{ color: T.inkSoft, letterSpacing: "-0.15px" }}
        >
          A call flows through four stages. Pick your vendor at each
          one, and Resonate keeps the latency&nbsp;budget.
        </p>

        {/* Tabs panel. Desktop: left-column tabs + right-column logo
            matrix in a 2-column grid. Phone: tabs stack horizontally
            as a scroll row above the matrix. Hovering anywhere on the
            panel pauses auto-advance so a reader can scan without the
            content moving under their eye. */}
        <div
          className="mt-12 grid grid-cols-1 md:grid-cols-[280px_1fr]"
          style={{
            background: T.surface,
            boxShadow: E.card,
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* ── Tabs (left column on md+, horizontal row on phone) ──
              The tab strip is separated from the panel below/right by
              a hairline that flips axis at md+: bottom border on
              phone (panel sits below the tab row), right border on
              md+ (panel sits right of the tab column). */}
          <div
            className="flex flex-row overflow-x-auto border-b md:flex-col md:border-b-0 md:border-r"
            style={{ borderColor: T.ring }}
          >
            {stages.map((stage, i) => (
              <IntegrationTab
                key={stage.name}
                stage={stage}
                index={i}
                isActive={i === active}
                isLast={i === stages.length - 1}
                progress={i === active ? progress : 0}
                onSelect={() => selectTab(i)}
              />
            ))}
          </div>

          {/* ── Active tab's logo matrix ──────────────────────────── */}
          <div className="p-6 md:p-8">
            <IntegrationTabPanel
              stage={stages[active]}
              key={stages[active].name}
            />
          </div>
        </div>

        <p
          className="mt-8 text-center text-[13.5px] leading-[22px]"
          style={{ color: T.inkSubtle, letterSpacing: "-0.1px" }}
        >
          Need something not listed?{" "}
          <Link
            href="#"
            className="font-medium transition-colors"
            style={{ color: T.accentText }}
          >
            Ask us
          </Link>
          . Most integrations ship in a&nbsp;week.
        </p>
      </div>
    </section>
  );
}

// A single tab in the Integrations panel. Renders the stage name +
// sub-line, with an active state indicated by the brand-blue
// progress rail along the bottom edge (md+) / right edge (phone),
// filling left-to-right as the auto-advance timer runs. Inactive
// tabs show a thin hairline rail in the ring colour.
function IntegrationTab({
  stage,
  index,
  isActive,
  isLast,
  progress,
  onSelect,
}: {
  stage: {
    name: string;
    sub: string;
    items: { name: string; key?: keyof typeof BRAND_LOGOS }[];
  };
  index: number;
  isActive: boolean;
  isLast: boolean;
  progress: number;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      // Tabs share a hairline separator that flips axis at md+:
      // phone (horizontal row) → right border between tabs;
      // desktop (vertical stack) → bottom border between tabs.
      // Tailwind utilities pick the right axis per breakpoint; the
      // hairline colour is set via the data attribute below so the
      // inline style stays per-tab and clean.
      className={[
        "relative flex-shrink-0 cursor-pointer text-left transition-colors md:flex-shrink",
        isLast ? "" : "border-r md:border-r-0 md:border-b",
      ].join(" ")}
      style={{
        background: isActive ? T.surface : T.panel,
        borderColor: T.ring,
        padding: 0,
      }}
    >
      <div className="px-5 py-4 md:px-6 md:py-5" style={{ minWidth: 220 }}>
        <div className="flex items-center gap-x-3">
          <span
            className="text-[11px] font-medium leading-[18px]"
            style={{
              fontFamily: T.fontMono,
              color: isActive ? T.accentText : T.inkSubtle,
              letterSpacing: "-0.05px",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3
            className="text-[15px] font-medium leading-[22px]"
            style={{
              color: isActive ? T.ink : "#9a9aab",
              letterSpacing: "-0.1px",
            }}
          >
            {stage.name}
          </h3>
        </div>
        <p
          className="mt-1.5 text-[13px] leading-[20px]"
          style={{
            color: isActive ? T.inkSoft : "#a8a8b8",
            letterSpacing: "-0.05px",
          }}
        >
          {stage.sub}
        </p>
      </div>
      {/* Progress rail — fills the bottom of the active tab as the
          timer runs. Inactive tabs show a faint baseline rail so the
          structure reads as a rail throughout, not just on hover. */}
      <span
        aria-hidden
        className="absolute left-0 right-0 bottom-0"
        style={{
          height: 2,
          background: T.ring,
        }}
      />
      <span
        aria-hidden
        className="absolute left-0 bottom-0"
        style={{
          height: 2,
          width: isActive ? `${progress * 100}%` : 0,
          background: T.accent,
          transition: "width 80ms linear",
        }}
      />
    </button>
  );
}

// The right-side content panel — the logo matrix for the active
// stage. Uses BrandTile under the hood (same vocabulary as the
// pipeline version this replaced). Mounts with a short opacity
// fade-in so tab transitions feel intentional rather than a hard
// swap. The parent passes `key={stage.name}` so React remounts the
// panel on tab change, retriggering the fade.
function IntegrationTabPanel({
  stage,
}: {
  stage: {
    name: string;
    sub: string;
    items: { name: string; key?: keyof typeof BRAND_LOGOS }[];
  };
}) {
  return (
    <div className="osto-int-fade">
      <ul
        className="grid grid-cols-2 gap-px sm:grid-cols-3"
        style={{ background: T.ring }}
      >
        {stage.items.map((item) => (
          <li
            key={item.name}
            className="flex items-center gap-x-3 px-4 py-4"
            style={{ background: T.surface }}
          >
            <BrandTile name={item.name} pathKey={item.key} large />
          </li>
        ))}
      </ul>
    </div>
  );
}

// A single brand integration tile. If the name maps to a known
// brand path in BRAND_LOGOS, renders the SVG mark + wordmark; if
// not, renders just the wordmark (a typographic fallback). All
// glyphs render at currentColor / T.ink so the row reads as one
// monochrome family rather than a multi-colour logo zoo. The
// `large` flag bumps glyph + wordmark up a notch for the tabbed
// panel layout (which has more room than the original pipeline).
function BrandTile({
  name,
  pathKey,
  large,
}: {
  name: string;
  pathKey?: keyof typeof BRAND_LOGOS;
  large?: boolean;
}) {
  const path = pathKey ? BRAND_LOGOS[pathKey] : undefined;
  const glyphSize = large ? 22 : 16;
  const textSize = large ? 14 : 13;
  return (
    <div className="flex items-center gap-x-3 min-w-0">
      {path ? (
        <svg
          width={glyphSize}
          height={glyphSize}
          viewBox="0 0 24 24"
          aria-hidden
          style={{ color: T.ink, flexShrink: 0 }}
        >
          <path d={path} fill="currentColor" />
        </svg>
      ) : (
        <span
          aria-hidden
          style={{
            width: glyphSize,
            height: glyphSize,
            flexShrink: 0,
            background: T.panel,
            display: "inline-block",
            boxShadow: `inset 0 0 0 1px ${T.ring}`,
          }}
        />
      )}
      <span
        className="truncate font-medium leading-[20px]"
        style={{
          color: T.ink,
          letterSpacing: "-0.1px",
          fontSize: textSize,
        }}
      >
        {name}
      </span>
    </div>
  );
}


// ─── Shared primitives ────────────────────────────────────────────────
/**
 * SectionHeading — H2 used by every section that doesn't bring its own
 * H2 styling. Left-aligned on phone (matches the rest of the mobile
 * column where copy reads off the left rail), centered on md+ where
 * the section has room to breathe and the title sits as a marquee
 * above its content.
 */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-balance md:text-center md:px-10"
      style={{
        fontFamily: T.fontDisplay,
        fontWeight: 500,
        color: T.ink,
        fontSize: "clamp(32px, 4vw, 40px)",
        lineHeight: 1.1,
        letterSpacing: "-0.025em",
      }}
    >
      {children}
    </h2>
  );
}

/**
 * AnimatedTotal — tweens a money value from its previous render to the
 * next over ~420ms. Reads as a satisfying "calculator updating" delight
 * when the user toggles a module bundle or drags a slider. Respects
 * prefers-reduced-motion (snaps to the new value with no tween).
 */
function AnimatedTotal({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      fromRef.current = value;
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const from = fromRef.current;
    const to = value;
    const duration = 420;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out-quart — the same curve used elsewhere in the page
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return <>${display.toLocaleString()}</>;
}

/**
 * Reveal — wraps a section so it fades + rises 12px when scrolled into
 * view. One signature scroll animation reused across the page; runs once
 * per section (no replay on scroll-back). Respects prefers-reduced-motion
 * by skipping the transform and just rendering immediately.
 */
function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "section";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement & HTMLElement>}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 520ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 520ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: shown ? undefined : "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}

function DashedGrid({ faint = false }: { faint?: boolean }) {
  // Dashed grid frame — peripheral architectural pattern. On light paper,
  // the stroke is a faint dark so it reads as drafting rule.
  const stroke = faint ? "rgba(10,10,16,0.04)" : "rgba(10,10,16,0.07)";
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        backgroundImage: `repeating-linear-gradient(0deg, ${stroke} 0 1px, transparent 1px 6px),
                          repeating-linear-gradient(90deg, ${stroke} 0 1px, transparent 1px 6px)`,
        backgroundSize: "44px 1px, 1px 44px",
        backgroundRepeat: "repeat-x, repeat-y",
        backgroundPosition: "0 0, 0 0",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
      }}
    />
  );
}

/**
 * DashedFrame — design-system primitive for the AG blueprint pattern.
 * Renders an outer dashed border that extends past its container by
 * `outset` pixels, with optional internal column / row dividers that
 * align with `<DashedFrameDivider>` slots inside the children.
 *
 * Stroke is rendered via repeating-linear-gradient instead of CSS dashed
 * border so the dash pattern stays crisp at every size and rounds the
 * corners cleanly with mask-composite intersect.
 */
function DashedFrame({
  children,
  outset = DASH.outset,
  showCorners = true,
  className = "",
}: {
  children: React.ReactNode;
  outset?: number;
  showCorners?: boolean;
  className?: string;
}) {
  const cornerSize = 6;
  return (
    <div className={`relative ${className}`}>
      {/* Outer dashed border, extended outward by `outset` px */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          inset: `-${outset}px`,
          borderTop: `1px dashed ${DASH.stroke}`,
          borderBottom: `1px dashed ${DASH.stroke}`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          inset: `-${outset}px`,
          borderLeft: `1px dashed ${DASH.stroke}`,
          borderRight: `1px dashed ${DASH.stroke}`,
        }}
      />
      {/* Solid corner ticks at each intersection — small "registration marks" */}
      {showCorners &&
        [
          { top: -outset - cornerSize / 2, left: -outset - cornerSize / 2 },
          { top: -outset - cornerSize / 2, right: -outset - cornerSize / 2 },
          { bottom: -outset - cornerSize / 2, left: -outset - cornerSize / 2 },
          { bottom: -outset - cornerSize / 2, right: -outset - cornerSize / 2 },
        ].map((pos, i) => (
          <span
            key={i}
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              ...pos,
              width: cornerSize,
              height: cornerSize,
              background: T.accent,
            }}
          />
        ))}

      {children}
    </div>
  );
}

/**
 * DashedFrameDivider — vertical or horizontal dashed divider rendered
 * inside a panel. Designed to be dropped between flex/grid columns or
 * rows so the calculator and similar layouts get the full AG grid feel.
 */
function DashedFrameDivider({
  orientation = "vertical",
  inset = 0,
}: {
  orientation?: "vertical" | "horizontal";
  inset?: number;
}) {
  if (orientation === "vertical") {
    return (
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 bottom-0"
        style={{
          left: "50%",
          width: 1,
          marginTop: inset,
          marginBottom: inset,
          backgroundImage: `repeating-linear-gradient(to bottom, ${DASH.stroke} 0 4px, transparent 4px 10px)`,
          backgroundSize: "1px 10px",
          backgroundRepeat: "repeat-y",
        }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-0 right-0"
      style={{
        top: "50%",
        height: 1,
        marginLeft: inset,
        marginRight: inset,
        backgroundImage: `repeating-linear-gradient(to right, ${DASH.stroke} 0 4px, transparent 4px 10px)`,
        backgroundSize: "10px 1px",
        backgroundRepeat: "repeat-x",
      }}
    />
  );
}

function V2Styles() {
  return (
    <style>{`
      :focus-visible {
        outline: 2px solid ${T.accent};
        outline-offset: 2px;
      }
      :focus:not(:focus-visible) { outline: none; }

      /* md-size buttons get a 52px min-height on phone for a comfortable
         thumb target — 40px (the inline padY: 10 default) looks squished
         against the H1 on phones. Tablet/desktop fall back to the
         original 40px so the buttons stay proportional next to body
         text. */
      .osto-btn-tall {
        min-height: 52px;
      }
      @media (min-width: 640px) {
        .osto-btn-tall {
          min-height: 0;
        }
      }

      /* Rail-bound panels (HowItWorks, ProblemSection panels, Pricing
         Calculator, FinalCTA, Footer) — full-bleed on phone, rail-inset
         on md+. On phone the rails are hidden so an inset wastes space
         and makes the panel look cropped. */
      .osto-rail-frame {
        margin-left: 0;
        margin-right: 0;
      }
      .osto-rail-frame-inner {
        margin-left: 0;
        margin-right: 0;
      }
      @media (min-width: 768px) {
        .osto-rail-frame {
          margin-left: calc(max(24px, calc((100vw - 1240px) / 2)) + 1px);
          margin-right: calc(max(24px, calc((100vw - 1240px) / 2)) + 1px);
        }
        .osto-rail-frame-inner {
          margin-left: max(24px, calc((100vw - 1240px) / 2));
          margin-right: max(24px, calc((100vw - 1240px) / 2));
        }
      }

      /* Hero waveform — each bar gently breathes its height. Per-bar
         delay (set inline) creates a travelling wave effect. */
      @keyframes resonateBarBreathe {
        0%, 100% { transform: scaleY(1); }
        50%      { transform: scaleY(0.45); }
      }
      .resonate-bar {
        transform-origin: center;
        animation: resonateBarBreathe 1800ms ease-in-out infinite;
      }
      /* Soft horizontal fade at the wave edges — desktop only. On phones
         iOS Safari occasionally renders mask-image fully transparent at
         small widths, so we drop the mask below 640px and let the bars
         sit edge-to-edge inside the overflow-clipped <main>. */
      @media (min-width: 640px) {
        .resonate-wave-mask {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%);
                  mask-image: linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%);
        }
      }

      /* Live indicator dot — slow saturation pulse with glow. */
      @keyframes resonateLiveDotPulse {
        0%, 100% { opacity: 1; }
        50%      { opacity: 0.55; }
      }
      .resonate-live-dot {
        animation: resonateLiveDotPulse 1.8s ease-in-out infinite;
      }

      /* Dot-matrix shimmer — shared by BrandPanelRailPattern and
         FinalCtaRailField. The matrix is rendered as two interleaved
         SVG layers ("A" and "B"); each wrapper <div> animates its
         own opacity between a low and a high, with B's phase shifted
         half a cycle from A's. The result reads as a continuous
         shimmer because at any given moment one half-set is rising
         while the other falls, and dots from the two sets share
         neither cell positions nor brightness peaks.

         Critical perf detail: we animate exactly TWO elements per
         matrix (the two wrapper divs), not thousands of SVG circles.
         Opacity-only animation on a compositor-promoted layer is
         GPU-accelerated; opacity on a node containing thousands of
         non-promoted children triggers a paint pass each frame and
         tanks framerate. The will-change + isolation hints below
         promote each layer to its own compositor surface. */
      @keyframes ostoMatrixFadeA {
        0%   { opacity: 0.35; }
        50%  { opacity: 1; }
        100% { opacity: 0.35; }
      }
      @keyframes ostoMatrixFadeB {
        0%   { opacity: 1; }
        50%  { opacity: 0.35; }
        100% { opacity: 1; }
      }
      .osto-matrix-layer {
        will-change: opacity;
        transform: translateZ(0);
        isolation: isolate;
      }
      .osto-matrix-layer-a {
        animation: ostoMatrixFadeA 6400ms ease-in-out infinite;
      }
      .osto-matrix-layer-b {
        animation: ostoMatrixFadeB 6400ms ease-in-out infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .resonate-bar,
        .resonate-live-dot,
        .osto-matrix-layer-a,
        .osto-matrix-layer-b {
          animation: none !important;
        }
        .osto-matrix-layer-a,
        .osto-matrix-layer-b {
          opacity: 0.7 !important;
        }
      }

      /* ─── Mega-menu icon animations ─────────────────────────────────
         Each icon has a signature hover motion that mirrors what the
         item represents. Animations attach only inside the .group:hover
         row state so they don't loop while the menu is closed; the .osto-mi
         class on the inner shape is the animation target. transform-box:
         fill-box makes transform-origin: center resolve to each shape's
         own bbox instead of the SVG root, which is what we want for
         per-bar scaleY and per-glyph rotation/scale. */
      .osto-mi {
        transform-box: fill-box;
      }

      /* Streaming voice — bars pulse scaleY left→right (audio cue). */
      @keyframes ostoMiStreamBar {
        0%, 100% { transform: scaleY(1); }
        50%      { transform: scaleY(0.35); }
      }
      .group:hover .osto-mi-stream-bar {
        animation: ostoMiStreamBar 900ms cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }

      /* Voice library — rows sweep in from the left, top→down stagger. */
      @keyframes ostoMiRow {
        0%   { transform: translateX(-22px); opacity: 0; }
        60%  { opacity: var(--row-o, 1); }
        100% { transform: translateX(0); opacity: var(--row-o, 1); }
      }
      .group:hover .osto-mi-row {
        animation: ostoMiRow 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      /* Telephony — handset buzzes with a tight wiggle. */
      @keyframes ostoMiPhone {
        0%, 100% { transform: rotate(0); }
        20%      { transform: rotate(-8deg); }
        40%      { transform: rotate(8deg); }
        60%      { transform: rotate(-5deg); }
        80%      { transform: rotate(3deg); }
      }
      .group:hover .osto-mi-phone {
        animation: ostoMiPhone 700ms cubic-bezier(0.4, 0, 0.6, 1);
      }

      /* Evals — bars rise from baseline with stagger. */
      @keyframes ostoMiEvalsBar {
        0%   { transform: scaleY(0); }
        100% { transform: scaleY(1); }
      }
      .group:hover .osto-mi-evals-bar {
        animation: ostoMiEvalsBar 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      /* Support — speech bubble pops from its tail anchor. */
      @keyframes ostoMiBubble {
        0%   { transform: scale(0.7); }
        70%  { transform: scale(1.06); }
        100% { transform: scale(1); }
      }
      .group:hover .osto-mi-bubble {
        animation: ostoMiBubble 460ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      /* Outbound — arrow translates forward then snaps back. */
      @keyframes ostoMiArrow {
        0%   { transform: translateX(0); }
        50%  { transform: translateX(3px); }
        100% { transform: translateX(0); }
      }
      .group:hover .osto-mi-arrow {
        animation: ostoMiArrow 560ms cubic-bezier(0.22, 1, 0.36, 1) infinite;
      }

      /* Healthcare — cross rotates from -45° to 0° like a stamp. */
      @keyframes ostoMiCross {
        0%   { transform: rotate(-45deg) scale(0.7); }
        100% { transform: rotate(0) scale(1); }
      }
      .group:hover .osto-mi-cross {
        animation: ostoMiCross 460ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      /* Receptionist — bell tilts side-to-side, clapper swings opposite. */
      @keyframes ostoMiBell {
        0%, 100% { transform: rotate(0); }
        20%      { transform: rotate(-12deg); }
        40%      { transform: rotate(10deg); }
        60%      { transform: rotate(-6deg); }
        80%      { transform: rotate(4deg); }
      }
      @keyframes ostoMiBellClap {
        0%, 100% { transform: rotate(0); }
        20%      { transform: rotate(14deg); }
        40%      { transform: rotate(-12deg); }
        60%      { transform: rotate(8deg); }
        80%      { transform: rotate(-5deg); }
      }
      .group:hover .osto-mi-bell {
        animation: ostoMiBell 720ms cubic-bezier(0.4, 0, 0.6, 1);
      }
      .group:hover .osto-mi-bell-clapper {
        animation: ostoMiBellClap 720ms cubic-bezier(0.4, 0, 0.6, 1);
      }

      @media (prefers-reduced-motion: reduce) {
        .group:hover .osto-mi-stream-bar,
        .group:hover .osto-mi-row,
        .group:hover .osto-mi-phone,
        .group:hover .osto-mi-evals-bar,
        .group:hover .osto-mi-bubble,
        .group:hover .osto-mi-arrow,
        .group:hover .osto-mi-cross,
        .group:hover .osto-mi-bell,
        .group:hover .osto-mi-bell-clapper {
          animation: none !important;
        }
      }

      /* Hero entrance — H1 → lead → CTAs → trust → wave rise + fade in
         on page load. Each child sets its own animationDelay inline,
         so the cascade reads as one orchestrated arrival rather than
         five separate fades. */
      @keyframes ostoHeroRise {
        from {
          opacity: 0;
          transform: translateY(14px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .osto-hero-rise {
        opacity: 0;
        animation: ostoHeroRise 720ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      @media (prefers-reduced-motion: reduce) {
        .osto-hero-rise {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }

      /* ─── Integrations tab-panel crossfade ──────────────────────────
         The right-hand logo matrix in the auto-advancing Integrations
         tabs panel uses a short opacity fade on remount (parent passes
         a stage-keyed key so React replaces the panel on tab change).
         180ms is fast enough that the tab change still feels responsive
         and slow enough that the swap isn't a hard cut. */
      @keyframes ostoIntFade {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .osto-int-fade {
        animation: ostoIntFade 180ms ease-out both;
      }
      @media (prefers-reduced-motion: reduce) {
        .osto-int-fade {
          animation: none !important;
          opacity: 1 !important;
        }
      }

      /* Nav entrance — capsule drops in once on load */
      @keyframes ostoNavEnter {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .osto-nav-enter {
        animation: ostoNavEnter 520ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
      }
      /* Mega-menu entrance */
      @keyframes ostoMegaEnter {
        from {
          opacity: 0;
          transform: translateY(-4px) scale(0.985);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      [data-osto-mega] {
        animation: ostoMegaEnter 220ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
        transform-origin: top center;
      }
      /* Brand button hover lift */
      [data-osto-brand-btn] {
        transition: transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1),
                    box-shadow 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      [data-osto-brand-btn]:hover {
        transform: translateY(-1px);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,0.30),
          0 0 0 1px ${PALETTE.blueDark},
          0 6px 18px -4px rgba(59,130,246,0.45);
      }
      [data-osto-brand-btn]:active {
        /* Press feedback: small scale down + return-to-rest Y so the
           button feels physically clicked, not just shadow-shifted. */
        transform: translateY(0) scale(0.97);
        transition-duration: 80ms;
      }
      /* Ghost button hover lift + active press */
      [data-osto-ghost-btn] {
        transition: transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1),
                    background-color 160ms ease-out;
      }
      [data-osto-ghost-btn]:hover {
        background-color: ${T.panel};
        transform: translateY(-1px);
      }
      [data-osto-ghost-btn]:active {
        transform: translateY(0) scale(0.97);
        transition-duration: 80ms;
      }
      /* Caret slides forward when its button is hovered */
      [data-osto-caret] {
        transition: transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      [data-osto-ghost-btn]:hover [data-osto-caret],
      a:hover > [data-osto-caret] {
        transform: translateX(2px);
      }
      @media (prefers-reduced-motion: reduce) {
        .osto-nav-enter,
        [data-osto-mega],
        [data-osto-brand-btn],
        [data-osto-ghost-btn],
        [data-osto-caret] {
          animation: none !important;
          transition: none !important;
        }
      }

      /* ─── Pricing calculator slider ────────────────────────────────
         Horizontal 6px track with a rectangular draggable thumb styled
         like the white ghost CTA: surface fill, hairline ring, inner
         highlight, and a soft drop shadow. Three vertical grooves at
         the center give it a tactile "knurled grip" detail. The track
         fills with brand accent up to the thumb. */
      .osto-range {
        appearance: none;
        -webkit-appearance: none;
        background: transparent;
        /* 44px outer height = 44px tap target on touch devices, even
           though the visible track is only 6px and the thumb 18px. */
        height: 44px;
        cursor: pointer;
        /* Match the app-wide motion curve used by the buttons so the
           thumb feels like the same family of object. */
        --osto-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
        /* Static thumb shadow stack — kept in a var so hover/active can
           swap the whole stack without recomposing the rule. Avoids
           transitioning box-shadow on drag (jank). */
        --osto-thumb-shadow:
          ${E.buttonGhost},
          0 1px 2px rgba(10,10,16,0.12),
          0 2px 6px -1px rgba(10,10,16,0.14),
          0 8px 16px -6px rgba(10,10,16,0.18);
        --osto-thumb-shadow-hover:
          ${E.buttonGhost},
          0 2px 4px rgba(10,10,16,0.14),
          0 6px 12px -2px rgba(10,10,16,0.18),
          0 12px 24px -8px rgba(10,10,16,0.22);
        --osto-thumb-shadow-active:
          ${E.buttonGhost},
          0 0 0 4px ${T.accent}22,
          0 1px 2px rgba(10,10,16,0.12);
      }
      .osto-range:focus { outline: none; }
      .osto-range::-webkit-slider-runnable-track {
        height: 6px;
        background: linear-gradient(
          to right,
          ${T.accent} 0,
          ${T.accent} var(--osto-pct, 0%),
          ${T.inkLine} var(--osto-pct, 0%),
          ${T.inkLine} 100%
        );
      }
      .osto-range::-moz-range-track {
        height: 6px;
        background: ${T.inkLine};
      }
      .osto-range::-moz-range-progress {
        height: 6px;
        background: ${T.accent};
      }
      /* Rectangular thumb — ghost-CTA detailing: white surface, hairline
         ring, inset top highlight, soft drop shadow for depth. Three
         center grooves give it a tactile "knurled grip" detail. The
         thumb is 18×22; the visual band is centered on the 6px track. */
      .osto-range::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        width: 18px;
        height: 22px;
        background:
          /* Three 1px-wide grooves, 4px apart, drawn in a centered 10×9
             band via background-size + background-position. Opacity 0.18
             reads as a quiet grip detail without becoming a stripe. */
          linear-gradient(
            to right,
            transparent calc(50% - 5px),
            rgba(10,10,16,0.18) calc(50% - 5px),
            rgba(10,10,16,0.18) calc(50% - 4px),
            transparent calc(50% - 4px),
            transparent calc(50% - 1px),
            rgba(10,10,16,0.18) calc(50% - 1px),
            rgba(10,10,16,0.18) calc(50%),
            transparent calc(50%),
            transparent calc(50% + 3px),
            rgba(10,10,16,0.18) calc(50% + 3px),
            rgba(10,10,16,0.18) calc(50% + 4px),
            transparent calc(50% + 4px)
          ),
          ${T.surface};
        background-repeat: no-repeat;
        background-size: 10px 9px, 100% 100%;
        background-position: center, 0 0;
        box-shadow: var(--osto-thumb-shadow);
        /* Center the thumb on the 6px track inside a 44px-tall input:
           track top = (44 - 6) / 2 = 19; thumb top = 19 - (22 - 6)/2 = 11.
           margin-top on a webkit thumb is relative to the track, so the
           offset is -(thumb_h - track_h)/2 = -8. */
        margin-top: -8px;
        cursor: grab;
        /* Only transform animates — box-shadow swaps via CSS var
           reassignment so drag stays 60fps. */
        transition: transform 160ms var(--osto-ease);
      }
      .osto-range::-moz-range-thumb {
        width: 18px;
        height: 22px;
        border: 0;
        background:
          linear-gradient(
            to right,
            transparent calc(50% - 5px),
            rgba(10,10,16,0.18) calc(50% - 5px),
            rgba(10,10,16,0.18) calc(50% - 4px),
            transparent calc(50% - 4px),
            transparent calc(50% - 1px),
            rgba(10,10,16,0.18) calc(50% - 1px),
            rgba(10,10,16,0.18) calc(50%),
            transparent calc(50%),
            transparent calc(50% + 3px),
            rgba(10,10,16,0.18) calc(50% + 3px),
            rgba(10,10,16,0.18) calc(50% + 4px),
            transparent calc(50% + 4px)
          ),
          ${T.surface};
        background-repeat: no-repeat;
        background-size: 10px 9px, 100% 100%;
        background-position: center, 0 0;
        box-shadow: var(--osto-thumb-shadow);
        cursor: grab;
        transition: transform 160ms var(--osto-ease);
      }
      .osto-range:hover::-webkit-slider-thumb,
      .osto-range:focus-visible::-webkit-slider-thumb {
        transform: translateY(-1px);
        box-shadow: var(--osto-thumb-shadow-hover);
      }
      .osto-range:hover::-moz-range-thumb,
      .osto-range:focus-visible::-moz-range-thumb {
        transform: translateY(-1px);
        box-shadow: var(--osto-thumb-shadow-hover);
      }
      .osto-range:active::-webkit-slider-thumb {
        cursor: grabbing;
        transform: translateY(0);
        box-shadow: var(--osto-thumb-shadow-active);
      }
      .osto-range:active::-moz-range-thumb {
        cursor: grabbing;
        transform: translateY(0);
        box-shadow: var(--osto-thumb-shadow-active);
      }
      .osto-range:focus-visible {
        outline: 2px solid ${T.accent};
        outline-offset: 4px;
      }
      @media (prefers-reduced-motion: reduce) {
        .osto-range::-webkit-slider-thumb,
        .osto-range::-moz-range-thumb {
          transition: none;
        }
      }

      /* Checkbox check-mark draw on toggle. The path draws from start to
         end over 280ms with an ease-out curve, so checking a module
         feels physically committed instead of binary on/off. */
      @keyframes ostoCheckDraw {
        from { stroke-dasharray: 1; stroke-dashoffset: 1; }
        to   { stroke-dasharray: 1; stroke-dashoffset: 0; }
      }
      .osto-check-draw {
        animation: ostoCheckDraw 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      @media (prefers-reduced-motion: reduce) {
        .osto-check-draw { animation: none !important; }
      }
    `}</style>
  );
}
