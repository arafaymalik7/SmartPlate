import { getPublicCatalog } from "../src/lib/public-catalog";
import { recommend } from "../src/lib/recommendation/engine";

async function catalogItemSlugs() {
  const catalog = await getPublicCatalog();
  if (catalog.source !== "DATABASE")
    throw new Error(`Expected DATABASE catalog source, received ${catalog.source}.`);
  return new Set(catalog.items.map((item) => item.slug));
}

async function main() {
  const { prisma } = await import("../src/lib/db/prisma");
  const item = await prisma.menuItem.findFirst({
    where: { status: "PUBLISHED", isAvailable: true, categoryId: { not: null } },
    include: { restaurant: true, category: true },
    orderBy: { slug: "asc" },
  });
  if (!item?.category) throw new Error("Expected a published seeded menu item with a category.");

  const initialCatalog = await getPublicCatalog();
  if (initialCatalog.source !== "DATABASE") throw new Error("Public catalog was unavailable.");
  const recommendations = recommend(
    initialCatalog.items.map((candidate) => ({ ...candidate, active: true })),
    {
      calorieTarget: 500,
      diet: "NONE",
      priority: "NONE",
      excludedIngredients: [],
      allergenExclusions: [],
    },
  );
  if (!recommendations.eligible.length)
    throw new Error("Expected database-backed catalog items to produce recommendations.");

  const original = {
    restaurantStatus: item.restaurant.status,
    categoryStatus: item.category.status,
    itemStatus: item.status,
    isAvailable: item.isAvailable,
  };

  try {
    await prisma.menuItem.update({ where: { id: item.id }, data: { status: "DRAFT" } });
    if ((await catalogItemSlugs()).has(item.slug))
      throw new Error("Draft menu item was visible in the public catalog.");
    await prisma.menuItem.update({ where: { id: item.id }, data: { status: original.itemStatus } });

    await prisma.menuItem.update({ where: { id: item.id }, data: { isAvailable: false } });
    if ((await catalogItemSlugs()).has(item.slug))
      throw new Error("Unavailable menu item was visible in the public catalog.");
    await prisma.menuItem.update({ where: { id: item.id }, data: { isAvailable: original.isAvailable } });

    await prisma.menuCategory.update({
      where: { id: item.category.id },
      data: { status: "DRAFT" },
    });
    if ((await catalogItemSlugs()).has(item.slug))
      throw new Error("Item in a draft category was visible in the public catalog.");
    await prisma.menuCategory.update({
      where: { id: item.category.id },
      data: { status: original.categoryStatus },
    });

    await prisma.restaurant.update({
      where: { id: item.restaurant.id },
      data: { status: "DRAFT" },
    });
    const catalog = await getPublicCatalog();
    if (catalog.source !== "DATABASE") throw new Error("Public catalog was unavailable.");
    if (catalog.restaurants.some((restaurant) => restaurant.slug === item.restaurant.slug))
      throw new Error("Draft restaurant was visible in the public catalog.");
    if (catalog.items.some((publicItem) => publicItem.slug === item.slug))
      throw new Error("Item from a draft restaurant was visible in the public catalog.");
  } finally {
    await prisma.$transaction([
      prisma.restaurant.update({
        where: { id: item.restaurant.id },
        data: { status: original.restaurantStatus },
      }),
      prisma.menuCategory.update({
        where: { id: item.category.id },
        data: { status: original.categoryStatus },
      }),
      prisma.menuItem.update({
        where: { id: item.id },
        data: { status: original.itemStatus, isAvailable: original.isAvailable },
      }),
    ]);
    await prisma.$disconnect();
  }

  console.log(
    "Verified database-backed recommendations plus draft, unavailable, category, and restaurant visibility.",
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Public visibility verification failed.");
  process.exitCode = 1;
});
