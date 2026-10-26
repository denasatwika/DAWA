import { defineBrand } from "../schema";

/*
 * Katalog sewa Mula Solusi.
 * Foto produk: letakkan di public/media/brands/mula-solusi/products/, lalu isi field `image`
 * (lihat docs/CONTENT_GUIDE.md). Selama foto belum ada, kartu menampilkan ikon `icon`.
 * Gaya foto yang dianjurkan: latar gelap bertekstur, cahaya samping yang lembut, produk di tengah.
 */
const cablePrice = {
  amount: 15_000,
  from: true,
  options: [
    { label: "5 meter", amount: 15_000 },
    { label: "10 meter", amount: 20_000 },
    { label: "15 meter", amount: 25_000 },
    { label: "20 meter", amount: 30_000 },
  ],
};

const cableLengths = { label: "Pilihan panjang", value: "5, 10, 15, dan 20 meter" };

export const mulaSolusi = defineBrand({
  slug: "mula-solusi",
  name: "Mula Solusi",
  summary: "Sewa HT untuk komunikasi tim yang lancar di setiap acara.",
  accentColor: "#1D6FE0",
  highlightColor: "#E8721C",
  theme: "dark",
  showRelatedBrands: false,
  contact: {
    whatsapp: "6285858292804",
    instagram: "https://www.instagram.com/mulasolusi/",
  },
  hero: {
    // headline: "MULASOLUSI",
    tagline: "SIAP MEMBANTU KOMUNIKASI TIM ANDA",
    background: "#000000",
    surface: "black",
  },
  catalog: {
    title: "Jelajahi layanan kami.",
    surface: "night",
    categories: [
      {
        id: "ht",
        name: "Handy Talky",
        products: [
          {
            id: "ht-bf-888s",
            summary: "UHF 400-470 MHz · 16 channel · ±6-12 jam",
            name: "HT BF-888S",
            icon: "radio",
            image: {
              file: "bf-888s.webp",
              alt: "Handy Talky Baofeng BF-888S hitam dengan antena pendek",
            },
            price: { amount: 8_000, unit: "/ unit / hari" },
            specs: [
              { label: "Jangkauan", value: "±1-5 km (tergantung kondisi lapangan)" },
              { label: "Rentang frekuensi", value: "UHF 400-470 MHz" },
              { label: "Jumlah saluran", value: "16 channel" },
              { label: "Kapasitas baterai", value: "2.800 mAh (Li-ion)" },
              { label: "Daya tahan baterai", value: "±6-12 jam" },
              { label: "Kelengkapan", value: "Headset dan charger termasuk dalam paket sewa" },
            ],
          },
          {
            id: "ht-bf-uv87",
            summary: "128 channel · baterai 2.800 mAh",
            name: "HT BF-UV82",
            icon: "radio",
            image: {
              file: "bf-uv-82.webp",
              alt: "Handy Talky Baofeng BF-888S hitam dengan antena pendek",
            },
            price: { amount: 15_000, unit: "/ unit / hari" },
            specs: [
              { label: "Jangkauan", value: "±1-5 km (tergantung kondisi lapangan)" },
              {
                label: "Rentang frekuensi",
                value: "65-108 MHz (perlu konfirmasi frekuensi komunikasi)",
              },
              { label: "Jumlah saluran", value: "128 channel" },
              { label: "Kapasitas baterai", value: "2.800 mAh" },
              { label: "Daya tahan baterai", value: "±6-12 jam" },
            ],
          },
          {
            id: "ht-wln",
            summary: "UHF 400-470 MHz · 16 channel · ±6-12 jam",
            name: "HT WLN",
            icon: "radio",
            image: {
              file: "ht-wln.webp",
              alt: "Handy Talky WL-N hitam dengan antena pendek",
            },
            price: { amount: 8_000, unit: "/ unit / hari" },
            specs: [
              { label: "Jangkauan", value: "±1-5 km (tergantung kondisi lapangan)" },
              { label: "Rentang frekuensi", value: "UHF 400-470 MHz" },
              { label: "Jumlah saluran", value: "16 channel" },
              { label: "Kapasitas baterai", value: "1.000 mAh (Li-ion)" },
              { label: "Daya tahan baterai", value: "±6-12 jam" },
              { label: "Kelengkapan", value: "Headset dan charger termasuk dalam paket sewa" },
            ]
          },
        ],
      },
      {
        id: "audio",
        name: "Audio",
        products: [
          {
            id: "mixer-hardwell",
            summary: "12 channel · Bluetooth · efek 24-bit",
            name: "Mixer Hardwell Professional Audio",
            icon: "mixer",
            image: {
              file: "mixer.webp",
              alt: "Handy Talky Baofeng BF-888S hitam dengan antena pendek",
            },
            price: { amount: 100_000, unit: "/ unit / hari" },
            specs: [
              { label: "Jumlah channel", value: "12 channel Mic/Line" },
              {
                label: "Pengaturan audio",
                value: "Gain control dengan 3-band EQ (High, Mid, Low)",
              },
              {
                label: "Efek digital",
                value: "Dual engine digital multi-effect reverb 24-bit (16 DSP)",
              },
              { label: "Auxiliary", value: "2 Aux (1 Aux Send dan 1 Aux/Effect)" },
              { label: "Output audio", value: "Headphone dan monitor output, pengaturan terpisah" },
              {
                label: "Fitur multimedia",
                value: "MP3 player, USB interface, Bluetooth, recording",
              },
              { label: "Pengaturan MP3", value: "EQ tone control (High dan Low)" },
              { label: "Master fader", value: "Untuk effector dan MP3" },
              { label: "Channel fader", value: "12 buah fader (ukuran perlu dikonfirmasi)" },
              { label: "Phantom power", value: "+48 V untuk mikrofon kondensor di setiap channel" },
              { label: "Fitur mute", value: "Tersedia di setiap channel" },
            ],
          },
          {
            id: "mic-wireless-super-200",
            summary: "UHF 520-830 MHz · wireless",
            name: "Microphone Wireless Recording Tech Super 200",
            icon: "microphone",
            image: {
              file: "microphone-wireless.webp",
              alt: "Handy Talky Baofeng BF-888S hitam dengan antena pendek",
            },
            price: { amount: 75_000, unit: "/ unit / hari" },
            specs: [
              { label: "Jenis mikrofon", value: "UHF wireless microphone" },
              { label: "Rentang frekuensi", value: "520-830 MHz" },
              { label: "Mode modulasi", value: "FM" },
              { label: "Respons frekuensi audio", value: "60 Hz-18 kHz (±3 dB)" },
              { label: "Catu daya receiver", value: "DC 12-16 V, 300 mA" },
            ],
          },
        ],
      },
      {
        id: "lampu",
        name: "Lampu",
        products: [
          {
            id: "lampu-disko-led-rgb",
            summary: "54 LED RGB · 54 W",
            name: "Lampu Disko LED RGB",
            icon: "disco",
            image: {
              file: "lampu-disko.webp",
              alt: "Lampu Disko LED RGB",
            },
            price: { amount: 35_000, unit: "/ unit / hari" },
            specs: [
              { label: "Tegangan operasional", value: "AC 110-220 V" },
              { label: "Daya", value: "54 W" },
              { label: "Frekuensi", value: "50-60 Hz" },
              { label: "Warna pencahayaan", value: "RGB (Red, Green, Blue)" },
              { label: "Sumber cahaya", value: "LED" },
              { label: "Jumlah LED", value: "54 buah" },
            ],
          },
          {
            id: "lampu-sorot-led",
            summary: "100 W · 21 × 18 cm",
            name: "Lampu Sorot LED",
            icon: "spotlight",
            image: {
              file: "lampu-sorot.webp",
              alt: "Lampu Sorot LED",
            },
            price: { amount: 35_000, unit: "/ unit / hari" },
            specs: [
              { label: "Daya", value: "100 W" },
              { label: "Tegangan operasional", value: "AC 175-265 V" },
              { label: "Dimensi", value: "21 × 18 cm" },
            ],
          },
        ],
      },
      {
        id: "stand",
        name: "Stand",
        products: [
          {
            id: "stand-book-p06-hc",
            summary: "Tinggi ±120 cm · papan 50 × 34 cm",
            name: "Stand Book / Stand Teks P-06 HC",
            icon: "book-stand",
            image: {
              file: "stand-book.webp",
              alt: "Stand Book / Stand Teks P-06 HC",
            },
            price: { amount: 40_000, unit: "/ unit / hari" },
            specs: [
              { label: "Tinggi maksimal", value: "±120 cm" },
              { label: "Ukuran papan", value: "50 × 34 cm" },
            ],
          },
          {
            id: "stand-mikrofon",
            summary: "Tinggi 148 cm · tiang 74 cm",
            name: "Stand Mikrofon",
            icon: "mic-stand",
            image: {
              file: "stand-mic.webp",
              alt: "Stand Mikrofon",
            },
            price: { amount: 40_000, unit: "/ unit / hari" },
            specs: [
              { label: "Tinggi maksimal", value: "148 cm" },
              { label: "Panjang tiang mikrofon", value: "74 cm" },
            ],
          },
          {
            id: "stand-lampu-sorot",
            summary: "Untuk 1-2 lampu · tinggi 160 cm",
            name: "Stand Lampu Sorot",
            icon: "lamp-stand",
            image: {
              file: "stand-lampu.webp",
              alt: "Stand Lampu Sorot",
            },
            price: { amount: 25_000, unit: "/ unit / hari" },
            specs: [
              { label: "Kapasitas", value: "1 atau 2 lampu sorot (posisi kanan dan kiri)" },
              { label: "Tinggi maksimal", value: "160 cm" },
            ],
          },
          {
            id: "stand-speaker",
            summary: "Tinggi maksimal 162 cm",
            name: "Stand Sound / Stand Speaker",
            icon: "speaker",
            image: {
              file: "stand-sound.webp",
              alt: "Stand Sound / Stand Speaker",
            },
            price: { amount: 40_000, unit: "/ unit / hari" },
            specs: [{ label: "Tinggi maksimal", value: "162 cm" }],
          },
        ],
      },
      {
        id: "kabel",
        name: "Kabel",
        products: [
          {
            id: "kabel-jack-xlr",
            summary: "Jack 6,35 mm ke XLR · 5-20 m",
            name: "Kabel JACK to XLR",
            icon: "cable",
            image: {
              file: "jack-xlr.webp",
              alt: "Kabel Jack 6,35 mm to XLR",
            },
            price: cablePrice,
            specs: [{ label: "Jenis konektor", value: "Jack 6,35 mm ke XLR" }, cableLengths],
          },
          {
            id: "kabel-xlr-xlr",
            summary: "XLR ke XLR · 5-20 m",
            name: "Kabel XLR to XLR",
            icon: "cable",
            image: {
              file: "xlr-xlr.webp",
              alt: "Kabel XLR to XLR",
            },
            price: cablePrice,
            specs: [{ label: "Jenis konektor", value: "XLR ke XLR" }, cableLengths],
          },
          {
            id: "kabel-jack-jack",
            summary: "Jack 6,35 mm ke Jack · 5-20 m",
            name: "Kabel JACK to JACK",
            icon: "cable",
            price: cablePrice,
            image: {
              file: "jack-to-jack.webp",
              alt: "Kabel Jack 6,35 mm to Jack 6,35 mm",
            },
            specs: [
              { label: "Jenis konektor", value: "Jack 6,35 mm ke Jack 6,35 mm" },
              cableLengths,
            ],
          },
          {
            id: "kabel-hdmi",
            summary: "HDMI · panjang 20 meter",
            name: "Kabel HDMI",
            icon: "monitor",
            image: {
              file: "hdmi.webp",
              alt: "Kabel HDMI",
            },
            price: { amount: 30_000, unit: "/ unit / hari" },
            specs: [
              { label: "Jenis kabel", value: "HDMI" },
              { label: "Panjang kabel", value: "20 meter" },
            ],
          },
          {
            id: "stop-kontak",
            summary: "Stop kontak · 5-20 m",
            name: "Stop Kontak",
            icon: "monitor",
            image: {
              file: "stop-kontak.webp",
              alt: "Stop Kontak",
            },
            price: cablePrice,
            specs: [{ label: "Jenis konektor", value: "Stop kontak" }, cableLengths],
          },
        ],
      },
    ],
  },
});
