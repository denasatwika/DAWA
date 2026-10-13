import { ArrowRightIcon } from "@/components/ui";
import buttons from "../../styles/buttons.module.css";
import styles from "./MulaCta.module.css";

interface MulaCtaProps {
  id: string;
  headline: string;
  text: string;
  href: string;
}

/** Pita ajakan di akhir halaman: judul & penjelasan di kiri, tombol pesan di kanan. */
export function MulaCta({ id, headline, text, href }: MulaCtaProps) {
  return (
    <section id={id} className={styles.section} aria-labelledby="mula-cta-judul">
      <div className={styles.card}>
        <div>
          <h2 id="mula-cta-judul" className={styles.headline}>
            {headline}
          </h2>
          <p className={styles.text}>{text}</p>
        </div>
        <a href={href} className={buttons.primary} target="_blank" rel="noopener noreferrer">
          Pesan Sekarang
          <ArrowRightIcon size={18} weight="bold" aria-hidden />
        </a>
      </div>
    </section>
  );
}
