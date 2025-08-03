import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";

export const profile = sqliteTable("profile", {
  id: cuid2("id").defaultRandom().primaryKey(),
  network: text("network"),
  username: text("username"),
  url: text("url"),
});

export type Profile = typeof profile.$inferSelect;
export type NewProfile = typeof profile.$inferInsert;
