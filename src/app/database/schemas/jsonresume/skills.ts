import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";

export const skill = sqliteTable("skill", {
  id: cuid2("id").defaultRandom().primaryKey(),
  name: text("name"),
  level: text("level"),
  // TODO link to user or resume
});
export type Skill = typeof skill.$inferSelect;
export type NewSkill = typeof skill.$inferInsert;
