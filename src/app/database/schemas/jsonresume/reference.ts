import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/dist/sqlite-core";

export const reference = sqliteTable("reference", {
  id: cuid2("id").defaultRandom().primaryKey(),
  name: text("name"),
  reference: text("reference"),
  // TODO link to user or resume
});

export type Reference = typeof reference.$inferSelect;
export type NewReference = typeof reference.$inferInsert;
