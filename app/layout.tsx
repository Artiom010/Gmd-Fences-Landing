import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://gmdfences.com";

const PAGE_TITLE = "Custom Fences, Gates & Automation in USA | GMD Fences";
const PAGE_DESCRIPTION =
  "GMD Fences offers custom fences, gates, automation and parking blockers for residential and commercial projects in the USA. Manufacturing, delivery and installation.";

const FENCE_ITEMS = [
  "Louver Fence",
  "Horizontal Profile Fence",
  "Horizontal Picket Fence",
  "Vertical Louver Fence",
  "Picket Fence",
  "Vertical Profile Fence 20x20",
  "Vertical Profile Fence 40x20",
  "Inside Profile Fence",
  "Inside Profile Fence U-45",
  "Profile Fence LUX",
] as const;

const GATE_ITEMS = [
  "Swing Gates",
  "Wicket Gates / Pedestrian Gates",
  "Sliding Gate",
  "Cantilever Gate",
  "Bi-Folding Gate",
  "Articulated Sliding Gate",
  "Telescopic Sliding Gate",
] as const;

const AUTOMATION_ITEMS = ["Gate Automation", "Wicket Gate Automation", "Other Automation Solutions"] as const;

const SITE_KEYWORDS = [
  "GMD Fences",
  "gmdfences",
  "custom fences USA",
  "fence installation",
  "metal fences",
  "gates",
  "swing gates",
  "sliding gates",
  "gate automation",
  "parking blockers",
  "commercial fencing",
  "residential fencing",
] as const;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "GMD Fences",
  title: { default: PAGE_TITLE, template: "%s | GMD Fences" },
  description: PAGE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  authors: [{ name: "GMD Fences", url: SITE_URL }],
  creator: "GMD Fences",
  publisher: "GMD Fences",
  category: "business",
  referrer: "origin-when-cross-origin",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "GMD Fences",
    locale: "en_US",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  icons: {
    icon: [{ url: "/gmdfences-icon.svg", type: "image/svg+xml" }],
    shortcut: "/gmdfences-icon.svg",
    apple: "/gmdfences-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D1520",
  colorScheme: "light",
};

const listItems = (names: readonly string[]) =>
  names.map((name, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
  }));

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "GMD Fences",
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/gmdfences-icon.svg`,
      },
      areaServed: { "@type": "Country", name: "United States" },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-800-000-0000",
        email: "info@gmdfences.com",
        contactType: "customer service",
        availableLanguage: "English",
        areaServed: "US",
      },
      sameAs: [
        "https://gardurimd.ro",
        "https://garduri.md",
        "https://ogradigmd.bg",
        "https://finefence.ie",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "GMD Fences",
      inLanguage: "en-US",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: PAGE_TITLE,
      inLanguage: "en-US",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      description: PAGE_DESCRIPTION,
    },
    {
      "@type": "OfferCatalog",
      "@id": `${SITE_URL}/#catalog`,
      name: "Our Main Product and Service Categories",
      provider: { "@id": `${SITE_URL}/#organization` },
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Fences",
          itemListElement: listItems(FENCE_ITEMS),
        },
        {
          "@type": "OfferCatalog",
          name: "Gates",
          itemListElement: listItems(GATE_ITEMS),
        },
        {
          "@type": "OfferCatalog",
          name: "Automation",
          itemListElement: listItems(AUTOMATION_ITEMS),
        },
        {
          "@type": "OfferCatalog",
          name: "Parking Blockers",
          itemListElement: listItems(["Parking Blockers"]),
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Do you provide fence and gate solutions in the USA?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. GMD Fences provides information and support for fence systems, gate solutions, automation options and related products in the USA.",
          },
        },
        {
          "@type": "Question",
          name: "Can I request information before the full website is launched?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You can contact the company by phone or send a request through the email form on this page.",
          },
        },
        {
          "@type": "Question",
          name: "Do you offer gate automation solutions?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The company presents gate automation, wicket gate automation and other automation solutions.",
          },
        },
        {
          "@type": "Question",
          name: "Where can I find your regional projects?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Links to the official regional projects for Romania, Moldova and Bulgaria are available at the bottom of the page.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. Demoway) inject attributes on <body> and cause harmless mismatch vs SSR */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
