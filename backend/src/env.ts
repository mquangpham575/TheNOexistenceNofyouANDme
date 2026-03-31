import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().optional().default("4000"),
  FRONTEND_ORIGIN: z.string().optional().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().optional(),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
});

export const env = envSchema.parse(process.env);
