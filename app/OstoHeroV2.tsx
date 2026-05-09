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
// Cards use a crisp 1px ring (no fuzzy drop shadow). The "elevation"
// reads from the rounded corner + clean fill against the page panel,
// not from a halo. Matches the AG/AccessGrid reference style where
// cards sit cleanly on the surface.
const E = {
  card: "0 0 0 1px rgba(38,38,43,0.08)",
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
function BrandButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-osto-brand-btn
      className="inline-flex items-center gap-x-1.5 rounded-[10px] px-3 py-[6px] text-[13px] font-medium leading-[24px] tracking-[-0.13px] text-white"
      style={{
        background: BUTTON_BRAND_BG,
        boxShadow: E.buttonBrand,
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
}: {
  href: string;
  children: React.ReactNode;
  withCaret?: boolean;
}) {
  return (
    <Link
      href={href}
      data-osto-ghost-btn
      className="inline-flex items-center gap-x-1.5 rounded-[10px] px-3 py-[6px] text-[13px] font-medium leading-[24px] tracking-[-0.13px]"
      style={{
        background: T.surface,
        color: T.ink,
        boxShadow: E.buttonGhost,
      }}
    >
      {children}
      {withCaret && (
        <svg
          width="12"
          height="12"
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
    <section className="relative px-6 pt-28 md:pt-36">
      <div className="mx-auto max-w-[820px] text-center">
        <EyebrowPill>SOC 2 · ISO 27001 · HIPAA · GDPR</EyebrowPill>
        <h1
          className="mt-4 max-w-[640px] text-balance md:mt-5"
          style={{
            fontFamily: T.fontDisplay,
            fontSize: "clamp(30px, 5vw, 48px)",
            lineHeight: "1.08",
            letterSpacing: "-0.025em",
            fontWeight: 500,
            color: T.ink,
            margin: "0 auto",
          }}
        >
          Compliance is the byproduct of security.{" "}
          <span style={{ color: T.accent }}>We fix both.</span>
        </h1>
        <p
          className="mx-auto mt-3 max-w-[520px] text-[14px] leading-[24px]"
          style={{ color: T.inkStrong, letterSpacing: "-0.14px" }}
        >
          One platform for cloud, app, endpoint, and network security,
          with built-in compliance, VAPT, and questionnaires. Live in
          days, from $999/month.
        </p>
        <div className="mt-7 flex items-center justify-center gap-x-2">
          <BrandButton href="#">Book a 30-min demo</BrandButton>
          <GhostButton href="#" withCaret>
            Start 7-day free trial
          </GhostButton>
        </div>
      </div>
    </section>
  );
}

function EyebrowPill({ children }: { children: React.ReactNode }) {
  // AG's pattern: 10×16px solid capsule + small label, both in accent.
  // No pill background, no border. The capsule reads as a marker, not a UI chip.
  return (
    <span
      className="inline-flex items-center gap-x-2 text-[12px] leading-[20px] font-medium"
      style={{ color: T.accent, letterSpacing: "-0.018px" }}
    >
      <span
        aria-hidden
        className="inline-block h-2.5 w-4 rounded"
        style={{ background: T.accent }}
      />
      {children}
    </span>
  );
}

// ─── Logo strip ───────────────────────────────────────────────────────
function LogoStrip() {
  const logos = ["Handpickd", "smallcase", "AMNIC", "TCA", "PixelDust"];
  return (
    <section className="px-6 pt-20 md:pt-24">
      <div className="mx-auto max-w-[980px]">
        <p
          className="text-center text-[12px] font-medium uppercase tracking-[0.14em]"
          style={{ color: T.inkSubtle }}
        >
          Securing growing teams across India and MENA
        </p>
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {logos.map((l) => (
            <li
              key={l}
              className="text-[16px] font-medium tracking-[-0.2px]"
              style={{ color: T.inkStrong, fontFamily: "Georgia, serif" }}
            >
              {l}
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
        <div className="relative grid gap-y-10 px-8 py-10 md:grid-cols-2 md:gap-x-12 md:px-12 md:py-16">
          {/* Left copy — left-aligned inline (overrides SectionHeading's
              md:text-center default since we're inside a two-column layout) */}
          <div className="relative z-10 self-center">
            <h2
              className="text-balance"
              style={{
                fontFamily: T.fontDisplay,
                fontSize: "clamp(24px, 3vw, 30px)",
                lineHeight: "36px",
                letterSpacing: "-0.75px",
                fontWeight: 500,
                color: T.ink,
              }}
            >
              How it works.
            </h2>
            <p
              className="mt-4 max-w-[42ch] text-[14px] leading-[22px]"
              style={{ color: T.inkSoft, letterSpacing: "-0.018px" }}
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
        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
        style={{ background: T.accent }}
      >
        {n}
      </span>
      <span
        className="text-[13px] leading-[22px]"
        style={{ color: T.ink, letterSpacing: "-0.13px" }}
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
        className="text-[11px] font-medium uppercase tracking-[0.06em]"
        style={{ color: T.inkSubtle }}
      >
        {label}
      </p>
      <div
        className="mt-1 flex items-center gap-x-2 rounded-[8px] px-3 py-2 text-[12.5px]"
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

// ─── Problem — fragmented stack vs. one platform ──────────────────────
function ProblemSection() {
  return (
    <section className="px-6 pt-4">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading>
          The old way is slow,{" "}
          <span style={{ color: T.accent }}>complex, and expensive.</span>
        </SectionHeading>
        <p
          className="mx-auto mt-4 max-w-[600px] text-center text-[14px] leading-[24px]"
          style={{ color: T.inkSoft, letterSpacing: "-0.14px" }}
        >
          A WAF here. An endpoint tool there. A compliance platform. A VAPT firm.
          Multiple invoices, scattered dashboards, months of deployment, and
          security that still leaves gaps.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <ComparisonCard
            label="Without Osto"
            tone="neutral"
            title="6 vendors. 6 invoices."
            line1="$100K–$150K"
            line1Caption="approximate annual spend"
            line2="6–9 months"
            line2Caption="vendors · audits · scans · follow-ups"
            chips={["Cloudflare", "CrowdStrike", "Wiz", "Vanta", "Okta", "VAPT firm"]}
          />
          <ComparisonCard
            label="With Osto"
            tone="brand"
            title="One platform. One team."
            line1="$999"
            line1Caption="monthly · single invoice"
            line2="Days"
            line2Caption="security, compliance, VAPT live"
            chips={["WAF", "CSPM", "ZTNA", "Compliance", "VAPT", "Questionnaires"]}
          />
        </div>
      </div>
    </section>
  );
}

function ComparisonCard({
  label,
  tone,
  title,
  line1,
  line1Caption,
  line2,
  line2Caption,
  chips,
}: {
  label: string;
  tone: "neutral" | "brand";
  title: string;
  line1: string;
  line1Caption: string;
  line2: string;
  line2Caption: string;
  chips: string[];
}) {
  const isBrand = tone === "brand";
  const bg = isBrand ? BUTTON_BRAND_BG : T.panel;
  const ink = isBrand ? "rgba(255,255,255,0.92)" : T.ink;
  const inkSoft = isBrand ? "rgba(255,255,255,0.65)" : T.inkSoft;
  const inkSubtle = isBrand ? "rgba(255,255,255,0.55)" : T.inkSubtle;
  const chipBg = isBrand ? "rgba(255,255,255,0.12)" : T.surface;
  const chipShadow = isBrand
    ? "inset 0 0 0 1px rgba(255,255,255,0.14)"
    : E.ringOnly;

  return (
    <article
      className="rounded-3xl p-8 md:p-10"
      style={{
        background: bg,
        boxShadow: isBrand ? "none" : E.ringOnly,
      }}
    >
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: inkSubtle }}
      >
        {label}
      </p>
      <h3
        className="mt-2 font-medium"
        style={{
          fontFamily: T.fontDisplay,
          color: ink,
          fontSize: "22px",
          lineHeight: "28px",
          letterSpacing: "-0.4px",
        }}
      >
        {title}
      </h3>

      <div className="mt-8 grid grid-cols-2 gap-x-6">
        <div>
          <p
            className="text-[28px] font-medium"
            style={{
              fontFamily: T.fontDisplay,
              color: ink,
              lineHeight: "32px",
              letterSpacing: "-0.7px",
            }}
          >
            {line1}
          </p>
          <p
            className="mt-1.5 text-[12px]"
            style={{ color: inkSoft, letterSpacing: "-0.018px" }}
          >
            {line1Caption}
          </p>
        </div>
        <div>
          <p
            className="text-[28px] font-medium"
            style={{
              fontFamily: T.fontDisplay,
              color: ink,
              lineHeight: "32px",
              letterSpacing: "-0.7px",
            }}
          >
            {line2}
          </p>
          <p
            className="mt-1.5 text-[12px]"
            style={{ color: inkSoft, letterSpacing: "-0.018px" }}
          >
            {line2Caption}
          </p>
        </div>
      </div>

      <ul className="mt-8 flex flex-wrap gap-2">
        {chips.map((c) => (
          <li
            key={c}
            className="rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{
              background: chipBg,
              boxShadow: chipShadow,
              color: ink,
              letterSpacing: "-0.018px",
            }}
          >
            {c}
          </li>
        ))}
      </ul>
    </article>
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
                className="text-[10px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: T.accent }}
              >
                Funding stage · {s.stage}
              </p>
              <p
                className="mt-4 text-[16px] leading-[24px]"
                style={{
                  color: T.ink,
                  fontFamily: T.fontDisplay,
                  letterSpacing: "-0.2px",
                }}
              >
                &ldquo;{s.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-x-3">
                <SketchPortrait seed={s.name} />
                <div>
                  <p
                    className="text-[13px] font-medium"
                    style={{ color: T.ink }}
                  >
                    {s.name}
                  </p>
                  <p className="text-[12px]" style={{ color: T.inkSoft }}>
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
          className="mx-auto mt-3 max-w-[680px] text-balance text-center"
          style={{
            fontFamily: T.fontDisplay,
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: "1.1",
            letterSpacing: "-0.025em",
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
                      className="block text-[13px]"
                      style={{
                        color: T.ink,
                        letterSpacing: "-0.13px",
                      }}
                    >
                      Add OSCP-led VAPT
                    </span>
                    <span
                      className="block text-[11px]"
                      style={{ color: T.inkSubtle }}
                    >
                      One-time engagement, 7-day delivery
                    </span>
                  </span>
                </span>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: T.inkSoft }}
                >
                  +${VAPT_PRICE}
                </span>
              </label>
            </div>

            {/* Column 3: live total */}
            <div className="flex flex-col gap-y-5 p-8 md:p-10">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.14em]"
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
                className="text-[11px]"
                style={{ color: T.inkSubtle, letterSpacing: "-0.018px" }}
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
        className="text-[12px] font-medium"
        style={{ color: T.inkSoft, letterSpacing: "-0.018px" }}
      >
        {label}
      </p>
      <p
        className="mt-1 font-medium"
        style={{
          fontFamily: T.fontDisplay,
          color: T.ink,
          fontSize: "26px",
          lineHeight: "32px",
          letterSpacing: "-0.65px",
        }}
      >
        {price}
      </p>
      <p
        className="mt-1.5 text-[12px] leading-[18px]"
        style={{ color: T.inkSubtle, letterSpacing: "-0.018px" }}
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
        className="text-[12.5px]"
        style={{ color: T.inkSoft, letterSpacing: "-0.018px" }}
      >
        {label}
      </span>
      <span
        className="text-[13px] font-medium tabular-nums"
        style={{ color: T.ink }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Pricing — Enterprise Ready + Custom ──────────────────────────────
function Pricing() {
  return (
    <section className="px-6 pt-4" id="pricing">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading>
          Start small. Add modules{" "}
          <span style={{ color: T.accent }}>as you scale.</span>
        </SectionHeading>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Most popular — Enterprise Ready */}
          <article
            className="relative rounded-3xl p-8 md:p-10"
            style={{
              background: T.surface,
              boxShadow: `${E.card}, 0 0 0 1.5px ${T.accent}`,
            }}
          >
            <span
              className="absolute right-6 top-6 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{ background: `${T.accent}14`, color: T.accent }}
            >
              Most popular
            </span>
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: T.inkSubtle }}
            >
              Enterprise Ready
            </p>
            <p
              className="mt-1 text-[14px]"
              style={{ color: T.inkSoft, letterSpacing: "-0.14px" }}
            >
              Growing teams and SaaS startups.
            </p>
            <div className="mt-6 flex items-baseline gap-x-2">
              <span
                className="font-medium"
                style={{
                  fontFamily: T.fontDisplay,
                  color: T.ink,
                  fontSize: "44px",
                  lineHeight: "44px",
                  letterSpacing: "-1.1px",
                }}
              >
                $999
              </span>
              <span
                className="text-[14px]"
                style={{ color: T.inkSoft, letterSpacing: "-0.14px" }}
              >
                /month
              </span>
            </div>
            <p
              className="mt-1 text-[12px]"
              style={{ color: T.inkSubtle, letterSpacing: "-0.018px" }}
            >
              $10,000 billed annually · 7-day free trial
            </p>

            <div className="mt-6 flex flex-col gap-y-2 sm:flex-row sm:items-center sm:gap-x-2">
              <BrandButton href="#">Book demo</BrandButton>
              <GhostButton href="#" withCaret>
                Start free trial
              </GhostButton>
            </div>

            <ul
              className="mt-7 space-y-2.5 border-t pt-6"
              style={{ borderColor: T.ring }}
            >
              {[
                "Web App & API Protection (200K req/mo)",
                "Web Scanner & Mobile App Scanner",
                "Secure Server Access (ZTNA)",
                "Security + Compliance + VAPT + Questionnaire",
                "Up to 20 endpoint users",
              ].map((f) => (
                <PricingFeature key={f}>{f}</PricingFeature>
              ))}
            </ul>
          </article>

          {/* Custom */}
          <article
            className="relative rounded-3xl p-8 md:p-10"
            style={{
              background: T.panel,
              boxShadow: E.ringOnly,
            }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: T.inkSubtle }}
            >
              Custom
            </p>
            <p
              className="mt-1 text-[14px]"
              style={{ color: T.inkSoft, letterSpacing: "-0.14px" }}
            >
              Specific scope or scale.
            </p>
            <div className="mt-6">
              <span
                className="font-medium"
                style={{
                  fontFamily: T.fontDisplay,
                  color: T.ink,
                  fontSize: "44px",
                  lineHeight: "44px",
                  letterSpacing: "-1.1px",
                }}
              >
                Let&apos;s talk
              </span>
            </div>
            <p
              className="mt-1 text-[12px]"
              style={{ color: T.inkSubtle, letterSpacing: "-0.018px" }}
            >
              Custom pricing tuned to your scope.
            </p>

            <div className="mt-6">
              <GhostButton href="#" withCaret>
                Request a quote
              </GhostButton>
            </div>

            <ul
              className="mt-7 space-y-2.5 border-t pt-6"
              style={{ borderColor: T.ring }}
            >
              {[
                "Unlimited requests & resources",
                "Dedicated support",
                "Custom integrations",
                "Priority onboarding",
                "SLA guarantee",
              ].map((f) => (
                <PricingFeature key={f}>{f}</PricingFeature>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

function PricingFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-x-2.5">
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        className="mt-1 shrink-0"
      >
        <path
          d="m3.5 8 3 3 6-6"
          stroke={T.accent}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="text-[13px] leading-[20px]"
        style={{ color: T.ink, letterSpacing: "-0.13px" }}
      >
        {children}
      </span>
    </li>
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
        className="font-medium"
        style={{
          fontFamily: T.fontDisplay,
          color: T.accent,
          fontSize: "32px",
          lineHeight: "36px",
          letterSpacing: "-0.8px",
        }}
      >
        {big}
      </p>
      <h3
        className="mt-4 text-[15px] font-medium"
        style={{
          color: T.ink,
          fontFamily: T.fontDisplay,
          letterSpacing: "-0.225px",
        }}
      >
        {heading}
      </h3>
      <p
        className="mt-2 text-[13px] leading-[20px]"
        style={{ color: T.inkSoft, letterSpacing: "-0.13px" }}
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
                    className="text-[15px] font-medium"
                    style={{
                      color: T.ink,
                      fontFamily: T.fontDisplay,
                      letterSpacing: "-0.225px",
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
                    className="overflow-hidden px-6 text-[14px] leading-[24px]"
                    style={{
                      color: T.inkSoft,
                      letterSpacing: "-0.14px",
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
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Ready when you are
          </p>
          <h2
            className="mx-auto mt-3 max-w-[640px] text-balance text-white"
            style={{
              fontFamily: T.fontDisplay,
              fontSize: "clamp(28px, 4vw, 40px)",
              lineHeight: "1.1",
              letterSpacing: "-0.025em",
              fontWeight: 500,
            }}
          >
            Stronger security now. Smoother audits later.
          </h2>
          <p
            className="mx-auto mt-4 max-w-[520px] text-[14px] leading-[24px]"
            style={{
              color: "rgba(255,255,255,0.78)",
              letterSpacing: "-0.14px",
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
            className="text-[9px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: T.inkSubtle }}
          >
            SOC 2 Type II · Readiness
          </p>
          <p
            className="mt-1.5 text-[12px] font-medium"
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
              className="text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: T.accent }}
            >
              Audit
              <br />
              Ready
            </p>
            <p
              className="mt-1 text-[8px] font-medium tracking-[0.08em]"
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
            <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/70">
              Endpoint
            </p>
            <p className="mt-2 text-[11px] font-medium text-white">
              MacBook Pro · Encrypted
            </p>
            <p className="mt-0.5 text-[8px] text-white/65">
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
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: T.inkSubtle }}>
              VAPT · Day 7
            </p>
            <span
              className="rounded-full px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.1em]"
              style={{ background: "rgba(40,93,245,0.10)", color: T.accent }}
            >
              Done
            </span>
          </div>
          <p className="mt-2 text-[12px] font-medium"
            style={{ color: T.ink }}>
            7 critical findings
          </p>
          <p className="text-[9px]" style={{ color: T.inkSoft }}>
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
              className="mt-4 max-w-[34ch] text-[13px] leading-[20px]"
              style={{ color: T.inkSoft, letterSpacing: "-0.13px" }}
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
        className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em]"
        style={{ color: T.inkSubtle }}
      >
        {heading}
      </p>
      <ul className="space-y-2.5">
        {items.map((it) => (
          <li key={it}>
            <Link
              href="#"
              className="text-[13px] transition-colors hover:underline"
              style={{ color: T.ink, letterSpacing: "-0.13px" }}
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
      className="inline-flex items-center gap-x-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{
        background: T.surface,
        boxShadow: E.ringOnly,
        color: T.inkSoft,
        letterSpacing: "-0.018px",
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
  // AG: text-2xl mobile (24px / -0.36px), text-3xl/[36px] desktop (30px / -0.75px)
  return (
    <h2
      className="text-balance md:text-center md:px-10"
      style={{
        fontFamily: T.fontDisplay,
        fontSize: "clamp(24px, 3vw, 30px)",
        lineHeight: "36px",
        letterSpacing: "-0.75px",
        fontWeight: 500,
        color: T.ink,
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
