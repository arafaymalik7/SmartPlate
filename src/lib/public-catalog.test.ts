import { afterEach, describe, expect, it } from "vitest";
import { getPublicCatalog } from "./public-catalog";

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

afterEach(() => {
  if (databaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = databaseUrl;
  if (directUrl === undefined) delete process.env.DIRECT_URL;
  else process.env.DIRECT_URL = directUrl;
});

describe("public catalog", () => {
  it("uses explicit illustrative data only when no database is configured", async () => {
    delete process.env.DATABASE_URL;
    delete process.env.DIRECT_URL;
    const catalog = await getPublicCatalog();
    expect(catalog.source).toBe("ILLUSTRATIVE_FALLBACK");
    expect(catalog.restaurants).toHaveLength(4);
    expect(catalog.items).toHaveLength(48);
  });
});
