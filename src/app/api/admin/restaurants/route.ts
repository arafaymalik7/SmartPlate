import { NextResponse } from "next/server";
import { getAdminEmail, requireAdmin } from "@/lib/auth/require-admin";
import { restaurantSchema } from "@/lib/validation/admin";
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { prisma } = await import("@/lib/db/prisma");
  return NextResponse.json(await prisma.restaurant.findMany({ orderBy: { name: "asc" } }));
}
export async function POST(request: Request) {
  const email = await getAdminEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = restaurantSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid restaurant input" }, { status: 400 });
  const { prisma } = await import("@/lib/db/prisma");
  const restaurant = await prisma.$transaction(async (transaction) => {
    const created = await transaction.restaurant.create({ data: parsed.data });
    const actor = await transaction.user.findUnique({ where: { email }, select: { id: true } });
    if (!actor) throw new Error("Authorized administrator was not found.");
    await transaction.adminAuditLog.create({
      data: {
        actorId: actor.id,
        action: "RESTAURANT_CREATED",
        entityType: "Restaurant",
        entityId: created.id,
        metadata: { slug: created.slug, status: created.status },
      },
    });
    return created;
  });
  return NextResponse.json(restaurant, { status: 201 });
}
