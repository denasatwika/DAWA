"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui";
import type { BrandSlug, Product, ProductCategory } from "@/content/schema";
import { ProductCard } from "../ProductCard";
import { ProductDialog } from "../ProductDialog";
import styles from "./ProductBrowser.module.css";

const ALL = "semua";

interface ProductBrowserProps {
  categories: ProductCategory[];
  brandSlug: BrandSlug;
}

/**
 * Filter kategori ("Semua", lalu satu tombol per kategori), grid kartu produk 3 kolom,
 * dan panel spesifikasi untuk produk yang diketuk/diklik.
 * Filter hanya muncul jika brand punya lebih dari satu kategori.
 */
export function ProductBrowser({ categories, brandSlug }: ProductBrowserProps) {
  const [active, setActive] = useState(ALL);
  const [selected, setSelected] = useState<Product | null>(null);

  const filters = [{ id: ALL, name: "Semua" }, ...categories];
  const products = categories
    .filter((category) => active === ALL || category.id === active)
    .flatMap((category) => category.products);

  return (
    <>
      {categories.length > 1 && (
        <Reveal delay={120}>
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
        </Reveal>
      )}

      {/* Diumumkan oleh pembaca layar setiap kali filter berubah */}
      <p className="sr-only" aria-live="polite">
        {products.length} produk ditampilkan
      </p>

      <div className={styles.grid}>
        {products.map((product, index) => (
          // key memuat filter aktif: saat filter diganti, kartu dipasang ulang
          // sehingga animasi kemunculannya diputar lagi.
          <Reveal key={`${active}-${product.id}`} delay={(index % 3) * 90} className={styles.item}>
            <ProductCard
              product={product}
              brandSlug={brandSlug}
              onOpen={() => setSelected(product)}
            />
          </Reveal>
        ))}
      </div>

      {selected && (
        <ProductDialog
          key={selected.id}
          product={selected}
          brandSlug={brandSlug}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
