import styles from "./ComingSoon.module.css";

interface ComingSoonProps {
  /** Nama halaman/brand, tampil kecil di atas judul dan menjadi <h1>. */
  name: string;
  /** Teks besar; default "Coming soon." */
  message?: string;
  /** "h2" bila halaman sudah punya <h1> lain (mis. di hero). */
  headingLevel?: "h1" | "h2";
}

/** Halaman sementara untuk brand/halaman yang belum dibuka: nama kecil + pesan besar di tengah. */
export function ComingSoon({
  name,
  message = "Coming soon.",
  headingLevel = "h1",
}: ComingSoonProps) {
  const Heading = headingLevel;
  return (
    <section className={styles.section} aria-labelledby="coming-soon-judul">
      <Heading id="coming-soon-judul" className={styles.name}>
        {name}
      </Heading>
      <p className={styles.message}>{message}</p>
    </section>
  );
}
