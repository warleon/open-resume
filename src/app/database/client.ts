import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '@database/schema';


// Create drizzle instance
export const db = drizzle({
  connection: {
    url: process.env.DATABASE_PATH!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  }
});

export { schema }; 