"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState("");
  return (
    <main className="state-page">
      <p className="state-label">Administrator sign in</p>
      <h1>Protected access only.</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const result = await signIn("credentials", {
            email: form.get("email"),
            password: form.get("password"),
            redirect: false,
          });
          if (!result || result.error || !result.ok) {
            setError("Sign-in failed. Check your credentials.");
            return;
          }
          router.push("/admin");
        }}
      >
        <label>
          Email
          <input required name="email" type="email" />
        </label>
        <label>
          Password
          <input required name="password" type="password" />
        </label>
        {error && <p role="alert">{error}</p>}
        <button className="button">Sign in</button>
      </form>
    </main>
  );
}
