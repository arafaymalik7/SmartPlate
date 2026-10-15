"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);

  return (
    <button
      className="button button-secondary"
      type="button"
      disabled={isSigningOut}
      onClick={async () => {
        setIsSigningOut(true);
        await signOut({ callbackUrl: "/admin/sign-in" });
      }}
    >
      {isSigningOut ? "Signing out…" : "Sign out"}
    </button>
  );
}
