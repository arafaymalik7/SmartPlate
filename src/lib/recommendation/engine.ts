export type Diet = "NONE" | "VEGETARIAN" | "VEGAN";
export type Priority = "NONE" | "HIGH_PROTEIN" | "LOW_SODIUM" | "LOW_CARB";
export type Candidate = {
  slug: string;
  name: string;
  restaurant?: string;
  active: boolean;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  sodiumMg: number | null;
  dietaryStatus: "VEGETARIAN_VERIFIED" | "VEGAN_VERIFIED" | "UNKNOWN";
  ingredients: string[];
  allergenDisclosure: "UNKNOWN" | "PRESENT" | "ABSENT_VERIFIED";
  allergens: string[];
  sourceType: "ILLUSTRATIVE" | "FOOD_COMPOSITION_DERIVED" | "RESTAURANT_VERIFIED";
};
export type Preferences = {
  calorieTarget?: number;
  diet: Diet;
  priority: Priority;
  excludedIngredients: string[];
  allergenExclusions: string[];
};
export type Recommendation = {
  item: Candidate;
  score: number;
  reasons: string[];
  limitations: string[];
};
export type Result = {
  eligible: Recommendation[];
  unableToVerify: Candidate[];
  excluded: Candidate[];
};
export const WEIGHTS = { calorie: 40, priority: 30, completeness: 20, diet: 10 } as const;
const normalized = (values: string[]) =>
  new Set(values.map((value) => value.trim().toLowerCase()).filter(Boolean));
export function recommend(items: Candidate[], prefs: Preferences): Result {
  const excluded: Candidate[] = [];
  const unableToVerify: Candidate[] = [];
  const eligible: Recommendation[] = [];
  const blockedIngredients = normalized(prefs.excludedIngredients);
  const blockedAllergens = normalized(prefs.allergenExclusions);
  for (const item of items) {
    if (!item.active) {
      excluded.push(item);
      continue;
    }
    const vegan = item.dietaryStatus === "VEGAN_VERIFIED";
    const vegetarian = vegan || item.dietaryStatus === "VEGETARIAN_VERIFIED";
    if ((prefs.diet === "VEGAN" && !vegan) || (prefs.diet === "VEGETARIAN" && !vegetarian)) {
      excluded.push(item);
      continue;
    }
    if (
      item.ingredients.some((value) => blockedIngredients.has(value.toLowerCase())) ||
      item.allergens.some((value) => blockedAllergens.has(value.toLowerCase()))
    ) {
      excluded.push(item);
      continue;
    }
    if (blockedAllergens.size && item.allergenDisclosure !== "ABSENT_VERIFIED") {
      unableToVerify.push(item);
      continue;
    }
    const reasons: string[] = [];
    const limitations: string[] = [];
    let score = 0;
    if (prefs.calorieTarget) {
      if (item.calories === null) limitations.push("Calories are not available.");
      else {
        const fit = Math.max(
          0,
          1 - Math.abs(item.calories - prefs.calorieTarget) / prefs.calorieTarget,
        );
        score += fit * WEIGHTS.calorie;
        reasons.push(
          `${item.calories} kcal is ${Math.abs(item.calories - prefs.calorieTarget)} kcal from your target.`,
        );
      }
    } else score += WEIGHTS.calorie;
    if (prefs.priority !== "NONE") {
      const value =
        prefs.priority === "HIGH_PROTEIN"
          ? item.proteinG
          : prefs.priority === "LOW_SODIUM"
            ? item.sodiumMg
            : item.carbsG;
      if (value === null) limitations.push("Selected nutrition priority is not available.");
      else {
        const unit = prefs.priority === "LOW_SODIUM" ? "mg sodium" : "g";
        const favourable =
          prefs.priority === "HIGH_PROTEIN"
            ? Math.min(1, value / 30)
            : Math.max(0, 1 - value / (prefs.priority === "LOW_SODIUM" ? 900 : 80));
        score += favourable * WEIGHTS.priority;
        reasons.push(`${value} ${unit} supports your selected priority.`);
      }
    } else score += WEIGHTS.priority;
    const known = [item.calories, item.proteinG, item.carbsG, item.sodiumMg].filter(
      (value) => value !== null,
    ).length;
    score += (known / 4) * WEIGHTS.completeness;
    if (known < 4) limitations.push("Some nutrition values are not available.");
    if (prefs.diet !== "NONE") score += WEIGHTS.diet;
    if (item.sourceType === "ILLUSTRATIVE")
      limitations.push("Nutrition details are shown per serving.");
    eligible.push({
      item,
      score: Math.round(score * 10) / 10,
      reasons: reasons.slice(0, 3),
      limitations,
    });
  }
  eligible.sort(
    (a, b) =>
      b.score - a.score ||
      a.item.name.localeCompare(b.item.name) ||
      a.item.slug.localeCompare(b.item.slug),
  );
  return { eligible, unableToVerify, excluded };
}
