import { defineBrand } from "../schema";

// CONTOH KONTEN — ganti dengan data asli dari klien.
export const rentalek = defineBrand({
  slug: "rentalek",
  name: "Rentalek",
  summary: "Sewa perlengkapan acara yang terawat, diantar, dan dipasang.",
  accentColor: "#4F5E45",
  comingSoon: true,
  contact: {
    whatsapp: "6281200000002",
    instagram: "https://www.instagram.com/rentalek_/",
  },
  hero: {
    headline: "Rentalek",
    tagline: "Perlengkapan lengkap, tanpa repot.",
    background: "#000000",
  },
  catalog: {
    title: "Pilih perlengkapan Rentalek.",
    intro: "Harga sudah termasuk pengantaran di area Denpasar dan Badung.",
    categories: [
      {
        id: "komunikasi",
        name: "Komunikasi",
        products: [
          {
            id: "ht-baofeng-uv-82",
            name: "HT Baofeng UV-82",
            price: { amount: 35_000, unit: "/ unit / hari" },
            specs: [
              { label: "Jangkauan", value: "Hingga 5 km area terbuka" },
              { label: "Baterai", value: "Seharian penuh" },
              { label: "Termasuk", value: "Earpiece & charger" },
            ],
          },
        ],
      },
      {
        id: "kursi-meja",
        name: "Kursi & meja",
        products: [
          {
            id: "kursi-tiffany",
            name: "Kursi Tiffany",
            price: { amount: 25_000, unit: "/ unit / hari" },
            specs: [
              { label: "Material", value: "Resin, bantal busa" },
              { label: "Warna", value: "Putih, emas, bening" },
              { label: "Stok", value: "400 unit" },
            ],
          },
          {
            id: "meja-bundar",
            name: "Meja Bundar",
            price: { amount: 75_000, unit: "/ unit / hari" },
            specs: [
              { label: "Diameter", value: "150 cm" },
              { label: "Kapasitas", value: "8-10 kursi" },
              { label: "Termasuk", value: "Taplak putih" },
            ],
          },
          {
            id: "meja-panjang-kayu",
            name: "Meja Panjang Kayu",
            price: { amount: 150_000, unit: "/ unit / hari" },
            specs: [
              { label: "Ukuran", value: "240 × 90 cm" },
              { label: "Material", value: "Kayu jati natural" },
              { label: "Kapasitas", value: "10 kursi" },
            ],
          },
        ],
      },
      {
        id: "tenda",
        name: "Tenda",
        products: [
          {
            id: "tenda-sarnafil",
            name: "Tenda Sarnafil",
            price: { amount: 45_000, unit: "/ m² / hari" },
            specs: [
              { label: "Tinggi", value: "4 m" },
              { label: "Termasuk", value: "Pemasangan & bongkar" },
            ],
          },
          {
            id: "tenda-clear-span",
            name: "Tenda Clear Span",
            price: { amount: null },
            specs: [
              { label: "Bentang", value: "10-20 m" },
              { label: "Survei", value: "Wajib survei lokasi" },
            ],
          },
        ],
      },
    ],
  },
});
