#!/usr/bin/env bash
#
# Menyusun ulang file proyek sesuai docs/ARCHITECTURE.md.
#
# Pemakaian (dari folder yang berisi package.json):
#   bash restructure.sh
#
# Skrip mencari setiap file di mana pun ia berada (root, subfolder, atau folder mnt/
# hasil unduhan), lalu memindahkannya ke lokasi yang benar. File yang namanya kembar
# (page.tsx, page.module.css, index.ts) dikenali dari ISINYA, bukan dari namanya,
# sehingga aman meskipun hasil unduhan menamainya "page (1).tsx" atau "index 2.ts".
# File barrel index.ts dibuat ulang dari daftar di bawah.
#
# Skrip berhenti dengan pesan jelas bila ada file yang hilang atau ambigu,
# dan tidak pernah menimpa file yang sudah ada di tujuan.

set -euo pipefail
shopt -s nullglob

[[ -f package.json ]] || { echo "Jalankan dari root proyek (folder berisi package.json)." >&2; exit 1; }

# ---------------------------------------------------------------------------
# Utilitas
# ---------------------------------------------------------------------------
ERRORS=()

# Mencari file (kecuali di node_modules/.git/.next/out/__MACOSX).
# $1 = pola nama untuk find -name
find_files() {
  find . \( -path ./node_modules -o -path ./.git -o -path ./.next -o -path ./out -o -path ./__MACOSX \) -prune \
    -o -type f -name "$1" -print
}

# Memindahkan satu file ke tujuan. Jika sudah di tujuan, dilewati.
place() {
  local from="$1" to="$2"
  [[ "${from#./}" == "$to" ]] && return 0
  if [[ -e "$to" ]]; then
    ERRORS+=("Tujuan sudah ada, tidak ditimpa: $to (sumber: ${from#./})")
    return 0
  fi
  mkdir -p "$(dirname "$to")"
  mv "$from" "$to"
  printf '  %-58s → %s\n' "${from#./}" "$to"
}

# Mencari file berdasarkan nama persis lalu memindahkannya. Gagal jika 0 atau >1 kandidat.
move_unique() {
  local name="$1" to="$2"
  local found=()
  while IFS= read -r f; do found+=("$f"); done < <(find_files "$name")

  # Jika salah satu kandidat sudah di tujuan dan hanya itu, selesai.
  if [[ ${#found[@]} -eq 0 ]]; then
    ERRORS+=("Tidak ditemukan: $name (untuk $to)")
  elif [[ ${#found[@]} -gt 1 ]]; then
    ERRORS+=("Lebih dari satu '$name' ditemukan: ${found[*]}")
  else
    place "${found[0]}" "$to"
  fi
}

# Memilih satu file dari pola nama yang isinya mengandung penanda tertentu.
# $1 = pola nama, $2 = teks penanda (grep -F), $3 = tujuan
move_by_content() {
  local pattern="$1" marker="$2" to="$3"
  local found=()
  while IFS= read -r f; do
    grep -qF -- "$marker" "$f" && found+=("$f")
  done < <(find_files "$pattern")

  if [[ ${#found[@]} -eq 1 ]]; then
    place "${found[0]}" "$to"
  elif [[ ${#found[@]} -eq 0 ]]; then
    ERRORS+=("Tidak ditemukan file '$pattern' berisi \"$marker\" (untuk $to)")
  else
    ERRORS+=("Ambigu: beberapa '$pattern' berisi \"$marker\": ${found[*]}")
  fi
}

# ---------------------------------------------------------------------------
# 1. File yang namanya kembar → dikenali dari isi
# ---------------------------------------------------------------------------
echo "› Halaman (dikenali dari isi)"
move_by_content 'page*.tsx'        'generateStaticParams' 'src/app/[brand]/page.tsx'
move_by_content 'page*.tsx'        'HomePage'             'src/app/page.tsx'
move_by_content 'page*.module.css' '.relatedTitle'        'src/app/[brand]/page.module.css'
move_by_content 'page*.module.css' '.intro'               'src/app/page.module.css'

echo "› Repository konten (dikenali dari isi)"
move_by_content 'index*.ts' 'getBrands' 'src/content/index.ts'

echo "› Menghapus barrel index.ts lama (akan dibuat ulang)"
while IFS= read -r f; do
  [[ "${f#./}" == "src/content/index.ts" ]] && continue
  # Hanya hapus jika isinya murni baris export (benar-benar barrel)
  if grep -vqE '^(export .*|)$' "$f"; then
    ERRORS+=("index.ts tak dikenal, tidak dihapus: ${f#./}")
  else
    rm "$f"
  fi
done < <(find_files 'index*.ts')

# ---------------------------------------------------------------------------
# 2. File dengan nama unik
# ---------------------------------------------------------------------------
echo "› Konfigurasi proyek, Docker, CI, skrip, dokumentasi"
move_unique ARCHITECTURE.md       docs/ARCHITECTURE.md
move_unique CONTENT_GUIDE.md      docs/CONTENT_GUIDE.md
move_unique ci.yml                .github/workflows/ci.yml
move_unique default.conf          docker/nginx/default.conf
move_unique security-headers.conf docker/nginx/security-headers.conf
move_unique prepare-hero.sh       scripts/prepare-hero.sh
for f in README.md Dockerfile docker-compose.yml next.config.ts tsconfig.json \
         eslint.config.mjs vitest.config.mts package.json package-lock.json \
         .nvmrc .editorconfig .gitignore .dockerignore .prettierrc.json .prettierignore; do
  move_unique "$f" "$f"
done

echo "› src/app"
for f in layout.tsx not-found.tsx not-found.module.css robots.ts sitemap.ts; do
  move_unique "$f" "src/app/$f"
done

echo "› src/components"
move_unique SiteHeader.tsx         src/components/layout/SiteHeader/SiteHeader.tsx
move_unique SiteHeader.module.css  src/components/layout/SiteHeader/SiteHeader.module.css
move_unique useMobileMenu.ts       src/components/layout/SiteHeader/useMobileMenu.ts
move_unique SiteFooter.tsx         src/components/layout/SiteFooter/SiteFooter.tsx
move_unique SiteFooter.module.css  src/components/layout/SiteFooter/SiteFooter.module.css
move_unique Button.tsx             src/components/ui/Button/Button.tsx
move_unique Button.module.css      src/components/ui/Button/Button.module.css
move_unique Container.tsx          src/components/ui/Container/Container.tsx
move_unique Container.module.css   src/components/ui/Container/Container.module.css
move_unique Icon.tsx               src/components/ui/Icon/Icon.tsx

echo "› src/features"
for c in BrandHero BrandLocalNav BrandShowcase; do
  move_unique "$c.tsx"        "src/features/brand/components/$c/$c.tsx"
  move_unique "$c.module.css" "src/features/brand/components/$c/$c.module.css"
done
move_unique useHeroVideo.ts src/features/brand/components/BrandHero/useHeroVideo.ts
for c in ProductCard ProductCatalog; do
  move_unique "$c.tsx"        "src/features/catalog/components/$c/$c.tsx"
  move_unique "$c.module.css" "src/features/catalog/components/$c/$c.module.css"
done

echo "› src/config, src/content"
for f in site.ts routes.ts media.ts; do move_unique "$f" "src/config/$f"; done
move_unique schema.ts       src/content/schema.ts
move_unique content.test.ts src/content/content.test.ts
for b in mula-solusi rentalek dawa-decoration; do
  move_unique "$b.ts" "src/content/brands/$b.ts"
done

echo "› src/hooks, src/lib, src/styles, src/types, src/test"
move_unique useMediaQuery.ts src/hooks/useMediaQuery.ts
for f in cn.ts color.ts color.test.ts currency.ts currency.test.ts whatsapp.ts whatsapp.test.ts; do
  move_unique "$f" "src/lib/$f"
done
move_unique tokens.css          src/styles/tokens.css
move_unique base.css            src/styles/base.css
move_unique css.d.ts            src/types/css.d.ts
move_unique server-only-stub.ts src/test/server-only-stub.ts

if [[ ${#ERRORS[@]} -gt 0 ]]; then
  echo
  echo "✗ Ada masalah, struktur BELUM lengkap:" >&2
  printf '  - %s\n' "${ERRORS[@]}" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# 3. Barrel index.ts — dibuat ulang agar pasti benar
# ---------------------------------------------------------------------------
echo "› Membuat barrel index.ts"
barrel() {
  mkdir -p "$(dirname "$1")"
  cat > "$1"
  echo "  $1"
}

barrel src/components/layout/index.ts <<'TS'
export { SiteFooter } from "./SiteFooter";
export type { FooterBrandLink } from "./SiteFooter";
export { SiteHeader } from "./SiteHeader";
export type { NavItem } from "./SiteHeader";
TS
barrel src/components/layout/SiteHeader/index.ts <<'TS'
export { SiteHeader } from "./SiteHeader";
export type { NavItem } from "./SiteHeader";
TS
barrel src/components/layout/SiteFooter/index.ts <<'TS'
export { SiteFooter } from "./SiteFooter";
export type { FooterBrandLink } from "./SiteFooter";
TS
barrel src/components/ui/index.ts <<'TS'
export { ButtonLink } from "./Button";
export { Container } from "./Container";
export { PauseIcon, PlayIcon, ReplayIcon } from "./Icon";
TS
barrel src/components/ui/Button/index.ts <<'TS'
export { ButtonLink } from "./Button";
export type { ButtonSize, ButtonVariant } from "./Button";
TS
barrel src/components/ui/Container/index.ts <<'TS'
export { Container } from "./Container";
TS
barrel src/components/ui/Icon/index.ts <<'TS'
export { PauseIcon, PlayIcon, ReplayIcon } from "./Icon";
TS
barrel src/features/brand/index.ts <<'TS'
export { BrandHero } from "./components/BrandHero";
export { BrandLocalNav } from "./components/BrandLocalNav";
export { BrandShowcase } from "./components/BrandShowcase";
TS
barrel src/features/brand/components/BrandHero/index.ts <<'TS'
export { BrandHero } from "./BrandHero";
TS
barrel src/features/brand/components/BrandLocalNav/index.ts <<'TS'
export { BrandLocalNav } from "./BrandLocalNav";
TS
barrel src/features/brand/components/BrandShowcase/index.ts <<'TS'
export { BrandShowcase } from "./BrandShowcase";
TS
barrel src/features/catalog/index.ts <<'TS'
export { ProductCard } from "./components/ProductCard";
export { ProductCatalog } from "./components/ProductCatalog";
TS
barrel src/features/catalog/components/ProductCard/index.ts <<'TS'
export { ProductCard } from "./ProductCard";
TS
barrel src/features/catalog/components/ProductCatalog/index.ts <<'TS'
export { ProductCatalog } from "./ProductCatalog";
TS

# ---------------------------------------------------------------------------
# 4. Folder media & pembersihan
# ---------------------------------------------------------------------------
echo "› Folder media public/"
for b in mula-solusi rentalek dawa-decoration; do
  for sub in hero products; do
    mkdir -p "public/media/brands/$b/$sub"
    touch "public/media/brands/$b/$sub/.gitkeep"
  done
done
chmod +x scripts/prepare-hero.sh

echo "› Membersihkan sisa"
rm -rf __MACOSX
# File sampah macOS (.DS_Store dan metadata ._*)
find . -type f \( -name .DS_Store -o -name '._*' \) \
  -not -path './node_modules/*' -not -path './.git/*' -print0 | xargs -0 rm -f
# Folder kosong (mis. mnt/, "folder tanpa judul"); folder media di public/ dipertahankan
find . -mindepth 1 -type d -empty \
  -not -path './node_modules/*' -not -path './.git/*' -not -path './public/*' -delete

# File kode yang tersisa di luar lokasi yang dikenal = perlu diperiksa manual
leftover=$(find . \( -path ./node_modules -o -path ./.git -o -path ./.next -o -path ./out \
  -o -path ./src -o -path ./docs -o -path ./docker -o -path ./scripts -o -path ./.github -o -path ./public \) -prune \
  -o -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.md' -o -name '*.sh' -o -name '*.yml' -o -name '*.conf' \) \
  -print | grep -vE '^\./(README\.md|next\.config\.ts|docker-compose\.yml|restructure\.sh|next-env\.d\.ts)$' || true)
if [[ -n "$leftover" ]]; then
  echo "! Periksa file berikut, tidak dikenali oleh skrip:"
  echo "$leftover" | sed 's/^/  /'
fi

echo
echo "✓ Struktur selesai. Lanjutkan dengan:"
echo "  npm ci && npm run check && npm run build"
