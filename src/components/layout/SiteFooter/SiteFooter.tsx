import Link from "next/link";
import { Container } from "@/components/ui";
import styles from "./SiteFooter.module.css";

export interface FooterBrandLink {
  name: string;
  href: string;
  instagram: string;
}

interface SiteFooterProps {
  siteName: string;
  tagline: string;
  brands: FooterBrandLink[];
}

export function SiteFooter({ siteName, tagline, brands }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container size="chrome">
        <div className={styles.columns}>
          <div className={styles.identity}>
            <p className={styles.name}>{siteName}</p>
            <p>{tagline}</p>
          </div>

          <nav aria-labelledby="footer-layanan">
            <h2 id="footer-layanan" className={styles.heading}>
              Layanan
            </h2>
            <ul className={styles.list}>
              {brands.map((brand) => (
                <li key={brand.href}>
                  <Link href={brand.href}>{brand.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-instagram">
            <h2 id="footer-instagram" className={styles.heading}>
              Instagram
            </h2>
            <ul className={styles.list}>
              {brands.map((brand) => (
                <li key={brand.instagram}>
                  <a href={brand.instagram} target="_blank" rel="noopener noreferrer">
                    {brand.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className={styles.legal}>
          © {year} {siteName}. Hak cipta dilindungi.
        </p>
      </Container>
    </footer>
  );
}
