import { z } from "zod";

const envSchema = z.object({
  CLIENT_URL: z.string().default("http://localhost:5173"),
  SERVER_URL: z.string().optional(),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PGDATABASE: z.coerce.string().min(1),
  PGHOST: z.coerce.string().min(1),
  PGPASSWORD: z.coerce.string().min(1),
  PGPORT: z.coerce.number().default(5432),
  PGUSER: z.coerce.string().min(1),
  SESSION_SECRET: z.coerce.string().min(1),
  GITHUB_CLIENT_ID: z.coerce.string().min(1),
  GITHUB_CLIENT_SECRET: z.coerce.string().min(1),
});

const parsed = envSchema.parse(process.env);
const { SERVER_URL, ...envVars } = parsed;

export const env = {
  ...envVars,
  SERVER_BASE_URL: SERVER_URL ?? `http://localhost:${parsed.PORT}`,
};
