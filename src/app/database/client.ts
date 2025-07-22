import { drizzle } from 'drizzle-orm/libsql';
import * as schema from 'database/schemas';

import { env } from "@lib/env"

// Create drizzle instance
export const db = drizzle({
  connection: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  }
});

export { schema }; 