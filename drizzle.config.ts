import type { Config } from 'drizzle-kit';
import { env } from '@lib/env';

export default {
  schema: './src/app/database/schema.ts',
  out: './database/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
} satisfies Config; 