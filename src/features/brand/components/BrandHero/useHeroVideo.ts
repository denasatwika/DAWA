"use client";

import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from "react";
import { MEDIA_QUERY } from "@/config/media";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export type HeroVideoStatus = "loading" | "playing" | "paused" | "ended" | "static";

/**
 * Siklus hidup video hero:
 * - autoplay tanpa suara, hanya ketika hero terlihat di layar;
 * - "kurangi gerakan" → video tidak diunduh/diputar, tampil frame akhir ("static");
 * - autoplay ditolak browser atau file gagal dimuat → "static";
 * - video yang sudah selesai tidak diputar ulang otomatis saat di-scroll kembali;
 * - kontrol putar / jeda / putar ulang untuk pengguna (WCAG 2.2.2).
 */
export function useHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const startedByUser = useRef(false);

  const prefersReducedMotion = useMediaQuery(MEDIA_QUERY.reducedMotion);
  const [playbackStatus, setPlaybackStatus] = useState<HeroVideoStatus>("loading");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true; // syarat autoplay di iOS Safari

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!entry.isIntersecting) {
          if (!video.paused) video.pause();
          return;
        }
        const autoplayAllowed = !prefersReducedMotion || startedByUser.current;
        if (!autoplayAllowed || pausedByUser.current || video.ended) return;
        video.play().catch(() => setFailed(true));
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused && !video.ended) {
      pausedByUser.current = true;
      video.pause();
      return;
    }
    pausedByUser.current = false;
    startedByUser.current = true;
    if (video.ended) video.currentTime = 0;
    video.play().then(
      () => setFailed(false),
      () => setFailed(true),
    );
  }, []);

  const videoEvents = {
    onPlaying: () => setPlaybackStatus("playing"),
    onPause: (event: SyntheticEvent<HTMLVideoElement>) => {
      if (!event.currentTarget.ended) setPlaybackStatus("paused");
    },
    onEnded: () => setPlaybackStatus("ended"),
  };

  const markFailed = useCallback(() => setFailed(true), []);

  // Status turunan: tidak disimpan sebagai state agar tidak ada render berantai.
  const status: HeroVideoStatus =
    playbackStatus === "playing"
      ? "playing"
      : failed || (prefersReducedMotion && playbackStatus === "loading")
        ? "static"
        : playbackStatus;

  return { videoRef, status, toggle, videoEvents, markFailed };
}
