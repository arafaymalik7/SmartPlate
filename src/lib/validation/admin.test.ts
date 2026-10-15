import { describe, expect, it } from "vitest";
import { menuItemSchema, restaurantSchema } from "./admin";
describe("admin validation", () => {
  it("rejects negative price and invalid slug", () =>
    expect(
      menuItemSchema.safeParse({
        restaurantId: "x",
        slug: "Bad slug",
        name: "Dish",
        description: "Description",
        price: -1,
        servingSize: "1 serving",
        sourceType: "ILLUSTRATIVE",
      }).success,
    ).toBe(false));
  it("accepts a published restaurant", () =>
    expect(
      restaurantSchema.safeParse({
        name: "Demo Table",
        slug: "demo-table",
        cuisine: "Demo",
        location: "KL",
        description: "A fictional demonstration restaurant.",
        status: "PUBLISHED",
      }).success,
    ).toBe(true));
});
