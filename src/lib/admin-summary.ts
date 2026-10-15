import type { Prisma } from "@/generated/prisma/client";

export const missingNutritionWhere: Prisma.MenuItemWhereInput = {
  OR: [
    { nutrition: { is: null } },
    {
      nutrition: {
        is: {
          OR: [{ calories: null }, { sodiumMg: null }],
        },
      },
    },
  ],
};
