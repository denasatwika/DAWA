import type { BrandSlug } from "@/content/schema";

/** ID section yang dipakai sebagai target anchor. Satu sumber agar tidak ada typo. */
export const SECTION_ID = {
  main: "konten",
  overview: "ringkasan",
  catalog: "katalog",
  category: (id: string) => `kategori-${id}`,
} as const;

export const routes = {
  home: "/",
  brand: (slug: BrandSlug) => `/${slug}/`,
  brandCatalog: (slug: BrandSlug) => `/${slug}/#${SECTION_ID.catalog}`,
} as const;
