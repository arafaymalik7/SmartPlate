import Link from "next/link";
export default function NotFound() {
  return (
    <main className="state-page">
      <p className="state-label">Not found</p>
      <h1>This menu path is not available.</h1>
      <p>It may have moved, be unpublished, or never have existed.</p>
      <Link className="button" href="/restaurants">
        Browse restaurants
      </Link>
    </main>
  );
}
