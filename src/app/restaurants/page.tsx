import { SiteShell } from "@/components/site-shell";
import { RestaurantDirectory } from "@/components/restaurant-directory";
import { getPublicCatalog } from "@/lib/public-catalog";

export default async function RestaurantsPage() {
  const catalog = await getPublicCatalog();
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">Fictional demonstration venues</p>
        <h1 className="page-title">Browse menus with context.</h1>
        <p className="lede">
          {catalog.source === "DATABASE"
            ? "Only published and currently available records are shown. Nutrition and disclosure limits remain visible."
            : "All restaurants and values below are illustrative—not verified restaurant records."}
        </p>
        {catalog.source === "DATABASE_UNAVAILABLE" ? (
          <div className="empty-state">
            <h2>Published menu data is temporarily unavailable</h2>
            <p>
              Please try again later. No illustrative records are substituted when a configured
              database cannot be reached.
            </p>
          </div>
        ) : (
          <RestaurantDirectory
            restaurants={catalog.restaurants}
            isIllustrative={catalog.source === "ILLUSTRATIVE_FALLBACK"}
          />
        )}
      </section>
    </SiteShell>
  );
}
