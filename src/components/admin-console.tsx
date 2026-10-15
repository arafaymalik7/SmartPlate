"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Summary = {
  restaurants: number;
  items: number;
  published: number;
  itemsWithMissingNutrition: number;
  auditEvents: number;
};
type Restaurant = {
  id: string;
  name: string;
  slug: string;
  cuisine: string;
  location: string;
  status: string;
};
type Category = { id: string; name: string; restaurantId: string; restaurant: { name: string } };
type Item = {
  id: string;
  name: string;
  status: string;
  restaurant: { name: string };
  category: { name: string } | null;
  nutrition: { calories: number | null; sodiumMg: number | null; sourceType: string } | null;
};
type Audit = {
  id: string;
  action: string;
  entityType: string;
  createdAt: string;
  actor: { email: string };
};

const initialRestaurant = {
  name: "",
  slug: "",
  cuisine: "",
  location: "",
  description: "",
  status: "DRAFT",
};
const initialCategory = { restaurantId: "", name: "", slug: "", status: "DRAFT" };
const initialItem = {
  restaurantId: "",
  categoryId: "",
  slug: "",
  name: "",
  description: "",
  price: "",
  servingSize: "",
  status: "DRAFT",
  dietaryStatus: "",
  ingredientName: "",
  ingredientState: "UNKNOWN",
  allergenName: "",
  allergenState: "UNKNOWN",
  calories: "",
  sodiumMg: "",
  sourceCitation: "",
};

async function jsonOrError(response: Response) {
  const payload = (await response.json().catch(() => null)) as { error?: string } | null;
  if (!response.ok) throw new Error(payload?.error ?? "The request could not be completed.");
  return payload;
}

export function AdminConsole() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [restaurantForm, setRestaurantForm] = useState(initialRestaurant);
  const [categoryForm, setCategoryForm] = useState(initialCategory);
  const [itemForm, setItemForm] = useState(initialItem);
  const [message, setMessage] = useState("");

  const refresh = async () => {
    try {
      const responses = await Promise.all(
        ["summary", "restaurants", "categories", "menu-items", "audit"].map((path) =>
          fetch(`/api/admin/${path}`, { cache: "no-store" }),
        ),
      );
      const values = await Promise.all(responses.map(jsonOrError));
      setSummary(values[0] as Summary);
      setRestaurants(values[1] as Restaurant[]);
      setCategories(values[2] as Category[]);
      setItems(values[3] as Item[]);
      setAudit(values[4] as Audit[]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load the current admin data.");
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh());
    return () => window.clearTimeout(timer);
  }, []);

  const categoriesForItem = useMemo(
    () => categories.filter((category) => category.restaurantId === itemForm.restaurantId),
    [categories, itemForm.restaurantId],
  );

  const create = async (path: string, body: unknown, success: string) => {
    setMessage("");
    try {
      await jsonOrError(
        await fetch(path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
      );
      setMessage(success);
      await refresh();
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The record was not saved.");
      return false;
    }
  };

  const changeStatus = async (path: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
    const isArchive = status === "ARCHIVED";
    if (isArchive && !window.confirm("Archive this record? It will no longer be published."))
      return;
    setMessage("");
    try {
      await jsonOrError(
        await fetch(path, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }),
      );
      setMessage(
        isArchive ? "Record archived and audit record created." : "Publication status updated.",
      );
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The record status was not updated.");
    }
  };

  const submitRestaurant = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      await create(
        "/api/admin/restaurants",
        restaurantForm,
        "Restaurant saved and audit record created.",
      )
    ) {
      setRestaurantForm(initialRestaurant);
    }
  };
  const submitCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      await create(
        "/api/admin/categories",
        categoryForm,
        "Category saved and audit record created.",
      )
    ) {
      setCategoryForm(initialCategory);
    }
  };
  const submitItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numberOrNull = (value: string) => (value.trim() ? Number(value) : null);
    const body = {
      ...itemForm,
      categoryId: itemForm.categoryId || undefined,
      price: Number(itemForm.price),
      dietaryStatus: itemForm.dietaryStatus || undefined,
      ingredients: itemForm.ingredientName
        ? [{ name: itemForm.ingredientName, state: itemForm.ingredientState }]
        : [],
      allergens: itemForm.allergenName
        ? [{ name: itemForm.allergenName, state: itemForm.allergenState }]
        : [],
      calories: numberOrNull(itemForm.calories),
      sodiumMg: numberOrNull(itemForm.sodiumMg),
      sourceType: "ILLUSTRATIVE",
      sourceCitation: itemForm.sourceCitation || "Administrator-entered illustrative record",
    };
    if (await create("/api/admin/menu-items", body, "Menu item saved and audit record created.")) {
      setItemForm(initialItem);
    }
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
            <p>
              <strong>{summary.auditEvents}</strong> audit events
            </p>
          </>
        ) : (
          <p>Loading truthful data-completeness counts…</p>
        )}
      </section>
      {message && (
        <p className="form-hint" role="status">
          {message}
        </p>
      )}
      <div className="admin-grid">
        <form className="feature-card" onSubmit={submitRestaurant}>
          <h2>Add a restaurant</h2>
          <label>
            Name
            <input
              required
              value={restaurantForm.name}
              onChange={(event) =>
                setRestaurantForm({ ...restaurantForm, name: event.target.value })
              }
            />
          </label>
          <label>
            Slug
            <input
              required
              pattern="[a-z0-9-]+"
              value={restaurantForm.slug}
              onChange={(event) =>
                setRestaurantForm({ ...restaurantForm, slug: event.target.value })
              }
            />
          </label>
          <label>
            Status
            <select
              value={categoryForm.status}
              onChange={(event) => setCategoryForm({ ...categoryForm, status: event.target.value })}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
          <label>
            Cuisine
            <input
              required
              value={restaurantForm.cuisine}
              onChange={(event) =>
                setRestaurantForm({ ...restaurantForm, cuisine: event.target.value })
              }
            />
          </label>
          <label>
            Location
            <input
              required
              value={restaurantForm.location}
              onChange={(event) =>
                setRestaurantForm({ ...restaurantForm, location: event.target.value })
              }
            />
          </label>
          <label>
            Description
            <textarea
              required
              minLength={10}
              value={restaurantForm.description}
              onChange={(event) =>
                setRestaurantForm({ ...restaurantForm, description: event.target.value })
              }
            />
          </label>
          <label>
            Status
            <select
              value={restaurantForm.status}
              onChange={(event) =>
                setRestaurantForm({ ...restaurantForm, status: event.target.value })
              }
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
          <button className="button" type="submit">
            Save restaurant
          </button>
        </form>
        <form className="feature-card" onSubmit={submitCategory}>
          <h2>Add a category</h2>
          <label>
            Restaurant
            <select
              required
              value={categoryForm.restaurantId}
              onChange={(event) =>
                setCategoryForm({ ...categoryForm, restaurantId: event.target.value })
              }
            >
              <option value="">Select a restaurant</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Name
            <input
              required
              value={categoryForm.name}
              onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })}
            />
          </label>
          <label>
            Slug
            <input
              required
              pattern="[a-z0-9-]+"
              value={categoryForm.slug}
              onChange={(event) => setCategoryForm({ ...categoryForm, slug: event.target.value })}
            />
          </label>
          <button className="button" type="submit">
            Save category
          </button>
          <p className="form-hint">
            Categories are attached to a selected restaurant and receive an audit event on save.
          </p>
        </form>
        <form className="feature-card" onSubmit={submitItem}>
          <h2>Add an illustrative menu item</h2>
          <label>
            Restaurant
            <select
              required
              value={itemForm.restaurantId}
              onChange={(event) =>
                setItemForm({ ...itemForm, restaurantId: event.target.value, categoryId: "" })
              }
            >
              <option value="">Select a restaurant</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Category (optional)
            <select
              value={itemForm.categoryId}
              onChange={(event) => setItemForm({ ...itemForm, categoryId: event.target.value })}
            >
              <option value="">Uncategorised</option>
              {categoriesForItem.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Name
            <input
              required
              value={itemForm.name}
              onChange={(event) => setItemForm({ ...itemForm, name: event.target.value })}
            />
          </label>
          <label>
            Slug
            <input
              required
              pattern="[a-z0-9-]+"
              value={itemForm.slug}
              onChange={(event) => setItemForm({ ...itemForm, slug: event.target.value })}
            />
          </label>
          <label>
            Description
            <textarea
              required
              minLength={2}
              value={itemForm.description}
              onChange={(event) => setItemForm({ ...itemForm, description: event.target.value })}
            />
          </label>
          <label>
            Price (MYR)
            <input
              required
              min="0"
              step="0.01"
              type="number"
              value={itemForm.price}
              onChange={(event) => setItemForm({ ...itemForm, price: event.target.value })}
            />
          </label>
          <label>
            Serving size
            <input
              required
              value={itemForm.servingSize}
              onChange={(event) => setItemForm({ ...itemForm, servingSize: event.target.value })}
            />
          </label>
          <label>
            Dietary status (optional)
            <input
              value={itemForm.dietaryStatus}
              onChange={(event) => setItemForm({ ...itemForm, dietaryStatus: event.target.value })}
            />
          </label>
          <label>
            Ingredient disclosure (optional)
            <input
              value={itemForm.ingredientName}
              onChange={(event) => setItemForm({ ...itemForm, ingredientName: event.target.value })}
            />
          </label>
          <label>
            Ingredient status
            <select
              value={itemForm.ingredientState}
              onChange={(event) =>
                setItemForm({ ...itemForm, ingredientState: event.target.value })
              }
            >
              <option value="UNKNOWN">Unknown</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT_VERIFIED">Absent (verified)</option>
            </select>
          </label>
          <label>
            Allergen disclosure (optional)
            <input
              value={itemForm.allergenName}
              onChange={(event) => setItemForm({ ...itemForm, allergenName: event.target.value })}
            />
          </label>
          <label>
            Allergen status
            <select
              value={itemForm.allergenState}
              onChange={(event) => setItemForm({ ...itemForm, allergenState: event.target.value })}
            >
              <option value="UNKNOWN">Unknown</option>
              <option value="PRESENT">Present</option>
              <option value="ABSENT_VERIFIED">Absent (verified)</option>
            </select>
          </label>
          <label>
            Calories (optional)
            <input
              min="0"
              type="number"
              value={itemForm.calories}
              onChange={(event) => setItemForm({ ...itemForm, calories: event.target.value })}
            />
          </label>
          <label>
            Sodium mg (optional)
            <input
              min="0"
              type="number"
              value={itemForm.sodiumMg}
              onChange={(event) => setItemForm({ ...itemForm, sodiumMg: event.target.value })}
            />
          </label>
          <label>
            Status
            <select
              value={itemForm.status}
              onChange={(event) => setItemForm({ ...itemForm, status: event.target.value })}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
          <label>
            Illustrative source note (optional)
            <input
              value={itemForm.sourceCitation}
              onChange={(event) => setItemForm({ ...itemForm, sourceCitation: event.target.value })}
            />
          </label>
          <button className="button" type="submit">
            Save menu item
          </button>
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
                  <p className="admin-actions">
                    {restaurant.status === "DRAFT" && (
                      <button
                        type="button"
                        onClick={() =>
                          changeStatus(`/api/admin/restaurants/${restaurant.id}`, "PUBLISHED")
                        }
                      >
                        Publish
                      </button>
                    )}
                    {restaurant.status === "PUBLISHED" && (
                      <button
                        type="button"
                        onClick={() =>
                          changeStatus(`/api/admin/restaurants/${restaurant.id}`, "DRAFT")
                        }
                      >
                        Unpublish
                      </button>
                    )}
                    {restaurant.status !== "ARCHIVED" && (
                      <button
                        type="button"
                        onClick={() =>
                          changeStatus(`/api/admin/restaurants/${restaurant.id}`, "ARCHIVED")
                        }
                      >
                        Archive
                      </button>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No restaurant records are available yet.</p>
          )}
          <h2>Recent records</h2>
          {items.length ? (
            <ul className="admin-list">
              {items.map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong>
                  <span>
                    {item.restaurant.name} · {item.category?.name ?? "Uncategorised"} ·{" "}
                    {item.status.toLowerCase()} ·{" "}
                    {item.nutrition?.calories ?? "Nutrition unavailable"} kcal
                  </span>
                  <p className="admin-actions">
                    {item.status === "DRAFT" && (
                      <button
                        type="button"
                        onClick={() =>
                          changeStatus(`/api/admin/menu-items/${item.id}`, "PUBLISHED")
                        }
                      >
                        Publish
                      </button>
                    )}
                    {item.status === "PUBLISHED" && (
                      <button
                        type="button"
                        onClick={() => changeStatus(`/api/admin/menu-items/${item.id}`, "DRAFT")}
                      >
                        Unpublish
                      </button>
                    )}
                    {item.status !== "ARCHIVED" && (
                      <button
                        type="button"
                        onClick={() => changeStatus(`/api/admin/menu-items/${item.id}`, "ARCHIVED")}
                      >
                        Archive
                      </button>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No menu item records are available yet.</p>
          )}
          <h2>Recent audit events</h2>
          {audit.length ? (
            <ul className="admin-list">
              {audit.map((entry) => (
                <li key={entry.id}>
                  <strong>{entry.action}</strong>
                  <span>
                    {entry.entityType} · {entry.actor.email} ·{" "}
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No audit events are available yet.</p>
          )}
          <p className="form-hint">
            All writes remain server-authorized. Publication and archive actions are confirmed
            before the request; full record editing and production acceptance testing remain
            unverified.
          </p>
        </section>
      </div>
    </div>
  );
}
