import { SiteShell } from "@/components/site-shell";
import { RecommendationClient } from "@/components/recommendation-client";
import { getPublicCatalog } from "@/lib/public-catalog";

export default async function RecommendPage() {
  const catalog = await getPublicCatalog();
  return (
    <SiteShell>
      <RecommendationClient
        items={catalog.items}
        isIllustrative={catalog.source === "ILLUSTRATIVE_FALLBACK"}
      />
    </SiteShell>
  );
}
