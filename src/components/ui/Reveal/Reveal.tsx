"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./Reveal.module.css";

interface RevealProps {
  children: ReactNode;
  /** Jeda sebelum muncul (ms), untuk efek berurutan antar elemen. */
  delay?: number;
  className?: string;
}

/**
 * Animasi kemunculan ala apple.com: elemen naik perlahan sambil memudar masuk
 * saat pertama kali terlihat di layar, lalu diam (tidak diulang saat di-scroll).
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsShown(true);
          observer.disconnect(); // cukup sekali
        }
      },
      // Muncul sedikit setelah elemen masuk layar, bukan tepat di tepi bawah
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(styles.reveal, className)}
      data-shown={isShown || undefined}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </div>
  );
}
