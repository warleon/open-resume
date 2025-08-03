import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";

export const language = sqliteTable("language", {
  id: cuid2("id").defaultRandom().primaryKey(),
  language: text("language"),
  fluency: text("fluency"),
  // TODO link to user or resume
});

export type Language = typeof language.$inferSelect;
export type NewLanguage = typeof language.$inferInsert;
