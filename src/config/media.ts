import type { BrandSlug } from "@/content/schema";

/**
 * Konvensi lokasi media. File konten tidak menulis path video secara manual;
 * cukup letakkan file hasil `npm run media:hero` di folder yang benar.
 *
 *   public/media/brands/<slug>/hero/landscape.mp4          16:9, H.264 (semua browser)
 *   public/media/brands/<slug>/hero/landscape-av1.mp4      16:9, AV1 (lebih kecil; browser modern)
 *   public/media/brands/<slug>/hero/portrait.mp4           9:16, H.264
 *   public/media/brands/<slug>/hero/portrait-av1.mp4       9:16, AV1
 *   public/media/brands/<slug>/hero/landscape-end.webp     frame terakhir
 *   public/media/brands/<slug>/hero/portrait-end.webp
 *   public/media/brands/<slug>/products/<file>
 */
const base = (slug: BrandSlug) => `/media/brands/${slug}`;

export interface HeroVideoSource {
  /** H.264: didukung semua browser, dipakai sebagai cadangan. */
  mp4: string;
  /** AV1: ±20% lebih kecil dengan kualitas setara; dipilih lebih dulu bila browser mendukung. */
  av1: string;
  endFrame: string;
}

/** Tipe MIME + codec AV1 untuk atribut <source type>, agar browser tanpa AV1 melewatinya. */
export const AV1_MIME = 'video/mp4; codecs="av01.0.05M.08"';

export interface HeroMedia {
  landscape: HeroVideoSource;
  portrait: HeroVideoSource;
}

export function getHeroMedia(slug: BrandSlug): HeroMedia {
  const dir = `${base(slug)}/hero`;
  return {
    landscape: {
      mp4: `${dir}/landscape.mp4`,
      av1: `${dir}/landscape-av1.mp4`,
      endFrame: `${dir}/landscape-end.webp`,
    },
    portrait: {
      mp4: `${dir}/portrait.mp4`,
      av1: `${dir}/portrait-av1.mp4`,
      endFrame: `${dir}/portrait-end.webp`,
    },
  };
}

export function getProductImageUrl(slug: BrandSlug, file: string): string {
  return `${base(slug)}/products/${file}`;
}

/** Ketersediaan tiap file hero, diperiksa saat build (lihat src/lib/media-files.ts). */
export type HeroMediaAvailability = {
  [Variant in keyof HeroMedia]: { [File in keyof HeroVideoSource]: boolean };
};

/** Media query bersama antara CSS, <source media> dan matchMedia. */
export const MEDIA_QUERY = {
  /**
   * Hanya PONSEL tegak. Jendela desktop yang sempit (tinggi > lebar) tetap memakai 16:9,
   * agar video tidak ter-crop. Nilai ini sama dengan breakpoint mobile di tokens.css.
   */
  portraitPhone: "(max-width: 734px) and (orientation: portrait)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
} as const;
