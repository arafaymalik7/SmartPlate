import { describe, expect, it } from "vitest";
import { GET } from "./route";
describe("GET /api/health", () => {
  it("returns an application health payload", async () => {
    const response = GET();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ service: "smartplate", status: "ok" });
  });
});
