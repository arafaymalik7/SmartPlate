import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { signOutMock } = vi.hoisted(() => ({ signOutMock: vi.fn() }));

vi.mock("next-auth/react", () => ({ signOut: signOutMock }));

import { SignOutButton } from "./sign-out-button";

describe("SignOutButton", () => {
  it("ends the session and returns to the protected sign-in route", async () => {
    signOutMock.mockResolvedValue(undefined);
    render(<SignOutButton />);

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    expect((screen.getByRole("button", { name: "Signing out…" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    await waitFor(() =>
      expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: "/admin/sign-in" }),
    );
  });
});
