import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="brand">SMARTPLATE</p>
          <p>Clearer menu information for everyday, informational meal choices.</p>
        </div>
        <div className="footer-links">
          <Link href="/about">About</Link>
          <Link href="/help">Help & FAQ</Link>
          <Link href="/disclaimer">Disclaimer & privacy</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
      <div className="shell footer-note">
        SMARTPLATE supports everyday meal exploration and does not provide medical or allergy-safety
        advice.
      </div>
    </footer>
  );
}
