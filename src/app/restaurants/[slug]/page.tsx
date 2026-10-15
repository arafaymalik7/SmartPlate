import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { demoItems } from "@/lib/demo-data";
export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = slug
    .split("-")
    .map((v) => v[0].toUpperCase() + v.slice(1))
    .join(" ");
  const items = demoItems.filter((item) => item.restaurant === name);
  if (!items.length) notFound();
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">Illustrative menu</p>
        <h1 className="page-title">{name}</h1>
        <p className="lede">
          Nutrition values are illustrative. Missing values are shown as not available.
        </p>
        <div className="feature-grid">
          {items.map((item) => (
            <article key={item.slug}>
              <h3>{item.name}</h3>
              <p>
                {item.calories ?? "Not available"}
                {item.calories ? " kcal" : ""} · MYR {item.price.toFixed(2)}
              </p>
              <Link className="text-link" href={`/menu/${item.slug}`}>
                View nutrition
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
