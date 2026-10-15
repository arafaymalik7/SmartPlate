import { SiteShell } from "@/components/site-shell";
export default function Help() {
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">Help & FAQ</p>
        <h1 className="page-title">What does “not available” mean?</h1>
        <p className="lede">
          It means the demonstration record does not contain that value. It is not a zero and does
          not imply an ingredient or allergen is absent.
        </p>
      </section>
    </SiteShell>
  );
}
