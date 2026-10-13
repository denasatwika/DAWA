/** Identitas grup. Ganti sesuai data klien. */
export const siteConfig = {
  name: "DAWA",
  tagline: "Tiga keahlian, satu standar pelayanan.",
  description:
    "Grup usaha yang menaungi Mula Solusi, Rentalek, dan Dawa Decoration untuk kebutuhan acara Anda.",
  /** Diisi lewat NEXT_PUBLIC_SITE_URL saat build production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "id_ID",
  /** true = beranda grup hanya menampilkan "Coming soon". */
  comingSoon: true,
  /** Warna bilah browser; sama dengan --color-bg di tokens.css (terang & gelap). */
  themeColor: { light: "#fafaf9", dark: "#000000" },
} as const;
