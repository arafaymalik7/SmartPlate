import { describe, expect, it } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  it("allows a bounded number of actions and then supplies a retry time", () => {
    const key = `test-${crypto.randomUUID()}`;
    expect(checkRateLimit(key, 1_000, { limit: 2, windowMs: 10_000 }).allowed).toBe(true);
    expect(checkRateLimit(key, 1_001, { limit: 2, windowMs: 10_000 }).allowed).toBe(true);
    expect(checkRateLimit(key, 1_002, { limit: 2, windowMs: 10_000 })).toEqual({
      allowed: false,
      retryAfterSeconds: 10,
    });
  });

  it("starts a fresh window after the prior window expires", () => {
    const key = `test-${crypto.randomUUID()}`;
    checkRateLimit(key, 1_000, { limit: 1, windowMs: 1_000 });
    expect(checkRateLimit(key, 2_000, { limit: 1, windowMs: 1_000 })).toEqual({
      allowed: true,
      retryAfterSeconds: 0,
    });
  });
});
