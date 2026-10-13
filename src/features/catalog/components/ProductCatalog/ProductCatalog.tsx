import { Container, Reveal } from "@/components/ui";
import { SECTION_ID } from "@/config/routes";
import type { Brand } from "@/content/schema";
import { ProductBrowser } from "../ProductBrowser";
import styles from "./ProductCatalog.module.css";

interface ProductCatalogProps {
  brand: Brand;
}

/**
 * Section katalog selebar layar dengan warna latar sendiri (catalog.surface).
 * Judul muncul lebih dulu, lalu filter dan kartu menyusul berurutan.
 */
export function ProductCatalog({ brand }: ProductCatalogProps) {
  const { catalog } = brand;

  return (
    <section
      id={SECTION_ID.catalog}
      className={styles.catalog}
      data-surface={catalog.surface}
      aria-labelledby="judul-katalog"
    >
      <Container>
        <Reveal>
          <header className={styles.header}>
            <h2 id="judul-katalog" className={styles.title}>
              {catalog.title}
            </h2>
            {catalog.intro && <p className={styles.intro}>{catalog.intro}</p>}
          </header>
        </Reveal>

        <ProductBrowser categories={catalog.categories} brandSlug={brand.slug} />
      </Container>
    </section>
  );
}
