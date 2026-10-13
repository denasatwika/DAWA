import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/layout";
import { SECTION_ID, routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getBrands } from "@/content";
import { buildWhatsAppUrl, whatsappMessage } from "@/lib/whatsapp";

/** Navbar grup DAWA (gaya bilah global apple.com). Dipakai semua halaman, termasuk Mula Solusi. */
export function SiteNav() {
  return (
    <SiteHeader
      siteName={siteConfig.name}
      items={getBrands().map((b) => ({
        label: b.name,
        href: routes.brand(b.slug),
        actions: {
          catalogHref: b.comingSoon ? undefined : `#${SECTION_ID.catalog}`,
          contactHref: buildWhatsAppUrl(b.contact.whatsapp, whatsappMessage.general(b.name)),
        },
      }))}
    />
  );
}

/** Footer grup DAWA. Dipakai semua halaman, termasuk Mula Solusi. */
export function SiteFoot() {
  return (
    <SiteFooter
      siteName={siteConfig.name}
      tagline={siteConfig.tagline}
      brands={getBrands().map((b) => ({
        name: b.name,
        href: routes.brand(b.slug),
        instagram: b.contact.instagram,
      }))}
    />
  );
}

/** Navbar, <main>, dan footer grup DAWA. Dipakai oleh layout (site) dan halaman 404. */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteNav />
      <main id={SECTION_ID.main}>{children}</main>
      <SiteFoot />
    </>
  );
}
