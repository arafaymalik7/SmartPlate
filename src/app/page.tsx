import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { BalanceIcon, LeafIcon, ListCheckIcon, PlateIcon } from "@/components/ui-icons";
export default function HomePage() {
  return (
    <SiteShell>
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <p className="state-label">Menu clarity for everyday choices</p>
            <h1>Choose a meal with every detail in view.</h1>
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
            <div className="hero-panel-icon" aria-hidden="true">
              <LeafIcon />
            </div>
            <p>Everything you need for a more considered choice.</p>
            <dl>
              <div>
                <dt>Nutrition</dt>
                <dd>Clear per-serving details</dd>
              </div>
              <div>
                <dt>Allergens</dt>
                <dd>Ingredient information at a glance</dd>
              </div>
              <div>
                <dt>Recommendations</dt>
                <dd>Tailored to your priorities</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
      <section className="shell section">
        <div className="section-heading">
          <h2>Built for the question behind the menu.</h2>
          <p>
            SMARTPLATE brings the details that shape a decision together in a calm, useful view.
          </p>
        </div>
        <div className="feature-grid">
          <article>
            <ListCheckIcon className="feature-icon" aria-hidden="true" />
            <h3>See what is known</h3>
            <p>Nutrition, portions and ingredients are kept together for quick scanning.</p>
          </article>
          <article>
            <LeafIcon className="feature-icon" aria-hidden="true" />
            <h3>Set simple priorities</h3>
            <p>
              Use a calorie target, dietary preference or ingredient exclusion—without entering
              medical information.
            </p>
          </article>
          <article>
            <BalanceIcon className="feature-icon" aria-hidden="true" />
            <h3>Understand a match</h3>
            <p>Every result explains why it suits the priorities you selected.</p>
          </article>
        </div>
        <div className="home-callout">
          <div className="home-callout-icon" aria-hidden="true">
            <PlateIcon />
          </div>
          <div>
            <h2>A better way to browse the menu.</h2>
            <p>Start with a restaurant, compare a few dishes, or set your meal preferences first.</p>
          </div>
          <Link className="button button-secondary" href="/compare">
            Compare meals
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
