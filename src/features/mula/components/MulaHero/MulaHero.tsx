import { HeroVideo, type HeroVideoSources } from "./HeroVideo";
import styles from "./MulaHero.module.css";

interface MulaHeroProps {
  id: string;
  /** Nama produk kecil di atas judul (sekaligus <h1> halaman). */
  lockup: string;
  /** Pernyataan besar ala apple.com. */
  title: string;
  video: HeroVideoSources;
}

/**
 * Hero ala halaman produk apple.com: nama produk kecil, pernyataan besar di tengah,
 * lalu video produk berukuran besar di bawahnya yang tepinya memudar ke latar.
 */
export function MulaHero({ id, lockup, title, video }: MulaHeroProps) {
  return (
    <section id={id} className={styles.hero} aria-labelledby="mula-hero-judul">
      <header className={styles.heading}>
        <h1 id="mula-hero-judul" className={styles.lockup}>
          {lockup}
        </h1>
        <p className={styles.title}>{title}</p>
      </header>

      <div className={styles.visual}>
        <HeroVideo sources={video} className={styles.video} />
      </div>
    </section>
  );
}
