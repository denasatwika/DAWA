import type { Metadata } from "next";
import { notFound } from "next/navigation";

import "@fontsource-variable/manrope";

import { SECTION_ID } from "@/config/routes";
import { getHeroMedia } from "@/config/media";
import { getBrand } from "@/content";
import { mulaLanding } from "@/content/landing/mula-solusi";
import { RentalCatalog } from "@/features/catalog";
import { MulaCta, MulaFeatures, MulaHero, MulaShell, type HeroVideoSources } from "@/features/mula";
import { getHeroMediaAvailability, withExistingProductImages } from "@/lib/media-files";
import { buildWhatsAppUrl, whatsappMessage } from "@/lib/whatsapp";
import { SiteFoot, SiteNav } from "../../site-chrome";

const SLUG = "mula-solusi";

/** id section halaman ini; dipakai tautan anchor (mis. "Katalog" di navbar). */
const SECTIONS = {
  hero: "beranda",
  features: "cara-sewa",
  catalog: SECTION_ID.catalog,
  contact: "kontak",
} as const;

export function generateMetadata(): Metadata {
  const brand = getBrand(SLUG);
  if (!brand) return {};
  return {
    title: brand.name,
    description: brand.summary,
    openGraph: {
      title: brand.name,
      description: brand.summary,
      images: [getHeroMedia(brand.slug).landscape.endFrame],
    },
  };
}

/**
 * Halaman khusus Mula Solusi (desain Figma "Radio Rental"), terpisah dari template
 * brand umum: gaya neumorphic gelap. Navbar & footer memakai milik grup DAWA.
 * Produk & harga tetap diambil dari src/content/brands/mula-solusi.ts.
 */
export default function MulaSolusiPage() {
  const brand = getBrand(SLUG);
  if (!brand) notFound();

  const categories = withExistingProductImages(brand.slug, brand.catalog.categories);
  const whatsappHref = buildWhatsAppUrl(
    brand.contact.whatsapp,
    whatsappMessage.general(brand.name),
  );

  // Video hero: lanskap 16:9 untuk layar lebar, potret 9:16 untuk ponsel tegak
  const media = getHeroMedia(brand.slug);
  const available = getHeroMediaAvailability(brand.slug);
  const files = (variant: "landscape" | "portrait") => ({
    mp4: available[variant].mp4 ? media[variant].mp4 : undefined,
    av1: available[variant].av1 ? media[variant].av1 : undefined,
    poster: available[variant].endFrame ? media[variant].endFrame : undefined,
  });
  const video: HeroVideoSources = {
    landscape: files("landscape"),
    portrait: available.portrait.mp4 ? files("portrait") : undefined,
  };

  return (
    <>
      <MulaShell>
        <SiteNav />

        <main id={SECTION_ID.main}>
          <MulaHero
            id={SECTIONS.hero}
            lockup={brand.hero.headline ?? brand.name}
            title={brand.hero.tagline}
            video={video}
          />

          <MulaFeatures id={SECTIONS.features} items={mulaLanding.features} />

          <RentalCatalog
            id={SECTIONS.catalog}
            categories={categories}
            brandSlug={brand.slug}
            eyebrow={mulaLanding.catalog.eyebrow}
            headline={mulaLanding.catalog.headline}
          />

          <MulaCta
            id={SECTIONS.contact}
            headline={mulaLanding.cta.headline}
            text={mulaLanding.cta.text}
            href={whatsappHref}
          />
        </main>
      </MulaShell>

      {/* Di luar MulaShell: memakai token & font situs, sama persis dengan halaman lain */}
      <SiteFoot />
    </>
  );
}
