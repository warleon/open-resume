import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";

export const location = sqliteTable("location", {
  id: cuid2("id").defaultRandom().primaryKey(),
  address: text("address"),
  postalCode: text("postalCode"),
  city: text("city"),
  countryCode: text("countryCode"),
  region: text("region"),
});

export type Location = typeof location.$inferSelect;
export type NewLocation = typeof location.$inferInsert;
