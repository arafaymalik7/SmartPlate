import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth/require-admin";
import { hasTrustedMutationOrigin } from "@/lib/security/request-origin";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { categorySchema, publicationStatusSchema } from "@/lib/validation/admin";

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
  const fullUpdate = categorySchema.safeParse(payload);
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
    return NextResponse.json({ error: "Invalid category input" }, { status: 400 });
  const { id } = await context.params;
  const { prisma } = await import("@/lib/db/prisma");
  const category = await prisma.menuCategory.findUnique({ where: { id } });
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  if (fullData) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: fullData.restaurantId },
    });
    if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
  }
  const updated = await prisma.$transaction(async (transaction) => {
    const record = await transaction.menuCategory.update({
      where: { id },
      data: (statusData ?? fullData)!,
    });
    const actor = await transaction.user.findUnique({ where: { email }, select: { id: true } });
    if (!actor) throw new Error("Authorized administrator was not found.");
    await transaction.adminAuditLog.create({
      data: {
        actorId: actor.id,
        action: statusData ? "CATEGORY_STATUS_CHANGED" : "CATEGORY_UPDATED",
        entityType: "MenuCategory",
        entityId: id,
        metadata: {
          from: category.status,
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
