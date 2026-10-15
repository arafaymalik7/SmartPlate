import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";
describe("admin password hashing", () => {
  it("verifies only the original password", () => {
    const hash = hashPassword("StrongTestPassword!23");
    expect(verifyPassword("StrongTestPassword!23", hash)).toBe(true);
    expect(verifyPassword("wrong", hash)).toBe(false);
  });
});
