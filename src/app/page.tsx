import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
export default function HomePage() {
  return (
    <SiteShell>
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <p className="state-label">Menu clarity, without false certainty</p>
            <h1>Choose a meal with the whole picture in view.</h1>
            <p className="lede">
              Explore transparent nutrition, ingredient disclosure and source context—then use your
              own preferences to compare practical options.
            </p>
            <div className="inline-actions">
              <Link className="button" href="/restaurants">
                Explore restaurants
              </Link>
              <Link className="text-link" href="/how-it-works">
                How recommendations work
              </Link>
            </div>
          </div>
          <aside className="hero-panel">
            <p>Every sample in this demo is clearly marked.</p>
            <dl>
              <div>
                <dt>Nutrition</dt>
                <dd>Per serving, never assumed</dd>
              </div>
              <div>
                <dt>Allergens</dt>
                <dd>Unknown stays unknown</dd>
              </div>
              <div>
                <dt>Recommendations</dt>
                <dd>Explainable, rule-based</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
      <section className="shell section">
        <div className="section-heading">
          <h2>Built for the question behind the menu.</h2>
          <p>
            SMARTPLATE helps you compare choices without presenting illustrative data as verified
            restaurant facts.
          </p>
        </div>
        <div className="feature-grid">
          <article>
            <h3>See what is known</h3>
            <p>Nutrition, portions, ingredients and source labels are kept together.</p>
          </article>
          <article>
            <h3>Set simple priorities</h3>
            <p>
              Use a calorie target, dietary preference or ingredient exclusion—without entering
              medical information.
            </p>
          </article>
          <article>
            <h3>Understand a match</h3>
            <p>Every result describes why it ranked and what could not be verified.</p>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
