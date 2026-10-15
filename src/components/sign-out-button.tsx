"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      <button
        className="button button-secondary"
        type="button"
        disabled={isSigningOut}
        onClick={async () => {
          setError("");
          setIsSigningOut(true);
          try {
            await signOut({ callbackUrl: "/admin/sign-in" });
          } catch {
            setError("Sign-out could not be completed. Please try again.");
            setIsSigningOut(false);
          }
        }}
      >
        {isSigningOut ? "Signing out…" : "Sign out"}
      </button>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
