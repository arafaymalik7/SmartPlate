import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth/require-admin";

export async function GET() {
  const email = await getAdminEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { prisma } = await import("@/lib/db/prisma");
  return NextResponse.json(
    await prisma.adminAuditLog.findMany({
      include: { actor: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  );
}
