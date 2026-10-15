import { z } from "zod";
export const preferencesSchema = z
  .object({
    calorieTarget: z.coerce.number().int().min(1).max(5000).optional(),
    diet: z.enum(["NONE", "VEGETARIAN", "VEGAN"]),
    priority: z.enum(["NONE", "HIGH_PROTEIN", "LOW_SODIUM", "LOW_CARB"]),
    excludedIngredients: z.array(z.string().trim().min(1).max(80)).max(20),
    allergenExclusions: z.array(z.string().trim().min(1).max(80)).max(20),
  })
  .superRefine((value, ctx) => {
    if (value.diet === "VEGAN" && value.priority === "NONE") return;
    if (value.allergenExclusions.length && value.allergenExclusions.some((v) => !v.trim()))
      ctx.addIssue({ code: "custom", message: "Allergen exclusions must be named." });
  });
