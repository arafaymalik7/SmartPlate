import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { pushMock, signInMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  signInMock: vi.fn(),
}));

vi.mock("next-auth/react", () => ({ signIn: signInMock }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: pushMock }) }));

import SignIn from "./page";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("administrator sign-in", () => {
  it("does not grant access when the credentials provider returns no result", async () => {
    signInMock.mockResolvedValueOnce(undefined);
    render(<SignIn />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@example.test" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "incorrect" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect((await screen.findByRole("alert")).textContent).toMatch(/sign-in failed/i);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("opens the protected workspace only after a successful credentials result", async () => {
    signInMock.mockResolvedValueOnce({ ok: true, error: null });
    render(<SignIn />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "admin@example.test" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "valid" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/admin"));
  });
});
