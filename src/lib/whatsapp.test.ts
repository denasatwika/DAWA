import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, whatsappMessage } from "./whatsapp";

describe("buildWhatsAppUrl", () => {
  it("membuat tautan wa.me dengan pesan ter-encode", () => {
    const url = new URL(buildWhatsAppUrl("6281200000002", "Halo & selamat pagi"));
    expect(url.origin + url.pathname).toBe("https://wa.me/6281200000002");
    expect(url.searchParams.get("text")).toBe("Halo & selamat pagi");
  });

  it("tanpa pesan tidak menambahkan parameter", () => {
    expect(buildWhatsAppUrl("6281200000002")).toBe("https://wa.me/6281200000002");
  });

  it("menyusun pesan produk", () => {
    expect(whatsappMessage.product("Rentalek", "Kursi Tiffany")).toContain("Kursi Tiffany");
  });
});
