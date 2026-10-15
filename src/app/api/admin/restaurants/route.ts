import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { restaurantSchema } from "@/lib/validation/admin";
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { prisma } = await import("@/lib/db/prisma");
  return NextResponse.json(await prisma.restaurant.findMany({ orderBy: { name: "asc" } }));
}
export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = restaurantSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid restaurant input" }, { status: 400 });
  const { prisma } = await import("@/lib/db/prisma");
  return NextResponse.json(await prisma.restaurant.create({ data: parsed.data }), { status: 201 });
}
