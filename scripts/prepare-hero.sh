#!/usr/bin/env bash
#
# Menyiapkan video hasil Veo menjadi aset hero yang siap pakai.
#
# Pemakaian:
#   npm run media:hero -- <video-input> <slug-brand> [geser-crop-x]
#
# Contoh:
#   npm run media:hero -- ~/Downloads/veo-rentalek.mp4 rentalek
#   npm run media:hero -- ~/Downloads/veo-rentalek.mp4 rentalek 600
#
# Hasil di public/media/brands/<slug>/hero/ (sesuai konvensi src/config/media.ts):
#   landscape.mp4 / landscape-av1.mp4   16:9 untuk layar mendatar (lebar maks. 1920px)
#   portrait.mp4  / portrait-av1.mp4    4:5 (crop tengah) untuk layar tegak (tinggi maks. 1920px)
#   landscape-end.webp / portrait-end.webp   frame terakhir (poster)
#
# Dua format: AV1 (paling kecil, dipilih browser modern) dan H.264 (cadangan semua browser).
# Pengaturan kompresi diuji pada video hero Mula Solusi (1920×1080, 7 detik):
# AV1 ±700 KB, H.264 ±1,5 MB; tekstur halus tetap terjaga dibanding video sumber.
#
# Kebutuhan:
#   - ffmpeg dengan encoder libx264 dan libsvtav1  (macOS: brew install ffmpeg)
#   - encoder WebP: libwebp di ffmpeg, ATAU tool cwebp (macOS: brew install webp)

set -euo pipefail

readonly VALID_SLUGS=("mula-solusi" "rentalek" "dawa-decoration")

usage() {
  echo "Pemakaian: npm run media:hero -- <video-input> <slug-brand> [geser-crop-x]" >&2
  echo "Slug valid: ${VALID_SLUGS[*]}" >&2
  exit 1
}

[[ $# -lt 2 ]] && usage

# ---------------------------------------------------------------------------
# Pemeriksaan awal: gagal SEBELUM mulai encode, bukan di tengah jalan
# ---------------------------------------------------------------------------
command -v ffmpeg >/dev/null || { echo "ffmpeg tidak ditemukan. Pasang dengan: brew install ffmpeg" >&2; exit 1; }

ENCODERS=$(ffmpeg -hide_banner -encoders 2>/dev/null)
has_encoder() { grep -qE "^ *V[^ ]* +$1 " <<<"$ENCODERS"; }

for enc in libx264 libsvtav1; do
  has_encoder "$enc" || { echo "ffmpeg Anda tidak memiliki encoder $enc." >&2; exit 1; }
done

# Frame akhir disimpan sebagai WebP. Pakai libwebp milik ffmpeg jika ada;
# jika tidak, ekstrak PNG lalu konversi dengan cwebp.
if has_encoder libwebp; then
  WEBP_TOOL="ffmpeg"
elif command -v cwebp >/dev/null; then
  WEBP_TOOL="cwebp"
else
  echo "Encoder WebP tidak tersedia. Pasang dengan: brew install webp" >&2
  exit 1
fi

INPUT="$1"
SLUG="$2"
CROP_X="${3:-}"

[[ -f "$INPUT" ]] || { echo "File tidak ditemukan: $INPUT" >&2; exit 1; }
[[ " ${VALID_SLUGS[*]} " == *" $SLUG "* ]] || { echo "Slug tidak dikenal: $SLUG" >&2; usage; }

OUT="public/media/brands/${SLUG}/hero"
mkdir -p "$OUT"

# Hitam hasil kompresi (#050505–#0A0A0A) → #000 murni, agar menyatu dengan hero.background.
# Dimatikan secara default: pada video yang dominan gelap, ini ikut menghapus detail bayangan.
# Aktifkan hanya bila tepi video terlihat abu di atas latar hitam: BLACK_LIFT=0.04 npm run media:hero ...
readonly BLACK_LIFT="${BLACK_LIFT:-0}"
if [[ "$BLACK_LIFT" != "0" ]]; then
  BLACK="colorlevels=rimin=${BLACK_LIFT}:gimin=${BLACK_LIFT}:bimin=${BLACK_LIFT},"
else
  BLACK=""
fi
# Hero tampil ±1200px CSS; layar Retina butuh ±2× piksel, jadi pertahankan hingga 1920px
# (tidak pernah memperbesar video yang lebih kecil dari batas ini)
readonly SCALE_WIDE="scale='min(1920,iw)':-2:flags=lanczos"
readonly SCALE_TALL="scale=-2:'min(1920,ih)':flags=lanczos"
# Potongan tegak 4:5 (bukan 9:16): lebih lebar, sehingga adegan close-up yang lebar
# tidak terlalu banyak terpotong di ponsel. Lebar dibulatkan genap (syarat encoder).
if [[ -n "$CROP_X" ]]; then CROP="crop=trunc(ih*4/5/2)*2:ih:${CROP_X}:0"; else CROP="crop=trunc(ih*4/5/2)*2:ih"; fi

# CRF lebih kecil = kualitas lebih tinggi & file lebih besar.
# AV1 30 / H.264 23 menjaga tekstur halus (diuji pada video hero Mula Solusi 1920×1080).
readonly H264=(-c:v libx264 -profile:v high -pix_fmt yuv420p -preset veryslow -crf 23 -movflags +faststart)
readonly AV1=(-c:v libsvtav1 -pix_fmt yuv420p -preset 4 -crf 30 -movflags +faststart)

# SVT_LOG=1: encoder AV1 hanya mencetak error, bukan log info panjang
encode() { SVT_LOG=1 ffmpeg -loglevel error -y -i "$INPUT" -an -vf "$1" "${@:2}"; }

echo "› Landscape 16:9"
encode "${BLACK}${SCALE_WIDE}" "${H264[@]}" "$OUT/landscape.mp4"
encode "${BLACK}${SCALE_WIDE}" "${AV1[@]}" "$OUT/landscape-av1.mp4"

echo "› Portrait 4:5"
encode "${BLACK}${CROP},${SCALE_TALL}" "${H264[@]}" "$OUT/portrait.mp4"
encode "${BLACK}${CROP},${SCALE_TALL}" "${AV1[@]}" "$OUT/portrait-av1.mp4"

# Format WebM lama tidak dipakai lagi; hapus agar tidak ikut terunggah
rm -f "$OUT/landscape.webm" "$OUT/portrait.webm"

echo "› Frame terakhir (via $WEBP_TOOL)"
for variant in landscape portrait; do
  src="$OUT/${variant}.mp4"
  dest="$OUT/${variant}-end.webp"
  if [[ "$WEBP_TOOL" == "ffmpeg" ]]; then
    ffmpeg -loglevel error -y -sseof -0.2 -i "$src" -update 1 -c:v libwebp -quality 85 "$dest"
  else
    tmp_png="$(mktemp -t hero-end-XXXXXX).png"
    ffmpeg -loglevel error -y -sseof -0.2 -i "$src" -update 1 -c:v png "$tmp_png"
    cwebp -quiet -q 85 "$tmp_png" -o "$dest"
    rm -f "$tmp_png"
  fi
done

echo "✓ Selesai → $OUT"
ls -lh "$OUT" | awk 'NR > 1 { printf "  %6s  %s\n", $5, $9 }'
