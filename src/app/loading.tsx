export default function LoadingPage() {
  return (
    <main className="state-page" aria-live="polite">
      <p className="state-label">Loading SMARTPLATE</p>
      <div className="skeleton-title" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </main>
  );
}
