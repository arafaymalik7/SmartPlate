"use client";

import { useMemo, useState } from "react";
import type { DemoItem } from "@/lib/demo-data";

const metrics = [
  ["Calories", "calories", "kcal"],
  ["Protein", "proteinG", "g"],
  ["Carbohydrates", "carbsG", "g"],
  ["Fat", "fatG", "g"],
  ["Sodium", "sodiumMg", "mg"],
] as const;

const value = (number: number | null, unit: string) =>
  number === null ? "Not available" : `${number} ${unit}`;

export function ComparisonClient({
  items,
  isIllustrative,
}: {
  items: DemoItem[];
  isIllustrative: boolean;
}) {
  const [selectedSlugs, setSelectedSlugs] = useState(() =>
    items.slice(0, 3).map((item) => item.slug),
  );
  const selectedItems = useMemo(
    () => items.filter((item) => selectedSlugs.includes(item.slug)),
    [items, selectedSlugs],
  );
  const toggle = (slug: string) => {
    setSelectedSlugs((current) =>
      current.includes(slug)
        ? current.filter((value) => value !== slug)
        : current.length < 3
          ? [...current, slug]
          : current,
    );
  };

  return (
    <>
      <fieldset className="comparison-picker">
        <legend>Choose two or three {isIllustrative ? "illustrative" : "published"} dishes</legend>
        <p className="form-hint" aria-live="polite">
          {selectedItems.length} selected. Nutrition is per serving and{" "}
          {isIllustrative
            ? "remains illustrative."
            : "may be unavailable when no source value was published."}
        </p>
        <div className="comparison-options">
          {items.map((item) => {
            const selected = selectedSlugs.includes(item.slug);
            return (
              <label key={item.slug}>
                <input
                  type="checkbox"
                  checked={selected}
                  disabled={!selected && selectedItems.length >= 3}
                  onChange={() => toggle(item.slug)}
                />{" "}
                {item.name} · {item.restaurant}
              </label>
            );
          })}
        </div>
      </fieldset>
      {selectedItems.length < 2 ? (
        <div className="empty-state">
          <h2>Select at least two dishes</h2>
          <p>
            Comparison is intentionally limited to two or three dishes so values remain readable.
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                {selectedItems.map((item) => (
                  <th key={item.slug}>
                    {item.name}
                    <span className="table-subtitle">{item.restaurant}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map(([label, key, unit]) => (
                <tr key={key}>
                  <th>{label}</th>
                  {selectedItems.map((item) => (
                    <td key={item.slug}>{value(item[key], unit)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedItems.length >= 2 && (
        <p className="form-hint">
          On a narrow screen, scroll the comparison table horizontally to view every selected dish.
        </p>
      )}
    </>
  );
}
