import { describe, expect, it } from "vitest";
import { contrastRatio } from "./color";

describe("contrastRatio", () => {
  it("hitam vs putih = 21", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 1);
  });

  it("simetris", () => {
    expect(contrastRatio("#4F5E45", "#FFFFFF")).toBeCloseTo(contrastRatio("#FFFFFF", "#4F5E45"));
  });
});
