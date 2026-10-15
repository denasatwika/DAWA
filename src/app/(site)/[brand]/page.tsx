import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComingSoon } from "@/components/layout";
import { Container, FrameSequenceHero } from "@/components/ui";
import { getHeroMedia } from "@/config/media";
import { getBrand, getBrandSlugs, getBrands } from "@/content";
import { rentalekLanding } from "@/content/landing/rentalek";
import { getHeroMediaAvailability, withExistingProductImages } from "@/lib/media-files";
import { BrandHero, BrandShowcase } from "@/features/brand";
import { ProductCatalog } from "@/features/catalog";
import styles from "./page.module.css";

interface BrandPageProps {
  params: Promise<{ brand: string }>;
}

/** Hanya slug terdaftar yang dibuat saat build; selain itu menjadi 404. */
export const dynamicParams = false;

/** Brand yang punya halaman khusus sendiri (bukan template ini). */
const DEDICATED_PAGES = new Set(["mula-solusi"]);

export function generateStaticParams() {
  return getBrandSlugs()
    .filter((brand) => !DEDICATED_PAGES.has(brand))
    .map((brand) => ({ brand }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const brand = getBrand((await params).brand);
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

export default async function BrandPage({ params }: BrandPageProps) {
  const brand = getBrand((await params).brand);
  if (!brand) notFound();
  if (brand.comingSoon) {
    // Rentalek: hero animasi bisa dinyalakan/dimatikan lewat content/landing/rentalek.ts
    if (brand.slug === "rentalek" && rentalekLanding.hero.enabled) {
      const { hero } = rentalekLanding;
      return (
        <div data-brand={brand.slug} style={{ "--brand-accent": brand.accentColor }}>
          <FrameSequenceHero
            frames={hero.frames}
            background={hero.background}
            scrollHeight={hero.scrollHeight}
            title={brand.name}
            subtitle={brand.hero.tagline}
            steps={hero.steps}
          />
          <ComingSoon name={brand.name} headingLevel="h2" />
        </div>
      );
    }
    return <ComingSoon name={brand.name} />;
  }

  const otherBrands = getBrands().filter((b) => b.slug !== brand.slug);

  return (
    <div
      data-brand={brand.slug}
      data-theme={brand.theme}
      style={{ "--brand-accent": brand.accentColor, "--brand-highlight": brand.highlightColor }}
    >
      <BrandHero
        slug={brand.slug}
        brandName={brand.name}
        hero={brand.hero}
        availability={getHeroMediaAvailability(brand.slug)}
      />
      <ProductCatalog
        brand={{
          ...brand,
          catalog: {
            ...brand.catalog,
            categories: withExistingProductImages(brand.slug, brand.catalog.categories),
          },
        }}
      />

      {brand.showRelatedBrands && (
        <section className={styles.related} data-surface="white" aria-labelledby="judul-brand-lain">
          <Container>
            <h2 id="judul-brand-lain" className={styles.relatedTitle}>
              Lengkapi acara Anda.
            </h2>
            <BrandShowcase brands={otherBrands} variant="compact" />
          </Container>
        </section>
      )}
    </div>
  );
}
