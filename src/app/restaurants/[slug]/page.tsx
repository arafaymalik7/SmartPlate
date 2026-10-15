import { notFound } from "next/navigation";
import { MenuBrowser } from "@/components/menu-browser";
import { SiteShell } from "@/components/site-shell";
import { getPublicCatalog } from "@/lib/public-catalog";

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalog = await getPublicCatalog();
  const restaurant = catalog.restaurants.find((value) => value.slug === slug);
  if (!restaurant) notFound();
  const items = catalog.items.filter((item) => item.restaurantSlug === restaurant.slug);
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">Illustrative menu · {restaurant.location}</p>
        <h1 className="page-title">{restaurant.name}</h1>
        {catalog.source === "DATABASE" && <p className="state-label">Published menu data</p>}
        <p className="lede">
          {restaurant.description} Nutrition values are illustrative per-serving information;
          missing values are shown as not available.
        </p>
        <MenuBrowser items={items} />
      </section>
    </SiteShell>
  );
}
