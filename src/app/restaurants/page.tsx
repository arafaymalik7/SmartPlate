import { SiteShell } from "@/components/site-shell";
import { RestaurantDirectory } from "@/components/restaurant-directory";
import { getPublicCatalog } from "@/lib/public-catalog";

export default async function RestaurantsPage() {
  const catalog = await getPublicCatalog();
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">Restaurant directory</p>
        <h1 className="page-title">Browse menus with context.</h1>
        <p className="lede">
          Browse restaurants, explore menus and find the dish details that matter to you.
        </p>
        {catalog.source === "DATABASE_UNAVAILABLE" ? (
          <div className="empty-state">
            <h2>Published menu data is temporarily unavailable</h2>
            <p>
              Please try again later while we restore access to the restaurant directory.
            </p>
          </div>
        ) : (
          <RestaurantDirectory
            restaurants={catalog.restaurants}
          />
        )}
      </section>
    </SiteShell>
  );
}
