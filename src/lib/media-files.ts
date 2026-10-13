import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";
import { getHeroMedia, getProductImageUrl, type HeroMediaAvailability } from "@/config/media";
import type { BrandSlug, ProductCategory } from "@/content/schema";

/** Mengecek apakah file di public/ ada. Dijalankan saat build, bukan di browser. */
export function publicFileExists(url: string): boolean {
  return existsSync(path.join(process.cwd(), "public", url));
}

/**
 * Memeriksa file hero mana yang benar-benar ada, sehingga halaman tidak merender
 * bingkai video kosong atau meminta file yang tidak ada (404).
 */
export function getHeroMediaAvailability(slug: BrandSlug): HeroMediaAvailability {
  const media = getHeroMedia(slug);
  const check = (source: typeof media.landscape) => ({
    mp4: publicFileExists(source.mp4),
    av1: publicFileExists(source.av1),
    endFrame: publicFileExists(source.endFrame),
  });
  return { landscape: check(media.landscape), portrait: check(media.portrait) };
}

/**
 * Menghapus field `image` dari produk yang file fotonya tidak ada di public/,
 * sehingga kartu menampilkan ikon pengganti alih-alih gambar rusak (404).
 * Peringatan dicetak saat build agar file yang hilang mudah ditemukan.
 */
export function withExistingProductImages(
  slug: BrandSlug,
  categories: readonly ProductCategory[],
): ProductCategory[] {
  return categories.map((category) => ({
    ...category,
    products: category.products.map((product) => {
      if (!product.image) return product;
      if (publicFileExists(getProductImageUrl(slug, product.image.file))) return product;
      console.warn(
        `[media] Foto "${product.image.file}" untuk "${product.name}" tidak ditemukan di ` +
          `public/media/brands/${slug}/products/; kartu memakai ikon pengganti.`,
      );
      return { ...product, image: undefined };
    }),
  }));
}
