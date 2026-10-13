import { ButtonLink } from "@/components/ui";
import { SECTION_ID } from "@/config/routes";
import { buildWhatsAppUrl, whatsappMessage } from "@/lib/whatsapp";
import styles from "./BrandLocalNav.module.css";

interface BrandLocalNavProps {
  brandName: string;
  whatsapp: string;
}

/** Navigasi lokal ala apple.com: menempel saat di-scroll, berisi satu aksi utama. */
export function BrandLocalNav({ brandName, whatsapp }: BrandLocalNavProps) {
  return (
    <nav className={styles.nav} aria-label={`Navigasi ${brandName}`}>
      <div className={styles.inner}>
        <a href={`#${SECTION_ID.overview}`} className={styles.title}>
          {brandName}
        </a>
        <div className={styles.actions}>
          <a href={`#${SECTION_ID.catalog}`} className={styles.link}>
            Katalog
          </a>
          <ButtonLink
            href={buildWhatsAppUrl(whatsapp, whatsappMessage.general(brandName))}
            variant="accent"
            size="sm"
            external
          >
            Hubungi
          </ButtonLink>
        </div>
      </div>
    </nav>
  );
}
