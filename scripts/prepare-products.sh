#!/usr/bin/env bash
#
# Mengoptimalkan foto produk agar cepat dimuat di website.
#
# Pemakaian:
#   npm run media:products -- <slug-brand>
#
# Contoh:
#   npm run media:products -- mula-solusi
#
# Foto ASLI (berkualitas penuh) disimpan di:
#   media-source/products/<slug>/        (tidak ikut terunggah; lihat .gitignore)
# Hasil yang dipakai website ditulis ke:
#   public/media/brands/<slug>/products/ (nama file sama, format .webp)
#
# Setiap foto diperkecil ke lebar maks. 1200px (cukup tajam untuk layar Retina pada
# kartu ±344px dan panel detail ±470px) lalu dikompres WebP kualitas 80.
# Hasil tipikal: ±2 MB → ±60-120 KB per foto.
#
# Kebutuhan: cwebp  (macOS: brew install webp)

set -euo pipefail

readonly VALID_SLUGS=("mula-solusi" "rentalek" "dawa-decoration")
readonly MAX_WIDTH=1200
readonly QUALITY=80

usage() {
  echo "Pemakaian: npm run media:products -- <slug-brand>" >&2
  echo "Slug valid: ${VALID_SLUGS[*]}" >&2
  exit 1
}

[[ $# -lt 1 ]] && usage
SLUG="$1"
[[ " ${VALID_SLUGS[*]} " == *" $SLUG "* ]] || { echo "Slug tidak dikenal: $SLUG" >&2; usage; }

command -v cwebp >/dev/null || { echo "cwebp tidak ditemukan. Pasang dengan: brew install webp" >&2; exit 1; }

SRC="media-source/products/${SLUG}"
OUT="public/media/brands/${SLUG}/products"
[[ -d "$SRC" ]] || { echo "Folder foto asli tidak ditemukan: $SRC" >&2; exit 1; }
mkdir -p "$OUT"

shopt -s nullglob nocaseglob
files=("$SRC"/*.{webp,png,jpg,jpeg})
shopt -u nocaseglob
[[ ${#files[@]} -gt 0 ]] || { echo "Tidak ada foto (.webp/.png/.jpg) di $SRC" >&2; exit 1; }

# Lebar foto dalam piksel: sips (bawaan macOS), cadangan Python + Pillow
image_width() {
  if command -v sips >/dev/null; then
    sips -g pixelWidth "$1" 2>/dev/null | awk '/pixelWidth/ { print $2 }'
  else
    python3 -I -c 'import sys; from PIL import Image; print(Image.open(sys.argv[1]).width)' "$1"
  fi
}

total_in=0
total_out=0
for src in "${files[@]}"; do
  name="$(basename "${src%.*}").webp"
  dest="$OUT/$name"

  # Hanya perkecil bila lebih lebar dari MAX_WIDTH (tidak memperbesar foto kecil)
  width=$(image_width "$src")
  resize=()
  if [[ "$width" -gt "$MAX_WIDTH" ]]; then resize=(-resize "$MAX_WIDTH" 0); fi

  cwebp -quiet -q "$QUALITY" -m 6 -mt -af -metadata none "${resize[@]}" "$src" -o "$dest"

  in=$(stat -f%z "$src" 2>/dev/null || stat -c%s "$src")
  out=$(stat -f%z "$dest" 2>/dev/null || stat -c%s "$dest")
  total_in=$((total_in + in))
  total_out=$((total_out + out))
  printf "  %6d KB → %4d KB  %s\n" $((in / 1024)) $((out / 1024)) "$name"
done

printf "✓ Selesai: %d KB → %d KB (%d foto) → %s\n" $((total_in / 1024)) $((total_out / 1024)) ${#files[@]} "$OUT"
