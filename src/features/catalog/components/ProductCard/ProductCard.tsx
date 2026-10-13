import type { BrandSlug, Product } from "@/content/schema";
import { PRICE_ON_REQUEST, formatRupiah } from "@/lib/currency";
import { ProductMedia } from "../ProductMedia";
import { ProductSpecs } from "../ProductSpecs";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  brandSlug: BrandSlug;
  /** Membuka panel spesifikasi (dipakai di layar sentuh yang tidak punya hover). */
  onOpen: () => void;
}

/**
 * Kartu produk galeri: foto persegi, nama di kiri, harga di kanan.
 * Harga tetap ditulis apa adanya ("Rp 8.000"); "Mulai dari" hanya untuk harga
 * yang bergantung ukuran (mis. kabel per panjang).
 * Desktop: saat kursor di atas kartu, panel spesifikasi naik di dalam bingkai foto.
 * Layar sentuh: ketuk kartu untuk membuka panel spesifikasi yang sama dalam ukuran besar.
 */
export function ProductCard({ product, brandSlug, onOpen }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.frame}>
        <ProductMedia product={product} brandSlug={brandSlug} className={styles.media} />

        <div className={styles.overlay} aria-hidden>
          <p className={styles.overlayTitle}>Spesifikasi</p>
          <ProductSpecs product={product} size="compact" />
        </div>
      </div>

      <div className={styles.meta}>
        <h4 className={styles.name}>
          <button type="button" className={styles.open} onClick={onOpen} aria-haspopup="dialog">
            <span className={styles.label}>{product.name}</span>
          </button>
        </h4>
        <p className={styles.price}>
          {product.price.amount === null ? (
            PRICE_ON_REQUEST
          ) : (
            <>
              {/* "Mulai dari" hanya untuk harga yang bergantung ukuran (price.from) */}
              {product.price.from && <span className={styles.from}>Mulai dari </span>}
              <span className={styles.amount}>{formatRupiah(product.price.amount)}</span>
            </>
          )}
        </p>
      </div>
    </article>
  );
}
