import { describe, expect, it } from "vitest";
import { PRICE_ON_REQUEST, formatPrice, formatPriceParts } from "./currency";

describe("formatPrice", () => {
  it("memformat Rupiah tanpa desimal", () => {
    expect(formatPrice({ amount: 3_500_000, from: false })).toBe("Rp 3.500.000");
  });

  it("menambahkan awalan 'Mulai dari' dan satuan", () => {
    expect(formatPrice({ amount: 25_000, from: true, unit: "/ hari" })).toBe(
      "Mulai dari Rp 25.000 / hari",
    );
  });

  it("menampilkan teks khusus untuk harga null", () => {
    expect(formatPrice({ amount: null, from: false })).toBe(PRICE_ON_REQUEST);
  });
});

describe("formatPriceParts", () => {
  it("memisahkan label, nominal, dan satuan", () => {
    expect(formatPriceParts({ amount: 35_000, from: false, unit: "/ hari" })).toEqual({
      label: "Harga",
      amount: "Rp 35.000",
      unit: "/ hari",
    });
  });

  it("memakai label 'Mulai dari' untuk harga awal", () => {
    expect(formatPriceParts({ amount: 15_000_000, from: true }).label).toBe("Mulai dari");
  });

  it("menangani harga sesuai permintaan", () => {
    expect(formatPriceParts({ amount: null, from: false })).toEqual({
      label: "Harga",
      amount: PRICE_ON_REQUEST,
    });
  });
});
