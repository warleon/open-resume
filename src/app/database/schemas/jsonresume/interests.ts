import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const interest = sqliteTable("interest", {
  name: text("name"),
  // TODO link to user or resume
});

export type Interest = typeof interest.$inferSelect;
export type NewInterest = typeof interest.$inferInsert;
