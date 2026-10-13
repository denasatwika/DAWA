# Arsitektur

## Gambaran umum

Situs sepenuhnya statis. `next build` memvalidasi konten, merender setiap halaman menjadi HTML,
lalu Nginx menyajikannya. Tidak ada server aplikasi, database, maupun API di production.

```
konten (TypeScript) ──► validasi zod ──► halaman (Server Components) ──► HTML statis ──► Nginx
```

## Struktur folder

```
.
├── .github/workflows/ci.yml      Pipeline CI: check → build → docker build
├── docker/nginx/                 Konfigurasi Nginx & header keamanan
├── docs/                         Dokumentasi teknis dan panduan konten
├── public/media/brands/<slug>/   Media per brand (hero/, products/)
├── scripts/                      Skrip operasional (pengolahan video)
└── src/
    ├── app/                      ROUTING SAJA — tipis, merangkai fitur
    │   ├── layout.tsx            Shell: font, style global, header, footer
    │   ├── page.tsx              Beranda holding
    │   ├── [brand]/page.tsx      Template halaman brand (3 rute statis)
    │   ├── not-found.tsx
    │   ├── sitemap.ts
    │   └── robots.ts
    ├── components/               Komponen generik, tanpa pengetahuan domain
    │   ├── layout/               SiteHeader, SiteFooter
    │   └── ui/                   ButtonLink, Container, Icon
    ├── config/                   Konstanta aplikasi: identitas situs, rute, konvensi media
    ├── content/                  Data & kontrak data
    │   ├── schema.ts             Skema zod + tipe turunannya
    │   ├── brands/*.ts           Satu file per brand
    │   └── index.ts              Repository (server-only): getBrands, getBrand, getBrandSlugs
    ├── features/                 Modul domain
    │   ├── brand/                BrandHero, BrandLocalNav, BrandShowcase
    │   └── catalog/              ProductCatalog, ProductCard
    ├── hooks/                    Hook React lintas fitur
    ├── lib/                      Fungsi murni + unit test (format harga, WhatsApp, kontras warna)
    ├── styles/                   tokens.css (design tokens) & base.css (reset, tipografi)
    ├── test/                     Utilitas test
    └── types/                    Augmentasi tipe global
```

## Aturan dependensi

Impor hanya boleh mengalir ke bawah:

```
app  →  features  →  components  →  config / lib / hooks  →  content/schema (tipe)
```

- `components/` tidak boleh mengimpor dari `features/` atau `content/index.ts`.
- `features/` tidak saling mengimpor; jika butuh hal bersama, pindahkan ke `components/` atau `lib/`.
- Hanya `app/` yang memanggil repository `@/content`. Komponen menerima data lewat props.
- Setiap modul diakses lewat `index.ts`-nya (mis. `@/features/brand`), bukan path file internal.

## Konvensi komponen

Setiap komponen berada di foldernya sendiri:

```
BrandHero/
├── BrandHero.tsx           Komponen
├── BrandHero.module.css    Style ber-scope (CSS Modules)
├── useHeroVideo.ts         Logika yang dipisah dari tampilan
└── index.ts                Ekspor publik
```

- Server Component secara default. `"use client"` hanya untuk komponen yang butuh interaksi
  (`SiteHeader`, `BrandHero`).
- Style hanya memakai variabel dari `styles/tokens.css`, bukan nilai warna atau ukuran mentah.
- Teks yang terlihat pengguna berbahasa Indonesia; nama kode berbahasa Inggris.

## Keputusan teknis

| Keputusan                                   | Alasan                                                                                                      |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Static export + Nginx                       | Tidak ada fitur dinamis; lebih cepat, murah, dan permukaan serangan minimal.                                |
| Konten di TypeScript + validasi zod         | Kesalahan input menggagalkan build, bukan tampil rusak. Repository bisa diganti CMS tanpa mengubah halaman. |
| `server-only` pada repository               | Mencegah zod & seluruh katalog ikut terkirim ke browser.                                                    |
| Media berbasis konvensi path                | Konten tidak menulis path video; skrip `media:hero` menaruh file di lokasi yang benar.                      |
| Video dipilih per orientasi layar           | Ponsel dan iPad tegak sama-sama mendapat versi 9:16.                                                        |
| `object-fit: contain` + latar = latar video | Video tidak pernah terpotong; tepinya tidak terlihat.                                                       |
| Font self-hosted (@fontsource)              | Tidak bergantung pada Google Fonts saat build maupun runtime; sesuai CSP `font-src 'self'`.                 |
| Nginx unprivileged + `read_only`            | Container berjalan tanpa root dan dengan filesystem hanya-baca.                                             |
