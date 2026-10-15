import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { demoItems } from "@/lib/demo-data";
export default function RestaurantsPage() {
  const names = [...new Set(demoItems.map((item) => item.restaurant))];
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">Fictional demonstration venues</p>
        <h1 className="page-title">Browse menus with context.</h1>
        <p className="lede">
          All restaurants and values below are illustrative—not verified restaurant records.
        </p>
        <div className="feature-grid">
          {names.map((name) => (
            <article key={name}>
              <h3>{name}</h3>
              <p>Fictional demo menu with per-serving illustrative nutrition.</p>
              <Link
                className="text-link"
                href={`/restaurants/${name.toLowerCase().replaceAll(" ", "-")}`}
              >
                View menu
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
