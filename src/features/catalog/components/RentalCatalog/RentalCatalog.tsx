"use client";

import { useRef, useState } from "react";
import { Reveal } from "@/components/ui";
import type { BrandSlug, Product, ProductCategory } from "@/content/schema";
import { ProductDialog } from "../ProductDialog";
import { RentalCard } from "../RentalCard";
import { TapHint } from "../TapHint";
import styles from "./RentalCatalog.module.css";

const ALL = "semua";

interface RentalCatalogProps {
  id: string;
  categories: readonly ProductCategory[];
  brandSlug: BrandSlug;
  eyebrow: string;
  headline: { strong: string; muted: string };
}

/**
 * Katalog sewa bergaya neumorphic (desain Figma Mula Solusi):
 * judul + filter kategori dan grid berisi SEMUA produk.
 * Klik kartu membuka panel spesifikasi lengkap.
 */
export function RentalCatalog({
  id,
  categories,
  brandSlug,
  eyebrow,
  headline,
}: RentalCatalogProps) {
  const [active, setActive] = useState(ALL);
  const [selected, setSelected] = useState<Product | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filters = [{ id: ALL, name: "Semua" }, ...categories];
  const items = categories
    .filter((category) => active === ALL || category.id === active)
    .flatMap((category) =>
      category.products.map((product) => ({ product, categoryName: category.name })),
    );

  return (
    <section id={id} className={styles.section} aria-labelledby="katalog-judul">
      <div className={styles.head}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id="katalog-judul" className={styles.headline}>
            {headline.strong} <span className={styles.muted}>{headline.muted}</span>
          </h2>
        </div>

        {categories.length > 1 && (
          <div className={styles.filters} role="group" aria-label="Filter kategori produk">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={styles.filter}
                aria-pressed={active === filter.id}
                onClick={() => setActive(filter.id)}
              >
                {filter.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Diumumkan oleh pembaca layar setiap kali filter berubah */}
      <p className="sr-only" aria-live="polite">
        {items.length} produk ditampilkan
      </p>

      <div ref={gridRef} className={styles.grid}>
        {items.map(({ product, categoryName }, index) => (
          <Reveal key={`${active}-${product.id}`} delay={(index % 3) * 90} className={styles.item}>
            <RentalCard
              product={product}
              categoryName={categoryName}
              brandSlug={brandSlug}
              onOpen={() => setSelected(product)}
            />
          </Reveal>
        ))}
      </div>

      <TapHint
        targetRef={gridRef}
        message="Klik salah satu produk untuk melihat detail spesifikasinya."
      />

      {selected && (
        <ProductDialog
          key={selected.id}
          product={selected}
          brandSlug={brandSlug}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
