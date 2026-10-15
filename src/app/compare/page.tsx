import { ComparisonClient } from "@/components/comparison-client";
import { SiteShell } from "@/components/site-shell";
import { getPublicCatalog } from "@/lib/public-catalog";

export default async function ComparePage() {
  const catalog = await getPublicCatalog();
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">
          {catalog.source === "ILLUSTRATIVE_FALLBACK"
            ? "Illustrative comparison"
            : "Published-data comparison"}
        </p>
        <h1 className="page-title">Compare meals per serving.</h1>
        <p className="lede">
          {catalog.source === "ILLUSTRATIVE_FALLBACK"
            ? "Demo values are illustrative and missing data remains unavailable."
            : "Published values are per serving, and missing data remains unavailable."}{" "}
          Choose up to three dishes for a side-by-side view.
        </p>
        <ComparisonClient
          items={catalog.items}
          isIllustrative={catalog.source === "ILLUSTRATIVE_FALLBACK"}
        />
      </section>
    </SiteShell>
  );
}
