import { z } from "zod";
import { config } from "dotenv";
config({
    debug: true,
});

const envSchema = z.object({
  PUBLIC_URL: z.url("PUBLIC_URL is required"),
  TURSO_AUTH_TOKEN: z.jwt("TURSO_AUTH_TOKEN is required"),
  TURSO_CONNECTION_URL: z.url("TURSO_CONNECTION_URL is required"),
});

export const env = envSchema.parse(process.env);
