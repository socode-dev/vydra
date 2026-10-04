import { describe, expect, it } from "vitest";
import { categoryNameExists, normalizeCategoryName } from "../utils/categoryName";

describe("category name matching", () => {
  it("normalizes surrounding and repeated whitespace", () => {
    expect(normalizeCategoryName("  Home   Office  ")).toBe("home office");
  });

  it("matches static or stored category names without case differences", () => {
    expect(categoryNameExists("food", ["Food"])).toBe(true);
    expect(categoryNameExists("  travel  ", [{ name: "Travel" }])).toBe(true);
  });

  it("does not match a different category", () => {
    expect(categoryNameExists("Education", ["Food", { name: "Travel" }])).toBe(false);
  });
});
