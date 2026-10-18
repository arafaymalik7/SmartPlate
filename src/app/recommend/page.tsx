import { SiteShell } from "@/components/site-shell";
import { RecommendationClient } from "@/components/recommendation-client";
import { getPublicCatalog } from "@/lib/public-catalog";

export default async function RecommendPage() {
  const catalog = await getPublicCatalog();
  if (catalog.source === "DATABASE_UNAVAILABLE") {
    return (
      <SiteShell>
        <section className="shell section empty-state">
          <h1>Recommendations are temporarily unavailable</h1>
          <p>
            Menu data could not be reached. Please try again shortly.
          </p>
        </section>
      </SiteShell>
    );
  }
  return (
    <SiteShell>
      <RecommendationClient
        items={catalog.items}
      />
    </SiteShell>
  );
}
