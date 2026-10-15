import { describe, expect, it } from "vitest";
import { preferencesSchema } from "./preferences";
describe("preference validation", () => {
  it("rejects extreme calorie targets", () =>
    expect(
      preferencesSchema.safeParse({
        calorieTarget: 0,
        diet: "NONE",
        priority: "NONE",
        excludedIngredients: [],
        allergenExclusions: [],
      }).success,
    ).toBe(false));
  it("accepts non-sensitive controls", () =>
    expect(
      preferencesSchema.safeParse({
        calorieTarget: 500,
        diet: "VEGAN",
        priority: "HIGH_PROTEIN",
        excludedIngredients: ["beef"],
        allergenExclusions: [],
      }).success,
    ).toBe(true));
});
