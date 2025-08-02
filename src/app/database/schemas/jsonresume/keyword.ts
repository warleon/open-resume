import { sqliteTable, text } from "drizzle-orm/sqlite-core";

//TODO link with skill
//TODO link with interests
export const keyword = sqliteTable("keyword", {
  description: text("description"),
});

export type SkillKeyword = typeof keyword.$inferSelect;
export type NewSkillKeyword = typeof keyword.$inferInsert;
