import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@fontsource-variable/geist";
import "@/styles/tokens.css";
import "@/styles/base.css";

import { SECTION_ID } from "@/config/routes";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  openGraph: { siteName: siteConfig.name, locale: siteConfig.locale, type: "website" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: siteConfig.themeColor.dark },
  ],
};

/**
 * Kerangka HTML bersama. Header & footer TIDAK dipasang di sini:
 * - halaman grup DAWA memakai SiteChrome lewat src/app/(site)/layout.tsx;
 * - halaman Mula Solusi (src/app/(mula)/) punya navbar & footer sendiri.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-scroll-behavior: Next.js mematikan gulir halus sementara saat berpindah halaman,
    // agar halaman baru langsung mulai dari atas (tanpa animasi meluncur).
    <html lang="id" data-scroll-behavior="smooth">
      <body>
        <a href={`#${SECTION_ID.main}`} className="skip-link">
          Lewati ke konten
        </a>
        {children}
      </body>
    </html>
  );
}
