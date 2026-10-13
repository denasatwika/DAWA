import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/color";
import { getBrand, getBrandSlugs, getBrands } from "./index";
import { BRAND_SLUGS } from "./schema";

describe("konten brand", () => {
  it("lolos validasi skema & memuat seluruh brand", () => {
    expect(getBrandSlugs()).toEqual([...BRAND_SLUGS]);
  });

  it("getBrand mengembalikan undefined untuk slug tak dikenal", () => {
    expect(getBrand("tidak-ada")).toBeUndefined();
  });

  it.each(getBrands().map((b) => [b.name, b.accentColor] as const))(
    "warna aksen %s cukup kontras untuk teks putih (WCAG AA ≥ 4.5)",
    (_name, accent) => {
      expect(contrastRatio(accent, "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
    },
  );

  it("id kategori unik per brand", () => {
    for (const brand of getBrands()) {
      const ids = brand.catalog.categories.map((c) => c.id);
      expect(new Set(ids).size, brand.name).toBe(ids.length);
    }
  });
});
