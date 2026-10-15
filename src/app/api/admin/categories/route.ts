import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth/require-admin";
import { hasTrustedMutationOrigin } from "@/lib/security/request-origin";
import { categorySchema } from "@/lib/validation/admin";

export async function GET() {
  const email = await getAdminEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { prisma } = await import("@/lib/db/prisma");
  return NextResponse.json(
    await prisma.menuCategory.findMany({
      include: { restaurant: { select: { id: true, name: true } } },
      orderBy: [{ restaurant: { name: "asc" } }, { name: "asc" }],
    }),
  );
}

export async function POST(request: Request) {
  if (!hasTrustedMutationOrigin(request))
    return NextResponse.json({ error: "Untrusted request origin" }, { status: 403 });
  const email = await getAdminEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = categorySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid category input" }, { status: 400 });
  const { prisma } = await import("@/lib/db/prisma");
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: parsed.data.restaurantId },
  });
  if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  const category = await prisma.$transaction(async (transaction) => {
    const created = await transaction.menuCategory.create({ data: parsed.data });
    const actor = await transaction.user.findUnique({ where: { email }, select: { id: true } });
    if (!actor) throw new Error("Authorized administrator was not found.");
    await transaction.adminAuditLog.create({
      data: {
        actorId: actor.id,
        action: "CATEGORY_CREATED",
        entityType: "MenuCategory",
        entityId: created.id,
        metadata: { restaurantId: restaurant.id, slug: created.slug },
      },
    });
    return created;
  });
  return NextResponse.json(category, { status: 201 });
}
