import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";

export const course = sqliteTable("course", {
  id: cuid2("id").defaultRandom().primaryKey(),
  description: text("description"),
});

export type Course = typeof course.$inferSelect;
export type NewCourse = typeof course.$inferInsert;
