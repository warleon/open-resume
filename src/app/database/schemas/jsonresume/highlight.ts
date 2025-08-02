import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const highlight = sqliteTable("highlight", {
  description: text("description"),
});

export type Highlight = typeof highlight.$inferSelect;
export type NewHighlight = typeof highlight.$inferInsert;
