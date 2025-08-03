import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";

//TODO link with skill
//TODO link with interests
export const keyword = sqliteTable("keyword", {
  id: cuid2("id").defaultRandom().primaryKey(),
  description: text("description"),
});

export type SkillKeyword = typeof keyword.$inferSelect;
export type NewSkillKeyword = typeof keyword.$inferInsert;
