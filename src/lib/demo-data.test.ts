import { describe, expect, it } from "vitest";
import { demoItems, demoRestaurants } from "./demo-data";
describe("illustrative demo data", () => {
  it("labels every record illustrative and preserves unknown values", () => {
    expect(demoItems.every((item) => item.sourceType === "ILLUSTRATIVE")).toBe(true);
    expect(demoItems.some((item) => item.calories === null)).toBe(true);
  });
  it("provides four bounded demonstration menus with twelve dishes each", () => {
    expect(demoRestaurants).toHaveLength(4);
    expect(demoItems).toHaveLength(48);
    for (const restaurant of demoRestaurants)
      expect(demoItems.filter((item) => item.restaurantSlug === restaurant.slug)).toHaveLength(12);
  });
});
