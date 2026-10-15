# Panduan konten

Semua konten berada di `src/content/brands/`. Setelah mengubah konten, jalankan `npm run check`
dan `npm run build`. Jika ada data yang salah, build akan berhenti dan menunjukkan letak kesalahannya.

## Mengubah identitas grup

Edit `src/config/site.ts`: nama grup, tagline, dan deskripsi.

## Menambah atau mengubah produk

Buka file brand, mis. `src/content/brands/rentalek.ts`, lalu tambahkan objek di `products`:

```ts
{
  id: "kursi-crossback",                  // huruf kecil & tanda hubung, unik per brand
  name: "Kursi Crossback",
  price: { amount: 40_000, unit: "/ unit / hari" },
  image: { file: "kursi-crossback.webp", alt: "Kursi kayu crossback dengan dudukan rotan" },
  specs: [
    { label: "Material", value: "Kayu mahoni" },
    { label: "Stok", value: "200 unit" },
  ],
},
```

| Field           | Aturan                                                                                  |
| --------------- | --------------------------------------------------------------------------------------- |
| `price.amount`  | Rupiah tanpa titik. `null` = tampil "Harga sesuai permintaan".                          |
| `price.from`    | `true` = tampil "Mulai".                                                                |
| `price.options` | Opsional, min. 2 varian, mis. harga per panjang kabel. Tampil lengkap di detail produk. |
| `image`         | Opsional. Tanpa gambar, bingkai menampilkan ikon `icon`, atau inisial nama produk.      |
| `icon`          | Opsional: `radio`, `mixer`, `microphone`, `disco`, `spotlight`, `book-stand`, dst.      |
| `specs`         | 1-12 baris. Kartu hanya menampilkan nama & harga; semua spesifikasi ada di detail.      |

Contoh harga per varian:

```ts
price: {
  amount: 15_000,
  from: true,
  options: [
    { label: "5 meter", amount: 15_000 },
    { label: "10 meter", amount: 20_000 },
  ],
},
```

### Menambah atau mengganti foto produk

Jangan menaruh foto berukuran besar langsung di `public/`. Foto 2 MB per produk membuat katalog
lambat dimuat, terutama di jaringan seluler. Alurnya:

1. Simpan foto **asli** (kualitas penuh, `.webp`/`.png`/`.jpg`) di
   `media-source/products/<slug>/`, mis. `media-source/products/mula-solusi/mixer.webp`.
2. Jalankan:

   ```bash
   npm run media:products -- mula-solusi
   ```

   Skrip memperkecil foto ke lebar maks. 1200 px dan mengompresnya (±2 MB → ±20-80 KB),
   lalu menulis hasilnya ke `public/media/brands/<slug>/products/` dengan nama file yang sama
   (berakhiran `.webp`).

3. Isi `image.file` di file brand dengan nama file tersebut, lalu `npm run build`.

Letakkan produk di tengah foto dengan ruang kosong yang cukup di sekelilingnya, karena kartu
memotong foto mengikuti bentuk bingkainya.

Gaya foto untuk katalog gelap (Mula Solusi): latar gelap bertekstur (abu arang, biru malam, atau
hijau tua), cahaya samping yang lembut, produk sebagai satu-satunya objek. Hindari latar putih
polos, karena akan terlihat seperti kotak terang di halaman yang gelap.

## Judul hero

`hero.headline` adalah judul kecil di atas tagline dan boleh dihapus. Tanpa headline, judul tidak
tampil, tetapi halaman tetap memiliki judul utama (`<h1>`) tersembunyi berisi nama brand, sehingga
mesin pencari dan pembaca layar tetap mengenali halaman tersebut.

## Memasang video hero (hasil Veo)

```bash
npm run media:hero -- ~/Downloads/veo-rentalek.mp4 rentalek
```

Skrip ini membuang audio, menjadikan hitam samar menjadi `#000` murni, membuat versi 16:9
(lebar maks. 1920px) dan 4:5 untuk ponsel (tinggi maks. 1920px) dalam dua format, lalu mengambil frame terakhir
sebagai poster. Hasilnya otomatis ditaruh di `public/media/brands/<slug>/hero/`:

| File                                      | Untuk                                                        |
| ----------------------------------------- | ------------------------------------------------------------ |
| `landscape-av1.mp4`, `portrait-av1.mp4`   | AV1, paling kecil; dipakai browser modern                    |
| `landscape.mp4`, `portrait.mp4`           | H.264, cadangan untuk semua browser                          |
| `landscape-end.webp`, `portrait-end.webp` | Poster; satu-satunya yang dimuat di jaringan 2G / hemat data |

**Video di folder `media-source/` tidak dibaca website.** Setiap kali video sumber diganti,
jalankan ulang perintah di atas, lalu `npm run build`.

Video hero diputar sekali lalu berhenti di frame terakhir, dan baru diunduh saat akan diputar.
Jika objek tidak di tengah frame, geser crop portrait:

```bash
npm run media:hero -- ~/Downloads/veo-rentalek.mp4 rentalek 600
```

Pastikan `hero.background` di file brand sama dengan warna latar video (default `#000000`).

Ketentuan video agar tampil baik:

- Sepertiga atas frame kosong, karena judul hero berada di sana.
- Objek utama di tengah secara horizontal, agar crop 4:5 untuk ponsel tidak memotongnya.
- Video berakhir pada frame produk yang utuh; video berhenti di frame ini, dan frame ini juga
  dipakai sebagai poster serta latar tile beranda.

## Mengubah warna aksen brand

Edit `accentColor` di file brand. Warna dipakai untuk tombol bertulisan putih, jadi harus cukup
gelap. Unit test akan gagal jika kontrasnya di bawah standar WCAG AA (4.5 : 1).
