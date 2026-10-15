import { SiteShell } from "@/components/site-shell";
export default function Disclaimer() {
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">Disclaimer & privacy</p>
        <h1 className="page-title">Information, not medical or allergy advice.</h1>
        <p className="lede">
          Do not use SMARTPLATE to establish allergy safety. The app does not request diagnoses or
          medical history; guest preferences can be cleared from your browser.
        </p>
      </section>
    </SiteShell>
  );
}
