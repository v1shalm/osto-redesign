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
import { useEffect, useRef, useState } from "react";
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
      <Reveal><ProblemSection /></Reveal>
      <SectionSpacer />
      {/* HowItWorks is NOT wrapped in <Reveal> — the Reveal component
          applies a CSS transform which creates a containing block that
          breaks `position: sticky` for descendants. The section has its
          own scroll-driven fade-in on the inner panel. */}
      <HowItWorks />
      <SectionSpacer />
      <Reveal><OstoModules /></Reveal>
      <SectionSpacer />
      <Reveal><CustomerStories /></Reveal>
      <SectionSpacer />
      <Reveal><PricingCalculator /></Reveal>
      <SectionSpacer />
      <Reveal><Pricing /></Reveal>
      <SectionSpacer />
      <Reveal><WhyTrust /></Reveal>
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
          className="flex w-full items-center justify-between gap-x-12 py-1.5 pl-5 pr-1.5 backdrop-blur transition-shadow duration-200"
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
              className="hidden  px-3 py-2 text-[13px] font-medium tracking-[-0.13px] md:inline-block"
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

// ─── MegaIcon — small light tile with a thin-line glyph + blue accent ─
//
// Twenty/Stripe-style icon set. Every icon is a 36×36 sharp-cornered
// tile in white, with a layered shadow stack that gives it depth:
//   • inset top-highlight (subtle white-on-white gleam at the top edge)
//   • hairline ring at ~8% black (the visible card border)
//   • soft offset drop shadow underneath (1px down, 2px blur)
// Glyph is drawn in dark ink with one element in brand-blue as the
// focal accent. Matches the reference's "card raised on the surface"
// feel rather than the previous "black sticker" treatment.
function MegaIcon({ kind }: { kind: MegaIconKey }) {
  // Shared icon scaffold: light filled tile + layered shadow + thin
  // dark glyph layer.
  const TileWrap = ({ children }: { children: React.ReactNode }) => (
    <span
      aria-hidden
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center"
      style={{
        background: T.surface,
        boxShadow: [
          // Inset top-edge highlight — a sliver of brighter white that
          // catches the "light" and makes the tile read as raised.
          "inset 0 1px 0 rgba(255,255,255,0.9)",
          // Hairline ring — the visible card border.
          `0 0 0 1px ${T.ring}`,
          // Soft drop shadow — sits the tile gently on the surface.
          "0 1px 2px rgba(10,10,16,0.06)",
          "0 2px 6px -2px rgba(10,10,16,0.08)",
        ].join(", "),
      }}
    >
      {children}
    </span>
  );
  // Glyph colors — dark for the body of the glyph, brand-blue for the
  // accent piece. ~80% alpha on ink so the glyph reads as a "thin-line
  // graphite" mark rather than full-saturation black.
  const FG = "rgba(10,10,16,0.78)";
  const ACC = T.accent;

  switch (kind) {
    // ── PLATFORM ──
    // Streaming voice → audio waveform with one taller bar in accent.
    case "stream":
      return (
        <TileWrap>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <line x1="3"  y1="9" x2="3"  y2="9"  stroke={FG} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="6"  y1="6" x2="6"  y2="12" stroke={FG} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="9"  y1="3" x2="9"  y2="15" stroke={ACC} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="5" x2="12" y2="13" stroke={FG} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="15" y1="7" x2="15" y2="11" stroke={FG} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </TileWrap>
      );

    // Voice library → stack of 3 horizontal rows with the top row in accent.
    case "voice-library":
      return (
        <TileWrap>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3"   y="3.5" width="12" height="3" stroke={ACC} strokeWidth="1.4" />
            <rect x="3"   y="7.5" width="12" height="3" stroke={FG}  strokeWidth="1.4" />
            <rect x="3"   y="11.5" width="12" height="3" stroke={FG}  strokeWidth="1.4" />
            <circle cx="5.5" cy="5"  r="0.7" fill={ACC} />
            <circle cx="5.5" cy="9"  r="0.7" fill={FG}  />
            <circle cx="5.5" cy="13" r="0.7" fill={FG}  />
          </svg>
        </TileWrap>
      );

    // Telephony → handset glyph with accent signal arc.
    case "telephony":
      return (
        <TileWrap>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M4 4 L 7 4 L 8 7 L 6.5 8.5 Q 8.5 11.5 11 13 L 12 11.5 L 15 12 L 15 15 Q 9 15 4 10 Z"
              stroke={FG}
              strokeWidth="1.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path d="M11 5 Q 13 5 13 7"  stroke={ACC} strokeWidth="1.4" strokeLinecap="round" fill="none" />
            <path d="M11 3 Q 15 3 15 7"  stroke={ACC} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6" />
          </svg>
        </TileWrap>
      );

    // Evals → line chart with one peak dot in accent.
    case "evals":
      return (
        <TileWrap>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <polyline
              points="3,12 6,10 9,11 12,5 15,7"
              fill="none"
              stroke={FG}
              strokeWidth="1.4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <line x1="3" y1="14.5" x2="15" y2="14.5" stroke={FG} strokeWidth="1" strokeDasharray="1.5 1.5" opacity="0.4" />
            <circle cx="12" cy="5" r="1.6" fill={ACC} />
          </svg>
        </TileWrap>
      );

    // ── SOLUTIONS ──
    // Customer support → two speech bubbles, the smaller one in accent.
    case "support":
      return (
        <TileWrap>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 4 H 13 V 9 H 6 L 4 11 V 9 H 3 Z"
              stroke={FG}
              strokeWidth="1.4"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M8 12 H 15 V 15 H 12 L 11 16 V 15 H 8 Z"
              fill={ACC}
              stroke="none"
            />
          </svg>
        </TileWrap>
      );

    // Outbound → a contact row with an arrow pointing right (accent).
    case "outbound":
      return (
        <TileWrap>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="6" cy="6" r="2" stroke={FG} strokeWidth="1.4" />
            <path d="M2.5 14 Q 2.5 10 6 10 Q 9.5 10 9.5 14" stroke={FG} strokeWidth="1.4" strokeLinecap="round" fill="none" />
            <line x1="11" y1="9" x2="15.5" y2="9" stroke={ACC} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14 7 L 15.5 9 L 14 11" stroke={ACC} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </TileWrap>
      );

    // Healthcare → clipboard with a checkmark in accent.
    case "healthcare":
      return (
        <TileWrap>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="4" y="4" width="10" height="11" stroke={FG} strokeWidth="1.4" />
            <rect x="6.5" y="2.5" width="5" height="2.5" fill={FG} />
            <path d="M6 10 L 8 12 L 12 8" stroke={ACC} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </TileWrap>
      );

    // Receptionist → bell with accent ringer dot.
    case "receptionist":
      return (
        <TileWrap>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M4 12 Q 4 6 9 6 Q 14 6 14 12 Z"
              stroke={FG}
              strokeWidth="1.4"
              strokeLinejoin="round"
              fill="none"
            />
            <line x1="3" y1="12.5" x2="15" y2="12.5" stroke={FG} strokeWidth="1.4" strokeLinecap="round" />
            <line x1="9" y1="4" x2="9" y2="6" stroke={FG} strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="9" cy="15" r="1.1" fill={ACC} />
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
          className="text-balance"
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
          className="mx-auto text-pretty"
          style={{
            color: T.inkSoft,
            fontSize: "clamp(17px, 1.5vw, 20px)",
            lineHeight: 1.5,
            letterSpacing: "-0.012em",
            marginTop: 28,
            maxWidth: 580,
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
          className="flex flex-col items-stretch justify-center sm:flex-row sm:items-center"
          style={{ marginTop: 40, gap: S.sm }}
        >
          <BrandButton href="#" size="md">Try a live agent</BrandButton>
          <GhostButton href="#" size="md" withCaret>
            Get an API key
          </GhostButton>
        </div>

        {/* Trust line — small, quiet. Sits 20px under the CTAs so the
            buttons keep their breathing room. */}
        <p
          className="mx-auto text-[13px] leading-[20px]"
          style={{
            color: T.inkSubtle,
            letterSpacing: "-0.02em",
            marginTop: 20,
          }}
        >
          10,000 free minutes. Pay-as-you-go after. No credit&nbsp;card.
        </p>

        {/* Hero waveform — the visual anchor. 32px on phone (tight so
            the strip lands above the first-viewport fold), 56px on
            tablet+ for desktop breathing room. */}
        <div className="mt-8 sm:mt-14">
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

// The scroll-driven multiplier. 2.4 = the wrapper is 2.4× viewport tall,
// so the user spends ~one viewport per step plus a short tail before
// the section releases.
const HIW_SCROLL_VH = 240;

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
      <div className="relative grid gap-y-10 px-6 py-10 md:grid-cols-[1fr_1.05fr] md:items-center md:gap-x-12 md:px-12 md:py-16">
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
          className="mt-4 max-w-[600px] text-pretty text-[15px] leading-[24px]"
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
          ? "relative px-6 py-8 md:px-12 md:py-14 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.10)] md:[box-shadow:inset_1px_0_0_rgba(255,255,255,0.10),inset_0_1px_0_rgba(255,255,255,0.10)]"
          : "relative px-6 py-8 md:px-12 md:py-14"
      }
      style={{
        background: isBrand ? BUTTON_BRAND_BG : T.panel,
        zIndex: isBrand ? 2 : 1,
      }}
    >
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
    <ul
      className="mt-10 grid grid-cols-1 gap-y-3 md:mt-14 md:grid-cols-3 md:gap-x-12 md:gap-y-0"
      style={{
        borderTop: `1px solid ${T.panelHairline}`,
        paddingTop: 24,
      }}
    >
      {deltas.map((d) => (
        <li key={d.label} className="flex items-baseline gap-x-3">
          <span
            className="text-[13px] font-medium"
            style={{ color: T.inkSubtle, letterSpacing: "-0.13px" }}
          >
            {d.label}
          </span>
          <span
            className="ml-auto flex items-baseline gap-x-2 text-[13px] leading-[20px]"
            style={{ letterSpacing: "-0.13px" }}
          >
            <span style={{ color: T.inkSubtle, textDecoration: "line-through" }}>
              {d.from}
            </span>
            <span style={{ color: T.inkSubtle }}>to</span>
            <span style={{ color: T.ink, fontWeight: 600 }}>{d.to}</span>
          </span>
        </li>
      ))}
    </ul>
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
      "We swapped a 40-seat Tier-1 queue for Resonate agents on the first day of the pilot. The 90 ms latency was the unlock — callers stopped detecting the gap, and we now route 71% of tickets to the agent before a human even sees them.",
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
      "Transcripts, sentiment, and drop-off heatmaps in the same dashboard meant we could actually tune what the agent said next. By month two it was outperforming our top-quartile reps.",
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
          className="max-w-[680px] text-balance text-[28px] leading-[34px] tracking-[-0.7px] sm:text-[32px] sm:leading-[38px] sm:tracking-[-0.8px] md:text-[40px] md:leading-[44px] md:tracking-[-1px]"
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
          className="mt-3 max-w-[480px] text-pretty text-[14px] leading-[24px]"
          style={{ color: T.inkSoft, letterSpacing: "-0.14px" }}
        >
          Drag the sliders, toggle the modules. The total updates as you go.
        </p>

        {/* Audience tabs — scroll horizontally on phone if needed, so the
            four labels never wrap onto two lines. */}
        <div className="mt-8 flex justify-start sm:mt-10">
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
                  className=" px-3.5 py-1.5 text-[13px] font-medium tracking-[-0.13px] transition-[background-color,color,box-shadow,scale] duration-200 ease-out active:scale-[0.96]"
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
                          className="flex cursor-pointer items-center justify-between  p-2.5 transition-colors hover:bg-black/[0.03]"
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
                              className="flex h-4 w-4 items-center justify-center  transition-[background-color,box-shadow] duration-200 ease-out"
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
                className="flex cursor-pointer items-center justify-between  p-3"
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
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label
          className="text-[13px] font-medium"
          style={{ color: T.ink, letterSpacing: "-0.13px" }}
        >
          {label}
        </label>
        <span
          className=" px-2 py-0.5 text-[12px] font-medium tabular-nums"
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
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
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

// ─── Why trust Resonate — 3 credibility pillars ───────────────────────────
function WhyTrust() {
  return (
    <section className="px-5 pt-4 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading>
          Built by speech{" "}
          <span style={{ color: T.accent }}>researchers</span>, not prompt engineers.
        </SectionHeading>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <TrustPillar
            big="90 ms"
            heading="Time to first byte"
            body="Our TTS, STT, and turn-taking run on the same GPU stack, so your caller hears the first syllable before a stitched vendor pipeline finishes routing."
          />
          <TrustPillar
            big="32"
            heading="Languages with native accents"
            body="Agents speak Hindi, Spanish, Arabic, and Mandarin the way locals do, and they code-switch inside a single call without dropping context."
          />
          <TrustPillar
            big="2M+"
            heading="Conversations a day"
            body="Production load across support, sales, and healthcare under a 99.99% uptime SLA. Our team answers the phone when you call too."
          />
        </div>
      </div>
    </section>
  );
}

function TrustPillar({
  big,
  heading,
  body,
}: {
  big: string;
  heading: string;
  body: string;
}) {
  return (
    <article
      className=" p-7"
      style={{ background: T.surface, boxShadow: E.card }}
    >
      <p
        className="text-[32px] font-medium leading-[38px]"
        style={{
          fontFamily: T.fontDisplay,
          color: T.accent,
          letterSpacing: "-0.8px",
        }}
      >
        {big}
      </p>
      <h3
        className="mt-4 text-balance text-[16px] font-medium leading-[24px]"
        style={{
          color: T.ink,
          fontFamily: T.fontDisplay,
          letterSpacing: "-0.24px",
        }}
      >
        {heading}
      </h3>
      <p
        className="mt-2 max-w-[36ch] text-pretty text-[16px] leading-[24px]"
        style={{ color: T.inkSoft, letterSpacing: "-0.24px" }}
      >
        {body}
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
    a: "ElevenLabs and Cartesia are great speech models — you still glue on STT, LLM, telephony, and evals. Vapi orchestrates third-party models with the latency penalty that brings. Resonate owns the full stack end-to-end, which is how we hold 90 ms TTFB under real production load.",
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
        <div className="text-center">
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
            <GhostButton href="#">Try a live agent</GhostButton>
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-x-1.5 px-3 py-[6px] text-[13px] font-medium leading-[24px] tracking-[-0.13px] text-white transition-colors hover:bg-white/10"
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
                    className="inline-flex h-10 w-10 items-center justify-center  transition-colors hover:bg-black/[0.04]"
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
      className="inline-flex items-center gap-x-1  px-2.5 py-0.5 text-[12px] font-medium leading-[20px]"
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

// ─── Shared primitives ────────────────────────────────────────────────
/**
 * SectionHeading — H2 always left-aligned. Used by every section that
 * doesn't bring its own H2 styling.
 */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-balance"
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

      @media (prefers-reduced-motion: reduce) {
        .resonate-bar,
        .resonate-live-dot {
          animation: none !important;
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
        transform: translateY(0.5px);
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
        transform: translateY(0.5px);
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

      /* Range slider — track gets accent fill up to thumb */
      .osto-range {
        appearance: none;
        -webkit-appearance: none;
        background: transparent;
        height: 22px;
        cursor: pointer;
      }
      .osto-range:focus { outline: none; }
      .osto-range::-webkit-slider-runnable-track {
        height: 6px;
        border-radius: 999px;
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
        border-radius: 999px;
        background: ${T.inkLine};
      }
      .osto-range::-moz-range-progress {
        height: 6px;
        border-radius: 999px;
        background: ${T.accent};
      }
      .osto-range::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${T.surface};
        box-shadow: 0 0 0 1.5px ${T.accent}, 0 1px 2px rgba(38,38,43,0.18);
        margin-top: -6px;
        cursor: grab;
        transition: transform 120ms ease-out, box-shadow 120ms ease-out;
      }
      .osto-range::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: ${T.surface};
        border: 1.5px solid ${T.accent};
        box-shadow: 0 1px 2px rgba(38,38,43,0.18);
        cursor: grab;
      }
      .osto-range:hover::-webkit-slider-thumb,
      .osto-range:focus-visible::-webkit-slider-thumb {
        transform: scale(1.1);
        box-shadow: 0 0 0 1.5px ${T.accent}, 0 0 0 6px ${T.accent}22, 0 1px 2px rgba(38,38,43,0.18);
      }
      .osto-range:active::-webkit-slider-thumb {
        cursor: grabbing;
        transform: scale(1.18);
        box-shadow: 0 0 0 1.5px ${T.accent}, 0 0 0 9px ${T.accent}1f, 0 2px 6px rgba(38,38,43,0.22);
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
