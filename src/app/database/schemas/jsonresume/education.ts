import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/dist/sqlite-core";

export const education = sqliteTable("education", {
  id: cuid2("id").defaultRandom().primaryKey(),
  institution: text("institution"),
  url: text("url"),
  area: text("area"),
  studyType: text("studyType"),
  startDate: integer("startDate", { mode: "timestamp" }),
  endDate: integer("endDate", { mode: "timestamp" }),
  score: text("score"),
  //TODO link single location
  //TODO link multiple courses
});

export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;
