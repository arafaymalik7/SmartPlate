import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, PublicationStatus, SourceType } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
});
const restaurants = [
  ["green-ladle", "Green Ladle", "Plant-forward", "Kuala Lumpur"],
  ["harbor-bowl", "Harbor Bowl", "Coastal bowls", "Penang"],
  ["saffron-table", "Saffron Table", "Modern Malaysian", "Shah Alam"],
  ["daylight-kitchen", "Daylight Kitchen", "Everyday café", "Johor Bahru"],
] as const;
const dishes = [
  "Garden Grain Bowl",
  "Charred Tofu Plate",
  "Citrus Noodle Bowl",
  "Herb Rice Set",
  "Roasted Veg Wrap",
  "Sesame Salad",
  "Mushroom Soup",
  "Tomato Pasta",
  "Spiced Chickpeas",
  "Lime Chicken Bowl",
  "Oat Pancakes",
  "Fruit Yogurt Cup",
];

async function main() {
  for (const [slug, name, cuisine, location] of restaurants) {
    const restaurant = await prisma.restaurant.upsert({
      where: { slug },
      update: {
        name,
        cuisine,
        location,
        description: `Fictional illustrative ${cuisine.toLowerCase()} demo restaurant.`,
        status: PublicationStatus.PUBLISHED,
      },
      create: {
        slug,
        name,
        cuisine,
        location,
        description: `Fictional illustrative ${cuisine.toLowerCase()} demo restaurant.`,
        status: PublicationStatus.PUBLISHED,
      },
    });
    const category = await prisma.menuCategory.upsert({
      where: { restaurantId_slug: { restaurantId: restaurant.id, slug: "mains" } },
      update: { name: "Mains", status: PublicationStatus.PUBLISHED },
      create: {
        restaurantId: restaurant.id,
        name: "Mains",
        slug: "mains",
        status: PublicationStatus.PUBLISHED,
      },
    });
    for (const [index, name] of dishes.entries()) {
      const item = await prisma.menuItem.upsert({
        where: { slug: `${slug}-${index + 1}` },
        update: {},
        create: {
          restaurantId: restaurant.id,
          categoryId: category.id,
          slug: `${slug}-${index + 1}`,
          name,
          description: "Fictional illustrative menu dish for demonstration only.",
          price: 12 + index,
          servingSize: "1 serving",
          status: PublicationStatus.PUBLISHED,
          dietaryStatus: index % 3 === 0 ? "VEGETARIAN_VERIFIED" : "UNKNOWN",
        },
      });
      await prisma.menuItemNutrition.upsert({
        where: { menuItemId: item.id },
        update: {},
        create: {
          menuItemId: item.id,
          calories: index % 5 === 0 ? null : 320 + index * 19,
          proteinG: 12 + index,
          carbsG: 31 + index,
          fatG: 8 + index / 2,
          sodiumMg: index % 4 === 0 ? null : 240 + index * 16,
          sourceType: SourceType.ILLUSTRATIVE,
          sourceCitation: "Fictional illustrative demo value",
        },
      });
    }
  }
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error("Seed failed without exposing connection details.");
    await prisma.$disconnect();
    process.exitCode = 1;
  });
