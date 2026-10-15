import { describe, expect, it } from "vitest";
import { missingNutritionWhere } from "./admin-summary";

describe("admin summary filters", () => {
  it("treats an absent nutrition relation as incomplete, not only null nutrient fields", () => {
    expect(missingNutritionWhere).toEqual({
      OR: [
        { nutrition: { is: null } },
        {
          nutrition: {
            is: {
              OR: [{ calories: null }, { sodiumMg: null }],
            },
          },
        },
      ],
    });
  });
});
