import { demoItems, demoRestaurants, type DemoItem } from "./demo-data";

export type PublicRestaurant = {
  slug: string;
  name: string;
  cuisine: string;
  location: string;
  description: string;
  imageUrl?: string | null;
};
export type CatalogSource = "ILLUSTRATIVE_FALLBACK" | "DATABASE" | "DATABASE_UNAVAILABLE";
export type PublicCatalog = {
  source: CatalogSource;
  restaurants: PublicRestaurant[];
  items: DemoItem[];
};

const databaseConfigured = () => Boolean(process.env.DATABASE_URL && process.env.DIRECT_URL);
const decimalToNumber = (value: { toString(): string } | null) =>
  value === null ? null : Number(value.toString());

const illustrativeCatalog = (): PublicCatalog => ({
  source: "ILLUSTRATIVE_FALLBACK",
  restaurants: [...demoRestaurants],
  items: demoItems,
});

export async function getPublicCatalog(): Promise<PublicCatalog> {
  if (!databaseConfigured()) return illustrativeCatalog();

  try {
    const { prisma } = await import("./db/prisma");
    const restaurants = await prisma.restaurant.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { name: "asc" },
      include: {
        items: {
          where: {
            status: "PUBLISHED",
            isAvailable: true,
            OR: [{ categoryId: null }, { category: { status: "PUBLISHED" } }],
          },
          orderBy: { name: "asc" },
          include: {
            category: { select: { name: true } },
            nutrition: true,
            ingredients: { include: { ingredient: { select: { name: true } } } },
            allergens: { include: { allergen: { select: { name: true } } } },
          },
        },
      },
    });
    const publicRestaurants: PublicRestaurant[] = restaurants.map((restaurant) => ({
      slug: restaurant.slug,
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      location: restaurant.location,
      description: restaurant.description,
      imageUrl: restaurant.imageUrl,
    }));
    const items: DemoItem[] = restaurants.flatMap((restaurant) =>
      restaurant.items.map((item) => ({
        slug: item.slug,
        name: item.name,
        restaurant: restaurant.name,
        restaurantSlug: restaurant.slug,
        category: item.category?.name ?? "Uncategorised",
        description: item.description,
        servingSize: item.servingSize,
        calories: decimalToNumber(item.nutrition?.calories ?? null),
        proteinG: decimalToNumber(item.nutrition?.proteinG ?? null),
        carbsG: decimalToNumber(item.nutrition?.carbsG ?? null),
        fatG: decimalToNumber(item.nutrition?.fatG ?? null),
        sodiumMg: decimalToNumber(item.nutrition?.sodiumMg ?? null),
        price: Number(item.price.toString()),
        dietaryStatus:
          item.dietaryStatus === "VEGAN_VERIFIED" || item.dietaryStatus === "VEGETARIAN_VERIFIED"
            ? item.dietaryStatus
            : "UNKNOWN",
        ingredients: item.ingredients.map((entry) => entry.ingredient.name),
        allergenDisclosure: item.allergens.some((entry) => entry.state === "PRESENT")
          ? "PRESENT"
          : item.allergens.length > 0 &&
              item.allergens.every((entry) => entry.state === "ABSENT_VERIFIED")
            ? "ABSENT_VERIFIED"
            : "UNKNOWN",
        allergens: item.allergens.map((entry) => entry.allergen.name),
        sourceType: item.nutrition?.sourceType ?? "ILLUSTRATIVE",
        sourceUrl: item.nutrition?.sourceUrl ?? null,
        sourceCitation:
          item.nutrition?.sourceCitation ??
          "No provenance citation has been supplied for this item.",
        reviewedAt: item.nutrition?.reviewedAt?.toISOString().slice(0, 10) ?? "Not available",
      })),
    );
    return { source: "DATABASE", restaurants: publicRestaurants, items };
  } catch {
    return { source: "DATABASE_UNAVAILABLE", restaurants: [], items: [] };
  }
}
