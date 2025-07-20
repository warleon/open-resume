import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const keywords = sqliteTable('keywords', {
  keyword: text('keyword').primaryKey(),
});

export type Keyword = typeof keywords.$inferSelect;
export type NewKeyword = typeof keywords.$inferInsert; 