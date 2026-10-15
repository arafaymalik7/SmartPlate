import { describe, expect, it } from "vitest";
import { hasTrustedMutationOrigin } from "./request-origin";

describe("hasTrustedMutationOrigin", () => {
  it("accepts same-origin and non-browser requests", () => {
    expect(
      hasTrustedMutationOrigin(
        new Request("https://smartplate.example/api/admin/restaurants", {
          headers: { origin: "https://smartplate.example" },
        }),
      ),
    ).toBe(true);
    expect(
      hasTrustedMutationOrigin(new Request("https://smartplate.example/api/admin/restaurants")),
    ).toBe(true);
  });
  it("rejects cross-origin and malformed origins", () => {
    expect(
      hasTrustedMutationOrigin(
        new Request("https://smartplate.example/api/admin/restaurants", {
          headers: { origin: "https://attacker.example" },
        }),
      ),
    ).toBe(false);
    expect(
      hasTrustedMutationOrigin(
        new Request("https://smartplate.example/api/admin/restaurants", {
          headers: { origin: "invalid origin" },
        }),
      ),
    ).toBe(false);
  });
});
