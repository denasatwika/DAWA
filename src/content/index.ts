import "server-only";

import { z } from "zod";
import { dawaDecoration } from "./brands/dawa-decoration";
import { mulaSolusi } from "./brands/mula-solusi";
import { rentalek } from "./brands/rentalek";
import { brandSchema, type Brand, type BrandSlug } from "./schema";

/**
 * Repository konten. Satu-satunya pintu masuk data bagi halaman.
 * Ditandai "server-only" agar zod & seluruh katalog tidak ikut terkirim ke browser;
 * komponen client hanya menerima potongan data lewat props.
 *
 * Jika kelak klien membutuhkan CMS, cukup ganti isi file ini — halaman tidak berubah.
 */

/** Urutan di sini = urutan tampil di navigasi & beranda. */
const RAW_BRANDS = [mulaSolusi, rentalek, dawaDecoration];

const brandsSchema = z.array(brandSchema).superRefine((brands, ctx) => {
  const slugs = brands.map((b) => b.slug);
  if (new Set(slugs).size !== slugs.length) {
    ctx.addIssue({ code: "custom", message: "Slug brand ganda" });
  }
});

const BRANDS: readonly Brand[] = Object.freeze(brandsSchema.parse(RAW_BRANDS));

export function getBrands(): readonly Brand[] {
  return BRANDS;
}

export function getBrand(slug: string): Brand | undefined {
  return BRANDS.find((brand) => brand.slug === slug);
}

export function getBrandSlugs(): BrandSlug[] {
  return BRANDS.map((brand) => brand.slug);
}

export type { Brand, BrandSlug, HeroContent, Price, Product, ProductCategory } from "./schema";
