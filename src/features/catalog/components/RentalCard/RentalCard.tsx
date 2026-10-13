import { getProductImageUrl } from "@/config/media";
import type { BrandSlug, Product } from "@/content/schema";
import { PRICE_ON_REQUEST, formatRupiah } from "@/lib/currency";
import { PRODUCT_ICON, initials } from "../../lib/productIcons";
import { ProductSpecs } from "../ProductSpecs";
import styles from "./RentalCard.module.css";

interface RentalCardProps {
  product: Product;
  categoryName: string;
  brandSlug: BrandSlug;
  /** Membuka panel spesifikasi lengkap (dipakai di layar sentuh yang tidak punya hover). */
  onOpen: () => void;
}

/**
 * Kartu produk neumorphic (komponen "Product Card" di Figma):
 *   ┌───────────────────────────┐
 *   │ ┌─[KATEGORI]────────────┐ │  sumur "masuk" berisi foto atau ikon
 *   │ │        foto           │ │
 *   │ └───────────────────────┘ │
 *   │ Nama produk               │
 *   │ ringkasan spesifikasi     │
 *   │ HARGA SEWA                │
 *   │ Rp 8.000 / unit / hari    │
 *   └───────────────────────────┘
 * Desktop: saat kursor di atas kartu, panel spesifikasi naik menutupi isi kartu.
 * Layar sentuh: ketuk kartu untuk membuka panel spesifikasi dalam dialog.
 */
export function RentalCard({ product, categoryName, brandSlug, onOpen }: RentalCardProps) {
  const Icon = product.icon ? PRODUCT_ICON[product.icon] : undefined;
  const summary = product.summary ?? product.specs.map((spec) => spec.value).join(" · ");

  return (
    <article className={styles.card}>
      <div className={styles.well}>
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
            {Icon ? <Icon size={36} weight="light" /> : initials(product.name)}
          </span>
        )}
        <span className={styles.badge}>{categoryName}</span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>
          <button type="button" className={styles.open} onClick={onOpen} aria-haspopup="dialog">
            {product.name}
          </button>
        </h3>
        <p className={styles.summary}>{summary}</p>
      </div>

      <div className={styles.footer}>
        <div className={styles.priceBlock}>
          <small className={styles.label}>{product.price.from ? "Mulai dari" : "Harga sewa"}</small>
          <p className={styles.price}>
            {product.price.amount === null ? (
              <strong className={styles.onRequest}>{PRICE_ON_REQUEST}</strong>
            ) : (
              <>
                <strong>{formatRupiah(product.price.amount)}</strong>
                {product.price.unit && <span>{product.price.unit}</span>}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Panel spesifikasi: muncul saat kursor di atas kartu (desktop) */}
      <div className={styles.overlay} aria-hidden>
        <p className={styles.overlayTitle}>{product.name}</p>
        <ProductSpecs product={product} size="compact" />
      </div>
    </article>
  );
}
