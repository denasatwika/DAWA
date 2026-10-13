import { ButtonLink } from "@/components/ui";
import { MEDIA_QUERY, getHeroMedia } from "@/config/media";
import { routes } from "@/config/routes";
import type { Brand } from "@/content/schema";
import { getHeroMediaAvailability } from "@/lib/media-files";
import styles from "./BrandShowcase.module.css";

interface BrandShowcaseProps {
  brands: readonly Brand[];
  /** "full" = tile besar di beranda; "compact" = kartu brand lain di akhir halaman brand. */
  variant?: "full" | "compact";
}

/**
 * Tile brand ala beranda apple.com: teks di atas, gambar produk di bawah.
 * Gambarnya frame terakhir video hero, ditampilkan utuh (tidak ter-crop).
 * Brand yang belum punya video cukup menampilkan teks di atas warna latarnya.
 */
export function BrandShowcase({ brands, variant = "full" }: BrandShowcaseProps) {
  const HeadingTag = variant === "full" ? "h2" : "h3";

  return (
    <ul className={styles[variant]}>
      {brands.map((brand) => {
        const media = getHeroMedia(brand.slug);
        const available = getHeroMediaAvailability(brand.slug);
        const hasImage = available.landscape.endFrame;
        const usePortrait = brand.hero.portraitOnMobile && available.portrait.endFrame;

        return (
          <li
            key={brand.slug}
            className={styles.tile}
            style={{ background: hasImage ? brand.hero.background : brand.accentColor }}
          >
            <div className={styles.text}>
              <HeadingTag className={styles.name}>{brand.name}</HeadingTag>
              <p className={styles.summary}>{brand.summary}</p>
              <div className={styles.actions}>
                <ButtonLink href={routes.brand(brand.slug)} variant="inverse">
                  Selengkapnya
                </ButtonLink>
                <ButtonLink href={routes.brandCatalog(brand.slug)} variant="link">
                  Lihat katalog
                </ButtonLink>
              </div>
            </div>

            {hasImage && (
              <picture className={styles.media}>
                {usePortrait && (
                  <source media={MEDIA_QUERY.portraitPhone} srcSet={media.portrait.endFrame} />
                )}
                <img src={media.landscape.endFrame} alt="" loading="lazy" decoding="async" />
              </picture>
            )}
          </li>
        );
      })}
    </ul>
  );
}
