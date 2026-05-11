import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ─── Site URL ──────────────────────────────────────────────────────────
// Canonical production origin. Update here only — every metadata field
// (OG, Twitter, sitemap, robots, JSON-LD) reads from this constant.
const SITE_URL = "https://resonateai2.vercel.app";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// ─── Metadata ──────────────────────────────────────────────────────────
// Title, description, Open Graph, and Twitter Card tags. Next 16 reads
// the `openGraph.images` and `twitter.images` fields here and merges
// them with the runtime `opengraph-image.tsx` / `twitter-image.tsx`
// routes — those routes win when both are present, so we don't need to
// hand-list the image URLs.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Resonate — The voice API for real-time agents",
    template: "%s · Resonate",
  },
  description:
    "Streaming speech, function calling, and telephony in one SDK. Resonate agents answer in 90 ms and switch languages mid-call.",
  keywords: [
    "voice AI",
    "voice API",
    "real-time voice agents",
    "streaming TTS",
    "streaming STT",
    "telephony",
    "voice cloning",
    "speech AI",
    "conversational AI",
    "ElevenLabs alternative",
    "Cartesia alternative",
    "Vapi alternative",
  ],
  authors: [{ name: "Resonate" }],
  creator: "Resonate",
  publisher: "Resonate",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Resonate",
    title: "Resonate — The voice API for real-time agents",
    description:
      "Streaming speech, function calling, and telephony in one SDK. Resonate agents answer in 90 ms and switch languages mid-call.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resonate — The voice API for real-time agents",
    description:
      "Streaming speech, function calling, and telephony in one SDK. Agents answer in 90 ms and switch languages mid-call.",
    creator: "@resonate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  applicationName: "Resonate",
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#fafafa" },
  ],
  width: "device-width",
  initialScale: 1,
};

// ─── JSON-LD structured data ───────────────────────────────────────────
// Two schemas: Organization (for the brand/company entity) and
// SoftwareApplication (for the product itself). Google's rich results
// renderer reads these and may surface the brand panel + app card.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "Resonate",
      url: SITE_URL,
      logo: `${SITE_URL}/icon`,
      description:
        "Resonate builds the voice API for real-time AI agents — streaming speech, function calling, and telephony in one SDK.",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}#software`,
      name: "Resonate Voice API",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web, iOS, Android",
      offers: {
        "@type": "Offer",
        price: "299",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "299",
          priceCurrency: "USD",
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: 1,
            unitCode: "MON",
          },
        },
      },
      publisher: { "@id": `${SITE_URL}#organization` },
      description:
        "Streaming voice agents with 90 ms time-to-first-byte across 32 languages. Built-in telephony, function calling, and voice cloning.",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body>
        {/* JSON-LD goes in <body> per Next App Router conventions — Google
            reads it from anywhere in the document. */}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
