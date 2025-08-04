import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";
import { education } from "@database/schemas/jsonresume/education";
import { course } from "database/schemas/jsonresume/course";

export const education_course = sqliteTable(
  "education_course",
  {
    education: cuid2("education").references(() => education.id),
    course: cuid2("course")
      .references(() => course.id)
      .unique(),
  },
  (table) => [primaryKey({ columns: [table.education, table.course] })]
);
