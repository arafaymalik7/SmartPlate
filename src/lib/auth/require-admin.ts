import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/options";
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.email
    ? null
    : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
