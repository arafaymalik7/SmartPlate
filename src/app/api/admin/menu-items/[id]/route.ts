import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth/require-admin";
import { hasTrustedMutationOrigin } from "@/lib/security/request-origin";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { menuItemSchema, publicationStatusSchema } from "@/lib/validation/admin";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!hasTrustedMutationOrigin(request))
    return NextResponse.json({ error: "Untrusted request origin" }, { status: 403 });
  const email = await getAdminEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rateLimit = checkRateLimit(`admin-mutation:${email}`);
  if (!rateLimit.allowed)
    return NextResponse.json(
      { error: "Too many admin mutations. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  const payload = await request.json().catch(() => null);
  const statusChange = publicationStatusSchema.safeParse(payload);
  const fullUpdate = menuItemSchema.safeParse(payload);
  const statusData =
    statusChange.success &&
    typeof payload === "object" &&
    payload !== null &&
    Object.keys(payload).length === 1 &&
    "status" in payload
      ? statusChange.data
      : null;
  const fullData = fullUpdate.success ? fullUpdate.data : null;
  if (!statusData && !fullData)
    return NextResponse.json({ error: "Invalid menu item input" }, { status: 400 });
  const { id } = await context.params;
  const { prisma } = await import("@/lib/db/prisma");
  const item = await prisma.menuItem.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
  if (fullData) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: fullData.restaurantId },
    });
    if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    if (fullData.categoryId) {
      const category = await prisma.menuCategory.findFirst({
        where: { id: fullData.categoryId, restaurantId: restaurant.id },
      });
      if (!category)
        return NextResponse.json(
          { error: "Category does not belong to this restaurant" },
          { status: 400 },
        );
    }
  }
  const updated = await prisma.$transaction(async (transaction) => {
    const record = statusData
      ? await transaction.menuItem.update({ where: { id }, data: statusData })
      : await transaction.menuItem.update({
          where: { id },
          data: {
            restaurantId: fullData!.restaurantId,
            categoryId: fullData!.categoryId,
            slug: fullData!.slug,
            name: fullData!.name,
            description: fullData!.description,
            price: fullData!.price,
            currency: fullData!.currency,
            servingSize: fullData!.servingSize,
            status: fullData!.status,
            isAvailable: fullData!.isAvailable,
            dietaryStatus: fullData!.dietaryStatus,
            ingredients: {
              deleteMany: {},
              create: fullData!.ingredients.map((entry) => ({
                state: entry.state,
                ingredient: {
                  connectOrCreate: { where: { name: entry.name }, create: { name: entry.name } },
                },
              })),
            },
            allergens: {
              deleteMany: {},
              create: fullData!.allergens.map((entry) => ({
                state: entry.state,
                allergen: {
                  connectOrCreate: { where: { name: entry.name }, create: { name: entry.name } },
                },
              })),
            },
            nutrition: {
              upsert: {
                create: {
                  calories: fullData!.calories,
                  proteinG: fullData!.proteinG,
                  carbsG: fullData!.carbsG,
                  fatG: fullData!.fatG,
                  sodiumMg: fullData!.sodiumMg,
                  sourceType: fullData!.sourceType,
                  sourceUrl: fullData!.sourceUrl || undefined,
                  sourceCitation: fullData!.sourceCitation,
                },
                update: {
                  calories: fullData!.calories,
                  proteinG: fullData!.proteinG,
                  carbsG: fullData!.carbsG,
                  fatG: fullData!.fatG,
                  sodiumMg: fullData!.sodiumMg,
                  sourceType: fullData!.sourceType,
                  sourceUrl: fullData!.sourceUrl || null,
                  sourceCitation: fullData!.sourceCitation || null,
                },
              },
            },
          },
        });
    const actor = await transaction.user.findUnique({ where: { email }, select: { id: true } });
    if (!actor) throw new Error("Authorized administrator was not found.");
    await transaction.adminAuditLog.create({
      data: {
        actorId: actor.id,
        action: statusData ? "MENU_ITEM_STATUS_CHANGED" : "MENU_ITEM_UPDATED",
        entityType: "MenuItem",
        entityId: id,
        metadata: {
          from: item.status,
          to: record.status,
          slug: record.slug,
          changedFields: statusData ? ["status"] : Object.keys(fullData!),
        },
      },
    });
    return record;
  });
  return NextResponse.json(updated);
}
