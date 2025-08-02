import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const skill = sqliteTable("skill", {
  name: text("name"),
  level: text("level"),
  // TODO link to user or resume
});
export type Skill = typeof skill.$inferSelect;
export type NewSkill = typeof skill.$inferInsert;
