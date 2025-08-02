import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/dist/sqlite-core";

//TODO link to project
export const role = sqliteTable("role", {
  id: cuid2("id").defaultRandom().primaryKey(),
  description: text("description"),
});

export type Role = typeof role.$inferSelect;
export type NewRole = typeof role.$inferInsert;
