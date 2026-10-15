import { describe, expect, it } from "vitest";
import { categorySchema, menuItemSchema, publicationStatusSchema, restaurantSchema } from "./admin";
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
  it("rejects malformed provenance URLs and invalid category slugs", () => {
    expect(
      categorySchema.safeParse({ restaurantId: "x", name: "Sides", slug: "Bad slug" }).success,
    ).toBe(false);
    expect(
      menuItemSchema.safeParse({
        restaurantId: "x",
        slug: "dish",
        name: "Dish",
        description: "Description",
        price: 3,
        servingSize: "1 serving",
        sourceType: "ILLUSTRATIVE",
        sourceUrl: "not a url",
      }).success,
    ).toBe(false);
  });
  it("requires traceable provenance for non-illustrative nutrition records", () => {
    const base = {
      restaurantId: "x",
      slug: "dish",
      name: "Dish",
      description: "Description",
      price: 3,
      servingSize: "1 serving",
      sourceType: "FOOD_COMPOSITION_DERIVED" as const,
    };
    expect(menuItemSchema.safeParse(base).success).toBe(false);
    expect(
      menuItemSchema.safeParse({
        ...base,
        sourceUrl: "https://example.test/nutrition/dish",
        sourceCitation: "Example Food Composition Database",
        reviewedAt: "2026-10-16",
      }).success,
    ).toBe(true);
    expect(
      menuItemSchema.safeParse({
        ...base,
        sourceUrl: "https://example.test/nutrition/dish",
        sourceCitation: "Example Food Composition Database",
        reviewedAt: "2026-99-99",
      }).success,
    ).toBe(false);
  });
  it("defaults categories to draft", () => {
    expect(categorySchema.parse({ restaurantId: "x", name: "Sides", slug: "sides" }).status).toBe(
      "DRAFT",
    );
  });
  it("accepts only defined publication states", () => {
    expect(publicationStatusSchema.safeParse({ status: "ARCHIVED" }).success).toBe(true);
    expect(publicationStatusSchema.safeParse({ status: "DELETED" }).success).toBe(false);
  });
  it("rejects invalid ingredient and allergen disclosure states", () => {
    const base = {
      restaurantId: "x",
      slug: "dish",
      name: "Dish",
      description: "Description",
      price: 3,
      servingSize: "1 serving",
      sourceType: "ILLUSTRATIVE",
    };
    expect(
      menuItemSchema.safeParse({
        ...base,
        allergens: [{ name: "Peanuts", state: "SAFE" }],
      }).success,
    ).toBe(false);
    expect(
      menuItemSchema.safeParse({
        ...base,
        ingredients: [{ name: "Oats", state: "UNKNOWN" }],
      }).success,
    ).toBe(true);
  });
});
