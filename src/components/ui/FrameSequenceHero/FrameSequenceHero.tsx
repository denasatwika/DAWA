"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MEDIA_QUERY } from "@/config/media";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";
import styles from "./FrameSequenceHero.module.css";

export interface FrameSequenceStep {
  /** Rentang progres scroll (0-1) saat kartu ini aktif. */
  from: number;
  to: number;
  title: string;
  description: string;
  /** Label pendek di kaki kartu, mis. "Pengantaran". */
  label: string;
}

interface FrameSequenceHeroProps {
  /** URL setiap frame, berurutan. Dibuat di server lalu dikirim sebagai data. */
  frames: readonly string[];
  /** Jumlah frame pertama yang dimuat sebelum loader ditutup. */
  eagerCount?: number;
  /** Panjang area scroll; makin besar, makin pelan animasinya. */
  scrollHeight?: string;
  /** Judul besar (sekaligus <h1> halaman). */
  title: ReactNode;
  subtitle?: string;
  steps: readonly FrameSequenceStep[];
  /** Warna latar panggung; samakan dengan latar frame agar tepinya tidak terlihat. */
  background?: string;
  className?: string;
}

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

/**
 * Hero "frame sequence" ala halaman produk Apple: panggung menempel di layar,
 * dan gulir halaman memutar urutan foto maju/mundur sementara kartu langkah bergantian.
 *
 * Diadaptasi dari komponen mac-book-neo-hero agar sesuai proyek ini:
 * - CSS Modules (tanpa Tailwind), navbar bawaan dibuang (situs sudah punya navbar);
 * - frame digambar ke <canvas> dari gambar yang sudah dimuat (tanpa mengganti src);
 * - tanpa window.addEventListener("scroll"): loop requestAnimationFrame hanya aktif
 *   saat hero terlihat (IntersectionObserver), progres diteruskan lewat variabel CSS,
 *   dan React hanya di-render ulang saat langkah aktif berganti;
 * - "kurangi gerakan": satu frame statis + semua kartu ditampilkan berurutan.
 */
export function FrameSequenceHero({
  frames,
  eagerCount = 60,
  scrollHeight = "500vh",
  title,
  subtitle,
  steps,
  background = "#ffffff",
  className,
}: FrameSequenceHeroProps) {
  const reduceMotion = useMediaQuery(MEDIA_QUERY.reducedMotion);
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(0);
  const [active, setActive] = useState(-1);
  const frameCount = frames.length;
  const eager = Math.min(eagerCount, frameCount);

  // Pramuat frame: sebagian dulu (agar cepat siap), sisanya setelah itu
  useEffect(() => {
    if (reduceMotion || frameCount === 0) return;
    let settled = 0;
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = images;
    const load = (i: number) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = img.onerror = () => {
        if (cancelled) return;
        settled += 1;
        setLoaded(settled);
        if (settled === eager) for (let j = eager; j < frameCount; j++) load(j);
      };
      img.src = frames[i] ?? "";
      images[i] = img;
    };
    for (let i = 0; i < eager; i++) load(i);
    return () => {
      cancelled = true;
    };
  }, [frames, frameCount, eager, reduceMotion]);

  // Loop gambar & progres: hanya berjalan selama hero terlihat di layar
  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (reduceMotion || !root || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let shown = -1;
    let display = 0;
    let lastActive = -1;

    const draw = (index: number) => {
      // Pakai frame terdekat yang sudah termuat (mundur), agar tidak berkedip kosong
      let img: HTMLImageElement | undefined;
      for (let i = index; i >= 0; i--) {
        const candidate = imagesRef.current[i];
        if (candidate?.complete && candidate.naturalWidth > 0) {
          img = candidate;
          break;
        }
      }
      if (!img) return;
      const { width, height } = canvas;
      const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
      shown = index;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      shown = -1; // paksa gambar ulang
    };

    const tick = () => {
      const rect = root.getBoundingClientRect();
      const stage = root.firstElementChild as HTMLElement | null;
      const travel = root.offsetHeight - (stage?.offsetHeight ?? window.innerHeight);
      const progress = clamp(-rect.top / Math.max(1, travel));

      // Frame mengejar posisi scroll dengan halus (easing), lalu digambar bila berubah
      const target = progress * (frameCount - 1);
      display += (target - display) * 0.28;
      if (Math.abs(target - display) < 0.05) display = target;
      const index = Math.round(clamp(display, 0, frameCount - 1));
      if (index !== shown) draw(index);

      // Langkah aktif + progres di dalam langkah, lewat variabel CSS (tanpa render ulang)
      let current = -1;
      let local = 0;
      steps.forEach((step, i) => {
        if (current === -1 && progress >= step.from && progress < step.to) {
          current = i;
          local = (progress - step.from) / (step.to - step.from);
        }
      });
      root.style.setProperty("--fsh-progress", progress.toFixed(4));
      root.style.setProperty("--fsh-step-local", clamp(local).toFixed(4));
      if (current !== lastActive) {
        lastActive = current;
        setActive(current);
      }
      raf = requestAnimationFrame(tick);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry?.isIntersecting) raf = requestAnimationFrame(tick);
    });
    visibility.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      visibility.disconnect();
      resizeObserver.disconnect();
    };
  }, [reduceMotion, frameCount, steps, background]);

  const loadPct = eager === 0 ? 100 : Math.round((Math.min(loaded, eager) / eager) * 100);

  // "Kurangi gerakan": tanpa animasi scroll, satu frame statis & semua langkah
  if (reduceMotion) {
    const still = frames[Math.floor(frameCount * 0.25)];
    return (
      <section className={cn(styles.static, className)} style={{ background }}>
        <div className={styles.copy}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {still && <img src={still} alt="" className={styles.staticImage} />}
        <ol className={styles.staticSteps}>
          {steps.map((step) => (
            <li key={step.label} className={styles.card} data-state="active">
              <h2 className={styles.cardTitle}>{step.title}</h2>
              <p className={styles.cardText}>{step.description}</p>
              <span className={styles.cardLabel}>{step.label}</span>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      className={cn(styles.root, className)}
      style={{ height: scrollHeight, background }}
    >
      <div className={styles.stage}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden />

        <div className={styles.copy}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && (
            <p className={styles.subtitle} data-hidden={active >= 0 || undefined}>
              {subtitle}
            </p>
          )}
        </div>

        <ol className={styles.cards}>
          {steps.map((step, i) => (
            <li
              key={step.label}
              className={styles.card}
              data-state={i === active ? "active" : i < active ? "prev" : "next"}
              aria-hidden={i !== active}
            >
              <h2 className={styles.cardTitle}>{step.title}</h2>
              <p className={styles.cardText}>{step.description}</p>
              <div className={styles.cardFoot}>
                <span className={styles.ticks} aria-hidden>
                  {steps.map((_, j) => (
                    <i
                      key={j}
                      className={styles.tick}
                      data-state={j < i ? "done" : j === i ? "current" : "todo"}
                    />
                  ))}
                </span>
                <span className={styles.cardLabel}>{step.label}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.progress} aria-hidden>
          <span />
        </div>

        <div className={styles.loader} data-done={loadPct >= 100 || undefined} aria-hidden>
          <span className={styles.loaderText}>Memuat {loadPct}%</span>
          <span className={styles.loaderTrack}>
            <span style={{ transform: `scaleX(${loadPct / 100})` }} />
          </span>
        </div>
      </div>
    </section>
  );
}
