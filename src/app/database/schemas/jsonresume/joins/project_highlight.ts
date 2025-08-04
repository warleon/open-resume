import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { cuid2 } from "drizzle-cuid2/sqlite";
import { project } from "@database/schemas/jsonresume/project";
import { highlight } from "@database/schemas/jsonresume/highlight";

export const project_highlight = sqliteTable(
  "project_highlight",
  {
    project: cuid2("project").references(() => project.id),
    highlight: cuid2("highlight")
      .references(() => highlight.id)
      .unique(),
  },
  (table) => [primaryKey({ columns: [table.project, table.highlight] })]
);
