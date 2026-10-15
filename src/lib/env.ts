import { z } from "zod";

const schema = z.object({ DATABASE_URL: z.string().url(), DIRECT_URL: z.string().url() });
export function getDatabaseEnv() { return schema.parse({ DATABASE_URL: process.env.DATABASE_URL, DIRECT_URL: process.env.DIRECT_URL }); }
