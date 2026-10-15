import { getPublicCatalog } from "../src/lib/public-catalog";

async function main() {
  const catalog = await getPublicCatalog();
  if (catalog.source !== "DATABASE")
    throw new Error(`Expected DATABASE catalog source, received ${catalog.source}.`);
  if (catalog.restaurants.length !== 4 || catalog.items.length !== 48)
    throw new Error(
      `Expected 4 restaurants and 48 published items, received ${catalog.restaurants.length} and ${catalog.items.length}.`,
    );
  if (!catalog.items.some((item) => item.dietaryStatus === "VEGAN_VERIFIED"))
    throw new Error("Expected at least one vegan-verified published menu item.");
  const { prisma } = await import("../src/lib/db/prisma");
  await prisma.$disconnect();
  console.log(
    "Verified published PostgreSQL catalog: 4 restaurants, 48 items, vegan coverage present.",
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Public catalog verification failed.");
  process.exitCode = 1;
});
