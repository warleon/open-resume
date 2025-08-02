import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const language = sqliteTable("language", {
  language: text("language"),
  fluency: text("fluency"),
  // TODO link to user or resume
});

export type Language = typeof language.$inferSelect;
export type NewLanguage = typeof language.$inferInsert;
