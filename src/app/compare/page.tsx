import { ComparisonClient } from "@/components/comparison-client";
import { SiteShell } from "@/components/site-shell";
import { getPublicCatalog } from "@/lib/public-catalog";

export default async function ComparePage() {
  const catalog = await getPublicCatalog();
  if (catalog.source === "DATABASE_UNAVAILABLE") {
    return (
      <SiteShell>
        <section className="shell section empty-state">
          <h1>Comparison is temporarily unavailable</h1>
          <p>Menu data could not be reached. Please try again shortly.</p>
        </section>
      </SiteShell>
    );
  }
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">Meal comparison</p>
        <h1 className="page-title">Compare meals per serving.</h1>
        <p className="lede">
          Compare per-serving nutrition side by side and choose up to three dishes for a focused
          view.
        </p>
        <ComparisonClient
          items={catalog.items}
        />
      </section>
    </SiteShell>
  );
}
