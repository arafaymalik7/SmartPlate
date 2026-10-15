import { describe, expect, it } from "vitest";
import { demoItems } from "./demo-data";
describe("illustrative demo data", () => {
  it("labels every record illustrative and preserves unknown values", () => {
    expect(demoItems.every((item) => item.sourceType === "ILLUSTRATIVE")).toBe(true);
    expect(demoItems.some((item) => item.calories === null)).toBe(true);
  });
});
