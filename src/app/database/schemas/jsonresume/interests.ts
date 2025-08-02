import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/dist/sqlite-core";

export const interest = sqliteTable("interest", {
  id: cuid2("id").defaultRandom().primaryKey(),
  name: text("name"),
  // TODO link to user or resume
});

export type Interest = typeof interest.$inferSelect;
export type NewInterest = typeof interest.$inferInsert;
