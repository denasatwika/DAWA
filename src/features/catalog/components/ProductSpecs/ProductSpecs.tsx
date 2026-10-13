import type { Product } from "@/content/schema";
import { formatPriceParts, formatRupiah } from "@/lib/currency";
import styles from "./ProductSpecs.module.css";

interface ProductSpecsProps {
  product: Product;
  /** "compact" untuk panel hover di atas foto, "full" untuk panel detail. */
  size?: "compact" | "full";
}

/**
 * Isi spesifikasi produk: harga (atau harga per varian dalam kotak kecil)
 * lalu daftar spesifikasi. Murni informasi, tanpa tombol aksi.
 */
export function ProductSpecs({ product, size = "full" }: ProductSpecsProps) {
  const price = formatPriceParts(product.price);

  return (
    <div className={styles.specs} data-size={size}>
      {product.price.options ? (
        <dl className={styles.tiles} aria-label="Harga sewa berdasarkan panjang">
          {product.price.options.map((option) => (
            <div key={option.label} className={styles.tile}>
              <dt>{option.label}</dt>
              <dd>{formatRupiah(option.amount)}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className={styles.price}>
          <span className={styles.amount}>{price.amount}</span>
          {price.unit && <span className={styles.muted}> {price.unit}</span>}
        </p>
      )}

      <dl className={styles.list} aria-label={`Spesifikasi ${product.name}`}>
        {product.specs.map((spec) => (
          <div key={spec.label} className={styles.row}>
            <dt>{spec.label}</dt>
            <dd>{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
