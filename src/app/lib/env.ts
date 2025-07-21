import { z } from "zod";

import { config } from "dotenv";

config({
    debug: true,
    encoding: "utf-8",
});

const envSchema = z.object({
    PUBLIC_URL: z.url("PUBLIC_URL is required"),
    TURSO_AUTH_TOKEN: z.jwt("TURSO_AUTH_TOKEN is required"),
    TURSO_CONNECTION_URL: z.url("TURSO_CONNECTION_URL is required"),
});

const { success, data, error } = envSchema.safeParse(
    {
        PUBLIC_URL: process.env.PUBLIC_URL,
        TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
        TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
    }
);

if (!success) {
    console.error(error);
    throw new Error(`Invalid environment variables: ${error.message}`);
}
export const env = data;
