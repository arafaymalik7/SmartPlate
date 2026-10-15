import { SiteShell } from "@/components/site-shell";
import { RestaurantDirectory } from "@/components/restaurant-directory";
export default function RestaurantsPage() {
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">Fictional demonstration venues</p>
        <h1 className="page-title">Browse menus with context.</h1>
        <p className="lede">
          All restaurants and values below are illustrative—not verified restaurant records.
        </p>
        <RestaurantDirectory />
      </section>
    </SiteShell>
  );
}
