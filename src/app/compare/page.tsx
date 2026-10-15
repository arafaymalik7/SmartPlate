import { ComparisonClient } from "@/components/comparison-client";
import { SiteShell } from "@/components/site-shell";

export default function ComparePage() {
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">Illustrative comparison</p>
        <h1 className="page-title">Compare meals per serving.</h1>
        <p className="lede">
          Demo values are illustrative and missing data remains unavailable. Choose up to three
          dishes for a side-by-side view.
        </p>
        <ComparisonClient />
      </section>
    </SiteShell>
  );
}
