"use client";

import { FormEvent, useEffect, useState } from "react";

type Summary = {
  restaurants: number;
  items: number;
  published: number;
  itemsWithMissingNutrition: number;
};
type Restaurant = {
  id: string;
  name: string;
  slug: string;
  cuisine: string;
  location: string;
  status: string;
};

const initialForm = {
  name: "",
  slug: "",
  cuisine: "",
  location: "",
  description: "",
  status: "DRAFT",
};

export function AdminConsole() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  const refresh = async () => {
    const [summaryResponse, restaurantsResponse] = await Promise.all([
      fetch("/api/admin/summary"),
      fetch("/api/admin/restaurants"),
    ]);
    if (!summaryResponse.ok || !restaurantsResponse.ok) {
      setMessage("Unable to load the current admin data. Refresh and sign in again if needed.");
      return;
    }
    setSummary((await summaryResponse.json()) as Summary);
    setRestaurants((await restaurantsResponse.json()) as Restaurant[]);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh());
    return () => window.clearTimeout(timer);
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!response.ok) {
      setMessage("The restaurant was not saved. Check every field and try again.");
      return;
    }
    setForm(initialForm);
    setMessage("Restaurant saved and audit record created.");
    await refresh();
  };

  return (
    <div className="admin-console">
      <section className="admin-metrics" aria-label="Menu data summary">
        {summary ? (
          <>
            <p>
              <strong>{summary.restaurants}</strong> restaurants
            </p>
            <p>
              <strong>{summary.items}</strong> menu items
            </p>
            <p>
              <strong>{summary.published}</strong> published items
            </p>
            <p>
              <strong>{summary.itemsWithMissingNutrition}</strong> with missing nutrition
            </p>
          </>
        ) : (
          <p>Loading truthful data-completeness counts…</p>
        )}
      </section>
      <div className="admin-grid">
        <form className="feature-card" onSubmit={submit}>
          <h2>Add a restaurant</h2>
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </label>
          <label>
            Slug
            <input
              required
              pattern="[a-z0-9-]+"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
            />
          </label>
          <label>
            Cuisine
            <input
              required
              value={form.cuisine}
              onChange={(event) => setForm({ ...form, cuisine: event.target.value })}
            />
          </label>
          <label>
            Location
            <input
              required
              value={form.location}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
            />
          </label>
          <label>
            Description
            <textarea
              required
              minLength={10}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
          <button className="button" type="submit">
            Save restaurant
          </button>
          {message && (
            <p className="form-hint" role="status">
              {message}
            </p>
          )}
        </form>
        <section className="feature-card">
          <h2>Restaurant records</h2>
          {restaurants.length ? (
            <ul className="admin-list">
              {restaurants.map((restaurant) => (
                <li key={restaurant.id}>
                  <strong>{restaurant.name}</strong>
                  <span>
                    {restaurant.cuisine} · {restaurant.location} · {restaurant.status.toLowerCase()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No restaurant records are available yet.</p>
          )}
          <p className="form-hint">
            Menu item and category editors remain a planned database-backed administration slice;
            restaurant creation is the currently implemented mutation.
          </p>
        </section>
      </div>
    </div>
  );
}
