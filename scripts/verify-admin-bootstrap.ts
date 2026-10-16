import "dotenv/config";
import { UserRole } from "../src/generated/prisma/client";
import { authOptions } from "../src/lib/auth/options";
import { verifyPassword } from "../src/lib/auth/password";
import { prisma } from "../src/lib/db/prisma";

const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;
const url = process.env.DATABASE_URL;

if (!email || !password || !url)
  throw new Error("Set DATABASE_URL, E2E_ADMIN_EMAIL, and E2E_ADMIN_PASSWORD for CI verification.");

try {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== UserRole.ADMIN || !verifyPassword(password, user.passwordHash))
    throw new Error("Disposable administrator bootstrap verification failed.");

  const provider = authOptions.providers.find((candidate) => candidate.id === "credentials") as
    | (typeof authOptions.providers)[number] & {
        options?: {
          authorize?: (credentials: Record<string, string>, request: Request) => Promise<unknown>;
        };
      }
    | undefined;
  // CredentialsProvider keeps the configured callback in `options`; its outer
  // provider shell intentionally has a placeholder authorize function until
  // NextAuth normalizes the provider for a request.
  const authorize = provider?.options?.authorize;
  if (!provider || provider.type !== "credentials" || !authorize)
    throw new Error("Credentials provider is not configured.");

  const authorized = await authorize({ email, password }, new Request("http://localhost"));
  if (!authorized || authorized.id !== user.id || authorized.email !== user.email)
    throw new Error("Credentials authorization verification failed.");

  console.log("Disposable administrator bootstrap and authorization verified.");
} finally {
  await prisma.$disconnect();
}
