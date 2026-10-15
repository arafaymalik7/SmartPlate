import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
});

async function main() {
  const [restaurants, categories, items, nutrition] = await Promise.all([
    prisma.restaurant.count(),
    prisma.menuCategory.count(),
    prisma.menuItem.count(),
    prisma.menuItemNutrition.count(),
  ]);
  const actual = { restaurants, categories, items, nutrition };
  const expected = { restaurants: 4, categories: 4, items: 48, nutrition: 48 };
  if (
    Object.entries(expected).some(([key, count]) => actual[key as keyof typeof actual] !== count)
  ) {
    throw new Error(`Unexpected illustrative seed counts: ${JSON.stringify(actual)}`);
  }
  console.log(`Seed idempotency verified: ${JSON.stringify(actual)}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error("Seed verification failed without exposing connection details.");
    await prisma.$disconnect();
    process.exitCode = 1;
  });
