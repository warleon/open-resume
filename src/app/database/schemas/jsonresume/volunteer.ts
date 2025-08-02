import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/dist/sqlite-core";

export const volunteer = sqliteTable("volunteer", {
  id: cuid2("id").defaultRandom().primaryKey(),
  organization: text("organization"),
  //TODO link single location
  description: text("description"),
  position: text("position"),
  url: text("url"),
  startDate: integer("startDate", { mode: "timestamp" }),
  endDate: integer("endDate", { mode: "timestamp" }),
  summary: text("summary"),
  //TODO link multiple highlights
});

export type Volunteer = typeof volunteer.$inferSelect;
export type NewVolunteer = typeof volunteer.$inferInsert;
