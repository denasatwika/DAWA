"use client";

import { useEffect, useState, type RefObject } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./TapHint.module.css";

const STORAGE_KEY = "dawa:catalog-tap-hint-dismissed";
const PHONE = "(max-width: 734px)";

interface TapHintProps {
  /** Elemen yang memicu popup saat mulai terlihat (mis. grid katalog). */
  targetRef: RefObject<HTMLElement | null>;
  message: string;
}

const wasDismissed = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false; // penyimpanan diblokir (mis. mode privat): tetap tampilkan
  }
};

/**
 * Popup petunjuk khusus ponsel: muncul sekali saat katalog mulai terlihat,
 * ditutup dengan tombol "Mengerti", dan tidak muncul lagi di perangkat yang sama.
 */
export function TapHint({ targetRef, message }: TapHintProps) {
  const isPhone = useMediaQuery(PHONE);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!isPhone || !target || wasDismissed()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setOpen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [isPhone, targetRef]);

  if (!isPhone || !open) return null;

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Abaikan: popup hanya akan muncul lagi di kunjungan berikutnya
    }
  };

  return (
    <div className={styles.hint} role="dialog" aria-modal="false" aria-labelledby="tap-hint-text">
      <p id="tap-hint-text" className={styles.text}>
        {message}
      </p>
      <button type="button" className={styles.button} onClick={dismiss}>
        Mengerti
      </button>
    </div>
  );
}
