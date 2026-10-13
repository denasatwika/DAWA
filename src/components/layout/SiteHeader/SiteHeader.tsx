"use client";

import Link from "next/link";
import { routes } from "@/config/routes";
import { useMobileMenu } from "./useMobileMenu";
import styles from "./SiteHeader.module.css";

export interface NavItem {
  label: string;
  /** Rute halaman brand, mis. "/rentalek/". */
  href: string;
  /** Aksi yang tampil di kanan header saat halaman brand ini dibuka. */
  actions?: {
    /** Kosong = brand belum punya katalog (mis. masih "coming soon"); tautan disembunyikan. */
    catalogHref?: string;
    contactHref: string;
  };
}

interface SiteHeaderProps {
  siteName: string;
  items: NavItem[];
}

const normalize = (path: string) => (path.endsWith("/") ? path : `${path}/`);

/**
 * Satu-satunya navigasi situs: logo · daftar brand · aksi brand aktif.
 * Menempel di atas saat di-scroll. Aksi "Katalog" & "Hubungi" hanya muncul
 * di halaman brand, mengikuti brand yang sedang dibuka.
 */
export function SiteHeader({ siteName, items }: SiteHeaderProps) {
  const { isOpen, toggle, pathname } = useMobileMenu();
  const current = items.find((item) => pathname && normalize(pathname) === item.href);
  const actions = current?.actions;

  return (
    <header className={styles.header} data-open={isOpen}>
      <nav className={styles.bar} aria-label="Navigasi utama">
        <Link href={routes.home} className={styles.logo}>
          {siteName}
        </Link>

        <ul className={styles.links}>
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={styles.link}
                aria-current={item === current ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          {actions && (
            <>
              {actions.catalogHref && (
                <a href={actions.catalogHref} className={styles.catalog}>
                  Katalog
                </a>
              )}
              <a
                href={actions.contactHref}
                className={styles.contact}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hubungi
              </a>
            </>
          )}

          <button
            type="button"
            className={styles.toggle}
            aria-expanded={isOpen}
            aria-controls="menu-mobile"
            onClick={toggle}
          >
            <span className="sr-only">{isOpen ? "Tutup menu" : "Buka menu"}</span>
            <span className={styles.toggleBar} data-bar="top" aria-hidden />
            <span className={styles.toggleBar} data-bar="bottom" aria-hidden />
          </button>
        </div>
      </nav>

      <div id="menu-mobile" className={styles.sheet} hidden={!isOpen}>
        <ul>
          {[{ label: "Beranda", href: routes.home }, ...items].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.sheetLink}>
                {item.label}
              </Link>
            </li>
          ))}
          {actions?.catalogHref && (
            <li>
              <a href={actions.catalogHref} className={styles.sheetLink} onClick={toggle}>
                Katalog {current?.label}
              </a>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
