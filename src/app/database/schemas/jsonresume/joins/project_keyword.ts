import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";
import { project } from "database/schemas/jsonresume/project";
import { keyword } from "database/schemas/jsonresume/keyword";

export const project_keyword = sqliteTable(
  "project_keyword",
  {
    project: cuid2("project").references(() => project.id),
    keyword: cuid2("keyword").references(() => keyword.id),
  },
  (table) => [primaryKey({ columns: [table.project, table.keyword] })]
);
