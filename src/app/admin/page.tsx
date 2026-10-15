import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth/options";
import { SiteShell } from "@/components/site-shell";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  return (
    <SiteShell>
      <section className="shell section">
        <p className="state-label">Administration</p>
        <h1 className="page-title">{session ? "Admin workspace" : "Protected workspace"}</h1>
        {session ? (
          <p className="lede">
            Signed in as {session.user?.email}. Data management becomes available after PostgreSQL
            migration and seed verification.
          </p>
        ) : (
          <>
            <p className="lede">
              Sign-in requires an administrator created through the one-time bootstrap command. No
              public admin registration exists.
            </p>
            <Link className="button" href="/admin/sign-in">
              Admin sign in
            </Link>
          </>
        )}
      </section>
    </SiteShell>
  );
}
