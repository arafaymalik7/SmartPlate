import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "../src/generated/prisma/client";
import { authOptions } from "../src/lib/auth/options";
import { verifyPassword } from "../src/lib/auth/password";

const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;
const url = process.env.DATABASE_URL;

if (!email || !password || !url)
  throw new Error("Set DATABASE_URL, E2E_ADMIN_EMAIL, and E2E_ADMIN_PASSWORD for CI verification.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

try {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.role !== UserRole.ADMIN || !verifyPassword(password, user.passwordHash))
    throw new Error("Disposable administrator bootstrap verification failed.");

  const provider = authOptions.providers.find((candidate) => candidate.id === "credentials");
  if (!provider || provider.type !== "credentials" || !provider.authorize)
    throw new Error("Credentials provider is not configured.");

  const authorized = await provider.authorize({ email, password }, new Request("http://localhost"));
  if (!authorized || authorized.id !== user.id || authorized.email !== user.email)
    throw new Error("Credentials authorization verification failed.");

  console.log("Disposable administrator bootstrap and authorization verified.");
} finally {
  await prisma.$disconnect();
}
