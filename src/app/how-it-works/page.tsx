import { SiteShell } from "@/components/site-shell";
export default function How() {
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">How recommendations work</p>
        <h1 className="page-title">Rules first, reasons always.</h1>
        <p className="lede">
          Strict exclusions are applied before scoring. Scores use calorie fit, selected priority,
          available nutrition and verified diet data. They are software parameters, not medical
          advice.
        </p>
      </section>
    </SiteShell>
  );
}
