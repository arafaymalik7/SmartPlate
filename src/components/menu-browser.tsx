"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DemoItem } from "@/lib/demo-data";

type Props = { items: DemoItem[] };

export function MenuBrowser({ items }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("ALL");
  const [diet, setDiet] = useState("ALL");
  const [sort, setSort] = useState("NAME");
  const categories = [...new Set(items.map((item) => item.category))];
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items
      .filter((item) => {
        const matchesSearch = [item.name, item.description, item.ingredients.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
        const matchesDiet =
          diet === "ALL" ||
          (diet === "VEGETARIAN" && item.dietaryStatus !== "UNKNOWN") ||
          (diet === "VEGAN" && item.dietaryStatus === "VEGAN_VERIFIED");
        return matchesSearch && (category === "ALL" || item.category === category) && matchesDiet;
      })
      .sort((left, right) => {
        if (sort === "PRICE")
          return left.price - right.price || left.name.localeCompare(right.name);
        if (sort === "CALORIES")
          return (
            (left.calories ?? Number.POSITIVE_INFINITY) -
            (right.calories ?? Number.POSITIVE_INFINITY)
          );
        return left.name.localeCompare(right.name);
      });
  }, [category, diet, items, query, sort]);

  return (
    <>
      <div className="menu-controls" aria-label="Menu filters">
        <label htmlFor="menu-search">
          Search this menu
          <input
            id="menu-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Dish or ingredient"
          />
        </label>
        <label htmlFor="menu-category">
          Category
          <select
            id="menu-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="ALL">All categories</option>
            {categories.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label htmlFor="menu-diet">
          Verified diet
          <select id="menu-diet" value={diet} onChange={(event) => setDiet(event.target.value)}>
            <option value="ALL">All disclosure states</option>
            <option value="VEGETARIAN">Vegetarian verified</option>
            <option value="VEGAN">Vegan verified</option>
          </select>
        </label>
        <label htmlFor="menu-sort">
          Sort
          <select id="menu-sort" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="NAME">Name</option>
            <option value="PRICE">Lowest price</option>
            <option value="CALORIES">Lowest known calories</option>
          </select>
        </label>
      </div>
      <p className="form-hint" aria-live="polite">
        {results.length} illustrative menu items shown.
      </p>
      {results.length ? (
        <div className="feature-grid menu-grid">
          {results.map((item) => (
            <article key={item.slug}>
              <p className="state-label">{item.category}</p>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>
                {item.calories === null ? "Not available" : `${item.calories} kcal`} · MYR{" "}
                {item.price.toFixed(2)}
              </p>
              <Link className="text-link" href={`/menu/${item.slug}`}>
                View nutrition
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No dishes match these filters</h2>
          <p>
            Clear a filter to see the illustrative menu again. Unknown dietary disclosure is never
            treated as verified.
          </p>
          <button
            className="button button-secondary"
            onClick={() => {
              setQuery("");
              setCategory("ALL");
              setDiet("ALL");
              setSort("NAME");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
