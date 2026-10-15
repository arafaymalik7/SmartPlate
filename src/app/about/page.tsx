import { SiteShell } from "@/components/site-shell";
export default function About() {
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">About SMARTPLATE</p>
        <h1 className="page-title">A clearer way to explore demo menus.</h1>
        <p className="lede">
          SMARTPLATE is a university demonstration of transparent menu nutrition and explainable
          rule-based suggestions.
        </p>
      </section>
    </SiteShell>
  );
}
