import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const location = sqliteTable("location", {
  address: text("address"),
  postalCode: text("postalCode"),
  city: text("city"),
  countryCode: text("countryCode"),
  region: text("region"),
});

export type Location = typeof location.$inferSelect;
export type NewLocation = typeof location.$inferInsert;
