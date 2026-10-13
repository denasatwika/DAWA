"use client";

import { useEffect, useRef } from "react";
import { AV1_MIME, MEDIA_QUERY } from "@/config/media";
import {
  isConstrainedConnection,
  useConstrainedConnection,
} from "@/hooks/useConstrainedConnection";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export interface HeroVideoFiles {
  /** AV1 (lebih kecil), dipilih lebih dulu bila browser mendukung. */
  av1?: string;
  /** H.264, cadangan untuk semua browser. */
  mp4?: string;
  poster?: string;
}

export interface HeroVideoSources {
  /** Video 16:9 untuk desktop & tablet. */
  landscape: HeroVideoFiles;
  /** Video 9:16 untuk ponsel tegak (opsional). */
  portrait?: HeroVideoFiles;
}

interface HeroVideoProps {
  sources: HeroVideoSources;
  className?: string;
}

/**
 * Video produk di hero: diputar SEKALI tanpa suara, lalu berhenti di frame terakhir.
 * - File baru diunduh saat akan diputar (preload="none"); sebelum itu tampil poster ringan.
 * - Jaringan 2G / hemat data / "kurangi gerakan": video tidak diunduh, hanya poster.
 * - Ponsel tegak memakai versi 9:16; browser modern memakai AV1 yang lebih kecil.
 */
export function HeroVideo({ sources, className }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduceMotion = useMediaQuery(MEDIA_QUERY.reducedMotion);
  const isPortraitPhone = useMediaQuery(MEDIA_QUERY.portraitPhone);
  const constrained = useConstrainedConnection();
  // Jaringan 2G / hemat data / "kurangi gerakan": cukup poster, video tidak diunduh
  const posterOnly = reduceMotion || constrained;
  const { landscape, portrait } = sources;
  const poster = (isPortraitPhone && portrait?.poster) || landscape.poster;

  useEffect(() => {
    const video = ref.current;
    // Cek koneksi langsung: saat hidrasi pertama, nilai hook masih nilai prerender (false)
    if (!video || posterOnly || isConstrainedConnection()) return;
    video.muted = true; // syarat autoplay di iOS Safari
    video.play().catch(() => {
      // Autoplay ditolak browser: poster tetap tampil, tidak ada yang perlu dilakukan
    });
  }, [posterOnly]);

  const hasVideo = Boolean(landscape.mp4 || landscape.av1);
  if (!hasVideo || posterOnly) {
    return poster ? <img src={poster} alt="" className={className} /> : null;
  }

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      playsInline
      preload="none"
      aria-hidden
    >
      {portrait?.av1 && (
        <source media={MEDIA_QUERY.portraitPhone} src={portrait.av1} type={AV1_MIME} />
      )}
      {portrait?.mp4 && (
        <source media={MEDIA_QUERY.portraitPhone} src={portrait.mp4} type="video/mp4" />
      )}
      {landscape.av1 && <source src={landscape.av1} type={AV1_MIME} />}
      {landscape.mp4 && <source src={landscape.mp4} type="video/mp4" />}
    </video>
  );
}
