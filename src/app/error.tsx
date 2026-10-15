"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <main className="state-page">
      <p className="state-label">Something needs another try</p>
      <h1>We could not load this view.</h1>
      <p>
        Your preferences have not been changed. Try again, or return to the restaurant directory.
      </p>
      <div className="inline-actions">
        <button className="button" onClick={reset}>
          Try again
        </button>
        <Link className="button button-secondary" href="/restaurants">
          Browse restaurants
        </Link>
      </div>
    </main>
  );
}
