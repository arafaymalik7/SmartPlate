import "dotenv/config";
import { authOptions } from "../src/lib/auth/options";

const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

if (!email || !password)
  throw new Error("Set ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD for authorization verification.");

const provider = authOptions.providers.find((candidate) => candidate.id === "credentials") as
  | (typeof authOptions.providers)[number] & {
      options?: {
        authorize?: (credentials: Record<string, string>, request: Request) => Promise<unknown>;
      };
    }
  | undefined;
const authorize = provider?.options?.authorize;

if (!authorize) throw new Error("Configured credentials authorizer was not found.");

const user = await authorize({ email, password }, new Request("http://localhost"));
if (!user) throw new Error("Configured credentials authorizer rejected the disposable administrator.");

console.log("Configured credentials authorizer accepted the disposable administrator.");
