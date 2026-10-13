import { getProductImageUrl } from "@/config/media";
import type { BrandSlug, Product } from "@/content/schema";
import { PRODUCT_ICON, initials } from "../../lib/productIcons";
import styles from "./ProductMedia.module.css";

interface ProductMediaProps {
  product: Product;
  brandSlug: BrandSlug;
  /** Ukuran ikon pengganti (px). */
  iconSize?: number;
  className?: string;
}

/**
 * Foto produk di atas "panggung" gradasi gelap. Jika foto belum ada, tampil ikon
 * jenis produk (atau inisial) di tengah panggung, sehingga katalog tetap rapi.
 */
export function ProductMedia({ product, brandSlug, iconSize = 72, className }: ProductMediaProps) {
  const Icon = product.icon ? PRODUCT_ICON[product.icon] : undefined;

  return (
    <div className={[styles.stage, className].filter(Boolean).join(" ")}>
      {product.image ? (
        <img
          className={styles.image}
          src={getProductImageUrl(brandSlug, product.image.file)}
          alt={product.image.alt}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <span className={styles.placeholder} aria-hidden>
          {Icon ? <Icon size={iconSize} weight="light" /> : initials(product.name)}
        </span>
      )}
    </div>
  );
}
