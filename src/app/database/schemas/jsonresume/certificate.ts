import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/dist/sqlite-core";

export const certificate = sqliteTable("certificate", {
  id: cuid2("id").defaultRandom().primaryKey(),
  name: text("name"),
  date: integer("date", { mode: "timestamp" }),
  url: text("url"),
  issuer: text("issuer"),
  // TODO link to user or resume
});

export type Certificate = typeof certificate.$inferSelect;
export type NewCertificate = typeof certificate.$inferInsert;
