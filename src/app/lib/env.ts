import { z } from "zod";

import { config } from "dotenv";

const environment_variables = {}
config({
    debug: true,
    processEnv: environment_variables,
    encoding: "utf-8",
});

const envSchema = z.object({
  PUBLIC_URL: z.url("PUBLIC_URL is required"),
  TURSO_AUTH_TOKEN: z.jwt("TURSO_AUTH_TOKEN is required"),
  TURSO_CONNECTION_URL: z.url("TURSO_CONNECTION_URL is required"),
});

const {success,data,error} = envSchema.safeParse(environment_variables);

if(!success){
    console.error(error);
    throw new Error(`Invalid environment variables: ${error.message}`);
}
export const env = data;
