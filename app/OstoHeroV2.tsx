"use client";

/**
 * osto.one — V2.
 *
 * AccessGrid-inspired design system applied to osto's product story.
 * Tokens, elevation language, type scale, button shadows, nav capsule,
 * card construction, dashed-grid section frame, and dark stats panel
 * all match the AccessGrid customer page treatment exactly. Content,
 * illustrations, and brand color (osto navy) are osto's own.
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { OstoModules, OstoModulesStyles } from "./OstoModules";

// ─── Design tokens (lifted from AccessGrid's live CSS) ────────────────
const T = {
  // Surfaces
  page: "#ffffff",
  panel: "#f7f7f8",          // ag-gray-50
  surface: "#ffffff",
  panelHairline: "#eeeef0",  // ag-gray-100 (used as 0.5px hairline between tiles)

  // Ink — AG gray ramp, exact
  ink: "#26262b",            // ag-gray-950
  inkStrong: "#42424a",      // ag-gray-800
  inkSoft: "#5e5f6b",        // ag-gray-600
  inkMid: "#747583",         // ag-gray-500
  inkSubtle: "#92939e",      // ag-gray-400
  inkFaint: "#b8b9c1",       // ag-gray-300
  inkLine: "#d9d9de",        // ag-gray-200

  // Lines (rendered as ring-shadows, AG never uses CSS borders)
  ring: "rgba(38,38,43,0.08)",
  ringStrong: "rgba(38,38,43,0.10)",

  // Brand — osto's actual navy palette (lifted from osto.one's CSS vars)
  accent: "#2e3d9e",         // --navy-2 — eyebrow, headline highlight, links
  accentDeep: "#1c267a",     // --blue — primary brand
  btnTop: "#2e3d9e",
  btnBot: "#1c267a",
  btnRing: "#141d5c",        // --navy-3

  // Type
  fontSans: "var(--font-sans)",
  fontDisplay: "var(--font-sans)",
};

// ─── Elevation tokens ─────────────────────────────────────────────────
// Cards use a crisp 1px ring by default. cardElevated layers shadows
// for the upsell pattern. cardFlat is the no-chrome counterpart.
const E = {
  card: "0 0 0 1px rgba(38,38,43,0.08)",
  cardElevated:
    "0 1px 2px rgba(38,38,43,0.04), 0 6px 16px -8px rgba(38,38,43,0.10), 0 24px 48px -24px rgba(38,38,43,0.18), 0 0 0 1px rgba(38,38,43,0.04)",
  cardFlat: "none",
  buttonGhost:
    "0 2px 4px -2px rgba(0,0,0,0.20), 0 0 0 1px rgba(38,38,43,0.08)",
  buttonBrand: `inset 0 1px 0.5px rgba(255,255,255,0.13), 0 1px 1px rgba(17,31,91,0.20), 0 2px 4px -2px rgba(17,31,91,0.40), 0 1px 5px -2px rgba(17,31,91,0.40), 0 0 0 1px ${T.btnRing}`,
  // Nav capsule keeps a faint shadow because it floats over scrolling
  // content and needs the small lift so it reads as foreground UI.
  navCapsule:
    "0 0 0 1px rgba(38,38,43,0.08), 0 1px 1px 0 rgba(38,38,43,0.06), 0 2px 8px -4px rgba(38,38,43,0.10)",
  ringOnly: "0 0 0 1px rgba(38,38,43,0.08)",
  globe: "0 0 32px rgba(116,117,131,0.20)",
};

// Dashed frame tokens — reusable design-system primitive for sections that
// need a blueprint/architectural framing (pricing calculator, How it works,
// modules grid). Stroke is soft enough to read as scaffold, not as a border.
const DASH = {
  stroke: "#cdced3",      // ag-gray-300 muted
  strokeStrong: "#b8b9c1", // ag-gray-300
  // 4px dash, 6px gap — same rhythm AG uses
  pattern: "4, 6",
  // Outset (px) the frame extends past its container — gives the
  // "drawn on the page" feeling instead of hugging the content.
  outset: 24,
};

// 3-stop gradient — osto's exact button gradient pattern.
const BUTTON_BRAND_BG = `linear-gradient(${T.btnTop} 0%, ${T.accentDeep} 60%, ${T.btnRing} 100%)`;

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
const R = {
  sm: 6,
  md: 10,    // matches button radius
  lg: 24,    // card radius (was rounded-3xl)
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
      "%c osto %c security as the byproduct, not the goal. ",
      "background:#1c267a;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:600;letter-spacing:0.04em",
      "background:#f7f7f8;color:#26262b;padding:4px 10px;border-radius:0 4px 4px 0;letter-spacing:-0.01em"
    );
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-hidden"
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
      <Reveal><HowItWorks /></Reveal>
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
const RAIL_STROKE = "rgba(38,38,43,0.14)";

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
          backgroundImage: `repeating-linear-gradient(to right, rgba(38,38,43,0.07) 0 1px, transparent 1px 11px)`,
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      />
    </div>
  );
}

type MenuKey = "platform" | "solutions";

function NavBar() {
  const [openMenu, setOpenMenu] = useState<null | MenuKey>(null);
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

  // Close menus on Escape and on outside click (still useful for
  // keyboard/touch users)
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-osto-nav]")) setOpenMenu(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [openMenu]);

  useEffect(() => () => cancelClose(), []);

  return (
    <header
      data-osto-nav
      className="osto-nav-enter fixed top-4 left-0 right-0 z-50 w-full px-4 md:top-6"
    >
      <div className="relative mx-auto flex max-w-[940px] items-center justify-between gap-x-12">
        <nav
          className="flex w-full items-center justify-between gap-x-12 rounded-2xl py-1.5 pl-5 pr-1.5 backdrop-blur transition-shadow duration-200"
          style={{
            background: "rgba(247,247,248,0.90)",
            boxShadow: E.navCapsule,
          }}
        >
          <div className="flex items-center gap-x-5">
            <Link href="/" aria-label="Osto home" className="flex items-center">
              <Image
                src="/osto-logo.png"
                alt="Osto"
                width={1163}
                height={432}
                priority
                className="h-[18px] w-auto"
              />
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
              className="hidden rounded-[10px] px-3 py-2 text-[13px] font-medium tracking-[-0.13px] md:inline-block"
              style={{ color: T.ink }}
            >
              Sign in
            </Link>
            <BrandButton href="#">Book demo</BrandButton>
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
              cards={[
                {
                  title: "Real-time security",
                  desc: "Web, API, endpoint, and network protection live in hours.",
                  illus: <IllusMegaShield />,
                },
                {
                  title: "Cloud posture",
                  desc: "Continuous scanning across AWS, Azure, and GCP.",
                  illus: <IllusMegaCloud />,
                },
                {
                  title: "Compliance & audits",
                  desc: "SOC 2, ISO 27001, HIPAA, and GDPR readiness with live evidence.",
                  illus: <IllusMegaCert />,
                },
                {
                  title: "VAPT & questionnaires",
                  desc: "OSCP-led testing and AI-assisted security responses.",
                  illus: <IllusMegaCode />,
                },
              ]}
              footer={{
                icon: (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M3 4h10v8H3z M3 4l5 4 5-4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                label: "Platform documentation",
                caption: "Everything you need to integrate with Osto modules.",
                cta: "Read docs",
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
              cards={[
                {
                  title: "Seed to Series A",
                  desc: "First security posture with controls live from day one.",
                  illus: <IllusMegaScale />,
                },
                {
                  title: "Series B and beyond",
                  desc: "Enterprise deals plus audit-ready frameworks.",
                  illus: <IllusMegaIndustry />,
                },
                {
                  title: "Investor security checklist",
                  desc: "Term-sheet ready in days, not quarters.",
                  illus: <IllusMegaHandshake />,
                },
                {
                  title: "SOC 2 deadline",
                  desc: "Type II readiness compressed into 118 days.",
                  illus: <IllusMegaDeadline />,
                },
              ]}
              footer={{
                icon: (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
                    <path
                      d="M8 5v3l2 2"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
                label: "See customer stories",
                caption: "How startups onboarded Osto on real timelines.",
                cta: "View stories",
              }}
            />
          </div>
        )}
      </div>
    </header>
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
      className="inline-flex items-center gap-x-2 rounded-[10px] px-3 py-2 text-[13px] font-medium tracking-[-0.13px] transition-colors hover:bg-black/[0.04]"
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
  return (
    <Link
      href={href}
      data-osto-nav-link
      className="rounded-[10px] px-2 py-2 text-[13px] font-medium tracking-[-0.13px]"
      style={{ color: T.ink }}
    >
      {children}
    </Link>
  );
}

/**
 * MegaMenu — large illustrated dropdown panel.
 *
 * Pattern: 2×2 grid of MegaCard (each with title, caption, line-art
 * illustration), plus a MegaFooter strip with icon + label + CTA button.
 * Matches the AccessGrid mega-menu treatment.
 */
function MegaMenu({
  cards,
  footer,
}: {
  cards: {
    title: string;
    desc: string;
    illus: React.ReactNode;
  }[];
  footer: { icon: React.ReactNode; label: string; caption: string; cta: string };
}) {
  return (
    <div
      data-osto-mega
      role="menu"
      className="mt-3 overflow-hidden rounded-2xl"
      style={{
        background: T.surface,
        boxShadow: E.card,
        width: "min(640px, calc(100vw - 32px))",
      }}
    >
      {/* 2×2 illustrated card grid */}
      <div className="grid grid-cols-2">
        {cards.map((c, i) => {
          const right = i % 2 === 0;
          const bottom = i < cards.length - 2;
          return (
            <Link
              key={c.title}
              href="#"
              className="group relative flex h-[200px] flex-col justify-end p-5 transition-colors hover:bg-black/[0.015]"
              style={{
                boxShadow: [
                  right ? `inset -0.5px 0 0 0 ${T.ring}` : "",
                  bottom ? `inset 0 -0.5px 0 0 ${T.ring}` : "",
                ]
                  .filter(Boolean)
                  .join(", "),
              }}
            >
              {/* Illustration sits absolutely in the upper portion */}
              <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[110px] items-center justify-center">
                {c.illus}
              </div>
              <div className="relative">
                <p
                  className="text-[14px] font-medium"
                  style={{
                    color: T.ink,
                    fontFamily: T.fontDisplay,
                    letterSpacing: "-0.21px",
                  }}
                >
                  {c.title}
                </p>
                <p
                  className="mt-1 text-[12px] leading-[18px]"
                  style={{ color: T.inkSoft, letterSpacing: "-0.018px" }}
                >
                  {c.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer CTA strip */}
      <div
        className="flex items-center justify-between gap-x-4 px-5 py-3.5"
        style={{
          background: T.panel,
          boxShadow: `inset 0 0.5px 0 0 ${T.ring}`,
        }}
      >
        <div className="flex items-center gap-x-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              background: T.surface,
              boxShadow: E.ringOnly,
              color: T.inkSoft,
            }}
          >
            {footer.icon}
          </span>
          <div>
            <p
              className="text-[13px] font-medium"
              style={{ color: T.ink, letterSpacing: "-0.13px" }}
            >
              {footer.label}
            </p>
            <p
              className="text-[12px]"
              style={{ color: T.inkSoft, letterSpacing: "-0.018px" }}
            >
              {footer.caption}
            </p>
          </div>
        </div>
        <GhostButton href="#" withCaret>
          {footer.cta}
        </GhostButton>
      </div>
    </div>
  );
}

// ─── Mega-menu illustrations — Attio-style wireframe isometric drawings.
// 1px ink stroke on white, dashed lines for hidden edges. No fill except
// pure white. No brand color anywhere — these are architectural diagrams.

const MEGA_STROKE = T.inkSubtle;
const MEGA_HIDDEN = T.inkFaint;

function IllusMegaShield() {
  // Wireframe shield with dashed back face
  return (
    <svg viewBox="0 0 120 80" width="120" height="80" aria-hidden>
      <g stroke={MEGA_HIDDEN} strokeWidth="1" strokeDasharray="2 2" fill="none">
        <path d="M60 18 L46 24" />
        <path d="M46 24 L46 50" />
      </g>
      <path
        d="M60 18 L78 26 L78 50 Q78 66 60 74 Q42 66 42 50 L42 26 L60 18 Z"
        fill="white"
        stroke={MEGA_STROKE}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M52 46 L58 52 L70 40" fill="none" stroke={MEGA_STROKE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IllusMegaCloud() {
  // Three iso wireframe cubes — clouds as 3D objects
  return (
    <svg viewBox="0 0 120 80" width="120" height="80" aria-hidden>
      <g transform="translate(8 14)">
        <g stroke={MEGA_HIDDEN} strokeWidth="1" strokeDasharray="2 2" fill="none">
          <path d="M8 12 L16 8 M8 12 L8 24 M8 12 L24 12" />
        </g>
        <g stroke={MEGA_STROKE} strokeWidth="1.2" fill="white" strokeLinejoin="round">
          <path d="M16 8 L24 12 L24 24 L16 28 L8 24 L8 12 L16 8 Z" />
          <path d="M16 8 L16 20 M16 20 L24 24 M16 20 L8 24" stroke={MEGA_STROKE} fill="none" />
        </g>
      </g>
      <g transform="translate(44 22)">
        <g stroke={MEGA_HIDDEN} strokeWidth="1" strokeDasharray="2 2" fill="none">
          <path d="M8 12 L16 8 M8 12 L8 24 M8 12 L24 12" />
        </g>
        <g stroke={MEGA_STROKE} strokeWidth="1.2" fill="white" strokeLinejoin="round">
          <path d="M16 8 L24 12 L24 24 L16 28 L8 24 L8 12 L16 8 Z" />
          <path d="M16 8 L16 20 M16 20 L24 24 M16 20 L8 24" stroke={MEGA_STROKE} fill="none" />
        </g>
      </g>
      <g transform="translate(80 14)">
        <g stroke={MEGA_HIDDEN} strokeWidth="1" strokeDasharray="2 2" fill="none">
          <path d="M8 12 L16 8 M8 12 L8 24 M8 12 L24 12" />
        </g>
        <g stroke={MEGA_STROKE} strokeWidth="1.2" fill="white" strokeLinejoin="round">
          <path d="M16 8 L24 12 L24 24 L16 28 L8 24 L8 12 L16 8 Z" />
          <path d="M16 8 L16 20 M16 20 L24 24 M16 20 L8 24" stroke={MEGA_STROKE} fill="none" />
        </g>
      </g>
    </svg>
  );
}

function IllusMegaCert() {
  // Wireframe document slab with corner ribbon
  return (
    <svg viewBox="0 0 120 80" width="120" height="80" aria-hidden>
      <g stroke={MEGA_HIDDEN} strokeWidth="1" strokeDasharray="2 2" fill="none">
        <path d="M44 18 L36 22" />
        <path d="M36 22 L36 70" />
      </g>
      <path
        d="M44 18 L84 18 L84 66 L52 66 L36 70 L36 22 L44 18 Z"
        fill="white"
        stroke={MEGA_STROKE}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <line x1="48" y1="30" x2="78" y2="30" stroke={MEGA_HIDDEN} strokeWidth="1" />
      <line x1="48" y1="38" x2="74" y2="38" stroke={MEGA_HIDDEN} strokeWidth="1" />
      <line x1="48" y1="46" x2="70" y2="46" stroke={MEGA_HIDDEN} strokeWidth="1" />
      {/* corner check badge */}
      <circle cx="76" cy="56" r="6" fill="white" stroke={MEGA_STROKE} strokeWidth="1.2" />
      <path d="M73 56 L75 58 L79 54" fill="none" stroke={MEGA_STROKE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IllusMegaCode() {
  // Wireframe pyramid (test pyramid metaphor) with dashed back face
  return (
    <svg viewBox="0 0 120 80" width="120" height="80" aria-hidden>
      <g stroke={MEGA_HIDDEN} strokeWidth="1" strokeDasharray="2 2" fill="none">
        <path d="M60 14 L36 64" />
        <path d="M60 14 L60 64" />
      </g>
      <g stroke={MEGA_STROKE} strokeWidth="1.2" fill="white" strokeLinejoin="round">
        <path d="M60 14 L92 64 L36 64 Z" />
        <path d="M60 14 L84 64" />
        <path d="M60 14 L48 64" />
        <line x1="42" y1="54" x2="86" y2="54" stroke={MEGA_HIDDEN} />
        <line x1="50" y1="34" x2="74" y2="34" stroke={MEGA_HIDDEN} />
      </g>
    </svg>
  );
}

function IllusMegaScale() {
  // Wireframe iso steps — growth in 3D
  return (
    <svg viewBox="0 0 120 80" width="120" height="80" aria-hidden>
      <g stroke={MEGA_HIDDEN} strokeWidth="1" strokeDasharray="2 2" fill="none">
        <path d="M22 60 L30 56" />
        <path d="M22 60 L22 64" />
      </g>
      {/* 4 iso stairs */}
      {[0, 1, 2, 3].map((i) => {
        const x = 22 + i * 18;
        const y = 60 - i * 8;
        return (
          <g key={i} stroke={MEGA_STROKE} strokeWidth="1.2" fill="white" strokeLinejoin="round">
            <path d={`M${x} ${y} L${x + 16} ${y} L${x + 24} ${y - 4} L${x + 8} ${y - 4} Z`} />
            <path d={`M${x + 16} ${y} L${x + 16} ${y + 8} L${x + 24} ${y + 4} L${x + 24} ${y - 4}`} />
            <path d={`M${x} ${y} L${x} ${y + 8} L${x + 16} ${y + 8}`} />
          </g>
        );
      })}
    </svg>
  );
}

function IllusMegaDeadline() {
  // Wireframe iso calendar slab
  return (
    <svg viewBox="0 0 120 80" width="120" height="80" aria-hidden>
      <g stroke={MEGA_HIDDEN} strokeWidth="1" strokeDasharray="2 2" fill="none">
        <path d="M28 22 L36 18" />
        <path d="M28 22 L28 60" />
      </g>
      <g stroke={MEGA_STROKE} strokeWidth="1.2" fill="white" strokeLinejoin="round">
        {/* calendar top face */}
        <path d="M36 18 L84 18 L92 22 L44 22 Z" />
        {/* front face */}
        <path d="M44 22 L92 22 L92 60 L44 60 Z" />
        {/* side face */}
        <path d="M44 22 L36 18 L36 56 L44 60 Z" />
      </g>
      <line x1="48" y1="32" x2="88" y2="32" stroke={MEGA_HIDDEN} strokeWidth="1" />
      {/* date dots */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={52 + col * 10}
            cy={40 + row * 7}
            r="1.4"
            fill={MEGA_HIDDEN}
          />
        ))
      )}
      {/* circled date */}
      <circle cx="72" cy="47" r="5" fill="none" stroke={MEGA_STROKE} strokeWidth="1.4" />
    </svg>
  );
}

function IllusMegaHandshake() {
  // Two interlocking iso cubes — partnership
  return (
    <svg viewBox="0 0 120 80" width="120" height="80" aria-hidden>
      <g transform="translate(20 22)">
        <g stroke={MEGA_HIDDEN} strokeWidth="1" strokeDasharray="2 2" fill="none">
          <path d="M8 14 L18 8" />
          <path d="M8 14 L8 30" />
        </g>
        <g stroke={MEGA_STROKE} strokeWidth="1.2" fill="white" strokeLinejoin="round">
          <path d="M18 8 L28 14 L28 30 L18 36 L8 30 L8 14 L18 8 Z" />
          <path d="M18 8 L18 24 M18 24 L28 30 M18 24 L8 30" stroke={MEGA_STROKE} fill="none" />
        </g>
      </g>
      <g transform="translate(58 22)">
        <g stroke={MEGA_HIDDEN} strokeWidth="1" strokeDasharray="2 2" fill="none">
          <path d="M8 14 L18 8" />
          <path d="M8 14 L8 30" />
        </g>
        <g stroke={MEGA_STROKE} strokeWidth="1.2" fill="white" strokeLinejoin="round">
          <path d="M18 8 L28 14 L28 30 L18 36 L8 30 L8 14 L18 8 Z" />
          <path d="M18 8 L18 24 M18 24 L28 30 M18 24 L8 30" stroke={MEGA_STROKE} fill="none" />
        </g>
      </g>
    </svg>
  );
}

function IllusMegaIndustry() {
  // Five hexagons in perspective — Attio's signature stages illustration
  return (
    <svg viewBox="0 0 120 80" width="120" height="80" aria-hidden>
      {[20, 40, 60, 80, 100].map((cx, i) => {
        const s = 12 - i * 0.4;
        const points = [
          [cx, 40 - s],
          [cx + s * 0.866, 40 - s * 0.5],
          [cx + s * 0.866, 40 + s * 0.5],
          [cx, 40 + s],
          [cx - s * 0.866, 40 + s * 0.5],
          [cx - s * 0.866, 40 - s * 0.5],
        ];
        return (
          <g key={cx}>
            <polygon
              points={points.map((p) => p.join(",")).join(" ")}
              fill="white"
              stroke={MEGA_STROKE}
              strokeWidth="1"
            />
            <line
              x1={cx - s * 0.866 * 0.5}
              y1={40 - s * 0.5 * 0.5}
              x2={cx + s * 0.866 * 0.5}
              y2={40 + s * 0.5 * 0.5}
              stroke={MEGA_HIDDEN}
              strokeWidth="1"
              strokeDasharray="1.5 2"
            />
          </g>
        );
      })}
    </svg>
  );
}

// ─── Buttons ──────────────────────────────────────────────────────────
// ─── Buttons ───────────────────────────────────────────────────────────
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
  return (
    <Link
      href={href}
      data-osto-brand-btn
      className="inline-flex items-center text-white"
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
  return (
    <Link
      href={href}
      data-osto-ghost-btn
      className="inline-flex items-center"
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
      className="relative px-6"
      style={{ paddingTop: "clamp(96px, 14vw, 168px)" }}
    >
      <div className="mx-auto max-w-[820px] text-center">
        <EyebrowPill>SOC 2 · ISO 27001 · HIPAA · GDPR</EyebrowPill>

        {/* Eyebrow → H1 is a tight pairing (12px). The previous 20px gap
            visually orphaned the eyebrow from the headline. */}
        <h1
          className="text-balance"
          style={{
            fontFamily: T.fontDisplay,
            fontWeight: 500,
            color: T.ink,
            fontSize: "clamp(40px, 6vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.022em",
            marginTop: S.sm,
            marginInline: "auto",
            maxWidth: 760,
          }}
        >
          Compliance is the byproduct of security.{" "}
          <span style={{ color: T.accent }}>We fix both.</span>
        </h1>

        {/* H1 → lead has more air (24px). Lead is one focused sentence;
            the price/timeline pitch moved to the trust line below. */}
        <p
          className="mx-auto text-pretty"
          style={{
            color: T.inkStrong,
            fontSize: "clamp(16px, 1.4vw, 18px)",
            lineHeight: 1.45,
            letterSpacing: "-0.012em",
            marginTop: S.lg,
            maxWidth: 560,
          }}
        >
          One platform for cloud, app, endpoint, and network security with
          built-in compliance, VAPT, and questionnaires.
        </p>

        {/* Lead → CTAs has the most air (40px). Gives the buttons
            their own visual zone and lets them carry weight.
            Wraps to a column on narrow screens so two md buttons
            don't overflow at 320px. */}
        <div
          className="flex flex-col items-center justify-center sm:flex-row"
          style={{ marginTop: S.xxl, gap: S.sm }}
        >
          <BrandButton href="#" size="md">Book a 30-min demo</BrandButton>
          <GhostButton href="#" size="md" withCaret>
            Start 7-day free trial
          </GhostButton>
        </div>

        {/* Trust line — small, quiet. Carries the "live in days, from
            $999/month" claim that was crowding the lead. */}
        <p
          className="mx-auto"
          style={{
            ...Type.caption,
            color: T.inkSubtle,
            marginTop: S.md,
          }}
        >
          Live in days · from $999/month · no credit card
        </p>
      </div>
    </section>
  );
}

function EyebrowPill({ children }: { children: React.ReactNode }) {
  // Small label that introduces an H1/H2. Tight letter-spacing, muted ink.
  return (
    <span
      className="inline-flex items-center"
      style={{ ...Type.eyebrow, color: T.inkSubtle }}
    >
      {children}
    </span>
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
    // Handpickd — single chevron pinch, evokes a "hand" gesture
    name: "Handpickd",
    font: "var(--font-sans)",
    weight: 600,
    tracking: "-0.3px",
    mark: (c) => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M4 6 L10 12 L16 6"
          stroke={c}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 13.5 L10 19 L16 13.5"
          stroke={c}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.45"
        />
      </svg>
    ),
  },
  {
    // smallcase — three concentric dots in a horizontal row, "cases"
    name: "smallcase",
    font: "var(--font-sans)",
    weight: 500,
    tracking: "-0.4px",
    mark: (c) => (
      <svg width="22" height="18" viewBox="0 0 24 18" fill="none" aria-hidden>
        <circle cx="5" cy="9" r="3.5" fill={c} opacity="0.35" />
        <circle cx="12" cy="9" r="3.5" fill={c} opacity="0.7" />
        <circle cx="19" cy="9" r="3.5" fill={c} />
      </svg>
    ),
  },
  {
    // AMNIC — geometric "A" monogram in a rounded square
    name: "AMNIC",
    font: "var(--font-sans)",
    weight: 700,
    tracking: "0.6px",
    mark: (c) => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="1" y="1" width="18" height="18" rx="4.5" stroke={c} strokeWidth="1.6" fill="none" />
        <path
          d="M5.5 14 L10 5.5 L14.5 14 M7.4 11.2 H12.6"
          stroke={c}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    // TCA — three vertical bars, ascending. Reads as analytics/finance.
    name: "TCA",
    font: "var(--font-sans)",
    weight: 700,
    tracking: "1.4px",
    mark: (c) => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        <rect x="2.5"  y="11" width="3.4" height="7" rx="0.6" fill={c} opacity="0.45" />
        <rect x="8.3"  y="7"  width="3.4" height="11" rx="0.6" fill={c} opacity="0.7" />
        <rect x="14.1" y="3"  width="3.4" height="15" rx="0.6" fill={c} />
      </svg>
    ),
  },
  {
    // PixelDust — a 3×3 dot matrix with one corner pixel detached
    name: "PixelDust",
    font: "var(--font-sans)",
    weight: 600,
    tracking: "-0.2px",
    mark: (c) => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={3 + col * 5}
              y={3 + row * 5}
              width="3"
              height="3"
              rx="0.6"
              fill={c}
              opacity={row === 0 && col === 2 ? 0.35 : 1}
            />
          ))
        )}
        {/* detached pixel — top-right corner drifting away */}
        <rect x="17" y="0.5" width="2.2" height="2.2" rx="0.5" fill={c} opacity="0.55" />
      </svg>
    ),
  },
];

function LogoStrip() {
  // Slightly muted ink so the strip reads as a quiet credibility row,
  // not as primary content. All marks + wordmarks share this color.
  const logoInk = T.inkMid;

  return (
    <section className="px-6 pt-20 md:pt-24">
      <div className="mx-auto max-w-[980px]">
        <p
          className="text-center"
          style={{ ...Type.body, color: T.inkSubtle }}
        >
          Trusted by fast-growing teams across India and MENA
        </p>
        <ul
          className="flex flex-wrap items-center justify-center"
          style={{
            marginTop: S.xl,
            columnGap: S.xxl,
            rowGap: S.md,
          }}
        >
          {LOGO_MARKS.map((logo) => (
            <li
              key={logo.name}
              className="inline-flex items-center"
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
function HowItWorks() {
  return (
    <section className="pt-4">
      {/* Full-bleed panel anchored to the global page rails — uses the
          same RAIL_INSET formula as PageRails plus 1px so the panel
          stops just inside the rail line, leaving it visible as a
          hairline boundary on each side. Top + bottom inset hairlines
          provide the same boundary above/below. */}
      <div
        className="relative overflow-hidden"
        style={{
          background: T.panel,
          marginLeft: `calc(${RAIL_INSET} + 1px)`,
          marginRight: `calc(${RAIL_INSET} + 1px)`,
          boxShadow: `inset 0 1px 0 0 ${RAIL_STROKE}, inset 0 -1px 0 0 ${RAIL_STROKE}`,
        }}
      >
        <div className="relative grid gap-y-10 px-6 py-10 md:grid-cols-2 md:gap-x-12 md:px-12 md:py-16">
          {/* Left copy — left-aligned inline (overrides SectionHeading's
              md:text-center default since we're inside a two-column layout) */}
          <div className="relative z-10 self-center">
            <h2
              className="text-balance text-[32px] leading-[38px] tracking-[-0.8px] md:text-[40px] md:leading-[44px] md:tracking-[-1px]"
              style={{
                fontFamily: T.fontDisplay,
                fontWeight: 500,
                color: T.ink,
              }}
            >
              How it works.
            </h2>
            <p
              className="mt-4 max-w-[42ch] text-[16px] leading-[24px]"
              style={{ color: T.inkSoft, letterSpacing: "-0.24px" }}
            >
              Wire up Osto in an afternoon. Controls go live first, evidence
              collects itself, auditors get a portal. No spreadsheets, no
              scramble.
            </p>
            <ol className="mt-8 space-y-4">
              <Step n={1}>Connect cloud, code, and devices via OAuth.</Step>
              <Step n={2}>Controls deploy in hours. Evidence starts flowing.</Step>
              <Step n={3}>Auditor reviews from a live portal. No email back-and-forth.</Step>
            </ol>
          </div>

          {/* Right illustration: console preview on dashed grid */}
          <div className="relative">
            <DashedGrid />
            <div
              className="relative z-10 ml-auto mt-2 w-full max-w-[440px] rounded-2xl p-5"
              style={{ background: T.surface, boxShadow: E.card }}
            >
              <p
                className="text-[13px] font-semibold tracking-[-0.13px]"
                style={{ color: T.ink }}
              >
                Add control
              </p>
              <p
                className="mt-1 text-[12px]"
                style={{ color: T.inkSoft, letterSpacing: "-0.018px" }}
              >
                Source
              </p>
              <div
                className="mt-2 grid grid-cols-2 gap-1 rounded-[10px] p-1"
                style={{ background: T.panel, boxShadow: E.ringOnly }}
              >
                <button
                  className="rounded-[8px] py-2 text-[13px] font-medium tracking-[-0.13px]"
                  style={{
                    background: T.surface,
                    color: T.ink,
                    boxShadow: E.ringOnly,
                  }}
                >
                  Cloud
                </button>
                <button
                  className="rounded-[8px] py-2 text-[13px] font-medium tracking-[-0.13px]"
                  style={{ color: T.inkSoft }}
                >
                  Endpoint
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-3">
                <Field label="Control ID" value="SOC2-CC6.1" />
                <Field label="Status" value="Live" status="ok" />
              </div>
              <div className="mt-3">
                <Field label="Owner" value="security@osto.one" />
              </div>
              <div className="mt-5 flex justify-end gap-x-2">
                <GhostButton href="#">Cancel</GhostButton>
                <BrandButton href="#">Add control</BrandButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-x-3">
      <span
        className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-medium text-white tabular-nums"
        style={{ background: T.accent }}
      >
        {n}
      </span>
      <span
        className="text-[16px] leading-[24px]"
        style={{ color: T.ink, letterSpacing: "-0.24px" }}
      >
        {children}
      </span>
    </li>
  );
}

function Field({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: "ok";
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
        className="mt-1 flex items-center gap-x-2 rounded-[8px] px-3 py-2 text-[14px] leading-[20px]"
        style={{
          background: T.surface,
          color: T.ink,
          boxShadow: E.ringOnly,
        }}
      >
        {status === "ok" && (
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "#19a974" }}
          />
        )}
        {value}
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="pt-4">
      <div className="mx-auto max-w-[1240px] px-6">
        <SectionHeading>
          The old way is slow,{" "}
          <span style={{ color: T.accent }}>complex, and expensive.</span>
        </SectionHeading>
        <p
          className="mx-auto mt-4 max-w-[600px] text-center text-[15px] leading-[24px]"
          style={{ color: T.inkSoft, letterSpacing: "-0.15px" }}
        >
          Most teams stitch together a WAF, an endpoint agent, a compliance
          platform, and a VAPT firm. You pay six invoices, watch four
          dashboards, and still have gaps you cannot see.
        </p>
      </div>

      {/* Two panels split the rail-bounded area edge to edge.
          Stack vertically below md so the hero metrics don't crush. */}
      <div
        className="mt-12 grid grid-cols-1 md:[grid-template-columns:minmax(0,12fr)_minmax(0,14fr)]"
        style={{
          marginLeft: `calc(${RAIL_INSET} + 1px)`,
          marginRight: `calc(${RAIL_INSET} + 1px)`,
        }}
      >
        <ComparisonPanel
          tone="neutral"
          label="Without Osto"
          title="Six vendors. Six invoices."
          metric="$100K–$150K"
          metricCaption="approximate annual spend"
          timeline="6–9 months"
          timelineCaption="vendors, audits, scans, follow-ups"
          tagsLabel="Replaces"
          tags={["Cloudflare", "CrowdStrike", "Wiz", "Vanta", "Okta", "VAPT firm"]}
        />
        <ComparisonPanel
          tone="brand"
          label="With Osto"
          title="One platform. One team."
          metric="$999"
          metricCaption="monthly, single invoice"
          timeline="Days, not months"
          timelineCaption="security, compliance, and VAPT live"
          tagsLabel="Includes"
          tags={["WAF", "CSPM", "ZTNA", "Compliance", "VAPT", "Questionnaires"]}
        />
      </div>

      <div className="mx-auto max-w-[1240px] px-6">
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
    { from: "6 vendors", to: "1 platform", label: "Procurement" },
    { from: "6–9 months", to: "Days", label: "Time to live" },
    { from: "$100K–$150K", to: "$999/mo", label: "Spend" },
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

/**
 * SketchPortrait — Attio-inspired "pencil drawing" of a head-and-shoulders
 * silhouette. Pure 1px stroke, no fill, deliberately incomplete around the
 * edges so it reads as a hand-drawn sketch and not a UI avatar. Geometry
 * varies subtly by name hash so every customer reads as a different person.
 */
function SketchPortrait({ seed }: { seed: string }) {
  // Deterministic hash → 0..1
  const h = (i: number) => {
    let x = 0;
    for (let k = 0; k < seed.length; k++) x = (x * 31 + seed.charCodeAt(k) + i) | 0;
    return ((x % 1000) + 1000) % 1000 / 1000;
  };
  const headW = 17 + h(1) * 4; // 17..21
  const jaw = 0.3 + h(2) * 0.4; // jawline curvature
  const hairOff = h(3) * 6 - 3; // hair sweep
  const eyeOff = h(4) * 1.5;
  const stroke = "rgba(38,38,43,0.55)";
  const stroke2 = "rgba(38,38,43,0.30)";
  return (
    <svg width="44" height="44" viewBox="0 0 50 50" aria-hidden>
      {/* shoulders / collar — sketchy, unclosed */}
      <path
        d={`M 6 49 Q 14 36 25 36 Q 36 36 44 49`}
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* neck */}
      <path
        d={`M 21 36 L 21 31 M 29 36 L 29 31`}
        fill="none"
        stroke={stroke2}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* head outline */}
      <path
        d={`M 25 8 Q ${25 + headW / 2} 8 ${25 + headW / 2} ${17} Q ${25 + headW / 2} ${24 + jaw * 4} 25 ${30} Q ${25 - headW / 2} ${24 + jaw * 4} ${25 - headW / 2} ${17} Q ${25 - headW / 2} 8 25 8 Z`}
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* hair sweep */}
      <path
        d={`M ${25 - headW / 2 + 1} ${14} Q ${25 + hairOff} 4 ${25 + headW / 2 - 1} ${13}`}
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* eyes — small dashes, slightly offset */}
      <line x1={20 + eyeOff * 0.5} y1="19" x2={22 + eyeOff * 0.5} y2="19" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
      <line x1={28 + eyeOff * 0.5} y1="19" x2={30 + eyeOff * 0.5} y2="19" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
      {/* mouth */}
      <path d={`M 22 25 Q 25 ${26 + h(5)} 28 25`} fill="none" stroke={stroke2} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// ─── Customer stories — 4 testimonial cards ───────────────────────────
type Story = { stage: string; quote: string; name: string; role: string };
const STORIES: Story[] = [
  {
    stage: "Series A",
    quote:
      "When our term sheet came with a mandatory security checklist, Osto gave us cloud posture from day one and ran the full VAPT end-to-end. The deal closed inside the investor timeline.",
    name: "Nitin Gupta",
    role: "Co-founder & CTO, Handpickd",
  },
  {
    stage: "Series D",
    quote:
      "We needed a thorough security assessment before launching a new application. Osto handled the complete web and API assessment, remediation, and final report in 7 working days.",
    name: "Vipul Rawal",
    role: "New initiatives, smallcase",
  },
  {
    stage: "Seed",
    quote:
      "Early-stage team, no time to spare. Osto completed a full web and API assessment fast, with zero back-and-forth and a report we could hand to enterprise prospects.",
    name: "Sathya Narayanan Nagarajan",
    role: "Co-founder, AMNIC",
  },
  {
    stage: "Bootstrapped",
    quote:
      "We're a registered e-invoicing vendor under the FTA Dubai. Osto onboarded us onto WAF and CSPM within days, helped us assemble evidence, and we cleared the FTA review.",
    name: "Kanishka Garg",
    role: "Founder, TCA",
  },
];

function CustomerStories() {
  return (
    <section className="px-6 pt-4">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading>
          How growing teams move{" "}
          <span style={{ color: T.accent }}>faster, with confidence.</span>
        </SectionHeading>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {STORIES.map((s) => (
            <article
              key={s.name}
              className="rounded-2xl p-7"
              style={{ background: T.surface, boxShadow: E.card }}
            >
              <p
                className="text-[14px] font-medium leading-[20px]"
                style={{ color: T.accent }}
              >
                {s.stage}
              </p>
              <p
                className="mt-4 text-[16px] leading-[24px]"
                style={{
                  color: T.ink,
                  fontFamily: T.fontDisplay,
                  letterSpacing: "-0.24px",
                }}
              >
                &ldquo;{s.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-x-3">
                <SketchPortrait seed={s.name} />
                <div>
                  <p
                    className="text-[14px] font-medium leading-[20px]"
                    style={{ color: T.ink }}
                  >
                    {s.name}
                  </p>
                  <p className="text-[14px] leading-[20px]" style={{ color: T.inkSoft }}>
                    {s.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing calculator — interactive, AG-pattern 3-column ────────────
type AudienceKey = "seed" | "seriesA" | "seriesBplus" | "custom";

const AUDIENCE_DEFAULTS: Record<
  AudienceKey,
  { label: string; users: number; reqs: number; modules: string[]; vapt: boolean }
> = {
  seed: {
    label: "Seed",
    users: 10,
    reqs: 100,
    modules: ["cloud", "endpoint"],
    vapt: false,
  },
  seriesA: {
    label: "Series A",
    users: 25,
    reqs: 200,
    modules: ["cloud", "endpoint", "network", "compliance"],
    vapt: true,
  },
  seriesBplus: {
    label: "Series B+",
    users: 80,
    reqs: 500,
    modules: ["cloud", "application", "endpoint", "network", "compliance"],
    vapt: true,
  },
  custom: {
    label: "Enterprise",
    users: 50,
    reqs: 300,
    modules: ["cloud", "endpoint", "compliance"],
    vapt: false,
  },
};

const MODULE_BUNDLES: { key: string; label: string; price: number }[] = [
  { key: "cloud", label: "Cloud (CSPM, WAF, API)", price: 299 },
  { key: "application", label: "Application (Scanners, SAST/SBOM)", price: 199 },
  { key: "endpoint", label: "Endpoint (7 modules)", price: 249 },
  { key: "network", label: "Network (ZTNA, Domain Filter)", price: 149 },
  { key: "compliance", label: "Compliance & Audits (5 modules)", price: 249 },
];

const PLATFORM_FEE = 199; // monthly base
const USER_PRICE = 8; // per endpoint user / month
const REQ_PRICE_PER_100K = 49; // per 100K req/mo
const VAPT_PRICE = 999; // one-time

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
    <section className="px-6 pt-4" id="calculator">
      <div className="mx-auto max-w-[1180px]">
        <p
          className="text-center text-[12px] font-medium"
          style={{ color: T.accent, letterSpacing: "-0.018px" }}
        >
          Pricing calculator
        </p>
        <h2
          className="mx-auto mt-4 max-w-[680px] text-balance text-center text-[32px] leading-[38px] tracking-[-0.8px] md:text-[40px] md:leading-[44px] md:tracking-[-1px]"
          style={{
            fontFamily: T.fontDisplay,
            fontWeight: 500,
            color: T.ink,
          }}
        >
          Pay only for the modules{" "}
          <span style={{ color: T.accent }}>you turn on.</span>
        </h2>
        <p
          className="mx-auto mt-3 max-w-[480px] text-center text-[14px] leading-[24px]"
          style={{ color: T.inkSoft, letterSpacing: "-0.14px" }}
        >
          Drag the sliders, toggle the modules. The total updates as you go.
        </p>

        {/* Audience tabs */}
        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Pricing audience"
            className="inline-flex items-center gap-x-1 rounded-full p-1"
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
                  className="rounded-full px-3.5 py-1.5 text-[13px] font-medium tracking-[-0.13px] transition-[background-color,color,box-shadow,scale] duration-200 ease-out active:scale-[0.96]"
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
        className="mt-16 overflow-hidden"
        style={{
          background: T.surface,
          marginLeft: `calc(${RAIL_INSET} + 1px)`,
          marginRight: `calc(${RAIL_INSET} + 1px)`,
          boxShadow: `inset 0 1px 0 0 ${RAIL_STROKE}, inset 0 -1px 0 0 ${RAIL_STROKE}`,
        }}
      >
          <div className="relative grid lg:grid-cols-[1fr_1.2fr_1fr]">
            {/* Column 1: line items */}
            <div
              className="flex flex-col gap-y-8 p-8 md:p-10"
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
                caption="Includes dashboard, evidence sync, audit portal."
              />
              <CalcLineItem
                label="Per endpoint user"
                price={`$${USER_PRICE}/user/mo`}
                caption="Antimalware, encryption, ZTNA, DLP per device."
              />
              <CalcLineItem
                label="Web & API traffic"
                price={`$${REQ_PRICE_PER_100K}/100K req/mo`}
                caption="WAF, API protection, bot blocking."
              />
              <CalcLineItem
                label="VAPT (one-time)"
                price={`$${VAPT_PRICE}`}
                caption="OSCP-led, web + API + mobile, 7-day delivery."
              />
            </div>

            {/* Column 2: inputs — dotted product-mockup grid + dashed right divider */}
            <div
              className="relative flex flex-col gap-y-7 p-8 md:p-10"
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
                label="Endpoint users"
                value={users}
                min={5}
                max={500}
                step={5}
                onChange={setUsers}
                format={(v) => `${v} ${v === 1 ? "user" : "users"}`}
              />
              <CalcSlider
                label="Web/API requests"
                value={reqs}
                min={100}
                max={2000}
                step={50}
                onChange={setReqs}
                format={(v) =>
                  v >= 1000 ? `${(v / 1000).toFixed(1)}M req/mo` : `${v}K req/mo`
                }
              />

              <div>
                <p
                  className="mb-3 text-[13px] font-medium"
                  style={{ color: T.ink, letterSpacing: "-0.13px" }}
                >
                  Module bundles
                </p>
                <ul className="space-y-2">
                  {MODULE_BUNDLES.map((m) => {
                    const checked = modules.includes(m.key);
                    return (
                      <li key={m.key}>
                        <label
                          className="flex cursor-pointer items-center justify-between rounded-[10px] p-2.5 transition-colors hover:bg-black/[0.02]"
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
                              className="flex h-4 w-4 items-center justify-center rounded-[5px] transition-[background-color,box-shadow] duration-200 ease-out"
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
                className="flex cursor-pointer items-center justify-between rounded-[10px] p-3"
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
                    className="flex h-4 w-4 items-center justify-center rounded-[5px] transition-[background-color,box-shadow] duration-200 ease-out"
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
                      Add OSCP-led VAPT
                    </span>
                    <span
                      className="block text-[12px] leading-[16px]"
                      style={{ color: T.inkSubtle }}
                    >
                      One-time engagement, 7-day delivery
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
            <div className="flex flex-col gap-y-5 p-8 md:p-10">
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
                label={`${users} endpoint ${users === 1 ? "user" : "users"} × 12`}
                value={`$${(userCost * 12).toLocaleString()}`}
              />
              <SummaryRow
                label={`${reqs}K req/mo × 12`}
                value={`$${(reqCost * 12).toLocaleString()}`}
              />
              {modules.length > 0 && (
                <SummaryRow
                  label={`${modules.length} module ${modules.length === 1 ? "bundle" : "bundles"} × 12`}
                  value={`$${(moduleCost * 12).toLocaleString()}`}
                />
              )}
              {vapt && (
                <SummaryRow
                  label="VAPT (one-time)"
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
                className="text-[14px] leading-[20px]"
                style={{ color: T.inkSubtle }}
              >
                Annual billing · 2 months free vs monthly. Includes
                onboarding, audit portal, and Slack support.
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
          className="rounded-md px-2 py-0.5 text-[12px] font-medium tabular-nums"
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
  "Web App & API Protection (200K req/mo)",
  "Web Scanner & Mobile App Scanner",
  "Secure Server Access (ZTNA)",
  "Security + Compliance + VAPT + Questionnaire",
  "Up to 20 endpoint users",
];

const CUSTOM_FEATURES = [
  "Unlimited requests & resources",
  "Dedicated support",
  "Custom integrations",
  "Priority onboarding",
  "SLA guarantee",
];

function Pricing() {
  return (
    <section className="px-6 pt-4" id="pricing">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading>
          Start small. Add modules{" "}
          <span style={{ color: T.accent }}>as you scale.</span>
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
              name="Platform"
              description="Growing teams and SaaS startups."
            />
            <PriceAmount
              amount="$999"
              cadence="/month"
              footnote="$10,000 billed annually, 7-day free trial"
            />

            <div
              className="flex flex-col sm:flex-row sm:items-center"
              style={{ marginTop: S.lg, gap: S.xs }}
            >
              <BrandButton href="#">Book demo</BrandButton>
              <GhostButton href="#" withCaret>
                Start free trial
              </GhostButton>
            </div>

            <FeatureList items={PLATFORM_FEATURES} />
          </PricingTier>

          <PricingTier variant="flat">
            <PriceLabel
              name="Custom"
              description="Specific scope or scale."
            />
            <PriceAmount
              amount="Let's talk"
              footnote="Custom pricing tuned to your scope."
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
    <article
      className={
        isElevated
          ? "relative p-6 md:p-10"   // S.lg → S.cardPaddingLg
          : "relative md:pl-2"        // flat: inherits page gutter, tiny optical inset on md
      }
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

// ─── Why trust Osto — 3 credibility pillars ───────────────────────────
function WhyTrust() {
  return (
    <section className="px-6 pt-4">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading>
          Built by people who&apos;ve{" "}
          <span style={{ color: T.accent }}>seen security fail.</span>
        </SectionHeading>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <TrustPillar
            big="2×"
            heading="Cybersecurity founders"
            body="14+ years across network security, red teaming, and enterprise infrastructure. Security is all we&apos;ve ever done."
          />
          <TrustPillar
            big="SOC 2 + ISO 27001"
            heading="We run our own stack"
            body="Every module we sell runs in our own platform. The certificate is a byproduct of real security, not the other way around."
          />
          <TrustPillar
            big="20+"
            heading="Modules built in-house"
            body="No third-party patchwork. Every module is built, maintained, and integrated by Osto. Full visibility, zero gaps between tools."
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
      className="rounded-2xl p-7"
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
        className="mt-4 text-[16px] font-medium leading-[24px]"
        style={{
          color: T.ink,
          fontFamily: T.fontDisplay,
          letterSpacing: "-0.24px",
        }}
      >
        {heading}
      </h3>
      <p
        className="mt-2 text-[16px] leading-[24px]"
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
    q: "Are we too early as a startup to use Osto?",
    a: "No. Most of our customers are seed to Series B. The earlier you start, the less retrofitting you do later. Platform pricing is built so a small team can afford full coverage from day one.",
  },
  {
    q: "How does Osto help us get SOC 2 or ISO 27001 ready?",
    a: "Controls deploy live across your stack and start collecting their own evidence. Our team maps your existing setup to the framework, fills gaps with platform modules, and walks the auditor through the portal.",
  },
  {
    q: "Do we need to hire a security engineer first?",
    a: "No. Osto is the security team for most of our customers. Founders and CTOs onboard in under an hour and our engineers handle setup, evidence, and audit support end-to-end.",
  },
  {
    q: "How is Osto different from Vanta or Oneleet?",
    a: "Vanta and Oneleet are compliance dashboards. They tell you what controls you need, then expect you to buy and run them elsewhere. Osto is the security stack plus the compliance layer, in one platform with one invoice.",
  },
  {
    q: "What compliance frameworks does Osto cover?",
    a: "SOC 2 Type I and II, ISO 27001, HIPAA, GDPR, and PCI-DSS readiness. Most customers run two or more of these in parallel from the same platform.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-6 pt-4">
      <div className="mx-auto max-w-[820px]">
        <SectionHeading>
          Questions{" "}
          <span style={{ color: T.accent }}>you probably have.</span>
        </SectionHeading>

        <ul
          className="mt-10 overflow-hidden rounded-2xl"
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
                  className="flex w-full items-start justify-between gap-x-4 px-6 py-5 text-left transition-colors hover:bg-black/[0.015]"
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
                    className="overflow-hidden px-6 text-[16px] leading-[24px]"
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
    // all four sides. Left/right edges land at RAIL_INSET; top/bottom
    // are pulled flush against the surrounding SectionSpacer rails via
    // negative vertical margins (cancels the spacer's 56px outer gap).
    <section className="relative">
      <div
        className="relative overflow-hidden px-8 py-14 md:px-14 md:py-20"
        style={{
          background: BUTTON_BRAND_BG,
          marginLeft: RAIL_INSET,
          marginRight: RAIL_INSET,
          marginTop: -56,
          marginBottom: -56,
        }}
      >
        <div className="text-center">
          <h1
            className="mx-auto max-w-[720px] text-balance text-center text-white text-[40px] leading-[44px] tracking-[-1px] md:text-[56px] md:leading-[56px] md:tracking-[-1.4px]"
            style={{
              fontFamily: T.fontDisplay,
              fontWeight: 500,
            }}
          >
            Stronger security now. Smoother audits later.
          </h1>
          <p
            className="mx-auto mt-4 max-w-[560px] text-[16px] leading-[24px] md:text-[18px] md:leading-[26px]"
            style={{
              color: "rgba(255,255,255,0.78)",
              letterSpacing: "-0.24px",
            }}
          >
            Cloud, app, endpoint, and network protection live in days. SOC 2
            and ISO 27001 ready in weeks. One platform, one invoice.
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-2">
            <GhostButton href="#">Book a demo</GhostButton>
            {/* Outline-on-dark variant — matches the shared button spec
                (rounded-10, px-3 py-[6px], text-[13px], leading-[24px])
                but with a white hairline + transparent fill so it reads
                against the navy band. */}
            <Link
              href="#"
              className="inline-flex items-center gap-x-1.5 rounded-[10px] px-3 py-[6px] text-[13px] font-medium leading-[24px] tracking-[-0.13px] text-white transition-colors hover:bg-white/10"
              style={{
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)",
              }}
            >
              Start 7-day free trial
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {["SOC 2 Type II", "ISO 27001", "HIPAA", "OSCP-led VAPT"].map(
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

// ─── Quadrant grid (legacy, no longer composed) ───────────────────────
function QuadrantGrid() {
  return (
    <section className="pt-20">
      <SectionHeading>Valuable tools that power growing teams</SectionHeading>

      <div className="mx-auto mt-10 max-w-[1180px] px-6">
        <div className="grid md:grid-cols-2">
          <QuadTile
            title="Audit-ready in days, not quarters"
            body="Our team runs the readiness work in our own platform — controls go live, evidence collects itself, and your SOC 2 deadline stops being a wall."
            illustration={<IllusCertScene />}
            border="r b"
          />
          <QuadTile
            title="Global coverage. Live infrastructure."
            body="We block threats across regions with 99.99% uptime, on infrastructure that spans every cloud you depend on."
            illustration={<IllusGlobe />}
            border="b"
          />
          <QuadTile
            title="Endpoint posture, on every device"
            body="Real-time antimalware, encryption, ZTNA, and DLP — all enrolled and reporting from the day a device joins the team."
            illustration={<IllusEndpoint />}
            border="r"
          />
          <QuadTile
            title="OSCP-led penetration testing"
            body="Real engineers, not scripts. Web + API + mobile assessment with retest and a diligence-ready report in 7 days."
            illustration={<IllusVAPT />}
          />
        </div>
      </div>
    </section>
  );
}

function QuadTile({
  title,
  body,
  illustration,
  border,
}: {
  title: string;
  body: string;
  illustration: React.ReactNode;
  border?: string;
}) {
  // AG geometry: 400px tall, copy bottom-anchored, illustration absolute
  // top, 0.5px hairlines using a pseudo-element via box-shadow rings.
  const right = border?.includes("r");
  const bottom = border?.includes("b");
  return (
    <article
      className="relative flex h-[400px] flex-col justify-end overflow-hidden md:h-[440px]"
      style={{
        boxShadow: [
          right ? `inset -0.5px 0 0 0 ${T.panelHairline}` : "",
          bottom ? `inset 0 -0.5px 0 0 ${T.panelHairline}` : "",
        ]
          .filter(Boolean)
          .join(", "),
      }}
    >
      <div className="pointer-events-none absolute inset-0 select-none">
        {illustration}
      </div>
      <div className="relative flex flex-col gap-y-2 px-4 pb-6 sm:px-6 lg:px-10">
        <h3
          className="font-medium"
          style={{
            fontFamily: T.fontDisplay,
            color: T.ink,
            fontSize: "18px",
            lineHeight: "24px",
            letterSpacing: "-0.27px",
          }}
        >
          {title}
        </h3>
        <p
          className="max-w-[520px] md:max-w-none"
          style={{
            color: T.inkSoft,
            fontSize: "14px",
            lineHeight: "24px",
            letterSpacing: "-0.14px",
          }}
        >
          {body}
        </p>
      </div>
    </article>
  );
}

// ─── Quadrant illustrations — original, AG style language ─────────────

// 1. Compliance dossier scene (parallel to AG's stamp scene)
function IllusCertScene() {
  return (
    <div className="flex justify-center pt-12 pr-5 sm:pr-[9px]">
      <div className="relative w-full max-w-[406px]">
        {/* Document card */}
        <div
          className="relative mx-auto w-[78%] rounded-[10px] p-4"
          style={{ background: T.surface, boxShadow: E.card }}
        >
          <p
            className="text-[12px] font-medium leading-[16px]"
            style={{ color: T.inkSubtle }}
          >
            SOC 2 Type II · Readiness
          </p>
          <p
            className="mt-1.5 text-[14px] font-medium leading-[20px]"
            style={{ color: T.ink }}
          >
            142 controls auto-mapped
          </p>
          <div className="mt-3 space-y-1.5">
            {[100, 86, 72].map((w, i) => (
              <div
                key={i}
                className="h-1 w-full rounded-full"
                style={{ background: T.panel }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${w}%`, background: T.accent }}
                />
              </div>
            ))}
          </div>
          <p
            className="mt-3 text-[10px]"
            style={{ color: T.inkMid }}
          >
            CC6.1 access controls · live
          </p>
        </div>

        {/* "Audit-ready" stamp */}
        <div
          className="absolute -right-1 top-2 flex h-[120px] w-[120px] -rotate-[14deg] items-center justify-center rounded-full"
          style={{
            border: `1.5px solid ${T.accent}`,
            color: T.accent,
          }}
        >
          <div className="text-center">
            <p
              className="text-[14px] font-medium leading-[16px]"
              style={{ color: T.accent }}
            >
              Audit
              <br />
              Ready
            </p>
            <p
              className="mt-1 text-[11px] font-medium leading-[14px]"
              style={{ color: T.accent, opacity: 0.7 }}
            >
              06/2026
            </p>
          </div>
          {/* Outer rotated ring text */}
          <svg
            className="absolute inset-0 animate-[spin_24s_linear_infinite]"
            viewBox="0 0 120 120"
            aria-hidden
          >
            <defs>
              <path id="cs" d="M 60,60 m -52,0 a 52,52 0 1,1 104,0 a 52,52 0 1,1 -104,0" />
            </defs>
            <text style={{ fontSize: "8px", letterSpacing: "0.18em", fill: T.accent, opacity: 0.7 }}>
              <textPath href="#cs">CERTIFIED · BY OSTO · CERTIFIED · BY OSTO · </textPath>
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

// 2. Globe — original SVG, AG composition (radial mask, ring, soft shadow)
function IllusGlobe() {
  return (
    <div className="absolute inset-0">
      {/* "All systems operational" label */}
      <div className="absolute right-6 top-6 z-10 flex items-center gap-x-2">
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: T.accent }}
        />
        <p
          className="text-[12px] font-medium"
          style={{ color: T.accent, letterSpacing: "-0.018px" }}
        >
          All systems operational
        </p>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage: "radial-gradient(75% 80% at 50% 25%, #000 27%, transparent 85%)",
          maskImage: "radial-gradient(75% 80% at 50% 25%, #000 27%, transparent 85%)",
        }}
      >
        <div className="absolute -bottom-[72px] left-1/2 h-[390px] w-[390px] -translate-x-1/2">
          <div
            className="absolute inset-0 overflow-hidden rounded-full"
            style={{ boxShadow: E.globe }}
          >
            <SvgGlobe />
          </div>
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: `1.5px solid rgba(38,38,43,0.20)` }}
          />
          {/* Region pins */}
          <Pin x={32} y={32} />
          <Pin x={62} y={28} />
          <Pin x={70} y={48} />
          <Pin x={26} y={56} />
        </div>
      </div>
    </div>
  );
}

function SvgGlobe() {
  // Lightweight SVG approximation of a globe — concentric latitude/longitude
  // arcs in soft gray. Faithful to AG's silvered-globe look without three.js.
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="globeShade" cx="50%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f5f5f7" />
          <stop offset="100%" stopColor="#dfe0e6" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="98" fill="url(#globeShade)" />
      {/* Longitudes */}
      {[20, 40, 60, 80, 100, 120, 140, 160, 180].map((x) => (
        <ellipse
          key={`lon-${x}`}
          cx="100"
          cy="100"
          rx={Math.abs(100 - x) * 0.95 + 2}
          ry="98"
          fill="none"
          stroke={T.inkLine}
          strokeWidth="0.5"
          opacity="0.6"
        />
      ))}
      {/* Latitudes */}
      {[20, 40, 60, 80, 100, 120, 140, 160, 180].map((y) => (
        <ellipse
          key={`lat-${y}`}
          cx="100"
          cy="100"
          rx="98"
          ry={Math.abs(100 - y) * 0.95 + 2}
          fill="none"
          stroke={T.inkLine}
          strokeWidth="0.5"
          opacity="0.6"
        />
      ))}
    </svg>
  );
}

function Pin({ x, y }: { x: number; y: number }) {
  return (
    <span
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: "10px",
        height: "10px",
        transform: "translate(-50%, -50%)",
      }}
    >
      <span
        className="absolute inset-0 animate-ping rounded-full opacity-50"
        style={{ background: T.accent }}
      />
      <span
        className="absolute inset-[2px] rounded-full"
        style={{
          background: T.accent,
          boxShadow: "0 0 0 1.5px white",
        }}
      />
    </span>
  );
}

// 3. Endpoint — phone mockup with credential card, AG composition
function IllusEndpoint() {
  return (
    <div className="absolute inset-0 flex items-end justify-center pb-[72px]">
      <div
        className="relative h-[260px] w-[150px] overflow-hidden rounded-[28px] p-1.5"
        style={{
          background: T.surface,
          boxShadow:
            "0 0 0 1px rgba(38,38,43,0.10), 0 18px 32px -16px rgba(38,38,43,0.30)",
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-[22px] p-3"
          style={{ background: T.panel }}
        >
          {/* NFC indicator */}
          <div className="flex justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12a7 7 0 0 1 14 0M8 12a4 4 0 0 1 8 0M11 12a1 1 0 0 1 2 0"
                stroke={T.inkMid}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          {/* Credential card */}
          <div
            className="mt-4 rounded-[12px] p-3"
            style={{
              background: `linear-gradient(135deg, ${T.btnTop}, ${T.btnBot})`,
              boxShadow: E.buttonBrand,
            }}
          >
            <p className="text-[10px] font-medium text-white/65 leading-[14px]">
              Endpoint
            </p>
            <p className="mt-2 text-[12px] font-medium text-white leading-[16px]">
              MacBook Pro · Encrypted
            </p>
            <p className="mt-0.5 text-[10px] text-white/65 leading-[14px]">
              Active · Posture verified
            </p>
            <div className="mt-4 flex justify-end">
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: "white" }}
              />
            </div>
          </div>
          {/* Status rows */}
          <div className="mt-3 space-y-1.5">
            {["Antimalware", "Encryption", "ZTNA"].map((s) => (
              <div
                key={s}
                className="flex items-center justify-between rounded-[6px] px-2 py-1.5"
                style={{ background: T.surface, boxShadow: E.ringOnly }}
              >
                <span
                  className="text-[9px] font-medium"
                  style={{ color: T.ink }}
                >
                  {s}
                </span>
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: "#19a974" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. VAPT — phone mockup with findings list, AG composition
function IllusVAPT() {
  return (
    <div className="absolute inset-0 flex items-end justify-center pb-[72px]">
      <div
        className="relative h-[260px] w-[150px] overflow-hidden rounded-[28px] p-1.5"
        style={{
          background: T.surface,
          boxShadow:
            "0 0 0 1px rgba(38,38,43,0.10), 0 18px 32px -16px rgba(38,38,43,0.30)",
        }}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-[22px] p-3"
          style={{ background: T.panel }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium leading-[14px]"
              style={{ color: T.inkSubtle }}>
              VAPT · Day 7
            </p>
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-[14px]"
              style={{ background: "rgba(40,93,245,0.10)", color: T.accent }}
            >
              Done
            </span>
          </div>
          <p className="mt-2 text-[12px] font-medium leading-[16px]"
            style={{ color: T.ink }}>
            7 critical findings
          </p>
          <p className="text-[10px] leading-[14px]" style={{ color: T.inkSoft }}>
            7 fixed · 0 open
          </p>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full"
            style={{ background: T.surface, boxShadow: E.ringOnly }}>
            <div className="h-full rounded-full"
              style={{ width: "100%", background: T.accent }} />
          </div>
          <ul className="mt-3 space-y-1.5">
            {[
              "Auth bypass · /admin",
              "SQLi · /search",
              "Rate-limit miss · /login",
              "TLS downgrade · staging",
            ].map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-x-1.5 rounded-[6px] px-2 py-1.5"
                style={{ background: T.surface, boxShadow: E.ringOnly }}
              >
                <span
                  aria-hidden
                  className="inline-block h-1 w-1 rounded-full"
                  style={{ background: "#19a974" }}
                />
                <span className="truncate text-[8.5px]"
                  style={{ color: T.ink }}>
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Testimonial block ────────────────────────────────────────────────
function Testimonial() {
  return (
    <section className="px-6 pt-28">
      <div className="mx-auto max-w-[820px] text-center">
        <p
          className="text-[24px] font-medium leading-[32px] tracking-[-0.6px] md:text-[30px] md:leading-[40px] md:tracking-[-0.75px]"
          style={{ color: T.ink, fontFamily: T.fontDisplay }}
        >
          &ldquo;Osto stepped in when our Series A term sheet came with a
          mandatory security checklist. Cloud posture from day one, full VAPT
          end-to-end, all inside the investor timeline.&rdquo;
        </p>
        <div className="mt-6 flex items-center justify-center gap-x-3">
          <div
            className="h-9 w-9 rounded-full"
            style={{ background: T.panel, boxShadow: E.ringOnly }}
          />
          <div className="text-left">
            <p className="text-[13px] font-medium" style={{ color: T.ink }}>
              Nitin Gupta
            </p>
            <p className="text-[12px]" style={{ color: T.inkSoft }}>
              Co-founder &amp; CTO, Handpickd
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats panel — full-bleed dark band ───────────────────────────────
function StatsPanel() {
  return (
    <section className="px-6 pt-28">
      <div
        className="mx-auto max-w-[1180px] overflow-hidden rounded-3xl px-8 py-12 md:px-14 md:py-16"
        style={{ background: BUTTON_BRAND_BG }}
      >
        <div className="grid items-center gap-y-10 md:grid-cols-[1.4fr_1fr] md:gap-x-16">
          <p
            className="text-[24px] leading-[32px] tracking-[-0.6px] text-white md:text-[30px] md:leading-[38px] md:tracking-[-0.75px]"
            style={{ fontFamily: T.fontDisplay }}
          >
            &ldquo;We can finally answer enterprise security reviews in
            minutes, not weeks — and the audit evidence is already there.&rdquo;
          </p>

          <div className="flex flex-wrap gap-x-12 gap-y-6 md:justify-end">
            <Stat number="7d" label="from kickoff to first audit-ready report" />
            <Stat number="99%" label="of questionnaire questions auto-filled" />
          </div>
        </div>

        <div className="mt-10 flex items-center gap-x-2">
          <Link
            href="#"
            className="inline-flex items-center gap-x-1.5 rounded-[10px] px-3 py-1.5 text-[13px] font-medium tracking-[-0.13px] text-white transition-colors hover:bg-white/10"
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)" }}
          >
            See customer stories
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p
        className="text-[36px] leading-[44px] tracking-[-0.9px] text-white"
        style={{ fontFamily: T.fontDisplay, fontWeight: 500 }}
      >
        {number}
      </p>
      <p className="mt-1 max-w-[24ch] text-[13px] leading-[20px] text-white/75">
        {label}
      </p>
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
        className="px-8 pb-24 pt-12 md:px-12 md:pb-32 md:pt-14"
        style={{
          background: T.panel,
          marginLeft: RAIL_INSET,
          marginRight: RAIL_INSET,
          marginTop: -56,
        }}
      >
       <div className="mx-auto max-w-[1120px]">
        {/* Top: brand block + 4 link columns */}
        <div className="grid gap-y-10 md:grid-cols-[1.4fr_2.6fr] md:gap-x-16">
          <div>
            <Image
              src="/osto-logo.png"
              alt="Osto"
              width={1163}
              height={432}
              className="h-[22px] w-auto"
            />
            <p
              className="mt-4 max-w-[40ch] text-[16px] leading-[24px]"
              style={{ color: T.inkSoft, letterSpacing: "-0.24px" }}
            >
              One platform for cloud, app, endpoint, and network security,
              with built-in compliance, VAPT, and security questionnaires.
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
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/[0.05]"
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
                "Web App Protection",
                "Cloud Posture (CSPM)",
                "ZTNA Secure Access",
                "Endpoint Antimalware",
                "VAPT",
              ]}
            />
            <FooterColumn
              heading="Compliance"
              items={["SOC 2", "ISO 27001", "HIPAA", "GDPR", "PCI-DSS"]}
            />
            <FooterColumn
              heading="Company"
              items={["About", "Pricing", "Customers", "Contact", "Blog"]}
            />
            <FooterColumn
              heading="Resources"
              items={["Docs", "Changelog", "Trust center", "Status"]}
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
            © 2026 Osto Cybersecurity Inc. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <CertChip>SOC 2 Type II</CertChip>
            <CertChip>ISO 27001</CertChip>
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
      className="inline-flex items-center gap-x-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium leading-[20px]"
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
function SectionHeading({ children }: { children: React.ReactNode }) {
  // H2 uses fluid clamp between mobile (32) and desktop (40). Tracking
  // and leading scale with size via em-based units.
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
  // Dashed grid frame — same visual language as AccessGrid's
  // peripheral grid illustration. Cell size 44px to match V1 grid.
  const stroke = faint ? "rgba(38,38,43,0.06)" : "rgba(38,38,43,0.10)";
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
      [data-v2] :focus-visible {
        outline: 2px solid ${T.accent};
        outline-offset: 2px;
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
      /* NavLink underline-on-hover */
      [data-osto-nav-link] {
        position: relative;
      }
      [data-osto-nav-link]::after {
        content: "";
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: 6px;
        height: 1.5px;
        background: ${T.ink};
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
        border-radius: 1px;
      }
      [data-osto-nav-link]:hover::after {
        transform: scaleX(1);
      }
      @media (prefers-reduced-motion: reduce) {
        .osto-nav-enter,
        [data-osto-mega],
        [data-osto-brand-btn],
        [data-osto-ghost-btn],
        [data-osto-caret],
        [data-osto-nav-link]::after {
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
