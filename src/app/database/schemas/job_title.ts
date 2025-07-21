import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const job_title = sqliteTable('job_title', {
  job_title: text('job_title').primaryKey(),
});

export type JobTitle = typeof job_title.$inferSelect;
export type NewJobTitle = typeof job_title.$inferInsert; 