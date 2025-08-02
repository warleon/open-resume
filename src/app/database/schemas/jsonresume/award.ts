import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const award = sqliteTable("award", {
  title: text("title"),
  date: integer("date", { mode: "timestamp" }),
  awarder: text("awarder"),
  summary: text("summary"),
});

export type Award = typeof award.$inferSelect;
export type NewAward = typeof award.$inferInsert;
