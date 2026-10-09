import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { ContactNotice } from "@/components/site/contact-notice";
import { IconSprite } from "@/components/site/icons";
import { finish } from "@/config/appearance";
import { contacts, site, siteBase, siteOrigin } from "@/config/site";
import { services } from "@/content/home";

import "./globals.css";

// Open Sans SemiBold subset (A–Z, accented capitals) used only by the wordmark.
const brandFont = localFont({
  src: "../assets/fonts/jf-brand.woff2",
  weight: "600",
  variable: "--font-jf-brand",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const title = "JF Oxicorte | Corte a Laser, Oxicorte e Dobra de Aço";
const description =
  "JF Oxicorte: corte a laser, corte a maçarico e dobra de chapas em aço carbono A36 e 1020 e aço inox 304. Solicite um orçamento para o seu projeto.";

export const metadata: Metadata = {
  title,
  description,
  applicationName: site.name,
  formatDetection: { telephone: false, email: false, address: false },
  // Absolute URLs (canonical, og:url, og:image) need the public domain: set SITE_URL.
  ...(siteOrigin && {
    metadataBase: new URL(`${siteBase}/`),
    alternates: { canonical: "/" },
  }),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: "JF Oxicorte | Seu projeto ganha forma no aço",
    description,
    ...(siteOrigin && {
      url: "/",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "JF Oxicorte — Seu projeto ganha forma no aço.",
        },
      ],
    }),
  },
  twitter: { card: siteOrigin ? "summary_large_image" : "summary" },
};

export const viewport: Viewport = {
  themeColor: "#090a0b",
  colorScheme: "dark",
};

const sameAs = [contacts.instagram].filter(Boolean);
// Unset values are `undefined`, which JSON.stringify leaves out.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description,
  url: siteOrigin ? `${siteBase}/` : undefined,
  image: siteOrigin ? `${siteBase}/og-image.jpg` : undefined,
  logo: siteOrigin ? `${siteBase}/icon-512.png` : undefined,
  telephone: contacts.phone ?? undefined,
  email: contacts.email ?? undefined,
  sameAs: sameAs.length > 0 ? sameAs : undefined,
  address:
    site.city || site.state
      ? {
          "@type": "PostalAddress",
          addressLocality: site.city || undefined,
          addressRegion: site.state || undefined,
          addressCountry: "BR",
        }
      : undefined,
  // `serviceRegion` is display copy; the structured value names the city.
  areaServed: site.city ? { "@type": "City", name: site.city } : undefined,
  knowsAbout: [
    "Corte a laser",
    "Oxicorte",
    "Dobra de chapas",
    "Aço carbono",
    "Aço inox 304",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.service,
        description: service.description,
      },
    })),
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={brandFont.variable}
      data-finish={finish || undefined}
    >
      <body>
        <a
          href="#principal"
          className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-[5px] bg-popover px-4 py-3 text-sm font-semibold text-foreground transition-transform focus:translate-y-0"
        >
          Ir para o conteúdo
        </a>
        <IconSprite />
        {children}
        <ContactNotice />
        <script
          type="application/ld+json"
          // Static, build-time data; "<" is escaped so the JSON cannot close the tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
