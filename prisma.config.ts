import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  // Generation only needs the schema. Migration commands still require an explicitly supplied URL.
  datasource: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL },
});
