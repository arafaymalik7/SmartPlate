import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { prisma } = await import("@/lib/db/prisma");
  const [restaurants, items, published, missing, auditEvents] = await Promise.all([
    prisma.restaurant.count(),
    prisma.menuItem.count(),
    prisma.menuItem.count({ where: { status: "PUBLISHED" } }),
    prisma.menuItemNutrition.count({ where: { OR: [{ calories: null }, { sodiumMg: null }] } }),
    prisma.adminAuditLog.count(),
  ]);
  return NextResponse.json({
    restaurants,
    items,
    published,
    itemsWithMissingNutrition: missing,
    auditEvents,
  });
}
