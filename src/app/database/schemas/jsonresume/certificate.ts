import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const certificate = sqliteTable("certificate", {
  name: text("name"),
  date: integer("date", { mode: "timestamp" }),
  url: text("url"),
  issuer: text("issuer"),
  // TODO link to user or resume
});

export type Certificate = typeof certificate.$inferSelect;
export type NewCertificate = typeof certificate.$inferInsert;
