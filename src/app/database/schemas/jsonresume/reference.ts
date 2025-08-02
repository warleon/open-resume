import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reference = sqliteTable("reference", {
  name: text("name"),
  reference: text("reference"),
  // TODO link to user or resume
});

export type Reference = typeof reference.$inferSelect;
export type NewReference = typeof reference.$inferInsert;
