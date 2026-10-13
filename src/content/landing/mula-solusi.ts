/**
 * Teks halaman khusus Mula Solusi (desain Figma "Mula Solusi – Radio Rental").
 * Data produk & harga TIDAK ditulis di sini; semuanya diambil dari brands/mula-solusi.ts.
 *
 * CONTOH KONTEN — angka statistik dan janji layanan di bawah berasal dari desain;
 * pastikan sesuai kenyataan sebelum dipublikasikan.
 */
export const mulaLanding = {
  features: [
    { icon: "delivery", title: "Antar-Jemput Unit", text: "Gratis area Denpasar & sekitarnya" },
    { icon: "tested", title: "Unit Teruji", text: "Sinyal & baterai dicek tiap sewa" },
    { icon: "flexible", title: "Sewa Fleksibel", text: "Harian, mingguan, atau per event" },
    { icon: "support", title: "Teknisi Standby", text: "Pendampingan langsung di lokasi" },
  ],
  catalog: {
    eyebrow: "Katalog sewa",
    headline: { strong: "Anda memilih,", muted: "kami yang menyiapkan." },
  },
  cta: {
    headline: "Yukk, amankan unitnya sekarang!",
    text: "Konsultasikan kebutuhan unit gratis. Kami bantu hitung jumlah HT yang pas.",
  },
} as const;

export type MulaFeatureIcon = (typeof mulaLanding.features)[number]["icon"];
