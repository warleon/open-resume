import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const project = sqliteTable("project", {
  name: text("name"),
  description: text("description"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  url: text("url"),
  entity: text("entity"),
  type: text("type"),
  // TODO link to user or resume
});

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;
