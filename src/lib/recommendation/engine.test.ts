import { describe, expect, it } from "vitest";
import { recommend, type Candidate } from "./engine";
const item = (overrides: Partial<Candidate> = {}): Candidate => ({
  slug: "a",
  name: "A",
  active: true,
  calories: 400,
  proteinG: 25,
  carbsG: 40,
  sodiumMg: 300,
  dietaryStatus: "VEGAN_VERIFIED",
  ingredients: ["rice"],
  allergenDisclosure: "UNKNOWN",
  allergens: [],
  sourceType: "ILLUSTRATIVE",
  ...overrides,
});
const base = {
  diet: "NONE" as const,
  priority: "NONE" as const,
  excludedIngredients: [],
  allergenExclusions: [],
};
describe("recommend", () => {
  it("excludes inactive and diet-incompatible items", () => {
    const r = recommend([item({ active: false }), item({ slug: "b", dietaryStatus: "UNKNOWN" })], {
      ...base,
      diet: "VEGAN",
    });
    expect(r.excluded).toHaveLength(2);
  });
  it("puts strict unknown allergen records aside", () => {
    const r = recommend([item()], { ...base, allergenExclusions: ["nuts"] });
    expect(r.unableToVerify).toHaveLength(1);
  });
  it("is deterministic and never treats missing nutrient as zero", () => {
    const r = recommend([item({ slug: "b", name: "B", calories: null })], {
      ...base,
      calorieTarget: 400,
    });
    expect(r.eligible[0].limitations).toContain("Calories are not available.");
    expect(
      recommend(
        [item({ slug: "z", name: "Z" }), item({ slug: "a", name: "A" })],
        base,
      ).eligible.map((v) => v.item.slug),
    ).toEqual(["a", "z"]);
  });
});
