import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";

export const award = sqliteTable("award", {
  id: cuid2("id").defaultRandom().primaryKey(),
  title: text("title"),
  date: integer("date", { mode: "timestamp" }),
  awarder: text("awarder"),
  summary: text("summary"),
});

export type Award = typeof award.$inferSelect;
export type NewAward = typeof award.$inferInsert;
