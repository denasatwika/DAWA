/**
 * Hero "frame sequence" halaman Rentalek.
 *
 * SUMBER FRAME SEMENTARA: foto MacBook dari demo komponen (repositori GitHub pihak ketiga,
 * tanpa lisensi). Ganti dengan frame dari video Rentalek sendiri sebelum dipublikasikan.
 * Catatan: header keamanan Nginx (docker/nginx/security-headers.conf) hanya mengizinkan
 * gambar dari domain sendiri, jadi frame dari domain lain diblokir di server produksi.
 *
 * Teks kartu diambil dari data contoh di brands/rentalek.ts.
 */
const DEMO_FRAME_TOTAL = 941;
/** Pakai 1 dari setiap 4 frame: 236 frame (±11 MB) alih-alih 941 (±45 MB). */
const FRAME_STRIDE = 4;

const demoFrame = (n: number) =>
  `https://raw.githubusercontent.com/duthiljean/hero-apple/main/frames/frame_${String(n).padStart(4, "0")}.jpg`;

export const rentalekLanding = {
  hero: {
    frames: Array.from({ length: Math.ceil(DEMO_FRAME_TOTAL / FRAME_STRIDE) }, (_, i) =>
      demoFrame(i * FRAME_STRIDE + 1),
    ),
    /** Latar panggung = warna latar frame, agar tepi foto tidak terlihat. */
    background: "#ffffff",
    scrollHeight: "500vh",
    steps: [
      {
        from: 0.02,
        to: 0.28,
        title: "Diantar ke lokasi.",
        description: "Harga sudah termasuk pengantaran di area Denpasar dan Badung.",
        label: "Pengantaran",
      },
      {
        from: 0.28,
        to: 0.55,
        title: "Kursi & meja untuk ratusan tamu.",
        description:
          "Kursi Tiffany tersedia hingga 400 unit, lengkap dengan meja bundar dan meja panjang kayu.",
        label: "Kursi & meja",
      },
      {
        from: 0.55,
        to: 0.82,
        title: "Tenda yang dipasangkan.",
        description: "Tenda sarnafil dan clear span, sudah termasuk pemasangan dan bongkar.",
        label: "Tenda",
      },
      {
        from: 0.82,
        to: 1.01,
        title: "Tim tetap terhubung.",
        description: "HT dengan earpiece dan charger, jangkauan hingga 5 km di area terbuka.",
        label: "Komunikasi",
      },
    ],
  },
} as const;
