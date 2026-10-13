import styles from "./ComingSoon.module.css";

interface ComingSoonProps {
  /** Nama halaman/brand, tampil kecil di atas judul dan menjadi <h1>. */
  name: string;
  /** Teks besar; default "Coming soon." */
  message?: string;
}

/** Halaman sementara untuk brand/halaman yang belum dibuka: nama kecil + pesan besar di tengah. */
export function ComingSoon({ name, message = "Coming soon." }: ComingSoonProps) {
  return (
    <section className={styles.section} aria-labelledby="coming-soon-judul">
      <h1 id="coming-soon-judul" className={styles.name}>
        {name}
      </h1>
      <p className={styles.message}>{message}</p>
    </section>
  );
}
