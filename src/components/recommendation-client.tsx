"use client";
import { useEffect, useMemo, useState } from "react";
import { demoItems } from "@/lib/demo-data";
import { recommend, type Diet, type Priority } from "@/lib/recommendation/engine";

export function RecommendationClient() {
  const [diet, setDiet] = useState<Diet>("NONE");
  const [priority, setPriority] = useState<Priority>("NONE");
  const [target, setTarget] = useState(500);
  useEffect(() => {
    const saved = window.localStorage.getItem("smartplate-preferences");
    if (saved) {
      const value = JSON.parse(saved) as { diet: Diet; priority: Priority; target: number };
      setDiet(value.diet);
      setPriority(value.priority);
      setTarget(value.target);
    }
  }, []);
  useEffect(() => {
    window.localStorage.setItem(
      "smartplate-preferences",
      JSON.stringify({ diet, priority, target }),
    );
  }, [diet, priority, target]);
  const result = useMemo(
    () =>
      recommend(
        demoItems.map((item) => ({ ...item, active: true, allergens: [] })),
        { diet, priority, calorieTarget: target, excludedIngredients: [], allergenExclusions: [] },
      ),
    [diet, priority, target],
  );
  return (
    <div className="shell section">
      <p className="state-label">Personalize a demonstration</p>
      <h1 className="page-title">Find a meal with transparent limits.</h1>
      <div className="feature-grid">
        <form className="feature-card" onSubmit={(event) => event.preventDefault()}>
          <label>
            Calorie target
            <input
              type="number"
              min="1"
              value={target}
              onChange={(event) => setTarget(Number(event.target.value))}
            />
          </label>
          <label>
            Diet
            <select value={diet} onChange={(event) => setDiet(event.target.value as Diet)}>
              <option value="NONE">No preference</option>
              <option value="VEGETARIAN">Vegetarian</option>
              <option value="VEGAN">Vegan</option>
            </select>
          </label>
          <label>
            Priority
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
            >
              <option value="NONE">No priority</option>
              <option value="HIGH_PROTEIN">Higher protein</option>
              <option value="LOW_SODIUM">Lower sodium</option>
              <option value="LOW_CARB">Lower carbohydrate</option>
            </select>
          </label>
          <p>Saved preferences are limited to these non-sensitive controls.</p>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => {
              setDiet("NONE");
              setPriority("NONE");
              setTarget(500);
              window.localStorage.removeItem("smartplate-preferences");
            }}
          >
            Reset preferences
          </button>
        </form>
        <section className="feature-card">
          <h2>Suggestions</h2>
          {result.eligible.map(({ item, score, reasons, limitations }) => (
            <article key={item.slug}>
              <h3>
                {item.name} · {score}
              </h3>
              <p>{reasons.join(" ")}</p>
              <p>{limitations.join(" ")}</p>
            </article>
          ))}
          {!result.eligible.length && <p>No eligible dishes. Adjust a non-strict preference.</p>}
        </section>
      </div>
    </div>
  );
}
