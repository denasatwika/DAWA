import { ComingSoon } from "@/components/layout";
import { siteConfig } from "@/config/site";
import { getBrands } from "@/content";
import { BrandShowcase } from "@/features/brand";
import styles from "./page.module.css";

export default function HomePage() {
  if (siteConfig.comingSoon) return <ComingSoon name={siteConfig.name} />;

  return (
    <>
      <section className={styles.intro} aria-labelledby="judul-grup">
        <h1 id="judul-grup" className={styles.title}>
          {siteConfig.name}
        </h1>
        <p className={styles.tagline}>{siteConfig.tagline}</p>
      </section>

      <BrandShowcase brands={getBrands()} variant="full" />
    </>
  );
}
