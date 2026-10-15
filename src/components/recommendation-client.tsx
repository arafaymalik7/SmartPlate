"use client";

import { useEffect, useMemo, useState } from "react";
import { demoItems } from "@/lib/demo-data";
import { recommend, type Diet, type Priority } from "@/lib/recommendation/engine";
import { preferencesSchema } from "@/lib/validation/preferences";

const splitList = (value: string) =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

export function RecommendationClient() {
  const [diet, setDiet] = useState<Diet>("NONE");
  const [priority, setPriority] = useState<Priority>("NONE");
  const [target, setTarget] = useState(500);
  const [ingredients, setIngredients] = useState("");
  const [allergens, setAllergens] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("smartplate-preferences");
    if (!saved) return;
    const timer = window.setTimeout(() => {
      try {
        const value = JSON.parse(saved) as { diet: Diet; priority: Priority; target: number };
        if (["NONE", "VEGETARIAN", "VEGAN"].includes(value.diet)) setDiet(value.diet);
        if (["NONE", "HIGH_PROTEIN", "LOW_SODIUM", "LOW_CARB"].includes(value.priority))
          setPriority(value.priority);
        if (Number.isInteger(value.target) && value.target >= 1 && value.target <= 5000)
          setTarget(value.target);
      } catch {
        window.localStorage.removeItem("smartplate-preferences");
      }
    });
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "smartplate-preferences",
      JSON.stringify({ diet, priority, target }),
    );
  }, [diet, priority, target]);

  const preferences = useMemo(
    () => ({
      calorieTarget: target,
      diet,
      priority,
      excludedIngredients: splitList(ingredients),
      allergenExclusions: splitList(allergens),
    }),
    [allergens, diet, ingredients, priority, target],
  );
  const validation = useMemo(() => preferencesSchema.safeParse(preferences), [preferences]);
  const result = useMemo(
    () =>
      validation.success
        ? recommend(
            demoItems.map((item) => ({ ...item, active: true, allergens: [] })),
            validation.data,
          )
        : null,
    [validation],
  );

  return (
    <div className="shell section">
      <p className="state-label">Personalize a demonstration</p>
      <h1 className="page-title">Find a meal with transparent limits.</h1>
      <p className="lede">
        These are informational menu preferences, not medical advice. Illustration data cannot
        confirm whether a meal is allergy-safe.
      </p>
      <div className="feature-grid recommendation-grid">
        <form className="feature-card" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="calorie-target">
            Calorie target per serving
            <input
              id="calorie-target"
              type="number"
              min="1"
              max="5000"
              value={target}
              onChange={(event) => setTarget(Number(event.target.value))}
            />
          </label>
          <label htmlFor="diet">
            Diet
            <select
              id="diet"
              value={diet}
              onChange={(event) => setDiet(event.target.value as Diet)}
            >
              <option value="NONE">No preference</option>
              <option value="VEGETARIAN">Vegetarian (verified items only)</option>
              <option value="VEGAN">Vegan (verified items only)</option>
            </select>
          </label>
          <label htmlFor="priority">
            Nutrition priority
            <select
              id="priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
            >
              <option value="NONE">No priority</option>
              <option value="HIGH_PROTEIN">Higher protein</option>
              <option value="LOW_SODIUM">Lower sodium</option>
              <option value="LOW_CARB">Lower carbohydrate</option>
            </select>
          </label>
          <label htmlFor="excluded-ingredients">
            Exclude ingredients (comma-separated)
            <input
              id="excluded-ingredients"
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
              placeholder="e.g. chicken, milk"
            />
          </label>
          <label htmlFor="allergen-exclusions">
            Allergy-related exclusions (comma-separated)
            <input
              id="allergen-exclusions"
              value={allergens}
              onChange={(event) => setAllergens(event.target.value)}
              placeholder="e.g. peanuts"
            />
          </label>
          <p className="form-hint">
            Only diet, priority, and target are stored on this device. Allergy-related and
            ingredient exclusions are kept only in this page session.
          </p>
          {!validation.success && (
            <p className="form-error" role="alert">
              {validation.error.issues[0]?.message ?? "Check the preference values."}
            </p>
          )}
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              setDiet("NONE");
              setPriority("NONE");
              setTarget(500);
              setIngredients("");
              setAllergens("");
              window.localStorage.removeItem("smartplate-preferences");
            }}
          >
            Reset preferences
          </button>
        </form>
        <section className="feature-card" aria-live="polite">
          <h2>Suggestions</h2>
          {result?.eligible.map(({ item, score, reasons, limitations }) => (
            <article key={item.slug}>
              <h3>
                {item.name} <span className="score">{score}/100</span>
              </h3>
              <p>{reasons.join(" ") || "Available illustrative information is limited."}</p>
              {limitations.length > 0 && <p className="form-hint">{limitations.join(" ")}</p>}
            </article>
          ))}
          {result && !result.eligible.length && (
            <p>
              No eligible dishes. Adjust a non-strict preference; strict exclusions are not
              overridden.
            </p>
          )}
          {result && result.unableToVerify.length > 0 && (
            <div className="warning-box">
              <h3>Unable to verify for your allergy-related exclusion</h3>
              <p>
                {result.unableToVerify.map((item) => item.name).join(", ")}. These are not marked
                safe because disclosure is incomplete.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
