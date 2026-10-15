export type DemoItem = {
  slug: string;
  name: string;
  restaurant: string;
  restaurantSlug: string;
  category: string;
  description: string;
  servingSize: string;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  sodiumMg: number | null;
  price: number;
  dietaryStatus: "VEGETARIAN_VERIFIED" | "VEGAN_VERIFIED" | "UNKNOWN";
  ingredients: string[];
  allergens: string[];
  allergenDisclosure: "UNKNOWN" | "PRESENT" | "ABSENT_VERIFIED";
  sourceType: "ILLUSTRATIVE" | "FOOD_COMPOSITION_DERIVED" | "RESTAURANT_VERIFIED";
  sourceCitation: string;
  reviewedAt: string;
};

export const demoRestaurants = [
  {
    slug: "green-ladle",
    name: "Green Ladle",
    cuisine: "Plant-forward",
    location: "Kuala Lumpur",
    description: "Fictional plant-forward demonstration menu.",
  },
  {
    slug: "harbor-bowl",
    name: "Harbor Bowl",
    cuisine: "Coastal bowls",
    location: "Penang",
    description: "Fictional coastal-bowl demonstration menu.",
  },
  {
    slug: "saffron-table",
    name: "Saffron Table",
    cuisine: "Modern Malaysian",
    location: "Shah Alam",
    description: "Fictional modern Malaysian demonstration menu.",
  },
  {
    slug: "daylight-kitchen",
    name: "Daylight Kitchen",
    cuisine: "Everyday café",
    location: "Johor Bahru",
    description: "Fictional everyday café demonstration menu.",
  },
] as const;

const dishes = [
  {
    slug: "garden-grain-bowl",
    name: "Garden Grain Bowl",
    category: "Mains",
    description: "Grains, chickpeas and greens in a bright herb dressing.",
    servingSize: "1 bowl (360 g)",
    calories: 420,
    proteinG: 16,
    carbsG: 57,
    fatG: 14,
    sodiumMg: 380,
    price: 18,
    dietaryStatus: "VEGAN_VERIFIED",
    ingredients: ["brown rice", "chickpeas", "greens"],
  },
  {
    slug: "lime-chicken-bowl",
    name: "Lime Chicken Bowl",
    category: "Mains",
    description: "Chicken, rice and lime with crisp vegetables.",
    servingSize: "1 bowl (390 g)",
    calories: 510,
    proteinG: 33,
    carbsG: 49,
    fatG: 18,
    sodiumMg: 690,
    price: 22,
    dietaryStatus: "UNKNOWN",
    ingredients: ["chicken", "rice", "lime"],
  },
  {
    slug: "charred-tofu-plate",
    name: "Charred Tofu Plate",
    category: "Mains",
    description: "Tofu, rice and fresh herbs with a warm savoury glaze.",
    servingSize: "1 plate (340 g)",
    calories: null,
    proteinG: 21,
    carbsG: 42,
    fatG: 17,
    sodiumMg: null,
    price: 19,
    dietaryStatus: "VEGETARIAN_VERIFIED",
    ingredients: ["tofu", "rice", "herbs"],
  },
  {
    slug: "oat-pancakes",
    name: "Oat Pancakes",
    category: "Breakfast",
    description: "Oat pancakes served with fruit.",
    servingSize: "2 pancakes (280 g)",
    calories: 390,
    proteinG: 11,
    carbsG: 61,
    fatG: 11,
    sodiumMg: 260,
    price: 15,
    dietaryStatus: "VEGETARIAN_VERIFIED",
    ingredients: ["oats", "milk", "fruit"],
  },
  {
    slug: "citrus-noodle-bowl",
    name: "Citrus Noodle Bowl",
    category: "Mains",
    description: "Noodles and vegetables with a citrus-forward sauce.",
    servingSize: "1 bowl (330 g)",
    calories: 475,
    proteinG: 14,
    carbsG: 68,
    fatG: 15,
    sodiumMg: 720,
    price: 17,
    dietaryStatus: "VEGAN_VERIFIED",
    ingredients: ["noodles", "cabbage", "citrus"],
  },
  {
    slug: "herb-rice-set",
    name: "Herb Rice Set",
    category: "Mains",
    description: "Herbed rice with seasonal vegetables.",
    servingSize: "1 set (350 g)",
    calories: 440,
    proteinG: 13,
    carbsG: 70,
    fatG: 12,
    sodiumMg: 410,
    price: 16,
    dietaryStatus: "VEGETARIAN_VERIFIED",
    ingredients: ["rice", "herbs", "vegetables"],
  },
  {
    slug: "roasted-veg-wrap",
    name: "Roasted Vegetable Wrap",
    category: "Light meals",
    description: "Roasted vegetables in a wholegrain wrap.",
    servingSize: "1 wrap (250 g)",
    calories: 360,
    proteinG: 10,
    carbsG: 52,
    fatG: 12,
    sodiumMg: 540,
    price: 14,
    dietaryStatus: "VEGAN_VERIFIED",
    ingredients: ["wholegrain wrap", "peppers", "eggplant"],
  },
  {
    slug: "sesame-salad",
    name: "Sesame Salad",
    category: "Light meals",
    description: "Crunchy leaves and vegetables with sesame dressing.",
    servingSize: "1 salad (220 g)",
    calories: 280,
    proteinG: 8,
    carbsG: 23,
    fatG: 17,
    sodiumMg: 360,
    price: 13,
    dietaryStatus: "VEGAN_VERIFIED",
    ingredients: ["greens", "sesame", "carrot"],
  },
  {
    slug: "mushroom-soup",
    name: "Mushroom Soup",
    category: "Sides",
    description: "Creamy mushroom soup served warm.",
    servingSize: "1 bowl (280 ml)",
    calories: 240,
    proteinG: 9,
    carbsG: 22,
    fatG: 13,
    sodiumMg: 590,
    price: 11,
    dietaryStatus: "VEGETARIAN_VERIFIED",
    ingredients: ["mushroom", "milk", "onion"],
  },
  {
    slug: "tomato-pasta",
    name: "Tomato Pasta",
    category: "Mains",
    description: "Pasta in a tomato and herb sauce.",
    servingSize: "1 plate (320 g)",
    calories: 460,
    proteinG: 15,
    carbsG: 74,
    fatG: 11,
    sodiumMg: 630,
    price: 18,
    dietaryStatus: "VEGETARIAN_VERIFIED",
    ingredients: ["pasta", "tomato", "herbs"],
  },
  {
    slug: "spiced-chickpeas",
    name: "Spiced Chickpeas",
    category: "Sides",
    description: "Slow-cooked chickpeas with aromatic spices.",
    servingSize: "1 bowl (200 g)",
    calories: 310,
    proteinG: 14,
    carbsG: 44,
    fatG: 9,
    sodiumMg: 350,
    price: 10,
    dietaryStatus: "VEGAN_VERIFIED",
    ingredients: ["chickpeas", "tomato", "spices"],
  },
  {
    slug: "fruit-yogurt-cup",
    name: "Fruit Yogurt Cup",
    category: "Breakfast",
    description: "Fruit and yogurt with a light oat topping.",
    servingSize: "1 cup (210 g)",
    calories: 260,
    proteinG: 12,
    carbsG: 35,
    fatG: 8,
    sodiumMg: 160,
    price: 12,
    dietaryStatus: "VEGETARIAN_VERIFIED",
    ingredients: ["yogurt", "fruit", "oats"],
  },
] as const;

export const demoItems: DemoItem[] = demoRestaurants.flatMap((restaurant, restaurantIndex) =>
  dishes.map((dish, dishIndex) => ({
    ...dish,
    ingredients: [...dish.ingredients],
    slug: `${restaurant.slug}-${dish.slug}`,
    restaurant: restaurant.name,
    restaurantSlug: restaurant.slug,
    calories:
      dishIndex % 5 === 2
        ? null
        : dish.calories === null
          ? null
          : dish.calories + restaurantIndex * 10,
    sodiumMg:
      dishIndex % 4 === 2
        ? null
        : dish.sodiumMg === null
          ? null
          : dish.sodiumMg + restaurantIndex * 15,
    price: dish.price + restaurantIndex,
    allergenDisclosure:
      dishIndex === 3 || dishIndex === 8 || dishIndex === 11 ? "PRESENT" : "UNKNOWN",
    allergens: [],
    sourceType: "ILLUSTRATIVE",
    sourceCitation: "Fictional illustrative demonstration value; not restaurant-verified.",
    reviewedAt: "2026-10-15",
  })),
);
