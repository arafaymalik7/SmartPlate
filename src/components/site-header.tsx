import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <div className="shell nav-row">
        <Link className="brand" href="/" aria-label="SMARTPLATE home">
          <span className="brand-mark" aria-hidden="true">
            SP
          </span>
          SMARTPLATE
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/restaurants">Restaurants</Link>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/methodology">Data & limits</Link>
        </nav>
        <Link className="button button-small" href="/recommend">
          Find a meal
        </Link>
      </div>
    </header>
  );
}
