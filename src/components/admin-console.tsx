"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { formatDisclosures, parseDisclosures } from "@/lib/disclosure-parser";

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
  description: string;
  status: string;
};
type Category = {
  id: string;
  name: string;
  slug: string;
  restaurantId: string;
  status: string;
  restaurant: { name: string };
};
type Item = {
  id: string;
  restaurantId: string;
  categoryId: string | null;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  servingSize: string;
  status: string;
  isAvailable: boolean;
  dietaryStatus: string | null;
  restaurant: { name: string };
  category: { name: string } | null;
  nutrition: {
    calories: number | null;
    proteinG: number | null;
    carbsG: number | null;
    fatG: number | null;
    sodiumMg: number | null;
    sourceType: string;
    sourceUrl: string | null;
    sourceCitation: string | null;
  } | null;
  ingredients: { state: string; ingredient: { name: string } }[];
  allergens: { state: string; allergen: { name: string } }[];
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
  currency: "MYR",
  servingSize: "",
  status: "DRAFT",
  isAvailable: true,
  dietaryStatus: "",
  ingredientDisclosures: "",
  allergenDisclosures: "",
  calories: "",
  proteinG: "",
  carbsG: "",
  fatG: "",
  sodiumMg: "",
  sourceType: "ILLUSTRATIVE",
  sourceUrl: "",
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
  const [editingRestaurantId, setEditingRestaurantId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
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

  const write = async (path: string, method: "POST" | "PATCH", body: unknown, success: string) => {
    setMessage("");
    try {
      await jsonOrError(
        await fetch(path, {
          method,
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
      await write(
        editingRestaurantId
          ? `/api/admin/restaurants/${editingRestaurantId}`
          : "/api/admin/restaurants",
        editingRestaurantId ? "PATCH" : "POST",
        restaurantForm,
        editingRestaurantId
          ? "Restaurant updated and audit record created."
          : "Restaurant saved and audit record created.",
      )
    ) {
      setRestaurantForm(initialRestaurant);
      setEditingRestaurantId(null);
    }
  };
  const submitCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      await write(
        editingCategoryId ? `/api/admin/categories/${editingCategoryId}` : "/api/admin/categories",
        editingCategoryId ? "PATCH" : "POST",
        categoryForm,
        editingCategoryId
          ? "Category updated and audit record created."
          : "Category saved and audit record created.",
      )
    ) {
      setCategoryForm(initialCategory);
      setEditingCategoryId(null);
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
      ingredients: parseDisclosures(itemForm.ingredientDisclosures),
      allergens: parseDisclosures(itemForm.allergenDisclosures),
      calories: numberOrNull(itemForm.calories),
      proteinG: numberOrNull(itemForm.proteinG),
      carbsG: numberOrNull(itemForm.carbsG),
      fatG: numberOrNull(itemForm.fatG),
      sodiumMg: numberOrNull(itemForm.sodiumMg),
      sourceType: itemForm.sourceType,
      sourceUrl: itemForm.sourceUrl || undefined,
      sourceCitation:
        itemForm.sourceCitation ||
        (itemForm.sourceType === "ILLUSTRATIVE"
          ? "Administrator-entered illustrative record"
          : undefined),
    };
    if (
      await write(
        editingItemId ? `/api/admin/menu-items/${editingItemId}` : "/api/admin/menu-items",
        editingItemId ? "PATCH" : "POST",
        body,
        editingItemId
          ? "Menu item updated and audit record created."
          : "Menu item saved and audit record created.",
      )
    ) {
      setItemForm(initialItem);
      setEditingItemId(null);
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
          <h2>{editingRestaurantId ? "Edit restaurant" : "Add a restaurant"}</h2>
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
            {editingRestaurantId ? "Update restaurant" : "Save restaurant"}
          </button>
          {editingRestaurantId && (
            <button
              className="button button-secondary"
              type="button"
              onClick={() => {
                setRestaurantForm(initialRestaurant);
                setEditingRestaurantId(null);
              }}
            >
              Cancel edit
            </button>
          )}
        </form>
        <form className="feature-card" onSubmit={submitCategory}>
          <h2>{editingCategoryId ? "Edit category" : "Add a category"}</h2>
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
          <button className="button" type="submit">
            {editingCategoryId ? "Update category" : "Save category"}
          </button>
          {editingCategoryId && (
            <button
              className="button button-secondary"
              type="button"
              onClick={() => {
                setCategoryForm(initialCategory);
                setEditingCategoryId(null);
              }}
            >
              Cancel edit
            </button>
          )}
          <p className="form-hint">
            Categories are attached to a selected restaurant and receive an audit event on save.
          </p>
        </form>
        <form className="feature-card" onSubmit={submitItem}>
          <h2>{editingItemId ? "Edit menu item" : "Add an illustrative menu item"}</h2>
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
            Currency
            <input
              required
              minLength={3}
              maxLength={3}
              value={itemForm.currency}
              onChange={(event) =>
                setItemForm({ ...itemForm, currency: event.target.value.toUpperCase() })
              }
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
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={itemForm.isAvailable}
              onChange={(event) => setItemForm({ ...itemForm, isAvailable: event.target.checked })}
            />
            Available to order
          </label>
          <label>
            Ingredient disclosures (optional)
            <textarea
              value={itemForm.ingredientDisclosures}
              onChange={(event) =>
                setItemForm({ ...itemForm, ingredientDisclosures: event.target.value })
              }
              placeholder={"oats | PRESENT\nmilk | UNKNOWN"}
            />
          </label>
          <p className="form-hint">
            Add one disclosure per line as <code>name | PRESENT</code>,{" "}
            <code>name | ABSENT_VERIFIED</code>, or <code>name | UNKNOWN</code>. Omitted or
            unrecognised states are saved as unknown.
          </p>
          <label>
            Allergen disclosures (optional)
            <textarea
              value={itemForm.allergenDisclosures}
              onChange={(event) =>
                setItemForm({ ...itemForm, allergenDisclosures: event.target.value })
              }
              placeholder={"peanuts | ABSENT_VERIFIED\nsoy | PRESENT"}
            />
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
            Protein g (optional)
            <input
              min="0"
              type="number"
              value={itemForm.proteinG}
              onChange={(event) => setItemForm({ ...itemForm, proteinG: event.target.value })}
            />
          </label>
          <label>
            Carbohydrates g (optional)
            <input
              min="0"
              type="number"
              value={itemForm.carbsG}
              onChange={(event) => setItemForm({ ...itemForm, carbsG: event.target.value })}
            />
          </label>
          <label>
            Fat g (optional)
            <input
              min="0"
              type="number"
              value={itemForm.fatG}
              onChange={(event) => setItemForm({ ...itemForm, fatG: event.target.value })}
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
          <label>
            Source type
            <select
              value={itemForm.sourceType}
              onChange={(event) => setItemForm({ ...itemForm, sourceType: event.target.value })}
            >
              <option value="ILLUSTRATIVE">Illustrative</option>
              <option value="FOOD_COMPOSITION_DERIVED">Food composition derived</option>
              <option value="RESTAURANT_VERIFIED">Restaurant verified</option>
            </select>
          </label>
          <label>
            Source URL (optional)
            <input
              type="url"
              value={itemForm.sourceUrl}
              onChange={(event) => setItemForm({ ...itemForm, sourceUrl: event.target.value })}
            />
          </label>
          <button className="button" type="submit">
            {editingItemId ? "Update menu item" : "Save menu item"}
          </button>
          {editingItemId && (
            <button
              className="button button-secondary"
              type="button"
              onClick={() => {
                setItemForm(initialItem);
                setEditingItemId(null);
              }}
            >
              Cancel edit
            </button>
          )}
        </form>
        <section className="feature-card">
          <h2>Category records</h2>
          {categories.length ? (
            <ul className="admin-list">
              {categories.map((category) => (
                <li key={category.id}>
                  <strong>{category.name}</strong>
                  <span>
                    {category.restaurant.name} · {category.status.toLowerCase()}
                  </span>
                  <p className="admin-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryForm({
                          restaurantId: category.restaurantId,
                          name: category.name,
                          slug: category.slug,
                          status: category.status,
                        });
                        setEditingCategoryId(category.id);
                      }}
                    >
                      Edit
                    </button>
                    {category.status === "DRAFT" && (
                      <button
                        type="button"
                        onClick={() =>
                          changeStatus(`/api/admin/categories/${category.id}`, "PUBLISHED")
                        }
                      >
                        Publish
                      </button>
                    )}
                    {category.status === "PUBLISHED" && (
                      <button
                        type="button"
                        onClick={() =>
                          changeStatus(`/api/admin/categories/${category.id}`, "DRAFT")
                        }
                      >
                        Unpublish
                      </button>
                    )}
                    {category.status !== "ARCHIVED" && (
                      <button
                        type="button"
                        onClick={() =>
                          changeStatus(`/api/admin/categories/${category.id}`, "ARCHIVED")
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
            <p>No category records are available yet.</p>
          )}
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
                    <button
                      type="button"
                      onClick={() => {
                        setRestaurantForm({
                          name: restaurant.name,
                          slug: restaurant.slug,
                          cuisine: restaurant.cuisine,
                          location: restaurant.location,
                          description: restaurant.description,
                          status: restaurant.status,
                        });
                        setEditingRestaurantId(restaurant.id);
                      }}
                    >
                      Edit
                    </button>
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
                    <button
                      type="button"
                      onClick={() => {
                        setItemForm({
                          restaurantId: item.restaurantId,
                          categoryId: item.categoryId ?? "",
                          slug: item.slug,
                          name: item.name,
                          description: item.description,
                          price: String(item.price),
                          currency: item.currency,
                          servingSize: item.servingSize,
                          status: item.status,
                          isAvailable: item.isAvailable,
                          dietaryStatus: item.dietaryStatus ?? "",
                          ingredientDisclosures: formatDisclosures(
                            item.ingredients.map((entry) => ({
                              name: entry.ingredient.name,
                              state: entry.state,
                            })),
                          ),
                          allergenDisclosures: formatDisclosures(
                            item.allergens.map((entry) => ({
                              name: entry.allergen.name,
                              state: entry.state,
                            })),
                          ),
                          calories: item.nutrition?.calories == null ? "" : String(item.nutrition.calories),
                          proteinG: item.nutrition?.proteinG == null ? "" : String(item.nutrition.proteinG),
                          carbsG: item.nutrition?.carbsG == null ? "" : String(item.nutrition.carbsG),
                          fatG: item.nutrition?.fatG == null ? "" : String(item.nutrition.fatG),
                          sodiumMg: item.nutrition?.sodiumMg == null ? "" : String(item.nutrition.sodiumMg),
                          sourceType: item.nutrition?.sourceType ?? "ILLUSTRATIVE",
                          sourceUrl: item.nutrition?.sourceUrl ?? "",
                          sourceCitation: item.nutrition?.sourceCitation ?? "",
                        });
                        setEditingItemId(item.id);
                      }}
                    >
                      Edit
                    </button>
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
            before the request; authenticated production acceptance testing remains unverified.
          </p>
        </section>
      </div>
    </div>
  );
}
