"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublicRestaurant } from "@/lib/public-catalog";

function venueMonogram(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function RestaurantVisual({ restaurant }: { restaurant: PublicRestaurant }) {
  const fallbackLabel = `${restaurant.name} venue placeholder`;

  return (
    <div aria-label={fallbackLabel} className="restaurant-visual restaurant-fallback" role="img">
      <span aria-hidden="true">{venueMonogram(restaurant.name)}</span>
    </div>
  );
}

export function RestaurantDirectory({
  restaurants,
  isIllustrative,
}: {
  restaurants: PublicRestaurant[];
  isIllustrative: boolean;
}) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("ALL");
  const locations = [...new Set(restaurants.map((restaurant) => restaurant.location))];
  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return restaurants.filter((restaurant) => {
      const queryMatch = [restaurant.name, restaurant.cuisine, restaurant.location]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      return queryMatch && (location === "ALL" || restaurant.location === location);
    });
  }, [location, query, restaurants]);

  return (
    <>
      <div className="directory-controls" aria-label="Restaurant filters">
        <label htmlFor="restaurant-search">
          Search restaurants
          <input
            id="restaurant-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name, cuisine, or location"
          />
        </label>
        <label htmlFor="restaurant-location">
          Location
          <select
            id="restaurant-location"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          >
            <option value="ALL">All demonstration locations</option>
            {locations.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="form-hint" aria-live="polite">
        {results.length} {isIllustrative ? "demonstration venues" : "venues"} shown.
      </p>
      {results.length ? (
        <div className="feature-grid">
          {results.map((restaurant) => (
            <article className="restaurant-card" key={restaurant.slug}>
              <RestaurantVisual restaurant={restaurant} />
              <div className="restaurant-card-copy">
                <p className="state-label">{restaurant.location}</p>
                <h3>{restaurant.name}</h3>
                <p>
                  {restaurant.cuisine} · {restaurant.description}
                </p>
                <Link className="text-link" href={`/restaurants/${restaurant.slug}`}>
                  View menu
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>{isIllustrative ? "No demonstration venues match" : "No venues match"}</h2>
          <p>
            Clear the search or choose another location to view the bounded illustrative directory.
          </p>
          <button
            className="button button-secondary"
            onClick={() => {
              setQuery("");
              setLocation("ALL");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
