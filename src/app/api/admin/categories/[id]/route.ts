import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth/require-admin";
import { hasTrustedMutationOrigin } from "@/lib/security/request-origin";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { publicationStatusSchema } from "@/lib/validation/admin";

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
  const parsed = publicationStatusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const { id } = await context.params;
  const { prisma } = await import("@/lib/db/prisma");
  const category = await prisma.menuCategory.findUnique({ where: { id } });
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  const updated = await prisma.$transaction(async (transaction) => {
    const record = await transaction.menuCategory.update({ where: { id }, data: parsed.data });
    const actor = await transaction.user.findUnique({ where: { email }, select: { id: true } });
    if (!actor) throw new Error("Authorized administrator was not found.");
    await transaction.adminAuditLog.create({
      data: {
        actorId: actor.id,
        action: "CATEGORY_STATUS_CHANGED",
        entityType: "MenuCategory",
        entityId: id,
        metadata: { from: category.status, to: record.status, slug: record.slug },
      },
    });
    return record;
  });
  return NextResponse.json(updated);
}
