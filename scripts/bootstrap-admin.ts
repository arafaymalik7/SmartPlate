import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "../src/generated/prisma/client";
import { hashPassword, verifyPassword } from "../src/lib/auth/password";
const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const url = process.env.DATABASE_URL;
if (!email || !password || password.startsWith("replace-") || !url)
  throw new Error(
    "Set DATABASE_URL, ADMIN_BOOTSTRAP_EMAIL and a strong unique ADMIN_BOOTSTRAP_PASSWORD before bootstrapping.",
  );
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
const administrator = await prisma.user.upsert({
  where: { email },
  update: {},
  create: { email, passwordHash: hashPassword(password), role: UserRole.ADMIN },
});
if (
  administrator.email !== email ||
  administrator.role !== UserRole.ADMIN ||
  !verifyPassword(password, administrator.passwordHash)
)
  throw new Error("Administrator bootstrap verification failed.");
await prisma.$disconnect();
console.log(
  "Admin bootstrap completed. Remove ADMIN_BOOTSTRAP_PASSWORD from runtime configuration.",
);
