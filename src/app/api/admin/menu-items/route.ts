import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth/require-admin";
import { hasTrustedMutationOrigin } from "@/lib/security/request-origin";
import { menuItemSchema } from "@/lib/validation/admin";

export async function POST(request: Request) {
  if (!hasTrustedMutationOrigin(request))
    return NextResponse.json({ error: "Untrusted request origin" }, { status: 403 });
  const email = await getAdminEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = menuItemSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid menu item input" }, { status: 400 });
  const { prisma } = await import("@/lib/db/prisma");
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: parsed.data.restaurantId },
  });
  if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  if (parsed.data.categoryId) {
    const category = await prisma.menuCategory.findFirst({
      where: { id: parsed.data.categoryId, restaurantId: restaurant.id },
    });
    if (!category)
      return NextResponse.json(
        { error: "Category does not belong to this restaurant" },
        { status: 400 },
      );
  }
  const item = await prisma.$transaction(async (transaction) => {
    const created = await transaction.menuItem.create({
      data: {
        restaurantId: parsed.data.restaurantId,
        categoryId: parsed.data.categoryId,
        slug: parsed.data.slug,
        name: parsed.data.name,
        description: parsed.data.description,
        price: parsed.data.price,
        currency: parsed.data.currency,
        servingSize: parsed.data.servingSize,
        status: parsed.data.status,
        isAvailable: parsed.data.isAvailable,
        dietaryStatus: parsed.data.dietaryStatus,
        nutrition: {
          create: {
            calories: parsed.data.calories,
            proteinG: parsed.data.proteinG,
            carbsG: parsed.data.carbsG,
            fatG: parsed.data.fatG,
            sodiumMg: parsed.data.sodiumMg,
            sourceType: parsed.data.sourceType,
            sourceUrl: parsed.data.sourceUrl || undefined,
            sourceCitation: parsed.data.sourceCitation,
          },
        },
      },
    });
    const actor = await transaction.user.findUnique({ where: { email }, select: { id: true } });
    if (!actor) throw new Error("Authorized administrator was not found.");
    await transaction.adminAuditLog.create({
      data: {
        actorId: actor.id,
        action: "MENU_ITEM_CREATED",
        entityType: "MenuItem",
        entityId: created.id,
        metadata: { restaurantId: restaurant.id, slug: created.slug },
      },
    });
    return created;
  });
  return NextResponse.json(item, { status: 201 });
}
