import type { Price } from "@/content/schema";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export const PRICE_ON_REQUEST = "Harga sesuai permintaan";

/** "Rp 15.000" (spasi biasa, bukan spasi tak-putus). */
export function formatRupiah(amount: number): string {
  return rupiah.format(amount).replace(/\u00a0/g, " ");
}

/** "Mulai dari Rp 15.000.000", "Rp 25.000 / unit / hari", atau "Harga sesuai permintaan". */
export function formatPrice(price: Price): string {
  if (price.amount === null) return PRICE_ON_REQUEST;
  // Intl memakai spasi tak-putus; dinormalkan agar konsisten & mudah diuji.
  const amount = rupiah.format(price.amount).replace(/\u00a0/g, " ");
  return [price.from ? "Mulai dari" : null, amount, price.unit ?? null].filter(Boolean).join(" ");
}

export interface PriceParts {
  /** Label kecil di atas harga: "Mulai dari" atau "Harga". */
  label: string;
  /** Nominal, mis. "Rp 35.000", atau teks harga sesuai permintaan. */
  amount: string;
  /** Satuan, mis. "/ unit / hari". */
  unit?: string;
}

/**
 * Memecah harga menjadi bagian-bagian agar bisa ditata terpisah
 * (label kecil, nominal tebal, satuan redup), mis. di kolom kanan kartu produk.
 */
export function formatPriceParts(price: Price): PriceParts {
  if (price.amount === null) return { label: "Harga", amount: PRICE_ON_REQUEST };
  return {
    label: price.from ? "Mulai dari" : "Harga",
    amount: rupiah.format(price.amount).replace(/\u00a0/g, " "),
    unit: price.unit,
  };
}
