import { drizzle } from 'drizzle-orm/libsql';
import * as schema from 'database/schemas';

import { env } from "@lib/env"

console.log("DEBUG ANTHONY ENV VARS:", JSON.stringify(env, null, 2))
// Create drizzle instance
export const db = drizzle({
  connection: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  }
});

export { schema }; 