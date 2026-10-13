import { z } from "zod";

export const BRAND_SLUGS = ["mula-solusi", "rentalek", "dawa-decoration"] as const;
export const brandSlugSchema = z.enum(BRAND_SLUGS);

const kebabId = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Gunakan huruf kecil, angka, dan tanda hubung");
const text = z.string().trim().min(1);
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Gunakan format #RRGGBB");

export const SURFACES = ["black", "night", "graphite", "light", "white"] as const;
export const surfaceSchema = z.enum(SURFACES);

export const priceOptionSchema = z.object({
  /** Varian harga, mis. "5 meter". */
  label: text,
  amount: z.number().int().nonnegative(),
});

export const priceSchema = z.object({
  amount: z.number().int().nonnegative().nullable(),
  from: z.boolean().default(false),
  unit: text.optional(),
  /** Harga per varian (mis. per panjang kabel); tampil lengkap di detail produk. */
  options: z.array(priceOptionSchema).min(2).optional(),
});

/** Ikon pengganti untuk produk yang belum punya foto. */
export const PRODUCT_ICONS = [
  "radio",
  "charger",
  "headset",
  "usb",
  "package",
  "mixer",
  "microphone",
  "disco",
  "spotlight",
  "book-stand",
  "mic-stand",
  "lamp-stand",
  "speaker",
  "cable",
  "monitor",
] as const;

export const productSpecSchema = z.object({
  label: text,
  value: text,
});

export const productSchema = z.object({
  id: kebabId,
  name: text,
  price: priceSchema,
  image: z
    .object({
      file: z.string().regex(/^[\w-]+\.(webp|avif|jpe?g|png)$/, "Nama file gambar tidak valid"),
      alt: text,
    })
    .optional(),
  icon: z.enum(PRODUCT_ICONS).optional(),
  /** Ringkasan satu baris di bawah nama produk, mis. "UHF 400-470 MHz · 16 channel". */
  summary: text.max(60, "Ringkasan produk maksimal 60 karakter").optional(),
  specs: z.array(productSpecSchema).min(1).max(12),
});

export const categorySchema = z.object({
  id: kebabId,
  name: text,
  products: z.array(productSchema).min(1),
});

export const heroSchema = z.object({
  /**
   * Judul kecil di atas tagline. Opsional: jika dihapus, judul tidak tampil, tetapi
   * halaman tetap punya <h1> tersembunyi berisi nama brand (untuk SEO & pembaca layar).
   */
  headline: text.optional(),
  tagline: text.max(60, "Tagline hero maksimal 60 karakter agar tetap ringkas"),
  background: hexColor,
  loop: z.boolean().default(false),
  portraitOnMobile: z.boolean().default(false),
  surface: surfaceSchema.default("white"),
});

export const brandSchema = z
  .object({
    slug: brandSlugSchema,
    name: text,
    summary: text.max(120),
    accentColor: hexColor,
    highlightColor: hexColor.optional(),
    showRelatedBrands: z.boolean().default(true),
    /** true = halaman brand hanya menampilkan "Coming soon" (katalog belum dibuka). */
    comingSoon: z.boolean().default(false),
    theme: z.enum(["light", "dark"]).default("light"),
    contact: z.object({
      whatsapp: z.string().regex(/^62\d{8,13}$/, "Format: 62xxxxxxxxxx tanpa '+'"),
      instagram: z.url(),
    }),
    hero: heroSchema,
    catalog: z.object({
      title: text,
      intro: text.optional(),
      surface: surfaceSchema.default("light"),
      categories: z.array(categorySchema).min(1),
    }),
  })
  .superRefine((brand, ctx) => {
    const seen = new Set<string>();
    for (const category of brand.catalog.categories) {
      for (const product of category.products) {
        if (seen.has(product.id)) {
          ctx.addIssue({
            code: "custom",
            message: `ID produk ganda "${product.id}" di ${brand.name}`,
          });
        }
        seen.add(product.id);
      }
    }
  });

export type BrandSlug = z.infer<typeof brandSlugSchema>;
export type Price = z.output<typeof priceSchema>;
export type PriceOption = z.output<typeof priceOptionSchema>;
export type Product = z.output<typeof productSchema>;
export type ProductIcon = z.output<typeof productSchema>["icon"];
export type ProductCategory = z.output<typeof categorySchema>;
export type HeroContent = z.output<typeof heroSchema>;
export type Surface = z.output<typeof surfaceSchema>;
export type BrandTheme = z.output<typeof brandSchema>["theme"];
export type Brand = z.output<typeof brandSchema>;

export type BrandInput = z.input<typeof brandSchema>;

export const defineBrand = (input: BrandInput): BrandInput => input;
