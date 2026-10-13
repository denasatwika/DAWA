import { defineBrand } from "../schema";

// CONTOH KONTEN — ganti dengan data asli dari klien.
export const dawaDecoration = defineBrand({
  slug: "dawa-decoration",
  name: "Dawa Decoration",
  summary: "Dekorasi acara yang dirangkai detail demi detail.",
  accentColor: "#6B3A47",
  comingSoon: true,
  contact: {
    whatsapp: "6281200000003",
    instagram: "https://www.instagram.com/dawa_decoration/",
  },
  hero: {
    headline: "Dawa Decoration",
    tagline: "Setiap detail, dirangkai dengan rasa.",
    background: "#000000",
  },
  catalog: {
    title: "Pilih dekorasi Dawa.",
    intro: "Bunga, warna, dan ukuran dapat disesuaikan dengan tema acara Anda.",
    categories: [
      {
        id: "pelaminan",
        name: "Pelaminan",
        products: [
          {
            id: "pelaminan-garden",
            name: "Pelaminan Garden",
            price: { amount: 12_000_000, from: true },
            specs: [
              { label: "Lebar", value: "6-8 m" },
              { label: "Bunga", value: "Segar & artifisial" },
              { label: "Termasuk", value: "Lighting dasar" },
            ],
          },
          {
            id: "pelaminan-minimalis",
            name: "Pelaminan Minimalis",
            price: { amount: 7_500_000, from: true },
            specs: [
              { label: "Lebar", value: "4-6 m" },
              { label: "Konsep", value: "Panel kain & bunga kering" },
              { label: "Termasuk", value: "Sofa pengantin" },
            ],
          },
        ],
      },
      {
        id: "dekorasi-pendukung",
        name: "Dekorasi pendukung",
        products: [
          {
            id: "gate-masuk",
            name: "Gate Masuk",
            price: { amount: 3_500_000 },
            specs: [
              { label: "Tinggi", value: "3 m" },
              { label: "Bunga", value: "Rangkaian segar" },
            ],
          },
          {
            id: "centerpiece-meja",
            name: "Centerpiece Meja",
            price: { amount: 350_000, unit: "/ meja" },
            specs: [
              { label: "Tinggi", value: "40 cm" },
              { label: "Termasuk", value: "Lilin & vas kaca" },
            ],
          },
          {
            id: "backdrop-photobooth",
            name: "Backdrop Photobooth",
            price: { amount: 2_800_000 },
            specs: [
              { label: "Ukuran", value: "3 × 2,5 m" },
              { label: "Konsep", value: "Menyesuaikan tema" },
            ],
          },
        ],
      },
    ],
  },
});
