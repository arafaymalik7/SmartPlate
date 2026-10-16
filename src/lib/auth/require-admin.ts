import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/options";

export async function getAdminEmail() {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

export async function requireAdmin() {
  return (await getAdminEmail())
    ? null
    : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
