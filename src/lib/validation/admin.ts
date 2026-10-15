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
export const menuItemSchema = z.object({
  restaurantId: z.string().min(1),
  categoryId: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(160),
  description: z.string().min(2).max(1200),
  price: z.coerce.number().min(0).max(100000),
  servingSize: z.string().min(1).max(80),
  calories: z.coerce.number().min(0).max(10000).nullable().optional(),
  sourceType: z.enum(["ILLUSTRATIVE", "FOOD_COMPOSITION_DERIVED", "RESTAURANT_VERIFIED"]),
});
