import { z } from "zod";
export const restaurantSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/),
  cuisine: z.string().trim().min(2).max(80),
  location: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(1200),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});
export const publicationStatusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});
const disclosureEntrySchema = z.object({
  name: z.string().trim().min(1).max(120),
  state: z.enum(["PRESENT", "ABSENT_VERIFIED", "UNKNOWN"]),
});
export const menuItemSchema = z.object({
  restaurantId: z.string().min(1),
  categoryId: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(160),
  description: z.string().min(2).max(1200),
  price: z.coerce.number().min(0).max(100000),
  currency: z.string().trim().length(3).default("MYR"),
  servingSize: z.string().min(1).max(80),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  isAvailable: z.boolean().default(true),
  dietaryStatus: z.string().trim().max(60).optional(),
  calories: z.coerce.number().min(0).max(10000).nullable().optional(),
  proteinG: z.coerce.number().min(0).max(1000).nullable().optional(),
  carbsG: z.coerce.number().min(0).max(1000).nullable().optional(),
  fatG: z.coerce.number().min(0).max(1000).nullable().optional(),
  sodiumMg: z.coerce.number().min(0).max(100000).nullable().optional(),
  sourceType: z.enum(["ILLUSTRATIVE", "FOOD_COMPOSITION_DERIVED", "RESTAURANT_VERIFIED"]),
  sourceUrl: z.string().url().max(2048).optional().or(z.literal("")),
  sourceCitation: z.string().trim().max(500).optional(),
  ingredients: z.array(disclosureEntrySchema).max(50).default([]),
  allergens: z.array(disclosureEntrySchema).max(50).default([]),
});

export const categorySchema = z.object({
  restaurantId: z.string().min(1),
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});
