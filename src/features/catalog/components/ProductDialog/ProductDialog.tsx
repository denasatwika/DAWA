"use client";

import { useEffect, useRef } from "react";
import { XIcon } from "@/components/ui";
import type { BrandSlug, Product } from "@/content/schema";
import { ProductMedia } from "../ProductMedia";
import { ProductSpecs } from "../ProductSpecs";
import styles from "./ProductDialog.module.css";

interface ProductDialogProps {
  product: Product;
  brandSlug: BrandSlug;
  onClose: () => void;
}

/**
 * Panel spesifikasi lengkap dalam <dialog> bawaan browser: fokus terkunci di dalam,
 * tombol Escape menutup, dan konten di belakangnya tidak bisa diklik.
 * Murni informasi (foto, harga, spesifikasi); satu-satunya tombol adalah tombol tutup.
 */
export function ProductDialog({ product, brandSlug, onClose }: ProductDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `produk-${product.id}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    // Fokus awal di panel, bukan di tombol tutup, agar tidak muncul cincin fokus saat dibuka.
    dialog.focus();
    // Halaman di belakang dialog tidak ikut ter-scroll
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      tabIndex={-1}
      onClose={onClose}
      // Klik pada latar (di luar panel) menutup dialog
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className={styles.panel}>
        <button
          type="button"
          className={styles.close}
          onClick={() => dialogRef.current?.close()}
          aria-label="Tutup spesifikasi"
        >
          <XIcon size={18} weight="bold" />
        </button>

        <ProductMedia
          product={product}
          brandSlug={brandSlug}
          iconSize={96}
          className={styles.media}
        />

        <div className={styles.info}>
          <h3 id={titleId} className={styles.name}>
            {product.name}
          </h3>
          <ProductSpecs product={product} size="full" />
        </div>
      </div>
    </dialog>
  );
}
