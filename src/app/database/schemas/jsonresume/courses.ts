import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const course = sqliteTable("course", {
  description: text("description"),
});

export type Course = typeof course.$inferSelect;
export type NewCourse = typeof course.$inferInsert;
