import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './client';
import path from 'path';

export async function runMigrations() {
  const migrationsFolder = path.join(process.cwd(), 'database', 'migrations');
  
  try {
    await migrate(db, { migrationsFolder });
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Database migration failed:', error);
    throw error;
  }
} 