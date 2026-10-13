# Group Website

Company profile dan katalog grup usaha **Mula Solusi**, **Rentalek**, dan **Dawa Decoration**.
Situs statis berbasis Next.js (App Router), React 19, dan TypeScript, disajikan Nginx di dalam Docker.

## Mulai cepat

```bash
nvm use               # Node 22 (lihat .nvmrc)
npm ci
npm run dev           # http://localhost:3000
```

Production dengan Docker:

```bash
docker compose up --build          # http://localhost:8080
```

## Perintah

| Perintah             | Fungsi                                                        |
| -------------------- | ------------------------------------------------------------- |
| `npm run dev`        | Server pengembangan                                           |
| `npm run build`      | Ekspor statis ke `out/` (gagal jika konten tidak valid)       |
| `npm run check`      | Typecheck + lint + format + unit test (dijalankan di CI)      |
| `npm run test`       | Unit test (Vitest)                                            |
| `npm run format`     | Merapikan kode dengan Prettier                                |
| `npm run media:hero` | Menyiapkan video Veo menjadi aset hero (lihat panduan konten) |

## Dokumentasi

- [Arsitektur](docs/ARCHITECTURE.md) — struktur folder, aturan dependensi, dan keputusan teknis.
- [Panduan konten](docs/CONTENT_GUIDE.md) — cara mengubah produk, harga, warna, dan video hero.

## Variabel lingkungan

| Nama                   | Contoh                     | Keterangan                           |
| ---------------------- | -------------------------- | ------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | `https://www.namagrup.com` | URL kanonis untuk metadata & sitemap |
