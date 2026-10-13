"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { MEDIA_QUERY } from "@/config/media";
import styles from "./ProductRail.module.css";

interface ProductRailProps {
  /** Nama deretan untuk pembaca layar, mis. nama kategori. */
  label: string;
  children: ReactNode;
}

/**
 * Deretan kartu yang bisa digeser ke samping, seperti "Cek yang terbaru." di apple.com.
 * - Sentuh / trackpad: geser biasa, kartu "menempel" rapi (scroll-snap).
 * - Mouse: tombol ‹ › di kanan bawah, hanya muncul jika kartu melebihi lebar layar.
 */
export function ProductRail({ label, children }: ProductRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      atStart: track.scrollLeft <= 1,
      atEnd: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // ResizeObserver langsung memanggil updateEdges sekali setelah observe,
    // lalu setiap kali ukuran layar berubah.
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    track.addEventListener("scroll", updateEdges, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", updateEdges);
    };
  }, [updateEdges]);

  const scrollPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia(MEDIA_QUERY.reducedMotion).matches;
    track.scrollBy({
      left: direction * track.clientWidth * 0.8,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const isScrollable = !(edges.atStart && edges.atEnd);

  return (
    <div className={styles.rail}>
      <div ref={trackRef} className={styles.track} role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>

      {isScrollable && (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.button}
            onClick={() => scrollPage(-1)}
            disabled={edges.atStart}
            aria-label="Produk sebelumnya"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => scrollPage(1)}
            disabled={edges.atEnd}
            aria-label="Produk berikutnya"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
