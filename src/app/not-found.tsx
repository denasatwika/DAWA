import { ButtonLink, Container } from "@/components/ui";
import { routes } from "@/config/routes";
import styles from "./not-found.module.css";
import { SiteChrome } from "./site-chrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <Container as="section" className={styles.notFound}>
        <h1 className={styles.title}>Halaman tidak ditemukan.</h1>
        <p className={styles.text}>
          Alamat ini mungkin sudah dipindahkan. Kembali ke beranda untuk melihat layanan kami.
        </p>
        <ButtonLink href={routes.home}>Ke beranda</ButtonLink>
      </Container>
    </SiteChrome>
  );
}
