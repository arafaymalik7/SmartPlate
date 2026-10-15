import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/auth/password";
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const { prisma } = await import("@/lib/db/prisma");
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (
          !user ||
          !verifyPassword(credentials.password, user.passwordHash) ||
          user.role !== "ADMIN"
        )
          return null;
        return { id: user.id, email: user.email, name: user.email };
      },
    }),
  ],
  pages: { signIn: "/admin/sign-in" },
};
