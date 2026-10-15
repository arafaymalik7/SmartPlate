export type DemoItem = {
  slug: string;
  name: string;
  restaurant: string;
  category: string;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  sodiumMg: number | null;
  price: number;
  dietaryStatus: "VEGETARIAN_VERIFIED" | "VEGAN_VERIFIED" | "UNKNOWN";
  ingredients: string[];
  allergenDisclosure: "UNKNOWN" | "PRESENT";
  sourceType: "ILLUSTRATIVE";
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
export const demoItems: DemoItem[] = [
  {
    slug: "green-ladle-garden-bowl",
    name: "Garden Grain Bowl",
    restaurant: "Green Ladle",
    category: "Mains",
    calories: 420,
    proteinG: 16,
    carbsG: 57,
    fatG: 14,
    sodiumMg: 380,
    price: 18,
    dietaryStatus: "VEGAN_VERIFIED",
    ingredients: ["brown rice", "chickpeas", "greens"],
    allergenDisclosure: "UNKNOWN",
    sourceType: "ILLUSTRATIVE",
  },
  {
    slug: "harbor-bowl-lime-chicken",
    name: "Lime Chicken Bowl",
    restaurant: "Harbor Bowl",
    category: "Mains",
    calories: 510,
    proteinG: 33,
    carbsG: 49,
    fatG: 18,
    sodiumMg: 690,
    price: 22,
    dietaryStatus: "UNKNOWN",
    ingredients: ["chicken", "rice", "lime"],
    allergenDisclosure: "UNKNOWN",
    sourceType: "ILLUSTRATIVE",
  },
  {
    slug: "saffron-table-tofu",
    name: "Charred Tofu Plate",
    restaurant: "Saffron Table",
    category: "Mains",
    calories: null,
    proteinG: 21,
    carbsG: 42,
    fatG: 17,
    sodiumMg: null,
    price: 19,
    dietaryStatus: "VEGETARIAN_VERIFIED",
    ingredients: ["tofu", "rice", "herbs"],
    allergenDisclosure: "UNKNOWN",
    sourceType: "ILLUSTRATIVE",
  },
  {
    slug: "daylight-kitchen-oats",
    name: "Oat Pancakes",
    restaurant: "Daylight Kitchen",
    category: "Breakfast",
    calories: 390,
    proteinG: 11,
    carbsG: 61,
    fatG: 11,
    sodiumMg: 260,
    price: 15,
    dietaryStatus: "VEGETARIAN_VERIFIED",
    ingredients: ["oats", "milk", "fruit"],
    allergenDisclosure: "PRESENT",
    sourceType: "ILLUSTRATIVE",
  },
];
