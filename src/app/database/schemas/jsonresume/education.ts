import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const education = sqliteTable("education", {
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
