import { sqliteTable, text } from "drizzle-orm/sqlite-core";

//TODO link to project
export const role = sqliteTable("role", {
  description: text("description"),
});

export type Role = typeof role.$inferSelect;
export type NewRole = typeof role.$inferInsert;
