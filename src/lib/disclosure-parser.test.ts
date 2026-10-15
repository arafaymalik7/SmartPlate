import { describe, expect, it } from "vitest";
import { parseDisclosures } from "./disclosure-parser";

describe("disclosure parser", () => {
  it("retains explicit states for multiple disclosure lines", () => {
    expect(parseDisclosures("oats | PRESENT\npeanuts | ABSENT_VERIFIED")).toEqual([
      { name: "oats", state: "PRESENT" },
      { name: "peanuts", state: "ABSENT_VERIFIED" },
    ]);
  });

  it("uses unknown for missing or invalid states and ignores blank names", () => {
    expect(parseDisclosures("milk\nsoy | SAFE\n | PRESENT")).toEqual([
      { name: "milk", state: "UNKNOWN" },
      { name: "soy", state: "UNKNOWN" },
    ]);
  });
});
