import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/dist/sqlite-core";

export const highlight = sqliteTable("highlight", {
  id: cuid2("id").defaultRandom().primaryKey(),
  description: text("description"),
});

export type Highlight = typeof highlight.$inferSelect;
export type NewHighlight = typeof highlight.$inferInsert;
